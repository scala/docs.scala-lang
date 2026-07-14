---
layout: tour
title: Traits
partof: scala-tour

num: 7
next-page: tuples
previous-page: named-arguments
topics: traits
prerequisite-knowledge: expressions, classes, generics, objects, companion-objects

redirect_from: "/tutorials/tour/traits.html"
---

Traits are used to represent shared aspects of multiple types. They are similar to Java's interfaces.

A trait may contain members which may be abstract or concrete. "Concrete" means the trait includes an implementation for that member.

A trait can be extended by classes, objects, and other traits. Extending multiple traits is allowed. A trait may extend a class.

## Defining a trait

A minimal trait is simply the keyword `trait` and an identifier:

{% tabs trait-hair-color %}
{% tab 'Scala 2 and 3' for=trait-hair-color %}
```scala mdoc
trait HairColor
```
{% endtab %}
{% endtabs %}

Traits become especially useful as generic types and with abstract methods.

{% tabs trait-iterator-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=trait-iterator-definition %}
```scala mdoc
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}
```
{% endtab %}

{% tab 'Scala 3' for=trait-iterator-definition %}
```scala
trait Iterator[A]:
  def hasNext: Boolean
  def next(): A
```
{% endtab %}

{% endtabs %}

Extending the `trait Iterator[A]` requires a type `A` and implementations of the methods `hasNext` and `next`.

## Using traits
Use the `extends` keyword to extend a trait. Then implement any abstract members of the trait using the `override` keyword:

{% tabs trait-intiterator-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=trait-intiterator-definition %}
```scala mdoc:nest
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}

class IntIterator(to: Int) extends Iterator[Int] {
  private var current = 0
  override def hasNext: Boolean = current < to
  override def next(): Int = {
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
{% endtab %}

{% tab 'Scala 3' for=trait-intiterator-definition %}
```scala
trait Iterator[A]:
  def hasNext: Boolean
  def next(): A

class IntIterator(to: Int) extends Iterator[Int]:
  private var current = 0
  override def hasNext: Boolean = current < to
  override def next(): Int =
    if hasNext then
      val t = current
      current += 1
      t
    else
      0
end IntIterator

val iterator = IntIterator(10)
iterator.next()  // returns 0
iterator.next()  // returns 1
```
{% endtab %}

{% endtabs %}

This `IntIterator` class takes a parameter `to` as an upper bound. It `extends Iterator[Int]` which means that the `next` method must return an Int.

## Subtyping
Where a given trait is required, a subtype of the trait can be used instead.

{% tabs trait-pet-example class=tabs-scala-version %}

{% tab 'Scala 2' for=trait-pet-example %}
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
animals.foreach(pet => println(pet.name))  // prints Harry Sally
```
{% endtab %}

{% tab 'Scala 3' for=trait-pet-example %}
```scala
import scala.collection.mutable.ArrayBuffer

trait Pet:
  val name: String

class Cat(val name: String) extends Pet
class Dog(val name: String) extends Pet

val dog = Dog("Harry")
val cat = Cat("Sally")

val animals = ArrayBuffer.empty[Pet]
animals.append(dog)
animals.append(cat)
animals.foreach(pet => println(pet.name))  // prints Harry Sally
```
{% endtab %}

{% endtabs %}

The `trait Pet` has an abstract field `name` that gets implemented by `Cat` and `Dog` in their constructors. On the last line, we call `pet.name`, which must be implemented in any subtype of the trait `Pet`.

## Trait parameters

In Scala 3, a trait may accept constructor parameters:

{% tabs trait-parameter %}
{% tab 'Scala 3 only' for=trait-parameter %}
```scala mdoc
trait HasLegs(val legCount: Int)
class Spider extends HasLegs(8)
val boris = Spider()
println(boris.legCount)  // prints 8
```
{% endtab %}
{% endtabs %}

## More resources

* Learn more about traits in the [Scala Book](/scala3/book/domain-modeling-tools.html#traits)
* Use traits to define [Enum](/scala3/book/domain-modeling-fp.html#modeling-the-data)
