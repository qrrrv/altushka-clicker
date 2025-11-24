// Мини-игра: Крипто биржа
class CryptoGame {
    constructor(state) {
        this.state = state;
        this.coins = [
            { id: 1, name: 'BitCoin', symbol: 'BTC', icon: '₿', basePrice: 1000, volatility: 0.05 },
            { id: 2, name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', basePrice: 500, volatility: 0.07 },
            { id: 3, name: 'DogeCoin', symbol: 'DOGE', icon: '🐕', basePrice: 50, volatility: 0.15 },
            { id: 4, name: 'MemeCoin', symbol: 'MEME', icon: '😂', basePrice: 10, volatility: 0.25 }
        ];
        
        this.portfolio = {};
        this.priceHistory = {};
        this.updateInterval = null;
        
        this.init();
    }
    
    init() {
        // Инициализация цен
        this.coins.forEach(coin => {
            this.portfolio[coin.symbol] = 0;
            this.priceHistory[coin.symbol] = [coin.basePrice];
        });
        
        // Загрузка сохраненных данных
        const saved = localStorage.getItem('cryptoGameData');
        if (saved) {
            const data = JSON.parse(saved);
            this.portfolio = data.portfolio || this.portfolio;
            this.priceHistory = data.priceHistory || this.priceHistory;
        }
    }
    
    getCurrentPrice(symbol) {
        const history = this.priceHistory[symbol];
        return history[history.length - 1];
    }
    
    updatePrices() {
        this.coins.forEach(coin => {
            const currentPrice = this.getCurrentPrice(coin.symbol);
            const change = (Math.random() - 0.5) * 2 * coin.volatility;
            let newPrice = currentPrice * (1 + change);
            
            // Не даем цене упасть ниже 10% от базовой
            newPrice = Math.max(newPrice, coin.basePrice * 0.1);
            
            this.priceHistory[coin.symbol].push(newPrice);
            
            // Храним только последние 50 цен
            if (this.priceHistory[coin.symbol].length > 50) {
                this.priceHistory[coin.symbol].shift();
            }
        });
        
        this.save();
        this.render();
    }
    
    buy(symbol, amount) {
        const coin = this.coins.find(c => c.symbol === symbol);
        if (!coin) return false;
        
        const price = this.getCurrentPrice(symbol);
        const cost = price * amount;
        
        if (this.state.vibes >= cost) {
            this.state.vibes -= cost;
            this.portfolio[symbol] = (this.portfolio[symbol] || 0) + amount;
            this.save();
            return true;
        }
        return false;
    }
    
    sell(symbol, amount) {
        if ((this.portfolio[symbol] || 0) >= amount) {
            const price = this.getCurrentPrice(symbol);
            const earnings = price * amount;
            
            this.state.vibes += earnings;
            this.state.totalVibes += earnings;
            this.portfolio[symbol] -= amount;
            this.save();
            return true;
        }
        return false;
    }
    
    getPortfolioValue() {
        let total = 0;
        Object.keys(this.portfolio).forEach(symbol => {
            const amount = this.portfolio[symbol];
            const price = this.getCurrentPrice(symbol);
            total += amount * price;
        });
        return total;
    }
    
    save() {
        localStorage.setItem('cryptoGameData', JSON.stringify({
            portfolio: this.portfolio,
            priceHistory: this.priceHistory
        }));
    }
    
    start() {
        if (this.updateInterval) return;
        this.updateInterval = setInterval(() => this.updatePrices(), 3000);
        this.render();
    }
    
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    render() {
        const container = document.getElementById('cryptoGame');
        if (!container) return;
        
        const portfolioValue = this.getPortfolioValue();
        
        let html = `
            <div style="background: var(--card-bg); border-radius: 20px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: var(--text); margin-bottom: 15px;">💼 Портфель</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: var(--text);">Баланс:</span>
                    <span style="color: var(--primary); font-weight: 700;">${formatNumber(Math.floor(this.state.vibes))} 💎</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text);">Стоимость активов:</span>
                    <span style="color: var(--secondary); font-weight: 700;">${formatNumber(Math.floor(portfolioValue))} 💎</span>
                </div>
            </div>
        `;
        
        this.coins.forEach(coin => {
            const currentPrice = this.getCurrentPrice(coin.symbol);
            const history = this.priceHistory[coin.symbol];
            const priceChange = history.length > 1 ? 
                ((currentPrice - history[history.length - 2]) / history[history.length - 2] * 100) : 0;
            const owned = this.portfolio[coin.symbol] || 0;
            const ownedValue = owned * currentPrice;
            
            const changeColor = priceChange >= 0 ? '#4CAF50' : '#FF5252';
            const changeIcon = priceChange >= 0 ? '📈' : '📉';
            
            html += `
                <div style="background: var(--card-bg); border-radius: 16px; padding: 16px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 32px;">${coin.icon}</span>
                            <div>
                                <div style="font-weight: 700; color: var(--text); font-size: 16px;">${coin.name}</div>
                                <div style="font-size: 12px; color: var(--text-light);">${coin.symbol}</div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; color: var(--primary); font-size: 18px;">${formatNumber(Math.floor(currentPrice))} 💎</div>
                            <div style="font-size: 12px; color: ${changeColor};">
                                ${changeIcon} ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                    
                    ${owned > 0 ? `
                        <div style="background: var(--bg); padding: 8px; border-radius: 8px; margin-bottom: 10px;">
                            <div style="font-size: 12px; color: var(--text-light);">В портфеле:</div>
                            <div style="font-weight: 600; color: var(--text);">${owned.toFixed(4)} ${coin.symbol} ≈ ${formatNumber(Math.floor(ownedValue))} 💎</div>
                        </div>
                    ` : ''}
                    
                    <div style="display: flex; gap: 8px;">
                        <button onclick="cryptoGame.buyPrompt('${coin.symbol}')" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #4CAF50, #45a049); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">
                            Купить
                        </button>
                        <button onclick="cryptoGame.sellPrompt('${coin.symbol}')" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #FF6B6B, #FF5252); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;" ${owned <= 0 ? 'disabled style="opacity: 0.5;"' : ''}>
                            Продать
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    buyPrompt(symbol) {
        const coin = this.coins.find(c => c.symbol === symbol);
        const price = this.getCurrentPrice(symbol);
        const maxAmount = Math.floor(this.state.vibes / price * 100) / 100;
        
        const amount = prompt(`Купить ${coin.name}?\nТекущая цена: ${formatNumber(Math.floor(price))} 💎\nМаксимум: ${maxAmount.toFixed(4)} ${symbol}\n\nВведите количество:`);
        
        if (amount && !isNaN(amount) && amount > 0) {
            if (this.buy(symbol, parseFloat(amount))) {
                playSound('buy');
                showNotification(`✅ Куплено ${parseFloat(amount).toFixed(4)} ${symbol}`);
            } else {
                playSound('error');
                showNotification('❌ Недостаточно средств!');
            }
        }
    }
    
    sellPrompt(symbol) {
        const coin = this.coins.find(c => c.symbol === symbol);
        const owned = this.portfolio[symbol] || 0;
        
        const amount = prompt(`Продать ${coin.name}?\nВ портфеле: ${owned.toFixed(4)} ${symbol}\n\nВведите количество:`);
        
        if (amount && !isNaN(amount) && amount > 0) {
            if (this.sell(symbol, parseFloat(amount))) {
                playSound('buy');
                showNotification(`✅ Продано ${parseFloat(amount).toFixed(4)} ${symbol}`);
            } else {
                playSound('error');
                showNotification('❌ Недостаточно монет!');
            }
        }
    }
}

// Глобальная переменная для доступа из HTML
let cryptoGame = null;