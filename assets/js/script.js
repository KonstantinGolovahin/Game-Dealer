/*  const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://rawg-video-games-database.p.rapidapi.com/games/",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "4d3c85eb44b84a48a052214685745b50",
		"X-RapidAPI-Host": "rawg-video-games-database.p.rapidapi.com",
        "search":"Witcher 3",
        "search_exact":"true"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});  */


// search string
let searchText ="The Witcher 3"
// query for RAWG API call (1 stage) - exact search PC only, 10 units max
let apiRAWGURL = "https://api.rawg.io/api/games?key="+keyRAWG +"&search="+ searchText +"&search_exact=1&exclude_additions=1,platforms=4&page_size=10&page=1&ordering=-rating"
// game name to be used for CheapShark API
let resultGame =""

 $.ajax({
    url: apiRAWGURL,
    method: "GET"
  }).then(function(responseRAWG) {
  
    console.log(responseRAWG)

 
    for(i=0;i<responseRAWG.results.length;i++) {
        console.log(responseRAWG.results[i].name)
        console.log(responseRAWG.results[i].background_image)
        console.log(responseRAWG.results[i].rating)
        // add elements to HTML + add classes from CSS

    }

    // add click functionality to buttons to call chepshark

  
  
  }); 
 

resultGame = "Witcher 3";
// lists all deals for the specific input (10 deals, but still returns more)
  let apiCheapSharkURL= "https://www.cheapshark.com/api/1.0/deals?title="+resultGame +"&limit=10"


  $.ajax({
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
