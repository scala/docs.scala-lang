---
layout: multipage-overview
title: Using Scala Traits as Interfaces
description: This page shows how to use Scala traits just like Java interfaces, including several examples.
partof: hello_scala
overview-name: Hello, Scala
num: 25
---

## Using Scala Traits as Interfaces

One way to use a Scala `trait` is like a Java `interface`, where you define the desired interface for some piece of functionality, but you don’t implement any behavior.



## A simple example

As an example to get us started, imagine that you want to write some code to model animals like dogs and cats, any animal that has a tail. In Scala you write a trait to start that modeling process like this:

```scala
trait TailWagger {
    def startTail(): Unit
    def stopTail(): Unit
}
```

That code declares a trait named `TailWagger` that states that any class that extends `TailWagger` should implement `startTail` and `stopTail` methods. Both of those methods take no input parameters and have no return value. This code is equivalent to this Java interface:

```java
public interface TailWagger {
    public void startTail();
    public void stopTail();
}
```



## Extending a trait

Given this trait:

```scala
trait TailWagger {
    def startTail(): Unit
    def stopTail(): Unit
}
```

you can write a class that extends the trait and implements those methods like this:

```scala
class Dog extends TailWagger {
    // the implemented methods
    def startTail(): Unit = { println("tail is wagging") }
    def stopTail(): Unit = { println("tail is stopped") }
}
```

Notice that you use the `extends` keyword to create a class that extends a single trait.

If you paste the `TailWagger` trait and `Dog` class into the Scala REPL, you can then test the code like this:

```scala
scala> val d = new Dog
d: Dog = Dog@234e9716

scala> d.startTail
tail is wagging

scala> d.stopTail
tail is stopped
```

That demonstrates how you implement a single Scala trait with a class that extends the trait.



## Extending multiple traits

Scala lets you create very modular code with traits. For example, you can break down the attributes of animals into small, logical, modular units:

```scala
trait Speaker {
    def speak(): String
}

trait TailWagger {
    def startTail(): Unit
    def stopTail(): Unit
}

trait Runner {
    def startRunning(): Unit
    def stopRunning(): Unit
}
```

Once you have those small pieces, you can create a `Dog` class by extending all of them, and implementing the necessary methods:

```scala
class Dog extends Speaker with TailWagger with Runner {

    // Speaker
    def speak(): String = "Woof!"

    // TailWagger
    def startTail(): Unit = { println("tail is wagging") }
    def stopTail(): Unit = { println("tail is stopped") }

    // Runner
    def startRunning(): Unit = { println("I'm running") }
    def stopRunning(): Unit = { println("Stopped running") }

}
```

Key points of this code:

- Use `extends` to extend the first trait
- Use `with` to extend subsequent traits

From what you’ve seen so far, Scala traits work just like Java interfaces. But there’s more ...



<!--
## Extending Java interfaces

Can also use Java interfaces in the same way. Java interfaces:

    // java
    public interface Animal {
      public void speak();
    }

    public interface Wagging {
      public void wag();
    }

    public interface Running {
      public void run();
    }

Create a Scala class with those interfaces:

    // scala
    class Dog extends Animal with Wagging with Running {
      def speak { println("Woof") }
      def wag { println("Tail is wagging!") }
      def run { println("I'm running!") }
    }

Key points:

- Java interfaces can be used just like Scala traits.
-->



<!--
## See also

https://alvinalexander.com/scala/scala-trait-examples

https://alvinalexander.com/scala/how-to-use-scala-trait-like-java-interface-cookbook-->


















