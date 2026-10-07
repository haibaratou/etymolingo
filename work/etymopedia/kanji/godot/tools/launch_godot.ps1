[CmdletBinding()]
param(
    [ValidateSet("play", "demo", "test")]
    [string]$Mode = "play"
)

# 漢字SURVIVOR（Godot版）の起動ランチャー。Grand Type Order と同じ探し方で Godot を見つける。
$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

function Find-GodotIn {
    param([string]$Folder)
    if (-not (Test-Path -LiteralPath $Folder -PathType Container)) { return $null }
    $found = @()
    $found += Get-ChildItem -LiteralPath $Folder -File -Filter "Godot*.exe" -ErrorAction SilentlyContinue
    foreach ($sub in @(Get-ChildItem -LiteralPath $Folder -Directory -ErrorAction SilentlyContinue)) {
        $found += Get-ChildItem -LiteralPath $sub.FullName -File -Filter "Godot*.exe" -ErrorAction SilentlyContinue
    }
    $choice = $found | Sort-Object @{ Expression = { if ($_.Name -match "_console") { 1 } else { 0 } } }, Name | Select-Object -First 1
    if ($null -ne $choice) { return $choice.FullName }
    return $null
}

function Resolve-Godot {
    # 1. 環境変数（KS_GODOT、なければ Grand Type Order 用の GTO_GODOT）
    foreach ($name in @("KS_GODOT", "GTO_GODOT")) {
        $v = [Environment]::GetEnvironmentVariable($name)
        if (-not [string]::IsNullOrWhiteSpace($v)) {
            $p = $v.Trim().Trim('"')
            if (Test-Path -LiteralPath $p -PathType Leaf) { return (Resolve-Path -LiteralPath $p).Path }
        }
    }
    # 2. プロジェクト内・親フォルダの tools/Godot.exe
    foreach ($c in @((Join-Path $ProjectRoot "tools\Godot.exe"), (Join-Path (Split-Path -Parent $ProjectRoot) "tools\Godot.exe"))) {
        if (Test-Path -LiteralPath $c -PathType Leaf) { return (Resolve-Path -LiteralPath $c).Path }
    }
    # 3. PATH
    foreach ($n in @("godot", "godot4")) {
        $cmd = Get-Command $n -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($null -ne $cmd) { return $cmd.Source }
    }
    # 4. 親階層の apl/Godot*
    $cur = Split-Path -Parent $ProjectRoot
    while (-not [string]::IsNullOrWhiteSpace($cur)) {
        $g = Find-GodotIn -Folder (Join-Path $cur "apl")
        if ($null -ne $g) { return $g }
        $parent = Split-Path -Parent $cur
        if ($parent -eq $cur) { break }
        $cur = $parent
    }
    # 5. 同じドライブの一段下のフォルダにある apl/Godot* や tools/Godot.exe（例: 別プロジェクトに同梱した Godot）
    $root = [System.IO.Path]::GetPathRoot($ProjectRoot)
    foreach ($d in @(Get-ChildItem -LiteralPath $root -Directory -ErrorAction SilentlyContinue)) {
        $g = Find-GodotIn -Folder (Join-Path $d.FullName "apl")
        if ($null -ne $g) { return $g }
        foreach ($sub in @(Get-ChildItem -LiteralPath $d.FullName -Directory -ErrorAction SilentlyContinue)) {
            $t = Join-Path $sub.FullName "tools\Godot.exe"
            if (Test-Path -LiteralPath $t -PathType Leaf) { return (Resolve-Path -LiteralPath $t).Path }
        }
    }
    throw "Godot 4 が見つかりません。KS_GODOT に Godot.exe の絶対パスを設定するか、tools/Godot.exe、PATH、親階層の apl/Godot* に置いてください。"
}

function Get-ConsoleGodot {
    param([string]$Godot)
    $stem = [System.IO.Path]::GetFileNameWithoutExtension($Godot)
    if ($stem -match "_console$") { return $Godot }
    $c = Join-Path (Split-Path -Parent $Godot) ($stem + "_console.exe")
    if (Test-Path -LiteralPath $c -PathType Leaf) { return $c }
    return $null
}

function Invoke-GodotTool {
    param([string]$Godot, [string[]]$Arguments)
    $console = Get-ConsoleGodot -Godot $Godot
    if ($null -ne $console) {
        & $console @Arguments | Out-Host
        return [int]$LASTEXITCODE
    }
    $line = ($Arguments | ForEach-Object { if ($_ -match '[\s"]') { '"' + $_.Replace('"', '\"') + '"' } else { $_ } }) -join ' '
    $p = Start-Process -FilePath $Godot -WorkingDirectory $ProjectRoot -ArgumentList $line -Wait -PassThru -WindowStyle Hidden
    return $p.ExitCode
}

function Import-Project {
    param([string]$Godot)
    Write-Host "素材を取り込んでいます（初回は少し時間がかかります）..."
    $code = Invoke-GodotTool -Godot $Godot -Arguments @("--headless", "--editor", "--import", "--quit", "--path", $ProjectRoot)
    if ($code -ne 0) { throw "Godot の取り込みに失敗しました (exit $code)。" }
}

try {
    $godot = Resolve-Godot
    Write-Host "Godot: $godot"
    Write-Host "Project: $ProjectRoot"
    switch ($Mode) {
        "play" {
            Import-Project -Godot $godot
            Start-Process -FilePath $godot -WorkingDirectory $ProjectRoot -ArgumentList @("--path", "`"$ProjectRoot`"") | Out-Null
        }
        "demo" {
            Import-Project -Godot $godot
            Start-Process -FilePath $godot -WorkingDirectory $ProjectRoot -ArgumentList @("--path", "`"$ProjectRoot`"", "--", "--watch") | Out-Null
        }
        "test" {
            Import-Project -Godot $godot
            Write-Host "`n== 自動戦闘で4分ぶん回す（画面なし・高速） =="
            $code = Invoke-GodotTool -Godot $godot -Arguments @("--headless", "--fixed-fps", "30", "--path", $ProjectRoot, "--", "--auto", "--quit=240", "--nosave")
            exit $code
        }
    }
}
catch {
    Write-Error $_
    exit 1
}
