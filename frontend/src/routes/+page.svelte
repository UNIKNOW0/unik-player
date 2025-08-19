<script>
  import Notification from '$lib/components/Notification.svelte';
  import { onMount } from 'svelte';
  import { copyPlayerStyle } from '$lib/playerButtons.js';
  import { getAllPlayers } from '$lib/getPlayers.js'
  import { ShowTrack } from '$lib/stores/stores.js';

  import obs1 from '$lib/images/obs1.png'
  import obs2 from '$lib/images/obs2.png'
  import obs3 from '$lib/images/obs3.png'


  let players = [];

  onMount(async () => {
    players = getAllPlayers()
    
  });
</script>

<Notification />

<div class="mainDiv">
    <div class="playersDiv">
    <h1 class="playerDivText">Выбери дизайн плеера</h1>
    <div class="playersDivDiv">
  
        {#if players.length === 0}
            <h3>Подожди</h3>
        {:else}
            <h1 class="notificationMusicOff">включи трек, чтобы плееры показались</h1>
            {#each players as { component, name }}
              
                <div class="playerDiv">
                    <div class="playerUpperDiv">
                        <h1 class="playerName">{name}</h1>
                        <svelte:component this={component} />
                    </div>

                    <div class="playerBottomDiv">
                        <!-- <div on:click={() => chooseFunc(name)} class="playerChoose">
                            <h2>Выбрать</h2>
                        </div> -->
                        <div on:click={() => copyPlayerStyle(name)} class="playerCopyURL">
                            <h2>Скопировать</h2>
                        </div>
                    </div>
                </div>
              
            {/each}
        {/if} 

    </div>
    </div>


    <div class="infoDiv">
    <h1 class="infoDivText">Как пользоваться??????????</h1>
        <div class="infoInfoDiv">
            <h2>Выбери плеер, который понравился</h2>
            <h2>Жми "Скопировать" под плеером</h2>
            <h2>В OBS протыкай в панели "Источники" нажми + (внизу панели)</h2>
            <img src="{obs1}" alt="">
            <h2>Выбери "Браузер"</h2>
            <img src="{obs2}" alt="">
            <h2>Вставь ссылку</h2>
            <img src="{obs3}" alt="">

        </div>
    </div>
    
</div>

<style lang="scss">

    .playerName{
        flex: 1;
    }

    .playerChoose{
        width:100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 0 0 0 1rem;

        transition: background-color 0.3s ease;

        &:hover{
        background-color: var(--special2);
        border-radius: 0 0 0 1rem;
        cursor: pointer;
    }

    }

    .playerCopyURL{
        width:100%;
        height: 100%;
        border: 0 solid var(--foreground);
        //border-left-width: 0.2rem;
        

        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 0 0 1rem 1rem;

        transition: background-color 0.3s ease;

        &:hover{
            border-radius: 0 0 1rem 1rem;
            background-color: var(--special2);
            cursor: pointer;
        
        }

        > h2{
            color: var(--foreground);
        }

    }

    .playerUpperDiv{
        

        width: 100%;
        min-height: 15rem;
        margin-top: 3rem;
        padding-bottom: 3rem;
        border-radius: 1rem;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        background-color: rgba(255, 255, 255, 0.1);

        display: flex;
        flex-direction: column;
        justify-content:flex-end;
        align-items: center;
    }

    
    .playerBottomDiv{
        width: calc(100%);
        height: 5rem;
        background-color: var(--special);

        
        border-radius: 0 0 1rem 1rem;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    
    }

    .playersDivDiv {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        }

    .mainDiv{
        display: flex;
        flex-direction: row;
    }
    
    .playersDiv{
        width: 55vw;
        height: 100%;
        margin: 10px;
        text-align: center;

    }

    .infoDiv{
        width: 40vw;
        height: 100%;
        margin: 10px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
    }

    .infoDivText,
    .playerDivText{
        border: 2px var(--special2) solid;
        height: 5rem;
        border-radius: 1rem; 
        padding: 10px;
        
        width: 97%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .playerDiv{
        padding-left: 12.5%;
        width: 75%;
    }

    .infoInfoDiv{
        padding-left: 10%;
        width: 80%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
    }

    .infoInfoDiv > img{
        width: 80%;
    }
</style>