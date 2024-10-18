


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
