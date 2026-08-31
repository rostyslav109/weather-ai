# Weather AI Pet

Легкий погодний застосунок, що показує поточні умови та випадкову AI-пораду залежно від міста.

Пет-проєкт для практики: інтеграція зовнішніх API (OpenWeatherMap, OpenAI), обробка даних на бекенді, структура full-stack застосунку (React + Node.js/Express), стилізація через SASS.

## Стек
- Frontend: React (Vite), SASS
- Backend: Node.js, Express
- Зовнішні API: OpenWeatherMap, OpenAI

## Функціонал
- Пошук погоди за назвою міста
- Відображення температури, опису, вологості, вітру
- Випадкова порада, згенерована на основі поточної погоди

## Запуск локально

### Backend
\`\`\`
cd server
npm install
npm run dev
\`\`\`

Створи `server/.env`:
\`\`\`
PORT=4000
OPENWEATHER_API_KEY=твій_ключ
\`\`\`

### Frontend
\`\`\`
cd client
npm install
npm run dev
\`\`\`

Застосунок буде доступний на `http://localhost:5173`, бекенд — на `http://localhost:4000`.