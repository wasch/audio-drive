import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import style from '../styles/navbar.module.css'


import { useSession, signIn, signOut } from 'next-auth/react'

const Navbar = () => {

    const { data: session } = useSession();

    return (
        <div>
            <div className={style.nav_container}>
                <p className={style.logo}>Audio Drive</p>
                <nav>
                    <ul className={style.nav_links}>
                        <li><Link href="/"><a>Home</a></Link></li>
                        <li><Link href="/library"><a>Library</a></Link></li>
                        <li>About</li>
                        <li>
                            {!session && <button onClick={() => signIn()}>Sign in</button>}
                            {session && <button onClick={() => signOut()}>Sign out {session.user.name}</button>}
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Navbar