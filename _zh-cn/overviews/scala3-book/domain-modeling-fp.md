---
title: 函数式领域建模
type: section
description: This chapter provides an introduction to FP domain modeling with Scala 3.
language: zh-cn
num: 22
previous-page: domain-modeling-oop
next-page: methods-intro

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


本章介绍了在 Scala 3 中使用函数式编程 (FP) 进行领域建模。
当使用 FP 对我们周围的世界进行建模时，您通常会使用以下 Scala 构造：

- 枚举
- 样例类
- Traits

> 如果您不熟悉代数数据类型 (ADT) 及其泛型版本 (GADT)，您可能需要先阅读 [代数数据类型][adts] 部分，然后再阅读本节。

## 介绍

在 FP 中，*数据*和*对该数据的操作*是两个独立的东西；您不必像使用 OOP 那样将它们封装在一起。

这个概念类似于数值代数。
当您考虑值大于或等于零的整数时，您有一*组*可能的值，如下所示：

````
0, 1, 2 ... Int.MaxValue
````

忽略整数的除法，对这些值可能的*操作*是：

````
+, -, *
````

FP设计以类似的方式实现：

- 你描述你的值的集合（你的数据）
- 您描述了对这些值起作用的操作（您的函数）

> 正如我们将看到的，这种风格的程序推理与面向对象的编程完全不同。
> FP 中的数据只**是**：
> 将功能与数据分离，让您无需担心行为即可检查数据。

在本章中，我们将为披萨店中的“披萨”建模数据和操作。
您将看到如何实现 Scala/FP 模型的“数据”部分，然后您将看到几种不同的方式来组织对该数据的操作。

## 数据建模

在 Scala 中，描述编程问题的数据模型很简单：

- 如果您想使用不同的替代方案对数据进行建模，请使用 `enum` 结构，（或者在 Scala 2 中用 `case object`）。 
- 如果您只想对事物进行分组（或需要更细粒度的控制），请使用 样例类

### 描述替代方案

简单地由不同的选择组成的数据，如面饼大小、面饼类型和馅料，在 Scala 中使用枚举进行简洁的建模：

{% tabs data_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_1 %}

在 Scala 2 中，一个 `sealed class` 和若干个继承自该类的 `case object` 组合在一起来表示枚举：

```scala
sealed abstract class CrustSize
object CrustSize {
  case object Small extends CrustSize
  case object Medium extends CrustSize
  case object Large extends CrustSize
}

sealed abstract class CrustType
object CrustType {
  case object Thin extends CrustType
  case object Thick extends CrustType
  case object Regular extends CrustType
}

sealed abstract class Topping
object Topping {
  case object Cheese extends Topping
  case object Pepperoni extends Topping
  case object BlackOlives extends Topping
  case object GreenOlives extends Topping
  case object Onions extends Topping
}
```

{% endtab %}
{% tab 'Scala 3' for=data_1 %}

在 Scala 3 中，用 `enum` 结构简洁地表示：

```scala
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

{% endtab %}
{% endtabs %}

> 描述不同选择的数据类型（如 `CrustSize`）有时也称为_归纳类型_。

### 描述复合数据

可以将披萨饼视为上述不同属性的_组件_容器。
我们可以使用 样例类来描述 `Pizza` 由 `crustSize`、`crustType` 和可能的多个 `Topping` 组成：

{% tabs data_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_2 %}

```scala
import CrustSize._
import CrustType._
import Topping._

case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)
```

{% endtab %}
{% tab 'Scala 3' for=data_2 %}

```scala
import CrustSize.*
import CrustType.*
import Topping.*

case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)
```

{% endtab %}
{% endtabs %}

> 聚合多个组件的数据类型（如`Pizza`）有时也称为_乘积类型_。

就是这样。
这就是 FP 式披萨系统的数据模型。
该解决方案非常简洁，因为它不需要将披萨饼上的操作与数据模型相结合。
数据模型易于阅读，就像声明关系数据库的设计一样。
创建数据模型的值并检查它们也很容易：

{% tabs data_3 %}
{% tab 'Scala 2 and 3' for=data_3 %}

```scala
val myFavPizza = Pizza(Small, Regular, Seq(Cheese, Pepperoni))
println(myFavPizza.crustType) // prints Regular
```

{% endtab %}
{% endtabs %}

#### 更多数据模型

我们可能会以同样的方式对整个披萨订购系统进行建模。
下面是一些用于对此类系统建模的其他 样例类：

{% tabs data_4 %}
{% tab 'Scala 2 and 3' for=data_4 %}

```scala
case class Address(
  street1: String,
  street2: Option[String],
  city: String,
  state: String,
  zipCode: String
)

