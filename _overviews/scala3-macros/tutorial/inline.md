---
type: section
title: Inline
num: 2

previous-page: index
next-page: compiletime
---

Inlining is a common compile-time metaprogramming technique, typically used to achieve performance optimizations. As we will see, in Scala 3, the concept of inlining provides us with an entrypoint to programming with macros.

1. It introduces inline as a [soft keyword][soft-modifier].
2. It guarantees that inlining actually happens instead of being best-effort.
3. It introduces operations that are guaranteed to evaluate at compile-time.

## Inline Constants

The simplest form of inlining is to inline constants in programs:


```scala
inline val pi = 3.141592653589793
inline val pie = "🥧"
```

The usage of the keyword `inline` in the _inline value definitions_ above *guarantees* that all references to `pi` and `pie` are inlined:

```scala
val pi2 = pi + pi // val pi2 = 6.283185307179586
val pie2 = pie + pie // val pie2 = "🥧🥧"
```

In the code above, the references `pi` and `pie` are inlined.
Then an optimization called "constant folding" is applied by the compiler, which computes the resulting value `pi2` and `pie2` at _compile-time_.

> ##### Inline (Scala 3) vs. final (Scala 2)
> In Scala 2, we would have used the modifier `final` in the definition that is without a return type:
>
> ```scala
> final val pi = 3.141592653589793
> final val pie = "🥧"
> ```
>
> The `final` modifier will ensure that `pi` and `pie` will take a _literal type_.
> Then the constant propagation optimization in the compiler can perform inlining for such definitions.
> However, this form of constant propagation is _best-effort_ and not guaranteed.
> Scala 3.0 also supports `final val`-inlining as _best-effort_ inlining for migration purposes.

Currently, only constant expressions may appear on the right-hand side of an inline value definition.
Therefore, the following code is invalid, though the compiler knows that the right-hand side is a compile-time constant value:

```Scala
val pi = 3.141592653589793
inline val pi2 = pi + pi // error
```
Note that by defining `inline val pi`, the addition can be computed at compile time.
This resolves the above error and `pi2` will receive the literal type `6.283185307179586d`.

## Inline Methods

We can also use the modifier `inline` to define a method that should be inlined at the call-site:

```scala
inline def logged[T](level: Int, message: => String)(inline op: T): T =
  println(s"[$level]Computing $message")
  val res = op
  println(s"[$level]Result of $message: $res")
  res
```

When an inline method like `logged` is called, its body will be expanded at the call-site at compile time!
That is, the call to `logged` will be replaced by the body of the method.
The provided arguments are statically substituted for the parameters of `logged`, correspondingly.
Therefore, the compiler inlines the following call

```scala
logged(logLevel, getMessage()) {
  computeSomething()
}
```

and rewrites it to:

```Scala
val level   = logLevel
def message = getMessage()

println(s"[$level]Computing $message")
val res = computeSomething()
println(s"[$level]Result of $message: $res")
res
```

### Semantics of Inline Methods
Our example method `logged` uses three different kinds of parameters, illustrating
that inlining handles those parameters differently:

1. __By-value parameters__. The compiler generates a `val` binding for *by-value* parameters. This way, the argument expression is evaluated only once before the method body is reduced.

    This can be seen in the parameter `level` from the example.
    In some cases, when the arguments are pure constant values, the binding is omitted and the value is inlined directly.

2. __By-Name parameters__. The compiler generates a `def` binding for *by-name* parameters. This way, the argument expression is evaluated every time it is used, but the code is shared.

    This can be seen in the parameter `message` from the example.

3. __Inline parameters__. Inline parameters do not create bindings and are simply inlined. This way, their code is duplicated everywhere they are used.

    This can be seen in the parameter `op` from the example.

The way the different parameters are translated guarantees that inlining a call **will not change** its semantics.
This implies that the initial elaboration (overloading resolution, implicit search, ...), performed while typing the body of the inline method, will not change when inlined.

For example, consider the following code:

