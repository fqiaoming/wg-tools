package com.wgtools;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * WG-Tools 主启动类
 * 
 * 简化版后端服务，主要提供：
 * - 健康检查接口
 * - CORS跨域支持
 * - 为前端提供基础API框架
 * 
 * @author WG-Tools Team
 * @version 1.0.0
 */
@SpringBootApplication
public class WgToolsApplication {

    public static void main(String[] args) {
        SpringApplication.run(WgToolsApplication.class, args);
        System.out.println("=====================================");
        System.out.println("  WG-Tools 后端服务启动成功！");
        System.out.println("  访问地址: http://localhost:8080/api");
        System.out.println("  健康检查: http://localhost:8080/api/health/ping");
        System.out.println("  前端地址: http://localhost:5173");
        System.out.println("=====================================");
    }
}
