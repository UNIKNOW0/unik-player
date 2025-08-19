<script>
  import { connect } from '$lib/ws.js';
  import { onMount } from 'svelte';

  import { page } from '$app/stores';

  let showHeader = false;
  
  onMount(() => {
    connect()
    
  })

  $: {
  showHeader = $page.url.pathname !== '/player';
  }

</script>

{#if showHeader}
  <header>
    <a href="/">Главная</a>
    <a href="/howToMake">Как сделать <br/> свой дизайн</a>
    <!-- <a href="/player">Picked player</a> -->
  </header>
{/if}

<slot />

<style>


:global(.marquee__inner),
:global(.marquee__content),
:global(.marquee__content--clone) {
    color: inherit;
    font-family: inherit;
    white-space: nowrap;
  }

a,
a:visited,
a::selection{
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  
  font-size: 1.5rem;
  font-weight: 600;

  color: var(--foreground);
  transition: background 0.35s;

  height: 80%;
  width: 12rem;
  background-color: var(--special);
  border-radius: 0 0 1rem 1rem;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
}
a:hover,
a:active,
a:focus {
  
  background-color: var(--special2);
  text-decoration: none;
  outline: none;
}
header{
  height: 15vh;
  margin: 0;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
}
  /* Применяем фон глобально или к обёртке */
  :global(html,body, main) {
    margin: 0;
    padding: 0;
    
    background-color: var(--background);
  }

  

  
  :global(h1,h2,h3,h4,h5,h6,p){
    color: var(--special);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  </style>