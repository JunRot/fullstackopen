import axios from 'axios'

const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='
const api_key = import.meta.env.VITE_SOME_KEY

const getCountriesName = () => {
    return (
        axios
            .get(baseURL)
            .then(response => response
                .data
                //.map(country => country.name)
                //.map(country => country.common)
            )
    )
}

const getWeather = (city) => {
    return (
        axios
            .get(`${weatherURL}${city}&appid=${api_key}`)
            .then(response => response.data)
    )
}


export default {getCountriesName, getWeather}