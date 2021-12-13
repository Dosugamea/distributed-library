import type { IGunChainReference } from 'gun/types/chain'
import { getDiff } from 'recursive-diff'
import shortUUID from 'short-uuid'
import { ContentType } from '@/types/base/content'
import { LogModel } from '@/models/base'
import { BibliographyModel } from '@/models/bibliography'

/**
 * コンテンツ 基底インターフェイス
 */
 interface IDao<T> {
  createModel?(...params: any): T
  createModelAsync?(...params: any): Promise<T>
  add(model: T, ...params: any): Promise<boolean>
  edit(model: T): Promise<boolean>
  remove(model: T): Promise<boolean>
  list(): T[]
  listBookAsBibliography?(): BibliographyModel[]
  find(query: any): T[]
  count(): number
  get(id: string): Promise<T>
  isExist(id: string): Promise<boolean>
  histories(): LogModel[]
}

class IDaoUtil {
  /**
   * 指定した型のデータが返すものとしてPromiseを生成する
   * (指定した型通りのデータが返ることは保証されないので注意)
   *
   * Gun/lib/Then.jsの代わりの処理 (Thenの型が付属していなかったため)
  */
  protected __shootPromise<T> (gun: IGunChainReference): Promise<T|undefined> {
    return new Promise<T|undefined>((resolve, reject) => {
      try {
        gun.once(function (data, _) {
          resolve(data as unknown as T|undefined)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * 指定した型のデータ複数を返すものとしてPromiseを生成する
   * (指定した型通りのデータが返ることは保証されないので注意)
   * この関数は Findと同時には動かない(フィルタされた結果が何個になるか取得する術がない)
   *
   * Referenced: https://github.com/amark/gun/issues/565
  */
  protected __shootPromiseMultiple<T> (gun: IGunChainReference, keys: string[]): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      if (keys.length === 0) {
        resolve([])
      }
      const resp: T[] = []
      try {
        gun.once(function (data, key) {
          console.log(keys.length)
          // ループ中に追加された要素は除外
          if (!keys.includes(key)) {
            return
          }
          // 要素が消えている可能性がある
          if (data != null) {
            // 削除されていなければ返す
            if (!data.isDeleted) {
              resp.push(data as unknown as T)
            }
          }
          // カウンターを減らす
          if (keys.includes(key)) {
            keys = keys.filter(k => k !== key)
          }
          // 要素が揃ったらresolve
          if (keys.length === 0) {
            resolve(resp)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  protected __keys (gun: IGunChainReference): Promise<string[]> {
    // This function gets every keys includes the values are deleted.
    return new Promise<string[]>((resolve, reject) => {
      try {
        gun.once(
          function (list) {
            if (list !== undefined) {
              const keys = Object.keys(list).filter(key => key !== '_')
              resolve(keys)
            } else {
              reject(new Error('Failed to get keys'))
            }
          }
        )
      } catch (e) {
        reject(e)
      }
    })
  }

  protected async __deepCount (gun: IGunChainReference): Promise<number> {
    const keys = await this.__keys(gun)
    let loopCount = keys.length
    let objCount = 0
    return new Promise<number>((resolve, reject) => {
      try {
        gun.once().map().get('isDeleted').once(
          function (value : any) {
            if (value !== true) {
              objCount += 1
            }
            loopCount -= 1
            if (loopCount <= 0) {
              resolve(objCount)
            }
          }
        )
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * 現在時刻をUnixTimeで返す
  */
  getCurrentUnixTime (): number {
    return Math.floor(Date.now() / 1000)
  }

  /**
   * 適当なIDを生成する
   */
  getNewId (): string {
    return shortUUID().generate().toString()
  }
}

class IDaoBase<T extends ContentType> extends IDaoUtil {
  #objName = ''
  #issuer = ''
  #gun: IGunChainReference
  #elements: ContentType[] = []
  #histories: LogModel[] = []

  constructor (gun: IGunChainReference, objName: string, issuer: string) {
    super()
    this.#gun = gun
    this.#objName = objName
    this.#issuer = issuer
    const me = this
    // @ts-ignore
    this.#gun.map().on(function (data: ContentType, key: string) {
      if (data.id) {
        me.#elements = me.#elements.filter(data => data.id !== key)
        if (!data.isDeleted) {
          me.#elements.push(data)
        }
      }
    })
    // @ts-ignore
    this.#gun.get('histories').map().on(function (data: LogModel, key: string) {
      if (data.id) {
        me.#histories = me.#histories.filter(data => data.id !== key)
        me.#histories.push(data)
      }
    })
  }

  protected async __add (model: T): Promise<boolean> {
    const isExist = await this.__isExist(model.id)
    if (isExist) {
      throw new Error(`${this.#objName} ${model.id} already exist`)
    }
    return new Promise<boolean>((resolve, reject) => {
      const modelRef = this.#gun.get(model.id)
      const me = this
      try {
        // Put callback is not working for me
        modelRef.put(model)
        try {
          me.addHistory('add', me.#objName, model.id, modelRef).then(function () {
            resolve(true)
          })
        } catch (err) {
          reject(new Error(`Failed to add ${me.#objName}: ${err}`))
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  protected async __edit (model: T): Promise<boolean> {
    const existedModel = await this.__get(model.id)
    const diff = getDiff(existedModel, model)
    return new Promise<boolean>((resolve, reject) => {
      const me = this
      const modelRef = this.#gun.get(model.id)
      try {
        modelRef.put(model)
        me.addHistory('edit', me.#objName, String(diff), modelRef).then(function () {
          resolve(true)
        })
      } catch (e) {
        reject(new Error(`Failed to edit ${this.#objName}: ${e}`))
      }
    })
  }

  protected __editBoolean (modelRef: IGunChainReference<boolean, any, any>, value: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const me = this
      try {
        // @ts-ignore
        modelRef.put(value)
        // @ts-ignore
        me.addHistory('edit', me.#objName, String(value), modelRef).then(function () {
          resolve(true)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  protected async __remove (model: T): Promise<boolean> {
    if (!model.id) {
      throw new Error(`Bad ${this.#objName} : id was not existed`)
    }
    const isExist = await this.__isExist(model.id)
    if (!isExist) {
      throw new Error(`${this.#objName} ${model.id} doesn't exist`)
    }
    return new Promise<boolean>((resolve, reject) => {
      const me = this
      const modelRef = this.#gun.get(model.id)
      try {
        // @ts-ignore
        this.#gun.get(model.id).get('isDeleted').put(true)
        me.addHistory('delete', me.#objName, '', modelRef).then(function () {
          resolve(true)
        })
      } catch (e) {
        reject(new Error(`Failed to remove ${this.#objName}: ${e}`))
      }
    })
  }

  protected async __get (id: string): Promise<T> {
    const model = await this.__shootPromise<T>(this.#gun.get(id))
    if (model === undefined) {
      throw new Error(`${this.#objName} ${id} doesn't exist`)
    }
    return model
  }

  protected async __isExist (id: string): Promise<boolean> {
    // Trying get means isExist
    const isDefined = await this.__shootPromise<T>(this.#gun.get(id))
    return isDefined !== undefined
  }

  protected __list (): T[] {
    return this.#elements as T[]
  }

  protected __count (): number {
    return this.#elements.length
  }

  protected __find (query: (model: T) => boolean): T[] {
    return this.#elements.filter(query as any) as T[]
  }

  protected __histories (): LogModel[] {
    return this.#histories
  }

  private addHistory (
    action: string,
    target: string,
    value: string,
    ref: IGunChainReference
  ): Promise<boolean> {
    const logTime = this.getCurrentUnixTime()
    const log = new LogModel(
      this.getNewId(), this.#issuer, action, target, value, logTime
    )
    const me = this
    return new Promise<boolean>((resolve, reject) => {
      try {
        ref.get('histories').get(log.id).put(log)
        resolve(true)
      } catch (e) {
        reject(new Error(`Failed to add ${me.#objName} history: ${e}`))
      }
    })
  }
}

export { IDao, IDaoBase, IDaoUtil }
