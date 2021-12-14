import type { Auth } from '@nuxtjs/auth-next'
import type { UserState } from '@/types/userState'

export default class GunScheme {
  #auth: Auth
  name: string = 'gun'

  constructor (auth: Auth) {
    this.#auth = auth
  }

  login (
    params: UserState
  ) {
    this.#auth.setUser(params)
  }

  logout () {
    return this.#auth.reset()
  }
}
