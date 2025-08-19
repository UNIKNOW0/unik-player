<script>
      import { style, title, artist, thumbnail, ShowTrack} from '$lib/stores/stores.js'
      import { getPickedPlayer } from '$lib/getPlayers.js'
      import { onDestroy, onMount } from 'svelte';
      import { get } from 'svelte/store';
      
      let pickedPlayer = []

      onMount(async () => {

            const playerName = location.search.slice(1);

            pickedPlayer = getPickedPlayer(playerName)

            document.documentElement.style.setProperty('--background', 'transparent');
            return () => document.documentElement.style.removeProperty('--app-bg');


      })
      
</script>

{#each pickedPlayer as { component }}
      {#if pickedPlayer.length != 0 }
      <div class="player">
            <svelte:component this={component} />
      </div>
      {/if}
{/each}
<style>
      
.player{
      width: 100%;
      height: 80vh;

      display: flex;
      justify-content: center;
      align-items: center;

      
      background-color: #FFF !important;
      background-color: transparent !important;
}
</style>