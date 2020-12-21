---
type: section
title: Scala 3 Macros
num: 4

previous-page: compiletime
next-page: quotes
---

[Inline methods][inline] provide us with a elegant technique for metaprogramming by performing some operations at compile time.
However, sometimes inlining is not enough and we need more powerful ways to analyze and synthesize programs at compile time.
Macros enable us to do exactly this: treat **programs as data** and manipulate them.


## Macros Treat Programs as Values
With a macro, we can treat programs as values, which allows us to analyze and generate them at compile time.
A Scala expression with type `T` is represented by an instance of the type `scala.quoted.Expr[T]`.

We will dig into the details of the type `Expr[T]`, as well as the different ways of analyzing and constructing instances, when talking about [Quoted Code][quotes] and [Reflection][tasty].
For now, it suffices to know that macros are metaprograms that manipulate expressions of type `Expr[T]`.

The following macro implementation simply prints the expression of the provided argument:
```scala
def inspectCode(x: Expr[Any])(using Quotes): Expr[Any] =
  println(x.show)
  x
```
After printing the argument expression, we return the original argument as a Scala expression of type `Expr[Any]`.

As foreshadowed in the section on [Inline][inline], inline methods provide the entry point for macro definitions:

```scala
inline def inspect(inline x: Any): Any = ${ inspectCode('x) }
```
All macros are defined with an `inline def`.
The implementation of this entry point always has the same shape:

- they only contain a single [splice][quotes] `${ ... }`
- the splice contains a single call to the method that implements the macro (for example `inspectCode`).
- the call to the macro implementation receives the _quoted_ parameters (that is `'x` instead of `x`) and a contextual `Quotes`.

We will dig deeper into these concepts later in this and the following sections.

Calling our `inspect` macro `inspect(sys error "abort")` prints a string representation of the argument expression at compile time:
```
scala.sys.error("abort")
```


### Macros and Type Parameters

If the macro has type parameters, the implementation will also need to know about them.
Just like `scala.quoted.Expr[T]` represents a Scala expression of type `T`, we use `scala.quoted.Type[T]` to represent the Scala type `T`.

```scala
inline def logged[T](inline x: T): T = ${ loggedCode('x)  }

def loggedCode[T](x: Expr[T])(using Type[T], Quotes): Expr[T] = ...
```
Both the instance of `Type[T]` and the contextual `Quotes` are automatically provided by the splice in the corresponding inline method (that is, `logged`) and can be used by the macro implementation.


### Defining and Using Macros

A key difference between inlining and macros is the way they are evaluated.
Inlining works by rewriting code and performing optimisations based on rules the compiler knows.
On the other hand, a macro executes user-written code that generates the code that the macro expands to.

Technically, compiling the inlined code `${ inspectCode('x)  }` calls the method `inspectCode` _at compile time_ (through Java reflection), and the method `inspectCode` then executes as normal code.

To be able to execute `inspectCode`, we need to compile its source code first.
As a technicaly consequence, we cannot define and use a macro in the **same class/file**.
However, it is possible to have the macro definition and its call in the **same project** as long as the implementation of the macro can be compiled first.

> ##### Suspended Files
> To allow defining and using macros in the same project, only those calls to macros are expanded, where the macro has already been compiled.
> For all other (unknown) macro calls, the compilation of the file is _suspended_.
> Suspended files are only compiled after all non suspended files have been successfully compiled.
> In some cases, you will have _cyclic dependencies_ that will block the completion of the compilation.
> To get more information on which files are suspended you can use the `-Xprint-suspension` compiler flag.


### Example: Statically Evaluating `power` with Macros

Let us recall our definition of `power` from the section on [Inline][inline] that specialized the computation of `xⁿ` for statically known values of `n`.
```scala
inline def power(x: Double, inline n: Int): Double =
  inline if n == 0 then 1.0
  else inline if n % 2 == 1 then x * power(x, n - 1)
  else power(x * x, n / 2)
```
In the remainder of this section, we will define a macro that computes `xⁿ` for a statically known values `x` and `n`.
While this is also possible purely with `inline`, implementing it with macros will illustrate a few things.

