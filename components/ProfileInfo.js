import { doc, getDoc } from 'firebase/firestore';
import { React, useEffect, useState } from 'react';
import { useSelector } from 'react-redux'

import { db, fbAuth } from '../firebase'

const ProfileInfo = () => {

  // Redux
  const user = useSelector((state) => state.user.value);

  // State
  const [capacityUsed, setCapacityUsed] = useState(0);

  const signOutUser = () => {
    fbAuth.signOut();
  }

  useEffect(() => {
    async function setCapacity() {
      const docRef = doc(db, "capacity", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCapacityUsed(docSnap.data().capacity);
      }
    }
    setCapacity();
  }, [])

  return (
    <div className="flex flex-col items-center bg-[#2c2c31] p-5 rounded-md shadow-md">
      <div className="flex flex-row justify-between w-full items-center">
        <p className="text-2xl mr-auto self-end">Your Info</p>
        <button onClick={signOutUser} className="px-5 py-3 mb-2 bg-blue-700 rounded-md shadow-md self-end hover:scale-105 hover:brightness-125 transition ease-in-out">Sign Out</button>
      </div>
      <hr className="w-full my-4 border-2 border-zinc-700 rounded-md shadow-md" />
      <div className="flex flex-col gap-y-3 justify-between w-full">
        <div className="flex flex-row justify-between w-full">
          <p className="flex">Email</p>
          <p className="flex">{user ? user.email : ""}</p>
        </div>
        <div className="flex flex-row justify-between w-full">
          <p className="flex">Capacity Used</p>
          <p className="flex">{user ? capacityUsed.toFixed(2) + " of " + process.env.NEXT_PUBLIC_MB_STORAGE_LIMIT + " MB" : ""}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo