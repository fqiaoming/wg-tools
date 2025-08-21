<template>
  <div class="java-syntax">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Files /></el-icon>
        </div>
        <h1 class="hero-title">Java 常用语法</h1>
        <p class="hero-description">Java编程语言核心语法和Stream API操作指南，助您高效开发Java应用</p>
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
          <h5><el-icon><Lightning /></el-icon>核心场景</h5>
          <div class="nav-item" @click="scrollToScenario('stream-sorting')">
            <el-icon><Sort /></el-icon>
            <span>Stream排序</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('stream-grouping')">
            <el-icon><Grid /></el-icon>
            <span>Stream分组</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('stream-filtering')">
            <el-icon><Filter /></el-icon>
            <span>Stream过滤</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('exception-handling')">
            <el-icon><WarningFilled /></el-icon>
            <span>异常处理</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('concurrent-programming')">
            <el-icon><Connection /></el-icon>
            <span>并发编程</span>
          </div>
        </div>
        
        <div class="nav-section">
          <h5><el-icon><Document /></el-icon>语法参考</h5>
          <div class="nav-item" @click="scrollToSection('basic-syntax')">基础语法</div>
          <div class="nav-item" @click="scrollToSection('collections')">集合操作</div>
          <div class="nav-item" @click="scrollToSection('stream-api')">Stream API</div>
          <div class="nav-item" @click="scrollToSection('lambda')">Lambda表达式</div>
          <div class="nav-item" @click="scrollToSection('annotations')">注解</div>
          <div class="nav-item" @click="scrollToSection('algorithms')">算法实现</div>
          <div class="nav-item" @click="scrollToSection('quick-reference')">快速参考</div>
        </div>
      </div>
    </div>

    <!-- 移动端快速导航 -->
    <div class="mobile-nav" v-show="showMobileNav">
      <div class="mobile-nav-content">
        <div class="mobile-nav-item" @click="scrollToScenario('stream-sorting')">Stream排序</div>
        <div class="mobile-nav-item" @click="scrollToScenario('stream-grouping')">Stream分组</div>
        <div class="mobile-nav-item" @click="scrollToScenario('stream-filtering')">Stream过滤</div>
        <div class="mobile-nav-item" @click="scrollToSection('basic-syntax')">基础语法</div>
        <div class="mobile-nav-item" @click="scrollToSection('stream-api')">Stream API</div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="搜索Java语法、Stream操作..."
        prefix-icon="Search"
        clearable
        @input="handleSearch"
        class="search-input"
      />
      <div v-show="searchSuggestions.length > 0" class="search-suggestions">
        <div 
          v-for="suggestion in searchSuggestions" 
          :key="suggestion"
          @click="searchQuery = suggestion; handleSearch()"
          class="suggestion-item"
        >
          {{ suggestion }}
        </div>
      </div>
      <div v-show="searchQuery" class="search-stats">
        找到 {{ searchResults.length }} 个相关结果
      </div>
    </div>

    <!-- Java开发场景实践 -->
    <div class="tool-card scenarios-card">
      <div class="card-header">
        <el-icon class="icon"><Lightning /></el-icon>
        <div>
          <h2 class="title">Java开发实战场景</h2>
          <p class="description">常见开发场景的Java实现方案</p>
        </div>
      </div>

      <div class="card-body">
        <!-- 场景快捷按钮 -->
        <div class="scenario-buttons">
          <el-button @click="scrollToScenario('stream-sorting')" type="primary" plain>
            <el-icon><Sort /></el-icon>
            Stream排序
          </el-button>
          <el-button @click="scrollToScenario('stream-grouping')" type="success" plain>
            <el-icon><Grid /></el-icon>
            Stream分组
          </el-button>
          <el-button @click="scrollToScenario('stream-filtering')" type="info" plain>
            <el-icon><Filter /></el-icon>
            Stream过滤
          </el-button>
          <el-button @click="scrollToScenario('exception-handling')" type="warning" plain>
            <el-icon><WarningFilled /></el-icon>
            异常处理
          </el-button>
          <el-button @click="scrollToScenario('concurrent-programming')" type="danger" plain>
            <el-icon><Connection /></el-icon>
            并发编程
          </el-button>
        </div>

        <!-- Stream对象排序 -->
        <div id="stream-sorting" class="scenario-section">
          <h3>Stream对象排序</h3>
          <div class="scenario-content">
            <div class="scenario-step">
              <h4>1. 基础排序</h4>
              <pre><code class="language-java">// 对数字列表排序
List&lt;Integer&gt; numbers = Arrays.asList(3, 1, 4, 1, 5, 9);
List&lt;Integer&gt; sorted = numbers.stream()
    .sorted()
    .collect(Collectors.toList());

// 对字符串列表排序
List&lt;String&gt; names = Arrays.asList("Alice", "Bob", "Charlie");
List&lt;String&gt; sortedNames = names.stream()
    .sorted()
    .collect(Collectors.toList());</code></pre>
            </div>

            <div class="scenario-step">
              <h4>2. 对象属性排序</h4>
              <pre><code class="language-java">// 按年龄排序
List&lt;Person&gt; people = getPeople();
List&lt;Person&gt; sortedByAge = people.stream()
    .sorted(Comparator.comparing(Person::getAge))
    .collect(Collectors.toList());

// 按年龄倒序排序
List&lt;Person&gt; sortedByAgeDesc = people.stream()
    .sorted(Comparator.comparing(Person::getAge).reversed())
    .collect(Collectors.toList());</code></pre>
            </div>

            <div class="scenario-step">
              <h4>3. 多字段排序</h4>
              <pre><code class="language-java">// 先按年龄排序，再按姓名排序
List&lt;Person&gt; sortedMultiple = people.stream()
    .sorted(Comparator.comparing(Person::getAge)
        .thenComparing(Person::getName))
    .collect(Collectors.toList());

// 年龄升序，姓名倒序
List&lt;Person&gt; complexSort = people.stream()
    .sorted(Comparator.comparing(Person::getAge)
        .thenComparing(Person::getName, Comparator.reverseOrder()))
    .collect(Collectors.toList());</code></pre>
            </div>

            <div class="scenario-step">
              <h4>4. 空指针安全排序</h4>
              <pre><code class="language-java">// 处理可能为null的字段排序，null值排在最后
List&lt;Person&gt; nullSafeSorted = people.stream()
    .sorted(Comparator.comparing(Person::getAge, 
        Comparator.nullsLast(Comparator.naturalOrder())))
    .collect(Collectors.toList());

// null值排在最前
List&lt;Person&gt; nullFirstSorted = people.stream()
    .sorted(Comparator.comparing(Person::getAge,
        Comparator.nullsFirst(Comparator.naturalOrder())))
    .collect(Collectors.toList());

// 多字段空指针安全排序
List&lt;Person&gt; multiFieldNullSafe = people.stream()
    .sorted(Comparator.comparing(Person::getAge, 
        Comparator.nullsLast(Comparator.naturalOrder()))
        .thenComparing(Person::getName, 
        Comparator.nullsLast(Comparator.naturalOrder())))
    .collect(Collectors.toList());

// 使用Optional安全排序
List&lt;Person&gt; optionalSafeSorted = people.stream()
    .sorted(Comparator.comparing(p -&gt; Optional.ofNullable(p.getAge()).orElse(0)))
    .collect(Collectors.toList());</code></pre>
            </div>
          </div>
        </div>

        <!-- Stream对象分组 -->
        <div id="stream-grouping" class="scenario-section">
          <h3>Stream对象分组</h3>
          <div class="scenario-content">
            <div class="scenario-step">
              <h4>1. 基础分组</h4>
              <pre><code class="language-java">// 按年龄分组
Map&lt;Integer, List&lt;Person&gt;&gt; groupedByAge = people.stream()
    .collect(Collectors.groupingBy(Person::getAge));

// 按性别分组
Map&lt;String, List&lt;Person&gt;&gt; groupedByGender = people.stream()
    .collect(Collectors.groupingBy(Person::getGender));</code></pre>
            </div>

            <div class="scenario-step">
              <h4>2. 分组计数</h4>
              <pre><code class="language-java">// 计算每个年龄段的人数
Map&lt;Integer, Long&gt; ageCount = people.stream()
    .collect(Collectors.groupingBy(
        Person::getAge, 
        Collectors.counting()));

// 按城市分组并计数
Map&lt;String, Long&gt; cityCount = people.stream()
    .collect(Collectors.groupingBy(
        Person::getCity, 
        Collectors.counting()));</code></pre>
            </div>

            <div class="scenario-step">
              <h4>3. 分组统计</h4>
              <pre><code class="language-java">// 按部门分组，计算平均工资
Map&lt;String, Double&gt; avgSalaryByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.averagingDouble(Employee::getSalary)));

// 按城市分组，找出每个城市年龄最大的人
Map&lt;String, Optional&lt;Person&gt;&gt; oldestByCity = people.stream()
    .collect(Collectors.groupingBy(
        Person::getCity,
        Collectors.maxBy(Comparator.comparing(Person::getAge))));</code></pre>
            </div>
          </div>
        </div>

        <!-- Stream过滤 -->
        <div id="stream-filtering" class="scenario-section">
          <h3>Stream过滤与查找</h3>
          <div class="scenario-content">
            <div class="scenario-step">
              <h4>1. 基础过滤</h4>
              <pre><code class="language-java">// 过滤成年人
List&lt;Person&gt; adults = people.stream()
    .filter(person -&gt; person.getAge() &gt;= 18)
    .collect(Collectors.toList());

// 过滤特定城市的人
List&lt;Person&gt; beijingPeople = people.stream()
    .filter(person -&gt; "北京".equals(person.getCity()))
    .collect(Collectors.toList());</code></pre>
            </div>

            <div class="scenario-step">
              <h4>2. 复合条件过滤</h4>
              <pre><code class="language-java">// 多条件过滤
List&lt;Person&gt; filtered = people.stream()
    .filter(person -&gt; person.getAge() &gt; 25)
    .filter(person -&gt; person.getSalary() &gt; 10000)
    .filter(person -&gt; "男".equals(person.getGender()))
    .collect(Collectors.toList());

// 使用复合谓词
Predicate&lt;Person&gt; isAdult = person -&gt; person.getAge() &gt;= 18;
Predicate&lt;Person&gt; highSalary = person -&gt; person.getSalary() &gt; 15000;
List&lt;Person&gt; result = people.stream()
    .filter(isAdult.and(highSalary))
    .collect(Collectors.toList());</code></pre>
            </div>

            <div class="scenario-step">
              <h4>3. 查找操作</h4>
              <pre><code class="language-java">// 查找第一个满足条件的元素
Optional&lt;Person&gt; firstAdult = people.stream()
    .filter(person -&gt; person.getAge() &gt;= 18)
    .findFirst();

// 查找任意一个满足条件的元素
Optional&lt;Person&gt; anyHighSalary = people.stream()
    .filter(person -&gt; person.getSalary() &gt; 20000)
    .findAny();

// 检查是否所有元素都满足条件
boolean allAdults = people.stream()
    .allMatch(person -&gt; person.getAge() &gt;= 18);</code></pre>
            </div>
          </div>
        </div>

        <!-- 异常处理 -->
        <div id="exception-handling" class="scenario-section">
          <h3>异常处理最佳实践</h3>
          <div class="scenario-content">
            <div class="scenario-step">
              <h4>1. try-catch-finally</h4>
              <pre><code class="language-java">// 基础异常处理
