@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\launch_godot.ps1" -Mode test
set "KS_EXIT=%ERRORLEVEL%"
pause
exit /b %KS_EXIT%
