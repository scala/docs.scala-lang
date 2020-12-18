---
title: Union Types
type: section
description: This section introduces and demonstrates union types in Scala 3.
num: 51
previous-page: types-intersection
next-page: types-adts-gadts
---

Used on types, the `|` operator creates a so-called _union type_.
The type `A | B` represents values that are **either** of the type `A` **or** of the type `B`.

In the following example, the `help` method accepts a parameter named `id` of the union type `Username | Password`, that can be either a `Username` or a `Password`:

```scala
case class Username(name: String)
case class Password(hash: Hash)

def help(id: Username | Password) =
  val user = id match
    case Username(name) => lookupName(name)
    case Password(hash) => lookupPassword(hash)
  // more code here ...
```
We implement the method `help` by distinguishing between the two alternatives using pattern matching.

This code is a flexible and type-safe solution.
If you attempt to pass in a type other than a `Username` or `Password`, the compiler flags it as an error:

```scala
help("hi")   // error: Found: ("hi" : String)
             //        Required: Username | Password
```

You’ll also get an error if you attempt to add a `case` to the `match` expression that doesn’t match the `Username` or `Password` types:

```scala
case 1.0 = > ???   // ERROR: this line won’t compile
```

### Alternative to Union Types
As shown, union types can be used to represent alternatives of several different types, without requiring those types to be part of a custom-crafted class hierarchy, or requiring explicit wrapping.

#### Pre-planning the Class Hierarchy
Other languages would require pre-planning of the class hierarchy, like the following example illustrates:

```scala
trait UsernameOrPassword
case class Username(name: String) extends UsernameOrPassword
case class Password(hash: Hash) extends UsernameOrPassword
def help(id: UsernameOrPassword) = ...
```
Pre-planning does not scale very well since, for example, requirements of API users might not be foreseeable.
Additionally, cluttering the type hierarchy with marker traits like `UsernameOrPassword` also makes the code more difficult to read.

#### Tagged Unions
Another alternative is to define a separate enumeration type like:

```scala
enum UsernameOrPassword:
  case IsUsername(u: Username)
  case IsPassword(p: Password)
```
The enumeration `UsernameOrPassword` represents a _tagged_ union of `Username` and `Password`.
However, this way of modeling the union requires _explicit wrapping and unwrapping_ and, for instance, `Username` is **not** a subtype of `UsernameOrPassword`.

### Inference of Union Types
The compiler assigns a union type to an expression _only if_ such a type is explicitly given.
For instance, given these values:

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

The type of `a` is `Object`, which is a supertype of `Username` and `Password`, but not the *least* supertype, `Password | Username`.
If you want the least supertype you have to give it explicitly, as is done for `b`.

> Union types are duals of intersection types.
> And like `&` with intersection types, `|` is also commutative: `A | B` is the same type as `B | A`.

