const state = {
    currentPage: window.location.pathname,
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
        createMovieCard(movie);
    });
}

function createMovieCard(movie) {
    const movieCardList = document.getElementById('popular-movies');

    const card = document.createElement('div');
    card.classList.add('card');

    const cardLink = document.createElement('a');
    cardLink.setAttribute('href', `movie-details.html?id=${movie.id}`);

    const cardImage = document.createElement('img');
    cardImage.setAttribute(
        'src',
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    );
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

    movieCardList.appendChild(card);
}

// SHOWS PAGE
async function displayPopularTv() {
    const popularFetch = await fetchData(
        'https://api.themoviedb.org/3/tv/popular?language=en-US&page=1'
    );
    const results = popularFetch.results;

    results.forEach((tv) => {
        createTvCard(tv);
    });
}

function createTvCard(tv) {
    const movieCardList = document.getElementById('popular-shows');

    const card = document.createElement('div');
    card.classList.add('card');

    const cardLink = document.createElement('a');
    cardLink.setAttribute('href', `tv-details.html?id=${tv.id}`);

    const cardImage = document.createElement('img');
    cardImage.setAttribute(
        'src',
        `https://image.tmdb.org/t/p/w500${tv.poster_path}`
    );
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

    movieCardList.appendChild(card);
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
    image.setAttribute(
        'src',
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    );

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

// INIT
function init() {
    switch (state.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularTv();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            console.log('tv details');
            break;
        case '/search.html':
            console.log('search');
    }

    highlightActive();
}

document.addEventListener('DOMContentLoaded', init);
