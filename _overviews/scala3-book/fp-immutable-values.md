---
title: Immutable Values
type: section
description: This section looks at the use of immutable values in functional programming.
num: 42
previous-page: fp-what-is-fp
next-page: fp-pure-functions
---


In pure functional programming, only immutable values are used.
In Scala this means:

- All variables are created as `val` fields
- Only immutable collections classes are used, such as `List`, `Vector`, and the immutable `Map` and `Set` classes

Using only immutable variables raises an interesting question: If everything is immutable, how does anything ever change?

When it comes to using collections, one answer is that you don’t mutate an existing collection; instead, you apply a function to an existing collection to create a new collection.
This is where higher-order functions like `map` and `filter` come in.

{% comment %}
TODO: need a better example
{% endcomment %}

For example, imagine that you have a list of names---a `List[String]`---that are all in lowercase, and you want to find all the names that begin with the letter `"j"`, and then you want to capitalize those names.
In FP you write this code:

```scala
val a = List("jane", "jon", "mary", "joe")
val b = a.filter(_.startsWith("j"))
         .map(_.capitalize)
```

As shown, you don’t mutate the original list `a`.
Instead, you apply filtering and transformation functions to `a` to create a new collection, and assign that result to the new immutable variable `b`.

Similarly, in FP you don’t create classes with mutable `var` constructor parameters.
That is, you don’t write this:

```scala
// don’t do this in FP
class Person(var firstName: String, var lastName: String)
             ---                    ---
```

Instead, you typically create `case` classes, whose constructor parameters are `val` by default:

```scala
case class Person(firstName: String, lastName: String)
```

Now you create a `Person` instance as a `val` field:

```scala
val reginald = Person("Reginald", "Dwight")
```

Then, when you need to make a change to the data, you use the `copy` method that comes with a `case` class to “update the data as you make a copy,” like this:

```scala
val elton = reginald.copy(
  firstName = "Elton",   // update the first name
  lastName = "John"      // update the last name
)
```

There are other techniques for working with immutable collections and variables, but hopefully these examples give you a taste of the techniques.

> Depending on your needs, you may create enums, traits, or classes instead of `case` classes.
> See the [Data Modeling][modeling] chapter for more details.



[modeling]: {% link _overviews/scala3-book/domain-modeling-intro.md %}
