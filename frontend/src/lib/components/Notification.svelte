<script>
	import { fly } from 'svelte/transition';
  import { ShowNotification } from '$lib/stores/stores';
  import { onDestroy } from 'svelte';

  let text = "🐷 Скопировано 🐷"
  let visible = false;
  const timer = 3000;

  ShowNotification.subscribe(value => {
    if (value) {
      visible = true;
      setTimeout(() => {
        ShowNotification.set(false);
      }, timer);
    } else {
      visible = false
    }
  })
</script>

{#if visible === true}
  <div class="notificationDiv" in:fly={{ y: -200 }} out:fly={{ y: -300 }}>
    <div>
      <h1>{text}</h1>
    </div>
  </div>
{/if}

<style>

.notificationDiv{
  
  position: fixed;
  top: 10%; /* прижать к верху */
  left: 50%; /* сместить по горизонтали на 50% */
  transform: translateX(-50%); /* отцентровать по середине */
  width: 30rem;
  height: 10rem;

  z-index: 727; /* чтобы всегда сверху был */

  border: 0.2rem solid var(--special);
  border-radius: 1rem;

  background-color: var(--background);

  animation: borderPulse 3s infinite ease-in-out;
    
}

.notificationDiv > div{
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes borderPulse {
  0% {
    border-color: var(--special);
  }
  100% {
    border-color: var(--special2);
  }
}

</style>
