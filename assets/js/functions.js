"use strict";


const log_out = document.getElementById('log-out')
log_out.addEventListener('click', () => {
  if (confirm('Are you sure you want to logout?')) {
    // Save it!
    location.replace("/login.html")
  } else {
    // Do nothing!
  }
})

let contains_rec = true;
let not_start = false;

// ############################################## FOR  Extras ########################################## 
const popular_tv = document.getElementById('popular-shows')
const popular_movies = document.getElementById('popular-movies')

popular_tv.addEventListener('click', popularShows)
popular_movies.addEventListener('click', popularMovies)


function popularShows(){
  console.log("Shows")

  let popular_show_data_set = [];
  famousShows();
  async function famousShows() {
    const get_url = 'http://127.0.0.1:5000/sendPopularShows'
    const response = await fetch(get_url);
    const famous_data = await response.json();
    popular_show_data_set = JSON.parse(famous_data)

    console.log(popular_show_data_set) 
    let x = document.querySelector('.styled-table')
    if (typeof(x) != 'undefined' && x != null){
      console.log("Removed")
      x.remove()
    }

    let html_table = `
        <table class="styled-table">
          <thead>
              <tr>
                  <th>T.V. Show</th>
                  <th>Year</th>
                  <th>Star Cast</th>
                  <th>IMDBb Rating</th>
              </tr>
          </thead>
          <tbody class="tbody">
          </tbody>
        </table>
    `

    document
    .querySelector(".services")
    .querySelector(".container")
    .insertAdjacentHTML("beforeend", html_table);

    for(let i=0; i<100; i++){
      let html_content = `
        <tr>
          <td>${i+1}. ${popular_show_data_set[i]['movie_title']}</td>
          <td>📅 ${popular_show_data_set[i]['year']}</td>
          <td>🤵 ${popular_show_data_set[i]['star_cast']}</td>
          <td>⭐ ${popular_show_data_set[i]['rating']}</td>
        </tr>
      `

      document
      .querySelector(".services")
      .querySelector(".container")
      .querySelector(".styled-table")
      .querySelector(".tbody")
      .insertAdjacentHTML("beforeend", html_content);
    } 
  }
}

function popularMovies(){
  console.log("Movies")

  let popular_movie_data_set = [];
  famousMovies();
  async function famousMovies() {
    const get_url = 'http://127.0.0.1:5000/sendPopularMovies'
    const response = await fetch(get_url);
    const popular_data = await response.json();
    popular_movie_data_set = JSON.parse(popular_data)
    
    console.log(popular_movie_data_set)
    let x = document.querySelector('.styled-table')
    if (typeof(x) != 'undefined' && x != null){
      console.log("Removed")
      x.remove()
    }

    let html_table = `
        <table class="styled-table styled-table-m">
          <thead>
              <tr>
                  <th>Movies</th>
                  <th>Year</th>
                  <th>Star Cast</th>
                  <th>IMDBb Rating</th>
              </tr>
          </thead>
          <tbody class="tbody">
          </tbody>
        </table>
    `

    document
    .querySelector(".services")
    .querySelector(".container")
    .insertAdjacentHTML("beforeend", html_table);

    for(let i=0; i<100; i++){
      let html_content = `
        <tr>
          <td>${i+1}. ${popular_movie_data_set[i]['movie_title']}</td>
          <td>📅 ${popular_movie_data_set[i]['year']}</td>
          <td>🤵 ${popular_movie_data_set[i]['star_cast']}</td>
          <td>⭐ ${popular_movie_data_set[i]['rating']}</td>
        </tr>
      `

      document
      .querySelector(".services")
      .querySelector(".container")
      .querySelector(".styled-table")
      .querySelector(".tbody")
      .insertAdjacentHTML("beforeend", html_content);
    } 
  }
}



/*
############################################## FOR tracker ########################################### 

*/

// temp_Data_after_wateched stores name of the movies/shows/anime that are watched and their ratings which is to be used for
// recommendation

let temp_database_after_watched = [];
// to load the data(tracker data) from the database and display them to the user

getDb();
async function getDb() {
  const get_url = 'http://127.0.0.1:5000/'
  const response = await fetch(get_url);
  const data_track = await response.json();
  temp_database_after_watched = data_track
  console.log(temp_database_after_watched )
  
  for(let z=0; z<data_track.length; z++){
    tracklist(z)
  }
  get_recommended()
}

