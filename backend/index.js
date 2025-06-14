//imports
const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const { SMTCMonitor } = require('@coooookies/windows-smtc-monitor');
const { title } = require('process');
const { exportMediaData } = require('./express.js')


let sessions = SMTCMonitor.getMediaSessions();

getBasicMediaFunction()


//console.log(SMTCMonitor.getCurrentMediaSession())


function getBasicMediaFunction(){ // беру только то, что будет показываться. на виджете

  sessions = SMTCMonitor.getMediaSessions();
  activeSession = sessions.filter(s => s.playback.playbackStatus == 4)
  if(activeSession.length > 0){
    console.log("===================НА ЭКСПОРТ===================")
    console.log(activeSession[0])
    console.log("^^^^^^^^^^^^^^^^^^ НА ЭКСПОРТ ^^^^^^^^^^^^^^^^^^")

    
    exportMediaData(app, activeSession[0])
  }

  
  
}


//мониторы -------------------------------------------------
const monitor = new SMTCMonitor();

let mediaProps_ = 0;
monitor.on('session-media-changed', (appId, mediaProps) => {

  if(mediaProps_ != mediaProps){
    console.log(mediaProps + " session-media-changed")
    //console.dir(mediaProps, { depth: null, colors: true });
  }

});


//монитор проигрывания трека. тригерится, когда двигаешь полоску трека. 
//так же показывает длительность трека
monitor.on('session-timeline-changed', (appId, timeline) => {

  //console.log(timeline + " session-timeline-changed")
  //console.dir(timeline, { depth: null, colors: true });

  getBasicMediaFunction()

});


//монитор работы пауз. выдает коды работы медиа. 
// playbacktype   1-closed  2-opened  3-changing  
// playbackstatus 4-playing  5-paused
let playBackInfo_ = 0 //нужен для сравнения старых и новых данных. иначе срет в терминал
monitor.on('session-playback-changed', (appId, playbackInfo) => {

    if(playBackInfo_ != playbackInfo){
      //console.log(playbackInfo?.playbackStatus + " session-playback-changed")
      //console.dir(appId, { depth: null, colors: true });
      playBackInfo_ = playbackInfo

      getBasicMediaFunction()
    }
      
    
});


monitor.on('session-added', (appId, mediaInfo) => {

  console.log(mediaInfo + " session-added")
  console.dir(mediaInfo, { depth: null, colors: true });

})
