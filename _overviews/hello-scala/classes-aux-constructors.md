---
layout: multipage-overview
title: Auxiliary Class Constructors
description: This page shows how to write auxiliary Scala class constructors, including several examples of the syntax.
partof: hello_scala
overview-name: Hello, Scala
num: 20
---


You define auxiliary Scala class constructors by defining methods that are named `this`. There are only a few rules to know:

- Each auxiliary constructor must have a different signature (different parameter lists)
- Each constructor must call one of the previously defined constructors


Here’s an example of a `Pizza` class that defines multiple constructors:

```scala
val DEFAULT_CRUST_SIZE = 12
val DEFAULT_CRUST_TYPE = "THIN"

// the primary constructor
class Pizza (var crustSize: Int, var crustType: String) {

    // one-arg auxiliary constructor
    def this(crustSize: Int) {
        this(crustSize, DEFAULT_CRUST_TYPE)
    }

    // one-arg auxiliary constructor
    def this(crustType: String) {
        this(DEFAULT_CRUST_SIZE, crustType)
    }

    // zero-arg auxiliary constructor
    def this() {
        this(DEFAULT_CRUST_SIZE, DEFAULT_CRUST_TYPE)
    }

    override def toString = s"A $crustSize inch pizza with a $crustType crust"

}
```

With all of those constructors defined, you can create pizza instances in several different ways:

```scala
val p1 = new Pizza(DEFAULT_CRUST_SIZE, DEFAULT_CRUST_TYPE)
val p2 = new Pizza(DEFAULT_CRUST_SIZE)
val p3 = new Pizza(DEFAULT_CRUST_TYPE)
val p4 = new Pizza
```

I encourage you to paste that class and those examples into the Scala REPL to see how they work.

>Note: The `DEFAULT_CRUST_SIZE` and `DEFAULT_CRUST_TYPE` variables aren’t a great example of how to handle this situation, but because I haven’t shown how to handle enumerations yet, I use this approach to keep things simple.







