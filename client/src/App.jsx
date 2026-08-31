import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar/SearchBar'
import WeatherCard from './components/WeatherCard/WeatherCard'
import AdviceCard from './components/AdviceCard/AdviceCard'
import './App.scss'

function App() {
  const [city, setCity] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [advice, setAdvice] = useState(null)
  const [adviceLoading, setAdviceLoading] = useState(false)
  const [adviceError, setAdviceError] = useState(null)

  useEffect(() => {
    if(!city) return

    async function fetchWeather() {
      setLoading(true)
      setError(null)
      setWeather(null)

      try{
        const response = await fetch(
          `http://localhost:4000/api/weather?city=${encodeURIComponent(city)}`
        )
        const data = await response.json()

        if(!response.ok){
          throw new Error(data.error || 'Не вдалося отримати погоду')
        }

        setWeather(data)
      } catch(err){
        setError(err.message)
      } finally{
          setLoading(false)
      }
    }

    fetchWeather()
  }, [city])

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

  return (
    <div className="app">
      <h1>Weather AI Pet</h1>
      <SearchBar onSearch={setCity} />
      
      {loading && <p>Завантаження...</p>}
      {error && <p>Помилка: {error}</p>}
      {weather && <WeatherCard weather={weather}/>}

      {adviceLoading && <p>Готуємо пораду...</p>}
      {adviceError && <p>Помилка: {adviceError}</p>}
      {advice && <AdviceCard advice={advice} />}
    </div>
  )
}

export default App