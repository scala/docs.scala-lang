---
title: Implementing Type Classes
type: section
description: This page demonstrates how to create and use type classes in Scala 3.
num: 64
previous-page: ca-extension-methods
next-page: ca-multiversal-equality
---


A _type class_ is an abstract, parameterized type that lets you add new behavior to any closed data type without using sub-typing.
This is useful in multiple use-cases, for example:

- Expressing how a type you don’t own---from the standard library or a third-party library---conforms to such behavior
- Expressing such a behavior for multiple types without involving sub-typing relationships between those types

In Scala 3, type classes are just traits with one or more parameters whose implementations are provided by `given` instances.



## Example

For example, `Show` is a well-known type class in Haskell, and the following code shows one way to implement it in Scala 3.
If you imagine that Scala classes don’t have a `toString` method, you can define a `Show` type class to add this behavior to any class that you want to be able to convert to a custom string.

### The type class

The first step in creating a type class is to declare a parameterized trait that has one or more abstract methods.
Because `Showable` only has one method named `show`, it’s written like this:

```scala
// a type class
trait Showable[A]:
  extension(a: A) def show: String
```

This is the Scala 3 way of saying that any type that implements this trait must define how the `show` method works.
Notice that the syntax is very close to a normal trait:

```scala
// a trait
trait Show:
  def show: String
```

There are a few important things to point out:

1. Type-classes like `Showable` take a type parameter `A` to say which type we provide the implementation of `show` for; in contrast, normal traits like `Show` do not.
2. To add the show functionality to a certain type `A`, the normal trait requires that `A extends Show`, while for type-classes we require to have an implementation of `Showable[A]`.
3. To allow the same method calling syntax in both `Showable` that mimics the one of `Show`, we define `Showable.show` as an extension method.

### Implement concrete instances

The next step is to determine what classes in your application `Showable` should work for, and then implement that behavior for them.
For instance, to implement `Showable` for this `Person` class:

```scala
case class Person(firstName: String, lastName: String)
```

you’ll define a `given` value for `Showable[Person]`.
This code provides a concrete instance of `Showable` for the `Person` class:

```scala
given Showable[Person] with
  extension(p: Person) def show: String =
    s"${p.firstName} ${p.lastName}"
```

As shown, this is defined as an extension method on the `Person` class, and it uses the reference `p` inside the body of the `show` method.

### Using the type class

Now you can use this type class like this:

```scala
val person = Person("John", "Doe")
println(person.show)
```

Again, if Scala didn’t have a `toString` method available to every class, you could use this technique to add `Showable` behavior to any class that you want to be able to convert to a `String`.

### Writing methods that use the type class

As with inheritance, you can define methods that use `Showable` as a type parameter:

```scala
def showAll[S: Showable](xs: List[S]): Unit =
  xs.foreach(x => println(x.show))

showAll(List(Person("Jane"), Person("Mary")))
```

### A type class with multiple methods

Note that if you want to create a type class that has multiple methods, the initial syntax looks like this:

```scala
trait HasLegs[A]:
  extension (a: A)
    def walk(): Unit
    def run(): Unit
```

### A real-world example

For a real-world example of how type classes are used in Scala 3, see the `CanEqual` discussion in the [Multiversal Equality section][multiversal].


[multiversal]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