case class Customer(
  name: String,
  phone: String,
  address: Address
)

case class Order(
  pizzas: Seq[Pizza],
  customer: Customer
)
```

{% endtab %}
{% endtabs %}

#### “瘦领域对象（贫血模型）”

Debasish Ghosh 在他的《*函数式和反应式领域建模*》一书中指出，OOP 从业者将他们的类描述为封装数据和行为的“富领域模型（充血模型）”，而 FP 数据模型可以被认为是“瘦领域对象”。
这是因为——正如本课所示——数据模型被定义为具有属性但没有行为的样例类，从而产生了简短而简洁的数据结构。

## 操作建模

这就引出了一个有趣的问题：因为 FP 将数据与对该数据的操作分开，那么如何在 Scala 中实现这些操作？

答案实际上很简单：您只需编写对我们刚刚建模的数据值进行操作的函数（或方法）。
例如，我们可以定义一个计算披萨价格的函数。

{% tabs data_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_5 %}

```scala
def pizzaPrice(p: Pizza): Double = p match {
  case Pizza(crustSize, crustType, toppings) => {
    val base  = 6.00
    val crust = crustPrice(crustSize, crustType)
    val tops  = toppings.map(toppingPrice).sum
    base + crust + tops
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=data_5 %}

```scala
def pizzaPrice(p: Pizza): Double = p match
  case Pizza(crustSize, crustType, toppings) =>
    val base  = 6.00
    val crust = crustPrice(crustSize, crustType)
    val tops  = toppings.map(toppingPrice).sum
    base + crust + tops
```

{% endtab %}
{% endtabs %}

您注意到函数的实现如何简单地遵循数据的样式：由于 `Pizza` 是一个样例类，我们使用模式匹配来提取组件并调用辅助函数来计算各个部分单独的价格。

{% tabs data_6 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_6 %}

```scala
def toppingPrice(t: Topping): Double = t match {
  case Cheese | Onions => 0.5
  case Pepperoni | BlackOlives | GreenOlives => 0.75
}
```

{% endtab %}
{% tab 'Scala 3' for=data_6 %}

```scala
def toppingPrice(t: Topping): Double = t match
  case Cheese | Onions => 0.5
  case Pepperoni | BlackOlives | GreenOlives => 0.75
```

{% endtab %}
{% endtabs %}

同样，由于 `Topping` 是一个枚举，我们使用模式匹配来区分不同的变量。
奶酪和洋葱的价格为 50ct，其余的价格为 75ct。

{% tabs data_7 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_7 %}

```scala
def crustPrice(s: CrustSize, t: CrustType): Double =
  (s, t) match {
    // if the crust size is small or medium,
    // the type is not important
    case (Small | Medium, _) => 0.25
    case (Large, Thin) => 0.50
    case (Large, Regular) => 0.75
    case (Large, Thick) => 1.00
  }
```

{% endtab %}
{% tab 'Scala 3' for=data_7 %}

```scala
def crustPrice(s: CrustSize, t: CrustType): Double =
  (s, t) match
    // if the crust size is small or medium,
    // the type is not important
    case (Small | Medium, _) => 0.25
    case (Large, Thin) => 0.50
    case (Large, Regular) => 0.75
    case (Large, Thick) => 1.00
```

{% endtab %}
{% endtabs %}

为了计算面饼的价格，我们同时对面饼的大小和类型进行模式匹配。

> 关于上面显示的所有函数的重要一点是它们是*纯函数*：它们不会改变任何数据或有其他副作用（如抛出异常或写入文件）。
> 他们所做的只是简单地接收值并计算结果。

{% comment %}
I’ve added this comment per [this Github comment](https://github.com/scalacenter/docs.scala-lang/pull/3#discussion_r543372428).
To that point, I’ve added these definitions here from our Slack conversation, in case anyone wants to update the “pure function” definition. If not, please delete this comment.

Sébastien:
----------
A function `f` is pure if, given the same input `x`, it will always return the same output `f(x)`, and it never modifies any state outside of it (therefore potentially causing other functions to behave differently in the future).

Jonathan:
---------
We say a function is 'pure' if it does not depend on or modify the context it is called in.

Wikipedia
---------
The function always evaluates to the same result value given the same argument value(s). It cannot depend on any hidden state or value, and it cannot depend on any I/O.
Evaluation of the result does not cause any semantically observable side effect or output, such as mutation of mutable objects or output to I/O devices.

Mine (Alvin, now modified, from fp-pure-functions.md):
------------------------------------------------------
- A function `f` is pure if, given the same input `x`, it always returns the same output `f(x)`
- The function’s output depends *only* on its input variables and its internal algorithm
- It doesn’t modify its input parameters
- It doesn’t mutate any hidden state
- It doesn’t have any “back doors”: It doesn’t read data from the outside world (including the console, web services, databases, files, etc.), or write data to the outside world
{% endcomment %}

## 如何组织功能

在实现上面的 `pizzaPrice` 函数时，我们没有说我们将在*哪里*定义它。
在 Scala 3 中，在文件的顶层定义它是完全有效的。
但是，该语言为我们提供了许多很棒的工具在不同命名空间和模块中组织我们的逻辑。

有几种不同的方式来实现和组织行为：

- 在伴生对象中定义您的函数
- 使用模块化编程风格
- 使用“函数式对象”方法
- 在扩展方法中定义功能

在本节的其余部分将展示这些不同的解决方案。

### 伴生对象

第一种方法是在伴生对象中定义行为——函数。

> 正如在领域建模 [工具部分][modeling-tools] 中所讨论的，_伴生对象_ 是一个与类同名的 `object` ，并在与类相同的文件中声明。

使用这种方法，除了枚举或样例类之外，您还定义了一个包含该行为的同名伴生对象。

{% tabs org_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=org_1 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

// the companion object of case class Pizza
object Pizza {
  // the implementation of `pizzaPrice` from above
  def price(p: Pizza): Double = ...
}

sealed abstract class Topping

// the companion object of enumeration Topping
object Topping {
  case object Cheese extends Topping
  case object Pepperoni extends Topping
  case object BlackOlives extends Topping
  case object GreenOlives extends Topping
  case object Onions extends Topping

  // the implementation of `toppingPrice` above
  def price(t: Topping): Double = ...
}
```

{% endtab %}
{% tab 'Scala 3' for=org_1 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

// the companion object of case class Pizza
object Pizza:
  // the implementation of `pizzaPrice` from above
  def price(p: Pizza): Double = ...

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions

// the companion object of enumeration Topping
object Topping:
  // the implementation of `toppingPrice` above
  def price(t: Topping): Double = t match
    case Cheese | Onions => 0.5
    case Pepperoni | BlackOlives | GreenOlives => 0.75
```

{% endtab %}
{% endtabs %}

使用这种方法，您可以创建一个 `Pizza` 并计算其价格，如下所示：

{% tabs org_2 %}
{% tab 'Scala 2 and 3' for=org_2 %}

```scala
val pizza1 = Pizza(Small, Thin, Seq(Cheese, Onions))
Pizza.price(pizza1)
```

{% endtab %}
{% endtabs %}

以这种方式对功能进行分组有几个优点：

- 它将功能与数据相关联，让程序员（和编译器）更容易找到它。
- 它创建了一个命名空间，例如让我们使用 `price` 作为方法名称，而不必依赖重载。
- `Topping.price` 的实现可以访问枚举值，例如 `Cheese` ，而无需导入它们。

但是，还应权衡：

- 它将功能与您的数据模型紧密结合。
  特别是，伴生对象需要在与您的样例类相同的文件中定义。
- 可能不清楚在哪里定义像 `crustPrice` 这样同样可以放置在 `CrustSize` 或 `CrustType` 的伴生对象中的函数。

## 模块

组织行为的第二种方法是使用“模块化”方法。
这本书，*Programming in Scala*，将 *模块* 定义为“具有良好定义的接口和隐藏实现的‘较小的程序片段’”。
让我们看看这意味着什么。

### 创建一个 `PizzaService` 接口

首先要考虑的是 `Pizza` 的“行为”。
执行此操作时，您可以像这样草拟一个 `PizzaServiceInterface` trait：

{% tabs module_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_1 %}

```scala
trait PizzaServiceInterface {

  def price(p: Pizza): Double

  def addTopping(p: Pizza, t: Topping): Pizza
  def removeAllToppings(p: Pizza): Pizza

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza
  def updateCrustType(p: Pizza, ct: CrustType): Pizza
}
```

{% endtab %}
{% tab 'Scala 3' for=module_1 %}

```scala
trait PizzaServiceInterface:

  def price(p: Pizza): Double

  def addTopping(p: Pizza, t: Topping): Pizza
  def removeAllToppings(p: Pizza): Pizza

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza
  def updateCrustType(p: Pizza, ct: CrustType): Pizza
```

{% endtab %}
{% endtabs %}

如图所示，每个方法都将 `Pizza` 作为输入参数——连同其他参数——然后返回一个 `Pizza` 实例作为结果

当你写一个像这样的纯接口时，你可以把它想象成一个约定，“所有扩展这个特性的非抽象类*必须*提供这些服务的实现。”

此时您还可以做的是想象您是此 API 的使用者。
当你这样做时，它有助于草拟一些示例“消费者”代码，以确保 API 看起来像你想要的：

{% tabs module_2 %}
{% tab 'Scala 2 and 3' for=module_2 %}

```scala
val p = Pizza(Small, Thin, Seq(Cheese))

// how you want to use the methods in PizzaServiceInterface
val p1 = addTopping(p, Pepperoni)
val p2 = addTopping(p1, Onions)
val p3 = updateCrustType(p2, Thick)
val p4 = updateCrustSize(p3, Large)
```

{% endtab %}
{% endtabs %}

如果该代码看起来没问题，您通常会开始草拟另一个 API ——例如用于订单的 API ——但由于我们现在只关注披萨饼，我们将停止考虑接口，然后创建这个接口的具体实现。

> 请注意，这通常是一个两步过程。
> 在第一步中，您将 API 的合同草拟为*接口*。
> 在第二步中，您创建该接口的具体*实现*。
> 在某些情况下，您最终会创建基本接口的多个具体实现。

### 创建一个具体的实现

现在您知道了 `PizzaServiceInterface` 的样子，您可以通过为接口中定义的所有方法体来创建它的具体实现：

{% tabs module_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_3 %}

```scala
object PizzaService extends PizzaServiceInterface {

  def price(p: Pizza): Double =
    ... // implementation from above

  def addTopping(p: Pizza, t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings(p: Pizza): Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(p: Pizza, ct: CrustType): Pizza =
    p.copy(crustType = ct)
}
```

{% endtab %}
{% tab 'Scala 3' for=module_3 %}

```scala
object PizzaService extends PizzaServiceInterface:

  def price(p: Pizza): Double =
    ... // implementation from above

  def addTopping(p: Pizza, t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings(p: Pizza): Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(p: Pizza, ct: CrustType): Pizza =
    p.copy(crustType = ct)

end PizzaService
```

{% endtab %}
{% endtabs %}

虽然创建接口和实现的两步过程并不总是必要的，但明确考虑 API 及其使用是一种好方法。

一切就绪后，您可以使用 `Pizza` 类和 `PizzaService`：

{% tabs module_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_4 %}

```scala
import PizzaService._

val p = Pizza(Small, Thin, Seq(Cheese))

// use the PizzaService methods
val p1 = addTopping(p, Pepperoni)
val p2 = addTopping(p1, Onions)
val p3 = updateCrustType(p2, Thick)
val p4 = updateCrustSize(p3, Large)

println(price(p4)) // prints 8.75
```

{% endtab %}
{% tab 'Scala 3' for=module_4 %}

```scala
import PizzaService.*

val p = Pizza(Small, Thin, Seq(Cheese))

// use the PizzaService methods
val p1 = addTopping(p, Pepperoni)
val p2 = addTopping(p1, Onions)
val p3 = updateCrustType(p2, Thick)
val p4 = updateCrustSize(p3, Large)

println(price(p4)) // prints 8.75
```

{% endtab %}
{% endtabs %}

### 函数对象

在 *Programming in Scala* 一书中，作者将术语“函数对象”定义为“不具有任何可变状态的对象”。
`scala.collection.immutable` 中的类型也是如此。
例如，`List` 上的方法不会改变内部状态，而是创建 `List` 的副本作为结果。

您可以将此方法视为“混合 FP/OOP 设计”，因为您：

- 使用不可变的 样例类对数据进行建模。
- 定义_同类型_数据中的行为（方法）。
- 将行为实现为纯函数：它们不会改变任何内部状态；相反，他们返回一个副本。

> 这确实是一种混合方法：就像在 **OOP 设计**中一样，方法与数据一起封装在类中，
> 但作为典型的 **FP 设计**，方法被实现为纯函数，该函数不改变数据

#### 例子

使用这种方法，您可以在样例类中直接实现披萨上的功能：

{% tabs module_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_5 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
) {

  // the operations on the data model
  def price: Double =
    pizzaPrice(this) // implementation from above

  def addTopping(t: Topping): Pizza =
    this.copy(toppings = this.toppings :+ t)

  def removeAllToppings: Pizza =
    this.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    this.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    this.copy(crustType = ct)
}
```

{% endtab %}
{% tab 'Scala 3' for=module_5 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
):

  // the operations on the data model
  def price: Double =
    pizzaPrice(this) // implementation from above

  def addTopping(t: Topping): Pizza =
    this.copy(toppings = this.toppings :+ t)

  def removeAllToppings: Pizza =
    this.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    this.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    this.copy(crustType = ct)
```

{% endtab %}
{% endtabs %}

请注意，与之前的方法不同，因为这些是 `Pizza` 类上的方法，它们不会将 `Pizza` 引用作为输入参数。
相反，他们用 `this` 作为当前披萨实例的引用。

现在你可以像这样使用这个新设计：

{% tabs module_6 %}
{% tab 'Scala 2 and 3' for=module_6 %}

```scala
Pizza(Small, Thin, Seq(Cheese))
  .addTopping(Pepperoni)
  .updateCrustType(Thick)
  .price
```

{% endtab %}
{% endtabs %}

### 扩展方法

最后，我们展示了一种介于第一个（在伴生对象中定义函数）和最后一个（将函数定义为类型本身的方法）之间的方法。

扩展方法让我们创建一个类似于函数对象的 API，而不必将函数定义为类型本身的方法。
这可以有多个优点：

- 我们的数据模型再次_非常简洁_并且没有提及任何行为。
- 我们可以_追溯性地_为类型配备额外的方法，而无需更改原始定义。
- 除了伴生对象或类型上的直接方法外，扩展方法可以在_外部_另一个文件中定义。

让我们再次回顾一下我们的例子。

{% tabs module_7 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_7 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

implicit class PizzaOps(p: Pizza) {
  def price: Double =
    pizzaPrice(p) // implementation from above

  def addTopping(t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings: Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    p.copy(crustType = ct)
}
```
在上面的代码中，我们将披萨上的不同方法定义为_implicit class_。
用 `implicit class PizzaOps(p: Pizza)`，不管什么时候导入 `PizzaOps`，它的方法在 `Pizza` 的实例上都是可用的。
在本例中接收者是 `p`。

{% endtab %}
{% tab 'Scala 3' for=module_7 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

extension (p: Pizza)
  def price: Double =
    pizzaPrice(p) // implementation from above

  def addTopping(t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings: Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    p.copy(crustType = ct)
```
在上面的代码中，我们将披萨上的不同方法定义为_扩展方法_。
对于 `extension (p: Pizza)`，我们想在 `Pizza` 的实例上让方法可用。在本例中接收者是 `p`。

{% endtab %}
{% endtabs %}

使用扩展方法，我们可以获得和之前一样的 API，同时也能够在任何其他模块中定义扩展：

{% tabs module_8 %}
{% tab 'Scala 2 and 3' for=module_8 %}

```scala
Pizza(Small, Thin, Seq(Cheese))
  .addTopping(Pepperoni)
  .updateCrustType(Thick)
  .price
```

{% endtab %}
{% endtabs %}

通常，如果您是数据模型的设计者，您将在伴生对象中定义您的扩展方法。
这样，它们已经可供所有用户使用。
否则，扩展方法需要显式导入才能使用。

## 这种方法的总结

在 Scala/FP 中定义数据模型往往很简单：只需使用枚举对数据的变体进行建模，并使用 样例类对复合数据进行建模。
然后，为了对行为建模，定义对数据模型的值进行操作的函数。
我们已经看到了组织函数的不同方法：

- 你可以把你的方法放在伴生对象中
- 您可以使用模块化编程风格，分离接口和实现
- 您可以使用“函数对象”方法并将方法存储在定义的数据类型上
- 您可以使用扩展方法把函数装配到数据模型上

[adts]: {% link _zh-cn/overviews/scala3-book/types-adts-gadts.md %}
[modeling-tools]: {% link _zh-cn/overviews/scala3-book/domain-modeling-tools.md %}
