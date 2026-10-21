@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0..\work\wildwordopia\production\start_history_server.ps1" -Open
if errorlevel 1 pause
