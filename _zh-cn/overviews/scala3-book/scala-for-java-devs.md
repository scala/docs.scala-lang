---
title: 向 Java 开发者介绍Scala
type: chapter
description: This page is for Java developers who are interested in learning about Scala 3.
num: 73
previous-page: interacting-with-java
next-page: scala-for-javascript-devs
---


{% include_relative scala4x.css %}
<div markdown="1" class="scala3-comparison-page">

此页面通过共享每种语言的并排示例，对 Java 和 Scala 编程语言进行了比较。
它适用于了解 Java 并希望了解 Scala 的程序员，特别是通过 Scala 特性与 Java 特性的对比来了解。

## 概述

在进入示例之前，第一部分提供了以下部分的相对简短的介绍和总结。
它从高层次上介绍了 Java 和 Scala 之间的异同，然后介绍了您在每天编写代码时会遇到的差异。

### 高层次的相似性

在高层次上，Scala 与 Java 有以下相似之处：

- Scala代码编译成_.class_文件，打包成JAR文件，运行在JVM上
- 这是一种[面向对象编程][modeling-oop] (OOP) 语言
- 它是静态类型的
- 两种语言都支持 lambdas 和 [高阶函数][hofs]
- 它们都可以与 IntelliJ IDEA 和 Microsoft VS Code 等 IDE 一起使用
- 可以使用 Gradle、Ant 和 Maven 等构建工具构建项目
- 它具有用于构建服务器端、网络密集型应用程序的出色库和框架，包括 Web 服务器应用程序、微服务、机器学习等（参见 [“Awesome Scala” 列表](https://github.com/lauris/awesome-scala)）
- Java 和 Scala 都可以使用 Scala 库：
   - 他们可以使用 [Akka actor 库](https://akka.io) 来构建基于 actor 的并发系统，并使用 Apache Spark 来构建数据密集型应用程序
   - 他们可以使用 [Play Framework](https://www.playframework.com) 开发服务器端应用程序
- 您可以使用 [GraalVM](https://www.graalvm.org) 将您的项目编译为本机可执行文件
- Scala 可以无缝使用为 Java 开发的大量库

### 高层次的差异

同样在高层次上，Java 和 Scala 之间的区别是：

- Scala 语法简洁易读；我们称之为_表现力_
- 虽然它是静态类型的，但 Scala 经常感觉像是一门动态语言
- Scala 是一种纯 OOP 语言，因此每个对象都是类的一个实例，而像运算符一样的符号 `+` 和 `+=` 是真正的方法；这意味着您可以创建自己的运算符
- 除了是纯OOP语言，Scala还是纯FP语言；实际上，它鼓励 OOP 和 FP 的融合，具有用于逻辑的函数和用于模块化的对象
- Scala 拥有一整套不可变集合，包括 `List`、`Vector` 和不可变的 `Map` 和 `Set` 实现
- Scala 中的一切都是一个_表达式_：像 `if` 语句、`for` 循环、`match` 表达式，甚至 `try`/`catch` 表达式都有返回值
- Scala 习惯上倾向缺省使用不可变性：鼓励您使用不可变（`final`）变量和不可变集合
- 惯用的 Scala 代码不使用 `null`，因此不会遭受 `NullPointerException`
- Scala 生态系统在 sbt、Mill 等中还有其他 [构建工具][tools]
- 除了在 JVM 上运行之外，[Scala.js](https://www.scala-js.org) 项目允许您使用 Scala 作为 JavaScript 替代品
- [Scala Native](http://www.scala-native.org) 项目添加了低级结构，让您可以编写“系统”级代码，也可以编译为本机可执行文件

{% comment %}
These are several notes that came up early in the writing process, and I (Alvin) can’t really address them:
TODO: Need a good, simple way to state that Scala has a sound type system
TODO: Points to make about Scala’s consistency?
TODO: Add a point about how the type system lets you express details as desired
{% endcomment %}

### 编程层次差异

最后，这些是您在编写代码时每天都会看到的一些差异：

- Scala 的语法极其一致
- 变量和参数被定义为`val`（不可变，如Java中的`final`）或`var`（可变）
- _类型推导_ 让您的代码感觉是动态类型的，并有助于保持您的代码简洁
- 除了简单的 `for` 循环之外，Scala 还具有强大的 `for` comprehensions，可以根据您的算法产生结果
- 模式匹配和 `match` 表达式将改变你编写代码的方式
- 默认情况下编写不可变代码会导致编写_表达式_而不是_语句_；随着时间的推移，您会发​​现编写表达式可以简化您的代码（和您的测试）
- [顶层定义][toplevel] 让您可以将方法、字段和其他定义放在任何地方，同时也带来简洁、富有表现力的代码
- 您可以通过将多个 traits “混合”到类和对象中来创建_混搭_（特征类似于 Java 8 和更新版本中的接口）
- 默认情况下类是封闭的，支持 Joshua Bloch 在 _Effective Java_ 的习惯用法，“Design and document for inheritance or else forbid it”
- Scala 的 [上下文抽象][contextual] 和 _术语推导_ 提供了一系列特性：
  - [扩展方法][extension-methods] 让您向封闭类添加新功能
  - [_给_实例][givens] 让您定义编译器可以在 _using_ 点合成的术语，从而使您的代码不那么冗长，实质上让编译器为您编写代码
  - [多元等式][multiversal] 允许您在编译时将相等比较限制为仅那些有意义的比较
- Scala 拥有最先进的第三方开源函数式编程库
- Scala 样例类就像 Java 14 中的记录；它们可以帮助您在编写 FP 代码时对数据进行建模，并内置对模式匹配和克隆等概念的支持
- 由于名称参数、中缀符号、可选括号、扩展方法和 [高阶函数][hofs] 等功能，您可以创建自己的“控制结构”和 DSL
- Scala 文件不必根据它们包含的类或 trait 来命名
- 许多其他好东西：伴生类和对象、宏、[联合][union-types] 和 [交集][intersection-types]、数字字面量、多参数列表、参数的默认值、命名参数等

### 用例子来进行特性对比

鉴于该介绍，以下部分提供了 Java 和 Scala 编程语言功能的并排比较。

## OOP 风格的类和方法

本节提供了与 OOP 风格的类和方法相关的特性的比较。

### 注释：

<table>
  <tbody>
    <tr>
      <td class="java-block">
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

### OOP 风格类，主构造函数：

Scala不遵循JavaBeans标准，因此我们在这里展示的Java代码
与它后面的Scala代码等效，而不是显示以JavaBeans风格编写
的Java代码。

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>class Person {
          <br>&nbsp; public String firstName;
          <br>&nbsp; public String lastName;
          <br>&nbsp; public int age;
          <br>&nbsp; public Person(
          <br>&nbsp;&nbsp;&nbsp; String firstName, 
          <br>&nbsp;&nbsp;&nbsp; String lastName,
          <br>&nbsp;&nbsp;&nbsp; int age
          <br>&nbsp; ) {
          <br>&nbsp;&nbsp;&nbsp; this.firstName = firstName;
          <br>&nbsp;&nbsp;&nbsp; this.lastName = lastName;
          <br>&nbsp;&nbsp;&nbsp; this.age = age;
          <br>&nbsp; }
          <br>&nbsp; public String toString() {
          <br>&nbsp;&nbsp;&nbsp; return String.format("%s %s is %d years old.", firstName, lastName, age);
          <br>&nbsp; }
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class Person (
          <br>&nbsp; var firstName: String,
          <br>&nbsp; var lastName: String,
          <br>&nbsp; var age: Int
          <br>):&nbsp;&nbsp; 
          <br>&nbsp; override def toString = s"$firstName $lastName is $age years old."
        </code>
      </td>
    </tr>
  </tbody>
</table>

### 辅助构造函数：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public class Person {
        <br>&nbsp; public String firstName;
        <br>&nbsp; public String lastName;
        <br>&nbsp; public int age;
        <br>
        <br>&nbsp; // primary constructor
        <br>&nbsp; public Person(
        <br>&nbsp;&nbsp;&nbsp; String firstName,
        <br>&nbsp;&nbsp;&nbsp; String lastName,
        <br>&nbsp;&nbsp;&nbsp; int age
        <br>&nbsp; ) {
        <br>&nbsp;&nbsp;&nbsp; this.firstName = firstName;
        <br>&nbsp;&nbsp;&nbsp; this.lastName = lastName;
        <br>&nbsp;&nbsp;&nbsp; this.age = age;
        <br>&nbsp; }
        <br>
        <br>&nbsp; // zero-arg constructor
        <br>&nbsp; public Person() {
        <br>&nbsp;&nbsp;&nbsp; this("", "", 0);
        <br>&nbsp; }
        <br>
        <br>&nbsp; // one-arg constructor
        <br>&nbsp; public Person(String firstName) {
        <br>&nbsp;&nbsp;&nbsp; this(firstName, "", 0);
        <br>&nbsp; }
        <br>
        <br>&nbsp; // two-arg constructor
        <br>&nbsp; public Person(
        <br>&nbsp;&nbsp;&nbsp; String firstName, 
        <br>&nbsp;&nbsp;&nbsp; String lastName
        <br>&nbsp; ) {
        <br>&nbsp;&nbsp;&nbsp; this(firstName, lastName, 0);
        <br>&nbsp; }
        <br>
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class Person (
        <br>&nbsp; var firstName: String,
        <br>&nbsp; var lastName: String,
        <br>&nbsp; var age: Int
        <br>):
        <br>&nbsp;&nbsp;&nbsp; // zero-arg auxiliary constructor
        <br>&nbsp;&nbsp;&nbsp; def this() = this("", "", 0)
        <br>
        <br>&nbsp;&nbsp;&nbsp; // one-arg auxiliary constructor
        <br>&nbsp;&nbsp;&nbsp; def this(firstName: String) = 
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this(firstName, "", 0)
        <br>
        <br>&nbsp;&nbsp;&nbsp; // two-arg auxiliary constructor
        <br>&nbsp;&nbsp;&nbsp; def this(
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;firstName: String,
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lastName: String
        <br>&nbsp;&nbsp;&nbsp; ) = 
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; this(firstName, lastName, 0)
        <br>
        <br>end Person</code>
      </td>
    </tr>
  </tbody>
</table>

### 类默认是封闭的：
“Plan for inheritance or else forbid it.”

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>final class Person</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class Person</code>
      </td>
    </tr>
  </tbody>
</table>

### 为扩展开放的类：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>class Person</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>open class Person</code>
      </td>
    </tr>
  </tbody>
</table>

### 单行方法：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public int add(int a, int b) {
        <br>&nbsp; return a + b;
        <br>}</code>
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
      <td class="java-block">
        <code>public void walkThenRun() {
        <br>&nbsp; System.out.println("walk");
        <br>&nbsp; System.out.println("run");
        <br>}</code>
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

### 不可变字段：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>final int i = 1;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val i = 1</code>
      </td>
    </tr>
  </tbody>
</table>

### 可变字段：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>int i = 1;
        <br>var i = 1;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>var i = 1</code>
      </td>
    </tr>
  </tbody>
</table>

## 接口、trait 和继承

本节将Java接口与Scala trait 进行比较，包括类如何扩展接口和 trait。

### 接口/trait：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public interface Marker;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>trait Marker</code>
      </td>
    </tr>
  </tbody>
</table>

### 简单接口：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public interface Adder {
        <br>&nbsp; public int add(int a, int b);
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>trait Adder:
        <br>&nbsp; def add(a: Int, b: Int): Int</code>
      </td>
    </tr>
  </tbody>
</table>

### 有实体方法的接口：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public interface Adder {
        <br>&nbsp; int add(int a, int b);
        <br>&nbsp; default int multiply(
        <br>&nbsp;&nbsp;&nbsp; int a, int b
        <br>&nbsp; ) {
        <br>&nbsp;&nbsp;&nbsp; return a * b;
        <br>&nbsp; }
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>trait Adder:
        <br>&nbsp; def add(a: Int, b: Int): Int
        <br>&nbsp; def multiply(a: Int, b: Int): Int =
        <br>&nbsp;&nbsp;&nbsp; a * b</code>
      </td>
    </tr>
  </tbody>
</table>

### 继承：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>class Dog extends Animal implements HasLegs, HasTail</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class Dog extends Animal, HasLegs, HasTail</code>
      </td>
    </tr>
  </tbody>
</table>

### 扩展多个接口

这些接口和特征具有具体的、已实现的方法（默认方法）：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>interface Adder {
        <br>&nbsp; default int add(int a, int b) {
        <br>&nbsp;&nbsp;&nbsp; return a + b;
        <br>&nbsp; }
        <br>}
        <br>
        <br>interface Multiplier {
        <br>&nbsp; default int multiply (
        <br>&nbsp; &nbsp; int a,
        <br>&nbsp; &nbsp; int b)
        <br>&nbsp; {
        <br>&nbsp;&nbsp;&nbsp; return a * b;
        <br>&nbsp; }
        <br>}
        <br>
        <br>public class JavaMath <br>implements Adder, Multiplier {}
        <br>
        <br>JavaMath jm = new JavaMath();
        <br>jm.add(1,1);
        <br>jm.multiply(2,2);</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>trait Adder:
        <br>&nbsp; def add(a: Int, b: Int) = a + b
        <br>
        <br>trait Multiplier:
        <br>&nbsp; def multiply(a: Int, b: Int) = a * b
        <br>
        <br>class ScalaMath extends Adder, Multiplier
        <br>
        <br>val sm = new ScalaMath
        <br>sm.add(1,1)
        <br>sm.multiply(2,2)</code>
      </td>
    </tr>
  </tbody>
</table>

### 混搭：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        N/A
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class DavidBanner
        <br>
        <br>trait Angry:
        <br>&nbsp; def beAngry() =
        <br>&nbsp;&nbsp;&nbsp; println("You won’t like me ...")
        <br>
        <br>trait Big:
        <br>&nbsp; println("I’m big")
        <br>
        <br>trait Green:
        <br>&nbsp; println("I’m green")
        <br>
        <br>// mix in the traits as DavidBanner
        <br>// is created
        <br>val hulk = new DavidBanner with Big,
        <br>&nbsp; Angry, Green</code>
      </td>
    </tr>
  </tbody>
</table>

## 控制结构

本节比较在 Java 和 Scala 中的[控制结构][control]。

### `if` 语句，单行：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>if (x == 1) { System.out.println(1); }</code>
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
      <td class="java-block">
        <code>if (x == 1) {
        <br>&nbsp; System.out.println("x is 1, as you can see:")
        <br>&nbsp; System.out.println(x)
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
      <td class="java-block">
        <code>if (x &lt; 0) {
        <br>&nbsp; System.out.println("negative")
        <br>} else if (x == 0) {
        <br>&nbsp; System.out.println("zero")
        <br>} else {
        <br>&nbsp; System.out.println("positive")
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

### `if` 作为方法体：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public int min(int a, int b) {
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

### 从 `if` 返回值：

在 Java 中调用_三元运算符_：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>int minVal = (a &lt; b) ? a : b;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val minValue = if a &lt; b then a else b</code>
      </td>
    </tr>
  </tbody>
</table>

### `while` 循环：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>while (i &lt; 3) {
        <br>&nbsp; System.out.println(i);
        <br>&nbsp; i++;
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>while i &lt; 3 do
        <br>&nbsp; println(i)
        <br>&nbsp; i += 1</code>
      </td>
    </tr>
  </tbody>
</table>

### `for` 循环，单行：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>for (int i: ints) {
        <br>&nbsp; System.out.println(i);
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>//preferred
        <br>for i &lt;- ints do println(i)
        <br>
        <br>// also available
        <br>for (i &lt;- ints) println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### `for` 循环，多行：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>for (int i: ints) {
        <br>&nbsp; int x = i * 2;
        <br>&nbsp; System.out.println(x);
        <br>}</code>
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

### `for` 循环，多生成器：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>for (int i: ints1) {
        <br>&nbsp; for (int j: chars) {
        <br>&nbsp;&nbsp;&nbsp; for (int k: ints2) {
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; System.out.printf("i = %d, j = %d, k = %d\n", i,j,k);
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
        <br>&nbsp; println(s"i = $i, j = $j, k = $k")</code>
      </td>
    </tr>
  </tbody>
</table>

### 带守卫（`if`）表达式的生成器：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>List ints = 
        <br>&nbsp; ArrayList(1,2,3,4,5,6,7,8,9,10);
        <br>
        <br>for (int i: ints) {
        <br>&nbsp; if (i % 2 == 0 &amp;&amp; i &lt; 5) {
        <br>&nbsp;&nbsp;&nbsp; System.out.println(x);
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

### `for` comprehension:

<table>
  <tbody>
    <tr>
      <td class="java-block">
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
        <br>// list: Vector(10, 20, 30)</code>
      </td>
    </tr>
  </tbody>
</table>

### switch/match:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>String monthAsString = "";
        <br>switch(day) {
        <br>&nbsp; case 1: monthAsString = "January";
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; break;
        <br>&nbsp; case 2: monthAsString = "February";
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; break;
        <br>&nbsp; default: monthAsString = "Other";
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; break;
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val monthAsString = day match
        <br>&nbsp; case 1 =&gt; "January"
        <br>&nbsp; case 2 =&gt; "February"
        <br>&nbsp; _ =&gt; "Other"
        </code>
      </td>
    </tr>
  </tbody>
</table>

### switch/match, 每个情况下多个条件：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>String numAsString = "";
        <br>switch (i) {
        <br>&nbsp; case 1: case 3:
        <br>&nbsp; case 5: case 7: case 9: 
        <br>&nbsp;&nbsp;&nbsp; numAsString = "odd";
        <br>&nbsp;&nbsp;&nbsp; break;
        <br>&nbsp; case 2: case 4:
        <br>&nbsp; case 6: case 8: case 10: 
        <br>&nbsp;&nbsp;&nbsp; numAsString = "even";
        <br>&nbsp;&nbsp;&nbsp; break;
        <br>&nbsp; default:
        <br>&nbsp;&nbsp;&nbsp; numAsString = "too big";
        <br>&nbsp;&nbsp;&nbsp; break;
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val numAsString = i match
        <br>&nbsp; case 1 | 3 | 5 | 7 | 9 =&gt; "odd"
        <br>&nbsp; case 2 | 4 | 6 | 8 | 10 =&gt; "even"
        <br>&nbsp; case _ =&gt; "too big"
        </code>
      </td>
    </tr>
  </tbody>
</table>

### try/catch/finally:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>try {
        <br>&nbsp; writeTextToFile(text);
        <br>} catch (IOException ioe) {
        <br>&nbsp; println(ioe.getMessage())
        <br>} catch (NumberFormatException nfe) {
        <br>&nbsp; println(nfe.getMessage())
        <br>} finally {
        <br>&nbsp; println("Clean up resources here.")
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>try
        <br>&nbsp; writeTextToFile(text)
        <br>catch
        <br>&nbsp; case ioe: IOException =&gt;
        <br>&nbsp;&nbsp;&nbsp; println(ioe.getMessage)
        <br>&nbsp; case nfe: NumberFormatException =&gt;
        <br>&nbsp;&nbsp;&nbsp; println(nfe.getMessage)
        <br>finally
        <br>&nbsp; println("Clean up resources here.")</code>
      </td>
    </tr>
  </tbody>
</table>

## 集合类

本节比较 Java 和 Scala 里的[集合类][collections-classes]。

### 不可变集合类

如何创建不可变集合实例的例子。

### Sequences:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>List strings = List.of("a", "b", "c");</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val strings = List("a", "b", "c")
        <br>val strings = Vector("a", "b", "c")</code>
      </td>
    </tr>
  </tbody>
</table>

### Sets:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>Set set = Set.of("a", "b", "c");</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val set = Set("a", "b", "c")</code>
      </td>
    </tr>
  </tbody>
</table>

### Maps:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>Map map = Map.of(
        <br>&nbsp; "a", 1, 
        <br>&nbsp; "b", 2,
        <br>&nbsp; "c", 3
        <br>);</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val map = Map(
        <br>&nbsp; "a" -&gt; 1, 
        <br>&nbsp; "b" -&gt; 2, 
        <br>&nbsp; "c" -&gt; 3
        <br>)</code>
      </td>
    </tr>
  </tbody>
</table>

### 可变集合类

Scala 在其 _scala.collection.mutable_ 包中有可变集合类，例如 `ArrayBuffer`、`Map` 和 `Set`。
在 [导入它们][imports] 到当前作用域之后，创建它们就像刚刚显示的不可变 `List`、`Vector`、`Map` 和 `Set` 示例一样。

Scala 还有一个 `Array` 类，您可以将其视为 Java `array` 原始类型的包装器。
一个 Scala `Array[A]` 映射到一个 Java `A[]`，所以你可以认为这个是 Scala `Array[String]`：

```scala
val a = Array("a", "b")
```

这个追溯到 Java 的 `String[]`:

```scala
String[] a = ["a", "b"];
```

但是，Scala `Array` 还具有您期望在 Scala 集合中使用的所有函数方法，包括 `map` 和 `filter`：

```scala
val nums = Array(1, 2, 3, 4, 5)
val doubledNums = nums.map(_ * 2)
val 过滤Nums = nums.filter(_ > 2)
```

因为 Scala `Array` 的表示方式与 Java `array` 相同，所以您可以轻松地在 Scala 代码中使用返回数组的 Java 方法。

> 尽管讨论了 `Array`，但请记住，在 Scala 中通常有可能更适合的 `Array` 替代品。
> 数组对于与其他语言（Java、JavaScript）的互操作很有用，并且在编写需要从底层平台获得最大性能的低级代码时也很有用。但总的来说，当你需要使用序列时，Scala 的习惯用法是更喜欢像 `Vector` 和 `List` 这样的不可变序列，然后在你真的需要可变序列时使用 `ArrayBuffer`。

您还可以使用 Scala `CollectionConverters` 对象在 Java 和 Scala 集合类之间进行转换。
在不同的包中有两个对象，一个用于从 Java 转换为 Scala，另一个用于从 Scala 转换为 Java。
下表显示了可能的转换：

<table>
  <tbody>
    <tr>
      <th>Java</th>
      <th>Scala</th>
    </tr>
    <tr>
      <td valign="top">java.util.Collection</td>
      <td valign="top">scala.collection.Iterable</td>
    </tr>
    <tr>
      <td valign="top">java.util.List</td>
      <td valign="top">scala.collection.mutable.Buffer</td>
    </tr>
    <tr>
      <td valign="top">java.util.Set</td>
      <td valign="top">scala.collection.mutable.Set</td>
    </tr>
    <tr>
      <td valign="top">java.util.Map</td>
      <td valign="top">scala.collection.mutable.Map</td>
    </tr>
    <tr>
      <td valign="top">java.util.concurrent.ConcurrentMap</td>
      <td valign="top">scala.collection.mutable.ConcurrentMap</td>
    </tr>
    <tr>
      <td valign="top">java.util.Dictionary</td>
      <td valign="top">scala.collection.mutable.Map</td>
    </tr>
  </tbody>
</table>

## 集合类的方法

由于能够将 Java 集合视为流，Java 和 Scala 现在可以使用许多相同的通用函数方法：

- `map`
- `filter`
- `forEach`/`foreach`
- `findFirst`/`find`
- `reduce`  

如果您习惯在 Java 中将这些方法与 lambda 表达式一起使用，您会发现在 Scala 的 [集合类][collections-classes] 上使用相同的方法很容易。

Scala 也有_数十个_其他 [集合方法][collections-methods]，包括 `head`、`tail`、`drop`、`take`、`distinct`、`flatten` 等等。
起初你可能想知道为什么会有这么多方法，但是在使用 Scala 之后你会意识到_因为_有这些方法，你很少需要再编写自定义的 `for` 循环了。

（这也意味着你也很少需要_读_自定义的 `for` 循环。
因为开发人员倾向于在_读_代码上花费的时间是_编写_代码的十倍，这很重要。）

## 元组

Java 元组是这样创建的：

```scala
Pair<String, Integer> pair =
  new Pair<String, Integer>("Eleven", 11);

Triplet<String, Integer, Double> triplet =
  Triplet.with("Eleven", 11, 11.0);
Quartet<String, Integer, Double,Person> triplet =
  Quartet.with("Eleven", 11, 11.0, new Person("Eleven"));
```

其他 Java 元组名称是 Quintet、Sextet、Septet、Octet、Ennead、Decade。

Scala 中任何大小的元组都是通过将值放在括号内来创建的，如下所示：

```scala
val a = ("eleven")
val b = ("eleven", 11)
val c = ("eleven", 11, 11.0)
val d = ("eleven", 11, 11.0, Person("Eleven"))
```

## 枚举

本节比较 Java 和 Scala 中的枚举。

### 基本枚举：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>enum Color {
        <br>&nbsp; RED, GREEN, BLUE
        <br>}</code>
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

### 参数化的枚举：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>enum Color {
        <br>&nbsp; Red(0xFF0000),
        <br>&nbsp; Green(0x00FF00),
        <br>&nbsp; Blue(0x0000FF);
        <br>
        <br>&nbsp; private int rgb;
        <br>
        <br>&nbsp; Color(int rgb) {
        <br>&nbsp;&nbsp;&nbsp; this.rgb = rgb;
        <br>&nbsp; }
        <br>}</code>
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

### 用户定义的枚举成员：

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>enum Planet {
        <br>&nbsp; MERCURY (3.303e+23, 2.4397e6),
        <br>&nbsp; VENUS&nbsp;&nbsp; (4.869e+24, 6.0518e6),
        <br>&nbsp; EARTH&nbsp;&nbsp; (5.976e+24, 6.37814e6);
        <br>&nbsp; // more planets ...
        <br>
        <br>&nbsp; private final double mass;
        <br>&nbsp; private final double radius;
        <br>
        <br>&nbsp; Planet(double mass, double radius) {
        <br>&nbsp;&nbsp;&nbsp; this.mass = mass;
        <br>&nbsp;&nbsp;&nbsp; this.radius = radius;
        <br>&nbsp; }
        <br>
        <br>&nbsp; public static final double G = 
        <br>&nbsp;&nbsp;&nbsp; 6.67300E-11;
        <br>
        <br>&nbsp; private double mass() {
        <br>&nbsp;&nbsp;&nbsp; return mass;
        <br>&nbsp; }
        <br>
        <br>&nbsp; private double radius() {
        <br>&nbsp;&nbsp;&nbsp; return radius;
        <br>&nbsp; }
        <br>
        <br>&nbsp; double surfaceGravity() {
        <br>&nbsp;&nbsp;&nbsp; return G * mass / 
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(radius * radius);
        <br>&nbsp; }
        <br>
        <br>&nbsp; double surfaceWeight(
        <br>&nbsp;&nbsp;&nbsp; double otherMass
        <br>&nbsp; ) {
        <br>&nbsp;&nbsp;&nbsp; return otherMass *
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; surfaceGravity();
        <br>&nbsp; }
        <br>
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>enum Planet(
          <br>&nbsp; mass: Double, 
          <br>&nbsp; radius: Double
        <br>):
        <br>&nbsp; case Mercury extends <br>&nbsp;&nbsp;&nbsp; Planet(3.303e+23, 2.4397e6)
        <br>&nbsp; case Venus extends <br>&nbsp;&nbsp;&nbsp; Planet(4.869e+24, 6.0518e6)
        <br>&nbsp; case Earth extends <br>&nbsp;&nbsp;&nbsp; Planet(5.976e+24, 6.37814e6)
        <br>&nbsp;&nbsp;&nbsp; // more planets ...
        <br>
        <br>&nbsp; private final val G = 6.67300E-11
        <br>
        <br>&nbsp; def surfaceGravity = <br>&nbsp;&nbsp;&nbsp; G * mass / (radius * radius)
        <br>
        <br>&nbsp; def surfaceWeight(otherMass: Double)
        <br>&nbsp;&nbsp;&nbsp; = otherMass * surfaceGravity</code>
      </td>
    </tr>
  </tbody>
</table>

## 异常和错误处理

本节介绍 Java 和 Scala 中的异常处理之间的差异。

### Java 使用检查异常

Java 使用检查的异常，因此在 Java 代码中，您历来编写过 `try`/`catch`/`finally` 块，以及方法上的 `throws` 子句：

```scala
public int makeInt(String s)
throws NumberFormatException {
  // code here to convert a String to an int
}
```

### Scala 不使用检查异常

Scala 的习惯用法是_不_使用这样的检查异常。
在处理可能抛出异常的代码时，您可以使用 `try`/`catch`/`finally` 块从抛出异常的代码中捕获异常，但是如何从那里开始的方式是不同的。

解释这一点的最好方法是说 Scala 代码是由具有返回值的_表达式_组成的。
其结果是，最终你写代就像写一系列代数表达式：

```scala
val a = f(x)
val b = g(a,z)
val c = h(b,y)
```

这很好，它只是代数。
您创建方程来解决小问题，然后组合方程来解决更大的问题。

非常重要的是——正如你在代数课程中所记得的那样——代数表达式不会短路——它们不会抛出会破坏一系列方程的异常。

因此，在 Scala 中，我们的方法不会抛出异常。
相反，它们返回像 `Option` 这样的类型。
例如，这个 `makeInt` 方法捕获一个可能的异常并返回一个 `Option` 值：

```scala
def makeInt(s: String): Option[Int] =
  try
    Some(s.toInt)
  catch
    case e: NumberFormatException => None
```

Scala `Option` 类似于 Java `Optional` 类。
如图所示，如果 string 到 int 的转换成功，则在 `Some` 值中返回 `Int`，如果失败，则返回 `None` 值。
`Some` 和 `None` 是 `Option` 的子类型，因此该方法被声明为返回 `Option[Int]` 类型。

当您有一个 `Option` 值时，例如 `makeInt` 返回的值，有很多方法可以使用它，具体取决于您的需要。
此代码显示了一种可能的方法：

```scala
makeInt(aString) match
  case Some(i) => println(s"Int i = $i")
  case None => println(s"Could not convert $aString to an Int.")
```

`Option` 在 Scala 中很常用，它内置在标准库的许多类中。
其他类似的类的集合，例如 Try/Success/Failure 和 Either/Left/Right，提供了更大的灵活性。

有关在 Scala 中处理错误和异常的更多信息，请参阅 [函数式错误处理][error-handling] 部分。

## Scala 独有的概念

以上就是 Java 和 Scala 语言的比较。

Scala 中还有其他一些概念目前在 Java 11 中是没有的。
这包括：

- 与 Scala 的 [上下文抽象][contextual] 相关的一切
- 几个 Scala 方法特性：
  - 多参数列表
  - 默认参数值
  - 调用方法时使用命名参数
- 样例类（如 Java 14 中的“记录”）、样例对象以及伴生类和对象（参见 [领域建模][modeling-intro]）一章
- 创建自己的控制结构和 DSL 的能力
- [顶级定义][toplevel]
- 模式匹配
- `match` 表达式的高级特性
- 类型 lambdas
- trait参数
- [不透明类型别名][opaque]
- [多元相等性][equality]
- [类型类][type-classes]
- 中缀方法
- 宏和元编程


[collections-classes]: {% link _overviews/scala3-book/collections-classes.md %}
[collections-methods]: {% link _overviews/scala3-book/collections-methods.md %}
[control]: {% link _overviews/scala3-book/control-structures.md %}
[equality]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
[error-handling]: {% link _overviews/scala3-book/fp-functional-error-handling.md %}
[extension-methods]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[givens]: {% link _overviews/scala3-book/ca-given-using-clauses.md %}
[hofs]: {% link _overviews/scala3-book/fun-hofs.md %}
[imports]: {% link _overviews/scala3-book/packaging-imports.md %}
[modeling-intro]: {% link _overviews/scala3-book/domain-modeling-intro.md %}
[modeling-oop]: {% link _overviews/scala3-book/domain-modeling-oop.md %}
[opaque]: {% link _overviews/scala3-book/types-opaque-types.md %}
[tools]: {% link _overviews/scala3-book/scala-tools.md %}
[toplevel]: {% link _overviews/scala3-book/taste-toplevel-definitions.md %}
[type-classes]: {% link _overviews/scala3-book/ca-type-classes.md %}

[concurrency]: {% link _overviews/scala3-book/concurrency.md %}
[contextual]: {% link _overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[control]: {% link _overviews/scala3-book/control-structures.md %}
[fp-intro]: {% link _overviews/scala3-book/fp-intro.md %}
[intersection-types]: {% link _overviews/scala3-book/types-intersection.md %}
[modeling-fp]: {% link _overviews/scala3-book/domain-modeling-fp.md %}
[multiversal]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
[union-types]: {% link _overviews/scala3-book/types-union.md %}

</div>
