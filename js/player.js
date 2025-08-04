// Player class for the fighting game
class Player {
    constructor(x, y, color, playerId, isAI = false) {
        // Position and dimensions
        this.x = x;
        this.y = y;
        this.width = 60; // Wider for visibility
        this.height = 360; // 3x taller (was 120)
        
        // Visual properties
        this.color = color;
        this.playerId = playerId;
        this.isAI = isAI;
        
        // Physics properties
        this.velocityX = 0;
        this.velocityY = 0;
        this.isGrounded = false;
        
        // Movement properties
        this.speed = 5;
        this.jumpPower = 15;
        
        // Combat properties
        this.isPunching = false;
        this.punchDuration = 0;
        this.maxPunchDuration = 15; // frames
        this.punchHitbox = null;
        this.punchCooldown = 0;
        this.maxPunchCooldown = 30; // Increased cooldown to prevent spam
        this.punchHasHit = false; // Track if current punch has already hit
        
        // Health
        this.health = 100;
        this.maxHealth = 100;
        
        // Animation state
        this.facing = playerId === 1 ? 1 : -1; // 1 = right, -1 = left
    }
    
    // Update player state
    update() {
        if (!this.isAI) {
            this.handleInput();
        }
        // AI players are controlled by AIController, not input
        this.updatePunch();
        this.updateFacing();
    }
    
    // Handle player input based on player ID
    handleInput() {
        let direction = 0;
        let jumping = false;
        let punching = false;
        
        if (this.playerId === 1) {
            direction = inputManager.getPlayer1Direction();
            jumping = inputManager.isPlayer1Jumping();
            punching = inputManager.isPlayer1Punching();
        } else {
            direction = inputManager.getPlayer2Direction();
            jumping = inputManager.isPlayer2Jumping();
            punching = inputManager.isPlayer2Punching();
        }
        
        // Handle horizontal movement
        if (direction !== 0) {
            this.velocityX += direction * this.speed * 0.3;
            // Cap maximum speed
            const maxSpeed = this.speed;
            this.velocityX = Math.max(-maxSpeed, Math.min(maxSpeed, this.velocityX));
        }
        
        // Handle jumping
        if (jumping && this.isGrounded && !this.isPunching) {
            this.velocityY = -this.jumpPower;
            this.isGrounded = false;
        }
        
        // Handle punching
        if (punching && !this.isPunching && this.punchCooldown <= 0) {
            this.startPunch();
        }
    }
    
    // Update facing direction based on movement
    updateFacing() {
        if (this.velocityX > 0.5) {
            this.facing = 1; // Right
        } else if (this.velocityX < -0.5) {
            this.facing = -1; // Left
        }
    }
    
    // Start punch attack
    startPunch() {
        if (this.punchCooldown > 0) return; // Prevent punch spam
        
        this.isPunching = true;
        this.punchDuration = this.maxPunchDuration;
        this.punchHasHit = false; // Reset hit flag for new punch
        this.createPunchHitbox();
    }
    
    // Create punch hitbox
    createPunchHitbox() {
        const punchWidth = 120; // Longer reach for larger players
        const punchHeight = 15;  // Proportionally skinny height
        const punchOffsetY = this.height * (2/3); // 2/3rds up the body
        
        this.punchHitbox = {
            x: this.facing === 1 ? this.x + this.width : this.x - punchWidth,
            y: this.y + punchOffsetY - punchHeight/2,
            width: punchWidth,
            height: punchHeight,
            hasHit: false // Track if this hitbox has already caused damage
        };
    }
    
    // Update punch state
    updatePunch() {
        if (this.isPunching) {
            this.punchDuration--;
            
            if (this.punchDuration <= 0) {
                this.endPunch();
            } else {
                // Update hitbox position
                this.createPunchHitbox();
            }
        }
        
        // Update punch cooldown
        if (this.punchCooldown > 0) {
            this.punchCooldown--;
        }
    }
    
    // End punch attack
    endPunch() {
        this.isPunching = false;
        this.punchHitbox = null;
        this.punchCooldown = this.maxPunchCooldown;
    }
    
    // Take damage
    takeDamage(amount, attackerFacing = 1) {
        this.health = Math.max(0, this.health - amount);
        
        // Add knockback effect based on attacker's facing direction
        const knockbackForce = 4;
        this.velocityX += attackerFacing * knockbackForce;
        
        // Notify AI if this is an AI player
        if (this.isAI && aiController) {
            aiController.onTakeDamage();
        }
        
        console.log(`Player ${this.playerId} took ${amount} damage. Health: ${this.health}/${this.maxHealth}`);
    }
    
    // Get current state for rendering
    getRenderState() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            color: this.color,
            facing: this.facing,
            isPunching: this.isPunching,
            punchHitbox: this.punchHitbox,
            health: this.health,
            maxHealth: this.maxHealth,
            isGrounded: this.isGrounded
        };
    }
    
    // Reset player to starting position
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = this.maxHealth;
        this.isPunching = false;
        this.punchHitbox = null;
        this.punchCooldown = 0;
    }
}
