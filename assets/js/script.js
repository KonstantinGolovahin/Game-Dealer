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

let keyRAWG =""
// search string
let searchText =""
// query for RAWG API call (1 stage) - exact search PC only
let queryURL = "https://api.rawg.io/api/games?keyRAWG&search=Halo 2&search_exact=1&exclude_additions=1,platforms=4"
// game name to be used for CheapShark API
let resultGame =""

$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
  
    console.log(response)


    for(i=0;i<response.results.length;i++) {
        console.log(response.results[i].name)
        console.log(response.results[i].background_image)
        console.log(response.results[i].rating)

    }

    

  
  
  }); 