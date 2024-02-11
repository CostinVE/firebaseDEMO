import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/authentication.js';
import { database, auth, storage } from './config/firebase.js';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage'

function App() {

  // Existing Movie states
  const [movieList, setMovieList] = useState([]);

  //New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState('')
  const [newReleaseDate, setNewReleaseDate] = useState(0)
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false)
   
  //Update title state
  
  const [updatedTitle, setUpdatedTitle] = useState('')

  // File Update State
  const [fileUpload, setFileUpload] = useState(null)

  const moviesCollectionRef = collection(database, "database1");

  useEffect(() => {
    const getMovieList = async () => {
      try {
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map(doc => ({...doc.data(), id: doc.id}));
        console.log(filteredData);
        setMovieList(filteredData)
      } catch (err) {
        console.error(err);
      }
    };

    getMovieList(); 
  }, []); 

    const onSubmitMovie = async () =>{
      try {
       await addDoc(moviesCollectionRef, {title: newMovieTitle,
         releaseDate: newReleaseDate,
          receivedAnOscar: isNewMovieOscar,
          userId: auth?.currentUser?.uid
        })
      } catch (err) {
        console.error(err)
      }
    }

    const deleteMovie = async (id) => {
      const movieDoc = doc(database, "database1", id);
      await deleteDoc(movieDoc);
    };

  const updateMovieTitle = async (id) => {
      const movieDoc = doc(database, "database1", id);
      await updateDoc(movieDoc, {title: updatedTitle});
  };

  const uploadFile = async () => {
    if (!fileUpload) return
    const filesFolderRef = ref(storage,`Files1/${fileUpload.name}`)
    await uploadBytes(filesFolderRef, fileUpload)
  }

  return (
    <div className='App'>
      <Auth/>
      <div>
      <input placeholder='Moviename..' value={newMovieTitle} onChange={(event) => setNewMovieTitle(event.target.value)} />

      <input placeholder='releaseDate?' type='number' onChange={(event) => setNewReleaseDate(event.target.value)} />
        <input type='checkbox' checked={isNewMovieOscar} onChange={(event) => setIsNewMovieOscar(event.target.checked)}/> 
        <label>Received an Oscar</label>
        <button onClick={onSubmitMovie}> Submit Movie </button>
        
        </div>
      <div>{movieList.map((movie) => (<div>
        <h1 style={{backgroundColor: movie.receivedAnOscar ? "yellow" : "red"}}>{movie.title}</h1>
        <p>Date: {movie.releaseDate}</p>
        <button onClick={() => deleteMovie(movie.id)}> Delete Movie</button>

         <input placeholder='newTitle' onChange={(e) => setUpdatedTitle(e.target.value)}/>
         <button onClick={() => updateMovieTitle(movie.id)}> Update Title </button>

        </div> ))}
        <div>
          <input type='file' onChange={(event) => setFileUpload(event.target.files[0])}/>
          <button onClick={uploadFile}>UPload File </button>
        </div>
        </div>
    </div>
  );
}

export default App;

