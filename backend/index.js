//imports
const { SMTCMonitor } = require('@coooookies/windows-smtc-monitor');
const { startWebSocketServer, broadcastMediaData } = require('./ws.js');

startWebSocketServer()


let previousSession = [{
    sourceAppId: '308046B0AF4A39CB',
    media: {
      title: 'c̸̱͒̈́ͅh̷̖͇̆́e̴̦͔̰̿̀̿r̶̝͕̜͑̿n̷̨̻̺̆̄́ǫ̴͉̦̀b̷̠͙̆ũ̸̧̬̘̕r̶̜̾ͅk̴̨̛̘̳̑̊v̷̝͓͂Б̸̛̪л̴̛                                                                 ̞и̸̡̤̅̋з̸͖͓̌н̸̘̊̕е̵͂',
      artist: '✿ 111loggedin // xxenaa ♡',
      albumTitle: '',
      albumArtist: '',
      genres: [],
      albumTrackCount: 0,
      trackNumber: 0,
      thumbnail: 0
    },
    playback: { playbackStatus: 4, playbackType: 1 },
    timeline: { position: 0, duration: 1 },
    lastUpdatedTime: 1750251992065
  }]

  getBasicMediaFunction()

//console.log(SMTCMonitor.getCurrentMediaSession())


function getBasicMediaFunction(){ // беру только то, что будет показываться. на виджете

  //берем последнее активное медиа

  try{
 
    sessions = SMTCMonitor.getMediaSessions();
    
    let activeSession = sessions.filter(s => s.playback.playbackStatus == 4)
    activeSession = activeSession.filter(s => (s.timeline.duration !== 0))

    if(activeSession.length > 0){

        broadcastMediaData(activeSession[0])
        previousSession = activeSession

    } else {
      broadcastMediaData(null)
    }

    }catch(err) {
    console.log(err, "smtc посыпался")
    }
}


//мониторы -------------------------------------------------
const monitor = new SMTCMonitor();

monitor.on('session-media-changed', (appId, mediaProps) => {

    console.log(" session-media-changed")
    //console.dir(mediaProps, { depth: null, colors: true });
    getBasicMediaFunction()

});


//монитор проигрывания трека. тригерится, когда двигаешь полоску трека. 
//так же показывает длительность трека
monitor.on('session-timeline-changed', (appId, timeline) => {

  console.log(" session-timeline-changed")
  //console.dir(timeline, { depth: null, colors: true });

  //getBasicMediaFunction()

}); 


//монитор работы пауз. выдает коды работы медиа. 
// playbacktype   1-closed  2-opened  3-changing  
// playbackstatus 4-playing  5-paused
//нужен для сравнения старых и новых данных. иначе срет в терминал
monitor.on('session-playback-changed', (appId, playbackInfo) => {

  getBasicMediaFunction()
    
    
});


monitor.on('session-added', (appId, mediaInfo) => {

  console.log(" session-added")

})
