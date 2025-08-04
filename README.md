# Fighting Game - Technical Specifications

A browser-based, Street Fighter-inspired 2D fighting game built with HTML5 Canvas and JavaScript.

## Game Overview

### Core Concept
- **Genre**: 2D Fighting Game
- **Platform**: Web Browser (HTML5)
- **Players**: 2 (local multiplayer)
- **Art Style**: Placeholder rectangles (sprites to be added later)

### Game Mechanics
- Side-scrolling 2D combat
- Physics-based movement with gravity
- Hit detection and collision system
- Health/damage system

## Player Specifications

### Visual Representation
- **Player 1**: Rectangle (color TBD)
- **Player 2**: Rectangle (different color)
- **Dimensions**: Standard fighting game proportions
- **Future**: Will be replaced with sprite animations

### Movement System
- **Ground Movement**: Left/Right directional movement
- **Jumping**: Vertical movement with gravity
- **Physics**: Realistic gravity and ground collision

## Control Scheme

### Player 1 Controls
- **W**: Jump
- **A**: Move Left
- **S**: Crouch (future implementation)
- **D**: Move Right
- **J**: Punch
- **K**: Kick (not implemented yet)

### Player 2 Controls
- **Arrow Keys**: Movement (Up/Left/Down/Right)
- **Numpad 1**: Punch
- **Numpad 2**: Kick (not implemented yet)

## Combat System

### Punch Mechanics
- **Hitbox**: Long rectangle extending from player
- **Position**: 2/3rds up the player's body height
- **Direction**: Straight horizontal extension
- **Range**: Moderate reach (exact pixels TBD)
- **Damage**: Standard punch damage
- **Animation**: Simple rectangle appearance/disappearance

### Future Combat Features
- **Kicks**: Lower body attacks with different range/damage
- **Blocking**: Defensive mechanics
- **Special Moves**: Combo system
- **Knockback**: Physics-based hit reactions

## Technical Architecture

### File Structure
```
/
├── index.html          # Main game entry point
├── js/
│   ├── game.js         # Core game loop and state management
│   ├── player.js       # Player class and mechanics
│   ├── input.js        # Input handling and key mapping
│   ├── physics.js      # Physics engine (gravity, collision)
│   └── renderer.js     # Canvas rendering system
├── css/
│   └── style.css       # Game styling
└── README.md           # This file
```

### Core Systems

#### Game Loop
- **Update**: Game state, physics, input processing
- **Render**: Canvas drawing and animation
- **FPS**: Target 60fps with requestAnimationFrame

#### Physics Engine
- **Gravity**: Downward acceleration
- **Ground Collision**: Floor boundary detection
- **Player Collision**: Hit detection between players
- **Boundaries**: Screen edge collision

#### Input System
- **Key State Tracking**: Real-time input detection
- **Action Mapping**: Key-to-action translation
- **Multi-input Support**: Simultaneous key handling

#### Rendering System
- **Canvas API**: HTML5 2D context
- **Coordinate System**: Standard screen coordinates
- **Drawing Primitives**: Rectangles for players and hitboxes
- **Visual Feedback**: Hit effects and state indicators

## Game States

### Match Flow
1. **Menu**: Game start screen (future)
2. **Fighting**: Active combat state
3. **Pause**: Game pause functionality (future)
4. **Victory**: Round/match end (future)

### Player States
- **Idle**: Standing still
- **Walking**: Ground movement
- **Jumping**: Airborne state
- **Attacking**: Punch animation
- **Hit**: Taking damage (future)
- **Knocked Down**: Defeat state (future)

## Development Phases

### Phase 1: Core Foundation ✓ (Current)
- [x] Project setup
- [ ] Basic HTML structure
- [ ] Canvas initialization
- [ ] Player rectangle rendering
- [ ] Basic movement (WASD)
- [ ] Punch implementation

### Phase 2: Enhanced Mechanics
- [ ] Kick attacks
- [ ] Health system
- [ ] Hit detection refinement
- [ ] Physics improvements
- [ ] Sound effects

### Phase 3: Visual Polish
- [ ] Sprite integration
- [ ] Animation system
- [ ] Particle effects
- [ ] UI/HUD elements
- [ ] Background graphics

### Phase 4: Game Features
- [ ] Menu system
- [ ] Multiple rounds
- [ ] Character selection
- [ ] Special moves
- [ ] AI opponent (optional)

## Performance Requirements

### Minimum Specifications
- **Browser**: Modern browser with HTML5 Canvas support
- **JavaScript**: ES6+ compatibility
- **Performance**: 60fps on mid-range devices
- **Memory**: Lightweight implementation

### Optimization Goals
- Efficient collision detection
- Minimal DOM manipulation
- Optimized rendering pipeline
- Responsive input handling

## Testing Strategy

### Manual Testing
- [ ] Movement responsiveness
- [ ] Attack accuracy
- [ ] Collision detection
- [ ] Cross-browser compatibility
- [ ] Performance benchmarking

### Automated Testing (Future)
- Unit tests for game logic
- Integration tests for systems
- Performance regression tests

## Known Limitations

### Current Phase
- Placeholder rectangle graphics
- Limited to punch attacks
- No health/damage system
- Single-round gameplay

### Technical Constraints
- Browser-based (no native performance)
- Local multiplayer only
- Canvas rendering limitations

## Future Enhancements

### Gameplay
- Special move combinations
- Character-specific abilities
- Tournament mode
- Online multiplayer

### Technical
- WebGL rendering upgrade
- Audio system integration
- Mobile touch controls
- Save/load game states

---

## Quick Start Guide

1. Open `index.html` in a modern web browser
2. Player 1 uses WASD + J for movement and punch
3. Player 2 uses Arrow Keys + Numpad 1 for movement and punch
4. Fight until one player is defeated (future implementation)

## Contributing

This is a learning project focused on game development fundamentals. Future contributions should maintain the simple, educational nature of the codebase.

---

*Last Updated: August 2025*