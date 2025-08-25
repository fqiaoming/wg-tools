<template>
  <div class="about">
    <div class="tool-card">
      <div class="about-header">
        <el-icon :size="64" color="#409EFF">
          <Tools />
        </el-icon>
        <h1 class="page-title">关于 WG-Tools</h1>
        <p class="page-subtitle">为开发者提供便捷、高效的在线工具服务</p>
      </div>

      <div class="about-content">
<!--        <el-row :gutter="20">-->
<!--          <el-col :span="12">-->
<!--            <div class="feature-section">-->
<!--              <h3>🚀 核心特性</h3>-->
<!--              <ul class="feature-list">-->
<!--                <li><strong>文本处理:</strong> JSON/XML格式化、文本对比、加密解密</li>-->
<!--                <li><strong>编码转换:</strong> Base64、URL、Unicode、HTML实体编码</li>-->
<!--                <li><strong>开发辅助:</strong> 正则表达式测试、代码格式化、时间戳转换</li>-->
<!--                <li><strong>网络工具:</strong> HTTP请求测试、IP查询、Ping测试</li>-->
<!--                <li><strong>图像处理:</strong> 二维码生成、颜色选择器、图片转换</li>-->
<!--              </ul>-->
<!--            </div>-->
<!--          </el-col>-->
<!--          -->
<!--          <el-col :span="12">-->
<!--            <div class="tech-section">-->
<!--              <h3>💻 技术栈</h3>-->
<!--              <div class="tech-stack">-->
<!--                <div class="tech-category">-->
<!--                  <h4>前端技术</h4>-->
<!--                  <ul>-->
<!--                    <li>Vue 3 + TypeScript</li>-->
<!--                    <li>Element Plus UI组件库</li>-->
<!--                    <li>Vite 构建工具</li>-->
<!--                    <li>Pinia 状态管理</li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--                <div class="tech-category">-->
<!--                  <h4>后端技术</h4>-->
<!--                  <ul>-->
<!--                    <li>Java 17 + Spring Boot 3</li>-->
<!--                    <li>Maven 项目管理</li>-->
<!--                    <li>MySQL 数据库</li>-->
<!--                    <li>Redis 缓存</li>-->
<!--                  </ul>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </el-col>-->
<!--        </el-row>-->

        <el-divider />

        <div class="info-section">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="info-card">
                <el-icon :size="32" color="#67C23A">
                  <Check />
                </el-icon>
                <h4>免费使用</h4>
                <p>所有工具完全免费，无需注册即可使用</p>
              </div>
            </el-col>
            
            <el-col :span="8">
              <div class="info-card">
                <el-icon :size="32" color="#E6A23C">
                  <Lock />
                </el-icon>
                <h4>隐私保护</h4>
                <p>数据处理在本地完成，不会上传到服务器</p>
              </div>
            </el-col>
            
            <el-col :span="8">
              <div class="info-card">
                <el-icon :size="32" color="#409EFF">
                  <Cpu />
                </el-icon>
                <h4>高效处理</h4>
                <p>优化算法设计，快速处理各种数据转换</p>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-divider />

        <div class="contact-section">
          <h3>📞 联系方式</h3>
          <p>如果您有任何问题或建议，欢迎联系我们：</p>
          
          <div class="contact-grid">
            <!-- 邮箱联系 -->
            <div class="contact-item">
              <el-link href="mailto:18734808698@163.com" type="primary" class="contact-link">
                <div class="contact-icon email-icon">
                  <el-icon><Message /></el-icon>
                </div>
                <div class="contact-text">
                  <div class="contact-title">邮箱联系</div>
                  <div class="contact-detail">18734808698@163.com</div>
                </div>
              </el-link>
            </div>

            <!-- GitHub -->
            <div class="contact-item">
              <el-link href="https://github.com/fqiaoming/wg-tools.git" type="primary" target="_blank" class="contact-link">
                <div class="contact-icon douyin-icon">
                  <img src="@/assets/github.png"/>
                </div>
                <div class="contact-text">
                  <div class="contact-title">项目名:WG-Tools</div>
                  <div class="contact-detail">项目说明:开发者工具箱</div>
                </div>
              </el-link>
            </div>

            <!-- CSDN -->
            <div class="contact-item">
              <el-link href="https://blog.csdn.net/qq_42055933" type="primary" target="_blank" class="contact-link">
                <div class="contact-icon douyin-icon">
                  <img src="@/assets/csdn.png"/>
                </div>
                <div class="contact-text">
                  <div class="contact-title">用户昵称: 默语佬</div>
                  <div class="contact-detail">用户ID: qq_42055933</div>
                </div>
              </el-link>
            </div>

            <!-- 程序员Mike抖音 -->
            <div class="contact-item">
              <el-link href="https://v.douyin.com/H5rUrZrpdd4/" type="primary" target="_blank" class="contact-link">
                <div class="contact-icon douyin-icon">
                  <img src="@/assets/dyIcon.png"/>
                </div>
                <div class="contact-text">
                  <div class="contact-title">程序员Mike</div>
                  <div class="contact-detail">抖音号: 60296914590</div>
                </div>
              </el-link>
            </div>

            <!-- web阿伟抖音 -->
            <div class="contact-item">
              <el-link href="https://v.douyin.com/BXjjyp5NdQ0/" type="primary" target="_blank" class="contact-link">
                <div class="contact-icon douyin-icon">
