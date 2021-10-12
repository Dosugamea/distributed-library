import { Store } from 'vuex'
import { initializeStores } from '~/store/store-accessor'

const initializer = (store: Store<any>) => initializeStores(store)

export const plugins = [initializer]
export * from '~/store/store-accessor'
