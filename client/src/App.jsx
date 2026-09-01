import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar/SearchBar'
import WeatherCard from './components/WeatherCard/WeatherCard'
import AdviceCard from './components/AdviceCard/AdviceCard'
import { useLanguage } from './context/LanguageContext'
import { useLocalStorage } from './hooks/useLocalStorage'
import CityChips from './components/CityChips/CityChips'
import './App.scss'

function App() {
  const { language, setLanguage, t } = useLanguage()
  const [location, setLocation] = useState(null) // { type: 'city', city } | { type: 'coords', lat, lon }
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [unit, setUnit] = useState('C')

  const [advice, setAdvice] = useState(null)
  const [adviceLoading, setAdviceLoading] = useState(false)
  const [adviceError, setAdviceError] = useState(null)

  const [history, setHistory] = useLocalStorage('weather-history', [])
  const [favorites, setFavorites] = useLocalStorage('weather-favorites', [])

  useEffect(() => {
    if (!location) return

    async function fetchWeather() {
      setLoading(true)
      setError(null)
      setWeather(null)

      try {
        const params = new URLSearchParams({ lang: language })
        if (location.type === 'city') {
          params.set('city', location.city)
        } else {
          params.set('lat', location.lat)
          params.set('lon', location.lon)
        }

        const response = await fetch(`http://localhost:4000/api/weather?${params}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Не вдалося отримати погоду')
        }

        setWeather(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [location, language])

  useEffect(() => {
    if(!weather) return

    async function fetchAdvice() {
      setAdvice(null)
      setAdviceLoading(true)
      setAdviceError(null)

      try{
        const response = await fetch('http://localhost:4000/api/advice', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            city: weather.city,
            temperature: weather.temperature,
            description: weather.description,
            isDaytime: weather.isDaytime,
            localTime: weather.localTime,
            language,
          }),
        })
        const data = await response.json()

        if(!response.ok){
          throw new Error(data.error || 'Не вдалося отримати пораду');
        }

        setAdvice(data.advice)
      }catch(err){
        setAdviceError(err.message)
      }finally{
        setAdviceLoading(false)
      }
    }

    fetchAdvice()
  }, [weather])

  useEffect(() => {
    if (!weather) return

    const entry = { city: weather.city, country: weather.country }

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.city !== entry.city)
      return [entry, ...filtered].slice(0, 5)
    })
  }, [weather])

  function isFavoriteCity(cityName) {
    return favorites.some((item) => item.city === cityName)
  }

  function toggleFavorite() {
    if (!weather) return

    const entry = { city: weather.city, country: weather.country }

    setFavorites((prev) =>
      isFavoriteCity(weather.city)
        ? prev.filter((item) => item.city !== weather.city)
        : [...prev, entry]
    )
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setError('Геолокація не підтримується цим браузером')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          type: 'coords',
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (geoError) => {
        const messages = {
          1: 'Доступ до локації заборонено — дозволь у налаштуваннях браузера',
          2: 'Не вдалося визначити локацію — перевір службу геолокації в системі',
          3: 'Час очікування локації вичерпано, спробуй ще раз',
        }
        setError(messages[geoError.code] || 'Не вдалося визначити локацію')
      }
    )
  }

  return (
    <div className="app">

      <div className="sky">
        <div className="cloud cloud--1" />
        <div className="cloud cloud--2" />
        <div className="cloud cloud--3" />
      </div>

      <div className="controls">
        <div className="toggle-group">
          <button className={language === 'uk' ? 'active' : ''} onClick={() => setLanguage('uk')}>UA</button>
          <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
        </div>
        <div className="toggle-group">
          <button className={unit === 'C' ? 'active' : ''} onClick={() => setUnit('C')}>°C</button>
          <button className={unit === 'F' ? 'active' : ''} onClick={() => setUnit('F')}>°F</button>
        </div>
      </div>

      <h1>Weather AI Pet</h1>
      <SearchBar
        onSearch={(cityName) => setLocation({ type: 'city', city: cityName })}
        onUseMyLocation={handleUseMyLocation}
        disabled={loading}
        locationLabel={t('useMyLocation')}
      />

      {loading && <p>{t('loadingWeather')}</p>}
      {error && <p>{t('error')}: {error}</p>}
      {weather && (
        <WeatherCard
          weather={weather}
          unit={unit}
          isFavorite={isFavoriteCity(weather.city)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {adviceLoading && <p>{t('loadingAdvice')}</p>}
      {adviceError && <p>{t('error')}: {adviceError}</p>}
      {advice && <AdviceCard advice={advice} />}

      {(favorites.length > 0 || history.length > 0) && (
        <div className="city-lists">
          <CityChips
            icon="⭐"
            title={t('favorites')}
            cities={favorites}
            onSelect={(cityName) => setLocation({ type: 'city', city: cityName })}
          />
          <CityChips
            icon="🕘"
            title={t('recentSearches')}
            cities={history}
            onSelect={(cityName) => setLocation({ type: 'city', city: cityName })}
          />
        </div>
      )}
    </div>
  )
}

export default App