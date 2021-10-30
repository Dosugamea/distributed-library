import GUN from 'gun'
import type { AppState } from '~/types/appState'

function gunPlugin (_: any, inject: any) {
  const gunInstance = new GUN<AppState>(['http://localhost:8765/gun'])
  inject('db', gunInstance)
}

export default gunPlugin
