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

/*
 * @param {}
 */

function getDateTime() {
  let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

  if (hour < 10) {
    hour = "0" + hour;
  }

  if (minute < 10) {
    minute = "0" + minute;
  }

  let dayString = weekDayNames[now.getDay()];
  let monthString = monthNames[now.getMonth()];
  let date = now.getDate();

  return `${dayString}, ${date} ${monthString}, ${hour}:${minute}`;
}

document.querySelector(".datetime").innerHTML = getDateTime();

// lets work with AQI

const searchbox = document.querySelector(".input-container2 input");
const searchbtn = document.querySelector(".input-container2 button");

const apikey = "09fc3bd281fbcbf3679e6880f6a323eb";
const geoURL = "http://api.openweathermap.org/geo/1.0/direct?&limit=5&q=";
const curweatherURL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

async function getlatlon(city) {
  const currentWeather = await fetch(curweatherURL + city + `&appID=${apikey}`);
  var weatherdata = await currentWeather.json();
  document.querySelector(".cityname").innerHTML = weatherdata.name;
  document.querySelector(".temperature").innerHTML =
    Math.round(weatherdata.main.temp) + "°C";
  if (weatherdata.weather[0].main == "Mist") {
    document.querySelector(".weatherimg img").src = "assets/images/mist.png";
    document.querySelector(".climatetype").innerHTML = "Mist";
  } else if (weatherdata.weather[0].main == "Clouds") {
    document.querySelector(".weatherimg img").src = "assets/images/clouds.png";
    document.querySelector(".climatetype").innerHTML = "Clouds";
  } else if (weatherdata.weather[0].main == "Thunderstorm") {
    document.querySelector(".weatherimg img").src =
      "assets/images/thunderstorm.png";
    document.querySelector(".climatetype").innerHTML = "Thunderstorm";
  } else if (weatherdata.weather[0].main == "Rain") {
    document.querySelector(".weatherimg img").src = "assets/images/rain.png";
    document.querySelector(".climatetype").innerHTML = "Rain";
  } else if (weatherdata.weather[0].main == "Clear") {
    document.querySelector(".weatherimg img").src = "assets/images/sunny.png";
    document.querySelector(".climatetype").innerHTML = "Clear";
  } else if (weatherdata.weather[0].main == "Snow") {
    document.querySelector(".weatherimg img").src =
      "assets/images/snowflake.png";
    document.querySelector(".climatetype").innerHTML = "Snow";
  }
  document.querySelector(".windspeed").innerHTML =
    weatherdata.wind.speed.toFixed(1) + " km/h";

  document.querySelector(".humidity").innerHTML =
    weatherdata.main.humidity + "%";

  document.querySelector(".visibility").innerHTML =
    weatherdata.visibility / 1000 + "km";

  document.querySelector(".detail-desc span").innerHTML =
    weatherdata.weather[0].description;

  document.querySelector(".temp-max span").innerHTML =
    weatherdata.main.temp_max + "°C";

  document.querySelector(".temp-min span").innerHTML =
    weatherdata.main.temp_min + "°C";

  document.querySelector(".pressure span").innerHTML =
    weatherdata.main.pressure + " hPa";

  const response = await fetch(
    geoURL + city + `&appid=${apikey}` + `&units=metric`
  );
  var data = await response.json();
  const lat = data[0].lat;
  const lon = data[0].lon;

  const aqiURL =
    "http://api.openweathermap.org/data/2.5/air_pollution?&appid=09fc3bd281fbcbf3679e6880f6a323eb";
  async function getaqi() {
    const aqiresponse = await fetch(aqiURL + `&lat=${lat}` + `&lon=${lon}`);
    var aqidata = await aqiresponse.json();
    aqivalue = aqidata.list[0].main.aqi;

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
