---
layout: tour
title: Variances
partof: scala-tour

num: 21
next-page: upper-type-bounds
previous-page: generic-classes

redirect_from: "/tutorials/tour/variances.html"
---

Variance lets you control how type parameters behave with regards to subtyping. Scala supports variance annotations of type parameters of [generic classes](generic-classes.html), to allow them to be covariant, contravariant, or invariant if no annotations are used. The use of variance in the type system allows us to make intuitive connections between complex types.

{% tabs variances_1 %}
{% tab 'Scala 2 and 3' for=variances_1 %}
```scala mdoc
class Foo[+A] // A covariant class
class Bar[-A] // A contravariant class
class Baz[A]  // An invariant class
```
{% endtab %}
{% endtabs %}

### Invariance

By default, type parameters in Scala are invariant: subtyping relationships between the type parameters aren't reflected in the parameterized type. To explore why this works the way it does, we look at a simple parameterized type, the mutable box.

{% tabs invariance_1 %}
{% tab 'Scala 2 and 3' for=invariance_1 %}
```scala mdoc
class Box[A](var content: A)
```
{% endtab %}
{% endtabs %}

We're going to be putting values of type `Animal` in it. This type is defined as follows:

{% tabs invariance_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=invariance_2 %}
```scala mdoc
abstract class Animal {
  def name: String
}
case class Cat(name: String) extends Animal
case class Dog(name: String) extends Animal
```
{% endtab %}
{% tab 'Scala 3' for=invariance_2 %}
```scala
abstract class Animal:
  def name: String

case class Cat(name: String) extends Animal
case class Dog(name: String) extends Animal
```
{% endtab %}
{% endtabs %}

We can say that `Cat` is a subtype of `Animal`, and that `Dog` is also a subtype of `Animal`. That means that the following is well-typed:

{% tabs invariance_3 %}
{% tab 'Scala 2 and 3' for=invariance_3 %}
```scala mdoc
val myAnimal: Animal = Cat("Felix")
```
{% endtab %}
{% endtabs %}

What about boxes? Is `Box[Cat]` a subtype of `Box[Animal]`, like `Cat` is a subtype of `Animal`? At first sight, it looks like that may be plausible, but if we try to do that, the compiler will tell us we have an error:

{% tabs invariance_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=invariance_4 %}
```scala mdoc:fail
val myCatBox: Box[Cat] = new Box[Cat](Cat("Felix"))
val myAnimalBox: Box[Animal] = myCatBox // this doesn't compile
val myAnimal: Animal = myAnimalBox.content
```
{% endtab %}
{% tab 'Scala 3' for=invariance_4 %}
```scala
val myCatBox: Box[Cat] = Box[Cat](Cat("Felix"))
val myAnimalBox: Box[Animal] = myCatBox // this doesn't compile
val myAnimal: Animal = myAnimalBox.content
```
{% endtab %}
{% endtabs %}

Why could this be a problem? We can get the cat from the box, and it's still an Animal, isn't it? Well, yes. But that's not all we can do. We can also replace the cat in the box with a different animal

{% tabs invariance_5 %}
{% tab 'Scala 2 and 3' for=invariance_5 %}
```scala
  myAnimalBox.content = Dog("Fido")
```
{% endtab %}
{% endtabs %}

There now is a Dog in the Animal box. That's all fine, you can put Dogs in Animal boxes, because Dogs are Animals. But our Animal Box is a Cat Box! You can't put a Dog in a Cat box. If we could, and then try to get the cat from our Cat Box, it would turn out to be a dog, breaking type soundness.

{% tabs invariance_6 %}
{% tab 'Scala 2 and 3' for=invariance_6 %}
```scala
  val myCat: Cat = myCatBox.content //myCat would be Fido the dog!
```
{% endtab %}
{% endtabs %}

From this, we have to conclude that `Box[Cat]` and `Box[Animal]` can't have a subtyping relationship, even though `Cat` and `Animal` do.

### Covariance

The problem we ran in to above, is that because we could put a Dog in an Animal Box, a Cat Box can't be an Animal Box.

But what if we couldn't put a Dog in the box? Then, we could just get our Cat back out without a problem, and it would adhere to the subtyping relationship. It turns out that that's possible to do.

{% tabs covariance_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=covariance_1 %}
```scala mdoc
class ImmutableBox[+A](val content: A)
val catbox: ImmutableBox[Cat] = new ImmutableBox[Cat](Cat("Felix"))
val animalBox: ImmutableBox[Animal] = catbox // now this compiles
```
{% endtab %}
{% tab 'Scala 3' for=covariance_1 %}
```scala
class ImmutableBox[+A](val content: A)
val catbox: ImmutableBox[Cat] = ImmutableBox[Cat](Cat("Felix"))
val animalBox: ImmutableBox[Animal] = catbox // now this compiles
```
{% endtab %}
{% endtabs %}

