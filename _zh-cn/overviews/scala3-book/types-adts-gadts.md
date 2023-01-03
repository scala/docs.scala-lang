---
title: 代数数据类型
type: section
description: This section introduces and demonstrates algebraic data types (ADTs) in Scala 3.
language: zh-cn
num: 52
previous-page: types-union
next-page: types-variance

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


代数数据类型 (ADT) 可以使用 `enum` 构造创建，因此我们将在查看 ADT 之前简要回顾一下枚举。

## 枚举

_enumeration_ 用于定义由一组命名值组成的类型：

```scala
enum Color:
  case Red, Green, Blue
```

这可以看作是以下的简写：

```scala
enum Color:
  case Red   extends Color
  case Green extends Color
  case Blue  extends Color
```

#### 参数

枚举可以参数化：

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

这样，每个不同的变体都有一个值成员 `rgb`，它被分配了相应的值：

```scala
println(Color.Green.rgb) // prints 65280
```

#### 自定义

枚举也可以有自定义：

```scala
enum Planet(mass: Double, radius: Double):

  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) =  otherMass * surfaceGravity

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Venus   extends Planet(4.869e+24, 6.0518e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  // 5 or 6 more planets ...
```

像类和 `case` 类一样，你也可以为枚举定义一个伴生对象：

```scala
object Planet:
  def main(args: Array[String]) =
    val earthWeight = args(0).toDouble
    val mass = earthWeight / Earth.surfaceGravity
    for (p <- values)
      println(s"Your weight on $p is ${p.surfaceWeight(mass)}")
```

## 代数数据类型 (ADTs)

`enum` 概念足够通用，既支持_代数数据类型_（ADT）和它的通用版本（GADT）。
本示例展示了如何将 `Option` 类型表示为 ADT：

```scala
enum Option[+T]:
  case Some(x: T)
  case None
```

这个例子创建了一个带有协变类型参数 `T` 的 `Option` 枚举，它由两种情况组成， `Some` 和 `None`。
`Some` 是_参数化_的，它带有值参数 `x`；它是从 `Option` 继承的 `case` 类的简写。
由于 `None` 没有参数化，它被视为普通的 `enum` 值。

前面示例中省略的 `extends` 子句也可以显式给出：

```scala
enum Option[+T]:
  case Some(x: T) extends Option[T]
  case None       extends Option[Nothing]
```

与普通的 `enum` 值一样，`enum` 的情况是在 `enum` 的伴生对象中定义的，因此它们被引用为 `Option.Some` 和 `Option.None`（除非定义是在导入时单独列出）：

```scala
scala> Option.Some("hello")
val res1: t2.Option[String] = Some(hello)

scala> Option.None
val res2: t2.Option[Nothing] = None
```

与其他枚举用途一样，ADT 可以定义更多的方法。
例如，这里又是一个 `Option`，它的伴生对象中有一个 `isDefined` 方法和一个 `Option(...)` 构造函数：

```scala
enum Option[+T]:
  case Some(x: T)
  case None

  def isDefined: Boolean = this match
    case None => false
    case Some(_) => true

object Option:
  def apply[T >: Null](x: T): Option[T] =
    if (x == null) None else Some(x)
```

枚举和 ADT 共享相同的句法结构，因此它们可以
被简单地视为光谱的两端，把二者混搭是完全可能的。
例如，下面的代码给出了一个
`Color` 的实现，可以使用三个枚举值或使用
RGB 值的参数化情况：

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
  case Mix(mix: Int) extends Color(mix)
```

#### 递归枚举

到目前为止，我们定义的所有枚举都由值或样例类的不同变体组成。
枚举也可以是递归的，如下面的自然数编码示例所示：

```scala
enum Nat:
  case Zero
  case Succ(n: Nat)
```

例如，值 `Succ(Succ(Zero))` 表示一元编码中的数字 `2`。
列表可以以非常相似的方式定义：

```scala
enum List[+A]:
  case Nil
  case Cons(head: A, tail: List[A])
```

## 广义代数数据类型 (GADT)

上面的枚举表示法非常简洁，可以作为建模数据类型的完美起点。
由于我们总是可以更明确，因此也可以表达更强大的类型：广义代数数据类型 (GADT)。

这是一个 GADT 示例，其中类型参数 (`T`) 指定存储在框中的内容：

```scala
enum Box[T](contents: T):
  case IntBox(n: Int) extends Box[Int](n)
  case BoolBox(b: Boolean) extends Box[Boolean](b)
```

特定构造函数（`IntBox` 或 `BoolBox`）上的模式匹配可恢复类型信息：

```scala
def extract[T](b: Box[T]): T = b match
  case IntBox(n)  => n + 1
  case BoolBox(b) => !b
```

只有在第一种情况下返回一个 `Int` 才是安全的，因为我们从 pattern 匹配输入是一个“IntBox”。

## 去除语法糖的枚举

_从概念上讲_，枚举可以被认为是定义一个密封类及其伴生对象。
让我们看看上面的 `Color` 枚举的无语法糖版本：

```scala
sealed abstract class Color(val rgb: Int) extends scala.reflect.Enum
object Color:
  case object Red extends Color(0xFF0000) { def ordinal = 0 }
  case object Green extends Color(0x00FF00) { def ordinal = 1 }
  case object Blue extends Color(0x0000FF) { def ordinal = 2 }
  case class Mix(mix: Int) extends Color(mix) { def ordinal = 3 }

  def fromOrdinal(ordinal: Int): Color = ordinal match
    case 0 => Red
    case 1 => Green
    case 2 => Blue
    case _ => throw new NoSuchElementException(ordinal.toString)
```

请注意，上面的去除语法糖被简化了，我们故意省略了[一些细节][desugar-enums]。

虽然枚举可以使用其他构造手动编码，但使用枚举更简洁，并且还附带了一些额外的实用程序（例如 `fromOrdinal` 方法）。

[desugar-enums]: {{ site.scala3ref }}/enums/desugarEnums.html
