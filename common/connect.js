import React from 'react'
import initializeStore from '../state/store'
import _ from 'lodash'
import redirectTo from './redirectTo'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState)
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState)
  }
  return window[__NEXT_REDUX_STORE__]
}

export default (App) => {
  return class AppWithRedux extends React.Component {
    static async getInitialProps(appContext) {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = getOrCreateStore()
      let currentUser = _.get(appContext.ctx.req, 'user', {})

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore

      let appProps = {}
      let isAuthenticated = false
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext)
      }

      if (appContext.ctx.req) {
        /*
         * Middleware to verify if user is Auth
         * */

        if (appContext.ctx.pathname === '/public-daily-technical-report') {
          // redirectTo('/public-daily-technical-report', { res: appContext.ctx.res, status: 200 })
          return {
            ...appProps,
          }
        }

        if (_.isFunction(appContext.ctx.req.isAuthenticated)) {
          isAuthenticated = appContext.ctx.req.isAuthenticated()

          if (!appContext.ctx.req.isAuthenticated() && appContext.ctx.pathname !== '/') {
            redirectTo('/', { res: appContext.ctx.res, status: 301 })
          }
        }
      }

      return {
        ...appProps,
        initialReduxState: {
          ...reduxStore.getState(),
          authState: {
            currentUser,
            isAuthenticated,
            isAdmin: _.isEqual(_.get(currentUser, 'roleId', 2), 1),
          },
        },
      }
    }

    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore} />
    }
  }
}
