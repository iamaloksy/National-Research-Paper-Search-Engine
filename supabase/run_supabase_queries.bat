@echo off
setlocal

set "PROJECT_REF=%~1"
set "DB_PASSWORD=%~2"

if "%PROJECT_REF%"=="" set "PROJECT_REF=zkmmectdbfooeuwyfszi"

if "%DB_PASSWORD%"=="" (
  echo Usage: run_supabase_queries.bat [PROJECT_REF] [DB_PASSWORD]
  echo Example: run_supabase_queries.bat zkmmectdbfooeuwyfszi MyStrongPassword123
  exit /b 1
)

set "DB_PASSWORD_ENC=%DB_PASSWORD:@=%40%"
set "DB_PASSWORD_ENC=%DB_PASSWORD_ENC:#=%23%"
set "DB_PASSWORD_ENC=%DB_PASSWORD_ENC: =%20%"

set "DB_URL=postgresql://postgres:%DB_PASSWORD_ENC%@db.%PROJECT_REF%.supabase.co:5432/postgres"

echo Running migrations on project: %PROJECT_REF%
npx --yes supabase@latest db push --db-url "%DB_URL%" --include-all
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo Failed with exit code %EXIT_CODE%
  exit /b %EXIT_CODE%
)

echo Success: all migrations applied.
exit /b 0
