# WG-Tools - 在线开发者工具箱

## 📖 项目简介

WG-Tools 是一个为开发者提供的在线工具集合网站，包含常用的开发、调试、转换等工具，旨在提升开发效率。

## 🛠️ 技术栈

### 后端
- **Java 17**
- **Spring Boot 3.x**
- **Maven 3.x**
- **MySQL 8.0**
- **Redis 6.x**

### 前端
- **Vue 3.x**
- **Vite**
- **Element Plus**
- **TypeScript**
- **Axios**

## 📁 项目结构

```
wg-tools/
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── README.md
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── store/
│   │   └── utils/
│   ├── package.json
│   └── README.md
├── docs/                    # 项目文档
└── README.md
```

## 🚀 核心功能模块

### 文本处理工具
- JSON格式化与验证
- XML格式化与验证
- 文本对比工具
- 文本加密解密

### 编码转换工具
- Base64编码/解码
- URL编码/解码
- Unicode编码/解码
- HTML实体编码/解码

### 开发辅助工具
- 正则表达式测试器
- 代码格式化
- 时间戳转换器
- UUID生成器

### 网络工具
- HTTP请求测试
- IP地址查询
- Ping测试

### 图像处理工具
- 二维码生成器
- 二维码解析器
- 颜色选择器

## 🔧 快速开始

### 方式一：一键启动（推荐）

Windows用户可以直接运行启动脚本：
```bash
start.bat
```

### 方式二：手动启动

#### 环境要求
- Node.js 16+ （必需，前端运行）
- Java 8+ （可选，后端健康检查）
- Maven 3.6+ （可选，后端构建）

**注意**: 所有工具功能都在前端本地处理，无需数据库和后端服务即可使用！

#### 1. 启动前端（必需）
```bash
cd frontend
npm install
npm run dev
```

#### 2. 启动后端（可选）
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### 3. 访问应用
- **前端地址**: http://localhost:5173 （主要使用）
- 后端健康检查: http://localhost:8080/api/health/ping （可选）

**推荐**: 仅启动前端即可使用全部功能！

### 方式三：Docker部署

使用Docker Compose一键部署：
```bash
docker-compose up -d
```

包含完整的服务栈：
- MySQL 数据库
- Redis 缓存
- Spring Boot 后端
- Vue 前端
- Nginx 反向代理

## 📝 开发计划

- [x] 项目架构设计
- [ ] 后端API开发
- [ ] 前端界面开发
- [ ] 功能集成测试
- [ ] 部署上线

## 📞 联系方式

如有问题，请提交 Issue 或 Pull Request。
