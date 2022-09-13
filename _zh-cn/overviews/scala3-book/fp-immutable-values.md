---
title: 不可变值
type: section
description: This section looks at the use of immutable values in functional programming.
num: 42
previous-page: fp-what-is-fp
next-page: fp-pure-functions
---


在纯函数式编程中，只使用不可变的值。
在 Scala 中，这意味着：

- 所有变量都创建为 `val` 字段
- 仅使用不可变的集合类，例如 `List`、`Vector` 和不可变的 `Map` 和 `Set` 类

只使用不可变变量会引发一个有趣的问题：如果一切都是不可变的，那么任何东西都如何改变？

当谈到使用集合时，一个答案是你不会改变现有的集合。相反，您将函数应用于现有集合以创建新集合。
这就是像 `map` 和 `filter` 这样的高阶函数的用武之地。

例如，假设你有一个名字列表——一个 `List[String]`——都是小写的，你想找到所有以字母 `"j"` 开头的名字，并且把找出来的名字大写。
在 FP 中，您编写以下代码：

```scala
val a = List("jane", "jon", "mary", "joe")
val b = a.filter(_.startsWith("j"))
         .map(_.capitalize)
```

如图所示，您不会改变原始列表 `a`。
相反，您将过滤和转换函数应用于 `a` 以创建一个新集合，并将该结果分配给新的不可变变量 `b` 。

同样，在 FP 中，您不会创建具有可变 `var` 构造函数参数的类。
也就是说，你不要这样写：

```scala
```scala
// don’t do this in FP
class Person(var firstName: String, var lastName: String)
             ---                    ---
```

相反，您通常创建 `case` 类，其构造函数参数默认为 `val`：

```scala
case class Person(firstName: String, lastName: String)
```

现在你创建一个 `Person` 实例作为 `val` 字段：

```scala
val reginald = Person("Reginald", "Dwight")
```

然后，当您需要对数据进行更改时，您可以使用 `case` 类附带的 `copy` 方法来“在制作副本时更新数据”，如下所示：

```scala
val elton = reginald.copy(
  firstName = "Elton",   // update the first name
  lastName = "John"      // update the last name
)
```

还有其他处理不可变集合和变量的技术，但希望这些示例能让您尝试一下这些技术。

> 根据您的需要，您可以创建枚举、traits 或类，而不是 `case` 类。
> 有关详细信息，请参阅[数据建模][modeling]一章。

[modeling]: {% link _overviews/scala3-book/domain-modeling-intro.md %}
