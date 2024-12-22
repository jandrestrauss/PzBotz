@echo off
echo Installing PZBotV...

REM Install dependencies
npm install --production

REM Create necessary directories
if not exist "logs" mkdir logs
if not exist "backups" mkdir backups

REM Install Windows Service
node src/deployment/install.js

echo Installation complete!
pause
