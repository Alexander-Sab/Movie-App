import React from 'react'

import { GenreProvider } from '../GenreContext/GenreContext'
import BlockMovie from '../BlockMovie'
import { NO_RATED_MOVIES_MESSAGE } from '../../constants/constants'

import './RatedTab.css'

export const RatedTab = ({ ratedMovies, genres, handleRate }) => {
  if (!ratedMovies || ratedMovies.length === 0) {
    return <p>{NO_RATED_MOVIES_MESSAGE}</p>
  }

  return (
    <GenreProvider genres={genres}>
      <ul className="section">
        {ratedMovies.map((movie) => (
          <BlockMovie
            key={movie.id}
            poster_path={movie.poster_path}
            original_title={movie.original_title}
            release_date={movie.release_date}
            overview={movie.overview}
            rating={movie.rating}
            vote_average={movie.vote_average}
            genreIds={movie.genre_ids}
            onRate={handleRate}
          />
        ))}
      </ul>
    </GenreProvider>
  )
}

export default RatedTab
