<script lang="ts">
  interface Props {
    count: number;
    canDraw: boolean;
    ondraw: () => void;
  }

  let { count, canDraw, ondraw }: Props = $props();
</script>

<div class="draw-pile">
  <div class="label">Draw ({count})</div>
  <button
    class="draw-card"
    class:can-draw={canDraw}
    onclick={ondraw}
    disabled={!canDraw}
  >
    <div class="card-back">
      <span class="back-text">UNO</span>
    </div>
  </button>
</div>

<style>
  .draw-pile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .draw-card {
    width: 80px;
    height: 120px;
    border-radius: 10px;
    border: 3px solid #fff;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3), 4px 6px 0 #0d0d1a;
    cursor: default;
    padding: 0;
    transition: transform 0.2s;
  }

  .draw-card.can-draw {
    cursor: pointer;
    box-shadow: 0 0 12px 3px rgba(100, 200, 255, 0.5), 4px 6px 0 #0d0d1a;
  }

  .draw-card.can-draw:hover {
    transform: translateY(-4px);
  }

  .card-back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, #2d2d5e 0%, #1a1a2e 100%);
    border-radius: 7px;
  }

  .back-text {
    font-size: 1.1rem;
    font-weight: 900;
    font-family: 'Arial Black', Arial, sans-serif;
    color: #ff4444;
    letter-spacing: 2px;
    text-shadow: 0 0 8px rgba(255, 68, 68, 0.6);
  }
</style>
