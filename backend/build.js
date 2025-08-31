const { compile } = require('nexe');

(async () => {
  try {
    await compile({
      input: 'index.js',
      output: 'UnikPlayer.exe',
      //build: true, // нужно, чтобы .ico вшилось
      target: 'windows-x64-14.15.3',
      resources: ['../frontBuild/**/*'],
      ico: './static/trayIcon.ico',
      rc: {
      CompanyName: "BlackPhoenix Studio",
      FileDescription: "UnikPlayer — media player",
      ProductName: "UnikPlayer",
      // версии — строка с числами, разделёнными запятыми
      FILEVERSION: "1,0,2,0",
      PRODUCTVERSION: "1,0,2,0",
      LegalCopyright: "© 2025 BlackPhoenix"
    },
      loglevel: 'verbose'
    });
    console.log('OK — UnikPlayer.exe готов');
  } catch (e) {
    console.error('Ошибка сборки:', e);
    process.exit(1);
  }
})();
//пока что не работает. я не понимаю, как решить проблему с 
//Ошибка сборки: NexeError: vcbuild.bat nosign release x64 exited with code: 1