// 为所有工具应用现代化样式的脚本
// 这个脚本定义了统一的CSS类名和样式规则

const modernStyles = `
/* 工具页面现代化样式 */
.tool-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-hero {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  border-radius: 16px;
  color: white;
}

.tool-hero-json { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); }
.tool-hero-base64 { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
.tool-hero-uuid { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); }
.tool-hero-password { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); }
.tool-hero-hash { background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%); }
.tool-hero-base { background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%); }
.tool-hero-color { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }

.tool-hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.tool-hero-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.tool-hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.tool-hero-description {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.6;
}

.tool-card-modern {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.tool-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.tool-card-icon {
  margin-right: 12px;
  font-size: 20px;
}

.tool-card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.tool-card-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

@media (max-width: 768px) {
  .tool-container {
    padding: 16px;
  }
  
  .tool-hero {
    margin-bottom: 24px;
    padding: 24px 16px;
  }
  
  .tool-hero-title {
    font-size: 28px;
  }
  
  .tool-hero-description {
    font-size: 16px;
  }
}
`;

export default modernStyles;
