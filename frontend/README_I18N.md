# WG-Tools 国际化功能说明

## 功能概述

WG-Tools 现已支持中英文双语切换功能，能够根据用户地区自动检测语言，并提供手动切换选项。

## 主要特性

### 🌍 自动语言检测
- 根据浏览器语言或地区自动设置
- 中国地区用户默认显示中文
- 其他地区用户默认显示英文

### 🔄 手动语言切换
- 页面顶部导航栏提供语言切换按钮
- 支持中文（🇨🇳）和英文（🇺🇸）切换
- 语言选择会保存到本地存储

### 📱 响应式设计
- 桌面端和移动端都支持语言切换
- 移动端优化的界面布局

## 技术实现

### 使用的技术栈
- **Vue I18n**: Vue.js 的国际化插件
- **Vue 3 Composition API**: 现代化的 Vue 开发方式
- **Element Plus**: UI 组件库，支持国际化
- **TypeScript**: 类型安全的开发体验

### 文件结构
```
src/
├── i18n/
│   ├── index.ts              # 国际化配置入口
│   └── locales/
│       ├── zh.ts             # 中文语言包
│       └── en.ts             # 英文语言包
├── components/
│   └── LanguageSwitcher.vue  # 语言切换组件
└── types/
    └── vue-i18n.d.ts         # 类型声明文件
```

### 语言检测逻辑
1. 检查 localStorage 中是否有保存的语言设置
2. 如果没有，则根据浏览器语言自动检测
3. 包含 'zh' 或 'CN' 的语言设置为中文，其他设置为英文

### 语言包内容
- 导航菜单翻译
- 页面标题翻译
- 页脚信息翻译
- 通用文本翻译

## 使用方法

### 添加新的翻译文本
1. 在 `src/i18n/locales/zh.ts` 中添加中文文本
2. 在 `src/i18n/locales/en.ts` 中添加对应的英文文本
3. 在组件中使用 `t('key')` 函数调用

示例：
```typescript
// zh.ts
export default {
  menu: {
    newTool: '新工具'
  }
}

// en.ts
export default {
  menu: {
    newTool: 'New Tool'
  }
}

// 在组件中使用
<template>
  <span>{{ t('menu.newTool') }}</span>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
```

### 语言切换流程
1. 用户点击语言切换按钮
2. 更新 vue-i18n 的 locale 值
3. 保存选择到 localStorage
4. 刷新页面以确保所有组件更新

## 浏览器兼容性

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 注意事项

1. 语言切换后会自动刷新页面，确保所有组件都能正确显示新语言
2. Element Plus 组件的语言包会根据当前语言自动切换
3. 页面标题也会根据语言动态更新
4. 所有翻译文本都支持响应式更新

## 未来计划

- [ ] 支持更多语言（日语、韩语等）
- [ ] 页面内容的完整翻译
- [ ] 工具说明和帮助文档的国际化
- [ ] RTL（从右到左）语言支持