```scala
class Logger:
  def log(x: Any): Unit = println(x)

class RefinedLogger extends Logger:
  override def log(x: Any): Unit = println("Any: " + x)
  def log(x: String): Unit = println("String: " + x)

inline def logged[T](logger: Logger, x: T): Unit =
  logger.log(x)
```

The separate type checking of `logger.log(x)` will resolve the call to the method `Log.log` which takes an argument of the type `Any`.
Now, given the following code:

```scala
logged(new RefinedLogger, "✔️")
```

It expands to:

```
val logger = new RefinedLogger
val x = "✔️"
logger.log(x)
```
Even though now we know that `x` is a `String`, the call `logger.log(x)` still resolves to the method `Log.log` which takes an argument of the type `Any`.

> ##### Inlining preserves semantics
> Regardless of whether `logged` is defined as a `def` or `inline def`, it performs the same operations with only some differences in performance.

### Inline Parameters

One important application of inlining is to enable constant folding optimisation across method boundaries.
Inline parameters do not create bindings and their code is duplicated everywhere they are used.

```scala
inline def perimeter(inline radius: Double): Double =
  2.0 * pi * radius
```
In the above example, we expect that if the `radius` is statically known then the whole computation can be performed at compile-time.
The following call

```scala
perimeter(5.0)
```

is rewritten to:

```Scala
2.0 * pi * 5.0
```

Then `pi` is inlined (we assume the `inline val` definition from the start):

```Scala
2.0 * 3.141592653589793 * 5.0
```

Finally, it is constant folded to

```
31.4159265359
```

> ##### Inline parameters should be used only once
> We need to be careful when using an inline parameter **more than once**.
> Consider the following code:
>
> ```scala
> inline def printPerimeter(inline radius: Double): Double =
>   println(s"Perimeter (r = $radius) = ${perimeter(radius)}")
> ```
> It works perfectly fine when a constant or reference to a val is passed to it.
> ```scala
> printPerimeter(5.0)
> // inlined as
> println(s"Perimeter (r = ${5.0}) = ${31.4159265359}")
> ```
>
> But if a larger expression (possibly with side-effects) is passed, we might accidentally duplicate work.
>
> ```scala
> printPerimeter(longComputation())
> // inlined as
> println(s"Perimeter (r = ${longComputation()}) = ${6.283185307179586 * longComputation()}")
> ```

A useful application of inline parameters is to avoid the creation of _closures_, incurred by the use of by-name parameters.

```scala
def assert1(cond: Boolean, msg: => String) =
  if !cond then
    throw new Exception(msg)

assert1(x, "error1")
// is inlined as
val cond = x
def msg = "error1"
if !cond then
    throw new Exception(msg)
```
In the above example, we can see that the use of a by-name parameter leads to a local definition `msg`, which allocates a closure before the condition is checked.

If we use an inline parameter instead, we can guarantee that the condition is checked before any of the code that handles the exception is reached.
In the case of an assertion, this code should never be reached.
```scala
inline def assert2(cond: Boolean, inline msg: String) =
  if !cond then
    throw new Exception(msg)

assert2(x, "error2")
// is inlined as
val cond = x
if !cond then
    throw new Exception("error2")
```

### Inline Conditionals
If the condition of an `if` is a known constant (`true` or `false`), possibly after inlining and constant folding, then the conditional is partially evaluated and only one branch will be kept.

For example, the following power method contains some `if` that will potentially unroll the recursion and remove all method calls.

```scala
inline def power(x: Double, inline n: Int): Double =
  if (n == 0) 1.0
  else if (n % 2 == 1) x * power(x, n - 1)
  else power(x * x, n / 2)
```
Calling `power` with statically known constants results in the following code:
  ```scala
  power(2, 2)
  // first inlines as
  val x = 2
  if (2 == 0) 1.0 // dead branch
  else if (2 % 2 == 1) x * power(x, 2 - 1) // dead branch
  else power(x * x, 2 / 2)
  // partially evaluated to
  val x = 2
  power(x * x, 1)
  ```
