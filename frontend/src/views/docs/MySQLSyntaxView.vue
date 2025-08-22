<template>
  <div class="mysql-syntax">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><DocumentCopy /></el-icon>
        </div>
        <h1 class="hero-title">MySQL 常用语法</h1>
        <p class="hero-description">MySQL数据库管理和查询语法大全，包含增删改查、索引优化等核心操作</p>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <el-backtop :right="80" :bottom="80" :visibility-height="200">
      <div class="back-to-top">
        <el-icon><CaretTop /></el-icon>
      </div>
    </el-backtop>
    
    <!-- 侧边浮动导航 -->
    <div class="floating-nav" :class="{ 'collapsed': navCollapsed }">
      <div class="nav-header">
        <h4>快速导航</h4>
        <el-button @click="navCollapsed = !navCollapsed" type="text" size="small">
          <el-icon><ArrowLeft v-if="!navCollapsed" /><ArrowRight v-else /></el-icon>
        </el-button>
      </div>
      
      <div class="nav-content" v-show="!navCollapsed">
        <div class="nav-section">
          <h5><el-icon><Lightning /></el-icon>运维场景</h5>
          <div class="nav-item" @click="scrollToScenario('slow-query-analysis')">
            <el-icon><TrendCharts /></el-icon>
            <span>慢查询分析</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('user-management')">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('performance-monitoring')">
            <el-icon><Monitor /></el-icon>
            <span>性能监控</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('troubleshooting')">
            <el-icon><Warning /></el-icon>
            <span>故障排查</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('backup-restore')">
            <el-icon><Document /></el-icon>
            <span>备份恢复</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('index-optimization')">
            <el-icon><Setting /></el-icon>
            <span>索引优化</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('configuration')">
            <el-icon><Tools /></el-icon>
            <span>配置调优</span>
          </div>
        </div>
        
        <div class="nav-section">
          <h5><el-icon><List /></el-icon>基础语法</h5>
          <div class="nav-item" @click="scrollToElement('mysql-basics')">
            <el-icon><Star /></el-icon>
            <span>基础操作</span>
          </div>
          <div class="nav-item" @click="scrollToElement('quick-reference')">
            <el-icon><Files /></el-icon>
            <span>快速参考</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tool-card">
