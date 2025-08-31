
!define PRODUCT_NAME "UnikPlayer"
!define PRODUCT_VERSION "0.6.9.0"
!define PRODUCT_PUBLISHER "uniknow"
!define PRODUCT_WEBSITE "https://github.com/UNIKNOW0/unik-player"
!define APP_DIR "UnikPlayer"


Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile ".\UnikPlayer_Installer.exe"
Icon ".\static\icon.ico"
InstallDir "$APPDATA\${APP_DIR}"
RequestExecutionLevel user

VIProductVersion "${PRODUCT_VERSION}" ; <-- Версия продукта, 4 числа
VIAddVersionKey "ProductName" "${PRODUCT_NAME}"
VIAddVersionKey "ProductVersion" "${PRODUCT_VERSION}"
VIAddVersionKey "CompanyName" "${PRODUCT_PUBLISHER}"
VIAddVersionKey "LegalCopyright" "Copyright (C) 2025 ${PRODUCT_PUBLISHER}"
VIAddVersionKey "FileDescription" "UnikPlayer Installer"
VIAddVersionKey "FileVersion" "${PRODUCT_VERSION}"

Page directory
Page instfiles

Section "Main Application Files"
    ; Копируем нужные папки в поддиректорию backend
    SetOutPath "$INSTDIR\node_modules"
    File /r "..\backend\node_modules\@coooookies"
    File /r "..\backend\node_modules\systray"
    
    SetOutPath "$INSTDIR\static"
    File /r "..\backend\static\*"

    ; Копируем UnikPlayer.exe в корневую директорию установки
    SetOutPath "$INSTDIR"
    File "..\backend\UnikPlayer.exe"

    ; Старый frontBuild мы не копируем, так как он не указан в твоем запросе

    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "${PRODUCT_VERSION}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "${PRODUCT_PUBLISHER}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "URLInfoAbout" "${PRODUCT_WEBSITE}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
    WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "NoModify" 1
    WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "NoRepair" 1
    WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

Section "Create Shortcuts"
    CreateShortCut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\launch.bat"
    CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk" "$INSTDIR\launch.bat"
SectionEnd

Section "Uninstall" ; <--- Вот тут я изменил название секции
    Delete "$INSTDIR\*.*"
    RMDir /r "$INSTDIR"
    Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
    RMDir /r "$SMPROGRAMS\${PRODUCT_NAME}"
    DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
SectionEnd

!macro launch_app
    @ECHO OFF
    start "" "%~dp0\backend\node\node.exe" "%~dp0\backend\index.js"
!macroend

!system 'cmd /c @echo ${launch_app} > launch.bat'