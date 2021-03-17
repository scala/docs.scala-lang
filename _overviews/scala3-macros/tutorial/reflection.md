---
type: section
title: Reflection
num: 6

previous-page: quotes
---

The reflection API provides a more complex and comprehensive view on the structure of the code.
It provides a view on the *Typed Abstract Syntax Trees* and their properties such as types, symbols, positions and comments.

## How to use the API

Accessing this API need and import that depends the current `Quotes`.
We can use `scala.quoted.quotes` to import it.

```scala
def pow(x: Expr[Int])(using Quotes): Expr[Int] = {
  import quotes.reflect.* // Import Tree, Type, Symbol, Position, .....
  ...
}
```

This will import all the types and modules (with extension methods) of the API.

The full imported API can be found here: [Reflection](https://dotty.epfl.ch/api/scala/quoted/Quotes$reflectModule.html?query=trait%20reflectModule)

For example to find what is a `Term`, we can see in the hierarchy that it is a subtype of `Statement` which is a subtype of `Tree`.
If we look into `TermMethods` we will find all the extension methods that are defined for `Term` such as `Term.tpe` which returns a `Type`.
As it is a subtype of `Tree` we can also look into the `TreeMethods` to find more methods such as `Tree.pos`.
Each type also a module with some _static-ish_ methods, for example in the [`TypeReprModule`](https://dotty.epfl.ch/api/scala/quoted/Quotes$reflectModule$TypeReprModule.html) we can find the method `TypeRepr.of[T]` with will create an instance of `Type` containing `T`.


## Relation with expressions
<!-- Term vs Expr -->
<!-- Safty -->
*Coming soon*


## Examples
*Coming soon*
