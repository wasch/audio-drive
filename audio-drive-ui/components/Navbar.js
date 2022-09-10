import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { useSession, signIn, signOut } from 'next-auth/react'

const Navbar = () => {

    const { data: session } = useSession();

    return (
        <div className="bg-blue-500 shadow-lg">
            <nav className="md:flex justify-center min-w-fit">
                <div className="md:flex items-center">
                    <Link href="/"><a className="text-3xl pl-5 md:pr-60">Audio Drive</a></Link>
                    <ul className="md:flex md:flex-row items-center ml-auto">
                        <li>
                            <Link href="/queue"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6">Queue</a></Link>
                        </li>
                        <li>
                            <Link href="#"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6">Soundboard</a></Link>
                        </li>
                        <li>
                            <Link href="/upload"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6">Upload</a></Link>
                        </li>
                        <li>
                            <Link href="#"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6">About</a></Link>
                        </li>
                        <li>
                            {!session && <button className="block hover:backdrop-brightness-110 py-4 px-6" onClick={() => signIn()}>Sign in</button>}
                            {session && <button className="block hover:backdrop-brightness-110 py-4 px-6" onClick={() => signOut()}>Sign out {session.user.name}</button>}
                        </li>

                    </ul>
                </div>
            </nav >
        </div >
    )
}

export default Navbar