<!--      <div class="card-header">-->
<!--        <el-icon class="icon"><DatabaseOutlined /></el-icon>-->
<!--        <div>-->
<!--          <h2 class="title">MySQL 常用语法</h2>-->
<!--          <p class="description">MySQL 数据库操作常用SQL语法参考手册</p>-->
<!--        </div>-->
<!--      </div>-->

      <div class="card-body">
        <!-- 移动端快速导航 -->
        <div class="mobile-nav">
          <h5>🚀 快速跳转</h5>
          <div class="mobile-nav-items">
            <div class="mobile-nav-item" @click="scrollToScenario('slow-query-analysis')">慢查询分析</div>
            <div class="mobile-nav-item" @click="scrollToScenario('user-management')">用户管理</div>
            <div class="mobile-nav-item" @click="scrollToScenario('performance-monitoring')">性能监控</div>
            <div class="mobile-nav-item" @click="scrollToElement('mysql-basics')">基础语法</div>
            <div class="mobile-nav-item" @click="scrollToElement('quick-reference')">快速参考</div>
          </div>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="搜索SQL语句或描述..."
            size="large"
            clearable
          >
            <template #prepend>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 分类标签 -->
        <div class="category-tabs">
          <el-tag
            v-for="category in categories"
            :key="category.key"
            :type="activeCategory === category.key ? 'primary' : undefined"
            @click="activeCategory = category.key"
            style="cursor: pointer; margin-right: 8px; margin-bottom: 8px;"
          >
            {{ category.name }}
          </el-tag>
        </div>

        <!-- 语法列表 -->
        <div id="mysql-basics" class="syntax-list">
          <div
            v-for="syntax in filteredSyntax"
            :key="syntax.name"
            class="syntax-item"
          >
            <div class="syntax-header">
              <div class="syntax-name">
                <span class="syntax-title">{{ syntax.name }}</span>
                <el-tag size="small" :type="getCategoryType(syntax.category)">
                  {{ getCategoryName(syntax.category) }}
                </el-tag>
              </div>
              <el-button @click="copySyntax(syntax.syntax)" size="small" type="primary" plain>
                <el-icon><CopyDocument /></el-icon>
                复制
              </el-button>
            </div>
            <div class="syntax-description">{{ syntax.description }}</div>
            <div class="syntax-code">
              <code>{{ syntax.syntax }}</code>
            </div>
            <div v-if="syntax.examples" class="syntax-examples">
              <h5>示例：</h5>
              <div
                v-for="(example, index) in syntax.examples"
                :key="index"
                class="example-item"
              >
                <code>{{ example.sql }}</code>
                <span class="example-desc">{{ example.description }}</span>
              </div>
            </div>
            <div v-if="syntax.notes" class="syntax-notes">
              <h5>注意事项：</h5>
              <ul>
                <li v-for="note in syntax.notes" :key="note">{{ note }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- MySQL运维场景 -->
        <div class="scenarios-section">
          <h4><el-icon><TrendCharts /></el-icon>MySQL运维场景</h4>
          
          <div class="scenario-group" id="slow-query-analysis">
            <h5 class="scenario-title">🐌 MySQL存在慢查询排查流程</h5>
            <div class="scenario-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <code>SHOW VARIABLES LIKE 'slow_query%';</code>
                  <span>查看慢查询日志是否开启</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <code>SET GLOBAL slow_query_log = 'ON';</code>
                  <span>开启慢查询日志</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <code>SHOW PROCESSLIST;</code>
                  <span>查看当前正在执行的查询</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <code>EXPLAIN SELECT * FROM your_table WHERE condition;</code>
                  <span>分析查询执行计划</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">5</div>
                <div class="step-content">
                  <code>CREATE INDEX idx_column ON your_table(column_name);</code>
                  <span>为慢查询字段创建索引</span>
                </div>
              </div>
            </div>
          </div>

          <div class="scenario-group" id="user-management">
            <h5 class="scenario-title">🔐 MySQL密码和用户管理</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>查看当前用户</h6>
                <code>SELECT USER(), CURRENT_USER();</code>
                <span>显示当前连接的用户信息</span>
              </div>
              <div class="scenario-item">
                <h6>查看所有用户</h6>
                <code>SELECT user, host FROM mysql.user;</code>
                <span>查看MySQL中所有用户</span>
              </div>
              <div class="scenario-item">
                <h6>创建新用户</h6>
                <code>CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';</code>
                <span>创建本地访问用户</span>
              </div>
              <div class="scenario-item">
                <h6>修改用户密码</h6>
                <code>ALTER USER 'username'@'localhost' IDENTIFIED BY 'newpassword';</code>
                <span>更改用户密码</span>
              </div>
            </div>
          </div>

          <div class="scenario-group" id="performance-monitoring">
            <h5 class="scenario-title">📊 性能监控与分析</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>查看数据库大小</h6>
                <code>SELECT table_schema "Database", SUM(data_length + index_length) / 1024 / 1024 "Size MB" FROM information_schema.tables GROUP BY table_schema;</code>
                <span>统计各数据库占用空间</span>
              </div>
              <div class="scenario-item">
                <h6>查看表大小</h6>
                <code>SELECT table_name, (data_length + index_length) / 1024 / 1024 AS "Size MB" FROM information_schema.tables WHERE table_schema = 'database_name';</code>
                <span>查看指定数据库中各表大小</span>
              </div>
              <div class="scenario-item">
                <h6>查看连接数</h6>
                <code>SHOW STATUS LIKE 'Threads_connected';</code>
                <span>查看当前连接数</span>
              </div>
              <div class="scenario-item">
                <h6>查看最大连接数</h6>
                <code>SHOW VARIABLES LIKE 'max_connections';</code>
                <span>查看最大连接数配置</span>
              </div>
            </div>
          </div>

          <div class="scenario-group" id="troubleshooting">
            <h5 class="scenario-title">🔧 故障排查与修复</h5>
            <div class="scenario-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <code>SHOW ENGINE INNODB STATUS;</code>
                  <span>查看InnoDB引擎详细状态</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <code>SELECT * FROM performance_schema.events_waits_current;</code>
                  <span>查看当前等待事件</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <code>SHOW GLOBAL STATUS LIKE 'Innodb_lock%';</code>
                  <span>查看锁相关状态</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <code>KILL QUERY process_id;</code>
                  <span>终止问题查询（从SHOW PROCESSLIST获取ID）</span>
                </div>
              </div>
            </div>
          </div>

          <div class="scenario-group" id="backup-restore">
            <h5 class="scenario-title">💾 备份与恢复</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>导出数据库</h6>
                <code>mysqldump -u username -p database_name > backup.sql</code>
                <span>导出整个数据库到SQL文件</span>
              </div>
              <div class="scenario-item">
                <h6>导出单个表</h6>
                <code>mysqldump -u username -p database_name table_name > table_backup.sql</code>
                <span>导出指定表的数据</span>
              </div>
              <div class="scenario-item">
                <h6>导入数据库</h6>
                <code>mysql -u username -p database_name &lt; backup.sql</code>
                <span>从SQL文件恢复数据库</span>
              </div>
              <div class="scenario-item">
                <h6>创建数据库备份</h6>
                <code>mysqldump -u username -p --all-databases > all_databases_backup.sql</code>
                <span>备份所有数据库</span>
              </div>
            </div>
          </div>

          <div class="scenario-group" id="index-optimization">
            <h5 class="scenario-title">🔍 索引优化</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>查看表索引</h6>
                <code>SHOW INDEX FROM table_name;</code>
                <span>显示表的所有索引信息</span>
              </div>
              <div class="scenario-item">
                <h6>分析表</h6>
                <code>ANALYZE TABLE table_name;</code>
                <span>更新表的统计信息</span>
              </div>
              <div class="scenario-item">
                <h6>检查表</h6>
                <code>CHECK TABLE table_name;</code>
                <span>检查表是否有错误</span>
              </div>
              <div class="scenario-item">
                <h6>优化表</h6>
                <code>OPTIMIZE TABLE table_name;</code>
                <span>优化表存储和索引</span>
              </div>
            </div>
          </div>

          <div class="scenario-group" id="configuration">
            <h5 class="scenario-title">⚙️ 配置查看与调优</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>查看缓冲池大小</h6>
                <code>SHOW VARIABLES LIKE 'innodb_buffer_pool_size';</code>
                <span>查看InnoDB缓冲池配置</span>
              </div>
              <div class="scenario-item">
                <h6>查看查询缓存</h6>
                <code>SHOW VARIABLES LIKE 'query_cache%';</code>
                <span>查看查询缓存相关配置</span>
              </div>
              <div class="scenario-item">
                <h6>查看binlog状态</h6>
                <code>SHOW VARIABLES LIKE 'log_bin';</code>
                <span>检查二进制日志是否开启</span>
              </div>
              <div class="scenario-item">
                <h6>查看MySQL版本</h6>
                <code>SELECT VERSION();</code>
                <span>查看当前MySQL版本</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速参考 -->
        <div id="quick-reference" class="quick-reference">
          <h4><el-icon><Star /></el-icon>快速参考</h4>
          <div class="reference-grid">
            <div class="reference-item">
              <h5>查询数据</h5>
              <code>SELECT * FROM table</code>
            </div>
            <div class="reference-item">
              <h5>插入数据</h5>
              <code>INSERT INTO table VALUES</code>
            </div>
            <div class="reference-item">
              <h5>更新数据</h5>
              <code>UPDATE table SET column</code>
            </div>
            <div class="reference-item">
              <h5>删除数据</h5>
              <code>DELETE FROM table</code>
            </div>
            <div class="reference-item">
              <h5>创建表</h5>
              <code>CREATE TABLE table</code>
            </div>
            <div class="reference-item">
              <h5>删除表</h5>
              <code>DROP TABLE table</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  // DataAnalysis, // as DatabaseOutlined,
  Search,
  CopyDocument,
  Star,
  TrendCharts,
  Lightning,
  User,
  Monitor,
  Warning,
  Document,
  Setting,
  List,
  Files,
  ArrowLeft,
  ArrowRight,
  CaretTop
} from '@element-plus/icons-vue'

