# UNO Game Design

## Overview

Single-player UNO card game running in a web browser. Player vs 1-3 AI opponents with realistic card visuals and standard + challenge rules.

## Tech Stack

- **Svelte + TypeScript** (no SvelteKit)
- **Vite** for dev server and build
- **CSS** for card visuals and animations (no Canvas)
- Pure client-side, no backend

## Project Structure

```
uno/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.ts
│   ├── App.svelte
│   ├── lib/
│   │   ├── types.ts        # Card, Player, GameState types
│   │   ├── deck.ts         # Deck creation, shuffle, deal
│   │   ├── rules.ts        # Play validation, special card effects
│   │   ├── ai.ts           # AI decision logic
│   │   └── store.ts        # Svelte Store, core game state
│   ├── components/
│   │   ├── Card.svelte
│   │   ├── PlayerHand.svelte
│   │   ├── AIHand.svelte
│   │   ├── DiscardPile.svelte
│   │   ├── DrawPile.svelte
│   │   ├── ColorPicker.svelte
│   │   ├── GameBoard.svelte
│   │   ├── GameInfo.svelte
│   │   └── UnoButton.svelte
│   └── pages/
│       ├── Menu.svelte
│       ├── Game.svelte
│       └── Result.svelte
└── public/
```

## Data Models

```typescript
type Color = 'red' | 'yellow' | 'green' | 'blue';
type CardType = 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild_draw4';

interface Card {
  id: string;
  color: Color | null;   // null for wild cards before being played
  type: CardType;
  value?: number;         // 0-9, only for number type
}

interface Player {
  id: number;
  name: string;
  hand: Card[];
  isAI: boolean;
  saidUno: boolean;
}

interface GameState {
  players: Player[];
  drawPile: Card[];
  discardPile: Card[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  currentColor: Color;
  phase: 'menu' | 'playing' | 'choosing_color' | 'challenging' | 'result';
  winner: number | null;
}
```

### Standard Deck (108 cards)

- Number cards: each color 0x1 + 1-9x2 = 76
- Action cards: each color Skip/Reverse/+2 x2 = 24
- Wild cards: Wild x4 + Wild Draw4 x4 = 8

## Rules Engine

### Play Validation

A card can be played if ANY of:
- Color matches current active color
- Number/type matches top discard card
- Card is Wild or Wild Draw4

### Special Card Effects

| Card | Effect |
|------|--------|
| Skip | Next player loses turn |
| Reverse | Reverse play direction (acts as Skip in 2-player) |
| Draw 2 | Next player draws 2 and loses turn |
| Wild | Player chooses new active color |
| Wild Draw 4 | Player chooses color, next player draws 4 and loses turn |

### Wild Draw 4 Challenge Mechanism

- Technically, Wild Draw4 should only be played when the player has no cards matching the current color
- Players can bluff (play it even with matching cards)
- The victim can challenge:
  - Challenge succeeds (player had matching cards) -> player draws 4 instead
  - Challenge fails (player had no matching cards) -> challenger draws 6 (4 + 2 penalty)

### UNO Call

- When playing down to 2 cards, player must click UNO button after playing
- Failure to call UNO (if caught before next player acts) -> draw 2 penalty
- AI: 90% chance to remember calling UNO, 70% chance to catch player forgetting

### Turn Flow

Current player -> play or draw -> apply special effects -> check win -> next player

## AI Logic

### Play Priority (high to low)

1. Matching color action cards (Skip, Reverse, +2)
2. Matching color number cards (prefer higher numbers)
3. Type/number matching cards (switches color to most held)
4. Wild cards (choose most held color)
5. Wild Draw4 (last resort)
6. No playable card -> draw

### Color Choice

Count cards per color in hand, pick the most common.

### Challenge Decision

- If observed the player recently played the current color: ~60% challenge rate
- Otherwise: ~25% challenge rate

### Action Pacing

1-2 second delay before AI plays to simulate thinking.

## UI Layout

```
┌──────────────────────────────────────────┐
│            AI 3 (top, horizontal)         │
│         ████ ████ ████ ████              │
│                                          │
│  AI 2       ┌──────────┐        AI 1    │
│  (left)     │  Discard  │      (right)   │
│  ██         │   [7red]  │         ██    │
│  ██         │          │         ██    │
│  ██         │   Draw    │         ██    │
│  ██         │   Pile    │         ██    │
│             └──────────┘                │
│         Direction / UNO button           │
│                                          │
│    [2R] [5R] [Skip-B] [7G] [Wild]        │
│         Player hand (bottom, fanned)      │
└──────────────────────────────────────────┘
```

### Card Visuals

- Rounded rectangles with shadows and subtle gradients
- Colors: Red #ED1C24, Yellow #FFDE00, Green #00A651, Blue #0072BC
- Card face: large center number/icon + small top-left and bottom-right
- AI cards: dark gray card back with UNO pattern

### Interactions & Animations

- Hover: card floats up + highlight; playable cards have glow border
- Play: card flies to discard pile (CSS transition)
- Draw: card flies from draw pile to hand
- Reverse: rotating arrow animation
- Color picker: four colored circle buttons popup

### Responsive

Desktop-first (landscape). Mobile support deferred.

## Page Flow

```
Menu -> Game -> Result
                  |
              Play Again -> Game
              Back to Menu -> Menu
```

### Menu Page

- "UNO" title
- AI opponent count selector (1/2/3)
- "Start Game" button

### Game State Management

- Single `writable<GameState>` as core store
- All operations (play, draw, skip, choose color, challenge) via pure functions updating GameState
- Derived stores: `currentPlayer`, `playableCards`, `topCard`

### Turn State Machine

```
idle -> playerTurn -> (play/draw) -> checkEffect
  ^                                      |
  └──── nextTurn <- checkWin <- applyEffect

playerTurn + AI -> auto-act after delay
Wild/WildDraw4 -> choosingColor sub-state
Victim of +4 -> challenging sub-state
```

### Result Page

- Winner display
- Remaining hand score summary per player
- "Play Again" and "Back to Menu" buttons
