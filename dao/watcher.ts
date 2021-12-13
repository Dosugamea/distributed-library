import Vue from 'vue'
import { IDao } from './base'
import { ContentType } from '~/types/base/content'
import type { BibliographyModel } from '@/models/bibliography'
import type { LogModel } from '@/models/base'

type State<T extends ContentType> = {
  elements: T[]
}

const DaoWatcherState = Vue.observable<State<ContentType>>({ elements: [] })

const DaoWatcherMutations = {
  setElements (elements: ContentType[]) {
    DaoWatcherState.elements = elements
  }
}

class DaoWatcherBase<U> {
  protected dao: IDao<any>
  #timer: NodeJS.Timer | null = null

  constructor (dao: IDao<any>) {
    this.dao = dao
    this.#timer = setInterval(() => {
      if (dao != null) {
        this.getElements().then((resp) => {
          DaoWatcherMutations.setElements(resp as unknown as ContentType[])
        })
      }
    }, 500)
  }

  getElements () : Promise<U[]> {
    return new Promise<U[]>((resolve, reject) => {
      try {
        resolve([])
      } catch {
        reject(new Error('Failed to get elements'))
      }
    })
  }

  destroy () {
    if (this.#timer) {
      DaoWatcherMutations.setElements([])
      clearInterval(this.#timer)
    }
  }
}

class DaoWatcher<T extends ContentType> extends DaoWatcherBase<T> {
  getElements () : Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      try {
        resolve(this.dao.list())
      } catch {
        reject(new Error('Failed to get elements'))
      }
    })
  }
}

class DaoLibraryBookWatcher extends DaoWatcherBase<BibliographyModel> {
  getElements (): Promise<BibliographyModel[]> {
    return new Promise<BibliographyModel[]>((resolve, reject) => {
      try {
        if (this.dao.listBookAsBibliography) {
          resolve(this.dao.listBookAsBibliography())
        }
      } catch {
        reject(new Error('Failed to get elements'))
      }
    })
  }
}

class DaoLibraryBookHistoryWatcher extends DaoWatcherBase<LogModel> {
  getElements (): Promise<LogModel[]> {
    return new Promise<LogModel[]>((resolve, reject) => {
      try {
        resolve(this.dao.histories())
      } catch {
        reject(new Error('Failed to get elements'))
      }
    })
  }
}

export { DaoWatcher, DaoWatcherState, DaoLibraryBookWatcher, DaoLibraryBookHistoryWatcher }
