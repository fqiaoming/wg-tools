declare module 'vue-i18n' {
  export function createI18n(options: any): any
  export function useI18n(): {
    locale: any
    t: (key: string, ...args: any[]) => string
  }
}
