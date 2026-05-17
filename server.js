const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// База данных со всеми 10 режимами под твой новый интерфейс
let playersData = [
    { name: "strafikk", region: "EU", overall: "HT1", ltms: "LT1", vanilla: "HT2", uhc: "HT1", pot: "HT1", netherop: "LT1", smp: "HT3", sword: "HT1", axe: "LT2", mace: "HT1" },
    { name: "OUTSOBER", region: "EU", overall: "HT1", ltms: "HT3", vanilla: "LT1", uhc: "LT2", pot: "HT1", netherop: "HT2", smp: "LT1", sword: "HT1", axe: "HT3", mace: "LT1" },
    { name: "kayoumi", region: "AS", overall: "HT1", ltms: "LT2", vanilla: "HT1", uhc: "HT3", pot: "HT1", netherop: "LT3", smp: "HT2", sword: "HT1", axe: "LT1", mace: "HT3" },
    { name: "flowromance", region: "NA", overall: "HT1", ltms: "HT2", vanilla: "LT3", uhc: "LT1", pot: "HT2", netherop: "HT1", smp: "LT2", sword: "HT1", axe: "HT2", mace: "LT2" },
    { name: "oleg_321f", region: "EU", overall: "LT2", ltms: "LT3", vanilla: "HT3", uhc: "LT3", pot: "LT2", netherop: "LT2", smp: "HT1", sword: "LT2", axe: "LT1", mace: "HT2" },
    { name: "gassdent", region: "NA", overall: "HT3", ltms: "HT1", vanilla: "LT2", uhc: "HT2", pot: "HT3", netherop: "HT3", smp: "LT3", sword: "HT3", axe: "HT1", mace: "LT3" }
];

app.get('/api/players', (req, res) => {
    res.json(playersData);
});

app.post('/api/update', (req, res) => {
    if (Array.isArray(req.body)) {
        playersData = req.body;
        return res.status(200).json({ message: "Рейтинг обновлен!" });
    }
    res.status(400).json({ error: "Неверный формат" });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});
