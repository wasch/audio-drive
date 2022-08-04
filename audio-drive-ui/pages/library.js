import React from 'react'
import Head from 'next/head'

import Upload from '../components/Upload'

const library = () => {
  return (
    <div>
        <Head>
            <title>Your Library</title>
        </Head>
        <h1>Your Library</h1>
        <Upload />
    </div>
  )
}

export default library