
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
    console.log(movieInfo);
  })
  .catch(error => {
    console.error('문제가 발생했습니다:', error);
  });



function renderPopMovieList(moviedata) {
  const movieList = document.getElementById('pop_movie_list');

  movieList.innerHTML = '';
  moviedata.forEach(movie => {

    const popMovie = `
      <li>
        <a href="#">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="info">
                <p class="title">${movie.title}</p>
                <p>
                <svg version="1.1" style="width: 20px; margin-bottom: -3px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
                <g><g><g><path fill="#fad612" d="M111,60.4l-16.7,41.7l-42.2,0.3L10,102.6l33.1,24.9c18.3,13.7,33.4,25,33.7,25.2c0.3,0.2-3,17.9-7.9,42.5c-4.6,23.2-8.3,42.1-8.2,42.1c0.1,0,15.3-11.3,33.8-25.2l33.6-25.2l33.6,25.2c18.5,13.9,33.7,25.2,33.8,25.2c0.1,0-3.6-18.9-8.2-42.1c-4.9-24.6-8.3-42.3-7.9-42.5c0.3-0.2,15.4-11.5,33.7-25.2l33.1-24.9l-42.2-0.3l-42.2-0.3L145,60.4c-9.2-22.9-16.8-41.6-17-41.6S120.2,37.5,111,60.4z"/></g></g></g>
                </svg>
                ${movie.vote_average}
                </p>
            </div>
        </a>
        <div class="modal">
          <article class="modal_window" style="background-image: url('https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${movie.backdrop_path}')">
              <a href="#none" class="close">X</a>
              <div class="flex_box top">
                  <div class="poster">
                      <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="">
                  </div>
                  <div class="info_detail">
                      <p class="title">
                        ${movie.title}<span> (${movie.original_title})</span>
                      </p>
                      <div class="tags"><span>${movie.release_date}</span><span>${movie.original_language}</span></div>
                      <div class="rating">
                          <svg version="1.1" style="width: 20px; margin-bottom: -3px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
                          <g><g><g><path fill="#fad612" d="M111,60.4l-16.7,41.7l-42.2,0.3L10,102.6l33.1,24.9c18.3,13.7,33.4,25,33.7,25.2c0.3,0.2-3,17.9-7.9,42.5c-4.6,23.2-8.3,42.1-8.2,42.1c0.1,0,15.3-11.3,33.8-25.2l33.6-25.2l33.6,25.2c18.5,13.9,33.7,25.2,33.8,25.2c0.1,0-3.6-18.9-8.2-42.1c-4.9-24.6-8.3-42.3-7.9-42.5c0.3-0.2,15.4-11.5,33.7-25.2l33.1-24.9l-42.2-0.3l-42.2-0.3L145,60.4c-9.2-22.9-16.8-41.6-17-41.6S120.2,37.5,111,60.4z"/></g></g></g>
                          </svg>
                          ${movie.vote_average} (${movie.vote_count}명 참여)
                      </div>
                      <div class="overview">
                        ${movie.overview}
                      </div>
                      <button type="button" class="btn_style bookmark"><span>북마크</span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
                          <g><g><g><path fill="#fff" d="M60.1,11.1c-3.6,2.5-3.4-3.3-3.4,117.1c0,105,0.1,111.7,1.2,113.9c1.4,2.9,4.1,4.2,7.3,3.6c2.1-0.4,6.5-4.5,32.6-30.5L128,185l29.9,29.8c16.3,16.3,30.5,30.1,31.2,30.5c3.8,1.9,8.2-0.1,9.4-4.4c0.9-3.4,0.9-222.4,0-225.7c-0.4-1.3-1.4-3-2.4-3.8c-1.6-1.3-2.2-1.3-68-1.3C67.8,10,61.5,10.1,60.1,11.1z M185.3,123.2v100.1l-26.8-26.8c-14.8-14.8-27.7-27.2-28.7-27.5c-1.3-0.5-2.4-0.5-3.6,0c-1.1,0.3-13.9,12.7-28.7,27.5l-26.9,26.8V123.2v-100H128h57.4V123.2z"/></g></g></g>
                          </svg></button>
                  </div> 
              </div>
          </article>
        </div>
      </li>
    `;
    movieList.insertAdjacentHTML('beforeend', popMovie);
  });
} 
  

