<script lang="ts">
  interface Props {
    playerName: string;
    onrespond: (challenge: boolean) => void;
  }

  let { playerName, onrespond }: Props = $props();
</script>

<div class="overlay">
  <div class="dialog">
    <h3>{playerName} played Wild Draw 4!</h3>
    <p>Do you think they're bluffing?</p>
    <div class="actions">
      <button class="btn challenge" onclick={() => onrespond(true)}>
        Challenge!
      </button>
      <button class="btn accept" onclick={() => onrespond(false)}>
        Accept (+4 cards)
      </button>
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

  .dialog {
    background: #2a2a4a;
    border-radius: 16px;
    padding: 24px 32px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    max-width: 400px;
  }

  h3 {
    color: #ff4444;
    margin: 0 0 8px;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 20px;
  }

  .actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .btn {
    padding: 10px 24px;
    border-radius: 8px;
    border: 2px solid #fff;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.15s;
    color: #fff;
  }

  .btn:hover {
    transform: scale(1.05);
  }

  .challenge {
    background: #ff4444;
  }

  .accept {
    background: #555;
  }
</style>
