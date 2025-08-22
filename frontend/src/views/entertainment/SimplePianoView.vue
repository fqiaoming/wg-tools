<template>
  <div class="page-container">
    <div class="app-content">
      <div class="component-autopiano">
         <!-- 钢琴选项 -->
        <div class="piano-options">
          <div class="option-item-wrap">
            <div class="option-item">
              <label class="label">
                显示按键提示
                <input type="checkbox" id="keyname" v-model="showKeyNames"> 
                <i></i>
              </label>
            </div>
            <div class="option-item">
              <label class="label">
                显示音名
                <input type="checkbox" id="notename" v-model="showNoteNames"> 
                <i></i>
              </label>
            </div>
          </div>
        </div>
        <!-- 钢琴键盘 -->
        <div class="piano-scroll-wrap">
          <div class="piano-wrap visible">
            <div class="piano-band">
              <div class="piano-brand-logo">WG-Tools Piano</div>
              <div class="piano-tip">⇧ 代表 shift 键</div>
            </div>
            <div class="piano-key-wrap" style="height: 223.648px;">
              <!-- 白键 -->
              <div 
                v-for="key in whiteKeys" 
                :key="key.note"
                :data-keycode="key.keyCode" 
                :data-name="key.note" 
                :class="['piano-key', 'wkey', { 
                  'wkey-active': pressedKeys.has(key.note)
                }]"
                @mousedown="playNote(key.note)"
                @mouseup="stopNote(key.note)"
                @mouseleave="stopNote(key.note)"
              >
                <div class="keytip">
                  <div class="keyname" v-show="showKeyNames">{{ key.binding }}</div>
                  <div class="notename" v-show="showNoteNames">{{ key.note }}</div>
                </div>
              </div>

              <!-- 黑键分组 -->
              <div v-for="(group, index) in blackKeyGroups" :key="index" :class="`bkey-wrap bkey-wrap${index + 1}`">
                <div 
                  v-for="key in group" 
                  :key="key.note"
                  :data-keycode="key.keyCode" 
                  :data-name="key.note" 
                  :class="['piano-key', 'bkey', { 
                    'bkey-active': pressedKeys.has(key.note)
                  }]"
                  @mousedown="playNote(key.note)"
                  @mouseup="stopNote(key.note)"
                  @mouseleave="stopNote(key.note)"
                  style="height: 164.554px;"
                >
                  <div class="keytip">
                    <div class="keyname" v-show="showKeyNames">⇧<br>+<br>{{ key.binding }}</div>
                    <div class="notename" v-show="showNoteNames">{{ key.note }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>

      <!-- 按键教程区域 - 紧挨着钢琴 -->
      <div class="piano-guide-section" v-if="currentSong">
        <div class="guide-container">
          <div class="guide-header">
            <h3 class="guide-title">
              <span class="guide-icon">🎵</span>
              正在练习：{{ currentSong.name }}
              <span class="guide-author" v-if="currentSong.author">- {{ currentSong.author }}</span>
            </h3>
            <button @click="backToList" class="back-btn">
              ← 返回歌曲列表
            </button>
          </div>
          
          <div class="guide-content">
                      <div class="current-note-display" v-if="currentNoteIndex < currentSong.notes.length">
            <div class="note-hint">
              <span class="hint-label">请按下键盘按键：</span>
              <span class="hint-key-large">{{ getKeyForNote(currentSong.notes[currentNoteIndex].note) || currentSong.notes[currentNoteIndex].note }}</span>
            </div>
              <div class="progress-info">
                <span class="progress-text">进度: {{ currentNoteIndex + 1 }} / {{ currentSong.notes.length }}</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: ((currentNoteIndex + 1) / currentSong.notes.length * 100) + '%' }"></div>
                </div>
              </div>
            </div>
            
            <div class="completion-message" v-else>
              <div class="celebration">
                🎉 恭喜！《{{ currentSong.name }}》演奏完成！🎉
              </div>
              <button @click="resetGuide" class="restart-btn">🔄 重新练习</button>
            </div>

            <div class="note-sequence">
              <div class="sequence-title">曲谱预览：</div>
              <div class="notes-display-container">
                              <div class="notes-display" ref="notesDisplayRef">
                <span 
                  v-for="(noteObj, index) in currentSong.notes"
                  :key="`note-${index}`"
                  :class="['note-item', { 
                    'current': currentNoteIndex === index, 
                    'played': index < currentNoteIndex,
                    'sentence-end': noteObj.isLastInSentence && index < currentSong.notes.length - 1
                  }]"
                  @click="playNoteFromScore(noteObj.note, index)"
                >
                  {{ noteObj.note }}
                </span>
              </div>
              </div>
            </div>

            <div class="song-lyrics" v-if="currentSong.lyrics">
              <div class="lyrics-title">歌词：</div>
              <div class="lyrics-content">{{ currentSong.lyrics }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 曲谱区域 - 只在未选择歌曲时显示 -->
      <div class="score-section" v-if="!currentSong">
        <!-- 新手入门曲库 -->
        <div class="score-container component-beginner-list">
          <div class="list-view">
            <p class="component-title">
              <span class="title-icon">🎵</span>
              <span class="title">新手入门</span>
              <span class="degree">难度 ⭐</span>
            </p>
            <ol class="list score-list">
              <li 
                v-for="(song, index) in beginnerSongs" 
                :key="song.id"
                class="list-item score-item"
                @click="selectSong(song)"
              >
                <span class="num">{{ index + 1 }}</span>
                <a href="javascript:;">{{ song.name }}</a>
                <span class="song-author" v-if="song.author">{{ song.author }}</span>
                <span class="difficulty-degree">
                  <i v-for="n in song.difficulty" :key="n" class="icon-star"></i>
                </span>
              </li>
            </ol>
          </div>
        </div>

        <!-- 流行热门曲库 -->
        <div class="score-container component-popular-list">
          <div class="list-view">
            <p class="component-title">
              <span class="title-icon">🎤</span>
              <span class="title">流行热门</span>
              <span class="degree">精选</span>
            </p>
            <ol class="list score-list">
              <li 
                v-for="(song, index) in popularSongs.slice(0, 12)" 
                :key="song.id"
                class="list-item score-item"
                @click="selectSong(song)"
              >
                <span class="num">{{ index + 1 }}</span>
                <a href="javascript:;">{{ song.name }}</a>
                <span class="song-author" v-if="song.author">{{ song.author }}</span>
                <span class="difficulty-degree">
                  <i v-for="n in song.difficulty" :key="n" class="icon-heartbeat"></i>
                </span>
              </li>
            </ol>
          </div>
        </div>

        <!-- 经典名曲曲库 -->
        <div class="score-container component-classic-list" v-if="classicSongs.length > 0">
          <div class="list-view">
            <p class="component-title">
              <span class="title-icon">🎹</span>
              <span class="title">经典名曲</span>
              <span class="degree">永恒</span>
            </p>
            <ol class="list score-list">
              <li 
                v-for="(song, index) in classicSongs" 
                :key="song.id"
                class="list-item score-item"
                @click="selectSong(song)"
              >
                <span class="num">{{ index + 1 }}</span>
                <a href="javascript:;">{{ song.name }}</a>
                <span class="song-author" v-if="song.author">{{ song.author }}</span>
                <span class="difficulty-degree">
                  <i v-for="n in song.difficulty" :key="n" class="icon-star"></i>
                </span>
              </li>
            </ol>
          </div>
        </div>

        <!-- 高难度挑战 -->
        <div class="score-container component-expert-list" v-if="expertSongs.length > 0">
          <div class="list-view">
            <p class="component-title">
              <span class="title-icon">🔥</span>
              <span class="title">高手挑战</span>
              <span class="degree">挑战</span>
            </p>
            <ol class="list score-list">
              <li 
                v-for="(song, index) in expertSongs" 
                :key="song.id"
                class="list-item score-item expert-item"
                @click="selectSong(song)"
              >
                <span class="num expert-num">{{ index + 1 }}</span>
                <a href="javascript:;">{{ song.name }}</a>
                <span class="song-author" v-if="song.author">{{ song.author }}</span>
                <span class="difficulty-degree">
                  <i v-for="n in song.difficulty" :key="n" class="icon-fire"></i>
                </span>
              </li>
            </ol>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

// 类型定义
interface Song {
  id: number
  name: string
  difficulty: number
  category: string
  notes: { note: string; sentence: number; isLastInSentence: boolean }[]
  lyrics?: string
  score: string
  author?: string
  authorLink?: string
}

// 响应式数据
const pressedKeys = ref(new Set<string>())
const showKeyNames = ref(true)
const showNoteNames = ref(false)

// 曲子演奏相关
const currentSong = ref<Song | null>(null)
const currentNoteIndex = ref(0)

// DOM引用
const notesDisplayRef = ref<HTMLElement | null>(null)

// 音频缓存 - 使用简单的HTML5 Audio
const audioCache = new Map<string, HTMLAudioElement>()

// 钢琴键位映射 - 根据图片文件列表，正确分配白键(a开头)和黑键(b开头)
const noteToFile: Record<string, string> = {
  // 白键按钢琴顺序映射a开头文件
  'C2': 'a49.mp3',   // 第1个白键 -> 1键
  'D2': 'a50.mp3',   // 第2个白键 -> 2键
  'E2': 'a51.mp3',   // 第3个白键 -> 3键
  'F2': 'a52.mp3',   // 第4个白键 -> 4键
  'G2': 'a53.mp3',   // 第5个白键 -> 5键 (跳过b53)
  'A2': 'a54.mp3',   // 第6个白键 -> 6键
  'B2': 'a55.mp3',   // 第7个白键 -> 7键 (跳过b56中的b)
  'C3': 'a56.mp3',   // 第8个白键 -> 8键
  'D3': 'a57.mp3',   // 第9个白键 -> 9键
  'E3': 'a48.mp3',   // 第10个白键 -> 0键 ✅ 白键用a开头!
  'F3': 'a81.mp3',   // 第11个白键 -> Q键
  'G3': 'a87.mp3',   // 第12个白键 -> W键
  'A3': 'a69.mp3',   // 第13个白键 -> E键
  'B3': 'a82.mp3',   // 第14个白键 -> R键 (跳过b84中的b)
  'C4': 'a84.mp3',   // 第15个白键 -> T键 (中央C)
  'D4': 'a89.mp3',   // 第16个白键 -> Y键
  'E4': 'a85.mp3',   // 第17个白键 -> U键 (跳过b73中的b)
  'F4': 'a73.mp3',   // 第18个白键 -> I键
  'G4': 'a79.mp3',   // 第19个白键 -> O键
  'A4': 'a80.mp3',   // 第20个白键 -> P键
  'B4': 'a65.mp3',   // 第21个白键 -> A键
  'C5': 'a83.mp3',   // 第22个白键 -> S键 (跳过b83中的b)
  'D5': 'a68.mp3',   // 第23个白键 -> D键 (跳过b68中的b)
  'E5': 'a70.mp3',   // 第24个白键 -> F键
  'F5': 'a71.mp3',   // 第25个白键 -> G键 (跳过b71中的b)
  'G5': 'a72.mp3',   // 第26个白键 -> H键 (跳过b72中的b)
  'A5': 'a74.mp3',   // 第27个白键 -> J键 (跳过b74中的b)
  'B5': 'a75.mp3',   // 第28个白键 -> K键
  'C6': 'a76.mp3',   // 第29个白键 -> L键 (跳过b76中的b)
  'D6': 'a90.mp3',   // 第30个白键 -> Z键 (跳过b80中的b)
  'E6': 'a88.mp3',   // 第31个白键 -> X键
  'F6': 'a67.mp3',   // 第32个白键 -> C键 (跳过b86中的b)
  'G6': 'a86.mp3',   // 第33个白键 -> V键 (跳过b66中的b)
  'A6': 'a66.mp3',   // 第34个白键 -> B键
  'B6': 'a78.mp3',   // 第35个白键 -> N键 (跳过b87中的b)
  'C7': 'a77.mp3',   // 第36个白键 -> M键

  // 黑键按钢琴顺序映射b开头文件
  'C#2': 'b49.mp3',  // 第1个黑键 -> Shift+1
  'D#2': 'b50.mp3',  // 第2个黑键 -> Shift+2
  'F#2': 'b52.mp3',  // 第3个黑键 -> Shift+4
  'G#2': 'b53.mp3',  // 第4个黑键 -> Shift+5
  'A#2': 'b54.mp3',  // 第5个黑键 -> Shift+6
  'C#3': 'b56.mp3',  // 第5个黑键 -> Shift+6
  'D#3': 'b57.mp3',  // 第6个黑键 -> Shift+8
  'F#3': 'b81.mp3',  // 第7个黑键 -> Shift+9
  'G#3': 'b87.mp3',  // 第8个黑键 -> Shift+Q
  'A#3': 'b69.mp3',  // 第9个黑键 -> Shift+W
  'C#4': 'b84.mp3',  // 第10个黑键 -> Shift+E
  'D#4': 'b89.mp3',  // 第11个黑键 -> Shift+T
  'F#4': 'b73.mp3',  // 第12个黑键 -> Shift+Y
  'G#4': 'b79.mp3',  // 第13个黑键 -> Shift+I
  'A#4': 'b80.mp3',  // 第14个黑键 -> Shift+O
  'C#5': 'b83.mp3',  // 第15个黑键 -> Shift+P
  'D#5': 'b68.mp3',  // 第16个黑键 -> Shift+S
  'F#5': 'b71.mp3',  // 第17个黑键 -> Shift+D
  'G#5': 'b72.mp3',  // 第18个黑键 -> Shift+G
  'A#5': 'b74.mp3',  // 第19个黑键 -> Shift+H
  'C#6': 'b76.mp3',  // 第20个黑键 -> Shift+J
  'D#6': 'b90.mp3',  // 第21个黑键 -> Shift+L
  'F#6': 'b67.mp3',  // 第22个黑键 -> Shift+Z
  'G#6': 'b86.mp3',  // 第23个黑键 -> Shift+C
  'A#6': 'b66.mp3',  // 第24个黑键 -> Shift+V
}

// 白键配置
const whiteKeys = ref([
  { note: 'C2', binding: '1', keyCode: 49 },
  { note: 'D2', binding: '2', keyCode: 50 },
  { note: 'E2', binding: '3', keyCode: 51 },
  { note: 'F2', binding: '4', keyCode: 52 },
  { note: 'G2', binding: '5', keyCode: 53 },
  { note: 'A2', binding: '6', keyCode: 54 },
  { note: 'B2', binding: '7', keyCode: 55 },
  { note: 'C3', binding: '8', keyCode: 56 },
  { note: 'D3', binding: '9', keyCode: 57 },
  { note: 'E3', binding: '0', keyCode: 48 },
  { note: 'F3', binding: 'Q', keyCode: 81 },
  { note: 'G3', binding: 'W', keyCode: 87 },
  { note: 'A3', binding: 'E', keyCode: 69 },
  { note: 'B3', binding: 'R', keyCode: 82 },
  { note: 'C4', binding: 'T', keyCode: 84 },
  { note: 'D4', binding: 'Y', keyCode: 89 },
  { note: 'E4', binding: 'U', keyCode: 85 },
  { note: 'F4', binding: 'I', keyCode: 73 },
  { note: 'G4', binding: 'O', keyCode: 79 },
  { note: 'A4', binding: 'P', keyCode: 80 },
  { note: 'B4', binding: 'A', keyCode: 65 },
  { note: 'C5', binding: 'S', keyCode: 83 },
  { note: 'D5', binding: 'D', keyCode: 68 },
  { note: 'E5', binding: 'F', keyCode: 70 },
  { note: 'F5', binding: 'G', keyCode: 71 },
  { note: 'G5', binding: 'H', keyCode: 72 },
  { note: 'A5', binding: 'J', keyCode: 74 },
  { note: 'B5', binding: 'K', keyCode: 75 },
  { note: 'C6', binding: 'L', keyCode: 76 },
  { note: 'D6', binding: 'Z', keyCode: 90 },
  { note: 'E6', binding: 'X', keyCode: 88 },
  { note: 'F6', binding: 'C', keyCode: 67 },
  { note: 'G6', binding: 'V', keyCode: 86 },
  { note: 'A6', binding: 'B', keyCode: 66 },
  { note: 'B6', binding: 'N', keyCode: 78 },
  { note: 'C7', binding: 'M', keyCode: 77 }
])

// 黑键分组配置
const blackKeyGroups = ref([
  [
    { note: 'C#2', binding: '1', keyCode: 'b49' },
    { note: 'D#2', binding: '2', keyCode: 'b50' },
    { note: 'F#2', binding: '4', keyCode: 'b52' },
    { note: 'G#2', binding: '5', keyCode: 'b53' },
    { note: 'A#2', binding: '6', keyCode: 'b54' }
  ],
  [
    { note: 'C#3', binding: '8', keyCode: 'b56' },
    { note: 'D#3', binding: '9', keyCode: 'b57' },
    { note: 'F#3', binding: 'Q', keyCode: 'b81' },
    { note: 'G#3', binding: 'W', keyCode: 'b87' },
    { note: 'A#3', binding: 'E', keyCode: 'b69' }
  ],
  [
    { note: 'C#4', binding: 'T', keyCode: 'b84' },
    { note: 'D#4', binding: 'Y', keyCode: 'b89' },
    { note: 'F#4', binding: 'I', keyCode: 'b73' },
    { note: 'G#4', binding: 'O', keyCode: 'b79' },
    { note: 'A#4', binding: 'P', keyCode: 'b80' }
  ],
  [
    { note: 'C#5', binding: 'S', keyCode: 'b83' },
    { note: 'D#5', binding: 'D', keyCode: 'b68' },
    { note: 'F#5', binding: 'G', keyCode: 'b71' },
    { note: 'G#5', binding: 'H', keyCode: 'b72' },
    { note: 'A#5', binding: 'J', keyCode: 'b74' }
  ],
  [
    { note: 'C#6', binding: 'L', keyCode: 'b76' },
    { note: 'D#6', binding: 'Z', keyCode: 'b90' },
    { note: 'F#6', binding: 'C', keyCode: 'b67' },
    { note: 'G#6', binding: 'V', keyCode: 'b86' },
    { note: 'A#6', binding: 'B', keyCode: 'b66' }
  ]
])

// 将曲库.js中的content字符串转换为带分句信息的notes数组
const parseContentToNotes = (content: string): { note: string; sentence: number; isLastInSentence: boolean }[] => {
  // 按 <br> 标签分句，保留每句的完整性
  const sentences = content
    .replace(/\n/g, ' ') // 移除换行符
    .replace(/停顿/g, '') // 移除停顿标记
    .replace(/高潮/g, '') // 移除高潮标记
    .split(/<br\/?>/g) // 按 <br> 分句
    .filter(sentence => sentence.trim()) // 移除空句子
  
  const result: { note: string; sentence: number; isLastInSentence: boolean }[] = []
  
  sentences.forEach((sentence, sentenceIndex) => {
    // 清理每句内容
    const cleanSentence = sentence
      .replace(/~/g, ' ') // 将 ~ 替换为空格（延音符号）
      .replace(/</g, '') // 移除所有 < 字符
      .replace(/>/g, '') // 移除所有 > 字符
      .replace(/\//g, '') // 移除所有 / 字符
      .replace(/br/g, '') // 移除残留的 br 文本
      .replace(/\s+/g, ' ') // 合并多个空格
      .trim()
    
    // 将句子拆分为音符
    const notes = cleanSentence.split('').filter(char => {
      // 只保留有效的音符字符（字母、数字、部分符号）
      return char !== ' ' && /[a-zA-Z0-9()^~]/.test(char)
    })
    
    // 添加音符到结果数组，标记句子信息
    notes.forEach((note, noteIndex) => {
      result.push({
        note: note,
        sentence: sentenceIndex,
        isLastInSentence: noteIndex === notes.length - 1
      })
    })
  })
  
  return result
}

// 完整的内置歌曲列表 - 集成曲库.js中的所有歌曲
const songList = ref([
  // === 基础入门 (难度1-2) ===
  {
    id: 1,
    name: '祝你生日快乐',
    difficulty: 1,
    category: 'beginner',
    notes: parseContentToNotes("oopo sa<br> oopo ds <br> oo h f s a p<br> gg f s d s<br> oopo sa<br> oopo ds <br> oo h f s a p<br> gg f s d fs"),
    lyrics: "Happy Birthday to You \nHappy Birthday to You\nHappy Birthday to You \nHappy Birthday to You",
    score: 'oopo sa\noopo ds\noo h f s a p\ngg f s d fs',
    author: 'Traditional'
  },
  {
    id: 2,
    name: '小星星',
    difficulty: 1,
    category: 'beginner', 
    notes: parseContentToNotes("sshhjjh ggffdds <br/> hhggffd hhggffd <br/> sshhjjh ggffdds"),
    lyrics: "Little Star \nTwinkle, twinkle, little star \nHow I wonder what you are \nUp above the world so high \nLike a diamond in the sky \nWhen the blazing sun is gone",
    score: 'sshhjjh ggffdds\nhhggffd hhggffd\nsshhjjh ggffdds',
    author: 'Traditional'
  },
  {
    id: 3,
    name: '新年好',
    difficulty: 1,
    category: 'beginner',
    notes: parseContentToNotes("ssso fffs sfhhgfd dfgg fdfs sfdo ads <br/> ssso fffs sfhhgfd dfgg fdfs sfdo ads"),
    lyrics: "新年好呀，新年好呀\n祝贺大家新年好\n我们唱歌，我们跳舞\n祝贺大家新年好",
    score: 'ssso fffs sfhhgfd dfgg fdfs sfdo ads',
    author: 'Traditional'
  },
  {
    id: 4,
    name: '送别',
    difficulty: 1,
    category: 'beginner',
    notes: parseContentToNotes("O UOS P S O<br/> O TYU YTY<br/> O UOS AP S O<br/> O YUI RT<br/> PSS A PAS<br/> PASPPOUTY<br/> O UOS AP SO<br/> O YUI RT"),
    lyrics: "长亭外，古道边，\n芳草碧连天。\n晚风拂柳笛声残，\n夕阳山外山。\n天之涯，地之角，\n知交半零落；\n一壶浊酒尽余欢，\n今宵别梦寒。",
    score: 'O UOS P S O\nO TYU YTY\nO UOS AP S O\nO YUI RT',
    author: 'Fake'
  },
  {
    id: 5,
    name: '天之大',
    difficulty: 1,
    category: 'beginner',
    notes: parseContentToNotes("JH JLJH LZX ZLJL<br/> JHJLZXZLZ<br/> JH JLJH LZX ZLJL<br/> JHJLZXZLL<br/> XVV XVBMB XXVZL<br/> XVV XVBMBXZ<br/> XVV XVBMB XXVZL<br/> JHJLZXZLL"),
    lyrics: "妈妈 月光之下 静静的 我想你了\n静静淌在血里的牵挂\n妈妈 你的怀抱 我一生 爱的襁褓\n有你晒过的衣服味道\n天之大 唯有你的爱 是完美无瑕\n天之大 记得你用心传话\n天之大 唯有你的爱 我交给了他\n让他的笑像极了 妈妈",
    score: 'JH JLJH LZX ZLJL\nJHJLZXZLZ',
    author: '翾'
  },
  {
    id: 6,
    name: '同桌的你',
    difficulty: 1,
    category: 'beginner',
    notes: parseContentToNotes("ooo oui o a ~ ppp pip o <br> ooo oap i i ~ iii iuy t <br> sss sop s f ~ ddd d s ap <br> aaa aas d o ~ aas d s as sss sop s f ~ ddd d s ap <br> aaa aas d o ~ aas d s as"),
    lyrics: '明天你是否会想起\n昨天你写的日记\n明天你是否还惦记\n曾经最爱哭的你',
    score: 'ooo oui o a\nppp pip o\nsss sop s f\nddd d s ap',
    author: 'Traditional'
  },

  // === 流行歌曲 (难度2-3) ===
  {
    id: 7,
    name: '隐形的翅膀',
    difficulty: 2,
    category: 'popular',
    notes: parseContentToNotes("osf hf dsss spoo <br> osf hhh jh hdfd sdd <br> jhf hhhjh fdsdp <br> ops fd fs <br> fhl lk jhjl fds ss sl jh fd sdd <br> 停顿 <br> fhl lk jhjl fds ss sl jh fd ds s"),
    lyrics: '每一次都在徘徊孤单中坚强\n每一次就算很受伤也不闪泪光',
    score: 'osf hf dsss spoo\nosf hhh jh hdfd sdd',
    author: 'Traditional'
  },
  {
    id: 8,
    name: '晴天',
    difficulty: 2,
    category: 'popular',
    notes: parseContentToNotes("fdgf shk lkhs ~ sjj jhh hgf dfgf <br> fghf ghk zkll ~ llh hjhg dfgh js j kk <br> fdgf shk lkhs ~ sjj jhh hgf dfgf <br> fghf ghk zkll ~ llh hjhg pasd fd s s"),
    lyrics: "晴天 ~ 周杰伦 \n刮风这天我试过握着你手 \n但偏偏雨渐渐大到我看你不见 \n还要多久我才能在你身边 \n等到放晴的那天也许我会比较好一点 \n从前从前有个人爱你很久 \n但偏偏风渐渐把距离吹得好远 \n好不容易又能再多爱一天 \n但故事的最后你好像还是说了拜拜",
    score: 'fdgf shk lkhs\nsjj jhh hgf dfgf',
    author: '周杰伦'
  },
  {
    id: 9,
    name: '天空之城',
    difficulty: 2,
    category: 'popular',
    notes: parseContentToNotes("PAS ASFA~ UP OPSO~ IUI UISU SSSA (^I) IAA <br/> PAS ASFA~ UP OPSO~ YUI SA SD FS~ SAP AOP <br/> SDF DFHD OOS ASFF <br/> PAS ASD SOO~ GFDSF~ F J J H H FDS<br/> S DS DHF~ F J J H H FDS ~ S DS DAP"),
    lyrics: '君をのせて\n伴随着你\n天空之城主题曲',
    score: 'PAS ASFA~ UP OPSO~\nIUI UISU SSSA',
    author: 'ShawNa'
  },
  {
    id: 10,
    name: '突然好想你(选段)',
    difficulty: 2,
    category: 'popular',
    notes: parseContentToNotes("W U UT YT R T~ T I IU IU I O Y<br> T R T PP A D S A P OO P U<br> T R T O OO I E R T<br> W U UT YT R T~ T I IU IU I O Y<br> T R T P~ P A DSAP O OPU<br> T R T O OO IERT<br> P A S F D<br> S D O D S<br> P A S F D S F<br> P A S F D<br> H D G FDFS<br> P A S F D S S"),
    lyrics: "最怕空气突然安静\n最怕朋友突然的关心\n最怕回忆突然翻滚\n绞痛着不平息\n最怕突然听到你的消息\n想念如果会有声音\n不愿那是悲伤的哭泣\n事到如今\n终於让自已属於我自已\n只剩眼泪还骗不过自己\n突然好想你\n你会在哪里\n过的快乐或委屈\n突然好想你\n突然锋利的回忆\n突然模糊的眼睛",
    score: 'W U UT YT R T\nT I IU IU I O Y',
    author: 'YuetAu',
    authorLink: 'https://yuetau.net/'
  },
  {
    id: 11,
    name: '莫斯科郊外的晚上',
    difficulty: 2,
    category: 'popular',
    notes: parseContentToNotes("t(^y)o(^y)i ~ (^y)y oit <br> (^y)o(^p)(^p)s(^p)(^o)o <br> padso <br> ytoi(^o) <br> (^p)(^o)oi(^y) oit"),
    lyrics: "《莫斯科郊外的晚上》\n深夜花园里四处静悄悄\n只有树叶在沙沙响\n夜色多么好\n令人心神往\n多么迷人的晚上\n我的心上人坐在我身旁\n悄悄看着我不声响\n我愿对你讲\n不知怎样讲\n多少话儿留在心上\n长夜快过去天色蒙蒙亮\n衷心祝福你好姑娘\n但愿从今后\n你我永不忘\n莫斯科郊外的晚上",
    score: 't(^y)o(^y)i ~ (^y)y oit\n(^y)o(^p)(^p)s(^p)(^o)o',
    author: 'LalalalavaZ'
  },
  {
    id: 12,
    name: '西海情歌',
    difficulty: 2,
    category: 'popular',
    notes: parseContentToNotes("U OP SP D~ S DF FD DSP~ <br/> U O PS D D D DS D DF FD DSP~ <br/> U OP SP D~ DS S DF FD DSP~ <br/> SS DF HHHF HJJH JJJHF HJLLLL LJJL JJJHF <br/> HFDDDSP SDD DFHJJHF <br/> SDHHHFHJJHJJJHF HJLLLLLJJLJJJHF <br/> HFDDDSP SDD DFD S~ P~"),
    lyrics: '西海情歌',
    score: 'U OP SP D~ S DF FD DSP~\nU O PS D D D DS D DF FD DSP~',
    author: 'javacBT'
  },
  {
    id: 13,
    name: '我的中国心',
    difficulty: 2,
    category: 'popular',
    notes: parseContentToNotes("e uyutre upo uytyu uop apouy ttyu yurewe <br/> e uyutre upo uytyu uop apouy ttyu yurewe <br/> uouu uspp pspo tytyu <br/> uspp psdf fdaop <br/> e u yutre upouytyu <br/> uop apo uy ttyu y u apop"),
    lyrics: "河山只在我梦萦 \n祖国已多年未亲近 \n可是不管怎样也改变不了 \n我的中国心 \n洋装虽然穿在身 \n我心依然是中国心 \n我的祖先早已把我的一切 \n烙上中国印 \n长江 长城 黄山 黄河 \n在我心中重千斤 \n无论何时 无论何地 \n心中一样亲 \n流在心里的血 \n澎湃着中华的声音 \n就算身在他乡也改变不了 \n我的中国心",
    score: 'e uyutre upo uytyu uop apouy ttyu yurewe',
    author: 'HesperusArcher',
    authorLink: 'https://github.com/HesperusArcher'
  },

  // === 经典老歌 (难度2-3) ===
  {
    id: 14,
    name: '遇见',
    difficulty: 3,
    category: 'classic',
    notes: parseContentToNotes("OU OY UYT TRERTRTYU </br> OU OD SAS TRERTRTYT </br> OPASASAPOPO TYUIUIOTYU </br> OPASASADSDSFO TYUIUIUYTRT </br> OPASASDSAPO TYUIUIOTTPO </br> OPASASDSDFO  TYUIUIOTTPO </br> OPASASDSDFO  TYUYUYOTYUT </br> OPASASPAOIO </br> UUUIOUWW YYYUIYWW </br> TTTYUYRT RERTR </br> EWEPO YIUYT </br> TREYYTEERT"),
    lyrics: '听见冬天的离开\n我在某年某月醒过来\n我想我等我期待\n我的未来却不能因为你安排',
    score: 'OU OY UYT TRERTRTYU\nOU OD SAS TRERTRTYT',
    author: 'Traditional'
  },
  {
    id: 15,
    name: '月亮代表我的心',
    difficulty: 2,
    category: 'classic',
    notes: parseContentToNotes("OSFHSAFH HJKLJH FDSSS FDSSS DFDSPDFD OSFHSAFH HJKLJH </br> DSSS FDSSS DFDPASDS FHFDSHA PAPAPOF HFDSHA PASSSDFD OSFHSAFH HJKLJH </br> FDSSS FDSSS DFDPASDS"),
    lyrics: '你问我爱你有多深\n我爱你有几分\n我的情也真\n我的爱也真\n月亮代表我的心',
    score: 'OSFHSAFH HJKLJH FDSSS FDSSS DFDSPDFD',
    author: 'Traditional'
  },

  // === 中高难度歌曲 (难度3-4) ===
  {
    id: 16,
    name: '因为爱情',
    difficulty: 3,
    category: 'popular',
    notes: parseContentToNotes("opsspsdfd spfdpfdsp passpfd fdd dff <br/>opsspsdfd spfdpfdsp passpfd spsfhd <br/> dfhf hhfdhh jklllklkkhf <br/> hfhj hjhhs psfdpfdpjh <br/> dfhf hhfdhh jklllklkkhf <br/> hfhj hjhhs psfdpfdpfd fdfs"),
    lyrics: '给你一张过去的CD\n听听那时我们的爱情\n有时会突然忘了\n我还在爱着你',
    score: 'opsspsdfd spfdpfdsp passpfd fdd dff',
    author: 'Traditional'
  },
  {
    id: 17,
    name: '千与千寻主题曲',
    difficulty: 3,
    category: 'anime',
    notes: parseContentToNotes("fg hhhh hjhg ffff fgfd ss sapa as d dfdf d <br/> fg hhhh hjhg ffff fgfd ss sapa asos df d ddss <br/> sdfs h f dhd spf sa sapa asos dfg gfds d <br/> sdfs h f dhd spp aso o p a sdos dfd ddss"),
    lyrics: '君をのせて\n伴随着你\n千与千寻主题曲',
    score: 'fg hhhh hjhg ffff fgfd ss sapa as d dfdf d',
    author: 'Traditional'
  },
  {
    id: 18,
    name: '一直很安静',
    difficulty: 3,
    category: 'popular',
    notes: parseContentToNotes("fhdfs sa s p gf d~ fhdfs osd ss ss<br/> fhdfs ss j j jh f~ fhdfs df gfds psas s~<br/> fhlk lh j h f~ fgfds hhh df<br/> fhlk lh j h f~ fgfds s ass~<br/> fhdfs sa s p gf d~ fhdfs osd ss ss<br/> fhdfs ss j j jh f~ fhdfs df gfds psas s~<br/> fhlk lh j h f~ fgfds hhh jf~<br/> fhlk l z x x~ fgfds s ass~"),
    lyrics: '我一直很安静\n安静地看着你\n安静地看着你和她\n在我面前幸福',
    score: 'fhdfs sa s p gf d\nfhdfs osd ss ss',
    author: 'Traditional'
  },
  {
    id: 19,
    name: 'Lemon【Unnatural主题曲】',
    difficulty: 3,
    category: 'anime',
    notes: parseContentToNotes("SDF SP D A OU APOT OU<br/> YUI S ASO IUI S APO<br/> SD F SP D A OU A P OT O U<br/> YUI O IO U O S F D DD SS<br/> P AS AP OFF D FG FD SDO<br/> I OP OI UOSS A AP AS<br/> DFDS PS FH DS DFDS PS FH DS<br/> DFDS PS FH JH HI KH FH D<br/> DFDS PS FH DS SSDF GFDAS<br/> SA PASD SOUO PDA SS<br/> SA PASD SOSD FGD SS"),
    lyrics: 'Lemon - 米津玄師\nUnnatural主题曲',
    score: 'SDF SP D A OU APOT OU\nYUI S ASO IUI S APO',
    author: 'Fake'
  },
  {
    id: 20,
    name: '伊莎贝拉之歌《约定的梦幻岛》OST',
    difficulty: 3,
    category: 'anime',
    notes: parseContentToNotes("E(^T)YUPOIU TURYE <br/> WEUIOUYAO UOPUOPUYEOU <br/>  E(^T)YUPOIU TURYE <br/> WEUIOUYAO UOPUOPUYEOU <br/> (^T)YUPOIU TUOUP <br/> PSAOUPFA OPASAPASDAF <br/> UPASAPOUYYTOU ERTYTYIUYU <br/> UPASASDODGFDS ERTYUEWE <br/> UPASAPOUYYTOU ERTYTYIUYU <br/> UPASASDODGFDS HSPFAODAAP"),
    lyrics: '约定的梦幻岛 OST\n伊莎贝拉之歌',
    score: 'E(^T)YUPOIU TURYE\nWEUIOUYAO UOPUOPUYEOU',
    author: 'HikamaiC',
    authorLink: 'https://github.com/Gu-Miao'
  },
  {
    id: 21,
    name: 'cannon in D',
    difficulty: 3,
    category: 'classical',
    notes: parseContentToNotes("[tf] [wd] [es] [0a] [qp] [8o] [qp] [wa] <br/> [tsf] o [wad] o [eps] u [0oa] u [qip] t [8uo] t [qip] t [woa] y <br/> [tus] a s [wa] [es] f [0h] j [qg] f d g [8f] d s a [qp] o i u [wy] u i <br/> [tuo] o [wo] p o i [etu] u [0u] i u y [qt] E e E [8t] t [qt] E e t [wr] t y <br/> [8wu] [5ry] [6et] [3r] [4e] [1w] [4e] [5t] r [18wtu]"),
    lyrics: 'Canon in D Major\n帕赫贝尔 卡农',
    score: '[tf] [wd] [es] [0a] [qp] [8o] [qp] [wa]',
    author: 'iamjiangmioamiao'
  },

  // === 高难度歌曲 (难度4-5) ===
  {
    id: 22,
    name: '纸短情长',
    difficulty: 4,
    category: 'popular',
    notes: parseContentToNotes("o fffd fs ddds dh ~ ss spsp o dddf po <br/> gggf gs ddds dh ~ sssp sp o fddss <br/> ssd f ff fds a jh ~ hjkl ff lkl kfh <br/> hjlh j ~ jhg hf ds ~ ps fdds dh sd <br/> ssd ffdf fds hhfh ~ hjk llll lkjk jf h <br/> hjlh j jhg hf ds ~ ps fdds dsps"),
    lyrics: "纸短情长 \n你陪我步入蝉夏 越过城市喧嚣 \n歌声在游走 你榴花般的双眸 \n不见你的温柔 丢失花间欢笑 \n岁月无法停留 流云的等候 \n我真的好想你 在每一个雨季 \n你选择遗忘的 是我最不舍的 \n纸短情长啊 道不尽太多涟漪 \n我的故事都是关于你呀 \n怎么会爱上了他 并决定跟他回家 \n放弃了我的所有我的一切无所谓 \n纸短情长啊 诉不完当时年少 \n我的故事还是关于你啊",
    score: 'o fffd fs ddds dh\nss spsp o dddf po',
    author: 'Traditional'
  },
  {
    id: 23,
    name: '明天你好',
    difficulty: 4,
    category: 'popular',
    notes: parseContentToNotes("fhhfdhh sffsaff pssp ossf gfdsd <br/> ssdfd hh as ~ ppasa ff op <br/> psgf fs d fd ofd ~ ssdfd hh as <br/> ppasa ff op psgf hs dfg fgfgh fd ~ <br/> o dsf ssfjh hjkl llkjh hjkl llkjh hfs psdfd <br/> o dsf ssfjh hjkl llkjh hjkl llkjh hfs fd s a s ~"),
    lyrics: "明天你好 \n看昨天的我们 走远了\n在命运广场中央 等待\n那模糊的 肩膀\n越奔跑 越渺小\n曾经 并肩往前的 伙伴\n在举杯 祝福后都 走散\n只是那个 夜晚\n我深深 的都留藏在心坎\n长大以后 我只能奔跑\n我多害怕 黑暗中跌倒\n明天你好 含着泪微笑\n越美好 越害怕得到\n每一次哭 又笑着 奔跑\n一边失去 一边在寻找\n明天你好 声音多渺小\n却提醒我 勇敢是什么",
    score: 'fhhfdhh sffsaff pssp ossf gfdsd',
    author: 'Traditional'
  },
  {
    id: 24,
    name: '青花瓷',
    difficulty: 4,
    category: 'popular',
    notes: parseContentToNotes("hhfdfdsp dfdso dfdsp sd of<br/> sdfh hf f d s ds p sdf h<br/> dsps sps spspo dsps sps sfdss<br/> opff fdf fdfhf fff dddd dsfd<br/> dsps sps spspo opfh hfh hfdss<br/> dsd fdds d sp dssp s s s<br/> hhfdfp dfhfd hhfdfo dfhds<br/> sdf hjhf hffd d sds d sd f hf<br/> hhfdfp dfhfd hhfdfo dfhds<br/> sdf hjhf hffd d o fd ds~"),
    lyrics: '素胚勾勒出青花笔锋浓转淡\n瓶身描绘的牡丹一如你初妆\n冉冉檀香透过窗心事我了然',
    score: 'hhfdfdsp dfdso dfdsp sd of',
    author: '周杰伦'
  },
  {
    id: 25,
    name: '小幸运',
    difficulty: 4,
    category: 'popular',
    notes: parseContentToNotes("uuo ossa apup~ ppa affa aouo<br/> uuo ossa apup~ pa pa f d s<br/> uuo ossa apup~ ppa affa aouo<br/> uuo ossa asup~ pa pa f d s<br/> fdsa pppp pf d~ dsap ooou od s~<br/> sso ot u yp~ ppp sp sp ssss fd d~<br/> o fdsd fodf odf~ dd fgfda sups upa~<br/> aaf hfsa pgg~ hgf off~ gfs idd~ dsf ds f d s~<br/> fodf odf~ dd fghda sups upa~<br/> aaf hfsa pgg~ hgf off~ gfs idd~ fss f d s~"),
    lyrics: '我听见雨滴落在青青草地\n我听见远方下课钟声响起\n可是我没有听见你的声音\n认真呼唤我姓名',
    score: 'uuo ossa apup\nppa affa aouo',
    author: 'Traditional'
  },

  // === 超高难度歌曲 (难度5) ===
  {
    id: 26,
    name: '好好',
    difficulty: 5,
    category: 'expert',
    notes: parseContentToNotes("fosf dgfd sdfs o~ gpsg fdgs spsf d<br/> dfg hhhd sp jf gfgh j~ jjkl lljs ddf gpsf f d ~<br/> 停顿<br/> fosf dgfd sdfs o~ gpsg fdgs spsf d<br/> dfg hhhd sp jf gfgh j~ jjkl lljl ll j xz~<br/> 高潮<br/> hlz xhcx zlz lk lf zl kjh jsgj jhh kl <br/> h cxzl h~<br/> hlz xhcx zlz lk lf zl kjh jsgj jhh kl <br/> h cxzl z~<br/> hlz xhcx zlz lk lf vv bv jsgj jhh kl <br/> h cxzl  xz bn m mmmmm~"),
    lyrics: '好好 - 超高难度练习曲',
    score: 'fosf dgfd sdfs o\ngpsg fdgs spsf d',
    author: 'Expert Level'
  },

  // === 其他更多歌曲... ===
  {
    id: 27,
    name: '绿色',
    difficulty: 1,
    category: 'beginner',
    notes: parseContentToNotes("fdfp ppph d dd <br/> fdfooouoh f ff<br/> fhfspss <br/> fhfspsd <br/> sdsgffddsdsg fdf"),
    lyrics: "若不是你突然闯进 我生活 \n我怎会把死守的寂寞 放任了 \n爱我的话你都说 \n爱我的事你不做 \n我却把甜言蜜语当做你爱我的躯壳",
    score: 'fdfp ppph d dd\nfdfooouoh f ff',
    author: 'iPeng6'
  }
])

// 分类过滤的歌曲
const beginnerSongs = computed(() => 
  songList.value.filter(song => song.category === 'beginner')
)

const popularSongs = computed(() => 
  songList.value.filter(song => 
    ['popular', 'anime'].includes(song.category)
  )
)

const classicSongs = computed(() => 
  songList.value.filter(song => 
    ['classic', 'classical'].includes(song.category)
  )
)

const expertSongs = computed(() => 
  songList.value.filter(song => 
    song.category === 'expert' || song.difficulty >= 4
  )
)

// const allSongs = computed(() => songList.value)

// 滚动到当前音符
const scrollToCurrentNote = () => {
  nextTick(() => {
    if (notesDisplayRef.value) {
      const container = notesDisplayRef.value
      const currentElement = container.querySelector('.note-item.current')
      
      if (currentElement) {
        const containerRect = container.getBoundingClientRect()
        const elementRect = currentElement.getBoundingClientRect()
        
        // 计算是否需要滚动
        const isVisible = elementRect.left >= containerRect.left && 
                         elementRect.right <= containerRect.right
        
        if (!isVisible) {
          // 滚动到当前元素
          currentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          })
        }
      }
    }
  })
}

