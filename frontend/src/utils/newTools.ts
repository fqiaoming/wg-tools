// 新增工具函数
export interface ToolResponse {
  result: string
  success: boolean
  error?: string
  processTime?: number
  extra?: any
}

// 密码生成工具
export const passwordTool = {
  generate: (length: number = 12, options: {
    uppercase?: boolean,
    lowercase?: boolean,
    numbers?: boolean,
    symbols?: boolean,
    excludeAmbiguous?: boolean
  } = {}): ToolResponse => {
    const startTime = Date.now()
    try {
      const {
        uppercase = true,
        lowercase = true,
        numbers = true,
        symbols = false,
        excludeAmbiguous = false
      } = options

      if (length < 4 || length > 128) {
        throw new Error('密码长度必须在4-128之间')
      }

      let chars = ''
      let charSets = []

      if (uppercase) {
        const upper = excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        chars += upper
        charSets.push(upper)
      }
      if (lowercase) {
        const lower = excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz'
        chars += lower
        charSets.push(lower)
      }
      if (numbers) {
        const nums = excludeAmbiguous ? '23456789' : '0123456789'
        chars += nums
        charSets.push(nums)
      }
      if (symbols) {
        const syms = excludeAmbiguous ? '!@#$%^&*-_=+' : '!@#$%^&*()_+-=[]{}|;:,.<>?'
        chars += syms
        charSets.push(syms)
      }

      if (!chars) {
        throw new Error('请至少选择一种字符类型')
      }

      let password = ''
      
      // 确保每种选中的字符类型至少有一个字符
      for (const set of charSets) {
        password += set[Math.floor(Math.random() * set.length)]
      }

      // 填充剩余长度
      for (let i = password.length; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)]
      }

      // 打乱密码
      password = password.split('').sort(() => Math.random() - 0.5).join('')

      // 计算强度
      let strength = 0
      if (uppercase) strength += 26
      if (lowercase) strength += 26
      if (numbers) strength += 10
      if (symbols) strength += excludeAmbiguous ? 12 : 22

      const entropy = Math.log2(Math.pow(strength, length))
      let strengthLevel = 'weak'
      if (entropy >= 60) strengthLevel = 'strong'
      else if (entropy >= 40) strengthLevel = 'medium'

      return {
        success: true,
        result: password,
        processTime: Date.now() - startTime,
        extra: {
          length,
          entropy: Math.round(entropy),
          strength: strengthLevel,
          charSets: {
            uppercase,
            lowercase,
            numbers,
            symbols
          }
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 哈希工具
export const hashTool = {
  // 简单哈希（不是加密级别的，仅用于演示）
  simpleHash: (input: string, algorithm: string = 'djb2'): ToolResponse => {
    const startTime = Date.now()
    try {
      let hash: string
      
      switch (algorithm) {
        case 'djb2':
          hash = djb2Hash(input)
          break
        case 'sdbm':
          hash = sdbmHash(input)
          break
        case 'loselose':
          hash = loseHash(input)
          break
        default:
          throw new Error('不支持的哈希算法')
      }

      return {
        success: true,
        result: hash,
        processTime: Date.now() - startTime,
        extra: {
          algorithm,
          inputLength: input.length,
          outputLength: hash.length
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 哈希算法实现
function djb2Hash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
  }
  return (hash >>> 0).toString(16)
}

function sdbmHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash
  }
  return (hash >>> 0).toString(16)
}

function loseHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i)
  }
  return (hash % 1013).toString(16)
}

// 文本统计工具
export const textStatsTool = {
  analyze: (text: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const chars = text.length
      const charsNoSpaces = text.replace(/\s/g, '').length
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      const lines = text.split('\n').length
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length
      
      // 字符频率统计
      const charFreq: { [key: string]: number } = {}
      for (const char of text) {
        charFreq[char] = (charFreq[char] || 0) + 1
      }
      
      // 最常见字符
      const sortedChars = Object.entries(charFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
      
      // 单词频率（简单分析）
      const wordFreq: { [key: string]: number } = {}
      const cleanWords = text.toLowerCase().match(/\b\w+\b/g) || []
      for (const word of cleanWords) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
      
      const sortedWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)

      const result = `字符数: ${chars}
不含空格字符数: ${charsNoSpaces}
单词数: ${words}
行数: ${lines}
段落数: ${paragraphs}

最常见字符:
${sortedChars.map(([char, count]) => 
  `"${char === '\n' ? '\\n' : char === '\t' ? '\\t' : char === ' ' ? 'space' : char}": ${count}次`
).join('\n')}

最常见单词:
${sortedWords.map(([word, count]) => `"${word}": ${count}次`).join('\n')}`

      return {
        success: true,
        result,
        processTime: Date.now() - startTime,
        extra: {
          chars,
          charsNoSpaces,
          words,
          lines,
          paragraphs,
          charFrequency: sortedChars,
          wordFrequency: sortedWords
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 单位转换工具
export const unitTool = {
  convert: (value: number, fromUnit: string, toUnit: string, category: string): ToolResponse => {
    const startTime = Date.now()
    try {
      let result: number
      
      switch (category) {
        case 'length':
          result = convertLength(value, fromUnit, toUnit)
          break
        case 'weight':
          result = convertWeight(value, fromUnit, toUnit)
          break
        case 'temperature':
          result = convertTemperature(value, fromUnit, toUnit)
          break
        case 'area':
          result = convertArea(value, fromUnit, toUnit)
          break
        case 'volume':
          result = convertVolume(value, fromUnit, toUnit)
          break
        default:
          throw new Error('不支持的转换类别')
      }

      return {
        success: true,
        result: result.toString(),
        processTime: Date.now() - startTime,
        extra: {
          input: value,
          fromUnit,
          toUnit,
          category,
          formula: getConversionFormula(fromUnit, toUnit, category)
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 单位转换实现
function convertLength(value: number, from: string, to: string): number {
  const meters: { [key: string]: number } = {
    mm: 0.001, cm: 0.01, m: 1, km: 1000,
    inch: 0.0254, ft: 0.3048, yard: 0.9144, mile: 1609.34
  }
  return (value * meters[from]) / meters[to]
}

function convertWeight(value: number, from: string, to: string): number {
  const grams: { [key: string]: number } = {
    mg: 0.001, g: 1, kg: 1000, ton: 1000000,
    oz: 28.3495, lb: 453.592
  }
  return (value * grams[from]) / grams[to]
}

function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value
  
  // 先转换为摄氏度
  let celsius: number
  switch (from) {
    case 'C': celsius = value; break
    case 'F': celsius = (value - 32) * 5/9; break
    case 'K': celsius = value - 273.15; break
    default: throw new Error('不支持的温度单位')
  }
  
  // 再从摄氏度转换为目标单位
  switch (to) {
    case 'C': return celsius
    case 'F': return celsius * 9/5 + 32
    case 'K': return celsius + 273.15
    default: throw new Error('不支持的温度单位')
  }
}

function convertArea(value: number, from: string, to: string): number {
  const sqMeters: { [key: string]: number } = {
    'sq mm': 0.000001, 'sq cm': 0.0001, 'sq m': 1, 'sq km': 1000000,
    'sq inch': 0.00064516, 'sq ft': 0.092903, 'sq yard': 0.836127,
    'acre': 4046.86, 'hectare': 10000
  }
  return (value * sqMeters[from]) / sqMeters[to]
}

function convertVolume(value: number, from: string, to: string): number {
  const liters: { [key: string]: number } = {
    ml: 0.001, l: 1, 'cu m': 1000,
    'fl oz': 0.0295735, cup: 0.236588, pint: 0.473176, 
    quart: 0.946353, gallon: 3.78541
  }
  return (value * liters[from]) / liters[to]
}

function getConversionFormula(from: string, to: string, category: string): string {
  // 简化的公式说明
  return `${from} → ${to} (${category})`
}

// 辅助函数
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
      default: h = 0; break
    }
    h /= 6
  }

  return {
    h: Math.round((h || 0) * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min

  const v = max
  const s = max === 0 ? 0 : diff / max

  let h = 0
  if (diff !== 0) {
    switch (max) {
      case r: h = ((g - b) / diff) % 6; break
      case g: h = (b - r) / diff + 2; break
      case b: h = (r - g) / diff + 4; break
    }
    h *= 60
    if (h < 0) h += 360
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  }
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getBrightness(r: number, g: number, b: number): number {
  return (r * 299 + g * 587 + b * 114) / 1000 / 255 * 100
}

// 图片Base64转换工具
export const imageBase64Tool = {
  imageToBase64: (file: File): Promise<ToolResponse> => {
    const startTime = Date.now()
    return new Promise((resolve) => {
      try {
        if (!file.type.startsWith('image/')) {
          resolve({
            success: false,
            result: '',
            error: '请选择图片文件',
            processTime: Date.now() - startTime
          })
          return
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB限制
          resolve({
            success: false,
            result: '',
            error: '图片大小不能超过5MB',
            processTime: Date.now() - startTime
          })
          return
        }

        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          resolve({
            success: true,
            result: base64,
            processTime: Date.now() - startTime,
            extra: {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              base64Length: base64.length
            }
          })
        }
        reader.onerror = () => {
          resolve({
            success: false,
            result: '',
            error: '读取文件失败',
            processTime: Date.now() - startTime
          })
        }
        reader.readAsDataURL(file)
      } catch (error: any) {
        resolve({
          success: false,
          result: '',
          error: error.message,
          processTime: Date.now() - startTime
        })
      }
    })
  },

  base64ToImage: (base64: string, filename: string = 'image'): ToolResponse => {
    const startTime = Date.now()
    try {
      if (!base64.trim()) {
        throw new Error('请输入Base64编码')
      }

      // 验证Base64格式
      if (!base64.startsWith('data:image/')) {
        throw new Error('请输入有效的图片Base64编码（应以data:image/开头）')
      }

      // 创建下载链接
      const link = document.createElement('a')
      link.href = base64
      
      // 从Base64中提取文件扩展名
      const mimeMatch = base64.match(/data:image\/([^;]+)/)
      const extension = mimeMatch ? mimeMatch[1] : 'png'
      
      link.download = `${filename}.${extension}`
      
      return {
        success: true,
        result: `图片已准备下载: ${filename}.${extension}`,
        processTime: Date.now() - startTime,
        extra: {
          filename: `${filename}.${extension}`,
          downloadLink: link,
          mimeType: `image/${extension}`
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 二维码生成工具
export const qrTool = {
  generate: (text: string, size: number = 200): ToolResponse => {
    const startTime = Date.now()
    try {
      if (!text.trim()) {
        throw new Error('请输入要生成二维码的内容')
      }

      if (text.length > 1000) {
        throw new Error('内容长度不能超过1000个字符')
      }

      // 使用在线API生成二维码图片
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=10`
      
      return {
        success: true,
        result: qrUrl, // 直接返回图片URL，这样组件就能显示二维码图片
        processTime: Date.now() - startTime,
        extra: {
          content: text,
          size,
          url: qrUrl,
          format: 'png',
          description: `二维码生成成功！内容: ${text}, 尺寸: ${size}x${size}px`
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 随机数据生成工具
export const randomDataTool = {
  generateName: (type: string = 'chinese', count: number = 1): ToolResponse => {
    const startTime = Date.now()
    try {
      if (count < 1 || count > 100) {
        throw new Error('生成数量必须在1-100之间')
      }

      const names = []
      for (let i = 0; i < count; i++) {
        if (type === 'chinese') {
          names.push(generateChineseName())
        } else {
          names.push(generateEnglishName())
        }
      }

      return {
        success: true,
        result: names.join('\n'),
        processTime: Date.now() - startTime,
        extra: {
          type,
          count,
          names
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  generateEmail: (count: number = 1): ToolResponse => {
    const startTime = Date.now()
    try {
      if (count < 1 || count > 100) {
        throw new Error('生成数量必须在1-100之间')
      }

      const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', '163.com', 'qq.com']
      const emails = []
      
      for (let i = 0; i < count; i++) {
        const username = Math.random().toString(36).substr(2, 8)
        const domain = domains[Math.floor(Math.random() * domains.length)]
        emails.push(`${username}@${domain}`)
      }

      return {
        success: true,
        result: emails.join('\n'),
        processTime: Date.now() - startTime,
        extra: {
          count,
          emails
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  generatePhone: (country: string = 'china', count: number = 1): ToolResponse => {
    const startTime = Date.now()
    try {
      if (count < 1 || count > 100) {
        throw new Error('生成数量必须在1-100之间')
      }

      const phones = []
      for (let i = 0; i < count; i++) {
        if (country === 'china') {
          // 中国手机号
          const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189']
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
          const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
          phones.push(`${prefix}${suffix}`)
        } else {
          // 美国手机号
          const area = Math.floor(Math.random() * 900) + 100
          const exchange = Math.floor(Math.random() * 900) + 100
          const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
          phones.push(`(${area}) ${exchange}-${number}`)
        }
      }

      return {
        success: true,
        result: phones.join('\n'),
        processTime: Date.now() - startTime,
        extra: {
          country,
          count,
          phones
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  generateAddress: (count: number = 1): ToolResponse => {
    const startTime = Date.now()
    try {
      if (count < 1 || count > 100) {
        throw new Error('生成数量必须在1-100之间')
      }

      const provinces = ['北京', '上海', '广东', '浙江', '江苏', '山东', '四川', '湖北', '湖南', '河南', '河北', '福建', '安徽', '江西', '辽宁', '黑龙江', '吉林', '山西', '陕西', '甘肃']
      const cities = ['市', '县', '区']
      const districts = ['中心区', '开发区', '高新区', '经济区', '新区', '老区', '工业区', '商业区']
      const streets = ['人民路', '中山路', '解放路', '建设路', '胜利路', '和平路', '文化路', '学府路', '创新大道', '科技街']
      
      const addresses = []
      for (let i = 0; i < count; i++) {
        const province = provinces[Math.floor(Math.random() * provinces.length)]
        const city = cities[Math.floor(Math.random() * cities.length)]
        const district = districts[Math.floor(Math.random() * districts.length)]
        const street = streets[Math.floor(Math.random() * streets.length)]
        const number = Math.floor(Math.random() * 999) + 1
        addresses.push(`${province}省${province}${city}${district}${street}${number}号`)
      }

      return {
        success: true,
        result: addresses.join('\n'),
        processTime: Date.now() - startTime,
        extra: {
          count,
          addresses
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  generateDate: (count: number = 1, startDate?: Date, endDate?: Date, format: string = 'YYYY-MM-DD'): ToolResponse => {
    const startTime = Date.now()
    try {
      if (count < 1 || count > 100) {
        throw new Error('生成数量必须在1-100之间')
      }

      const start = startDate || new Date('2020-01-01')
      const end = endDate || new Date()
      
      const dates = []
      for (let i = 0; i < count; i++) {
        const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
        const randomDate = new Date(randomTime)
        
        let formattedDate = ''
        switch (format) {
          case 'YYYY-MM-DD':
            formattedDate = randomDate.toISOString().split('T')[0]
            break
          case 'YYYY/MM/DD':
            formattedDate = randomDate.toISOString().split('T')[0].replace(/-/g, '/')
            break
          case 'MM/DD/YYYY':
            const parts = randomDate.toISOString().split('T')[0].split('-')
            formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`
            break
          case 'DD-MM-YYYY':
            const parts2 = randomDate.toISOString().split('T')[0].split('-')
            formattedDate = `${parts2[2]}-${parts2[1]}-${parts2[0]}`
            break
          case 'YYYY-MM-DD HH:mm:ss':
            formattedDate = randomDate.toISOString().replace('T', ' ').replace('Z', '')
            break
          default:
            formattedDate = randomDate.toISOString().split('T')[0]
        }
        dates.push(formattedDate)
      }

      return {
        success: true,
        result: dates.join('\n'),
        processTime: Date.now() - startTime,
        extra: {
          count,
          format,
          dates
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  generateNumber: (count: number = 1, min: number = 1, max: number = 100, decimal: boolean = false, precision: number = 2): ToolResponse => {
    const startTime = Date.now()
    try {
      if (count < 1 || count > 100) {
        throw new Error('生成数量必须在1-100之间')
      }

      const numbers = []
      for (let i = 0; i < count; i++) {
        let randomNumber = Math.random() * (max - min) + min
        if (!decimal) {
          randomNumber = Math.floor(randomNumber)
        } else {
          randomNumber = parseFloat(randomNumber.toFixed(precision))
        }
        numbers.push(randomNumber.toString())
      }

      return {
        success: true,
        result: numbers.join('\n'),
        processTime: Date.now() - startTime,
        extra: {
          count,
          min,
          max,
          decimal,
          precision,
          numbers
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  generateText: (count: number = 1, length: number = 10): ToolResponse => {
    const startTime = Date.now()
    try {
      if (count < 1 || count > 100) {
        throw new Error('生成数量必须在1-100之间')
      }

      const words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'Ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat']
      const texts = []
      
      for (let i = 0; i < count; i++) {
        const textWords = []
        for (let j = 0; j < length; j++) {
          textWords.push(words[Math.floor(Math.random() * words.length)])
        }
        texts.push(textWords.join(' '))
      }

      return {
        success: true,
        result: texts.join('\n'),
        processTime: Date.now() - startTime,
        extra: {
          count,
          length,
          texts
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  generateUUID: (count: number = 1): ToolResponse => {
    const startTime = Date.now()
    try {
      if (count < 1 || count > 100) {
        throw new Error('生成数量必须在1-100之间')
      }

      const uuids = []
      for (let i = 0; i < count; i++) {
        // 简单的UUID v4生成
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0
          const v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
        uuids.push(uuid)
      }

      return {
        success: true,
        result: uuids.join('\n'),
        processTime: Date.now() - startTime,
        extra: {
          count,
          uuids
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  generateColor: (count: number = 1, format: string = 'hex'): ToolResponse => {
    const startTime = Date.now()
    try {
      if (count < 1 || count > 100) {
        throw new Error('生成数量必须在1-100之间')
      }

      const colors = []
      for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        
        let color = ''
        switch (format) {
          case 'hex':
            color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
            break
          case 'rgb':
            color = `rgb(${r}, ${g}, ${b})`
            break
          case 'hsl':
            const hsl = rgbToHsl(r, g, b)
            color = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
            break
          default:
            color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        }
        colors.push(color)
      }

      return {
        success: true,
        result: colors.join('\n'),
        processTime: Date.now() - startTime,
        extra: {
          count,
          format,
          colors
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  generateURL: (count: number = 1): ToolResponse => {
    const startTime = Date.now()
    try {
      if (count < 1 || count > 100) {
        throw new Error('生成数量必须在1-100之间')
      }

      const protocols = ['https', 'http']
      const domains = ['example.com', 'test.org', 'demo.net', 'sample.io', 'mock.co', 'fake.dev']
      const paths = ['', '/home', '/about', '/contact', '/products', '/services', '/blog', '/news', '/help', '/support']
      
      const urls = []
      for (let i = 0; i < count; i++) {
        const protocol = protocols[Math.floor(Math.random() * protocols.length)]
        const domain = domains[Math.floor(Math.random() * domains.length)]
        const path = paths[Math.floor(Math.random() * paths.length)]
        urls.push(`${protocol}://${domain}${path}`)
      }

      return {
        success: true,
        result: urls.join('\n'),
        processTime: Date.now() - startTime,
        extra: {
          count,
          urls
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 代码格式化工具
export const codeFormatterTool = {
  formatCSS: (css: string): ToolResponse => {
    const startTime = Date.now()
    try {
      if (!css.trim()) {
        throw new Error('请输入CSS代码')
      }

      // 简单的CSS格式化
      let formatted = css
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/;\s*/g, ';\n  ')
        .replace(/\s*}\s*/g, '\n}\n\n')
        .replace(/,\s*/g, ',\n')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim()

      return {
        success: true,
        result: formatted,
        processTime: Date.now() - startTime,
        extra: {
          originalLength: css.length,
          formattedLength: formatted.length,
          language: 'css'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  formatSQL: (sql: string): ToolResponse => {
    const startTime = Date.now()
    try {
      if (!sql.trim()) {
        throw new Error('请输入SQL代码')
      }

      // 简单的SQL格式化
      let formatted = sql
        .replace(/\bSELECT\b/gi, 'SELECT')
        .replace(/\bFROM\b/gi, '\nFROM')
        .replace(/\bWHERE\b/gi, '\nWHERE')
        .replace(/\bAND\b/gi, '\n  AND')
        .replace(/\bOR\b/gi, '\n  OR')
        .replace(/\bORDER BY\b/gi, '\nORDER BY')
        .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
        .replace(/\bHAVING\b/gi, '\nHAVING')
        .replace(/\bJOIN\b/gi, '\nJOIN')
        .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
        .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
        .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
        .replace(/\bUNION\b/gi, '\nUNION')
        .replace(/,/g, ',\n  ')
        .replace(/\n\s*\n/g, '\n')
        .trim()

      return {
        success: true,
        result: formatted,
        processTime: Date.now() - startTime,
        extra: {
          originalLength: sql.length,
          formattedLength: formatted.length,
          language: 'sql'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 文件对比工具
export const fileDiffTool = {
  compare: (file1Content: string, file2Content: string, fileName1: string = '文件1', fileName2: string = '文件2'): ToolResponse => {
    const startTime = Date.now()
    try {
      const lines1 = file1Content.split('\n')
      const lines2 = file2Content.split('\n')
      
      const maxLines = Math.max(lines1.length, lines2.length)
      const differences = []
      let addedLines = 0
      let deletedLines = 0
      let modifiedLines = 0

      for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] || ''
        const line2 = lines2[i] || ''
        
        if (line1 !== line2) {
          if (line1 && !line2) {
            differences.push({
              type: 'deleted',
              lineNumber: i + 1,
              content: line1,
              file: fileName1
            })
            deletedLines++
          } else if (!line1 && line2) {
            differences.push({
              type: 'added',
              lineNumber: i + 1,
              content: line2,
              file: fileName2
            })
            addedLines++
          } else {
            differences.push({
              type: 'modified',
              lineNumber: i + 1,
              oldContent: line1,
              newContent: line2,
              file1: fileName1,
              file2: fileName2
            })
            modifiedLines++
          }
        }
      }

      let result = `文件对比结果：\n\n`
      result += `${fileName1}: ${lines1.length} 行\n`
      result += `${fileName2}: ${lines2.length} 行\n\n`
      result += `差异统计：\n`
      result += `- 新增行: ${addedLines}\n`
      result += `- 删除行: ${deletedLines}\n`
      result += `- 修改行: ${modifiedLines}\n`
      result += `- 总差异: ${differences.length}\n\n`

      if (differences.length === 0) {
        result += '文件内容完全相同！'
      } else {
        result += '详细差异：\n'
        differences.forEach((diff, index) => {
          result += `\n${index + 1}. 第${diff.lineNumber}行 - ${diff.type === 'added' ? '新增' : diff.type === 'deleted' ? '删除' : '修改'}\n`
          if (diff.type === 'added') {
            result += `+ ${diff.content}\n`
          } else if (diff.type === 'deleted') {
            result += `- ${diff.content}\n`
          } else {
            result += `- ${diff.oldContent}\n`
            result += `+ ${diff.newContent}\n`
          }
        })
      }

      return {
        success: true,
        result,
        processTime: Date.now() - startTime,
        extra: {
          differences,
          addedLines,
          deletedLines,
          modifiedLines,
          totalLines1: lines1.length,
          totalLines2: lines2.length,
          similarity: ((maxLines - differences.length) / maxLines * 100).toFixed(2)
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 高级颜色选择器工具
export const advancedColorTool = {
  generatePalette: (baseColor: string, type: string = 'complementary'): ToolResponse => {
    const startTime = Date.now()
    try {
      const rgb = hexToRgb(baseColor)
      if (!rgb) {
        throw new Error('无效的颜色格式')
      }

      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const colors = []

      switch (type) {
        case 'complementary':
          // 互补色
          colors.push(baseColor)
          colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l))
          break
        case 'triadic':
          // 三角色
          colors.push(baseColor)
          colors.push(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l))
          colors.push(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l))
          break
        case 'analogous':
          // 相似色
          for (let i = -2; i <= 2; i++) {
            colors.push(hslToHex((hsl.h + i * 30) % 360, hsl.s, hsl.l))
          }
          break
        case 'monochromatic':
          // 单色调
          for (let i = 0; i < 5; i++) {
            const newL = Math.max(0, Math.min(100, hsl.l + (i - 2) * 20))
            colors.push(hslToHex(hsl.h, hsl.s, newL))
          }
          break
      }

      const palette = colors.map(color => {
        const rgbColor = hexToRgb(color)
        return {
          hex: color,
          rgb: rgbColor,
          hsl: rgbColor ? rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b) : { h: 0, s: 0, l: 0 }
        }
      })

      return {
        success: true,
        result: colors.join('\n'),
        processTime: Date.now() - startTime,
        extra: {
          type,
          palette,
          baseColor
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  getColorInfo: (color: string): ToolResponse => {
    const startTime = Date.now()
    try {
      let rgb
      if (color.startsWith('#')) {
        rgb = hexToRgb(color)
      } else if (color.startsWith('rgb')) {
        const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (matches) {
          rgb = { r: parseInt(matches[1]), g: parseInt(matches[2]), b: parseInt(matches[3]) }
        }
      }

      if (!rgb) {
        throw new Error('无效的颜色格式')
      }

      const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      const luminance = getLuminance(rgb.r, rgb.g, rgb.b)
      const brightness = getBrightness(rgb.r, rgb.g, rgb.b)

      const result = `颜色信息分析：

HEX: ${hex}
RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})
HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)
HSV: hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)

亮度: ${luminance.toFixed(3)}
明度: ${brightness.toFixed(1)}%
建议文字颜色: ${brightness > 50 ? '#000000' : '#FFFFFF'}`

      return {
        success: true,
        result,
        processTime: Date.now() - startTime,
        extra: {
          hex,
          rgb,
          hsl,
          hsv,
          luminance,
          brightness,
          recommendedTextColor: brightness > 50 ? '#000000' : '#FFFFFF'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 图标生成器工具
export const iconGeneratorTool = {
  generateSvgIcon: (type: string, size: number = 24, color: string = '#000000', strokeWidth: number = 2, style: string = 'filled'): ToolResponse => {
    const startTime = Date.now()
    try {
      const iconTemplates: Record<string, any> = {
        // 基础图标
        heart: {
          filled: `<path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>`,
          outlined: `<path fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`
        },
        star: {
          filled: `<path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>`,
          outlined: `<path fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`
        },
        check: {
          filled: `<path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>`,
          outlined: `<path fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" d="m9 12 2 2 4-4"/>`
        },
        close: {
          filled: `<path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>`,
          outlined: `<path fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" d="m18 6-12 12m0-12 12 12"/>`
        },
        'arrow-right': {
          filled: `<path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>`,
          outlined: `<path fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7"/>`
        },
        settings: {
          filled: `<path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>`,
          outlined: `<circle cx="12" cy="12" r="3" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/><path fill="none" stroke="${color}" stroke-width="${strokeWidth}" d="m12 1 3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z"/>`
        }
      }

      const iconData = iconTemplates[type]
      if (!iconData) {
        throw new Error(`不支持的图标类型: ${type}`)
      }

      const pathData = iconData[style] || iconData.filled
      const fillColor = style === 'filled' ? color : 'none'

      const svg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fillColor}" xmlns="http://www.w3.org/2000/svg">
  ${pathData}
</svg>`

      const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`

      return {
        success: true,
        result: svg,
        processTime: Date.now() - startTime,
        extra: {
          type,
          size,
          color,
          strokeWidth,
          style,
          dataUrl,
          usage: {
            html: `<img src="${dataUrl}" alt="${type} icon" />`,
            css: `background-image: url('${dataUrl}');`,
            react: `<img src="${dataUrl}" alt="${type} icon" />`,
            vue: `<img :src="'${dataUrl}'" alt="${type} icon" />`,
            ionic: `<ion-icon src="${dataUrl}"></ion-icon>`,
            flutter: `SvgPicture.network('${dataUrl}')`
          }
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  generateFavicon: (text: string, bgColor: string = '#409EFF', textColor: string = '#FFFFFF'): ToolResponse => {
    const startTime = Date.now()
    try {
      const size = 32
      const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${bgColor}" rx="4"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${textColor}">${text.substring(0, 1).toUpperCase()}</text>
</svg>`

      return {
        success: true,
        result: svg,
        processTime: Date.now() - startTime,
        extra: {
          text,
          bgColor,
          textColor,
          size,
          dataUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
          downloadUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// Markdown编辑器工具
export const markdownTool = {
  preview: (markdown: string): ToolResponse => {
    const startTime = Date.now()
    try {
      if (!markdown.trim()) {
        throw new Error('请输入Markdown内容')
      }

      // 简单的Markdown转HTML实现
      let html = markdown
        // 标题
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // 粗体和斜体
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        // 代码块
        .replace(/```(.*?)```/gims, '<pre><code>$1</code></pre>')
        .replace(/`(.*?)`/gim, '<code>$1</code>')
        // 链接
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
        // 图片
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" style="max-width: 100%;" />')
        // 列表
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        // 换行
        .replace(/\n/gim, '<br>')

      return {
        success: true,
        result: html,
        processTime: Date.now() - startTime,
        extra: {
          originalLength: markdown.length,
          htmlLength: html.length,
          language: 'markdown'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  },

  getTableOfContents: (markdown: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const headings = []
      const lines = markdown.split('\n')
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        const match = line.match(/^(#{1,6})\s+(.+)$/)
        if (match) {
          const level = match[1].length
          const title = match[2]
          const id = title.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
          headings.push({
            level,
            title,
            id,
            line: i + 1
          })
        }
      }

      const toc = headings.map(h => 
        '  '.repeat(h.level - 1) + `- [${h.title}](#${h.id})`
      ).join('\n')

      return {
        success: true,
        result: toc,
        processTime: Date.now() - startTime,
        extra: {
          headings,
          totalHeadings: headings.length
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: error.message,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 辅助函数
function generateChineseName(): string {
  const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
  const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '洋', '勇', '艳', '俊', '峰', '刚', '军', '平', '辉', '明', '华']
  
  const surname = surnames[Math.floor(Math.random() * surnames.length)]
  const name = names[Math.floor(Math.random() * names.length)]
  const name2 = Math.random() > 0.5 ? names[Math.floor(Math.random() * names.length)] : ''
  
  return surname + name + name2
}

function generateEnglishName(): string {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Mary', 'James', 'Jennifer', 'William', 'Linda', 'Richard', 'Patricia', 'Joseph', 'Elizabeth']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas']
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  
  return `${firstName} ${lastName}`
}

// API测试工具已删除（用户要求只使用纯前端工具）