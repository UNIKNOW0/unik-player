import { style } from '$lib/stores/stores.js'
import { ShowNotification } from '$lib/stores/stores.js'

export async function chooseFunc(name){        
    console.log(name + " выбран")

    style.set(name)

}

export async function copyPlayerStyle(name) {
    ShowNotification.set(true)
        
    let url = location.href
    let copyUrl = url + 'player?' + name
    await navigator.clipboard.writeText(copyUrl)
    
    .then(() => {
        console.log('Скопировано!');
        
    })
    .catch(err => {
        console.error('Не удалось скопировать: ', err);
    });

}