// 预加载音频文件
const preloadAudio = async () => {
  console.log('🎵 开始预加载钢琴音频文件...')
  
  for (const [note, filename] of Object.entries(noteToFile)) {
    const audio = new Audio()
    audio.src = `/audio/piano/${filename}`
    audio.preload = 'auto'
    audio.volume = 0.8
    
    // 加载完成事件
    audio.addEventListener('canplaythrough', () => {
      console.log(`✅ 音频加载完成: ${note} -> ${filename}`)
    })
    
    // 错误处理
    audio.addEventListener('error', (e) => {
      console.error(`❌ 音频加载失败: ${note} -> ${filename}`, e)
    })
    
    audioCache.set(note, audio)
  }
  
  console.log(`🎹 钢琴音频预加载完成，共 ${audioCache.size} 个音色`)
}

// 播放音符 - 使用HTML5 Audio直接播放MP3
const playNote = (note: string) => {
  if (pressedKeys.value.has(note)) return
  
  pressedKeys.value.add(note)
  
  const audio = audioCache.get(note)
  if (audio) {
    // 重置播放位置，确保每次都从头播放
    audio.currentTime = 0
    
    // 播放音频
    audio.play().then(() => {
      console.log(`🎵 播放音符: ${note} -> ${noteToFile[note]}`)
    }).catch(err => {
      console.error(`❌ 播放失败: ${note}`, err)
    })
  } else {
    console.warn(`⚠️ 未找到音符对应的音频: ${note}`)
  }
}

