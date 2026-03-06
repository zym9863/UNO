[README.md (中文)](./README.md) | [README-EN (English)](./README-EN.md)

# UNO - Online Card Game

A browser-based single-player UNO card game, supporting battles against 1-3 AI opponents.

## Project Preview

![UNO Game](https://img.shields.io/badge/Svelte-5.45.2-FF3E00?style=flat&logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.0-brightgreen?style=flat&logo=vite)

## Tech Stack

- **Svelte 5** + TypeScript
- **Vite** development server and build
- **Pure CSS** for card visuals and animations
- Pure client-side, no backend required

## Game Features

### Complete UNO Rules
- Standard 108-card deck
- Number cards, action cards (Skip, Reverse, +2)
- Wild cards and Wild Draw 4 cards
- Complete +4 card challenge mechanism

### Game Mechanics
- 🃏 UNO call system (with AI detection)
- 🎯 Smart play prioritization
- ⚔️ AI challenges and bluffing
- ⏱️ AI play thinking delay

### User Interface
- 🎨 Beautiful card visuals
- ✨ Smooth play and draw animations
- 📱 Responsive layout
- 🎲 Multiple AI opponent options (1-3 players)

## Quick Start

### Install Dependencies

```bash
pnpm install
```

### Development Mode

```bash
pnpm dev
```

### Build Production Version

```bash
pnpm build
```

### Run Tests

```bash
pnpm test
```

## Project Structure

```
uno/
├── src/
│   ├── lib/
│   │   ├── types.ts        # Card, player, game state type definitions
│   │   ├── deck.ts         # Deck creation, shuffling, dealing
│   │   ├── rules.ts        # Play validation, special card effects
│   │   ├── ai.ts           # AI decision logic
│   │   ├── store.svelte.ts # Svelte Store, core game state
│   │   └── __tests__/      # Unit tests
│   ├── components/
│   │   ├── Card.svelte           # Card component
│   │   ├── PlayerHand.svelte     # Player's hand
│   │   ├── AIHand.svelte         # AI hand
│   │   ├── DiscardPile.svelte    # Discard pile
│   │   ├── DrawPile.svelte       # Draw pile
│   │   ├── ColorPicker.svelte    # Color picker
│   │   ├── GameBoard.svelte      # Main game interface
│   │   ├── GameInfo.svelte       # Game info
│   │   └── UnoButton.svelte      # UNO call button
│   └── pages/
│       ├── Menu.svelte     # Start menu
│       └── Result.svelte   # Game result
├── docs/plans/             # Design documents
└── public/
```

## Game Rules

### Playing Conditions
You can play a card if any of the following conditions are met:
- The color matches the current active color
- The number/type matches the top card of the discard pile
- It's a Wild or Wild Draw 4 card

### Special Card Effects

| Card | Effect |
|------|--------|
| Skip | Next player skips their turn |
| Reverse | Reverses play direction (equivalent to Skip in 2-player mode) |
| +2 (Draw 2) | Next player draws 2 cards and skips turn |
| Wild | Player chooses a new color |
| Wild Draw 4 | Player chooses color, next player draws 4 cards and skips turn |

### +4 Card Challenge Mechanism
- You can only play +4 if you have no cards matching the current color
- When challenged: If the player has matching cards, they draw 4 instead; if not, the challenger draws 6

## AI Logic

### Play Priority (High to Low)
1. Action cards matching color (Skip, Reverse, +2)
2. Number cards matching color (prefer playing high-value cards)
3. Matching type/number cards (switch to color with most cards)
4. Wild cards (choose color with most cards)
5. Wild Draw 4 (last resort)
6. No playable cards → Draw

### Color Choice
Count the number of cards of each color in hand, choose the color with the most cards.

### Challenge Decision
- If player was observed playing current color recently: ~60% challenge rate
- Otherwise: ~25% challenge rate

## License

MIT License