getActiveUser();
let active_user = null
async function getActiveUser() {
  const get_url = 'http://127.0.0.1:5000/activeUserGet' 
  const response = await fetch(get_url);
  const data_track = await response.json();
  console.log(`Active user ${data_track}`)
  active_user = data_track
}

// to store the data added to wishlist in the temp_database (array)
let temp_database = [];
getWatchlist();
async function getWatchlist() {
  const get_url = 'http://127.0.0.1:5000/watchlist/get';
  const response = await fetch(get_url);
  const data_watch = await response.json();
  console.log("getWatchlist()")
  console.log(data_watch);
  temp_database = data_watch;
  for (let z=0; z<data_watch.length; z++){
    var html2 = `
    <div class="border">
      <div class="card">
        <div class="poster">
          <img src=${data_watch[z][1]} />
        </div>
        <div class="details">
          <h2>${data_watch[z][0]}</h2>
          <div class="rate">
            <button class="rating 1_star" onclick="rate_and_remove1(this)">😪</button>
            <button class="rating 2_star" onclick="rate_and_remove2(this)">🥱</button>
            <button class="rating 3_star" onclick="rate_and_remove3(this)">😐</button>
            <button class="rating 4_star" onclick="rate_and_remove4(this)">🙂</button>
            <button class="rating 5_star" onclick="rate_and_remove5(this)">😄</button>
          </div>
        </div>
      </div>
    </div> 
    `;

    // for customizing the width of the wishlist-grid, for 1 it will be 25%, 2 - 50% ... and 4 onwards 100%
    if (temp_database.length < 5) {
      $(".grid-container").css({
        width: `${25 * temp_database.length}` + "%",
      });
      // console.log(`${25 * temp_database.length}` + "%");
    }
    document
      .querySelector(".about")
      .querySelector(".container")
      .querySelector(".grid-container")
      .insertAdjacentHTML("beforeend", html2);
  }
}

// to avoid scope collisions as function.js is of type module, removing which make this whole file useless 😎
window.getApi = getApi;
window.rate_and_remove1 = rate_and_remove1
window.rate_and_remove2 = rate_and_remove2
window.rate_and_remove3 = rate_and_remove3
window.rate_and_remove4 = rate_and_remove4
window.rate_and_remove5 = rate_and_remove5

/*
############################################## FOR Watchlist ########################################### 

*/
// Selecting the elements
const modal = document.getElementById("modal");
const btnCloseModal = document.getElementById("close-modal");
const btnsOpenModal = document.getElementById("add-title");


// to store the data(name of the show) that is marked as watched in temp_database_to_remove
let temp_database_to_remove = [];


// event occurs after
function rate_and_remove1(e) {
  // console.log("rate_and_remove");

  let to_rate_and_remove_html =
    e.parentNode.parentNode.parentNode.parentNode.innerHTML;

  let to_rate_and_remove = e.parentNode.parentNode.parentNode.parentNode;

  let extract_image_url = to_rate_and_remove_html.substring(
    to_rate_and_remove_html.lastIndexOf('<img src="') + 10,
    to_rate_and_remove_html.lastIndexOf('g">')
  );

  extract_image_url + "g";

  to_rate_and_remove_html = to_rate_and_remove_html.substring(
    to_rate_and_remove_html.lastIndexOf("<h2>") + 4,
    to_rate_and_remove_html.lastIndexOf("</h2>")
  );

  for (let i = 0; i < temp_database_to_remove.length; i++) {
    if (to_rate_and_remove_html == temp_database[i][0]) {
      temp_database.splice(i, 1);
      // console.log(temp_database);
    }
    if (to_rate_and_remove_html == temp_database_to_remove[i]) {
      temp_database_to_remove.splice(i, 1);
    }
  }

  // console.log(5);
  temp_database_after_watched.push([
    to_rate_and_remove_html,
    extract_image_url,
    1,
  ]);

  let temp_length = (temp_database_after_watched.length)-1
  var xhttp = new XMLHttpRequest();
  xhttp.open('POST', "http://127.0.0.1:5000/", true);
  xhttp.setRequestHeader('Content-type', "application/json;charset=UTF-8");
  let send = {title: temp_database_after_watched[temp_length][0],
     poster: temp_database_after_watched[temp_length][1], rating: temp_database_after_watched[temp_length][2]};
  var sendString = JSON.stringify(send);
  xhttp.send(sendString);

  var xhttp2 = new XMLHttpRequest();
  console.log("Temp_Database")
  console.log(temp_database_after_watched[temp_length][0])
  xhttp2.open('POST', `http://127.0.0.1:5000/watchlist/delete/${active_user}`, true);
  xhttp2.setRequestHeader('Content-type', "application/json;charset=UTF-8");
  let send2 = {id: `${active_user}`, title: temp_database_after_watched[temp_length][0]};
  var sendString2 = JSON.stringify(send2);
  xhttp2.send(sendString2);

  for(let i=0; i<temp_database.length; i++){
    if(temp_database[i][0] == temp_database_after_watched[temp_length][0])[
      temp_database.splice(i, 1)
    ]
  }

  // temp_database.remove()

  to_rate_and_remove.remove();
  console.log(temp_database_after_watched);

  if (temp_database.length < 5) {
    $(".grid-container").css({
      width: `${25 * temp_database.length}` + "%",
    });
  }

  tracklist();
  window.location.reload();
}

