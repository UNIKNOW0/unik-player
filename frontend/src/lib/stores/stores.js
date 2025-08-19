import { writable } from "svelte/store";

export let style = writable("BackPicture")

//track meta data
export let mediaData = writable(null)
export let title     = writable(null)
export let artist    = writable(null)
export let thumbnail = writable(null)
//another meta
export let ShowTrack = writable(false)
export let ShowNotification = writable(false)