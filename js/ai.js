// AI system for computer-controlled opponent
class AIController {
    constructor(aiPlayer, humanPlayer) {
        this.aiPlayer = aiPlayer;
        this.humanPlayer = humanPlayer;
        
        // AI behavior parameters
        this.aggressiveness = 0.7; // How likely to attack (0-1)
        this.reactionTime = 0.8; // How quickly AI reacts (0-1, higher = faster)
        this.movementSpeed = 0.6; // Movement decision frequency
        this.attackRange = 120; // Distance at which AI will try to attack
        this.retreatRange = 80; // Distance at which AI will back away
        
        // AI state tracking
        this.currentAction = 'idle'; // idle, approaching, attacking, retreating, jumping
        this.actionTimer = 0;
        this.decisionCooldown = 0;
        this.lastDecisionTime = 0;
        
        // Behavioral patterns
        this.preferredDistance = 100; // Ideal fighting distance
        this.jumpProbability = 0.3; // Chance to jump when close
        this.counterAttackChance = 0.8; // Chance to attack after being hit
        
        // Difficulty scaling
        this.difficulty = 1.0; // Can be adjusted (0.5 = easy, 1.0 = normal, 1.5 = hard)
    }
    
    // Main AI update method
    update() {
        this.decisionCooldown--;
        this.actionTimer--;
        
        // Make decisions at intervals (not every frame)
        if (this.decisionCooldown <= 0) {
            this.makeDecision();
            this.decisionCooldown = Math.floor(30 / this.reactionTime); // 30-60 frames between decisions
        }
        
        // Execute current action
        this.executeAction();
    }
    
    // AI decision making
    makeDecision() {
        const distance = this.getDistanceToHuman();
        const humanHealth = this.humanPlayer.health / this.humanPlayer.maxHealth;
        const aiHealth = this.aiPlayer.health / this.aiPlayer.maxHealth;
        
        // Calculate aggression modifier based on health difference
        let aggressionModifier = 1.0;
        if (aiHealth < humanHealth) {
            aggressionModifier = 1.2; // More aggressive when losing
        } else if (aiHealth > humanHealth * 1.5) {
            aggressionModifier = 0.8; // Less aggressive when winning
        }
        
        const effectiveAggression = this.aggressiveness * aggressionModifier * this.difficulty;
        
        // Decision tree based on distance and situation
        if (distance > this.attackRange * 1.5) {
            // Too far - approach
            this.currentAction = 'approaching';
            this.actionTimer = 60 + Math.random() * 30;
        } else if (distance < this.retreatRange && Math.random() < 0.4) {
            // Too close - retreat sometimes
            this.currentAction = 'retreating';
            this.actionTimer = 30 + Math.random() * 20;
        } else if (distance <= this.attackRange && Math.random() < effectiveAggression) {
            // In attack range - attack
            this.currentAction = 'attacking';
            this.actionTimer = 20 + Math.random() * 10;
        } else if (this.humanPlayer.isPunching && Math.random() < this.counterAttackChance) {
            // Counter attack when human punches
            this.currentAction = 'attacking';
            this.actionTimer = 15;
        } else if (distance < this.attackRange * 1.2 && Math.random() < this.jumpProbability) {
            // Jump occasionally when close
            this.currentAction = 'jumping';
            this.actionTimer = 10;
        } else {
            // Default to approaching or circling
            this.currentAction = Math.random() < 0.7 ? 'approaching' : 'circling';
            this.actionTimer = 40 + Math.random() * 20;
        }
    }
    
    // Execute the current AI action
    executeAction() {
        switch (this.currentAction) {
            case 'approaching':
                this.approachHuman();
                break;
            case 'retreating':
                this.retreatFromHuman();
                break;
            case 'attacking':
                this.attackHuman();
                break;
            case 'jumping':
                this.jumpAction();
                break;
            case 'circling':
                this.circleHuman();
                break;
            default:
                // Idle - do nothing
                break;
        }
    }
    
