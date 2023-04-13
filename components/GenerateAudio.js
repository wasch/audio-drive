import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React from 'react'
import { db } from '../firebase';
import { useSelector } from 'react-redux'

const GenerateAudio = () => {

    // Redux
    const user = useSelector((state) => state.user.value);

    const handleClick = async () => {
        const getTracks = await fetch("https://api.napster.com/v2.2/tracks/top?limit=5&previews=5&apikey=" + process.env.NEXT_PUBLIC_NAPSTER_API_KEY);
        const tracks = await getTracks.json();
        const track = tracks.tracks[0].previewURL;
        const audio = await fetch(track, {
            credentials: 'include'
        });
    }

    // Checks if the user will exceed their storage limit by uploading the file
    async function checkForStorageExceeded(file) {
        const docRef = doc(db, "capacity", user.uid);
        const docSnap = await getDoc(docRef);

        const MBFileSize = file.size / 1000000;
        console.log("Current file size: " + MBFileSize);
        if (docSnap.exists()) {
            const currentCapacity = docSnap.data().capacity;
            console.log("Current capacity: " + currentCapacity);
            if (MBFileSize + currentCapacity > process.env.NEXT_PUBLIC_MB_STORAGE_LIMIT) { // If adding the audio would exceed the per user storage limit (200MB)
                return true;
            } 
            /*
            else {
                await updateDoc(docRef, {
                    capacity: MBFileSize + currentCapacity,
                });
            }
            */
        } else {
            console.log("No files have been uploaded, setting up capacity");
            const capacityRef = collection(db, "capacity");
            await setDoc(doc(capacityRef, user.uid), {
                capacity: MBFileSize,
            });
        }
        return false;
    }

    return (
        <div>
            <button onClick={handleClick} className="px-4 py-2 bg-slate-600 rounded-md shadow-md transition ease-in-out hover:brightness-110">Generate</button>
        </div>
    )
}

export default GenerateAudio