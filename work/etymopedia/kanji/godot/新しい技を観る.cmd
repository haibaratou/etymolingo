@echo off
chcp 65001 >nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\launch_godot.ps1" -Mode showcase
if errorlevel 1 pause
