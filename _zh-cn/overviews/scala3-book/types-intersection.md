---
title: 交集类型
type: section
description: This section introduces and demonstrates intersection types in Scala 3.
num: 50
previous-page: types-generics
next-page: types-union
---


用于类型，`&` 运算符创建一个所谓的_交集类型_。
`A & B` 类型表示同时是 `A` 类型和 `B` 类型**两者**的值。
例如，以下示例使用交集类型 `Resettable & Growable[String]`：

```scala
trait Resettable:
  def reset(): Unit

trait Growable[A]:
  def add(a: A): Unit

def f(x: Resettable & Growable[String]): Unit =
  x.reset()
  x.add("first")
```

在本例中的方法 `f` 中，参数 `x` 必须*同时*既是 `Resettable` 也是 `Growable[String]`。

交集类型 `A & B` 的_成员_既有 `A` 的所有成员，也有 `B` 的所有成员。
因此，如图所示，`Resettable & Growable[String]` 具有成员方法 `reset` 和 `add`。

交集类型可用于_结构性_地描述需求。
也就是说，在我们的示例 `f` 中，我们直接表示只要 `x` 是 `Resettable` 和 `Growable` 的子类型的任意值， 我们就感到满意。
我们**不**需要创建一个_通用_的辅助 trait，如下所示：

```scala
trait Both[A] extends Resettable, Growable[A]
def f(x: Both[String]): Unit
```

定义 `f` 的两种选择之间有一个重要区别：虽然两者都允许使用 `Both` 的实例调用 `f`，但只有前者允许传递属于 `Resettable` 和 `Growable[String]` 子类型的实例，后者 `Both[String]` _不允许_。

> 请注意，`&` 是_可交换的_：`A & B` 与 `B & A` 的类型相同。
