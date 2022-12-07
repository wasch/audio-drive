import React from 'react'
import { useSelector } from 'react-redux'

import { fbAuth } from '../firebase'

const ProfileInfo = () => {

  const user = useSelector((state) => state.user.value);

  const signOutUser = () => {
    fbAuth.signOut();
  }

  return (
    <div className="flex flex-col items-center bg-[#2c2c31] p-5 rounded-md shadow-md">
      <div className="flex flex-row justify-between w-full items-center">
        <p className="text-2xl mr-auto self-end">Your Info</p>
        <button onClick={signOutUser} className="px-5 py-3 mb-2 bg-blue-700 rounded-md shadow-md self-end hover:scale-105 hover:brightness-125 transition ease-in-out">Sign Out</button>
      </div>
      <hr className="w-full mt-3 mb-5 border-2 border-zinc-700 rounded-md shadow-md" />
      <div className="flex flex-row justify-between w-full">
        <p className="flex">Email</p>
        <p className="flex">{user ? user.email : ""}</p>
      </div>
    </div>
  )
}

export default ProfileInfo