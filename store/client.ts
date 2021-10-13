import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'client',
  stateFactory: true,
  namespaced: true
})
export default class Client extends VuexModule {
  private libraryDatabase: string = '';
  private libraryHistoryDatabase: string = '';
  private libraryBookDatabase: string = '';
  private libraryBookHistoryDatabase: string = '';

  @Mutation
  public setGenesisLibrary (dbAndHistoryDb: Array<string>): void {
    this.libraryDatabase = dbAndHistoryDb[0]
    this.libraryHistoryDatabase = dbAndHistoryDb[1]
  }

  @Mutation
  public setLibraryBooks (dbAndHistoryDb: Array<string>) {
    this.libraryBookDatabase = dbAndHistoryDb[0]
    this.libraryBookHistoryDatabase = dbAndHistoryDb[1]
  }

  public get genesisLibraryInfo () : Array<string> {
    return [this.libraryDatabase, this.libraryHistoryDatabase]
  }

  public get libraryBookInfo () : Array<string> {
    return [this.libraryBookDatabase, this.libraryBookHistoryDatabase]
  }
}
