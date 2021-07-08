import IPFS from 'ipfs-core'
import OrbitDB from 'orbit-db'
import IdentityProvider from 'orbit-db-identity-provider'
import config from '~/ipfs.config.js'

async function ipfsAndOrbitDbPlugin({ app }, inject) {
  const ipfsInstance = await IPFS.create({ ...config.ipfs })
  const options = { id: 'local-id' }
  const identity = await IdentityProvider.createIdentity(options)
  inject('ipfs', ipfsInstance)
  inject('orbitdb', new OrbitDB(ipfsInstance, { identify: identity }))
}

export default ipfsAndOrbitDbPlugin
