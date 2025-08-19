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
		  out:fly={{x:  50, duration: 400, opacity: 0 }}>
    <div class="mainDivGlow"></div>
    <!-- background here, becouse i use variable from svelte store. css can't reach scipts -->
    <div class="textDiv" style="background-image: url('{$thumbnail}');">

      <h2 use:marquee={{speed:70, optGap:69}} class="title">{$title}</h2>
      <h3 use:marquee={{speed:50, optGap:69}} class="artist">{$artist}</h3>

      <div class="blurDiv"></div>
    </div>
  </div>
{/if}

<style lang="scss">


.blurDiv{
  position: absolute;

  width: 100%;
  height: 100%;

  backdrop-filter: blur(5px);
  background-color: rgba(0,0,0,0.4);
}

.mainDiv {
  position: relative;
  display: flex;
  align-items: stretch;

  width: 18rem; max-width: 100%;
  height: 7rem;
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
    position: relative;

    display: flex;
    flex-direction: column;
    flex: 1;
    
    overflow: hidden;

    background-size: cover;
    background-position: center;
    border-radius: 1rem;
    border: 0.2rem solid var(--lightMuted);
    
}

.title  {  flex: 3;} 

.artist {  flex: 2;}

.title, .artist {

    display: flex;
    align-items: center;
    justify-content: center; 

    margin:0;

    line-height:1;
    font-size:2rem;
    color:var(--lightVibrant);
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;

    z-index: 2;
}
</style>