```scala
inline def power(inline x: Double, inline n: Int) =
  ${ evalPower('x, 'n)  }

def powerCode(
  x: Expr[Double],
  n: Expr[Int]
)(using Quotes): Expr[Double] = ...
```

## Simple Expressions

We could implement `powerCode` as follows:
```scala
def pow(x: Double, n: Int): Double =
  if n == 0 then 1 else x * pow(x, n - 1)

def powerCode(
  x: Expr[Double],
  n: Expr[Int]
)(using Quotes): Expr[Double] =
  val value: Double = pow(x.valueOrError, n.valueOrError)
  Expr(value)
```
Here, the `pow` operation is a simple Scala function that computes the value of `xⁿ`.
The interesting part is how we create and look into the `Expr`s.


### Creating Expression From Values

Let's first look at `Expr.apply(value)`. Given a value of type `T`, this call will return an expression containing the code representing the given value (that is, of type `Expr[T]`).
The argument value to `Expr` is computed at compile-time, at runtime we only need to instantiate this value.

Creating expressions from values works for all _primitive types_, _tuples_ of any arity, `Class`, `Array`, `Seq`, `Set`, `List`, `Map`, `Option`, `Either`, `BigInt`, `BigDecimal`, `StringContext`.
Other types can also work if a `ToExpr` is implemented for it, we will [see this later][quotes].


### Extracting Values from Expressions

The second method we use in the implementation of `powerCode` is `Expr[T].valueOrError`, which has an effect opposite to `Expr.apply`.
It attempts to extract a value of type `T` from an expression of type `Expr[T]`.
This can only succeed, if the expression directly contains the code of a value, otherwise, it will throw an exception that stops the macro expansion and reports that the expression did not correspond to a value.

Instead of `valueOrError`, we could also use the `value` operation, which will return an `Option`.
This way we can report the error with a custom error message.

```scala
  ...
  (x.value, n.value) match
    case (Some(base), Some(exponent)) =>
      pow(base, exponent)
    case (Some(_), _) =>
      report.error("Expected a known value for the exponent, but was " + n.show, n)
    case _ =>
      report.error("Expected a known value for the base, but was " + x.show, x)
```

Alternatively, we can also use the `Expr.unapply` extractor

```scala
  ...
  (x, n) match
    case (Expr(base), Expr(exponent)) =>
      pow(base, exponent)
    case (Expr(_), _) => ...
    case _ => ...
```
The operations `value`, `valueOrError`, and `Expr.unapply` will work for all _primitive types_, _tuples_ of any arity, `Option`, `Seq`, `Set`, `Map`, `Either` and `StringContext`.
Other types can also work if an `FromExpr` is implemented for it, we will [see this later][quotes].


### Showing Expressions

In the implementation of `inspectCode`, we have already seen how to convert expressions to the string representation of their _source code_ using the `.show` method.
This can be useful to perform debugging on macro implementations:
```scala
def debugPowerCode(
  x: Expr[Double],
  n: Expr[Int]
)(using Quotes): Expr[Double] =
  println(
    s"""powerCode
       |  x := ${x.show}
       |  n := ${n.show}""".stripMargin)
  val code = powerCode(x, n)
  println(s"  code := ${code.show}")
  code
```


### Working with Varargs

Varargs in Scala are represented with `Seq`, hence when we write a macro with a _vararg_, it will be passed as an `Expr[Seq[T]]`.
It is possible to recover each individual argument (of type `Expr[T]`) using the `scala.quoted.Varargs` extractor.

```scala
inline def sumNow(inline nums: Int*): Int =
  ${ sumCode('nums)  }

def sumCode(nums: Expr[Seq[Int]])(using Quotes): Expr[Int] =
  nums match
    case  Varargs(numberExprs) => // numberExprs: Seq[Expr[Int]]
      val numbers: Seq[Int] = numberExprs.map(_.valueOrError)
      Expr(numbers.sum)
    case _ => report.error(
      "Expected explicit argument" +
      "Notation `args: _*` is not supported.", numbersExpr)
```

The extractor will match a call to `sumNow(1, 2, 3)` and extract a `Seq[Expr[Int]]` containing the code of each parameter.
But, if we try to match the argument of the call `sumNow(nums: _*)`, the extractor will not match.

