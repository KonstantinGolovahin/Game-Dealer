// search string
let searchText
// query for RAWG API call (1 stage) - exact search PC only, 10 units max
//let apiRAWGURL = "https://api.rawg.io/api/games?key="+keyRAWG +"&search="+ searchText +"&search_exact=1&exclude_additions=1,platforms=4&page_size=10&page=1&ordering=-rating"
// game name to be used for CheapShark API
let resultGame = ""


// query build for searching for a game
let queryRawgURL = "https://api.rawg.io/api/games?search_exact=1&exclude_additions=1,platforms=4&page_size=10&page=1&ordering=-rating&"
let queryRawgParams = { "key": keyRAWG };
queryRawgParams.search

// query to get game details requires ID (can be stored to history)

//https://api.rawg.io/api/games/1/?key=4d3c85eb44b84a48a052214685745b50

let gameID ;
let queryRawgDetails;
//let queryRawgDetails = "https://api.rawg.io/api/games/" + gameID + "?"
queryRawgDetailsParams = { "key": keyRAWG };



// lists all deals for the specific input (10 deals, but still returns more)
// let apiCheapSharkURL= "https://www.cheapshark.com/api/1.0/deals?title="+resultGame +"&limit=10"

let queryCheapSharkURL = "https://www.cheapshark.com/api/1.0/deals?limit=10&exact=1&"
let queryCheapSharkURLParams = { "title": resultGame }



// get list of stores for deals
let storeListURL = "https://www.cheapshark.com/api/1.0/stores"
let storesArray =[]


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
      $(taskButton).attr("class", "taskButton");
      $("#history").append(taskButton);
    }
  }

  // create clear history button
  let clearHistoryButton = document.createElement('button');
  $(clearHistoryButton).text("Clear history");
  $(clearHistoryButton).attr("class", "clearHistoryButton");
  $("#history").append(clearHistoryButton);

}








/*  $.ajax({
   url: apiCheapSharkURL,
   method: "GET"
 }).then(function(responseCheapShark) {
 
   console.log(responseCheapShark)

 
    for(i=0;i<responseCheapShark.length;i++) {
       console.log(responseCheapShark[i].title)
       console.log(responseCheapShark[i].salePrice)
       console.log(responseCheapShark[i].normalPrice)
       console.log(responseCheapShark[i].isOnSale) // this should be converted to Sale/ no Sale or something similar
       console.log(responseCheapShark[i].dealID)
       console.log(responseCheapShark[i].storeID)  // need a list of stores???

       //needs to be sorted asc by price
   } 

   

 
 
 }); 
*/

