---
title: 领域建模
type: section
description: This section provides an introduction to data modeling in Scala 3.
language: zh-cn
num: 9
previous-page: taste-control-structures
next-page: taste-methods

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


{% comment %}
NOTE: I kept the OOP section first, assuming that most readers will be coming from an OOP background.
{% endcomment %}

Scala 同时支持函数式编程 (FP) 和面向对象编程 (OOP)，以及这两种范式的融合。
本节简要概述了 OOP 和 FP 中的数据建模。

## OOP 领域建模

以 OOP 风格编写代码时，用于数据封装的两个主要工具是 _traits_ 和 _classes_。

{% comment %}
NOTE: Julien had a comment, “in OOP we don’t really model data.
It’s more about modeling operations, imho.”

How to resolve? Is there a good DDD term to use here?
{% endcomment %}

### traits

Scala trait 可以用作简单的接口，但它们也可以包含抽象和具体的方法和字段，并且它们可以有参数，就像类一样。
它们为您提供了一种将行为组织成小型模块化单元的好方法。
稍后，当您想要创建属性和行为的具体实现时，类和对象可以扩展特征，根据需要混合尽可能多的特征以实现所需的行为。

作为如何将 traits 用作接口的示例，以下是三个 traits，它们为狗和猫等动物定义了结构良好并且模块化的行为：

```scala
trait Speaker:
  def speak(): String  // 没有函数体，这样它是抽象的。

trait TailWagger:
  def startTail(): Unit = println("tail is wagging")
  def stopTail(): Unit = println("tail is stopped")

trait Runner:
  def startRunning(): Unit = println("I’m running")
  def stopRunning(): Unit = println("Stopped running")
```

鉴于这些特征，这里有一个 `Dog` 类，它扩展了所有这些特征，同时为抽象 `speak` 方法提供了一种行为：

```scala
class Dog(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Woof!"
```

请注意该类如何使用 `extends` 关键字扩展 traits。

类似地，这里有一个 `Cat` 类，它实现了这些相同的 traits，同时还覆盖了它继承的两个具体方法：

```scala
class Cat(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Meow"
  override def startRunning(): Unit = println("Yeah ... I don’t run")
  override def stopRunning(): Unit = println("No need to stop")
```

这些示例显示了如何使用这些类：

```scala
val d = Dog("Rover")
println(d.speak())      // prints "Woof!"

val c = Cat("Morris")
println(c.speak())      // "Meow"
c.startRunning()        // "Yeah ... I don’t run"
c.stopRunning()         // "No need to stop"
```

如果该代码有意义---太好了，您把 traits 作为接口感到舒服。
如果没有，请不要担心，它们在 [Domain Modeling][data-1] 章节中有更详细的解释。

### 类

Scala _classes_ 用于 OOP 风格的编程。
这是一个模拟“人”的类的示例。在 OOP 中，字段通常是可变的，所以 `firstName` 和 `lastName` 都被声明为 `var` 参数：

```scala
class Person(var firstName: String, var lastName: String):
  def printFullName() = println(s"$firstName $lastName")

val p = Person("John", "Stephens")
println(p.firstName)   // "John"
p.lastName = "Legend"
p.printFullName()      // "John Legend"
```

请注意，类声明创建了一个构造函数：

```斯卡拉
// 此代码使用该构造函数
val p = Person("约翰", "斯蒂芬斯")
```

[Domain Modeling][data-1] 章节中介绍了构造函数和其他与类相关的主题。

## FP 领域建模

{% comment %}
NOTE: Julien had a note about expecting to see sealed traits here.
I didn’t include that because I didn’t know if enums are intended
to replace the Scala2 “sealed trait + case class” pattern. How to resolve?
{% endcomment %}

以 FP 风格编写代码时，您将使用以下结构：

- 枚举来定义 ADT
- 样例类
- Traits

### 枚举

`enum` 构造是在 Scala 3 中对代数数据类型 (ADT) 进行建模的好方法。
例如，披萨具有三个主要属性：

- 面饼大小
- 面饼类型
- 馅料

这些是用枚举简洁地建模的：

```scala
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

一旦你有了一个枚举，你就可以按照你通常使用特征、类或对象的所有方式来使用枚举：

```scala
import CrustSize.*
val currentCrustSize = Small

// enums in a `match` expression
currentCrustSize match
  case Small => println("Small crust size")
  case Medium => println("Medium crust size")
  case Large => println("Large crust size")

// enums in an `if` statement
if currentCrustSize == Small then println("Small crust size")
```

下面是另一个如何在 Scala 中创建和使用 ADT 的示例：

```scala
enum Nat:
  case Zero
  case Succ(pred: Nat)
```

枚举在本书的 [领域建模][data-1] 部分和 [参考文档]({{ site.scala3ref }}/enums/enums.html) 中有详细介绍。

### 样例类

Scala `case` 类允许您使用不可变数据结构对概念进行建模。
`case` 类具有 `class` 的所有功能，还包含其他功能，使它们对函数式编程很有用。
当编译器在 `class` 前面看到 `case` 关键字时，它具有以下效果和好处：

- 样例类构造函数参数默认为 public `val` 字段，因此字段是不可变的，并且为每个参数生成访问器方法。
- 生成一个 `unapply` 方法，它允许您在 `match` 表达式中以更多方式使用 样例类。
- 在类中生成一个 `copy` 方法。
  这提供了一种在不更改原始对象的情况下创建对象的更新副本的方法。
- 生成 `equals` 和 `hashCode` 方法来实现结构相等等式。
- 生成一个默认的 `toString` 方法，有助于调试。

{% comment %}
NOTE: Julien had a comment about how he decides when to use case classes vs classes. Add something here?
{% endcomment %}

您_可以_自己手动将所有这些方法添加到一个类中，但是由于这些功能在函数式编程中非常常用，因此使用“case”类要方便得多。

这段代码演示了几个 `case` 类的特性：

```scala
// define a case class
case class Person(
  name: String,
  vocation: String
)

// create an instance of the case class
val p = Person("Reginald Kenneth Dwight", "Singer")

// a good default toString method
p                // : Person = Person(Reginald Kenneth Dwight,Singer)

// can access its fields, which are immutable
p.name           // "Reginald Kenneth Dwight"
p.name = "Joe"   // error: can’t reassign a val field

// when you need to make a change, use the `copy` method
// to “update as you copy”
val p2 = p.copy(name = "Elton John")
p2               // : Person = Person(Elton John,Singer)
```

有关 `case` 类的更多详细信息，请参阅 [领域建模][data-1] 部分。

[data-1]: {% link _zh-cn/overviews/scala3-book/domain-modeling-tools.md %}