// 停止音符
const stopNote = (note: string) => {
  pressedKeys.value.delete(note)
}

// 根据音符获取对应的键盘按键
const getKeyForNote = (note: string) => {
  // 在白键中查找
  const whiteKey = whiteKeys.value.find(key => key.note === note)
  if (whiteKey) return whiteKey.binding
  
  // 在黑键中查找
  for (const group of blackKeyGroups.value) {
    const blackKey = group.find(key => key.note === note)
    if (blackKey) return `Shift+${blackKey.binding}`
  }
  
  return note // 如果找不到，就返回音符本身
}

// 选择歌曲
const selectSong = (song: any) => {
  currentSong.value = song
  currentNoteIndex.value = 0
  
  // 滚动到第一个音符
  scrollToCurrentNote()
  
  console.log(`🎵 选择歌曲: ${song.name}`)
}

// 返回曲库列表
const backToList = () => {
  currentSong.value = null
  currentNoteIndex.value = 0
}

// 重置演奏指导
const resetGuide = () => {
  currentNoteIndex.value = 0
  
  // 滚动到第一个音符
  scrollToCurrentNote()
  
  console.log('🔄 重置演奏指导')
}

// 从曲谱播放音符
const playNoteFromScore = (noteBinding: string, index: number) => {
  // 将曲谱中的音符映射到钢琴键位
  const mappedNote = mapScoreNoteToKey(noteBinding)
  if (mappedNote) {
    playNote(mappedNote)
    
    // 更新当前音符索引
    currentNoteIndex.value = index + 1
  }
}

