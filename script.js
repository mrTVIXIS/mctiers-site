// Функция для загрузки и отрисовки тир-листа Кроноса
function loadKronosTiers(activeKit) {
    // 1. Запрашиваем наш JSON файл базы данных
    fetch('./database.json')
        .then(response => response.json())
        .then(data => {
            // Получаем массив игроков для конкретного выбранного кита (например, 'mace')
            const players = data[activeKit] || [];

            // Находим контейнер на сайте, куда нужно вставить карточки игроков
            // (Замени '.leaderboard-container' на класс или ID своего блока)
            const container = document.querySelector('.leaderboard-container');
            container.innerHTML = ''; // Очищаем старые карточки перед обновлением

            if (players.length === 0) {
                container.innerHTML = '<div class="no-players">В этом режиме еще нет тированных игроков</div>';
                return;
            }

            // 2. Генерируем карточки для каждого игрока
            players.forEach(player => {
                // Создаем элемент карточки
                const card = document.createElement('div');
                card.className = `player-card tier-${player.tier.toLowerCase()}`; // Класс вроде player-card tier-ht1

                // Внутренний HTML карточки (подставь свои теги и дизайн)
                card.innerHTML = `
                    <div class="player-info">
                        <img src="https://minotar.net/helm/${player.nickname}/32" alt="${player.nickname}" class="player-head">
                        <span class="player-name">${player.nickname}</span>
                    </div>
                    <div class="player-tier-badge">${player.tier}</div>
                `;

                // Добавляем готовую карточку на страницу
                container.appendChild(card);
            });
        })
        .catch(error => console.error("Ошибка при чтении базы тиров Кроноса:", error));
}

// ПРИМЕР СВЯЗКИ С ТВОИМИ ВКЛАДКАМИ НА САЙТЕ:
// Когда пользователь кликает на кнопку "Mace", ты вызываешь:
// loadKronosTiers('mace');
// Когда кликает на "Vanilla":
// loadKronosTiers('nodebuffelo');
