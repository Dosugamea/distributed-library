// Polyfill for crypto which isn't present globally in jsdom
import { Crypto } from '@peculiar/webcrypto'
// tslint-disable-next-line
global.crypto = new Crypto()

// Polyfill for encoding which isn't present globally in jsdom
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder
}
