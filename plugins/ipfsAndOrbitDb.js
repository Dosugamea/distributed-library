import IPFS from 'ipfs-core'
import OrbitDB from 'orbit-db'
import config from '~/ipfs.config.js'

async function ipfsAndOrbitDbPlugin (_, inject) {
  const ipfsInstance = await IPFS.create({ ...config.ipfs })
  inject('ipfs', ipfsInstance)
  inject('orbitdb', await OrbitDB.createInstance(ipfsInstance))
}

export default ipfsAndOrbitDbPlugin
