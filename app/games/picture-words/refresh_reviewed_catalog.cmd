@echo off
setlocal
rem Check that an interpreter runs; py.exe can exist with no Python installed.
py -3 -c "import sys; sys.exit(sys.version_info.major != 3)" >nul 2>nul
if not errorlevel 1 (
  py -3 "%~dp0refresh_reviewed_catalog.py" %*
  exit /b
)
python -c "import sys; sys.exit(sys.version_info.major != 3)" >nul 2>nul
if not errorlevel 1 (
  python "%~dp0refresh_reviewed_catalog.py" %*
  exit /b
)
python3 -c "import sys; sys.exit(sys.version_info.major != 3)" >nul 2>nul
if not errorlevel 1 (
  python3 "%~dp0refresh_reviewed_catalog.py" %*
  exit /b
)
set "review_python=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if exist "%review_python%" (
  "%review_python%" "%~dp0refresh_reviewed_catalog.py" %*
  exit /b
)
echo Python 3 was not found. Install Python 3 or run this command from a Python-enabled terminal. 1>&2
exit /b 1
