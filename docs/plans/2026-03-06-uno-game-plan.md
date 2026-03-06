# UNO Game Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-player UNO card game in the browser with 1-3 AI opponents, standard + challenge rules, and realistic card visuals.

**Architecture:** Pure client-side SPA using Svelte 5 (runes) + TypeScript + Vite. Game logic lives in pure TS modules (`lib/`), UI in Svelte components. Shared reactive state via `$state` in `.svelte.ts` files. Vitest for unit testing logic modules.

**Tech Stack:** Svelte 5, TypeScript, Vite, Vitest, CSS (no UI framework)

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.ts`, `src/App.svelte`, `src/vite-env.d.ts`

**Step 1: Scaffold Svelte + Vite + TypeScript project**

Run:
```bash
cd d:/github/UNO
npm create vite@latest . -- --template svelte-ts
```

Select overwrite if prompted (directory has only docs/).

**Step 2: Install dependencies**

Run:
```bash
npm install
```

**Step 3: Install Vitest**

Run:
```bash
npm install -D vitest
```

**Step 4: Configure Vitest**

Add test config to `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  test: {
    globals: true,
    environment: 'node',
  },
})
```

Add to `tsconfig.json` compilerOptions:
```json
"types": ["vitest/globals"]
```

Add test script to `package.json`:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

**Step 5: Verify setup**

Run:
```bash
npm run dev
```
Expected: Dev server starts, default Svelte page loads at localhost.

Run:
```bash
npm run test
```
Expected: Vitest runs, no tests found (0 passed).

**Step 6: Clean up template files**

Delete default template files we won't need:
- `src/lib/Counter.svelte`
- `src/assets/svelte.svg`
- `public/vite.svg`

Replace `src/App.svelte` with:
```svelte
<script lang="ts">
</script>

<main>
  <h1>UNO</h1>
</main>
```

Replace `src/app.css` with empty file (we'll add styles later).

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Svelte + TypeScript + Vite + Vitest project"
```

---

### Task 2: Type Definitions

**Files:**
- Create: `src/lib/types.ts`

**Step 1: Write type definitions**

```ts
// src/lib/types.ts

export type Color = 'red' | 'yellow' | 'green' | 'blue';

export type CardType = 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild_draw4';

export interface Card {
  id: string;
  color: Color | null;
  type: CardType;
  value?: number;
}

export interface Player {
  id: number;
  name: string;
  hand: Card[];
  isAI: boolean;
  saidUno: boolean;
}

export type Phase = 'menu' | 'playing' | 'choosing_color' | 'challenging' | 'result';

export interface GameState {
  players: Player[];
  drawPile: Card[];
  discardPile: Card[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  currentColor: Color;
  phase: Phase;
  winner: number | null;
  lastPlayedBy: number | null;
}

export const COLORS: Color[] = ['red', 'yellow', 'green', 'blue'];

export const COLOR_HEX: Record<Color, string> = {
  red: '#ED1C24',
  yellow: '#FFDE00',
  green: '#00A651',
  blue: '#0072BC',
};
```

**Step 2: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add card, player, and game state type definitions"
```

---

### Task 3: Deck Module (TDD)

**Files:**
- Create: `src/lib/deck.ts`
- Test: `src/lib/__tests__/deck.test.ts`

**Step 1: Write failing tests**

```ts
// src/lib/__tests__/deck.test.ts
import { describe, it, expect } from 'vitest';
import { createDeck, shuffle, dealCards } from '../deck';
import type { Card } from '../types';

describe('createDeck', () => {
  it('creates a deck of 108 cards', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(108);
  });

  it('has 76 number cards', () => {
    const deck = createDeck();
    const numberCards = deck.filter(c => c.type === 'number');
    expect(numberCards).toHaveLength(76);
  });

  it('has one 0 per color', () => {
    const deck = createDeck();
    const zeros = deck.filter(c => c.type === 'number' && c.value === 0);
    expect(zeros).toHaveLength(4);
  });

  it('has two of each 1-9 per color', () => {
    const deck = createDeck();
    for (const color of ['red', 'yellow', 'green', 'blue'] as const) {
      for (let v = 1; v <= 9; v++) {
        const cards = deck.filter(c => c.color === color && c.type === 'number' && c.value === v);
        expect(cards).toHaveLength(2);
      }
    }
  });

  it('has 24 action cards (8 skip, 8 reverse, 8 draw2)', () => {
    const deck = createDeck();
    expect(deck.filter(c => c.type === 'skip')).toHaveLength(8);
    expect(deck.filter(c => c.type === 'reverse')).toHaveLength(8);
    expect(deck.filter(c => c.type === 'draw2')).toHaveLength(8);
  });

  it('has 4 wild and 4 wild_draw4 cards', () => {
    const deck = createDeck();
    expect(deck.filter(c => c.type === 'wild')).toHaveLength(4);
    expect(deck.filter(c => c.type === 'wild_draw4')).toHaveLength(4);
  });

  it('gives every card a unique id', () => {
    const deck = createDeck();
    const ids = new Set(deck.map(c => c.id));
    expect(ids.size).toBe(108);
  });
});

describe('shuffle', () => {
  it('returns a deck with the same cards in different order', () => {
    const deck = createDeck();
    const original = [...deck];
    const shuffled = shuffle(deck);
    expect(shuffled).toHaveLength(108);
    // Very unlikely to be in same order
    const sameOrder = shuffled.every((c, i) => c.id === original[i].id);
    expect(sameOrder).toBe(false);
  });
});

