SIP-ZZ - NewType Classes

# Introduction

This is a proposal to introduce syntax for classes in Scala that can
get completely inlined, so operations on these classes have zero
overhead compared to external methods. Some use cases for inlined
classes are:

 * Inlined implicit wrappers. Methods on those wrappers would be
   translated to extensions methods.

 * New numeric classes, such as unsigned ints. There would no longer
   need to be a boxing overhead for such classes. So this is similar
   to value types in .NET.

 * Classes representing units of measure. Again, no boxing overhead
   would be incurred for these classes.

The proposal is currently in an early stage. It’s not yet been
implemented, and the proposed implementation strategy is too
complicated to be able to predict with certainty that it will work as
specified. Consequently, details of the proposal might change driven
by implementation concerns.

# NewType Classes

The gist of the proposal is to allow user-defined classes to extend
from `NewType` in situations like this:

```scala
class C (val u: U) extends NewType {
  def m1(ps1) = ...
  ...
  def mN(psN) = ...
}
```

Such classes are called newtype classes. A newtype class C must
satisfy the following criteria:

 * `C` must be a class.

 * `C` must not be abstract (`abstract class`), a `case class` or an enum.

 * `C` must have exactly one parameter, which is marked with `val` and
   which has `public` accessibility. The type of that parameter
   (e.g. `U` above) is called the underlying type of `C`.

 * Other than its underlying value (of type `U`) `C` may not define
   any other `val` members (`def` members are OK).

 * `C` must not extend any parents (other than the implicit `scala.AnyRef`).

 * `C` may not have type parameters.

  * `C` may not define secondary constructors or early definitions.

 * `C` may not define concrete `equals`, `hashCode`, or `toString`
   methods.

 * `C` must be either a top-level class or a member of a statically
   accessible object.

 * `C` must be ephemeral (as defined in SIP-15).

The runtime representation of `C` is always the same as the runtime
representation of `U` (its underlying type). This means that
`ClassTag[U]` is used as `C`'s class tag, `Array[C]` erases to `[]U`
in Java, and so on.

The following implicit assumptions apply to newtype classes.

 * Newtype classes are implicitly treated as `final`, so they cannot be
   extended by other classes.

 * Newtype classes are implicitly assumed to have structural equality
   and hash codes (using their underlying value). Their universal
   methods (`equals`, `toString`, `hashCode`) cannot be implemented,
   and are erased to those defined by `U`.

# Universal traits

Unlike value classes, newtype classes cannot extend universal traits.

# Expansion of newtype classes.

Newtype classes are expanded as follows. For concreteness, we assume a
newtype class `Logarithm` that is defined like this:

```scala
class Logarithm(val exponent: Double) extends NewType {
  def toDouble: Double = math.exp(exponent)

  def plus(that: Logarithm): Logarithm = Logarithm.logOf(toDouble + that.toDouble)
  def plus(n: Double): Logarithm = Logarithm.logOf(toDouble + n)

  def times(that: Logarithm): Logarithm = new Logarithm(exponent + that.exponent)
}

object Logarithm {
  def logOf(n: Double): Logarithm = {
    require(n > 0.0)
    new Logarithm(math.log(n))
  }
}
```

# Steps

We can express the required code transformations in three steps. In
practice we may do the transformation in a single transformation step,
but logically breaking up the transformations makes them easier to
discuss in this document.

## Step 1: Extracting methods.

Let the extractable methods of a newtype class be all methods that are
directly declared in the class. (It is not possible for a newtype
class to inherit methods.) For each extractable method `m`, we create
another method named `extension$m` in the companion object of that
class (if no companion object exists, a fresh one is created). The
`extension$m` method takes an additional parameter in first position
which is named `$this` and has runtime representation as its
type. Generally, in a value class

    class C(val u: U) extends AnyVal

a method

    def m(params): R = body

is expanded to the following method in the companion object of class C:

    def extension$m($this: C, params): R = body2

Here `body2` is the same as body with each occurence of `this` or
`C.this` replaced by `$this`.

Overloaded methods may be also augmented with an additional integer to
distinguish them after types are erased (see the transformations of
the `add` method in the following steps).

In our example, the `Logarithm` companion would be expanded as
follows:

```scala
object Logarithm {
  def logOf(n: Double): Logarithm = {
    require(n > 0.0)
    new Logarithm(math.log(n))
  }

  // generated methods follow
  def extension$toDouble($this: Logarithm): Double =
    math.exp($this.exponent)

  def extension1$plus($this: Logarithm, that: Logarithm): Logarithm =
    Logarithm.logOf($this.toDouble + that.toDouble)

  def extension2$plus($this: Logarithm, n: Double): Logarithm =
    Logarithm.logOf($this.toDouble + n)

  def extension$times($this: Logarithm, that: Logarithm): Logarithm =
    new Logarithm($this.exponent + that.exponent)
}
```

Currently, we think that certain annotations (like `@inline`) will not
be preserved when methods are extracted and rerouted. We think that
most other annotations will be supported but more work is needed here.

## Step 2: Rerouting calls

In this step any call to a method that got extracted in step 1 into a
companion object gets redirected to the newly created method in that
companion object. Generally, a call:

