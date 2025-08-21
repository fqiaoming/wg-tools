<template>
  <div class="markdown-editor">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Edit /></el-icon>
        </div>
        <h1 class="hero-title">Markdown编辑器</h1>
        <p class="hero-description">功能强大的Markdown编辑器，支持实时预览、语法高亮和多种导出格式</p>
      </div>
    </div>

    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><Edit /></el-icon>
          编辑工具
        </h3>
        <p class="card-description">快速插入Markdown语法</p>
      </div>

      <div class="card-body">
        <!-- 工具栏 -->
        <div class="toolbar">
          <div class="toolbar-group">
            <el-button @click="insertText('**粗体**')" size="small" plain>
              <el-icon><SetUp /></el-icon>
              粗体
            </el-button>
            <el-button @click="insertText('*斜体*')" size="small" plain>
              <el-icon><Edit /></el-icon>
              斜体
            </el-button>
            <el-button @click="insertText('[链接文本](https://example.com)')" size="small" plain>
              <el-icon><Link /></el-icon>
              链接
            </el-button>
            <el-button @click="insertText('![图片描述](图片链接)')" size="small" plain>
              <el-icon><Picture /></el-icon>
              图片
            </el-button>
          </div>
          
          <div class="toolbar-group">
            <el-button @click="insertText('`行内代码`')" size="small" plain>
              <el-icon><Document /></el-icon>
              代码
            </el-button>
            <el-button @click="insertCodeBlock()" size="small" plain>
              <el-icon><Files /></el-icon>
              代码块
            </el-button>
            <el-button @click="insertText('> 引用文本')" size="small" plain>
              <el-icon><ChatDotRound /></el-icon>
              引用
            </el-button>
            <el-button @click="insertList()" size="small" plain>
              <el-icon><List /></el-icon>
              列表
            </el-button>
          </div>

          <div class="toolbar-group">
            <el-button @click="generateTOC" size="small" type="primary" plain>
              <el-icon><Menu /></el-icon>
              生成目录
            </el-button>
            <el-button @click="clearContent" size="small" type="danger" plain>
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
          </div>
        </div>

        <!-- 编辑器主体 -->
        <div class="editor-container">
          <!-- 源码编辑区 -->
          <div class="editor-pane">
            <div class="pane-header">
              <h4>Markdown源码</h4>
              <div class="pane-actions">
                <el-button @click="loadExample" size="small">
                  <el-icon><MagicStick /></el-icon>
                  加载示例
                </el-button>
                <el-button @click="copyMarkdown" size="small">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
              </div>
            </div>
            <div class="editor-wrapper">
              <textarea
                ref="editorRef"
                v-model="markdownContent"
                @input="onContentChange"
                @scroll="syncScroll"
                class="markdown-textarea"
                placeholder="在这里输入Markdown内容..."
              ></textarea>
              <div class="editor-info">
                <span>{{ getLineCount() }} 行</span>
                <span>{{ markdownContent.length }} 字符</span>
                <span>{{ getWordCount() }} 单词</span>
              </div>
            </div>
          </div>

          <!-- 分隔线 -->
          <div class="divider"></div>

          <!-- 预览区 -->
          <div class="preview-pane">
            <div class="pane-header">
              <h4>实时预览</h4>
              <div class="pane-actions">
                <el-button @click="copyHtml" size="small">
                  <el-icon><CopyDocument /></el-icon>
                  复制HTML
                </el-button>
                <el-button @click="downloadHtml" size="small" type="primary">
                  <el-icon><Download /></el-icon>
                  下载HTML
                </el-button>
              </div>
            </div>
            <div 
              ref="previewRef"
              class="preview-content"
              v-html="htmlContent"
              @scroll="syncPreviewScroll"
            ></div>
          </div>
        </div>

        <!-- 目录生成结果 -->
        <div v-if="tocResult" class="toc-section">
          <div class="toc-header">
            <h4>文档目录</h4>
            <div class="toc-actions">
              <el-button @click="copyTOC" size="small">
                <el-icon><CopyDocument /></el-icon>
                复制目录
              </el-button>
              <el-button @click="insertTOC" size="small" type="primary">
                <el-icon><Plus /></el-icon>
                插入到文档
              </el-button>
            </div>
          </div>
          <div class="toc-content">
            <pre>{{ tocResult }}</pre>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">处理时间:</span>
              <span class="stat-value">{{ processTime }}ms</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Markdown长度:</span>
              <span class="stat-value">{{ markdownContent.length }} 字符</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">HTML长度:</span>
              <span class="stat-value">{{ htmlLength }} 字符</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">标题数量:</span>
              <span class="stat-value">{{ headingCount }} 个</span>
            </div>
          </div>
        </div>

        <!-- 快捷键说明 -->
        <div class="help-section">
          <h4>快捷键说明</h4>
          <div class="help-grid">
            <div class="help-item">
              <kbd>Ctrl/Cmd + B</kbd>
              <span>粗体</span>
            </div>
            <div class="help-item">
              <kbd>Ctrl/Cmd + I</kbd>
              <span>斜体</span>
            </div>
            <div class="help-item">
              <kbd>Ctrl/Cmd + K</kbd>
              <span>链接</span>
            </div>
            <div class="help-item">
              <kbd>Ctrl/Cmd + Enter</kbd>
              <span>预览</span>
            </div>
          </div>
        </div>

        <!-- Markdown语法说明 -->
        <div class="syntax-help">
          <h4>Markdown语法快速参考</h4>
          <div class="syntax-grid">
            <div class="syntax-item">
              <div class="syntax-example"># 标题1</div>
              <div class="syntax-desc">一级标题</div>
            </div>
            <div class="syntax-item">
              <div class="syntax-example">**粗体**</div>
              <div class="syntax-desc">粗体文本</div>
            </div>
            <div class="syntax-item">
              <div class="syntax-example">*斜体*</div>
              <div class="syntax-desc">斜体文本</div>
            </div>
            <div class="syntax-item">
              <div class="syntax-example">[链接](URL)</div>
              <div class="syntax-desc">超链接</div>
            </div>
            <div class="syntax-item">
              <div class="syntax-example">![图片](URL)</div>
              <div class="syntax-desc">图片</div>
            </div>
            <div class="syntax-item">
              <div class="syntax-example">`代码`</div>
              <div class="syntax-desc">行内代码</div>
            </div>
            <div class="syntax-item">
              <div class="syntax-example">```代码块```</div>
              <div class="syntax-desc">代码块</div>
            </div>
            <div class="syntax-item">
              <div class="syntax-example">> 引用</div>
              <div class="syntax-desc">引用文本</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Edit,
  SetUp,
  Link,
  Picture,
  Document,
  Files,
  ChatDotRound,
  List,
  Menu,
  Delete,
  MagicStick,
  CopyDocument,
  Download,
  Plus
} from '@element-plus/icons-vue'
import { markdownTool, type ToolResponse } from '../../utils/newTools'

