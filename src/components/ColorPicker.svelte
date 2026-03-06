<script lang="ts">
  import type { Color } from '../lib/types';
  import { COLOR_HEX } from '../lib/types';

  interface Props {
    onpick: (color: Color) => void;
  }

  let { onpick }: Props = $props();

  const colors: Color[] = ['red', 'yellow', 'green', 'blue'];
  
  function getColorVar(color: string) {
    if (color === 'red') return 'var(--uno-red)';
    if (color === 'blue') return 'var(--uno-blue)';
    if (color === 'green') return 'var(--uno-green)';
    if (color === 'yellow') return 'var(--uno-yellow)';
    return 'var(--uno-black)';
  }
</script>

<div class="overlay">
  <div class="picker brutalist-panel">
    <h3 class="bangers-font">CHOOSE A COLOR</h3>
    <div class="colors">
      {#each colors as color}
        <button
          class="color-btn"
          style="background: {getColorVar(color)}"
          aria-label={color}
          onclick={() => onpick(color)}
        ></button>
      {/each}
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(17, 17, 17, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .picker {
    background: var(--uno-white);
    padding: 30px;
    text-align: center;
    transform: rotate(-2deg);
  }

  h3 {
    color: var(--uno-black);
    margin: 0 0 20px;
    font-size: 2rem;
  }

  .colors {
    display: flex;
    gap: 16px;
  }

  .color-btn {
    width: 60px;
    height: 60px;
    border: var(--border-thick);
    box-shadow: 4px 4px 0px var(--uno-black);
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
    padding: 0;
  }

  .color-btn:hover {
    transform: translate(-2px, -2px) rotate(5deg);
    box-shadow: 6px 6px 0px var(--uno-black);
  }

  .color-btn:active {
    transform: translate(2px, 2px) rotate(-2deg);
    box-shadow: 0px 0px 0px var(--uno-black);
  }
</style>

