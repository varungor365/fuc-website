@echo off
REM Determine which project to build based on the domain
if "%VERCEL_URL%"=="p.fashun.co.in" (
  echo Building Profile Service
  cd profile-service
  npm install
  npm run build
) else (
  echo Building Main Store
  cd fashun-store
  npm install
  npm run build
)