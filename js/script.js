const state = {
    currentPage: window.location.pathname,
};

const searchObj = {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
};

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Njg1NjlhOTYyOGM4NTljYzNmYzRkYTZjNGQ2ZmM3NCIsInN1YiI6IjY1YzQ1YTcyMTk0MTg2MDE2Mjc1NzEwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.p0vB3UvfdJY6xVdxcMB9ny7-SHxeolvIZo6YVqObRPk`,
    },
};

// VARIABLES
const body = document.querySelector('body');
const spinner = document.querySelector('.spinner');

// MAIN FUNCTIONS

// HOME PAGE
async function displayPopularMovies() {
    const popularFetch = await fetchData(
        'https://api.themoviedb.org/3/movie/popular'
    );
    const results = popularFetch.results;

    results.forEach((movie) => {
        const movieCardList = document.getElementById('popular-movies');
        const card = createMovieCard(movie);
        movieCardList.appendChild(card);
    });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardLink = document.createElement('a');
    cardLink.setAttribute('href', `movie-details.html?id=${movie.id}`);

    const cardImage = document.createElement('img');
    if (movie.poster_path) {
        cardImage.setAttribute(
            'src',
            `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        );
    } else {
        cardImage.setAttribute('src', `images/no-image.jpg`);
    }

    cardImage.setAttribute('alt', `${movie.title} movie poster`);
    cardImage.classList.add('card-img-top');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerHTML = movie.title;

    const cardParagraph = document.createElement('p');
    cardParagraph.classList.add('card-text');

    const cardText = document.createElement('small');
    cardText.classList.add('text-muted');
    cardText.textContent = `Released: ${formatDate(movie.release_date)}`;

    cardParagraph.appendChild(cardText);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardParagraph);

    cardLink.appendChild(cardImage);

    card.appendChild(cardLink);
    card.appendChild(cardBody);

    return card;
}

// SHOWS PAGE
async function displayPopularTv() {
    const popularFetch = await fetchData(
        'https://api.themoviedb.org/3/tv/popular?language=en-US&page=1'
    );
    const results = popularFetch.results;

    results.forEach((tv) => {
        const movieCardList = document.getElementById('popular-shows');
        const card = createTvCard(tv);
        movieCardList.appendChild(card);
    });
}

function createTvCard(tv) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardLink = document.createElement('a');
    cardLink.setAttribute('href', `tv-details.html?id=${tv.id}`);

    const cardImage = document.createElement('img');
    if (tv.poster_path) {
        cardImage.setAttribute(
            'src',
            `https://image.tmdb.org/t/p/w500${tv.poster_path}`
        );
    } else {
        cardImage.setAttribute('src', `images/no-image.jpg`);
    }

    cardImage.setAttribute('alt', `${tv.name} tv show poster`);
    cardImage.classList.add('card-img-top');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerHTML = tv.name;

    const cardParagraph = document.createElement('p');
    cardParagraph.classList.add('card-text');

    const cardText = document.createElement('small');
    cardText.classList.add('text-muted');
    cardText.textContent = `Aired: ${formatDate(tv.first_air_date)}`;

    cardParagraph.appendChild(cardText);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardParagraph);

    cardLink.appendChild(cardImage);

    card.appendChild(cardLink);
    card.appendChild(cardBody);

    return card;
}

// MOVIE DETAILS PAGE
async function displayMovieDetails() {
    const movieId = location.search.split('=')[1];
    const movieFetch = await fetchData(
        `https://api.themoviedb.org/3/movie/${movieId}`
    );

    createMovieDetails(movieFetch);
}

