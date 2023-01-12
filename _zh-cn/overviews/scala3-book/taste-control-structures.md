---
title: 控制结构
type: section
description: This section demonstrates Scala 3 control structures.
language: zh-cn
num: 8
previous-page: taste-vars-data-types
next-page: taste-modeling

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


Scala 具有您在其他编程语言中可以找到的控制结构，并且还具有强大的 `for` 表达式和 `match` 表达式：

- `if`/`else`
- `for` 循环和表达式
- `match` 表达式
- `while` 循环
- `try`/`catch`

这些结构在以下示例中进行了说明。

## `if`/`else`

Scala 的 `if`/`else` 控制结构看起来与其他语言相似：

{% tabs if-else class=tabs-scala-version %}
{% tab 'Scala 2' for=if-else %}

```scala
if (x < 0) {
  println("negative")
} else if (x == 0) {
  println("zero")
} else {
  println("positive")
}
```

{% endtab %}

{% tab 'Scala 3' for=if-else %}

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

请注意，这确实是一个 _表达式_ ---不是一个 _语句_。
这意味着它返回一个值，因此您可以将结果赋值给一个变量：

{% tabs if-else-expression class=tabs-scala-version %}
{% tab 'Scala 2' for=if-else-expression %}

```scala
val x = if (a < b) { a } else { b }
```

{% endtab %}

{% tab 'Scala 3' for=if-else-expression %}

```scala
val x = if a < b then a else b
```

{% endtab %}
{% endtabs %}

正如您将在本书中看到的那样，_所有_ Scala 控制结构都可以用作表达式。

> 表达式返回结果，而语句不返回。
> 语句通常用于它们的副作用，例如使用 `println` 打印到控制台。

## `for` 循环和表达式

`for` 关键字用于创建 `for` 循环。
这个例子展示了如何打印 `List` 中的每个元素：

{% tabs for-loop class=tabs-scala-version %}
{% tab 'Scala 2' for=for-loop %}

```scala
val ints = List(1, 2, 3, 4, 5)

for (i <- ints) println(i)
```

> 代码 `i <- ints` 被称为_生成器_，在括号内的生成器后面是_循环体_。

{% endtab %}

{% tab 'Scala 3' for=for-loop %}


```scala
val ints = List(1, 2, 3, 4, 5)

for i <- ints do println(i)
```

> 代码 `i <- ints` 被称为 _生成器_，紧随 `do` 关键字的代码是 _循环体_。

{% endtab %}
{% endtabs %}

### 守卫

您还可以在 `for` 循环中使用一个或多个 `if` 表达式。
这些被称为 _守卫_。
此示例打印 `ints` 中大于 `2` 的所有数字：

{% tabs for-guards class=tabs-scala-version %}
{% tab 'Scala 2' for=for-guards %}

```scala
for (i <- ints if i > 2)
  println(i)
```

{% endtab %}

{% tab 'Scala 3' for=for-guards %}

```scala
for
  i <- ints
  if i > 2
do
  println(i)
```

{% endtab %}
{% endtabs %}

您可以使用多个生成器和守卫。
此循环遍历数字 `1` 到 `3`，并且对于每个数字，它还遍历字符 `a` 到 `c`。
然而，它也有两个守卫，所以唯一一次调用 print 语句是当 `i` 的值为 `2` 并且 `j` 是字符 `b` 时：

{% tabs for-guards-multi class=tabs-scala-version %}
{% tab 'Scala 2' for=for-guards-multi %}

```scala
for {
  i <- 1 to 3
  j <- 'a' to 'c'
  if i == 2
  if j == 'b'
} {
  println(s"i = $i, j = $j")   // prints: "i = 2, j = b"
}
```

{% endtab %}

{% tab 'Scala 3' for=for-guards-multi %}

```scala
for
  i <- 1 to 3
  j <- 'a' to 'c'
  if i == 2
  if j == 'b'
do
  println(s"i = $i, j = $j")   // prints: "i = 2, j = b"
```

{% endtab %}
{% endtabs %}

### `for` 表达式

`for` 关键字更强大：当您使用 `yield` 关键字代替 `do` 时，您会创建 `for` _表达式_用于计算和产生结果。

