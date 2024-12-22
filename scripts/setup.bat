@echo off
echo Setting up PZBotV...

REM Check Node.js installation
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed!
    exit /b 1
)

REM Create directories
mkdir logs 2>nul
mkdir backups 2>nul
mkdir data 2>nul

REM Install dependencies
npm install

REM Create environment file if not exists
if not exist .env (
    copy .env.example .env
    echo Created .env file - please configure it
)

REM Initialize database
mysql -u root -p < install/setup.sql

REM Install Windows service
node src/deployment/windowsService.js install

echo Setup completed!
pause
