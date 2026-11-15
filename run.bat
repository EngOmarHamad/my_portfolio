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

@REM  :: 2. Try to open the available code editor
@REM  echo [1/2] Searching for code editors...

@REM  where code-insiders >nul 2>nul
@REM  if %errorlevel% equ 0 (
@REM      echo Found VS Code Insiders. Opening...
@REM      start /b code-insiders .
@REM      goto START_VITE
@REM  )

@REM  where code >nul 2>nul
@REM  if %errorlevel% equ 0 (
@REM      echo Found VS Code. Opening...
@REM      start /b code .
@REM      goto START_VITE
@REM  )

@REM  :: If no editor is found in PATH
@REM  color 0E
@REM  echo [WARNING] 'code' or 'code-insiders' is not recognized as an internal or external command.
@REM  echo The script will proceed to run the development server without opening an editor.
@REM  echo.

:START_VITE
:: 3. Start Vite development server
echo Starting Vite environment (npm run dev)...
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
