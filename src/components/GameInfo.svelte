<script lang="ts">
  import type { Color } from '../lib/types';
  import { COLOR_HEX } from '../lib/types';

  interface Props {
    direction: 1 | -1;
    currentColor: Color;
    currentPlayerName: string;
  }

  let { direction, currentColor, currentPlayerName }: Props = $props();

  let colorVar = $derived(() => {
    switch (currentColor) {
      case 'red': return 'var(--uno-red)';
      case 'blue': return 'var(--uno-blue)';
      case 'green': return 'var(--uno-green)';
      case 'yellow': return 'var(--uno-yellow)';
      default: return 'var(--uno-black)';
    }
  });

</script>

<div class="game-info">
  <div class="info-panel brutalist-panel">
    <div class="direction" class:reversed={direction === -1}>
      &#x27F3;
    </div>
    <div class="color-indicator" style="background: {colorVar()}"></div>
    <div class="current-player bangers-font">{currentPlayerName}'S TURN</div>
  </div>
</div>

<style>
  .game-info {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }

  .info-panel {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 10px 20px;
    background: var(--uno-white);
    transform: rotate(2deg);
  }

  .direction {
    font-size: 2.5rem;
    transition: transform 0.4s;
    line-height: 1;
    color: var(--uno-black);
    text-shadow: 2px 2px 0px var(--uno-yellow);
  }

  .direction.reversed {
    transform: scaleX(-1);
  }

  .color-indicator {
    width: 32px;
    height: 32px;
    border: var(--border-thick);
    box-shadow: 2px 2px 0px var(--uno-black);
  }

  .current-player {
    font-size: 1.5rem;
    letter-spacing: 1px;
    color: var(--uno-black);
  }
</style>

