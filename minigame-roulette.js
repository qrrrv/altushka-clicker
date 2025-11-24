// Мини-игра: Рулетка
class RouletteGame {
    constructor(state) {
        this.state = state;
        this.isSpinning = false;
        this.currentBet = 0;
        this.currentColor = null;
        
        this.colors = [
            { name: 'Красное', value: 'red', multiplier: 2, color: '#FF5252' },
            { name: 'Черное', value: 'black', multiplier: 2, color: '#2d2d2d' },
            { name: 'Зеленое', value: 'green', multiplier: 14, color: '#4CAF50' }
        ];
        
        this.numbers = [];
        for (let i = 0; i <= 36; i++) {
            let color = 'red';
            if (i === 0) color = 'green';
            else if (i % 2 === 0) color = 'black';
            
            this.numbers.push({ number: i, color });
        }
    }
    
    placeBet(colorValue, amount) {
        if (this.isSpinning) {
            showNotification('❌ Рулетка крутится!');
            return;
        }
        
        if (amount < 10) {
            showNotification('❌ Минимальная ставка: 10 💎');
            return;
        }
        
        if (this.state.vibes < amount) {
            showNotification('❌ Недостаточно средств!');
            playSound('error');
            return;
        }
        
        this.currentBet = amount;
        this.currentColor = colorValue;
        this.state.vibes -= amount;
        
        playSound('click');
        this.spin();
    }
    
    spin() {
        this.isSpinning = true;
        this.render();
        
        // Анимация вращения
        const rouletteWheel = document.getElementById('rouletteWheel');
        if (rouletteWheel) {
            rouletteWheel.style.animation = 'spin 3s ease-out';
        }
        
        setTimeout(() => {
            this.resolveResult();
        }, 3000);
    }
    
    resolveResult() {
        const result = this.numbers[Math.floor(Math.random() * this.numbers.length)];
        
        const rouletteWheel = document.getElementById('rouletteWheel');
        if (rouletteWheel) {
            rouletteWheel.style.animation = '';
        }
        
        const colorData = this.colors.find(c => c.value === result.color);
        const won = result.color === this.currentColor;
        
        if (won) {
            const winAmount = this.currentBet * colorData.multiplier;
            this.state.vibes += winAmount;
            this.state.totalVibes += winAmount - this.currentBet;
            
            playSound('buy');
            showNotification(`🎉 Выпало ${result.number} (${colorData.name})! Выиграно: ${formatNumber(winAmount)} 💎`);
        } else {
            playSound('error');
            showNotification(`😢 Выпало ${result.number} (${colorData.name}). Проигрыш: ${formatNumber(this.currentBet)} 💎`);
        }
        
        this.isSpinning = false;
        this.currentBet = 0;
        this.currentColor = null;
        
        this.render();
    }
    
    render() {
        const container = document.getElementById('rouletteGame');
        if (!container) return;
        
        let html = `
            <div style="background: var(--card-bg); border-radius: 20px; padding: 20px; margin-bottom: 20px; text-align: center;">
                <h3 style="color: var(--text); margin-bottom: 15px;">🎰 Рулетка</h3>
                
                <div id="rouletteWheel" style="width: 200px; height: 200px; margin: 20px auto; border-radius: 50%; background: conic-gradient(
                    #FF5252 0deg 120deg,
                    #2d2d2d 120deg 240deg,
                    #4CAF50 240deg 360deg
                ); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.3); position: relative;">
                    <div style="width: 40px; height: 40px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                        🎯
                    </div>
                </div>
                
                ${this.isSpinning ? `
                    <div style="color: var(--primary); font-weight: 700; font-size: 18px; margin: 20px 0;">
                        🎲 Крутится...
                    </div>
                ` : ''}
                
                <div style="background: var(--bg); padding: 15px; border-radius: 12px; margin: 20px 0;">
                    <div style="font-size: 14px; color: var(--text-light); margin-bottom: 5px;">Ваш баланс</div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary);">
                        ${formatNumber(Math.floor(this.state.vibes))} 💎
                    </div>
                </div>
            </div>
            
            <div style="background: var(--card-bg); border-radius: 16px; padding: 16px; margin-bottom: 12px;">
                <h4 style="color: var(--text); margin-bottom: 12px;">Сделать ставку</h4>
                
                <input type="number" id="betAmount" placeholder="Сумма ставки (мин. 10)" 
                    style="width: 100%; padding: 12px; border: 2px solid var(--primary); border-radius: 10px; 
                    background: var(--bg); color: var(--text); font-size: 16px; margin-bottom: 12px;" 
                    ${this.isSpinning ? 'disabled' : ''}>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    ${this.colors.slice(0, 2).map(color => `
                        <button onclick="rouletteGame.placeBetFromInput('${color.value}')" 
                            style="padding: 15px; background: ${color.color}; color: white; border: none; 
                            border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 16px;"
                            ${this.isSpinning ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                            ${color.name}<br>x${color.multiplier}
                        </button>
                    `).join('')}
                </div>
                
                <button onclick="rouletteGame.placeBetFromInput('green')" 
                    style="width: 100%; padding: 15px; background: ${this.colors[2].color}; color: white; 
                    border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 16px; margin-top: 8px;"
                    ${this.isSpinning ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    ${this.colors[2].name} x${this.colors[2].multiplier}
                </button>
            </div>
            
            <div style="background: var(--card-bg); border-radius: 16px; padding: 16px;">
                <h4 style="color: var(--text); margin-bottom: 10px;">ℹ️ Правила</h4>
                <ul style="color: var(--text-light); font-size: 13px; padding-left: 20px;">
                    <li>Красное/Черное: выигрыш x2</li>
                    <li>Зеленое (0): выигрыш x14</li>
                    <li>Минимальная ставка: 10 💎</li>
                </ul>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    placeBetFromInput(color) {
        const input = document.getElementById('betAmount');
        const amount = parseInt(input.value);
        
        if (isNaN(amount) || amount <= 0) {
            showNotification('❌ Введите корректную ставку!');
            return;
        }
        
        this.placeBet(color, amount);
    }
}

let rouletteGame = null;