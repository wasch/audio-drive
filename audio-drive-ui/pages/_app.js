import '../styles/globals.css'

import React from 'react'

import Layout from '../components/Layout'

import { SessionProvider } from 'next-auth/react'

import store from '../redux/store'
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps }) {

  const [currentAudio, setCurrentAudio] = React.useState({});

  const retrieveAudio = (audioData) => {
    setCurrentAudio(audioData);
  }

  /* Check for touch device
  const isTouchDevice = () => {
    if ("ontouchstart" in window) {
      return true;
    }
    return false;
  }
  */

  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <Provider store={store}>
        <Layout audio={currentAudio}>
          <Component
            {...pageProps}
            passAudioToApp={retrieveAudio}
          />
        </Layout>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp
