---
type: section
layout: multipage-overview
title: The Type is Optional
description: A note about explicit and implicit data type declarations in Scala.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 9
outof: 54
previous-page: two-types-variables
next-page: built-in-types
---


As we showed in the previous lesson, when you create a new variable in Scala you can *explicitly* declare its type, like this:

```scala
val count: Int = 1
val name: String = "Alvin"
```

However, you can generally leave the type off and Scala can infer it for you:

```scala
val count = 1
val name = "Alvin"
```

In most cases your code is easier to read when you leave the type off, so this inferred form is preferred.



## The explicit form feels verbose

For instance, in this example it’s obvious that the data type is `Person`, so there’s no need to declare the type on the left side of the expression:

```scala
val p = new Person("Candy")
```

By contrast, when you put the type next to the variable name, the code feels unnecessarily verbose:

```scala
val p: Person = new Person("Leo")
```

In summary:

```scala
val p = new Person("Candy")           // preferred
val p: Person = new Person("Candy")   // unnecessarily verbose
```


## Use the explicit form when you need to be clear

One place where you’ll want to show the data type is when you want to be clear about what you’re creating. That is, if you don’t explicitly declare the data type, the compiler may make a wrong assumption about what you want to create. Some examples of this are when you want to create numbers with specific data types. We show this in the next lesson.










