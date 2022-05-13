---
title: 为什么是 Scala 3 ？
type: chapter
description: This page describes the benefits of the Scala 3 programming language.
num: 3
previous-page: scala-features
next-page: taste-intro
---

{% comment %}
TODO: Is “Scala 3 Benefits” a better title?
NOTE: Could mention “grammar” as a way of showing that Scala isn’t a large language; see this slide: https://www.slideshare.net/Odersky/preparing-for-scala-3#13
{% endcomment %}

使用 Scala 有很多好处，特别是 Scala 3。
很难列出 Scala 的每一个好处，但“前十名”列表可能看起来像这样：

1. Scala 融合了函数式编程（FP）和面向对象编程（OOP）
2. Scala 是静态类型的语言，但通常感觉像一种动态类型语言。
3. Scala 的语法简洁，但仍然可读;它通常被称为 _易于表达_
4. Scala 2 中的 _Implicits_ 是一个定义特性，它们在 Scala 3 中得到了改进和简化。
5. Scala 与 Java 无缝集成，因此您可以创建混合了 Scala 和 Java 代码的项目，Scala 代码可以轻松使用成千上万个现有的 Java 库
6. Scala 可以在服务器上使用，通过 [Scala.js](https://www.scala-js.org)， Scala 也可以在浏览器中使用
7. Scala 标准库具有数十种预构建的函数式方法，可节省您的时间，并大大减少编写自定义 `for` 循环和算法的需要
8. Scala 内置了“最佳实践”，它支持不可变性，匿名函数，高阶函数，模式匹配，默认情况下无法扩展的类等
9. Scala 生态系统提供世界上最现代化的 FP 库
10. 强型式系统

## 1) FP/OOP 融合

Scala 比任何其他语言都更支持 FP 和 OOP 范式的融合。
正如 Martin Odersky 所说，Scala 的本质是在类型化环境中融合了函数式和面向对象编程，具有：

- 逻辑函数，以及
- 模块化对象

模块化的一些最佳示例可能是标准库中的类。
例如，`List` 被定义为一个类---从技术上讲，它是一个抽象类---并且像这样创建了一个新实例：

```scala
val x = List(1, 2, 3)
```

但是，在程序员看来是一个简单的 `List` 实际上是由几种特殊类型的组合构建的，包括名为`Iterable`, `Seq`, 和 `LinearSeq` 的 traits。
这些类型同样由其他小型的模块化代码单元组成。

除了从一系列模块化 traits 构建/cases像 `List` 这样的类型之外，`List` API还包含数十种其他方法，其中许多是高阶函数：

```scala
val xs = List(1, 2, 3, 4, 5)

xs.map(_ + 1)         // List(2, 3, 4, 5, 6)
xs.filter(_ < 3)      // List(1, 2)
xs.find(_ > 3)        // Some(4)
xs.takeWhile(_ < 3)   // List(1, 2)
```

在这些示例中，无法修改列表中的值。
`List` 类是不可变的，因此所有这些方法都返回新值，如每个注释中的数据所示。

## 2) 动态的感觉

Scala的 _类型推断_ 经常使语言感觉是动态类型的，即使它是静态类型的。
对于变量声明，情况确实如此：

```scala
val a = 1
val b = "Hello, world"
val c = List(1,2,3,4,5)
val stuff = ("fish", 42, 1_234.5)
```

当把匿名函数传递给高阶函数时，情况也是如此：

```scala
list.filter(_ < 4)
list.map(_ * 2)
list.filter(_ < 4)
    .map(_ * 2)
```

还有定义方法的时候：

```scala
def add(a: Int, b: Int) = a + b
```

这在Scala 3中比以往任何时候都更加真实，例如在使用[union types][union-types] 时：

```scala
// union type parameter
def help(id: Username | Password) =
  val user = id match
    case Username(name) => lookupName(name)
    case Password(hash) => lookupPassword(hash)
  // more code here ...

// union type value
val b: Password | Username = if (true) name else password
```

## 3) 简洁的语法

Scala是一种 low ceremony，“简洁但仍然可读”的语言。例如，变量声明是简洁的：

```scala
val a = 1
val b = "Hello, world"
val c = List(1,2,3)
```

创建类型如traits, 类和枚举都很简洁：

```scala
trait Tail:
  def wagTail(): Unit
  def stopTail(): Unit

enum Topping:
  case Cheese, Pepperoni, Sausage, Mushrooms, Onions

class Dog extends Animal, Tail, Legs, RubberyNose

case class Person(
  firstName: String,
  lastName: String,
  age: Int
)
```

高阶函数简洁：

```scala
list.filter(_ < 4)
list.map(_ * 2)
```

所有这些表达方式以及更多表达方式都很简洁，并且仍然非常易读：我们称之为 _富有表现力_。

## 4) 隐式，简化

Scala 2 中的隐式是一个主要明显的设计特征。
它们代表了抽象上下文的基本方式，具有服务于各种用例的统一范式，其中包括：

- 实现 [type classes]({% link _overviews/scala3-book/ca-type-classes.md %})
- 建立背景
- 依赖注入
- 表达能力

从那以后，其他语言也采用了类似的概念，所有这些都是 _术语推断_ 核心思想的变体：给定一个类型，编译器合成一个具有该类型的“规范”术语。

虽然隐式是 Scala 2 中的一个定义特性，但它们的设计在 Scala 3 中得到了极大的改进：

- 定义“given”值的方法只有一种
- 只有一种方法可以引入隐式参数和参数
- 有一种单独的方式来导入 givens，不允许它们隐藏在正常导入的海洋中
- 只有一种定义隐式转换的方法，它被清楚地标记为这样，并且不需要特殊的语法

这些变化的好处包括：

- 新设计避免了特性交叉，使语言更加一致
- 它使隐式更容易学习和不容易滥用
- 它极大地提高了 95% 使用隐式的 Scala 程序的清晰度
- 它有可能以一种易于理解和友好的原则方式进行术语推断

这些功能在其他部分有详细描述，因此请参阅 [上下文抽象介绍][context] 和 [`given` 和 `using` 子句][given] 部分了解更多详细信息。

## 5) 与 Java 无缝集成

Scala/Java 交互在许多方面都是无缝的。
例如：

- 您可以使用 Scala 项目中可用的所有数千个 Java 库
- Scala `String` 本质上是 Java `String`，添加了附加功能
- Scala 无缝使用 Java 中 *java.time._* 包中的日期/时间类

您还可以在 Scala 中使用 Java 集合类，并为它们提供更多功能，Scala 包含方法，因此您可以将它们转换为 Scala 集合。

虽然几乎所有交互都是无缝的，但[“与 Java 交互”一章][java] 演示了如何更好地结合使用某些功能，包括如何使用：

- Scala 中的 Java 集合
- Scala 中的 Java `Optional`
- Scala 中的 Java 接口
- Java 中的 Scala 集合
- Java 中的 Scala `Option`
- Java 中的 Scala traits
- 在 Java 代码中引发异常的 Scala 方法
- Java 中的 Scala 可变参数

有关这些功能的更多详细信息，请参见该章。

## 6) 客户 &amp;服务器

Scala 可以通过非常棒的框架在服务器端使用：

- [Play Framework](https://www.playframework.com) 可让您构建高度可扩展的服务器端应用程序和微服务
- [Akka Actors](https://akka.io) 让你使用actor模型大大简化分布式和并发软件应用程序

Scala 也可以通过 [Scala.js 项目](https://www.scala-js.org) 在浏览器中使用，它是 JavaScript 的类型安全替代品。
Scala.js 生态系统 [有几十个库](https://www.scala-js.org/libraries) 让您可以在浏览器中使用 React、Angular、jQuery 和许多其他 JavaScript 和 Scala 库。

除了这些工具之外，[Scala Native](https://github.com/scala-native/scala-native) 项目“是一个优化的提前编译器和专为 Scala 设计的轻量级托管运行时”。它允许您使用纯 Scala 代码构建“系统”风格的二进制可执行应用程序，还允许您使用较低级别的原语。

## 7) 标准库方法

您将很少需要再次编写自定义的 `for` 循环，因为 Scala 标准库中的数十种预构建函数方法既可以节省您的时间，又有助于使代码在不同应用程序之间更加一致。

下面的例子展示了一些内置的集合方法，除此之外还有很多。
虽然这些都使用 `List` 类，但相同的方法适用于其他集合类，例如 `Seq`、`Vector`、`LazyList`、`Set`、`Map`、`Array` 和 `ArrayBuffer`。

这里有些例子：

```scala
List.range(1, 3)                          // List(1, 2)
List.range(start = 1, end = 6, step = 2)  // List(1, 3, 5)
List.fill(3)("foo")                       // List(foo, foo, foo)
List.tabulate(3)(n => n * n)              // List(0, 1, 4)
List.tabulate(4)(n => n * n)              // List(0, 1, 4, 9)

val a = List(10, 20, 30, 40, 10)          // List(10, 20, 30, 40, 10)
a.distinct                                // List(10, 20, 30, 40)
a.drop(2)                                 // List(30, 40, 10)
a.dropRight(2)                            // List(10, 20, 30)
a.dropWhile(_ < 25)                       // List(30, 40, 10)
a.filter(_ < 25)                          // List(10, 20, 10)
a.filter(_ > 100)                         // List()
a.find(_ > 20)                            // Some(30)
a.head                                    // 10
a.headOption                              // Some(10)
a.init                                    // List(10, 20, 30, 40)
a.intersect(List(19,20,21))               // List(20)
a.last                                    // 10
a.lastOption                              // Some(10)
a.map(_ * 2)                              // List(20, 40, 60, 80, 20)
a.slice(2, 4)                             // List(30, 40)
a.tail                                    // List(20, 30, 40, 10)
a.take(3)                                 // List(10, 20, 30)
a.takeRight(2)                            // List(40, 10)
a.takeWhile(_ < 30)                       // List(10, 20)
a.filter(_ < 30).map(_ * 10)              // List(100, 200, 100)

val fruits = List("apple", "pear")
fruits.map(_.toUpperCase)                 // List(APPLE, PEAR)
fruits.flatMap(_.toUpperCase)             // List(A, P, P, L, E, P, E, A, R)

val nums = List(10, 5, 8, 1, 7)
nums.sorted                               // List(1, 5, 7, 8, 10)
nums.sortWith(_ < _)                      // List(1, 5, 7, 8, 10)
nums.sortWith(_ > _)                      // List(10, 8, 7, 5, 1)
```

## 8) 内置最佳实践

Scala 习语以多种方式鼓励最佳实践。
对于不可变性，我们鼓励您创建不可变的 `val` 声明：

```scala
val a = 1 // 不可变变量
```

还鼓励您使用不可变集合类，例如 `List` 和 `Map`：

```scala
val b = List(1,2,3)       // List 是不可变的
val c = Map(1 -> "one")   // Map 是不可变的
```

Case 类主要用于 [领域建模]({% link _overviews/scala3-book/domain-modeling-intro.md %})，它们的参数是不可变的：

```scala
case class Person(name: String)
val p = Person("Michael Scott")
p.name           // Michael Scott
p.name = "Joe"  // 编译器错误（重新分配给 val 名称）
```

如上一节所示，Scala 集合类支持高阶函数，您可以将方法（未显示）和匿名函数传递给它们：

```scala
a.dropWhile(_ < 25)
a.filter(_ < 25)
a.takeWhile(_ < 30)
a.filter(_ < 30).map(_ * 10)
nums.sortWith(_ < _)
nums.sortWith(_ > _)
```

`match` 表达式让您可以使用模式匹配，它们确实是返回值的 _表达式_：

```scala
val numAsString = i match
  case 1 | 3 | 5 | 7 | 9 => "odd"
  case 2 | 4 | 6 | 8 | 10 => "even"
  case _ => "too big"
```

因为它们可以返回值，所以它们经常被用作方法的主体：

```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" => false
  case _ => true
```

## 9) 生态系统库

用于函数式编程的 Scala 库，如 [Cats](https://typelevel.org/cats) 和 [Zio](https://zio.dev) 是 FP 社区中的前沿库。
所有流行语，如高性能、类型安全、并发、异步、资源安全、可测试、功能性、模块化、二进制兼容、高效、副作用/有副作用等，都可以用于这些库。

我们可以在这里列出数百个库，但幸运的是它们都列在另一个位置：有关这些详细信息，请参阅 [“Awesome Scala” 列表](https://github.com/lauris/awesome-scala)。

## 10) 强类型系统

Scala 有一个强大的类型系统，它在 Scala 3 中得到了更多的改进。
Scala 3 的目标很早就定义了，与类型系统相关的目标包括：

- 简化
- 消除不一致
- 安全
- 人体工程学
- 性能

_简化_ 来自数十个更改和删除的特性。
例如，从 Scala 2 中重载的 `implicit` 关键字到 Scala 3 中的术语 `given` 和 `using` 的变化使语言更加清晰，尤其是对于初学者来说。

_消除不一致_ 与Scala 3中的几十个[删除的特性][dropped]、[改变的特性][changed]和[增加的特性][add]有关。
此类别中一些最重要的功能是：

- Intersection类型
- 联合类型
- 隐式函数类型
- 依赖函数类型
- trait 参数
- 通用元组

{% comment %}
A list of types from the Dotty documentation:

- Inferred types
- Generics
- Intersection types
- Union types
- Structural types
- Dependent function types
- Type classes
- Opaque types
- Variance
- Algebraic Data Types
- Wildcard arguments in types: ? replacing _
- Type lambdas
- Match types
- Existential types
- Higher-kinded types
- Singleton types
- Refinement types
- Kind polymorphism
- Abstract type members and path-dependent types
- Dependent function types
- Bounds
{% endcomment %}

_安全_ 与几个新的和改变的特性有关：

- Multiversal equality
- Restricting implicit conversions
- Null safety
- Safe initialization

_人体工程学_ 的好例子是枚举和扩展方法，它们以非常易读的方式添加到 Scala 3 中：

```scala
// 枚举
enum Color:
  case Red, Green, Blue

// 扩展方法
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
```

_性能_ 涉及几个方面。
其中之一是 [不透明类型][opaque-types]。
在 Scala 2 中，有几次尝试创建解决方案以与域驱动设计 (DDD) 实践相一致，即赋予值更有意义的类型。
这些尝试包括：

- 类型别名
- 值类
- case类

不幸的是，所有这些方法都有弱点，如 [_Opaque Types_ SIP](https://docs.scala-lang.org/sips/opaque-types.html) 中所述。
相反，如 SIP 中所述，不透明类型的目标是“对这些包装器类型的操作不得在运行时产生任何额外开销，同时在编译时仍提供类型安全使用。”

有关更多类型系统的详细信息，请参阅 [参考文档][reference]。

## 其他很棒的功能

Scala 有许多很棒的特性，选择十大列表可能是主观的。
多项调查表明，不同的开发人员群体喜欢不同的特性。

[java]: {% link _overviews/scala3-book/interacting-with-java.md %}
[given]: {% link _overviews/scala3-book/ca-given-using-clauses.md %}
[contextual]: {% link _overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[reference]: {{ site.scala3ref }}
[dropped]: {{ site.scala3ref }}/dropped-features
[changed]: {{ site.scala3ref }}/changed-features
[added]:{{ site.scala3ref }}/other-new-features

[union-types]: {% link _overviews/scala3-book/types-union.md %}
[opaque-types]: {% link _overviews/scala3-book/types-opaque-types.md %}
