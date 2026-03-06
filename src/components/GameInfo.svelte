<script lang="ts">
  import type { Color } from '../lib/types';
  import { COLOR_HEX } from '../lib/types';

  interface Props {
    direction: 1 | -1;
    currentColor: Color;
    currentPlayerName: string;
  }

  let { direction, currentColor, currentPlayerName }: Props = $props();
</script>

<div class="game-info">
  <div class="direction" class:reversed={direction === -1}>
    &#x27F3;
  </div>
  <div class="color-indicator" style="background: {COLOR_HEX[currentColor]}"></div>
  <div class="current-player">{currentPlayerName}'s turn</div>
</div>

<style>
  .game-info {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #fff;
    font-size: 0.9rem;
  }

  .direction {
    font-size: 2rem;
    transition: transform 0.4s;
  }

  .direction.reversed {
    transform: scaleX(-1);
  }

  .color-indicator {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #fff;
  }

  .current-player {
    font-weight: bold;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
</style>
