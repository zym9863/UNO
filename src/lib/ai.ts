import type { Card, Color } from './types';
import { COLORS } from './types';
import { canPlayCard } from './rules';

function getPlayable(hand: Card[], topCard: Card, currentColor: Color): Card[] {
  return hand.filter(c => canPlayCard(c, topCard, currentColor));
}

export function chooseBestCard(hand: Card[], topCard: Card, currentColor: Color): Card | null {
  const playable = getPlayable(hand, topCard, currentColor);
  if (playable.length === 0) return null;

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
