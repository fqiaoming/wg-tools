import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'

// 获取浏览器语言或地区
function getBrowserLocale(): string {
  const navigator = window.navigator
  const lang = navigator.language || (navigator as any).userLanguage || 'zh-CN'
  
  // 根据地区判断，如果是中国地区默认中文，否则英文
  if (lang.includes('zh') || lang.includes('CN')) {
    return 'zh'
  }
  return 'en'
}

// 从localStorage获取保存的语言设置，如果没有则自动检测
function getInitialLocale(): string {
  const saved = localStorage.getItem('wg-tools-locale')
  if (saved && ['zh', 'en'].includes(saved)) {
    return saved
  }
  return getBrowserLocale()
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'zh',
  messages: {
    zh,
    en
  }
})

export default i18n
