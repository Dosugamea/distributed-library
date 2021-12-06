import Vue from 'vue'
import { IDao } from './base'
import { ContentType } from '~/types/base/content'

type State<T extends ContentType> = {
  elements: T[]
}

const DaoWatcherState = Vue.observable<State<ContentType>>({ elements: [] })

const DaoWatcherMutations = {
  setElements (elements: ContentType[]) {
    DaoWatcherState.elements = elements
  }
}

class DaoWatcher<T extends ContentType> {
  #timer : NodeJS.Timer | null = null

  constructor (dao: IDao<T>) {
    this.#timer = setInterval(() => {
      if (dao != null) {
        DaoWatcherMutations.setElements(dao.list())
      }
    }, 500)
  }

  destroy () {
    if (this.#timer) {
      DaoWatcherMutations.setElements([])
      clearInterval(this.#timer)
    }
  }
}

export { DaoWatcher, DaoWatcherState }