public void readFile(String filename) {
    FileInputStream fis = null;
    try {
        fis = new FileInputStream(filename);
        // 读取文件操作
    } catch (FileNotFoundException e) {
        logger.error("文件未找到: " + filename, e);
    } catch (IOException e) {
        logger.error("读取文件时发生IO异常", e);
    } finally {
        if (fis != null) {
            try {
                fis.close();
            } catch (IOException e) {
                logger.error("关闭文件流时异常", e);
            }
        }
    }
}</code></pre>
            </div>

            <div class="scenario-step">
              <h4>2. try-with-resources</h4>
              <pre><code class="language-java">// 自动资源管理
public String readFileContent(String filename) throws IOException {
    try (BufferedReader reader = Files.newBufferedReader(Paths.get(filename))) {
        return reader.lines()
            .collect(Collectors.joining("\n"));
    }
}

// 多个资源的自动管理
public void copyFile(String source, String target) throws IOException {
    try (InputStream in = Files.newInputStream(Paths.get(source));
         OutputStream out = Files.newOutputStream(Paths.get(target))) {
        in.transferTo(out);
    }
}</code></pre>
            </div>

            <div class="scenario-step">
              <h4>3. 自定义异常</h4>
              <pre><code class="language-java">// 自定义业务异常
public class BusinessException extends Exception {
    private final String errorCode;
    
    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public BusinessException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
}

// 使用自定义异常
public void processOrder(Order order) throws BusinessException {
    if (order.getAmount() &lt;= 0) {
        throw new BusinessException("INVALID_AMOUNT", "订单金额必须大于0");
    }
}</code></pre>
            </div>
          </div>
        </div>

        <!-- 并发编程 -->
        <div id="concurrent-programming" class="scenario-section">
          <h3>并发编程实践</h3>
          <div class="scenario-content">
            <div class="scenario-step">
              <h4>1. 线程池使用</h4>
              <pre><code class="language-java">// 创建固定大小线程池
ExecutorService executor = Executors.newFixedThreadPool(5);

// 提交任务
Future&lt;String&gt; future = executor.submit(() -&gt; {
    // 执行长时间任务
    Thread.sleep(1000);
    return "任务完成";
});

// 获取结果
try {
    String result = future.get(2, TimeUnit.SECONDS);
    System.out.println(result);
} catch (TimeoutException e) {
    future.cancel(true);
} finally {
    executor.shutdown();
}</code></pre>
            </div>

            <div class="scenario-step">
              <h4>2. CompletableFuture异步编程</h4>
              <pre><code class="language-java">// 异步执行任务
CompletableFuture&lt;String&gt; future = CompletableFuture
    .supplyAsync(() -&gt; {
        // 模拟耗时操作
        try { Thread.sleep(1000); } catch (InterruptedException e) {}
        return "Hello";
    })
    .thenCompose(result -&gt; CompletableFuture.supplyAsync(() -&gt; result + " World"))
    .thenApply(String::toUpperCase);

// 组合多个异步操作
CompletableFuture&lt;String&gt; future1 = CompletableFuture.supplyAsync(() -&gt; "Hello");
CompletableFuture&lt;String&gt; future2 = CompletableFuture.supplyAsync(() -&gt; "World");
CompletableFuture&lt;String&gt; combined = future1.thenCombine(future2, (s1, s2) -&gt; s1 + " " + s2);</code></pre>
            </div>

            <div class="scenario-step">
              <h4>3. 并发集合</h4>
              <pre><code class="language-java">// ConcurrentHashMap线程安全的Map
ConcurrentHashMap&lt;String, Integer&gt; concurrentMap = new ConcurrentHashMap&lt;&gt;();
concurrentMap.put("key1", 1);
concurrentMap.computeIfAbsent("key2", k -&gt; 42);

