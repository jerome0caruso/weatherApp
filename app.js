const zipcodeInput = document.getElementById('zipInput');
const button = document.getElementById('btn');
const reportArea = document.getElementById('report');
//display area
const time = document.getElementById('time');
const cityState = document.getElementById('cityState');
const currentWeather = document.getElementById('currentWeather');
const iconArea = document.getElementById('icon');
//forcast
const allDays = document.querySelectorAll('.for');
//key1 for weather stack; key2 for open weather map
const apiKey = {
    key1: '91849f5b20277fbd3d7bf0fdd41e6c67',
    key2: 'b579e19b290ce554b1bccbb57758b651'
}

//Api call to weather stack.  Creates main temp info.
button.addEventListener("click", async () => {
        const zip = Number(zipcodeInput.value);
        const response = await fetch(`http://api.weatherstack.com/current?access_key=${apiKey.key1}&query=${zip}&units=f`)
        const weatherData = await response.json()
        displayWeather(weatherData);
        zipcodeInput.value = "";
})

// Creates main temp view.  Sets lon and lat for other api.  Needs this for location
function displayWeather(weather) {
    const locations = {
        lat : weather.location.lat,
        lon : weather.location.lon
    }
    changeBgColorWithWeather(weather.current.weather_code);
    reportArea.setAttribute("style", "display: block;");
    cityState.innerText = `${weather.location.name}, ${weather.location.region}`;
    currentWeather.innerText = `${weather.current.temperature}℉ | ${Math.round((weather.current.temperature - 32) * 5/9)}℃`;
    time.innerText = `${getDate().today}`
    iconArea.innerHTML = `<img src=${weather.current.weather_icons[0]}>`
    getForcast(locations);
}
//changes the bg color depending on the weather(rain/cloud, sunny, snow)
function changeBgColorWithWeather(weatherCode) {
    if(weatherCode === 113 || weatherCode === 116) {
        reportArea.classList.remove("addingGrey");
        reportArea.classList.remove("addingWhite");
        reportArea.classList.add("addingBlue");
    } else if(weatherCode > 320) {
        reportArea.classList.remove("addingGrey");
        reportArea.classList.remove("addingBlue");
        reportArea.classList.add("addingWhite");
    } else {
        reportArea.classList.remove("addingWhite");
        reportArea.classList.remove("addingBlue");
        reportArea.classList.add("addingGrey");
    }
}
//Api call to open weather map
function getForcast(locations) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${locations.lat}&lon=${locations.lon}&appid=${apiKey.key2}&units=imperial`)
    .then((response) => response.json())
    .then((data) => loadForcast(data))
}

//date generator 
function getDate(i) {
    const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date();
    const day = date.getDay();
    if(i > 6) { // Helps keep the index in range
        i = 0;
    }
    return {
        today: new Date().toLocaleString(),
        name: days[i]
    }
}
// creates the main view for the 5 day forcast.  Use the i variable with ++ instead of another loop.  Need to loop through each day as well as each span in view area.
//line 62 gets todays day then add it with {i} to get the 4 future dates at any given time.
function loadForcast(forcast) {
    document.querySelector('.forcast').setAttribute("style", "display: flex;");
    let i = 0;
    allDays.forEach(day => {
        console.log(getDate(i + new Date().getDay()).name)
        day.innerHTML = `<p>${getDate(i + new Date().getDay()).name}</p>
                         <h3>${Math.round(forcast.daily[i].temp.day)}℉ </h3>
                         <h4>${forcast.daily[i].weather[0].description}</h4>`;
        i++;
    })
}
