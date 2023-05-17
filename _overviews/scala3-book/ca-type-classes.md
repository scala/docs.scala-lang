---
title: Type Classes
type: section
description: This page demonstrates how to create and use type classes.
languages: [zh-cn]
num: 63
previous-page: ca-given-imports
next-page: ca-multiversal-equality
redirect_from: /scala3/book/types-type-classes.html
---

A _type class_ is an abstract, parameterized type that lets you add new behavior to any closed data type without using sub-typing.
If you are coming from Java, you can think of type classes as something like [`java.util.Comparator[T]`][comparator].

> The paper [“Type Classes as Objects and Implicits”][typeclasses-paper] (2010) by Oliveira et al. discusses the basic ideas behind type classes in Scala.
> Even though the paper uses an older version of Scala, the ideas still hold to the current day.

A type class is useful in multiple use-cases, for example:

- Expressing how a type you don’t own---from the standard library or a third-party library---conforms to such behavior
- Expressing such a behavior for multiple types without involving sub-typing relationships between those types

Type classes are traits with one or more parameters whose implementations are provided as `given` instances in Scala 3 or `implicit` values in Scala 2.

## Example

For example, `Show` is a well-known type class in Haskell, and the following code shows one way to implement it in Scala.
If you imagine that Scala classes don’t have a `toString` method, you can define a `Show` type class to add this behavior to any type that you want to be able to convert to a custom string.

### The type class

The first step in creating a type class is to declare a parameterized trait that has one or more abstract methods.
Because `Showable` only has one method named `show`, it’s written like this:

{% tabs 'definition' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
// a type class
trait Showable[A] {
  def show(a: A): String
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
// a type class
trait Showable[A]:
  extension (a: A) def show: String
```
{% endtab %}
{% endtabs %}

Notice that this approach is close to the usual object-oriented approach, where you would typically define a trait `Show` as follows:

{% tabs 'trait' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
// a trait
trait Show {
  def show: String
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
// a trait
trait Show:
  def show: String
```
{% endtab %}
{% endtabs %}

There are a few important things to point out:

1. Type-classes like `Showable` take a type parameter `A` to say which type we provide the implementation of `show` for; in contrast, classic traits like `Show` do not.
2. To add the show functionality to a certain type `A`, the classic trait requires that `A extends Show`, while for type-classes we require to have an implementation of `Showable[A]`.
3. In Scala 3, to allow the same method calling syntax in both `Showable` that mimics the one of `Show`, we define `Showable.show` as an extension method.

### Implement concrete instances

The next step is to determine what classes in your application `Showable` should work for, and then implement that behavior for them.
For instance, to implement `Showable` for this `Person` class:

{% tabs 'person' %}
{% tab 'Scala 2 and 3' %}
```scala
case class Person(firstName: String, lastName: String)
```
{% endtab %}
{% endtabs %}

you’ll define a single _canonical value_ of type `Showable[Person]`, ie an instance of `Showable` for the type `Person`, as the following code example demonstrates:

{% tabs 'instance' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
implicit val showablePerson: Showable[Person] = new Showable[Person] {
  def show(p: Person): String =
    s"${p.firstName} ${p.lastName}"
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
given Showable[Person] with
  extension (p: Person) def show: String =
    s"${p.firstName} ${p.lastName}"
```
{% endtab %}
{% endtabs %}

### Using the type class

Now you can use this type class like this:

{% tabs 'usage' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
val person = Person("John", "Doe")
println(showablePerson.show(person))
```

Note that in practice, type classes are typically used with values whose type is unknown, unlike the type `Person`, as shown in the next section.
{% endtab %}
{% tab 'Scala 3' %}
```scala
val person = Person("John", "Doe")
println(person.show)
```
{% endtab %}
{% endtabs %}

Again, if Scala didn’t have a `toString` method available to every class, you could use this technique to add `Showable` behavior to any class that you want to be able to convert to a `String`.

### Writing methods that use the type class

As with inheritance, you can define methods that use `Showable` as a type parameter:

{% tabs 'method' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def showAll[A](as: List[A])(implicit showable: Showable[A]): Unit =
  as.foreach(a => println(showable.show(a)))

showAll(List(Person("Jane"), Person("Mary")))
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
def showAll[A: Showable](as: List[A]): Unit =
  as.foreach(a => println(a.show))

showAll(List(Person("Jane"), Person("Mary")))
```
{% endtab %}
{% endtabs %}

### A type class with multiple methods

Note that if you want to create a type class that has multiple methods, the initial syntax looks like this:

{% tabs 'multiple-methods' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
trait HasLegs[A] {
  def walk(a: A): Unit
  def run(a: A): Unit
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
trait HasLegs[A]:
  extension (a: A)
    def walk(): Unit
    def run(): Unit
```
{% endtab %}
{% endtabs %}

### A real-world example

For a real-world example of how type classes are used in Scala 3, see the `CanEqual` discussion in the [Multiversal Equality section][multiversal].

[typeclasses-paper]: https://infoscience.epfl.ch/record/150280/files/TypeClasses.pdf
[typeclasses-chapter]: {% link _overviews/scala3-book/ca-type-classes.md %}
[comparator]: https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html
[multiversal]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
