---
layout: tour
title: 多参数列表（柯里化）
partof: scala-tour

num: 9

language: zh-cn

next-page: case-classes
previous-page: nested-functions
---

方法可以定义多个参数列表，当使用较少的参数列表调用多参数列表的方法时，会产生一个新的函数，该函数接收剩余的参数列表作为其参数。这被称为[柯里化](https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96)。

下面是一个例子，在Scala集合 `trait TraversableOnce` 定义了 `foldLeft`

```scala mdoc:fail
def foldLeft[B](z: B)(op: (B, A) => B): B
```

`foldLeft`从左到右，以此将一个二元运算`op`应用到初始值`z`和该迭代器（traversable)的所有元素上。以下是该函数的一个用例：

从初值0开始, 这里 `foldLeft` 将函数 `(m, n) => m + n` 依次应用到列表中的每一个元素和之前累积的值上。

```scala mdoc
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
print(res) // 55
```

多参数列表有更复杂的调用语法，因此应该谨慎使用，建议的使用场景包括：

#### 单一的函数参数
   在某些情况下存在单一的函数参数时，例如上述例子`foldLeft`中的`op`，多参数列表可以使得传递匿名函数作为参数的语法更为简洁。如果不使用多参数列表，代码可能像这样：

```scala
numbers.foldLeft(0, {(m: Int, n: Int) => m + n})
```

   注意使用多参数列表时，我们还可以利用Scala的类型推断来让代码更加简洁（如下所示），而如果没有多参数列表，这是不可能的。

```scala mdoc
numbers.foldLeft(0)(_ + _)
```
   像上述语句这样，我们可以给定多参数列表的一部分参数列表（如上述的`z`）来形成一个新的函数（partially applied function），达到复用的目的，如下所示：

```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]())_

val squares = numberFunc((xs, x) => xs:+ x*x)
print(squares.toString()) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs:+ x*x*x)
print(cubes.toString())  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```

   最后，`foldLeft` 和 `foldRight` 可以按以下任意一种形式使用，
```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

numbers.foldLeft(0)((sum, item) => sum + item) // Generic Form
numbers.foldRight(0)((sum, item) => sum + item) // Generic Form

numbers.foldLeft(0)(_+_) // Curried Form
numbers.foldRight(0)(_+_) // Curried Form
```


#### 隐式（implicit）参数
   如果要指定参数列表中的某些参数为隐式（implicit），应该使用多参数列表。例如：

```scala
def execute(arg: Int)(implicit ec: ExecutionContext) = ???
```

