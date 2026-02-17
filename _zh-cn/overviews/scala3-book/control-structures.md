---
title: 控制结构
type: chapter
description: This page provides an introduction to Scala's control structures, including if/then/else, 'for' loops, 'for' expressions, 'match' expressions, try/catch/finally, and 'while' loops.
language: zh-cn
num: 19
previous-page: string-interpolation
next-page: domain-modeling-intro

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


Scala具有您希望在编程语言中找到的控制结构，包括：

- `if`/`then`/`else`
- `for` 循环
- `while` 循环
- `try`/`catch`/`finally`

它还具有另外两个您可能以前从未见过的强大结构，具体取决于您的编程背景：

- `for` 表达式（也被称作 _`for` comprehensions_）
- `match` 表达式

这些都将在以下各节中进行演示。

## if/then/else 结构

单行 Scala `if` 语句像这样：

{% tabs control-structures-1 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-1 %}

```scala
if (x == 1) println(x)
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-1 %}

```scala
if x == 1 then println(x)
```

{% endtab %}
{% endtabs %}

如果要在 `if` 比较后运行多行代码，用这个语法：

{% tabs control-structures-2 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-2 %}

```scala
if (x == 1) {
  println("x is 1, as you can see:")
  println(x)
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-2 %}

```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
```

{% endtab %}
{% endtabs %}

`if`/`else` 语法像这样：

{% tabs control-structures-3 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-3 %}

```scala
if (x == 1) {
  println("x is 1, as you can see:")
  println(x)
} else {
  println("x was not 1")
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-3 %}

```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
else
  println("x was not 1")
```

{% endtab %}
{% endtabs %}

这是 `if`/`else if`/`else` 语法：

{% tabs control-structures-4 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-4 %}

```scala
if (x < 0)
  println("negative")
else if (x == 0)
  println("zero")
else
  println("positive")
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-4 %}

```scala
if x < 0 then
  println("negative")
else if x == 0 then
  println("zero")
else
  println("positive")
```

{% endtab %}
{% endtabs %}

### `end if` 语句

<blockquote class="help-info">
<i class="fa fa-info"></i>&nbsp;&nbsp;这是 Scala 3 里的新东西，在 Scala 2 里不支持。
</blockquote>

如果您愿意，可以选择在每个表达式的末尾包含 `end if` 语句：

{% tabs control-structures-5 %}
{% tab 'Scala 3 Only'  %}

```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
end if
```

{% endtab %}
{% endtabs %}

### `if`/`else` 表达式总是有返回值

请注意， `if` / `else` 比较形式为 _表达式_，这意味着它们返回一个可以分配给变量的值。
因此，不需要特殊的三元运算符：

{% tabs control-structures-6 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-6 %}

```scala
val minValue = if (a < b) a else b
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-6 %}

```scala
val minValue = if a < b then a else b
```

{% endtab %}
{% endtabs %}

由于它们返回一个值，因此可以使用 `if`/`else` 表达式作为方法的主体：

{% tabs control-structures-7 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-7 %}

```scala
def compare(a: Int, b: Int): Int =
  if (a < b)
    -1
  else if (a == b)
    0
  else
    1
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-7 %}

```scala
def compare(a: Int, b: Int): Int =
  if a < b then
    -1
  else if a == b then
    0
  else
    1
```

{% endtab %}
{% endtabs %}

### 题外话：面向表达式的编程

作为一般编程的简要说明，当您编写的每个表达式都返回一个值时，该样式称为面向 _面向表达式的编程_ 或 EOP。
例如，这是一个 _表达式_：

{% tabs control-structures-8 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-8 %}

```scala
val minValue = if (a < b) a else b
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-8 %}

```scala
val minValue = if a < b then a else b
```

{% endtab %}
{% endtabs %}

相反，不返回值的代码行称为 _语句_，用它们的 _副作用_。
例如，这些代码行不返回值，因此用它们的副作用：

{% tabs control-structures-9 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-9 %}

```scala
if (a == b) action()
println("Hello")
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-9 %}

```scala
if a == b then action()
println("Hello")
```

{% endtab %}
{% endtabs %}

第一个示例在 `a` 等于 `b` 时将 `action` 方法作为副作用运行。
第二个示例用于将字符串打印到 STDOUT 的副作用。
随着你对Scala的了解越来越多，你会发现自己写的 _表达式_ 越来越多，_语句_ 也越来越少。

