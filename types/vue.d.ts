import { IGunChainReference } from 'gun/types/chain'

declare module 'vue/types/vue' {
  interface Vue {
    $db: IGunChainReference
  }
}
