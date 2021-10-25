import type GUN from 'gun'

declare module 'vue/types/vue' {
  interface Vue {
    $db: typeof GUN
  }
}