function rate_and_remove2(e) {
  // console.log("rate_and_remove");
  let to_rate_and_remove_html =
    e.parentNode.parentNode.parentNode.parentNode.innerHTML;

  let to_rate_and_remove = e.parentNode.parentNode.parentNode.parentNode;

  let extract_image_url = to_rate_and_remove_html.substring(
    to_rate_and_remove_html.lastIndexOf('<img src="') + 10,
    to_rate_and_remove_html.lastIndexOf('g">')
  );

  extract_image_url + "g";

  to_rate_and_remove_html = to_rate_and_remove_html.substring(
    to_rate_and_remove_html.lastIndexOf("<h2>") + 4,
    to_rate_and_remove_html.lastIndexOf("</h2>")
  );

  for (let i = 0; i < temp_database_to_remove.length; i++) {
    if (to_rate_and_remove_html == temp_database[i][0]) {
      temp_database.splice(i, 1);
      // console.log(temp_database);
    }
    if (to_rate_and_remove_html == temp_database_to_remove[i]) {
      temp_database_to_remove.splice(i, 1);
    }
  }

  // console.log(5);
  temp_database_after_watched.push([
    to_rate_and_remove_html,
    extract_image_url,
    2,
  ]);

  let temp_length = (temp_database_after_watched.length)-1
  var xhttp = new XMLHttpRequest();
  xhttp.open('POST', "http://127.0.0.1:5000/", true);
  xhttp.setRequestHeader('Content-type', "application/json;charset=UTF-8");
  let send = {title: temp_database_after_watched[temp_length][0],
     poster: temp_database_after_watched[temp_length][1], rating: temp_database_after_watched[temp_length][2]};
  var sendString = JSON.stringify(send);
  xhttp.send(sendString);

  var xhttp2 = new XMLHttpRequest();
  console.log("Temp_Database")
  console.log(temp_database_after_watched[temp_length][0])
  xhttp2.open('POST', `http://127.0.0.1:5000/watchlist/delete/${active_user}`, true);
  xhttp2.setRequestHeader('Content-type', "application/json;charset=UTF-8");
  let send2 = {id: `${active_user}`, title: temp_database_after_watched[temp_length][0]};
  var sendString2 = JSON.stringify(send2);
  xhttp2.send(sendString2);

  for(let i=0; i<temp_database.length; i++){
    if(temp_database[i][0] == temp_database_after_watched[temp_length][0])[
      temp_database.splice(i, 1)
    ]
  }

  to_rate_and_remove.remove();
  console.log(temp_database_after_watched);

  if (temp_database.length < 5) {
    $(".grid-container").css({
      width: `${25 * temp_database.length}` + "%",
    });
  }

  tracklist();
  window.location.reload();
}

