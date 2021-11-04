import type { IGunChainReference } from 'gun/types/chain'

/**
 * コンテンツ 基底インターフェイス
 */
interface IDao<T> {
    add(model: T): Promise<string>
    edit(model: T): Promise<void>
    remove(model: T): Promise<boolean>
    find(query: any): Promise<object>
    get(id: string): Promise<object>
    isExist(id: string): Promise<boolean>
}

/**
 * 指定した型のデータが返すものとしてPromiseを生成する
 * (指定した型通りのデータが返ることは保証されないので注意)
 *
 * Gun/lib/Then.jsの代わりの処理 (Thenの型が付属していなかったため)
*/
function shootPromise<T> (gun: IGunChainReference): Promise<T|undefined> {
  return new Promise<T|undefined>((resolve, reject) => {
    try {
      gun.once(function (data) {
        resolve(data as unknown as T|undefined)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export { IDao, shootPromise }
