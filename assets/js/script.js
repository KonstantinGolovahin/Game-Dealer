let keyRAWG="4d3c85eb44b84a48a052214685745b50";

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
//queryRawgDetailsParams = { "key": keyRAWG };


let queryCheapSharkURL = "https://www.cheapshark.com/api/1.0/deals?limit=10&exact=1&sortBy=Price&"
let queryCheapSharkURLParams = { "title": resultGame }


// get list of stores for deals
let storeListURL = "https://www.cheapshark.com/api/1.0/stores"
let storesArray = []

// Deal details
let dealURL = "https://www.cheapshark.com/redirect?dealID="


// Alerts For modals
let textEmptyInput = "Please enter game title."
let textGameNotFound = "Games not found. Please alter your search criteria."
let textDealsNotFound = "No deals found. Please try another game."
let textCheapSharkFails = "Unable to contact CheapShark API. Deals are not avialable."
let textRawgFails = "Unable to contact RAWG API. Game search is not avialable."



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
  $("#games-history").empty()
  getTasks(taskSaved)

  if (taskSaved.length > 0) {
    for (i = 0; i < taskSaved.length; i++) {
      // add button for each game
      let taskButton = document.createElement('button');
      $(taskButton).text(taskSaved[i].game);
      $(taskButton).attr("class", "btn  w-100 mb-1 p-2");
      $("#games-history").append(taskButton);

    }
  }


  // create clear history button
  let clearHistoryButton = document.createElement('button');
  $(clearHistoryButton).text("Clear history");
  $(clearHistoryButton).attr("class", "clearHistoryButton btn-danger btn  w-100 mb-1 p-2");
  $("#games-history").append(clearHistoryButton);
  // adds button functionality
  $(clearHistoryButton).on("click", function (e) {
    //clears history
    localStorage.clear();
    $("#games-history").empty();

  })


}


