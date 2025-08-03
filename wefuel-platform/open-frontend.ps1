Write-Host "Opening WeFuel Platform Frontend..." -ForegroundColor Green
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$htmlFile = Join-Path $scriptPath "index-standalone.html"

if (Test-Path $htmlFile) {
    Write-Host "Opening: $htmlFile" -ForegroundColor Yellow
    Start-Process $htmlFile
} else {
    Write-Host "Error: index-standalone.html not found!" -ForegroundColor Red
    Write-Host "Please ensure the file exists in the same directory as this script." -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 