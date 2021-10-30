
/**
 * コンテンツ 基底インターフェイス
 */
interface IDao<T> {
    createModel(...args: any[]): T
    add(model: T): Promise<string>
    edit(model: T): Promise<void>
    remove(model: T): void
    find(query: any): object[]
    get(id: string): object
    isExist(id: string): boolean
}

export { IDao }
