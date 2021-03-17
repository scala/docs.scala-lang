---
title: Opaque Types
type: section
description: This section introduces and demonstrates opaque types in Scala 3.
num: 54
previous-page: types-variance
next-page: types-structural
---

Scala 3 _Opaque type aliases_ provide type abstractions without any **overhead**.

## Abstraction Overhead

Let us assume we want to define a module that offers arithmetic on numbers, which are represented by their logarithm.
This can be useful to improve precision when the numerical values involved tend to be very large, or close to zero.

Since it is important to distinguish “regular” double values from numbers stored as their logarithm, we introduce a class `Logarithm`:

```scala
class Logarithm(protected val underlying: Double):
  def toDouble: Double = math.exp(underlying)
  def + (that: Logarithm): Logarithm =
    // here we use the apply method on the companion
    Logarithm(this.toDouble + that.toDouble)
  def * (that: Logarithm): Logarithm =
    new Logarithm(this.underlying + that.underlying)

object Logarithm:
  def apply(d: Double): Logarithm = new Logarithm(math.log(d))
```
The apply method on the companion object lets us create values of type `Logarithm` which we can use as follows:
```scala
val l2 = Logarithm(2.0)
val l3 = Logarithm(3.0)
println((l2 * l3).toDouble) // prints 6.0
println((l2 + l3).toDouble) // prints 4.999...
```
While the class `Logarithm` offers a nice abstraction for `Double` values that are stored in this particular logarithmic form, it imposes severe performance overhead: For every single mathematical operation, we need to extract the underlying value and then wrap it again in a new instance of `Logarithm`.


## Module Abstractions
Let us consider another approach to implement the same library.
This time instead of defining `Logarithm` as a class, we define it using a _type alias_.
First, we define an abstract interface of our module:

```scala
trait Logarithms:

  type Logarithm

  // operations on Logarithm
  def add(x: Logarithm, y: Logarithm): Logarithm
  def mul(x: Logarithm, y: Logarithm): Logarithm

  // functions to convert between Double and Logarithm
  def make(d: Double): Logarithm
  def extract(x: Logarithm): Double

  // extension methods to use `add` and `mul` as "methods" on Logarithm
  extension (x: Logarithm)
    def toDouble: Double = extract(x)
    def + (y: Logarithm): Logarithm = add(x, y)
    def * (y: Logarithm): Logarithm = mul(x, y)
```
Now, let us implement this abstract interface by saying type `Logarithm` is equal to `Double`:
```scala
object LogarithmsImpl extends Logarithms:

  type Logarithm = Double

  // operations on Logarithm
  def add(x: Logarithm, y: Logarithm): Logarithm = make(x.toDouble + y.toDouble)
  def mul(x: Logarithm, y: Logarithm): Logarithm = x + y

  // functions to convert between Double and Logarithm
  def make(d: Double): Logarithm = math.log(d)
  def extract(x: Logarithm): Double = math.exp(x)
```
Within the implementation of `LogarithmsImpl`, the equation `Logarithm = Double` allows us to implement the various methods.

#### Leaky Abstractions
However, this abstraction is slightly leaky.
We have to make sure to _only_ ever program against the abstract interface `Logarithms` and never directly use `LogarithmsImpl`.
Directly using `LogarithmsImpl` would make the equality `Logarithm = Double` visible for the user, who might accidentally use a `Double` where a logarithmic double is expected.
For example:

```scala
import LogarithmsImpl.*
val l: Logarithm = make(1.0)
val d: Double = l // type checks AND leaks the equality!
```

Having to separate the module into an abstract interface and implementation can be useful, but is also a lot of effort, just to hide the implementation detail of `Logarithm`.
Programming against the abstract module `Logarithms` can be very tedious and often requires the use of advanced features like path-dependent types, as in the following example:

```scala
def someComputation(L: Logarithms)(init: L.Logarithm): L.Logarithm = ...
```

#### Boxing Overhead
Type abstractions, such as `type Logarithm` [erase](https://www.scala-lang.org/files/archive/spec/2.13/03-types.html#type-erasure) to their bound (which is `Any` in our case).
That is, although we do not need to manually wrap and unwrap the `Double` value, there will be still some boxing overhead related to boxing the primitive type `Double`.

## Opaque Types
Instead of manually splitting our `Logarithms` component into an abstract part and into a concrete implementation, we can simply use opaque types in Scala 3 to achieve a similar effect:

```scala
object Logarithms:
//vvvvvv this is the important difference!
  opaque type Logarithm = Double

  object Logarithm:
    def apply(d: Double): Logarithm = math.log(d)

  extension (x: Logarithm)
    def toDouble: Double = math.exp(x)
    def + (y: Logarithm): Logarithm = Logarithm(math.exp(x) + math.exp(y))
    def * (y: Logarithm): Logarithm = x + y
```
The fact that `Logarithm` is the same as `Double` is only known in the scope where `Logarithm` is defined, which in the above example corresponds to the object `Logarithms`.
The type equality `Logarithm = Double` can be used to implement the methods (like `*` and `toDouble`).

However, outside of the module the type `Logarithm` is completely encapsulated, or “opaque.” To users of `Logarithm` it is not possible to discover that `Logarithm` is actually implemented as a `Double`:

```scala
import Logarithms.*
val l2 = Logarithm(2.0)
val l3 = Logarithm(3.0)
println((l2 * l3).toDouble) // prints 6.0
println((l2 + l3).toDouble) // prints 4.999...

val d: Double = l2 // ERROR: Found Logarithm required Double
```

Even though we abstracted over `Logarithm`, the abstraction comes for free:
Since there is only one implementation, at runtime there will be _no boxing overhead_ for primitive types like `Double`.

### Summary of Opaque Types
Opaque types offer a sound abstraction over implementation details, without imposing performance overhead.
As illustrated above, opaque types are convenient to use, and integrate very well with the [Extension Methods][extension] feature.


[extension]: {% link _overviews/scala3-book/ca-extension-methods.md %}
