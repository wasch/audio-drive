import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import style from '../styles/navbar.module.css'


import { useSession, signIn, signOut } from 'next-auth/react'

const Navbar = () => {

    const { data: session } = useSession();

    return (
        <div>
            <nav className="nav-wrapper blue">
                <div className="container">

                    <div className="logoContainer">
                        <Link href="/"><a className="left brand-logo">Audio Drive</a></Link>
                    </div>
                    <ul>
                        <li className="right">
                            <div className={style.authButton}>
                                {!session && <button className="btn grey darken-4" onClick={() => signIn()}>Sign in</button>}
                                {session && <button className="btn grey darken-4" onClick={() => signOut()}>Sign out {session.user.name}</button>}
                            </div>
                        </li>
                        <div className="right hide-on-med-and-down">
                            <li><Link href="#"><a>Queue</a></Link></li>
                            <li><Link href="#"><a>Soundboard</a></Link></li>
                            <li><Link href="/upload"><a>Upload</a></Link></li>
                            <li><Link href="#"><a>About</a></Link></li>
                        </div>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar