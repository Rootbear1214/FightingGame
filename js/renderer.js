// Rendering system for the fighting game
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Ground level (matches physics engine)
        this.groundY = this.height - 80;
        
        // Visual effects
        this.hitEffects = [];
    }
    
    // Clear the canvas
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    
    // Draw background
    drawBackground() {
        // Sky gradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#B0E0E6');
        
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.width, this.groundY);
        
        // Ground
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);
        
        // Ground line
        this.ctx.strokeStyle = '#32CD32';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.groundY);
        this.ctx.lineTo(this.width, this.groundY);
        this.ctx.stroke();
    }
    
    // Draw a player
    drawPlayer(playerState) {
        const { x, y, width, height, color, facing, isPunching, isGrounded } = playerState;
        
        // Player body (plain tall rectangle)
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        
        // Player outline
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 3; // Slightly thicker for visibility at larger size
        this.ctx.strokeRect(x, y, width, height);
        
        // No other visual indicators - completely plain rectangle
    }
    
    // Draw punch hitbox as visible arm extension
    drawPunchHitbox(hitbox) {
        if (!hitbox) return;
        
        // Draw the punch as a visible arm (long skinny rectangle)
        this.ctx.fillStyle = 'rgba(255, 200, 100, 0.8)'; // Skin-like color
        this.ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
        
        // Arm outline
        this.ctx.strokeStyle = '#D2691E';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
        
        // Fist at the end
        const fistSize = 8;
        const fistX = hitbox.x + (hitbox.width > 0 ? hitbox.width - fistSize/2 : -fistSize/2);
        const fistY = hitbox.y + hitbox.height/2 - fistSize/2;
        
        this.ctx.fillStyle = 'rgba(255, 180, 80, 0.9)';
        this.ctx.fillRect(fistX, fistY, fistSize, fistSize);
        
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(fistX, fistY, fistSize, fistSize);
    }
    
    // Draw health bar
    drawHealthBar(playerState, x, y, width = 150) {
        const { health, maxHealth } = playerState;
        const height = 20;
        const healthPercent = health / maxHealth;
        
        // Background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x, y, width, height);
        
        // Health bar
        const healthColor = healthPercent > 0.6 ? '#00FF00' : 
                           healthPercent > 0.3 ? '#FFFF00' : '#FF0000';
        this.ctx.fillStyle = healthColor;
        this.ctx.fillRect(x, y, width * healthPercent, height);
        
        // Border
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // Health text
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.ceil(health)}/${maxHealth}`, x + width/2, y + height/2 + 4);
    }
    
    // Draw UI elements
    drawUI(player1State, player2State) {
        // Player 1 health bar (top left)
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Player 1', 20, 25);
        this.drawHealthBar(player1State, 20, 30);
        
        // Player 2 health bar (top right)
        this.ctx.textAlign = 'right';
        this.ctx.fillText('Player 2', this.width - 20, 25);
        this.drawHealthBar(player2State, this.width - 170, 30);
        
        // Center line
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.width/2, 0);
        this.ctx.lineTo(this.width/2, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    // Add hit effect
    addHitEffect(x, y) {
        this.hitEffects.push({
            x: x,
            y: y,
            size: 0,
            maxSize: 30,
            life: 20,
            maxLife: 20
        });
    }
    
    // Draw and update hit effects
    drawHitEffects() {
        for (let i = this.hitEffects.length - 1; i >= 0; i--) {
            const effect = this.hitEffects[i];
            
            // Update effect
            effect.life--;
            effect.size = (1 - effect.life / effect.maxLife) * effect.maxSize;
            
            // Draw effect
            const alpha = effect.life / effect.maxLife;
            this.ctx.fillStyle = `rgba(255, 255, 0, ${alpha * 0.8})`;
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            // Remove expired effects
            if (effect.life <= 0) {
                this.hitEffects.splice(i, 1);
            }
        }
    }
    
    // Draw debug information
    drawDebugInfo(player1State, player2State, fps) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, this.height - 100, 200, 90);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';
        
        const debugText = [
            `FPS: ${fps}`,
            `P1: (${Math.round(player1State.x)}, ${Math.round(player1State.y)})`,
            `P1 Vel: (${player1State.velocityX?.toFixed(1) || 0}, ${player1State.velocityY?.toFixed(1) || 0})`,
            `P2: (${Math.round(player2State.x)}, ${Math.round(player2State.y)})`,
            `P2 Vel: (${player2State.velocityX?.toFixed(1) || 0}, ${player2State.velocityY?.toFixed(1) || 0})`,
            `Punching: P1=${player1State.isPunching} P2=${player2State.isPunching}`
        ];
        
        debugText.forEach((text, index) => {
            this.ctx.fillText(text, 15, this.height - 85 + (index * 14));
        });
    }
    
    // Main render method
    render(player1State, player2State, showDebug = false, fps = 60) {
        // Clear canvas
        this.clear();
        
        // Draw background
        this.drawBackground();
        
        // Draw players
        this.drawPlayer(player1State);
        this.drawPlayer(player2State);
        
        // Draw punch hitboxes
        this.drawPunchHitbox(player1State.punchHitbox);
        this.drawPunchHitbox(player2State.punchHitbox);
        
        // Draw UI
        this.drawUI(player1State, player2State);
        
        // Draw hit effects
        this.drawHitEffects();
        
        // Draw debug info if enabled
        if (showDebug) {
            this.drawDebugInfo(player1State, player2State, fps);
        }
    }
}

// Global renderer instance (will be initialized in game.js)
let renderer;