// BlockingQueue阻塞队列
BlockingQueue&lt;String&gt; queue = new LinkedBlockingQueue&lt;&gt;();
// 生产者
new Thread(() -&gt; {
    try {
        queue.put("item1");
        queue.put("item2");
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();

// 消费者
new Thread(() -&gt; {
    try {
        String item = queue.take();
        System.out.println("处理: " + item);
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 基础语法 -->
    <div id="basic-syntax" class="tool-card">
      <div class="card-header">
        <el-icon class="icon"><Document /></el-icon>
        <div>
          <h2 class="title">Java基础语法</h2>
          <p class="description">Java编程语言的核心语法结构</p>
        </div>
      </div>

      <div class="card-body">
        <div class="syntax-grid">
          <div class="syntax-item">
            <h4>变量声明</h4>
            <pre><code class="language-java">// 基本数据类型
int age = 25;
double salary = 10000.50;
boolean isActive = true;
char grade = 'A';

// 引用数据类型
String name = "张三";
List&lt;String&gt; list = new ArrayList&lt;&gt;();
Map&lt;String, Object&gt; map = new HashMap&lt;&gt;();</code></pre>
          </div>

          <div class="syntax-item">
            <h4>方法定义</h4>
            <pre><code class="language-java">// 实例方法
public String getName() {
    return this.name;
}

// 静态方法
public static void main(String[] args) {
    System.out.println("Hello World");
}

// 私有方法
private void validateInput(String input) {
    if (input == null || input.trim().isEmpty()) {
        throw new IllegalArgumentException("输入不能为空");
    }
}</code></pre>
          </div>

          <div class="syntax-item">
            <h4>控制流</h4>
            <pre><code class="language-java">// if-else语句
if (age >= 18) {
    System.out.println("成年人");
} else {
    System.out.println("未成年人");
}

// switch语句
switch (grade) {
    case 'A':
        System.out.println("优秀");
        break;
    case 'B':
        System.out.println("良好");
        break;
    default:
        System.out.println("其他");
}

// for循环
for (int i = 0; i &lt; 10; i++) {
    System.out.println(i);
}

// 增强for循环
for (String item : list) {
    System.out.println(item);
}</code></pre>
          </div>

          <div class="syntax-item">
            <h4>类和对象</h4>
            <pre><code class="language-java">// 类定义
public class Person {
    private String name;
    private int age;
    
    // 构造方法
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // getter和setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    // toString方法
    @Override
    public String toString() {
        return String.format("Person{name='%s', age=%d}", name, age);
    }
}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 集合操作 -->
    <div id="collections" class="tool-card">
      <div class="card-header">
        <el-icon class="icon"><Grid /></el-icon>
        <div>
          <h2 class="title">集合操作</h2>
          <p class="description">Java集合框架的常用操作方法</p>
        </div>
      </div>

      <div class="card-body">
        <div class="syntax-grid">
          <div class="syntax-item">
            <h4>List操作</h4>
            <pre><code class="language-java">// 创建List
List&lt;String&gt; list = new ArrayList&lt;&gt;();
List&lt;String&gt; linkedList = new LinkedList&lt;&gt;();

// 添加元素
list.add("元素1");
list.add(0, "插入元素");
list.addAll(Arrays.asList("a", "b", "c"));

// 访问和修改
String first = list.get(0);
list.set(0, "新值");

// 删除元素
list.remove(0);
list.remove("元素1");
list.clear();</code></pre>
          </div>

          <div class="syntax-item">
            <h4>Set操作</h4>
            <pre><code class="language-java">// 创建Set
Set&lt;String&gt; hashSet = new HashSet&lt;&gt;();
Set&lt;String&gt; treeSet = new TreeSet&lt;&gt;();
Set&lt;String&gt; linkedHashSet = new LinkedHashSet&lt;&gt;();

// 添加元素
hashSet.add("元素1");
hashSet.addAll(Arrays.asList("a", "b", "c"));

// 检查存在
boolean contains = hashSet.contains("元素1");

// 集合运算
Set&lt;String&gt; set1 = new HashSet&lt;&gt;(Arrays.asList("a", "b", "c"));
Set&lt;String&gt; set2 = new HashSet&lt;&gt;(Arrays.asList("b", "c", "d"));

// 交集
set1.retainAll(set2);
// 并集
set1.addAll(set2);
// 差集
set1.removeAll(set2);</code></pre>
          </div>

          <div class="syntax-item">
            <h4>Map操作</h4>
            <pre><code class="language-java">// 创建Map
Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
Map&lt;String, Integer&gt; treeMap = new TreeMap&lt;&gt;();

// 添加和获取
map.put("key1", 100);
map.putIfAbsent("key2", 200);
Integer value = map.get("key1");
Integer defaultValue = map.getOrDefault("key3", 0);

// 遍历Map
map.forEach((k, v) -&gt; System.out.println(k + "=" + v));

// 计算操作
map.compute("key1", (k, v) -&gt; v == null ? 1 : v + 1);
map.computeIfAbsent("key2", k -&gt; k.length());
map.computeIfPresent("key1", (k, v) -&gt; v * 2);</code></pre>
          </div>

          <div class="syntax-item">
            <h4>集合工具类</h4>
            <pre><code class="language-java">// Collections工具类
List&lt;Integer&gt; numbers = Arrays.asList(3, 1, 4, 1, 5);

// 排序
Collections.sort(numbers);
Collections.reverse(numbers);

// 查找
int index = Collections.binarySearch(numbers, 4);
Integer max = Collections.max(numbers);
Integer min = Collections.min(numbers);

// 不可变集合
List&lt;String&gt; immutableList = Collections.unmodifiableList(list);
Set&lt;String&gt; immutableSet = Collections.unmodifiableSet(set);

// Java 9+ 工厂方法
List&lt;String&gt; list = List.of("a", "b", "c");
Set&lt;String&gt; set = Set.of("x", "y", "z");
Map&lt;String, Integer&gt; map = Map.of("one", 1, "two", 2);</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Stream API详解 -->
    <div id="stream-api" class="tool-card">
      <div class="card-header">
        <el-icon class="icon"><Connection /></el-icon>
        <div>
          <h2 class="title">Stream API详解</h2>
          <p class="description">Java 8 Stream API的完整操作指南</p>
        </div>
      </div>

      <div class="card-body">
        <div class="syntax-grid">
          <div class="syntax-item">
            <h4>创建Stream</h4>
            <pre><code class="language-java">// 从集合创建
List&lt;String&gt; list = Arrays.asList("a", "b", "c");
Stream&lt;String&gt; stream1 = list.stream();
Stream&lt;String&gt; parallelStream = list.parallelStream();

// 从数组创建
String[] array = {"x", "y", "z"};
Stream&lt;String&gt; stream2 = Arrays.stream(array);

// 直接创建
Stream&lt;String&gt; stream3 = Stream.of("hello", "world");
Stream&lt;Integer&gt; stream4 = Stream.iterate(0, n -&gt; n + 2).limit(10);
Stream&lt;Double&gt; stream5 = Stream.generate(Math::random).limit(5);</code></pre>
          </div>

          <div class="syntax-item">
            <h4>中间操作</h4>
            <pre><code class="language-java">List&lt;Person&gt; people = getPeople();

// 过滤
Stream&lt;Person&gt; adults = people.stream()
    .filter(p -&gt; p.getAge() >= 18);

// 映射
Stream&lt;String&gt; names = people.stream()
    .map(Person::getName);

// 扁平化映射
Stream&lt;String&gt; allWords = texts.stream()
    .flatMap(text -&gt; Arrays.stream(text.split(" ")));

// 去重
Stream&lt;Integer&gt; distinct = numbers.stream().distinct();

// 排序
Stream&lt;Person&gt; sorted = people.stream()
    .sorted(Comparator.comparing(Person::getAge));

// 限制和跳过
Stream&lt;Person&gt; limited = people.stream().limit(10);
Stream&lt;Person&gt; skipped = people.stream().skip(5);</code></pre>
          </div>

          <div class="syntax-item">
            <h4>终端操作</h4>
            <pre><code class="language-java">List&lt;Person&gt; people = getPeople();

// 收集
List&lt;String&gt; nameList = people.stream()
    .map(Person::getName)
    .collect(Collectors.toList());

Set&lt;String&gt; nameSet = people.stream()
    .map(Person::getName)
    .collect(Collectors.toSet());

// 查找
Optional&lt;Person&gt; first = people.stream()
    .filter(p -&gt; p.getAge() > 30)
    .findFirst();

// 匹配
boolean anyMatch = people.stream()
    .anyMatch(p -&gt; p.getAge() > 60);
boolean allMatch = people.stream()
    .allMatch(p -&gt; p.getAge() >= 0);

// 统计
long count = people.stream().count();
OptionalInt maxAge = people.stream()
    .mapToInt(Person::getAge)
    .max();

// 归约
Optional&lt;Integer&gt; sum = numbers.stream()
    .reduce(Integer::sum);
Integer product = numbers.stream()
    .reduce(1, (a, b) -&gt; a * b);</code></pre>
          </div>

          <div class="syntax-item">
            <h4>Collectors工具</h4>
            <pre><code class="language-java">List&lt;Person&gt; people = getPeople();

// 分组
Map&lt;Integer, List&lt;Person&gt;&gt; groupByAge = people.stream()
    .collect(Collectors.groupingBy(Person::getAge));

// 分区
Map&lt;Boolean, List&lt;Person&gt;&gt; partitioned = people.stream()
    .collect(Collectors.partitioningBy(p -&gt; p.getAge() >= 18));

// 统计
IntSummaryStatistics ageStats = people.stream()
    .collect(Collectors.summarizingInt(Person::getAge));

// 连接字符串
String names = people.stream()
    .map(Person::getName)
    .collect(Collectors.joining(", ", "[", "]"));

// 自定义收集器
Map&lt;String, String&gt; nameMap = people.stream()
    .collect(Collectors.toMap(
        Person::getId,
        Person::getName,
        (existing, replacement) -&gt; existing));</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Lambda表达式 -->
    <div id="lambda" class="tool-card">
      <div class="card-header">
        <el-icon class="icon"><MagicStick /></el-icon>
        <div>
          <h2 class="title">Lambda表达式</h2>
          <p class="description">Java 8 Lambda表达式的语法和应用</p>
        </div>
      </div>

      <div class="card-body">
        <div class="syntax-grid">
          <div class="syntax-item">
            <h4>基础语法</h4>
            <pre><code class="language-java">// 无参数Lambda
Runnable runnable = () -&gt; System.out.println("Hello");

// 单参数Lambda
Consumer&lt;String&gt; consumer = s -&gt; System.out.println(s);
Consumer&lt;String&gt; consumer2 = (String s) -&gt; System.out.println(s);

// 多参数Lambda
BinaryOperator&lt;Integer&gt; add = (a, b) -&gt; a + b;
BinaryOperator&lt;Integer&gt; add2 = (Integer a, Integer b) -&gt; {
    return a + b;
};

// 方法引用
Consumer&lt;String&gt; printer = System.out::println;
Function&lt;String, Integer&gt; parser = Integer::parseInt;
Supplier&lt;List&lt;String&gt;&gt; listSupplier = ArrayList::new;</code></pre>
          </div>

          <div class="syntax-item">
            <h4>函数式接口</h4>
            <pre><code class="language-java">// Predicate - 断言
Predicate&lt;String&gt; isEmpty = String::isEmpty;
Predicate&lt;Integer&gt; isPositive = x -&gt; x > 0;

// Function - 函数
Function&lt;String, Integer&gt; length = String::length;
Function&lt;Integer, String&gt; toString = String::valueOf;

// Consumer - 消费者
Consumer&lt;String&gt; print = System.out::println;
Consumer&lt;List&lt;String&gt;&gt; addItem = list -&gt; list.add("item");

// Supplier - 供应者
Supplier&lt;Date&gt; now = Date::new;
Supplier&lt;Random&gt; random = Random::new;

// BiFunction - 双参数函数
BiFunction&lt;String, String, String&gt; concat = String::concat;
BiFunction&lt;Integer, Integer, Integer&gt; max = Integer::max;</code></pre>
          </div>

          <div class="syntax-item">
            <h4>方法引用类型</h4>
            <pre><code class="language-java">// 静态方法引用
Function&lt;String, Integer&gt; parseInt = Integer::parseInt;
BinaryOperator&lt;Integer&gt; max = Integer::max;

// 实例方法引用
String str = "hello";
Supplier&lt;String&gt; upper = str::toUpperCase;
Function&lt;String, Boolean&gt; startsWith = str::startsWith;

// 类的实例方法引用
Function&lt;String, String&gt; trim = String::trim;
Comparator&lt;String&gt; compare = String::compareToIgnoreCase;

// 构造方法引用
Supplier&lt;List&lt;String&gt;&gt; listSupplier = ArrayList::new;
Function&lt;Integer, List&lt;String&gt;&gt; listWithSize = ArrayList::new;
BiFunction&lt;String, Integer, Person&gt; personCreator = Person::new;</code></pre>
          </div>

          <div class="syntax-item">
            <h4>Lambda应用场景</h4>
            <pre><code class="language-java">// 集合操作
List&lt;String&gt; words = Arrays.asList("apple", "banana", "cherry");

// 过滤和映射
List&lt;String&gt; result = words.stream()
    .filter(w -&gt; w.length() > 5)
    .map(String::toUpperCase)
    .collect(Collectors.toList());

// 排序
words.sort((a, b) -&gt; a.length() - b.length());
words.sort(Comparator.comparing(String::length));

// 线程
Thread thread = new Thread(() -&gt; {
    System.out.println("在新线程中运行");
});

// 事件处理（如果是GUI应用）
button.addActionListener(e -&gt; System.out.println("按钮被点击"));

// Optional操作
Optional&lt;String&gt; optional = Optional.of("hello");
optional.ifPresent(System.out::println);
String result = optional.map(String::toUpperCase).orElse("DEFAULT");</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 注解 -->
    <div id="annotations" class="tool-card">
      <div class="card-header">
        <el-icon class="icon"><DocumentCopy /></el-icon>
        <div>
          <h2 class="title">注解(Annotations)</h2>
          <p class="description">Java注解的使用和自定义注解</p>
        </div>
      </div>

      <div class="card-body">
        <div class="syntax-grid">
          <div class="syntax-item">
            <h4>内置注解</h4>
            <pre><code class="language-java">// @Override - 重写父类方法
public class Child extends Parent {
    @Override
    public void method() {
        super.method();
    }
}

// @Deprecated - 标记过时
@Deprecated
public void oldMethod() {
    // 已过时的方法
}

// @SuppressWarnings - 抑制警告
@SuppressWarnings("unchecked")
public void method() {
    List list = new ArrayList();
}

// @SafeVarargs - 安全的可变参数
@SafeVarargs
public static &lt;T&gt; void print(T... items) {
    for (T item : items) {
        System.out.println(item);
    }
}</code></pre>
          </div>

          <div class="syntax-item">
            <h4>自定义注解</h4>
            <pre><code class="language-java">// 定义注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {
    String value() default "";
    int timeout() default 30;
    String[] tags() default {};
}

// 使用自定义注解
public class MyService {
    @MyAnnotation(value = "重要方法", timeout = 60, tags = {"service", "important"})
    public void importantMethod() {
        // 方法实现
    }
}

// 处理注解
public void processAnnotations(Class&lt;?&gt; clazz) {
    Method[] methods = clazz.getDeclaredMethods();
    for (Method method : methods) {
        if (method.isAnnotationPresent(MyAnnotation.class)) {
            MyAnnotation annotation = method.getAnnotation(MyAnnotation.class);
            System.out.println("Value: " + annotation.value());
            System.out.println("Timeout: " + annotation.timeout());
        }
    }
}</code></pre>
          </div>

          <div class="syntax-item">
            <h4>Spring常用注解</h4>
            <pre><code class="language-java">// Spring Boot应用
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// 控制器
@RestController
@RequestMapping("/api")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
    
    @PostMapping("/users")
    public User createUser(@RequestBody @Valid User user) {
        return userService.save(user);
    }
}

// 服务层
@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Cacheable("users")
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}</code></pre>
          </div>

          <div class="syntax-item">
            <h4>JPA注解</h4>
            <pre><code class="language-java">// 实体类
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", unique = true, nullable = false)
    private String username;
    
    @Column(name = "email")
    @Email
    private String email;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List&lt;Order&gt; orders = new ArrayList&lt;&gt;();
    
    // 构造器、getter、setter省略
}

// Repository
@Repository
public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional&lt;User&gt; findByEmail(String email);
    
    @Modifying
    @Query("UPDATE User u SET u.lastLogin = ?1 WHERE u.id = ?2")
    void updateLastLogin(LocalDateTime lastLogin, Long userId);
}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速参考 -->
    <div id="quick-reference" class="tool-card">
      <div class="card-header">
        <el-icon class="icon"><Lightning /></el-icon>
        <div>
          <h2 class="title">快速参考</h2>
          <p class="description">Java开发常用代码片段和最佳实践</p>
        </div>
      </div>

      <div class="card-body">
        <div class="reference-grid">
          <div class="reference-section">
            <h4>字符串操作</h4>
            <div class="reference-items">
              <div class="reference-item">
                <strong>判空:</strong>
                <code>str != null && !str.trim().isEmpty()</code>
              </div>
              <div class="reference-item">
                <strong>格式化:</strong>
                <code>String.format("Hello %s, age %d", name, age)</code>
              </div>
              <div class="reference-item">
                <strong>分割:</strong>
                <code>String[] parts = str.split(",");</code>
              </div>
              <div class="reference-item">
                <strong>连接:</strong>
                <code>String.join(",", list)</code>
              </div>
            </div>
          </div>

          <div class="reference-section">
            <h4>日期时间</h4>
            <div class="reference-items">
              <div class="reference-item">
                <strong>当前时间:</strong>
                <code>LocalDateTime.now()</code>
              </div>
              <div class="reference-item">
                <strong>格式化:</strong>
                <code>dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))</code>
              </div>
              <div class="reference-item">
                <strong>解析:</strong>
                <code>LocalDate.parse("2023-12-25")</code>
              </div>
              <div class="reference-item">
                <strong>计算:</strong>
                <code>date.plusDays(7).minusHours(2)</code>
              </div>
            </div>
          </div>

          <div class="reference-section">
            <h4>文件操作</h4>
            <div class="reference-items">
              <div class="reference-item">
                <strong>读取文件:</strong>
                <code>Files.readAllLines(Paths.get("file.txt"))</code>
              </div>
              <div class="reference-item">
                <strong>写入文件:</strong>
                <code>Files.write(path, content.getBytes())</code>
              </div>
              <div class="reference-item">
                <strong>检查存在:</strong>
                <code>Files.exists(path)</code>
              </div>
              <div class="reference-item">
                <strong>创建目录:</strong>
                <code>Files.createDirectories(path)</code>
              </div>
            </div>
          </div>

          <div class="reference-section">
            <h4>JSON处理</h4>
            <div class="reference-items">
              <div class="reference-item">
                <strong>对象转JSON:</strong>
                <code>objectMapper.writeValueAsString(object)</code>
              </div>
              <div class="reference-item">
                <strong>JSON转对象:</strong>
                <code>objectMapper.readValue(json, MyClass.class)</code>
              </div>
              <div class="reference-item">
                <strong>忽略未知属性:</strong>
                <code>@JsonIgnoreProperties(ignoreUnknown = true)</code>
              </div>
              <div class="reference-item">
                <strong>日期格式:</strong>
                <code>@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 常用算法实现 -->
    <div id="algorithms" class="tool-card">
      <div class="card-header">
        <el-icon class="icon"><MagicStick /></el-icon>
        <div>
          <h2 class="title">常用算法实现</h2>
          <p class="description">Java实现的经典算法和数据结构操作</p>
        </div>
      </div>

      <div class="card-body">
        <div class="syntax-grid">
          <div class="syntax-item">
            <h4>排序算法</h4>
            <pre><code class="language-java">// 冒泡排序
