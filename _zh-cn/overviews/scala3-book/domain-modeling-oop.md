---
title: OOP 领域建模
type: section
description: This chapter provides an introduction to OOP domain modeling with Scala 3.
language: zh-cn
num: 21
previous-page: domain-modeling-tools
next-page: domain-modeling-fp

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


本章介绍了在 Scala 3 中使用面向对象编程 (OOP) 进行领域建模。

## 介绍

Scala 为面向对象设计提供了所有必要的工具：

- **Traits** 让您指定（抽象）接口以及具体实现。
- **Mixin Composition** 为您提供了从较小的部分组成组件的工具。
- **类**可以实现trait指定的接口。
- 类的**实例**可以有自己的私有状态。
- **Subtyping** 允许您在需要超类实例的地方使用一个类的实例。
- **访问修饰符**允许您控制类的哪些成员可以被代码的哪个部分访问。

## Traits

可能与支持 OOP 的其他语言（例如 Java）不同，Scala 中分解的主要工具不是类，而是trait。
它们可以用来描述抽象接口，例如：

```scala
trait Showable:
  def show: String
```

并且还可以包含具体的实现：

```scala
trait Showable:
  def show: String
  def showHtml = "<p>" + show + "</p>"
```

你可以看到我们用抽象方法 `show` 来定义方法 `showHtml`。

[Odersky and Zenger][scalable] 展示了 _面向服务的组件模型_ 和视图：

- **抽象成员**作为_必须_服务：它们仍然需要由子类实现。
- **具体成员**作为_提供_服务：它们被提供给子类。

我们已经可以在 `Showable` 的示例中看到这一点：定义一个扩展 `Showable` 的类 `Document`，我们仍然必须定义 `show`，但我们提供了 `showHtml`：

```scala
class Document(text: String) extends Showable:
  def show = text
```

#### 抽象成员
抽象方法并不是trait中唯一可以抽象的东西。
一个trait可以包含：

- 抽象方法（`def m(): T`）
- 抽象值定义（`val x: T`）
- 抽象类型成员（`type T`），可能有界限（`type T <: S`）
- 抽象given（`given t: T`）

上述每个特性都可用于指定对 trait 实现者的某种形式的要求。

## 混入组合

traits 不仅可以包含抽象和具体的定义，Scala 还提供了一种组合多个 trait 的强大方法：这个特性通常被称为 _混入组合_。

让我们假设以下两个（可能独立定义的）traits：

```scala
trait GreetingService:
  def translate(text: String): String
  def sayHello = translate("Hello")

trait TranslationService:
  def translate(text: String): String = "..."
```

要组合这两个服务，我们可以简单地创建一个扩展它们的新trait：

```scala
trait ComposedService extends GreetingService, TranslationService
```

一个 trait 中的抽象成员（例如 `GreetingService` 中的 `translate`）会自动与另一个 trait 中的具体成员匹配。
这不仅适用于本例中的方法，而且适用于上述所有其他抽象成员（即类型、值定义等）。

## 类

Traits 非常适合模块化组件和描述接口（必需和提供）。
但在某些时候，我们会想要创建它们的实例。
在 Scala 中设计软件时，只考虑在继承模型的叶子中使用类通常很有帮助：

{% comment %}
NOTE: I think “leaves” may technically be the correct word to use, but I prefer “leafs.”
{% endcomment %}

|Traits      | `T1`, `T2`, `T3`
|组合 traits | `S extends T1, T2`, `S extends T2, T3`
|类          | `C extends S, T3`
|实例        | `C()`

在 Scala 3 中更是如此，trait 现在也可以接受参数，进一步消除了对类的需求。

#### 定义类

像trait一样，类可以扩展多个trait（但只有一个超类）：

```scala
class MyService(name: String) extends ComposedService, Showable:
  def show = s"$name says $sayHello"
```

#### 子类型化

我们可以创建一个 `MyService` 的实例，如下所示：

```scala
val s1: MyService = MyService("Service 1")
```

通过子类型化的方式，我们的实例 `s1` 可以在任何扩展了trait的地方使用：

```scala
val s2: GreetingService = s1
val s3: TranslationService = s1
val s4: Showable = s1
// ... and so on ...
```

#### 扩展规划

如前所述，可以扩展另一个类：

```scala
class Person(name: String)
class SoftwareDeveloper(name: String, favoriteLang: String)
  extends Person(name)
```

然而，由于 _traits_ 被设计为主要的分解手段，在一个文件中定义的类_不能_在另一个文件中扩展。
为了允许这样做，需要将基类标记为 `open`：

```scala
open class Person(name: String)
```

用 [`open`][open] 标记类是 Scala 3 的一个新特性。必须将类显式标记为开放可以避免面向对象设计中的许多常见缺陷。
特别是，它要求库设计者明确计划扩展，例如用额外的扩展契约来记录那些被标记为开放的类。

{% comment %}
NOTE/FWIW: In his book, “Effective Java,” Joshua Bloch describes this as “Item 19: Design and document for inheritance or else prohibit it.”
Unfortunately I can’t find any good links to this on the internet.
I only mention this because I think that book and phrase is pretty well known in the Java world.
{% endcomment %}

## 实例和私有可变状态

与其他支持 OOP 的语言一样，Scala 中的trait和类可以定义可变字段：

```scala
class Counter:
  // can only be observed by the method `count`
  private var currentCount = 0

  def tick(): Unit = currentCount += 1
  def count: Int = currentCount
```

`Counter` 类的每个实例都有自己的私有状态，只能通过方法 `count` 观察到，如下面的交互所示：

```scala
val c1 = Counter()
c1.count // 0
c1.tick()
c1.tick()
c1.count // 2
```

