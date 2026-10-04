@echo off
setlocal
where py >nul 2>nul
if errorlevel 1 (
  python "%~dp0refresh_reviewed_catalog.py" %*
) else (
  py -3 "%~dp0refresh_reviewed_catalog.py" %*
)
exit /b %errorlevel%
