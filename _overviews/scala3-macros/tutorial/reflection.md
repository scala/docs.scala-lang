---
type: section
title: Reflection
num: 6

previous-page: quotes
---

The reflection API provides a more complex and comprehensive view on the structure of the code.
It provides a view of *Typed Abstract Syntax Trees* and their properties such as types, symbols, positions and comments.

The API can be used in macros as well as for [inspecting TASTy files][tasty inspection].

## How to use the API

The reflection API is defined in the type `Quotes` as `reflect`.
The actual instance depends on the current scope, in which quotes or quoted pattern matching is used.
Hence, every macro method receives Quotes as an additional argument.
Since `Quotes` is contextual, to access its members we either need to name the parameter or summon it.
The following definition from the standard library details the canonical way of accessing it:

```scala
package scala.quoted

transparent inline def quotes(using inline q: Quotes): q.type = q
```

We can use `scala.quoted.quotes` to import the current `Quotes` in scope:

```scala
import scala.quoted.* // Import `quotes`, `Quotes`, and `Expr`

def f(x: Expr[Int])(using Quotes): Expr[Int] =
  import quotes.reflect.* // Import `Tree`, `TypeRepr`, `Symbol`, `Position`, .....
  val tree: Tree = ...
  ...
```

This will import all the types and modules (with extension methods) of the API.

## How to navigate the API

The full API can be found in the [API documentation for `scala.quoted.Quotes.reflectModule`][reflection doc].
Unfortunately, at this stage, this automatically-generated documentation is not very easy to navigate.

The most important element on the page is the hierarchy tree which provides a synthetic overview of the subtyping relationships of
the types in the API. For each type `Foo` in the tree:

 - the trait `FooMethods` contains the methods available on the type `Foo`
 - the trait `FooModule` contains the static methods available on the object `Foo`.
Most notably, constructors (`apply/copy`) and the `unapply` method which provides the extractor(s) required for pattern matching are found here
 - For all types `Upper` such that `Foo <: Upper`, the methods defined in `UpperMethods` are also available on `Foo`

