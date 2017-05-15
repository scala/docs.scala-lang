---

title: Upper Type Bounds

disqus: true
layout: inner-page-no-masthead

tutorial: scala-tour
categories: tour
num: 20
next-page: lower-type-bounds
previous-page: variances
---

In Scala, [type parameters](generic-classes.html) and [abstract types](abstract-types.html) may be constrained by a type bound. Such type bounds limit the concrete values of the type variables and possibly reveal more information about the members of such types. An _upper type bound_ `T <: A` declares that type variable `T` refers to a subtype of type `A`.
Here is an example that demonstrates upper type bound for a type parameter of class `Cage`:

```tut
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

class Cage[P <: Pet](p: P) {
  def pet: P = p
}

object Main extends App {
  var dogCage = new Cage[Dog](new Dog)
  var catCage = new Cage[Cat](new Cat)
  /* Cannot put Lion in a cage as Lion is not a Pet. */
//  var lionCage = new Cage[Lion](new Lion)
}
```

An instance of class `Cage` may contain an animal with upper bound `Pet`. An animal of type `Lion` is not a pet and therefore cannot be put into a cage.

The usage of lower type bounds is discussed [here](lower-type-bounds.html).
