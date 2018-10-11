---
layout: tour
title: Multiple Parameter Lists (Currying)

discourse: false

partof: scala-tour

num: 9

language: zh-cn

next-page: case-classes
previous-page: nested-functions
---

方法可以定义多个参数列表，当一个方法使用较少的参数列表调用时，会产生一个新的函数，该函数接收剩余的参数列表作为其参数。这被称为[柯里化](https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96)。

这里有一个例子，在Scala集合中定义的特质[Traversable](/overviews/collections/trait-traversable.html)：

```
def foldLeft[B](z: B)(op: (B, A) => B): B
```

`foldLeft`从左到右，以此将一个二元运算`op`应用到初始值`z`和该迭代器（traversable)的所有元素上。以下是该函数的一个用例：

从初值0开始, 这里 `foldLeft` 将函数 `(m, n) => m + n` 依次应用到列表中的每一个元素和之前累积的值上。

```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
print(res) // 55
```

多参数列表有更复杂的调用语法，因此应该谨慎使用，建议的使用场景包括：

#### 单一的函数参数
   在某些情况下存在单一的函数参数时，例如上述例子`foldLeft`中的`op`，多参数列表可以使得传递匿名函数作为参数的语法更为简洁。如果不使用多参数列表，代码可能像这样：
   
```
numbers.foldLeft(0, {(m: Int, n: Int) => m + n})
```
   
   注意使用多参数列表时，我们还可以利用Scala的类型推断来让代码更加简洁（如下所示），而如果没有多参数列表，这是不可能的。
    
```
numbers.foldLeft(0)(_ + _)
```
   上述声明`numbers.foldLeft(0)(_ + _)`
   Above statement `numbers.foldLeft(0)(_ + _)` allows us to fix the parameter `z` and pass around a partial function and reuse it as shown below:
```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]())_

val squares = numberFunc((xs, x) => xs:+ x*x)
print(squares.toString()) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs:+ x*x*x)
print(cubes.toString())  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```

   Finally, `foldLeft` and `foldRight` can be used in any of the following terms,
```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

numbers.foldLeft(0)((sum, item) => sum + item) // Generic Form
numbers.foldRight(0)((sum, item) => sum + item) // Generic Form

numbers.foldLeft(0)(_+_) // Curried Form
numbers.foldRight(0)(_+_) // Curried Form

(0 /: numbers)(_+_) // Used in place of foldLeft
(numbers :\ 0)(_+_) // Used in place of foldRight
```   

   
#### Implicit parameters
   To specify certain parameters in a parameter list as `implicit`, multiple parameter lists should be used. An example of this is:

```
def execute(arg: Int)(implicit ec: ExecutionContext) = ???
```
    
