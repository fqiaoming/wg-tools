<template>
  <div class="language-switcher">
    <el-dropdown trigger="click" @command="changeLanguage">
      <div class="language-btn">
        <el-icon><Operation /></el-icon>
        <span class="lang-text">{{ currentLangText }}</span>
        <el-icon class="arrow-icon"><ArrowDown /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            command="zh" 
            :class="{ active: locale === 'zh' }"
          >
            <span class="flag">🇨🇳</span>
            {{ t('common.chinese') }}
          </el-dropdown-item>
          <el-dropdown-item 
            command="en" 
            :class="{ active: locale === 'en' }"
          >
            <span class="flag">🇺🇸</span>
            {{ t('common.english') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Operation, ArrowDown } from '@element-plus/icons-vue'

const { locale, t } = useI18n()

const currentLangText = computed(() => {
  return locale.value === 'zh' ? '中文' : 'EN'
})

const changeLanguage = (lang: string) => {
  // 更新vue-i18n locale
  locale.value = lang
  // 保存到localStorage
  localStorage.setItem('wg-tools-locale', lang)
  
  // 延迟一点时间让locale更新，然后刷新页面确保所有组件都使用新的语言设置
  setTimeout(() => {
    window.location.reload()
  }, 100)
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'LanguageSwitcher'
})
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.language-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.lang-text {
  min-width: 24px;
  text-align: center;
}

.arrow-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

:deep(.el-dropdown-menu) {
  background: #ffffff !important;
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 8px 0;
  overflow: hidden;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  margin: 2px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #1f2937;
  font-weight: 500;
}

:deep(.el-dropdown-menu__item:hover) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #ffffff !important;
  transform: translateX(4px);
}

:deep(.el-dropdown-menu__item.active) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  font-weight: 600;
}

.flag {
  font-size: 16px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .language-btn {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .lang-text {
    min-width: 20px;
  }
}
</style>