function createMovieDetails(movie) {
    const movieDetailsWrapper = document.querySelector('#movie-details');

    // POSTER IMAGE
    const image = movieDetailsWrapper.querySelector('img');
    if (movie.poster_path) {
        image.setAttribute(
            'src',
            `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        );
    } else {
        image.setAttribute('src', `images/no-image.jpg`);
    }

    // TITLE
    const movieTitle = movieDetailsWrapper.querySelector('h2');
    movieTitle.textContent = movie.title;

    // RATING
    const rating = movieDetailsWrapper.querySelector('p');
    const ratingValue = movie.vote_average.toFixed(1);
    rating.innerHTML = `<i class="fas fa-star text-primary"></i>
    ${ratingValue} / 10`;

    // RELEASE DATE
    const releaseDateElement =
        movieDetailsWrapper.querySelector('p:nth-child(3)');
    releaseDateElement.textContent = `Release Date: ${formatDate(
        movie.release_date
    )}`;

    // DESCRIPTION
    const description = movieDetailsWrapper.querySelector('p:nth-child(4)');
    description.textContent = movie.overview;

    // GENRES
    const genreList = movieDetailsWrapper.querySelector('ul');
    const genres = movie.genres;
    genres.forEach((genre) => {
        const listElement = document.createElement('li');
        listElement.textContent = genre.name;
        genreList.appendChild(listElement);
    });

    // MOVIE INFO
    const bottomInfoWrapper =
        movieDetailsWrapper.querySelector('.details-bottom');

    const movieInfoList = bottomInfoWrapper.querySelector('ul');

    if (!movie.budget) {
        movieInfoList.children[0].innerHTML = `<span class="text-secondary">Budget:</span> Unknown`;
    } else {
        movieInfoList.children[0].innerHTML = `<span class="text-secondary">Budget:</span> $${movie.budget}`;
    }

    if (!movie.revenue) {
        movieInfoList.children[1].innerHTML = `<span class="text-secondary">Revenue:</span> Unknown`;
    } else {
        movieInfoList.children[1].innerHTML = `<span class="text-secondary">Revenue:</span> $${movie.revenue}`;
    }

    movieInfoList.children[2].innerHTML = `<span class="text-secondary">Runtime:</span> ${movie.runtime} minutes`;
    movieInfoList.children[3].innerHTML = `<span class="text-secondary">Status:</span> ${movie.status}`;

    // PRODUCTION COMPANIES
    const companiesList = bottomInfoWrapper.querySelector('.list-group');

    const companiesData = movie.production_companies;

    companiesData.forEach((company) => {
        companiesList.textContent += `${company.name}, `;
    });
    companiesList.textContent = companiesList.textContent.slice(0, -2);
}

// TV DETAILS
async function displayTvDetails() {
    const tvId = location.search.split('=')[1];
    const tvFetch = await fetchData(`https://api.themoviedb.org/3/tv/${tvId}`);

    createTvDetails(tvFetch);
}

function createTvDetails(tv) {
    const tvDetailsWrapper = document.querySelector('#show-details');

    const image = tvDetailsWrapper.querySelector('img');
    image.setAttribute(
        'src',
        `https://image.tmdb.org/t/p/w500${tv.poster_path}`
    );

    const title = tvDetailsWrapper.querySelector('h2');
    title.textContent = tv.name;

    const rating = tvDetailsWrapper.querySelector('p');
    const ratingValue = tv.vote_average.toFixed(1);
    rating.innerHTML = `<i class="fas fa-star text-primary"></i>
    ${ratingValue} / 10`;

    const releaseDateElement = tvDetailsWrapper.querySelector('p:nth-child(3)');
    releaseDateElement.textContent = `Release Date: ${formatDate(
        tv.first_air_date
    )}`;

    const description = tvDetailsWrapper.querySelector('p:nth-child(4)');
    description.textContent = tv.overview;

    const genreList = tvDetailsWrapper.querySelector('ul');
    const genres = tv.genres;
    genres.forEach((genre) => {
        const listElement = document.createElement('li');
        listElement.textContent = genre.name;
        genreList.appendChild(listElement);
    });

    const bottomInfoWrapper = tvDetailsWrapper.querySelector('.details-bottom');

    const tvInfoList = bottomInfoWrapper.querySelector('ul');

    tvInfoList.children[0].innerHTML = `<span class="text-secondary">Number Of Episodes:</span> ${tv.number_of_episodes}`;
    tvInfoList.children[1].innerHTML = `<span class="text-secondary">Last Episode To Air:</span> ${tv.last_episode_to_air.name}`;
    tvInfoList.children[2].innerHTML = `<span class="text-secondary">Status:</span> ${tv.status}`;

    const companiesList = bottomInfoWrapper.querySelector('.list-group');

    const companiesData = tv.production_companies;

    companiesData.forEach((company) => {
        companiesList.textContent += `${company.name}, `;
    });
    companiesList.textContent = companiesList.textContent.slice(0, -2);
}

// SEARCH

async function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    searchObj.type = urlParams.get('type');
    searchObj.term = urlParams.get('search-term');

    if (searchObj.term) {
        const { results, total_pages, page, total_results } =
            await searchAPIData();

        searchObj.page = page;
        searchObj.totalPages = total_pages;
        searchObj.totalResults = total_results;

        if (results.length === 0) {
            showAlert('No results found', 'error');
            return;
        }

        displaySearchResults(results);
    } else {
        showAlert('Please enter your search parameter', 'error');
    }
}

function displaySearchResults(results) {
    document.querySelector('#search-results-heading').innerHTML = `<h2>From ${
        20 * (searchObj.page - 1) + 1
    } to ${20 * (searchObj.page - 1) + results.length} of ${
        searchObj.totalResults
    } results for "${searchObj.term}"</h2>`;

    const resultsListArray = Array.from(
        document.getElementById('search-results').children
    );
    resultsListArray.forEach((item) => {
        if (item.classList.contains('card')) {
            item.remove();
        }
    });

    if (searchObj.type === 'movie') {
        results.forEach((result) => {
            const resultsList = document.getElementById('search-results');
            const card = createMovieCard(result);
            resultsList.appendChild(card);
        });
        document.getElementById('movie').checked = true;
    } else if (searchObj.type === 'tv') {
        results.forEach((result) => {
            const resultsList = document.getElementById('search-results');
            const card = createTvCard(result);
            resultsList.appendChild(card);
        });
        document.getElementById('tv').checked = true;
    }

    displayPagination();
}

function displayPagination() {
    const paginationAbsoluteParent = document.querySelector('#pagination');
    Array.from(paginationAbsoluteParent.children).forEach((item) => {
        item.remove();
    });

    const paginationWrapper = document.createElement('div');
    paginationWrapper.classList.add('pagination');
    paginationWrapper.innerHTML = `<button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${searchObj.page} of ${searchObj.totalPages}</div>`;

    paginationAbsoluteParent.appendChild(paginationWrapper);

    // DISABLE
    if (searchObj.page == 1) {
        document.querySelector('#prev').disabled = true;
    }

    if (searchObj.page == searchObj.totalPages) {
        document.querySelector('#next').disabled = true;
    }

    // NEXT PAGE
    document.querySelector('#next').addEventListener('click', async () => {
        searchObj.page++;
        const { results, total_pages } = await searchAPIData();
        displaySearchResults(results);
    });

    document.querySelector('#prev').addEventListener('click', async () => {
        searchObj.page--;
        const { results, total_pages } = await searchAPIData();
        displaySearchResults(results);
    });
}

async function searchAPIData() {
    showSpinner();
    const response = await fetch(
        `https://api.themoviedb.org/3/search/${searchObj.type}?query=${searchObj.term}&page=${searchObj.page}`,
        options
    );
    const data = await response.json();

    hideSpinner();

    return data;
}

// ANY PAGE
async function fetchData(link) {
    showSpinner();
    const response = await fetch(link, options);
    const data = await response.json();
    hideSpinner();
    return data;
}

function formatDate(date) {
    const dateSplit = date.split('-');
    return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
}

function highlightActive() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        if (link.getAttribute('href') === state.currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function showAlert(message, className) {
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', className);
    alertEl.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alertEl);

    setTimeout(() => alertEl.remove(), 5000);
}

//ADDITIONAL FUNCTIONS
function showSpinner() {
    spinner.classList.add('show');
    body.classList.add('noclick');
    body.classList.add('noscroll');
}

function hideSpinner() {
    spinner.classList.remove('show');
    body.classList.remove('noclick');
    body.classList.remove('noscroll');
}

// SLIDER
async function displaySlider() {
    const response = await fetchData(
        'https://api.themoviedb.org/3/movie/now_playing',
        options
    );

    const results = response.results;

    results.forEach((result) => {
        const playingCardWrapper = document.createElement('div');
        playingCardWrapper.classList.add('swiper-slide');

        playingCardWrapper.innerHTML = `<a href="movie-details.html?id=${
            result.id
        }"><img src="https://image.tmdb.org/t/p/w500${
            result.poster_path
        }" alt="Movie Title" /></a><h4 class="swiper-rating"><i class="fas fa-star text-secondary"></i> ${result.vote_average.toFixed(
            1
        )} / 10</h4>`;

        document
            .querySelector('.swiper-wrapper')
            .appendChild(playingCardWrapper);

        initSwiper();
    });
}

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 5,
            },
        },
    });
}

// INIT
function init() {
    switch (state.currentPage) {
        case '/':
        case '/index.html':
            displaySlider();
            displayPopularMovies();
            searchSetup();
            break;
        case '/shows.html':
            displayPopularTv();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            displayTvDetails();
            break;
        case '/search.html':
            search();
    }

    highlightActive();
}

document.addEventListener('DOMContentLoaded', init);