    // Move towards the human player
    approachHuman() {
        const direction = this.getDirectionToHuman();
        const moveSpeed = this.movementSpeed * this.difficulty;
        
        if (Math.abs(direction) > 0.1) {
            this.aiPlayer.velocityX += direction * this.aiPlayer.speed * 0.3 * moveSpeed;
        }
    }
    
    // Move away from the human player
    retreatFromHuman() {
        const direction = -this.getDirectionToHuman(); // Opposite direction
        const moveSpeed = this.movementSpeed * 0.8; // Slightly slower retreat
        
        this.aiPlayer.velocityX += direction * this.aiPlayer.speed * 0.3 * moveSpeed;
    }
    
    // Attack the human player
    attackHuman() {
        // Face the human before attacking
        this.faceHuman();
        
        // Punch if not already punching and in range
        if (!this.aiPlayer.isPunching && this.aiPlayer.punchCooldown <= 0) {
            const distance = this.getDistanceToHuman();
            if (distance <= this.attackRange) {
                this.aiPlayer.startPunch();
            }
        }
    }
    
    // Jump action
    jumpAction() {
        if (this.aiPlayer.isGrounded && !this.aiPlayer.isPunching) {
            this.aiPlayer.velocityY = -this.aiPlayer.jumpPower;
            this.aiPlayer.isGrounded = false;
        }
    }
    
    // Circle around the human player
    circleHuman() {
        const distance = this.getDistanceToHuman();
        const direction = this.getDirectionToHuman();
        
        // Move perpendicular to direct approach (circling behavior)
        if (distance > this.preferredDistance) {
            this.aiPlayer.velocityX += direction * this.aiPlayer.speed * 0.2;
        } else {
            // Circle by moving in a pattern
            const circleDirection = Math.sin(Date.now() * 0.01) > 0 ? 1 : -1;
            this.aiPlayer.velocityX += circleDirection * this.aiPlayer.speed * 0.2;
        }
    }
    
    // Face towards the human player
    faceHuman() {
        const direction = this.getDirectionToHuman();
        this.aiPlayer.facing = direction > 0 ? 1 : -1;
    }
    
    // Get distance to human player
    getDistanceToHuman() {
        return Math.abs(this.humanPlayer.x - this.aiPlayer.x);
    }
    
    // Get direction to human player (-1 = left, 1 = right)
    getDirectionToHuman() {
        const dx = this.humanPlayer.x - this.aiPlayer.x;
        return dx > 0 ? 1 : -1;
    }
    
    // React to being hit
    onTakeDamage() {
        // Increase aggression temporarily
        this.aggressiveness = Math.min(1.0, this.aggressiveness + 0.2);
        
        // Force a counter-attack decision
        if (Math.random() < this.counterAttackChance) {
            this.currentAction = 'attacking';
            this.actionTimer = 20;
            this.decisionCooldown = 5; // Quick reaction
        }
        
        // Reset aggression after some time
        setTimeout(() => {
            this.aggressiveness = Math.max(0.5, this.aggressiveness - 0.1);
        }, 3000);
    }
    
    // Adjust AI difficulty
    setDifficulty(level) {
        this.difficulty = level;
        
        // Adjust parameters based on difficulty
        if (level <= 0.5) {
            // Easy
            this.reactionTime = 0.5;
            this.aggressiveness = 0.4;
            this.movementSpeed = 0.4;
        } else if (level <= 1.0) {
            // Normal
            this.reactionTime = 0.8;
            this.aggressiveness = 0.7;
            this.movementSpeed = 0.6;
        } else {
            // Hard
            this.reactionTime = 1.0;
            this.aggressiveness = 0.9;
            this.movementSpeed = 0.8;
        }
    }
    
    // Get current AI state for debugging
    getDebugInfo() {
        return {
            action: this.currentAction,
            actionTimer: this.actionTimer,
            distance: Math.round(this.getDistanceToHuman()),
            aggression: this.aggressiveness.toFixed(2),
            difficulty: this.difficulty
        };
    }
}

// Global AI controller instance
let aiController;
