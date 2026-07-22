@echo off
setlocal
title ClypCompiler
cd /d "%~dp0"

echo.
echo   ClypCompiler
echo   ============
echo.

where node >nul 2>nul
if errorlevel 1 goto nonode

if not exist "dist\index.html" (
  echo   First run - building the app. This takes a minute...
  echo.
  if not exist "node_modules" call npm install
  call npm run build
  if errorlevel 1 goto buildfail
)

node "scripts\serve.mjs"
goto :eof

:nonode
rem No Node.js: fall back to the self-contained single-file build, which runs
rem straight from disk. Browser storage is more limited there, so projects are
rem best kept as .clypcourse files.
if exist "ClypCompiler.html" (
  echo   Node.js was not found - opening the standalone offline build.
  echo   Tip: install Node.js from https://nodejs.org for autosave support.
  echo.
  start "" "ClypCompiler.html"
) else (
  echo   Node.js is required to build ClypCompiler.
  echo   Install it from https://nodejs.org and run this launcher again.
  echo.
  pause
)
goto :eof

:buildfail
echo.
echo   The build failed. Run "npm install" then "npm run build" to see details.
echo.
pause
