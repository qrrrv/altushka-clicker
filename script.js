// Конфигурация игры загружается из config.js

const photos = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo6.jpg'];

// Состояние игры
const state = {
    vibes: 0,
    totalVibes: 0,
    vibesPerClick: 1,
    vibesPerSecond: 0,
    autoClickRate: 0,
    loyalty: 0,
    level: 1,
    upgrades: [],
    investments: [],
    currentPhotoIndex: 0,
    clicks: 0,
    startTime: Date.now(),
    achievements: {
        firstClick: false,
        clicks100: false,
        vibes1000: false,
        level5: false,
        vibes10000: false,
        level10: false,
        streamerCombo: false
    },
    comboBonuses: {}
};

// Настройки
const settings = {
    theme: 'light',
    animations: true,
    sounds: true,
    floatingNumbers: true,
    volume: 0.5
};

// Звуковые эффекты
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (!settings.sounds) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(settings.volume * 0.3, audioContext.currentTime);
    
    switch(type) {
        case 'click':
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
        case 'buy':
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
            
        case 'levelup':
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            break;
            
        case 'achievement':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.15);
            oscillator.frequency.setValueAtTime(1319, audioContext.currentTime + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
            break;
            
        case 'error':
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
    }
}

// Форматирование чисел
function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
}

// Установка темы
function setTheme(theme) {
    settings.theme = theme;
    document.body.className = theme === 'light' ? '' : theme + '-theme';
    localStorage.setItem('altmarketSettings', JSON.stringify(settings));
    updateThemeButtons();
}

function updateThemeButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === settings.theme);
    });
}

// Проверка комбо достижений
function checkCombos() {
    Object.entries(CONFIG.combos).forEach(([comboId, combo]) => {
        if (state.achievements[comboId + 'Combo']) return;
        
        const hasAllUpgrades = combo.requiredUpgrades.every(upgradeId => {
            const upgrade = state.upgrades.find(u => u.id === upgradeId);
            return upgrade && upgrade.level > 0;
        });
        
        if (hasAllUpgrades) {
            state.achievements[comboId + 'Combo'] = true;
            state.comboBonuses[comboId] = combo.bonus;
            state.vibes += combo.reward;
            state.totalVibes += combo.reward;
            
            playSound('achievement');
            showNotification(`🎉 ${combo.icon} Комбо "${combo.name}" разблокировано! +${combo.bonus * 100}% к улучшениям! Бонус: ${formatNumber(combo.reward)} 💎`);
            
            const achElement = document.getElementById('achStreamer');
            if (achElement) {
                achElement.classList.add('unlocked');
            }
        }
    });
}

// Расчет статистики с учетом комбо
function calculateStats() {
    let totalClickBonus = 1;
    state.upgrades.forEach(u => {
        if (u.type === 'click') {
            let bonus = u.level * u.clickBonus;
            
            // Применяем комбо-бонус если есть
            if (u.combo && state.comboBonuses[u.combo]) {
                bonus *= (1 + state.comboBonuses[u.combo]);
            }
            
            totalClickBonus += bonus;
        }
    });
    state.vibesPerClick = totalClickBonus;

    let totalAutoClick = 0;
    state.upgrades.forEach(u => {
        if (u.type === 'auto') totalAutoClick += u.level * u.autoClick;
    });
    state.autoClickRate = totalAutoClick;

    let totalIncome = 0;
    state.investments.forEach(inv => {
        totalIncome += inv.level * inv.income;
    });
    state.vibesPerSecond = totalIncome + totalAutoClick;
}

// Обновление UI
function updateUI() {
    document.getElementById('totalVibes').textContent = formatNumber(Math.floor(state.vibes));
    document.getElementById('vibesPerSec').textContent = formatNumber(state.vibesPerSecond);
    document.getElementById('level').textContent = state.level;
    document.getElementById('levelBadge').textContent = state.level;
    document.getElementById('clickPower').textContent = formatNumber(state.vibesPerClick);
    document.getElementById('autoClickRate').textContent = formatNumber(state.autoClickRate);

    const loyaltyPercent = Math.min((state.loyalty / CONFIG.loyaltyForLevelUp) * 100, 100);
    document.getElementById('loyaltyFill').style.width = loyaltyPercent + '%';
    document.getElementById('loyaltyPercent').textContent = Math.floor(loyaltyPercent) + '%';
    
    const photoImg = document.getElementById('photoImg');
    if (photoImg) {
        photoImg.src = photos[state.currentPhotoIndex % photos.length];
    }

    updateStats();
    checkAchievements();
    checkCombos();
}

