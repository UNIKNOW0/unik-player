<script>
  //necessary data for player
  import { title, artist, thumbnail, ShowTrack} from '$lib/stores/stores.js';
  import { marquee } from '$lib/marquee.js';

  //styles
  import { fly } from 'svelte/transition';
</script>

{#if $ShowTrack}
  <div class="mainDiv"
  		in:fly={{ x: -50, duration: 400, opacity: 0 }}
		 out:fly={{ x:  50, duration: 400, opacity: 0 }}>
    <div class="mainDivGlow"></div>
      <div class="textDiv" style="background-image: url('{$thumbnail}'">
          <div class="blurDiv"></div>
          <h2 use:marquee={{speed:70}} class="title">{$title}</h2>
          <h3 use:marquee={{speed:50}} class="artist">{$artist}</h3>

      </div>
  </div>
{/if}

<style lang="scss">
.blurDiv{
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  backdrop-filter: blur(5px); /* Уровень размытия */
  background-color: rgba(0,0,0,0.3); /* Затемнение */
}

.mainDiv {
    position: relative;
    display: flex;
    align-items: stretch;

    max-width: 100%;
    width: 10rem;
    height: 10rem;
}

.mainDivGlow{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 95%;
  height: 95%;
  
  box-shadow: 0 0 35px 5px var(--lightMuted);
}

.textDiv {
    display: flex;
    flex-direction: column;
    flex: 1;

    border-radius: 1rem;
    border: 0.2rem solid var(--lightMuted);

    background-size: cover;
    background-position: center;

    position: relative; 
    overflow: hidden;
}

.title { flex: 3;}
.artist { flex: 2;}

  .title, .artist {
    display: flex;
    align-items: center;
    justify-content: center;

    margin:0;

    line-height:1;
    color:var(--lightVibrant);
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;

    z-index: 2;
  }
</style>