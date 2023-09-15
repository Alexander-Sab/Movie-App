import React, { Component } from 'react'
import Header from '../Header'
import MovieServices from '../../services/MovieServices'
import BlockMovie from '../BlockMovie'
import { Offline, Online } from 'react-detect-offline'
import { Pagination } from 'antd'
import './app.css'

export class App extends Component {
  state = {
    movies: [],
    loading: false,
    searchValue: '',
    page: 1,
    totalPages: 0,
  }

  componentDidMount() {
    const { searchValue, page } = this.state
    this.searchMovies(searchValue, page)
  }

  handleSearch = (searchValue) => {
    this.setState({ searchValue, page: 1 }, () => {
      this.searchMovies(searchValue, 1)
    })
  }

  handlePageChange = (page) => {
    const { searchValue } = this.state
    this.setState({ page }, () => {
      this.searchMovies(searchValue, page)
    })
  }

  

  searchMovies = (searchValue, page) => {
    MovieServices.searchMovies(searchValue, page, )
      .then(({movies, totalPages}) => {
        this.setState({ movies, loading: true, totalPages})
      })
      .catch((err) => console.error(err))
  }

  render() {
    const { movies, page, totalPages } = this.state
    return (
      <>
        <Online>
          <div className="basic">
            <Header onSearch={this.handleSearch} />
            <ul className="section">
              {movies.map((movie) => (
                <BlockMovie
                  key={movie.id}
                  poster_path={movie.poster_path}
                  original_title={movie.original_title}
                  release_date={movie.release_date}
                  overview={movie.overview}
                />
              ))}
            </ul>
            <Pagination
              current={page}
              total={totalPages} // Замените на общее количество страниц, которое  есть
              onChange={this.handlePageChange}
            />
          </div>
        </Online>
        <Offline>
          <div className="no-internet">
            <div className="no-internet-book" alt="нет интернета" />
            <span>UPS!!! no internet connection </span>
          </div>
        </Offline>
      </>
    )
  }
}