几个例子演示了这一点。
使用与上一个示例相同的 `ints` 列表，此代码创建一个新列表，其中新列表中每个元素的值是原始列表中元素值的两倍：

{% tabs for-expression_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expression_1 %}

````
scala> val doubles = for (i <- ints) yield i * 2
val doubles: List[Int] = List(2, 4, 6, 8, 10)
````

{% endtab %}

{% tab 'Scala 3' for=for-expression_1 %}

````
scala> val doubles = for i <- ints yield i * 2
val doubles: List[Int] = List(2, 4, 6, 8, 10)
````

{% endtab %}
{% endtabs %}

Scala 的控制结构语法很灵活，`for` 表达式可以用其他几种方式编写，具体取决于您的偏好：

{% tabs for-expressioni_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expressioni_2 %}

```scala
val doubles = for (i <- ints) yield i * 2
val doubles = for (i <- ints) yield (i * 2)
val doubles = for { i <- ints } yield (i * 2)
```

{% endtab %}

{% tab 'Scala 3' for=for-expressioni_2 %}

```scala
val doubles = for i <- ints yield i * 2     // 如上所示的风格
val doubles = for (i <- ints) yield i * 2
val doubles = for (i <- ints) yield (i * 2)
val doubles = for { i <- ints } yield (i * 2)
```

{% endtab %}
{% endtabs %}

此示例显示如何将列表中每个字符串的第一个字符大写：

{% tabs for-expressioni_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expressioni_3 %}

```scala
val names = List("chris", "ed", "maurice")
val capNames = for (name <- names) yield name.capitalize
```

{% endtab %}

{% tab 'Scala 3' for=for-expressioni_3 %}

```scala
val names = List("chris", "ed", "maurice")
val capNames = for name <- names yield name.capitalize
```

{% endtab %}
{% endtabs %}

最后，这个 `for` 表达式遍历一个字符串列表，并返回每个字符串的长度，但前提是该长度大于 `4`：

{% tabs for-expressioni_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expressioni_4 %}

```scala
val fruits = List("apple", "banana", "lime", "orange")

val fruitLengths =
  for (f <- fruits if f.length > 4) yield f.length

// fruitLengths: List[Int] = List(5, 6, 6)
```

{% endtab %}

{% tab 'Scala 3' for=for-expressioni_4 %}

```scala
val fruits = List("apple", "banana", "lime", "orange")

val fruitLengths = for
  f <- fruits
  if f.length > 4
yield
  // 在这里你可以
  // 使用多行代码
  f.length

//fruitLengths: List[Int] = List(5, 6, 6)
```

{% endtab %}
{% endtabs %}

`for` 循环和表达式更多细节在本书的 [控制结构部分][control] 中，和 [参考文档]({{ site.scala3ref }}/other-new-features/control-syntax.html) 中。

## `match` 表达式

Scala 有一个 `match` 表达式，它最基本的用途类似于 Java `switch` 语句：

{% tabs match class=tabs-scala-version %}
{% tab 'Scala 2' for=match %}

```scala
val i = 1

// later in the code ...
i match {
  case 1 => println("one")
  case 2 => println("two")
  case _ => println("other")
}
```

{% endtab %}

{% tab 'Scala 3' for=match %}

```scala
val i = 1

// later in the code ...
i match
  case 1 => println("one")
  case 2 => println("two")
  case _ => println("other")
```

{% endtab %}
{% endtabs %}

但是，`match` 确实是一个表达式，这意味着它会根据模式匹配返回一个结果，您可以将其绑定到一个变量：

{% tabs match-expression_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=match-expression_1 %}

```scala
val result = i match {
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
}
```

{% endtab %}

{% tab 'Scala 3' for=match-expression_1 %}


```scala
val result = i match
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
```

{% endtab %}
{% endtabs %}

`match` 不仅限于使用整数值，它可以用于任何数据类型：

{% tabs match-expression_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=match-expression_2 %}

```scala
val p = Person("Fred")

// later in the code
p match {
  case Person(name) if name == "Fred" =>
    println(s"$name says, Yubba dubba doo")

  case Person(name) if name == "Bam Bam" =>
    println(s"$name says, Bam bam!")

  case _ => println("Watch the Flintstones!")
}
```

{% endtab %}

{% tab 'Scala 3' for=match-expression_2 %}

