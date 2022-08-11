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
                    <Link href="/"><a className="brand-logo">Audio Drive</a></Link>
                    <ul className="right hide-on-med-and-down">
                        <li><Link href="/"><a>Home</a></Link></li>
                        <li><Link href="/library"><a>Library</a></Link></li>
                        <li>About</li>
                        <li>
                            {!session && <button className="btn" onClick={() => signIn()}>Sign in</button>}
                            {session && <button className="btn blue" onClick={() => signOut()}>Sign out {session.user.name}</button>}
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar