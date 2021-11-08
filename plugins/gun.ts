import GUN from 'gun'
import type { AppState } from '~/types/appState'
import { BibliographyDao } from '@/dao/bibliography'

function gunPlugin (_: any, inject: any) {
  const gunInstance = new GUN<AppState>(['http://localhost:8765/gun'])
  const bibliographyDao = new BibliographyDao(gunInstance, 'identity-temp')
  inject('db', gunInstance)
  inject('bibliographyDao', bibliographyDao)
}

export default gunPlugin
