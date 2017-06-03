---
layout: tour
title: Extractor Objects

disqus: true

tutorial: scala-tour
categories: tour
num: 16
next-page: sequence-comprehensions
previous-page: regular-expression-patterns
---

An extractor object is an object with an `unapply` method. Whereas the `apply` method is like a constructor which takes arguments and creates an object, the `unapply` takes an object and tries to give back the arguments. This is most often used in pattern matching and partial functions.

```tut
import scala.util.Random

object CustomerID {

  def apply(name: String) = s"$name--${Random.nextLong}"

  def unapply(customerID: String): Option[String] = {
    val name = customerID.split("--").head
    if (name.nonEmpty) Some(name) else None
  }
}

val customer1ID = CustomerID("Sukyoung")  // Sukyoung--23098234908
customer1ID match {
  case CustomerID(name) => println(name)  // prints Sukyoung
  case _ => println("Could not extract a CustomerID")
}
```

The `apply` method creates a `CustomerID` string from a `name`. The `unapply` does the inverse to get the `name` back. When we call `CustomerID("Sukyoung")`, this is shorthand syntax for calling `CustomerID.apply("Sukyoung")`. When we call `case CustomerID(name) => customer1ID`, we're calling the unapply method.

The unapply method can also be used to assign a value.

```tut
val customer2ID = CustomerID("Nico")
val CustomerID(name) = customer2ID
println(name)  // prints Nico
```

This is equivalent to `val name = CustomerID.unapply(customer2ID).get`. If there is no match, a `scala.MatchError` is thrown:

```tut:fail
val CustomerID(name2) = "--asdfasdfasdf"
```

The return type of an `unapply` should be chosen as follows:

* If it is just a test, return a `Boolean`. For instance `case even()`
* If it returns a single sub-value of type T, return an `Option[T]`
* If you want to return several sub-values `T1,...,Tn`, group them in an optional tuple `Option[(T1,...,Tn)]`.

Sometimes, the number of sub-values is fixed and we would like to return a sequence. For this reason, you can also define patterns through `unapplySeq` which returns `Option[Seq[T]]` This mechanism is used for instance in pattern `case List(x1, ..., xn)`.
