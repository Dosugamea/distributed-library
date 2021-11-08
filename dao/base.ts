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
        gun.once(function (data, key) {
          console.log(data, key)
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
          if (!keys.includes(key)) {
            return
          }
          if (data != null) {
            resp.push(data as unknown as T)
          }
          if (keys.includes(key)) {
            keys = keys.filter(k => k !== key)
          }
          console.log(keys)
          if (keys.length === 1) {
            resolve(resp)
          }
        })
      } catch (err) {
        reject(err)
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