We say that `ImmutableBox` is *covariant* in `A`, and this is indicated by the `+` before the `A`.

More formally, that gives us the following relationship: given some `class Cov[+T]`, then if `A` is a subtype of `B`, `Cov[A]` is a subtype of `Cov[B]`. This allows us to make very useful and intuitive subtyping relationships using generics.

In the following less contrived example, the method `printAnimalNames` will accept a list of animals as an argument and print their names each on a new line. If `List[A]` were not covariant, the last two method calls would not compile, which would severely limit the usefulness of the `printAnimalNames` method.

{% tabs covariance_2 %}
{% tab 'Scala 2 and 3' for=covariance_2 %}
```scala mdoc
def printAnimalNames(animals: List[Animal]): Unit =
  animals.foreach {
    animal => println(animal.name)
  }

val cats: List[Cat] = List(Cat("Whiskers"), Cat("Tom"))
val dogs: List[Dog] = List(Dog("Fido"), Dog("Rex"))

// prints: Whiskers, Tom
printAnimalNames(cats)

// prints: Fido, Rex
printAnimalNames(dogs)
```
{% endtab %}
{% endtabs %}

### Contravariance

We've seen we can accomplish covariance by making sure that we can't put something in the covariant type, but only get something out. What if we had the opposite, something you can put something in, but can't take out? This situation arises if we have something like a serializer, that takes values of type A, and converts them to a serialized format.

{% tabs contravariance_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=contravariance_1 %}
```scala mdoc
abstract class Serializer[-A] {
  def serialize(a: A): String
}

val animalSerializer: Serializer[Animal] = new Serializer[Animal] {
  def serialize(animal: Animal): String = s"""{ "name": "${animal.name}" }"""
}
val catSerializer: Serializer[Cat] = animalSerializer
catSerializer.serialize(Cat("Felix"))
```
{% endtab %}
{% tab 'Scala 3' for=contravariance_1 %}
```scala
abstract class Serializer[-A]:
  def serialize(a: A): String

val animalSerializer: Serializer[Animal] = new Serializer[Animal]():
  def serialize(animal: Animal): String = s"""{ "name": "${animal.name}" }"""

val catSerializer: Serializer[Cat] = animalSerializer
catSerializer.serialize(Cat("Felix"))
```
{% endtab %}
{% endtabs %}

We say that `Serializer` is *contravariant* in `A`, and this is indicated by the `-` before the `A`. A more general serializer is a subtype of a more specific serializer.

More formally, that gives us the reverse relationship: given some `class Contra[-T]`, then if `A` is a subtype of `B`, `Contra[B]` is a subtype of `Contra[A]`.

### Immutability and Variance
Immutability constitutes an important part of the design decision behind using variance. For example, Scala's collections systematically distinguish between [mutable and immutable collections](https://docs.scala-lang.org/overviews/collections-2.13/overview.html). The main issue is that a covariant mutable collection can break type safety. This is why `List` is a covariant collection, while `scala.collection.mutable.ListBuffer` is an invariant collection. `List` is a collection in package `scala.collection.immutable`, therefore it is guaranteed to be immutable for everyone. Whereas, `ListBuffer` is mutable, that is, you can change, add, or remove elements of a `ListBuffer`.

To illustrate the problem of covariance and mutability, suppose that `ListBuffer` was covariant, then the following problematic example would compile (in reality it fails to compile):

{% tabs immutability_and_variance_2 %}
{% tab 'Scala 2 and 3' %}
```scala mdoc:fail
import scala.collection.mutable.ListBuffer

val bufInt: ListBuffer[Int] = ListBuffer[Int](1,2,3)
val bufAny: ListBuffer[Any] = bufInt
bufAny(0) = "Hello"
val firstElem: Int = bufInt(0)
```
{% endtab %}
{% endtabs %}

If the above code was possible then evaluating `firstElem` would fail with `ClassCastException`, because `bufInt(0)` now contains a `String`, not an `Int`.

The invariance of `ListBuffer` means that `ListBuffer[Int]` is not a subtype of `ListBuffer[Any]`, despite the fact that `Int` is a subtype of `Any`, and so `bufInt` cannot be assigned as the value of `bufAny`.

### Comparison With Other Languages

Variance is supported in different ways by some languages that are similar to Scala. For example, variance annotations in Scala closely resemble those in C#, where the annotations are added when a class abstraction is defined (declaration-site variance). In Java, however, variance annotations are given by clients when a class abstraction is used (use-site variance).

Scala's tendency towards immutable types makes it that covariant and contravariant types are more common than in other languages, since a mutable generic type must be invariant.
