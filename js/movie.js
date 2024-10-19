let totalCount;
let currentPage = 1; // 페이지 초기화
let totalPages = 0; // 총 페이지 수 초기화
let currentGenreId = null; // 장르 초기화
let movieIds = [];
let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MGRiZjg5ODg2NzBiZTc0YTg3MjQ2MzVkODc0YzcyMSIsIm5iZiI6MTcyOTIxNzE2OS44Mzg3NjcsInN1YiI6IjY3MGZiMzE1MDQzMzFkYjRiMTEyOTM5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1c1-7B-raiSW2kiGxsVOpDdJTfTrYmmTt3-jrI9MhWM'
  }
};



// 기본 리스트 출력 함수
async function fetchMovies (page = 1) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=ko&page=${page}`, options);
    const popMovies = await response.json(); // JSON 변환

    const movieInfo = popMovies.results;
    totalPages = popMovies.total_pages;
    totalCount = popMovies.total_results;

    renderPopMovieList(movieInfo); // 리스트 출력 함수

  } catch (error) {
    console.error('문제가 발생했습니다:', error); // 에러 처리
  }
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
/*
document.addEventListener('DOMContentLoaded', () => {
  const genreLinks = document.querySelectorAll('#genre_sort a');
  genreLinks.forEach(link => {
      link.addEventListener('click', (event) => {
          event.preventDefault(); // 기본 링크 클릭 방지
          const genreName = event.target.textContent; // 클릭한 장르 이름
          const genreId = genreMap[genreName]; // 장르 ID
          currentGenreId = genreId; // 장르 ID 페이징용 전역

          // 클릭한 링크에 'clicked' 클래스 추가
          event.target.classList.add('clicked');
          event.target.sibling.classList.remove('clicked')

          currentPage = 1; // 초기화

          if (genreId) {
              fetchMoviesByGenre(genreId);
          }
      });
  });
});
*/

document.addEventListener('DOMContentLoaded', () => {
  const genreSort = document.getElementById('genre_sort');

  genreSort.addEventListener('click', (event) => {
    const link = event.target.closest('a');

    if (link) {          
      const genreName = link.getAttribute('data-genre');
      const genreId = genreMap[genreName]; // 장르 ID
      currentGenreId = genreId; // 장르 ID 페이징용 전역

      const li = link.closest('li');

      li.classList.add('clicked');

      const siblings = genreSort.querySelectorAll('li');
      siblings.forEach(sibling => {
          if (sibling !== li) {
              sibling.classList.remove('clicked');
          }
      });

      currentPage = 1; // 초기화

      if (genreId) {
          fetchMoviesByGenre(genreId);
      }

      document.getElementById('searchInput').value = ''; 
    }
  });
});


// 장르 sorting 함수
async function fetchMoviesByGenre (genreId, page = 1) {
  try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=ko&page=${page}`, options);
      const popMovies = await response.json(); // JSON 변환

      const movieInfo = popMovies.results;
      const genreName = Object.keys(genreMap).find(key => genreMap[key] === genreId);
      totalPages = popMovies.total_pages; // 총 페이지 수 업데이트
      totalCount = popMovies.total_results; // 총 영화 수 업데이트
      
      renderPopMovieList(movieInfo); // 리스트 출력 함수
      document.getElementById('search_word').textContent = `${genreName}에 관련된`;

  } catch (error) {
      console.error('문제가 발생했습니다:', error); // 에러 처리
  }
};





// 페이징 함수
const changePage = (direction) => {

  if (direction === 'prev') {
    // 이전 페이지로 이동
    if (currentPage <= 1) {
        alert('더 이상 이전 페이지가 없습니다');
        return;
    }
    currentPage--; // 현재 페이지 감소
  } else if (direction === 'next') {
    // 다음 페이지로 이동
    if (currentPage >= totalPages) {
        alert('더 이상 다음 페이지가 없습니다');
        return;
    }
    currentPage++;
  }

  const searchWord = document.getElementById('searchInput').value; 
  const searchInput = searchWord.toLowerCase().replace(/\s+/g, '').trim(); // 필수

  let url;

  if (searchInput) {
      // 검색어 있을 때
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
  document.getElementById('prevPage').addEventListener('click', () => changePage('prev'));
  document.getElementById('nextPage').addEventListener('click', () => changePage('next'));

  document.getElementById('searchForm').addEventListener('submit', searchMovies);
  //document.getElementById('searchInput').addEventListener('input', searchMovies); // 실시간 검색은 문제가 있음
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
      // console.log(totalCount);
      // console.log(movieInfo);
      renderPopMovieList(movieInfo);
  })
  .catch(error => {
      console.error('문제가 발생했습니다:', error);
  });

  const genreItems = document.querySelectorAll('#genre_sort li');
  genreItems.forEach(item => {
      item.classList.remove('clicked'); // 각 요소에서 'clicked' 클래스 제거
  });
  document.getElementById('search_word').textContent = `'"${searchWord}" 와 일치하는 `;
}




// 템플릿 출력 시간 남으면 modal 분리 예정 근데 안할듯

function renderPopMovieList(moviedata) {
  const movieList = document.getElementById('pop_movie_list');

  movieList.innerHTML = '';
  moviedata.forEach(movie => {
    movieIds = [...movieIds, movie.id];
 
    const movieJSON = JSON.stringify(movie);
    const rating = Math.round(movie.vote_average * 10) / 10; // 별점 소수점 한자리까지 반올림
    const adult = movie.adult === true ? `<span class="adult_mark">19</span>` : ''; // 의미 없는 속성인듯
    const overview = movie.overview !== '' ? movie.overview : '줄거리가 없습니다.';
    const popMovie = `
      <li id="movie${movie.id}">
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
              <button type="button" data-movie='${movieJSON.replace(/'/g, "&apos;")}' class="btn_style bookmark">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
              <g><g><path fill="#fff" d="M51.6,10h152.7v236L128,183.5L51.6,246V10z"/></g></g>
              </svg>
              </button>
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


  let savedMovieIds = savedMovies.map(movie => `movie${movie.id}`);

  // savedMovieIds에 있는 ID를 가진 요소에 클래스를 추가
  savedMovieIds.forEach(movieId => {
    const element = document.getElementById(movieId);
    if (element) {
        element.classList.add('bookmarked'); // 여기에 추가할 클래스 이름을 입력하세요
    }
  });

  //console.log(movieIds);
  //console.log(savedMovieIds);
} 




