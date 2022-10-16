---
title: 不透明类型
type: section
description: This section introduces and demonstrates opaque types in Scala 3.
num: 54
previous-page: types-variance
next-page: types-structural

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


Scala 3 _不透明类型别名_提供没有任何**开销**的类型抽象。

## 抽象开销

假设我们要定义一个提供数字算术运算的模块，这些数字由它们的对数表示。
当涉及的数值非常大或接近于零时，使用对数有利于提高精度。

把“常规”双精度值与存储为对数的值区分开来很重要，我们引入了一个类 `Logarithm`：

```scala
class Logarithm(protected val underlying: Double):
  def toDouble: Double = math.exp(underlying)
  def + (that: Logarithm): Logarithm =
    // here we use the apply method on the companion
    Logarithm(this.toDouble + that.toDouble)
  def * (that: Logarithm): Logarithm =
    new Logarithm(this.underlying + that.underlying)

object Logarithm:
  def apply(d: Double): Logarithm = new Logarithm(math.log(d))
```

伴生对象上的 apply 方法让我们可以创建 `Logarithm` 类型的值，我们可用如下方式使用：

```scala
val l2 = Logarithm(2.0)
val l3 = Logarithm(3.0)
println((l2 * l3).toDouble) // prints 6.0
println((l2 + l3).toDouble) // prints 4.999...
```

虽然 `Logarithm` 类为以这种特殊对数形式存储的 `Double` 值提供了一个很好的抽象，但它带来了严重的性能开销：对于每一个数学运算，我们需要提取基础值，然后将其再次包装在一个 `Logarithm` 的新实例中。

## 模块抽象

让我们考虑另一种实现相同库的方法。
这次我们没有将 `Logarithm` 定义为一个类，而是使用_类型别名_来定义它。
首先，我们定义模块的抽象接口：

```scala
trait Logarithms:

  type Logarithm

  // operations on Logarithm
  def add(x: Logarithm, y: Logarithm): Logarithm
  def mul(x: Logarithm, y: Logarithm): Logarithm

  // functions to convert between Double and Logarithm
  def make(d: Double): Logarithm
  def extract(x: Logarithm): Double

  // extension methods to use `add` and `mul` as "methods" on Logarithm
  extension (x: Logarithm)
    def toDouble: Double = extract(x)
    def + (y: Logarithm): Logarithm = add(x, y)
    def * (y: Logarithm): Logarithm = mul(x, y)
```

现在，让我们通过说类型 `Logarithm` 等于 `Double` 来实现这个抽象接口：

```scala
object LogarithmsImpl extends Logarithms:

  type Logarithm = Double

  // operations on Logarithm
  def add(x: Logarithm, y: Logarithm): Logarithm = make(x.toDouble + y.toDouble)
  def mul(x: Logarithm, y: Logarithm): Logarithm = x + y

  // functions to convert between Double and Logarithm
  def make(d: Double): Logarithm = math.log(d)
  def extract(x: Logarithm): Double = math.exp(x)
```

在 `LogarithmsImpl` 的实现中，等式 `Logarithm = Double` 允许我们实现各种方法。

#### 暴露抽象

但是，这种抽象有点暴露。
我们必须确保_只_针对抽象接口 `Logarithms` 进行编程，并且永远不要直接使用 `LogarithmsImpl`。
直接使用 `LogarithmsImpl` 会使等式 `Logarithm = Double` 对用户可见，用户可能会意外使用 `Double`，而实际上是需要 对数双精度。
例如：

```scala
import LogarithmsImpl.*
val l: Logarithm = make(1.0)
val d: Double = l // type checks AND leaks the equality!
```

必须将模块分离为抽象接口和实现可能很有用，但只为了隐藏 `Logarithm` 的实现细节，就需要付出很多努力。
针对抽象模块 `Logarithm` 进行编程可能非常乏味，并且通常需要使用像路径依赖类型这样的高级特性，如下例所示：

```scala
def someComputation(L: Logarithms)(init: L.Logarithm): L.Logarithm = ...
```

#### 装箱的开销

类型抽象，例如 `type Logarithm` [抹去](https://www.scala-lang.org/files/archive/spec/2.13/03-types.html#type-erasure) 到它们的界限（在我们的例子中是 `Any`）。
也就是说，虽然我们不需要手动包装和解包 `Double` 值，但仍然会有一些与装箱原始类型 `Double` 相关的装箱开销。

## 不透明类型

我们可以简单地使用 Scala 3 中的不透明类型来实现类似的效果，而不是手动将我们的 `Logarithms` 组件拆分为抽象部分和具体实现：

```scala
object Logarithms:
//vvvvvv this is the important difference!
  opaque type Logarithm = Double

  object Logarithm:
    def apply(d: Double): Logarithm = math.log(d)

  extension (x: Logarithm)
    def toDouble: Double = math.exp(x)
    def + (y: Logarithm): Logarithm = Logarithm(math.exp(x) + math.exp(y))
    def * (y: Logarithm): Logarithm = x + y
```

`Logarithm` 与 `Double` 相同的事实仅在定义 `Logarithm` 的范围内已知，在上面的示例中对应于对象 `Logarithms`。
类型相等 `Logarithm = Double` 可用于实现方法（如 `*` 和 `toDouble`）。

然而，在模块之外， `Logarithm` 类型是完全封装的，或者说是“不透明的”。 对于 `Logarithm` 的用户来说，不可能发现 `Logarithm` 实际上是作为 `Double` 实现的：

```scala
import Logarithms.*
val l2 = Logarithm(2.0)
val l3 = Logarithm(3.0)
println((l2 * l3).toDouble) // prints 6.0
println((l2 + l3).toDouble) // prints 4.999...

val d: Double = l2 // ERROR: Found Logarithm required Double
```

尽管我们抽象了 `Logarithm`，但抽象是免费的：
由于只有一种实现，在运行时对于像 `Double` 这样的原始类型将_没有装箱开销_。

### 不透明类型总结

不透明类型提供了对实现细节的合理抽象，而不会增加性能开销。
如上图所示，不透明类型使用起来很方便，并且与 [扩展方法][extension] 功能很好地集成在一起。

[extension]: {% link _zh-cn/overviews/scala3-book/ca-extension-methods.md %}
