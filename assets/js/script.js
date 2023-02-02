


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



// lists all deals for the specific input (10 deals, but still returns more)
// let apiCheapSharkURL= "https://www.cheapshark.com/api/1.0/deals?title="+resultGame +"&limit=10"

let queryCheapSharkURL = "https://www.cheapshark.com/api/1.0/deals?limit=10&"
let queryCheapSharkURLParams = { "title": resultGame }




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
  $("#history").empty()
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

function requestGame(){

    // API call
    $.ajax({
      url: queryRawgURL + $.param(queryRawgParams),
      method: "GET"
    }).then(function (responseRAWG) {

      console.log(responseRAWG)


      for (i = 0; i < responseRAWG.results.length; i++) {
        console.log(responseRAWG.results[i].name)
        console.log(responseRAWG.results[i].background_image)
        console.log(responseRAWG.results[i].rating)
        // add elements to HTML + add classes from CSS
        let gameTitle = responseRAWG.results[i].name;
        let gameImgURL = responseRAWG.results[i].background_image;
        let gameRating = responseRAWG.results[i].rating;

        // dynamically create a set of cards for a list of array elements
        let cardContainer;
        cardContainer = $("#list-games");

        //card itself
        let card = $("<div>");
        $(card).attr("class", "card card-forecast");
        // card body
        let cardBody = $("<div>");
        $(cardBody).attr("class", "card-body");

        // Title
        let taskTitle = $("<button>");
        $(taskTitle).text(gameTitle);
        $(taskTitle).attr("class", "taskTitle");
        // Image
        let taskImg = $("<img>");
        let taskURL = gameImgURL;
        $(taskImg).attr({ src: taskURL, alt: gameTitle, class: "taskIMG" });

        // Rating
        let taskRating = $("<p>");
        $(taskRating).text("Rating: " + gameRating);
        //$(taskRating).attr("class", "taskText");

        // set card body element order
        $(cardBody).append(taskTitle);
        $(cardBody).append(taskImg);
        $(cardBody).append(taskRating);

        // set a card body inside a card
        $(card).append(cardBody);
        $(cardContainer).append(card);

      }

      // adds click functionality to buttons to call cheapshark if there is a button (could be image). Some games might not appear 

      $(".taskTitle").on("click", function (e) {


        queryCheapSharkURLParams.title = $(e.target).text();
        
        $.ajax({
          url: queryCheapSharkURL + $.param(queryCheapSharkURLParams),
          method: "GET"
        }).then(function (responseCheapShark) {

          console.log(responseCheapShark)

          for (i = 0; i < responseCheapShark.length; i++) {
            console.log(responseCheapShark[i].title)
            console.log(responseCheapShark[i].salePrice)
            console.log(responseCheapShark[i].normalPrice)
            console.log(responseCheapShark[i].isOnSale) // this should be converted to Sale/ no Sale or something similar
            console.log(responseCheapShark[i].dealID)
            console.log(responseCheapShark[i].storeID)  // need a list of stores???

            //needs to be sorted asc by price
          }


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



    // get updated list of tasks from storage 
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



