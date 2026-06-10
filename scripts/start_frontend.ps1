param(
    [string]$Host = "0.0.0.0",
    [int]$Port = 5173
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$frontendDir = Join-Path $repoRoot "frontend"

Push-Location $frontendDir
try {
    Write-Host "[frontend] http://localhost:$Port" -ForegroundColor Green
    npm run dev -- --host $Host --port $Port
}
finally {
    Pop-Location
}