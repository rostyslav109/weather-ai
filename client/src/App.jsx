import { useState } from 'react'
import SearchBar from './components/SearchBar/SearchBar'
import './App.scss'

function App() {
  const [city, setCity] = useState(null)

  return (
    <div className="app">
      <h1>Weather AI Pet</h1>
      <SearchBar onSearch={setCity} />
      {city && <p>Шукаємо погоду для: {city}</p>}
    </div>
  )
}

export default App