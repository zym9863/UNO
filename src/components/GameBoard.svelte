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
  let aiTurnTrigger = $derived(
    `${gameState.phase}:${gameState.currentPlayerIndex}:${gameState.discardPile.length}`
  );

  function getAIPositions(): Array<'right' | 'top' | 'left'> {
    if (aiPlayers.length === 1) return ['top'];
    if (aiPlayers.length === 2) return ['right', 'left'];
    return ['right', 'top', 'left'];
  }

  let aiPositions = $derived(getAIPositions());

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
    void aiTurnTrigger;
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
      <div class="ai-position {aiPositions[i]}">
        <AIHand
          cardCount={ai.hand.length}
          position={aiPositions[i]}
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
