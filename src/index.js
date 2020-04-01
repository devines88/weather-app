function formatData(now) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let weekDay = days[now.getDay()];
  let hour = now.getHours();
  let minutes = now.getMinutes();
  return `${weekDay} ${addZero(hour)}:${addZero(minutes)}`;
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function handleSubmitCity(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#cityName");
  if (searchCity.value && searchCity.value.trim().length > 0) {
    let unit = getWeatherUnit();
    getCityWeather(searchCity.value, null, null, unit);
    searchCity.value = "";
  }
}

function convertUnits(event) {
  event.preventDefault();
  //let currentTemperature = document.querySelector("#current-temperature");
  let currentUnit = document.querySelector("#current-unit");
  let weekUnits = document.querySelectorAll(".used-unit");
  let windUnit = document.querySelector("#wind-unit");
  let chosenUnit = unitLink.textContent;
  currentUnit.innerHTML = chosenUnit;
  weekUnits.forEach(day => (day.innerHTML = chosenUnit));

  if (chosenUnit === "C") {
    unitLink.innerHTML = "F";
    windUnit.innerHTML = "km/h";
    getCityWeather(
      document.querySelector("#current-city").textContent,
      null,
      null,
      "metric"
    );
  } else {
    unitLink.innerHTML = "C";
    windUnit.innerHTML = "mph";
    getCityWeather(
      document.querySelector("#current-city").textContent,
      null,
      null,
      "imperial"
    );
  }
}

function getCurrentLocationWeather() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}

function handlePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let unit = getWeatherUnit();
  getCityWeather(null, latitude, longitude, unit);
}

function getWeatherUnit() {
  let currentUnit = document.querySelector("#current-unit").innerHTML.trim();
  let unit;
  if (currentUnit === "C") {
    unit = "metric";
  } else {
    unit = "imperial";
  }
  return unit;
}

function getCityWeather(city, latitude, longitude, unit) {
  let key = "491127d7fac80a30edab9961c6790b41";
  let url;
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&&units=${unit}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&&units=${unit}`;
  }
  axios.get(url).then(showLocationWeather);
}

function showLocationWeather(response) {
  let cityName = document.querySelector("#current-city");
  let temperature = document.querySelector("#current-temperature");
  let description = document.querySelector("#weather-description");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  cityName.innerHTML = response.data.name;
  temperature.innerHTML = Math.round(response.data.main.temp);
  description.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = Math.round(response.data.wind.speed);
}

//Show current Day and time
let now = new Date();
let currentDayTime = document.querySelector("#current-day-time");
currentDayTime.innerHTML = formatData(now);

//Search weather in city
let form = document.querySelector("form");
form.addEventListener("submit", handleSubmitCity);

//Convert units (C, F)
let unitLink = document.querySelector("#unit-link");
unitLink.addEventListener("click", convertUnits);

//Current location weather
let button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentLocationWeather);

//Get current location weather on load
getCurrentLocationWeather();
