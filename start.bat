@echo off
chcp 65001
echo.
echo ===========================================
echo   WG-Tools 在线工具箱启动脚本
echo ===========================================
echo.

:: 检查是否安装了Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Java，请先安装Java 17+
    pause
    exit /b 1
)

:: 检查是否安装了Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js 16+
    pause
    exit /b 1
)

echo [信息] 正在启动WG-Tools...
echo.

:: 启动后端服务
echo [1/2] 启动后端服务...
cd backend
start "WG-Tools Backend" cmd /k "mvn spring-boot:run"
cd ..

:: 等待后端启动
echo [信息] 等待后端服务启动...
timeout /t 10 /nobreak >nul

:: 启动前端服务
echo [2/2] 启动前端服务...
cd frontend
start "WG-Tools Frontend" cmd /k "npm run dev"
cd ..

echo.
echo [完成] WG-Tools 启动完成！
echo.
echo 访问地址:
echo   前端: http://localhost:5173
echo   后端API: http://localhost:8080/api
echo.
echo 按任意键退出...
pause >nul
