const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 10000; // Изменили порт сайта на 1488
const DATA_FILE = path.join(__dirname, 'players.json');

// Секретный ключ (придумай свой пароль, чтобы никто чужой не взломал топ)
const SECRET_TOKEN = "SUPER_SECRET_KEY_123";

app.use(bodyParser.json());
app.use(express.static(__dirname));

function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Отдать данные на сайт
app.get('/api/rankings', (req, res) => {
    res.json(readData());
});

// Получить данные из Майнкрафта
app.post('/api/rankings/update', (req, res) => {
    const { name, points, mode, tier, token } = req.body;

    if (token !== SECRET_TOKEN) {
        return res.status(403).json({ error: "Неверный токен безопасности!" });
    }

    if (!name || !mode || !tier) {
        return res.status(400).json({ error: "Не все поля заполнены" });
    }

    let players = readData();
    let player = players.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (!player) {
        player = {
            name: name,
            points: parseInt(points) || 0,
            tiers: { overall: "none", crystal: "none", sword: "none" }
        };
        players.push(player);
    }

    // Обновляем тир для конкретного режима и очки
    player.tiers[mode] = tier;
    if (points !== undefined) {
        player.points = parseInt(points);
    }

    writeData(players);
    res.json({ success: true });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сайт успешно запущен на порту ${PORT}`);
});