## `for` 循环

在最简单的用法中，Scala `for` 循环可用于迭代集合中的元素。
例如，给定一个整数序列，您可以循环访问其元素并打印其值，如下所示：

{% tabs control-structures-10 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-10 %}

```scala
val ints = Seq(1, 2, 3)
for (i <- ints) println(i)
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-10 %}

```scala
val ints = Seq(1, 2, 3)
for i <- ints do println(i)
```

{% endtab %}
{% endtabs %}

代码 `i <- ints` 被称为 _生成器_。

这是在 Scala REPL 中的结果：

{% tabs control-structures-11 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-11 %}
````
scala> val ints = Seq(1,2,3)
ints: Seq[Int] = List(1, 2, 3)

scala> for (i <- ints) println(i)
1
2
3
````
{% endtab %}
{% tab 'Scala 3' for=control-structures-11 %}
````
scala> val ints = Seq(1,2,3)
ints: Seq[Int] = List(1, 2, 3)

scala> for i <- ints do println(i)
1
2
3
````

{% endtab %}
{% endtabs %}

如果需要在 `for` 生成器后面显示多行代码块，请使用以下语法：ddu

{% tabs control-structures-12 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-12 %}

```scala
for (i <- ints) {
  val x = i * 2
  println(s"i = $i, x = $x")
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-12 %}

```scala
for
  i <- ints
do
  val x = i * 2
  println(s"i = $i, x = $x")
```

{% endtab %}
{% endtabs %}

### 多生成器

`for` 循环可以有多个生成器，如以下示例所示：

{% tabs control-structures-13 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-13 %}

```scala
for {
  i <- 1 to 2
  j <- 'a' to 'b'
  k <- 1 to 10 by 5
} {
  println(s"i = $i, j = $j, k = $k")
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-13 %}

```scala
for
  i <- 1 to 2
  j <- 'a' to 'b'
  k <- 1 to 10 by 5
do
  println(s"i = $i, j = $j, k = $k")
```

{% endtab %}
{% endtabs %}

那个表达式的输出：

````
i = 1, j = a, k = 1
i = 1, j = a, k = 6
i = 1, j = b, k = 1
i = 1, j = b, k = 6
i = 2, j = a, k = 1
i = 2, j = a, k = 6
i = 2, j = b, k = 1
i = 2, j = b, k = 6
````

### 守卫

`for` 循环也可以包含 `if` 语句，这些语句称为 _守卫_：

{% tabs control-structures-14 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-14 %}

```scala
for {
  i <- 1 to 5
  if i % 2 == 0
} {
  println(i)
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-14 %}

```scala
for
  i <- 1 to 5
  if i % 2 == 0
do
  println(i)
```

{% endtab %}
{% endtabs %}

以上循环的输出是：

````
2
4
````

`for` 循环可以根据需要有任意数量的守卫。
此示例显示了打印数字`4`的一种方法：

{% tabs control-structures-15 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-15 %}

```scala
for {
  i <- 1 to 10
  if i > 3
  if i < 6
  if i % 2 == 0
} {
  println(i)
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-15 %}

```scala
for
  i <- 1 to 10
  if i > 3
  if i < 6
  if i % 2 == 0
do
  println(i)
```

{% endtab %}
{% endtabs %}

### 把 `for` 用在 `Map` 上

您还可以将 `for` 循环与 `Map` 一起使用。
例如，给定州缩写及其全名的 `Map`：

{% tabs map %}
{% tab 'Scala 2 and 3' for=map %}

```scala
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama", 
  "AR" -> "Arizona"
)
```

{% endtab %}
{% endtabs %}

您可以使用 `for` 打印键和值，如下所示：

{% tabs control-structures-16 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-16 %}

```scala
for ((abbrev, fullName) <- states) println(s"$abbrev: $fullName")
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-16 %}

```scala
for (abbrev, fullName) <- states do println(s"$abbrev: $fullName")
```

{% endtab %}
{% endtabs %}

以下是 REPL 中的样子：

{% tabs control-structures-17 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-17 %}

