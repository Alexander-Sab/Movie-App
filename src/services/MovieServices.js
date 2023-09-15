export default class MovieServices {
  static options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOGJmOTQ0YjAzY2QyZjhmZDVmNjM0NzExZDhlZGVjMCIsInN1YiI6IjY0ZWY2NmMxZTBjYTdmMDE0ZjY5YjkwOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wQZ9U1VjAeOU10busQBkSqD8hxJjfvanne3Fzi4SZ74',
    },
  }

  static searchMovies(keyword, page) {
    const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&include_video=false&language=en-US&page=${page}&query=${keyword}`

    return fetch(url, this.options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((response) => {
        const movies = response.results;
        const totalPages = response.total_pages;
        return { movies, totalPages };
      })
      .catch((err) => console.error(err))
  }
}
