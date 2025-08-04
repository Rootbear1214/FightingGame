// Physics engine for the fighting game
class PhysicsEngine {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.gravity = 0.8;
        this.groundY = canvasHeight - 80; // Higher ground level for taller players
        this.friction = 0.85;
    }
    
    // Apply gravity to a player
    applyGravity(player) {
        if (player.y < this.groundY) {
            player.velocityY += this.gravity;
        } else {
            // Player is on ground
            player.y = this.groundY;
            player.velocityY = 0;
            player.isGrounded = true;
        }
    }
    
    // Apply friction to horizontal movement
    applyFriction(player) {
        player.velocityX *= this.friction;
        
        // Stop very small movements to prevent jitter
        if (Math.abs(player.velocityX) < 0.1) {
            player.velocityX = 0;
        }
    }
    
    // Keep player within screen boundaries
    applyBoundaries(player) {
        // Left boundary
        if (player.x < 0) {
            player.x = 0;
            player.velocityX = 0;
        }
        
        // Right boundary
        if (player.x + player.width > this.canvasWidth) {
            player.x = this.canvasWidth - player.width;
            player.velocityX = 0;
        }
        
        // Top boundary (shouldn't go above screen)
        if (player.y < 0) {
            player.y = 0;
            player.velocityY = 0;
        }
    }
    
    // Check collision between two rectangles
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // Check if punch hitbox collides with opponent
    checkPunchHit(attacker, defender) {
        if (!attacker.isPunching || !attacker.punchHitbox) {
            return false;
        }
        
        return this.checkCollision(attacker.punchHitbox, {
            x: defender.x,
            y: defender.y,
            width: defender.width,
            height: defender.height
        });
    }
    
    // Update physics for a player
    updatePlayer(player) {
        // Apply gravity
        this.applyGravity(player);
        
        // Apply friction to horizontal movement
        this.applyFriction(player);
        
        // Update position based on velocity
        player.x += player.velocityX;
        player.y += player.velocityY;
        
        // Apply boundaries
        this.applyBoundaries(player);
        
        // Update grounded state
        player.isGrounded = (player.y >= this.groundY);
    }
    
    // Handle player collision (prevent overlap)
    handlePlayerCollision(player1, player2) {
        if (this.checkCollision(player1, player2)) {
            // Calculate overlap
            const overlapX = Math.min(
                player1.x + player1.width - player2.x,
                player2.x + player2.width - player1.x
            );
            
            // Separate players
            if (player1.x < player2.x) {
                player1.x -= overlapX / 2;
                player2.x += overlapX / 2;
            } else {
                player1.x += overlapX / 2;
                player2.x -= overlapX / 2;
            }
            
            // Stop horizontal movement
            player1.velocityX = 0;
            player2.velocityX = 0;
        }
    }
}

// Global physics engine instance (will be initialized in game.js)
let physicsEngine;
