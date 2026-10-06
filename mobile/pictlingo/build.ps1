$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$sdk = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { Join-Path $env:USERPROFILE 'AppData\Local\Android\Sdk' }
if (-not (Test-Path "$sdk\platform-tools\adb.exe")) { throw 'Set ANDROID_HOME to the installed Android SDK.' }
if (-not $env:JAVA_HOME) {
    $localJdk = Get-ChildItem "$PSScriptRoot\..\..\work\android-toolchain" -Directory -Filter 'jdk-21*' -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($localJdk) { $env:JAVA_HOME = $localJdk.FullName }
}
if (-not $env:JAVA_HOME) { throw 'Set JAVA_HOME to JDK 21 or later.' }
$env:ANDROID_HOME = $sdk
& npm.cmd ci
if ($LASTEXITCODE) { throw 'npm ci failed' }
& npm.cmd run sync
if ($LASTEXITCODE) { throw 'Web bundle sync failed' }
& npm.cmd test
if ($LASTEXITCODE) { throw 'Offline/speech tests failed' }
Set-Content -LiteralPath android/local.properties -Value ('sdk.dir='+$sdk.Replace('\','/'))
& .\android\gradlew.bat -p android :app:assembleDebug :app:assembleDebugAndroidTest --console=plain
if ($LASTEXITCODE) { throw 'Android build failed' }
New-Item -ItemType Directory -Force downloads | Out-Null
Copy-Item -LiteralPath android/app/build/outputs/apk/debug/app-debug.apk -Destination downloads/pictlingo-offline.apk -Force
Get-FileHash downloads/pictlingo-offline.apk -Algorithm SHA256
Write-Host 'APK: mobile/pictlingo/downloads/pictlingo-offline.apk'
