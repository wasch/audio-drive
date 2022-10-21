import '../styles/globals.css'

import React, { useEffect } from 'react'

import store from '../redux/store'
import { Provider, useSelector, useDispatch } from 'react-redux'

import { setAudio } from '../redux/slices/audioSlice'
import { setUser } from '../redux/slices/userSlice'
import { setPlaylists } from '../redux/slices/playlistsSlice'

import { db, fbAuth } from '../firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

const AppWrapper = ({ children }) => {

  // Redux
  const dispatch = useDispatch();

  // State
  const user = useSelector((state) => state.user.value);

  // Gets the current user's playlists
  useEffect(() => {
    async function fetchPlaylists() {
      let playlists = [];
      if (user) {           // Check if user is signed in before getting playlists
        const q = query(collection(db, "playlists"), where("user", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          let newPlaylist = doc.data();
          newPlaylist.id = doc.id;
          if (!playlists.some(playlist => playlist.id === newPlaylist.id)) {   // Don't add playlist if it is already being shown
            playlists.push(newPlaylist);
          }
        });
      }
      if (playlists.length > 0) dispatch(setPlaylists(playlists));
    }
    fetchPlaylists();
  }, [user]);

  // Gets the current user's audio
  useEffect(() => {
    async function fetchAudio() {
      let audio = [];
      if (user) {           // Check if user is signed in before getting audio
        const q = query(collection(db, "audio"), where("user", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          let newAudio = doc.data();
          newAudio.id = doc.id;
          if (!audio.some(audio => audio.id === newAudio.id)) {   // Don't add audio if it already exists
            audio.isSelected = false;
            audio.push(newAudio);
          }
        });
      }
      dispatch(setAudio(audio));
    }
    fetchAudio();
  });

  return <>{children}</>;
}

function MyApp({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => page);


  return (
    <Provider store={store}>
      <AppWrapper>
        {getLayout(<Component {...pageProps} />)}
      </AppWrapper>
    </Provider>
  );
}

export default MyApp
