function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let weekDay = days[date.getDay()];
  let hour = date.getHours();
  let minutes = date.getMinutes();
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
    displayCityWeather(searchCity.value, null, null, unit);
    searchCity.value = "";
  }
}

function convertUnits(event) {
  event.preventDefault();
  let currentUnit = document.querySelector("#current-unit");
  let weekUnits = document.querySelectorAll(".used-unit");
  let windUnit = document.querySelector("#wind-unit");
  let chosenUnit = unitLink.textContent;
  currentUnit.innerHTML = chosenUnit;
  weekUnits.forEach(day => (day.innerHTML = chosenUnit));

  if (chosenUnit === "C") {
    unitLink.innerHTML = "F";
    windUnit.innerHTML = "km/h";
    displayCityWeather(
      document.querySelector("#current-city").textContent,
      null,
      null,
      "metric"
    );
  } else {
    unitLink.innerHTML = "C";
    windUnit.innerHTML = "mph";
    displayCityWeather(
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
  displayCityWeather(null, latitude, longitude, unit);
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

function displayCityWeather(city, latitude, longitude, unit) {
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
  let dateTime = document.querySelector("#current-day-time");
  let weatherIcon = document.querySelector("#weather-icon");

  cityName.innerHTML = response.data.name;
  temperature.innerHTML = Math.round(response.data.main.temp);
  description.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = Math.round(response.data.wind.speed);
  dateTime.innerHTML = formatDate(response.data.dt);
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  weatherIcon.setAttribute("title", response.data.weather[0].description);
}

function fiveDaysForecast(city) {
  let key = "491127d7fac80a30edab9961c6790b41";
  let url;

  url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&&units=metric`;

  axios.get(url).then(saveForecast);
}

function saveForecast(response) {
  let preditions = [];
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 7; i < response.data.list.length; i += 8) {
    let date = new Date(response.data.list[i].dt * 1000);
    preditions.push({
      day: days[date.getDay()],
      temp: response.data.list[i].main.temp,
      icon: response.data.list[i].weather[0].icon,
      description: response.data.list[i].weather[0].description
    });
  }
  displayForecast(preditions);
  console.log(response.data);
}
fiveDaysForecast("Sidney");

function displayForecast(preditions) {
  let forecastDays = document.querySelector("#forecast-days");
  let forecastIcons = document.querySelector("#forecast-icons");
  let forecastTemperatures = document.querySelector("#forecast-temperatures");

  let weekDaysHTML = "";
  let iconsHTML = "";
  let temperaturesHTML = "";
  for (let i = 0; i < preditions.length; i++) {
    console.log(preditions[i].day);
    weekDaysHTML += `<th scope="col">${preditions[i].day}</th>`;
    iconsHTML += `<td><img src="http://openweathermap.org/img/wn/${preditions[i].icon}@2x.png" alt="${preditions[i].description}" title="${preditions[i].description}" id="forecast-icon"></td>`;
    temperaturesHTML += `<td>${Math.round(
      preditions[i].temp
    )}º<span class="used-unit"> C</span></td>`;
  }
  forecastDays.innerHTML = weekDaysHTML;
  forecastIcons.innerHTML = iconsHTML;
  forecastTemperatures.innerHTML = temperaturesHTML;
}

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
//getCurrentLocationWeather();
displayCityWeather("Sidney", null, null, "metric");
