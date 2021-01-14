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