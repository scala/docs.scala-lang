---
title: 方法特性
type: section
description: This section introduces Scala 3 methods, including main methods, extension methods, and more.
num: 24
previous-page: methods-intro
next-page: methods-main-methods

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


本节介绍如何在 Scala 3 中定义和调用方法的各个方面。

## 定义方法

Scala 方法有很多特性，包括：

- 泛型（类型）参数
- 参数的默认值
- 多个参数组（柯里化）
- 上下文提供的参数
- 传名参数
- ...

本节演示了其中一些功能，但是当您定义一个不使用这些功能的“简单”方法时，语法如下所示：

```scala
def methodName(param1: Type1, param2: Type2): ReturnType =
  // the method body
  // goes here
end methodName   // this is optional
```

在该语法中：

- 关键字 `def` 用于定义方法
- Scala 标准是使用驼峰式命法来命名方法
- 方法参数总是和它们的类型一起定义
- 声明方法返回类型是可选的
- 方法可以包含多行，也可以只包含一行
- 在方法体之后提供 `end methodName` 部分也是可选的，仅推荐用于长方法

下面是一个名为 `add` 的单行方法的两个示例，它接受两个 `Int` 输入参数。
第一个版本明确显示方法的 `Int` 返回类型，第二个版本没有：

```scala
def add(a: Int, b: Int): Int = a + b
def add(a: Int, b: Int) = a + b
```

建议使用返回类型注释公开可见的方法。
声明返回类型可以让您在几个月或几年后查看它或查看其他人的代码时更容易理解它。

## 调用方法

调用方法很简单：

```scala
val x = add(1, 2)   // 3
```

Scala 集合类有几十个内置方法。
这些示例显示了如何调用它们：

```scala
val x = List(1, 2, 3)

x.size          // 3
x.contains(1)   // true
x.map(_ * 10)   // List(10, 20, 30)
```

注意：

- `size` 不带参数，并返回列表中元素的数量
- `contains` 方法接受一个参数，即要搜索的值
- `map` 接受一个参数，一个函数；在这种情况下，一个匿名函数被传递给它

## 多行方法

当方法超过一行时，从第二行开始方法体，向右缩进：

```scala
def addThenDouble(a: Int, b: Int): Int =
  // imagine that this body requires multiple lines
  val sum = a + b
  sum * 2
```

在那个方法中：

- `sum` 是一个不可变的局部变量；它不能在方法之外访问
- 最后一行将 `sum` 的值加倍；这个值是从方法返回的

当您将该代码粘贴到 REPL 中时，您会看到它按预期工作：

```scala
scala> addThenDouble(1, 1)
res0: Int = 4
```

请注意，方法末尾不需要 `return` 语句。
因为在 Scala 中几乎所有的东西都是一个_表达式_——意味着每一行代码都返回（或_执行_）一个值——不需要使用 `return`。

当您压缩该方法并将其写在一行上时，这一点变得更加清晰：

```scala
def addThenDouble(a: Int, b: Int): Int = (a + b) * 2
```

方法的主体可以使用语言的所有不同特性：

- `if`/`else` 表达式
- `match` 表达式
- `while` 循环
- `for` 循环和 `for` 表达式
- 变量赋值
- 调用其他方法
- 其他方法的定义

作为一个真实世界的多行方法的例子，这个 `getStackTraceAsString` 方法将它的 `Throwable` 输入参数转换成一个格式良好的 `String`：

```scala
def getStackTraceAsString(t: Throwable): String =
  val sw = StringWriter()
  t.printStackTrace(PrintWriter(sw))
  sw.toString
```

在那个方法中：

- 第一行将 `StringWriter` 的新实例分配给值绑定器 `sw`
- 第二行将堆栈跟踪内容存储到 `StringWriter`
- 第三行产生堆栈跟踪的 `String` 表示

## 默认参数值

方法参数可以有默认值。
在此示例中，为 `timeout` 和 `protocol` 参数提供了默认值：

```scala
def makeConnection(timeout: Int = 5_000, protocol: String = "http") =
  println(f"timeout = ${timeout}%d, protocol = ${protocol}%s")
  // more code here ...
```

由于参数具有默认值，因此可以通过以下方式调用该方法：

```scala
makeConnection()                 // timeout = 5000, protocol = http
makeConnection(2_000)            // timeout = 2000, protocol = http
makeConnection(3_000, "https")   // timeout = 3000, protocol = https
```

以下是关于这些示例的一些要点：

- 在第一个示例中，没有提供任何参数，因此该方法使用默认参数值 `5_000` 和 `http`
- 在第二个示例中，为 `timeout` 值提供了 `2_000`，因此它与 `protocol` 的默认值一起使用
- 在第三个示例中，为两个参数提供了值，因此它们都被使用

请注意，通过使用默认参数值，消费者似乎可以使用三种不同的重载方法。

## 命名参数

如果您愿意，也可以在调用方法时使用方法参数的名称。
例如，`makeConnection` 也可以通过以下方式调用：

```scala
makeConnection(timeout=10_000)
makeConnection(protocol="https")
makeConnection(timeout=10_000, protocol="https")
makeConnection(protocol="https", timeout=10_000)
```

在某些框架中，命名参数被大量使用。
当多个方法参数具有相同类型时，它们也非常有用：

```scala
engage(true, true, true, false)
```

如果没有 IDE 的帮助，代码可能难以阅读，但这段代码更加清晰和明显：

```scala
engage(
  speedIsSet = true,
  directionIsSet = true,
  picardSaidMakeItSo = true,
  turnedOffParkingBrake = false
)
```

