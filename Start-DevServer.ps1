# Start-DevServer.ps1
# PowerShell script to run the asset sync and start the dev server
# This is designed to work in Windows PowerShell

Write-Host "🔄 Running asset sync script..." -ForegroundColor Cyan
try {
    node ./scripts/sync-assets.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Asset sync script failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "✅ Asset sync completed successfully" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error running asset sync script: $_" -ForegroundColor Red
    Write-Host "⚠️ Continuing startup with potentially missing assets" -ForegroundColor Yellow
}

Write-Host "`n🚀 Starting development server..." -ForegroundColor Cyan
try {
    node ./dev-server.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Dev server exited with code $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}
catch {
    Write-Host "❌ Error starting dev server: $_" -ForegroundColor Red
    exit 1
}
