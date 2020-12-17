---
title: Type Classes
type: section
description: This section introduces type classes in Scala 3.
num: 53
previous-page: types-adts-gadts
next-page: types-variance
---

A _type class_ is an abstract, parameterized type that lets you add new behavior to any closed data type without using sub-typing. If you are coming from Java, you can think of type-classes as something like [`java.util.Comparator[T]`][comparator].

> The paper ["Type Classes as Objects and Implicits"][typeclasses-paper] (2010) by Oliveira et al. discusses the basic ideas behind type classes in Scala.
> Even though the paper uses an older version of Scala the ideas still hold to the current day.

This style of programming is useful in multiple use-cases, for example:

- Expressing how a type you don’t own — such as from the standard library or a third-party library — conforms to such behavior
- Adding behavior to multiple types without introducing sub-typing relationships (i.e., one `extends` another) between those types

In Scala 3, _type classes_ are just _traits_ with one or more type parameters like the following:
```
trait Show[A]:
  def show(a: A): String
```
Instances of `Show` for a particular type `A` witness that `A` we can show an instance of type `A`.
For example, let's look at the following instance for `Int`s:

```scala
class ShowInt extends Show[Int]:
  def show(a: Int) = s"The number is ${a}!"
```
We can write methods that work on arbitrary `A` _constrained_ by `Show` as follows:

```scala
def toHtml[A](a: A)(showA: Show[A]): String =
  "<p>" + showA.show(a) + "</p>"
```
That is, `toHtml` can be called with arbitrary `A` _as long_ as you can also provide an instance of `Show[A]`.
For example, we can call it like:
```scala
toHtml(42)(ShowInt())
// results in "<p>The number is 42!</p>"
```

#### Automatically passing Type Class Instances
Since type classes are a very important way to structure software, Scala 3 offers additional features that make working with them very convenient.
We discuss these additional features (which fall into the category of *Contextual Abstractions*) in a [later chapter][typeclasses-chapter] of this book.

[typeclasses-paper]: https://ropas.snu.ac.kr/~bruno/papers/TypeClasses.pdf
[typeclasses-chapter]: {% link _overviews/scala3-book/ca-type-classes.md %}
[comparator]: https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html
