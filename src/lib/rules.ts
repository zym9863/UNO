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
  return 20;
}

export function isWildDraw4Legal(hand: Card[], currentColor: Color): boolean {
  return !hand.some(c => c.color === currentColor && c.type !== 'wild_draw4');
}

export function getPlayableCards(hand: Card[], topCard: Card, currentColor: Color): Card[] {
  return hand.filter(c => canPlayCard(c, topCard, currentColor));
}
