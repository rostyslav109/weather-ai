import {Router} from 'express';
import {getAdvice} from '../services/adviceService.js';

const router = Router();

router.post('/', async (req, res) => {
    const {city, temperature, description} = req.body;

    if(!city || temperature === undefined || !description){
        return res.status(400).json({error: 'Потрібні city, temperature і description'});   
    }

    try{
        const advice = await getAdvice({city,temperature,description});
        res.json({advice});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Не вдалося отримати пораду'})
    }
});
export default router;