```scala
scala> for ((abbrev, fullName) <- states) println(s"$abbrev: $fullName")
AK: Alaska
AL: Alabama
AR: Arizona
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-17 %}

```scala
scala> for (abbrev, fullName) <- states do println(s"$abbrev: $fullName")
AK: Alaska
AL: Alabama
AR: Arizona
```

{% endtab %}
{% endtabs %}

当 `for` 循环遍历映射时，每个键/值对都绑定到变量 `abbrev` 和 `fullName` ，它们位于元组中：

{% tabs tuple %}
{% tab 'Scala 2 and 3' for=tuple %}

```scala
(abbrev, fullName) <- states
```

{% endtab %}
{% endtabs %}

当循环运行时，变量 `abbrev` 被分配给映射中的当前 _键_，变量 `fullName` 被分配给当前map 的 _值_。

## `for` 表达式

在前面的 `for` 循环示例中，这些循环都用于 _副作用_，特别是使用 `println` 将这些值打印到STDOUT。

重要的是要知道，您还可以创建有返回值的 `for` _表达式_。
您可以通过添加 `yield` 关键字和要返回的表达式来创建 `for` 表达式，如下所示：

{% tabs control-structures-18 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-18 %}

```scala
val list =
  for (i <- 10 to 12)
  yield i * 2

// list: IndexedSeq[Int] = Vector(20, 22, 24)
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-18 %}

```scala
val list =
  for i <- 10 to 12
  yield i * 2

// list: IndexedSeq[Int] = Vector(20, 22, 24)
```

{% endtab %}
{% endtabs %}

在 `for` 表达式运行后，变量 `list` 是包含所示值的 `Vector` 。
这是表达式的工作原理：

1. `for` 表达式开始循环访问范围 `(10, 11, 12)` 中的值。
   它首先处理值`10`，将其乘以`2`，然后 _产生_ 结果为`20`的值。
2. 接下来，它处理`11`---该范围中的第二个值。
   它乘以`2`，然后产生值`22`。
   您可以将这些产生的值看作它们累积在某个临时位置。
3. 最后，循环从范围中获取数字 `12`，将其乘以 `2`，得到数字 `24`。
   循环此时完成并产生最终结果 `Vector(20, 22, 24)`。

{% comment %}
NOTE: This is a place where it would be great to have a TIP or NOTE block:
{% endcomment %}

虽然本节的目的是演示 `for` 表达式，但它可以帮助知道显示的 `for` 表达式等效于以下 `map` 方法调用：

{% tabs map-call %}
{% tab 'Scala 2 and 3' for=map-call %}

```scala
val list = (10 to 12).map(i => i * 2)
```

{% endtab %}
{% endtabs %}

只要您需要遍历集合中的所有元素，并将算法应用于这些元素以创建新列表，就可以使用 `for` 表达式。

下面是一个示例，演示如何在 `yield` 之后使用代码块：

{% tabs control-structures-19 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-19 %}

```scala
val names = List("_olivia", "_walter", "_peter")

val capNames = for (name <- names) yield { 
  val nameWithoutUnderscore = name.drop(1)
  val capName = nameWithoutUnderscore.capitalize
  capName
}

// capNames: List[String] = List(Olivia, Walter, Peter)
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-19 %}

```scala
val names = List("_olivia", "_walter", "_peter")

val capNames = for name <- names yield
  val nameWithoutUnderscore = name.drop(1)
  val capName = nameWithoutUnderscore.capitalize
  capName

// capNames: List[String] = List(Olivia, Walter, Peter)
```

{% endtab %}
{% endtabs %}

### 使用 `for` 表达式作为方法的主体

由于 `for` 表达式产生结果，因此可以将其用作返回有用值的方法的主体。
此方法返回给定整数列表中介于`3`和`10`之间的所有值：

{% tabs control-structures-20 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-20 %}

```scala
def between3and10(xs: List[Int]): List[Int] =
  for {
    x <- xs
    if x >= 3
    if x <= 10
  } yield x

between3and10(List(1, 3, 7, 11))   // : List[Int] = List(3, 7)
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-20 %}

```scala
def between3and10(xs: List[Int]): List[Int] =
  for
    x <- xs
    if x >= 3
    if x <= 10
  yield x

between3and10(List(1, 3, 7, 11))   // : List[Int] = List(3, 7)
```

{% endtab %}
{% endtabs %}

## `while` 循环

Scala `while` 循环语法如下：

{% tabs control-structures-21 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-21 %}

