import React, { createContext, useState, useEffect } from 'react'

export const GenreContext = createContext([])

export const GenreProvider = ({ children }) => {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOGJmOTQ0YjAzY2QyZjhmZDVmNjM0NzExZDhlZGVjMCIsInN1YiI6IjY0ZWY2NmMxZTBjYTdmMDE0ZjY5YjkwOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wQZ9U1VjAeOU10busQBkSqD8hxJjfvanne3Fzi4SZ74',
      },
    }

    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
      .then((response) => response.json())
      .then((data) => {
        const genres = data.genres
        setGenres(genres)
      })
      .catch((error) => console.error(error))
  }

  return (
    <GenreContext.Provider value={genres}>{children}</GenreContext.Provider>
  )
}

export default GenreProvider