const markdownContent = ref('')
const htmlContent = ref('')
const tocResult = ref('')
const processTime = ref(0)
const htmlLength = ref(0)
const headingCount = ref(0)

const editorRef = ref<HTMLTextAreaElement>()
const previewRef = ref<HTMLDivElement>()

// 实时预览
const onContentChange = () => {
  const startTime = Date.now()
  
  if (!markdownContent.value.trim()) {
    htmlContent.value = '<p class="empty-tip">开始输入Markdown内容，右侧将实时显示预览效果...</p>'
    htmlLength.value = 0
    headingCount.value = 0
    processTime.value = 0
    return
  }

  try {
    const response = markdownTool.preview(markdownContent.value)
    
    if (response.success) {
      htmlContent.value = response.result
      htmlLength.value = response.extra?.htmlLength || 0
      headingCount.value = (markdownContent.value.match(/^#+\s/gm) || []).length
      processTime.value = Date.now() - startTime
    } else {
      ElMessage.error(response.error || '预览生成失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '预览生成失败')
  }
}

// 生成目录
const generateTOC = () => {
  if (!markdownContent.value.trim()) {
    ElMessage.warning('请先输入Markdown内容')
    return
  }

  try {
    const response = markdownTool.getTableOfContents(markdownContent.value)
    
    if (response.success) {
      tocResult.value = response.result
      ElMessage.success(`成功生成目录，包含${response.extra?.totalHeadings || 0}个标题`)
    } else {
      ElMessage.error(response.error || '目录生成失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '目录生成失败')
  }
}

// 插入文本
const insertText = (text: string) => {
  if (!editorRef.value) return

  const textarea = editorRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = markdownContent.value.substring(start, end)
  
  let insertedText = text
  
  // 如果选中了文本，替换占位符
  if (selectedText) {
    if (text.includes('**粗体**')) {
      insertedText = `**${selectedText}**`
    } else if (text.includes('*斜体*')) {
      insertedText = `*${selectedText}*`
    } else if (text.includes('[链接文本]')) {
      insertedText = `[${selectedText}](https://example.com)`
    } else if (text.includes('`行内代码`')) {
      insertedText = `\`${selectedText}\``
    }
  }
  
  markdownContent.value = 
    markdownContent.value.substring(0, start) + 
    insertedText + 
    markdownContent.value.substring(end)
  
  // 设置光标位置
  nextTick(() => {
    textarea.focus()
    const newPosition = start + insertedText.length
    textarea.setSelectionRange(newPosition, newPosition)
  })
  
  onContentChange()
}

// 插入代码块
const insertCodeBlock = () => {
  const codeBlock = '\n```javascript\n// 在这里输入代码\nconsole.log("Hello World!");\n```\n'
  insertText(codeBlock)
}

// 插入列表
const insertList = () => {
  const list = '\n- 列表项1\n- 列表项2\n- 列表项3\n'
  insertText(list)
}

// 加载示例
const loadExample = () => {
  markdownContent.value = `# Markdown编辑器示例

欢迎使用**WG-Tools**的Markdown编辑器！这是一个功能强大的在线编辑器。

## 功能特点

- **实时预览**: 左侧编辑，右侧实时显示预览效果
- **语法高亮**: 支持完整的Markdown语法
- **目录生成**: 自动生成文档目录结构
- **快捷操作**: 提供常用格式化按钮

## 文本格式

### 基本格式

这是一段普通文本。

*这是斜体文本*

**这是粗体文本**

***这是粗斜体文本***

~~这是删除线文本~~

### 代码

行内代码：\`console.log("Hello World")\`

代码块：

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

### 链接和图片

[WG-Tools官网](https://wg-tools.com)

![示例图片](https://via.placeholder.com/300x200)

### 引用

> 这是一段引用文本。
> 
> 可以包含多行内容。

### 列表

无序列表：
- 项目1
- 项目2
  - 子项目1
  - 子项目2
- 项目3

有序列表：
1. 第一项
2. 第二项
3. 第三项

### 表格

| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |
| 王五 | 28   | 广州 |

## 总结

这个Markdown编辑器提供了完整的编辑和预览功能，希望对您的文档编写有所帮助！`

  onContentChange()
  ElMessage.success('示例内容已加载')
}

// 复制Markdown
const copyMarkdown = async () => {
  try {
    await navigator.clipboard.writeText(markdownContent.value)
    ElMessage.success('Markdown内容已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 复制HTML
const copyHtml = async () => {
  try {
    await navigator.clipboard.writeText(htmlContent.value)
    ElMessage.success('HTML内容已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 下载HTML
const downloadHtml = () => {
  try {
    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown文档</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; }
        h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: .3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: .3em; }
        p { margin-bottom: 16px; }
        code { background-color: rgba(27,31,35,.05); border-radius: 3px; font-size: 85%; margin: 0; padding: .2em .4em; }
        pre { background-color: #f6f8fa; border-radius: 6px; font-size: 85%; line-height: 1.45; overflow: auto; padding: 16px; }
        blockquote { border-left: .25em solid #dfe2e5; color: #6a737d; margin: 0 0 16px 0; padding: 0 1em; }
        table { border-collapse: collapse; margin: 24px 0; }
        th, td { border: 1px solid #dfe2e5; padding: 6px 13px; }
        th { background-color: #f6f8fa; font-weight: 600; }
        img { max-width: 100%; }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        ul, ol { margin-bottom: 16px; padding-left: 2em; }
        li { margin-bottom: 0.25em; }
    </style>
</head>
<body>
${htmlContent.value}
</body>
</html>`

    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `markdown_document_${Date.now()}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    ElMessage.success('HTML文件下载成功')
  } catch (error) {
    ElMessage.error('下载失败')
  }
}

// 复制目录
const copyTOC = async () => {
  try {
    await navigator.clipboard.writeText(tocResult.value)
    ElMessage.success('目录已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 插入目录
const insertTOC = () => {
  if (!tocResult.value) return
  
  const tocContent = `\n## 目录\n\n${tocResult.value}\n\n`
  markdownContent.value = tocContent + markdownContent.value
  onContentChange()
  ElMessage.success('目录已插入到文档开头')
}

// 清空内容
const clearContent = () => {
  markdownContent.value = ''
  htmlContent.value = ''
  tocResult.value = ''
  onContentChange()
  ElMessage.success('内容已清空')
}

// 滚动同步
const syncScroll = () => {
  if (!editorRef.value || !previewRef.value) return
  
  const editor = editorRef.value
  const preview = previewRef.value
  
  const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight)
  const previewScrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight)
  
  preview.scrollTop = previewScrollTop
}

const syncPreviewScroll = () => {
  if (!editorRef.value || !previewRef.value) return
  
  const editor = editorRef.value
  const preview = previewRef.value
  
  const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight)
  const editorScrollTop = scrollPercentage * (editor.scrollHeight - editor.clientHeight)
  
  editor.scrollTop = editorScrollTop
}

// 统计信息
const getLineCount = () => {
  return markdownContent.value.split('\n').length
}

const getWordCount = () => {
  return markdownContent.value.trim().split(/\s+/).filter(word => word.length > 0).length
}

// 快捷键支持
const handleKeyDown = (event: KeyboardEvent) => {
  const { ctrlKey, metaKey, key } = event
  const isCtrlOrCmd = ctrlKey || metaKey

  if (isCtrlOrCmd) {
    switch (key.toLowerCase()) {
      case 'b':
        event.preventDefault()
        insertText('**粗体**')
        break
      case 'i':
        event.preventDefault()
        insertText('*斜体*')
        break
      case 'k':
        event.preventDefault()
        insertText('[链接文本](https://example.com)')
        break
      case 'enter':
        event.preventDefault()
        // 切换预览焦点或其他操作
        break
    }
  }
}

// 生命周期
onMounted(() => {
  onContentChange()
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.markdown-editor {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  border-radius: 16px;
  color: white;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.hero-description {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}

/* 工具卡片样式 */
.tool-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(45deg, #f8fafc, #e2e8f0);
  padding: 20px 30px;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-description {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.card-body {
  padding: 30px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid #e2e8f0;
}

.toolbar-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.toolbar-group .el-button {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  transition: all 0.3s ease;
}

.toolbar-group .el-button:hover {
  background: #7c3aed;
  border-color: #7c3aed;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  gap: 24px;
  min-height: 650px;
  margin-bottom: 30px;
}

.editor-pane,
.preview-pane {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(45deg, #f8fafc, #e2e8f0);
  border-bottom: 1px solid #e5e7eb;
}

.pane-header h4 {
  margin: 0;
  color: #374151;
  font-size: 16px;
  font-weight: 600;
}

.pane-actions {
  display: flex;
  gap: 8px;
}

.pane-actions .el-button {
  border-radius: 6px;
  font-size: 12px;
}

.editor-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.markdown-textarea {
  flex: 1;
  border: none;
  padding: 20px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  background: #fafafa;
  color: #374151;
}

.markdown-textarea:focus {
  background: #ffffff;
}

.editor-info {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-top: 1px solid #e5e7eb;
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.divider {
  width: 2px;
  background: linear-gradient(to bottom, #e2e8f0, #cbd5e1, #e2e8f0);
  border-radius: 1px;
}

.preview-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  color: #374151;
}

.preview-content :deep(h1),
.preview-content :deep(h2),
.preview-content :deep(h3),
.preview-content :deep(h4),
.preview-content :deep(h5),
.preview-content :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.preview-content :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: .3em;
}

.preview-content :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: .3em;
}

.preview-content :deep(p) {
  margin-bottom: 16px;
}

.preview-content :deep(code) {
  background-color: rgba(27,31,35,.05);
  border-radius: 3px;
  font-size: 85%;
  margin: 0;
  padding: .2em .4em;
}

.preview-content :deep(pre) {
  background-color: #f6f8fa;
  border-radius: 6px;
  font-size: 85%;
  line-height: 1.45;
  overflow: auto;
  padding: 16px;
}

.preview-content :deep(blockquote) {
  border-left: .25em solid #dfe2e5;
  color: #6a737d;
  margin: 0 0 16px 0;
  padding: 0 1em;
}

.preview-content :deep(table) {
  border-collapse: collapse;
  margin: 24px 0;
  width: 100%;
}

.preview-content :deep(th),
.preview-content :deep(td) {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

.preview-content :deep(th) {
  background-color: #f6f8fa;
  font-weight: 600;
}

.preview-content :deep(img) {
  max-width: 100%;
}

.preview-content :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.preview-content :deep(a:hover) {
  text-decoration: underline;
}

.preview-content :deep(ul),
.preview-content :deep(ol) {
  margin-bottom: 16px;
  padding-left: 2em;
}

.preview-content :deep(li) {
  margin-bottom: 0.25em;
}

.empty-tip {
  color: #9ca3af;
  text-align: center;
  font-style: italic;
}

.toc-section {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #bae6fd;
}

.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toc-header h4 {
  margin: 0;
  color: #0c4a6e;
}

.toc-actions {
  display: flex;
  gap: 8px;
}

.toc-content {
  background: white;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #bae6fd;
}

.toc-content pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #1f2937;
  white-space: pre-wrap;
}

.stats-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.help-section {
  background: #f0fdf4;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #bbf7d0;
}

.help-section h4 {
  margin: 0 0 16px 0;
  color: #065f46;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.help-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #d1fae5;
}

kbd {
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 12px;
  color: #475569;
}

.syntax-help {
  background: #fef7ff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #f3e8ff;
}

.syntax-help h4 {
  margin: 0 0 16px 0;
  color: #7c2d12;
}

.syntax-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.syntax-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9d5ff;
}

.syntax-example {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #7c2d12;
  background: #fef3e2;
  padding: 4px 8px;
  border-radius: 4px;
}

.syntax-desc {
  font-size: 12px;
  color: #92400e;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .editor-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
  
  .divider {
    width: 100%;
    height: 1px;
  }
}

@media (max-width: 768px) {
  .markdown-editor {
    padding: 16px;
  }
  
  .card-header {
    padding: 20px 16px;
  }
  
  .card-body {
    padding: 20px 16px;
  }
  
  .toolbar {
    flex-direction: column;
    gap: 8px;
  }
  
  .toolbar-group {
    justify-content: center;
  }
  
  .pane-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .pane-actions {
    width: 100%;
    justify-content: center;
  }
  
  .help-grid,
  .syntax-grid {
    grid-template-columns: 1fr;
  }
}
</style>
