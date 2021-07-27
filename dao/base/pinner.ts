import axios from 'axios'

export default class Pinner {
  url: string

  constructor (url: string) {
    this.url = url
  }

  postAddressToPinner (db: string): Promise<any> {
    return axios.post(`${this.url}/pin`, { db })
  }
}
