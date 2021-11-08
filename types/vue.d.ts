import { IGunChainReference } from 'gun/types/chain'
import { AppState } from '~/types/appState'
import type { BibliographyDao } from '@/dao/bibliography'

declare module 'vue/types/vue' {
  interface Vue {
    $db: IGunChainReference<AppState>
    $bibliographyDao: BibliographyDao
  }
}
