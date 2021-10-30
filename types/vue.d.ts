import { IGunChainReference } from 'gun/types/chain'
import { AppState } from '~/types/appState'

declare module 'vue/types/vue' {
  interface Vue {
    $db: IGunChainReference<AppState>
  }
}
