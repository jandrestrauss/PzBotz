@echo off
echo Restarting PZBotV...

REM Stop the service
net stop PZBotV

REM Wait for process to fully stop
timeout /t 5

REM Start the service
net start PZBotV

echo Service restarted successfully!
