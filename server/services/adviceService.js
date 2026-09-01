import {GoogleGenAI} from '@google/genai'

// const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

const CACHE_TTL_MS = 30 * 60 * 1000 // 30min
const cache = new Map()

function getCacheKey({city, temperature, description, isDaytime, language}){
    return `${city.toLowerCase()}|${temperature}|${description}|${isDaytime}|${language}`
}

async function generateWithRetry(genAI, params, retries = 2){
    for(let attempt = 0; attempt <= retries; attempt++){
        try{
            return await genAI.models.generateContent(params)
        }catch(err){
            const isRetryable = err.status === 503
            const isLastAttempt = attempt === retries

            if(!isRetryable || isLastAttempt) throw err

            const delay = 1000 * (attempt + 1)
            console.log(`Gemini перевантажена, повтор через ${delay}мс (спроба ${attempt + 1}/${retries})`)
            await new Promise((resolve) => setTimeout(resolve, delay))
        }
    }
}

export async function getAdvice(weather) {
    const { city, temperature, description, isDaytime, localTime, language } = weather
    const key = getCacheKey(weather)
    const cached = cache.get(key)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        console.log('Порада взята з кешу:', key)
        return cached.advice
    }

    const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
    const languageName = language === 'en' ? 'English' : 'Ukrainian'
    const timeOfDay = isDaytime ? 'day' : 'night'

    const prompt = `Give one short, funny, practical weather tip in ${languageName} (max 2 sentences, don't repeat the numbers). ${city}, ${temperature}°C, ${description}, ${timeOfDay}.`


    const response = await generateWithRetry(genAI, {
        model: 'gemini-3.6-flash',
        contents: prompt,
    })

    const advice = response.text
    cache.set(key, { advice, timestamp: Date.now() })

    return advice
}


/*
const ADVICE_POOL = [
  'Візьми парасольку, навіть якщо небо обіцяє інше.',
  'Ідеальний день, щоб залишити куртку вдома і потім про це пошкодувати.',
  'Час заварити чай і подивитись у вікно.',
  'Гарна нагода вийти на прогулянку, поки погода не передумала.',
  'Сьогодні краще мати план Б, якщо ти йдеш кудись пішки.',
];

export async function getAdvice({city, temperature, description}) {
    const randomIndex = Math.floor(Math.random() * ADVICE_POOL.length);
    return ADVICE_POOL[randomIndex];   
}
*/

