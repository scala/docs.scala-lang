---
title: Structural Types
type: section
description: This section introduces and demonstrates structural types in Scala 3.
num: 55
previous-page: types-opaque-types
next-page: types-dependent-function
---

{% comment %}
NOTE: It would be nice to simplify this more.
{% endcomment %}

Some use cases, such as modeling database access, are more awkward in statically typed languages than in dynamically typed languages.
With dynamically typed languages, it’s natural to model a row as a record or object, and to select entries with simple dot notation, e.g. `row.columnName`.

Achieving the same experience in a statically typed language requires defining a class for every possible row arising from database manipulation---including rows arising from joins and projections---and setting up a scheme to map between a row and the class representing it.

This requires a large amount of boilerplate, which leads developers to trade the advantages of static typing for simpler schemes where column names are represented as strings and passed to other operators, e.g. `row.select("columnName")`.
This approach forgoes the advantages of static typing, and is still not as natural as the dynamically typed version.

Structural types help in situations where you’d like to support simple dot notation in dynamic contexts without losing the advantages of static typing.
They allow developers to use dot notation and configure how fields and methods should be resolved.

## Example

Here’s an example of a structural type `Person`:

```scala
class Record(elems: (String, Any)*) extends Selectable:
  private val fields = elems.toMap
  def selectDynamic(name: String): Any = fields(name)

type Person = Record {
  val name: String
  val age: Int
}
```

The `Person` type adds a _refinement_ to its parent type `Record` that defines `name` and `age` fields.
We say the refinement is _structural_ since  `name` and `age` are not defined in the parent type.
But they exist nevertheless as members of class `Person`.
For instance, the following program would print `"Emma is 42 years old."`:

```scala
val person = Record(
  "name" -> "Emma",
  "age" -> 42
).asInstanceOf[Person]

println(s"${person.name} is ${person.age} years old.")
```

The parent type `Record` in this example is a generic class that can represent arbitrary records in its `elems` argument.
This argument is a sequence of pairs of labels of type `String` and values of type `Any`.
When you create a `Person` as a `Record` you have to assert with a typecast that the record defines the right fields of the right types.
`Record` itself is too weakly typed, so the compiler cannot know this without help from the user.
In practice, the connection between a structural type and its underlying generic representation would most likely be done by a database layer, and therefore would not be a concern of the end user.

`Record` extends the marker trait `scala.Selectable` and defines a method `selectDynamic`, which maps a field name to its value.
Selecting a structural type member is done by calling this method.
The `person.name` and `person.age` selections are translated by the Scala compiler to:

```scala
person.selectDynamic("name").asInstanceOf[String]
person.selectDynamic("age").asInstanceOf[Int]
```

## A second example

To reinforce what you just saw, here’s another structural type named `Book` that represents a book that you might read from a database:

```scala
type Book = Record {
  val title: String
  val author: String
  val year: Int
  val rating: Double
}
```

As with `Person`, this is how you create a `Book` instance:

```scala
val book = Record(
  "title" -> "The Catcher in the Rye",
  "author" -> "J. D. Salinger",
  "year" -> 1951,
  "rating" -> 4.5
).asInstanceOf[Book]
```

## Selectable class

Besides `selectDynamic`, a `Selectable` class sometimes also defines a method `applyDynamic`.
This can then be used to translate function calls of structural members.
So, if `a` is an instance of `Selectable`, a structural call like `a.f(b, c)` translates to:

```scala
a.applyDynamic("f")(b, c)
```