const searchQuery = ref('')
const activeCategory = ref('all')
const navCollapsed = ref(false)

const categories = [
  { key: 'all', name: '全部' },
  { key: 'select', name: '查询操作' },
  { key: 'insert', name: '插入操作' },
  { key: 'update', name: '更新操作' },
  { key: 'delete', name: '删除操作' },
  { key: 'ddl', name: '表结构' },
  { key: 'function', name: '函数' },
  { key: 'index', name: '索引' }
]

const syntaxList = [
  {
    name: 'SELECT 查询',
    category: 'select',
    description: '查询表中的数据，支持条件筛选、排序、分组等操作',
    syntax: 'SELECT column1, column2 FROM table_name WHERE condition ORDER BY column',
    examples: [
      { sql: 'SELECT * FROM users;', description: '查询users表所有数据' },
      { sql: 'SELECT name, email FROM users WHERE age > 18;', description: '查询年龄大于18的用户姓名和邮箱' },
      { sql: 'SELECT * FROM users ORDER BY created_at DESC LIMIT 10;', description: '按创建时间倒序查询前10条记录' }
    ]
  },
  {
    name: 'INSERT 插入',
    category: 'insert',
    description: '向表中插入新的数据记录',
    syntax: 'INSERT INTO table_name (column1, column2) VALUES (value1, value2)',
    examples: [
      { sql: 'INSERT INTO users (name, email) VALUES ("张三", "zhangsan@email.com");', description: '插入一条用户记录' },
      { sql: 'INSERT INTO users (name, email) VALUES ("李四", "lisi@email.com"), ("王五", "wangwu@email.com");', description: '批量插入多条记录' }
    ],
    notes: ['确保插入的数据类型与字段定义匹配', '注意必填字段不能为空']
  },
  {
    name: 'UPDATE 更新',
    category: 'update',
    description: '更新表中现有数据记录',
    syntax: 'UPDATE table_name SET column1 = value1 WHERE condition',
    examples: [
      { sql: 'UPDATE users SET email = "new@email.com" WHERE id = 1;', description: '更新指定用户的邮箱' },
      { sql: 'UPDATE users SET status = "active" WHERE created_at > "2023-01-01";', description: '批量更新符合条件的记录' }
    ],
    notes: ['务必使用WHERE条件，避免误更新所有记录', '更新前建议先用SELECT验证条件']
  },
  {
    name: 'DELETE 删除',
    category: 'delete',
    description: '删除表中的数据记录',
    syntax: 'DELETE FROM table_name WHERE condition',
    examples: [
      { sql: 'DELETE FROM users WHERE id = 1;', description: '删除指定ID的用户' },
      { sql: 'DELETE FROM users WHERE status = "inactive" AND created_at < "2022-01-01";', description: '删除符合条件的记录' }
    ],
    notes: ['务必使用WHERE条件，避免误删除所有记录', '删除前建议先备份重要数据']
  },
  {
    name: 'JOIN 连接查询',
    category: 'select',
    description: '连接多个表进行查询',
    syntax: 'SELECT * FROM table1 JOIN table2 ON table1.id = table2.table1_id',
    examples: [
      { sql: 'SELECT u.name, p.title FROM users u JOIN posts p ON u.id = p.user_id;', description: '内连接查询用户和文章' },
      { sql: 'SELECT u.name, p.title FROM users u LEFT JOIN posts p ON u.id = p.user_id;', description: '左连接查询所有用户及其文章' }
    ]
  },
  {
    name: 'GROUP BY 分组',
    category: 'select',
    description: '对查询结果进行分组统计',
    syntax: 'SELECT column, COUNT(*) FROM table_name GROUP BY column HAVING condition',
    examples: [
      { sql: 'SELECT status, COUNT(*) FROM users GROUP BY status;', description: '按状态分组统计用户数量' },
      { sql: 'SELECT city, AVG(age) FROM users GROUP BY city HAVING AVG(age) > 25;', description: '查询平均年龄大于25的城市' }
    ]
  },
  {
    name: 'CREATE TABLE 创建表',
    category: 'ddl',
    description: '创建新的数据表',
    syntax: 'CREATE TABLE table_name (column1 datatype constraints, column2 datatype)',
    examples: [
      { sql: 'CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE);', description: '创建用户表' },
      { sql: 'CREATE TABLE posts (id INT AUTO_INCREMENT, title VARCHAR(255), content TEXT, user_id INT, PRIMARY KEY(id), FOREIGN KEY(user_id) REFERENCES users(id));', description: '创建文章表并设置外键' }
    ]
  },
  {
    name: 'ALTER TABLE 修改表',
    category: 'ddl',
    description: '修改已存在的表结构',
    syntax: 'ALTER TABLE table_name ADD/DROP/MODIFY column_name datatype',
    examples: [
      { sql: 'ALTER TABLE users ADD phone VARCHAR(20);', description: '添加电话字段' },
      { sql: 'ALTER TABLE users MODIFY email VARCHAR(150);', description: '修改邮箱字段长度' },
      { sql: 'ALTER TABLE users DROP COLUMN phone;', description: '删除电话字段' }
    ]
  },
  {
    name: 'CREATE INDEX 创建索引',
    category: 'index',
    description: '为表创建索引以提高查询性能',
    syntax: 'CREATE INDEX index_name ON table_name (column1, column2)',
    examples: [
      { sql: 'CREATE INDEX idx_email ON users (email);', description: '为邮箱字段创建索引' },
      { sql: 'CREATE INDEX idx_name_age ON users (name, age);', description: '创建复合索引' },
      { sql: 'CREATE UNIQUE INDEX idx_username ON users (username);', description: '创建唯一索引' }
    ]
  },
  {
    name: 'COUNT 计数函数',
    category: 'function',
    description: '统计记录数量',
    syntax: 'SELECT COUNT(*) FROM table_name WHERE condition',
    examples: [
      { sql: 'SELECT COUNT(*) FROM users;', description: '统计用户总数' },
      { sql: 'SELECT COUNT(DISTINCT city) FROM users;', description: '统计不重复的城市数量' }
    ]
  },
  {
    name: 'SUM/AVG 聚合函数',
    category: 'function',
    description: '计算总和和平均值',
    syntax: 'SELECT SUM(column), AVG(column) FROM table_name',
    examples: [
      { sql: 'SELECT SUM(amount) FROM orders;', description: '计算订单总金额' },
      { sql: 'SELECT AVG(age) FROM users WHERE status = "active";', description: '计算活跃用户平均年龄' }
    ]
  },
  {
    name: 'LIKE 模糊查询',
    category: 'select',
    description: '使用通配符进行模糊匹配查询',
    syntax: 'SELECT * FROM table_name WHERE column LIKE "pattern"',
    examples: [
      { sql: 'SELECT * FROM users WHERE name LIKE "张%";', description: '查询姓张的用户' },
      { sql: 'SELECT * FROM users WHERE email LIKE "%@gmail.com";', description: '查询Gmail邮箱用户' },
      { sql: 'SELECT * FROM users WHERE phone LIKE "138_____";', description: '查询138开头的手机号' }
    ]
  },
  {
    name: 'IN/NOT IN 条件查询',
    category: 'select',
    description: '检查字段值是否在指定列表中',
    syntax: 'SELECT * FROM table_name WHERE column IN (value1, value2)',
    examples: [
      { sql: 'SELECT * FROM users WHERE status IN ("active", "pending");', description: '查询状态为活跃或待审核的用户' },
      { sql: 'SELECT * FROM users WHERE id NOT IN (1, 2, 3);', description: '查询ID不在指定列表的用户' }
    ]
  },
  {
    name: 'BETWEEN 范围查询',
    category: 'select',
    description: '查询字段值在指定范围内的记录',
    syntax: 'SELECT * FROM table_name WHERE column BETWEEN value1 AND value2',
    examples: [
      { sql: 'SELECT * FROM users WHERE age BETWEEN 18 AND 65;', description: '查询年龄在18-65岁的用户' },
      { sql: 'SELECT * FROM orders WHERE created_at BETWEEN "2023-01-01" AND "2023-12-31";', description: '查询2023年的订单' }
    ]
  },
  {
    name: 'NULL 值处理',
    category: 'select',
    description: '处理NULL值的查询和操作',
    syntax: 'SELECT * FROM table_name WHERE column IS NULL / IS NOT NULL',
    examples: [
      { sql: 'SELECT * FROM users WHERE phone IS NULL;', description: '查询电话为空的用户' },
      { sql: 'SELECT * FROM users WHERE email IS NOT NULL;', description: '查询邮箱不为空的用户' },
      { sql: 'SELECT name, IFNULL(phone, "未提供") FROM users;', description: '使用IFNULL处理空值' }
    ]
  }
]

