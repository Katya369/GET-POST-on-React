import React, { useState, useEffect, useCallback } from 'react';
import AddMovie from './components/AddMovie.js';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState(null);
  
  const fetchMoviesHandler = useCallback(async () => {

    setIsLoading(true);
    setError(null);
    try{const response = await fetch('https://my-first-project-in-reac-68f8d-default-rtdb.firebaseio.com/movies.json');
    if (!response.ok) {
      throw new Error ('Something went wrong!'+"Status code = " + response.status);
    }
    const data = await response.json();
   const loadedMovies = [];
   for (const key in data) {
    loadedMovies.push({
      id: key,
      title: data[key].title,
      openingText: data[key].openingText,
      releaseDate: data[key].releaseDate

    })
   }
    // const transformedMovies = data.map(movieData => {
    //   return {
    //     id: movieData.episode_id,
    //     title: movieData.title,
    //     openingText: movieData.opening_crawl,
    //     releaseDate: movieData.release_date
    //   };
    // });
    setMovies(loadedMovies);

    } catch(error) {
setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

async function addMovieHandler(movie) {
  const response = await fetch('https://my-first-project-in-reac-68f8d-default-rtdb.firebaseio.com/movies.json', {
method: 'POST',
body: JSON.stringify(movie),
headers: {
  'Content-Type':'application/json'
}
  });
  const data = await response.json();
  console.log(data);
};
return (
  <React.Fragment>
  <section>
    <AddMovie onAddMovie={addMovieHandler} />
  </section>
    <section>
      <button onClick={fetchMoviesHandler}>Fetch Movies</button>
    </section>
    <section>
      {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
      {!isLoading && !error && movies.length === 0 && <p>Found no movies...</p>}
      {isLoading && <p>Loading...</p>}
      {!isLoading && error && <p>{error}</p>}
    </section>
  </React.Fragment>
);
}

export default App;
