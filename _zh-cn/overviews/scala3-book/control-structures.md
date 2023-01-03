---
title: 控制结构
type: chapter
description: This page provides an introduction to Scala's control structures, including if/then/else, 'for' loops, 'for' expressions, 'match' expressions, try/catch/finally, and 'while' loops.
language: zh-cn
num: 18
previous-page: first-look-at-types
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

```scala
if x == 1 then println(x)
```

如果要在 `if` 比较后运行多行代码，用这个语法：

```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
```

`if`/`else` 语法像这样：

```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
else
  println("x was not 1")
```

这是 `if`/`else if`/`else` 语法：

```scala
if x < 0 then
  println("negative")
else if x == 0 then
  println("zero")
else
  println("positive")
```

如果您愿意，可以选择在每个表达式的末尾包含 `end if` 语句：

```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
end if
```

### `if`/`else` 表达式总是有返回值

请注意， `if` / `else` 比较形式为 _表达式_，这意味着它们返回一个可以分配给变量的值。
因此，不需要特殊的三元运算符：

```scala
val minValue = if a < b then a else b
```

由于它们返回一个值，因此可以使用 `if`/`else` 表达式作为方法的主体：

```scala
def compare(a: Int, b: Int): Int =
  if a < b then
    -1
  else if a == b then
    0
  else
    1
```

### 题外话：面向表达式的编程

作为一般编程的简要说明，当您编写的每个表达式都返回一个值时，该样式称为面向 _面向表达式的编程_ 或 EOP。
例如，这是一个 _表达式_：

```scala
val minValue = if a < b then a else b
```

相反，不返回值的代码行称为 _语句_，用它们的 _副作用_。
例如，这些代码行不返回值，因此用它们的副作用：

```scala
if a == b then action()
println("Hello")
```

第一个示例在 `a` 等于 `b` 时将 `action` 方法作为副作用运行。
第二个示例用于将字符串打印到 STDOUT 的副作用。
随着你对Scala的了解越来越多，你会发现自己写的 _表达式_ 越来越多，_语句_ 也越来越少。

## `for` 循环

在最简单的用法中，Scala `for` 循环可用于迭代集合中的元素。
例如，给定一个整数序列，您可以循环访问其元素并打印其值，如下所示：

```scala
val ints = Seq(1, 2, 3)
for i <- ints do println(i)
```

代码 `i <- ints` 被称为 _生成器_，如果将括号从生成器中去掉，则必须在括号之后的代码前加上 `do` 关键字。
否则，您可以像这样编写代码：

```scala
for (i <- ints) println(i)
```

无论您使用哪种方法，这都是 Scala REPL 中的结果：

````
scala> val ints = Seq(1,2,3)
ints: Seq[Int] = List(1, 2, 3)

scala> for i <- ints do println(i)
1
2
3
````

如果需要在 `for` 生成器后面显示多行代码块，请使用以下语法：

```scala
for
  i <- ints
do
  val x = i * 2
  println(s"i = $i, x = $x")
```

### 多生成器

`for` 循环可以有多个生成器，如以下示例所示：

```scala
for
  i <- 1 to 2
  j <- 'a' to 'b'
  k <- 1 to 10 by 5
do
  println(s"i = $i, j = $j, k = $k")
```

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

```scala
for
  i <- 1 to 5
  if i % 2 == 0
do
  println(i)
```

以上循环的输出是：

````
2
4
````

`for` 循环可以根据需要有任意数量的守卫。
此示例显示了打印数字`4`的一种方法：

```scala
for
  i <- 1 to 10
  if i > 3
  if i < 6
  if i % 2 == 0
do
  println(i)
```

### 把 `for` 用在 `Map` 上

您还可以将 `for` 循环与 `Map` 一起使用。
例如，给定州缩写及其全名的 `Map`：

```scala
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama", 
  "AR" -> "Arizona"
)
```

您可以使用 `for` 打印键和值，如下所示：

```scala
for (abbrev, fullName) <- states do println(s"$abbrev: $fullName")
```

以下是 REPL 中的样子：

