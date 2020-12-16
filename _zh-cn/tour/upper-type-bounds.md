---
layout: tour
title: 类型上界
partof: scala-tour

num: 18

language: zh-cn

next-page: lower-type-bounds
previous-page: variances
---

在Scala中，[类型参数](generic-classes.html)和[抽象类型](abstract-type-members.html)都可以有一个类型边界约束。这种类型边界在限制类型变量实际取值的同时还能展露类型成员的更多信息。比如像`T <: A`这样声明的类型上界表示类型变量`T`应该是类型`A`的子类。下面的例子展示了类`PetContainer`的一个类型参数的类型上界。

```scala mdoc
abstract class Animal {
 def name: String
}

abstract class Pet extends Animal {}

class Cat extends Pet {
  override def name: String = "Cat"
}

class Dog extends Pet {
  override def name: String = "Dog"
}

class Lion extends Animal {
  override def name: String = "Lion"
}

class PetContainer[P <: Pet](p: P) {
  def pet: P = p
}

val dogContainer = new PetContainer[Dog](new Dog)
val catContainer = new PetContainer[Cat](new Cat)
```

```scala mdoc:fail
// this would not compile
val lionContainer = new PetContainer[Lion](new Lion)
```
类`PetContainer`接受一个必须是`Pet`子类的类型参数`P`。因为`Dog`和`Cat`都是`Pet`的子类，所以可以构造`PetContainer[Dog]`和`PetContainer[Cat]`。但在尝试构造`PetContainer[Lion]`的时候会得到下面的错误信息：

`type arguments [Lion] do not conform to class PetContainer's type parameter bounds [P <: Pet]`

这是因为`Lion`并不是`Pet`的子类。
