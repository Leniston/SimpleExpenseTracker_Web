@echo off
REM This batch file copies the 'backend' and 'public' folders
REM from the XAMPP htdocs directory to your GitHub repository directory.

REM Define source and destination directories
set "SOURCE_DIR=C:\xampp\htdocs\SimpleExpenseTracker_Web"
set "DEST_DIR=C:\Users\Rob\Documents\GitHub\SimpleExpenseTracker_Web"

echo Copying 'backend' folder...
xcopy "%SOURCE_DIR%\backend" "%DEST_DIR%\backend\" /E /I /Y > nul

echo Copying 'public' folder...
xcopy "%SOURCE_DIR%\public" "%DEST_DIR%\public\" /E /I /Y > nul

REM The 'pause' command is removed for silent execution.
REM If you want to see output or errors, run this batch file directly.

REM You can add a simple log file if you want to track execution silently:
echo %date% %time% - Copy operation complete. >> "%TEMP%\SimpleExpenseTracker_Copy.log"
