---
layout: tour
title: 包对象
language: zh-cn
partof: scala-tour

num: 36
previous-page: packages-and-imports
---

# 包对象

Scala 提供包对象作为在整个包中方便的共享使用的容器。

包对象中可以定义任何内容，而不仅仅是变量和方法。 例如，包对象经常用于保存包级作用域的类型别名和隐式转换。 包对象甚至可以继承 Scala 的类和特质。

按照惯例，包对象的代码通常放在名为 `package.scala` 的源文件中。

每个包都允许有一个包对象。 在包对象中的任何定义都被认为是包自身的成员。

看下例。 假设有一个类 `Fruit` 和三个 `Fruit` 对象在包 `gardening.fruits` 中；

```
// in file gardening/fruits/Fruit.scala
package gardening.fruits

case class Fruit(name: String, color: String)
object Apple extends Fruit("Apple", "green")
object Plum extends Fruit("Plum", "blue")
object Banana extends Fruit("Banana", "yellow")
```

现在假设你要将变量 `planted` 和方法 `showFruit` 直接放入包 `gardening` 中。
下面是具体做法：

```
// in file gardening/fruits/package.scala
package gardening
package object fruits {
  val planted = List(Apple, Plum, Banana)
  def showFruit(fruit: Fruit): Unit = {
    println(s"${fruit.name}s are ${fruit.color}")
  }
}
```

作为一个使用范例，下例中的对象 `PrintPlanted` 用导入类 `Fruit` 相同的方式来导入 `planted` 和 `showFruit`，在导入包 `gardening.fruits` 时使用通配符：

```
// in file PrintPlanted.scala
import gardening.fruits._
object PrintPlanted {
  def main(args: Array[String]): Unit = {
    for (fruit <- planted) {
      showFruit(fruit)
    }
  }
}
```

包对象与其他对象类似，这意味着你可以使用继承来构建它们。 例如，一个包对象可能会混入多个特质：

```
package object fruits extends FruitAliases with FruitHelpers {
  // helpers and variables follows here
}
```
