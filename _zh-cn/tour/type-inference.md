---
layout: tour
title: 类型推断
partof: scala-tour

num: 27

language: zh-cn

next-page: operators
previous-page: polymorphic-methods
---

Scala 编译器通常可以推断出表达式的类型，因此你不必显式地声明它。

## 省略类型

```scala mdoc
val businessName = "Montreux Jazz Café"
```
编译器可以发现 `businessName` 是 String 类型。 它的工作原理和方法类似：

```scala mdoc
def squareOf(x: Int) = x * x
```
编译器可以推断出方法的返回类型为 `Int`，因此不需要明确地声明返回类型。

对于递归方法，编译器无法推断出结果类型。 下面这个程序就是由于这个原因而编译失败：

```scala mdoc:fail
def fac(n: Int) = if (n == 0) 1 else n * fac(n - 1)
```

当调用 [多态方法](polymorphic-methods.html) 或实例化 [泛型类](generic-classes.html) 时，也不必明确指定类型参数。 Scala 编译器将从上下文和实际方法的类型/构造函数参数的类型推断出缺失的类型参数。

看下面两个例子：

```scala mdoc
case class MyPair[A, B](x: A, y: B)
val p = MyPair(1, "scala") // type: MyPair[Int, String]

def id[T](x: T) = x
val q = id(1)              // type: Int
```

编译器使用传给 `MyPair` 参数的类型来推断出 `A` 和 `B` 的类型。对于 `x` 的类型同样如此。

## 参数

编译器从不推断方法形式参数的类型。 但是，在某些情况下，当函数作为参数传递时，编译器可以推断出匿名函数形式参数的类型。

```scala mdoc
Seq(1, 3, 4).map(x => x * 2)  // List(2, 6, 8)
```

方法 map 的形式参数是 `f: A => B`。 因为我们把整数放在 `Seq` 中，编译器知道 `A` 是 `Int` 类型 (即 `x` 是一个整数)。 因此，编译器可以从 `x * 2` 推断出 `B` 是 `Int` 类型。

## 何时 _不要_ 依赖类型推断

通常认为，公开可访问的 API 成员应该具有显示类型声明以增加可读性。 因此，我们建议你将代码中向用户公开的任何 API 明确指定类型。

此外，类型推断有时会推断出太具体的类型。 假设我们这么写：

```scala
var obj = null
```

我们就不能进行重新赋值：

```scala mdoc:fail
obj = new AnyRef
```

它不能编译，因为 `obj` 推断出的类型是 `Null`。 由于该类型的唯一值是 `null`，因此无法分配其他的值。
