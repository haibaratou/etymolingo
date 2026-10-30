$ErrorActionPreference = 'Stop'
$taskRoot = 'D:\Projects\etymolingo\work\etymopedia'
$taskOut = Join-Path $taskRoot '.workflow\image-mismatch-supplement-20261028'
$taskMerge = Get-Content -LiteralPath (Join-Path $taskOut 'latest-merge-path.txt') -Raw
$taskVerified = Get-Content -LiteralPath (Join-Path $taskMerge 'verified-for-cleanup.json') -Raw | ConvertFrom-Json
$taskPrimary = Join-Path $taskRoot 'prompt_rows_image_mismatch_supplement_20261028.csv'
if ((Get-FileHash -LiteralPath $taskPrimary -Algorithm SHA256).Hash.ToLowerInvariant() -ne $taskVerified.sha256) { throw 'Merged output changed; do not recycle input files.' }
$taskNames = @('prompt_rows_image_mismatch_followup_20261028.csv','prompt_rows_image_meaning_fixes_20261027.csv','prompt_rows_image_mismatch_supplement_20261028.csv.stage-tmp')
foreach ($taskItem in $taskVerified.trash) {
    $taskAbsolute = [System.IO.Path]::GetFullPath($taskItem.path)
    if ([System.IO.Path]::GetDirectoryName($taskAbsolute) -ne $taskRoot -or [System.IO.Path]::GetFileName($taskAbsolute) -notin $taskNames) { throw 'Unexpected cleanup target.' }
    if ((Get-FileHash -LiteralPath $taskAbsolute -Algorithm SHA256).Hash.ToLowerInvariant() -ne $taskItem.sha256) { throw 'Cleanup source changed.' }
    if ((Get-FileHash -LiteralPath $taskItem.backup -Algorithm SHA256).Hash.ToLowerInvariant() -ne $taskItem.sha256) { throw 'Internal recoverable backup does not match.' }
}
$taskDrive = [System.IO.DriveInfo]::new('D:\')
if ($taskDrive.DriveType -ne [System.IO.DriveType]::Fixed -or $taskDrive.DriveFormat -ne 'NTFS') { throw 'Recycle support has not been established for this drive.' }
$taskSid = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
$taskBin = Join-Path 'D:\$Recycle.Bin' $taskSid
if (-not (Test-Path -LiteralPath $taskBin)) { throw 'Current-user recycle directory is unavailable; preserve all sources.' }
Add-Type -AssemblyName Microsoft.VisualBasic.Core
$taskResults = @()
foreach ($taskItem in $taskVerified.trash) {
    $taskBefore = @(Get-ChildItem -LiteralPath $taskBin -Filter '$I*' -File -Force | ForEach-Object Name)
    try {
        [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($taskItem.path,[Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs,[Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin,[Microsoft.VisualBasic.FileIO.UICancelOption]::ThrowException)
        if (Test-Path -LiteralPath $taskItem.path) { throw 'Source still exists after recycle request.' }
        $taskMatch = $null
        foreach ($taskEntry in @(Get-ChildItem -LiteralPath $taskBin -Filter '$I*' -File -Force | Where-Object Name -notin $taskBefore)) {
            $taskBytes = [System.IO.File]::ReadAllBytes($taskEntry.FullName)
            $taskVersion = [BitConverter]::ToInt64($taskBytes,0)
            if ($taskVersion -eq 2) {
                $taskChars = [BitConverter]::ToInt32($taskBytes,24)
                $taskOriginal = [Text.Encoding]::Unicode.GetString($taskBytes,28,$taskChars*2).TrimEnd([char]0)
            } elseif ($taskVersion -eq 1) {
                $taskOriginal = [Text.Encoding]::Unicode.GetString($taskBytes,24,$taskBytes.Length-24).TrimEnd([char]0)
            } else { continue }
            if ($taskOriginal -eq $taskItem.path) {
                $taskDataPath = Join-Path $taskBin ('$R'+$taskEntry.Name.Substring(2))
                if ((Get-FileHash -LiteralPath $taskDataPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $taskItem.sha256) { throw 'Recycle contents hash differs.' }
                $taskMatch = [ordered]@{ original_path=$taskOriginal; recycle_metadata=$taskEntry.FullName; recycle_data=$taskDataPath; sha256=$taskItem.sha256; status='recycled_and_restore_bytes_verified' }
            }
        }
        if ($null -eq $taskMatch) { throw 'Recycle metadata could not be verified; do not repeat deletion.' }
        $taskResults += $taskMatch
    } catch {
        $taskResults += [ordered]@{ original_path=$taskItem.path; status='failed_or_uncertain'; source_exists=(Test-Path -LiteralPath $taskItem.path); error=$_.Exception.Message }
        break
    }
}
$taskResult = [ordered]@{ completed_at=[DateTime]::UtcNow.ToString('o'); method='Windows SendToRecycleBin; no permanent-delete fallback'; merged_output=$taskPrimary; merged_output_sha256=$taskVerified.sha256; results=$taskResults }
$taskResult | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $taskMerge 'recycle-result.json') -Encoding utf8
$taskResult | ConvertTo-Json -Depth 6
if (@($taskResults | Where-Object status -ne 'recycled_and_restore_bytes_verified').Count -gt 0 -or $taskResults.Count -ne 3) { throw 'Cleanup incomplete; inspect recycle-result.json. No retry was performed.' }
