import React from 'react'
import { Pagination } from 'antd'

import { GenreProvider } from '../GenreContext/GenreContext'
import Header from '../Header'
import BlockMovie from '../BlockMovie'

export const SearchTab = ({
  movies,
  page,
  totalPages,
  genres,
  handleSearch,
  handleRate,
  guestSessionId,
  handlePageChange,
}) => {
  const handleChangePage = (newPage) => {
    handlePageChange(newPage)
  }
  return (
    <GenreProvider genres={genres}>
      <Header onSearch={handleSearch} />
      <ul className="section">
        {movies.map((movie) => {
          const savedRating = localStorage.getItem(`movieRating_${movie.id}`)
          const rating = savedRating ? parseFloat(savedRating) : movie.rating
          return (
            <BlockMovie
              key={movie.id}
              movieId={movie.id}
              poster_path={movie.poster_path}
              original_title={movie.original_title}
              release_date={movie.release_date}
              overview={movie.overview}
              genreIds={movie.genre_ids}
              rating={rating}
              vote_average={movie.vote_average}
              guestSessionId={guestSessionId}
              onRate={handleRate}
            />
          )
        })}
      </ul>
      <Pagination
        current={page}
        total={totalPages}
        onChange={handleChangePage}
      />
    </GenreProvider>
  )
}

export default SearchTab
