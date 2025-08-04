// Main game logic and loop
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.isRunning = false;
        this.showDebug = false;
        
        // Initialize systems
        this.initializeSystems();
        
        // Create players
        this.createPlayers();
        
        // Game state
        this.gameState = 'playing'; // playing, paused, gameOver
        
        // Performance tracking
        this.lastTime = 0;
        this.fps = 60;
        this.frameCount = 0;
        this.fpsUpdateInterval = 60; // Update FPS display every 60 frames
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start the game
        this.start();
    }
    
    initializeSystems() {
        // Initialize physics engine
        physicsEngine = new PhysicsEngine(this.canvas.width, this.canvas.height);
        
        // Initialize renderer
        renderer = new Renderer(this.canvas);
        
        console.log('Game systems initialized');
    }
    
    createPlayers() {
        // Human Player (left side, blue)
        this.player1 = new Player(100, physicsEngine.groundY, '#4169E1', 1, false);
        
        // AI Player (right side, red)
        this.player2 = new Player(640, physicsEngine.groundY, '#DC143C', 2, true);
        
        // Initialize AI controller
        aiController = new AIController(this.player2, this.player1);
        
        console.log('Players created - Human vs AI');
    }
    
    setupEventListeners() {
        // Debug toggle (F1 key)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'F1') {
                this.showDebug = !this.showDebug;
                e.preventDefault();
            }
            
            // Pause/Resume (Escape key)
            if (e.code === 'Escape') {
                this.togglePause();
                e.preventDefault();
            }
            
            // Reset game (R key)
            if (e.code === 'KeyR') {
                this.resetGame();
                e.preventDefault();
            }
        });
        
        // Handle window focus/blur
        window.addEventListener('blur', () => {
            this.pause();
        });
        
        window.addEventListener('focus', () => {
            if (this.gameState === 'paused') {
                this.resume();
            }
        });
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.gameState = 'playing';
            this.gameLoop();
            console.log('Game started');
        }
    }
    
    pause() {
        this.gameState = 'paused';
        console.log('Game paused');
    }
    
    resume() {
        this.gameState = 'playing';
        console.log('Game resumed');
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.pause();
        } else if (this.gameState === 'paused') {
            this.resume();
        }
    }
    
    resetGame() {
        // Reset players to starting positions
        this.player1.reset(100, physicsEngine.groundY);
        this.player2.reset(640, physicsEngine.groundY);
        
        // Clear any visual effects
        renderer.hitEffects = [];
        
        console.log('Game reset');
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // Update players
        this.player1.update(); // Human player
        this.player2.update(); // AI player (but controlled by AI)
        
        // Update AI
        if (aiController) {
            aiController.update();
        }
        
        // Update physics
        physicsEngine.updatePlayer(this.player1);
        physicsEngine.updatePlayer(this.player2);
        
        // Handle player collision (prevent overlap)
        physicsEngine.handlePlayerCollision(this.player1, this.player2);
        
        // Check for punch hits
        this.checkCombat();
        
        // Update FPS counter
        this.updateFPS();
    }
    
    checkCombat() {
        // Check if player 1 punch hits player 2
        if (physicsEngine.checkPunchHit(this.player1, this.player2)) {
            this.handlePunchHit(this.player1, this.player2);
        }
        
        // Check if player 2 punch hits player 1
        if (physicsEngine.checkPunchHit(this.player2, this.player1)) {
            this.handlePunchHit(this.player2, this.player1);
        }
    }
    
    handlePunchHit(attacker, defender) {
        // Prevent multiple hits from same punch using both player and hitbox flags
        if (attacker.punchHitbox && !attacker.punchHitbox.hasHit && !attacker.punchHasHit) {
            attacker.punchHitbox.hasHit = true;
            attacker.punchHasHit = true;
            
            // Apply damage - reduced to prevent one-shot kills
            const damage = 15; // Reduced from potentially high values
            defender.takeDamage(damage, attacker.facing);
            
            // Add visual effect
            renderer.addHitEffect(
                defender.x + defender.width/2,
                defender.y + defender.height/2
            );
            
            const attackerType = attacker.isAI ? 'AI' : 'Human';
            const defenderType = defender.isAI ? 'AI' : 'Human';
            console.log(`${attackerType} Player ${attacker.playerId} hit ${defenderType} Player ${defender.playerId} for ${damage} damage`);
            
            // Check for knockout
            if (defender.health <= 0) {
                this.handleKnockout(defender);
            }
        }
    }
    
    handleKnockout(knockedOutPlayer) {
        const winner = knockedOutPlayer === this.player1 ? this.player2 : this.player1;
        const winnerType = winner.isAI ? 'AI' : 'Human';
        const loserType = knockedOutPlayer.isAI ? 'AI' : 'Human';
        
        console.log(`${winnerType} Player ${winner.playerId} wins! ${loserType} Player ${knockedOutPlayer.playerId} is knocked out!`);
        
        // Show victory message
        this.showVictoryMessage(winner);
        
        // Reset the game after a delay
        setTimeout(() => {
            this.resetGame();
        }, 3000);
    }
    
    updateFPS() {
        this.frameCount++;
        if (this.frameCount >= this.fpsUpdateInterval) {
            this.frameCount = 0;
        }
    }
    
    render() {
        // Get player render states
        const player1State = this.player1.getRenderState();
        const player2State = this.player2.getRenderState();
        
        // Render the game
        renderer.render(player1State, player2State, this.showDebug, Math.round(this.fps));
        
        // Draw pause overlay if paused
        if (this.gameState === 'paused') {
            this.drawPauseOverlay();
        }
    }
    
    drawPauseOverlay() {
        const ctx = renderer.ctx;
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Pause text
        ctx.fillStyle = '#FFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', this.canvas.width/2, this.canvas.height/2);
        
        ctx.font = '18px Arial';
        ctx.fillText('Press ESC to resume', this.canvas.width/2, this.canvas.height/2 + 50);
    }
    
    showVictoryMessage(winner) {
        const ctx = renderer.ctx;
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Victory text
        ctx.fillStyle = winner.isAI ? '#FF6B6B' : '#4ECDC4';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        
        const winnerText = winner.isAI ? 'AI WINS!' : 'YOU WIN!';
        ctx.fillText(winnerText, this.canvas.width/2, this.canvas.height/2 - 20);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '18px Arial';
        ctx.fillText('Game will restart in 3 seconds...', this.canvas.width/2, this.canvas.height/2 + 30);
    }
    
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        // Calculate delta time
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Calculate FPS
        if (deltaTime > 0) {
            this.fps = 1000 / deltaTime;
        }
        
        // Update game state
        this.update(deltaTime);
        
        // Render
        this.render();
        
        // Continue the loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    // Get current game statistics
    getGameStats() {
        return {
            fps: Math.round(this.fps),
            gameState: this.gameState,
            player1Health: this.player1.health,
            player2Health: this.player2.health,
            player1Position: { x: Math.round(this.player1.x), y: Math.round(this.player1.y) },
            player2Position: { x: Math.round(this.player2.x), y: Math.round(this.player2.y) }
        };
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Fighting Game...');
    
    // Create game instance
    window.game = new Game();
    
    // Add some helpful console commands for debugging
    window.toggleDebug = () => {
        game.showDebug = !game.showDebug;
        console.log('Debug mode:', game.showDebug ? 'ON' : 'OFF');
    };
    
    window.resetGame = () => {
        game.resetGame();
        console.log('Game reset via console');
    };
    
    window.getStats = () => {
        console.log('Game Stats:', game.getGameStats());
        return game.getGameStats();
    };
    
    console.log('Fighting Game initialized successfully!');
    console.log('Controls:');
    console.log('Player 1: WASD to move, J to punch');
    console.log('Player 2: Arrow keys to move, Numpad 1 to punch');
    console.log('F1: Toggle debug info');
    console.log('ESC: Pause/Resume');
    console.log('R: Reset game');
    console.log('Console commands: toggleDebug(), resetGame(), getStats()');
});
