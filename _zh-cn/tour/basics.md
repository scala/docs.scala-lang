---
layout: tour
title: 基础
partof: scala-tour

num: 2
language: zh-cn

next-page: unified-types
previous-page: tour-of-scala
---

这篇文章涵盖了Scala的基础知识。

## 在浏览器上尝试Scala

你可以在浏览器上使用ScalaFiddle运行Scala。

1. 打开[https://scalafiddle.io](https://scalafiddle.io)；
2. 在左侧窗格中粘贴`println("Hello, world!")`；
3. 点击"Run"按钮，输出将展现在右侧窗格中。

这是一种简单的、零设置的方法来实践Scala的代码片段。

这篇文档中的大部分代码示例与 ScalaFiddle 进行了集成，可以通过点击 “Run” 按钮即来直接运行 Scala 代码。

## 表达式

表达式是可计算的语句。
```scala mdoc
1 + 1
```
你可以使用`println`来输出表达式的结果。

{% scalafiddle %}
```scala mdoc
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

### 常量（`Values`）

你可以使用`val`关键字来给表达式的结果命名。

```scala mdoc
val x = 1 + 1
println(x) // 2
```

对于结果比如这里的`x`的命名，被称为常量（`values`）。引用一个常量（`value`）不会再次计算。

常量（`values`）不能重新被赋值。

```scala mdoc:fail
x = 3 // This does not compile.
```

常量（`values`）的类型可以被推断，或者你也可以显示地声明类型，例如：

```scala mdoc:nest
val x: Int = 1 + 1
```

注意下，在标识符`x`的后面、类型声明`Int`的前面，还需要一个冒号`:`。

### 变量

除了可以重新赋值，变量和常量类似。你可以使用`var`关键字来定义一个变量。

```scala mdoc:nest
var x = 1 + 1
x = 3 // This compiles because "x" is declared with the "var" keyword.
println(x * x) // 9
```

和常量一样，你可以显示地声明类型：

```scala mdoc:nest
var x: Int = 1 + 1
```


## 代码块（Blocks）

你可以组合几个表达式，并且用`{}`包围起来。我们称之为代码块（block）。

代码块中最后一个表达式的结果，也正是整个块的结果。

```scala mdoc
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## 函数

函数是带有参数的表达式。

你可以定义一个匿名函数（即没有名字），来返回一个给定整数加一的结果。

```scala mdoc
(x: Int) => x + 1
```

`=>`的左边是参数列表，右边是一个包含参数的表达式。

你也可以给函数命名。

{% scalafiddle %}
```scala mdoc
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

函数可带有多个参数。

{% scalafiddle %}
```scala mdoc
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

或者不带参数。

```scala mdoc
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## 方法

方法的表现和行为和函数非常类似，但是它们之间有一些关键的差别。

方法由`def`关键字定义。`def`后面跟着一个名字、参数列表、返回类型和方法体。

{% scalafiddle %}
```scala mdoc:nest
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

注意返回类型是怎么在函数列表和一个冒号`: Int`之后声明的。

方法可以接受多个参数列表。

{% scalafiddle %}
```scala mdoc
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

或者没有参数列表。

```scala mdoc
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```

还有一些其他的区别，但是现在你可以认为方法就是类似于函数的东西。

方法也可以有多行的表达式。

{% scalafiddle %}
```scala mdoc
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endscalafiddle %}

方法体的最后一个表达式就是方法的返回值。（Scala中也有一个`return`关键字，但是很少使用）

## 类

你可以使用`class`关键字定义一个类，后面跟着它的名字和构造参数。

```scala mdoc
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```
`greet`方法的返回类型是`Unit`，表明没有什么有意义的需要返回。它有点像Java和C语言中的`void`。（不同点在于每个Scala表达式都必须有值，事实上有个`Unit`类型的单例值，写作`()`，它不携带任何信息）

你可以使用`new`关键字创建一个类的实例。

```scala mdoc
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

我们将在[后面](classes.html)深入介绍类。

## 样例类

Scala有一种特殊的类叫做样例类（case class）。默认情况下，样例类一般用于不可变对象，并且可作值比较。你可以使用`case class`关键字来定义样例类。

```scala mdoc
case class Point(x: Int, y: Int)
```

你可以不用`new`关键字来实例化样例类。

```scala mdoc
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

并且它们的值可以进行比较。

```scala mdoc
if (point == anotherPoint) {
  println(point + " and " + anotherPoint + " are the same.")
} else {
  println(point + " and " + anotherPoint + " are different.")
} // Point(1,2) and Point(1,2) are the same.

if (point == yetAnotherPoint) {
  println(point + " and " + yetAnotherPoint + " are the same.")
} else {
  println(point + " and " + yetAnotherPoint + " are different.")
} // Point(1,2) and Point(2,2) are different.
```

关于样例类，还有不少内容我们乐于介绍，并且我们确信你会爱上它们。我们会在[后面](case-classes.html)深入介绍它们。

## 对象

对象是它们自己定义的单实例，你可以把它看作它自己的类的单例。

你可以使用`object`关键字定义对象。

```scala mdoc
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

你可以通过引用它的名字来访问一个对象。

```scala mdoc
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

我们会在[后面](singleton-objects.html)深入介绍它们。

## 特质

特质是包含某些字段和方法的类型。可以组合多个特质。

你可以使用`trait`关键字定义特质。

```scala mdoc:nest
trait Greeter {
  def greet(name: String): Unit
}
```

特质也可以有默认的实现。

{% scalafiddle %}
```scala mdoc:reset
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

你可以使用`extends`关键字来继承特质，使用`override`关键字来覆盖默认的实现。

```scala mdoc
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter {
  override def greet(name: String): Unit = {
    println(prefix + name + postfix)
  }
}

val greeter = new DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = new CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```
{% endscalafiddle %}

这里，`DefaultGreeter`仅仅继承了一个特质，它还可以继承多个特质。

我们会在[后面](traits.html)深入介绍特质。

## 主方法

主方法是一个程序的入口点。JVM要求一个名为`main`的主方法，接受一个字符串数组的参数。

通过使用对象，你可以如下所示来定义一个主方法。

```scala mdoc
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