// 将曲谱音符映射到钢琴键位
const mapScoreNoteToKey = (scoreNote: string) => {
  // 数字音符映射（简谱）
  const numberMap: Record<string, string> = {
    '1': 'C2', '2': 'D2', '3': 'E2', '4': 'F2', '5': 'G2', '6': 'A2', '7': 'B2'
  }
  
  // 字母音符映射（键盘按键） - 支持大小写
  const letterMap: Record<string, string> = {
    'Q': 'F3', 'W': 'G3', 'E': 'A3', 'R': 'B3', 'T': 'C4', 'Y': 'D4', 'U': 'E4',
    'I': 'F4', 'O': 'G4', 'P': 'A4', 'A': 'B4', 'S': 'C5', 'D': 'D5', 'F': 'E5',
    'G': 'F5', 'H': 'G5', 'J': 'A5', 'K': 'B5', 'L': 'C6', 'Z': 'D6', 'X': 'E6',
    'C': 'F6', 'V': 'G6', 'B': 'A6', 'N': 'B6', 'M': 'C7',
    // 添加小写字母映射
    'q': 'F3', 'w': 'G3', 'e': 'A3', 'r': 'B3', 't': 'C4', 'y': 'D4', 'u': 'E4',
    'i': 'F4', 'o': 'G4', 'p': 'A4', 'a': 'B4', 's': 'C5', 'd': 'D5', 'f': 'E5',
    'g': 'F5', 'h': 'G5', 'j': 'A5', 'k': 'B5', 'l': 'C6', 'z': 'D6', 'x': 'E6',
    'c': 'F6', 'v': 'G6', 'b': 'A6', 'n': 'B6', 'm': 'C7'
  }
  
  return numberMap[scoreNote] || letterMap[scoreNote] || null
}



// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase()
  const isShift = event.shiftKey
  
  // 查找对应的音符
  let targetNote = null
  
  // 检查白键
  for (const whiteKey of whiteKeys.value) {
    if (whiteKey.binding.toLowerCase() === key) {
      targetNote = whiteKey.note
      break
    }
  }
  
  // 检查黑键
  if (!targetNote && isShift) {
    for (const group of blackKeyGroups.value) {
      for (const blackKey of group) {
        if (blackKey.binding.toLowerCase() === key) {
          targetNote = blackKey.note
          break
        }
      }
      if (targetNote) break
    }
  }
  
  if (targetNote && !pressedKeys.value.has(targetNote)) {
    event.preventDefault()
    playNote(targetNote)
    
    // 如果正在练习模式，检查是否是下一个音符
    if (currentSong.value && currentNoteIndex.value < currentSong.value.notes.length) {
      const expectedNoteObj = currentSong.value.notes[currentNoteIndex.value]
      const expectedNote = expectedNoteObj.note
      const mappedNote = mapScoreNoteToKey(expectedNote)
      
      console.log(`🎯 期待音符: ${expectedNote} -> 映射为: ${mappedNote}, 按下的音符: ${targetNote}`)
      
      if (mappedNote === targetNote) {
        console.log(`✅ 正确！跳转到下一个音符`)
        currentNoteIndex.value++
      } else {
        console.log(`❌ 不匹配，继续等待正确音符`)
      }
    }
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase()
  const isShift = event.shiftKey
  
  // 查找对应的音符
  let targetNote = null
  
  // 检查白键
  for (const whiteKey of whiteKeys.value) {
    if (whiteKey.binding.toLowerCase() === key) {
      targetNote = whiteKey.note
      break
    }
  }
  
  // 检查黑键
  if (!targetNote && isShift) {
    for (const group of blackKeyGroups.value) {
      for (const blackKey of group) {
        if (blackKey.binding.toLowerCase() === key) {
          targetNote = blackKey.note
          break
        }
      }
      if (targetNote) break
    }
  }
  
  if (targetNote) {
    stopNote(targetNote)
  }
}

