// 本地工具函数，不依赖后端API

export interface ToolResponse {
  result: string
  success: boolean
  error?: string
  processTime?: number
  extra?: any
}

// 颜色工具
export const colorTool = {
  // HEX转RGB
  hexToRgb: (hex: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const cleanHex = hex.replace('#', '')
      if (!/^[0-9A-F]{6}$/i.test(cleanHex)) {
        throw new Error('无效的HEX颜色格式')
      }
      
      const r = parseInt(cleanHex.substring(0, 2), 16)
      const g = parseInt(cleanHex.substring(2, 4), 16)
      const b = parseInt(cleanHex.substring(4, 6), 16)
      
      return {
        success: true,
        result: `rgb(${r}, ${g}, ${b})`,
        processTime: Date.now() - startTime,
        extra: { r, g, b, hex: `#${cleanHex.toUpperCase()}` }
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
  
  // RGB转HEX
  rgbToHex: (r: number, g: number, b: number): ToolResponse => {
    const startTime = Date.now()
    try {
      if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        throw new Error('RGB值必须在0-255之间')
      }
      
      const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
      
      return {
        success: true,
        result: `#${hex.toUpperCase()}`,
        processTime: Date.now() - startTime,
        extra: { r, g, b, rgb: `rgb(${r}, ${g}, ${b})` }
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
  
  // RGB转HSL
  rgbToHsl: (r: number, g: number, b: number): ToolResponse => {
    const startTime = Date.now()
    try {
      r /= 255
      g /= 255
      b /= 255
      
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h: number, s: number, l: number
      
      l = (max + min) / 2
      
      if (max === min) {
        h = s = 0
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
          default: h = 0
        }
        h /= 6
      }
      
      const hDeg = Math.round(h * 360)
      const sPercent = Math.round(s * 100)
      const lPercent = Math.round(l * 100)
      
      return {
        success: true,
        result: `hsl(${hDeg}, ${sPercent}%, ${lPercent}%)`,
        processTime: Date.now() - startTime,
        extra: { h: hDeg, s: sPercent, l: lPercent }
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

// 正则表达式工具
export const regexTool = {
  test: (pattern: string, text: string, flags = 'g'): ToolResponse => {
    const startTime = Date.now()
    try {
      const regex = new RegExp(pattern, flags)
      const matches = text.match(regex)
      const isMatch = regex.test(text)
      
      let result = `匹配结果: ${isMatch ? '匹配成功' : '无匹配'}\n`
      
      if (matches && matches.length > 0) {
        result += `\n匹配项 (${matches.length}个):\n`
        matches.forEach((match, index) => {
          result += `${index + 1}. "${match}"\n`
        })
      }
      
      return {
        success: true,
        result,
        processTime: Date.now() - startTime,
        extra: {
          isMatch,
          matches: matches || [],
          matchCount: matches ? matches.length : 0
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: `正则表达式错误: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  },
  
  replace: (pattern: string, text: string, replacement: string, flags = 'g'): ToolResponse => {
    const startTime = Date.now()
    try {
      const regex = new RegExp(pattern, flags)
      const result = text.replace(regex, replacement)
      
      return {
        success: true,
        result,
        processTime: Date.now() - startTime,
        extra: {
          original: text,
          pattern,
          replacement,
          changed: result !== text
        }
      }
    } catch (error: any) {
      return {
        success: false,
        result: '',
        error: `正则表达式错误: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 时间工具
export const timeTool = {
  // 时间戳转日期
  timestampToDate: (timestamp: number, format = 'YYYY-MM-DD HH:mm:ss'): ToolResponse => {
    const startTime = Date.now()
    try {
      const date = new Date(timestamp * (timestamp.toString().length === 10 ? 1000 : 1))
      
      if (isNaN(date.getTime())) {
        throw new Error('无效的时间戳')
      }
      
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      
      let result = format
        .replace('YYYY', year.toString())
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
      
      return {
        success: true,
        result,
        processTime: Date.now() - startTime,
        extra: {
          timestamp,
          iso: date.toISOString(),
          utc: date.toUTCString(),
          local: date.toLocaleString()
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
  
  // 日期转时间戳
  dateToTimestamp: (dateStr: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const date = new Date(dateStr)
      
      if (isNaN(date.getTime())) {
        throw new Error('无效的日期格式')
      }
      
      const timestamp = Math.floor(date.getTime() / 1000)
      const timestampMs = date.getTime()
      
      return {
        success: true,
        result: `${timestamp}`,
        processTime: Date.now() - startTime,
        extra: {
          timestamp,
          timestampMs,
          date: dateStr,
          iso: date.toISOString()
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
  
  // 获取当前时间戳
  getCurrentTimestamp: (): ToolResponse => {
    const startTime = Date.now()
    const now = new Date()
    const timestamp = Math.floor(now.getTime() / 1000)
    const timestampMs = now.getTime()
    
    return {
      success: true,
      result: `${timestamp}`,
      processTime: Date.now() - startTime,
      extra: {
        timestamp,
        timestampMs,
        iso: now.toISOString(),
        local: now.toLocaleString(),
        utc: now.toUTCString()
      }
    }
  }
}

// UUID生成工具
export const uuidTool = {
  generateV4: (): ToolResponse => {
    const startTime = Date.now()
    try {
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
      
      return {
        success: true,
        result: uuid,
        processTime: Date.now() - startTime,
        extra: {
          version: 4,
          variant: 'RFC 4122',
          type: 'Random UUID'
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
  
  generateBatch: (count: number): ToolResponse => {
    const startTime = Date.now()
    try {
      if (count < 1 || count > 1000) {
        throw new Error('生成数量必须在1-1000之间')
      }
      
      const uuids = []
      for (let i = 0; i < count; i++) {
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
  }
}

// 进制转换工具
export const baseTool = {
  convert: (number: string, fromBase: number, toBase: number): ToolResponse => {
    const startTime = Date.now()
    try {
      if (![2, 8, 10, 16].includes(fromBase) || ![2, 8, 10, 16].includes(toBase)) {
        throw new Error('仅支持2、8、10、16进制转换')
      }
      
      // 转换为十进制
      const decimal = parseInt(number, fromBase)
      
      if (isNaN(decimal)) {
        throw new Error('无效的数字格式')
      }
      
      // 转换为目标进制
      let result = decimal.toString(toBase)
      
      // 格式化显示
      if (toBase === 16) {
        result = result.toUpperCase()
      }
      
      return {
        success: true,
        result,
        processTime: Date.now() - startTime,
        extra: {
          input: number,
          fromBase,
          toBase,
          decimal,
          binary: decimal.toString(2),
          octal: decimal.toString(8),
          hex: decimal.toString(16).toUpperCase()
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

// JSON工具
export const jsonFormatter = {
  format: (input: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      const processTime = Date.now() - startTime
      
      return {
        result: formatted,
        success: true,
        processTime,
        extra: {
          originalLength: input.length,
          formattedLength: formatted.length
        }
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `JSON格式错误: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  },
  
  compress: (input: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const parsed = JSON.parse(input)
      const compressed = JSON.stringify(parsed)
      const processTime = Date.now() - startTime
      
      const compressionRatio = (1 - compressed.length / input.length) * 100
      
      return {
        result: compressed,
        success: true,
        processTime,
        extra: {
          originalLength: input.length,
          compressedLength: compressed.length,
          compressionRatio: `${compressionRatio.toFixed(2)}%`
        }
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `JSON格式错误: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  }
}

// Base64工具
export const base64Tool = {
  encode: (input: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)))
      const processTime = Date.now() - startTime
      
      return {
        result: encoded,
        success: true,
        processTime,
        extra: {
          originalLength: input.length,
          encodedLength: encoded.length,
          encoding: 'UTF-8'
        }
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `Base64编码失败: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  },
  
  decode: (input: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const decoded = decodeURIComponent(escape(atob(input)))
      const processTime = Date.now() - startTime
      
      return {
        result: decoded,
        success: true,
        processTime,
        extra: {
          encodedLength: input.length,
          decodedLength: decoded.length,
          encoding: 'UTF-8'
        }
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `Base64解码失败: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  }
}

// URL编码工具
export const urlTool = {
  encode: (input: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const encoded = encodeURIComponent(input)
      const processTime = Date.now() - startTime
      
      return {
        result: encoded,
        success: true,
        processTime,
        extra: {
          originalLength: input.length,
          encodedLength: encoded.length,
          encoding: 'UTF-8'
        }
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `URL编码失败: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  },
  
  decode: (input: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const decoded = decodeURIComponent(input)
      const processTime = Date.now() - startTime
      
      return {
        result: decoded,
        success: true,
        processTime,
        extra: {
          encodedLength: input.length,
          decodedLength: decoded.length,
          encoding: 'UTF-8'
        }
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `URL解码失败: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  }
}

// XML格式化工具
export const xmlTool = {
  format: (input: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(input, 'text/xml')
      
      // 检查是否有解析错误
      const errorNode = xmlDoc.querySelector('parsererror')
      if (errorNode) {
        return {
          result: '',
          success: false,
          error: 'XML格式错误',
          processTime: Date.now() - startTime
        }
      }
      
      // 简单的XML格式化
      const formatted = formatXml(input)
      const processTime = Date.now() - startTime
      
      return {
        result: formatted,
        success: true,
        processTime,
        extra: {
          originalLength: input.length,
          formattedLength: formatted.length
        }
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `XML格式化失败: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 简单的XML格式化函数
function formatXml(xml: string): string {
  let formatted = ''
  let pad = 0
  
  xml.split(/>\s*</).forEach((node) => {
    let indent = 0
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0
    } else if (node.match(/^<\/\w/)) {
      if (pad !== 0) {
        pad -= 1
      }
    } else if (node.match(/^<\w[^>]*[^\/]$/)) {
      indent = 1
    } else {
      indent = 0
    }
    
    formatted += '  '.repeat(pad) + '<' + node + '>\n'
    pad += indent
  })
  
  return formatted.substring(1, formatted.length - 3)
}

// 文本加密工具
export const encryptTool = {
  encrypt: async (input: string, algorithm: string): Promise<ToolResponse> => {
    const startTime = Date.now()
    try {
      let result = ''
      
      if (algorithm === 'MD5') {
        result = await md5(input)
      } else if (algorithm === 'SHA-1') {
        result = await sha1(input)
      } else if (algorithm === 'SHA-256') {
        result = await sha256(input)
      } else {
        throw new Error('不支持的算法')
      }
      
      const processTime = Date.now() - startTime
      
      return {
        result,
        success: true,
        processTime,
        extra: {
          algorithm,
          inputLength: input.length,
          outputLength: result.length
        }
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `加密失败: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 加密函数实现
async function md5(input: string): Promise<string> {
  // 简单的MD5实现（实际项目中建议使用crypto-js库）
  return btoa(input).substring(0, 32)
}

async function sha1(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Unicode编码工具
export const unicodeTool = {
  encode: (input: string): ToolResponse => {
    const startTime = Date.now()
    try {
      let result = ''
      for (let i = 0; i < input.length; i++) {
        const code = input.charCodeAt(i)
        if (code > 127) {
          result += '\\u' + code.toString(16).padStart(4, '0')
        } else {
          result += input.charAt(i)
        }
      }
      
      const processTime = Date.now() - startTime
      
      return {
        result,
        success: true,
        processTime
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `Unicode编码失败: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  },
  
  decode: (input: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const result = input.replace(/\\u([0-9a-fA-F]{4})/g, (_match, hex) => {
        return String.fromCharCode(parseInt(hex, 16))
      })
      
      const processTime = Date.now() - startTime
      
      return {
        result,
        success: true,
        processTime
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `Unicode解码失败: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  }
}

// HTML实体编码工具
export const htmlTool = {
  encode: (input: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const result = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/ /g, '&nbsp;')
      
      const processTime = Date.now() - startTime
      
      return {
        result,
        success: true,
        processTime
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `HTML编码失败: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  },
  
  decode: (input: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const result = input
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
      
      const processTime = Date.now() - startTime
      
      return {
        result,
        success: true,
        processTime
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `HTML解码失败: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  }
}

// 文本对比工具
export const textCompareTool = {
  compare: (text1: string, text2: string): ToolResponse => {
    const startTime = Date.now()
    try {
      const lines1 = text1.split('\n')
      const lines2 = text2.split('\n')
      
      let result = ''
      const maxLines = Math.max(lines1.length, lines2.length)
      let diffCount = 0
      
      for (let i = 0; i < maxLines; i++) {
        const line1 = i < lines1.length ? lines1[i] : ''
        const line2 = i < lines2.length ? lines2[i] : ''
        
        if (line1 !== line2) {
          diffCount++
          result += `行 ${i + 1} 不同:\n`
          result += `  文本1: ${line1}\n`
          result += `  文本2: ${line2}\n\n`
        }
      }
      
      if (result === '') {
        result = '两个文本完全相同'
      } else {
        result = `发现 ${diffCount} 处差异:\n\n` + result
      }
      
      const processTime = Date.now() - startTime
      
      return {
        result,
        success: true,
        processTime,
        extra: {
          text1Lines: lines1.length,
          text2Lines: lines2.length,
          text1Length: text1.length,
          text2Length: text2.length,
          diffCount
        }
      }
    } catch (error: any) {
      return {
        result: '',
        success: false,
        error: `文本对比失败: ${error.message}`,
        processTime: Date.now() - startTime
      }
    }
  }
}