<details>
  <summary> See rest of inlining steps</summary>

```scala
// then inlined as
val x = 2
val x2 = x * x
if (1 == 0) 1.0 // dead branch
else if (1 % 2 == 1) x2 * power(x2, 1 - 1)
else power(x2 * x2, 1 / 2) // dead branch
// partially evaluated to
val x = 2
val x2 = x * x
x2 * power(x2, 0)
// then inlined as
val x = 2
val x2 = x * x
x2 * {
  if (0 == 0) 1.0
  else if (0 % 2 == 1) x * power(x, 0 - 1) // dead branch
  else power(x * x, 0 / 2) // dead branch
}
// partially evaluated to
val x = 2
val x2 = x * x
x2 * 1.0
```
</details>

In contrast, let us imagine we do not know the value of `n`:

```scala
power(2, unkownNumber)
```
Driven by the inline annotation on the parameter, the compiler will try to unroll the recursion.
But without any success, since the parameter is not statically known.

<details>
  <summary>See inlining steps</summary>

```scala
// first inlines as
val x = 2
if (unkownNumber == 0) 1.0
else if (unkownNumber % 2 == 1) x * power(x, unkownNumber - 1)
else power(x * x, unkownNumber / 2)
// then inlined as
val x = 2
if (unkownNumber == 0) 1.0
else if (unkownNumber % 2 == 1) x * {
  if (unkownNumber - 1 == 0) 1.0
  else if ((unkownNumber - 1) % 2 == 1) x2 * power(x2, unkownNumber - 1 - 1)
  else power(x2 * x2, (unkownNumber - 1) / 2)
}
else {
  val x2 = x * x
  if (unkownNumber / 2 == 0) 1.0
  else if ((unkownNumber / 2) % 2 == 1) x2 * power(x2, unkownNumber / 2 - 1)
  else power(x2 * x2, unkownNumber / 2 / 2)
}
// Oops this will never finish compiling
...
```
</details>

To guarantee that the branching can indeed be performed at compile-time, we can use the `inline if` variant of `if`.
Annotating a conditional with `inline` will guarantee that the conditional can be reduced at compile-time and emits an error if the condition is not a statically known constant.

```scala
inline def power(x: Double, inline n: Int): Double =
  inline if (n == 0) 1.0
  else inline if (n % 2 == 1) x * power(x, n - 1)
  else power(x * x, n / 2)
```

```scala
power(2, 2) // Ok
power(2, unkownNumber) // error
```

We will come back to this example later and see how we can get more control on how code is generated.


### Inline Method Overriding

To ensure the correct behavior of combining the static feature of `inline def` with the dynamic feature of interfaces and overriding, some restrictions have to be imposed.

#### Effectively final
Firstly, all inline methods are _effectively final_.
This ensures that the overload resolution at compile-time behaves the same as the one at runtime.

#### Signature preservation
Secondly, overrides must have the _exact same signature_ as the overridden method including the inline parameters.
This ensures that the call semantics are the same for both methods.

#### Retained inline methods
It is possible to implement or override a normal method with an inline method.

Consider the following example:

```scala
trait Logger:
  def log(x: Any): Unit

class PrintLogger extends Logger:
  inline def log(x: Any): Unit = println(x)
```
However, calling the `log` method directly on `PrintLogger` will inline the code, while calling it on `Logger` will not.
To also admit the latter, the code of `log` must exist at runtime.
We call this a _retained inline_ method.

For any non-retained inline `def` or `val` the code can always be fully inlined at all call sites.
Hence, those methods will not be needed at runtime and can be erased from the bytecode.
However, retained inline methods must be compatible with the case that they are not inlined.
In particular, retained inline methods cannot take any inline parameters.
Furthermore, an `inline if` (as in the `power` example) will not work, since the `if` cannot be constant folded in the retained case.
Other examples involve metaprogramming constructs that only have meaning when inlined.

