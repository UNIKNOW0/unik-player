<script>
  //necessary data for player
  import { title, artist, thumbnail, ShowTrack} from '$lib/stores/stores.js';
  import { marquee } from '$lib/marquee.js';

  //styles
  import { fly } from 'svelte/transition';
</script>

{#if $ShowTrack}
    <div class="mainDiv"
  		in:fly={{  x: -50, duration: 400, opacity: 0 }}
	   out:fly={{  x:  50, duration: 400, opacity: 0 }}>
        <div class="picDiv">
            <img class="pic" src={$thumbnail} alt="">
        </div>
        <div class="textDiv">

          <h2 use:marquee={{speed:70}} class="title">{$title}</h2>
          <h3 use:marquee={{speed:50}} class="artist">{$artist}</h3>

        </div>
    </div>
{/if}

<style lang="scss">
.title, .artist {
    display: flex;
    justify-content: center;
    align-items: center;

    margin:0;

    color:var(--lightVibrant);
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
}


.textDiv{
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    width: 20rem;
    height: 8rem;
    margin: 0 -1rem;

    border-radius: 0 0.8rem 0.8rem 0;
    border: 0.2rem solid var(--vibrant);
    border-left: 0;

    background-color: var(--darkMuted);
}

.mainDiv{
    display: flex;
    flex-direction: row;
}

.picDiv{
    aspect-ratio: 1/1;
    overflow: hidden;

    z-index: 2;
}
.pic{
    width: 8rem;

    object-fit: cover;
    aspect-ratio: 1/1;

    border-radius: 1rem;
    border: 0.2rem solid var(--lightMuted);
}

</style>