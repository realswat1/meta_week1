const apiKey = '6da6bed641903962c8412753d00919d7';
const baseUrl = 'https://api.themoviedb.org/3';

const moviesGrid = document.getElementById('movies-grid');
const imageUrl = 'https://image.tmdb.org/t/p/w500';
const exitbutton = document.getElementById('exitbtn');
const searchInput = document.getElementById('search-input');
const loadmore = document.getElementById('load-more-movies-btn');
const popUpContainer = document.getElementById('pop-up-container');
const popUp = document.getElementById('pop-up');
const trailerDiv = document.getElementById('trailerdiv');
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
  loadmore.classList.remove('hidden');
  searchInput.value = '';
  const endpoint = `${baseUrl}/movie/popular?api_key=${apiKey}`;
  moviesGrid.innerHTML = '';
  const popularMovies = await fetchMovies(endpoint);
  console.log('Popular Movies:', popularMovies);
  exitbutton.classList.add('hidden');

  popularMovies.forEach((movie) => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-card');
    movieContainer.id = movie.id;

    const image = document.createElement('img');
    if (movie.poster_path === null) {
      image.src = 'https://dummyimage.com/1000x2000/000/fff&text=No+poster';
    } else {
      image.src = imageUrl + movie.poster_path;
    }
    image.alt = 'Movie Poster';
    image.id = 'movie-poster';
    image.classList.add('movie-poster');
    movieContainer.appendChild(image);

    const title = document.createElement('h3');
    title.classList.add('title');
    title.textContent = movie.title;
    title.id = 'movie-title';
    movieContainer.appendChild(title);

    const votes = document.createElement('p');
    votes.classList.add('votes');
    votes.textContent = `Votes: ${movie.vote_average} ⭐️`;
    votes.id = 'movie-votes';
    movieContainer.appendChild(votes);

    moviesGrid.appendChild(movieContainer);
    //const popupexit = document.getElementById('exitpopbtn');
    //popupexit.addEventListener('click', getPopularMovies);
  });
  await selectMovies();
}

getPopularMovies();

async function handleSearch(event) {
  if (event.key === 'Enter') {
    const query = event.target.value;
    if (query === '') {
      return 0;
    }
    const moviesGrid = document.getElementById('movies-grid');
    exitbutton.classList.remove('hidden');
    loadmore.classList.add('hidden');

    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
    )
      .then((response) => response.json())
      .then(async (data) => {
        // Make the callback function async
        moviesGrid.innerHTML = '';
        // Process the search results
        const movies = data.results;
        for (const movie of movies) {
          // Use a for loop instead of forEach to support async/await
          const movieContainer = document.createElement('div');
          movieContainer.classList.add('movie-card');
          movieContainer.id = movie.id;

          const image = document.createElement('img');
          if (movie.poster_path === null) {
            image.src =
              'https://dummyimage.com/1000x2000/000/fff&text=No+poster';
          } else {
            image.src = imageUrl + movie.poster_path;
          }
          image.alt = 'Movie Poster';
          image.id = 'movie-poster';
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
        }
        await selectMovies(); // Wait for selectMovies() to finish before continuing
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
      movieContainer.classList.add('movie-card');
      movieContainer.id = movie.id;

      const image = document.createElement('img');
      if (movie.poster_path === null) {
        image.src = 'https://dummyimage.com/1000x2000/000/fff&text=No+poster';
      } else {
        image.src = imageUrl + movie.poster_path;
      }
      image.alt = 'Movie Poster';
      image.id = 'movie-poster';
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
  await selectMovies();
});

async function selectMovies() {
  const movieCards = document.querySelectorAll('.movies-grid .movie-card');

  movieCards.forEach((movieCont) => {
    movieCont.onclick = async () => {
      document.querySelector('.pop-up-container').style.display = 'block';
      console.log(movieCont);
      const id = movieCont.getAttribute('id');

      try {
        const videosResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`
        );
        const videosData = await videosResponse.json();
        const videos = videosData.results;

        var video = '';
        if (videos.length > 0) {
          video = videos[0].key;
        } else {
          video = 'dQw4w9WgXcQ';
        }

        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        );
        const details = await detailsResponse.json();
        console.log(details);

        const iframe = document.createElement('iframe');
        iframe.width = '560';
        iframe.height = '315';
        iframe.src = `https://www.youtube.com/embed/${video}`;
        iframe.title = 'YouTube video player';
        iframe.frameBorder = '0';
        iframe.allow =
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('detailsDiv');
        detailsDiv.innerHTML = `<div class="movietitle">${details.title}</div><div class="description">${details.overview}</div><div>${details.vote_average}</div>`;

        const popUp = document.querySelector('.pop-up');
        popUp.innerHTML = '';
        popUp.appendChild(iframe);
        popUp.appendChild(detailsDiv);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  });

  const closeButton = document.querySelector('.pop-up-container span');
  closeButton.onclick = () => {
    document.querySelector('.pop-up-container').style.display = 'none';
  };
}