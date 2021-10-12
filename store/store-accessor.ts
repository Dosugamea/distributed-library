import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import client from '~/store/client'

// eslint-disable-next-line
let clientStore: client

function initializeStores (store: Store<any>): void {
  clientStore = getModule(client, store)
}

export { initializeStores, clientStore }
