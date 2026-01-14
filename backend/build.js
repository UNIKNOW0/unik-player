const { compile } = require('nexe');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('🔨 Начинаем сборку UnikPlayer...');

    const outputPath = path.join(__dirname, 'UnikPlayer.exe');
    const iconPath = path.join(__dirname, 'static', 'trayIcon.ico');

    // Проверяем наличие иконки
    if (!fs.existsSync(iconPath)) {
      throw new Error(`Иконка не найдена: ${iconPath}`);
    }

    // Проверяем наличие frontBuild
    const frontBuildPath = path.join(__dirname, '..', 'frontBuild');
    if (!fs.existsSync(frontBuildPath)) {
      throw new Error(`FrontBuild не найден: ${frontBuildPath}`);
    }

    console.log(`Иконка: ${iconPath}`);
    console.log(`FrontBuild: ${frontBuildPath}`);

    // Компилируем с nexe
    await compile({
      input: './index.js',
      output: outputPath,
      target: 'windows-x64-14.15.3',
      resources: ['../frontBuild/**/*'],
      ico: iconPath,
      rc: {
        CompanyName: "UNIKNOW",
        FileDescription: "The best video player ever!",
        ProductName: "UnikPlayer",
        FileVersion: "0.6.9.0",
        ProductVersion: "0.6.9.0",
        LegalCopyright: "Copyright (C) 2025 UNIKNOW"
      },
      loglevel: 'info'
    });

    console.log('✅ Nexe компиляция завершена');

    // Изменяем subsystem на Windows GUI (убирает консоль)
    console.log('🔧 Изменяем subsystem на GUI...');
    const { execSync } = require('child_process');

    try {
      // Используем editbin (из Visual Studio) или альтернативный метод
      // Пытаемся использовать внешний инструмент
      const peSubsystemPath = path.join(__dirname, 'node_modules', '.bin', 'pe-subsystem');

      // Используем простой PowerShell скрипт для изменения PE заголовка
      const psScript = `
        $bytes = [System.IO.File]::ReadAllBytes("${outputPath.replace(/\\/g, '\\\\')}")
        # PE signature offset at 0x3C
        $peOffset = [System.BitConverter]::ToInt32($bytes, 0x3C)
        # Subsystem field is at PE offset + 0x5C
        $subsystemOffset = $peOffset + 0x5C
        # Set to 2 (GUI) instead of 3 (Console)
        $bytes[$subsystemOffset] = 2
        [System.IO.File]::WriteAllBytes("${outputPath.replace(/\\/g, '\\\\')}", $bytes)
      `;

      execSync(`powershell -Command "${psScript.replace(/\n/g, ' ')}"`, { encoding: 'utf8' });
      console.log('✅ Subsystem изменен на GUI');
    } catch (err) {
      console.log('⚠️  Не удалось изменить subsystem:', err.message);
      console.log('Используйте UnikPlayer-NoConsole.vbs для запуска без консоли');
    }

    console.log(`🎉 UnikPlayer.exe готов! (${outputPath})`);
    console.log(`\nЗапуск:`);
    console.log(`  - Без консоли: .\\UnikPlayer.exe`);
    console.log(`  - Или используйте: .\\UnikPlayer-NoConsole.vbs`);

  } catch (e) {
    console.error('❌ Ошибка сборки:', e.message);
    console.error(e);
    process.exit(1);
  }
})();