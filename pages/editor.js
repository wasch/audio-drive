import React from 'react'
import Head from 'next/head'

import Layout from '../components/Layout'
import WaveformVisualizer from '../components/WaveformVisualizer'

export default function Editor() {
  return (
    <div>
      <Head>
        <title>Editor</title>
      </Head>
      <WaveformVisualizer />
    </div>
  )
}

Editor.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}