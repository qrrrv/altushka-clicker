// Мини-игра: Слоты
class SlotsGame {
    constructor(state) {
        this.state = state;
        this.isSpinning = false;
        this.betAmount = 50;
        
        this.symbols = [
            { icon: '🍒', value: 'cherry', multiplier: 3 },
            { icon: '🍋', value: 'lemon', multiplier: 3 },
            { icon: '🍊', value: 'orange', multiplier: 5 },
            { icon: '🍇', value: 'grape', multiplier: 5 },
            { icon: '🔔', value: 'bell', multiplier: 10 },
            { icon: '💎', value: 'diamond', multiplier: 15 },
            { icon: '7️⃣', value: 'seven', multiplier: 50 }
        ];
        
        this.reels = [
            this.getRandomSymbol(),
            this.getRandomSymbol(),
            this.getRandomSymbol()
        ];
    }
    
    getRandomSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }
    
    async spin() {
        if (this.isSpinning) {
            showNotification('❌ Слоты уже крутятся!');
            return;
        }
        
        if (this.betAmount < 10) {
            showNotification('❌ Минимальная ставка: 10 💎');
            return;
        }
        
        if (this.state.vibes < this.betAmount) {
            showNotification('❌ Недостаточно средств!');
            playSound('error');
            return;
        }
        
        this.state.vibes -= this.betAmount;
        this.isSpinning = true;
        playSound('click');
        this.render();
        
        // Анимация вращения барабанов
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                // Меняем символы несколько раз для эффекта вращения
                let spins = 10 + i * 5;
                let spinInterval = setInterval(() => {
                    this.reels[i] = this.getRandomSymbol();
                    this.renderReels();
                    spins--;
                    
                    if (spins === 0) {
                        clearInterval(spinInterval);
                        
                        // Когда все барабаны остановились
                        if (i === 2) {
                            setTimeout(() => this.checkWin(), 200);
                        }
                    }
                }, 100);
            }, i * 500);
        }
    }
    
    checkWin() {
        const [reel1, reel2, reel3] = this.reels;
        let winAmount = 0;
        let message = '';
        
        // Три одинаковых
        if (reel1.value === reel2.value && reel2.value === reel3.value) {
            winAmount = this.betAmount * reel1.multiplier;
            message = `🎰 ДЖЕКПОТ! x${reel1.multiplier} = ${formatNumber(winAmount)} 💎`;
            playSound('levelup');
        }
        // Два одинаковых
        else if (reel1.value === reel2.value || reel2.value === reel3.value || reel1.value === reel3.value) {
            const matchSymbol = reel1.value === reel2.value ? reel1 : (reel2.value === reel3.value ? reel2 : reel1);
            winAmount = this.betAmount * (matchSymbol.multiplier * 0.3);
            message = `🎉 Два совпадения! x${(matchSymbol.multiplier * 0.3).toFixed(1)} = ${formatNumber(Math.floor(winAmount))} 💎`;
            playSound('buy');
        }
        else {
            message = `😢 Проигрыш: ${formatNumber(this.betAmount)} 💎`;
            playSound('error');
        }
        
        if (winAmount > 0) {
            this.state.vibes += winAmount;
            this.state.totalVibes += winAmount - this.betAmount;
        }
        
        this.isSpinning = false;
        showNotification(message);
        this.render();
    }
    
    renderReels() {
        const reelsContainer = document.getElementById('slotsReels');
        if (!reelsContainer) return;
        
        reelsContainer.innerHTML = this.reels.map(symbol => `
            <div style="width: 80px; height: 80px; background: var(--bg); border-radius: 12px; 
                display: flex; align-items: center; justify-content: center; font-size: 48px; 
                box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);">
                ${symbol.icon}
            </div>
        `).join('');
    }
    
    changeBet(amount) {
        this.betAmount = Math.max(10, amount);
        this.render();
    }
    
    render() {
        const container = document.getElementById('slotsGame');
        if (!container) return;
        
        let html = `
            <div style="background: var(--card-bg); border-radius: 20px; padding: 20px; margin-bottom: 20px; text-align: center;">
                <h3 style="color: var(--text); margin-bottom: 15px;">🎰 Слоты</h3>
                
                <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                    border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                    <div id="slotsReels" style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px;">
                    </div>
                </div>
                
                <div style="background: var(--bg); padding: 15px; border-radius: 12px; margin: 20px 0;">
                    <div style="font-size: 14px; color: var(--text-light); margin-bottom: 5px;">Баланс</div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary);">
                        ${formatNumber(Math.floor(this.state.vibes))} 💎
                    </div>
                </div>
                
                <div style="background: var(--bg); padding: 15px; border-radius: 12px; margin-bottom: 15px;">
                    <div style="font-size: 14px; color: var(--text-light); margin-bottom: 8px;">Ставка</div>
                    <input type="range" id="betSlider" min="10" max="1000" value="${this.betAmount}" 
                        oninput="slotsGame.changeBet(parseInt(this.value))"
                        style="width: 100%; margin-bottom: 8px;" ${this.isSpinning ? 'disabled' : ''}>
                    <div style="font-size: 20px; font-weight: 700; color: var(--primary);">
                        ${formatNumber(this.betAmount)} 💎
                    </div>
                </div>
                
                <button onclick="slotsGame.spin()" 
                    style="width: 100%; padding: 18px; background: linear-gradient(135deg, #4CAF50, #45a049); 
                    color: white; border: none; border-radius: 15px; cursor: pointer; font-weight: 700; 
                    font-size: 18px;" ${this.isSpinning ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    ${this.isSpinning ? '🎰 Крутятся...' : '🎰 КРУТИТЬ'}
                </button>
            </div>
            
            <div style="background: var(--card-bg); border-radius: 16px; padding: 16px;">
                <h4 style="color: var(--text); margin-bottom: 12px;">💰 Таблица выплат</h4>
                <div style="display: grid; gap: 8px;">
                    ${this.symbols.map(symbol => `
                        <div style="display: flex; justify-content: space-between; align-items: center; 
                            padding: 8px; background: var(--bg); border-radius: 8px;">
                            <div style="display: flex; gap: 5px; align-items: center;">
                                <span style="font-size: 24px;">${symbol.icon}</span>
                                <span style="font-size: 24px;">${symbol.icon}</span>
                                <span style="font-size: 24px;">${symbol.icon}</span>
                            </div>
                            <span style="color: var(--primary); font-weight: 700;">x${symbol.multiplier}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 12px; padding: 10px; background: var(--bg); border-radius: 8px; 
                    font-size: 13px; color: var(--text-light); text-align: center;">
                    Два совпадения = 30% от множителя
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.renderReels();
    }
}

let slotsGame = null;