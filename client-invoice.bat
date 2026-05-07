@echo off
title Client Invoice
cd /d "%~dp0"

:: Build the UI if dist/ doesn't exist yet
if not exist "dist\bundle.js" (
    echo Building Client Invoice UI...
    call "%USERPROFILE%\.bun\bin\bun.exe" run build
    echo.
)

:: Start the server and open browser
echo Starting Client Invoice...
start "" "http://localhost:3000"
"%USERPROFILE%\.bun\bin\bun.exe" run src/server.ts data/output/clientinvoice.sqlite
