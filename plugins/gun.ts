import GUN from 'gun'

function gunPlugin (_: any, inject: any) {
  const gunInstance = new GUN(['http://localhost:8765/gun'])
  inject('db', gunInstance)
}

export default gunPlugin
