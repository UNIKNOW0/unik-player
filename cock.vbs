Set objShell = CreateObject("Wscript.Shell")
objShell.Run "backend\node\node.exe backend/index.js", 0, True
