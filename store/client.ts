import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'client',
  stateFactory: true,
  namespaced: true
})
export default class Client extends VuexModule {
  private test: string = '';

  @Mutation
  public setTest (test: string) {
    this.test = test
  }

  public get getTest () {
    return this.test
  }
}