```scala
var i = 0

while (i < 3) {
  println(i)
  i += 1
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-21 %}

```scala
var i = 0

while i < 3 do
  println(i)
  i += 1
```

{% endtab %}
{% endtabs %}

## `match` 表达式

模式匹配是函数式编程语言的一个主要特征，Scala包含一个具有许多功能的 `match` 表达式。

在最简单的情况下，您可以使用 `match` 表达式，象Java `switch` 语句，根据整数值匹配。
请注意，这实际上是一个表达式，因为它计算出一个结果：

{% tabs control-structures-22 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-22 %}

```scala
// `i` is an integer
val day = i match {
  case 0 => "Sunday"
  case 1 => "Monday"
  case 2 => "Tuesday"
  case 3 => "Wednesday"
  case 4 => "Thursday"
  case 5 => "Friday"
  case 6 => "Saturday"
  case _ => "invalid day"   // the default, catch-all
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-22 %}

```scala
import scala.annotation.switch

// `i` is an integer
val day = i match
  case 0 => "Sunday"
  case 1 => "Monday"
  case 2 => "Tuesday"
  case 3 => "Wednesday"
  case 4 => "Thursday"
  case 5 => "Friday"
  case 6 => "Saturday"
  case _ => "invalid day"   // the default, catch-all
```

{% endtab %}
{% endtabs %}

在此示例中，变量 `i` 根据所示情况进行测试。
如果它介于`0`和`6`之间，则 `day` 绑定到一个字符串，该字符串表示一周中的某一天。
否则，捕获所有情况，这些情况用 `_` 字符表示，这样 `day` 绑定到字符串 `"invalid day"`。

> 在编写像这样的简单 `match` 表达式时，建议在变量 `i` 上使用 `@switch` 注释。
> 如果开关无法编译为 `tableswitch` 或 `lookupswitch`，则此注释会提供编译时警告，这个开关对性能更好。

### 使用缺省值

当您需要访问 `match` 表达式中匹配所有情况，也就是默认值时，只需在 `case` 语句的左侧提供一个变量名而不是 `_`，然后根据需要在语句的右侧使用该变量名称：

{% tabs control-structures-23 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-23 %}

```scala
i match {
  case 0 => println("1")
  case 1 => println("2")
  case what => println(s"You gave me: $what")
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-23 %}

```scala
i match
  case 0 => println("1")
  case 1 => println("2")
  case what => println(s"You gave me: $what" )
```

{% endtab %}
{% endtabs %}

在模式中使用的名称必须以小写字母开头。
以大写字母开头的名称并不引入变量，而是匹配该范围内的一个值：

{% tabs control-structures-24 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-24 %}

```scala
val N = 42
i match {
  case 0 => println("1")
  case 1 => println("2")
  case N => println("42")
  case n => println(s"You gave me: $n" )
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-24 %}

```scala
val N = 42
i match
  case 0 => println("1")
  case 1 => println("2")
  case N => println("42")
  case n => println(s"You gave me: $n" )
```

{% endtab %}
{% endtabs %}

如果 `i` 等于`42`，则 `case N` 将匹配，然后打印字符串`"42"`。它不会到达默认分支。

### 在一行上处理多个可能的匹配项

如前所述，`match` 表达式具有许多功能。
此示例演示如何在每个 `case` 语句中使用多个可能的模式匹配：

{% tabs control-structures-25 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-25 %}

```scala
val evenOrOdd = i match {
  case 1 | 3 | 5 | 7 | 9 => println("odd")
  case 2 | 4 | 6 | 8 | 10 => println("even")
  case _ => println("some other number")
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-25 %}

```scala
val evenOrOdd = i match
  case 1 | 3 | 5 | 7 | 9 => println("odd")
  case 2 | 4 | 6 | 8 | 10 => println("even")
  case _ => println("some other number")
```

{% endtab %}
{% endtabs %}

### 在  `case`  子句中使用  `if`  守卫

您还可以在匹配表达式的 `case` 中使用守卫装置。
在此示例中，第二个和第三个 `case` 都使用守卫来匹配多个整数值：

{% tabs control-structures-26 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-26 %}

```scala
i match {
  case 1 => println("one, a lonely number")
  case x if x == 2 || x == 3 => println("two’s company, three’s a crowd")
  case x if x > 3 => println("4+, that’s a party")
  case _ => println("i’m guessing your number is zero or less")
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-26 %}

