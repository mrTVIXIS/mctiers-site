const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Теперь здесь пусто. Данные будут приходить только от твоего сервера!
let playersData = [];

// Отдаем данные сайту
app.get('/api/players', (req, res) => {
    res.json(playersData);
});

// Принимаем данные от сервера (сюда плагин будет слать инфо)
app.post('/api/update', (req, res) => {
    if (Array.isArray(req.body)) {
        playersData = req.body;
        console.log(`[СИНХРОНИЗАЦИЯ] Успешно обновлено игроков: ${playersData.length}`);
        return res.status(200).json({ message: "Рейтинг успешно обновлен сервером!" });
    }
    res.status(400).json({ error: "Неверный формат данных" });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
