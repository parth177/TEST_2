let date = new Date();
console.log(date.getTime());
const heroCards = document.getElementById('heroCards');
let input = document.getElementById('search');

let ts = date.getTime();
let publicKey = '522153dfdd4c1089661ca6c171960e12';
let privateKey = '9df7600ea21a75bc13e797cbcc49e15521cc36f7';

let hashVal = CryptoJS.MD5(ts + privateKey + publicKey);

const [timestamp, apiKey, hashValue] = [ts, publicKey, hashVal];

input.addEventListener('keyup', searchHero);

// to serach super heros based on input given
function searchHero() {
  let query = input.value;
  if (query != '') {
    const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&nameStartsWith=${query}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        displaySuperheroes(data.data.results);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    fetchSuperheroes();
  }
}

// To display super heros on html page

function displaySuperheroes(data) {
  const superheroes = data;
  console.log(data);
  const superheroListContainer = document.getElementById('heroCards');
  superheroListContainer.innerHTML = '';
  let c = 0;
  superheroes.forEach((superhero) => {
    c = 1;
    const superheroCard = document.createElement('div');
    superheroCard.className = 'col-md-3 mb-4';
    const favoriteSuperheroes =
      JSON.parse(localStorage.getItem('favoriteSuperheroes')) || [];
    const isSuperheroInFavorites = favoriteSuperheroes.some(
      (superhero_1) => superhero_1.id === superhero.id
    );
    superheroCard.innerHTML = `
            <div class="card">
                <img src="${superhero.thumbnail.path}.${
      superhero.thumbnail.extension
    }" class="card-img-top" alt="${superhero.name}" width="300" height="300">
                <div class="card-body">
                    <h5 class="card-title">${superhero.name}</h5>
                    <a href="#" class="btn btn-primary view-more-btn" data-superhero-id="${
                      superhero.id
                    }">View More</a>
                     ${
                       !isSuperheroInFavorites
                         ? `<button class="btn btn-success add-to-favorites-btn" data-superhero-id="${superhero.id}">Add to Favorites</button>`
                         : `<button class="btn btn-danger add-to-favorites-btn" data-superhero-id="${superhero.id}">Remove Favorites</button>`
                     }
                    
                </div>
            </div> 
        `;

    superheroListContainer.appendChild(superheroCard);
  });
  if (c == 0) {
    superheroListContainer.innerHTML =
      "<h3 class='text-warning' > No data available..!! </h3>";
  }

  // Add event listeners to the "View More Info" buttons
  const viewMoreButtons = document.querySelectorAll('.view-more-btn');
  viewMoreButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const superheroId = this.getAttribute('data-superhero-id');
      localStorage.setItem('selectedSuperheroId', superheroId);
      window.location.href = 'moreinfo.html'; // Redirect to the view more info page
    });
  });
  const addToFavoritesButtons = document.querySelectorAll(
    '.add-to-favorites-btn'
  );
  addToFavoritesButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const superheroId = this.getAttribute('data-superhero-id');
      const selectedSuperhero = superheroes.find(
        (superhero) => superhero.id.toString() === superheroId
      );

      // Retrieve favorite superheroes from localStorage or initialize an empty array if it doesn't exist
      const favoriteSuperheroes =
        JSON.parse(localStorage.getItem('favoriteSuperheroes')) || [];

      // Check if the selected superhero is already in the favorites list
      const isSuperheroInFavorites = favoriteSuperheroes.some(
        (superhero) => superhero.id === selectedSuperhero.id
      );

      // If the superhero is not already in favorites, add it to the list
      if (!isSuperheroInFavorites) {
        favoriteSuperheroes.push(selectedSuperhero);
        // Update the favorites list in localStorage
        localStorage.setItem(
          'favoriteSuperheroes',
          JSON.stringify(favoriteSuperheroes)
        );
      } else {
        const updatedFavorites = favoriteSuperheroes.filter(
          (superhero) => superhero.id !== parseInt(selectedSuperhero.id)
        );
        localStorage.setItem(
          'favoriteSuperheroes',
          JSON.stringify(updatedFavorites)
        );
      }
      searchHero();
    });
  });
}

