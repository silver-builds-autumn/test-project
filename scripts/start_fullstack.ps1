param(
    [string]$BackendHost = "0.0.0.0",
    [int]$BackendPort = 8000,
    [string]$FrontendHost = "0.0.0.0",
    [int]$FrontendPort = 5173,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$backendScript = Join-Path $PSScriptRoot "start_backend.ps1"
$frontendScript = Join-Path $PSScriptRoot "start_frontend.ps1"
$repoRoot = Split-Path -Parent $PSScriptRoot

$backendArgs = @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-File", $backendScript,
    "-Host", $BackendHost,
    "-Port", "$BackendPort"
)

$frontendArgs = @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-File", $frontendScript,
    "-Host", $FrontendHost,
    "-Port", "$FrontendPort"
)

if ($DryRun) {
    Write-Host "powershell $($backendArgs -join ' ')"
    Write-Host "powershell $($frontendArgs -join ' ')"
    exit 0
}

Start-Process powershell -ArgumentList $backendArgs -WorkingDirectory $repoRoot | Out-Null
Start-Sleep -Milliseconds 500
Start-Process powershell -ArgumentList $frontendArgs -WorkingDirectory $repoRoot | Out-Null

Write-Host "Backend started: http://localhost:$BackendPort" -ForegroundColor Cyan
Write-Host "Frontend started: http://localhost:$FrontendPort" -ForegroundColor Green
Write-Host "Frontend reads backend data first and falls back to local baseline on failure." -ForegroundColor Yellow