import App, { Container } from 'next/app';
import React from 'react';
import connect from '../common/connect';
import { Provider } from 'react-redux';


import '../i18n';

import NextNProgress from '../components/NextNProgress';

class MyApp extends App {
  render () {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Container>
        <NextNProgress />
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

export default connect(MyApp)