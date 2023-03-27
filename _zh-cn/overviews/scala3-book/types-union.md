---
title: 联合类型
type: section
description: This section introduces and demonstrates union types in Scala 3.
language: zh-cn
num: 51
previous-page: types-intersection
next-page: types-adts-gadts

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


用于类型，`|` 操作符创建一个所谓的_联合类型_。
类型 `A | B` 表示**要么是** `A` 类型的值，**要么是** `B` 类型的值。

在下面的例子中，`help` 方法接受一个名为 `id` 的联合类型 `Username | Password`，可以是 `Useername` 或 `Password`：

```scala
case class Username(name: String)
case class Password(hash: Hash)

def help(id: Username | Password) =
  val user = id match
    case Username(name) => lookupName(name)
    case Password(hash) => lookupPassword(hash)
  // more code here ...
```

我们通过使用模式匹配区分二者，从而实现 `help` 方法。

此代码是一种灵活且类型安全的解决方案。
如果您尝试传入`Useername` 或 `Password` 以外的类型，编译器会将其标记为错误：

```scala
help("hi")   // error: Found: ("hi" : String)
             //        Required: Username | Password
```

如果您尝试将 `case` 添加到与 `Username` 或 `Password` 类型不匹配的 `match` 表达式中，也会出现错误：

```scala
case 1.0 => ???   // ERROR: this line won’t compile
```

### 联合类型的替代方案

如图所示，联合类型可用于替代几种不同的类型，而不要求这些类型是定制类层次结构的一部分，也不需要显式包装。

#### 预先规划类层次结构

其他语言需要预先规划类层次结构，如下例所示：

```scala
trait UsernameOrPassword
case class Username(name: String) extends UsernameOrPassword
case class Password(hash: Hash) extends UsernameOrPassword
def help(id: UsernameOrPassword) = ...
```

预先计划不能很好地扩展，例如，API 用户的需求可能无法预见。
此外，使用诸如 `UsernameOrPassword` 之类的标记 trait 使类型层次结构混乱也会使代码更难阅读。

#### 标记联合

另一种选择是定义一个单独的枚举类型，如：

```scala
enum UsernameOrPassword:
  case IsUsername(u: Username)
  case IsPassword(p: Password)
```

枚举 `UsernameOrPassword` 表示 `Username` 和 `Password` 的 _标记_联合。
但是，这种联合建模方式需要_显式包装和展开_，例如，`Username` **不是** `UsernameOrPassword` 的子类型。

### 联合类型推断

_仅当_明确给出这种类型时，编译器才会将联合类型分配给表达式。
例如，给定这些值：

```scala
val name = Username("Eve")     // name: Username = Username(Eve)
val password = Password(123)   // password: Password = Password(123)
```

这个 REPL 示例展示了在将变量绑定到 `if`/`else` 表达式的结果时如何使用联合类型：

````
scala> val a = if (true) name else password
val a: Object = Username(Eve)

scala> val b: Password | Username = if (true) name else password
val b: Password | Username = Username(Eve)
````

`a` 的类型是 `Object`，它是 `Username` 和 `Password` 的超类型，但不是二者*最小*的超类型 `Password | Username`。
如果你想要最小的超类型，你必须明确地给出它，就像对 `b` 所做的那样。

> 联合类型是交集类型的对偶。
> 和具有交集类型的 `&` 一样，`|` 也是可交换的：`A | B` 与 `B | A` 是同一类型。

