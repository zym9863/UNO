<script lang="ts">
  interface Props {
    onstart: (aiCount: number) => void;
  }

  let { onstart }: Props = $props();

  let aiCount = $state(3);
</script>

<div class="menu">
  <h1 class="title">UNO</h1>

  <div class="settings">
    <label>
      AI Opponents
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
    </label>
  </div>

  <button class="start-btn" onclick={() => onstart(aiCount)}>
    Start Game
  </button>
</div>

<style>
  .menu {
    width: 100vw;
    height: 100vh;
    background: radial-gradient(ellipse at center, #1a5c2a 0%, #0d3318 60%, #091a0e 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    color: #fff;
    font-family: 'Arial Black', Arial, sans-serif;
  }

  .title {
    font-size: 6rem;
    color: #ff4444;
    text-shadow: 0 4px 16px rgba(255, 0, 0, 0.4), 0 0 60px rgba(255, 0, 0, 0.2);
    letter-spacing: 12px;
    margin: 0;
  }

  .settings {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-size: 1.1rem;
  }

  .ai-selector {
    display: flex;
    gap: 12px;
  }

  .ai-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #fff;
    background: transparent;
    color: #fff;
    font-size: 1.3rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ai-btn.selected {
    background: #ff4444;
    box-shadow: 0 0 16px rgba(255, 0, 0, 0.5);
  }

  .ai-btn:hover {
    transform: scale(1.1);
  }

  .start-btn {
    padding: 16px 48px;
    font-size: 1.4rem;
    font-weight: 900;
    font-family: 'Arial Black', Arial, sans-serif;
    background: linear-gradient(135deg, #ff4444, #cc0000);
    color: #fff;
    border: 3px solid #fff;
    border-radius: 50px;
    cursor: pointer;
    letter-spacing: 3px;
    transition: transform 0.2s;
    box-shadow: 0 4px 24px rgba(255, 0, 0, 0.4);
  }

  .start-btn:hover {
    transform: scale(1.05);
  }
</style>
