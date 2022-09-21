import Head from 'next/head'
import style from '../styles/Home.module.css'
import Library from '../components/Library'

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
