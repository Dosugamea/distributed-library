const config = {
  ipfs: {
    // for dev purposes, make repo different even if from same ip address.
    repo: `ipfs/broamp-demo/${Math.random()}`,
    EXPERIMENTAL: {
      ipnsPubsub: true
    },
    config: {
      Addresses: {
        Swarm: [
          // Libp2p hosted rendezvous server https://github.com/libp2p/js-libp2p-webrtc-star#hosted-rendezvous-server
          '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
          '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',

          // experimental webrtc
          '/ip4/198.46.197.197/tcp/4001/ipfs/QmdXiwDtfKsfnZ6RwEcovoWsdpyEybmmRpVDXmpm5cpk2s',

          // openbazaar-go signal server https://github.com/OpenBazaar/openbazaar-go/#readme
          '/ip4/107.170.133.32/tcp/4001/ipfs/QmUZRGLhcKXF1JyuaHgKm23LvqcoMYwtb9jmh8CkP4og3K',
          '/ip4/139.59.174.197/tcp/4001/ipfs/QmZfTbnpvPwxCjpCG3CXJ7pfexgkBZ2kgChAiRJrTK1HsM',
          '/ip4/139.59.6.222/tcp/4001/ipfs/QmRDcEDK9gSViAevCHiE6ghkaBCU7rTuQj4BDpmCzRvRYg',
          '/ip4/46.101.198.170/tcp/4001/ipfs/QmePWxsFT9wY3QuukgVDB7XZpqdKhrqJTHTXU7ECLDWJqX',
          '/ip4/198.46.197.197/tcp/4001/ipfs/QmdXiwDtfKsfnZ6RwEcovoWsdpyEybmmRpVDXmpm5cpk2s',
          '/ip4/198.46.197.197/tcp/4002/ipfs/QmWAm7ZPLGTgofLXZgoAzEaNkYFPsaVKKGjWscE4Fbec9P'

          // locally hosted websocket star
          // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
          // local brave browser hosted star
          // '/ip4/127.0.0.1:5001/',

          // config default
          // '/ip4/0.0.0.0/tcp/4002',
          // another config default, however creating ws server in browser is not allowed
          // '/ip4/127.0.0.1/tcp/4003/ws',
        ]
      }
    }
  }
}

module.exports = config
