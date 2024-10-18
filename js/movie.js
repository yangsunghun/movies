
let totalCount;
let filteredMovies = []; // 검색된 영화 데이터를 전용 배열
let currentPage = 1; // 페이지 초기화
let totalPages = 0; // 총 페이지 수 초기화
let currentGenreId = null; // 장르 초기화

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MGRiZjg5ODg2NzBiZTc0YTg3MjQ2MzVkODc0YzcyMSIsIm5iZiI6MTcyOTIxNzE2OS44Mzg3NjcsInN1YiI6IjY3MGZiMzE1MDQzMzFkYjRiMTEyOTM5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1c1-7B-raiSW2kiGxsVOpDdJTfTrYmmTt3-jrI9MhWM'
  }
};



// 기본 리스트 출력 함수
const fetchMovies = (page = 1) => {
  fetch(`https://api.themoviedb.org/3/movie/popular?language=ko&page=${page}`, options)
  .then(response => response.json())
  .then(popMovies => {
      const movieInfo = popMovies.results;
      totalPages = popMovies.total_pages; // 총 페이지 수 업데이트
      totalCount = popMovies.total_results;
      console.log(movieInfo);
      renderPopMovieList(movieInfo); // 리스트 출력 함수
      
  })
  .catch(error => {
      console.error('문제가 발생했습니다:', error);
  });

  
};



// 기본 20개 출력
fetchMovies(currentPage);



// 장르 ID와 이름 매핑
const genreMap = {
  'SF': 878,
  'TV영화': 10770,
  '가족': 10751,
  '공포': 27,
  '다큐멘터리': 99,
  '드라마': 18,
  '로맨스': 10749,
  '모험': 12,
  '미스터리': 9648,
  '범죄': 80,
  '서부': 37,
  '스릴러': 53,
  '애니메이션': 16,
  '액션': 28,
  '역사': 36,
  '음악': 10402,
  '전쟁': 10752,
  '코미디': 35,
  '판타지': 14
};


// 장르 버튼 클릭 이벤트
document.addEventListener('DOMContentLoaded', () => {
const genreLinks = document.querySelectorAll('#genre_sort a');
genreLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // 기본 링크 클릭 방지
        const genreName = event.target.textContent; // 클릭한 장르 이름
        const genreId = genreMap[genreName] // 장르 ID 찾기
        currentGenreId = genreMap[genreName]; // 장르 ID 페이징용
        
        currentPage = 1; // 초기화
      
        if (genreId) {
            fetchMoviesByGenre(genreId); // 해당 장르로 영화 가져오기
        }
    });
});


});


// 장르 sorting 함수
const fetchMoviesByGenre = (genreId, page = 1) => {
  fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=ko&page=${page}`, options)
  .then(response => response.json())
  .then(popMovies => {
      const movieInfo = popMovies.results;
      const genreName = Object.keys(genreMap).find(key => genreMap[key] === genreId);
      totalPages = popMovies.total_pages; // 총 페이지 수 업데이트
      totalCount = popMovies.total_results;
      console.log(genreName); // 장르 이름
      renderPopMovieList(movieInfo); // 리스트 출력 함수

      document.getElementById('search_word').textContent = `${genreName}에 관련된`;
  })
  .catch(error => {
      console.error('문제가 발생했습니다:', error);
  });
};








// 페이징 함수
const changePage = (direction) => {
  currentPage += direction; // 페이지 누적


  if (currentPage < 1) {
      alert('더 이상 이전 페이지가 없습니다');
      currentPage = 1;
  } else if (currentPage > totalPages) {
    alert('더 이상 다음 페이지가 없습니다');
      currentPage = totalPages; // 최대 페이지는 총 페이지 수
  }

  const searchWord = document.getElementById('searchInput').value; 
  const searchInput = searchWord.toLowerCase().replace(/\s+/g, '').trim(); // 필수

  let url;

  if (searchInput) {
      // 검색어 있을 때만..
      url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchInput)}&include_adult=false&language=ko&page=${currentPage}`;
  } else if (currentGenreId) {
      // 장르 클릭했을 떄
      url = `https://api.themoviedb.org/3/discover/movie?with_genres=${currentGenreId}&language=ko&page=${currentPage}`;
  } else {
      // 기본 상태
      url = `https://api.themoviedb.org/3/movie/popular?language=ko&page=${currentPage}`;
  }

  fetch(url, options)
  .then(response => response.json())
  .then(data => {
      const movieInfo = data.results; // 검색 결과 api에서 데이터 가져오기
      renderPopMovieList(movieInfo); // 검색 결과용 렌더링
  })
  .catch(error => {
      console.error('문제가 발생했습니다:', error);
  });
};




// 이벤트 리스너 모음
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
  document.getElementById('nextPage').addEventListener('click', () => changePage(1));

  document.getElementById('searchForm').addEventListener('submit', searchMovies);
  //document.getElementById('searchInput').addEventListener('input', searchMovies); // 나중에..
});






