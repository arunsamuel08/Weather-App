// Now working with dates

const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthNames = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const getDate = function (unixtimestamp, timezone) {
  const date = new Date((unixtimestamp + timezone) * 1000);
  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getMonth()];

  return `${weekDayName}, ${date.getUTCDate()} ${monthName} ${date.getUTCFullYear()}`;
};

const getTime = function (unixtimestamp, timezone) {
  const date = new Date((unixtimestamp + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  return `${hours.toString().padStart(2, 0)}:${minutes
    .toString()
    .padStart(2, 0)}`;
};

// lets work with AQI

// constants for search box and search button
const searchbox = document.querySelector(".input-container2 input");
const searchbtn = document.querySelector(".input-container2 button");

// api key constant
const apikey = "09fc3bd281fbcbf3679e6880f6a323eb";

// geocode api url
const geoURL = "http://api.openweathermap.org/geo/1.0/direct?&limit=5&q=";

// current weather api url
const curweatherURL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// async function to fetch for api
async function getlatlon(city) {
  // current weather fetch call
  const currentWeather = await fetch(curweatherURL + city + `&appID=${apikey}`);
  var weatherdata = await currentWeather.json();

  // Need latitude and Longitude to use aqi API
  const lat = weatherdata.coord.lat;
  const lon = weatherdata.coord.lon;
  const timezone = weatherdata.timezone;

  document.querySelector(".cityname").innerHTML = weatherdata.name + ",";
  document.querySelector(".temperature").innerHTML =
    Math.round(weatherdata.main.temp) + "°C";
  document.querySelector(".temp-max").innerHTML =
    weatherdata.main.temp_max.toFixed(0) + "°C";
  document.querySelector(".temp-min").innerHTML =
    weatherdata.main.temp_min.toFixed(0) + "°C";

  // conditionals to change the weather image
  if (weatherdata.weather[0].main == "Mist") {
    document.querySelector(".weather img").src = "assets/images/mist.png";
    document.querySelector(".climatetype").innerHTML = "Mist";
  } else if (weatherdata.weather[0].main == "Clouds") {
    document.querySelector(".weather img").src = "assets/images/clouds.png";
    document.querySelector(".climatetype").innerHTML = "Clouds";
  } else if (weatherdata.weather[0].main == "Thunderstorm") {
    document.querySelector(".weather img").src =
      "assets/images/thunderstorm.png";
    document.querySelector(".climatetype").innerHTML = "Thunderstorm";
  } else if (weatherdata.weather[0].main == "Rain") {
    document.querySelector(".weather img").src = "assets/images/rain.png";
    document.querySelector(".climatetype").innerHTML = "Rain";
  } else if (
    (weatherdata.weather[0].main == "Clear" &&
      getTime(weatherdata.dt, timezone) <= "05:00") ||
    getTime(weatherdata.dt, timezone) >= "19:00"
  ) {
    document.querySelector(".weather img").src = "assets/images/moon.png";
    document.querySelector(".climatetype").innerHTML = "Clear";
  } else if (weatherdata.weather[0].main == "Snow") {
    document.querySelector(".weather img").src = "assets/images/snowflake.png";
    document.querySelector(".climatetype").innerHTML = "Snow";
  } else if (weatherdata.weather[0].main == "Haze") {
    document.querySelector(".weather img").src = "assets/images/haze.png";
    document.querySelector(".climatetype").innerHTML = "Haze";
  }
  // other details updation

  // document.querySelector(".windspeed").innerHTML =
  //   weatherdata.wind.speed.toFixed(1) + " km/h";

  // document.querySelector(".humidity").innerHTML =
  //   weatherdata.main.humidity + "%";

  // document.querySelector(".visibility").innerHTML =
  //   weatherdata.visibility / 1000 + "km";

  document.querySelector(".detail-desc").innerHTML =
    weatherdata.weather[0].description.charAt(0).toUpperCase() +
    weatherdata.weather[0].description.slice(1);

  // document.querySelector(".pressure span").innerHTML =
  //   weatherdata.main.pressure + " hPa";

  // date updation
  document.querySelector(".datetime").innerHTML = getDate(
    weatherdata.dt,
    weatherdata.timezone
  );

  // GEOCODE

  const geocodeURL =
    "http://api.openweathermap.org/geo/1.0/reverse?&limit=1&appid=09fc3bd281fbcbf3679e6880f6a323eb";

  async function reversegeocode() {
    const geocode = await fetch(geocodeURL + `&lat=${lat}` + `&lon=${lon}`);
    var geodata = await geocode.json();
    const countryname = geodata[0].country;

    document.querySelector(".countrycode").innerHTML = countryname;
  }

  reversegeocode();

  // forecast data

  const forecastURL =
    "http://api.openweathermap.org/data/2.5/forecast?&appid=09fc3bd281fbcbf3679e6880f6a323eb&units=metric";

  async function getforecast() {
    const forecastresponse = await fetch(
      forecastURL + `&lat=${lat}` + `&lon=${lon}`
    );
    var forecastdata = await forecastresponse.json();

    const forecastTime = getTime(forecastdata.list[0].dt, timezone);
    console.log(forecastTime);

    const forecastdates = [];
    forecastdata.list.forEach(forecast => {
      forecastdates.push(forecast.dt_txt);
    });

    // Card1

    if (forecastdata.list[0].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(1) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[0].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(1) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[0].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(1) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[0].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(1) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[0].weather[0].main == "Clear" &&
        getTime(forecastdata.list[0].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[0].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(1) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[0].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(1) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[0].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(1) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[0].weather[0].main == "Clear" &&
        getTime(forecastdata.list[0].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[0].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(1) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(1) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[0].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(1) .date").innerHTML = getDate(
      forecastdata.list[0].dt,
      timezone
    ).substring(0, 10);

    document.querySelector(".forecast1:nth-child(1) .time").innerHTML = getTime(
      forecastdata.list[0].dt,
      timezone
    );

    // Card 2

    if (forecastdata.list[1].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(2) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[1].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(2) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[1].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(2) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[1].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(2) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[1].weather[0].main == "Clear" &&
        getTime(forecastdata.list[1].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[1].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(2) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[1].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(2) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[1].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(2) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[1].weather[0].main == "Clear" &&
        getTime(forecastdata.list[1].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[1].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(2) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(2) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[1].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(2) .date").innerHTML = getDate(
      forecastdata.list[1].dt,
      timezone
    ).substring(0, 10);

    document.querySelector(".forecast1:nth-child(2) .time").innerHTML = getTime(
      forecastdata.list[1].dt,
      timezone
    );

    // Card3

    if (forecastdata.list[2].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(3) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[2].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(3) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[2].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(3) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[2].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(3) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[2].weather[0].main == "Clear" &&
        getTime(forecastdata.list[2].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[2].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(3) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[2].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(3) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[2].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(3) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[2].weather[0].main == "Clear" &&
        getTime(forecastdata.list[2].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[2].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(3) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(3) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[2].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(3) .date").innerHTML = getDate(
      forecastdata.list[2].dt,
      timezone
    ).substring(0, 10);

    document.querySelector(".forecast1:nth-child(3) .time").innerHTML = getTime(
      forecastdata.list[2].dt,
      timezone
    );

    // Card 4

    if (forecastdata.list[3].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(4) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[3].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(4) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[3].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(4) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[3].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(4) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[3].weather[0].main == "Clear" &&
        getTime(forecastdata.list[3].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[3].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(4) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[3].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(4) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[3].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(4) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[3].weather[0].main == "Clear" &&
        getTime(forecastdata.list[3].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[3].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(4) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(4) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[3].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(4) .date").innerHTML = getDate(
      forecastdata.list[3].dt,
      timezone
    ).substring(0, 10);

    document.querySelector(".forecast1:nth-child(4) .time").innerHTML = getTime(
      forecastdata.list[3].dt,
      timezone
    );

    // Card 5

    if (forecastdata.list[4].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(5) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[4].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(5) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[4].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(5) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[4].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(5) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[4].weather[0].main == "Clear" &&
        getTime(forecastdata.list[4].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[4].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(5) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[4].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(5) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[4].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(5) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[4].weather[0].main == "Clear" &&
        getTime(forecastdata.list[4].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[4].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(5) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(5) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[4].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(5) .date").innerHTML = getDate(
      forecastdata.list[4].dt,
      timezone
    ).substring(0, 10);

    document.querySelector(".forecast1:nth-child(5) .time").innerHTML = getTime(
      forecastdata.list[4].dt,
      timezone
    );

    // Card 6

    if (forecastdata.list[5].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(6) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[5].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(6) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[5].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(6) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[5].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(6) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[5].weather[0].main == "Clear" &&
        getTime(forecastdata.list[5].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[5].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(6) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[5].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(6) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[5].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(6) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[5].weather[0].main == "Clear" &&
        getTime(forecastdata.list[5].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[5].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(6) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(6) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[5].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(6) .date").innerHTML = getDate(
      forecastdata.list[5].dt,
      timezone
    ).substring(0, 10);

    document.querySelector(".forecast1:nth-child(6) .time").innerHTML = getTime(
      forecastdata.list[5].dt,
      timezone
    );

    // Card 7

    if (forecastdata.list[6].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(7) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[6].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(7) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[6].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(7) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[6].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(7) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[6].weather[0].main == "Clear" &&
        getTime(forecastdata.list[6].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[6].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(7) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[6].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(7) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[6].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(7) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[6].weather[0].main == "Clear" &&
        getTime(forecastdata.list[6].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[6].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(7) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(7) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[6].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(7) .date").innerHTML = getDate(
      forecastdata.list[6].dt,
      timezone
    ).substring(0, 10);

    document.querySelector(".forecast1:nth-child(7) .time").innerHTML = getTime(
      forecastdata.list[6].dt,
      timezone
    );

    // Card 8

    if (forecastdata.list[7].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(8) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[7].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(8) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[7].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(8) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[7].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(8) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[7].weather[0].main == "Clear" &&
        getTime(forecastdata.list[7].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[7].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(8) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[7].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(8) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[7].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(8) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[7].weather[0].main == "Clear" &&
        getTime(forecastdata.list[7].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[7].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(8) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(8) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[7].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(8) .date").innerHTML = getDate(
      forecastdata.list[7].dt,
      timezone
    ).substring(0, 10);

    document.querySelector(".forecast1:nth-child(8) .time").innerHTML = getTime(
      forecastdata.list[7].dt,
      timezone
    );

    // Card 9

    if (forecastdata.list[8].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(9) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[8].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(9) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[8].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(9) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[8].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(9) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[8].weather[0].main == "Clear" &&
        getTime(forecastdata.list[8].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[8].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(9) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[8].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(9) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[8].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(9) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[8].weather[0].main == "Clear" &&
        getTime(forecastdata.list[8].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[8].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(9) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(9) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[8].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(9) .date").innerHTML = getDate(
      forecastdata.list[8].dt,
      timezone
    ).substring(0, 10);

    document.querySelector(".forecast1:nth-child(9) .time").innerHTML = getTime(
      forecastdata.list[8].dt,
      timezone
    );

    // Card 10

    if (forecastdata.list[9].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(10) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[9].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(10) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[9].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(10) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[9].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(10) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[9].weather[0].main == "Clear" &&
        getTime(forecastdata.list[9].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[9].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(10) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[9].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(10) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[9].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(10) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[9].weather[0].main == "Clear" &&
        getTime(forecastdata.list[9].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[9].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(10) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(10) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[9].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(10) .date").innerHTML =
      getDate(forecastdata.list[9].dt, timezone).substring(0, 10);

    document.querySelector(".forecast1:nth-child(10) .time").innerHTML =
      getTime(forecastdata.list[9].dt, timezone);

    // Card 11

    if (forecastdata.list[10].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(11) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[10].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(11) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[10].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(11) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[10].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(11) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[10].weather[0].main == "Clear" &&
        getTime(forecastdata.list[10].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[10].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(11) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[10].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(11) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[10].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(11) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[10].weather[0].main == "Clear" &&
        getTime(forecastdata.list[10].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[10].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(11) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(11) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[10].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(11) .date").innerHTML =
      getDate(forecastdata.list[10].dt, timezone).substring(0, 10);

    document.querySelector(".forecast1:nth-child(11) .time").innerHTML =
      getTime(forecastdata.list[10].dt, timezone);

    if (forecastdata.list[11].weather[0].main == "Mist") {
      document.querySelector(".forecast1:nth-child(12) img").src =
        "assets/images/mist.png";
    } else if (forecastdata.list[11].weather[0].main == "Clouds") {
      document.querySelector(".forecast1:nth-child(12) img").src =
        "assets/images/clouds.png";
    } else if (forecastdata.list[11].weather[0].main == "Thunderstorm") {
      document.querySelector(".forecast1:nth-child(11) img").src =
        "assets/images/thunderstorm.png";
    } else if (forecastdata.list[11].weather[0].main == "Rain") {
      document.querySelector(".forecast1:nth-child(12) img").src =
        "assets/images/rain.png";
    } else if (
      (forecastdata.list[11].weather[0].main == "Clear" &&
        getTime(forecastdata.list[11].dt, timezone) <= "05:00") ||
      getTime(forecastdata.list[11].dt, timezone) >= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(12) img").src =
        "assets/images/moon.png";
    } else if (forecastdata.list[11].weather[0].main == "Snow") {
      document.querySelector(".forecast1:nth-child(12) img").src =
        "assets/images/snowflake.png";
    } else if (forecastdata.list[11].weather[0].main == "Haze") {
      document.querySelector(".forecast1:nth-child(12) img").src =
        "assets/images/haze.png";
    } else if (
      (forecastdata.list[11].weather[0].main == "Clear" &&
        getTime(forecastdata.list[11].dt, timezone) >= "05:00") ||
      getTime(forecastdata.list[11].dt, timezone) <= "19:00"
    ) {
      document.querySelector(".forecast1:nth-child(12) img").src =
        "assets/images/sunny.png";
    }
    document.querySelector(
      ".forecast1:nth-child(12) .forecast-degree"
    ).innerHTML = Math.round(forecastdata.list[11].main.temp) + "°C";

    document.querySelector(".forecast1:nth-child(12) .date").innerHTML =
      getDate(forecastdata.list[11].dt, timezone).substring(0, 10);

    document.querySelector(".forecast1:nth-child(12) .time").innerHTML =
      getTime(forecastdata.list[11].dt, timezone);
  }

  getforecast();

  const aqiURL =
    "http://api.openweathermap.org/data/2.5/air_pollution?&appid=09fc3bd281fbcbf3679e6880f6a323eb";

  async function getaqi() {
    // AQI API to fetch AQI data
    const aqiresponse = await fetch(aqiURL + `&lat=${lat}` + `&lon=${lon}`);
    var aqidata = await aqiresponse.json();
    aqivalue = aqidata.list[0].main.aqi;

    // conditionals to change color and values of AQI div
    if (aqivalue == 1) {
      document.querySelector(".aqi-desc").innerHTML = "Good";
      document.querySelector(".aqi-cont").style.backgroundColor =
        "rgba(0, 52, 89, 0.15)";
      document.querySelector(".aqi_value h1").innerHTML = aqivalue;
    } else if (aqivalue == 2) {
      document.querySelector(".aqi-desc").innerHTML = "Fair";
      document.querySelector(".aqi-cont").style.backgroundColor =
        "rgba(0, 167, 225, 0.15)";
      document.querySelector(".aqi_value h1").innerHTML = aqivalue;
    } else if (aqivalue == 3) {
      document.querySelector(".aqi-desc").innerHTML = "Moderate";
      document.querySelector(".aqi-cont").style.backgroundColor =
        "rgba(245, 233, 96, 0.15)";
      document.querySelector(".aqi_value h1").innerHTML = aqivalue;
    } else if (aqivalue == 4) {
      document.querySelector(".aqi-desc").innerHTML = "Poor";
      document.querySelector(".aqi-cont").style.backgroundColor =
        "rgba(221, 97, 74, 0.15)";
      document.querySelector(".aqi_value h1").innerHTML = aqivalue;
    } else if (aqivalue == 5) {
      document.querySelector(".aqi-desc").innerHTML = "Very Poor";
      document.querySelector(".aqi-cont").style.backgroundColor =
        "rgba(214, 34, 70, 0.15)";
      document.querySelector(".aqi_value h1").innerHTML = aqivalue;
    }
    searchbox.value = "";
  }
  return getaqi();
}

getlatlon("New Delhi");
searchbtn.addEventListener("click", () => {
  getlatlon(searchbox.value);
});
