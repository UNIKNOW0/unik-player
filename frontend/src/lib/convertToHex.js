import { Vibrant } from "node-vibrant/browser";
import { thumbnail } from './stores/stores.js'

export async function rgbToHex(palette){

document.documentElement.style.setProperty(
    '--darkMuted',
    `rgb(${palette.DarkMuted.rgb.join(',')})`);


document.documentElement.style.setProperty(
    '--vibrant',
    `rgb(${palette.Vibrant.rgb.join(',')})`);


document.documentElement.style.setProperty(
    '--lightVibrant',
    `rgb(${palette.LightVibrant.rgb.join(',')})`);


document.documentElement.style.setProperty(
    '--muted',
    `rgb(${palette.Muted.rgb.join(',')})`);


document.documentElement.style.setProperty(
    '--darkVibrant',
    `rgb(${palette.DarkVibrant.rgb.join(',')})`);


document.documentElement.style.setProperty(
    '--lightMuted',
    `rgb(${palette.LightMuted.rgb.join(',')})`);

}
    //I want to make variable for thumbnail, but it doesn't work(
	// $: if (typeof document !== 'undefined') {
    //     console.log(thumbnail)
	// 	document.documentElement.style.setProperty('--thumbnail', `url(${thumbnail})`);
	// }
