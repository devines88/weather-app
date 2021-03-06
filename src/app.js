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
    getCityWeather(searchCity.value, null, null, unitSystem);
    searchCity.value = "";
  }
}

function convertUnitSystem(event) {
  event.preventDefault();
  let chosenUnit = unitLink.textContent;

  if (chosenUnit === "C") {
    unitSystem = "metric";
  } else {
    unitSystem = "imperial";
  }

  getCityWeather(
    document.querySelector("#current-city").textContent,
    null,
    null,
    unitSystem
  );

  unitLink.innerHTML = chosenUnit === "C" ? "F" : "C";
}

function getCurrentLocationWeather() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}

function handlePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getCityWeather(null, latitude, longitude, unitSystem);
}

function getCityWeather(city, latitude, longitude, unitSystem) {
  let key = "491127d7fac80a30edab9961c6790b41";
  let url;
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&&units=${unitSystem}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&&units=${unitSystem}`;
  }

  axios.get(url).then(displayLocationWeather);
}

function displayLocationWeather(response) {
  let cityName = document.querySelector("#current-city");
  let temperature = document.querySelector("#current-temperature");
  let temperatureUnit = document.querySelector("#current-unit");
  let description = document.querySelector("#weather-description");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let windUnit = document.querySelector("#wind-unit");
  let dateTime = document.querySelector("#current-day-time");
  let weatherIcon = document.querySelector("#weather-icon");

  cityName.innerHTML = response.data.city.name;
  temperature.innerHTML = Math.round(response.data.list[0].main.temp);
  temperatureUnit.innerHTML = unitSystem === "metric" ? "C" : "F";
  description.innerHTML = response.data.list[0].weather[0].description;
  humidity.innerHTML = response.data.list[0].main.humidity;
  wind.innerHTML = Math.round(response.data.list[0].wind.speed);
  windUnit.innerHTML = unitSystem === "metric" ? "m/s" : "mph";
  dateTime.innerHTML = formatDate(response.data.list[0].dt);
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.list[0].weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.list[0].weather[0].description);
  weatherIcon.setAttribute(
    "title",
    response.data.list[0].weather[0].description
  );

  saveForecast(response);
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
}

function displayForecast(preditions) {
  let forecastDays = document.querySelector("#forecast-days");
  let forecastIcons = document.querySelector("#forecast-icons");
  let forecastTemperatures = document.querySelector("#forecast-temperatures");
  let currentUnit = unitSystem === "metric" ? "C" : "F";

  let weekDaysHTML = "";
  let iconsHTML = "";
  let temperaturesHTML = "";
  for (let i = 0; i < preditions.length; i++) {
    weekDaysHTML += `<th scope="col">${preditions[i].day}</th>`;
    iconsHTML += `<td><img src="http://openweathermap.org/img/wn/${preditions[i].icon}@2x.png" alt="${preditions[i].description}" title="${preditions[i].description}" id="forecast-icon"></td>`;
    temperaturesHTML += `<td>${Math.round(
      preditions[i].temp
    )}º<span class="used-unit"> ${currentUnit}</span></td>`;
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
unitLink.addEventListener("click", convertUnitSystem);

//Current location weather
let button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentLocationWeather);

let unitSystem = "metric";
getCityWeather("Lisbon", null, null, unitSystem);
