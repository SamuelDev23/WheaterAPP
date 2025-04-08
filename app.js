const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')
const notFoundSection  = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection = document.querySelector('.weather-info')

const countryTxt = document.querySelector('.country-txt')
const temptxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')  
 
const forecastItemContainer = document.querySelector('.forecast-items-container')

const apiKey = '8b67dafc255d901fd95b539597febbac'



searchBtn.addEventListener('click', ()=>{
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput)
        cityInput.value = ''
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown', (event)=>{
    if(event.key == 'Enter' && cityInput.value.trim()){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})



// FUNCTIONES
async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    return response.json()

}

function getCurrentDate(){
    const currentDate = new Date() 
    const options = {
        weekday: 'short', 
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options)
}

function getWeatherIcon(id){
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city)

    if (weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }

    const {
        name : country,
        main: { temp, humidity },
        weather: [{id, main}],
        wind: {speed},
    } = weatherData

    countryTxt.textContent = country
    temptxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + ' M/s'
    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `assets/assets/weather/${getWeatherIcon(id)}`

    updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}


async function updateForecastInfo(city){
    const forecastData = await getFetchData('forecast', city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split() 

    forecastItemContainer.innerHTML = ''
    forecastData.list.forEach(forecastWheater => {
        if (forecastWheater.dt_txt.includes(timeTaken) && 
        !forecastWheater.dt_txt.includes(todayDate)){
           updateForecastItems(forecastWheater)
            console.log(forecastData)
        }
    })
}


function updateForecastItems(weatherData){
    console.log(weatherData)
    const {
        dt_txt: date,    
        weather: [{id}],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)


    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src = "assets/assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C </h5>
        </div>
    `
    forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem)
}





function showDisplaySection(section){
    [weatherInfoSection, notFoundSection, searchCitySection]
    .forEach(section => section.style.display = 'none')
    section.style.display = 'flex'
}















