---
title: Union Types
type: section
description: This section introduces and demonstrates union types in Scala 3.
num: 41
previous-page: types-intersection
next-page: types-adts-gadts
---


A union type `A | B` has as values all values of type `A` and also all values of type `B`. In this example, the `help` method accepts a union type parameter named `id`, which is then used in the subsequent `match` expression:

```scala
case class Username(name: String)
case class Password(hash: Hash)

def help(id: Username | Password) =
  val user = id match
    case Username(name) => lookupName(name)
    case Password(hash) => lookupPassword(hash)
  // more code here ...
```

As shown, a union type can represent one of several different types, without requiring those types to be part of a custom-crafted class hierarchy.

This code is flexible, and it’s also a type-safe solution. If you attempt to pass in a type other than a `Username` or `Password`, the compiler flags it as an error:

```scala
help("hi")   // error: Found: ("hi" : String)
             //        Required: Username | Password
```

You’ll also get an error if you attempt to add a `case` to the `match` expression that doesn’t match the `Username` or `Password` types:

```scala
case 1.0 = > ???   // ERROR: this line won’t compile
```

>Union types are duals of intersection types. And like `&` with intersection types, `|` is also commutative: `A | B` is the same type as `B | A`.

The compiler will assign a union type to an expression only if such a type is explicitly given. For instance, given these values:

```scala
val name = Username("Eve")     // name: Username = Username(Eve)
val password = Password(123)   // password: Password = Password(123)
```

This REPL example shows how a union type can be used when binding a variable to the result of an `if`/`else` expression:

````
scala> val a = if (true) name else password
val a: Object = Username(Eve)

scala> val b: Password | Username = if (true) name else password
val b: Password | Username = Username(Eve)
````

The type of `a` is `Object`, which is a supertype of `Username` and `Password`, but not the *least* supertype, `Password | Username`. If you want the least supertype you have to give it explicitly, as is done for `b`.



