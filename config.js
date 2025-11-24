// Расширенная конфигурация Alt-Market
const CONFIG = {
    loyaltyPerClick: 8,
    loyaltyForLevelUp: 1500,
    
    // Улучшения для кликов - 30 карточек
    upgrades: [
        // Начальный уровень
        { id: 1, name: 'Мышка', icon: '🖱️', baseCost: 20, clickBonus: 1, type: 'click' },
        { id: 2, name: 'Коврик RGB', icon: '🌈', baseCost: 80, clickBonus: 2, type: 'click' },
        { id: 3, name: 'Энергетик', icon: '⚡', baseCost: 150, clickBonus: 4, type: 'click' },
        { id: 4, name: 'Наушники', icon: '🎧', baseCost: 300, clickBonus: 7, type: 'click', combo: 'streamer' },
        { id: 5, name: 'Вебкамера', icon: '📹', baseCost: 500, clickBonus: 12, type: 'click', combo: 'streamer' },
        
        // Средний уровень
        { id: 6, name: 'Геймерский стул', icon: '🪑', baseCost: 800, clickBonus: 20, type: 'click' },
        { id: 7, name: 'Микрофон', icon: '🎙️', baseCost: 1200, clickBonus: 35, type: 'click', combo: 'streamer' },
        { id: 8, name: 'LED лента', icon: '💡', baseCost: 1800, clickBonus: 55, type: 'click' },
        { id: 9, name: 'Механика', icon: '⌨️', baseCost: 2500, clickBonus: 85, type: 'click' },
        { id: 10, name: 'Второй монитор', icon: '🖥️', baseCost: 3500, clickBonus: 130, type: 'click' },
        
        // Продвинутый уровень
        { id: 11, name: 'Игровая консоль', icon: '🎮', baseCost: 5000, clickBonus: 200, type: 'click' },
        { id: 12, name: 'VR шлем', icon: '🥽', baseCost: 7000, clickBonus: 300, type: 'click' },
        { id: 13, name: 'Графический планшет', icon: '✏️', baseCost: 9500, clickBonus: 450, type: 'click' },
        { id: 14, name: 'Стриминг декор', icon: '🎬', baseCost: 12000, clickBonus: 650, type: 'click' },
        { id: 15, name: 'RTX 3080', icon: '🔥', baseCost: 16000, clickBonus: 900, type: 'click' },
        
        // Топ уровень
        { id: 16, name: 'RTX 4090', icon: '💎', baseCost: 22000, clickBonus: 1300, type: 'click' },
        { id: 17, name: 'Игровое кресло Pro', icon: '👑', baseCost: 30000, clickBonus: 1850, type: 'click' },
        { id: 18, name: 'Голосовой помощник', icon: '🤖', baseCost: 40000, clickBonus: 2600, type: 'click' },
        { id: 19, name: 'Умный стол', icon: '🛠️', baseCost: 55000, clickBonus: 3700, type: 'click' },
        { id: 20, name: 'Квантовый ПК', icon: '⚛️', baseCost: 75000, clickBonus: 5200, type: 'click' },
        
        // Легендарный уровень
        { id: 21, name: 'Нейроинтерфейс', icon: '🧠', baseCost: 100000, clickBonus: 7500, type: 'click' },
        { id: 22, name: 'Голограф проектор', icon: '👻', baseCost: 140000, clickBonus: 11000, type: 'click' },
        { id: 23, name: 'Искин интеллект', icon: '🤯', baseCost: 190000, clickBonus: 16000, type: 'click' },
        { id: 24, name: 'Киберкокон', icon: '🔮', baseCost: 260000, clickBonus: 23000, type: 'click' },
        { id: 25, name: 'Нано-перчатки', icon: '🧤', baseCost: 350000, clickBonus: 33000, type: 'click' },
        
        // Мифический уровень
        { id: 26, name: 'Квантовое поле', icon: '🌌', baseCost: 480000, clickBonus: 48000, type: 'click' },
        { id: 27, name: 'Телепорт кабина', icon: '🚀', baseCost: 650000, clickBonus: 70000, type: 'click' },
        { id: 28, name: 'Временной ускоритель', icon: '⏰', baseCost: 880000, clickBonus: 100000, type: 'click' },
        { id: 29, name: 'Реактор холодного синтеза', icon: '☢️', baseCost: 1200000, clickBonus: 145000, type: 'click' },
        { id: 30, name: 'Божественный трон', icon: '✨', baseCost: 1650000, clickBonus: 210000, type: 'click' },
        
        // Автокликеры - 25 карточек
        { id: 31, name: 'Авток', icon: '🤏', baseCost: 300, autoClick: 0.8, type: 'auto' },
        { id: 32, name: 'Робо-палец', icon: '👆', baseCost: 600, autoClick: 1.5, type: 'auto' },
        { id: 33, name: 'Турбо кликер', icon: '🚀', baseCost: 1000, autoClick: 3, type: 'auto' },
        { id: 34, name: 'Кликер Pro', icon: '⚙️', baseCost: 1800, autoClick: 6, type: 'auto' },
        { id: 35, name: 'Дрон кликер', icon: '🛸', baseCost: 3000, autoClick: 11, type: 'auto' },
        { id: 36, name: 'Мега бот', icon: '🦾', baseCost: 5000, autoClick: 19, type: 'auto' },
        { id: 37, name: 'Киборг рука', icon: '🦿', baseCost: 8000, autoClick: 32, type: 'auto' },
        { id: 38, name: 'Нано роботы', icon: '🔬', baseCost: 13000, autoClick: 55, type: 'auto' },
        { id: 39, name: 'ИИ ассистент', icon: '🧠', baseCost: 21000, autoClick: 95, type: 'auto' },
        { id: 40, name: 'Клон армия', icon: '👥', baseCost: 34000, autoClick: 160, type: 'auto' },
        { id: 41, name: 'Квант процессор', icon: '💻', baseCost: 55000, autoClick: 270, type: 'auto' },
        { id: 42, name: 'Роботы-паучки', icon: '🕷️', baseCost: 88000, autoClick: 450, type: 'auto' },
        { id: 43, name: 'Нейросеть v2', icon: '🌐', baseCost: 140000, autoClick: 750, type: 'auto' },
        { id: 44, name: 'Био-реактор', icon: '⚗️', baseCost: 220000, autoClick: 1250, type: 'auto' },
        { id: 45, name: 'Умный рой', icon: '🐝', baseCost: 350000, autoClick: 2100, type: 'auto' },
        { id: 46, name: 'Сингулярность', icon: '🌀', baseCost: 550000, autoClick: 3500, type: 'auto' },
        { id: 47, name: 'Временная петля', icon: '♾️', baseCost: 850000, autoClick: 5800, type: 'auto' },
        { id: 48, name: 'Квантовый туннель', icon: '🕳️', baseCost: 1300000, autoClick: 9600, type: 'auto' },
        { id: 49, name: 'Параллельная вселенная', icon: '🌍', baseCost: 2000000, autoClick: 16000, type: 'auto' },
        { id: 50, name: 'Мультиверс портал', icon: '🌈', baseCost: 3100000, autoClick: 26000, type: 'auto' },
        { id: 51, name: 'Вечный двигатель', icon: '⚙️', baseCost: 4800000, autoClick: 43000, type: 'auto' },
        { id: 52, name: 'Бог-машина', icon: '🏛️', baseCost: 7300000, autoClick: 71000, type: 'auto' },
        { id: 53, name: 'Космос-фабрика', icon: '🏭', baseCost: 11000000, autoClick: 117000, type: 'auto' },
        { id: 54, name: 'Галактический разум', icon: '🧬', baseCost: 17000000, autoClick: 193000, type: 'auto' },
        { id: 55, name: 'Абсолют', icon: '👁️', baseCost: 26000000, autoClick: 318000, type: 'auto' },
    ],
    
    // Инвестиции/Бизнес - 40 карточек
    investments: [
        // Стартап уровень
        { id: 1, name: 'Telegram канал', icon: '📱', baseCost: 150, income: 0.8 },
        { id: 2, name: 'VK паблик', icon: '🔵', baseCost: 350, income: 2 },
        { id: 3, name: 'TikTok аккаунт', icon: '🎵', baseCost: 700, income: 4.5 },
        { id: 4, name: 'YouTube канал', icon: '📺', baseCost: 1200, income: 9 },
        { id: 5, name: 'Twitch стрим', icon: '💜', baseCost: 2000, income: 17 },
        
        // Малый бизнес
        { id: 6, name: 'Интернет магазин', icon: '🛒', baseCost: 3500, income: 30 },
        { id: 7, name: 'Футфетиш бутик', icon: '👣', baseCost: 6000, income: 55 },
        { id: 8, name: 'Мерч линия', icon: '👕', baseCost: 10000, income: 95 },
        { id: 9, name: 'Бот для Discord', icon: '🤖', baseCost: 16000, income: 165 },
        { id: 10, name: 'Курсы онлайн', icon: '📚', baseCost: 26000, income: 285 },
        
        // Средний бизнес
        { id: 11, name: 'Маркетинг агентство', icon: '📊', baseCost: 42000, income: 490 },
        { id: 12, name: 'Стриминг студия', icon: '🎬', baseCost: 68000, income: 840 },
        { id: 13, name: 'NFT галерея', icon: '🎨', baseCost: 110000, income: 1450 },
        { id: 14, name: 'Крипто скам', icon: '💎', baseCost: 175000, income: 2500 },
        { id: 15, name: 'OnlyFans империя', icon: '👑', baseCost: 280000, income: 4300 },
        
        // Крупный бизнес
        { id: 16, name: 'Сеть кафе', icon: '☕', baseCost: 450000, income: 7400 },
        { id: 17, name: 'Финтех стартап', icon: '💳', baseCost: 720000, income: 12700 },
        { id: 18, name: 'Мобильное приложение', icon: '📲', baseCost: 1150000, income: 21800 },
        { id: 19, name: 'Игровая студия', icon: '🎮', baseCost: 1850000, income: 37400 },
        { id: 20, name: 'Метавселенная', icon: '🌐', baseCost: 2950000, income: 64000 },
        
        // Корпорация
        { id: 21, name: 'IT корпорация', icon: '🏢', baseCost: 4700000, income: 110000 },
        { id: 22, name: 'Соцсеть', icon: '🌍', baseCost: 7500000, income: 188000 },
        { id: 23, name: 'Стриминг платформа', icon: '📡', baseCost: 12000000, income: 322000 },
        { id: 24, name: 'Облачные сервера', icon: '☁️', baseCost: 19000000, income: 551000 },
        { id: 25, name: 'Биотех лаборатория', icon: '🧬', baseCost: 30000000, income: 943000 },
        
        // Монополия
        { id: 26, name: 'Космотуризм', icon: '🚀', baseCost: 48000000, income: 1610000 },
        { id: 27, name: 'Квантовый майнинг', icon: '⚛️', baseCost: 77000000, income: 2760000 },
        { id: 28, name: 'Нейросеть как сервис', icon: '🧠', baseCost: 123000000, income: 4720000 },
        { id: 29, name: 'Термоядерная электростанция', icon: '☢️', baseCost: 197000000, income: 8070000 },
        { id: 30, name: 'Марсианская колония', icon: '🪐', baseCost: 315000000, income: 13800000 },
        
        // Межгалактика
        { id: 31, name: 'Телепортация сеть', icon: '🌀', baseCost: 505000000, income: 23600000 },
        { id: 32, name: 'Добыча антиматерии', icon: '💥', baseCost: 808000000, income: 40400000 },
        { id: 33, name: 'Временные путешествия', icon: '⏳', baseCost: 1290000000, income: 69100000 },
        { id: 34, name: 'Торговля между измерениями', icon: '🕳️', baseCost: 2060000000, income: 118000000 },
        { id: 35, name: 'Звёздные врата', icon: '✨', baseCost: 3290000000, income: 202000000 },
        
        // Божественный уровень
        { id: 36, name: 'Производство планет', icon: '🌎', baseCost: 5260000000, income: 346000000 },
        { id: 37, name: 'Управление галактиками', icon: '🌌', baseCost: 8410000000, income: 592000000 },
        { id: 38, name: 'Ферма черных дыр', icon: '⚫', baseCost: 13450000000, income: 1010000000 },
        { id: 39, name: 'Вселенский банк', icon: '🏦', baseCost: 21500000000, income: 1730000000 },
        { id: 40, name: 'Мультивселенная инк', icon: '♾️', baseCost: 34400000000, income: 2960000000 },
    ],
    
    // Комбо достижения
    combos: {
        streamer: {
            name: 'Стримерша',
            icon: '🎬',
            description: 'Купи Наушники, Микрофон и Вебкамеру',
            requiredUpgrades: [4, 5, 7], // ID улучшений
            bonus: 0.2, // +20% к бонусам этих улучшений
            reward: 5000 // Бонусные vibes за достижение
        }
    }
};