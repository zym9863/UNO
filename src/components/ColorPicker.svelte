<script lang="ts">
  import type { Color } from '../lib/types';
  import { COLOR_HEX } from '../lib/types';

  interface Props {
    onpick: (color: Color) => void;
  }

  let { onpick }: Props = $props();

  const colors: Color[] = ['red', 'yellow', 'green', 'blue'];
</script>

<div class="overlay">
  <div class="picker">
    <h3>Choose a color</h3>
    <div class="colors">
      {#each colors as color}
        <button
          class="color-btn"
          style="background: {COLOR_HEX[color]}"
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
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .picker {
    background: #2a2a4a;
    border-radius: 16px;
    padding: 24px 32px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  h3 {
    color: #fff;
    margin: 0 0 16px;
    font-size: 1.2rem;
  }

  .colors {
    display: flex;
    gap: 16px;
  }

  .color-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 4px solid #fff;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    padding: 0;
  }

  .color-btn:hover {
    transform: scale(1.15);
    box-shadow: 0 0 16px 4px rgba(255, 255, 255, 0.3);
  }
</style>
