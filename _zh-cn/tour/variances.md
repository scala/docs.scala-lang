---
layout: tour
title: 型变
partof: scala-tour

num: 17

language: zh-cn

next-page: upper-type-bounds
previous-page: generic-classes
---

型变是复杂类型的子类型关系与其组件类型的子类型关系的相关性。 Scala支持 [泛型类](generic-classes.html) 的类型参数的型变注释，允许它们是协变的，逆变的，或在没有使用注释的情况下是不变的。 在类型系统中使用型变允许我们在复杂类型之间建立直观的连接，而缺乏型变则会限制类抽象的重用性。

```scala mdoc
class Foo[+A] // A covariant class
class Bar[-A] // A contravariant class
class Baz[A]  // An invariant class
```

### 协变

使用注释 `+A`，可以使一个泛型类的类型参数 `A` 成为协变。 对于某些类 `class List[+A]`，使 `A` 成为协变意味着对于两种类型 `A` 和 `B`，如果 `A` 是 `B` 的子类型，那么 `List[A]` 就是 `List[B]` 的子类型。 这允许我们使用泛型来创建非常有用和直观的子类型关系。

考虑以下简单的类结构：

```scala mdoc
abstract class Animal {
  def name: String
}
case class Cat(name: String) extends Animal
case class Dog(name: String) extends Animal
```

类型 `Cat` 和 `Dog` 都是 `Animal` 的子类型。 Scala 标准库有一个通用的不可变的类 `sealed abstract class List[+A]`，其中类型参数 `A` 是协变的。 这意味着 `List[Cat]` 是 `List[Animal]`，`List[Dog]` 也是 `List[Animal]`。 直观地说，猫的列表和狗的列表都是动物的列表是合理的，你应该能够用它们中的任何一个替换 `List[Animal]`。

在下例中，方法 `printAnimalNames` 将接受动物列表作为参数，并且逐行打印出它们的名称。 如果 `List[A]` 不是协变的，最后两个方法调用将不能编译，这将严重限制 `printAnimalNames` 方法的适用性。

```scala mdoc
object CovarianceTest extends App {
  def printAnimalNames(animals: List[Animal]): Unit = {
    animals.foreach { animal =>
      println(animal.name)
    }
  }

  val cats: List[Cat] = List(Cat("Whiskers"), Cat("Tom"))
  val dogs: List[Dog] = List(Dog("Fido"), Dog("Rex"))

  printAnimalNames(cats)
  // Whiskers
  // Tom

  printAnimalNames(dogs)
  // Fido
  // Rex
}
```

### 逆变

通过使用注释 `-A`，可以使一个泛型类的类型参数 `A` 成为逆变。 与协变类似，这会在类及其类型参数之间创建一个子类型关系，但其作用与协变完全相反。 也就是说，对于某个类 `class Writer[-A]` ，使 `A` 逆变意味着对于两种类型 `A` 和 `B`，如果 `A` 是 `B` 的子类型，那么 `Writer[B]` 是 `Writer[A]` 的子类型。

考虑在下例中使用上面定义的类 `Cat`，`Dog` 和 `Animal` ：

```scala mdoc
abstract class Printer[-A] {
  def print(value: A): Unit
}
```

这里 `Printer[A]` 是一个简单的类，用来打印出某种类型的 `A`。 让我们定义一些特定的子类：

```scala mdoc
class AnimalPrinter extends Printer[Animal] {
  def print(animal: Animal): Unit =
    println("The animal's name is: " + animal.name)
}

class CatPrinter extends Printer[Cat] {
  def print(cat: Cat): Unit =
    println("The cat's name is: " + cat.name)
}
```

如果 `Printer[Cat]` 知道如何在控制台打印出任意 `Cat`，并且 `Printer[Animal]` 知道如何在控制台打印出任意 `Animal`，那么 `Printer[Animal]` 也应该知道如何打印出 `Cat` 就是合理的。 反向关系不适用，因为 `Printer[Cat]` 并不知道如何在控制台打印出任意 `Animal`。 因此，如果我们愿意，我们应该能够用 `Printer[Animal]` 替换 `Printer[Cat]`，而使 `Printer[A]` 逆变允许我们做到这一点。

```scala mdoc
object ContravarianceTest extends App {
  val myCat: Cat = Cat("Boots")

  def printMyCat(printer: Printer[Cat]): Unit = {
    printer.print(myCat)
  }

  val catPrinter: Printer[Cat] = new CatPrinter
  val animalPrinter: Printer[Animal] = new AnimalPrinter

  printMyCat(catPrinter)
  printMyCat(animalPrinter)
}
```

这个程序的输出如下：

```
The cat's name is: Boots
The animal's name is: Boots
```

### 不变

默认情况下，Scala中的泛型类是不变的。 这意味着它们既不是协变的也不是逆变的。 在下例中，类 `Container` 是不变的。 `Container[Cat]` _不是_ `Container[Animal]`，反之亦然。

```scala mdoc
class Container[A](value: A) {
  private var _value: A = value
  def getValue: A = _value
  def setValue(value: A): Unit = {
    _value = value
  }
}
```

可能看起来一个 `Container[Cat]` 自然也应该是一个 `Container[Animal]`，但允许一个可变的泛型类成为协变并不安全。 在这个例子中，`Container` 是不变的非常重要。 假设 `Container` 实际上是协变的，下面的情况可能会发生：

```
val catContainer: Container[Cat] = new Container(Cat("Felix"))
val animalContainer: Container[Animal] = catContainer
animalContainer.setValue(Dog("Spot"))
val cat: Cat = catContainer.getValue // 糟糕，我们最终会将一只狗作为值分配给一只猫
```

幸运的是，编译器在此之前就会阻止我们。

### 其他例子

另一个可以帮助理解型变的例子是 Scala 标准库中的 `trait Function1[-T, +R]`。 `Function1` 表示具有一个参数的函数，其中第一个类型参数 `T` 表示参数类型，第二个类型参数 `R` 表示返回类型。 `Function1` 在其参数类型上是逆变的，并且在其返回类型上是协变的。 对于这个例子，我们将使用文字符号 `A => B` 来表示 `Function1[A, B]`。

假设前面使用过的类似 `Cat`，`Dog`，`Animal` 的继承关系，加上以下内容：

```scala mdoc
abstract class SmallAnimal extends Animal
case class Mouse(name: String) extends SmallAnimal
```

假设我们正在处理接受动物类型的函数，并返回他们的食物类型。 如果我们想要一个 `Cat => SmallAnimal`（因为猫吃小动物），但是给它一个 `Animal => Mouse`，我们的程序仍然可以工作。 直观地看，一个 `Animal => Mouse` 的函数仍然会接受一个 `Cat` 作为参数，因为 `Cat` 即是一个 `Animal`，并且这个函数返回一个 `Mouse`，也是一个 `SmallAnimal`。 既然我们可以安全地，隐式地用后者代替前者，我们可以说 `Animal => Mouse` 是 `Cat => SmallAnimal` 的子类型。

### 与其他语言的比较

某些与 Scala 类似的语言以不同的方式支持型变。 例如，Scala 中的型变注释与 C# 中的非常相似，在定义类抽象时添加型变注释（声明点型变）。 但是在Java中，当类抽象被使用时（使用点型变），才会给出型变注释。