For example, [`TypeBounds`](https://dotty.epfl.ch/api/scala/quoted/Quotes$reflectModule.html#TypeBounds-0), a subtype of `TypeRepr`, represents a type tree of the form `T >: L <: U`: a type `T` which is a super type of `L`
and a subtype of `U`. In [`TypeBoundsMethods`](https://dotty.epfl.ch/api/scala/quoted/Quotes$reflectModule$TypeBoundsMethods.html), you will find the methods `low` and `hi`, which allow you to access the
representations of `L` and `U`. In [`TypeBoundsModule`](https://dotty.epfl.ch/api/scala/quoted/Quotes$reflectModule$TypeBoundsModule.html), you will find the `unapply` method, which allows you to write:

```scala
def f(tpe: TypeRepr) =
  tpe match 
    case TypeBounds(l, u) =>
```

Because `TypeBounds <: TypeRepr`, all the methods defined in `TypeReprMethods` are available on `TypeBounds` values:

```scala
def f(tpe: TypeRepr) =
  tpe match
    case tpe: TypeBounds =>
      val low = tpe.low
      val hi  = tpe.hi
```

## Relation with Expr/Type

### Expr and Term

Expressions (`Expr[T]`) can be seen as wrappers around a `Term`, where `T` is the statically-known type of the term.
Below, we use the extension method `asTerm` to transform an expression into a term.
This extension method is only available after importing `quotes.reflect.asTerm`.
Then we use `asExprOf[Int]` to transform the term back into `Expr[Int]`.
This operation will fail if the term does not have the provided type (in this case, `Int`) or if the term is not a valid expression.
For example, an `Ident(fn)` is an invalid term if the method `fn` takes type parameters, in which case we would need an `Apply(Ident(fn), args)`.

```scala
def f(x: Expr[Int])(using Quotes): Expr[Int] =
  import quotes.reflect.*
  val tree: Term = x.asTerm
  val expr: Expr[Int] = tree.asExprOf[Int]
  expr
```

### Type and TypeRepr

Similarly, we can also see `Type[T]` as a wrapper over `TypeRepr`, with `T` being the statically-known type.
To get a `TypeRepr`, we use `TypeRepr.of[T]`, which expects a given `Type[T]` in scope (similar to `Type.of[T]`).
We can also transform it back into a `Type[?]` using the `asType` method.
As the type of `Type[?]` is not statically known, we need to name it with an existential type to use it. This can be achieved using the `'[t]` pattern.

```scala
def g[T: Type](using Quotes) =
  import quotes.reflect.*
  val tpe: TypeRepr = TypeRepr.of[T]
  tpe.asType match
    case '[t] => '{ val x: t = ${...} }
  ...
```

## Symbols

The APIs of `Term` and `TypeRepr` are relatively *closed* in the sense that methods produce and accept values whose types are defined in the API.
However, you might notice the presence of `Symbol`s which identify definitions.

Both `Term`s and `TypeRepr`s (and therefore `Expr`s and `Type`s) have an associated symbol.
`Symbol`s make it possible to compare two definitions using `==` to know if they are the same.
In addition, `Symbol` exposes and is used by many useful methods. For example:

 - `declaredFields` and `declaredMethods` allow you to iterate on the fields and members defined inside a symbol
 - `flags` allows you to check multiple properties of a symbol
 - `companionObject` and `companionModule` provide a way to jump to and from the companion object/class
 - `TypeRepr.baseClasses` returns the list of symbols of classes extended by a type
 - `Symbol.pos` gives you access to the position where the symbol is defined, the source code of the definition, and even the filename where the symbol is defined
 - many others that you can find in [`SymbolMethods`](https://dotty.epfl.ch/api/scala/quoted/Quotes$reflectModule$SymbolMethods.html)

### To Symbol and back

Consider an instance of the type `TypeRepr` named `val tpe: TypeRepr = ...`. Then:

 - `tpe.typeSymbol` returns the symbol of the type represented by `TypeRepr`. The recommended way to obtain a `Symbol` given a `Type[T]` is `TypeRepr.of[T].typeSymbol`
 - For a singleton type, `tpe.termSymbol` returns the symbol of the underlying object or value
 - `tpe.memberType(symbol)` returns the `TypeRepr` of the provided symbol
 - On objects `t: Tree`, `t.symbol` returns the symbol associated with a tree.
 Given that `Term <: Tree`, `Expr.asTerm.symbol` is the best way to obtain the symbol associated with an `Expr[T]`
 - On objects `sym: Symbol`, `sym.tree` returns the `Tree` associated to the symbol.
Be careful when using this method as the tree for a symbol might not be defined.
Read more on the [best practices page][best practices]

## Macro API design

It will often be useful to create helper methods or extractors that perform some common logic of your macros.

The simplest methods will be those that only mention `Expr`, `Type`, and `Quotes` in their signature.
Internally, they may use reflection, but this will not be seen at the use site of the method.

```scala
def f(x: Expr[Int])(using Quotes): Expr[Int] =
  import quotes.reflect.*
  ...
```

In some cases, it may be inevitable that some methods will expect or return `Tree`s or other types in `quotes.reflect`.
For these cases, the best practice is to follow the following method signature examples:

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

An extractor that matches on `quotes.reflect.Term`s
```scala
object MyExtractor:
  def unapply(using Quotes)(x: quotes.reflect.Term) =
    ...
    Some(y)
```

> **Avoid saving the `Quotes` context in a field.**
> `Quotes` in fields inevitably make its use harder by causing errors involving `Quotes` with different paths.
>
> Usually, these patterns have been seen in code that uses the Scala 2 ways to define extension methods or contextual unapplies.
> Now that we have `given` parameters that can be added before other parameters, all these old workarounds are not needed anymore.
> The new abstractions make it simpler both at the definition site and at the use site.

## Debugging

### Runtime checks

Expressions (`Expr[T]`) can be seen as wrappers around a `Term`, where `T` is the statically-known type of the term.
Hence, these checks will be done at runtime (i.e. compile-time when the macro expands).

It is recommended to enable the `-Xcheck-macros` flag while developing macros or on the tests for the macro.
This flag will enable extra runtime checks that will try to find ill-formed trees or types as soon as they are created.

There is also the `-Ycheck:all` flag that checks all compiler invariants for tree well-formedness.
These checks will usually fail with an assertion error.

### Printing the trees

The `toString` methods on types in the `quotes.reflect` package are not great for debugging as they show the internal representation rather than the `quotes.reflect` representation.
In many cases these are similar, but they may sometimes lead the debugging process astray, so they shouldn't be relied on.

Instead, `quotes.reflect.Printers` provides a set of useful printers for debugging.
Notably the `TreeStructure`, `TypeReprStructure`, and `ConstantStructure` classes can be quite useful.
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

You can make this printer the default if desired:
```scala
  import quotes.reflect.*
  given Printer[Tree] = Printer.TreeStructure
  ...
  println(tree.show)
```

## More
*Coming soon*

[tasty inspection]: {{ site.scala3ref }}/metaprogramming/tasty-inspect.html
[reflection doc]: https://dotty.epfl.ch/api/scala/quoted/Quotes$reflectModule.html?query=trait%20reflectModule

[best practices]: {% link _overviews/scala3-macros/best-practices.md %}
