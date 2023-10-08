import React, { Component } from 'react'

import MovieServices from '../../services/MovieServices'
import SearchTab from '../SearchTab'
import RatedTab from '../RatedTab'
import OnlineOfflineComponent from '../OnlineOfflineComponent'
import { NO_RATED_MOVIES_MESSAGE } from '../constants/constants'
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
    ratedMovies: [],
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
    const { movies, guestSessionId } = this.state
    const movieIndex = movies.findIndex((movie) => movie.id === movieId)
    if (movieIndex === -1) {
      return
    }
    const updatedMovies = [...movies]
    updatedMovies[movieIndex].rating = newRating
    this.setState({ movies: updatedMovies }, () => {
      MovieServices.rateMovie(movieId, newRating, guestSessionId)
        .then(() => {
          localStorage.setItem(`movieRating_${movieId}`, newRating.toString())
          const ratedMovies = updatedMovies.filter((movie) => {
            const savedRating = localStorage.getItem(`movieRating_${movie.id}`)
            return savedRating !== null
          })
          this.setState({ ratedMovies }, () => {
            return this.state.ratedMovies
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
      <SearchTab
        movies={movies}
        page={page}
        totalPages={totalPages}
        genres={genres}
        handleSearch={this.handleSearch}
        handleRate={this.handleRate}
        guestSessionId={guestSessionId}
      />
    )
  }

  renderRatedTab = () => {
    const { ratedMovies, genres } = this.state
    if (!ratedMovies || ratedMovies.length === 0) {
      return <p>{NO_RATED_MOVIES_MESSAGE}</p>
    }
    return (
      <RatedTab
        ratedMovies={ratedMovies}
        genres={genres}
        handleRate={this.handleRate}
      />
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
      <OnlineOfflineComponent
        activeTab={activeTab}
        handleTabChange={this.handleTabChange}
        renderSearchTab={this.renderSearchTab}
        renderRatedTab={this.renderRatedTab}
      />
    )
  }
}
