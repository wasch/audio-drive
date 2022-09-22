import Head from 'next/head'
import style from '../styles/Home.module.css'
import Library from '../components/Library'

import Layout from '../components/Layout'

export default function Home() {
  
  return (
    <div className={style.container}>
      <Head>
        <title>Audio Drive</title>
        <meta name="Audio Drive" content="music, entertainment" />
      </Head>

      <Library />

    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}