function rate_and_remove3(e) {
  // console.log("rate_and_remove");

  let to_rate_and_remove_html =
    e.parentNode.parentNode.parentNode.parentNode.innerHTML;

  let to_rate_and_remove = e.parentNode.parentNode.parentNode.parentNode;

  let extract_image_url = to_rate_and_remove_html.substring(
    to_rate_and_remove_html.lastIndexOf('<img src="') + 10,
    to_rate_and_remove_html.lastIndexOf('g">')
  );

  extract_image_url + "g";
  to_rate_and_remove_html = to_rate_and_remove_html.substring(
    to_rate_and_remove_html.lastIndexOf("<h2>") + 4,
    to_rate_and_remove_html.lastIndexOf("</h2>")
  );

  for (let i = 0; i < temp_database_to_remove.length; i++) {
    if (to_rate_and_remove_html == temp_database[i][0]) {
      temp_database.splice(i, 1);
      // console.log(temp_database);
    }
    if (to_rate_and_remove_html == temp_database_to_remove[i]) {
      temp_database_to_remove.splice(i, 1);
    }
  }
  // console.log(5);

  temp_database_after_watched.push([
    to_rate_and_remove_html,
    extract_image_url,
    3,
  ]);

  // to post the data, it is first sent to services.js and then to database
  let temp_length = (temp_database_after_watched.length)-1
  var xhttp = new XMLHttpRequest();
  xhttp.open('POST', "http://127.0.0.1:5000/", true);
  xhttp.setRequestHeader('Content-type', "application/json;charset=UTF-8");
  let send = {title: temp_database_after_watched[temp_length][0],
     poster: temp_database_after_watched[temp_length][1], rating: temp_database_after_watched[temp_length][2]};
  var sendString = JSON.stringify(send);
  xhttp.send(sendString);

  var xhttp2 = new XMLHttpRequest();
  console.log("Temp_Database")
  console.log(temp_database_after_watched[temp_length][0])
  xhttp2.open('POST', `http://127.0.0.1:5000/watchlist/delete/${active_user}`, true);
  xhttp2.setRequestHeader('Content-type', "application/json;charset=UTF-8");
  let send2 = {id: `${active_user}`, title: temp_database_after_watched[temp_length][0]};
  var sendString2 = JSON.stringify(send2);
  xhttp2.send(sendString2);

  for(let i=0; i<temp_database.length; i++){
    if(temp_database[i][0] == temp_database_after_watched[temp_length][0])[
      temp_database.splice(i, 1)
    ]
  }

  to_rate_and_remove.remove();
  console.log(temp_database_after_watched);

  if (temp_database.length < 5) {
    $(".grid-container").css({
      width: `${25 * temp_database.length}` + "%",
    });
  }

  tracklist();
  window.location.reload();
}

function rate_and_remove4(e) {
  // console.log("rate_and_remove");
  let to_rate_and_remove_html =
    e.parentNode.parentNode.parentNode.parentNode.innerHTML;

  let to_rate_and_remove = e.parentNode.parentNode.parentNode.parentNode;

  let extract_image_url = to_rate_and_remove_html.substring(
    to_rate_and_remove_html.lastIndexOf('<img src="') + 10,
    to_rate_and_remove_html.lastIndexOf('g">')
  );

  extract_image_url + "g";

  to_rate_and_remove_html = to_rate_and_remove_html.substring(
    to_rate_and_remove_html.lastIndexOf("<h2>") + 4,
    to_rate_and_remove_html.lastIndexOf("</h2>")
  );

  for (let i = 0; i < temp_database_to_remove.length; i++) {
    if (to_rate_and_remove_html == temp_database[i][0]) {
      temp_database.splice(i, 1);
      // console.log(temp_database);
    }
    if (to_rate_and_remove_html == temp_database_to_remove[i]) {
      temp_database_to_remove.splice(i, 1);
    }
  }

  // console.log(5);
  temp_database_after_watched.push([
    to_rate_and_remove_html,
    extract_image_url,
    4,
  ]);

  let temp_length = (temp_database_after_watched.length)-1
  var xhttp = new XMLHttpRequest();
  xhttp.open('POST', "http://127.0.0.1:5000/", true);
  xhttp.setRequestHeader('Content-type', "application/json;charset=UTF-8");
  let send = {title: temp_database_after_watched[temp_length][0],
     poster: temp_database_after_watched[temp_length][1], rating: temp_database_after_watched[temp_length][2]};
  var sendString = JSON.stringify(send);
  xhttp.send(sendString);

  var xhttp2 = new XMLHttpRequest();
  console.log("Temp_Database")
  console.log(temp_database_after_watched[temp_length][0])
  xhttp2.open('POST', `http://127.0.0.1:5000/watchlist/delete/${active_user}`, true);
  xhttp2.setRequestHeader('Content-type', "application/json;charset=UTF-8");
  let send2 = {id: `${active_user}`, title: temp_database_after_watched[temp_length][0]};
  var sendString2 = JSON.stringify(send2);
  xhttp2.send(sendString2);

  for(let i=0; i<temp_database.length; i++){
    if(temp_database[i][0] == temp_database_after_watched[temp_length][0])[
      temp_database.splice(i, 1)
    ]
  }

  to_rate_and_remove.remove();
  console.log(temp_database_after_watched);

  if (temp_database.length < 5) {
    $(".grid-container").css({
      width: `${25 * temp_database.length}` + "%",
    });
  }
  tracklist();
  window.location.reload();
}