// Обновление статистики
function updateStats() {
    if (document.getElementById('statTotal')) {
        document.getElementById('statTotal').textContent = formatNumber(Math.floor(state.totalVibes));
    }
    if (document.getElementById('statClicks')) {
        document.getElementById('statClicks').textContent = formatNumber(state.clicks);
    }
    if (document.getElementById('statLevels')) {
        document.getElementById('statLevels').textContent = state.level;
    }
    if (document.getElementById('statTime')) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            document.getElementById('statTime').textContent = hours + 'ч ' + mins + 'м';
        } else {
            document.getElementById('statTime').textContent = minutes + 'м';
        }
    }
}

// Проверка достижений
function checkAchievements() {
    const achievements = [
        { id: 'ach1', key: 'firstClick', condition: state.clicks >= 1 },
        { id: 'ach2', key: 'clicks100', condition: state.clicks >= 100 },
        { id: 'ach3', key: 'vibes1000', condition: state.totalVibes >= 1000 },
        { id: 'ach4', key: 'level5', condition: state.level >= 5 },
        { id: 'ach5', key: 'vibes10000', condition: state.totalVibes >= 10000 },
        { id: 'ach6', key: 'level10', condition: state.level >= 10 }
    ];
    
    achievements.forEach(ach => {
        if (ach.condition && !state.achievements[ach.key]) {
            state.achievements[ach.key] = true;
            const element = document.getElementById(ach.id);
            if (element) {
                element.classList.add('unlocked');
            }
            playSound('achievement');
            showNotification('🏆 Достижение разблокировано!');
        }
    });
}

