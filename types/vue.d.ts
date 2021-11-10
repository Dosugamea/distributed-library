import type { MasterDao } from '@/dao/master'

declare module 'vue/types/vue' {
  interface Vue {
    $db: MasterDao
  }
}
