import '../styles/globals.css'

import React from 'react'

import Layout from '../components/Layout'

import store from '../redux/store'
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps, ...rest }) {

  return (
    <Provider store={store}>
      <Layout>
        <Component
          {...pageProps}
        />
      </Layout>
    </Provider>
  );
}

export default MyApp
