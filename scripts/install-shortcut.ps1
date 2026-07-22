# Creates the ClypCompiler desktop launcher (and Start Menu entry).
# Run:  npm run install:desktop
#   or: powershell -ExecutionPolicy Bypass -File scripts\install-shortcut.ps1

$ErrorActionPreference = 'Stop'

$root    = Split-Path -Parent $PSScriptRoot
$launcher = Join-Path $root 'Launch ClypCompiler.bat'
$icon     = Join-Path $root 'build\clypcompiler.ico'

if (-not (Test-Path $launcher)) {
  throw "Launcher not found at $launcher"
}

# Build the icon on demand so the shortcut is never left without one.
if (-not (Test-Path $icon)) {
  Write-Host 'Generating application icon...'
  Push-Location $root
  try { & node 'scripts\make-icon.mjs' | Out-Null } finally { Pop-Location }
}

function New-AppShortcut {
  param([string]$Path)

  $dir = Split-Path -Parent $Path
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }

  $shell = New-Object -ComObject WScript.Shell
  $sc = $shell.CreateShortcut($Path)
  # cmd /c keeps the console window owned by the shortcut, so closing it stops
  # the local server cleanly.
  $sc.TargetPath       = "$env:ComSpec"
  $sc.Arguments        = "/c `"`"$launcher`"`""
  $sc.WorkingDirectory = $root
  $sc.Description      = 'ClypCompiler - compile clypped blocks into SCORM and HTML5 courses'
  $sc.WindowStyle      = 7   # start minimized; the browser is the real UI
  if (Test-Path $icon) { $sc.IconLocation = "$icon,0" }
  $sc.Save()

  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($shell) | Out-Null
}

$desktop   = [Environment]::GetFolderPath('Desktop')
$startMenu = Join-Path ([Environment]::GetFolderPath('ApplicationData')) 'Microsoft\Windows\Start Menu\Programs'

$desktopLink = Join-Path $desktop   'ClypCompiler.lnk'
$startLink   = Join-Path $startMenu 'ClypCompiler.lnk'

New-AppShortcut -Path $desktopLink
New-AppShortcut -Path $startLink

Write-Host ''
Write-Host '  ClypCompiler launcher installed.' -ForegroundColor Green
Write-Host "    Desktop:    $desktopLink"
Write-Host "    Start Menu: $startLink"
Write-Host ''
Write-Host '  Double-click the desktop icon to start ClypCompiler.'
Write-Host '  It opens in your browser; close the console window to quit.'
Write-Host ''
