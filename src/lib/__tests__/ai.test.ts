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