```scala
p.m(args)
```

where `m` is an extractable method declared in a newtype class `C`
gets rewritten to:

```scala
C.extension$m(p, args)
```

For instance the two calls in the following code fragment:

```scala
val x: Logarithm = new Logarithm(1.0)
val y: Logarithm = new Logarithm(2.0)
val z = x.times(y)
val a = x.plus(12345.0)
```

would be rewritten to

```scala
val x: Logarithm = new Logarithm(1.0)
val y: Logarithm = new Logarithm(2.0)
val z = Logarithm.extension$times(x, y)
val a = Logarithm.extension2$plus(x, 12345.0)
```

(Note that at this point we are still talking about the `Logarithm`
type. We've just re-routed calls to extension methods, so that we are
no longer accessing any members of `Logarithm` except for its
underlying value `exponent`.)

## Step 3: Unwrapping

At this point, using `U` (the underlying type of `C`) we calculate
`C`'s transitive underlying type (called `W`). This is done by the
following recursive definition:

 * If `U` is a newtype class, use the transitive underlying type of `U`.
 * Otherwise, use `U` as the transitive underlying type.

We now do the following four replacements:

 1. We replace every occurence of the type `C` in a symbol’s type or
    in a tree’s type annotation by `W`.

 2. We replace every occurence of `new C(e)` with `e`.

 3. We replace every occurence of `(c: C).u` with `c`. (After applying
    replacement 1 the type of `c` here will actually be `W`.)

 4. We replace any other methods calls `(c: C).m` with `c.m`. These
    will be universal methods available on `Any`, which we need to
    re-route to the underlying value. (Examples includes `equals`,
    `hashCode`, `toString`, etc.)

We then re-typecheck the program.

Types such as `Array`, `ClassTag`, `Class`, etc. will all be rewritten
according to these same rules:

 * `Array[C]` becomes `Array[W]`
 * `ClassTag[C]` becomes `ClassTag[W]`
 * `Class[C]` becomes `Class[W]`

Newtype classes are removed at this stage. That is, the class `C` is
removed (although the companion object `C` stays). Other than the
companion, there should be no mention of `C` (either as a class or a
type) in any tree.

The effect of this is that at runtime values whose provided type was
`C` are not distinguishable from values whose type is `W`.

# Timing

These rewrites should occur as early as possible (but after typer, of
course). Specifically, we would like for these to occur before the
existing `AnyVal` rewrites, before the specialization phase, and
before the erasure phase.

This allows us to support specialized newtype classes, as well as
wrapping `AnyVal` types in newtype classes. It also means that
platforms like *scala-js* don't have to worry about adding encodings
for newtypes (since they reduce to the existing language).

# Examples

## Example 1

The program statements on the left are converted using steps 1 to 3 to
the statements on the right.

    var m, n: Logarithm       var m, n: Double
    var o: AnyRef             var o: AnyRef
    m = n                     m = n
    o = m                     o = m.asInstanceOf[AnyRef]
    m plus n                  Logarithm.extension1$plus(m, n)
    o.isInstanceOf[Logarithm] o.isInstanceOf[Double]
    o.asInstanceOf[Logarithm] o.asInstanceOf[Double]
    m.isInstanceOf[Logarithm] m.isInstanceOf[Double]
    m.asInstanceOf[Logarithm] m.asInstanceOf[Double]

## Example 2

After all 3 steps the `Logarithm` class is translated to the following
code.

```scala
object Logarithm {
  def logOf(n: Double): Double = {
    require(n > 0.0)
    math.log(n)
  }

  // generated methods follow
  def extension$toDouble($this: Double): Double =
    math.exp($this)

  def extension1$plus($this: Double, that: Double): Double =
    Logarithm.logOf(Logarithm.extension$toDouble($this) + Logarithm.extension$toDouble(that))

  def extension2$plus($this: Double, n: Double): Double =
    Logarithm.logOf(Logarithm.extension$toDouble($this) + n)

  def extension$times($this: Double, that: Double): Double =
    $this + that
}
```

Note that the two `plus` methods end up with the same type in object
`Logarithm`. That’s why we needed to distinguish them by adding an
integer number.

The same situation can arise in other circumstances as well: Two
overloaded methods might end up with the same type after
unwrapping. In the general case, Scala would treat this situation as
an error, as it would for other types that get erased. So we propose
to solve only the specific problem that multiple overloaded methods in
a newtype class itself might clash after unwrapping.

## Further Optimizations?

We could imagine this newtype feature being generalized to tuples. In
that case, a newtype class could wrap *N* values (0-22), and be
represented either by 0-22 positional parameters (in the extension
methods) or by a single tuple of the appropriate arity (when a reified
value was needed, e.g. for use in a collection).

Newtype classes as written here can already wrap tuples in a
transparent way, so the required addition would be allowing multiple
parameters to be provided positionally rather than in a tuple
(i.e. adding two kinds of extension method for every method in the
base class).

Work in this direction should only start once single-parameter newtype
classes are implemented (at least experimentally), since one of the
places multi-value newtype classes may struggle is in performance.
