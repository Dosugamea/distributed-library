import GUN from 'gun'

function gunPlugin (_, inject) {
  const gunInstance = GUN()
  inject('db', gunInstance)
}

export default gunPlugin
