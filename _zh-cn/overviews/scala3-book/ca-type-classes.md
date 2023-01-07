---
title: 实现类型类
type: section
description: This page demonstrates how to create and use type classes in Scala 3.
language: zh-cn
num: 63
previous-page: ca-given-imports
next-page: ca-multiversal-equality

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


_类型类_是一种抽象的参数化类型，它允许您在不使用子类型的情况下向任何封闭数据类型添加新行为。
这在多用例中很有用，例如：

- 表达你不拥有的类型——来自标准库或第三方库——如何符合这种行为
- 为多种类型表达这种行为，而不涉及这些类型之间的子类型关系

在 Scala 3 中，类型类只是具有一个或多个参数的 traits，其实现由 `given` 实例提供。

## 例子

例如，`Show` 是 Haskell 中众所周知的类型类，下面的代码显示了在 Scala 3 中实现它的一种方法。
如果您认为 Scala 类没有 `toString` 方法，您可以定义一个 `Show` 类型类，然后把此行为添加到任意的类，这个类是能够转换为自定义字符串。

### 类型类

创建类型类的第一步是声明具有一个或多个抽象方法的参数化 trait。
因为 `Showable` 只有一个名为 `show` 的方法，所以写成这样：

```scala
// a type class
trait Showable[A]:
  extension(a: A) def show: String
```

这是 Scala 3 的说法，任何实现此 trait 的类型都必须定义 `show` 方法的工作方式。
请注意，语法非常接近普通的 trait：

```scala
// a trait
trait Show:
  def show: String
```

有几件重要的事情需要指出：

1. 像 `Showable` 这样的类型类有一个类型参数 `A` 来说明我们为哪种类型提供了 `show` 的实现；相反，像 `Show` 这样的正常特征不会。
2. 要将 show 功能添加到特定类型 `A`，正常 trait 需要 `A extends Show`，而对于类型类，我们需要实现 `Showable[A]`。
3. 为了在两个 `Showable` 中允许相同的方法调用语法来模仿 `Show`，我们将 `Showable.show` 定义为扩展方法。

### 实现具体实例

下一步是确定在应用程序中，`Showable` 适用于哪些类，然后为它们实现该行为。
例如，为这个 `Person` 类实现 `Showable`：

```scala
case class Person(firstName: String, lastName: String)
```

你将为 `Showable[Person]` 定义一个 `given` 值。
这段代码为 `Person` 类提供了一个 `Showable` 的具体实例：

```scala
given Showable[Person] with
  extension(p: Person) def show: String =
    s"${p.firstName} ${p.lastName}"
```

如图所示，这被定义为 `Person` 类的扩展方法，它使用 `show` 方法主体内的引用 `p`。

### 使用类型类

现在你可以像这样使用这个类型类：

```scala
val person = Person("John", "Doe")
println(person.show)
```

同样，如果 Scala 没有可用于每个类的 `toString` 方法，您可以使用此技术将 `Showable` 行为添加到您希望能够转换为 `String` 的任何类。

### 编写使用类型类的方法

与继承一样，您可以定义使用 `Showable` 作为类型参数的方法：

```scala
def showAll[S: Showable](xs: List[S]): Unit =
  xs.foreach(x => println(x.show))

showAll(List(Person("Jane"), Person("Mary")))
```

### 具有多种方法的类型类

请注意，如果要创建具有多个方法的类型类，则初始语法如下所示：

```scala
trait HasLegs[A]:
  extension (a: A)
    def walk(): Unit
    def run(): Unit
```

### 一个真实的例子

有关如何在 Scala 3 中使用类型类的真实示例，请参阅[多元相等性部分][multiversal]中的 `CanEqual` 讨论。


[multiversal]: {% link _zh-cn/overviews/scala3-book/ca-multiversal-equality.md %}
