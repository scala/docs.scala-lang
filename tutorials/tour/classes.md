---
layout: tutorial
title: Classes

disqus: true

tutorial: scala-tour
num: 3
tutorial-next: traits
tutorial-previous: unified-types
---

Classes in Scala are static templates that can be instantiated into many objects at runtime.
Here is a class definition which defines a class `Point`:

```tut
class Point(var x: Int, var y: Int) {
  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }
  override def toString: String =
    "(" + x + ", " + y + ")"
}
```

Classes in Scala are parameterized with constructor arguments. The code above defines two constructor arguments, `x` and `y`; they are both visible in the whole body of the class.

The class also includes two methods, `move` and `toString`. `move` takes two integer arguments but does not return a value (the return type `Unit` corresponds to `void` in Java-like languages). `toString`, on the other hand, does not take any parameters but returns a `String` value. Since `toString` overrides the pre-defined `toString` method, it is tagged with the `override` keyword.

Note that in Scala, it isn't necessary to say `return` in order to return a value. The value returned from a method is simply the last value in the method body. In the case of the `toString` method above, the expression after the equals sign is evaluated and returned to the caller.

Classes are instantiated with the `new` primitive, as follows:

```tut
object Classes {
  def main(args: Array[String]) {
    val pt = new Point(1, 2)
    println(pt)
    pt.move(10, 10)
    println(pt)
  }
}
```

The program defines an executable application Classes in form of a top-level [singleton object](singleton-objects.html) with a `main` method. The `main` method creates a new `Point` and stores it in value `pt`. Note that values defined with the `val` construct are different from variables defined with the `var` construct (see class `Point` above) in that they do not allow updates; i.e. the value is constant.

Here is the output of the program:

```
(1, 2)
(11, 12)
```
