import React from 'react'
import Head from 'next/head'

import Layout from '../components/Layout'
import PlaylistsContainer from '../components/playlist/PlaylistsContainer'

export default function Playlists() {
  return (
    <div>
      <PlaylistsContainer />
    </div>
  )
}

Playlists.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}