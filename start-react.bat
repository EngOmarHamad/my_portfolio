@echo off
title React + Vite Starter

echo ===================================================
echo   Checking project environment and starting tools...
echo ===================================================
echo.

:: 1. Check for package.json to ensure correct directory
if not exist "package.json" (
    color 0C
    echo [CRITICAL ERROR] package.json not found!
    echo Please make sure this .bat file is placed in the project ROOT directory.
    echo.
    goto ERROR_EXIT
)

:: 2. Try to open the available code editor
echo [1/2] Searching for code editors...

where code-insiders >nul 2>nul
if %errorlevel% equ 0 (
    echo Found VS Code Insiders. Opening...
    start /b code-insiders .
    goto START_VITE
)

where code >nul 2>nul
if %errorlevel% equ 0 (
    echo Found VS Code. Opening...
    start /b code .
    goto START_VITE
)

:: If no editor is found in PATH
color 0E
echo [WARNING] 'code' or 'code-insiders' is not recognized as an internal or external command.
echo The script will proceed to run the development server without opening an editor.
echo.

:START_VITE
:: 3. Start Vite development server
echo [2/2] Starting Vite environment (npm run dev)...
echo ---------------------------------------------------
echo.

:: Run the dev command directly so the window stays open to show Node/Vite outputs
call npm run dev

:: If the server stops or npm encounters an error
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Something went wrong while running 'npm run dev'.
    echo Please verify that you have run 'npm install' first.
    goto ERROR_EXIT
)

goto END

:ERROR_EXIT
echo.
echo ===================================================
echo Script stopped due to the error mentioned above.
echo ===================================================
pause
exit

:END
pause
