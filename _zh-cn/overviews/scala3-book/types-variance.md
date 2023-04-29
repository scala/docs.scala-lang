---
title: 型变
type: section
description: This section introduces and demonstrates variance in Scala 3.
language: zh-cn
num: 53
previous-page: types-adts-gadts
next-page: types-opaque-types

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


类型参数_型变_控制参数化类型（如类或 traits）的子类型。

为了解释型变，让我们假设以下类型定义：

{% tabs types-variance-1 %}
{% tab 'Scala 2 and 3' %}
```scala
trait Item { def productNumber: String }
trait Buyable extends Item { def price: Int }
trait Book extends Buyable { def isbn: String }
```
{% endtab %}
{% endtabs %}

我们还假设以下参数化类型：

{% tabs types-variance-2 class=tabs-scala-version %}
{% tab 'Scala 2' for=types-variance-2 %}
```scala
// an example of an invariant type
trait Pipeline[T] {
  def process(t: T): T
}

// an example of a covariant type
trait Producer[+T] {
  def make: T
}

// an example of a contravariant type
trait Consumer[-T] {
  def take(t: T): Unit
}
```
{% endtab %}

{% tab 'Scala 3' for=types-variance-2 %}
```scala
// an example of an invariant type
trait Pipeline[T]:
  def process(t: T): T

// an example of a covariant type
trait Producer[+T]:
  def make: T

// an example of a contravariant type
trait Consumer[-T]:
  def take(t: T): Unit
```
{% endtab %}
{% endtabs %}

一般来说，型变有三种模式：

- **不变的**---默认值，写成 `Pipeline[T]`
- **协变**---用`+`注释，例如 `Producer[+T]`
- **逆变**---用`-`注释，如 `Consumer[-T]`

我们现在将详细介绍此注释的含义以及我们使用它的原因。

### 不变类型

默认情况下，像 `Pipeline` 这样的类型在它们的类型参数中是不变的（本例中是 `T`）。
这意味着像 `Pipeline[Item]`、`Pipeline[Buyable]` 和 `Pipeline[Book]` 这样的类型彼此之间_没有子类型关系_。

理所当然地！假设以下方法使用两个类型为`Pipeline[Buyable]` 的值，并根据价格将其参数 `b` 传递给其中一个：

{% tabs types-variance-3 class=tabs-scala-version %}
{% tab 'Scala 2' for=types-variance-3 %}
```scala
def oneOf(
  p1: Pipeline[Buyable],
  p2: Pipeline[Buyable],
  b: Buyable
): Buyable = {
  val b1 = p1.process(b)
  val b2 = p2.process(b)
  if (b1.price < b2.price)
    b1 
  else
    b2
 } 
```
{% endtab %}

{% tab 'Scala 3' for=types-variance-3 %}
```scala
def oneOf(
  p1: Pipeline[Buyable],
  p2: Pipeline[Buyable],
  b: Buyable
): Buyable =
  val b1 = p1.process(b)
  val b2 = p2.process(b)
  if b1.price < b2.price then b1 else b2
```
{% endtab %}
{% endtabs %}

现在，回想一下，我们的类型之间存在以下_子类型关系_：

{% tabs types-variance-4 %}
{% tab 'Scala 2 and 3' %}
```scala
Book <: Buyable <: Item
```
{% endtab %}
{% endtabs %}

我们不能将 `Pipeline[Book]` 传递给 `oneOf` 方法，因为在其实现中，我们调用的 `p1` 和 `p2` 是 `Buyable` 类型的值。
`Pipeline[Book]` 需要的是 `Book`，这可能会导致运行时错误。

我们不能传递一个 `Pipeline[Item]` 因为在它上面调用 `process` 只会保证返回一个 `Item`；但是，我们应该返回一个 `Buyable` 。

#### 为什么是不变的？

事实上，`Pipeline` 类型需要是不变的，因为它使用它的类型参数 `T` _既_作为参数类型，_又_作为返回类型。
出于同样的原因，Scala 集合库中的某些类型——例如 `Array` 或 `Set` —— 也是_不变的_。

### 协变类型

与不变的 `Pipeline` 相比，`Producer` 类型通过在类型参数前面加上 `+` 前缀被标记为 **协变**。
这是有效的，因为类型参数仅用于_返回的位置_。