// Показать уведомление
function showNotification(text) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        padding: 15px 30px;
        border-radius: 15px;
        font-weight: 600;
        z-index: 9999;
        animation: slideDown 0.5s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        max-width: 90%;
        text-align: center;
    `;
    notification.textContent = text;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Показать плавающее число
function showFloatingNumber(x, y, amount) {
    if (!settings.floatingNumbers) return;
    
    const floatingNum = document.createElement('div');
    floatingNum.className = 'floating-number';
    floatingNum.textContent = '+' + formatNumber(amount);
    floatingNum.style.left = x + 'px';
    floatingNum.style.top = y + 'px';
    
    document.body.appendChild(floatingNum);
    
    setTimeout(() => {
        floatingNum.remove();
    }, 1000);
}

// Обработка клика
function handleClick(e) {
    state.vibes += state.vibesPerClick;
    state.totalVibes += state.vibesPerClick;
    state.loyalty += CONFIG.loyaltyPerClick;
    state.clicks++;
    
    playSound('click');
    
    if (settings.floatingNumbers) {
        const x = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth / 2;
        const y = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight / 2;
        showFloatingNumber(x, y, state.vibesPerClick);
    }
    
    if (state.loyalty >= CONFIG.loyaltyForLevelUp) {
        state.loyalty = 0;
        state.level++;
        state.currentPhotoIndex = (state.currentPhotoIndex + 1) % photos.length;
        playSound('levelup');
        showNotification('🎉 Новый уровень: ' + state.level);
    }
    
    updateUI();
    renderUpgrades();
    renderInvestments();
    saveGame();
}

// Расчет стоимости улучшения
function calculateCost(baseCost, level) {
    return Math.floor(baseCost * Math.pow(1.18, level));
}

// Покупка улучшения
function buyUpgrade(upgradeId) {
    const config = CONFIG.upgrades.find(u => u.id === upgradeId);
    let upgrade = state.upgrades.find(u => u.id === upgradeId);
    
    if (!upgrade) {
        upgrade = { id: upgradeId, level: 0, ...config };
        state.upgrades.push(upgrade);
    }
    
    const cost = calculateCost(config.baseCost, upgrade.level);
    
    if (state.vibes >= cost) {
        state.vibes -= cost;
        upgrade.level++;
        playSound('buy');
        calculateStats();
        updateUI();
        renderUpgrades();
        renderInvestments();
        saveGame();
    } else {
        playSound('error');
    }
}

// Покупка инвестиции
function buyInvestment(investmentId) {
    const config = CONFIG.investments.find(i => i.id === investmentId);
    let investment = state.investments.find(i => i.id === investmentId);
    
    if (!investment) {
        investment = { id: investmentId, level: 0, ...config };
        state.investments.push(investment);
    }
    
    const cost = calculateCost(config.baseCost, investment.level);
    
    if (state.vibes >= cost) {
        state.vibes -= cost;
        investment.level++;
        playSound('buy');
        calculateStats();
        updateUI();
        renderUpgrades();
        renderInvestments();
        saveGame();
    } else {
        playSound('error');
    }
}

// Отрисовка улучшений
function renderUpgrades() {
    const container = document.getElementById('upgradesList');
    container.innerHTML = '';
    
    CONFIG.upgrades.forEach(config => {
        const upgrade = state.upgrades.find(u => u.id === config.id) || { level: 0 };
        const cost = calculateCost(config.baseCost, upgrade.level);
        const canAfford = state.vibes >= cost;
        
        const card = document.createElement('div');
        card.className = 'card' + (canAfford ? '' : ' disabled');
        
        let bonusText = '';
        if (config.type === 'click') {
            let bonus = config.clickBonus;
            if (config.combo && state.comboBonuses[config.combo]) {
                bonus *= (1 + state.comboBonuses[config.combo]);
                bonusText = `+${formatNumber(bonus)} за клик ⭐`;
            } else {
                bonusText = `+${formatNumber(config.clickBonus)} за клик`;
            }
        } else if (config.type === 'auto') {
            bonusText = `+${formatNumber(config.autoClick)} авто/сек`;
        }
        
        card.innerHTML = `
            <div class="card-header">
                <div style="display: flex; align-items: center;">
                    <span class="card-icon">${config.icon}</span>
                    <span class="card-title">${config.name}</span>
                </div>
                <span class="card-level">Ур. ${upgrade.level}</span>
            </div>
            <div class="card-stats">
                <span>${bonusText}</span>
                <span style="color: var(--primary); font-weight: 700;">${formatNumber(cost)} 💎</span>
            </div>
        `;
        
        card.addEventListener('click', () => buyUpgrade(config.id));
        container.appendChild(card);
    });
}

// Отрисовка инвестиций
function renderInvestments() {
    const container = document.getElementById('investmentsList');
    container.innerHTML = '';
    
    CONFIG.investments.forEach(config => {
        const investment = state.investments.find(i => i.id === config.id) || { level: 0 };
        const cost = calculateCost(config.baseCost, investment.level);
        const canAfford = state.vibes >= cost;
        
        const card = document.createElement('div');
        card.className = 'card' + (canAfford ? '' : ' disabled');
        
        card.innerHTML = `
            <div class="card-header">
                <div style="display: flex; align-items: center;">
                    <span class="card-icon">${config.icon}</span>
                    <span class="card-title">${config.name}</span>
                </div>
                <span class="card-level">Ур. ${investment.level}</span>
            </div>
            <div class="card-stats">
                <span>+${formatNumber(config.income)} vibes/сек</span>
                <span style="color: var(--primary); font-weight: 700;">${formatNumber(cost)} 💎</span>
            </div>
        `;
        
        card.addEventListener('click', () => buyInvestment(config.id));
        container.appendChild(card);
    });
}

// Сохранение игры
function saveGame() {
    localStorage.setItem('altmarketState', JSON.stringify(state));
}

// Загрузка игры
function loadGame() {
    const saved = localStorage.getItem('altmarketState');
    if (saved) {
        const loadedState = JSON.parse(saved);
        Object.assign(state, loadedState);
        calculateStats();
        updateUI();
        renderUpgrades();
        renderInvestments();
    }
    
    const savedSettings = localStorage.getItem('altmarketSettings');
    if (savedSettings) {
        Object.assign(settings, JSON.parse(savedSettings));
        setTheme(settings.theme);
        document.getElementById('volumeSlider').value = settings.volume * 100;
        document.getElementById('volumeValue').textContent = Math.floor(settings.volume * 100);
        
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            const setting = toggle.getAttribute('data-setting');
            toggle.classList.toggle('active', settings[setting]);
        });
    }
}

// Сброс игры
function resetGame() {
    if (confirm('Вы уверены что хотите сбросить весь прогресс?')) {
        localStorage.removeItem('altmarketState');
        localStorage.removeItem('cryptoGameData');
        playSound('error');
        location.reload();
    }
}

// Экспорт данных
function exportGame() {
    const data = JSON.stringify(state);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'altmarket-save.json';
    a.click();
    playSound('buy');
    showNotification('💾 Сохранение экспортировано!');
}

// Переключение вкладок
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById('tab-' + tabName).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    playSound('click');
    
    // Инициализация мини-игр при открытии вкладки
    if (tabName === 'minigames') {
        initMinigames();
    }
}

// Переключение мини-игр
function switchMinigame(gameName) {
    document.querySelectorAll('.minigame-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('minigame-' + gameName).classList.add('active');
    
    document.querySelectorAll('.minigame-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-game="${gameName}"]`).classList.add('active');
    
    playSound('click');
    
    // Остановить предыдущие игры
    if (cryptoGame) cryptoGame.stop();
    
    // Запустить текущую игру
    if (gameName === 'crypto' && cryptoGame) {
        cryptoGame.start();
    } else if (gameName === 'roulette' && rouletteGame) {
        rouletteGame.render();
    } else if (gameName === 'slots' && slotsGame) {
        slotsGame.render();
    }
}

