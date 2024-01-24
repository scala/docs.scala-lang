---
title: 依赖函数类型
type: section
description: This section introduces and demonstrates dependent function types in Scala 3.
language: zh-cn
num: 57
previous-page: types-structural
next-page: types-others

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


*依赖函数类型*描述函数类型，其中结果类型可能取决于函数的参数值。
依赖类型和依赖函数类型的概念更高级，您通常只会在设计自己的库或使用高级库时遇到它。

## 依赖方法类型

让我们考虑以下可以存储不同类型值的异构数据库示例。
键包含有关相应值的类型的信息：

```scala
trait Key { type Value }

trait DB {
  def get(k: Key): Option[k.Value] // a dependent method
}
```

给定一个键，`get` 方法允许我们访问地图并可能返回类型为 `k.Value` 的存储值。
我们可以将这个_路径依赖类型_解读为：“根据参数 `k` 的具体类型，我们返回一个匹配值”。

例如，我们可以有以下键：

```scala
object Name extends Key { type Value = String }
object Age extends Key { type Value = Int }
```

以下对方法 `get` 的调用现在将键入检查：

```scala
val db: DB = ...
val res1: Option[String] = db.get(Name)
val res2: Option[Int] = db.get(Age)
```

调用方法 `db.get(Name)` 返回一个 `Option[String]` 类型的值，而调用 `db.get(Age)` 返回一个 `Option[Int]` 类型的值。
返回类型_依赖_于传递给 `get` 的参数的具体类型---因此名称为_依赖类型_。

## 依赖函数类型

如上所示，Scala 2 已经支持依赖方法类型。
但是，创建 `DB` 类型的值非常麻烦：

```scala
// a user of a DB
def user(db: DB): Unit =
  db.get(Name) ... db.get(Age)

// creating an instance of the DB and passing it to `user`
user(new DB {
  def get(k: Key): Option[k.Value] = ... // implementation of DB
})
```

我们需要手动创建一个匿名的 `DB` 内部类，实现 `get` 方法。
对于依赖于创建许多不同的 `DB` 实例的代码，这是非常乏味的。

 `DB` 只有一个抽象方法 `get` 。
如果我们可以使用 lambda 语法，那不是很好吗？

```scala
user { k =>
  ... // implementation of DB
```

事实上，现在这在 Scala 3 中是可能的！我们可以将 `DB` 定义为_依赖函数类型_：

```scala
type DB = (k: Key) => Option[k.Value]
//        ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//      A dependent function type
```

鉴于 `DB` 的这个定义，上面对 `user` 类型的调用按原样检查。

您可以在 [参考文档][ref] 中阅读有关依赖函数类型内部结构的更多信息。

## 案例研究：数值表达式

假设我们要定义一个抽象数字内部表示的模块。
例如，这对于实现用于自动派生的库很有用。

我们首先为数字定义我们的模块：

```scala
trait Nums:
  // the type of numbers is left abstract
  type Num

  // some operations on numbers
  def lit(d: Double): Num
  def add(l: Num, r: Num): Num
  def mul(l: Num, r: Num): Num
```

> 我们省略了 `Nums` 的具体实现，但作为练习，您可以通过分配 `type Num = Double` 来实现 `Nums` 并相应地实现方法。

使用我们的数字抽象的程序现在具有以下类型：

```scala
type Prog = (n: Nums) => n.Num => n.Num

val ex: Prog = nums => x => nums.add(nums.lit(0.8), x)
```

计算诸如 `ex` 之类的程序的导数的函数的类型是：

```scala
def derivative(input: Prog): Double
```

鉴于依赖函数类型的便利，用不同的程序调用这个函数非常方便：

```scala
derivative { nums => x => x }
derivative { nums => x => nums.add(nums.lit(0.8), x) }
// ...
```

回想一下，上面编码中的相同程序将是：

```scala
derivative(new Prog {
  def apply(nums: Nums)(x: nums.Num): nums.Num = x
})
derivative(new Prog {
  def apply(nums: Nums)(x: nums.Num): nums.Num = nums.add(nums.lit(0.8), x)
})
// ...
```

#### 上下文组合函数

扩展方法、[上下文函数][ctx-fun]和依赖函数的组合为库设计者提供了强大的工具。
例如，我们可以从上面优化我们的库，如下所示：

```scala
trait NumsDSL extends Nums:
  extension (x: Num)
    def +(y: Num) = add(x, y)
    def *(y: Num) = mul(x, y)

def const(d: Double)(using n: Nums): n.Num = n.lit(d)

type Prog = (n: NumsDSL) ?=> n.Num => n.Num
//                       ^^^
//     prog is now a context function that implicitly
//     assumes a NumsDSL in the calling context

def derivative(input: Prog): Double = ...

// notice how we do not need to mention Nums in the examples below?
derivative { x => const(1.0) + x }
derivative { x => x * x + const(2.0) }
// ...
```


[ref]: {{ site.scala3ref }}/new-types/dependent-function-types.html
[ctx-fun]: {{ site.scala3ref }}/contextual/context-functions.html
