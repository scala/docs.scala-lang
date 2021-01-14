---
layout: tour
title: 复合类型
partof: scala-tour

num: 22

language: zh-cn

next-page: self-types
previous-page: abstract-type-members
---

有时需要表明一个对象的类型是其他几种类型的子类型。 在 Scala 中，这可以表示成 *复合类型*，即多个类型的交集。

假设我们有两个特质 `Cloneable` 和 `Resetable`：

```scala mdoc
trait Cloneable extends java.lang.Cloneable {
  override def clone(): Cloneable = {
    super.clone().asInstanceOf[Cloneable]
  }
}
trait Resetable {
  def reset: Unit
}
```

现在假设我们要编写一个方法 `cloneAndReset`，此方法接受一个对象，克隆它并重置原始对象：

```
def cloneAndReset(obj: ?): Cloneable = {
  val cloned = obj.clone()
  obj.reset
  cloned
}
```

这里出现一个问题，参数 `obj` 的类型是什么。 如果类型是 `Cloneable` 那么参数对象可以被克隆 `clone`，但不能重置 `reset`; 如果类型是 `Resetable` 我们可以重置 `reset` 它，但却没有克隆 `clone` 操作。 为了避免在这种情况下进行类型转换，我们可以将 `obj` 的类型同时指定为 `Cloneable` 和 `Resetable`。 这种复合类型在 Scala 中写成：`Cloneable with Resetable`。

以下是更新后的方法：

```
def cloneAndReset(obj: Cloneable with Resetable): Cloneable = {
  //...
}
```

复合类型可以由多个对象类型构成，这些对象类型可以有单个细化，用于缩短已有对象成员的签名。
格式为：`A with B with C ... { refinement }`

关于使用细化的例子参考 [通过混入（mixin）来组合类](mixin-class-composition.html)。
