@echo off
echo Starting Spring Boot Backend...
echo.

cd "Refashion_backend\StartUP_Pitch\SpringBoot_GrowLoop\growloop-backend"

echo Checking if Maven wrapper exists...
if exist "mvnw.cmd" (
    echo Found Maven wrapper, starting Spring Boot application...
    mvnw.cmd spring-boot:run
) else (
    echo Maven wrapper not found, trying with system Maven...
    mvn spring-boot:run
)

pause