---
layout: tour
title: 特质
partof: scala-tour

num: 5

language: zh-cn

next-page: tuples
previous-page: classes
topics: traits
prerequisite-knowledge: expressions, classes, generics, objects, companion-objects
---

特质 (Traits) 用于在类 (Class)之间共享程序接口 (Interface)和字段 (Fields)。 它们类似于Java 8的接口。 类和对象 (Objects)可以扩展特质，但是特质不能被实例化，因此特质没有参数。



## 定义一个特质
最简化的特质就是关键字trait+标识符：

```scala mdoc
trait HairColor
```

特征作为泛型类型和抽象方法非常有用。
```scala mdoc
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}
```

扩展 `trait Iterator [A]` 需要一个类型 `A` 和实现方法`hasNext`和`next`。

## 使用特质
使用 `extends` 关键字来扩展特征。然后使用 `override` 关键字来实现trait里面的任何抽象成员：

```scala mdoc:nest
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}

class IntIterator(to: Int) extends Iterator[Int] {
  private var current = 0
  override def hasNext: Boolean = current < to
  override def next(): Int =  {
    if (hasNext) {
      val t = current
      current += 1
      t
    } else 0
  }
}


val iterator = new IntIterator(10)
iterator.next()  // returns 0
iterator.next()  // returns 1
```
这个类 `IntIterator` 将参数 `to` 作为上限。它扩展了 `Iterator [Int]`，这意味着方法 `next` 必须返回一个Int。

## 子类型
凡是需要特质的地方，都可以由该特质的子类型来替换。
```scala mdoc
import scala.collection.mutable.ArrayBuffer

trait Pet {
  val name: String
}

class Cat(val name: String) extends Pet
class Dog(val name: String) extends Pet

val dog = new Dog("Harry")
val cat = new Cat("Sally")

val animals = ArrayBuffer.empty[Pet]
animals.append(dog)
animals.append(cat)
animals.foreach(pet => println(pet.name))  // Prints Harry Sally
```
在这里 `trait Pet` 有一个抽象字段 `name` ，`name` 由Cat和Dog的构造函数中实现。最后一行，我们能调用`pet.name`的前提是它必须在特质Pet的子类型中得到了实现。