#### 访问修饰符

默认情况下，Scala 中的所有成员定义都是公开可见的。
要隐藏实现细节，可以将成员（方法、字段、类型等）定义为 `private` 或 `protected`。
通过这种方式，您可以控制访问或覆盖它们的方式。
私有成员仅对类/trait本身及其伴生对象可见。
受保护的成员对类的子类也是可见的。

## 高级示例：面向服务的设计

在下文中，我们展示了 Scala 的一些高级特性，并展示了如何使用它们来构建更大的软件组件。
这些示例改编自 Martin Odersky 和 ​​Matthias Zenger 的论文 ["Scalable Component Abstractions"][scalable]。
如果您不了解示例的所有细节，请不要担心；它的主要目的是演示如何使用多种类型特性来构造更大的组件。

我们的目标是定义一个_种类丰富_的软件组件，而对组件的细化，可以放到以后的实现中
具体来说，以下代码将组件 `SubjectObserver` 定义为具有两个抽象类型成员的trait， `S` （用于主题）和 `O` （用于观察者）：

```scala
trait SubjectObserver:

  type S <: Subject
  type O <: Observer

  trait Subject { self: S =>
    private var observers: List[O] = List()
    def subscribe(obs: O): Unit =
      observers = obs :: observers
    def publish() =
      for obs <- observers do obs.notify(this)
  }

  trait Observer {
    def notify(sub: S): Unit
  }
```

有几件事需要解释。

#### 抽象类型成员

声明 `type S <: Subject` 表示在 trait `SubjectObserver` 中我们可以引用一些我们称为 `S` 的_未知_（即抽象）类型。
然而，该类型并不是完全未知的：我们至少知道它是trait `Subject` 的_某个子类型_。
只要选择的类型是 `Subject` 的子类型，所有扩展自 `SubjectObserver` 的trait和类都可以自由地用于 `S`的类型。
声明的 `<: Subject` 部分也称为 _`S` 的上界_。

#### 嵌套trait

在 trait `SubjectObserver` _内_，我们定义了另外两个traits。
让我们从 trait `Observer` 开始，它只定义了一个抽象方法 `notify`，它接受一个类型为 `S` 的参数。
正如我们稍后将看到的，重要的是参数的类型为 `S` 而不是 `Subject` 类型。

第二个trait，`Subject`，定义了一个私有字段`observers`来存储所有订阅这个特定主题的观察者。
订阅主题只是将对象存储到此列表中。
同样，参数 `obs` 的类型是 `O`，而不是 `Observer`。

#### 自类型注解

最后，你可能想知道 trait `Subject` 上的 `self: S =>` 应该是什么意思。
这称为 _自类型注解_。
它要求 `Subject` 的子类型也是 `S` 的子类型。
这对于能够使用 `this` 作为参数调用 `obs.notify` 是必要的，因为它需要 `S` 类型的值。
如果 `S` 是一个_具体_类型，自类型注解可以被 `trait Subject extends S` 代替。

### 实现组件

我们现在可以实现上述组件并将抽象类型成员定义为具体类型：

```scala
object SensorReader extends SubjectObserver:
  type S = Sensor
  type O = Display

  class Sensor(val label: String) extends Subject:
    private var currentValue = 0.0
    def value = currentValue
    def changeValue(v: Double) =
      currentValue = v
      publish()

  class Display extends Observer:
    def notify(sub: Sensor) =
      println(s"${sub.label} has value ${sub.value}")
```

具体来说，我们定义了一个扩展 `SubjectObserver` 的_单例_对象 `SensorReader`。
在 `SensorReader` 的实现中，我们说 `S` 类型现在被定义为 `Sensor` 类型，`O` 类型被定义为等于 `Display` 类型。
`Sensor` 和 `Display` 都被定义为 `SensorReader` 中的嵌套类，相应地实现了 `Subject` 和 `Observer` 特性。

除了作为面向服务设计的示例之外，这段代码还突出了面向对象编程的许多方面：

- `Sensor` 类引入了它自己的私有状态（`currentValue`），并在方法`changeValue` 后面封装了对状态的修改。
- `changeValue` 的实现使用扩展trait中定义的方法 `publish`。
- 类 `Display` 扩展了 `Observer` 特性，并实现了缺失的方法 `notify`。

{% comment %}
NOTE: You might say “the abstract method `notify`” in that last sentence, but I like “missing.”
{% endcomment %}

有一点很重要，需要指出，`notify` 的实现只能安全地访问 `sub` 的标签和值，因为我们最初将参数声明为 `S` 类型。

### 使用组件

最后，下面的代码说明了如何使用我们的 `SensorReader` 组件：

```scala
import SensorReader.*

// setting up a network
val s1 = Sensor("sensor1")
val s2 = Sensor("sensor2")
val d1 = Display()
val d2 = Display()
s1.subscribe(d1)
s1.subscribe(d2)
s2.subscribe(d1)

// propagating updates through the network
s1.changeValue(2)
s2.changeValue(3)

// prints:
// sensor1 has value 2.0
// sensor1 has value 2.0
// sensor2 has value 3.0
```

借助我们掌握的所有面向对象的编程工具，在下一节中，我们将演示如何以函数式风格设计程序。

{% comment %}
NOTE: One thing I occasionally do is flip things like this around, so I first show how to use a component, and then show how to implement that component. I don’t have a rule of thumb about when to do this, but sometimes it’s motivational to see the use first, and then see how to create the code to make that work.
{% endcomment %}

[scalable]: https://doi.org/10.1145/1094811.1094815
[open]: {{ site.scala3ref }}/other-new-features/open-classes.html
[trait-params]: {{ site.scala3ref }}/other-new-features/trait-parameters.html
