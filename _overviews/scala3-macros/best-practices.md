---
type: chapter
title: Best Practices
num: 8
---
## Inline

### Be careful when inlining for performance
To take the most advantage of the JVM JIT optimisations you want to avoid generating large methods.


## Macros
**Coming soon**


## Quoted code

### Keep quotes readable
* Try to avoid `${..}` with arbitrary expressions inside
  * Use `$someExpr`
  * Use `${ someExprFrom('localExpr) }`

To illustrate, consider the following example:
```scala
val x: StringContext = ...
'{ StringContext(${Varargs(stringContext.parts.map(Expr(_)))}: _*) }
```
Instead we can write the following:

```scala
val x: StringContext = ...
val partExprs = stringContext.parts.map(Expr(_))
val partsExpr = Varargs(partExprs)
'{ StringContext($partsExpr: _*) }
```
The contents of the quote are cleared this way.

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
val boxTpe = TypeRepr.of[Box.type]
val baseTpe = TypeRepr.of[Box.Base]
val baseSym = baseTpe.typeSymbol
val leafTpe = TypeRepr.of[Box.Leaf]
val leafSym = leafTpe.typeSymbol
```

### Avoid `Symbol.tree`

`Symbol.tree` returns the `Tree` associated to the symbol. Be careful when using this
method as the tree for a symbol might not be defined. When the code associated to the symbol
is defined in a different moment than this access, if the `-Yretain-trees` compilation option
is not used, then the `tree` of the symbol will not be available. Symbols originated from
Java code do not have an associated `tree`.

### Obtaining a `TypeRepr` from a `Symbol`

In the previous paragraph we saw that `Symbol.tree` should be avoided and therefore
you should not use `Symbol.tree.tpe`.
Thus to obtain the `TypeRepr` corresponding to a `Symbol`, it is recommended
to use `TypeRepr.memberType`

We can obtain the `TypeRepr` of `Leaf` in two ways:
  1. `TypeRepr.of[Box.Leaf]`
  2. `boxTpe.memberType(leafSym)`, in other words we request
  the `TypeRepr` of the member of `Box` whose symbol is equal to the symbol of sym

### Use `Symbol`s to compare definitions

Read more about Symbols [here][symbol].

Symbols allow comparing definitions using `==`:
```scala
leafSym == baseSym.children.head // Is true
```

However, `==` on `TypeRepr`s does not produce the same result:
```scala
boxTpe.memberType(baseSym.children.head) == leafTpe // Is false
```

### Obtaining a Symbol for a type

There is a handy shortcut to get the symbol of the definition of `T`.
Instead of 

```scala
TypeTree.of[T].tpe.typeSymbol
```
you can use

```scala
TypeRepr.of[T].typeSymbol
```

### Use pattern match your way into the API

Pattern matching is a very ergonomic approach to the API. Always have a look at
the `unapply` defined in `*Module` objects.

### Search the contextual scope in your macros

You can search for implicits instances using `Implicits.search`.

For example:

```scala
val leafMirrorTpe = TypeRepr.of[Mirror.ProductOf[Box.Leaf]]

Implicits.search(leafMirrorTpe) match
  case success: ImplicitSearchSuccess => 
    val implicitTerm = success.tree
    // ...
  case faliure: ImplicitSearchFailure =>
```

If you are writing and prefer to handle `Expr`, `Expr.summon` is a
convient wrapper around `Implicits.search`:

```scala
def summoned[T: Type]: Expr[T] = 
  Expr.summon[T] match
    case Some(imp) => imp
    case None => reflect.report.throwError("Could not find an implicit for " + Type.show[T])
```

[symbol]: {% link _overviews/scala3-macros/tutorial/reflection.md %}