```scala
scala> for (abbrev, fullName) <- states do println(s"$abbrev: $fullName")
AK: Alaska
AL: Alabama
AR: Arizona
```

当 `for` 循环遍历映射时，每个键/值对都绑定到变量 `abbrev` 和 `fullName` ，它们位于元组中：

```scala
(abbrev, fullName) <- states
```

当循环运行时，变量 `abbrev` 被分配给映射中的当前 _键_，变量 `fullName` 被分配给当前map 的 _值_。

## `for` 表达式

在前面的 `for` 循环示例中，这些循环都用于 _副作用_，特别是使用 `println` 将这些值打印到STDOUT。

重要的是要知道，您还可以创建有返回值的 `for` _表达式_。
您可以通过添加 `yield` 关键字和要返回的表达式来创建 `for` 表达式，如下所示：

```scala
val list =
  for
    i <- 10 to 12
  yield
    i * 2

// list: IndexedSeq[Int] = Vector(20, 22, 24)
```

在 `for` 表达式运行后，变量 `list` 是包含所示值的 `Vector` 。
这是表达式的工作原理：

1. `for` 表达式开始循环访问范围 `(10, 11, 12)` 中的值。
   它首先处理值`10`，将其乘以`2`，然后 _产生_ 结果为`20`的值。
2. 接下来，它适用于`11`---范围中的第二个值。
   它乘以`2`，然后产生值`22`。
   您可以将这些产生的值看作它们累积在某个临时位置。
3. 最后，循环从范围中获取数字 `12`，将其乘以 `2`，得到数字 `24`。
   循环此时完成并产生最终结果 `Vector(20, 22, 24)`。

{% comment %}
NOTE: This is a place where it would be great to have a TIP or NOTE block:
{% endcomment %}

虽然本节的目的是演示 `for` 表达式，但它可以帮助知道显示的 `for` 表达式等效于以下 `map` 方法调用：

```scala
val list = (10 to 12).map(i => i * 2)
```

只要您需要遍历集合中的所有元素，并将算法应用于这些元素以创建新列表，就可以使用 `for` 表达式。

下面是一个示例，演示如何在 `yield` 之后使用代码块：

```scala
val names = List("_olivia", "_walter", "_peter")

val capNames = for name <- names yield
  val nameWithoutUnderscore = name.drop(1)
  val capName = nameWithoutUnderscore.capitalize
  capName

// capNames: List[String] = List(Olivia, Walter, Peter)
```

### 使用 `for` 表达式作为方法的主体

由于 `for` 表达式产生结果，因此可以将其用作返回有用值的方法的主体。
此方法返回给定整数列表中介于`3`和`10`之间的所有值：

```scala
def between3and10(xs: List[Int]): List[Int] =
  for
    x <- xs
    if x >= 3
    if x <= 10
  yield x

between3and10(List(1, 3, 7, 11))   // : List[Int] = List(3, 7)
```

## `while` 循环

Scala `while` 循环语法如下：

```scala
var i = 0

while i < 3 do
  println(i)
  i += 1
```

如果你把测试条件放在括号里，它可以写成这样：

```scala
var i = 0

while (i < 3) {
  println(i)
  i += 1
}
```


## `match` 表达式

模式匹配是函数式编程语言的一个主要特征，Scala包含一个具有许多功能的 `match` 表达式。

在最简单的情况下，您可以使用 `match` 表达式，象Java `switch` 语句，根据整数值匹配。
请注意，这实际上是一个表达式，因为它计算出一个结果：

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

在此示例中，变量 `i` 根据所示情况进行测试。
如果它介于`0`和`6`之间，则 `day` 绑定到一个字符串，该字符串表示一周中的某一天。
否则，捕获所有情况，这些情况用 `_` 字符表示，这样 `day` 绑定到字符串 `"invalid day"`。

> 在编写像这样的简单 `match` 表达式时，建议在变量 `i` 上使用 `@switch` 注释。
> 如果开关无法编译为 `tableswitch` 或 `lookupswitch`，则此注释会提供编译时警告，这个开关对性能更好。

### 使用缺省值

当您需要访问 `match` 表达式中匹配所有情况，也就是默认值时，只需在 `case` 语句的左侧提供一个变量名称，然后根据需要在语句的右侧使用该变量名称：

