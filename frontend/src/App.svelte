<script>
  import './app.css';
  import { onMount } from 'svelte';
  import { Progressbar } from "flowbite-svelte";
  
  let mediaData = null;
  let ws;
  let reconnectTimeout = 1000;
  let imageUrl = null;
  let imageSrc;
  
  function connect() {
    const url = 'ws://localhost:8080';
  
    ws = new WebSocket(url);
  
    ws.onopen = () => {
      console.log('[WS] Connected');
      reconnectTimeout = 1000;
    };
  
    ws.onmessage = (e) => {
      try {
        mediaData = JSON.parse(e.data);
        console.log(mediaData);
  
        if (mediaData != null) {
          if (mediaData.media.thumbnail != null) {
            const uint8 = new Uint8Array(mediaData.media.thumbnail.data);
            const blob = new Blob([uint8], { type: 'image/png' });
  
            imageSrc = URL.createObjectURL(blob);
          } else {
            console.log("нихера нет");
          }
        }
      } catch(err) {
        console.error('[WS] Parsing error', err);
      }
    };
  
    ws.onerror = (e) => {
      console.error('[WS] Error', e);
    };
  
    ws.onclose = () => {
      console.log('[WS] Closed, reconnect in', reconnectTimeout, 'ms');
      setTimeout(connect, reconnectTimeout);
      reconnectTimeout = Math.min(reconnectTimeout * 2, 30000);
    };
  }
  
  onMount(() => {
    connect();
  
    return () => {
      if (ws) ws.close();
    };
  });
</script>

<main>
  {#if mediaData === null}
    <p>Нет активной сессии или данных ещё нет</p>
  {:else}
    <h2>Now Playing:</h2>
    <p>Title: {mediaData.media.title}</p>
    <p>Artist: {mediaData.media.artist}</p>
    <img src={imageSrc} alt=" ноуп ">
    <Progressbar labelOutside="Animation" class="bg-yellow-300 rounded-2xl "/>
  {/if}
</main>
