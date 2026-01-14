const { SMTCListener } = require('./funcs/SMTC.js');
const { makingAppDataDir } = require('./funcs/folder.js');
const { openSite } = require('./funcs/openLocalSite.js');
const { startFrontendServer } = require('./funcs/server.js');
const { systemTray } = require('./funcs/tray.js');
const net = require('net');
const fs = require('fs');
const path = require('path');

// Проверяем параметры запуска
const isAutostart = process.argv.includes('--autostart');

console.log('UnikPlayer запускается...');
if (isAutostart) {
  console.log('Режим автозапуска: браузер не будет открыт');
}

// Проверка на единственный экземпляр через lock-файл
const lockFile = path.join(process.env.TEMP || '/tmp', 'unikplayer.lock');

function checkSingleInstance() {
  try {
    // Пытаемся создать lock-файл
    if (fs.existsSync(lockFile)) {
      const pid = fs.readFileSync(lockFile, 'utf8');
      console.log(`UnikPlayer уже запущен (PID: ${pid})`);
      console.log('Завершение работы...');
      setTimeout(() => process.exit(0), 1000);
      return false;
    }

    // Создаем lock-файл с текущим PID
    fs.writeFileSync(lockFile, String(process.pid));

    // Удаляем lock-файл при выходе
    process.on('exit', () => {
      try {
        if (fs.existsSync(lockFile)) {
          fs.unlinkSync(lockFile);
        }
      } catch (e) {}
    });

    return true;
  } catch (e) {
    console.error('Ошибка проверки единственного экземпляра:', e.message);
    return true; // Продолжаем работу в случае ошибки
  }
}

// Проверяем, что это единственный экземпляр
if (!checkSingleInstance()) {
  return;
}

//НЕ РАБОТАЕТ makingAppDataDir()
SMTCListener()
console.log('SMTC слушатель запущен');

systemTray()
console.log('Системный трей запущен');

try {
  const frontendServer = startFrontendServer({ port: 27272 });
  console.log('Фронтенд сервер запущен на порту 27272');

  // Открываем браузер только если это НЕ автозапуск
  if (!isAutostart) {
    openSite()
    console.log('Сайт открыт в браузере');
  } else {
    console.log('Автозапуск: браузер не открыт. Используйте http://localhost:27272');
  }
} catch (e) {
  console.error('Не удалось поднять фронтенд:', e.message);
  console.error(e);
  process.exit(1);
}

// Предотвращаем завершение процесса
process.on('uncaughtException', (err) => {
  console.error('Необработанная ошибка:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Необработанное отклонение промиса:', err);
});

console.log('UnikPlayer работает. Нажмите Ctrl+C для выхода.');

// Скрываем консольное окно только после успешного запуска (через 2 секунды)
setTimeout(() => {
  try {
    // Используем Windows API напрямую через child_process для скрытия консоли
    const { exec } = require('child_process');

    // Находим окно консоли текущего процесса и скрываем его
    const script = `
      Add-Type -Name Window -Namespace Console -MemberDefinition '
      [DllImport("Kernel32.dll")]
      public static extern IntPtr GetConsoleWindow();
      [DllImport("user32.dll")]
      public static extern bool ShowWindow(IntPtr hWnd, Int32 nCmdShow);
      ';
      $consolePtr = [Console.Window]::GetConsoleWindow();
      [Console.Window]::ShowWindow($consolePtr, 0);
    `;

    exec(`powershell -WindowStyle Hidden -Command "${script.replace(/\n/g, ' ')}"`, (err) => {
      if (!err) {
        console.log('Консоль скрыта через PowerShell');
      }
    });
  } catch (err) {
    // Консоль останется видимой, но приложение продолжит работу
  }
}, 2000);