import React from 'react'
import Head from 'next/head'

import Upload from '../components/Upload'

const upload = () => {
  return (
    <div className="m-5 grid justify-items-center">
      <Head>
        <title>Upload Files</title>
      </Head>
      <div>
        <h3 className="text-3xl mt-20">Drag & Drop or Click to Upload</h3>
      </div>
      <Upload />
    </div>
  )
}

export default upload