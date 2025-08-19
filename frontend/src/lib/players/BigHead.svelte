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
		  out:fly={{ x:50, duration: 400, opacity:0 }}>
    <div class="picDiv">
      <img class="pic" src={$thumbnail} alt="">
    </div>

    <div class="textDiv">
        <h2 use:marquee={{speed:70}} class="title">{$title}</h2>
        <h3 use:marquee={{speed:50}} class="artist">{$artist}</h3>
    </div>
  </div>
{/if}

<style>
  .mainDiv { 
    display:flex;
    align-items:center;
  }
  .picDiv { 
    width:9.5rem; 
    height:9.5rem; 

    flex:0 0 9.5rem;
    overflow:hidden; 
    border:0.2rem solid var(--lightMuted); 
    border-radius:1rem; 
  }
  .pic { 
    width:100%; 
    height:100%; 

    object-fit:cover; 
    display:block; }

  .textDiv {
    display:flex;
    flex-direction:column;
    justify-content:space-around;

    width:20rem;
    height:8rem;

    padding-left:0.5rem;
    background:var(--darkMuted);

    border-radius:0 0.8rem 0.8rem 0;
    border:0.2rem solid var(--vibrant);
    border-left:0;
  }

  .title, .artist {
    display: flex;
    justify-content: center;
    align-items: center;
    
    margin:0;
    line-height:1;

    color:var(--lightVibrant);

    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

</style>
