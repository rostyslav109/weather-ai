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

