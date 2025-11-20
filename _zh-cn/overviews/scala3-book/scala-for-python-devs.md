---
title: Scala for Python Developers
type: chapter
description: This page is for Python developers who are interested in learning about Scala 3.
language: zh-cn
num: 75
previous-page: scala-for-javascript-devs
next-page: where-next

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---

{% include_relative scala4x.css %}

<div markdown="1" class="scala3-comparison-page">

{% comment %}

NOTE: Hopefully someone with more Python experience can give this a thorough review.

NOTE: On this page (https://contributors.scala-lang.org/t/feedback-sought-optional-braces/4702/10), Li Haoyi comments: “Python’s success also speaks for itself; beginners certainly don’t pick Python because of performance, ease of installation, packaging, IDE support, or simplicity of the language’s runtime semantics!” I’m not a Python expert, so these points are good to know, though I don’t want to go negative in any comparisons.
It’s more like thinking, “Python developers will appreciate Scala’s performance, ease of installation, packaging, IDE support, etc.”
{% endcomment %}

{% comment %}
TODO: We should probably go through this document and add links to our other detail pages, when time permits.
{% endcomment %}

本节提供了 Python 和 Scala 编程语言之间的比较。
它适用于懂得 Python 并希望了解 Scala 的程序员，特别是通过查看 Python 语言特性与 Scala 比较的示例。

## 介绍

在进入示例之前，第一部分提供了以下部分的相对简短的介绍和总结。
这两种语言首先在高层次上进行比较，然后在日常编程层次上进行比较。

### 高层次相似性

在高层次上，Scala 与 Python 有这些*相似之处*：

- 两者都是高级编程语言，您不必关心指针和手动内存管理等低级概念
- 两者都有一个相对简单、简洁的语法
- 两者都支持[函数式编程][fp-intro]
- 两者都是面向对象的编程 (OOP) 语言
- 两者都有推导：Python 有列表推导，Scala 有 `for` 推导
- 两种语言都支持 lambdas 和 [高阶函数][hofs]
- 两者都可以与 [Apache Spark](https://spark.apache.org) 一起用于大数据处理
- 两者都有很多很棒的库

### 高层次差异

同样在高层次上，Python 和 Scala 之间的_差异_是：

- Python 是动态类型的，Scala 是静态类型的
  - 虽然它是静态类型的，但 Scala 的类型推断等特性让它感觉像是一门动态语言
- Python 被解释，Scala 代码被编译成 _.class_ 文件，并在 Java 虚拟机 (JVM) 上运行
- 除了在 JVM 上运行之外，[Scala.js](https://www.scala-js.org) 项目允许您使用 Scala 作为 JavaScript 替代品
- [Scala Native](https://scala-native.org/) 项目可让您编写“系统”级代码，并编译为本机可执行文件
- Scala 中的一切都是一个_表达式_：像 `if` 语句、`for` 循环、`match` 表达式，甚至 `try`/`catch` 表达式都有返回值
- Scala 习惯默认不变性：鼓励您使用不可变变量和不可变集合
- Scala 对[并发和并行编程][concurrency]有很好的支持

### 编程层次相似性

本节介绍您在日常编写代码时会看到 Python 和 Scala 之间的相似之处：

- Scala 的类型推断常常让人感觉像是一种动态类型语言
- 两种语言都不使用分号来结束表达式
- 两种语言都支持使用重要的缩进而不是大括号和圆括号
- 定义方法的语法类似
- 两者都有列表、字典（映射）、集合和元组
- 两者都有映射和过滤的推导
- 使用 Scala 3 的[顶级定义][toplevel]，您可以将方法、字段和其他定义放在任何地方
  - 一个区别是 Python 甚至可以在不声明单个方法的情况下运行，而 Scala 3 不能在顶层做_所有事_；例如，启动 Scala 应用程序需要一个 [main 方法][main-method] (`@main def`)

### 编程层次差异

同样在编程级别，这些是您在编写代码时每天都会看到的一些差异：

- 在 Scala 中编程感觉非常一致：
  - `val` 和 `var` 字段用于定义字段和参数
  - 列表、映射、集合和元组都以类似方式创建和访问；例如，括号用于创建所有类型---`List(1,2,3)`, `Set(1,2,3)`, `Map(1->"one")`---就像创建任何其他 Scala 类
  - [集合类][collections-classes] 通常具有大部分相同的高阶函数
  - 模式匹配在整个语言中一致使用
  - 用于定义传递给方法的函数的语法与用于定义匿名函数的语法相同
- Scala 变量和参数使用 `val`（不可变）或 `var`（可变）关键字定义
- Scala 习惯用法更喜欢不可变的数据结构
- Scala 通过 IntelliJ IDEA 和 Microsoft VS Code 提供了极好的 IDE 支持
- 注释：Python 使用 `#` 表示注释； Scala 使用 C、C++ 和 Java 样式：`//`、`/*...*/` 和 `/**...*/`
- 命名约定：Python 标准是使用下划线，例如 `my_list`； Scala 使用 `myList`
- Scala 是静态类型的，因此您可以声明方法参数、方法返回值和其他地方的类型
- 模式匹配和 `match` 表达式在 Scala 中被广泛使用（并且会改变你编写代码的方式）
- Scala 中大量使用 trait；接口和抽象类在 Python 中使用较少
- Scala 的 [上下文抽象][contextual] 和 _术语推导_提供了一系列不同的特性：
  - [扩展方法][extension-method]让您使用清晰的语法轻松地向类添加新功能
  - [多元等式][multiversal] 让您限制相等比较---在编译时——只有那些有意义的比较
- Scala 拥有最先进的开源函数式编程库（参见 [“Awesome Scala” 列表](https://github.com/lauris/awesome-scala)）
- 借助对象、按名称参数、中缀表示法、可选括号、扩展方法、高阶函数等功能，您可以创建自己的“控制结构”和 DSL
- Scala 代码可以在 JVM 中运行，甚至可以编译为原生代码（使用 [Scala Native](https://github.com/scala-native/scala-native) 和 [GraalVM](https://www.graalvm) .org)) 实现高性能
- 许多其他好东西：样例类、伴生类和对象、宏、[联合][union-types] 和 [交集][intersection-types] 类型、[顶级定义][toplevel]、数字字面量、多参数列表和更多的

### 特性比较示例

鉴于该介绍，以下部分提供了 Python 和 Scala 编程语言功能的并排比较。

{% comment %}
TODO: Update the Python examples to use four spaces. I started to do this, but then thought it would be better to do that in a separate PR.
{% endcomment %}

## 注释

Python 使用 `#` 表示注释，而 Scala 的注释语法与 C、C++ 和 Java 等语言相同：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code># a comment</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// a comment
        <br>/* ... */
        <br>/** ... */</code>
      </td>
    </tr>
  </tbody>
</table>

## 变量赋值

这些例子演示了如何在 Python 和 Scala 中创建变量。

### 创建整数和字符串变量：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = 1
        <br>x = "Hi"
        <br>y = """foo
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; bar
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; baz"""</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val x = 1
        <br>val x = "Hi"
        <br>val y = """foo
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; bar
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; baz"""</code>
      </td>
    </tr>
  </tbody>
</table>

### 列表：

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = [1,2,3]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = List(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

### 字典/映射：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = {
        <br>&nbsp; "Toy Story": 8.3,
        <br>&nbsp; "Forrest Gump": 8.8,
        <br>&nbsp; "Cloud Atlas": 7.4
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val x = Map(
        <br>&nbsp; "Toy Story" -&gt; 8.3,
        <br>&nbsp; "Forrest Gump" -&gt; 8.8,
        <br>&nbsp; "Cloud Atlas" -&gt; 7.4
        <br>)</code>
      </td>
    </tr>
  </tbody>
</table>

### 集合：

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = {1,2,3}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = Set(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

### 元组：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = (11, "Eleven")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = (11, "Eleven")</code>
      </td>
    </tr>
  </tbody>
</table>

如果 Scala 字段是可变的，请使用 `var` 而不是 `val` 来定义变量：

```scala
var x = 1
x += 1
```

然而，Scala 中的经验法则是始终使用 `val`，除非变量确实需要被改变。

## OOP 风格的类和方法

本节比较了与 OOP 风格的类和方法相关的特性。

### OOP 风格类，主构造函数：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>class Person(object):
        <br>&nbsp; def __init__(self, name):
        <br>&nbsp;&nbsp;&nbsp; self.name = name
        <br>
        <br>&nbsp; def speak(self):
        <br>&nbsp;&nbsp;&nbsp; print(f'Hello, my name is {self.name}')</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class Person (var name: String):
        <br>&nbsp; def speak() = println(s"Hello, my name is $name")</code>
      </td>
    </tr>
  </tbody>
</table>

### 创建和使用实例：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>p = Person("John")
        <br>p.name&nbsp;&nbsp; # John
        <br>p.name = 'Fred'
        <br>p.name&nbsp;&nbsp; # Fred
        <br>p.speak()</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val p = Person("John")
        <br>p.name&nbsp;&nbsp; // John
        <br>p.name = "Fred"
        <br>p.name&nbsp;&nbsp; // Fred
        <br>p.speak()</code>
      </td>
    </tr>
  </tbody>
</table>

### 单行方法：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>def add(a, b): return a + b</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>def add(a: Int, b: Int): Int = a + b</code>
      </td>
    </tr>
  </tbody>
</table>

### 多行方法：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>def walkThenRun():
        <br>&nbsp; print('walk')
        <br>&nbsp; print('run')</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>def walkThenRun() =
        <br>&nbsp; println("walk")
        <br>&nbsp; println("run")</code>
      </td>
    </tr>
  </tbody>
</table>

## 接口，traits，和继承

如果您熟悉 Java 8 和更新版本，Scala trait 类似于那些 Java 接口。
Traits 在 Scala 中一直使用，而 Python 接口和抽象类的使用频率要低得多。
因此，与其试图比较两者，不如用这个例子来展示如何使用 Scala trait来构建一个模拟数学问题的小解决方案：

```scala
trait Adder:
  def add(a: Int, b: Int) = a + b

trait Multiplier:
  def multiply(a: Int, b: Int) = a * b

// create a class from the traits
class SimpleMath extends Adder, Multiplier
val sm = new SimpleMath
sm.add(1,1)        // 2
sm.multiply(2,2)   // 4
```

还有[许多其他方法可以将 trait 与类和对象一起使用][modeling-intro]，但这让您了解如何使用它们将概念组织成行为的逻辑组，然后根据需要将它们合并以创建一个完整的解决方案。

## 控制结构

本节比较 Python 和 Scala 中的[控制结构][control-structures]。
两种语言都有类似 `if`/`else`、`while`、`for` 循环和 `try` 的结构。
Scala 也有 `match` 表达式。

### `if` 语句，单行：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>if x == 1: print(x)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>if x == 1 then println(x)</code>
      </td>
    </tr>
  </tbody>
</table>

### `if` 语句，多行：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>if x == 1:
        <br>&nbsp; print("x is 1, as you can see:")
        <br>&nbsp; print(x)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>if x == 1 then
        <br>&nbsp; println("x is 1, as you can see:")
        <br>&nbsp; println(x)</code>
      </td>
    </tr>
  </tbody>
</table>

### if, else if, else:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>if x &lt; 0:
        <br>&nbsp; print("negative")
        <br>elif x == 0:
        <br>&nbsp; print("zero")
        <br>else:
        <br>&nbsp; print("positive")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>if x &lt; 0 then
        <br>&nbsp; println("negative")
        <br>else if x == 0 then
        <br>&nbsp; println("zero")
        <br>else
        <br>&nbsp; println("positive")</code>
      </td>
    </tr>
  </tbody>
</table>

### 从 `if` 返回值：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>min_val = a if a &lt; b else b</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val minValue = if a &lt; b then a else b</code>
      </td>
    </tr>
  </tbody>
</table>

###  `if` 作为方法体：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>def min(a, b):
        <br>&nbsp; return a if a &lt; b else b</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>def min(a: Int, b: Int): Int =
        <br>&nbsp; if a &lt; b then a else b</code>
      </td>
    </tr>
  </tbody>
</table>

### `while` 循环：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>i = 1
        <br>while i &lt; 3:
        <br>&nbsp; print(i)
        <br>&nbsp; i += 1</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>var i = 1
        <br>while i &lt; 3 do
        <br>&nbsp; println(i)
        <br>&nbsp; i += 1</code>
      </td>
    </tr>
  </tbody>
</table>

### 有范围的 `for` 循环：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(0,3):
        <br>&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// preferred
        <br>for i &lt;- 0 until 3 do println(i)
        <br>
        <br>// also available
        <br>for (i &lt;- 0 until 3) println(i)
        <br>
        <br>// multiline syntax
        <br>for
        <br>&nbsp; i &lt;- 0 until 3
        <br>do
        <br>&nbsp; println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### 列表的 `for` 循环：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in ints: print(i)
        <br>
        <br>for i in ints:
        <br>&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>for i &lt;- ints do println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### `for` 循环，多行：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in ints:
        <br>&nbsp; x = i * 2
        <br>&nbsp; print(f"i = {i}, x = {x}")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- ints
        <br>do
        <br>&nbsp; val x = i * 2
        <br>&nbsp; println(s"i = $i, x = $x")</code>
      </td>
    </tr>
  </tbody>
</table>

### 多“范围”生成器：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(1,3):
        <br>&nbsp; for j in range(4,6):
        <br>&nbsp;&nbsp;&nbsp; for k in range(1,10,3):
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; print(f"i = {i}, j = {j}, k = {k}")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- 1 to 2
        <br>&nbsp; j &lt;- 4 to 5
        <br>&nbsp; k &lt;- 1 until 10 by 3
        <br>do
        <br>&nbsp; println(s"i = $i, j = $j, k = $k")</code>
      </td>
    </tr>
  </tbody>
</table>

### 带守卫（`if` 表达式）的生成器：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(1,11):
        <br>&nbsp; if i % 2 == 0:
        <br>&nbsp;&nbsp;&nbsp; if i &lt; 5:
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- 1 to 10
        <br>&nbsp; if i % 2 == 0
        <br>&nbsp; if i &lt; 5
        <br>do
        <br>&nbsp; println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### 每行有多个 `if` 条件：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(1,11):
        <br>&nbsp; if i % 2 == 0 and i &lt; 5:
        <br>&nbsp;&nbsp;&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- 1 to 10
        <br>&nbsp; if i % 2 == 0 &amp;&amp; i &lt; 5
        <br>do
        <br>&nbsp; println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### 推导：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>xs = [i * 10 for i in range(1, 4)]
        <br># xs: [10,20,30]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val xs = for i &lt;- 1 to 3 yield i * 10
        <br>// xs: Vector(10, 20, 30)</code>
      </td>
    </tr>
  </tbody>
</table>

### `match` 表达式：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code># From 3.10, Python supports structural pattern matching
        <br># You can also use dictionaries for basic “switch” functionality
        <br>match month:
        <br>&nbsp; case 1:
        <br>&nbsp;&nbsp;&nbsp; monthAsString = "January"
        <br>&nbsp; case 2:
        <br>&nbsp;&nbsp;&nbsp; monthAsString = "February"
        <br>&nbsp; case _:
        <br>&nbsp;&nbsp;&nbsp; monthAsString = "Other"</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val monthAsString = month match
        <br>&nbsp; case 1 =&gt; "January"
        <br>&nbsp; case 2 =&gt; "February"
        <br>&nbsp; _ =&gt; "Other"</code>
      </td>
    </tr>
  </tbody>
</table>

### switch/match:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code># Only from Python 3.10
        <br>match i:
        <br>&nbsp; case 1 | 3 | 5 | 7 | 9:
        <br>&nbsp;&nbsp;&nbsp; numAsString = "odd"
        <br>&nbsp; case 2 | 4 | 6 | 8 | 10:
        <br>&nbsp;&nbsp;&nbsp; numAsString = "even"
        <br>&nbsp; case _:
        <br>&nbsp;&nbsp;&nbsp; numAsString = "too big"</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val numAsString = i match
        <br>&nbsp; case 1 | 3 | 5 | 7 | 9 =&gt; "odd"
        <br>&nbsp; case 2 | 4 | 6 | 8 | 10 =&gt; "even"
        <br>&nbsp; case _ =&gt; "too big"</code>
      </td>
    </tr>
  </tbody>
</table>

### try, catch, finally:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>try:
        <br>&nbsp; print(a)
        <br>except NameError:
        <br>&nbsp; print("NameError")
        <br>except:
        <br>&nbsp; print("Other")
        <br>finally:
        <br>&nbsp; print("Finally")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>try
        <br>&nbsp; writeTextToFile(text)
        <br>catch
        <br>&nbsp; case ioe: IOException =&gt;
        <br>&nbsp;&nbsp;&nbsp; println(ioe.getMessage)
        <br>&nbsp; case fnf: FileNotFoundException =&gt;
        <br>&nbsp;&nbsp;&nbsp; println(fnf.getMessage)
        <br>finally
        <br>&nbsp; println("Finally")</code>
      </td>
    </tr>
  </tbody>
</table>

匹配表达式和模式匹配是 Scala 编程体验的重要组成部分，但这里只展示了几个 `match` 表达式功能。 有关更多示例，请参见 [控制结构][control-structures] 页面。

## 集合类

本节比较 Python 和 Scala 中可用的 [集合类][collections-classes]，包括列表、字典/映射、集合和元组。

### 列表

Python 有它的列表，Scala 有几个不同的专门的可变和不可变序列类，具体取决于您的需要。
因为 Python 列表是可变的，所以它最直接地与 Scala 的 `ArrayBuffer` 进行比较。

### Python 列表 &amp; Scala序列：
Match expressions and pattern matching are a big part of the Scala programming experience, but only a few `match` expression features are shown here. See the [Control Structures][control-structures] page for many more examples.

## Collections classes

This section compares the [collections classes][collections-classes] that are available in Python and Scala, including lists, dictionaries/maps, sets, and tuples.

### Lists

Where Python has its list, Scala has several different specialized mutable and immutable sequence classes, depending on your needs.
Because the Python list is mutable, it most directly compares to Scala’s `ArrayBuffer`.

### Python list &amp; Scala sequences:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>a = [1,2,3]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// use different sequence classes
        <br>// as needed
        <br>val a = List(1,2,3)
        <br>val a = Vector(1,2,3)
        <br>val a = ArrayBuffer(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

### 获取列表元素：
<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>a[0]<br>a[1]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>a(0)<br>a(1)</code>   // just like all other method calls
      </td>
    </tr>
  </tbody>
</table>

### 更新列表元素：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>a[0] = 10
        <br>a[1] = 20</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// ArrayBuffer is mutable
        <br>a(0) = 10
        <br>a(1) = 20</code>
      </td>
    </tr>
  </tbody>
</table>

### 合并两个列表：

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>c = a + b</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val c = a ++ b</code>
      </td>
    </tr>
  </tbody>
</table>

### 遍历列表：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in ints: print(i)
        <br>
        <br>for i in ints:
        <br>&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// preferred
        <br>for i &lt;- ints do println(i)
        <br>
        <br>// also available
        <br>for (i &lt;- ints) println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

Scala 的主要序列类是 `List`、`Vector` 和 `ArrayBuffer`。
`List` 和 `Vector` 是当你想要一个不可变序列时使用的主要类，而 `ArrayBuffer` 是当你想要一个可变序列时使用的主要类。
（Scala 中的“缓冲区”是一个可以增长和缩小的序列。）

### 字典/映射

Python 字典就像_可变的_ Scala  `Map` 类。
但是，默认的 Scala 映射是_不可变的_，并且有许多转换方法可以让您轻松创建新映射。

#### 字典/映射 创建：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>my_dict = {
        <br>&nbsp; 'a': 1,
        <br>&nbsp; 'b': 2,
        <br>&nbsp; 'c': 3
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val myMap = Map(
        <br>&nbsp; "a" -&gt; 1,
        <br>&nbsp; "b" -&gt; 2,
        <br>&nbsp; "c" -&gt; 3
        <br>)</code>
      </td>
    </tr>
  </tbody>
</table>

#### 获取字典/映射元素：

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>my_dict['a']&nbsp;&nbsp; # 1</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>myMap("a")&nbsp;&nbsp; // 1</code>
      </td>
    </tr>
  </tbody>
</table>

#### 带 `for` 循环的字典/映射：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for key, value in my_dict.items():
        <br>&nbsp; print(key)
        <br>&nbsp; print(value)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for (key,value) &lt;- myMap do
        <br>&nbsp; println(key)
        <br>&nbsp; println(value)</code>
      </td>
    </tr>
  </tbody>
</table>

Scala 有其他专门的 `Map` 类来满足不同的需求。

### 集合

Python 集合类似于_可变的_ Scala `Set` 类。

#### 集合创建：

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>set = {"a", "b", "c"}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val set = Set(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

#### 重复元素：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>set = {1,2,1}
        <br># set: {1,2}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val set = Set(1,2,1)
        <br>// set: Set(1,2)</code>
      </td>
    </tr>
  </tbody>
</table>

Scala 有其他专门的 `Set` 类来满足不同的需求。

### 元组

Python 和 Scala 元组也很相似。

#### 元组创建：

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>t = (11, 11.0, "Eleven")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val t = (11, 11.0, "Eleven")</code>
      </td>
    </tr>
  </tbody>
</table>

#### 获取元组元素：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>t[0]&nbsp;&nbsp; # 11
        <br>t[1]&nbsp;&nbsp; # 11.0</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>t(0)&nbsp;&nbsp; // 11
        <br>t(1)&nbsp;&nbsp; // 11.0</code>
      </td>
    </tr>
  </tbody>
</table>

## 集合类上的方法

Python 和 Scala 有几个相同的常用函数方法可供它们使用：

- `map`
- `filter`
- `reduce`

如果您习惯于在 Python 中将这些方法与 lambda 表达式一起使用，您会发现 Scala 在其集合类中使用了类似的方法。
为了演示此功能，这里有两个示例列表：

```scala
numbers = (1,2,3)           // python
val numbers = List(1,2,3)   // scala
```

下表中使用了这些列表，显示了如何对其应用映射和过滤算法。

### 映射与推导：

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = [i * 10 for i in numbers]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = for i &lt;- numbers yield i * 10</code>
      </td>
    </tr>
  </tbody>
</table>

### 有推导的过滤：

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>evens = [i for i in numbers if i % 2 == 0]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val evens = numbers.filter(_ % 2 == 0)
      <br>// or
      <br>val evens = for i <- numbers if i % 2 == 0 yield i</code>
      </td>
    </tr>
  </tbody>
</table>

### 映射 &amp; 有推导的过滤：

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = [i * 10 for i in numbers if i % 2 == 0]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val x = numbers.filter(_ % 2 == 0).map(_ * 10)
        <br>// or
        <br>val x = for i <- numbers if i % 2 == 0 yield i * 10</code>
      </td>
    </tr>
  </tbody>
</table>

### 映射：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = map(lambda x: x * 10, numbers)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = numbers.map(_ * 10)</code>
      </td>
    </tr>
  </tbody>
</table>

### 过滤：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>f = lambda x: x &gt; 1
        <br>x = filter(f, numbers)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = numbers.filter(_ &gt; 1)</code>
      </td>
    </tr>
  </tbody>
</table>


### Scala 集合方法：

Scala 集合类有超过 100 种功能方法来简化您的代码。
除了 `map`、`filter` 和 `reduce`，下面列出了其他常用的方法。
在这些方法示例中：

- `c` 指的是一个集合
- `p` 是谓词
- `f` 是一个函数、匿名函数或方法
- `n` 指的是一个整数值

以下是一些可用的过滤方法：

| 方法           | 说明          |
| -------------- | ------------- |
| `c1.diff(c2) ` | 返回 `c1` 和 `c2` 中元素的差异。 |
| `c.distinct`   | 返回 `c` 中的唯一元素。 |
| `c.drop(n)`    | 返回集合中除前 `n` 个元素之外的所有元素。 |
| `c.filter(p) ` | 返回集合中谓词为 `true` 的所有元素。 |
| `c.head`       | 返回集合的第一个元素。 （如果集合为空，则抛出 `NoSuchElementException`。） |
| `c.tail`       | 返回集合中除第一个元素之外的所有元素。 （如果集合为空，则抛出 `UnsupportedOperationException`。） |
| `c.take(n)`    | 返回集合 `c` 的前 `n` 个元素。 |

以下是一些转换方法：

| 方法            | 说明          |
| --------------- | ------------- |
| `c.flatten`     | 将集合的集合（例如列表列表）转换为单个集合（单个列表）。 |
| `c.flatMap(f)`  | 通过将 `f` 应用于集合 `c` 的所有元素（如 `map`）返回一个新集合，然后将结果集合的元素展平。 |
| `c.map(f)`      | 通过将 `f` 应用于集合 `c` 的所有元素来创建一个新集合。 |
| `c.reduce(f)`   | 将 `reduction` 函数 `f` 应用于 `c` 中的连续元素以产生单个值。 |
| `c.sortWith(f)` | 返回由比较函数 `f` 排序的 `c` 版本。 |

一些常见的分组方法：

| 方法             | 说明          |
| ---------------- | ------------- |
| `c.groupBy(f)`   | 根据 `f` 将集合划分为集合的 `Map`。 |
| `c.partition(p)` | 根据谓词 `p` 返回两个集合。 |
| `c.span(p)`      | 返回两个集合的集合，第一个由 `c.takeWhile(p)` 创建，第二个由 `c.dropWhile(p)` 创建。 |
| `c.splitAt(n)`   | 通过在元素 `n` 处拆分集合 `c` 来返回两个集合的集合。 |

一些信息和数学方法：

| 方法           | 说明          |
| -------------- | ------------- |
| `c1.containsSlice(c2)` | 如果 `c1` 包含序列 `c2`，则返回 `true`。 |
| `c.count(p)`   | 计算 `c` 中元素的数量，其中 `p` 为 `true`。 |
| `c.distinct`   | 返回 `c` 中的不重复的元素。 |
| `c.exists(p)`  | 如果集合中任何元素的 `p` 为 `true` ，则返回 `true` 。 |
| `c.find(p)`    | 返回匹配 `p` 的第一个元素。该元素以 `Option[A]` 的形式返回。 |
| `c.min`        | 返回集合中的最小元素。 （可以抛出_java.lang.UnsupportedOperationException_。）|
| `c.max`        | 返回集合中的最大元素。 （可以抛出_java.lang.UnsupportedOperationException_。）|
| `c.slice(from, to)` | 返回从元素 `from` 开始到元素 `to` 结束的元素间隔。 |
| `c.sum`        | 返回集合中所有元素的总和。 （需要为集合中的元素定义 `Ordering`。） |

以下是一些示例，展示了这些方法如何在列表上工作：

```scala
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)
a.distinct                            // List(10, 20, 30, 40)
a.drop(2)                             // List(30, 40, 10)
a.dropRight(2)                        // List(10, 20, 30)
a.dropWhile(_ < 25)                   // List(30, 40, 10)
a.filter(_ < 25)                      // List(10, 20, 10)
a.filter(_ > 100)                     // List()
a.find(_ > 20)                        // Some(30)
a.head                                // 10
a.headOption                          // Some(10)
a.init                                // List(10, 20, 30, 40)
a.intersect(List(19,20,21))           // List(20)
a.last                                // 10
a.lastOption                          // Some(10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeRight(2)                        // List(40, 10)
a.takeWhile(_ < 30)                   // List(10, 20)
```

这些方法展示了 Scala 中的一个常见模式：对象上可用的函数式方法。
这些方法都不会改变初始列表“a”； 相反，它们都返回的数据在注释后显示。

还有更多可用的方法，但希望这些描述和示例能让您体验到预建集合方法的强大功能。

## 枚举

本节比较 Python 和 Scala 3 中的枚举。

### 创建枚举：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>from enum import Enum, auto
        <br>class Color(Enum):
        <br>&nbsp;&nbsp;&nbsp; RED = auto()
        <br>&nbsp;&nbsp;&nbsp; GREEN = auto()
        <br>&nbsp;&nbsp;&nbsp; BLUE = auto()</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>enum Color:
        <br>&nbsp; case Red, Green, Blue</code>
      </td>
    </tr>
  </tbody>
</table>

### 值和比较：

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>Color.RED == Color.BLUE&nbsp; # False</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>Color.Red == Color.Blue&nbsp; // false</code>
      </td>
    </tr>
  </tbody>
</table>

### 参数化枚举：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        N/A
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>enum Color(val rgb: Int):
        <br>&nbsp; case Red&nbsp;&nbsp; extends Color(0xFF0000)
        <br>&nbsp; case Green extends Color(0x00FF00)
        <br>&nbsp; case Blue&nbsp; extends Color(0x0000FF)</code>
      </td>
    </tr>
  </tbody>
</table>

### 用户定义枚举成员：

<table>
  <tbody>
    <tr>
      <td class="python-block">
        N/A
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>enum Planet(
        <br>&nbsp;&nbsp;&nbsp; mass: Double,
        <br>&nbsp;&nbsp;&nbsp; radius: Double
        <br>&nbsp; ):
        <br>&nbsp; case Mercury extends
        <br>&nbsp;&nbsp;&nbsp;&nbsp;Planet(3.303e+23, 2.4397e6)
        <br>&nbsp; case Venus extends
        <br>&nbsp;&nbsp;&nbsp;&nbsp;Planet(4.869e+24, 6.0518e6)
        <br>&nbsp; case Earth extends
        <br>&nbsp;&nbsp;&nbsp;&nbsp;Planet(5.976e+24, 6.37814e6)
        <br>&nbsp; // more planets ...
        <br>
        <br>&nbsp; // fields and methods
        <br>&nbsp; private final val G = 6.67300E-11
        <br>&nbsp; def surfaceGravity = G * mass /
        <br>&nbsp;&nbsp;&nbsp;&nbsp;(radius * radius)
        <br>&nbsp; def surfaceWeight(otherMass: Double)
        <br>&nbsp;&nbsp;&nbsp;&nbsp;= otherMass * surfaceGravity</code>
      </td>
    </tr>
  </tbody>
</table>

## Scala 独有的概念

Scala 中的有些概念目前在 Python 中没有等效的功能。
请点击以下链接了解更多详情：

<!-- TODO: add back [类型类][type-classes] link when translation is ready -->
<!-- - 大多数与[上下文抽象][contextual]相关的概念，如[扩展方法][extension-methods]、[类型类][type-classes]、隐式值 -->
- 大多数与[上下文抽象][contextual]相关的概念，如[扩展方法][extension-methods]、类型类、隐式值
- Scala 允许多参数列表，从而实现部分应用函数等特性，以及创建自己的 DSL 的能力
- 样例类，对于函数式编程和模式匹配非常有用
- 创建自己的控制结构和 DSL 的能力
- 模式匹配和 `match` 表达式
- [多重等式][multiversal]：在编译时控制哪些等式比较有意义的能力
- 中缀方法
- 宏和元编程

## Scala 和虚拟环境

在 Scala 中，无需显式设置 Python 虚拟环境的等价物。默认情况下，Scala 构建工具管理项目依赖项，因此用户不必考虑手动安装包。例如，使用 `sbt` 构建工具，我们在 `libraryDependencies` 设置下的 `build.sbt` 文件中指定依赖关系，然后执行

```
cd myapp
sbt compile
```

自动解析该特定项目的所有依赖项。 下载依赖的位置很大程度上是构建工具的一个实现细节，用户不必直接与这些下载的依赖交互。 例如，如果我们删除整个 sbt 依赖项缓存，则在项目的下一次编译时，sbt 会自动重新解析并再次下载所有必需的依赖项。

这与 Python 不同，默认情况下，依赖项安装在系统范围或用户范围的目录中，因此要在每个项目的基础上获得隔离环境，必须创建相应的虚拟环境。 例如，使用 `venv` 模块，我们可以像这样为特定项目创建一个

```
cd myapp
python3 -m venv myapp-env
source myapp-env/bin/activate
pip install -r requirements.txt
```

这会在项目的 `myapp/myapp-env` 目录下安装所有依赖项，并更改 shell 环境变量 `PATH` 以从 `myapp-env` 查找依赖项。
在 Scala 中，这些手动过程都不是必需的。


[collections-classes]: {% link _zh-cn/overviews/scala3-book/collections-classes.md %}
[concurrency]: {% link _zh-cn/overviews/scala3-book/concurrency.md %}
[contextual]: {% link _zh-cn/overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[control-structures]: {% link _zh-cn/overviews/scala3-book/control-structures.md %}
[extension-methods]: {% link _zh-cn/overviews/scala3-book/ca-extension-methods.md %}
[fp-intro]: {% link _zh-cn/overviews/scala3-book/fp-intro.md %}
[hofs]: {% link _zh-cn/overviews/scala3-book/fun-hofs.md %}
[intersection-types]: {% link _zh-cn/overviews/scala3-book/types-intersection.md %}
[main-method]: {% link _zh-cn/overviews/scala3-book/methods-main-methods.md %}
[modeling-intro]: {% link _zh-cn/overviews/scala3-book/domain-modeling-intro.md %}
[multiversal]: {% link _zh-cn/overviews/scala3-book/ca-multiversal-equality.md %}
[toplevel]: {% link _zh-cn/overviews/scala3-book/taste-toplevel-definitions.md %}
[union-types]: {% link _zh-cn/overviews/scala3-book/types-union.md %}
</div>