`Varargs` can also be used as a constructor, `Varargs(Expr(1), Expr(2), Expr(3))` will return a `Expr[Seq[Int]]`.
We will see how this can be useful later.


## Complex Expressions
So far, we have only seen how to construct and destruct expressions that correspond to simple values.
In order to work with more complex expressions, Scala 3 offers different metaprogramming facilities ranging from

- additional constructors like `Expr.apply`,
- over [quoted pattern matching][quotes],
- to a full [reflection API][tasty];

each increasing in complexity and potentially losing safety guarantees.
It is generally recommended to prefer simple APIs over more advanced ones.
In the remainder of this section, we introduce some more additional constructors and destructors,
while subsequent chapters introduce the more advanced APIs.

### Collections

We have seen how to convert a `List[Int]` into an `Expr[List[Int]]` using `Expr.apply`.
How about converting a `List[Expr[Int]]` into `Expr[List[Int]]`?
We mentioned that `Varargs.apply` can do this for sequences -- likewise for other collection types, corresponding methods are available:

* `Expr.ofList`: Transform a `List[Expr[T]]` into `Expr[List[T]]`
* `Expr.ofSeq`: Transform a `Seq[Expr[T]]` into `Expr[Seq[T]]` (just like `Varargs`)
* `Expr.ofTupleFromSeq`: Transform a `Seq[Expr[T]]` into `Expr[Tuple]`
* `Expr.ofTuple`: Transform a `(Expr[T1], ..., Expr[Tn])` into `Expr[(T1, ..., Tn)]`

### Simple Blocks

The constructor `Expr.block` provides a simple way to create a block of code `{ stat1; ...; statn; expr }`.
Its first arguments is a list with all the statements and the second argument is the expression at the end of the block.

```scala
inline def test(inline ignore: Boolean, computation: => Unit): Boolean =
  ${ testCode('ignore, 'computation) }

def testCode(ignore: Expr[Boolean], computation: Expr[Unit])(using Quotes) =
  if ignore.valueOrError then Expr(false)
  else Expr.block(List(computation), Expr(true))
```

The `Expr.block` constructor is useful when we want to generate code contanining several side effects.
The macro call `test(false, EXPRESSION)` will generate `{ EXPRESSION; true}`, while the call `test(true, EXPRESSION)` will result in `false`.

### Simple Matching

The method `Expr.matches` can be used to check if one expression is equal to another.
With this method we could implement an `value` operation for `Expr[Boolean]` as follows.

```scala
def value(boolExpr: Expr[Boolean]): Option[Boolean] =
  if boolExpr.matches(Expr(true)) then Some(true)
  else if boolExpr.matches(Expr(false)) then Some(false)
  else None
```

It may also be used to compare two user written expression.
Note, that `matches` only performs a limited amount of normalization and while for instance the Scala expression `2` matches the expression `{ 2 }`, this is _not the case_ for the expression `{ val x: Int = 2; x }`.

### Arbitrary Expressions

Last but not least, it is possible to create an `Expr[T]` from arbitary Scala code by enclosing it in [quotes][quotes].
For example `'{ ${expr}; true }` will generate an `Expr[Int]` equivalent to `Expr.block(List(expr), Expr(true))`.
The subsequent section on [Quoted Code][quotes] presents quotes in more detail.

[contributing]: {% link scala3/contribute-to-docs.md %}
[best-practices]: {% link _overviews/scala3-macros/best-practices.md %}
[compiletime]: {% link _overviews/scala3-macros/tutorial/compiletime.md %}
[migration]: https://scalacenter.github.io/scala-3-migration-guide/docs/macros/macro-libraries.html
[faq]: {% link _overviews/scala3-macros/faq.md %}
[inline]: {% link _overviews/scala3-macros/tutorial/inline.md %}
[macros]: {% link _overviews/scala3-macros/tutorial/macros.md %}
[migration-status]: https://scalacenter.github.io/scala-3-migration-guide/docs/macros/migration-status.html
[quotes]: {% link _overviews/scala3-macros/tutorial/quotes.md %}
[tasty]: {% link _overviews/scala3-macros/tutorial/reflection.md %}
