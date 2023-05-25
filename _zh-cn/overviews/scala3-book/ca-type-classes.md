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


_类型类_ 是一种抽象的参数化类型，它允许您在不使用子类型的情况下向任何封闭数据类型添加新行为。
如果你从 Java 那边过来，你可以把类型类当成像是 [`java.util.Comparator[T]`][comparator] 类。

> Oliveira 等人写的论文 [“Type Classes as Objects and Implicits”][typeclasses-paper] (2010) 讨论了在 Scala 中类型类背后的基本观点。
> 虽然论文用了旧的 Scala 版本，但其中的观点至今依然有用。

这在多用例中很有用，例如：

- 表达你不拥有的类型——来自标准库或第三方库——如何符合这种行为
- 为多种类型表达这种行为，而不涉及这些类型之间的子类型关系

类型类只是具有一个或多个参数的 traits，其实现在 Scala 3 中，由 `given` 实例提供，在 Scala 2 中用 `implicit` 值。

## 例子

例如，`Show` 是 Haskell 中众所周知的类型类，下面的代码显示了在 Scala 中实现它的一种方法。
如果您认为 Scala 类没有 `toString` 方法，您可以定义一个 `Show` 类型类，然后把此行为添加到任意的类，这个类是能够转换为自定义字符串。

### 类型类

创建类型类的第一步是声明具有一个或多个抽象方法的参数化 trait。
因为 `Showable` 只有一个名为 `show` 的方法，所以写成这样：

{% tabs 'definition' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
// a type class
trait Showable[A] {
  def show(a: A): String
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
// a type class
trait Showable[A]:
  extension(a: A) def show: String
```
{% endtab %}
{% endtabs %}

请注意，通常当你要定义 `Show` trait时，下面这样的办法接近普通的面向对象的办法：

{% tabs 'trait' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
// a trait
trait Show {
  def show: String
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
// a trait
trait Show:
  def show: String
```
{% endtab %}
{% endtabs %}

有几件重要的事情需要指出：

1. 像 `Showable` 这样的类型类有一个类型参数 `A` 来说明我们为哪种类型提供了 `show` 的实现；相反，像 `Show` 这样的传统的 trait 不会。
2. 要将 show 功能添加到特定类型 `A`，传统的 trait 需要 `A extends Show`，而对于类型类，我们需要实现 `Showable[A]`。
3. 在 Scala 3 中，为了在两个 `Showable` 中允许相同的方法调用语法来模仿 `Show`，我们将 `Showable.show` 定义为扩展方法。

### 实现具体实例

下一步是确定在应用程序中，`Showable` 适用于哪些类，然后为它们实现该行为。
例如，为这个 `Person` 类实现 `Showable`：

{% tabs 'person' %}
{% tab 'Scala 2 and 3' %}
```scala
case class Person(firstName: String, lastName: String)
```
{% endtab %}
{% endtabs %}

你将为 `Showable[Person]` 定义一个 _规范值_ ，例如下面的代码为 `Person` 类提供了一个 `Showable` 的实例：

{% tabs 'instance' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
implicit val showablePerson: Showable[Person] = new Showable[Person] {
  def show(p: Person): String =
    s"${p.firstName} ${p.lastName}"
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
given Showable[Person] with
  extension(p: Person) def show: String =
    s"${p.firstName} ${p.lastName}"
```
{% endtab %}
{% endtabs %}

### 使用类型类

现在你可以像这样使用这个类型类：

{% tabs 'usage' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
val person = Person("John", "Doe")
println(showablePerson.show(person))
```

注意，在实践中，类型类一般与类型未知的值一起使用，而不像下面章节展示的 `Person` 类。
{% endtab %}
{% tab 'Scala 3' %}
```scala
val person = Person("John", "Doe")
println(person.show)
```
{% endtab %}
{% endtabs %}

同样，如果 Scala 没有可用于每个类的 `toString` 方法，您可以使用此技术将 `Showable` 行为添加到您希望能够转换为 `String` 的任何类。

### 编写使用类型类的方法

与继承一样，您可以定义使用 `Showable` 作为类型参数的方法：

{% tabs 'method' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def showAll[A](as: List[A])(implicit showable: Showable[A]): Unit =
  as.foreach(a => println(showable.show(a)))

showAll(List(Person("Jane"), Person("Mary")))
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
def showAll[A: Showable](as: List[A]): Unit =
  as.foreach(x => println(a.show))

showAll(List(Person("Jane"), Person("Mary")))
```
{% endtab %}
{% endtabs %}

### 具有多种方法的类型类

请注意，如果要创建具有多个方法的类型类，则初始语法如下所示：

{% tabs 'multiple-methods' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
trait HasLegs[A] {
  def walk(a: A): Unit
  def run(a: A): Unit
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
trait HasLegs[A]:
  extension (a: A)
    def walk(): Unit
    def run(): Unit
```
{% endtab %}
{% endtabs %}

### 一个真实的例子

有关如何在 Scala 3 中使用类型类的真实示例，请参阅[多元相等性部分][multiversal]中的 `CanEqual` 讨论。

[typeclasses-paper]: https://infoscience.epfl.ch/record/150280/files/TypeClasses.pdf
[typeclasses-chapter]: {% link _overviews/scala3-book/ca-type-classes.md %}
[comparator]: https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html
[multiversal]: {% link _zh-cn/overviews/scala3-book/ca-multiversal-equality.md %}
