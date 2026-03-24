@echo off
echo Checking Git installation...
where git >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS: Git is installed!
    git --version
    echo.
    echo Current directory: %CD%
    echo.
    echo Ready to connect to GitHub repository!
) else (
    echo ERROR: Git is not in PATH
    echo Git might be installed at: C:\Program Files\Git
    echo Please restart PowerShell or add Git to PATH
)
pause
