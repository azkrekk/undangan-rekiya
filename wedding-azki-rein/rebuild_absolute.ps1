$origPath = Join-Path $PSScriptRoot "wedding-azki-rein/index.html"
$cssPath = Join-Path $PSScriptRoot "new_style.css"
$bodyPath = Join-Path $PSScriptRoot "new_body.html"

# Backup original file if not backed up yet
$backupPath = Join-Path $PSScriptRoot "wedding-azki-rein/index.html.bak"
if (-not (Test-Path $backupPath)) {
    Copy-Item $origPath $backupPath -Force
    Write-Host "Backup created at $backupPath"
}

# Read contents
$orig = [System.IO.File]::ReadAllText($origPath)
$css = [System.IO.File]::ReadAllText($cssPath)
$body = [System.IO.File]::ReadAllText($bodyPath)

# Stitching
$styleIndex = $orig.IndexOf("<style>")
if ($styleIndex -lt 0) {
    throw "Could not find <style> in original index.html"
}
$headStart = $orig.Substring(0, $styleIndex + 7)

$scriptIndex = $orig.IndexOf("<script>")
if ($scriptIndex -lt 0) {
    throw "Could not find <script> in original index.html"
}
$jsContent = $orig.Substring($scriptIndex + 8)

# Output stitched file
$newFile = $headStart + "`n" + $css + "`n</style>`n" + $body + "`n" + $jsContent

[System.IO.File]::WriteAllText($origPath, $newFile)
Write-Host "Successfully rebuilt wedding invitation!"
