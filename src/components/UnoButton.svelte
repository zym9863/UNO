<script lang="ts">
  interface Props {
    visible: boolean;
    onclick: () => void;
  }

  let { visible, onclick }: Props = $props();
</script>

{#if visible}
  <button class="uno-btn" onclick={onclick}>
    UNO!
  </button>
{/if}

<style>
  .uno-btn {
    background: linear-gradient(135deg, #ff4444, #cc0000);
    color: #fff;
    font-size: 1.5rem;
    font-weight: 900;
    font-family: 'Arial Black', Arial, sans-serif;
    padding: 12px 32px;
    border-radius: 50px;
    border: 3px solid #fff;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(255, 0, 0, 0.4);
    transition: transform 0.15s;
    letter-spacing: 2px;
    animation: pulse 1s infinite alternate;
  }

  .uno-btn:hover {
    transform: scale(1.1);
  }

  @keyframes pulse {
    from { box-shadow: 0 4px 16px rgba(255, 0, 0, 0.4); }
    to { box-shadow: 0 4px 24px rgba(255, 0, 0, 0.8); }
  }
</style>
