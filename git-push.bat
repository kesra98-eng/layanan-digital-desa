@echo off
echo ========================================
echo   GIT PUSH TO GITHUB
echo ========================================
echo.

set /p message="Enter commit message: "

echo.
echo Adding all files...
"C:\Program Files\Git\bin\git.exe" add .

echo Committing changes...
"C:\Program Files\Git\bin\git.exe" commit -m "%message%"

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push

echo.
echo ========================================
echo   DONE! Check your GitHub repo
echo ========================================
pause
