<?php
// Секретный ключ, чтобы защитить сайт от взлома. Придумай свой!
$SECRET_KEY = "KronosSuperSecretKey123"; 

// Проверяем ключ безопасности
if (!isset($_GET['key']) || $_GET['key'] !== $SECRET_KEY) {
    die("Ошибка: Доступ запрещен");
}

$nickname = $_GET['nick'] ?? null;
$kit      = $_GET['kit'] ?? null;
$tier     = strtoupper($_GET['tier'] ?? '');

if (!$nickname || !$kit || !$tier) {
    die("Ошибка: Не все параметры указаны");
}

$file = './database.json';
if (!file_exists($file)) {
    die("Ошибка: Файл database.json не найден");
}

// Читаем текущую базу данных
$data = json_decode(file_get_contents($file), true);

// Список разрешенных вкладок (китов)
$valid_kits = ['nodebuffelo', 'builduhcelo', 'pot', 'netherop', 'sword', 'axe', 'mace'];

if (!in_array($kit, $valid_kits)) {
    die("Ошибка: Неверный режим (кит)");
}

// Удаляем игрока из этого режима, если он там уже был (чтобы не было дубликатов)
foreach ($data[$kit] as $key => $player) {
    if (strcasecmp($player['nickname'], $nickname) === 0) {
        unset($data[$kit][$key]);
    }
}
// Сбрасываем индексы массива после удаления
$data[$kit] = array_values($data[$kit]);

// Если тир не "NONE" или "REMOVE", добавляем игрока с новым тиром
if ($tier !== 'NONE' && $tier !== 'REMOVE') {
    $data[$kit][] = [
        "nickname" => $nickname,
        "tier" => $tier
    ];
}

// Сохраняем обновленный файл обратно на хостинг
if (file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo "Успешно: Данные игрока $nickname обновлены для режима $kit";
} else {
    echo "Ошибка записи в файл";
}
