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
      "&appid=a40d7a1a6831874bf11b6952becc82c2";
    var apiKey = "5e133bfa196135d4259ada67ef98d8db";