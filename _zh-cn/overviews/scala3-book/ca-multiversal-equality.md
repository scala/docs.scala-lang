---
title: 多元相等性
type: section
description: This page demonstrates how to implement Multiversal Equality in Scala 3.
language: zh-cn
num: 64
previous-page: ca-type-classes
next-page: ca-implicit-conversions

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


以前，Scala 具有*通用相等性*：任何类型的两个值都可以使用 `==` 和 `!=` 相互比较。
这是因为 `==` 和 `!=` 是根据 Java 的 `equals` 方法实现的，该方法还可以比较任何两种引用类型的值。

通用相等性很方便，但也很危险，因为它破坏了类型安全。
例如，假设在一些重构之后，你会得到一个错误的程序，其中值 `y` 的类型为 `S` 而不是正确的类型 `T`：

```scala
val x = ...   // of type T
val y = ...   // of type S, but should be T
x == y        // typechecks, will always yield false

```

如果 `y` 与其他类型为 `T` 的值进行比较，程序仍然会进行类型检查，因为所有类型的值都可以相互比较。
但它可能会产生意想不到的结果并在运行时失败。

类型安全的编程语言可以做得更好，多元等价是使普遍平等更安全的一种选择方式。
它使用二元类型类“CanEqual”来指示两个给定类型的值可以相互比较。

## 允许比较类实例

默认情况下，在 Scala 3 中，您仍然可以像这样创建相等比较：

```scala
case class Cat(name: String)
case class Dog(name: String)
val d = Dog("Fido")
val c = Cat("Morris")

d == c  // false, but it compiles
```

但是使用 Scala 3，您可以禁用此类比较。
通过 (a) 导入 `scala.language.strictEquality` 或 (b) 使用 `-language:strictEquality` 编译器标志，此比较不再编译：

```scala
import scala.language.strictEquality

val rover = Dog("Rover")
val fido = Dog("Fido")
println(rover == fido)   // compiler error

// compiler error message:
// Values of types Dog and Dog cannot be compared with == or !=
```

## 启用比较

有两种方法可以使用 Scala 3 `CanEqual` 类型类来启用这种比较。
对于像这样的简单情况，您的类可以*派生* `CanEqual` 类：

```scala
// Option 1
case class Dog(name: String) derives CanEqual
```

稍后您将看到，当您需要更多的灵活性时，您还可以使用以下语法：

```scala
// Option 2
case class Dog(name: String)
given CanEqual[Dog, Dog] = CanEqual.derived
```

现在，这两种方法中的任何一种都可以让 `Dog` 实例相互比较。

## 一个更真实的例子

在一个更真实的示例中，假设您有一家在线书店，并且想要允许或禁止比较实体书、打印的书和有声读物。
在 Scala 3 中，您首先启用多元平等性，如前面的示例所示：

```scala
// [1] add this import, or this command line flag: -language:strictEquality
import scala.language.strictEquality
```

然后像往常一样创建你的领域对象：

```scala
// [2] create your class hierarchy
trait Book:
    def author: String
    def title: String
    def year: Int

case class PrintedBook(
    author: String,
    title: String,
    year: Int,
    pages: Int
) extends Book

case class AudioBook(
    author: String,
    title: String,
    year: Int,
    lengthInMinutes: Int
) extends Book
```

最后，使用 `CanEqual` 定义您想要允许的比较：

```scala
// [3] create type class instances to define the allowed comparisons.
//     allow `PrintedBook == PrintedBook`
//     allow `AudioBook == AudioBook`
given CanEqual[PrintedBook, PrintedBook] = CanEqual.derived
given CanEqual[AudioBook, AudioBook] = CanEqual.derived

// [4a] comparing two printed books works as desired
val p1 = PrintedBook("1984", "George Orwell", 1961, 328)
val p2 = PrintedBook("1984", "George Orwell", 1961, 328)
println(p1 == p2)         // true

// [4b] you can’t compare a printed book and an audiobook
val pBook = PrintedBook("1984", "George Orwell", 1961, 328)
val aBook = AudioBook("1984", "George Orwell", 2006, 682)
println(pBook == aBook)   // compiler error
```

最后一行代码导致此编译器错误消息：

````
Values of types PrintedBook and AudioBook cannot be compared with == or !=
````

这就是多元相等性在编译时捕获非法类型比较的方式。

### 启用“PrintedBook == AudioBook”

这可以按需要工作，但在某些情况下，您可能希望允许将实体书与有声读物进行比较。
如果需要，请创建以下两个额外的相等比较：

```scala
// allow `PrintedBook == AudioBook`, and `AudioBook == PrintedBook`
given CanEqual[PrintedBook, AudioBook] = CanEqual.derived
given CanEqual[AudioBook, PrintedBook] = CanEqual.derived
```

现在，您可以将实体书与有声书进行比较，而不会出现编译错误：

```scala
println(pBook == aBook)   // false
println(aBook == pBook)   // false
```

#### 实现 “equals” 以使它们真正起作用

虽然现在允许进行这些比较，但它们将始终为 `false`，因为它们的 `equals` 方法不知道如何进行这些比较。
因此，解决方案是覆盖每个类的 `equals` 方法。
例如，当您覆盖 `AudioBook` 的 `equals` 方法时：

```scala
case class AudioBook(
    author: String,
    title: String,
    year: Int,
    lengthInMinutes: Int
) extends Book:
    // override to allow AudioBook to be compared to PrintedBook
    override def equals(that: Any): Boolean = that match
        case a: AudioBook =>
            if this.author == a.author
            && this.title == a.title
            && this.year == a.year
            && this.lengthInMinutes == a.lengthInMinutes
                then true else false
        case p: PrintedBook =>
            if this.author == p.author && this.title == p.title
                then true else false
        case _ =>
            false
```

您现在可以将 `AudioBook` 与 `PrintedBook` 进行比较：

```scala
println(aBook == pBook)   // true (works because of `equals` in `AudioBook`)
println(pBook == aBook)   // false
```

目前 `PrintedBook` 书没有 `equals` 方法，所以第二个比较返回 `false`。
要启用该比较，只需覆盖 `PrintedBook` 中的 `equals` 方法。

您可以在参考文档中找到有关[多元相等性][ref-equal] 的更多信息。


[ref-equal]: {{ site.scala3ref }}/contextual/multiversal-equality.html
