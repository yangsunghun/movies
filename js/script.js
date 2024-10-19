
/*







let lastScrollTop = 0;
let header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop) {
        header.classList.add('hide_up');
    } else {
        header.classList.remove('hide_up');
    }

    lastScrollTop = currentScrollTop;
});
*/



document.addEventListener('DOMContentLoaded', () => {


    const movieUl = document.getElementById('pop_movie_list');

    // 위임
    movieUl.addEventListener('click', function (event) {
        const body = document.body;
        const li = event.target.closest('li');

        if (li) {
            const thisModal = li.querySelector('.modal');
            if (thisModal) {
                thisModal.classList.add('open');
                body.style.overflow = 'hidden'
            }
        }

        const modal = event.target.closest('.modal');
        const close = event.target.closest('.close');

        if (close) {
            modal.classList.remove('open');
            body.style.overflow = 'visible'
        }




        const bookmarkBtn = event.target.closest('.bookmark');
        if (bookmarkBtn) {
            const movieData = bookmarkBtn.getAttribute('data-movie'); // 버튼에서 data-movie 가져오기
            const movieObject = JSON.parse(movieData); // JSON 객체로 변환

            // 이미 저장된 영화인지 확인
            const isAlreadySaved = savedMovies.some(movie => movie.id === movieObject.id);
            if (isAlreadySaved) {
                if (confirm('북마크에서 삭제하시겠습니까?')) {
                    // 로컬 스토리지에서 삭제
                    savedMovies = savedMovies.filter(movie => movie.id !== movieObject.id); // 배열에서 삭제
                    localStorage.setItem('savedMovies', JSON.stringify(savedMovies)); // 업데이트된 배열 저장
                    bookmarkBtn.classList.remove('active'); // 버튼에 클래스 제거
                    bookmarkBtn.closest('li').classList.remove('bookmarked'); // 카드에도 제거
                    alert('삭제되었습니다.');
                    return;
                }
                return;
            }

            // 영화 저장
            if (confirm('북마크에 추가하시겠습니까?')) {
                savedMovies.push(movieObject);
                localStorage.setItem('savedMovies', JSON.stringify(savedMovies)); // 배열 저장
                bookmarkBtn.classList.add('active'); // 클릭 상태 추가
                alert('추가되었습니다.');
            }

        }
    });


    const bookmarkLenderBtn = document.getElementById('sortBookmarked');
    bookmarkLenderBtn.addEventListener('click', renderSavedMovies);
});




function renderSavedMovies() {
    const movieList = document.getElementById('pop_movie_list');
    movieList.innerHTML = ''; // 기존 내용 초기화

    savedMovies.forEach(movie => {
        const movieJSON = JSON.stringify(movie);
        const rating = Math.round(movie.vote_average * 10) / 10; // 별점 소수점 한자리까지 반올림
        const adult = movie.adult === true ? `<span class="adult_mark">19</span>` : '';
        const overview = movie.overview !== '' ? movie.overview : '줄거리가 없습니다.';

        const bookmarkedMovie = `
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
        movieList.insertAdjacentHTML('afterbegin', bookmarkedMovie);

        // 정보 업데이트

        document.getElementById('search_word').textContent = '내가 북마크한 ';
        document.getElementById('total_movie').textContent = savedMovies.length; // 총 개수
        totalPages = 1; // 총 페이지 수
        document.getElementById('totalPages').textContent = 1; // 총 페이지 수
        currentPage = 1; // 현재 페이지
        document.getElementById('currentPage').textContent = 1; // 현재 페이지
    });

    let savedMovieIds = savedMovies.map(movie => `movie${movie.id}`);

    // 북마크한 영화카드에 클래스 추가
    savedMovieIds.forEach(movieId => {
        const element = document.getElementById(movieId);
        if (element) {
            element.classList.add('bookmarked');
        }
    });

}


