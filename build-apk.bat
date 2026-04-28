@echo off
REM SchoolBell Build Script
REM This script rebuilds the Next.js app and creates a new APK

setlocal enabledelayedexpansion

set NODE_PATH=C:\Users\LESLINE\nodejs
set ANDROID_HOME=C:\Users\LESLINE\AppData\Local\Android\Sdk
set PROJECT_ROOT=C:\Users\LESLINE\Desktop\SchoolBell

echo.
echo ========================================
echo   SchoolBell APK Build Script
echo ========================================
echo.

REM Check if .env.local exists
if not exist "%PROJECT_ROOT%\.env.local" (
    echo ERROR: .env.local not found!
    echo Please update .env.local with your backend credentials first
    pause
    exit /b 1
)

echo [1/5] Updating PATH...
set PATH=%NODE_PATH%;%PATH%
echo ✓ PATH updated

echo.
echo [2/5] Building Next.js...
cd /d "%PROJECT_ROOT%"
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Build complete

echo.
echo [3/5] Syncing to Android...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Sync failed!
    pause
    exit /b 1
)
echo ✓ Sync complete

echo.
echo [4/5] Building APK (this may take 5-10 minutes)...
cd /d "%PROJECT_ROOT%\android"
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo ERROR: APK build failed!
    pause
    exit /b 1
)
echo ✓ APK created

echo.
echo [5/5] Installing on device...
set ADB=%ANDROID_HOME%\platform-tools\adb.exe

REM Check if device connected
for /f "tokens=*" %%i in ('"%ADB%" devices ^| find /v "devices"') do set DEVICE_ID=%%i
if "!DEVICE_ID!"=="" (
    echo WARNING: No device connected. Skipping installation.
    echo To install manually, run:
    echo "%ADB%" install -r "%PROJECT_ROOT%\android\app\build\outputs\apk\debug\app-debug.apk"
) else (
    "%ADB%" install -r "%PROJECT_ROOT%\android\app\build\outputs\apk\debug\app-debug.apk"
    if errorlevel 1 (
        echo ERROR: Installation failed!
    ) else (
        echo ✓ Installation complete
    )
)

echo.
echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo APK Location:
echo %PROJECT_ROOT%\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Next steps:
echo - Test the app on your phone
echo - If deploying online, use GitHub Releases to host the APK
echo.
pause
