<script lang="ts">
  interface Props {
    onstart: (aiCount: number) => void;
  }

  let { onstart }: Props = $props();
  let aiCount = $state(3);
</script>

<div class="menu">
  <div class="hero">
    <h1 class="title">NO U!</h1>
    <div class="subtitle brutalist-panel">The most brutal card game</div>
  </div>

  <div class="settings brutalist-panel">
    <div class="label bangers-font">SELECT YOUR VICTIMS</div>
    <div class="ai-selector">
      {#each [1, 2, 3] as n}
        <button
          class="ai-btn"
          class:selected={aiCount === n}
          onclick={() => aiCount = n}
        >
          {n}
        </button>
      {/each}
    </div>
  </div>

  <button class="start-btn brutalist-button" onclick={() => onstart(aiCount)}>
    START SLAUGHTER
  </button>
</div>

<style>
  .menu {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
  }

  .hero {
    position: relative;
    text-align: center;
  }

  .title {
    font-size: 12vw;
    line-height: 0.8;
    color: var(--uno-red);
    text-shadow: 
      4px 4px 0px var(--uno-black),
      8px 8px 0px var(--uno-yellow),
      12px 12px 0px var(--uno-blue),
      16px 16px 0px var(--uno-green);
    margin: 0;
    transform: rotate(-5deg);
    z-index: 10;
    position: relative;
  }

  .subtitle {
    position: absolute;
    bottom: -1rem;
    right: -10vw;
    transform: rotate(5deg);
    background: var(--uno-blue);
    padding: 0.5rem 1rem;
    font-weight: 900;
    font-size: 1.5rem;
    z-index: 11;
  }

  .settings {
    text-align: center;
    background: var(--uno-yellow);
    transform: rotate(2deg);
  }

  .label {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .ai-selector {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
  }

  .ai-btn {
    width: 60px;
    height: 60px;
    border: var(--border-thick);
    background: var(--uno-white);
    color: var(--uno-black);
    font-family: 'Bangers', cursive;
    font-size: 2rem;
    cursor: pointer;
    box-shadow: 4px 4px 0px var(--uno-black);
    transition: all 0.1s;
  }

  .ai-btn.selected {
    background: var(--uno-red);
    color: var(--uno-white);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--uno-black);
  }

  .ai-btn:active {
    transform: translate(4px, 4px);
    box-shadow: 0px 0px 0px var(--uno-black);
  }

  .start-btn {
    font-size: 3rem;
    background: var(--uno-green);
    transform: rotate(-2deg);
    padding: 1rem 3rem;
  }
</style>