function fetchSuperheroes() {
  const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displaySuperheroes(data.data.results);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Show more information about the super hero
function showinfo() {
  const character = localStorage.getItem('selectedSuperheroId');
  const apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${character}?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const selectedSuperhero = data.data.results[0];
      document.getElementById('superhero-name').textContent =
        selectedSuperhero.name;
      document.getElementById('superhero-photo').src =
        selectedSuperhero.thumbnail.path +
        '.' +
        selectedSuperhero.thumbnail.extension;
      document.getElementById('superhero-bio').textContent =
        selectedSuperhero.description || 'No bio available.';

      //
      //

      const favoriteSuperheroes =
        JSON.parse(localStorage.getItem('favoriteSuperheroes')) || [];

      // Check if the selected superhero is already in the favorites list
      const isSuperheroInFavorites = favoriteSuperheroes.some(
        (superhero) => superhero.id === parseInt(character)
      );

      // If the superhero is not already in favorites, add it to the list
      if (!isSuperheroInFavorites) {
        document.getElementById(
          'btnAddFav'
        ).innerHTML = `<button class="btn btn-success add-to-favorites-btn" id="btnAdd" data-superhero-id="${character}">Add to Favorites</button>`;
      } else {
        document.getElementById(
          'btnAddFav'
        ).innerHTML = `<button class="btn btn-danger add-to-favorites-btn" id="btnAdd" data-superhero-id="${character}">Remove from Favorites</button>`;
      }
      //
      //
      //
      let b = document.getElementById('btnAdd');
      b.addEventListener('click', function (event) {
        event.preventDefault();
        const superheroId = this.getAttribute('data-superhero-id');

        // const selectedSuperhero = superheroes.find(
        //   (superhero) => superhero.id.toString() === superheroId
        // );

        // Retrieve favorite superheroes from localStorage or initialize an empty array if it doesn't exist
        const favoriteSuperheroes =
          JSON.parse(localStorage.getItem('favoriteSuperheroes')) || [];

        // Check if the selected superhero is already in the favorites list
        const isSuperheroInFavorites = favoriteSuperheroes.some(
          (superhero) => superhero.id.toString() === superheroId
        );

        // If the superhero is not already in favorites, add it to the list
        if (!isSuperheroInFavorites) {
          favoriteSuperheroes.push(selectedSuperhero);
          // Update the favorites list in localStorage
          localStorage.setItem(
            'favoriteSuperheroes',
            JSON.stringify(favoriteSuperheroes)
          );
        } else {
          const updatedFavorites = favoriteSuperheroes.filter(
            (superhero) => superhero.id !== parseInt(superheroId)
          );
          localStorage.setItem(
            'favoriteSuperheroes',
            JSON.stringify(updatedFavorites)
          );
        }
        showinfo();
      });
      //
      //

      // Update comics list
      const comicsList = document.getElementById('comics-list');
      selectedSuperhero.comics.items.forEach((comic) => {
        const listItem = document.createElement('li');
        listItem.textContent = comic.name;
        comicsList.appendChild(listItem);
      });

      // Update events list
      const eventsList = document.getElementById('events-list');
      selectedSuperhero.events.items.forEach((event) => {
        const listItem = document.createElement('li');
        listItem.textContent = event.name;
        eventsList.appendChild(listItem);
      });

      // Update series list
      const seriesList = document.getElementById('series-list');
      selectedSuperhero.series.items.forEach((series) => {
        const listItem = document.createElement('li');
        listItem.textContent = series.name;
        seriesList.appendChild(listItem);
      });

      // Update stories list
      const storiesList = document.getElementById('stories-list');
      selectedSuperhero.stories.items.forEach((story) => {
        const listItem = document.createElement('li');
        listItem.textContent = story.name;
        storiesList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

//to get and display favourite super heros

function fetchFavSuperheroes() {
  data = JSON.parse(localStorage.getItem('favoriteSuperheroes'));
  console.log(data);
  const superheroes = data;
  console.log(data);
  const superheroListContainer = document.getElementById('heroCards');
  superheroListContainer.innerHTML = '';
  let c = 0;
  superheroes.forEach((superhero) => {
    c = 1;
    const superheroCard = document.createElement('div');
    superheroCard.className = 'col-md-3 mb-4';
    const favoriteSuperheroes =
      JSON.parse(localStorage.getItem('favoriteSuperheroes')) || [];

    superheroCard.innerHTML = `
            <div class="card">
                <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" class="card-img-top" alt="${superhero.name}" width="300" height="300">
                <div class="card-body">
                    <h5 class="card-title">${superhero.name}</h5>
                    <a href="#" class="btn btn-primary view-more-btn" data-superhero-id="${superhero.id}">View More</a>
                    <button class="btn btn-danger add-to-favorites-btn" data-superhero-id="${superhero.id}">Remove Favorites</button>
                    
                </div>
            </div>
        `;

    superheroListContainer.appendChild(superheroCard);
  });
  if (c == 0) {
    superheroListContainer.innerHTML =
      "<h3 class='text-warning' > No data available..!! </h3>";
  }

  // Add event listeners to the "View More Info" buttons
  const viewMoreButtons = document.querySelectorAll('.view-more-btn');
  viewMoreButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const superheroId = this.getAttribute('data-superhero-id');
      localStorage.setItem('selectedSuperheroId', superheroId);
      window.location.href = 'moreinfo.html'; // Redirect to the view more info page
    });
  });
  const addToFavoritesButtons = document.querySelectorAll(
    '.add-to-favorites-btn'
  );
  addToFavoritesButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const superheroId = this.getAttribute('data-superhero-id');
      const selectedSuperhero = superheroes.find(
        (superhero) => superhero.id.toString() === superheroId
      );

      // Retrieve favorite superheroes from localStorage or initialize an empty array if it doesn't exist
      const favoriteSuperheroes =
        JSON.parse(localStorage.getItem('favoriteSuperheroes')) || [];

      // Check if the selected superhero is already in the favorites list
      const isSuperheroInFavorites = favoriteSuperheroes.some(
        (superhero) => superhero.id === selectedSuperhero.id
      );

      // If the superhero is not already in favorites, add it to the list
      if (!isSuperheroInFavorites) {
        favoriteSuperheroes.push(selectedSuperhero);
        // Update the favorites list in localStorage
        localStorage.setItem(
          'favoriteSuperheroes',
          JSON.stringify(favoriteSuperheroes)
        );
      } else {
        const updatedFavorites = favoriteSuperheroes.filter(
          (superhero) => superhero.id !== parseInt(selectedSuperhero.id)
        );
        localStorage.setItem(
          'favoriteSuperheroes',
          JSON.stringify(updatedFavorites)
        );
        fetchFavSuperheroes();
      }
    });
  });
}
