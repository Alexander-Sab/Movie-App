import React, { Component } from 'react'
import { Space, Spin, Alert } from 'antd'


export class BlockMovie extends Component {
  state = {
    loading: false,
    imageError: false,
    error: null,
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

  handleImageLoad = () => {
    this.setState({ loading: true, error: null })
  }

  componentDidMount() {
    // Установка состояния загрузки в true
    this.setState({ loading: true });

    // Установка состояния загрузки в false через 2 секунды
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }

  renderLoadingSpinner = () => {
    return (
      <div className='spin-container'>
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
    const { imageError, poster_path } = this.props
    const { onError, onLoad } = this

    if (imageError || !poster_path) {
      return <div className="scene-imageError" />
    }

    return (
      <img
        className="scene-cover"
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        alt=""
        onError={onError}
        onLoad={onLoad}
      />
    )
  }

  renderMovieDescription = () => {
    const { original_title, release_date, overview } = this.props
    const shortenedDescription = overview ? this.shortenText(overview, 310) : ''

    return (
      <div className="description">
        <h3 className="description-title">{original_title}</h3>
        <div className="description-production">{release_date}</div>
        <div className="description-genre">
          <button className="description-genre__action">Action</button>
          <button className="description-genre__drama">Drama</button>
        </div>
        <div className="description-story">
          <p className="description-story__text">{shortenedDescription}</p>
        </div>
      </div>
    )
  }

  render() {
    const { loading, error } = this.state

    return (
      <li className="block-movie">
        {loading && this.renderLoadingSpinner()}
        {error && this.renderErrorAlert()}
        {!loading && !error && (
          <>
            {this.renderMovieScene()}
            {this.renderMovieDescription()}
          </>
        )}
      </li>
    )
  }
}
