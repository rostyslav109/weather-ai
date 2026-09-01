import { Router } from 'express'
import { getWeatherByCity, getWeatherByCoords } from '../services/weatherService.js'

const router = Router()

router.get('/', async (req, res) => {
  const { city, lat, lon, lang } = req.query

  if (!city && !(lat && lon)) {
    return res.status(400).json({ error: 'Потрібен city або lat+lon' })
  }

  try {
    const weather = city
      ? await getWeatherByCity(city, lang)
      : await getWeatherByCoords(lat, lon, lang)

    res.json(weather)
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: 'Місто не знайдено' })
    }
    console.error(err)
    res.status(500).json({ error: 'Не вдалося отримати погоду' })
  }
})

export default router