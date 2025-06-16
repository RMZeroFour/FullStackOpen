import { useEffect, useState } from 'react';
import Search from './services/Search.js';

function WeatherView({ city }) {
    const [weather, setWeather] = useState(null);
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        Search
            .getWeather(city)
            .then(([weather, icon]) => {
                setWeather(weather);
                setIcon(icon);
            });
    }, [city]);

    if (weather === null) {
        return null;
    }

    return (
        <>
            <h1>Weather in {city}</h1>
            <div>Temperature {weather.main.temp - 273.15} celsius</div>
            <img src={icon} />
            <div>Wind {weather.wind.speed} m/s</div>
        </>
    );
}

function CountryView({ country }) {
    return (
        <>
            <h1>{country.name.official}</h1>
            <div>Capital {country.capital.at(0)}</div>
            <div>Area {country.area}</div>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
            </ul>
            <img src={country.flags.png} alt={country.flags.alt} />
            <WeatherView city={country.capital.at(0)} />
        </>
    );
}

function CountryEntry({ country, onClick }) {
    return (
        <div>
            {country.name.official}
            <button onClick={onClick}>Show</button>
        </div>
    );
}

function SearchResults({ countries, search, selectedCountry, setSelectedCountry }) {
    if (search === '') {
        return null;
    }

    if (selectedCountry) {
        return <CountryView country={countries.find(country => country.name.official === selectedCountry)} />;
    }
    
    function pickCountry(countryName) {
        setSelectedCountry(countryName);
    }

    const results = countries.filter(country => country.name.official.toLowerCase().includes(search.toLowerCase()));
    if (results.length > 10) {
        return <div>Too many matches, specify another filter</div>;
    } else if (results.length > 1) {
        return (
            <>
                {results.map(result => <CountryEntry key={result.name.official} country={result} onClick={() => pickCountry(result.name.official)} />)}
            </>
        );
    } else if (results.length === 1) {
        return <CountryView country={results.at(0)} />;
    } else {
        return null;
    }
}

function App() {
    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {
        Search
            .getAllCountries()
            .then(countries => setCountries(countries));
    }, []);

    function handleSearchChanged(event) {
        setSearch(event.target.value);
        setSelectedCountry(null);
    }

    return (
        <>
            find countries <input value={search} onChange={handleSearchChanged} />
            <SearchResults countries={countries} search={search} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
        </>
    );
}

export default App;
