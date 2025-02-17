import App, { Container } from 'next/app'
import React from 'react'
import { QueryClient, QueryClientProvider, QueryCache } from 'react-query'
import { ThemeProvider } from 'styled-components'

import connect from '../common/connect'
import theme from '../styles/theme'

import { Provider } from 'react-redux'

import '../i18n'

import NextNProgress from '../components/NextNProgress'
const queryCache = new QueryCache()
const queryClient = new QueryClient({ queryCache })
class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props

    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Container>
            <NextNProgress />
            <Provider store={reduxStore}>
              <Component {...pageProps} />
            </Provider>
          </Container>
        </ThemeProvider>
      </QueryClientProvider>
    )
  }
}

export default connect(MyApp)
