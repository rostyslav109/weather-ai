import {Router} from 'express';
import {getAdvice} from '../services/adviceService.js';

const router = Router();

router.post('/', async (req, res) => {
    const {city, temperature, description, isDaytime, localTime, language} = req.body;

    if(!city || temperature === undefined || !description || isDaytime === undefined){
        return res.status(400).json({error: 'Потрібні city, temperature, description і isDaytime'});   
    }

    try{
        const advice = await getAdvice({city,temperature,description, isDaytime, localTime, language});
        res.json({advice});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Не вдалося отримати пораду'})
    }
});
export default router;