function requestGame() {

  // API call
  $.ajax({
    url: queryRawgURL + $.param(queryRawgParams),
    method: "GET"
  }).then(function (responseRAWG) {

    console.log(responseRAWG)


    for (i = 0; i < responseRAWG.results.length; i++) {
      console.log(responseRAWG.results[i].name)
      // console.log(responseRAWG.results[i].background_image)
      // console.log(responseRAWG.results[i].rating)
      console.log(responseRAWG.results[i].id)
      // add elements to HTML + add classes from CSS
      let gameTitle = responseRAWG.results[i].name;
      // let gameImgURL = responseRAWG.results[i].background_image;
      // let gameRating = responseRAWG.results[i].rating;
      let gameID = responseRAWG.results[i].id;

      // dynamically create a set of buttons for ul (buttons only + data attribute as ID for getting game details)
      let cardContainer;
      cardContainer = $("#games-list");

      //card itself
     // let card = $("<div>");
      // $(card).attr("class", "card card-forecast");
      // card body
     // let cardBody = $("<div>");
     // $(cardBody).attr("class", "card-body");

      // Title
      let taskTitle = $("<button>");
      $(taskTitle).text(gameTitle);
      $(taskTitle).attr({ "data-gameid": gameID, class: "btn btn-secondary btn-block mb-1 p-2" });
      // Image
      // let taskImg = $("<img>");
      // let taskURL = gameImgURL;
      // $(taskImg).attr({ src: taskURL, alt: gameTitle, class: "taskIMG" });

      // Rating
      // let taskRating = $("<p>");
      // $(taskRating).text("Rating: " + gameRating);
      //$(taskRating).attr("class", "taskText");

      // ID (could be invisible? purely for keeping a reference)
     // let taskID = $("<p>");
     // $(taskID).text(gameID);
     // $(taskID).attr("class", "invisible");

      // set card body element order
     // $(cardBody).append(taskTitle);
      // $(cardBody).append(taskImg);
      // $(cardBody).append(taskRating);
     // $(cardBody).append(taskID);

      // set a card body inside a card
     // $(card).append(cardBody);
      $(cardContainer).append(taskTitle);

    }

    // adds click functionality to buttons to call cheapshark if there is a button (could be image). Some games might not appear 

    $("#games-list").on("click", function (e) {

      
      // get game name for Cheap Shark
      queryCheapSharkURLParams.title = $(e.target).text();

      $.ajax({
        url: queryCheapSharkURL + $.param(queryCheapSharkURLParams),
        method: "GET"
      }).then(function (responseCheapShark) {

        console.log(responseCheapShark)

        for (i = 0; i < responseCheapShark.length; i++) {
          //  console.log(responseCheapShark[i].title)
          let gameRPrice = responseCheapShark[i].normalPrice;
          let gameSPrice = responseCheapShark[i].salePrice;
          let gameDealID = responseCheapShark[i].dealID;
          let gamePlatformID = responseCheapShark[i].storeID;
          let gamePlatformName;

// get store name from a previously received array
          for (j=0;j<storesArray.length;j++) {
            if(gamePlatformID===storesArray[j].storeID){
              gamePlatformName=storesArray[j].storeName
            }

          }

          //discount value as % from 100%
          let gameDiscount = 100- ( Math.round(gameSPrice / gameRPrice * 100) )
          

      let markup = "<tr><td>"+gamePlatformName+" </td><td>" + gameRPrice + "</td><td>" + gameSPrice + "</td><td>" + gameDiscount + "</td><td><button> Buy</button></td></tr>";
      $(".deal-table tbody").append(markup);


         // console.log(gameSPrice)
         // console.log(gameRPrice)
          // console.log(responseCheapShark[i].isOnSale) // this should be converted to Sale/ no Sale or something similar
         // console.log(gameDealID)
         // console.log(gamePlatformID)  // need a list of stores???
         // console.log(gameDiscount)
          //
        }


      });


      // second call to get game details using RAWG single game details

      // need a game ID
gameID=$(e.target).attr('data-gameid');
queryRawgDetails = "https://api.rawg.io/api/games/" + gameID + "?"

      $.ajax({
        url: queryRawgDetails + $.param(queryRawgDetailsParams),
        method: "GET"
      }).then(function (responseRawgDetails) {


        // get elements
        let gameTitle = responseRawgDetails.name;
        let gameDescription=responseRawgDetails.description_raw;
        let gamebackgroundURL = responseRawgDetails.background_image;
        let gameRating=responseRawgDetails.rating;
        // display elements
        $(".game-title").text(gameTitle)
        $(".game-description").text(gameDescription)
        $(".game-rating").text("Rating: " +gameRating)
        $("#game-output").find("img").attr({ src: gamebackgroundURL, alt: gameTitle });


        console.log(responseRawgDetails)
        //console.log(RawgDetails[i].name)
        //console.log(RawgDetails[i].description)
        //console.log(RawgDetails[i].background_image)
        // console.log(RawgDetails[i].isOnSale) // this should be converted to Sale/ no Sale or something similar
        //console.log(RawgDetails[i].dealID)
        // console.log(RawgDetails[i].storeID)  // need a list of stores???

        //needs to be sorted asc by price



      });


    })


  });

}


$("#search-button").on('click', function (e) {
  e.preventDefault();


  // get user input
  queryRawgParams.search = $("#title-input").val()
  searchText = $("#title-input").val()

  //alert(searchText)

  if (queryRawgParams.search === "") {
    // alert should be changed to modal (html+CSS)
    alert("Please enter game title")
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





function getStores() {




  $.ajax({
    url: storeListURL,
    method: "GET"
  }).then(function (responseStores) {



    for(i=0;i<responseStores.length;i++){


      let storeObject = {
        storeID: responseStores[i].storeID,
        storeName:responseStores[i].storeName
        
        
    }
    storesArray.push(storeObject)

    }

    console.log(storesArray)
    console.log(storesArray[0].storeID)
    console.log(storesArray[0].storeName)

  });
}


getStores()




