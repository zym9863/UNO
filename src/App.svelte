<script lang="ts">
  import { gameState, startGame, resetGame } from './lib/store.svelte';
  import Menu from './pages/Menu.svelte';
  import GameBoard from './components/GameBoard.svelte';
  import Result from './pages/Result.svelte';
  import './app.css';

  let lastAiCount = $state(3);

  function handleStart(aiCount: number) {
    lastAiCount = aiCount;
    startGame(aiCount);
  }

  function handleRestart() {
    startGame(lastAiCount);
  }

  function handleMenu() {
    resetGame();
  }
</script>

{#if gameState.phase === 'menu'}
  <Menu onstart={handleStart} />
{:else if gameState.phase === 'result'}
  <Result
    players={gameState.players}
    winnerId={gameState.winner ?? 0}
    onrestart={handleRestart}
    onmenu={handleMenu}
  />
{:else}
  <GameBoard />
{/if}
