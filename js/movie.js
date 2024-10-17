
let totalCount;

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MGRiZjg5ODg2NzBiZTc0YTg3MjQ2MzVkODc0YzcyMSIsIm5iZiI6MTcyOTEyODIzNi43NzAxNjUsInN1YiI6IjY3MGZiMzE1MDQzMzFkYjRiMTEyOTM5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vrlpX8JZkWm73TwG9C-qGI_FBstUjSWNT4Ymxo39a3c'
    }
  };
  
  fetch('https://api.themoviedb.org/3/movie/popular?language=ko&page=1', options)
  .then(response => response.json())
  .then(popMovies => {
    const movieInfo = popMovies.results;
    const totalPages = popMovies.total_pages;
    totalCount = popMovies.total_results;

    renderPopMovieList(movieInfo); // 리스트 출력 함수
    document.getElementById('total_movie').textContent = totalCount; // 총 개수
  })
  .catch(error => {
    console.error('문제가 발생했습니다:', error);
  });



function renderPopMovieList(moviedata) {
  const movieList = document.getElementById('pop_movie_list');

  moviedata.forEach(movie => {
    const li = document.createElement('li');
    li.innerHTML = `
        <a href="#">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="info">
                <p>${movie.title}</p>
                <p>${movie.vote_average}</p>
            </div>
        </a>
    `;
    movieList.appendChild(li);
  });
} 
  
