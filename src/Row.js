import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  // the function inside the useEffect will run if any of variable changed in dependency list
  // if dependency list is empty, it will run once when component loads.

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // console.log(request.data.results);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  // console.log(movies);
  const handleClick = (movie) => {
    console.log(movie);
    if (trailerUrl) {
      setTrailerUrl('');
    }
    else {
      movieTrailer(movie?.name || movie?.title || movie?.original_title || movie?.original_name)
        .then(url => {
          const urlParams = new URLSearchParams(new URL(url).search);
          // console.log(urlParams);
          setTrailerUrl(urlParams.get('v'));
        }).catch(error => console.log(error));
    }
  }

  const opts = {
    height: "390",
    width: "99%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map(movie => {
          return <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name} />
        })}
      </div>
      <div style={{ padding: "40px" }}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
}

export default Row;