// 검색 함수
function searchMovies(event) {
  if (event) {
      event.preventDefault(); // 새로고침 방지
  }

  const searchWord = document.getElementById('searchInput').value; 
  const searchInput = searchWord.toLowerCase().replace(/\s+/g, '').trim(); // 공백 제거

  const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
  
  if (specialChars.test(searchWord)) {
    alert('검색어에 특수문자가 포함되어 있습니다.'); // 특수문자 거르기
    return;
  }
  if (searchInput === '') {
      alert('검색어를 입력하세요.');
      return;
  }

  // 초기화
  currentPage = 1; 

  // 검색 전용 API
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchInput)}&include_adult=false&language=ko&page=${currentPage}`;

  fetch(url, options)
  .then(response => response.json())
  .then(data => {
      const movieInfo = data.results; // 검색 결과에서 영화 정보 가져오기
      totalPages = data.total_pages; // 총 페이지 수 업데이트
      totalCount = data.total_results; // 총 영화 수 업데이트
      console.log(totalCount);
      // console.log(movieInfo); // 결과 미리보기
      renderPopMovieList(movieInfo);
  })
  .catch(error => {
      console.error('문제가 발생했습니다:', error);
  });

  document.getElementById('search_word').textContent = `'"${searchWord}" 와 일치하는 `;
}




// 템플릿 출력 시간 남으면 modal 분리 예정 근데 안할듯

function renderPopMovieList(moviedata) {
  const movieList = document.getElementById('pop_movie_list');

  movieList.innerHTML = '';
  moviedata.forEach(movie => {
    const rating = Math.round(movie.vote_average * 10) / 10; // 별점 소수점 한자리까지 반올림
    const adult = movie.adult === true ? `<span class="adult_mark">19</span>` : ''; // 의미 없는 속성인듯
    const overview = movie.overview !== '' ? movie.overview : '줄거리가 없습니다.';
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
                ${rating}
                </p>
            </div>
        </a>
        <div class="modal">
          <article class="modal_window" style="background-image: url('https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${movie.backdrop_path}')">
              <a href="#none" class="close">X</a>
              <button type="button" class="btn_style bookmark"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
                          <g><g><g><path fill="#fff" d="M60.1,11.1c-3.6,2.5-3.4-3.3-3.4,117.1c0,105,0.1,111.7,1.2,113.9c1.4,2.9,4.1,4.2,7.3,3.6c2.1-0.4,6.5-4.5,32.6-30.5L128,185l29.9,29.8c16.3,16.3,30.5,30.1,31.2,30.5c3.8,1.9,8.2-0.1,9.4-4.4c0.9-3.4,0.9-222.4,0-225.7c-0.4-1.3-1.4-3-2.4-3.8c-1.6-1.3-2.2-1.3-68-1.3C67.8,10,61.5,10.1,60.1,11.1z M185.3,123.2v100.1l-26.8-26.8c-14.8-14.8-27.7-27.2-28.7-27.5c-1.3-0.5-2.4-0.5-3.6,0c-1.1,0.3-13.9,12.7-28.7,27.5l-26.9,26.8V123.2v-100H128h57.4V123.2z"/></g></g></g>
                          </svg></button>
              <div class="flex_box top">
                  <div class="poster">
                      <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="">
                  </div>
                  <div class="info_detail">
                      <p class="title">${movie.title}</p>
                      <p class="title_en">${movie.original_title}</p>
                      <div class="tags">${adult}<span>${movie.release_date}</span><span>${movie.original_language}</span></div>
                      <div class="rating">
                          <svg version="1.1" style="width: 20px; margin-bottom: -3px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
                          <g><g><g><path fill="#fad612" d="M111,60.4l-16.7,41.7l-42.2,0.3L10,102.6l33.1,24.9c18.3,13.7,33.4,25,33.7,25.2c0.3,0.2-3,17.9-7.9,42.5c-4.6,23.2-8.3,42.1-8.2,42.1c0.1,0,15.3-11.3,33.8-25.2l33.6-25.2l33.6,25.2c18.5,13.9,33.7,25.2,33.8,25.2c0.1,0-3.6-18.9-8.2-42.1c-4.9-24.6-8.3-42.3-7.9-42.5c0.3-0.2,15.4-11.5,33.7-25.2l33.1-24.9l-42.2-0.3l-42.2-0.3L145,60.4c-9.2-22.9-16.8-41.6-17-41.6S120.2,37.5,111,60.4z"/></g></g></g>
                          </svg>
                          ${rating} (${movie.vote_count}명 참여)
                      </div>
                      <div class="overview">
                        ${overview}
                      </div>
                  </div> 
              </div>
          </article>
        </div>
      </li>
    `;
    movieList.insertAdjacentHTML('beforeend', popMovie);

    // 정보 업데이트


    document.getElementById('total_movie').textContent = totalCount; // 총 개수
    document.getElementById('totalPages').textContent = totalPages; // 총 페이지 수
    document.getElementById('currentPage').textContent = currentPage; // 현재 페이지
  });
} 




