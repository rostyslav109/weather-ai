import { useLanguage } from '../../context/LanguageContext'
import './WeatherCard.scss'

function toFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32)
}

function WeatherCard({ weather, unit, isFavorite, onToggleFavorite }) {
  const { t } = useLanguage()

  const temperature = unit === 'F' ? toFahrenheit(weather.temperature) : weather.temperature
  const feelsLike = unit === 'F' ? toFahrenheit(weather.feelsLike) : weather.feelsLike
  const unitSymbol = unit === 'F' ? '°F' : '°C'
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`

  return (
    <div className="weather-card">
      <div className="weather-card__header">
        <h2>{weather.city}, {weather.country}</h2>
        <img className="weather-card__icon" src={iconUrl} alt={weather.description} />
        <button
          type="button"
          className="favorite-button"
          onClick={onToggleFavorite}
          aria-label={t('toggleFavorite')}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>
      <p>{temperature}{unitSymbol} ({t('feelsLike')} {feelsLike}{unitSymbol})</p>
      <p>{weather.description}</p>
      <p>{t('humidity')}: {weather.humidity}%</p>
      <p>{t('wind')}: {weather.windSpeed} {t('windUnit')}</p>
    </div>
  )
}

export default WeatherCard