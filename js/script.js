
/*
document.addEventListener('DOMContentLoaded', () => {
    const movieUl = document.getElementById('pop_movie_list');
    const movieLi = movieUl.querySelectorAll('li'); // 모든 li 요소 선택

    movieLi.forEach(li => {
        li.addEventListener('click', function() {
            const modal = this.querySelector('.modal'); // 자식 .modal 요소 찾기
            if (modal) {
                modal.classList.add('clicked'); // clicked 클래스 추가
            }
        });
    });
});
*/

document.addEventListener('DOMContentLoaded', () => {
    const movieUl = document.getElementById('pop_movie_list');

    // 부모 요소에 클릭 이벤트 리스너 추가
    movieUl.addEventListener('click', function(event) {
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
    });
});


/*
movieUl.addEventListener('mouseover', (event) => {
    const li = event.target.closest('li');
    if (li) {
        li.classList.add('hover');
    }
});

movieList.addEventListener('mouseout', (event) => {
    const li = event.target.closest('li');
    if (li) {
        li.classList.remove('hover');
    }
});

*/
