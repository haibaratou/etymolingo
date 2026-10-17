@echo off
setlocal

set "SRC=D:\etymolingo\work\etymopedia\_illust"
set "DST=D:\etymolingo\assets\word"

if not exist "%SRC%\" (
    echo [ERROR] Source folder not found:
    echo %SRC%
    pause
    exit /b 1
)

if not exist "%DST%\" (
    mkdir "%DST%"
)

echo Source      : %SRC%
echo Destination : %DST%
echo.
echo Copying PNG files in folder-name order...
echo Later folders take priority for duplicate file names.
echo Only files newer than the destination state at startup are eligible.
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$src = $env:SRC; $dst = $env:DST; " ^
  "$original = @{}; " ^
  "Get-ChildItem -LiteralPath $dst -File -Filter '*.png' -ErrorAction SilentlyContinue | ForEach-Object { $original[$_.Name.ToLowerInvariant()] = $_.LastWriteTimeUtc }; " ^
  "$files = Get-ChildItem -LiteralPath $src -Recurse -File -Filter '*.png' | Sort-Object @{Expression={$_.DirectoryName};Ascending=$true}, @{Expression={$_.Name};Ascending=$true}; " ^
  "$copied = 0; $skipped = 0; " ^
  "foreach ($f in $files) { " ^
  "  $dest = Join-Path $dst $f.Name; " ^
  "  $key = $f.Name.ToLowerInvariant(); " ^
  "  $eligible = (-not $original.ContainsKey($key)) -or ($f.LastWriteTimeUtc -gt $original[$key]); " ^
  "  if ($eligible) { " ^
  "    Copy-Item -LiteralPath $f.FullName -Destination $dest -Force; " ^
  "    Write-Host ('COPY : ' + $f.FullName); " ^
  "    $copied++; " ^
  "  } else { " ^
  "    $skipped++; " ^
  "  } " ^
  "} " ^
  "Write-Host ''; Write-Host ('Done. Copied=' + $copied + '  Skipped=' + $skipped);"

echo.
pause
endlocal
