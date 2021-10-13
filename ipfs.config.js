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
          '/ip4/127.0.0.1/tcp/13579/wss/p2p-webrtc-star'

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
