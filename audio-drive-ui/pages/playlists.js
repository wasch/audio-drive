import React from 'react'
import Head from 'next/head'

import Layout from '../components/Layout'
import PlaylistsContainer from '../components/PlaylistsContainer'

export default function Upload() {
  return (
    <div className="m-5 grid justify-items-center">
      <Head>
        <title>Your Playlists</title>
      </Head>
      <PlaylistsContainer />
    </div>
  )
}

Upload.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}