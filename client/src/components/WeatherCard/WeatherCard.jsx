function WeatherCard({weather}){
    return(
        <div className="weather-card">
            <h2>{weather.city}, {weather.country}</h2>
            <p>{weather.temperature}°C (відчувається як {weather.feelsLike}°C)</p>
            <p>{weather.description}</p>
            <p>Вологість: {weather.humidity}%</p>
            <p>Вітер: {weather.windSpeed} м/с</p>
        </div>
    )
}

export default WeatherCard