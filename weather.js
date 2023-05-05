// Now working with dates

const weekDayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

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
  } else if (weatherdata.weather[0].main == "Clear") {
    document.querySelector(".weather img").src = "assets/images/sunny.png";
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

  // document.querySelector(".detail-desc span").innerHTML =
  //   weatherdata.weather[0].description;

  // document.querySelector(".pressure span").innerHTML =
  //   weatherdata.main.pressure + " hPa";

  // date updation
  document.querySelector(".datetime").innerHTML = getDate(
    weatherdata.dt,
    weatherdata.timezone
  );

  // Need latitude and Longitude to use aqi API
  const lat = weatherdata.coord.lat;
  const lon = weatherdata.coord.lon;
  const timezone = weatherdata.timezone;

  const geocodeURL =
    "http://api.openweathermap.org/geo/1.0/reverse?&limit=1&appid=09fc3bd281fbcbf3679e6880f6a323eb";

  async function reversegeocode() {
    const geocode = await fetch(geocodeURL + `&lat=${lat}` + `&lon=${lon}`);
    var geodata = await geocode.json();
    const countryname = geodata[0].country;

    console.log(geocodeURL + `&lat=${lat}` + `&lon=${lon}`);

    document.querySelector(".countrycode").innerHTML = countryname;
  }

  reversegeocode();

  const forecastURL =
    "http://api.openweathermap.org/data/2.5/forecast?&appid=09fc3bd281fbcbf3679e6880f6a323eb&units=metric";

  async function getforecast() {
    const forecastresponse = await fetch(
      forecastURL + `&lat=${lat}` + `&lon=${lon}`
    );
    var forecastdata = await forecastresponse.json();

    const forecastdates = [];
    forecastdata.list.forEach(forecast => {
      forecastdates.push(forecast.dt_txt);
    });

    const dt = forecastdata.list[0].dt;
    const dt_nxtday = forecastdata.list[0].dt + 24 * 60 * 60;
    const dt_thirdday = forecastdata.list[0].dt + 48 * 60 * 60;
    const dt_fourthday = forecastdata.list[0].dt + 72 * 60 * 60;

    document.querySelector(".dayname").innerHTML = getDate(dt, timezone).split(
      ", "
    )[0];

    document.querySelector(".dayname1").innerHTML = getDate(
      dt_nxtday,
      timezone
    ).split(", ")[0];
    document.querySelector(".dayname2").innerHTML = getDate(
      dt_thirdday,
      timezone
    ).split(", ")[0];
    document.querySelector(".dayname3").innerHTML = getDate(
      dt_fourthday,
      timezone
    ).split(", ")[0];
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

getlatlon("Arkansas");
searchbtn.addEventListener("click", () => {
  getlatlon(searchbox.value);
});