function rate_and_remove5(e) {
  // console.log("rate_and_remove");
  let to_rate_and_remove_html =
    e.parentNode.parentNode.parentNode.parentNode.innerHTML;

  let to_rate_and_remove = e.parentNode.parentNode.parentNode.parentNode;

  let extract_image_url = to_rate_and_remove_html.substring(
    to_rate_and_remove_html.lastIndexOf('<img src="') + 10,
    to_rate_and_remove_html.lastIndexOf('g">')
  );

  extract_image_url + "g";

  to_rate_and_remove_html = to_rate_and_remove_html.substring(
    to_rate_and_remove_html.lastIndexOf("<h2>") + 4,
    to_rate_and_remove_html.lastIndexOf("</h2>")
  );

  for (let i = 0; i < temp_database_to_remove.length; i++) {
    if (to_rate_and_remove_html == temp_database[i][0]) {
      temp_database.splice(i, 1);
      // console.log(temp_database);
    }
    if (to_rate_and_remove_html == temp_database_to_remove[i]) {
      temp_database_to_remove.splice(i, 1);
    }
  }

  // console.log(5);
  temp_database_after_watched.push([
    to_rate_and_remove_html,
    extract_image_url,
    5,
  ]);

  let temp_length = (temp_database_after_watched.length)-1
  var xhttp = new XMLHttpRequest();
  xhttp.open('POST', "http://127.0.0.1:5000/", true);
  xhttp.setRequestHeader('Content-type', "application/json;charset=UTF-8");
  let send = {title: temp_database_after_watched[temp_length][0],
     poster: temp_database_after_watched[temp_length][1], rating: temp_database_after_watched[temp_length][2]};
  var sendString = JSON.stringify(send);
  xhttp.send(sendString);

  var xhttp2 = new XMLHttpRequest();
  console.log("Temp_Database")
  console.log(temp_database_after_watched[temp_length][0])
  xhttp2.open('POST', `http://127.0.0.1:5000/watchlist/delete/${active_user}`, true);
  xhttp2.setRequestHeader('Content-type', "application/json;charset=UTF-8");
  let send2 = {id: `${active_user}`, title: temp_database_after_watched[temp_length][0]};
  var sendString2 = JSON.stringify(send2);
  xhttp2.send(sendString2);

  for(let i=0; i<temp_database.length; i++){
    if(temp_database[i][0] == temp_database_after_watched[temp_length][0])[
      temp_database.splice(i, 1)
    ]
  }

  to_rate_and_remove.remove();
  console.log(temp_database_after_watched);

  if (temp_database.length < 5) {
    $(".grid-container").css({
      width: `${25 * temp_database.length}` + "%",
    });
  }

  tracklist();
  window.location.reload();
}

// to store the size of the api that we fetched in variable total_size and  log it to console
var total_size = 0;

// desicion to keep or remove the add to wish list button in modal window
let add_to_wishlist_remove = false;

// Display Add title pop up and hide it when clicked on cross button
const openModal = function () {
  modal.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");

  // to make the submit button visible again once model window is clossed
  $("#submit").css({
    display: "inline",
  });

  // to clear the list presented to user to select the movie from is cleard
  // console.log(total_size);
  if (total_size > 0) {
    for (let i = 0; i < total_size; i++) {
      let to_remove = document
        .querySelector(".about")
        .querySelector(".container")
        .querySelector(".watchlist")
        .querySelector(".list");
      to_remove.remove();
    }
  }

  // if the requirement to remove the wishlist button and number field is met it will remove them
  if (add_to_wishlist_remove) {
    let remove_add_to_watchlist_input = document
      .querySelector(".about")
      .querySelector(".container")
      .querySelector(".watchlist")
      .querySelector(".pos");
    remove_add_to_watchlist_input.remove();

    let remove_add_to_watchlist = document
      .querySelector(".about")
      .querySelector(".container")
      .querySelector(".watchlist")
      .querySelector(".a_t_w");
    remove_add_to_watchlist.remove();
  }

  // will reset the size of the displayed movies to zero as all the listed movies are removed from the modal window
  total_size = 0;

  // will reset the condition for wishlist button and number field to be removed (false)
  add_to_wishlist_remove = false;
};

