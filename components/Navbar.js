import React, { useEffect } from 'react'
import Link from 'next/link'

import { useSelector } from 'react-redux'

import { fbAuth } from '../firebase'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/slices/userSlice'
import { useState } from 'react'

const Navbar = () => {

    // Redux
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);

    // State
    const [mobileMenu, setMobileMenu] = useState(false);

    useEffect(() => {
        const btn = document.querySelector("button.mobile-menu-button");
        const menu = document.querySelector(".mobile-menu");

        // Sets the current user
        fbAuth.onAuthStateChanged((user) => {
            if (user) {
                dispatch(setUser({
                    uid: user.uid,
                    email: user.email
                }));
            } else { // Redirect user to sign in page if no user is signed in
                dispatch(setUser(null));
                document.location.href = "/auth";
            }
        });
    }, []);

    const signOutUser = () => {
        fbAuth.signOut();
    }

    return (
        <div className="bg-slate-600 shadow-lg">
            <nav className="flex items-center justify-center min-w-fit">
                <div onClick={() => setMobileMenu(false)}>
                    <Link href="/"><a className="text-3xl pl-5 w-full md:max-w-md">Audio Drive</a></Link>
                </div>
                <button type="button" onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden ml-auto p-2 text-sm rounded-lg hover:backdrop-brightness-110 mobile-menu-button" aria-controls="navbar-default" aria-expanded="false">
                    <svg className="w-8 h-8" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path></svg>
                </button>
                <div className="hidden md:flex items-center" id="navbar-default">
                    <ul className="flex flex-row items-center ml-auto">
                        <li>
                            <Link href="/playlists"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6">Playlists</a></Link>
                        </li>
                        <li>
                            <Link href="/queue"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6">Queue</a></Link>
                        </li>
                        <li>
                            <Link href="/mixer"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6">Mixer</a></Link>
                        </li>
                        <li>
                            <Link href="/upload"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6">Upload</a></Link>
                        </li>
                        <li>
                            <Link href="#"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6">About</a></Link>
                        </li>
                        <li>
                            {!user && <Link href="/auth"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6">Sign in</a></Link>}
                            {user && <Link href="/auth"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6" onClick={signOutUser}>Sign out {user.email}</a></Link>}
                        </li>

                    </ul>
                </div>
            </nav >
            <div className={`bg-slate-600 mobile-menu ${!mobileMenu ? "hidden" : ""}`}>
                <ul onClick={() => setMobileMenu(!mobileMenu)}>
                    <li>
                        <Link href="/playlists"><a className="block hover:backdrop-brightness-110 text-lg py-3 px-5">Playlists</a></Link>
                    </li>
                    <li>
                        <Link href="/queue"><a className="block hover:backdrop-brightness-110 text-lg py-3 px-5">Queue</a></Link>
                    </li>
                    <li>
                        <Link href="/mixer"><a className="block hover:backdrop-brightness-110 text-lg py-3 px-5">Mixer</a></Link>
                    </li>
                    <li>
                        <Link href="/upload"><a className="block hover:backdrop-brightness-110 text-lg py-3 px-5">Upload</a></Link>
                    </li>
                    <li>
                        <Link href="#"><a className="block hover:backdrop-brightness-110 text-lg py-3 px-5">About</a></Link>
                    </li>
                    <li>
                        {!user && <Link href="/auth"><a className="block w-full mr-auto hover:backdrop-brightness-110 text-lg py-3 px-5">Sign in</a></Link>}
                        {user && <Link href="/auth"><a className="block w-full justify-end hover:backdrop-brightness-110 text-lg py-3 px-5" onClick={signOutUser}>Sign out {user.email}</a></Link>}
                    </li>
                </ul>
            </div>
        </div >
    )
}

export default Navbar