#### Abstract inline methods
It is also possible to create _abstract inline definitions_.

```scala
trait InlineLogger:
  inline def log(inline x: Any): Unit

class PrintLogger extends InlineLogger:
  inline def log(inline x: Any): Unit = println(x)
```

This forces the implementation of `log` to be an inline method and also allows `inline` parameters.
Counterintuitively, the `log` on the interface `InlineLogger` cannot be directly called. The method implementation is not statically known and we thus do not know what to inline.
Calling an abstract inline method thus results in an error.
The usefuleness of abstract inline methods becomes apparent when used in another inline method:

```scala
inline def logged(logger: InlineLogger, x: Any) =
  logger.log(x)
```
Let us assume a call to `logged` on a concrete instance of `PrintLogger`:
```scala
logged(new PrintLogger, "🥧")
// inlined as
val logger: PrintLogger = new PrintLogger
logger.log(x)
```
After inlining, the call to `log` is de-virtualized and known to be on `PrintLogger`.
Therefore also the code of `log` can be inlined.

#### Summary of inline methods
* All `inline` methods are final.
* Abstract `inline` methods can only be implemented by inline methods.
* If an inline method overrides/implements a normal method then it must be retained and retained methods cannot have inline parameters.
* Abstract `inline` methods cannot be called directly (except in inline code).

## Transparent Inline Methods
Transparent inlines are a simple, yet powerful, extension to `inline` methods and unlock many metaprogramming usecases.
Calls to transparents allow for an inline piece of code to refine the return type based on the precise type of the inlined expression.
In Scala 2 parlance, transparents capture the essence of _whitebox macros_.


```scala
transparent inline def default(inline name: String): Any =
  inline if name == "Int" then 0
  else inline if name == "String" then ""
  else ...
```

```scala
val n0: Int = default("Int")
val s0: String = default("String")
```

Note that even if the return type of `default` is `Any`, the first call is typed as an `Int` and the second as a `String`.
The return type represents the upper bound of the type within the inlined term.
We could also have been more precise and have written instead
```scala
transparent inline def default(inline name: String): 0 | "" = ...
```
While in this example it seems the return type is not necessary, it is important when the inline method is recursive.
There it should be precise enough for the recursion to type but will get more precise after inlining.

> ##### Transparents affect binary compatibility
> It is important to note that changing the body of a `transparent inline def` will change how the call site is typed.
> This implies that the body plays a part in the binary and source compatibility of this interface.


## Compiletime Operations

We also provide some operations that evaluate at compiletime.

### Inline Matches
Like inline `if`, inline matches guarantee that the pattern matching can be statically reduced at compile time and only one branch is kept.

In the following example, the scrutinee, `x`, is an inline parameter that we can pattern match on at compile time.

```scala
inline def half(x: Any): Any =
  inline x match
    case x: Int => x / 2
    case x: String => x.substring(0, x.length / 2)

half(6)
// expands to:
// val x = 6
// x / 2

half("hello world")
// expands to:
// val x = "hello world"
// x.substring(0, x.length / 2)
```
This illustrates that inline matches provide a way to match on the static type of some expression.
As we match on the _static_ type of an expression, the following code would fail to compile.

```scala
val n: Any = 3
half(n) // error: n is not statically known to be an Int or a Double
```
Notably, The value `n` is not marked as `inline` and in consequence at compile time
there is not enough information about the scrutinee to decide which branch to take.

### scala.compiletime
The package `scala.compiletime` provides useful metaprogramming abstractions that can be used within `inline` methods to provide custom semantics.

## Macros
Inlining is also the core mechanism used to write macros.
Macros provide a way to control the code generation and analysis after the call is inlined.


```scala
inline def power(x: Double, inline n: Int) =
  ${ powerCode('x, 'n)  }

def powerCode(x: Expr[Double], n: Expr[Int])(using Quotes): Expr[Double] = ...
```


[soft-modifier]: https://dotty.epfl.ch/docs/reference/soft-modifier.html

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