btnsOpenModal.addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  e.preventDefault();

  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Getting the data via API
function getApi() {
  // to remove the button submit once add title button is pressed
  $("#submit").css({
    display: "none",
  });

  // to display the title passed from the text input into the console window
  const getTitle = document.getElementById("title").value;
  // console.log(getTitle);

  // api keys registered in the name of two team members... should be left commented used when one api runs out of daily limit.
  // nisarg api = https://imdb-api.com/en/API/SearchAll/k_8tcfd8ek/
  // sd api = https://imdb-api.com/en/API/SearchAll/k_ysik8czp/

  // JQuery to fetch the api content using the getTitle value that the user entered
  $(document).ready(function () {});
  $.ajax({
    method: "GET",
    url: "https://imdb-api.com/en/API/SearchAll/k_8tcfd8ek/" + getTitle,
    success: function (data) {
      // to store the size of the api that we fetched in variable total_size and  log it to console
      total_size = data.results.length;
      console.log(data);

      // to display the contents of the api to the user(movie list)
      for (var i = 0; i < total_size; i++) {
        const html = `
            <div class="list">
              <p class="items">(${i + 1})  ${data.results[i].title} 👉 ${
          data.results[i].description
        }</p>          
            </div>
            `;
        document
          .querySelector(".about")
          .querySelector(".container")
          .querySelector(".watchlist")
          .insertAdjacentHTML("beforeend", html);
      }

      // to display the add_to_wishlist button and number field at the bottom of the watchist container
      let input_field = `<input type="number" id="position" class="pos" name="quantity" min="1" max="5"><br/>
          <button id="add_to_wishlist" class="a_t_w">➕ Add To Wishlist</button>`;
      document
        .querySelector(".about")
        .querySelector(".container")
        .querySelector(".watchlist")
        .insertAdjacentHTML("beforeend", input_field);

      // to add the selected element from add title to wishlist
      document
        .getElementById("add_to_wishlist")
        .addEventListener("click", function () {
          let index = document.getElementById("position").value;
          get_movie(index);
        });

      // will specify that to remove the add to wish list button if cross button is pressed
      add_to_wishlist_remove = true;

      // event to be executed on button click (+ add to wish list)
      function get_movie(index) {
        // if the input field is left empty or started with 0 instead of 1 then it will default to 0
        if (index == "" || index == 0) {
          index = 1;
        }

        // initialize the db_size variable which stores the number of rows in the temp_database at the moment
        let db_size = 0;

        // increases the db_size by 1
        db_size += 1;

        // will store the recent data (which is the movie info that is clicked to add to wishlist) into the temp_database
        temp_database.push([
          data.results[index - 1].title,
          data.results[index - 1].image,
          data.results[index - 1].description,
        ]);

        // to store watchlist data into db
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', "http://127.0.0.1:5000/watchlist", true);
        xhttp.setRequestHeader('Content-type', "application/json;charset=UTF-8");
        let send = {title: data.results[index - 1].title,
          poster: data.results[index - 1].image, description: data.results[index - 1].description};
        var sendString = JSON.stringify(send);
        xhttp.send(sendString);

        // logs the data base to the console
        // console.log(temp_database);

        // will append the the recently added data to the html for the viewers to view the updated woshlist
        var html2 = `
          <div class="border">
            <div class="card">
              <div class="poster">
                <img src=${data.results[index - 1].image} />
              </div>
              <div class="details">
                <h2>${data.results[index - 1].title}</h2>
                <div class="rate">
                  <button class="rating 1_star" onclick="rate_and_remove1(this)">😪</button>
                  <button class="rating 2_star" onclick="rate_and_remove2(this)">🥱</button>
                  <button class="rating 3_star" onclick="rate_and_remove3(this)">😐</button>
                  <button class="rating 4_star" onclick="rate_and_remove4(this)">🙂</button>
                  <button class="rating 5_star" onclick="rate_and_remove5(this)">😄</button>
                </div>
              </div>
            </div>
          </div> 
          `;

        // for customizing the width of the wishlist-grid, for 1 it will be 25%, 2 - 50% ... and 4 onwards 100%
        if (temp_database.length < 5) {
          $(".grid-container").css({
            width: `${25 * temp_database.length}` + "%",
          });
          // console.log(`${25 * temp_database.length}` + "%");
        }
        document
          .querySelector(".about")
          .querySelector(".container")
          .querySelector(".grid-container")
          .insertAdjacentHTML("beforeend", html2);

        // will specify that to remove the add to wish list button and the number field if cross button is pressed
        add_to_wishlist_remove = true;
        temp_database_to_remove.push(
          temp_database[temp_database.length - 1][0]
        );

        // console.log(temp_database_to_remove);

        // to close the model window when the cross button is pressed
        closeModal();
      }
    },
  });
}

