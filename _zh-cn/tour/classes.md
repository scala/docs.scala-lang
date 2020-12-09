---
layout: tour
title: 类
partof: scala-tour

num: 4

language: zh-cn

next-page: traits
previous-page: unified-types
topics: classes
prerequisite-knowledge: no-return-keyword, type-declaration-syntax, string-interpolation, procedures
---

Scala中的类是用于创建对象的蓝图，其中包含了方法、常量、变量、类型、对象、特质、类，这些统称为成员。类型、对象和特质将在后面的文章中介绍。

## 类定义
一个最简的类的定义就是关键字`class`+标识符，类名首字母应大写。
```scala mdoc
class User

val user1 = new User
```
关键字`new`被用于创建类的实例。`User`由于没有定义任何构造器，因而只有一个不带任何参数的默认构造器。然而，你通常需要一个构造器和类体。下面是类定义的一个例子：

```scala mdoc
class Point(var x: Int, var y: Int) {

  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }

  override def toString: String =
    s"($x, $y)"
}

val point1 = new Point(2, 3)
point1.x  // 2
println(point1)  // prints (2, 3)
```

`Point`类有4个成员：变量`x`和`y`，方法`move`和`toString`。与许多其他语言不同，主构造方法在类的签名中`(var x: Int, var y: Int)`。`move`方法带有2个参数，返回无任何意义的`Unit`类型值`()`。这一点与Java这类语言中的`void`相当。另外，`toString`方法不带任何参数但是返回一个`String`值。因为`toString`覆盖了[`AnyRef`](unified-types.html)中的`toString`方法，所以用了`override`关键字标记。

## 构造器

构造器可以通过提供一个默认值来拥有可选参数：

```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)

val origin = new Point  // x and y are both set to 0
val point1 = new Point(1)
println(point1.x)  // prints 1

```

在这个版本的`Point`类中，`x`和`y`拥有默认值`0`所以没有必传参数。然而，因为构造器是从左往右读取参数，所以如果仅仅要传个`y`的值，你需要带名传参。
```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)
val point2 = new Point(y=2)
println(point2.y)  // prints 2
```

这样的做法在实践中有利于使得表达明确无误。

## 私有成员和Getter/Setter语法
成员默认是公有（`public`）的。使用`private`访问修饰符可以在类外部隐藏它们。
```scala mdoc:nest
class Point {
  private var _x = 0
  private var _y = 0
  private val bound = 100

  def x = _x
  def x_= (newValue: Int): Unit = {
    if (newValue < bound) _x = newValue else printWarning
  }

  def y = _y
  def y_= (newValue: Int): Unit = {
    if (newValue < bound) _y = newValue else printWarning
  }

  private def printWarning = println("WARNING: Out of bounds")
}

val point1 = new Point
point1.x = 99
point1.y = 101 // prints the warning
```
在这个版本的`Point`类中，数据存在私有变量`_x`和`_y`中。`def x`和`def y`方法用于访问私有数据。`def x_=`和`def y_=`是为了验证和给`_x`和`_y`赋值。注意下对于setter方法的特殊语法：这个方法在getter方法的后面加上`_=`，后面跟着参数。

主构造方法中带有`val`和`var`的参数是公有的。然而由于`val`是不可变的，所以不能像下面这样去使用。
```scala mdoc:fail
class Point(val x: Int, val y: Int)
val point = new Point(1, 2)
point.x = 3  // <-- does not compile
```

不带`val`或`var`的参数是私有的，仅在类中可见。
```scala mdoc:fail
class Point(x: Int, y: Int)
val point = new Point(1, 2)
point.x  // <-- does not compile
```
