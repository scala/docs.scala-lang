---
type: section
layout: multipage-overview
title: Abstract Classes
description: This page shows how to use abstract classes, including when and why you should use abstract classes.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 27
outof: 54
previous-page: traits-abstract-mixins
next-page: collections-101
---



Scala also has a concept of an abstract class that is similar to Java’s abstract class. But because traits are so powerful, you rarely need to use an abstract class. In fact, you only need to use an abstract class when:

- You want to create a base class that requires constructor arguments
- Your Scala code will be called from Java code



## Scala traits don’t allow constructor parameters

Regarding the first reason, Scala traits don’t allow constructor parameters:

```scala
// this won’t compile
trait Animal(name: String)
```

Therefore, you need to use an abstract class whenever a base behavior must have constructor parameters:

```scala
abstract class Animal(name: String)
```

However, be aware that a class can extend only one abstract class.



## When Scala code will be called from Java code

Regarding the second point — the second time when you’ll need to use an abstract class — because Java doesn’t know anything about Scala traits, if you want to call your Scala code from Java code, you’ll need to use an abstract class rather than a trait.



## Abstract class syntax

The abstract class syntax is similar to the trait syntax. For example, here’s an abstract class named `Pet` that’s similar to the `Pet` trait we defined in the previous lesson:

```scala
abstract class Pet (name: String) {
    def speak(): Unit = println("Yo")   // concrete implementation
    def comeToMaster(): Unit            // abstract method
}
```

Given that abstract `Pet` class, you can define a `Dog` class like this:

```scala
class Dog(name: String) extends Pet(name) {
    override def speak() = println("Woof")
    def comeToMaster() = println("Here I come!")
}
```

The REPL shows that this all works as advertised:

```scala
scala> val d = new Dog("Rover")
d: Dog = Dog@51f1fe1c

scala> d.speak
Woof

scala> d.comeToMaster
Here I come!
```

### Notice how `name` was passed along

All of that code is similar to Java, so we won’t explain it in detail. One thing to notice is how the `name` constructor parameter is passed from the `Dog` class constructor to the `Pet` constructor:

```scala
class Dog(name: String) extends Pet(name) {
```

Remember that `Pet` is declared to take `name` as a constructor parameter:

```scala
abstract class Pet (name: String) { ...
```

Therefore, this example shows how to pass the constructor parameter from the `Dog` class to the `Pet` abstract class. You can verify that this works with this code:

```scala
abstract class Pet (name: String) {
    def speak: Unit = println(s"My name is $name")
}

class Dog(name: String) extends Pet(name)

val d = new Dog("Fido")
d.speak
```

We encourage you to copy and paste that code into the REPL to be sure that it works as expected, and then experiment with it as desired.








