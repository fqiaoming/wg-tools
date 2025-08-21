package com.wgtools.controller;

import com.wgtools.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查控制器
 * 
 * @author WG-Tools Team
 */
@RestController
@RequestMapping("/health")
public class HealthController {
    
    @GetMapping
    public ApiResponse<Map<String, Object>> health() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("service", "WG-Tools Backend");
        data.put("timestamp", LocalDateTime.now());
        data.put("version", "1.0.0");
        
        return ApiResponse.success("服务运行正常", data);
    }
    
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
