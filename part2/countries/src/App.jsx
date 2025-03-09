import { useState, useEffect } from 'react'
import noteService from './services/notes'

const getCountryNames = (props) => {
  return props.map(country => country.name).map(country => country.common)
}

const FindForm = (props) => (
  <div>
    find countries <input onChange={props.find}></input>
  </div>
  )

const Display = ({ countries, onShow, weather }) => {
  console.log(countries)
  if (!countries || countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else {
    if (countries.length === 1) {
      return (
        <div>
          <h1>{countries[0].name.common}</h1>
          <div>Capital {countries[0].capital}</div>
          <div>Area {countries[0].area}</div>
          <h2>Languages</h2>
          <ul>{Object.values(countries[0].languages).map((lang, index) => <li key={index}>{lang}</li>)}</ul>
          <img src={countries[0].flags.png} alt={countries[0].name.common} />
          <h2>Weather in {countries[0].capital}</h2>
          <div>Temperature: {weather?.main?.temp ?? "Loading..."} Celcius</div>
          <div>Wind: {weather?.wind?.speed ?? "Loading..."} m/s</div>
        </div>
      )
    } else {
      return (
        <div>
          {getCountryNames(countries).map((country, index) =>
            <div key={index}>
              {country}
              <button onClick={() => onShow(country)}>show</button>
            </div>)}
        </div>
      )
    }
  }
}

const App = () => {
  const [find, setFind] = useState('');
  const [countries, setCountries] = useState([]);
  const [weather, setWeather] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    console.log('effect')
    noteService
      .getCountriesName()
      .then(response => {
        console.log(response);
        setCountries(response);
      });
  }, [find]);
  console.log('render', countries.length, 'countries')
  
  const countriesShow = (find.length === 0)
    ? null
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(find.toLowerCase()))

  // Automatically set selectedCountry when there's only one match
  useEffect(() => {
    if (countriesShow && countriesShow.length === 1) {
      setSelectedCountry(countriesShow[0].name.common);
    }
  }, [countriesShow]);
  
  // Fetch weather from the web
  useEffect(() => {
    if (selectedCountry) {
      console.log('Fetching weather');
      fetchWeather(selectedCountry);
    }
  }, [selectedCountry])

  // Fetch weather when selectedCountry changes
  const fetchWeather  = (props) => {
    noteService
      .getWeather(props)
      .then(response => {
        console.log(response)
        setWeather(response)
      })
  }
  
  const onFinding = (props) => {
    setFind(props.target.value);
    setSelectedCountry(null);
  }
  
  const Show = (prop) => {
    console.log(prop);
    setCountries(countries.filter(country => country.name.common === prop));
    setSelectedCountry(prop);
  }
  
  return (
    <div>
      <FindForm find={onFinding} />
      <Display
        countries={countriesShow}
        onShow={Show}
        weather={weather}
      />
    </div>
  )
}

export default App