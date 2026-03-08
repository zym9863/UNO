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
    wildDraw4BaseColor: null,
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
    wildDraw4BaseColor: null,
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

  const currentColorBeforePlay = gameState.currentColor;
  player.hand.splice(cardIdx, 1);
  gameState.discardPile.push(card);
  gameState.lastPlayedBy = playerIndex;

  if (card.type === 'wild' || card.type === 'wild_draw4') {
    if (card.type === 'wild_draw4') {
      gameState.wildDraw4BaseColor = currentColorBeforePlay;
      if (player.isAI) {
        const color = chooseColor(player.hand);
        gameState.currentColor = color;
        card.color = color;
        const nextIdx = getNextPlayerIndex(gameState.currentPlayerIndex, gameState.direction, gameState.players.length);
        const nextPlayer = gameState.players[nextIdx];
        if (nextPlayer.isAI) {
          handleAIChallenge(playerIndex, nextIdx);
        } else {
          gameState.phase = 'challenging';
        }
        if (checkWin(player)) return;
        return;
      } else {
        gameState.phase = 'choosing_color';
        return;
      }
    }
    // Regular wild
    gameState.wildDraw4BaseColor = null;
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

  gameState.wildDraw4BaseColor = null;
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
        advanceTurn(1);
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
    const nextIdx = getNextPlayerIndex(gameState.currentPlayerIndex, gameState.direction, gameState.players.length);
    const nextPlayer = gameState.players[nextIdx];
    if (nextPlayer.isAI) {
      handleAIChallenge(gameState.currentPlayerIndex, nextIdx);
    } else {
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
  const baseColor = gameState.wildDraw4BaseColor;

  if (doChallenge) {
    const wasLegal = isWildDraw4Legal(
      [...playedBy.hand],
      baseColor ?? gameState.currentColor,
    );
    if (wasLegal) {
      drawCards(gameState.players[challengerIdx], 6);
    } else {
      drawCards(playedBy, 4);
    }
  } else {
    drawCards(gameState.players[challengerIdx], 4);
  }

  gameState.wildDraw4BaseColor = null;
  if (checkWin(playedBy)) return;
  gameState.phase = 'playing';
  advanceTurn(1);
}

export function handlePlayerChallenge(doChallenge: boolean) {
  applyDraw4(doChallenge);
}

function applyDraw4(doChallenge: boolean) {
  const playedByIdx = gameState.lastPlayedBy!;
  const playedBy = gameState.players[playedByIdx];
  const challengerIdx = getNextPlayerIndex(playedByIdx, gameState.direction, gameState.players.length);
  const baseColor = gameState.wildDraw4BaseColor;

  if (doChallenge) {
    const wasLegal = isWildDraw4Legal(playedBy.hand, baseColor ?? gameState.currentColor);
    if (wasLegal) {
      drawCards(gameState.players[challengerIdx], 6);
    } else {
      drawCards(playedBy, 4);
    }
  } else {
    drawCards(gameState.players[challengerIdx], 4);
  }

  gameState.wildDraw4BaseColor = null;
  if (checkWin(playedBy)) return;
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

export function executeAITurn(): Promise<void> {
  return new Promise((resolve) => {
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const player = getCurrentPlayer();
      if (!player.isAI) { resolve(); return; }

      const card = chooseBestCard(player.hand, getTopCard(), gameState.currentColor);

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