// search in RAWG database
function requestGame() {


  // clear previous records
  $("#games-list").empty();


  // API call
  $.ajax({
    url: queryRawgURL + $.param(queryRawgParams),
    method: "GET",
    error: function (xhr, status, error) {

      $('#staticBackdrop').modal('show');
      $('#staticBackdropLabel').text(textRawgFails);
    }
  }).then(function (responseRAWG) {

   // console.log(responseRAWG)
    // reduce amount of records to display
    let maxResponseLength = 0
    if (responseRAWG.results.length > 10) {
      maxResponseLength = 10

    }
    else {
      maxResponseLength = responseRAWG.results.length;
    }

    // action if no results returned

    if (responseRAWG.results.length === 0) {
      //Alert
      $('#staticBackdrop').modal('show');
      $('#staticBackdropLabel').text(textGameNotFound);

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
        $(buttonTitle).attr({ "data-gameid": gameID, class: "btn  w-100 mb-1 p-2" });
        //Adds new button to ul
        $(buttonContainer).append(buttonTitle);

      }

    }

    // adds click functionality to buttons to call cheapshark (.off clears prevoius binding. If removed, evet will be triggered multiple times)
    $("#games-list").off("click").on("click", function (e) {
      // clear table rows
      $("#deals-table").empty();
      // get game name for Cheap Shark
      queryCheapSharkURLParams.title = $(e.target).text();

      $.ajax({
        url: queryCheapSharkURL + $.param(queryCheapSharkURLParams),
        method: "GET",
        error: function (xhr, status, error) {

          $('#staticBackdrop').modal('show');
          $('#staticBackdropLabel').text(textDealsNotFound);
        }
      }).then(function (responseCheapShark) {
        // console.log(responseCheapShark)

        if (responseCheapShark.length === 0) {
          //Alert
          $('#staticBackdrop').modal('show');
          $('#staticBackdropLabel').text(textDealsNotFound);

        }
        else {

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
            let markup = $("<tr>").append($("<td>").text(gamePlatformName))
              .append($("<td>").text(gameRPrice))
              .append($("<td>").text(gameSPrice))
              .append($("<td>").text(gameDiscount))
              .append($("<td>").append($("<a>", {
                "href": dealURL + gameDealID,
                "target": "_blank",
                "class": "buyButton"
              }).text("Buy")));

            $(".deal-table tbody").append(markup);
            // colours discounts
            if (gameDiscount >= 50) {
              $(".buyButton").css("background", "red");
            }
          }
        }

      });


      // second call to get game details using RAWG single game details

      // need a game ID
      gameID = $(e.target).attr('data-gameid');
      queryRawgDetails = "https://api.rawg.io/api/games/" + gameID + "?"

      $.ajax({
        url: queryRawgDetails + $.param(queryRawgParams),
        method: "GET",
        error: function (xhr, status, error) {

          $('#staticBackdrop').modal('show');
          $('#staticBackdropLabel').text(textRawgFails);
        }
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


// get a list of stores before searching for games
function getStores() {
  $.ajax({
    url: storeListURL,
    method: "GET",
    error: function (xhr, status, error) {

      $('#staticBackdrop').modal('show');
      $('#staticBackdropLabel').text(textCheapSharkFails);
    }
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


// get a list of games based on user input
$("#search-button").on('click', function (e) {
  e.preventDefault();

  // get user input
  queryRawgParams.search = $("#title-input").val()

  if (queryRawgParams.search === "") {
    //Alert
    $('#staticBackdrop').modal('show');
    $('#staticBackdropLabel').text(textEmptyInput);
  }

  else {

    // get updated list of games from storage 
    taskObject = getTasks(taskSaved);

    // object to save to a local storage
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



// Button click on history
$("#games-history").on("click", function (e) {
  //queries this game 
  e.preventDefault()
  e.stopPropagation();
  $("#title-input").text("");
  queryRawgParams.search = $(e.target).text();
  requestGame();

})

// Button click to get anticipated games
$("#popular-games").on("click", function (e) {
  //queries this game 
 // e.preventDefault()
 // e.stopPropagation();
  $("#title-input").text("");
  requestAnticipatedGames();

})

// get most anticipated games for next year (10 games maxfor PC)

function requestAnticipatedGames() {

  let nextYear = new Date().getFullYear() + 1;
  queryRAWGanticipatedURL = "https://api.rawg.io/api/games?platforms=4&page_size=10&page=1&dates=" + nextYear + "-01-01," + nextYear + "-12-31&ordering=-added&"

  // clear previous records
  $("#games-list").empty();

  // API call
  $.ajax({
    url: queryRAWGanticipatedURL + $.param(queryRawgParams),
    method: "GET"
  }).then(function (responseRAWG) {

   // console.log(responseRAWG)
    // reduce amount of records to display
    let maxResponseLength = 0
    if (responseRAWG.results.length > 10) {
      maxResponseLength = 10

    }
    else {
      maxResponseLength = responseRAWG.results.length;
    }

    // action if no results returned

    if (responseRAWG.results.length === 0) {
      //Alert
      $('#staticBackdrop').modal('show');
      $('#staticBackdropLabel').text(textGameNotFound);

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
        $(buttonTitle).attr({ "data-gameid": gameID, class: "btn w-100 mb-1 p-2" });
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

       // console.log(responseCheapShark)

        if (responseCheapShark.length === 0) {
          //Alert
          $('#staticBackdrop').modal('show');
          $('#staticBackdropLabel').text(textDealsNotFound);

        }
        else {

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
            let markup = $("<tr>").append($("<td>").text(gamePlatformName))
              .append($("<td>").text(gameRPrice))
              .append($("<td>").text(gameSPrice))
              .append($("<td>").text(gameDiscount))
              .append($("<td>").append($("<a>", {
                "href": dealURL + gameDealID,
                "target": "_blank",
                "class": "buyButton"
              }).text("Buy")));

            $(".deal-table tbody").append(markup);

            if (gameDiscount >= 50) {
              $(".buyButton").css("background", "red");
            }


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


// get some data on load
getStores()
renderButtons()




