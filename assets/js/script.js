// search string
let searchText
// query for RAWG API call (1 stage) - exact search PC only, 10 units max

// game name to be used for CheapShark API
let resultGame = ""

// query build for searching for a game
let queryRawgURL = "https://api.rawg.io/api/games?search_exact=1&exclude_additions=1,platforms=4&page_size=10&page=1&ordering=-rating&"
let queryRawgParams = { "key": keyRAWG };
queryRawgParams.search

// query to get game details requires ID (can be stored to history)

let gameID;
let queryRawgDetails;
//let queryRawgDetails = "https://api.rawg.io/api/games/" + gameID + "?"
queryRawgDetailsParams = { "key": keyRAWG };

// lists all deals for the specific input (10 deals, but still returns more)
// let apiCheapSharkURL= "https://www.cheapshark.com/api/1.0/deals?title="+resultGame +"&limit=10"

let queryCheapSharkURL = "https://www.cheapshark.com/api/1.0/deals?limit=10&exact=1&"
let queryCheapSharkURLParams = { "title": resultGame }


// get list of stores for deals
let storeListURL = "https://www.cheapshark.com/api/1.0/stores"
let storesArray = []

let dealURL = "https://www.cheapshark.com/redirect?dealID="


// Alerts For modals
let textEmptyInput = "Please enter game title."
let textGameNotFound = "Games not found. Please alter your search criteria."
let textDealsNotFound = "No deals found. Please try another game."



// new array for values from a local storage
let taskSaved = [];
taskSaved = getTasks(taskSaved);


// retrieve saved values from local storage if any exists
function getTasks(arr) {
  if (localStorage.getItem("taskObject") === null) {
    arr = [];
  } else {
    arr = JSON.parse(localStorage.getItem("taskObject"));
  }
  return arr;
}


// render buttons for history
function renderButtons() {

  // clear prevoius entries
  $("#games-list").empty()
  getTasks(taskSaved)

  if (taskSaved.length > 0) {
    for (i = 0; i < taskSaved.length; i++) {
      // add button for each game
      let taskButton = document.createElement('button');
      $(taskButton).text(taskSaved[i].game);
      $(taskButton).attr("class", "btn btn-secondary w-100 mb-1 p-2");
      $("#games-history").append(taskButton);
    }
  }

  // create clear history button
  let clearHistoryButton = document.createElement('button');
  $(clearHistoryButton).text("Clear history");
  $(clearHistoryButton).attr("class", "clearHistoryButton btn-danger btn  w-100 mb-1 p-2");
  $("#games-history").append(clearHistoryButton);

}


function requestGame() {


// clear previous records
  $("#games-list").empty();

  // API call
  $.ajax({
    url: queryRawgURL + $.param(queryRawgParams),
    method: "GET"
  }).then(function (responseRAWG) {

    // console.log(responseRAWG)


if(responseRAWG.length===0){

  alert(textGameNotFound)
}

else {

  for (i = 0; i < responseRAWG.results.length; i++) {

    // add elements to HTML + add classes from CSS
    let gameTitle = responseRAWG.results[i].name;
    let gameID = responseRAWG.results[i].id;

    // dynamically create a set of buttons for ul (buttons only + data attribute as ID for getting game details)
    let buttonContainer;
    buttonContainer = $("#games-list");

    // Title
    let buttonTitle = $("<button>");
    $(buttonTitle).text(gameTitle);
    // Adds data and classes
    $(buttonTitle).attr({ "data-gameid": gameID, class: "btn btn-secondary w-100 mb-1 p-2" });
    //Adds new button to ul
    $(buttonContainer).append(buttonTitle);

  }




}


   

    // adds click functionality to buttons to call cheapshark 

    $("#games-list").on("click", function (e) {

      // clear table rows
      $("#deals-table").empty();
      // get game name for Cheap Shark
      queryCheapSharkURLParams.title = $(e.target).text();

      $.ajax({
        url: queryCheapSharkURL + $.param(queryCheapSharkURLParams),
        method: "GET"
      }).then(function (responseCheapShark) {

        console.log(responseCheapShark)

if(responseCheapShark.length===0){
 // alert(textDealsNotFound)
}
else{


  for (i = 0; i < responseCheapShark.length; i++) {
    //  console.log(responseCheapShark[i].title)
    let gameRPrice = responseCheapShark[i].normalPrice;
    let gameSPrice = responseCheapShark[i].salePrice;
    let gameDealID = responseCheapShark[i].dealID;
    let gamePlatformID = responseCheapShark[i].storeID;
    let gamePlatformName;

    // get store name from a previously received array
    for (j = 0; j < storesArray.length; j++) {
      if (gamePlatformID === storesArray[j].storeID) {
        gamePlatformName = storesArray[j].storeName
      }

    }

    //discount value as % from 100%
    let gameDiscount = 100 - (Math.round(gameSPrice / gameRPrice * 100))

    // new row
    let markup = "<tr><td>" + gamePlatformName + " </td><td>" + gameRPrice + "</td><td>" + gameSPrice + "</td><td>" + gameDiscount + "</td><td><a href=" + dealURL + gameDealID + ">Buy</a></td></tr>";
    $(".deal-table tbody").append(markup);

  }


}
     
      });


      // second call to get game details using RAWG single game details

      // need a game ID
      gameID = $(e.target).attr('data-gameid');
      queryRawgDetails = "https://api.rawg.io/api/games/" + gameID + "?"

      $.ajax({
        url: queryRawgDetails + $.param(queryRawgDetailsParams),
        method: "GET"
      }).then(function (responseRawgDetails) {


        // get elements
        let gameTitle = responseRawgDetails.name;
        let gameDescription = responseRawgDetails.description_raw;
        let gamebackgroundURL = responseRawgDetails.background_image;
        let gameRating = responseRawgDetails.rating;
        // display elements
        $(".game-title").text(gameTitle)
        $(".game-description").text(gameDescription)
        $(".game-rating").text("Rating: " + gameRating)
        $("#game-output").find("img").attr({ src: gamebackgroundURL, alt: gameTitle });
        //  console.log(responseRawgDetails)

      });

    })

  });

}

// get a list of games based on user input
$("#search-button").on('click', function (e) {
  e.preventDefault();


  // get user input
  queryRawgParams.search = $("#title-input").val()
  searchText = $("#title-input").val()

  //alert(searchText)

  if (queryRawgParams.search === "") {
    // alert should be changed to modal (html+CSS)
   // alert("Please enter game title")
  }

  else {



    // get updated list of games from storage 
    taskObject = getTasks(taskSaved);

    // object tot save to a local storage
    let userSave = {

      game: queryRawgParams.search,

    }
    // add new value to array
    taskObject.push(userSave);
    // save to local storage
    localStorage.setItem("taskObject", JSON.stringify(taskObject));
    // add this city to search history
    taskSaved = taskObject;
    renderButtons()


    requestGame()


  }

});




// get a list of stores before searching for games
function getStores() {
  $.ajax({
    url: storeListURL,
    method: "GET"
  }).then(function (responseStores) {

    for (i = 0; i < responseStores.length; i++) {

      let storeObject = {
        storeID: responseStores[i].storeID,
        storeName: responseStores[i].storeName


      }
      // update list of stores
      storesArray.push(storeObject)

    }


  });
}


getStores()