将其标记为协变意味着当需要 `Producer[Buyable]` 时，我们可以传递（或返回）一个 `Producer[Book]`。
事实上，这是合理的。 `Producer[Buyable].make` 的类型只承诺_返回_ `Buyable`。
作为 `make` 的调用者，我们乐意接受作为 `Buyable` 的子类型的 `Book` 类型，---也就是说，它_至少_是一个 `Buyable`。

以下示例说明了这一点，其中函数 `makeTwo` 需要一个 `Producer[Buyable]`：

{% tabs types-variance-5 %}
{% tab 'Scala 2 and 3' %}
```scala
def makeTwo(p: Producer[Buyable]): Int =
  p.make.price + p.make.price
```
{% endtab %}
{% endtabs %}

通过书籍制作人是完全可以的：

{% tabs types-variance-6 %}
{% tab 'Scala 2 and 3' %}
```scala
val bookProducer: Producer[Book] = ???
makeTwo(bookProducer)
```
{% endtab %}
{% endtabs %}

在 `makeTwo` 中调用 `price` 对书籍仍然有效。

#### 不可变容器的协变类型

在处理不可变容器时，您会经常遇到协变类型，例如可以在标准库中找到的那些（例如 `List`、`Seq`、`Vector` 等）。

例如，`List` 和 `Vector` 大致定义为：

{% tabs types-variance-7 %}
{% tab 'Scala 2 and 3' %}
```scala
class List[+A] ...
class Vector[+A] ...
```
{% endtab %}
{% endtabs %}

这样，您可以在需要 `List[Buyable]` 的地方使用 `List[Book]`。
这在直觉上也是有道理的：如果您期望收藏可以购买的东西，那么给您收藏书籍应该没问题。
在我们的示例中，它们有一个额外的 ISBN 方法，但您可以随意忽略这些额外的功能。

### 逆变类型

与标记为协变的类型 `Producer` 相比，类型 `Consumer` 通过在类型参数前加上 `-` 来标记为**逆变**。
这是有效的，因为类型参数仅用于_参数位置_。

将其标记为逆变意味着如果我们想要 `Consumer[Buyable]` 时，可以传递（或返回） `Consumer[Item]`。
也就是说，我们有子类型关系`Consumer[Item] <: Consumer[Buyable]`。
请记住，对于类型 `Producer`，情况正好相反，我们有 `Producer[Buyable] <: Producer[Item]`。

事实上，这是合理的。 `Consumer[Item].take` 方法接受一个 `Item`。
作为 `take` 的调用者，我们还可以提供 `Buyable`，它会被 `Consumer[Item]` 愉快地接受，因为 `Buyable` 是 `Item` 的一个子类型——也就是说，它_至少_是 `Item` 。

#### 消费者的逆变类型

逆变类型比协变类型少得多。
在我们的示例中，您可以将它们视为“消费者”。你可能来的最重要的类型标记为逆变的 cross 是函数之一：

{% tabs types-variance-8 class=tabs-scala-version %}
{% tab 'Scala 2' for=types-variance-8 %}
```scala
trait Function[-A, +B] {
  def apply(a: A): B
}
```
{% endtab %}

{% tab 'Scala 3' for=types-variance-8 %}
```scala
trait Function[-A, +B]:
  def apply(a: A): B
```
{% endtab %}
{% endtabs %}

它的参数类型 `A` 被标记为逆变的 `A` ——它消费 `A` 类型的值。
相反，它的结果类型 `B` 被标记为协变——它产生 `B` 类型的值。

以下是一些示例，这些示例说明了由函数上可变注释引起的子类型关系：

{% tabs types-variance-9 %}
{% tab 'Scala 2 and 3' %}
```scala
val f: Function[Buyable, Buyable] = b => b

// OK to return a Buyable where a Item is expected
val g: Function[Buyable, Item] = f

// OK to provide a Book where a Buyable is expected
val h: Function[Book, Buyable] = f
```
{% endtab %}
{% endtabs %}

## 概括

在本节中，我们遇到了三种不同的方差：

- **生产者**通常是协变的，并用 `+` 标记它们的类型参数。
  这也适用于不可变集合。
- **消费者**通常是逆变的，并用 `-` 标记他们的类型参数。
- **既是**生产者**又**是消费者的类型必须是不变的，并且不需要在其类型参数上进行任何标记。
  像 `Array` 这样的可变集合就属于这一类。
