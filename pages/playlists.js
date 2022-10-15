import React from 'react'
import Head from 'next/head'

import Layout from '../components/Layout'
import PlaylistsContainer from '../components/PlaylistsContainer'

export default function Playlists() {
  return (
    <div>
      <Head>
        <title>Your Playlists</title>
      </Head>
      <PlaylistsContainer />
    </div>
  )
}

Playlists.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}