---
type: section
layout: multipage-overview
title: Auxiliary Class Constructors
description: This page shows how to write auxiliary Scala class constructors, including several examples of the syntax.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 20
outof: 54
previous-page: classes
next-page: constructors-default-values
---


You define auxiliary Scala class constructors by defining methods that are named `this`. There are only a few rules to know:

- Each auxiliary constructor must have a different signature (different parameter lists)
- Each constructor must call one of the previously defined constructors

Here’s an example of a `Pizza` class that defines multiple constructors:

```scala
val DefaultCrustSize = 12
val DefaultCrustType = "THIN"

// the primary constructor
class Pizza (var crustSize: Int, var crustType: String) {

    // one-arg auxiliary constructor
    def this(crustSize: Int) = {
        this(crustSize, DefaultCrustType)
    }

    // one-arg auxiliary constructor
    def this(crustType: String) = {
        this(DefaultCrustSize, crustType)
    }

    // zero-arg auxiliary constructor
    def this() = {
        this(DefaultCrustSize, DefaultCrustType)
    }

    override def toString = s"A $crustSize inch pizza with a $crustType crust"

}
```

With all of those constructors defined, you can create pizza instances in several different ways:

```scala
val p1 = new Pizza(DefaultCrustSize, DefaultCrustType)
val p2 = new Pizza(DefaultCrustSize)
val p3 = new Pizza(DefaultCrustType)
val p4 = new Pizza
```

We encourage you to paste that class and those examples into the Scala REPL to see how they work.


## Notes

There are two important notes to make about this example:

- The `DefaultCrustSize` and `DefaultCrustType` variables are not a preferred way to handle this situation, but because we haven’t shown how to handle enumerations yet, we use this approach to keep things simple.
- Auxiliary class constructors are a great feature, but because you can use default values for constructor parameters, you won’t need to use this feature very often. The next lesson demonstrates how using default parameter values like this often makes auxiliary constructors unnecessary:

```scala
class Pizza(
    var crustSize: Int = DefaultCrustSize, 
    var crustType: String = DefaultCrustType
)
```