public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i &lt; n - 1; i++) {
        for (int j = 0; j &lt; n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换元素
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

// 快速排序
public static void quickSort(int[] arr, int low, int high) {
    if (low &lt; high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    
    for (int j = low; j &lt; high; j++) {
        if (arr[j] &lt;= pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    return i + 1;
}</code></pre>
          </div>

          <div class="syntax-item">
            <h4>查找算法</h4>
            <pre><code class="language-java">// 二分查找
public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    
    while (left &lt;= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        }
        
        if (arr[mid] &lt; target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // 未找到
}

// 线性查找
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i &lt; arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1; // 未找到
}

// 查找最大值和最小值
public static int[] findMinMax(int[] arr) {
    if (arr.length == 0) return new int[]{0, 0};
    
    int min = arr[0], max = arr[0];
    for (int num : arr) {
        min = Math.min(min, num);
        max = Math.max(max, num);
    }
    return new int[]{min, max};
}</code></pre>
          </div>

          <div class="syntax-item">
            <h4>数组操作</h4>
            <pre><code class="language-java">// 数组去重
public static int[] removeDuplicates(int[] arr) {
    return Arrays.stream(arr)
        .distinct()
        .toArray();
}

// 数组反转
public static void reverseArray(int[] arr) {
    int start = 0;
    int end = arr.length - 1;
    
    while (start &lt; end) {
        int temp = arr[start];
        arr[start] = arr[end];
        arr[end] = temp;
        start++;
        end--;
    }
}

// 数组旋转（右旋k位）
public static void rotateArray(int[] arr, int k) {
    k = k % arr.length;
    reverse(arr, 0, arr.length - 1);
    reverse(arr, 0, k - 1);
    reverse(arr, k, arr.length - 1);
}

private static void reverse(int[] arr, int start, int end) {
    while (start &lt; end) {
        int temp = arr[start];
        arr[start] = arr[end];
        arr[end] = temp;
        start++;
        end--;
    }
}

// 找到数组中第K大的元素
public static int findKthLargest(int[] nums, int k) {
    PriorityQueue&lt;Integer&gt; minHeap = new PriorityQueue&lt;&gt;();
    
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
    }
    
    return minHeap.peek();
}</code></pre>
          </div>

          <div class="syntax-item">
            <h4>字符串算法</h4>
            <pre><code class="language-java">// 判断回文字符串
public static boolean isPalindrome(String s) {
    s = s.toLowerCase().replaceAll("[^a-z0-9]", "");
    int left = 0, right = s.length() - 1;
    
    while (left &lt; right) {
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// 最长公共前缀
public static String longestCommonPrefix(String[] strs) {
    if (strs.length == 0) return "";
    
    String prefix = strs[0];
    for (int i = 1; i &lt; strs.length; i++) {
        while (strs[i].indexOf(prefix) != 0) {
            prefix = prefix.substring(0, prefix.length() - 1);
            if (prefix.isEmpty()) return "";
        }
    }
    return prefix;
}

// 字符串匹配（KMP算法简化版）
public static int strStr(String haystack, String needle) {
    if (needle.isEmpty()) return 0;
    
    for (int i = 0; i &lt;= haystack.length() - needle.length(); i++) {
        if (haystack.substring(i, i + needle.length()).equals(needle)) {
            return i;
        }
    }
    return -1;
}

// 字符串反转
public static String reverseString(String s) {
    return new StringBuilder(s).reverse().toString();
}

// 统计字符频率
public static Map&lt;Character, Integer&gt; countCharacters(String s) {
    return s.chars()
        .mapToObj(c -&gt; (char) c)
        .collect(Collectors.groupingBy(
            Function.identity(),
            Collectors.summingInt(c -&gt; 1)
        ));
}</code></pre>
          </div>

          <div class="syntax-item">
            <h4>链表操作</h4>
            <pre><code class="language-java">// 链表节点定义
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

// 反转链表
public static ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        ListNode nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}

// 合并两个有序链表
public static ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode current = dummy;
    
    while (l1 != null && l2 != null) {
        if (l1.val &lt;= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    
    current.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}

// 检测链表是否有环
public static boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) return false;
    
    ListNode slow = head;
    ListNode fast = head.next;
    
    while (slow != fast) {
        if (fast == null || fast.next == null) return false;
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return true;
}</code></pre>
          </div>

          <div class="syntax-item">
            <h4>数学算法</h4>
            <pre><code class="language-java">// 斐波那契数列
public static int fibonacci(int n) {
    if (n &lt;= 1) return n;
    
    int a = 0, b = 1;
    for (int i = 2; i &lt;= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}

// 最大公约数（欧几里德算法）
public static int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// 最小公倍数
public static int lcm(int a, int b) {
    return (a * b) / gcd(a, b);
}

// 判断素数
public static boolean isPrime(int n) {
    if (n &lt;= 1) return false;
    if (n &lt;= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    
    for (int i = 5; i * i &lt;= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) {
            return false;
        }
    }
    return true;
}

// 计算阶乘
public static long factorial(int n) {
    if (n &lt;= 1) return 1;
    
    long result = 1;
    for (int i = 2; i &lt;= n; i++) {
        result *= i;
    }
    return result;
}

// 幂运算（快速幂）
public static long power(long base, int exp) {
    long result = 1;
    while (exp > 0) {
        if (exp % 2 == 1) {
            result *= base;
        }
        base *= base;
        exp /= 2;
    }
    return result;
}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { 
  CaretTop, 
  ArrowLeft, 
  ArrowRight, 
  Lightning, 
  Document, 
  Files,
  Sort,
  Grid,
  Filter,
  WarningFilled,
  Connection,
  MagicStick,
  DocumentCopy
} from '@element-plus/icons-vue'

// 响应式数据
const navCollapsed = ref(false)
const showMobileNav = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const searchSuggestions = ref([])

// 搜索建议数据
const suggestions = [
  'Stream排序', 'Stream分组', 'Stream过滤', 'Lambda表达式', 'Optional用法',
  '异常处理', '并发编程', 'CompletableFuture', '线程池', '集合操作',
  'Map操作', 'List操作', 'Set操作', '方法引用', '函数式接口',
  'Spring注解', 'JPA注解', '自定义注解', '文件操作', 'JSON处理'
]

// 搜索功能
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    searchSuggestions.value = []
    return
  }

  // 显示搜索建议
  searchSuggestions.value = suggestions.filter(item => 
    item.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).slice(0, 5)

  // 模拟搜索结果
  searchResults.value = suggestions.filter(item =>
    item.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

// 导航功能
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToScenario = (scenarioId: string) => {
  const element = document.getElementById(scenarioId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    // 添加高亮效果
    element.classList.add('highlighted')
    setTimeout(() => {
      element.classList.remove('highlighted')
    }, 2000)
  }
}

// 键盘快捷键
const handleKeyboardShortcuts = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'f':
        event.preventDefault()
        const searchInput = document.querySelector('.search-input input') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
        break
      case '1':
        event.preventDefault()
        scrollToSection('basic-syntax')
        break
      case '2':
        event.preventDefault()
        scrollToSection('stream-api')
        break
      case '3':
        event.preventDefault()
        scrollToSection('lambda')
        break
    }
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeyboardShortcuts)
  
  // 移动端检测
  const checkMobile = () => {
    showMobileNav.value = window.innerWidth <= 768
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts)
})
</script>

<style scoped>
@import '@/styles/modern-tool.css';

.java-syntax {
  --tool-color: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
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
  background: linear-gradient(45deg, #f8fafc, #e2e8f0);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.icon {
  font-size: 24px;
  color: #f97316;
}

.title {
  margin: 0;
  color: #1e293b;
  font-size: 20px;
  font-weight: 600;
}

.description {
  margin: 5px 0 0 0;
  color: #64748b;
  font-size: 14px;
}

.card-body {
  padding: 30px;
}

/* 场景快捷按钮 */
.scenario-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
}

.scenario-buttons .el-button {
  border-radius: 8px;
  font-weight: 500;
}

/* 场景区域 */
.scenario-section {
  margin-bottom: 40px;
  padding: 25px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #f97316;
}

.scenario-section h3 {
  color: #1e293b;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.scenario-step {
  margin-bottom: 25px;
}

.scenario-step h4 {
  color: #374151;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
}

.scenario-step pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

/* 语法网格 */
.syntax-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
}

