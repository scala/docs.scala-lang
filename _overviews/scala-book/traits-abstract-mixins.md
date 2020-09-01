---
type: section
layout: multipage-overview
title: Using Scala Traits Like Abstract Classes
description: This page shows how to use Scala traits just like abstract classes in Java, with examples of concrete and abstract methods.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 26
outof: 54
previous-page: traits-interfaces
next-page: abstract-classes
---


In the previous lesson we showed how to use Scala traits like the original Java interface, but they have much more functionality than that. You can also add real, working methods to them and use them like abstract classes, or more accurately, as *mixins*.



## A first example

To demonstrate this, here’s a Scala trait that has a concrete method named `speak`, and an abstract method named `comeToMaster`:

```scala
trait Pet {
    def speak = println("Yo")     // concrete implementation of a speak method
    def comeToMaster(): Unit      // abstract
}
```

When a class extends a trait, each abstract method must be implemented, so here’s a class that extends `Pet` and defines `comeToMaster`:

```scala
class Dog(name: String) extends Pet {
    def comeToMaster(): Unit = println("Woo-hoo, I'm coming!")
}
```

Unless you want to override `speak`, there’s no need to redefine it, so this is a perfectly complete Scala class. Now you can create a new `Dog` like this:

```scala
val d = new Dog("Zeus")
```

Then you can call `speak` and `comeToMaster`. This is what it looks like in the REPL:

```scala
scala> val d = new Dog("Zeus")
d: Dog = Dog@4136cb25

scala> d.speak
Yo

scala> d.comeToMaster
Woo-hoo, I'm coming!
```


## Overriding an implemented method

A class can also override a method that’s defined in a trait. Here’s an example:

```scala
class Cat extends Pet {
    // override 'speak'
    override def speak(): Unit = println("meow")
    def comeToMaster(): Unit = println("That's not gonna happen.")
}
```

The REPL shows how this works:

```scala
scala> val c = new Cat
c: Cat = Cat@1953f27f

scala> c.speak
meow

scala> c.comeToMaster
That's not gonna happen.
```



## Mixing in multiple traits that have behaviors

A great thing about Scala traits is that you can mix multiple traits that have behaviors into classes. For example, here’s a combination of traits, one of which defines an abstract method, and the others that define concrete method implementations:

```scala
trait Speaker {
    def speak(): String   //abstract
}

trait TailWagger {
    def startTail(): Unit = println("tail is wagging")
    def stopTail(): Unit = println("tail is stopped")
}

trait Runner {
    def startRunning(): Unit = println("I'm running")
    def stopRunning(): Unit = println("Stopped running")
}
```

Now you can create a `Dog` class that extends all of those traits while providing behavior for the `speak` method:

```scala
class Dog(name: String) extends Speaker with TailWagger with Runner {
    def speak(): String = "Woof!"
}
```

And here’s a `Cat` class:

```scala
class Cat extends Speaker with TailWagger with Runner {
    def speak(): String = "Meow"
    override def startRunning(): Unit = println("Yeah ... I don't run")
    override def stopRunning(): Unit = println("No need to stop")
}
```

The REPL shows that this all works like you’d expect it to work. First, a `Dog`:

```scala
scala> d.speak
res0: String = Woof!

scala> d.startRunning
I'm running

scala> d.startTail
tail is wagging
```

Then a `Cat`:

```scala
scala> val c = new Cat
c: Cat = Cat@1b252afa

scala> c.speak
res1: String = Meow

scala> c.startRunning
Yeah ... I don't run

scala> c.startTail
tail is wagging
```



## Mixing traits in on the fly

As a last note, a very interesting thing you can do with traits that have concrete methods is mix them into classes on the fly. For example, given these traits:

```scala
trait TailWagger {
    def startTail(): Unit = println("tail is wagging")
    def stopTail(): Unit = println("tail is stopped")
}

trait Runner {
    def startRunning(): Unit = println("I'm running")
    def stopRunning(): Unit = println("Stopped running")
}
```

and this `Dog` class:

```scala
class Dog(name: String)
```

you can create a `Dog` instance that mixes in those traits when you create a `Dog` instance:

```scala
val d = new Dog("Fido") with TailWagger with Runner
                        ---------------------------
```

Once again the REPL shows that this works:

```scala
scala> val d = new Dog("Fido") with TailWagger with Runner 
d: Dog with TailWagger with Runner = $anon$1@50c8d274

scala> d.startTail
tail is wagging

scala> d.startRunning
I'm running
```

This example works because all of the methods in the `TailWagger` and `Runner` traits are defined (they’re not abstract).