// Инициализация мини-игр
function initMinigames() {
    if (!cryptoGame) {
        cryptoGame = new CryptoGame(state);
        cryptoGame.start();
    }
    if (!rouletteGame) {
        rouletteGame = new RouletteGame(state);
        rouletteGame.render();
    }
    if (!slotsGame) {
        slotsGame = new SlotsGame(state);
        slotsGame.render();
    }
}

// Игровой цикл
function gameLoop() {
    if (state.vibesPerSecond > 0) {
        state.vibes += state.vibesPerSecond / 10;
        state.totalVibes += state.vibesPerSecond / 10;
        updateUI();
    }
}

// Добавим CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Инициализация
function init() {
    loadGame();
    renderUpgrades();
    renderInvestments();
    
    const clickBtn = document.getElementById('clickBtn');
    clickBtn.addEventListener('click', handleClick);
    clickBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleClick(e);
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.getAttribute('data-tab'));
        });
    });
    
    document.querySelectorAll('.minigame-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            switchMinigame(btn.getAttribute('data-game'));
        });
    });
    
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.add('active');
        playSound('click');
    });
    
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.remove('active');
        playSound('click');
    });
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.getAttribute('data-theme'));
            playSound('click');
        });
    });
    
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const setting = toggle.getAttribute('data-setting');
            settings[setting] = !settings[setting];
            toggle.classList.toggle('active', settings[setting]);
            localStorage.setItem('altmarketSettings', JSON.stringify(settings));
            playSound('click');
        });
    });
    
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    
    volumeSlider.addEventListener('input', (e) => {
        settings.volume = e.target.value / 100;
        volumeValue.textContent = e.target.value;
        localStorage.setItem('altmarketSettings', JSON.stringify(settings));
    });
    
    volumeSlider.addEventListener('change', () => {
        playSound('click');
    });
    
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('exportBtn').addEventListener('click', exportGame);
    
    document.getElementById('settingsModal').addEventListener('click', (e) => {
        if (e.target.id === 'settingsModal') {
            document.getElementById('settingsModal').classList.remove('active');
            playSound('click');
        }
    });
    
    setInterval(gameLoop, 100);
    setInterval(saveGame, 5000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}