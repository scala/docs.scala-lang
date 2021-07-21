---
type: chapter
title: Best Practices
num: 8
---
## Inline

### Be careful when inlining for performance
To take the most advantage of the JVM JIT optimisations, you want to avoid generating large methods.


## Macros
**Coming soon**


## Quoted code

### Keep quotes readable
* Try to avoid `${...}` with arbitrary expressions inside
  * Use `$someExpr`
  * Use `${ someExprFrom('localExpr) }`

To illustrate, consider the following example:
```scala
val x: StringContext = ...
'{ StringContext(${Varargs(x.parts.map(Expr(_)))}: _*) }
```
Instead, we can write the following:

```scala
val x: StringContext = ...
val partExprs = x.parts.map(Expr(_))
val partsExpr = Varargs(partExprs)
'{ StringContext($partsExpr: _*) }
```
The contents of the quote are much more clear in the second example.

### Avoid nested contexts

Consider the following code:

```scala
val y: Expr[Int] = ...
def body(x: Expr[Int])(using quotes.Nested) =  '{ $x + $y }
'{ (x: Int) => ${ body('x) } }
```

Instead, use a normal context and pass all needed expressions.
This has also the advantage of allowing the function to not be defined locally.
```scala
def body(x: Expr[Int], y: Expr[Int])(using Quotes) =
  '{ $x + $y }

val y: Expr[Int] = ...
'{ (x: Int) => ${ body('x, y) } }
```

## Quotes Reflect

For this section, consider the following setup:

```scala
object Box:
  sealed trait Base
  case class Leaf(x: Int) extends Base

// Quotes in contextual scope
val boxTpe : TypeRepr = TypeRepr.of[Box.type]
val baseTpe: TypeRepr = TypeRepr.of[Box.Base]
val baseSym: Symbol   = baseTpe.typeSymbol
val leafTpe: TypeRepr = TypeRepr.of[Box.Leaf]
val leafSym: Symbol   = leafTpe.typeSymbol
```

### Avoid `Symbol.tree`

On an object `sym: Symbol`, `sym.tree` returns the `Tree` associated with the symbol.
Be careful when using this method, as the tree for a symbol might not be defined.
When the code associated with a symbol is defined at a different time than this access, if the `-Yretain-trees` compilation option is not used, then the `tree` of the symbol will not be available.
Symbols originating from Java code do not have an associated `tree`.

### Obtaining a `TypeRepr` from a `Symbol`

In the previous heading, we saw that `Symbol.tree` should be avoided and that therefore you should not use `sym.tree.tpe` on `sym: Symbol`.
Thus, to obtain the `TypeRepr` corresponding to a `Symbol`, it is recommended to use `tpe.memberType` on `tpe: TypeRepr` objects.

We can obtain the `TypeRepr` of `Leaf` in two ways:
  1. `TypeRepr.of[Box.Leaf]`
  2. `boxTpe.memberType(leafSym)`
(In other words, we request the `TypeRepr` of the member of `Box` whose symbol is equal to the symbol of `leafSym`.)

While the two approaches are equivalent, the first is only possible if you already know that you are looking for the type `Box.Leaf`.
The second approach allows you to explore an unknown API.

### Use `Symbol`s to compare definitions

Read more about Symbols [here][symbol].

Symbols allow you to compare definitions using `==`:
```scala
leafSym == baseSym.children.head // Is true
```

However, `==` on `TypeRepr`s does not produce the same result:
```scala
boxTpe.memberType(baseSym.children.head) == leafTpe // Is false
```

### Obtaining a Symbol for a type

There is a handy shortcut to get the symbol for the definition of `T`.
Instead of

```scala
TypeTree.of[T].tpe.typeSymbol
```
you can use

```scala
TypeRepr.of[T].typeSymbol
```

### Pattern match your way into the API

Pattern matching is a very ergonomic approach to the API. Always have a look at
the `unapply` method defined in `*Module` objects.

### Search the contextual scope in your macros

You can search for given instances using `Implicits.search`.

For example:

```scala
def summonOrFail[T: Type]: Expr[T] =
  val tpe = TypeRepr.of[T]
  Implicits.search(tpe) match
    case success: ImplicitSearchSuccess =>
      val implicitTerm = success.tree
      implicitTerm.asExprOf[T]
    case failure: ImplicitSearchFailure =>
      reflect.report.throwError("Could not find an implicit for " + Type.show[T])
```

If you are writing a macro and prefer to handle `Expr`s, `Expr.summon` is a
convenient wrapper around `Implicits.search`:

```scala
def summonOrFail[T: Type]: Expr[T] =
  Expr.summon[T] match
    case Some(imp) => imp
    case None => reflect.report.throwError("Could not find an implicit for " + Type.show[T])
```

[symbol]: {% link _overviews/scala3-macros/tutorial/reflection.md %}