// 监听当前音符索引变化，自动滚动
watch(currentNoteIndex, () => {
  scrollToCurrentNote()
})

// 组件挂载时初始化
onMounted(async () => {
  await preloadAudio()
  
  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

// 组件卸载时清理
onUnmounted(() => {
  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<style scoped>
/* 炫酷钢琴工具样式 */
.page-container {
  min-width: 1280px;
  padding: 1px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, 
    #0f0f23 0%, 
    #1a1a2e 25%, 
    #16213e 50%, 
    #0f3460 75%, 
    #533483 100%
  );
  overflow: hidden;
}

.page-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
  animation: backgroundShift 20s ease-in-out infinite;
}

@keyframes backgroundShift {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.05) rotate(1deg); }
}

.app-content {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  position: relative;
  padding: 20px;
  z-index: 1;
  padding-top: 70px;
}

.component-autopiano {
  width: 100%;
  position: relative;
  color: #000;
}

/* 钢琴样式 */
.piano-scroll-wrap {
  width: 100%;
  overflow: hidden;
}

.piano-wrap {
  width: 90%;
  margin: 10px auto;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(120, 119, 198, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  opacity: 1;
  background: linear-gradient(145deg, #1e1e2e 0%, #0f0f1f 100%);
  border: 1px solid rgba(120, 119, 198, 0.2);
}

.piano-band {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: linear-gradient(145deg, #1a1a2e 0%, #0f0f23 100%);
  box-shadow: 
    inset 0 -1px 2px rgba(255, 255, 255, 0.1), 
    0 2px 10px rgba(0, 0, 0, 0.3);
  border-bottom: 2px solid rgba(120, 119, 198, 0.3);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
}

.piano-brand-logo {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #7877c6, #ff77c6, #77d4ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(120, 119, 198, 0.5);
  letter-spacing: 1px;
}

.piano-tip {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.piano-key-wrap {
  width: 100%;
  background: #373737;
  overflow: hidden;
  position: relative;
}

/* 白键样式 */
.wkey {
  display: inline-block;
  width: 2.775%;
  height: 100%;
  margin: 0 auto;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 
    inset 0 1px 3px rgba(255, 255, 255, 0.8), 
    inset 0 -1px 2px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 0 0 8px 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.wkey:hover {
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  transform: translateY(2px) scale(0.98);
  box-shadow: 
    inset 0 1px 3px rgba(255, 255, 255, 0.6), 
    inset 0 -1px 2px rgba(0, 0, 0, 0.15),
    0 6px 12px rgba(0, 0, 0, 0.4);
}

.wkey-active, .wkey.auto-key-active {
  background: linear-gradient(180deg, #7877c6 0%, #5a5aa6 100%) !important;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 -1px 2px rgba(255, 255, 255, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.6) !important;
  transform: translateY(3px) scale(0.95);
  top: 0;
  height: 100%;
}

.wkey-active:before, .wkey.auto-key-active:before {
  content: "";
  border-width: 250px 5px 0;
  border-style: solid;
  border-color: transparent transparent transparent rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 0;
  bottom: 0;
}

.wkey-active:after, .wkey.auto-key-active:after {
  content: "";
  border-width: 250px 5px 0;
  border-style: solid;
  border-color: transparent rgba(0, 0, 0, 0.1) transparent transparent;
  position: absolute;
  right: 0;
  bottom: 0;
}

/* 黑键样式 */
.bkey-wrap {
  width: 20%;
  height: 0;
  position: absolute;
  top: 0;
}

.bkey-wrap1 { left: 0; }
.bkey-wrap2 { left: 19.5%; }
.bkey-wrap3 { left: 39%; }
.bkey-wrap4 { left: 58.3%; }
.bkey-wrap5 { left: 77.7%; }

.bkey {
  display: inline-block;
  width: 10%;
  height: 70%;
  background: linear-gradient(180deg, #2d2d3a 0%, #1a1a26 50%, #0f0f1a 100%);
  border: 1px solid rgba(0, 0, 0, 0.8);
  border-radius: 0 0 6px 6px;
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.1), 
    inset 0 -1px 3px rgba(0, 0, 0, 0.6),
    0 4px 8px rgba(0, 0, 0, 0.8);
  position: absolute;
  top: 0;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.bkey:hover {
  background: linear-gradient(180deg, #3a3a4a 0%, #2a2a36 50%, #1a1a26 100%);
  transform: translateY(2px) scale(0.98);
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.15), 
    inset 0 -1px 3px rgba(0, 0, 0, 0.7),
    0 6px 12px rgba(0, 0, 0, 0.9);
}

.bkey-active, .bkey.auto-key-active {
  background: linear-gradient(180deg, #ff77c6 0%, #d155a6 50%, #a03383 100%) !important;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.4),
    inset 0 -1px 2px rgba(255, 255, 255, 0.2),
    0 2px 6px rgba(0, 0, 0, 0.9) !important;
  transform: translateY(3px) scale(0.95);
  height: 72%;
}

.bkey:first-child { left: 9%; }
.bkey:nth-child(2) { left: 23%; }
.bkey:nth-child(3) { left: 50%; }
.bkey:nth-child(4) { left: 65%; }
.bkey:nth-child(5) { left: 79%; }

.keytip {
  width: 100%;
  position: absolute;
  bottom: 5%;
  font-size: 14px;
  text-align: center;
}

.wkey .keytip {
  color: #373737;
}

.bkey .keytip {
  color: #fff;
  overflow: hidden;
}

.keyname {
  margin-bottom: 5px;
}

.notename {
  color: #1295db;
  font-weight: 700;
}

/* 钢琴选项样式 */
.piano-options {
  width: 90%;
  height: 30px;
  margin: 0px auto 15px;
  padding: 0;
  position: relative;
}

.option-item-wrap {
  position: absolute;
  right: 1%;
}

.option-item {
  display: inline-block;
  height: 50px;
  line-height: 50px;
  margin: 0 15px;
}

.option-item .label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  color:#fff;
}

.option-item .label > input {
  display: none;
}

.option-item .label i {
  display: inline-block;
  margin-left: 5px;
  padding: 2px;
  width: 40px;
  height: 20px;
  border-radius: 13px;
  vertical-align: middle;
  transition: 0.25s 0.09s;
  position: relative;
  background: #d8d9db;
  box-sizing: initial;
}

.option-item .label i:after {
  content: " ";
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  left: 2px;
  transition: 0.25s;
}

.option-item .label > input:checked + i {
  background: #07e26d;
}

.option-item .label > input:checked + i:after {
  transform: translateX(20px);
}

/* 按键教程区域样式 */
.piano-guide-section {
  width: 90%;
  margin: 10px auto;
  background: linear-gradient(145deg, 
    rgba(30, 30, 46, 0.95) 0%, 
    rgba(26, 26, 46, 0.9) 100%
  );
  border-radius: 15px;
  border: 1px solid rgba(120, 119, 198, 0.3);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: 25px;
}

.guide-container {
  width: 100%;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(120, 119, 198, 0.3);
}

.guide-title {
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.guide-icon {
  font-size: 28px;
  margin-right: 12px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.guide-author {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  font-weight: 400;
  font-style: italic;
}

.back-btn {
  background: linear-gradient(135deg, #7877c6, #ff77c6);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(120, 119, 198, 0.3);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(120, 119, 198, 0.4);
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.current-note-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

}

.note-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px; /* 减少内部间距 */
  background: linear-gradient(135deg, 
    rgba(120, 119, 198, 0.9) 0%, 
    rgba(255, 119, 198, 0.8) 100%
  );
  padding: 12px 20px; /* 减少内边距 */
  border-radius: 10px;
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.2), /* 减少阴影 */
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hint-label {
  color: white;
  font-size: 14px; /* 稍微减小字体 */
  font-weight: 500;
  opacity: 0.9;
}

.hint-key-large {
  background: linear-gradient(45deg, #77d4ff, #ffffff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 36px; /* 减小字体大小 */
  font-weight: 800;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  padding: 10px 18px; /* 减小内边距 */
  border: 2px solid rgba(255, 255, 255, 0.3); /* 减小边框 */
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.progress-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px; /* 减少间距 */
  width: 100%;
  max-width: 300px; /* 减小宽度 */
}

.progress-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px; /* 减小字体大小 */
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 6px; /* 减小进度条高度 */
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7877c6, #ff77c6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.completion-message {
  text-align: center;
  padding: 30px;
}

.celebration {
  font-size: 24px;
  color: #ffffff;
  margin-bottom: 20px;
  animation: bounce 1s infinite;
}

.restart-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.restart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.note-sequence {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 减少间距 */
  margin-top: 5px; /* 减少上边距 */
}

.sequence-title, .lyrics-title {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px; /* 减小标题字体 */
  font-weight: 600;
}

.notes-display-container {
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
}

.notes-display {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.note-item {
  display: inline-block;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.note-item:hover {
  background: rgba(120, 119, 198, 0.3);
  border-color: rgba(120, 119, 198, 0.5);
  transform: translateY(-1px);
}

.note-item.current {
  background: linear-gradient(135deg, #7877c6, #ff77c6);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  animation: pulse 1s infinite;
}

.note-item.played {
  background: rgba(120, 200, 120, 0.3);
  border-color: rgba(120, 200, 120, 0.5);
  color: rgba(255, 255, 255, 0.6);
}

/* 句尾音符添加间距 */
.note-item.sentence-end {
  margin-right: 60px; /* 约等于一个音符键的宽度 */
}



.song-lyrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lyrics-content {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.6;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid rgba(120, 119, 198, 0.5);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 曲谱区域样式 */
.score-section {
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
  align-items: start;
}

.score-container {
  width: 100%;
  min-height: 400px;
  font-size: 14px;
  overflow: hidden;
  background: linear-gradient(145deg, 
    rgba(30, 30, 46, 0.95) 0%, 
    rgba(26, 26, 46, 0.9) 100%
  );
  border-radius: 15px;
  border: 1px solid rgba(120, 119, 198, 0.3);
  position: relative;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.list-view {
  width: 100%;
  height: 100%;
  padding: 20px 15px;
  overflow-y: auto;
}

.content-wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px 15px;
  overflow-y: scroll;
}

.component-title {
  margin: 0 0 15px;
  font-size: 20px;
  font-weight: 700;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.title-icon {
  font-size: 24px;
  margin-right: 10px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.title-img {
  width: 26px;
  vertical-align: middle;
  margin-right: 5px;
}

.list {
  width: 100%;
  padding-left: 25px;
  padding-bottom: 10px;
  line-height: 32px;
}

.list-item {
  height: 40px;
  line-height: 40px;
  list-style: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  margin-bottom: 4px;
  padding: 0 12px;
}

.list-item:hover {
  background: linear-gradient(135deg, 
    rgba(120, 119, 198, 0.2) 0%, 
    rgba(255, 119, 198, 0.1) 100%
  );
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(120, 119, 198, 0.3);
}

.list-item .num {
  width: 30px;
  height: 30px;
  font-size: 14px;
  margin-right: 15px;
  text-align: center;
  line-height: 30px;
  background: linear-gradient(135deg, #7877c6, #ff77c6);
  color: white;
  font-weight: 700;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(120, 119, 198, 0.4);
}

.list-item a {
  display: inline-block;
  min-width: 120px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  flex: 1;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.list-item a:hover {
  color: #77d4ff;
  text-decoration: none;
}

.song-author {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  margin-left: 10px;
  opacity: 0.8;
}

.difficulty-degree {
  min-width: 80px;
  text-align: right;
  margin-left: auto;
}

.icon-star, .icon-heartbeat, .icon-fire {
  display: inline-block;
  transform: scale(0.8);
  margin-left: 2px;
  color: #ffcc00;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.icon-star::before {
  content: "⭐";
}

.icon-heartbeat::before {
  content: "❤️";
}

.icon-fire::before {
  content: "🔥";
}

.expert-item {
  border-left: 3px solid rgba(255, 119, 198, 0.5);
}

.expert-item:hover {
  border-left-color: rgba(255, 119, 198, 0.8);
}

.expert-num {
  background: linear-gradient(135deg, #ff6b6b, #ff4757) !important;
  animation: expertPulse 2s ease-in-out infinite;
}

@keyframes expertPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 演奏指导样式 */
.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
}

.return-btn {
  cursor: pointer;
  width: 80px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  color: #1f6fb5;
  text-decoration: none;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0 8px;
  transition: all 0.3s ease;
}

.return-btn:hover {
  background: #e9ecef;
  text-decoration: underline;
  color: #1295db;
}

.author-info {
  float: right;
  line-height: 32px;
}

.author-info a {
  color: #1f6fb5;
  margin-right: 7px;
  text-decoration: none;
}

.info {
  font-size: 14px;
  margin: 5px 0;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #1295db;
  color: #fff;
  border-radius: 4px;
}

.score-item-content {
  word-wrap: break-word;
  font-size: 16px;
  letter-spacing: 0;
  line-height: 26px;
}

.score-line {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.score-note {
  display: inline-block;
  padding: 8px 12px;
  background: #ffffff;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  min-width: 35px;
  text-align: center;
}

.score-note:hover {
  background: #e3f2fd;
  border-color: #2196f3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
}

.score-note.current-note {
  background: #4caf50;
  color: white;
  border-color: #45a049;
  animation: pulse 1s infinite;
}

.score-note.played-note {
  background: #e8f5e8;
  border-color: #4caf50;
  color: #2e7d32;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.score-display {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin: 15px 0;
  font-family: 'Courier New', monospace;
  white-space: pre-line;
  font-size: 14px;
  line-height: 1.8;
}

.guide-controls {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  justify-content: center;
}

.control-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.auto-btn {
  background: #28a745;
  color: white;
}

.auto-btn:hover:not(:disabled) {
  background: #218838;
}

.auto-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.reset-btn {
  background: #ffc107;
  color: #212529;
}

.reset-btn:hover {
  background: #e0a800;
}

.pause-btn {
  background: #fd7e14;
  color: white;
}

.pause-btn:hover {
  background: #e8690a;
}

.current-note-hint {
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, 
    rgba(120, 119, 198, 0.9) 0%, 
    rgba(255, 119, 198, 0.8) 100%
  );
  color: white;
  border-radius: 12px;
  text-align: center;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hint-content {
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.hint-label {
  font-size: 16px;
  opacity: 0.9;
  font-weight: 500;
}

.hint-key-main {
  font-weight: 800;
  font-size: 32px;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #77d4ff, #ffffff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 8px 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
}

.hint-note-small {
  font-size: 14px;
  opacity: 0.7;
  font-style: italic;
}

.completion-celebration {
  text-align: center;
  padding: 20px;
}

.celebration-content {
  font-size: 24px;
  animation: bounce 1s infinite;
}

.celebration-sub {
  font-size: 16px;
  margin-top: 10px;
  color: #4caf50;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.score-item-lyrics {
  word-wrap: break-word;
  font-style: italic;
  margin-top: 20px;
  line-height: 26px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #667eea;
}
</style>