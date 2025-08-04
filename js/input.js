// Input handling system for the fighting game
class InputManager {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
        
        // Key mappings for players
        this.player1Keys = {
            up: 'KeyW',
            left: 'KeyA',
            down: 'KeyS',
            right: 'KeyD',
            punch: 'KeyJ',
            kick: 'KeyK'
        };
        
        this.player2Keys = {
            up: 'ArrowUp',
            left: 'ArrowLeft',
            down: 'ArrowDown',
            right: 'ArrowRight',
            punch: 'Numpad1',
            kick: 'Numpad2'
        };
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            e.preventDefault(); // Prevent default browser behavior
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            e.preventDefault();
        });
        
        // Prevent context menu on right click
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }
    
    // Player 1 input methods
    isPlayer1Moving() {
        return this.isKeyPressed(this.player1Keys.left) || 
               this.isKeyPressed(this.player1Keys.right);
    }
    
    isPlayer1Jumping() {
        return this.isKeyPressed(this.player1Keys.up);
    }
    
    isPlayer1Punching() {
        return this.isKeyPressed(this.player1Keys.punch);
    }
    
    getPlayer1Direction() {
        let direction = 0;
        if (this.isKeyPressed(this.player1Keys.left)) direction -= 1;
        if (this.isKeyPressed(this.player1Keys.right)) direction += 1;
        return direction;
    }
    
    // Player 2 input methods
    isPlayer2Moving() {
        return this.isKeyPressed(this.player2Keys.left) || 
               this.isKeyPressed(this.player2Keys.right);
    }
    
    isPlayer2Jumping() {
        return this.isKeyPressed(this.player2Keys.up);
    }
    
    isPlayer2Punching() {
        return this.isKeyPressed(this.player2Keys.punch);
    }
    
    getPlayer2Direction() {
        let direction = 0;
        if (this.isKeyPressed(this.player2Keys.left)) direction -= 1;
        if (this.isKeyPressed(this.player2Keys.right)) direction += 1;
        return direction;
    }
}

// Global input manager instance
const inputManager = new InputManager();
