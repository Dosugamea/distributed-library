import { MasterDao } from '@/dao/master'

function gunPlugin (_: any, inject: any) {
  inject('db', new MasterDao())
}

export default gunPlugin
