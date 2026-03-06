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
    cards.push(createCard(color, 'number', 0));
    for (let v = 1; v <= 9; v++) {
      cards.push(createCard(color, 'number', v));
      cards.push(createCard(color, 'number', v));
    }
    for (const type of ['skip', 'reverse', 'draw2'] as CardType[]) {
      cards.push(createCard(color, type));
      cards.push(createCard(color, type));
    }
  }

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