describe('dealCards', () => {
  it('deals 7 cards to each player and returns remaining deck', () => {
    const deck = shuffle(createDeck());
    const { hands, remaining } = dealCards(deck, 4);
    expect(hands).toHaveLength(4);
    hands.forEach(hand => expect(hand).toHaveLength(7));
    expect(remaining).toHaveLength(108 - 28);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/deck.test.ts`
Expected: FAIL - module not found

**Step 3: Implement deck module**

```ts
// src/lib/deck.ts
import type { Card, Color, CardType } from './types';
import { COLORS } from './types';

let nextId = 0;

function createCard(color: Color | null, type: CardType, value?: number): Card {
  return { id: `card-${nextId++}`, color, type, value };
}

export function createDeck(): Card[] {
  nextId = 0;
  const cards: Card[] = [];

  for (const color of COLORS) {
    // One 0 per color
    cards.push(createCard(color, 'number', 0));
    // Two each of 1-9
    for (let v = 1; v <= 9; v++) {
      cards.push(createCard(color, 'number', v));
      cards.push(createCard(color, 'number', v));
    }
    // Two each of action cards
    for (const type of ['skip', 'reverse', 'draw2'] as CardType[]) {
      cards.push(createCard(color, type));
      cards.push(createCard(color, type));
    }
  }

  // Wild cards
  for (let i = 0; i < 4; i++) {
    cards.push(createCard(null, 'wild'));
    cards.push(createCard(null, 'wild_draw4'));
  }

  return cards;
}

export function shuffle(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealCards(deck: Card[], playerCount: number, cardsPerPlayer = 7) {
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  let idx = 0;

  for (let round = 0; round < cardsPerPlayer; round++) {
    for (let p = 0; p < playerCount; p++) {
      hands[p].push(deck[idx++]);
    }
  }

  return { hands, remaining: deck.slice(idx) };
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/deck.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/lib/deck.ts src/lib/__tests__/deck.test.ts
git commit -m "feat: add deck creation, shuffle, and deal logic with tests"
```

---

### Task 4: Rules Engine (TDD)

**Files:**
- Create: `src/lib/rules.ts`
- Test: `src/lib/__tests__/rules.test.ts`

**Step 1: Write failing tests**

```ts
// src/lib/__tests__/rules.test.ts
import { describe, it, expect } from 'vitest';
import { canPlayCard, getNextPlayerIndex, getCardScore } from '../rules';
import type { Card, Color } from '../types';

function card(color: Color | null, type: Card['type'], value?: number): Card {
  return { id: 'test', color, type, value };
}

describe('canPlayCard', () => {
  it('allows matching color', () => {
    const topCard = card('red', 'number', 5);
    expect(canPlayCard(card('red', 'number', 3), topCard, 'red')).toBe(true);
  });

  it('allows matching number', () => {
    const topCard = card('red', 'number', 5);
    expect(canPlayCard(card('blue', 'number', 5), topCard, 'red')).toBe(true);
  });

  it('allows matching type for action cards', () => {
    const topCard = card('red', 'skip');
    expect(canPlayCard(card('blue', 'skip'), topCard, 'red')).toBe(true);
  });

  it('rejects non-matching card', () => {
    const topCard = card('red', 'number', 5);
    expect(canPlayCard(card('blue', 'number', 3), topCard, 'red')).toBe(false);
  });

  it('always allows wild', () => {
    const topCard = card('red', 'number', 5);
    expect(canPlayCard(card(null, 'wild'), topCard, 'red')).toBe(true);
  });

  it('always allows wild_draw4', () => {
    const topCard = card('red', 'number', 5);
    expect(canPlayCard(card(null, 'wild_draw4'), topCard, 'red')).toBe(true);
  });

  it('matches current color, not top card color (for wild scenarios)', () => {
    const topCard = card(null, 'wild'); // wild was played, color chosen as blue
    expect(canPlayCard(card('blue', 'number', 3), topCard, 'blue')).toBe(true);
    expect(canPlayCard(card('red', 'number', 3), topCard, 'blue')).toBe(false);
  });
});

describe('getNextPlayerIndex', () => {
  it('goes forward in direction 1', () => {
    expect(getNextPlayerIndex(0, 1, 4)).toBe(1);
    expect(getNextPlayerIndex(3, 1, 4)).toBe(0);
  });

  it('goes backward in direction -1', () => {
    expect(getNextPlayerIndex(0, -1, 4)).toBe(3);
    expect(getNextPlayerIndex(2, -1, 4)).toBe(1);
  });

  it('skips players when skip count > 0', () => {
    expect(getNextPlayerIndex(0, 1, 4, 1)).toBe(2);
  });
});

describe('getCardScore', () => {
  it('scores number cards by face value', () => {
    expect(getCardScore(card('red', 'number', 0))).toBe(0);
    expect(getCardScore(card('red', 'number', 9))).toBe(9);
  });

  it('scores action cards as 20', () => {
    expect(getCardScore(card('red', 'skip'))).toBe(20);
    expect(getCardScore(card('red', 'reverse'))).toBe(20);
    expect(getCardScore(card('red', 'draw2'))).toBe(20);
  });

  it('scores wild cards as 50', () => {
    expect(getCardScore(card(null, 'wild'))).toBe(50);
    expect(getCardScore(card(null, 'wild_draw4'))).toBe(50);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/rules.test.ts`
Expected: FAIL

**Step 3: Implement rules module**

```ts
// src/lib/rules.ts
import type { Card, Color } from './types';

export function canPlayCard(card: Card, topCard: Card, currentColor: Color): boolean {
  if (card.type === 'wild' || card.type === 'wild_draw4') return true;
  if (card.color === currentColor) return true;
  if (card.type === 'number' && topCard.type === 'number' && card.value === topCard.value) return true;
  if (card.type !== 'number' && card.type === topCard.type) return true;
  return false;
}

export function getNextPlayerIndex(
  current: number,
  direction: 1 | -1,
  playerCount: number,
  skip: number = 0,
): number {
  const steps = 1 + skip;
  return ((current + direction * steps) % playerCount + playerCount) % playerCount;
}

export function getCardScore(card: Card): number {
  if (card.type === 'number') return card.value ?? 0;
  if (card.type === 'wild' || card.type === 'wild_draw4') return 50;
  return 20; // skip, reverse, draw2
}

export function isWildDraw4Legal(hand: Card[], currentColor: Color): boolean {
  return !hand.some(c => c.color === currentColor && c.type !== 'wild_draw4');
}

export function getPlayableCards(hand: Card[], topCard: Card, currentColor: Color): Card[] {
  return hand.filter(c => canPlayCard(c, topCard, currentColor));
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/rules.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add src/lib/rules.ts src/lib/__tests__/rules.test.ts
git commit -m "feat: add rules engine with play validation and scoring"
```

---

### Task 5: AI Module (TDD)

**Files:**
- Create: `src/lib/ai.ts`
- Test: `src/lib/__tests__/ai.test.ts`

**Step 1: Write failing tests**

```ts
// src/lib/__tests__/ai.test.ts
import { describe, it, expect } from 'vitest';
import { chooseBestCard, chooseColor, shouldChallenge } from '../ai';
import type { Card, Color } from '../types';

function card(color: Color | null, type: Card['type'], value?: number): Card {
  return { id: `test-${Math.random()}`, color, type, value };
}

describe('chooseBestCard', () => {
  it('prefers action cards over number cards', () => {
    const hand = [
      card('red', 'number', 3),
      card('red', 'skip'),
    ];
    const topCard = card('red', 'number', 5);
    const result = chooseBestCard(hand, topCard, 'red');
    expect(result?.type).toBe('skip');
  });

  it('prefers higher number cards', () => {
    const hand = [
      card('red', 'number', 2),
      card('red', 'number', 8),
    ];
    const topCard = card('red', 'number', 5);
    const result = chooseBestCard(hand, topCard, 'red');
    expect(result?.value).toBe(8);
  });

  it('uses wild as last resort before wild_draw4', () => {
    const hand = [
      card(null, 'wild'),
      card(null, 'wild_draw4'),
    ];
    const topCard = card('red', 'number', 5);
    const result = chooseBestCard(hand, topCard, 'red');
    expect(result?.type).toBe('wild');
  });

  it('returns null when no card can be played', () => {
    const hand = [
      card('blue', 'number', 3),
    ];
    const topCard = card('red', 'number', 5);
    const result = chooseBestCard(hand, topCard, 'red');
    expect(result).toBeNull();
  });
});

describe('chooseColor', () => {
  it('chooses the most common color in hand', () => {
    const hand = [
      card('red', 'number', 1),
      card('red', 'number', 2),
      card('blue', 'number', 3),
    ];
    expect(chooseColor(hand)).toBe('red');
  });

  it('returns a valid color even with empty hand', () => {
    const color = chooseColor([]);
    expect(['red', 'yellow', 'green', 'blue']).toContain(color);
  });
});

describe('shouldChallenge', () => {
  it('returns a boolean', () => {
    const result = shouldChallenge(false);
    expect(typeof result).toBe('boolean');
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/ai.test.ts`
Expected: FAIL

**Step 3: Implement AI module**

```ts
// src/lib/ai.ts
import type { Card, Color } from './types';
import { COLORS } from './types';
import { canPlayCard } from './rules';

function getPlayable(hand: Card[], topCard: Card, currentColor: Color): Card[] {
  return hand.filter(c => canPlayCard(c, topCard, currentColor));
}

export function chooseBestCard(hand: Card[], topCard: Card, currentColor: Color): Card | null {
  const playable = getPlayable(hand, topCard, currentColor);
  if (playable.length === 0) return null;

  // Priority: action cards > high number cards > wild > wild_draw4
  const actions = playable.filter(c => c.color !== null && ['skip', 'reverse', 'draw2'].includes(c.type));
  if (actions.length > 0) return actions[0];

  const numbers = playable.filter(c => c.type === 'number').sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  if (numbers.length > 0) return numbers[0];

  const wilds = playable.filter(c => c.type === 'wild');
  if (wilds.length > 0) return wilds[0];

  const wildDraw4s = playable.filter(c => c.type === 'wild_draw4');
  if (wildDraw4s.length > 0) return wildDraw4s[0];

  return playable[0];
}

export function chooseColor(hand: Card[]): Color {
  const counts: Record<Color, number> = { red: 0, yellow: 0, green: 0, blue: 0 };
  for (const card of hand) {
    if (card.color) counts[card.color]++;
  }
  let best: Color = 'red';
  let max = -1;
  for (const color of COLORS) {
    if (counts[color] > max) {
      max = counts[color];
      best = color;
    }
  }
  return best;
}

export function shouldChallenge(suspectHasMatchingColor: boolean): boolean {
  const threshold = suspectHasMatchingColor ? 0.6 : 0.25;
  return Math.random() < threshold;
}

export function shouldSayUno(): boolean {
  return Math.random() < 0.9;
}

export function shouldCatchUno(): boolean {
  return Math.random() < 0.7;
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/ai.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add src/lib/ai.ts src/lib/__tests__/ai.test.ts
git commit -m "feat: add AI decision logic with tests"
```

---

### Task 6: Game State Store

**Files:**
- Create: `src/lib/store.svelte.ts`

**Step 1: Implement game state store**

This file uses Svelte 5 runes for reactive state management. It contains all game actions as exported functions that mutate the shared state.

```ts
// src/lib/store.svelte.ts
import type { Card, Color, GameState, Player } from './types';
import { createDeck, shuffle, dealCards } from './deck';
import { canPlayCard, getNextPlayerIndex, getPlayableCards, isWildDraw4Legal } from './rules';
import { chooseBestCard, chooseColor, shouldChallenge, shouldSayUno, shouldCatchUno } from './ai';

function findFirstPlayableCard(deck: Card[]): number {
  return deck.findIndex(c => c.type === 'number');
}

function createInitialState(): GameState {
  return {
    players: [],
    drawPile: [],
    discardPile: [],
    currentPlayerIndex: 0,
    direction: 1,
    currentColor: 'red',
    phase: 'menu',
    winner: null,
    lastPlayedBy: null,
  };
}

export const gameState: GameState = $state(createInitialState());

export function startGame(aiCount: number) {
  const deck = shuffle(createDeck());
  const playerCount = aiCount + 1;
  const { hands, remaining } = dealCards(deck, playerCount);

  const players: Player[] = hands.map((hand, i) => ({
    id: i,
    name: i === 0 ? 'You' : `AI ${i}`,
    hand,
    isAI: i !== 0,
    saidUno: false,
  }));

  // Find first number card for discard pile
  const firstIdx = findFirstPlayableCard(remaining);
  const firstCard = remaining[firstIdx];
  const drawPile = [...remaining.slice(0, firstIdx), ...remaining.slice(firstIdx + 1)];

  Object.assign(gameState, {
    players,
    drawPile,
    discardPile: [firstCard],
    currentPlayerIndex: 0,
    direction: 1 as const,
    currentColor: firstCard.color!,
    phase: 'playing' as const,
    winner: null,
    lastPlayedBy: null,
  });
}

export function getTopCard(): Card {
  return gameState.discardPile[gameState.discardPile.length - 1];
}

export function getCurrentPlayer(): Player {
  return gameState.players[gameState.currentPlayerIndex];
}

export function getPlayerPlayableCards(): Card[] {
  const player = getCurrentPlayer();
  return getPlayableCards(player.hand, getTopCard(), gameState.currentColor);
}

function drawCards(player: Player, count: number) {
  for (let i = 0; i < count; i++) {
    if (gameState.drawPile.length === 0) recycleDiscardPile();
    if (gameState.drawPile.length > 0) {
      player.hand.push(gameState.drawPile.pop()!);
    }
  }
}

function recycleDiscardPile() {
  const topCard = gameState.discardPile.pop()!;
  gameState.drawPile = shuffle(gameState.discardPile);
  gameState.discardPile = [topCard];
}

function advanceTurn(skip: number = 0) {
  gameState.currentPlayerIndex = getNextPlayerIndex(
    gameState.currentPlayerIndex,
    gameState.direction,
    gameState.players.length,
    skip,
  );
}

function checkWin(player: Player): boolean {
  if (player.hand.length === 0) {
    gameState.winner = player.id;
    gameState.phase = 'result';
    return true;
  }
  return false;
}

export function playCard(card: Card, playerIndex: number) {
  const player = gameState.players[playerIndex];
  const cardIdx = player.hand.findIndex(c => c.id === card.id);
  if (cardIdx === -1) return;

  player.hand.splice(cardIdx, 1);
  gameState.discardPile.push(card);
  gameState.lastPlayedBy = playerIndex;

  if (card.type === 'wild' || card.type === 'wild_draw4') {
    if (card.type === 'wild_draw4') {
      // Store info for challenge phase
      if (player.isAI) {
        const color = chooseColor(player.hand);
        gameState.currentColor = color;
        card.color = color;
        // Check if next player wants to challenge
        const nextIdx = getNextPlayerIndex(gameState.currentPlayerIndex, gameState.direction, gameState.players.length);
        const nextPlayer = gameState.players[nextIdx];
        if (nextPlayer.isAI) {
          handleAIChallenge(playerIndex, nextIdx);
        } else {
          gameState.phase = 'challenging';
        }
        if (checkWin(player)) return;
        return; // Don't advance turn yet
      } else {
        gameState.phase = 'choosing_color';
        return;
      }
    }
    // Regular wild
    if (player.isAI) {
      const color = chooseColor(player.hand);
      gameState.currentColor = color;
      card.color = color;
      if (checkWin(player)) return;
      advanceTurn();
      return;
    }
    gameState.phase = 'choosing_color';
    return;
  }

  gameState.currentColor = card.color!;

  if (checkWin(player)) return;

  applyCardEffect(card);
}

function applyCardEffect(card: Card) {
  const playerCount = gameState.players.length;

  switch (card.type) {
    case 'skip':
      advanceTurn(1);
      break;
    case 'reverse':
      if (playerCount === 2) {
        advanceTurn(1); // Acts as skip in 2-player
      } else {
        gameState.direction = (gameState.direction * -1) as 1 | -1;
        advanceTurn();
      }
      break;
    case 'draw2': {
      const nextIdx = getNextPlayerIndex(gameState.currentPlayerIndex, gameState.direction, playerCount);
      drawCards(gameState.players[nextIdx], 2);
      advanceTurn(1);
      break;
    }
    default:
      advanceTurn();
  }
}

export function chooseWildColor(color: Color) {
  gameState.currentColor = color;
  const topCard = getTopCard();
  topCard.color = color;

  if (topCard.type === 'wild_draw4') {
    // Move to challenge phase for next player
    const nextIdx = getNextPlayerIndex(gameState.currentPlayerIndex, gameState.direction, gameState.players.length);
    const nextPlayer = gameState.players[nextIdx];
    if (nextPlayer.isAI) {
      handleAIChallenge(gameState.currentPlayerIndex, nextIdx);
    } else {
      // Should not happen (human is always player 0 and plays wild themselves)
      applyDraw4(false);
    }
    return;
  }

  if (checkWin(getCurrentPlayer())) return;
  gameState.phase = 'playing';
  advanceTurn();
}

function handleAIChallenge(playedByIdx: number, challengerIdx: number) {
  const playedBy = gameState.players[playedByIdx];
  const doChallenge = shouldChallenge(false);

  if (doChallenge) {
    const wasLegal = isWildDraw4Legal(
      [...playedBy.hand], // hand after playing the card
      gameState.currentColor,
    );
    if (wasLegal) {
      // Challenge fails: challenger draws 6
      drawCards(gameState.players[challengerIdx], 6);
    } else {
      // Challenge succeeds: player who played draws 4
      drawCards(playedBy, 4);
    }
  } else {
    // No challenge: next player draws 4
    drawCards(gameState.players[challengerIdx], 4);
  }

  gameState.phase = 'playing';
  // Skip the challenger's turn
  advanceTurn(1);
}

export function handlePlayerChallenge(doChallenge: boolean) {
  applyDraw4(doChallenge);
}

function applyDraw4(doChallenge: boolean) {
  const playedByIdx = gameState.lastPlayedBy!;
  const playedBy = gameState.players[playedByIdx];
  const challengerIdx = getNextPlayerIndex(playedByIdx, gameState.direction, gameState.players.length);

  if (doChallenge) {
    const wasLegal = isWildDraw4Legal(playedBy.hand, gameState.currentColor);
    if (wasLegal) {
      drawCards(gameState.players[challengerIdx], 6);
    } else {
      drawCards(playedBy, 4);
    }
  } else {
    drawCards(gameState.players[challengerIdx], 4);
  }

  gameState.phase = 'playing';
  advanceTurn(1);
}

export function playerDrawCard() {
  const player = getCurrentPlayer();
  drawCards(player, 1);
  advanceTurn();
}

export function sayUno(playerIndex: number) {
  gameState.players[playerIndex].saidUno = true;
}

export function penalizeNoUno(playerIndex: number) {
  drawCards(gameState.players[playerIndex], 2);
  gameState.players[playerIndex].saidUno = false;
}

export function resetGame() {
  Object.assign(gameState, createInitialState());
}

// --- AI Turn ---

export function executeAITurn(): Promise<void> {
  return new Promise((resolve) => {
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const player = getCurrentPlayer();
      if (!player.isAI) { resolve(); return; }

      const card = chooseBestCard(player.hand, getTopCard(), gameState.currentColor);

      // Check UNO for previous AI plays
      if (player.hand.length === 2 && card) {
        player.saidUno = shouldSayUno();
      }

      if (card) {
        playCard(card, player.id);
      } else {
        playerDrawCard();
      }

      resolve();
    }, delay);
  });
}
```

**Step 2: Commit**

```bash
git add src/lib/store.svelte.ts
git commit -m "feat: add game state store with all game actions"
```

---

### Task 7: Card Component

**Files:**
- Create: `src/components/Card.svelte`
- Create: `src/components/card.css`

**Step 1: Implement Card component**

```svelte
<!-- src/components/Card.svelte -->
<script lang="ts">
  import type { Card } from '../lib/types';
  import { COLOR_HEX } from '../lib/types';

  interface Props {
    card: Card;
    faceDown?: boolean;
    playable?: boolean;
    onclick?: () => void;
  }

  let { card, faceDown = false, playable = false, onclick }: Props = $props();

  let displayValue = $derived(() => {
    if (card.type === 'number') return String(card.value);
    if (card.type === 'skip') return '⊘';
    if (card.type === 'reverse') return '⟲';
    if (card.type === 'draw2') return '+2';
    if (card.type === 'wild') return '✦';
    if (card.type === 'wild_draw4') return '+4';
    return '';
  });

  let bgColor = $derived(
    faceDown ? '#1a1a2e' : (card.color ? COLOR_HEX[card.color] : '#1a1a2e')
  );

  let isWild = $derived(card.type === 'wild' || card.type === 'wild_draw4');
</script>

<button
  class="card"
  class:face-down={faceDown}
  class:playable
  class:wild={isWild && !faceDown}
  style="--card-bg: {bgColor}"
  onclick={onclick}
  disabled={!playable && !faceDown}
>
  {#if faceDown}
    <div class="card-back">
      <span class="back-text">UNO</span>
    </div>
  {:else}
    <span class="card-value-small top-left">{displayValue()}</span>
    <span class="card-value-center">{displayValue()}</span>
    <span class="card-value-small bottom-right">{displayValue()}</span>
  {/if}
</button>

<style>
  .card {
    --card-width: 80px;
    --card-height: 120px;
    width: var(--card-width);
    height: var(--card-height);
    border-radius: 10px;
    background: var(--card-bg);
    border: 3px solid #fff;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
    position: relative;
    cursor: default;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Arial Black', Arial, sans-serif;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    transition: transform 0.2s, box-shadow 0.2s;
    padding: 0;
    flex-shrink: 0;
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 40%;
    background: rgba(255, 255, 255, 0.15);
    transform: rotate(15deg);
    pointer-events: none;
  }

  .card.playable {
    cursor: pointer;
    box-shadow: 0 0 12px 3px rgba(255, 255, 100, 0.7);
  }

  .card.playable:hover {
    transform: translateY(-16px) scale(1.05);
    box-shadow: 0 0 20px 5px rgba(255, 255, 100, 0.9);
  }

  .card.face-down {
    cursor: default;
  }

  .card.wild {
    background: linear-gradient(135deg, #ED1C24 25%, #FFDE00 25%, #FFDE00 50%, #00A651 50%, #00A651 75%, #0072BC 75%) !important;
  }

  .card-value-center {
    font-size: 2rem;
    z-index: 1;
  }

  .card-value-small {
    position: absolute;
    font-size: 0.75rem;
    z-index: 1;
  }

  .top-left {
    top: 6px;
    left: 8px;
  }

  .bottom-right {
    bottom: 6px;
    right: 8px;
    transform: rotate(180deg);
  }

  .card-back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, #2d2d5e 0%, #1a1a2e 100%);
    border-radius: 7px;
  }

  .back-text {
    font-size: 1.1rem;
    font-weight: 900;
    color: #ff4444;
    letter-spacing: 2px;
    text-shadow: 0 0 8px rgba(255, 68, 68, 0.6);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/Card.svelte
git commit -m "feat: add Card component with realistic styling"
```

---

### Task 8: PlayerHand & AIHand Components

**Files:**
- Create: `src/components/PlayerHand.svelte`
- Create: `src/components/AIHand.svelte`

**Step 1: Implement PlayerHand**

```svelte
<!-- src/components/PlayerHand.svelte -->
<script lang="ts">
  import type { Card as CardType } from '../lib/types';
  import Card from './Card.svelte';

  interface Props {
    cards: CardType[];
    playableIds: Set<string>;
    onplay: (card: CardType) => void;
  }

  let { cards, playableIds, onplay }: Props = $props();
</script>

<div class="player-hand">
  {#each cards as card (card.id)}
    <div class="card-slot">
      <Card
        {card}
        playable={playableIds.has(card.id)}
        onclick={() => playableIds.has(card.id) && onplay(card)}
      />
    </div>
  {/each}
</div>

<style>
  .player-hand {
    display: flex;
    justify-content: center;
    gap: 0;
    padding: 10px 20px;
    overflow-x: auto;
    max-width: 100%;
  }

  .card-slot {
    margin-left: -20px;
    transition: margin 0.2s;
  }

  .card-slot:first-child {
    margin-left: 0;
  }

  .card-slot:hover {
    margin-left: -10px;
    margin-right: 10px;
  }
</style>
```

**Step 2: Implement AIHand**

```svelte
<!-- src/components/AIHand.svelte -->
<script lang="ts">
  import Card from './Card.svelte';

  interface Props {
    cardCount: number;
    position: 'top' | 'left' | 'right';
    name: string;
    isActive: boolean;
  }

  let { cardCount, position, name, isActive }: Props = $props();

  // Create dummy cards for display
  let dummyCards = $derived(
    Array.from({ length: cardCount }, (_, i) => ({
      id: `dummy-${i}`,
      color: null as any,
      type: 'number' as const,
    }))
  );
</script>

<div class="ai-hand {position}" class:active={isActive}>
  <div class="ai-name">{name} ({cardCount})</div>
  <div class="ai-cards">
    {#each dummyCards as card (card.id)}
      <div class="ai-card-slot">
        <Card {card} faceDown />
      </div>
    {/each}
  </div>
</div>

<style>
  .ai-hand {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .ai-hand.active {
    filter: drop-shadow(0 0 12px rgba(255, 255, 100, 0.6));
  }

  .ai-name {
    color: #fff;
    font-size: 0.9rem;
    font-weight: bold;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }

  .ai-cards {
    display: flex;
  }

  .top .ai-cards {
    flex-direction: row;
  }

  .left .ai-cards,
  .right .ai-cards {
    flex-direction: column;
  }

  .ai-card-slot {
    margin-left: -40px;
  }

  .ai-card-slot:first-child {
    margin-left: 0;
  }

  .left .ai-card-slot,
  .right .ai-card-slot {
    margin-left: 0;
    margin-top: -70px;
  }

  .left .ai-card-slot:first-child,
  .right .ai-card-slot:first-child {
    margin-top: 0;
  }

  .left .ai-cards :global(.card),
  .right .ai-cards :global(.card) {
    --card-width: 50px;
    --card-height: 75px;
  }

  .left .ai-cards :global(.card) {
    transform: rotate(90deg);
  }

  .right .ai-cards :global(.card) {
    transform: rotate(-90deg);
  }

  .top .ai-cards :global(.card) {
    --card-width: 55px;
    --card-height: 82px;
  }
</style>
```

**Step 3: Commit**

```bash
git add src/components/PlayerHand.svelte src/components/AIHand.svelte
git commit -m "feat: add PlayerHand and AIHand components"
```

---

### Task 9: DiscardPile, DrawPile, ColorPicker, UnoButton, GameInfo

**Files:**
- Create: `src/components/DiscardPile.svelte`
- Create: `src/components/DrawPile.svelte`
- Create: `src/components/ColorPicker.svelte`
- Create: `src/components/UnoButton.svelte`
- Create: `src/components/GameInfo.svelte`

**Step 1: Implement DiscardPile**

```svelte
<!-- src/components/DiscardPile.svelte -->
<script lang="ts">
  import type { Card as CardType } from '../lib/types';
  import Card from './Card.svelte';

  interface Props {
    topCard: CardType;
  }

  let { topCard }: Props = $props();
</script>

<div class="discard-pile">
  <div class="label">Discard</div>
  <Card card={topCard} />
</div>

<style>
  .discard-pile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
</style>
```

**Step 2: Implement DrawPile**

```svelte
<!-- src/components/DrawPile.svelte -->
<script lang="ts">
  interface Props {
    count: number;
    canDraw: boolean;
    ondraw: () => void;
  }

  let { count, canDraw, ondraw }: Props = $props();
</script>

<div class="draw-pile">
  <div class="label">Draw ({count})</div>
  <button
    class="draw-card"
    class:can-draw={canDraw}
    onclick={ondraw}
    disabled={!canDraw}
  >
    <div class="card-back">
      <span class="back-text">UNO</span>
    </div>
  </button>
</div>

<style>
  .draw-pile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .draw-card {
    width: 80px;
    height: 120px;
    border-radius: 10px;
    border: 3px solid #fff;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3), 4px 6px 0 #0d0d1a;
    cursor: default;
    padding: 0;
    transition: transform 0.2s;
  }

  .draw-card.can-draw {
    cursor: pointer;
    box-shadow: 0 0 12px 3px rgba(100, 200, 255, 0.5), 4px 6px 0 #0d0d1a;
  }

  .draw-card.can-draw:hover {
    transform: translateY(-4px);
  }

  .card-back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, #2d2d5e 0%, #1a1a2e 100%);
    border-radius: 7px;
  }

  .back-text {
    font-size: 1.1rem;
    font-weight: 900;
    font-family: 'Arial Black', Arial, sans-serif;
    color: #ff4444;
    letter-spacing: 2px;
    text-shadow: 0 0 8px rgba(255, 68, 68, 0.6);
  }
</style>
```

**Step 3: Implement ColorPicker**

```svelte
<!-- src/components/ColorPicker.svelte -->
<script lang="ts">
  import type { Color } from '../lib/types';
  import { COLOR_HEX } from '../lib/types';

  interface Props {
    onpick: (color: Color) => void;
  }

  let { onpick }: Props = $props();

  const colors: Color[] = ['red', 'yellow', 'green', 'blue'];
</script>

<div class="overlay">
  <div class="picker">
    <h3>Choose a color</h3>
    <div class="colors">
      {#each colors as color}
        <button
          class="color-btn"
          style="background: {COLOR_HEX[color]}"
          onclick={() => onpick(color)}
        ></button>
      {/each}
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .picker {
    background: #2a2a4a;
    border-radius: 16px;
    padding: 24px 32px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  h3 {
    color: #fff;
    margin: 0 0 16px;
    font-size: 1.2rem;
  }

  .colors {
    display: flex;
    gap: 16px;
  }

  .color-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 4px solid #fff;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    padding: 0;
  }

  .color-btn:hover {
    transform: scale(1.15);
    box-shadow: 0 0 16px 4px rgba(255, 255, 255, 0.3);
  }
</style>
```

**Step 4: Implement UnoButton**

```svelte
<!-- src/components/UnoButton.svelte -->
<script lang="ts">
  interface Props {
    visible: boolean;
    onclick: () => void;
  }

  let { visible, onclick }: Props = $props();
</script>

{#if visible}
  <button class="uno-btn" onclick={onclick}>
    UNO!
  </button>
{/if}

<style>
  .uno-btn {
    background: linear-gradient(135deg, #ff4444, #cc0000);
    color: #fff;
    font-size: 1.5rem;
    font-weight: 900;
    font-family: 'Arial Black', Arial, sans-serif;
    padding: 12px 32px;
    border-radius: 50px;
    border: 3px solid #fff;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(255, 0, 0, 0.4);
    transition: transform 0.15s;
    letter-spacing: 2px;
    animation: pulse 1s infinite alternate;
  }

  .uno-btn:hover {
    transform: scale(1.1);
  }

  @keyframes pulse {
    from { box-shadow: 0 4px 16px rgba(255, 0, 0, 0.4); }
    to { box-shadow: 0 4px 24px rgba(255, 0, 0, 0.8); }
  }
</style>
```

**Step 5: Implement GameInfo**

```svelte
<!-- src/components/GameInfo.svelte -->
<script lang="ts">
  import type { Color } from '../lib/types';
  import { COLOR_HEX } from '../lib/types';

  interface Props {
    direction: 1 | -1;
    currentColor: Color;
    currentPlayerName: string;
  }

  let { direction, currentColor, currentPlayerName }: Props = $props();
</script>

<div class="game-info">
  <div class="direction" class:reversed={direction === -1}>
    ⟳
  </div>
  <div class="color-indicator" style="background: {COLOR_HEX[currentColor]}"></div>
  <div class="current-player">{currentPlayerName}'s turn</div>
</div>

<style>
  .game-info {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #fff;
    font-size: 0.9rem;
  }

  .direction {
    font-size: 2rem;
    transition: transform 0.4s;
  }

  .direction.reversed {
    transform: scaleX(-1);
  }

  .color-indicator {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #fff;
  }

  .current-player {
    font-weight: bold;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
</style>
```

**Step 6: Commit**

```bash
git add src/components/DiscardPile.svelte src/components/DrawPile.svelte src/components/ColorPicker.svelte src/components/UnoButton.svelte src/components/GameInfo.svelte
git commit -m "feat: add DiscardPile, DrawPile, ColorPicker, UnoButton, GameInfo components"
```

---

### Task 10: GameBoard & Challenge Dialog

**Files:**
- Create: `src/components/GameBoard.svelte`
- Create: `src/components/ChallengeDialog.svelte`

**Step 1: Implement ChallengeDialog**

```svelte
<!-- src/components/ChallengeDialog.svelte -->
<script lang="ts">
  interface Props {
    playerName: string;
    onrespond: (challenge: boolean) => void;
  }

  let { playerName, onrespond }: Props = $props();
</script>

<div class="overlay">
  <div class="dialog">
    <h3>{playerName} played Wild Draw 4!</h3>
    <p>Do you think they're bluffing?</p>
    <div class="actions">
      <button class="btn challenge" onclick={() => onrespond(true)}>
        Challenge!
      </button>
      <button class="btn accept" onclick={() => onrespond(false)}>
        Accept (+4 cards)
      </button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .dialog {
    background: #2a2a4a;
    border-radius: 16px;
    padding: 24px 32px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    max-width: 400px;
  }

  h3 {
    color: #ff4444;
    margin: 0 0 8px;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 20px;
  }

  .actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .btn {
    padding: 10px 24px;
    border-radius: 8px;
    border: 2px solid #fff;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.15s;
    color: #fff;
  }

  .btn:hover {
    transform: scale(1.05);
  }

  .challenge {
    background: #ff4444;
  }

  .accept {
    background: #555;
  }
</style>
```

**Step 2: Implement GameBoard**

```svelte
<!-- src/components/GameBoard.svelte -->
<script lang="ts">
  import type { Card as CardType, Color } from '../lib/types';
  import {
    gameState,
    getTopCard,
    getCurrentPlayer,
    getPlayerPlayableCards,
    playCard,
    playerDrawCard,
    chooseWildColor,
    handlePlayerChallenge,
    sayUno,
    executeAITurn,
  } from '../lib/store.svelte';

  import PlayerHand from './PlayerHand.svelte';
  import AIHand from './AIHand.svelte';
  import DiscardPile from './DiscardPile.svelte';
  import DrawPile from './DrawPile.svelte';
  import ColorPicker from './ColorPicker.svelte';
  import ChallengeDialog from './ChallengeDialog.svelte';
  import UnoButton from './UnoButton.svelte';
  import GameInfo from './GameInfo.svelte';

  let humanPlayer = $derived(gameState.players[0]);
  let topCard = $derived(getTopCard());
  let currentPlayer = $derived(getCurrentPlayer());
  let isHumanTurn = $derived(gameState.currentPlayerIndex === 0 && gameState.phase === 'playing');
  let playableCards = $derived(isHumanTurn ? getPlayerPlayableCards() : []);
  let playableIds = $derived(new Set(playableCards.map(c => c.id)));

  let showUnoButton = $derived(
    humanPlayer &&
    humanPlayer.hand.length === 2 &&
    isHumanTurn &&
    !humanPlayer.saidUno
  );

  let aiPlayers = $derived(gameState.players.slice(1));

  // AI positions based on count
  let aiPositions = $derived<Array<'right' | 'top' | 'left'>>(() => {
    if (aiPlayers.length === 1) return ['top'];
    if (aiPlayers.length === 2) return ['right', 'left'];
    return ['right', 'top', 'left'];
  });

  function handlePlayCard(card: CardType) {
    if (!isHumanTurn) return;
    playCard(card, 0);
  }

  function handleDraw() {
    if (!isHumanTurn) return;
    playerDrawCard();
  }

  function handleColorPick(color: Color) {
    chooseWildColor(color);
    gameState.phase = 'playing';
  }

  function handleChallenge(doChallenge: boolean) {
    handlePlayerChallenge(doChallenge);
  }

  function handleUno() {
    sayUno(0);
  }

  // Auto-run AI turns
  $effect(() => {
    if (
      gameState.phase === 'playing' &&
      currentPlayer.isAI
    ) {
      executeAITurn();
    }
  });
</script>

<div class="board">
  <!-- AI players -->
  <div class="ai-area">
    {#each aiPlayers as ai, i (ai.id)}
      <div class="ai-position {aiPositions()[i]}">
        <AIHand
          cardCount={ai.hand.length}
          position={aiPositions()[i]}
          name={ai.name}
          isActive={gameState.currentPlayerIndex === ai.id}
        />
      </div>
    {/each}
  </div>

  <!-- Center area -->
  <div class="center">
    <div class="piles">
      <DrawPile
        count={gameState.drawPile.length}
        canDraw={isHumanTurn}
        ondraw={handleDraw}
      />
      <DiscardPile {topCard} />
    </div>
    <GameInfo
      direction={gameState.direction}
      currentColor={gameState.currentColor}
      currentPlayerName={currentPlayer.name}
    />
    <UnoButton visible={showUnoButton} onclick={handleUno} />
  </div>

  <!-- Human player -->
  <div class="human-area">
    {#if humanPlayer}
      <PlayerHand
        cards={humanPlayer.hand}
        {playableIds}
        onplay={handlePlayCard}
      />
    {/if}
  </div>

  <!-- Overlays -->
  {#if gameState.phase === 'choosing_color'}
    <ColorPicker onpick={handleColorPick} />
  {/if}

  {#if gameState.phase === 'challenging'}
    <ChallengeDialog
      playerName={gameState.players[gameState.lastPlayedBy ?? 0].name}
      onrespond={handleChallenge}
    />
  {/if}
</div>

<style>
  .board {
    width: 100vw;
    height: 100vh;
    background: radial-gradient(ellipse at center, #1a5c2a 0%, #0d3318 60%, #091a0e 100%);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .ai-area {
    flex: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 16px;
  }

  .ai-position {
    position: absolute;
  }

  .ai-position.top {
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }

  .ai-position.left {
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
  }

  .ai-position.right {
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex: 1;
  }

  .piles {
    display: flex;
    gap: 32px;
    align-items: center;
  }

  .human-area {
    padding: 8px 0 16px;
    display: flex;
    justify-content: center;
  }
</style>
```

**Step 3: Commit**

```bash
git add src/components/GameBoard.svelte src/components/ChallengeDialog.svelte
git commit -m "feat: add GameBoard and ChallengeDialog components"
```

---

### Task 11: Menu & Result Pages

**Files:**
- Create: `src/pages/Menu.svelte`
- Create: `src/pages/Result.svelte`

**Step 1: Implement Menu page**

```svelte
<!-- src/pages/Menu.svelte -->
<script lang="ts">
  interface Props {
    onstart: (aiCount: number) => void;
  }

  let { onstart }: Props = $props();

  let aiCount = $state(3);
</script>

<div class="menu">
  <h1 class="title">UNO</h1>

  <div class="settings">
    <label>
      AI Opponents
      <div class="ai-selector">
        {#each [1, 2, 3] as n}
          <button
            class="ai-btn"
            class:selected={aiCount === n}
            onclick={() => aiCount = n}
          >
            {n}
          </button>
        {/each}
      </div>
    </label>
  </div>

  <button class="start-btn" onclick={() => onstart(aiCount)}>
    Start Game
  </button>
</div>

<style>
  .menu {
    width: 100vw;
    height: 100vh;
    background: radial-gradient(ellipse at center, #1a5c2a 0%, #0d3318 60%, #091a0e 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    color: #fff;
    font-family: 'Arial Black', Arial, sans-serif;
  }

  .title {
    font-size: 6rem;
    color: #ff4444;
    text-shadow: 0 4px 16px rgba(255, 0, 0, 0.4), 0 0 60px rgba(255, 0, 0, 0.2);
    letter-spacing: 12px;
    margin: 0;
  }

  .settings {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-size: 1.1rem;
  }

  .ai-selector {
    display: flex;
    gap: 12px;
  }

  .ai-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #fff;
    background: transparent;
    color: #fff;
    font-size: 1.3rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ai-btn.selected {
    background: #ff4444;
    box-shadow: 0 0 16px rgba(255, 0, 0, 0.5);
  }

  .ai-btn:hover {
    transform: scale(1.1);
  }

  .start-btn {
    padding: 16px 48px;
    font-size: 1.4rem;
    font-weight: 900;
    font-family: 'Arial Black', Arial, sans-serif;
    background: linear-gradient(135deg, #ff4444, #cc0000);
    color: #fff;
    border: 3px solid #fff;
    border-radius: 50px;
    cursor: pointer;
    letter-spacing: 3px;
    transition: transform 0.2s;
    box-shadow: 0 4px 24px rgba(255, 0, 0, 0.4);
  }

  .start-btn:hover {
    transform: scale(1.05);
  }
</style>
```

**Step 2: Implement Result page**

```svelte
<!-- src/pages/Result.svelte -->
<script lang="ts">
  import type { Player } from '../lib/types';
  import { getCardScore } from '../lib/rules';

  interface Props {
    players: Player[];
    winnerId: number;
    onrestart: () => void;
    onmenu: () => void;
  }

  let { players, winnerId, onrestart, onmenu }: Props = $props();

  let winner = $derived(players.find(p => p.id === winnerId)!);

  let scores = $derived(
    players.map(p => ({
      name: p.name,
      score: p.hand.reduce((sum, card) => sum + getCardScore(card), 0),
      isWinner: p.id === winnerId,
    }))
  );
</script>

<div class="result">
  <h1 class="winner-title">
    {winner.name === 'You' ? '🎉 You Win!' : `${winner.name} Wins!`}
  </h1>

  <div class="scoreboard">
    <h2>Scores</h2>
    {#each scores as entry}
      <div class="score-row" class:winner={entry.isWinner}>
        <span class="name">{entry.name}</span>
        <span class="score">{entry.isWinner ? '🏆 WINNER' : `${entry.score} pts remaining`}</span>
      </div>
    {/each}
  </div>

  <div class="actions">
    <button class="btn primary" onclick={onrestart}>Play Again</button>
    <button class="btn secondary" onclick={onmenu}>Main Menu</button>
  </div>
</div>

<style>
  .result {
    width: 100vw;
    height: 100vh;
    background: radial-gradient(ellipse at center, #1a5c2a 0%, #0d3318 60%, #091a0e 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    color: #fff;
    font-family: 'Arial Black', Arial, sans-serif;
  }

  .winner-title {
    font-size: 3rem;
    text-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
    color: #ffd700;
    margin: 0;
  }

  .scoreboard {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 16px;
    padding: 24px 40px;
    min-width: 300px;
  }

  .scoreboard h2 {
    margin: 0 0 16px;
    font-size: 1.2rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
  }

  .score-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 1rem;
  }

  .score-row.winner {
    color: #ffd700;
  }

  .score {
    font-weight: normal;
    font-family: Arial, sans-serif;
  }

  .actions {
    display: flex;
    gap: 16px;
  }

  .btn {
    padding: 14px 36px;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 50px;
    border: 3px solid #fff;
    cursor: pointer;
    transition: transform 0.2s;
    font-family: 'Arial Black', Arial, sans-serif;
    color: #fff;
  }

  .btn:hover {
    transform: scale(1.05);
  }

  .primary {
    background: linear-gradient(135deg, #ff4444, #cc0000);
    box-shadow: 0 4px 16px rgba(255, 0, 0, 0.4);
  }

  .secondary {
    background: rgba(255, 255, 255, 0.15);
  }
</style>
```

**Step 3: Commit**

```bash
git add src/pages/Menu.svelte src/pages/Result.svelte
git commit -m "feat: add Menu and Result pages"
```

---

### Task 12: App Integration

**Files:**
- Modify: `src/App.svelte`
- Modify: `src/app.css`

**Step 1: Wire up App.svelte**

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import { gameState, startGame, resetGame } from './lib/store.svelte';
  import Menu from './pages/Menu.svelte';
  import GameBoard from './components/GameBoard.svelte';
  import Result from './pages/Result.svelte';
  import './app.css';

  let lastAiCount = $state(3);

  function handleStart(aiCount: number) {
    lastAiCount = aiCount;
    startGame(aiCount);
  }

  function handleRestart() {
    startGame(lastAiCount);
  }

  function handleMenu() {
    resetGame();
  }
</script>

{#if gameState.phase === 'menu'}
  <Menu onstart={handleStart} />
{:else if gameState.phase === 'result'}
  <Result
    players={gameState.players}
    winnerId={gameState.winner ?? 0}
    onrestart={handleRestart}
    onmenu={handleMenu}
  />
{:else}
  <GameBoard />
{/if}
```

**Step 2: Write global CSS**

```css
/* src/app.css */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Arial, sans-serif;
  background: #091a0e;
}

#app {
  width: 100%;
  height: 100%;
}

button {
  font-family: inherit;
}
```

**Step 3: Commit**

```bash
git add src/App.svelte src/app.css
git commit -m "feat: wire up App with page routing and global styles"
```

---

### Task 13: Manual Testing & Bug Fixes

**Step 1: Start dev server and play test**

Run: `npm run dev`

Test the following scenarios manually:
1. Menu: select 1/2/3 AI opponents, start game
2. Play number cards by clicking
3. Draw a card when no playable cards
4. Play a Wild card and choose color
5. Play a Wild Draw 4, observe challenge dialog
6. AI turns execute with delay
7. UNO button appears when down to 2 cards
8. Game ends and shows Result page
9. Play Again and Main Menu buttons work

**Step 2: Fix any bugs found during testing**

**Step 3: Commit fixes**

```bash
git add -A
git commit -m "fix: bug fixes from manual play testing"
```

---

### Task 14: Run All Tests & Final Commit

**Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass.

**Step 2: Build for production**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: verify all tests pass and production build succeeds"
```
