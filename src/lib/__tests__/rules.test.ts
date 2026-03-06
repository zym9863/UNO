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
    const topCard = card(null, 'wild');
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
