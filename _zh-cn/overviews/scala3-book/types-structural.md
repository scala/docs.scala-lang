---
title: 结构化类型
type: section
description: This section introduces and demonstrates structural types in Scala 3.
num: 55
previous-page: types-opaque-types
next-page: types-dependent-function

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


{% comment %}
NOTE: It would be nice to simplify this more.
{% endcomment %}


一些用例，例如建模数据库访问，在静态类型语言中比在动态类型语言中更尴尬。
使用动态类型语言，很自然地将行建模为记录或对象，并使用简单的点表示法选择条目，例如 `row.columnName`。

要在静态类型语言中获得相同的体验，需要为数据库操作产生的每个可能的行定义一个类——包括连接和投影产生的行——并设置一个方案以在行和代表它的类之间进行映射。

这需要大量样板文件，这导致开发人员将静态类型的优势换成更简单的方案，其中列名表示为字符串并传递给其他运算符，例如 `row.select("columnName")`。
这种方法即便放弃了静态类型的优点，也仍然不如动态类型的版本自然。

在您希望在动态上下文中支持简单的点表示法而又不失静态类型优势的情况下，结构化类型会有所帮助。
它们允许开发人员使用点表示法并配置应如何解析字段和方法。

## 例子

这是一个结构化类型 `Person` 的示例：

```scala
class Record(elems: (String, Any)*) extends Selectable:
  private val fields = elems.toMap
  def selectDynamic(name: String): Any = fields(name)

type Person = Record {
  val name: String
  val age: Int
}
```

`Person` 类型在其父类型 `Record` 中添加了一个_精细的改进_，它定义了 `name` 和 `age` 字段。
我们精细的改进是_构造的_，因为 `name` 和 `age` 没有在父类型中定义。
但是它们仍然作为 `Person` 类的成员存在。
例如，以下程序将打印 `"Emma is 42 years old."`：

```scala
val person = Record(
  "name" -> "Emma",
  "age" -> 42
).asInstanceOf[Person]

println(s"${person.name} is ${person.age} years old.")
```

本例中的父类型 `Record` 是一个通用类，可以在其 `elems` 参数中表示任意记录。
该参数是一个序列，该序列的元素是 `String` 类型的标签和 `Any` 类型的值组成的对。
当您将 `Person` 创建为 `Record` 时，您必须使用类型转换断言该记录定义了正确类型的正确字段。
`Record` 本身的类型太弱了，所以编译器在没有用户帮助的情况下无法知道这一点。
实际上，结构化类型与其底层通用表示之间的连接很可能由数据库层完成，因此最终用户没必要关注。

`Record` 扩展了标记 trait `scala.Selectable` 并定义了一个方法 `selectDynamic`，它将字段名称映射到其值。
通过调用此方法来选择结构化类型成员。
Scala 编译器把选择 `person.name` 和 `person.age` 翻译成：

```scala
person.selectDynamic("name").asInstanceOf[String]
person.selectDynamic("age").asInstanceOf[Int]
```

## 第二个例子

为了强化您刚刚看到的内容，这里有另一个名为 `Book` 的结构化类型，它表示您可能从数据库中读取的一本书：

```scala
type Book = Record {
  val title: String
  val author: String
  val year: Int
  val rating: Double
}
```

与 `Person` 一样，这是创建 `Book` 实例的方式：

```scala
val book = Record(
  "title" -> "The Catcher in the Rye",
  "author" -> "J. D. Salinger",
  "year" -> 1951,
  "rating" -> 4.5
).asInstanceOf[Book]
```

## 可选类

除了 `selectDynamic` 之外，`Selectable`类有时还会定义 `applyDynamic` 方法。
然后可以使用它来翻译是函数调用的结构成员。
因此，如果 `a` 是 `Selectable` 的一个实例，则像 `a.f(b, c)` 这样的结构调用将转换为：

```scala
a.applyDynamic("f")(b, c)
```