```scala
val p = Person("Fred")

// later in the code
p match
  case Person(name) if name == "Fred" =>
    println(s"$name says, Yubba dubba doo")

  case Person(name) if name == "Bam Bam" =>
    println(s"$name says, Bam bam!")

  case _ => println("Watch the Flintstones!")
```

{% endtab %}
{% endtabs %}

事实上，`match` 表达式可以用许多模式的不同类型来测试变量。
此示例显示 (a) 如何使用 `match` 表达式作为方法的主体，以及 (b) 如何匹配显示的所有不同类型：

{% tabs match-expression_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=match-expression_3 %}

```scala
// getClassAsString is a method that takes a single argument of any type.
def getClassAsString(x: Any): String = x match {
  case s: String => s"'$s' is a String"
  case i: Int => "Int"
  case d: Double => "Double"
  case l: List[_] => "List"
  case _ => "Unknown"
}

// examples
getClassAsString(1)               // Int
getClassAsString("hello")         // 'hello' is a String
getClassAsString(List(1, 2, 3))   // List
```

因为 `getClassAsString` 方法获取 `Any` 类型的参数值，所以它可以解耦任意模式类型。

{% endtab %}

{% tab 'Scala 3' for=match-expression_3 %}

```scala
// getClassAsString 是一个接受任何类型的单个参数的方法。
def getClassAsString(x: Matchable): String = x match
  case s: String => s"'$s' is a String"
  case i: Int => "Int"
  case d: Double => "Double"
  case l: List[_] => "List"
  case _ => "Unknown"

// examples
getClassAsString(1)               // Int
getClassAsString("hello")         // 'hello' is a String
getClassAsString(List(1, 2, 3))   // List
```

`getClassAsString` 方法将 [Matchable]({{ site.scala3ref }}/other-new-features/matchable.html) 类型的值作为参数，它可以是
任何支持模式匹配的类型（某些类型不支持模式匹配，因为这可能打破封装）。

{% endtab %}
{% endtabs %}

Scala 中的模式匹配还有 _更多_ 内容。
模式可以嵌套，模式的结果可以绑定，模式匹配甚至可以是用户自定义的。
有关详细信息，请参阅 [控制结构章节][control] 中的模式匹配示例。

## `try`/`catch`/`finally`

Scala 的 `try`/`catch`/`finally` 控制结构让你捕获异常。
它类似于 Java，但其语法与 `match` 表达式一致：

{% tabs try class=tabs-scala-version %}
{% tab 'Scala 2' for=try %}

```scala
try {
  writeTextToFile(text)
} catch {
  case ioe: IOException => println("Got an IOException.")
  case nfe: NumberFormatException => println("Got a NumberFormatException.")
} finally {
  println("Clean up your resources here.")
}
```

{% endtab %}

{% tab 'Scala 3' for=try %}

```scala
try
  writeTextToFile(text)
catch
  case ioe: IOException => println("Got an IOException.")
  case nfe: NumberFormatException => println("Got a NumberFormatException.")
finally
  println("Clean up your resources here.")
```

{% endtab %}
{% endtabs %}

## `while` 循环

Scala 还有一个 `while` 循环结构。
它的单行语法如下所示：

{% tabs while_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=while_1 %}

```scala
while (x >= 0) { x = f(x) }
```

{% endtab %}

{% tab 'Scala 3' for=while_1 %}

```scala
while x >= 0 do x = f(x)
```
为了兼容性，Scala 3 仍然支持 Scala 2 语法。

{% endtab %}
{% endtabs %}

`while` 循环多行语法如下所示：

{% tabs while_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=while_2 %}

```scala
var x = 1

while (x < 3) {
  println(x)
  x += 1
}
```

{% endtab %}

{% tab 'Scala 3' for=while_2 %}

```scala
var x = 1

while
  x < 3
do
  println(x)
  x += 1
```

{% endtab %}
{% endtabs %}

## 自定义控制结构

由于传名参数、中缀表示法、流畅接口、可选括号、扩展方法和高阶函数等功能，您还可以创建自己的代码，就像控制结构一样工作。
您将在 [控制结构][control] 部分了解更多信息。

[control]: {% link _zh-cn/overviews/scala3-book/control-structures.md %}