```scala
i match
  case 1 => println("one, a lonely number")
  case x if x == 2 || x == 3 => println("two’s company, three’s a crowd")
  case x if x > 3 => println("4+, that’s a party")
  case _ => println("i’m guessing your number is zero or less")
```

{% endtab %}
{% endtabs %}

下面是另一个示例，它显示了如何将给定值与数字范围进行匹配：

{% tabs control-structures-27 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-27 %}

```scala
i match {
  case a if 0 to 9 contains a => println(s"0-9 range: $a")
  case b if 10 to 19 contains b => println(s"10-19 range: $b")
  case c if 20 to 29 contains c => println(s"20-29 range: $c")
  case _ => println("Hmmm...")
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-27 %}

```scala
i match
  case a if 0 to 9 contains a => println(s"0-9 range: $a")
  case b if 10 to 19 contains b => println(s"10-19 range: $b")
  case c if 20 to 29 contains c => println(s"20-29 range: $c")
  case _ => println("Hmmm...")
```

{% endtab %}
{% endtabs %}

#### 样例类和 match 表达式

您还可以从 `case` 类中提取字段 —— 以及正确编写了 `apply`/`unapply` 方法的类 —— 并在守卫条件下使用这些字段。
下面是一个使用简单 `Person` 案例类的示例：

{% tabs control-structures-28 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-28 %}

```scala
case class Person(name: String)

def speak(p: Person) = p match {
  case Person(name) if name == "Fred" => println(s"$name says, Yubba dubba doo")
  case Person(name) if name == "Bam Bam" => println(s"$name says, Bam bam!")
  case _ => println("Watch the Flintstones!")
}

speak(Person("Fred"))      // "Fred says, Yubba dubba doo"
speak(Person("Bam Bam"))   // "Bam Bam says, Bam bam!"
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-28 %}

```scala
case class Person(name: String)

def speak(p: Person) = p match
  case Person(name) if name == "Fred" => println(s"$name says, Yubba dubba doo")
  case Person(name) if name == "Bam Bam" => println(s"$name says, Bam bam!")
  case _ => println("Watch the Flintstones!")

speak(Person("Fred"))      // "Fred says, Yubba dubba doo"
speak(Person("Bam Bam"))   // "Bam Bam says, Bam bam!"
```

{% endtab %}
{% endtabs %}

### 使用 `match` 表达式作为方法的主体

由于 `match` 表达式返回一个值，因此它们可以用作方法的主体。
此方法采用 `Matchable` 值作为输入参数，并根据 `match` 表达式的结果返回 `Boolean`：

{% tabs control-structures-29 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-29 %}

```scala
def isTruthy(a: Matchable) = a match {
  case 0 | "" | false => false
  case _              => true
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-29 %}

```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" | false => false
  case _              => true
```

{% endtab %}
{% endtabs %}

输入参数 `a` 被定义为 [`Matchable`类型][matchable]---这是可以对其执行模式匹配的所有Scala类型的根。
该方法通过在输入上进行匹配来实现，提供两种情况：
第一个检查给定值是整数`0`，空字符串还是 `false`，在这种情况下返回 `false`。
在默认情况下，我们为任何其他值返回 `true`。
以下示例演示此方法的工作原理：

{% tabs is-truthy-call %}
{% tab 'Scala 2 and 3' for=is-truthy-call %}

```scala
isTruthy(0)      // false
isTruthy(false)  // false
isTruthy("")     // false
isTruthy(1)      // true
isTruthy(" ")    // true
isTruthy(2F)     // true
```

{% endtab %}
{% endtabs %}

使用 `match` 表达式作为方法的主体是一种非常常见的用法。

#### 匹配表达式支持许多不同类型的模式

有许多不同形式的模式可用于编写 `match` 表达式。
示例包括：

- 常量模式（如 `case 3 => `）
- 序列模式（如 `case List(els : _*) =>`）
- 元组模式（如 `case (x, y) =>`）
- 构造函数模式（如 `case Person(first, last) =>`）
- 类型测试模式（如 `case p: Person =>`）

所有这些类型的模式匹配都展示在以下 `pattern` 方法中，该方法采用类型为 `Matchable` 的输入参数并返回 `String` ：

{% tabs control-structures-30 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-30 %}

```scala
def pattern(x: Matchable): String = x match {

  // constant patterns
  case 0 => "zero"
  case true => "true"
  case "hello" => "you said 'hello'"
  case Nil => "an empty List"

  // sequence patterns
  case List(0, _, _) => "a 3-element list with 0 as the first element"
  case List(1, _*) => "list, starts with 1, has any number of elements"
  case Vector(1, _*) => "vector, starts w/ 1, has any number of elements"

  // tuple patterns
  case (a, b) => s"got $a and $b"
  case (a, b, c) => s"got $a, $b, and $c"

  // constructor patterns
  case Person(first, "Alexander") => s"Alexander, first name = $first"
  case Dog("Zeus") => "found a dog named Zeus"

  // type test patterns
  case s: String => s"got a string: $s"
  case i: Int => s"got an int: $i"
  case f: Float => s"got a float: $f"
  case a: Array[Int] => s"array of int: ${a.mkString(",")}"
  case as: Array[String] => s"string array: ${as.mkString(",")}"
  case d: Dog => s"dog: ${d.name}"
  case list: List[?] => s"got a List: $list"
  case m: Map[?, ?] => m.toString

  // the default wildcard pattern
  case _ => "Unknown"
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-30 %}

