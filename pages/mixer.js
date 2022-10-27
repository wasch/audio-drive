import React from 'react'
import Head from 'next/head'

import Layout from '../components/Layout'
import WaveformVisualizer from '../components/mixer/WaveformVisualizer'
import Panner from '../components/mixer/Panner'
import MixerContainer from '../components/mixer/MixerContainer'

export default function Mixer() {
  return (
    <div>
      <Head>
        <title>Mixer</title>
      </Head>
      <MixerContainer />
    </div>
  )
}

Mixer.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}