@echo off
echo Updating PZBotV...

REM Stop the service
net stop PZBotV

REM Backup current version
mkdir backups\update-%date:~-4,4%%date:~-10,2%%date:~-7,2%
xcopy /E /I src backups\update-%date:~-4,4%%date:~-10,2%%date:~-7,2%

REM Pull latest changes
git pull

REM Install dependencies
npm install --production

REM Run migrations
node src/database.js migrate

REM Start the service
net start PZBotV

echo Update completed successfully!