```scala
def pattern(x: Matchable): String = x match

  // constant patterns
  case 0 => "zero"
  case true => "true"
  case "hello" => "you said 'hello'"
  case Nil => "an empty List"

  // sequence patterns
  case List(0, _, _) => "a 3-element list with 0 as the first element"
  case List(1, _*) => "list, starts with 1, has any number of elements"
  case Vector(1, _*) => "vector, starts w/ 1, has any number of elements"

  // tuple patterns
  case (a, b) => s"got $a and $b"
  case (a, b, c) => s"got $a, $b, and $c"

  // constructor patterns
  case Person(first, "Alexander") => s"Alexander, first name = $first"
  case Dog("Zeus") => "found a dog named Zeus"

  // type test patterns
  case s: String => s"got a string: $s"
  case i: Int => s"got an int: $i"
  case f: Float => s"got a float: $f"
  case a: Array[Int] => s"array of int: ${a.mkString(",")}"
  case as: Array[String] => s"string array: ${as.mkString(",")}"
  case d: Dog => s"dog: ${d.name}"
  case list: List[?] => s"got a List: $list"
  case m: Map[?, ?] => m.toString

  // the default wildcard pattern
  case _ => "Unknown"
```

{% endtab %}
{% endtabs %}

{% comment %}
TODO: Add in the new Scala 3 syntax shown on this page:
http://nightly.scala-lang.org/docs/reference/changed-features/match-syntax.html
{% endcomment %}

## try/catch/finally

与Java一样，Scala也有一个 `try`/`catch`/`finally` 结构，让你可以捕获和管理异常。
为了保持一致性，Scala使用与 `match` 表达式相同的语法，并支持在可能发生的不同可能的异常上进行模式匹配。

在下面的示例中，`openAndReadAFile` 是一个执行其名称含义的方法：它打开一个文件并读取其中的文本，将结果分配给可变变量 `text` ：

{% tabs control-structures-31 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-31 %}

```scala
var text = ""
try {
  text = openAndReadAFile(filename)
} catch {
  case fnf: FileNotFoundException => fnf.printStackTrace()
  case ioe: IOException => ioe.printStackTrace()
} finally {
  // close your resources here
  println("Came to the 'finally' clause.")
}
```

{% endtab %}
{% tab 'Scala 3' for=control-structures-31 %}

```scala
var text = ""
try
  text = openAndReadAFile(filename)
catch
  case fnf: FileNotFoundException => fnf.printStackTrace()
  case ioe: IOException => ioe.printStackTrace()
finally
  // close your resources here
  println("Came to the 'finally' clause.")
```

{% endtab %}
{% endtabs %}

假设 `openAndReadAFile` 方法使用 Java `java.io.*` 类来读取文件并且不捕获其异常，则尝试打开和读取文件可能会导致  `FileNotFoundException`  和  `IOException` 异常，本例中，这两个异常在 `catch` 块中被捕获。

[matchable]: {{ site.scala3ref }}/other-new-features/matchable.html
