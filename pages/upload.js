import React from 'react'
import Head from 'next/head'

import Layout from '../components/Layout'
import Uploader from '../components/Uploader'

export default function Upload() {
  return (
    <div className="m-5 grid justify-items-center">
      <div>
        <h3 className="text-3xl mt-20">Drag & Drop or Click to Upload</h3>
      </div>
      <Uploader />
    </div>
  )
}

Upload.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}