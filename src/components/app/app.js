import React, { Component } from 'react'
import { Pagination, Button } from 'antd'
import { Offline, Online } from 'react-detect-offline'

import { GenreProvider } from '../GenreContext/GenreContext'
import Header from '../Header'
import MovieServices from '../../services/MovieServices'
import BlockMovie from '../BlockMovie'

import './app.css'

export class App extends Component {
  state = {
    movies: [],
    searchValue: '',
    page: 1,
    totalPages: 0,
    activeTab: 'search',
    genres: [],
    guestSessionId: null,
    ratedMovies: [], // Добавлено поле ratedMovies в состояние
  }

  async componentDidMount() {
    await this.loadGenres()
    this.searchMovies()
    this.createGuestSession()
  }

  loadGenres = async () => {
    try {
      const genres = await MovieServices.getGenres()
      this.setState({ genres })
    } catch (error) {
      console.error(error)
    }
  }

  searchMovies = () => {
    const { searchValue, page } = this.state
    MovieServices.searchMovies(searchValue, page)
      .then((response) => {
        const movies = response.movies
        const totalPages = response.totalPages
        this.setState({ movies, totalPages })
      })
      .catch((error) => console.error(error))
  }

  handleSearch = (searchValue) => {
    this.setState({ searchValue, page: 1 }, this.searchMovies)
  }

  createGuestSession = async () => {
    try {
      const guestSessionId = await MovieServices.createGuestSession()
      this.setState({ guestSessionId })
    } catch (error) {
      console.error(error)
    }
  }

  handleRate = (movieId, newRating) => {
    newRating = Math.min(10, Math.max(1, newRating))
    console.log('ответ newRating', newRating)
    const { movies, guestSessionId } = this.state
    const movieIndex = movies.findIndex((movie) => movie.id === movieId)
    if (movieIndex === -1) {
      return
    }
    const updatedMovies = [...movies]
    updatedMovies[movieIndex].rating = newRating
    this.setState({ movies: updatedMovies }, () => {
      MovieServices.rateMovie(movieId, newRating, guestSessionId)
        .then((response) => {
          console.log(response)
          localStorage.setItem(`movieRating_${movieId}`, newRating.toString())
          const ratedMovies = updatedMovies.filter((movie) => {
            const savedRating = localStorage.getItem(`movieRating_${movie.id}`)
            return savedRating !== null
          })
          this.setState({ ratedMovies }, () => {
            console.log('ответ ratedMovies', this.state.ratedMovies)
          })
        })
        .catch((error) => {
          console.error(error)
        })
    })
  }

  renderSearchTab = () => {
    const { movies, page, totalPages, genres, guestSessionId } = this.state
    return (
      <GenreProvider genres={genres}>
        <Header onSearch={this.handleSearch} />
        <ul className="section">
          {movies.map((movie) => {
            const savedRating = localStorage.getItem(`movieRating_${movie.id}`)
            const rating = savedRating ? parseFloat(savedRating) : movie.rating
            console.log('rating:', rating) // Вывод значения rating в консоль
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
                onRate={this.handleRate}
              />
            )
          })}
        </ul>
        <Pagination
          current={page}
          total={totalPages}
          onChange={this.handlePageChange}
        />
      </GenreProvider>
    )
  }

  renderRatedTab = () => {
    const { ratedMovies, genres } = this.state
    if (!ratedMovies || ratedMovies.length === 0) {
      return <p>Не найдено оцененных фильмов</p>
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
              onRate={this.handleRate}
            />
          ))}
        </ul>
      </GenreProvider>
    )
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab })
  }

  handlePageChange = (page) => {
    this.setState({ page }, this.searchMovies)
  }

  render() {
    const { activeTab } = this.state
    return (
      <>
        <Online>
          <div className="basic">
            <div className="tabs">
              <Button
                className={activeTab === 'search' ? 'active' : ''}
                onClick={() => this.handleTabChange('search')}
              >
                Поиск
              </Button>
              <Button
                className={activeTab === 'rated' ? 'active' : ''}
                onClick={() => this.handleTabChange('rated')}
              >
                Оцененные
              </Button>
            </div>
            {activeTab === 'search'
              ? this.renderSearchTab()
              : this.renderRatedTab()}
          </div>
        </Online>
        <Offline>
          <div className="no-internet">
            <div className="no-internet-book" alt="нет интернета" />
            <span>Упс!!! Нет подключения к интернету</span>
          </div>
        </Offline>
      </>
    )
  }
}
