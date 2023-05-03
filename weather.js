const apiKey = "09fc3bd281fbcbf3679e6880f6a323eb";
const apiURL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchbox1 = document.querySelector(".input-container1 input");
const searchbtn1 = document.querySelector(".input-container1 button");

const searchbox2 = document.querySelector(".input-container2 input");
const searchbtn2 = document.querySelector(".input-container2 button");

async function checkweather(city) {
  const response = await fetch(apiURL + city + `&appid=${apiKey}`);

  var Data = await response.json();
  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".response-div").style.display = "none";
    document.querySelector(".landing-page").style.display = "flex";
  } else {
    document.querySelector(".landing-page").style.display = "none";
    document.querySelector(".response-div").style.display = "flex";
    document.querySelector(".cityname").innerHTML = Data.name;
    document.querySelector(".temperature").innerHTML =
      Math.round(Data.main.temp) + "°C";
    document.querySelector(".windspeed").innerHTML = Data.wind.speed + " km/h";
    document.querySelector(".humidity").innerHTML = Data.main.humidity + "%";
    document.querySelector(".visibility").innerHTML =
      Data.visibility / 1000 + " km";
    document.querySelector(".climatetype").innerHTML = Data.weather[0].main;
    searchbox1.value = "";
    searchbox2.value = "";
  }
}

searchbtn1.addEventListener("click", () => {
  checkweather(searchbox1.value);
});

searchbtn2.addEventListener("click", () => {
  checkweather(searchbox2.value);
});
