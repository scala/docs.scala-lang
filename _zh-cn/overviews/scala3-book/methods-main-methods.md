---
title: main 方法
type: section
description: This page describes how 'main' methods and the '@main' annotation work in Scala 3.
language: zh-cn
num: 25
previous-page: methods-most
next-page: methods-summary

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


Scala 3 提供了一种定义可以从命令行调用的程序的新方法：在方法中添加 `@main` 注释会将其变成可执行程序的入口点：

```scala
@main def hello() = println("Hello, world")
```

只需将该行代码保存在一个名为 *Hello.scala* 的文件中——文件名不必与方法名匹配——并使用 `scalac` 编译它：

```bash
$ scalac Hello.scala
```

然后用 `scala` 运行它：

```bash
$ scala hello
Hello, world
```

`@main` 注释方法可以写在顶层（如图所示），也可以写在静态可访问的对象中。
在任何一种情况下，程序的名称都是方法的名称，没有任何对象前缀。

### 命令行参数

使用这种方法，您的`@main` 方法可以处理命令行参数，并且这些参数可以有不同的类型。
例如，给定这个 `@main` 方法，它接受一个 `Int`、一个 `String` 和一个可变参数 `String*` 参数：

```scala
@main def happyBirthday(age: Int, name: String, others: String*) =
  val suffix = (age % 100) match
    case 11 | 12 | 13 => "th"
    case _ => (age % 10) match
      case 1 => "st"
      case 2 => "nd"
      case 3 => "rd"
      case _ => "th"

  val sb = StringBuilder(s"Happy $age$suffix birthday, $name")
  for other <- others do sb.append(" and ").append(other)
  sb.toString
```

当你编译该代码时，它会创建一个名为 `happyBirthday` 的主程序，它的调用方式如下：

```
$ scala happyBirthday 23 Lisa Peter
Happy 23rd Birthday, Lisa and Peter!
```

如图所示，`@main` 方法可以有任意数量的参数。
对于每个参数类型，必须有一个 *scala.util.FromString* 类型类的实例，它将参数 `String` 转换为所需的参数类型。
同样如图所示，主方法的参数列表可以以重复参数结尾，例如 `String*`，它接受命令行中给出的所有剩余参数。

从 `@main` 方法实现的程序检查命令行上是否有足够的参数来填充所有参数，以及参数字符串是否可以转换为所需的类型。
如果检查失败，程序将终止并显示错误消息：

```
$ scala happyBirthday 22
Illegal command line after first argument: more arguments expected

$ scala happyBirthday sixty Fred
Illegal command line: java.lang.NumberFormatException: For input string: "sixty"
```

## 细节

Scala 编译器从 `@main` 方法 `f` 生成程序，如下所示：

- 它在有 `@main` 方法的包中创建一个名为 `f` 的类。
- 该类有一个静态方法 `main`，具有 Java `main` 方法的通常签名：它以 `Array[String]` 作为参数并返回 `Unit`。
- 生成的 `main` 方法调用方法 `f` 并使用 `scala.util.CommandLineParser` 对象中的方法转换参数。

例如，上面的 `happyBirthday` 方法会生成与以下类等效的附加代码：

```scala
final class happyBirthday {
  import scala.util.{CommandLineParser as CLP}
  <static> def main(args: Array[String]): Unit =
    try
      happyBirthday(
          CLP.parseArgument[Int](args, 0),
          CLP.parseArgument[String](args, 1),
          CLP.parseRemainingArguments[String](args, 2))
    catch {
      case error: CLP.ParseError => CLP.showError(error)
    }
}
```

> **注意**：在这个生成的代码中，`<static>` 修饰符表示 `main` 方法是作为 `happyBirthday` 类的静态方法生成的。
> 此功能不适用于 Scala 中的用户程序。
> 常规“静态”成员在 Scala 中使用对象生成。

## Scala 3 与 Scala 2 的比较

`@main` 方法是在 Scala 3 中生成可以从命令行调用的程序的推荐方法。
它们取代了 Scala 2 中以前的方法，即创建一个扩展 `App` 类的 `object` ：

```scala
// scala 2
object happyBirthday extends App {
  // needs by-hand parsing of the command line arguments ...
}
```

之前依赖于“神奇”的 `DelayedInit` trait 的 `App` 功能不再可用。
`App` 目前仍以有限的形式存在，但它不支持命令行参数，将来会被弃用。

如果程序需要在 Scala 2 和 Scala 3 之间交叉构建，建议使用带有 `Array[String]` 参数的显式 `main` 方法：

```scala
object happyBirthday:
  def main(args: Array[String]) = println("Hello, world")
```

如果将该代码放在名为 *happyBirthday.scala* 的文件中，则可以使用 `scalac` 编译它并使用 `scala` 运行它，如前所示：

```bash
$ scalac happyBirthday.scala

$ scala happyBirthday
Hello, world
```

