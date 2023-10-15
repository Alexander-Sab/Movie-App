import React, { Component } from 'react'
import { Rate, Space, Spin, Alert } from 'antd'

import { GenreContext } from '../GenreContext/GenreContext'
import { shortenText, handleImageError } from '../../utils/utils'
import {
  NO_OVERVIEW_MESSAGE,
  IMAGE_ERROR_MESSAGE,
  GENRE_ERROR_MESSAGE,
} from '../../constants/constants'
import './BlockMovie.css'

export class BlockMovie extends Component {
  state = {
    loading: false,
    imageError: false,
    error: null,
    rating: {},
  }
  componentDidUpdate(prevProps) {
    if (prevProps.rating !== this.props.rating) {
      this.setState({ rating: this.props.rating })
    }
  }
  componentDidMount() {
    this.setState({ loading: true }, () => {
      setTimeout(() => {
        this.setState({ loading: false })
      }, 1000)
    })
    const { movieId } = this.props
    const savedRating = localStorage.getItem(`movieRating_${movieId}`)
    if (savedRating) {
      this.setState({ rating: parseFloat(savedRating) })
    }
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
    return <Alert message={error || IMAGE_ERROR_MESSAGE} type="error" />
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
        onError={handleImageError}
        onLoad={this.handleImageLoad}
      />
    )
  }
  handleImageLoad = () => {
    this.setState({ loading: false })
  }
  handleBlockMovieRate = (newRating) => {
    newRating = Math.min(10, Math.max(1, newRating))
    if (newRating < 1 || newRating > 10) {
      console.error('Оценка должна быть в диапазоне от 1 до 10')
      return
    }
    const { movieId, onRate, guestSessionId } = this.props
    onRate(movieId, newRating)
    localStorage.setItem(`movieRating_${movieId}`, newRating.toString())
    this.setState({ rating: newRating })
  }
  renderMovieDescription = () => {
    const { original_title, release_date, overview, vote_average } = this.props
    const shortenedDescription = overview ? shortenText(overview, 310) : ''
    let circleColorClass = 'description-rating-circle__red'
    if (vote_average >= 3 && vote_average < 5) {
      circleColorClass = 'description-rating-circle__orange'
    } else if (vote_average >= 5 && vote_average < 7) {
      circleColorClass = 'description-rating-circle__yellow'
    } else if (vote_average >= 7) {
      circleColorClass = 'description-rating-circle__green'
    }
    return (
      <GenreContext.Consumer>
        {(genres) => (
          <div className="description">
            <div className="block">
              <h3 className="description-title">{original_title}</h3>
              <div className={`description-rating-circle ${circleColorClass}`}>
                {vote_average}
              </div>
            </div>
            <div className="description-production">{release_date}</div>
            {genres.length > 0 ? (
              <div className="description-genre">
                {genres.map((genre) => {
                  if (this.props.genreIds.includes(genre.id)) {
                    return (
                      <span
                        key={genre.id}
                        className="description-genre__button"
                      >
                        {genre.name}
                      </span>
                    )
                  }
                  return null
                })}
              </div>
            ) : (
              <div className="description-genre">
                <p>{GENRE_ERROR_MESSAGE}</p>
              </div>
            )}
            {overview ? (
              <div className="description-story">
                <p className="description-story__text">
                  {shortenedDescription}
                </p>
              </div>
            ) : (
              <div className="description-story">
                <p className="description-story__text-absence">
                  {NO_OVERVIEW_MESSAGE}
                </p>
              </div>
            )}
          </div>
        )}
      </GenreContext.Consumer>
    )
  }
  render() {
    const { loading, error } = this.state
    const { rating } = this.props
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
                  value={rating}
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
