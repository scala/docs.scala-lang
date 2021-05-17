---
title: Dependent Function Types
type: section
description: This section introduces and demonstrates dependent function types in Scala 3.
num: 56
previous-page: types-structural
next-page: types-others
---

A *dependent function type* describes function types, where the result type may depend on the function’s parameter values.
The concept of dependent types, and of dependent function types is more advanced and you would typically only come across it when designing your own libraries or using advanced libraries.

## Dependent Method Types
Let's consider the following example of a heterogenous database that can store values of different types.
The key contains the information about what's the type of the corresponding value:

```scala
trait Key { type Value }

trait DB {
  def get(k: Key): Option[k.Value] // a dependent method
}
```
Given a key, the method `get` let's us access the map and potentially returns the stored value of type `k.Value`.
We can read this _path-dependent type_ as: "depending on the concrete type of the argument `k`, we return a matching value".

For example, we could have the following keys:
```scala
object Name extends Key { type Value = String }
object Age extends Key { type Value = Int }
```
The following calls to method `get` would now type check:
```scala
val db: DB = ...
val res1: Option[String] = db.get(Name)
val res2: Option[Int] = db.get(Age)
```
Calling the method `db.get(Name)` returns a value of type `Option[String]`, while calling `db.get(Age)` returns a value of type `Option[Int]`.
The return type _depends_ on the concrete type of the argument passed to `get`---hence the name _dependent type_.

## Dependent Function Types
As seen above, Scala 2 already had support for dependent method types.
However, creating values of type `DB` is quite cumbersome:
```scala
// a user of a DB
def user(db: DB): Unit =
  db.get(Name) ... db.get(Age)

// creating an instance of the DB and passing it to `user`
user(new DB {
  def get(k: Key): Option[k.Value] = ... // implementation of DB
})
```
We manually need to create an anonymous inner class of `DB`, implementing the `get` method.
For code that relies on creating many different instances of `DB` this is very tedious.

The trait `DB` only has a single abstract method `get`.
Wouldn't it be nice, if we could use lambda syntax instead?
```scala
user { k =>
  ... // implementation of DB
}
```
In fact, this is now possible in Scala 3! We can define `DB` as a _dependent function type_:
```scala
type DB = (k: Key) => Option[k.Value]
//        ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//      A dependent function type
```
Given this definition of `DB` the above call to `user` type checks, as is.

You can read more about the interals of dependent function types in the [reference documentation][ref].

## Case Study: Numerical Expressions
Let us assume we want to define a module that abstracts over the internal represention of numbers.
This can be useful, for instance, to implement libraries for automatic derivation.

We start by defining our module for numbers:
```scala
trait Nums:
  // the type of numbers is left abstract
  type Num

  // some operations on numbers
  def lit(d: Double): Num
  def add(l: Num, r: Num): Num
  def mul(l: Num, r: Num): Num
```
> We omit the concrete implementation of `Nums`, but as an exercise you could implement `Nums` by assigning `type Num = Double` and implement methods accordingly.

A program that uses our number abstraction now has the following type:

```scala
type Prog = (n: Nums) => n.Num => n.Num

val ex: Prog = nums => x => nums.add(nums.lit(0.8), x)
```
The type of a function that computes the derivative of programs like `ex` is:
```scala
def derivative(input: Prog): Double
```
Given the facility of dependent function types, calling this function with different programs is very convenient:
```scala
derivative { nums => x => x }
derivative { nums => x => nums.add(nums.lit(0.8), x) }
// ...
```

To recall, the same program in the encoding above would be:
```scala
derivative(new Prog {
  def apply(nums: Nums)(x: nums.Num): nums.Num = x
})
derivative(new Prog {
  def apply(nums: Nums)(x: nums.Num): nums.Num = nums.add(nums.lit(0.8), x)
})
// ...
```

#### Combination with Context Functions
The combination of extension methods, [context functions][ctx-fun], and dependent functions provides a powerful tool for library designers.
For instance, we can refine our library from above as follows
```scala
trait NumsDSL extends Nums:
  extension (x: Num)
    def +(y: Num) = add(x, y)
    def *(y: Num) = mul(x, y)

def const(d: Double)(using n: Nums): n.Num = n.lit(d)

type Prog = (n: NumsDSL) ?=> n.Num => n.Num
//                       ^^^
//     prog is now a context function that implicitly
//     assumes a NumsDSL in the calling context

def derivative(input: Prog): Double = ...

// notice how we do not need to mention Nums in the examples below?
derive { x => const(1.0) + x }
derive { x => x * x + const(2.0) }
// ...
```


[ref]: {{ site.scala3ref }}/new-types/dependent-function-types.html
[ctx-fun]: {{ site.scala3ref }}/contextual/context-functions.html
