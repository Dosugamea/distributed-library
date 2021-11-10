import type { IGunChainReference } from 'gun/types/chain'

/**
 * コンテンツ 基底インターフェイス
 */
interface IDao<T> {
  add(model: T): Promise<boolean>
  edit(model: T): Promise<boolean>
  remove(model: T): Promise<boolean>
  find(query: any): Promise<object|undefined>
  get(id: string): Promise<object>
  isExist(id: string): Promise<boolean>
}

class IDaoUtils {
  /**
   * 指定した型のデータが返すものとしてPromiseを生成する
   * (指定した型通りのデータが返ることは保証されないので注意)
   *
   * Gun/lib/Then.jsの代わりの処理 (Thenの型が付属していなかったため)
  */
  shootPromise<T> (gun: IGunChainReference): Promise<T|undefined> {
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
  shootPromiseMultiple<T> (gun: IGunChainReference, keys: string[]): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      if (keys.length === 0) {
        resolve([])
      }
      const resp: T[] = []
      try {
        gun.once(function (data, key) {
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

  allKeys (gun: IGunChainReference): Promise<string[]> {
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

  protected async __count (gun: IGunChainReference): Promise<number> {
    const keys = await this.allKeys(gun)
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
}

export { IDao, IDaoUtils }