```scala
i match
  case 0 => println("1")
  case 1 => println("2")
  case what => println(s"You gave me: $what" )
```

在此示例中，变量被命名为 `what` ，以表明可以为其指定任何合法名称。
您还可以使用 `_` 作为名称来忽略该值。

### 在一行上处理多个可能的匹配项

如前所述，`match` 表达式具有许多功能。
此示例演示如何在每个 `case` 语句中使用多个可能的模式匹配：

```scala
val evenOrOdd = i match
  case 1 | 3 | 5 | 7 | 9 => println("odd")
  case 2 | 4 | 6 | 8 | 10 => println("even")
  case _ => println("some other number")
```

### 在  `case`  子句中使用  `if`  守卫

您还可以在匹配表达式的 `case` 中使用守卫装置。
在此示例中，第二个和第三个 `case` 都使用守卫来匹配多个整数值：

```scala
i match
  case 1 => println("one, a lonely number")
  case x if x == 2 || x == 3 => println("two’s company, three’s a crowd")
  case x if x > 3 => println("4+, that’s a party")
  case _ => println("i’m guessing your number is zero or less")
```

下面是另一个示例，它显示了如何将给定值与数字范围进行匹配：

```scala
i match
  case a if 0 to 9 contains a => println(s"0-9 range: $a")
  case b if 10 to 19 contains b => println(s"10-19 range: $b")
  case c if 20 to 29 contains c => println(s"20-29 range: $c")
  case _ => println("Hmmm...")
```

#### 样例类和 match 表达式

您还可以从 `case` 类中提取字段 —— 以及正确编写了 `apply`/`unapply` 方法的类 —— 并在守卫条件下使用这些字段。
下面是一个使用简单 `Person` 案例类的示例：

```scala
case class Person(name: String)

def speak(p: Person) = p match
  case Person(name) if name == "Fred" => println(s"$name says, Yubba dubba doo")
  case Person(name) if name == "Bam Bam" => println(s"$name says, Bam bam!")
  case _ => println("Watch the Flintstones!")

speak(Person("Fred"))      // "Fred says, Yubba dubba doo"
speak(Person("Bam Bam"))   // "Bam Bam says, Bam bam!"
```

### 使用 `match` 表达式作为方法的主体

由于 `match` 表达式返回一个值，因此它们可以用作方法的主体。
此方法采用 `Matchable` 值作为输入参数，并根据 `match` 表达式的结果返回 `Boolean`：

```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" | false => false
  case _              => true
```

输入参数 `a` 被定义为[`Matchable`类型][matchable]---这是可以对其执行模式匹配的所有Scala类型的根。
该方法通过在输入上进行匹配来实现，提供两种情况：
第一个检查给定值是整数`0`，空字符串还是 `false`，在这种情况下返回 `false`。
在默认情况下，我们为任何其他值返回 `true`。
以下示例演示此方法的工作原理：

```scala
isTruthy(0)      // false
isTruthy(false)  // false
isTruthy("")     // false
isTruthy(1)      // true
isTruthy(" ")    // true
isTruthy(2F)     // true
```

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

{% comment %}
TODO: Add in the new Scala 3 syntax shown on this page:
http://dotty.epfl.ch/docs/reference/changed-features/match-syntax.html
{% endcomment %}

## try/catch/finally

与Java一样，Scala也有一个 `try`/`catch`/`finally` 结构，让你可以捕获和管理异常。
为了保持一致性，Scala使用与 `match` 表达式相同的语法，并支持在可能发生的不同可能的异常上进行模式匹配。

在下面的示例中，`openAndReadAFile` 是一个执行其名称含义的方法：它打开一个文件并读取其中的文本，将结果分配给可变变量 `text` ：

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

假设 `openAndReadAFile` 方法使用 Java `java.io.*` 类来读取文件并且不捕获其异常，则尝试打开和读取文件可能会导致  `FileNotFoundException`  和  `IOException` 异常，本例中，这两个异常在 `catch` 块中被捕获。

[matchable]: {{ site.scala3ref }}/other-new-features/matchable.html
