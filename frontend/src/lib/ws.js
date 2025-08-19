
import { Vibrant } from "node-vibrant/browser";
import { rgbToHex } from './convertToHex';

import { style, title, artist, thumbnail, ShowTrack} from './stores/stores.js'
import { get } from 'svelte/store';

import bg from '$lib/images/background.gif';
import Underline from "lucide-svelte/icons/underline";

let mediaData = null;
let ws;
let reconnectTimeout = 1000;

export function connect() {
    const url = 'ws://localhost:62727';
  
    ws = new WebSocket(url);
  
    ws.onopen = () => {
      console.log('[WS] Connected');
      reconnectTimeout = 1000;
    };
  
    ws.onmessage = (e) => {
      try {

        mediaData = JSON.parse(e.data);
        console.log(mediaData);
        //console.log(mediaData.media.thumbnail, " картинка нахуй")
  
        if (mediaData != null) {

          if(get(title) != mediaData.media.title){
            title.set(mediaData.media.title)
          }
          if(get(artist) != mediaData.media.artist){
          artist.set(mediaData.media.artist)
          }

          if (mediaData.media.thumbnail !== undefined) {

            const uint8 = new Uint8Array(mediaData.media.thumbnail.data);
            const blob = new Blob([uint8], { type: 'image/png' });
            let thumb = URL.createObjectURL(blob)

            if(get(thumbnail) != thumb){
              thumbnail.set(thumb)
            }
            
            Vibrant.from(thumb)
             .getPalette()
             .then((palette) => 
             rgbToHex(palette) );
            
          } else {

            thumbnail.set(bg)
            
            Vibrant.from(bg)
             .getPalette()
             .then((palette) => 
             rgbToHex(palette) );
            
          }
            //show media after changing all the data
            
            ShowTrack.set(true)

        } else {
          ShowTrack.set(false)
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