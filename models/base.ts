import { ContentType } from '@/types/base/content'
import { LogType } from '@/types/base/log'

/**
 * ログモデル
*/
class LogModel implements LogType {
  readonly id: string
  readonly issuer: string
  readonly action: string
  readonly target: string
  readonly value: string | number
  readonly createdDateUnix: number

  constructor (id: string, issuer: string, action: string, target: string, value: string | number, createdDateUnix: number) {
    this.id = id
    this.issuer = issuer
    this.action = action
    this.target = target
    this.value = value
    this.createdDateUnix = createdDateUnix
  }
}

/**
 * 基底モデル
*/
class ContentModel implements ContentType {
  id: string
  name: string
  createdDateUnix: number
  updatedDateUnix: number
  note: string
  histories: Record<string, LogModel>
  isDeleted: boolean

  constructor (
    id: string,
    name: string,
    createdDateUnix: number,
    updatedDateUnix: number,
    histories: Record<string, LogModel>,
    note: string,
    isDeleted: boolean
  ) {
    this.id = id
    this.name = name
    this.createdDateUnix = createdDateUnix
    this.updatedDateUnix = updatedDateUnix
    this.histories = histories
    this.note = note
    this.isDeleted = isDeleted
  }
}

export { ContentModel, LogModel }
