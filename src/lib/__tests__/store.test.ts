import { afterEach, describe, expect, it } from 'vitest';
import { gameState, handlePlayerChallenge, playCard, resetGame } from '../store.svelte';
import type { Card, Color, Player } from '../types';

function card(id: string, color: Color | null, type: Card['type'], value?: number): Card {
  return { id, color, type, value };
}

function player(id: number, hand: Card[], isAI: boolean): Player {
  return {
    id,
    name: isAI ? `AI ${id}` : 'You',
    hand,
    isAI,
    saidUno: false,
  };
}

afterEach(() => {
  resetGame();
});

describe('wild draw 4 challenge resolution', () => {
  it('judges legality against the color before +4 was played', () => {
    const wildDraw4 = card('w4', null, 'wild_draw4');
    const matchingRed = card('r5', 'red', 'number', 5);

    Object.assign(gameState, {
      players: [
        player(0, [wildDraw4, matchingRed], true),
        player(1, [], false),
      ],
      drawPile: [
        card('d1', 'blue', 'number', 1),
        card('d2', 'green', 'number', 2),
        card('d3', 'yellow', 'number', 3),
        card('d4', 'blue', 'number', 4),
      ],
      discardPile: [card('top', 'red', 'number', 7)],
      currentPlayerIndex: 0,
      direction: 1 as const,
      currentColor: 'red' as const,
      phase: 'playing' as const,
      winner: null,
      lastPlayedBy: null,
      wildDraw4BaseColor: null,
    });

    playCard(wildDraw4, 0);

    gameState.currentColor = 'blue';
    handlePlayerChallenge(true);

    expect(gameState.players[0].hand).toHaveLength(5);
    expect(gameState.players[1].hand).toHaveLength(0);
    expect(gameState.wildDraw4BaseColor).toBeNull();
  });
});
