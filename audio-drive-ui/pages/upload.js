import React from 'react'
import Head from 'next/head'

import Upload from '../components/Upload'
import style from '../styles/upload.module.css'

const upload = () => {
  return (
    <div>
        <Head>
            <title>Upload Files</title>
        </Head>
        <h3 className={style.title}>Drag & Drop or Click to Upload</h3>
        <Upload />
    </div>
  )
}

export default upload