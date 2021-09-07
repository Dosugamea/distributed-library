import type OrbitDB from 'orbit-db'

/**
 * コンテンツ 基底インターフェイス
 */
export interface ContentDaoInterface<T> {
    build(orbitdb: OrbitDB, databaseAddress: string | null, historyDatabaseAddress: string | null): void
    create(...args: any[]): T
    getAddress(): string
    getHistoryAddress(): string
    convertToModel(model: Object, issuer: string): T
    add(model: T): Promise<string>
    edit(model: T): Promise<void>
    remove(model: T): void
    find(query: any): object[]
    get(id: string): object
    isExist(id: string): boolean
}
