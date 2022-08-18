import '../styles/globals.css'
import 'materialize-css/dist/css/materialize.min.css'

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
