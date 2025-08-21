# WG-Tools Backend

## 📖 项目简介

WG-Tools 后端服务，基于 Spring Boot 3 开发，为前端提供各种工具的API接口。

## 🛠️ 技术栈

- **Java 17**
- **Spring Boot 3.2.1**
- **Maven 3.x**
- **MySQL 8.0**
- **Redis 6.x**

## 🚀 快速开始

### 环境要求

- JDK 17+
- Maven 3.6+
- MySQL 8.0+
- Redis 6.0+ (可选)

### 数据库配置

1. 创建数据库：
```sql
CREATE DATABASE wg_tools DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 修改 `src/main/resources/application.yml` 中的数据库配置：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/wg_tools?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

### 启动项目

1. 安装依赖：
```bash
mvn clean install
```

2. 启动应用：
```bash
mvn spring-boot:run
```

3. 访问地址：
- 应用: http://localhost:8080/api
- 健康检查: http://localhost:8080/api/actuator/health

## 📁 项目结构

```
src/
├── main/
│   ├── java/com/wgtools/
│   │   ├── WgToolsApplication.java     # 启动类
│   │   ├── config/                     # 配置类
│   │   ├── controller/                 # 控制器
│   │   ├── service/                    # 服务层
│   │   ├── dto/                        # 数据传输对象
│   │   ├── entity/                     # 实体类
│   │   ├── utils/                      # 工具类
│   │   └── common/                     # 公共类
│   └── resources/
│       ├── application.yml             # 配置文件
│       └── static/                     # 静态资源
└── test/                               # 测试代码
```

## 🔧 API 接口

### 文本处理工具

- `POST /api/text/json/format` - JSON格式化
- `POST /api/text/json/compress` - JSON压缩
- `POST /api/text/xml/format` - XML格式化
- `POST /api/text/compare` - 文本对比
- `POST /api/text/encrypt` - 文本加密

### 编码转换工具

- `POST /api/encoding/base64/encode` - Base64编码
- `POST /api/encoding/base64/decode` - Base64解码
- `POST /api/encoding/url/encode` - URL编码
- `POST /api/encoding/url/decode` - URL解码
- `POST /api/encoding/unicode/encode` - Unicode编码
- `POST /api/encoding/unicode/decode` - Unicode解码
- `POST /api/encoding/html/encode` - HTML实体编码
- `POST /api/encoding/html/decode` - HTML实体解码

## 📝 开发说明

### 代码规范

- 使用 Lombok 简化代码
- 统一异常处理
- API 响应格式统一
- 日志记录规范

### 扩展开发

1. 添加新的工具服务：
   - 在 `service` 包下创建接口和实现类
   - 在 `controller` 包下创建对应的控制器
   - 添加相应的 DTO 类

2. 数据库操作：
   - 在 `entity` 包下创建实体类
   - 使用 JPA Repository 进行数据操作

## 🐛 常见问题

1. **启动失败**：检查JDK版本和数据库连接
2. **端口冲突**：修改配置文件中的端口号
3. **数据库连接失败**：检查数据库服务和配置

## 📞 技术支持

如有问题，请提交 Issue 或联系开发团队。