/*

############################################## FOR  tracklist ########################################## 

*/
console.log(temp_database_after_watched)
function tracklist(z=temp_database_after_watched.length-1) {
  var html3 = `
          <div class="border">
            <div class="card">
              <div class="poster">
                <img
                  src=${
                    temp_database_after_watched[
                      z
                    ][1]
                  }
                />
              </div>
              <div class="details">
                <h2>${
                  temp_database_after_watched[
                    z
                  ][0]
                }</h2>
                <p>${"⭐".repeat(
                  temp_database_after_watched[
                    z
                  ][2]
                )}</p>
              </div>
            </div>
          </div>
          `;

  // for customizing the width of the wishlist-grid, for 1 it will be 25%, 2 - 50% ... and 4 onwards 100%
  if (z+1 < 5) {
    $(".grid-container2").css({
      width: `${25 * (z+1)}` + "%",
    });
  }

  document
    .querySelector(".resume")
    .querySelector(".container")
    .querySelector(".grid-container2")
    .insertAdjacentHTML("beforeend", html3);
}


/*

############################################## FOR  Explore ########################################## 

*/
function get_recommended(){
  console.log("Inside the recc")
  for(let i=0; i<temp_database_after_watched.length; i++){
    let html4 = `<button name="${temp_database_after_watched[i][0]}" id="rcmd${i}" onclick="fromPython(event)" style="width: 100%">${temp_database_after_watched[i][0]}</button>`
    document.querySelector(".portfolio").querySelector('.dropdown-content').insertAdjacentHTML("beforeend", html4)
  }  
}

function fromPython(event){
  let x = document.querySelector(".portfolio").querySelector(".container").querySelector(".grid-container3")
  let title_name = document.getElementById(`${event.target.id}`).name;
  console.log(title_name)

  var new_xhttp = new XMLHttpRequest();
  new_xhttp.open('POST', "http://127.0.0.1:5000/toPython", true);
  new_xhttp.setRequestHeader('Content-type', "application/json;charset=UTF-8");
  let send_data = {title: title_name};
  var sendString_toPy = JSON.stringify(send_data);
  new_xhttp.send(sendString_toPy);

  let python_arr = [];
  data_py();
  async function data_py() {
    const get_url = 'http://127.0.0.1:5000/dataPy'
    const response = await fetch(get_url);
    const rcmd_data = await response.json();
    python_arr = rcmd_data
    python_arr = [Object.keys(python_arr), Object.values(python_arr)]
    if(python_arr[1][0] === "Empty"){
      if (typeof(x) != 'undefined' && x != null){
        x.remove()
      }
      console.log("Empty")
      alert("Not Enough data to recommend!❌")
    }
    else{
      contains_rec == true;
      if (typeof(x) != 'undefined' && x != null){
        x.remove()
      }
      var html6 = `<div class="grid-container3"></div>`
      document
          .querySelector(".portfolio")
          .querySelector(".container")
          .insertAdjacentHTML("beforeend", html6);
      
      for(let i = 0; i<python_arr[0].length; i++){
        var html5 = `
                <div class="border">
                  <div class="card">
                    <div class="poster">
                      <img
                        src=${
                          python_arr[
                            1
                          ][i]
                        }
                      />
                    </div>
                    <div class="details">
                      <h2>${
                        python_arr[
                          0
                        ][i]
                      }</h2>
                    </div>
                  </div>
                </div>
                `;
      
        // for customizing the width of the wishlist-grid, for 1 it will be 25%, 2 - 50% ... and 4 onwards 100%
        if (i+1 < 5) {
          $(".grid-container3").css({
            width: `${25 * (i+1)}` + "%",
          });
        }
      
        document
          .querySelector(".portfolio")
          .querySelector(".container")
          .querySelector(".grid-container3")
          .insertAdjacentHTML("beforeend", html5);
    }
    console.log(python_arr)  
    }
  }
}