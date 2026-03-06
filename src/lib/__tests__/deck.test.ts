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
