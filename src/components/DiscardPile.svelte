<script lang="ts">
  import type { Card as CardType } from '../lib/types';
  import Card from './Card.svelte';

  interface Props {
    topCard: CardType;
  }

  let { topCard }: Props = $props();
</script>

<div class="discard-pile">
  <div class="label">Discard</div>
  <Card card={topCard} />
</div>

<style>
  .discard-pile {
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
</style>
