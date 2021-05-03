---
type: section
title: Reflection
num: 6

previous-page: quotes
---

The reflection API provides a more complex and comprehensive view on the structure of the code.
It provides a view on the *Typed Abstract Syntax Trees* and their properties such as types, symbols, positions and comments.

## How to use the API

The reflection API is defined in the type `Quotes` as `reflect`.
The actual instance depends on the current scope, in which quotes or quoted pattern matching is used.
Hence, every macro method receives Quotes as an additional argument.
Since `Quotes` is contextual, to access its members we either need to name the parameter, or summon it.
The following definition of the standard library provides the canonical way of accessing it.

```scala
package scala.quoted

transparent inline def quotes(using inline q: Quotes): q.type = q
```

We can use `scala.quoted.quotes` to import it the current `Quotes` in scope like this

```scala
import scala.quoted.* // Import `quotes`, `Quotes` and `Expr`

def f(x: Expr[Int])(using Quotes): Expr[Int] =
  import quotes.reflect.* // Import `Tree`, `TypeRepr`, `Symbol`, `Position`, .....
  val tree: Tree = ...
  ...
```

This will import all the types and modules (with extension methods) of the API.

The full imported API can be found here: [Reflection](https://dotty.epfl.ch/api/scala/quoted/Quotes$reflectModule.html?query=trait%20reflectModule)

For example to find what is a `Term`, we can see in the hierarchy that it is a subtype of `Statement` which is a subtype of `Tree`.
If we look into `TermMethods` we will find all the extension methods that are defined for `Term` such as `Term.tpe` which returns a `Type`.
As it is a subtype of `Tree` we can also look into the `TreeMethods` to find more methods such as `Tree.pos`.
Each type is also a module with some _static-ish_ methods, for example in the [`TypeReprModule`](https://dotty.epfl.ch/api/scala/quoted/Quotes$reflectModule$TypeReprModule.html) we can find the method `TypeRepr.of[T]` which will create an instance of `Type` containing `T`.


## Relation with Expr/Type

Expressions `Expr[T]` can be seen as wrappers around a `Term`, where `T` is the statically known type of the term.
Below we use the extension method `asTerm` to transform the expression into a term.
This extension method is only available after importing `quotes.reflect.asTerm`.
Then we use `asExprOf[Int]` to transform the term back into `Expr[Int]`.
This operation will fail if the term does not have provided type or if the term is not a valid expression.
For example, a `Ident(fn)` is non-valid term if the method `fn` takes type parameters, in which case we would need an `Apply(Ident(fn), args)`.

```scala
def f(x: Expr[Int])(using Quotes): Expr[Int] =
  import quotes.reflect.*
  val tree: Term = x.asTerm
  val expr: Expr[Int] = tree.asExprOf[Int]
  expr
```

Similarly, we can also see `Type[T]` as a wrapper over `TypeRepr`, with `T` being the statically known type.
To get a `TypeRepr` we use `TypeRepr.of[X]` which expects a given `Type[X]` in scope (similar to `Type.of[X]`).
We can also transform it back into a `Type[?]` using the `asType` method.
As the type of `Type[?]` is not statically know we need to name it with an existential type to use it. This can be achieved using a `'[t]` pattern.

```scala
def g[T: Type](using Quotes) =
  import quotes.reflect.*
  val tpe: TypeRepr = TypeRepr.of[T]
  tpe.asType match
    case '[t] => '{ val x: t = ${...} }
  ...
```

## Macro API design

It will be often useful to create helper methods or extractors that perform some common logic of your macros.

The simplest methods will be those that only mention `Expr`, `Type`, and `Quotes` in their signature.
Internally they may use reflection but this will not be seen at the use site of the method.

```scala
def f(x: Expr[Int])(using Quotes): Expr[Int] =
  import quotes.reflect.*
  ...
```

In some cases it is inevitable to require some methods that work on `Tree`s or other types in `quotes.reflect`.
For these cases, the best is to follow the following example of method signatures.

A method that takes a `quotes.reflect.Term` parameter
```scala
def f(using Quotes)(term: quotes.reflect.Term): String =
  import quotes.reflect.*
  ...
```

An extension method for a `quotes.reflect.Term` returning a `quotes.reflect.Tree`
```scala
extension (using Quotes)(term: quotes.reflect.Term)
  def g: quotes.reflect.Tree = ...
```

An extractor that matches on `quotes.reflect.Term`s.
```scala
object MyExtractor:
  def unapply(using Quotes)(x: quotes.reflect.Term) =
    ...
    Some(y)
```

> **Avoid saving the `Quotes` context in a field.**
> `Quotes` in fields inevitably make its use harder by hitting errors involving `Quotes` with different paths.
>
> Usually these patterns have been seen in code that uses the Scala 2 ways to define extension methods or contextual unapplies.
> Now that we have `given` parameters that can be added before other parameters, all these old workarounds are not needed anymore.
> The new abstraction make it simpler on the definition site and at use site.

## Debugging

### Runtime checks

Expressions `Expr[T]` can be seen as wrappers around a `Term`, where `T` is the statically known type of the term.
Hence these checks will be done at runtime (i.e. compile-time when the macro expands).

It is recommended to enable the `-Xcheck-macros` flag while developing macros or on the tests for the macro.
This flag will enable extra runtime checks that will try to find ill-formed trees or types as soon as they are created.

There is also the `-Ycheck:all` flag that checks all compiler invariants for tree well-formedness.
These check will usually fail with an assertion error.

### Printing the trees

The `toString` methods of types in `quotes.reflect` are not great for debugging as they show the internal representation rather than the `quotes.reflect` representation.
In many cases these are similar but they may lead the debugging process astray.

Hence, `quotes.reflect.Printers` provide a set of useful printers for debugging.
Notably the `TreeStructure`, `TypeReprStructure` and `ConstantStructure` can be quite useful.
These will print the tree structure following loosely the extractors that would be needed to match it.

```scala
val tree: Tree = ...
println(tree.show(using Printer.TreeStructure))
```

One of the most useful places where this can be added is at the end of a pattern match on a `Tree`.

```scala
tree match
  case Ident(_) =>
  case Select(_, _) =>
  ...
  case _ =>
    throw new MatchError(tree.show(using Printer.TreeStructure))
```
This way, if a case is missed the error will report a familiar structure that can be copy-pasted to start fixing the issue.

We can make this printer the default if needed
```scala
  import quotes.reflect.*
  given Printer[Tree] = Printer.TreeStructure
  ...
  println(tree.show)
```

## More
*Coming soon*
