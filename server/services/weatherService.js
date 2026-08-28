const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function getWeatherByCity(city) {
    const url = `${OPENWEATHER_BASE_URL}?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=ua`;
 
    const response = await fetch(url);
    const data = await response.json();

    if(!response.ok){
        const error = new Error(data.message || 'OpenWeatherMap request failed');
        error.status = response.status;
        throw error;
    }

    return {
        city: data.name,
        country: data.sys?.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather?.[0]?.description,
        icon: data.weather?.[0]?.icon,
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed,
    };

}