var appId = "78419ddf4afd14ddbb439371f8aad916";
var units = "metric";

function renderTime() {
  /*DATE*/
  var date = new Date();
  var year = date.getFullYear();
  if (year < 1000) {
    year = +1900;
  }
  var day = date.getDay();
  var month = date.getMonth();
  var daym = date.getDate();
  var dayarray = new Array(
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  );

  var montharray = new Array(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  );

  /*TIME*/
  var clock = new Date();
  var hr = clock.getHours();
  var min = clock.getMinutes();
  var sec = clock.getSeconds();
  if (hr == 24) {
    hr = 0;
  } else if (hr > 12) {
    hr = hr - 0;
  }

  if (hr < 10) {
    hr = "0" + hr;
  }

  if (min < 10) {
    min = "0" + min;
  }

  if (sec < 10) {
    sec = "0" + sec;
  }

  var myClock = document.getElementById("clockDisplay");
  myClock.innerHTML =
    " " +
    dayarray[day] +
    " " +
    daym +
    " " +
    montharray[month] +
    " " +
    year +
    "<br/>" +
    hr +
    ":" +
    min +
    ":" +
    sec;
  setTimeout(renderTime, 1000);
}

//Get weather info//

var weatherinfo = document.getElementById("weatherinfo");
var temperature = document.getElementById("temperature");
var city = document.getElementById("city");
var weathericon = document.getElementById("weathericon");
var windSpeed = document.getElementById("windSpeed");
var humidity = document.getElementById("humidity");

//Get background image according to weather//
function init(resultFromServer) {
  switch (resultFromServer.weather[0].main) {
    case "Clear":
      document.body.style.backgroundImage = 'url("images/clear-day.jpg")';
      break;

    case "Clouds":
      document.body.style.backgroundImage = 'url("images/cloudy-day.jpg")';
      break;

    case "Rain":
      document.body.style.backgroundImage = 'url("images/Rainy-Day.jpg")';
      break;

    case "Snow":
      document.body.style.backgroundImage = 'url("images/snow-day.jpg")';
      break;

    default:
      break;
  }

  weathericon.src =
    "https://openweathermap.org/img/w/" +
    resultFromServer.weather[0].icon +
    ".png";

  var resultInfo = resultFromServer.weather[0].description;
  weatherinfo.innerText =
    resultInfo.charAt(0).toUpperCase() + resultInfo.slice(1);

  temperature.innerHTML =
    Math.floor(resultFromServer.main.temp) + "&#176" + "C";
  city.innerHTML = resultFromServer.name;
  windSpeed.innerHTML =
    "Wind: " + Math.floor(resultFromServer.wind.speed) + "m/s";
  humidity.innerHTML = "Humidity: " + resultFromServer.main.humidity + "%";
}

window.addEventListener("load", () => {
  renderTime();

  function getSearchMethod(searchTerm) {
    if (
      searchTerm.length == 5 &&
      Number.parseInt(searchTerm) + "" == searchTerm
    )
      searchMethod = "zip";
    else searchMethod = "q";
  }

  function searchWeather(searchTerm) {
    getSearchMethod(searchTerm);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`
    )
      .then((result) => {
        return result.json();
      })
      .then((result) => {
        init(result);
      });
  }

  document.getElementById("btn").addEventListener("click", () => {
    "use strict";
    var searchTerm = document.getElementById("searchinput").value;
    if (searchTerm) searchWeather(searchTerm);
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      var long = position.coords.longitude;
      var lat = position.coords.latitude;
      var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${appId}&units=${units}`;

      fetch(url)
        .then((result) => {
          return result.json();
        })
        .then((result) => {
          init(result);
        });
      weeklyWeather(long, lat);
    });
  }
});

function weeklyWeather(lat, long) {
  var exclude = ["current", "minutely", "hourly", "alerts"];
  var weather = ` https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=${exclude}&APPID=${appId}&units=${units}`;

  fetch(weather)
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      showDailyWeather(result);
    });
}

function showDailyWeather(resultFromServer) {
  var daily = resultFromServer.daily;
  daily.shift();
  daily.map((day) => {
    var dt = day.dt;
    var date = new Date(dt * 1000);
    var dayNum = date.getDate();
    var dayOfWeek = date.getDay();
    var month = date.getMonth() + 1;
    var dayarray = new Array(
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    );
    var thisday = dayNum + "/" + month + " " + dayarray[dayOfWeek];

    var getWeather = day.weather[0].main;
    var getIcon =
      "https://openweathermap.org/img/w/" + day.weather[0].icon + ".png";
    var getTemp = Math.floor(day.temp.day) + "&#176" + "C";
    var ul = document.querySelector("ul");
    var list = document.createElement("li");
    list = `<li>
    <div>
    <h1>${thisday}</h1>
    <h2>${getTemp}</h2>
    </div>
    <div>
    <img src="${getIcon}" alt="weather icon"/>
    <h3>${getWeather}</h3>
    </div>
    </li>`;

    ul.innerHTML += list;
  });
}
