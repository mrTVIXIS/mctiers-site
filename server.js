const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 10000; 
const DATA_FILE = path.join(__dirname, 'players.json');

const SECRET_TOKEN = "SUPER_SECRET_KEY_123";

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Новая расширенная система распределения тиров по очкам
function calculateTier(points) {
    if (points < 150) return "LT5";
    if (points < 300) return "HT5";
    if (points < 450) return "LT4";
    if (points < 600) return "HT4";
    if (points < 750) return "LT3";
    if (points < 900) return "HT3";
    if (points < 1050) return "LT2";
    if (points < 1200) return "HT2";
    if (points < 1400) return "LT1";
    return "HT1";
}

function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Отдать данные на сайт
app.get('/api/rankings', (req, res) => {
    res.json(readData());
});

// Получить данные из Майнкрафта при убийстве
app.post('/api/rankings/update', (req, res) => {
    const { killer, victim, mode, token } = req.body;

    if (token !== SECRET_TOKEN) {
        return res.status(403).json({ error: "Неверный токен безопасности!" });
    }

    if (!killer || !victim || !mode) {
        return res.status(400).json({ error: "Не все поля заполнены (нужны killer, victim, mode)" });
    }

    let players = readData();

    // Полностью вычищаем демо-игроков при первом же реальном убийстве
    players = players.filter(p => !["strafikk", "OUTSOBER", "kayoumi", "flowromance", "oleg_321f", "gassdent"].includes(p.name));

    // Создаем киллера, если его нет в базе (старт с 600 очков = LT3)
    let killerPlayer = players.find(p => p.name.toLowerCase() === killer.toLowerCase());
    if (!killerPlayer) {
        killerPlayer = {
            name: killer,
            points: 600,
            tiers: { overall: "LT3", crystal: "none", sword: "none", "netherite pot": "none" }
        };
        players.push(killerPlayer);
    }

    // Создаем жертву, если её нет в базе (старт с 600 очков = LT3)
    let victimPlayer = players.find(p => p.name.toLowerCase() === victim.toLowerCase());
    if (!victimPlayer) {
        victimPlayer = {
            name: victim,
            points: 600,
            tiers: { overall: "LT3", crystal: "none", sword: "none", "netherite pot": "none" }
        };
        players.push(victimPlayer);
    }

    // Начисление очков (настоящая Elo система: киллеру плюс, у жертвы минус)
    killerPlayer.points += 20;
    victimPlayer.points -= 15;
    
    if (victimPlayer.points < 0) victimPlayer.points = 0;

    // Валидация игровых режимов
    const allowedModes = ["overall", "crystal", "sword", "netherite pot"];
    const currentMode = allowedModes.includes(mode.toLowerCase()) ? mode.toLowerCase() : "overall";

    // Обновляем тиры в конкретном режиме и общем зачете
    killerPlayer.tiers[currentMode] = calculateTier(killerPlayer.points);
    victimPlayer.tiers[currentMode] = calculateTier(victimPlayer.points);
    
    killerPlayer.tiers["overall"] = calculateTier(killerPlayer.points);
    victimPlayer.tiers["overall"] = calculateTier(victimPlayer.points);

    writeData(players);
    res.json({ success: true, killer_points: killerPlayer.points, victim_points: victimPlayer.points });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сайт успешно запущен на порту ${PORT}`);
});
