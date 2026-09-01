const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const OWM_LANG_MAP = { uk: 'ua', en: 'en' }

function formatLocalTime(unixSeconds, timezoneOffsetSeconds) {
  const localDate = new Date((unixSeconds + timezoneOffsetSeconds) * 1000)
  const hours = String(localDate.getUTCHours()).padStart(2, '0')
  const minutes = String(localDate.getUTCMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function normalizeWeather(data) {
  return {
    city: data.name,
    country: data.sys?.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather?.[0]?.description,
    icon: data.weather?.[0]?.icon,
    humidity: data.main.humidity,
    windSpeed: data.wind?.speed,
    isDaytime: data.dt >= data.sys.sunrise && data.dt < data.sys.sunset,
    localTime: formatLocalTime(data.dt, data.timezone),
  }
}

async function fetchWeather(params) {
  const response = await fetch(`${OPENWEATHER_BASE_URL}?${params}`)
  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'OpenWeatherMap request failed')
    error.status = response.status
    throw error
  }

  return normalizeWeather(data)
}

export async function getWeatherByCity(city, lang = 'uk') {
  const params = new URLSearchParams({
    q: city,
    appid: process.env.OPENWEATHER_API_KEY,
    units: 'metric',
    lang: OWM_LANG_MAP[lang] ?? 'en',
  })
  return fetchWeather(params)
}

export async function getWeatherByCoords(lat, lon, lang = 'uk') {
  const params = new URLSearchParams({
    lat,
    lon,
    appid: process.env.OPENWEATHER_API_KEY,
    units: 'metric',
    lang: OWM_LANG_MAP[lang] ?? 'en',
  })
  return fetchWeather(params)
}