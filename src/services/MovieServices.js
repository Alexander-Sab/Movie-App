import axios from 'axios'

import {
  API_KEY,
  BASE_URL,
  GENRE_LANGUAGE,
} from '../components/constants/constants'

class MovieServices {
  static apiKey = API_KEY
  static baseUrl = BASE_URL
  static options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOGJmOTQ0YjAzY2QyZjhmZDVmNjM0NzExZDhlZGVjMCIsInN1YiI6IjY0ZWY2NmMxZTBjYTdmMDE0ZjY5YjkwOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wQZ9U1VjAeOU10busQBkSqD8hxJjfvanne3Fzi4SZ74',
    },
  }

  static createGuestSession() {
    const url = `${this.baseUrl}authentication/guest_session/new`
    return axios
      .get(url, { ...this.options })
      .then((response) => {
        const guestSessionId = response.data.guest_session_id
        console.log('ответ guestSessionId', guestSessionId)
        return guestSessionId
      })
      .catch((error) => {
        console.error(error)
        throw error // Пробросить ошибку дальше для обработки в компоненте App
      })
  }

  static getGenres() {
    const url = `${this.baseUrl}genre/movie/list`
    const params = {
      language: GENRE_LANGUAGE, // Установите язык на 'ru-RU' для получения названий жанров на русском языке
      api_key: this.apiKey,
    }
    return axios
      .get(url, { ...this.options, params })
      .then((response) => response.data.genres)
      .catch((error) => console.error(error))
  }

  static searchMovies(query, page) {
    const url = `${this.baseUrl}search/movie`
    const params = {
      api_key: this.apiKey,
      query: query,
      page: page,
    }
    return axios
      .get(url, { ...this.options, params })
      .then((response) => {
        const movies = response.data.results
        const totalPages = response.data.total_pages
        return { movies, totalPages }
      })
      .catch((error) => console.error(error))
  }

  static getRatedMovies(guestSessionId) {
    const url = `${this.baseUrl}guest_session/${guestSessionId}/rated/movies`
    const params = {
      api_key: this.apiKey,
    }
    return axios
      .get(url, { ...this.options, params })
      .then((response) => {
        console.log('Ответ сервера:', response.data)
        return response.data.results
      })
      .catch((error) => console.error(error))
  }

  static rateMovie(movieId, rating, guestSessionId) {
    const url = `${this.baseUrl}movie/${movieId}/rating`
    const params = {
      api_key: this.apiKey,
      guest_session_id: guestSessionId,
    }
    const body = {
      value: rating,
    }
    console.log('movieId:', movieId)
    console.log('guestSessionId:', guestSessionId)
    console.log('value:', rating)
    return axios
      .post(url, body, { ...this.options, params })
      .then((response) => {
        console.log('пост', response.data)
        return response.data
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  }
}

export default MovieServices
