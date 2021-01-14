var tempConvert;
var weatherIcon;
var iconURL;
var lat;
var long;
var uvURL;
var currentDate;
var fiveDayIcon;
var history;
var counter;
var cityInput;
var localstorage = JSON.parse(localStorage.getItem("historylist"));
if (localstorage) {
    console.log("localstorage:", localstorage.length - 1);
  
    getweather(localstorage[localstorage.length - 1]);
  }
  
  //function created in order to make api calls in multiple places
  function getweather(city) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=5e133bfa196135d4259ada67ef98d8db";
    var apiKey = "5e133bfa196135d4259ada67ef98d8db";
     //ajax call for the present day forecast
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // console.log("response:", response);
    tempConvert = Math.round((response.main.temp - 273.15) * 1.8 + 32);
    weatherIcon = response.weather[0].icon;
    iconURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    lat = response.coord.lat;
    lon = response.coord.lon;
    uvURL =
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=5e133bfa196135d4259ada67ef98d8db";
       //attaching ajax call data to html elements
    $("#daily-div").removeClass("hide");
    $("#city-date").text(response.name + " (" + (moment().format("l") + ")"));
    $("#city-date").append("<span><img src=" + iconURL + "></span>");
    $("#temp-p").text("Temperature: " + tempConvert + " °F");
    $("#humid-p").text("Humidity: " + response.main.humidity + "%");
    $("#wind-p").text("Wind Speed: " + response.wind.speed + " MPH");
     //second ajax call for UV index
     $.ajax({
        url: uvURL,
        method: "GET",
      }).then(function (response) {
        uvValue = response.value;
        $("#UV-p").html(
          "<p>UV Index:<span id='uvText'> " + response.value + "</span></p>"
        );
        //color coats the UV index based on the value
      if (response.value < 3) {
        $("#uvText").addClass("bg-success");
      } else if (response.value > 2 || response.value < 8) {
        $("#uvText").addClass("bg-warning");
      } else {
        $("#uvText").addClass("bg-danger");
      }
    });
  });

  var fivedayinput = city;
  var fivedayURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    fivedayinput +
    "&appid=a40d7a1a6831874bf11b6952becc82c2";
  //third ajax call for the 5 day forecast
  $.ajax({
    url: fivedayURL,
    method: "GET",
  }).then(function (response) {
    console.log("responsefiveday:", response);
    //loop that retrieves the 5 day forecast information for 3pm for each day
    for (let i = 0; i < response.list.length; i++) {
      if (response.list[i].dt_txt.indexOf("15:00:00") > 0) {
        // console.log(response.list[i]);
        tempConvert = Math.round(
          (response.list[i].main.temp - 273.15) * 1.8 + 32
        );
        fiveDayIcon = response.list[i].weather[0].icon;
        fiveDayIconURL =
          "https://openweathermap.org/img/wn/" + fiveDayIcon + "@2x.png";
        var dateFormat = moment(response.list[i].dt_txt).format("l");
        var cardWeather = `<div
            class="text-white bg-primary card col-md-2 daily-space"
            style="width: 18rem"
          >
            <div class="card-body">
              <h5 class="five-day-date card-title">${dateFormat}</h5>
              <span class="five-day-icon"><img src=${fiveDayIconURL}></span>
              <p class="five-day-temp">Temp: ${tempConvert} °F</p>
              <p class="five-day-humid">Humidity: ${response.list[i].main.humidity} %</p>
            </div>
          </div>`;

        $("#five-day-div").removeClass("hide");
        $("#fivedaycards").append(cardWeather);
      }
    }
  });
   //retreiving history from local storage IF the city thats being search is not in the history list
   var historylist = JSON.parse(localStorage.getItem("historylist")) || [];
   if (historylist.indexOf(city) === -1) {
     $("#historydiv").removeClass("hide");
     historylist.push(city);
   }
   //saving updated data back to local storage
   localStorage.setItem("historylist", JSON.stringify(historylist));
   //removing current html and empties history contents from html
   $("#history").html("");
   historylist.forEach((history) => {
     var item = $("<li>").text(history).addClass("list-group-item");
     item.on("click", function (event) {
       $("#fivedaycards").empty();
       var city = event.target.innerText;
       getweather(city);
     });

     //adding <li> element to #history element
    $("#history").append(item);
});
}

$("#search-btn").click(function () {
$("#fivedaycards").empty();
event.preventDefault();
cityInput = $("#input").val();
getweather(cityInput);
});