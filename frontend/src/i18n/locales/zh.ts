export default {
  nav: {
    home: '首页',
    textProcessing: '📝 文本处理',
    encoding: '🔄 编码转换',
    devTools: '🛠️ 开发工具',
    timeTools: '⏰ 时间工具',
    securityTools: '🔒 安全工具',
    docs: '📚 文档',
    utilityTools: '🛠️ 实用工具',
    entertainment: '🎮 娱乐工具',
    about: '关于',
    more: '更多'
  },
  menu: {
    // 文本处理
    jsonTool: 'JSON工具',
    xmlTool: 'XML工具',
    textCompare: '文本对比',
    textEncrypt: '文本加密',
    regexTool: '正则表达式',
    textStats: '文本统计',
    markdownEditor: 'Markdown编辑器',
    
    // 编码转换
    base64Encoding: 'Base64编码',
    urlEncoding: 'URL编码',
    unicodeEncoding: 'Unicode编码',
    htmlEntity: 'HTML实体',
    baseConverter: '进制转换',
    imageBase64: '图片Base64转换',
    
    // 开发工具
    colorTool: '颜色工具',
    colorPicker: '高级颜色选择器',
    uuidGenerator: 'UUID生成器',
    qrGenerator: '二维码生成器',
    randomData: '随机数据生成器',
    codeFormatter: '代码格式化',
    fileDiff: '文件对比',
    iconGenerator: '图标生成器',
    cronTool: 'Cron表达式',
    variableGenerator: '变量生成助手',
    
    // 时间工具
    timestampTool: '时间戳工具',
    timeCalculator: '时间计算器',
    worldClock: '世界时钟',
    unitConverter: '单位转换',
    
    // 安全工具
    passwordGenerator: '密码生成器',
    hashTool: '哈希计算',
    
    // 文档
    gitCommands: 'Git 常用命令',
    linuxCommands: 'Linux 常用命令',
    dockerCommands: 'Docker 常用命令',
    mysqlSyntax: 'MySQL 常用语法',
    javaSyntax: 'Java 常用语法',
    
    // 实用工具
    bmiCalculator: 'BMI计算器',
    mortgageCalculator: '房贷计算器',
    ageCalculator: '年龄计算器',
    classroomSeatingChart: '班级座次表',
    studentRollCall: '学生点名器',
    fortuneTest: '运势测试',
    
    // 娱乐工具
    virtualPiano: '虚拟钢琴',
    snakeGame: '贪吃蛇游戏',
    quotes: '励志语录',
    numberPuzzle: '数字华容道',
    whackMole: '打地鼠游戏',
    game2048: '2048数字合成',
    tetris: '俄罗斯方块',
    flappyBird: 'Flappy Bird',
    gemCrush: '宝石消除'
  },
  footer: {
    copyright: '© 2024 WG-Tools. 为开发者提供便捷的在线工具服务.',
    github: 'GitHub',
    aboutUs: '关于我们',
    contactUs: '联系我们'
  },
  common: {
    language: '语言',
    chinese: '中文',
    english: 'English',
    search: '搜索',
    clear: '清空',
    copy: '复制',
    format: '格式化',
    compress: '压缩',
    encode: '编码',
    decode: '解码',
    result: '结果',
    input: '输入',
    output: '输出',
    loading: '处理中...',
    convert: '转换',
    characters: '字符',
    calculate: '计算',
    refresh: '刷新',
    success: '成功',
    error: '错误',
    bytes: '字节',
    lines: '行',
    words: '单词'
  },
  home: {
    title: 'WG-Tools 开发者工具箱',
    subtitle: '为开发者提供便捷、高效的在线工具服务\n支持文本处理、编码转换、开发调试等常用功能',
    searchPlaceholder: '搜索工具...',
    categories: {
      all: '全部工具',
      text: '文本处理',
      encoding: '编码转换',
      dev: '开发工具',
      time: '时间工具',
      security: '安全工具',
      utility: '实用工具',
      entertainment: '娱乐工具'
    },
    tools: {
      jsonTool: {
        name: 'JSON工具',
        description: 'JSON格式化、压缩、验证，让JSON数据更易读',
        tags: ['JSON', '格式化', '验证']
      },
      xmlTool: {
        name: 'XML工具',
        description: 'XML格式化、美化，提升XML可读性',
        tags: ['XML', '格式化']
      },
      textCompare: {
        name: '文本对比',
        description: '比较两段文本的差异，支持逐行对比',
        tags: ['文本', '对比', '差异']
      },
      textEncrypt: {
        name: '文本加密',
        description: '支持MD5、SHA1、SHA256等多种加密算法',
        tags: ['加密', 'MD5', 'SHA']
      },
      regexTool: {
        name: '正则表达式',
        description: '正则表达式测试、替换，支持多种模式',
        tags: ['正则', '匹配', '替换']
      },
      colorTool: {
        name: '颜色工具',
        description: 'HEX、RGB、HSL颜色格式转换',
        tags: ['颜色', 'HEX', 'RGB', 'HSL']
      },
      uuidTool: {
        name: 'UUID生成器',
        description: '生成标准UUID，支持单个和批量生成',
        tags: ['UUID', '生成', '唯一标识']
      },
      timestampTool: {
        name: '时间戳工具',
        description: '时间戳与日期格式相互转换',
        tags: ['时间戳', '日期', '转换']
      },
      timeCalculator: {
        name: '时间计算器',
        description: '时间加减运算、工作日计算、年龄计算',
        tags: ['时间计算', '工作日', '年龄']
      },
      worldClock: {
        name: '世界时钟',
        description: '全球时区时间显示和转换',
        tags: ['世界时钟', '时区', '全球时间']
      },
      passwordGenerator: {
        name: '密码生成器',
        description: '生成安全可靠的随机密码',
        tags: ['密码', '安全', '随机', '生成']
      },
      hashTool: {
        name: '哈希计算',
        description: '计算文本的哈希值，支持多种算法',
        tags: ['哈希', '计算', 'MD5', 'SHA']
      },
      textStats: {
        name: '文本统计',
        description: '分析文本的字符、单词、行数等统计信息',
        tags: ['文本', '统计', '分析', '词频']
      },
      piano: {
        name: '虚拟钢琴',
        description: '在线钢琴演奏，内置经典曲目教学，键盘按键支持',
        tags: ['钢琴', '音乐', '演奏', '娱乐']
      },
      snakeGame: {
        name: '贪吃蛇游戏',
        description: '经典街机游戏，支持多种难度和主题，考验反应速度',
        tags: ['游戏', '贪吃蛇', '休闲', '娱乐']
      },
      game2048: {
        name: '2048数字合成',
        description: '经典数字合成游戏，通过滑动合并相同数字，挑战2048',
        tags: ['数字', '合成', '策略', '益智']
      },
      tetris: {
        name: '俄罗斯方块',
        description: '经典俄罗斯方块游戏，消除满行获得高分，挑战反应速度',
        tags: ['方块', '消除', '经典', '反应']
      },
      gitCommands: {
        name: 'Git 常用命令',
        description: 'Git版本控制常用命令参考手册',
        tags: ['Git', '版本控制', '命令', '文档']
      },
      linuxCommands: {
        name: 'Linux 常用命令',
        description: 'Linux系统管理和操作常用命令参考',
        tags: ['Linux', '系统管理', '命令', '运维']
      },
      dockerCommands: {
        name: 'Docker 常用命令',
        description: 'Docker容器和镜像管理常用命令参考',
        tags: ['Docker', '容器', '镜像', '部署']
      },
      qrGenerator: {
        name: '二维码生成器',
        description: '生成各种内容的二维码，支持文本、网址、WiFi等',
        tags: ['二维码', 'QR码', '生成', '分享']
      },
      imageBase64: {
        name: '图片Base64转换',
        description: '图片与Base64编码的相互转换',
        tags: ['图片', 'Base64', '编码', '转换']
      },
      randomData: {
        name: '随机数据生成器',
        description: '生成测试用的姓名、邮箱、电话等数据',
        tags: ['随机', '测试数据', '姓名', '邮箱']
      },
      codeFormatter: {
        name: '代码格式化工具',
        description: '美化CSS、SQL、JSON等代码格式',
        tags: ['代码', '格式化', 'CSS', 'SQL']
      },
      markdownEditor: {
        name: 'Markdown编辑器',
        description: '实时预览Markdown文档，支持语法高亮',
        tags: ['Markdown', '编辑器', '预览', '文档']
      },
      fileDiff: {
        name: '文件对比工具',
        description: '对比两个文件的差异，逐行分析统计',
        tags: ['文件', '对比', '差异', '分析']
      },
      colorPicker: {
        name: '高级颜色选择器',
        description: '颜色分析、调色板生成和颜色转换',
        tags: ['颜色', '调色板', '分析', '转换']
      },
      iconGenerator: {
        name: '图标生成器',
        description: 'SVG图标生成和Favicon制作工具',
        tags: ['图标', 'SVG', 'Favicon', '生成']
      },
      cronTool: {
        name: 'Cron表达式工具',
        description: '定时任务表达式生成、解析和执行时间预测',
        tags: ['Cron', '定时任务', '表达式', '调度']
      },
      variableGenerator: {
        name: '变量生成助手',
        description: '中文转英文变量名，支持多种编程命名格式',
        tags: ['变量', '命名', '翻译', '编程']
      },
      mysqlSyntax: {
        name: 'MySQL 常用语法',
        description: 'MySQL数据库操作常用SQL语法参考',
        tags: ['MySQL', 'SQL', '数据库', '查询']
      },
      javaSyntax: {
        name: 'Java 常用语法',
        description: 'Java编程语言核心语法和Stream API操作',
        tags: ['Java', 'Stream', '编程', '语法']
      },
      quoteGenerator: {
        name: '励志语录生成器',
        description: '随机生成励志、搞笑、哲理语录，支持分类和收藏',
        tags: ['语录', '励志', '哲理', '摸鱼']
      },
      numberPuzzle: {
        name: '数字华容道',
        description: '经典数字拼图游戏，锻炼逻辑思维和空间想象力',
        tags: ['益智', '拼图', '华容道', '思维']
      },
      whackMole: {
        name: '打地鼠游戏',
        description: '经典反应训练游戏，考验手速和专注力，多种难度挑战',
        tags: ['反应', '手速', '训练', '挑战']
      },
      flappyBird: {
        name: 'Flappy Bird',
        description: '经典飞行躲避游戏，控制小鸟穿越管道，考验反应和节奏感',
        tags: ['飞行', '躲避', '节奏', '反应']
      },
      gemCrush: {
        name: '宝石消除',
        description: '经典三消游戏，交换相邻宝石形成消除，策略与运气的完美结合',
        tags: ['三消', '消除', '策略', '宝石']
      },
      bmiCalculator: {
        name: 'BMI计算器',
        description: '计算身体质量指数，评估体重健康状况，提供健康建议',
        tags: ['健康', 'BMI', '体重', '计算']
      },
      mortgageCalculator: {
        name: '房贷计算器',
        description: '房贷月供计算，支持等额本息、等额本金两种还款方式',
        tags: ['房贷', '计算器', '月供', '利率']
      },
      ageCalculator: {
        name: '年龄计算器',
        description: '精确计算年龄、生肖、星座，支持生日提醒和倒计时',
        tags: ['年龄', '生肖', '星座', '生日']
      },
      classroomSeating: {
        name: '班级座次表',
        description: '智能座位安排系统，支持随机排座、成绩分区、优差搭配等多种方式',
        tags: ['教学', '座位', '班级', '管理']
      },
      studentRollCall: {
        name: '学生点名器',
        description: '智能随机点名工具，支持批量导入名单、统计分析、音效动画',
        tags: ['教学', '点名', '随机', '课堂']
      }
    }
  },
  pages: {
    colorTool: {
      title: '颜色工具',
      description: '专业的颜色分析和处理工具，提供颜色提取、调色板生成等高级功能',
      functionSelection: '功能选择',
      selectFunction: '选择颜色处理功能',
      functions: {
        extract: {
          name: '图片颜色提取',
          description: '从图片中提取主要颜色',
          title: '图片颜色提取',
          subtitle: '从图片中提取主要颜色'
        },
        palette: {
          name: '调色板生成',
          description: '基于颜色生成调色板',
          title: '调色板生成',
          subtitle: '基于颜色生成调色板'
        },
        convert: {
          name: '颜色格式转换',
          description: '在不同颜色格式间转换',
          title: '颜色格式转换',
          subtitle: '在不同颜色格式间转换'
        },
        gradient: {
          name: '渐变色生成',
          description: '创建平滑的颜色渐变',
          title: '渐变色生成',
          subtitle: '创建平滑的颜色渐变'
        }
      },
      upload: {
        title: '上传图片',
        description: '支持拖拽上传或点击选择图片文件',
        button: '选择图片',
        dragText: '拖拽图片到此处或',
        formats: '支持 JPG、PNG、GIF 格式'
      },
      extractedColors: '提取的颜色',
      colorInfo: '颜色信息',
      copyColor: '复制颜色值',
      noImageSelected: '请先选择一张图片',
      extractSuccess: '颜色提取完成',
      copySuccess: '颜色值已复制到剪贴板',
      copyFailed: '复制失败'
    },
    hash: {
      title: '哈希计算',
      description: '提供多种哈希算法，快速计算文本的哈希值，支持DJB2、SDBM、Lose Lose等算法',
      inputPlaceholder: '请输入要计算哈希值的文本内容...',
      algorithm: '哈希算法',
      algorithmSelection: '算法选择',
      calculateButton: '计算哈希值',
      result: '结果',
      hashResult: '哈希值结果',
      copyResult: '复制结果',
      details: '详细信息',
      detailLabels: {
        algorithm: '算法',
        inputLength: '输入长度',
        outputLength: '输出长度',
        processTime: '处理时间',
        characters: '字符',
        milliseconds: '毫秒'
      },
      algorithmDesc: '算法说明',
      algorithms: {
        djb2: {
          name: 'DJB2',
          description: 'Daniel J. Bernstein开发的简单哈希算法，具有良好的分布特性。'
        },
        sdbm: {
          name: 'SDBM',
          description: 'SDBM数据库使用的哈希算法，适用于字符串哈希。'
        },
        loselose: {
          name: 'Lose Lose',
          description: '最简单的哈希算法之一，将所有字符的ASCII值相加。'
        }
      },
      warning: {
        title: '注意',
        description: '这些算法用于简单哈希计算，不适用于加密安全用途。如需加密级别的哈希，请使用SHA-256、SHA-512等标准算法。'
      },
      messages: {
        noInputText: '请输入要计算哈希值的文本',
        calculationError: '计算哈希值时出错',
        copied: '哈希值已复制到剪贴板！',
        copyFailed: '复制失败'
      }
    },
    base64Tool: {
        name: 'Base64编码',
        description: 'Base64编码解码，支持文本和文件转换',
        tags: ['Base64', '编码', '解码']
      },
      urlTool: {
        name: 'URL编码',
        description: 'URL编码解码，处理特殊字符转换',
        tags: ['URL', '编码', '转换']
      },
      unicodeTool: {
        name: 'Unicode编码',
        description: 'Unicode编码解码，处理多语言字符',
        tags: ['Unicode', '字符', '编码']
      },
      htmlTool: {
        name: 'HTML实体编码',
        description: 'HTML实体字符编码解码',
        tags: ['HTML', '实体', '编码']
      },
      baseTool: {
        name: '进制转换',
        description: '2、8、10、16进制之间的相互转换',
        tags: ['进制', '转换', '计算']
      },
    regex: {
      title: '正则表达式',
      description: '强大的正则表达式测试和学习工具，支持实时匹配和详细解释',
      pattern: '正则表达式',
      patternDescription: '输入正则表达式模式',
      patternPlaceholder: '请输入正则表达式，例如：\\d{3}-\\d{3}-\\d{4}',
      flags: '修饰符',
      flagOptions: {
        global: '全局匹配 (g)',
        ignoreCase: '忽略大小写 (i)',
        multiline: '多行模式 (m)',
        dotAll: '单行模式 (s)'
      },
      commonPatterns: '常用模式',
      testText: '测试文本',
      testDescription: '输入要匹配的文本内容',
      testPlaceholder: '请输入要测试的文本内容...',
      exampleTexts: '示例文本',
      matchResults: '匹配结果',
      expressionError: '表达式错误',
      matchCount: '找到 {count} 个匹配项',
      stats: {
        matchCount: '匹配数量',
        positions: '匹配位置',
        coverage: '覆盖率',
        totalChars: '总字符'
      },
      matchDetails: '匹配详情',
      match: '匹配',
      position: '位置',
      captureGroups: '捕获组',
      group: '组',
      empty: '(空)',
      highlighted: '高亮显示',
      copyMatches: '复制匹配结果',
      exportResults: '导出结果',
      batchReplace: '批量替换',
      replaceDescription: '使用正则表达式进行文本替换',
      replaceTo: '替换为',
      replacePlaceholder: '输入替换文本，支持 $1, $2 等捕获组引用',
      executeReplace: '执行替换',
      replaceResult: '替换结果',
      copyResult: '复制结果',
      guide: '正则表达式指南',
      guideDescription: '常用语法和示例',
      syntax: {
        characters: '字符匹配',
        quantifiers: '量词',
        anchors: '锚点',
        groups: '分组',
        classes: '字符类'
      }
    },
    xml: {
      title: 'XML工具',
      description: 'XML格式化、美化和验证，提升XML文档的可读性',
      inputPlaceholder: '请输入要格式化的XML内容...',
      actions: {
        format: '格式化XML',
        clear: '清空内容',
        copy: '复制结果'
      }
    },
    bmiCalculator: {
      title: 'BMI计算器',
      description: '计算身体质量指数，评估体重健康状况',
      basicInfo: '基本信息',
      height: '身高 (cm)',
      weight: '体重 (kg)',
      age: '年龄',
      heightPlaceholder: '请输入身高',
      weightPlaceholder: '请输入体重',
      agePlaceholder: '请输入年龄',
      calculate: '计算BMI',
      result: '计算结果',
      bmiValue: 'BMI值',
      category: '体重类别',
      healthAdvice: '健康建议',
      categories: {
        underweight: '偏瘦',
        normal: '正常',
        overweight: '超重',
        obese: '肥胖'
      },
      advice: {
        underweight: '建议增加营养摄入，多进行力量训练，增加肌肉量。',
        normal: '保持良好的饮食习惯和运动习惯，继续保持健康体重。',
        overweight: '建议适当控制饮食，增加有氧运动，减少高热量食物摄入。',
        obese: '建议咨询专业医生，制定科学的减重计划，注意饮食控制和运动。'
      }
    },
    mortgageCalculator: {
      title: '房贷计算器',
      description: '计算房贷月供、总利息，支持等额本息、等额本金两种还款方式',
      loanInfo: '贷款信息',
      loanAmount: '贷款总额 (万元)',
      loanAmountPlaceholder: '请输入实际贷款金额',
      loanAmountTip: '💡 提示：请直接输入需要贷款的金额，无需考虑首付',
      loanYears: '贷款年限',
      loanYearsPlaceholder: '请选择贷款年限',
      annualRate: '年利率 (%)',
      annualRatePlaceholder: '请输入年利率',
      repaymentType: '还款方式',
      repaymentTypes: {
        equalInstallment: '等额本息',
        equalPrincipal: '等额本金'
      },
      calculate: '计算房贷',
      result: '计算结果',
      monthlyPayment: '月供金额',
      totalInterest: '总利息',
      totalAmount: '还款总额',
      paymentSchedule: '还款计划表',
      period: '期数',
      principal: '本金',
      interest: '利息',
      remaining: '剩余本金'
    },
    ageCalculator: {
      title: '年龄计算器',
      description: '精确计算年龄、生肖、星座，支持生日提醒和倒计时',
      basicInfo: '基本信息',
      calendarType: '日历类型',
      solar: '阳历（公历）',
      lunar: '农历（阴历）',
      birthDate: '出生日期',
      year: '年',
      month: '月',
      day: '日',
      leapMonth: '闰月',
      calculate: '计算年龄',
      result: '计算结果',
      currentAge: '当前年龄',
      years: '岁',
      months: '个月',
      days: '天',
      totalDays: '总天数',
      zodiac: '生肖',
      constellation: '星座',
      nextBirthday: '下次生日',
      daysUntilBirthday: '距离生日还有',
      birthdayToday: '今天是您的生日！生日快乐！🎉'
    },
    unitConverter: {
      title: '单位转换',
      description: '强大的单位转换器，支持长度、重量、温度、时间等多种单位类型',
      typeSelection: '转换类型',
      selectTypeDescription: '选择要转换的单位类型',
      conversion: '转换',
      conversionDescription: '输入数值进行单位转换',
      inputValue: '转换前',
      outputValue: '转换后',
      inputPlaceholder: '请输入数值',
      outputPlaceholder: '转换结果',
      quickConversion: '快速转换',
      copyResult: '复制结果',
      clearData: '清空数据',
      saveRecord: '保存记录',
      conversionHistory: '转换历史',
      historyDescription: '最近的转换记录',
      use: '使用',
      delete: '删除',
      clearHistory: '清空历史',
      exportHistory: '导出历史',
      supportedTypes: '支持的单位类型',
      usageDescription: '详细的单位转换说明',
      types: {
        length: {
          name: '长度',
          description: '米、千米、英尺、英寸等'
        },
        weight: {
          name: '重量',
          description: '千克、克、磅、盎司等'
        },
        temperature: {
          name: '温度',
          description: '摄氏度、华氏度、开尔文等'
        },
        area: {
          name: '面积',
          description: '平方米、公顷、英亩等'
        },
        volume: {
          name: '体积',
          description: '升、毫升、加仑等'
        },
        time: {
          name: '时间',
          description: '秒、分钟、小时、天等'
        },
        speed: {
          name: '速度',
          description: '米/秒、公里/小时等'
        },
        energy: {
          name: '能量',
          description: '焦耳、卡路里、千瓦时等'
        }
      },
      units: {
        length: {
          mm: '毫米 (mm)',
          cm: '厘米 (cm)',
          m: '米 (m)',
          km: '千米 (km)',
          in: '英寸 (in)',
          ft: '英尺 (ft)',
          yd: '码 (yd)',
          mi: '英里 (mi)'
        },
        weight: {
          mg: '毫克 (mg)',
          g: '克 (g)',
          kg: '千克 (kg)',
          t: '吨 (t)',
          oz: '盎司 (oz)',
          lb: '磅 (lb)',
          st: '英石 (st)'
        },
        temperature: {
          c: '摄氏度 (°C)',
          f: '华氏度 (°F)',
          k: '开尔文 (K)',
          r: '兰氏度 (°R)'
        },
        area: {
          mm2: '平方毫米 (mm²)',
          cm2: '平方厘米 (cm²)',
          m2: '平方米 (m²)',
          km2: '平方千米 (km²)',
          in2: '平方英寸 (in²)',
          ft2: '平方英尺 (ft²)',
          ac: '英亩 (ac)',
          ha: '公顷 (ha)'
        },
        volume: {
          ml: '毫升 (ml)',
          l: '升 (l)',
          m3: '立方米 (m³)',
          in3: '立方英寸 (in³)',
          ft3: '立方英尺 (ft³)',
          gal: '加仑 (gal)',
          qt: '夸脱 (qt)'
        },
        time: {
          ms: '毫秒 (ms)',
          s: '秒 (s)',
          min: '分钟 (min)',
          h: '小时 (h)',
          d: '天 (d)',
          w: '周 (w)',
          mo: '月 (mo)',
          y: '年 (y)'
        },
        speed: {
          mps: '米/秒 (m/s)',
          kmh: '公里/小时 (km/h)',
          mph: '英里/小时 (mph)',
          fps: '英尺/秒 (ft/s)',
          knot: '节 (knot)'
        },
        energy: {
          j: '焦耳 (J)',
          kj: '千焦 (kJ)',
          cal: '卡路里 (cal)',
          kcal: '千卡 (kcal)',
          wh: '瓦时 (Wh)',
          kwh: '千瓦时 (kWh)',
          btu: '英热单位 (BTU)'
        }
      },
      messages: {
        conversionError: '转换失败，请检查输入',
        conversionFailed: '转换失败',
        noResultToCopy: '没有结果可复制',
        copiedToClipboard: '转换结果已复制到剪贴板！',
        copyFailed: '复制失败',
        dataCleared: '已清空数据',
        noResultToSave: '没有转换结果可保存',
        addedToHistory: '已添加到转换历史',
        historyApplied: '已应用历史记录',
        historyDeleted: '已删除历史记录',
        historyCleared: '已清空转换历史',
        noHistoryToExport: '没有历史记录可导出',
        historyExported: '转换历史已导出！'
      }
    },
    json: {
      title: 'JSON工具',
      description: '强大的JSON格式化、压缩和验证工具，支持语法高亮和错误检测',
      inputPlaceholder: '请输入要处理的JSON内容...',
      actions: {
        format: '格式化',
        compress: '压缩',
        clear: '清空',
        copy: '复制结果'
      },
      operationTools: '操作工具',
      operationDescription: '选择要执行的JSON操作'
    },
    unicode: {
      title: 'Unicode编码工具',
      description: '强大的Unicode编码转换工具，支持多种编码格式和字符分析',
      modeTitle: '转换模式',
      modeDescription: '选择Unicode编码转换方式',
      modes: {
        encode: '文本 → Unicode',
        decode: 'Unicode → 文本'
      }
    },
    base64: {
      title: 'Base64编码工具',
      description: '强大的Base64编码解码工具，支持文本和文件转换',
      inputPlaceholder: '请输入要编码/解码的内容...',
      modes: {
        encode: '编码',
        decode: '解码'
      },
      actions: {
        encode: '编码',
        decode: '解码',
        clear: '清空',
        copy: '复制结果'
      }
    },
    url: {
      title: 'URL编码工具',
      description: 'URL编码解码工具，处理特殊字符转换',
      inputPlaceholder: '请输入要编码/解码的URL...',
      modes: {
        encode: 'URL编码',
        decode: 'URL解码'
      }
    },
    html: {
      title: 'HTML实体编码工具',
      description: 'HTML实体字符编码解码工具',
      inputPlaceholder: '请输入要编码/解码的HTML内容...',
      modes: {
        encode: 'HTML编码',
        decode: 'HTML解码'
      }
    },
    base: {
      title: '进制转换工具',
      description: '2、8、10、16进制之间的相互转换',
      inputPlaceholder: '请输入要转换的数值...',
      bases: {
        binary: '二进制',
        octal: '八进制',
        decimal: '十进制',
        hex: '十六进制'
      }
    },
    password: {
      title: '密码生成器',
      description: '生成安全可靠的随机密码',
      options: {
        length: '密码长度',
        uppercase: '包含大写字母',
        lowercase: '包含小写字母',
        numbers: '包含数字',
        symbols: '包含符号'
      },
      actions: {
        generate: '生成密码',
        copy: '复制密码'
      }
    },
    timestamp: {
      title: '时间戳工具',
      description: '时间戳与日期时间相互转换',
      current: '当前时间戳',
      inputPlaceholder: '请输入时间戳或日期时间...',
      actions: {
        toTimestamp: '转换为时间戳',
        toDate: '转换为日期'
      }
    },
    timeCalculator: {
      title: '时间计算器',
      description: '时间间隔计算和时间加减运算',
      calculate: '计算时间差',
      add: '时间加法',
      subtract: '时间减法',
      modeSelect: '功能选择',
      workdays: '工作日计算',
      timezone: '时区转换',
      age: '年龄计算'
    },
    worldClock: {
      title: '世界时钟',
      description: '实时显示全球主要城市时间，支持自定义时区和时间格式',
      timezone: '时区',
      localTime: '本地时间',
      liveUpdate: '实时更新'
    },
    about: {
      title: '关于 WG-Tools',
      subtitle: '为开发者提供便捷、高效的在线工具服务',
      description: 'WG-Tools是一个为开发者设计的在线工具集合',
      version: '版本',
      author: '作者',
      contact: '联系方式'
    },
    textStats: {
      description: '智能分析文本内容，提供详细的字符、单词、行数等统计信息',
      analyze: '分析文本',
      placeholder: '请输入要分析的文本内容...',
      results: '统计结果',
      realTimeAnalysis: '实时文本分析'
    },
    textEncrypt: {
      description: '安全的文本加密解密工具，支持多种加密算法和编码格式',
      operationMode: '操作模式',
      selectOperation: '选择加密或解密操作',
      encrypt: '加密',
      decrypt: '解密',
      algorithm: '加密算法',
      selectAlgorithm: '选择加密算法和参数',
      algorithmType: '算法类型'
    },
    markdownEditor: {
      description: '功能强大的Markdown编辑器，支持实时预览、语法高亮和多种导出格式',
      editTools: '编辑工具',
      quickInsert: '快速插入Markdown语法',
      bold: '粗体',
      italic: '斜体',
      link: '链接',
      image: '图片',
      code: '代码'
    },
    fileDiff: {
      description: '智能文件内容对比，高亮显示差异，支持多种对比模式',
      compareConfig: '对比配置',
      configDescription: '设置对比选项和模式',
      compareMode: '对比模式',
      lineMode: '按行对比',
      wordMode: '按词对比',
      charMode: '按字符对比'
    },
    codeFormatter: {
      description: '智能代码格式化和美化，支持多种编程语言的代码规范'
    },
    cronTool: {
      description: '生成和解析Cron表达式，轻松配置定时任务调度'
    },
    variableGenerator: {
      description: '中文转英文变量名，智能生成多种编程命名格式',
      configTitle: '变量生成配置',
      configDescription: '输入中文描述，生成标准变量名',
      inputLabel: '中文描述',
      placeholder: '请输入要转换的中文，如：学生信息、产品信息等...',
      generate: '生成变量',
      translating: '翻译中...',
      results: '生成结果',
      resultDescription: '点击任意结果复制到剪贴板'
    },
    iconGenerator: {
      description: '快速生成各种风格的图标，支持多种尺寸和格式导出',
      configTitle: '图标配置',
      configDescription: '自定义图标样式和参数',
      iconType: '图标类型'
    },
    randomData: {
      description: '生成各种类型的随机测试数据，支持自定义格式和批量生成',
      dataType: '数据类型',
      selectType: '选择要生成的数据类型'
    },
    imageBase64: {
      description: '支持图片与Base64编码的双向转换，方便网页开发和数据传输',
      conversionMode: '转换模式',
      selectDirection: '选择转换方向'
    },
    gitCommands: {
      description: 'Git版本控制系统的常用命令和使用场景，帮助您高效管理代码版本'
    },
    game2048: {
      description: '滑动合并相同数字，挑战2048！',
      gameArea: '游戏区域',
      score: '得分',
      highScore: '最高分',
      newGame: '新游戏',
      undo: '撤销',
      help: '帮助',
      moves: '移动次数',
      instructions: '使用方向键或WASD移动，合并相同数字，目标是2048！'
    },
    tetris: {
      description: '经典的俄罗斯方块游戏，消除满行获得高分！',
      gameArea: '游戏区域',
      score: '得分',
      level: '等级',
      lines: '消除行数',
      highScore: '最高分',
      instructions: '使用方向键控制方块，填满一行即可消除'
    },
    fortuneTest: {
      title: '🔮 运势测试',
      description: '测试你的今日运势，看看会有什么惊喜等着你',
      initialText: '点击下方按钮<br>测试运势',
      testButton: '测试运势',
      testing: '占卜中...',
      advice: '今日建议'
    },
    rollCall: {
      title: '🎯 学生点名器',
      subtitle: '开发者：WG科技',
      downloadSample: '📁 下载示例',
      uploadRoster: '📤 上传班级名单'
    },
    linuxCommands: {
      description: 'Linux系统管理和运维必备命令，涵盖文件操作、系统监控、网络管理等'
    },
    dockerCommands: {
      description: 'Docker容器化技术常用命令和最佳实践，助您高效管理容器和镜像'
    },
    gemCrush: {
      description: '经典三消游戏，交换相邻宝石，消除三个或更多相同宝石！',
      gameArea: '宝石消除世界',
      instructions: '拖拽相邻宝石交换位置，或点击选择，消除三个或更多相同宝石获得分数！'
    },
    flappyBird: {
      description: '经典飞行躲避游戏，点击屏幕控制小鸟飞翔！',
      gameArea: '游戏区域',
      instructions: '点击屏幕或按空格键控制小鸟飞翔，躲避管道获得高分！'
    },
    numberPuzzle: {
      description: '经典数字拼图游戏，锻炼逻辑思维和空间想象力',
      gameArea: '游戏区域',
      instructions: '将数字按1-15的顺序排列，空格在右下角即为胜利'
    }
  }
}
