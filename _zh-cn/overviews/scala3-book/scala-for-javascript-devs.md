---
title: Scala for JavaScript Developers
type: chapter
description: This chapter provides an introduction to Scala 3 for JavaScript developers
language: zh-cn
num: 73
previous-page: scala-for-java-devs
next-page: scala-for-python-devs

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


{% include_relative scala4x.css %}
<div markdown="1" class="scala3-comparison-page">

此页面提供了 JavaScript 和 Scala 编程语言之间的比较。
它适用于了解 JavaScript 并希望了解 Scala 的程序员，特别是通过查看 JavaScript 语言功能与 Scala 比较的示例。

## 概述

本节对以下各节进行了相对简短的介绍和总结。
它从高层次上介绍了 JavaScript 和 Scala 之间的异同，然后介绍了您在每天编写代码时会遇到的差异。

### 高层次的相似性

在高层次上，Scala 与 JavaScript 有以下相似之处：

- 两者都被认为是高级编程语言，您不必关心指针和手动内存管理等低级概念
- 两者都有一个相对简单、简洁的语法
- 两者都支持 C/C++/Java 风格的花括号语法，用于编写方法和其他代码块
- 两者都包括面向对象编程 (OOP) 的特性（如类）
- 两者都包含用于 [函数式编程][fp-intro] (FP) 的（如 lambda）
- JavaScript 在浏览器和 Node.js 等其他环境中运行。
  Scala 的 [Scala.js](https://www.scala-js.org) 风格以 JavaScript 为目标，因此 Scala 程序可以在相同的环境中运行。
- 开发人员使用 [Node.js](https://nodejs.org) 在 JavaScript 和 Scala 中编写服务器端应用程序； [Play Framework](https://www.playframework.com/) 之类的项目也可以让您在 Scala 中编写服务器端应用程序
- 两种语言都有相似的 `if` 语句、`while` 循环和 `for` 循环
- 从 [在这个 Scala.js 页面](https://www.scala-js.org/libraries/index.html) 开始，您会发现许多支持 React、Angular、jQuery 和许多其他 JavaScript 和Scala 库
- JavaScript 对象是可变的；以命令式风格编写时，Scala 对象_可以_是可变的
- JavaScript 和 Scala 都支持 _promises_ 作为处理异步计算结果的一种方式（[Scala concurrency][concurrency] 使用期货和承诺）

### 高层次差异

同样在高层次上，JavaScript 和 Scala 之间的一些区别是：

- JavaScript 是动态类型的，Scala 是静态类型的
  - 尽管 Scala 是静态类型的，但类型推断之类的特性让它感觉像是一种动态语言（正如您将在下面的示例中看到的那样）
- Scala 惯用语默认支持不变性：鼓励您使用不可变变量和不可变集合
- Scala 语法简洁易读；我们称之为_表现力_
- Scala 是一种纯 OOP 语言，因此每个对象都是类的一个实例，而像运算符一样的符号 `+` 和 `+=` 是真正的方法；这意味着您可以创建自己的方法作为运算符
- 作为一种纯 OOP 语言和纯 FP 语言，Scala 鼓励 OOP 和 FP 的融合，具有用于逻辑的函数和用于模块化的不可变对象
- Scala 拥有最先进的第三方开源函数式编程库
- Scala 中的一切都是一个_表达式_：像 `if` 语句、`for` 循环、`match` 表达式，甚至 `try`/`catch` 表达式都有返回值
- [Scala Native](https://scala-native.org/) 项目让您可以编写“系统”级代码，也可以编译为本机可执行文件

### 编程层次差异

在较低的层次上，这些是您在编写代码时每天都会看到的一些差异：

- Scala 变量和参数使用 `val`（不可变，如 JavaScript `const`）或 `var`（可变，如 JavaScript `var` 或 `let`）定义
- Scala 不在行尾使用分号
- Scala 是静态类型的，尽管在许多情况下您不需要声明类型
- Scala 使用 trait 作为接口并创建_混搭_
- 除了简单的 `for` 循环之外，Scala 还具有强大的 `for` comprehensions，可以根据您的算法产生结果
- 模式匹配和 `match` 表达式将改变你编写代码的方式
- Scala 的 Scala 的 [上下文抽象][contextual] 和 _术语推导_ 提供了一系列特性：
  - [扩展方法][extension-methods] 允许您在不破坏模块化的情况下向封闭类添加新功能，方法是仅在特定范围内可用（与猴子补丁相反，它会污染代码的其他区域）
  - [给实例][givens] 让您定义编译器可以用来为您合成代码的术语
  - 类型安全和[多元等式][multiversal]让您将相等比较——在编译时——仅限于那些有意义的比较
- 由于名称参数、中缀符号、可选括号、扩展方法和 [高阶函数][hofs] 等功能，您可以创建自己的“控制结构”和 DSL
- 您可以在本书中阅读到许多其他好东西：样例类、伴生类和对象、宏、[联合][union-type]和[交集][intersection-types]类型、多参数列表、命名参数等

## 变量和类型

### 注释

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>//
        <br>/* ... */
        <br>/** ... */</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>//
        <br>/* ... */
        <br>/** ... */</code>
      </td>
    </tr>
  </tbody>
</table>

### 可变变量

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let&nbsp;&nbsp; // now preferred for mutable
        <br>var&nbsp;&nbsp; // old mutable style</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>var&nbsp; // used for mutable variables</code>
      </td>
    </tr>
  </tbody>
</table>

### 不可变变量

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>const</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val</code>
      </td>
    </tr>
  </tbody>
</table>

Scala 的经验法则是使用 `val` 声明变量，除非有特定原因需要可变变量。

## 命名标准

JavaScript 和 Scala 通常使用相同的 _CamelCase_ 命名标准。
变量命名为 `myVariableName`，方法命名为 `lastIndexOf`，类和对象命名为 `Animal` 和 `PrintedBook` 。

## 字符串

JavaScript 和 Scala 中字符串的许多用法相似，但 Scala 仅对简单字符串使用双引号，对多行字符串使用三引号。

### 字符串基础

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>// use single- or double-quotes
        <br>let msg = 'Hello, world';
        <br>let msg = "Hello, world";</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>// use only double-quotes
        <br>val msg = "Hello, world"</code>
      </td>
    </tr>
  </tbody>
</table>

### 插入

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let name = 'Joe';
        <br>
        <br>// JavaScript uses backticks
        <br>let msg = `Hello, ${name}`;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val name = "Joe"
        <br>val age = 42
        <br>val weight = 180.5
        <br>
        <br>// use `s` before a string for simple interpolation
        <br>println(s"Hi, $name")&nbsp;&nbsp; // "Hi, Joe"
        <br>println(s"${1 + 1}")&nbsp;&nbsp;&nbsp; // "2"
        <br>
        <br>// `f` before a string allows printf-style formatting.
        <br>// this example prints:
        <br>// "Joe is 42 years old, and weighs"
        <br>// "180.5 pounds."
        <br>println(f"$name is $age years old, and weighs $weight%.1f pounds.")</code>
      </td>
    </tr>
  </tbody>
</table>

### 带插入的多行字符串

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let name = "joe";
        <br>let str = `
        <br>Hello, ${name}.
        <br>This is a multiline string.
        <br>`;
        </code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val name = "Martin Odersky"
        <br>
        <br>val quote = s"""
        <br>  |$name says
        <br>  |Scala is a fusion of
        <br>  |OOP and FP.
        <br>""".stripMargin.replaceAll("\n", " ").trim
        <br>
        <br>// result:
        <br>// "Martin Odersky says Scala is a fusion of OOP and FP."
        </code>
      </td>
    </tr>
  </tbody>
</table>

JavaScript 和 Scala 也有类似的处理字符串的方法，包括 `charAt`、`concat`、`indexOf` 等等。
`\n`、`\f`、`\t` 等转义字符在两种语言中也是相同的。

## 数字和算术

JavaScript 和 Scala 之间的数字运算符很相似。
最大的不同是 Scala 不提供 `++` 和 `--` 运算符。

### 数字运算符：

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let x = 1;
        <br>let y = 2.0;
        <br>&nbsp;
        <br>let a = 1 + 1;
        <br>let b = 2 - 1;
        <br>let c = 2 * 2;
        <br>let d = 4 / 2;
        <br>let e = 5 % 2;
        </code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val x = 1
        <br>val y = 2.0
        <br>&nbsp;
        <br>val a = 1 + 1
        <br>val b = 2 - 1
        <br>val c = 2 * 2
        <br>val d = 4 / 2
        <br>val e = 5 % 2
        </code>
      </td>
    </tr>
  </tbody>
</table>

### 自增和自减：

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>i++;
        <br>i += 1;
        <br>
        <br>i--;
        <br>i -= 1;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>i += 1;
        <br>i -= 1;</code>
      </td>
    </tr>
  </tbody>
</table>

或许最大的区别在于像`+`和`-`这样的“操作符”在Scala中实际上是_方法_，而不是操作符。
Scala 数字也有这些相关的方法：

```scala
var a = 2
a *= 2      // 4
a /= 2      // 2
```

Scala 的 `Double` 类型最接近于 JavaScript 的默认 `number` 类型，
`Int` 表示有符号的 32 位整数值，而 `BigInt` 对应于 JavaScript 的 `bigint`。

这些是 Scala `Int` 和 `Double` 值。
请注意，类型不必显式声明：

```scala
val i = 1     // Int
val d = 1.1   // Double
```

你可以按需要使用其它数字类型：

```scala
val a: Byte = 0    // Byte = 0
val a: Double = 0  // Double = 0.0
val a: Float = 0   // Float = 0.0
val a: Int = 0     // Int = 0
val a: Long = 0    // Long = 0
val a: Short = 0   // Short = 0

val x = BigInt(1_234_456_789)
val y = BigDecimal(1_234_456.890)
```

### 布尔值

两个语言都在布尔值中用 `true` 和 `false`。

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let a = true;
        <br>let b = false;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val a = true
        <br>val b = false</code>
      </td>
    </tr>
  </tbody>
</table>

## 日期

日期是两种语言中另一种常用的类型。

### 获取当前日期：

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let d = new Date();<br>
        <br>// result:
        <br>// Sun Nov 29 2020 18:47:57 GMT-0700 (Mountain Standard Time)
        </code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>// different ways to get the current date and time
        <br>import java.time.*
        <br>
        <br>val a = LocalDate.now
        <br>&nbsp;&nbsp;&nbsp; // 2020-11-29
        <br>val b = LocalTime.now
        <br>&nbsp;&nbsp;&nbsp; // 18:46:38.563737
        <br>val c = LocalDateTime.now
        <br>&nbsp;&nbsp;&nbsp; // 2020-11-29T18:46:38.563750
        <br>val d = Instant.now
        <br>&nbsp;&nbsp;&nbsp; // 2020-11-30T01:46:38.563759Z</code>
      </td>
    </tr>
  </tbody>
</table>

### 指定不同的日期：

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let d = Date(2020, 1, 21, 1, 0, 0, 0);
        <br>let d = Date(2020, 1, 21, 1, 0, 0);
        <br>let d = Date(2020, 1, 21, 1, 0);
        <br>let d = Date(2020, 1, 21, 1);
        <br>let d = Date(2020, 1, 21);</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val d = LocalDate.of(2020, 1, 21)
        <br>val d = LocalDate.of(2020, Month.JANUARY, 21)
        <br>val d = LocalDate.of(2020, 1, 1).plusDays(20)
        </code>
      </td>
    </tr>
  </tbody>
</table>

在这种情况下，Scala 使用 Java 附带的日期和时间类。
JavaScript 和 Scala 之间的许多日期/时间方法是相似的。
有关详细信息，请参阅 [_java.time_ 包](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/package-summary.html)。

## 函数

在 JavaScript 和 Scala 中，函数都是对象，因此它们的功能相似，但它们的语法和术语略有不同。

### 命名函数，一行：

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>function add(a, b) {
        <br>&nbsp; return a + b;
        <br>}
        <br>add(2, 2);&nbsp;&nbsp; // 4</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>// technically this is a method, not a function
        <br>def add(a: Int, b: Int) = a + b
        <br>add(2, 2)&nbsp;&nbsp; // 4</code>
      </td>
    </tr>
  </tbody>
</table>

### 命名函数，多行：

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>function addAndDouble(a, b) {
        <br>&nbsp; // imagine this requires
        <br>&nbsp; // multiple lines
        <br>&nbsp; return (a + b) * 2
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>def addAndDouble(a: Int, b: Int): Int =
        <br>&nbsp; // imagine this requires
        <br>&nbsp; // multiple lines
        <br>&nbsp; (a + b) * 2</code>
      </td>
    </tr>
  </tbody>
</table>

在 Scala 中，显示 `Int` 返回类型是可选的。
它_不_显示在 `add` 示例中，而_是_显示在 `addAndDouble` 示例中，因此您可以看到这两种方法。

## 匿名函数

JavaScript 和 Scala 都允许您定义匿名函数，您可以将其传递给其他函数和方法。

### 箭头和匿名函数

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>// arrow function
        <br>let log = (s) =&gt; console.log(s)
        <br>
        <br>// anonymous function
        <br>let log = function(s) {
        <br>&nbsp; console.log(s);
        <br>}
        <br>
        <br>// use either of those functions here
        <br>function printA(a, log) {
        <br>&nbsp; log(a);
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// a function (an anonymous function assigned to a variable)
        <br>val log = (s: String) =&gt; console.log(s)
        <br>
        <br>// a scala method. methods tend to be used much more often,
        <br>// probably because they’re easier to read.
        <br>def log(a: Any) = console.log(a)
        <br>
        <br>// a function or a method can be passed into another
        <br>// function or method
        <br>def printA(a: Any, f: log: Any =&gt; Unit) = log(a)
        </code>
      </td>
    </tr>
  </tbody>
</table>

在 Scala 中，您很少使用所示的第一种语法来定义函数。
相反，您经常在使用点定义匿名函数。
许多集合方法是 [高阶函数][hofs]并接受函数参数，因此您编写如下代码：

```scala
// map method, long form
List(1,2,3).map(i => i * 10)   // List(10,20,30)

// map, short form (which is more commonly used)
List(1,2,3).map(_ * 10)        // List(10,20,30)

// filter, short form
List(1,2,3).filter(_ < 3)      // List(1,2)

// filter and then map
List(1,2,3,4,5).filter(_ < 3).map(_ * 10)   // List(10, 20)
```

## 类

Scala 既有类也有样例类。
_类_ 与 JavaScript 类相似，通常用于 [OOP 风格应用程序][modeling-oop]（尽管它们也可以在 FP 代码中使用），并且 _样例类_有附加的特性，这让它在 [FP 风格应用][modeling-fp]中很有用。

下面的例子展示了如何创建几个类型作为枚举，然后定义一个 OOP 风格的 `Pizza` 类。
最后，创建并使用了一个 `Pizza` 实例：

```scala
// create some enumerations that the Pizza class will use
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions

// import those enumerations and the ArrayBuffer,
// so the Pizza class can use them
import CrustSize.*
import CrustType.*
import Topping.*
import scala.collection.mutable.ArrayBuffer

// define an OOP style Pizza class
class Pizza(
  var crustSize: CrustSize,
  var crustType: CrustType
):

  private val toppings = ArrayBuffer[Topping]()

  def addTopping(t: Topping): Unit =
    toppings += t

  def removeTopping(t: Topping): Unit =
    toppings -= t

  def removeAllToppings(): Unit =
    toppings.clear()

  override def toString(): String =
    s"""
      |Pizza:
      |  Crust Size: ${crustSize}
      |  Crust Type: ${crustType}
      |  Toppings:   ${toppings}
    """.stripMargin

end Pizza

// create a Pizza instance
val p = Pizza(Small, Thin)

// change the crust
p.crustSize = Large
p.crustType = Thick

// add and remove toppings
p.addTopping(Cheese)
p.addTopping(Pepperoni)
p.addTopping(BlackOlives)
p.removeTopping(Pepperoni)

// print the pizza, which uses its `toString` method
println(p)
```

## 接口、trait 和继承

Scala 使用 trait 作为接口，也可以创建混搭。
trait 可以有抽象和具体的成员，包括方法和字段。

这个例子展示了如何定义两个 traits，创建一个扩展和实现这些 traits 的类，然后创建和使用该类的一个实例：

```scala
trait HasLegs:
  def numLegs: Int
  def walk(): Unit
  def stop() = println("Stopped walking")

trait HasTail:
  def wagTail(): Unit
  def stopTail(): Unit

class Dog(var name: String) extends HasLegs, HasTail:
  val numLegs = 4
  def walk() = println("I’m walking")
  def wagTail() = println("⎞⎜⎛  ⎞⎜⎛")
  def stopTail() = println("Tail is stopped")
  override def toString = s"$name is a Dog"

// create a Dog instance
val d = Dog("Rover")

// use the class’s attributes and behaviors
println(d.numLegs)   // 4
d.wagTail()          // "⎞⎜⎛  ⎞⎜⎛"
d.walk()             // "I’m walking"
```

## 控制结构

除了在 JavaScript 中使用 `===` 和 `!==` 之外，比较和逻辑运算符在 JavaScript 和 Scala 中几乎相同。

{% comment %}
TODO: Sébastien mentioned that `===` is closest to `eql` in Scala. Update this area.
{% endcomment %}

### 比较运算符

<table>
  <tbody>
    <tr>
      <th valign="top">JavaScript</th>
      <th valign="top">Scala</th>
    </tr>
    <tr>
      <td valign="top">
        <code>==</code></td>
      <td valign="top">
        <code>==</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>===</code></td>
      <td valign="top">
        <code>==</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>!=</code></td>
      <td valign="top">
        <code>!=</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>!==</code></td>
      <td valign="top">
        <code>!=</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>&gt;</code></td>
      <td valign="top">
        <code>&gt;</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>&lt;</code></td>
      <td valign="top">
        <code>&lt;</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>&gt;=</code></td>
      <td valign="top">
        <code>&gt;=</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>&lt;=</code></td>
      <td valign="top">
        <code>&lt;=</code></td>
    </tr>
  </tbody>
</table>

### 逻辑运算符

<table>
  <tbody>
    <tr>
      <th valign="top">JavaScript</th>
      <th valign="top">Scala</th>
    </tr>
    <tr>
      <td valign="top">
        <code>&amp;&amp;
        <br>||
        <br>!</code>
      </td>
      <td valign="top">
        <code>&amp;&amp;
        <br>||
        <br>!</code>
      </td>
    </tr>
  </tbody>
</table>

## if/then/else 表达式

JavaScript和 Scala if/then/else 语句相似。
在 Scala 2 中它们几乎相同，但在 Scala 3 中，花括号不再是必需的（尽管它们仍然可以使用）。

### `if` 语句，单行：

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>if (x == 1) { console.log(1); }</code>
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
      <td class="javascript-block">
        <code>if (x == 1) {
        <br>&nbsp; console.log("x is 1, as you can see:")
        <br>&nbsp; console.log(x)
        <br>}</code>
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
      <td class="javascript-block">
        <code>if (x &lt; 0) {
        <br>&nbsp; console.log("negative")
        <br>} else if (x == 0) {
        <br>&nbsp; console.log("zero")
        <br>} else {
        <br>&nbsp; console.log("positive")
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>if x &lt; 0 then
        <br>&nbsp; println("negative")
        <br>else if x == 0
        <br>&nbsp; println("zero")
        <br>else
        <br>&nbsp; println("positive")</code>
      </td>
    </tr>
  </tbody>
</table>

### 从 `if` 返回值：

JavaScript 使用三元运算符，Scala 像往常一样使用它的 `if` 表达式：

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>let minVal = a &lt; b ? a : b;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val minValue = if a &lt; b then a else b</code>
      </td>
    </tr>
  </tbody>
</table>

### `if` 作为方法体：

Scala 方法往往很短，您可以轻松地使用 `if` 作为方法体：

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>function min(a, b) {
        <br>&nbsp; return (a &lt; b) ? a : b;
        <br>}</code>
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

在 Scala 3 中，如果您愿意，您仍然可以使用“花括号”样式。
例如，您可以像这样编写 if/else-if/else 表达式：

```scala
if (i == 0) {
  println(0)
} else if (i == 1) {
  println(1)
} else {
  println("other")
}
```

## 循环

JavaScript 和 Scala 都有 `while` 循环和 `for` 循环。
Scala 曾经有 do/while 循环，但它们已从语言中删除。

### `while` 循环：

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>let i = 0;
        <br>while (i &lt; 3) {
        <br>&nbsp; console.log(i);
        <br>&nbsp; i++;
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>var i = 0;
        <br>while i &lt; 3 do
        <br>&nbsp; println(i)
        <br>&nbsp; i += 1</code>
      </td>
    </tr>
  </tbody>
</table>

如果你愿意，Scala 代码也可以写成这样：

```scala
var i = 0
while (i < 3) {
  println(i)
  i += 1
}
```

以下示例展示了 JavaScript 和 Scala 中的“for”循环。
他们假设您可以使用这些集合：

```scala
// JavaScript
let nums = [1, 2, 3];

// Scala
val nums = List(1, 2, 3)
```

### `for` 循环，单行：

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>// newer syntax
        <br>for (let i of nums) {
        <br>&nbsp; console.log(i);
        <br>}
        <br>
        <br>// older
        <br>for (i=0; i&lt;nums.length; i++) {
        <br>&nbsp; console.log(nums[i]);
        <br>}</code>
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

### `for` 循环，在循环体内多行

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>// preferred
        <br>for (let i of nums) {
        <br>&nbsp; let j = i * 2;
        <br>&nbsp; console.log(j);
        <br>}
        <br>
        <br>// also available
        <br>for (i=0; i&lt;nums.length; i++) {
        <br>&nbsp; let j = nums[i] * 2;
        <br>&nbsp; console.log(j);
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// preferred
        <br>for i &lt;- ints do
        <br>&nbsp; val i = i * 2
        <br>&nbsp; println(j)
        <br>
        <br>// also available
        <br>for (i &lt;- nums) {
        <br>&nbsp; val j = i * 2
        <br>&nbsp; println(j)
        <br>}</code>
      </td>
    </tr>
  </tbody>
</table>

### 在 `for` 循环中有多个生成器

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>let str = &quot;ab&quot;;
        <br>for (let i = 1; i &lt; 3; i++) {
        <br>&nbsp; for (var j = 0; j &lt; str.length; j++) {
        <br>&nbsp;&nbsp;&nbsp; for (let k = 1; k &lt; 11; k++) {
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let c = str.charAt(j);
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; console.log(`i: ${i} j: ${c} k: ${k}`);
        <br>&nbsp;&nbsp;&nbsp; }
        <br>&nbsp; }
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- 1 to 2
        <br>&nbsp; j &lt;- 'a' to 'b'
        <br>&nbsp; k &lt;- 1 to 10 by 5
        <br>do
        <br>&nbsp; println(s"i: $i, j: $j, k: $k")</code>
      </td>
    </tr>
  </tbody>
</table>

### 带守卫的生成器

_守卫_是 `for` 表达式中的 `if` 表达式的名称。

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>for (let i = 0; i &lt; 10; i++) {
        <br>&nbsp; if (i % 2 == 0 &amp;&amp; i &lt; 5) {
        <br>&nbsp;&nbsp;&nbsp; console.log(i);
        <br>&nbsp; }
        <br>}</code>
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

### `for` comprehension

`for` comprehension 是一个 `for` 循环，它使用 `yield` 返回（产生）一个值。 它们经常在 Scala 中使用。

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        N/A
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val list =
        <br>&nbsp; for
        <br>&nbsp;&nbsp;&nbsp; i &lt;- 1 to 3
        <br>&nbsp; yield
        <br>&nbsp;&nbsp;&nbsp; i * 10
        <br>// result: Vector(10, 20, 30)</code>
      </td>
    </tr>
  </tbody>
</table>

## switch & match

JavaScript 有 `switch` 语句，Scala 有 `match` 表达式。
就像 Scala 中的所有其他东西一样，这些确实是_表达式_，这意味着它们返回一个结果：

```scala
val day = 1

// later in the code ...
val monthAsString = day match
  case 1 => "January"
  case 2 => "February"
  case _ => "Other"
```

`match` 表达式可以在每个 `case` 语句中处理多个匹配项：

```scala
val numAsString = i match
  case 1 | 3 | 5 | 7 | 9 => "odd"
  case 2 | 4 | 6 | 8 | 10 => "even"
  case _ => "too big"
```

它们也可以用于方法体：

```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" => false
  case _ => true

def isPerson(x: Matchable): Boolean = x match
  case p: Person => true
  case _ => false
```

`match` 表达式有许多其他模式匹配选项。

## 集合类

Scala 有不同的 [集合类][collections-classes] 来满足不同的需求。

常见的_不可变_序列是：

- `List`
- `Vector`

常见的_可变_序列是：

- `Array`
- `ArrayBuffer`

Scala 还有可变和不可变的 Map 和 Set。

这是创建常见 Scala 集合类型的方式：

```scala
val strings = List("a", "b", "c")
val strings = Vector("a", "b", "c")
val strings = ArrayBuffer("a", "b", "c")

val set = Set("a", "b", "a") // result: Set("a", "b")
val map = Map(
  "a" -> 1,
  "b" -> 2,
  "c" -> 3
)
```

### 集合上的方法

以下示例展示了使用 Scala 集合的许多不同方法。

### 填充列表：

```scala
// to, until
(1 to 5).toList                   // List(1, 2, 3, 4, 5)
(1 until 5).toList                // List(1, 2, 3, 4)

(1 to 10 by 2).toList             // List(1, 3, 5, 7, 9)
(1 until 10 by 2).toList          // List(1, 3, 5, 7, 9)
(1 to 10).by(2).toList            // List(1, 3, 5, 7, 9)

('d' to 'h').toList               // List(d, e, f, g, h)
('d' until 'h').toList            // List(d, e, f, g)
('a' to 'f').by(2).toList         // List(a, c, e)

// range method
List.range(1, 3)                  // List(1, 2)
List.range(1, 6, 2)               // List(1, 3, 5)

List.fill(3)("foo")               // List(foo, foo, foo)
List.tabulate(3)(n => n * n)      // List(0, 1, 4)
List.tabulate(4)(n => n * n)      // List(0, 1, 4, 9)
```

### 序列上的函数式方法：

```scala
// these examples use a List, but they’re the same with Vector
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)
a.contains(20)                        // true
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
a.last                                // 10
a.lastOption                          // Some(10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeRight(2)                        // List(40, 10)
a.takeWhile(_ < 30)                   // List(10, 20)

// map, flatMap
val fruits = List("apple", "pear")
fruits.map(_.toUpperCase)             // List(APPLE, PEAR)
fruits.flatMap(_.toUpperCase)         // List(A, P, P, L, E, P, E, A, R)

val nums = List(10, 5, 8, 1, 7)
nums.sorted                           // List(1, 5, 7, 8, 10)
nums.sortWith(_ < _)                  // List(1, 5, 7, 8, 10)
nums.sortWith(_ > _)                  // List(10, 8, 7, 5, 1)

List(1,2,3).updated(0,10)             // List(10, 2, 3)
List(2,4).union(List(1,3))            // List(2, 4, 1, 3)

// zip
val women = List("Wilma", "Betty")    // List(Wilma, Betty)
val men = List("Fred", "Barney")      // List(Fred, Barney)
val couples = women.zip(men)          // List((Wilma,Fred), (Betty,Barney))
```

Scala 有_很多_更多可供您使用的方法。
所有这些方法的好处是：

- 您不必编写自定义的 `for` 循环来解决问题
- 当你阅读别人的代码时，你不必阅读他们自定义的 `for` 循环； 你只会找到像这样的常用方法，因此更容易阅读来自不同项目的代码

### 元组

当您想将多个数据类型放在同一个列表中时，JavaScript 允许您这样做：

```javascript
stuff = ["Joe", 42, 1.0];
```

在 Scala 中你这样做：

```scala
val a = ("eleven")
val b = ("eleven", 11)
val c = ("eleven", 11, 11.0)
val d = ("eleven", 11, 11.0, Person("Eleven"))
```

在 Scala 中，这些类型称为元组，如图所示，它们可以包含一个或多个元素，并且元素可以具有不同的类型。
访问它们的元素就像访问 `List`、`Vector` 或 `Array` 的元素一样：

```scala
d(0)   // "eleven"
d(1)   // 11
```

### 枚举

JavaScript 没有枚举，但你可以这样做：

```javascript
let Color = {
  RED: 1,
  GREEN: 2,
  BLUE: 3
};
Object.freeze(Color);
```

在 Scala 3 中，您可以使用枚举做很多事情。
您可以创建该代码的等效代码：

```scala
enum Color:
  case Red, Green, Blue
```

你可以创建带参数的枚举：

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

你也可以创建用户自定义的枚举成员：

```scala
enum Planet(mass: Double, radius: Double):
  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Venus   extends Planet(4.869e+24,6.0518e6)
  case Earth   extends Planet(5.976e+24,6.37814e6)
  // more planets here ...

  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) = otherMass * surfaceGravity
```

## Scala.js DOM 代码

Scala.js 允许您编写 Scala 代码，这些代码编译为 JavaScript 代码，然后可以在浏览器中使用。
该方法类似于 TypeScript、ReScript 和其他编译为 JavaScript 的语言。

包含必要的库并在项目中导入必要的包后，编写 Scala.js 代码看起来与编写 JavaScript 代码非常相似：

```scala
// show an alert dialog on a button click
jQuery("#hello-button").click{() =>
  dom.window.alert("Hello, world")
}

// define a button and what should happen when it’s clicked
val btn = button(
  "Click me",
  onclick := { () =>
    dom.window.alert("Hello, world")
  })

// create two divs with css classes, an h2 element, and the button
val content =
  div(cls := "foo",
    div(cls := "bar",
      h2("Hello"),
      btn
    )
  )

// add the content to the DOM
val root = dom.document.getElementById("root")
root.innerHTML = ""
root.appendChild(content.render)
```

请注意，尽管 Scala 是一种类型安全的语言，但在上面的代码中没有声明任何类型。
Scala 强大的类型推断能力通常使 Scala 代码看起来像是动态类型的。
但它是类型安全的，因此您可以在开发周期的早期捕获许多类错误。

## 其他 Scala.js 资源

Scala.js 网站为对使用 Scala.js 感兴趣的 JavaScript 开发人员提供了极好的教程集。
以下是他们的一些初始教程：

- [基础教程（创建第一个 Scala.js 项目）](https://www.scala-js.org/doc/tutorial/basic/)
- [适用于 JavaScript 开发人员的 Scala.js](https://www.scala-js.org/doc/sjs-for-js/)
- [从 ES6 到 Scala：基础](https://www.scala-js.org/doc/sjs-for-js/es6-to-scala-part1.html)
- [从 ES6 到 Scala：集合](https://www.scala-js.org/doc/sjs-for-js/es6-to-scala-part2.html)
- [从 ES6 到 Scala：高级](https://www.scala-js.org/doc/sjs-for-js/es6-to-scala-part3.html)

## Scala 独有的概念

Scala 中还有其他一些概念目前在 JavaScript 中没有等效的概念：

- 几乎所有与[上下文抽象][contextual]相关的东西
- 方法特性：
  - 多个参数列表
  - 调用方法时使用命名参数
- 使用 trait 作为接口
- 样例类
- 伴生类和对象
- 创建自己的[控制结构][control]和 DSL 的能力
- `match` 表达式和模式匹配的高级功能
- `for` comprehension
- 中缀方法
- 宏和元编程
- 更多的 ...


[collections-classes]: {% link _zh-cn/overviews/scala3-book/collections-classes.md %}
[concurrency]: {% link _zh-cn/overviews/scala3-book/concurrency.md %}
[contextual]: {% link _zh-cn/overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[control]: {% link _zh-cn/overviews/scala3-book/control-structures.md %}
[extension-methods]: {% link _zh-cn/overviews/scala3-book/ca-extension-methods.md %}
[fp-intro]: {% link _zh-cn/overviews/scala3-book/fp-intro.md %}
[givens]: {% link _zh-cn/overviews/scala3-book/ca-context-parameters.md %}
[hofs]: {% link _zh-cn/overviews/scala3-book/fun-hofs.md %}
[intersection-types]: {% link _zh-cn/overviews/scala3-book/types-intersection.md %}
[modeling-fp]: {% link _zh-cn/overviews/scala3-book/domain-modeling-fp.md %}
[modeling-oop]: {% link _zh-cn/overviews/scala3-book/domain-modeling-oop.md %}
[multiversal]: {% link _zh-cn/overviews/scala3-book/ca-multiversal-equality.md %}
[union-types]: {% link _zh-cn/overviews/scala3-book/types-union.md %}

</div>
