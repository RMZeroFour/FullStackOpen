import axios from 'axios';

const allCountriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const getWeatherUrlTemplate = 'https://api.openweathermap.org/data/2.5/weather?q=@CITY@&appid=@APIKEY@';
const getIconUrlTemplate = 'https://openweathermap.org/img/wn/@ICON@.png';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

function getAllCountries() {
    return axios
        .get(allCountriesUrl)
        .then(response => response.data);
}

function getWeather(city) {
    return axios
        .get(getWeatherUrlTemplate.replace('@CITY@', city).replace('@APIKEY@', OPENWEATHER_API_KEY))
        .then(response => [response.data, getIconUrlTemplate.replace('@ICON@', response.data.weather.at(0).icon)]);
}

export default {
    getAllCountries,
    getWeather
};