// ws.js
const WebSocket = require('ws');

let wss = null;         // WebSocket.Server instance
let currentMediaData = null; // Последние данные (если нужно, можем хранить здесь, но обычно храним в index.js)
 
/**
 * Запускает WS-сервер на указанном порту.
 * Если вызван повторно, просто возвращает уже запущенный сервер.
 * @param {number} port 
 */
function startWebSocketServer(port = 8080) {
  if (wss) {
    console.log('[ws] WebSocket сервер уже запущен');
    return wss;
  }
  wss = new WebSocket.Server({ port });
  console.log(`[ws] WebSocket сервер поднят на ws://localhost:${port}`);
  
  wss.on('connection', (ws, req) => {
    console.log('[ws] Новый клиент подключился');
    // При подключении отправляем сразу текущее значение, если есть
    if (currentMediaData !== null) {
      try {
        ws.send(JSON.stringify(currentMediaData));
      } catch (err) {
        console.error('[ws] Ошибка при отправке initial mediaData:', err);
      }
    }
    ws.on('error', (err) => {
      console.error('[ws] Ошибка в соединении с клиентом:', err);
    });
    ws.on('close', () => {
      console.log('[ws] Клиент отключился');
    });
  });

  return wss;
}

/**
 * Обновляет текущее mediaData и рассылает всем подключённым клиентам.
 * Если сервер ещё не запущен, ничего не делает или можно кинуть ошибку/лог.
 * @param {any} mediaData 
 */
function broadcastMediaData(mediaData) {
  if (!wss) {
    console.warn('[ws] WebSocket сервер не запущен — нечего рассылать');
    return;
  }
  currentMediaData = mediaData;
  let msg = JSON.stringify(mediaData);
  // Идём по клиентам
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(msg);
      } catch (err) {
        console.error('[ws] Ошибка при отправке mediaData клиенту:', err);
      }
    }
  });
  //console.log('[ws] Рассылочка mediaData клиентам:', mediaData);
}

module.exports = {
  startWebSocketServer,
  broadcastMediaData,
};