<!--                  <el-icon><VideoCamera /></el-icon>-->
                  <img src="@/assets/dyIcon.png"/>
                </div>
                <div class="contact-text">
                  <div class="contact-title">web阿伟</div>
                  <div class="contact-detail">抖音号: 65927791392</div>
                </div>
              </el-link>
            </div>

            <!-- 程序员阿亮抖音 -->
            <div class="contact-item">
              <el-link href="https://v.douyin.com/cFUq26lwn7I/" type="primary" target="_blank" class="contact-link">
                <div class="contact-icon douyin-icon">
                  <!--                  <el-icon><VideoCamera /></el-icon>-->
                  <img src="@/assets/dyIcon.png"/>
                </div>
                <div class="contact-text">
                  <div class="contact-title">程序员阿亮</div>
                  <div class="contact-detail">抖音号: 63945748932</div>
                </div>
              </el-link>
            </div>
          </div>
        </div>

        <div class="footer-info">
          <p class="version-info">当前版本: v1.0.0</p>
          <p class="copyright">&copy; 2024 WG-Tools. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Tools,
  Check,
  Lock,
  Cpu,
  Message,
  // Link,
  // VideoCamera
} from '@element-plus/icons-vue'
</script>

<style scoped>
.about {
  max-width: 1000px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  padding: 40px 0;
  //border-bottom: 1px solid #e4e7ed;
  margin-bottom: 30px;
}

.about-content {
  padding: 0 20px;
}

.feature-section,
.tech-section {
  margin-bottom: 30px;
}

.feature-section h3,
.tech-section h3,
.contact-section h3 {
  color: #303133;
  margin-bottom: 20px;
  font-size: 18px;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  line-height: 1.6;
}

.tech-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tech-category h4 {
  color: #409EFF;
  margin-bottom: 10px;
  font-size: 16px;
}

.tech-category ul {
  list-style: none;
  padding: 0;
}

.tech-category li {
  padding: 5px 0;
  color: #606266;
}

.info-section {
  margin: 30px 0;
}

.info-card {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  height: 100%;
}

.info-card h4 {
  margin: 15px 0 10px;
  color: #303133;
  font-size: 16px;
}

.info-card p {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.contact-section {
  text-align: center;
  margin: 30px 0;
}

.contact-section p {
  color: #606266;
  margin-bottom: 30px;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.contact-item {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.contact-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.05) 0%, rgba(64, 158, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.contact-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.2);
  border-color: #409EFF;
}

.contact-item:hover::before {
  opacity: 1;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none !important;
  color: inherit !important;
  position: relative;
  z-index: 2;
}

.contact-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-right:20px;
}

.email-icon {
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%);
}

.github-icon {
  background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
}

.douyin-icon {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%);
  animation: pulse 2s infinite;
}

.douyin-icon img{
  width:50px;
  height:50px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 71, 87, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0);
  }
}

.contact-item:hover .contact-icon {
  transform: scale(1.1) rotate(5deg);
}

.contact-text {
  flex: 1;
  text-align: left;
}

.contact-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.contact-detail {
  font-size: 14px;
  color: #606266;
  word-break: break-all;
}

.footer-info {
  text-align: center;
  padding: 30px 0;
  border-top: 1px solid #e4e7ed;
  margin-top: 30px;
}

.version-info,
.copyright {
  color: #909399;
  font-size: 12px;
  margin: 5px 0;
}

@media (max-width: 768px) {
  .about-content {
    padding: 0 10px;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    max-width: 100%;
  }
  
  .contact-item {
    padding: 15px;
  }
  
  .contact-icon {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  .contact-title {
    font-size: 15px;
  }
  
  .contact-detail {
    font-size: 13px;
  }
  
  .tech-stack {
    gap: 15px;
  }
}

.el-link.is-hover-underline:hover:after {
  display: none;
}
</style>
