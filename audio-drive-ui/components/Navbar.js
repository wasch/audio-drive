import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/slices/userSlice'

import { fbAuth } from '../firebase'

const Navbar = () => {

    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    // Sets up the mobile menu button
    useEffect(() => {
        const btn = document.querySelector("button.mobile-menu-button");
        const menu = document.querySelector(".mobile-menu");

        btn.addEventListener("click", () => {
            menu.classList.toggle("hidden");
        });

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
                <Link href="/"><a className="text-3xl pl-5 md:pr-60">Audio Drive</a></Link>
                <button type="button" className="md:hidden ml-auto p-2 text-sm rounded-lg hover:backdrop-brightness-110 mobile-menu-button" aria-controls="navbar-default" aria-expanded="false">
                    <svg className="w-8 h-8" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path></svg>
                </button>
                <div className="hidden md:flex items-center" id="navbar-default">
                    <ul className="flex flex-row items-center ml-auto">
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
                            {!user && <Link href="/auth"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6">Sign in</a></Link>}
                            {user && <Link href="/auth"><a className="block hover:backdrop-brightness-110 text-lg py-4 px-6" onClick={ signOutUser }>Sign out {user.email}</a></Link>}
                        </li>

                    </ul>
                </div>
            </nav >
            <div className="hidden bg-slate-600 mobile-menu">
                <ul>
                    <li>
                        <Link href="/queue"><a className="block hover:backdrop-brightness-110 text-lg py-3 px-5">Queue</a></Link>
                    </li>
                    <li>
                        <Link href="#"><a className="block hover:backdrop-brightness-110 text-lg py-3 px-5">Soundboard</a></Link>
                    </li>
                    <li>
                        <Link href="/upload"><a className="block hover:backdrop-brightness-110 text-lg py-3 px-5">Upload</a></Link>
                    </li>
                    <li>
                        <Link href="#"><a className="block hover:backdrop-brightness-110 text-lg py-3 px-5">About</a></Link>
                    </li>
                    <li>
                        {!user && <Link href="/auth"><a className="block w-full mr-auto hover:backdrop-brightness-110 text-lg py-3 px-5">Sign in</a></Link>}
                        {user && <Link href="/auth"><a className="block w-full justify-end hover:backdrop-brightness-110 text-lg py-3 px-5" onClick={ signOutUser }>Sign out {user.email}</a></Link>}
                    </li>
                </ul>
            </div>
        </div >
    )
}

export default Navbar