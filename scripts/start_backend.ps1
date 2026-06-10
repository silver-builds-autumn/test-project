param(
    [string]$Host = "0.0.0.0",
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $repoRoot "backend"

Push-Location $backendDir
try {
    Write-Host "[backend] http://localhost:$Port" -ForegroundColor Cyan
    python -m uvicorn app.main:app --reload --host $Host --port $Port
}
finally {
    Pop-Location
}