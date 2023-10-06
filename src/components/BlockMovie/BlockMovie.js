import React, { Component } from 'react'
import { Rate, Space, Spin, Alert } from 'antd'

import { GenreContext } from '../GenreContext/GenreContext'
import './BlockMovie.css'
export class BlockMovie extends Component {
  state = {
    loading: false,
    imageError: false,
    error: null,
    ratings: {},
  }
  componentDidUpdate(prevProps) {
    if (prevProps.rating !== this.props.rating) {
      this.setState({ ratings: this.props.rating })
    }
  }
  componentDidMount() {
    const { movieId, rating } = this.props
    const savedRating = localStorage.getItem(`movieRating_${movieId}`)
    if (savedRating) {
      this.setState({ rating: parseFloat(savedRating) })
    } else if (rating) {
      this.setState({ rating })
    }
  }
  shortenText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...'
    }
    return text
  }
  handleImageError = () => {
    this.setState({ imageError: true })
  }
  renderLoadingSpinner = () => {
    return (
      <div className="spin-container">
        <Space size="middle">
          <Spin size="large" />
        </Space>
      </div>
    )
  }
  renderErrorAlert = () => {
    const { error } = this.state
    return (
      <Alert message={error || 'Ошибка загрузки изображения'} type="error" />
    )
  }
  renderMovieScene = () => {
    const { imageError } = this.state
    const { poster_path } = this.props
    if (imageError || !poster_path) {
      return <div className="scene-imageError" />
    }
    return (
      <img
        className="scene-cover"
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        alt=""
        onError={this.handleImageError}
        onLoad={this.handleImageLoad}
      />
    )
  }
  handleImageLoad = () => {
    this.setState({ loading: false })
  }
  handleBlockMovieRate = (newRating) => {
    newRating = Math.min(10, Math.max(1, newRating))
    console.log('ответ newRating', newRating)
    if (newRating < 1 || newRating > 10) {
      console.error('Оценка должна быть в диапазоне от 1 до 10')
      return
    }
    const { movieId, onRate, guestSessionId } = this.props
    onRate(movieId, newRating, guestSessionId)
    localStorage.setItem(`movieRating_${movieId}`, newRating.toString())
    this.setState({ rating: newRating })
  }
  renderMovieDescription = () => {
    const {
      original_title,
      release_date,
      overview,
      vote_average,
      onRate,
      movieId,
    } = this.props
    const { ratings } = this.state
    // Получение оценки для текущего фильма из состояния ratings
    const grade =
      ratings[movieId] !== undefined ? ratings[movieId] : vote_average
    const shortenedDescription = overview ? this.shortenText(overview, 310) : ''
    let circleColor = '#E90000'
    if (vote_average >= 3 && vote_average < 5) {
      circleColor = '#E97E00'
    } else if (vote_average >= 5 && vote_average < 7) {
      circleColor = '#E9D100'
    } else if (vote_average >= 7) {
      circleColor = '#66E900'
    }
    return (
      <GenreContext.Consumer>
        {(genres) => (
          <div className="description">
            <div className="block">
              <h3 className="description-title">{original_title}</h3>
              <div
                className="rating-circle"
                style={{ borderColor: circleColor }}
              >
                {vote_average}
              </div>
            </div>
            <div className="description-production">{release_date}</div>
            <div className="description-genre">
              {genres.map((genre) => {
                if (this.props.genreIds.includes(genre.id)) {
                  return (
                    <button
                      key={genre.id}
                      className="description-genre__button"
                    >
                      {genre.name}
                    </button>
                  )
                }
                return null
              })}
            </div>
            <div className="description-story">
              <p className="description-story__text">{shortenedDescription}</p>
            </div>
          </div>
        )}
      </GenreContext.Consumer>
    )
  }
  render() {
    const { loading, error, rating } = this.state
    return (
      <li className="block-movie">
        {loading && this.renderLoadingSpinner()}
        {error && this.renderErrorAlert()}
        {!loading && !error && (
          <>
            {this.renderMovieScene()}
            <div className="description">
              {this.renderMovieDescription()}
              <div className="rate">
                <Rate
                  count={10}
                  value={rating} // Используйте значение rating из состояния
                  onChange={(newRating) => this.handleBlockMovieRate(newRating)}
                />
              </div>
            </div>
          </>
        )}
      </li>
    )
  }
}
