---
title: Implementing Type Classes
type: section
description: This page demonstrates how to create and use type classes in Scala 3.
num: 43
previous-page: ca-extension-methods
next-page: ca-multiversal-equality
---


A *type class* is an abstract, parameterized type that lets you add new behavior to any closed data type without using sub-typing. This is useful in multiple use-cases, for example:

- Expressing how a type you don’t own — from the standard library or a third-party library — conforms to such behavior
- Expressing such a behavior for multiple types without involving sub-typing relationships between those types

In Scala 3, type classes are just traits with one or more parameters whose implementations are not defined through the `extends` keyword, but by `given` instances.


<!-- TODO: discuss where the name "type class" comes from -->
## Example

For example, `Show` is a well-known type class in Haskell, and the following code shows one way to implement it in Scala 3. If you imagine that Scala classes don’t have a `toString` method, you can define a `Show` type class to add that sort of behavior to any class that you want to be able to convert to a custom string.

### The type class

The first step in creating a type class is to declare a parameterized trait that has one or more abstract methods. Because `Show` only has one method named `show`, it’s written like this:

```scala
// a type class
trait Show[A]:
  extension(a: A) def show(): String
```

This is the Scala 3 way of saying that any type that implements this trait must define how the `show` method works. Notice that the syntax is very close to a normal trait:

```scala
// a trait
trait Show[A]:
  def show(): String   // does not use `extension`
```

The difference in their use is that (a) `extension` methods don’t require the use of traditional inheritance, while (b) a trait without an extension method does require that, e.g., `Dog extends Show`.

### Implement concrete instances

The next step is to determine what classes in your application `Show` should work for, and then implement that behavior for them. For instance, to implement `Show` for this `Person` class:

```scala
class Person(val firstName: String, val lastName: String)
```

you’ll define a `given` value for `Person`. This code provides a concrete instance of `Show` for the `Person` class:

```scala
given Show[Person]:
  extension(p: Person) def show(): String = 
    s"${p.firstName} ${p.lastName}"
```

As shown, this is defined as an extension method on the `Person` class, and it uses the reference `p` inside the body of the `show` method.

### Using the type class

Now you can use this type class like this:

```scala
val person = Person("John", "Doe")
println(person.show())
```

Again, if Scala didn’t have a `toString` method available to every class, you could use this technique to add `Show` behavior to any class that you want to be able to convert to a `String`.

### Writing methods that use the type class

As with inheritance, you can define methods that use `Show` as a type parameter:

```scala
def showAll[S: Show](xs: List[S]): Unit =
  xs.foreach(x => println(x.show()))

showAll(List(Person("Jane"), Person("Mary")))
```

### A type class with multiple methods

Note that if you want to create a type class that has multiple methods, the initial syntax looks like this:

```scala
trait HasLegs[A]:
  extension(a: A)
    def walk(): Unit
    def run(): Unit
```

### A real-world example

For a real-world example of how type classes are used in Scala 3, see the `Eql` discussion in the [Multiversal Equality section][multiversal].



{% comment %}
NOTE: I thought this was too much detail for an overview, but I left here in case anyone else thinks differently.

### Discussion

The definition of a type class is expressed with a parameterized type with abstract members, such as a trait.

The main difference between (a) subtype polymorphism with inheritance and (b) ad-hoc polymorphism with type classes is how the definition of the type class is implemented, in relation to the type it acts upon. As shown, a type class is expressed through a `given` instance definition. With subtype polymorphism, the implementation is mixed into the parents of a class, and only a single term is required to perform a polymorphic operation.

The type class solution takes more effort to set up, but is more extensible: Adding a new interface to a class requires changing the source code of that class. By contrast, instances for type classes can be defined anywhere.
{% endcomment %}



[multiversal]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
