import '../styles/globals.css'
import 'materialize-css/dist/css/materialize.min.css'

import React from 'react'

import Layout from '../components/Layout'

import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps }) {

  const [currentAudio, setCurrentAudio] = React.useState({});

  const retrieveAudio = (audioData) => {
    setCurrentAudio(audioData);
  }

  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <Layout audio={currentAudio}>
        <Component 
        {...pageProps} 
        passAudioToApp={retrieveAudio}
        />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp
