<script>
  import { style, title, artist, thumbnail, ShowTrack} from '$lib/stores/stores.js'
</script>

  {#if $ShowTrack === true}
  
      <h1>В РАЗРАБОТКЕ. ПОКА ЧТО НЕЛЬЗЯ НИЧЕГО ДЕЛАТЬ!!</h1>
  <div class="separateDIV">
    <div class="separate">

      
      <h1>{$title} - title</h1>
      <h1>{$artist} - author</h1>
      <div class="divThumbnail">
        <h3>thumbnail</h3>
        <img src={$thumbnail} class="thumbnail" alt="нет картинки">
      </div>
    </div>
    {#if $thumbnail != null}
    <div class="separate">
      <h1>Цвета альбома</h1>
      <h3>For using this dynamic colors, you should use<br/> background-color: var(--colorName)</h3>
      <div class="colorGrid">
        <div class="VibrantBox">vibrant</div>
        <div class="DarkMutedBox">darkVibrant</div>
        <div class="MutedBox">muted</div>
        <div class="LightVibrantBox">lightVibrant</div>
        <div class="LightMutedBox">lightMuted</div>
        <div class="DarkVibrantBox">darkMuted</div>
      </div>
    </div>
  
  {/if}
  </div>  
  {:else}

  <h1>Включи музыку</h1>

  {/if}

<style>
*{
  text-align: center;
}

.separateDIV{
  display: flex;
  
}
.separateDIV > .separate{
  height: 100vh;
  margin: 10px;
  
}
.separate{
  display: flex;
  flex-direction: column;
  align-items: center; 

  
}

div{
  border-radius: 8px;
  font-weight: 600;
}

.divThumbnail{
  display: flex;
  flex-direction: column;
  align-items: center;
  aspect-ratio: 1/1;
  width: 250px;
  overflow: hidden;
  position: relative;
}

.thumbnail{

  width: 100%;
  height: 100%;
  object-fit: cover; 
}

.colorGrid{

  display: flex;              /* включаем флекс */
  flex-wrap: wrap;            /* если не влазят — на новую строку */
  justify-content: center;    /* центрируем по горизонтали */
  align-items: center;        /* центрируем по вертикали */
  gap: 0.5rem; 

  font-size: 1.6rem;

  border-width: 3px;
  border-style: dashed;
  border-color: #C1BDDB; 
  color: #FFFFFF;
  
}

.VibrantBox,
.MutedBox,
.LightVibrantBox,
.LightMutedBox,
.DarkVibrantBox,
.DarkMutedBox{
  margin: 10px;
  width: 150px;
  height: 150px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.VibrantBox{
  background-color: var(--vibrant);
}
.MutedBox{
  background-color: var(--muted);
}
.LightVibrantBox{
  background-color: var(--lightVibrant);
}
.LightMutedBox{
  background-color: var(--lightMuted);
}
.DarkVibrantBox{
  background-color: var(--darkMuted);
}
.DarkMutedBox{
  background-color: var(--darkVibrant);
}

</style>