## 关于不带参数的方法的建议

当一个方法不带参数时，它的 _arity_ 级别为 _arity-0_。
类似地，当一个方法采用一个参数时，它是一个_arity-1_方法。
当您创建 arity-0 方法时：

- 如果方法执行副作用，例如调用`println`，用空括号声明方法
- 如果该方法不执行副作用——例如获取集合的大小，这类似于访问集合上的字段——请去掉括号

例如，这个方法会产生副作用，所以它用空括号声明：

```scala
def speak() = println("hi")
```

这样做需要方法的调用者在调用方法时使用括号：

```scala
speak     // error: "method speak must be called with () argument"
speak()   // prints "hi"
```

虽然这只是一个约定，但遵循它可以显着提高代码的可读性：它可以让您更容易一目了然地理解 arity-0 方法执行副作用。

{% comment %}
Some of that wording comes from this page: https://docs.scala-lang.org/style/method-invocation.html
{% endcomment %}

## 使用 `if` 作为方法体

因为 `if`/`else` 表达式返回一个值，所以它们可以用作方法的主体。
这是一个名为 `isTruthy` 的方法，它实现了 Perl 对 `true` 和 `false` 的定义：

```scala
def isTruthy(a: Any) =
  if a == 0 || a == "" || a == false then
    false
  else
    true
```

这些示例显示了该方法的工作原理：

```scala
isTruthy(0)      // false
isTruthy("")     // false
isTruthy("hi")   // true
isTruthy(1.0)    // true
```

## 使用 `match` 作为方法体

`match` 表达式也可以用作整个方法体，而且经常如此。
这是 `isTruthy` 的另一个版本，用 `match` 表达式编写：

```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" | false => false
  case _ => true
```

此方法的工作方式与之前使用 `if`/`else` 表达式的方法一样。我们使用 `Matchable` 而不是 `Any` 作为参数的类型来接受任何支持模式匹配的值。

有关 `Matchable` trait 的更多详细信息，请参阅 [参考文档][reference_matchable]。

## 控制类中的可见性

在类、对象、trait和枚举中，Scala 方法默认是公共的，所以这里创建的 `Dog` 实例可以访问 `speak` 方法：

```scala
class Dog:
  def speak() = println("Woof")

val d = new Dog
d.speak()   // prints "Woof"
```

方法也可以标记为 `private`。
这使得它们对当前类是私有的，因此它们不能在子类中被调用或重载：

```scala
class Animal:
  private def breathe() = println("I’m breathing")

class Cat extends Animal:
  // this method won’t compile
  override def breathe() = println("Yo, I’m totally breathing")
```

如果你想让一个方法对当前类私有，并且允许子类调用它或覆盖它，将该方法标记为 `protected`，如本例中的 `speak` 方法所示：

```scala
class Animal:
  private def breathe() = println("I’m breathing")
  def walk() =
    breathe()
    println("I’m walking")
  protected def speak() = println("Hello?")

class Cat extends Animal:
  override def speak() = println("Meow")

val cat = new Cat
cat.walk()
cat.speak()
cat.breathe()   // won’t compile because it’s private
```

`protected` 设置意味着：

- 方法（或字段）可以被同一类的其他实例访问
- 对当前包中的其他代码是不可见的
- 它适用于子类

## 对象可以包含方法

之前你看到trait和类可以有方法。
Scala `object` 关键字用于创建单例类，对象也可以包含方法。
这是对一组“实用程序”方法进行分组的好方法。
例如，此对象包含一组处理字符串的方法：

```scala
object StringUtils:

  /**
   * Returns a string that is the same as the input string, but
   * truncated to the specified length.
   */
  def truncate(s: String, length: Int): String = s.take(length)

  /**
    * Returns true if the string contains only letters and numbers.
    */
  def lettersAndNumbersOnly_?(s: String): Boolean =
    s.matches("[a-zA-Z0-9]+")

  /**
   * Returns true if the given string contains any whitespace
   * at all. Assumes that `s` is not null.
   */
  def containsWhitespace(s: String): Boolean =
    s.matches(".*\\s.*")

end StringUtils
```

## 扩展方法

扩展方法在上下文抽象一章的[扩展方法部分][extension]中讨论。
它们的主要目的是让您向封闭类添加新功能。
如该部分所示，假设您有一个 `Circle` 类，但您无法更改其源代码。
例如，它可以在第三方库中这样定义：

```scala
case class Circle(x: Double, y: Double, radius: Double)
```

当你想给这个类添加方法时，你可以将它们定义为扩展方法，像这样：

```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
```

现在，当您有一个名为 `aCircle` 的 `Circle` 实例时，您可以像这样调用这些方法：

```scala
aCircle.circumference
aCircle.diameter
aCircle.area
```

请参阅本书的[扩展方法部分][reference_extension_methods]，以及[“扩展方法”参考页面][reference]了解更多详细信息。

## 更多

还有更多关于方法的知识，包括如何：

- 调用超类的方法
- 定义和使用传名参数
- 编写一个带有函数参数的方法
- 创建内嵌方法
- 处理异常
- 使用可变参数作为输入参数
- 编写具有多个参数组的方法（部分应用的函数）
- 创建具有泛型类型参数的方法

有关这些功能的更多详细信息，请参阅 [参考文档][reference]。

[extension]: {% link _zh-cn/overviews/scala3-book/ca-extension-methods.md %}
[reference_extension_methods]: {{ site.scala3ref }}/contextual/extension-methods.html
[reference]: {{ site.scala3ref }}/overview.html
[reference_matchable]: {{ site.scala3ref }}/other-new-features/matchable.html
