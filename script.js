const apiKey = '6da6bed641903962c8412753d00919d7';
const baseUrl = 'https://api.themoviedb.org/3';

const moviesGrid = document.getElementById('movies-grid');
const imageUrl = 'https://image.tmdb.org/t/p/w500';
const exitbutton = document.getElementById('exitbtn');
const searchInput = document.getElementById('search-input');
const loadmore = document.getElementById('load-more-movies-btn');
searchInput.addEventListener('keyup', handleSearch);
exitbutton.addEventListener('click', getPopularMovies);
var pages = 1;

async function fetchMovies(endpoint) {
  try {
    const response = await fetch(endpoint);

    if (response.ok) {
      const data = await response.json();
      return data.results; // Return the list of movies
    } else {
      throw new Error('Error:', response.status);
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

async function getPopularMovies() {
  searchInput.value = '';
  const endpoint = `${baseUrl}/movie/popular?api_key=${apiKey}`;
  moviesGrid.innerHTML = '';
  const popularMovies = await fetchMovies(endpoint);
  console.log('Popular Movies:', popularMovies);
  exitbutton.classList.add('hidden');

  popularMovies.forEach((movie) => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie');

    const image = document.createElement('img');
    if (movie.poster_path === null) {
      image.src = 'https://dummyimage.com/1000x2000/000/fff&text=No+poster';
    } else {
      image.src = imageUrl + movie.poster_path;
    }
    image.alt = 'Movie Poster';
    image.id - 'movie-poster';
    movieContainer.appendChild(image);

    const title = document.createElement('h3');
    title.classList.add('title');
    title.textContent = movie.title;
    title.id = 'movie-title';
    movieContainer.appendChild(title);

    const votes = document.createElement('p');
    votes.classList.add('votes');
    votes.textContent = `Votes: ${movie.vote_average}`;
    votes.id = 'movie-votes';
    movieContainer.appendChild(votes);

    moviesGrid.appendChild(movieContainer);
  });
}

getPopularMovies();

function handleSearch(event) {
  if (event.key === 'Enter') {
    const query = event.target.value;
    if (query === '') {
      return 0;
    }
    const moviesGrid = document.getElementById('movies-grid');
    exitbutton.classList.remove('hidden');
    loadmore.classList.add('hidden');

    moviesGrid.innerHTML = '';

    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Process the search results
        const movies = data.results;
        movies.forEach((movie) => {
          const movieContainer = document.createElement('div');
          movieContainer.classList.add('movie');

          const image = document.createElement('img');
          if (movie.poster_path === null) {
            image.src =
              'https://dummyimage.com/1000x2000/000/fff&text=No+poster';
          } else {
            image.src = imageUrl + movie.poster_path;
          }
          image.alt = 'Movie Poster';
          image.id - 'movie-poster';
          movieContainer.appendChild(image);

          const title = document.createElement('h3');
          title.classList.add('title');
          title.textContent = movie.title;
          title.id = 'movie-title';
          movieContainer.appendChild(title);

          const votes = document.createElement('p');
          votes.classList.add('votes');
          votes.textContent = `Votes: ${movie.vote_average}`;
          votes.id = 'movie-votes';
          movieContainer.appendChild(votes);

          moviesGrid.appendChild(movieContainer);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

loadmore.addEventListener('click', async (event) => {
  event.preventDefault(); // Prevent form submission (optional)

  pages++;

  try {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${pages}`;

    const response = await fetch(url);
    const data = await response.json();
    const movies = data.results;
    console.log(movies);

    movies.forEach((movie) => {
      const movieContainer = document.createElement('div');
      movieContainer.classList.add('movie');

      const image = document.createElement('img');
      if (movie.poster_path === null) {
        image.src = 'https://dummyimage.com/1000x2000/000/fff&text=No+poster';
      } else {
        image.src = imageUrl + movie.poster_path;
      }
      image.alt = 'Movie Poster';
      image.id - 'movie-poster';
      movieContainer.appendChild(image);

      const title = document.createElement('h3');
      title.classList.add('title');
      title.textContent = movie.title;
      title.id = 'movie-title';
      movieContainer.appendChild(title);

      const votes = document.createElement('p');
      votes.classList.add('votes');
      votes.textContent = `Votes: ${movie.vote_average}`;
      votes.id = 'movie-votes';
      movieContainer.appendChild(votes);

      moviesGrid.appendChild(movieContainer);
    });
  } catch (error) {
    console.log(error);
  }
  console.log('Button clicked!');
});