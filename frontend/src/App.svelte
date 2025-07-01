<script>
  import './app.css';
  import { onMount } from 'svelte';
  import { Progressbar } from "flowbite-svelte";
  import { Vibrant } from "node-vibrant/browser";

  //variables
  import { style } from './stores'
  console.log($style)
  let mediaData = null;
  let ws;
  let reconnectTimeout = 1000;

  // переменные для плеера
  let thumbnail
  let title
  let artist
  
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

          title = mediaData.media.title
          artist = mediaData.media.artist

          if (mediaData.media.thumbnail != null) {
            const uint8 = new Uint8Array(mediaData.media.thumbnail.data);
            const blob = new Blob([uint8], { type: 'image/png' });
            thumbnail = URL.createObjectURL(blob);

            
            let v = new Vibrant(thumbnail);
            v.getPalette().then((palette) => console.log(palette));
              
          } else {
            thumbnail = null
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

<h1>{$style}</h1>

  {/if}
</main>

<style>
</style>