const filteredSyntax = computed(() => {
  let filtered = syntaxList
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(syntax => syntax.category === activeCategory.value)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(syntax => 
      syntax.name.toLowerCase().includes(query) ||
      syntax.description.toLowerCase().includes(query) ||
      syntax.syntax.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const getCategoryName = (category: string) => {
  return categories.find(c => c.key === category)?.name || category
}

const getCategoryType = (category: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined => {
  const types: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    select: 'primary',
    insert: 'success',
    update: 'warning',
    delete: 'danger',
    ddl: 'info',
    function: 'primary',
    index: 'warning'
  }
  return types[category] || undefined
}

const copySyntax = async (syntax: string) => {
  try {
    await navigator.clipboard.writeText(syntax)
    ElMessage.success('SQL语法已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const scrollToScenario = (scenarioId: string) => {
  const element = document.getElementById(scenarioId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    // 添加高亮效果
    element.style.animation = 'highlight 2s ease-in-out'
    setTimeout(() => {
      element.style.animation = ''
    }, 2000)
  }
}

const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    // 添加高亮效果
    element.style.animation = 'highlight 2s ease-in-out'
    setTimeout(() => {
      element.style.animation = ''
    }, 2000)
  }
}
</script>

<style scoped>
@import '@/styles/modern-tool.css';

.mysql-syntax {
  --tool-color: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.icon {
  font-size: 32px;
  margin-right: 16px;
}

.title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.description {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.card-body {
  padding: 24px;
}

.search-section {
  margin-bottom: 24px;
}

.category-tabs {
  margin-bottom: 24px;
}

.syntax-list {
  margin-bottom: 32px;
}

.syntax-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.syntax-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.syntax-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.syntax-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.syntax-description {
  color: #4b5563;
  margin-bottom: 16px;
  line-height: 1.5;
}

.syntax-code {
  background: #1f2937;
  color: #fbbf24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  overflow-x: auto;
}

.syntax-examples {
  margin-top: 16px;
}

.syntax-examples h5 {
  margin: 0 0 8px 0;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.example-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #f59e0b;
}

.example-item code {
  background: #fef3c7;
  color: #92400e;
  padding: 4px 8px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
}

.example-desc {
  color: #6b7280;
  font-size: 12px;
}

.syntax-notes {
  margin-top: 16px;
  background: #fef3c7;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #f59e0b;
}

.syntax-notes h5 {
  margin: 0 0 8px 0;
  color: #92400e;
  font-size: 14px;
  font-weight: 600;
}

.syntax-notes ul {
  margin: 0;
  padding-left: 20px;
  color: #92400e;
}

.syntax-notes li {
  margin-bottom: 4px;
  font-size: 13px;
  line-height: 1.4;
}

.quick-reference {
  background: #fffbeb;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #f59e0b;
}

.quick-reference h4 {
  margin: 0 0 16px 0;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.reference-item {
  background: white;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #fde68a;
}

.reference-item h5 {
  margin: 0 0 6px 0;
  color: #92400e;
  font-size: 12px;
}

.reference-item code {
  background: #92400e;
  color: #fde68a;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  display: block;
}

/* 场景解决方案样式 */
.scenarios-section {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  border-left: 4px solid #0ea5e9;
}

.scenarios-section h4 {
  margin: 0 0 24px 0;
  color: #0c4a6e;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
}

.scenario-group {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #bae6fd;
}

.scenario-title {
  margin: 0 0 16px 0;
  color: #0c4a6e;
  font-size: 16px;
  font-weight: 600;
}

.scenario-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-number {
  background: #0ea5e9;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-content code {
  background: #1f2937;
  color: #10b981;
  padding: 6px 12px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  display: inline-block;
  margin-bottom: 4px;
}

.step-content span {
  color: #4b5563;
  font-size: 13px;
}

.step-desc {
  color: #374151 !important;
  font-style: italic;
  padding: 8px 12px;
  background: #f9fafb;
  border-left: 3px solid #0ea5e9;
  border-radius: 4px;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.scenario-item {
  background: #f8fafc;
  padding: 16px;
  border-radius: 6px;
  border-left: 3px solid #0ea5e9;
}

.scenario-item h6 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
}

.scenario-item code {
  background: #1f2937;
  color: #10b981;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  display: block;
  margin: 8px 0;
  word-break: break-all;
}

.scenario-item span {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
}

/* 浮动导航样式 */
.floating-nav {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(251, 146, 60, 0.2);
  z-index: 999;
  width: 280px;
  max-height: 70vh;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.floating-nav.collapsed {
  width: 60px;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(251, 146, 60, 0.1);
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.nav-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.nav-header .el-button {
  color: white !important;
  padding: 4px;
}

.nav-content {
  padding: 20px;
  max-height: calc(70vh - 60px);
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section h5 {
  margin: 0 0 16px 0;
  color: #fb923c;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4b5563;
  font-size: 14px;
}

.nav-item:hover {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: white;
  transform: translateX(4px);
}

.nav-item .el-icon {
  font-size: 16px;
}

.nav-item:last-child {
  margin-bottom: 0;
}

/* 移动端快速导航样式 */
.mobile-nav {
  display: none;
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(251, 146, 60, 0.2);
}

.mobile-nav h5 {
  margin: 0 0 16px 0;
  color: #fb923c;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-nav-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mobile-nav-item {
  padding: 10px 16px;
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: white;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(251, 146, 60, 0.3);
}

.mobile-nav-item:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 15px rgba(251, 146, 60, 0.4);
}

/* 高亮动画 */
@keyframes highlight {
  0% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.7); }
  50% { box-shadow: 0 0 0 20px rgba(251, 146, 60, 0.3); }
  100% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mysql-syntax {
    padding: 16px;
  }
  
  /* 移动端显示快速导航，隐藏浮动导航 */
  .mobile-nav {
    display: block;
  }
  
  .floating-nav {
    display: none;
  }
  
  .card-header {
    padding: 20px 16px;
  }
  
  .card-body {
    padding: 20px 16px;
  }
  
  .syntax-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .reference-grid {
    grid-template-columns: 1fr;
  }
}

/* 返回顶部按钮样式 */
.back-to-top {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
  color: white;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(234, 88, 12, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.back-to-top:hover {
  background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
  box-shadow: 0 6px 20px rgba(234, 88, 12, 0.4);
  transform: translateY(-2px);
}

.back-to-top .el-icon {
  font-size: 20px;
}

.hero-section {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
}
</style>
