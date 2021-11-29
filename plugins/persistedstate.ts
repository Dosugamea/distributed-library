import createPersistedState from 'vuex-persistedstate'

// @ts-ignore
export default ({ store }) => {
  createPersistedState({
    key: 'distributed-library'
  })(store)
}