.syntax-item {
  background: #f8fafc;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.syntax-item h4 {
  color: #1e293b;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.syntax-item h4::before {
  content: '▶';
  color: #f97316;
  font-size: 12px;
}

/* 搜索容器 */
.search-container {
  margin-bottom: 30px;
  position: relative;
}

.search-input {
  max-width: 500px;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-width: 500px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.suggestion-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background: #f1f5f9;
}

.search-stats {
  margin-top: 8px;
  color: #64748b;
  font-size: 14px;
}

/* 浮动导航 */
.floating-nav {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(249, 115, 22, 0.2);
  z-index: 999;
  transition: all 0.3s ease;
  width: 280px;
  max-height: 70vh;
  overflow-y: auto;
}

.floating-nav.collapsed {
  width: 50px;
  overflow: hidden;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(249, 115, 22, 0.1);
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border-radius: 16px 16px 0 0;
}

.nav-header h4 {
  margin: 0;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.nav-header .el-button {
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-header .el-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.nav-content {
  padding: 15px;
}

.nav-section {
  margin-bottom: 20px;
}

.nav-section h5 {
  color: #374151;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-item {
  padding: 8px 12px;
  color: #64748b;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #f97316;
}

/* 移动端导航 */
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.mobile-nav-content {
  display: flex;
  overflow-x: auto;
  padding: 15px;
  gap: 10px;
}

.mobile-nav-item {
  flex-shrink: 0;
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 6px;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-nav-item:hover {
  background: #f97316;
  color: white;
}

/* 返回顶部按钮 */
.back-to-top {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-to-top:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}

/* 快速参考样式 */
.reference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.reference-section {
  background: #f8fafc;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.reference-section h4 {
  color: #1e293b;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
}

.reference-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reference-item {
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.reference-item strong {
  color: #f97316;
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.reference-item code {
  background: #1e293b;
  color: #e2e8f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  display: block;
  overflow-x: auto;
}

/* 高亮动画 */
.highlighted {
  animation: highlight 2s ease-in-out;
}

@keyframes highlight {
  0% { background-color: rgba(249, 115, 22, 0.1); }
  50% { background-color: rgba(249, 115, 22, 0.2); }
  100% { background-color: transparent; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .java-syntax {
    padding: 15px;
  }
  
  .floating-nav {
    display: none;
  }
  
  .mobile-nav {
    display: block;
  }
  
  .syntax-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .scenario-buttons {
    flex-direction: column;
  }
  
  .scenario-buttons .el-button {
    width: 100%;
  }
  
  .reference-grid {
    grid-template-columns: 1fr;
  }
}
</style>
