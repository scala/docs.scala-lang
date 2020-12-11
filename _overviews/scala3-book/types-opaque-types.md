---
title: Opaque Types
type: section
description: This section introduces and demonstrates opaque types in Scala 3.
num: 34
previous-page: types-variance
next-page: types-structural
---


# Opaque types

Opaque types aliases provide type abstraction without any overhead. For example, this introduces `Logarithm` as a new abstract type, which is implemented as `Double`:

```scala
object Logarithms:

  opaque type Logarithm = Double

  object Logarithm:
    // the two ways to lift a Double into the Logarithm type
    def apply(d: Double): Logarithm = math.log(d)
    def safe(d: Double): Option[Logarithm] =
      if (d > 0.0) Some(math.log(d)) else None
  end Logarithm

  // extension methods define opaque types’ public APIs
  extension (x: Logarithm)
    def toDouble: Double = math.exp(x)
    def + (y: Logarithm): Logarithm = Logarithm(math.exp(x) + math.exp(y))
    def * (y: Logarithm): Logarithm = x + y
```

The fact that `Logarithm` is the same as `Double` is only known in the scope where `Logarithm` is defined, which in the above example corresponds to the object `Logarithms`.

>In other words, within the scope, `Logarithm` is treated as a type alias, but this is opaque to the outside world, where `Logarithm` is seen as an abstract type and has nothing to do with `Double`.

The initial public API of `Logarithm` consists of the `apply` and `safe` methods defined in the companion object. They convert `Double` values to `Logarithm` values. Moreover, an operation `toDouble` that converts the other way, and operations `+` and `*` are defined as extension methods on `Logarithm` values. The following operations arevalid because they use functionality implemented in the `Logarithm` object:

```scala
import Logarithms.Logarithm

val l = Logarithm(1.0)
val l2 = Logarithm(2.0)
val l3 = l * l2
val l4 = l + l2
```

But the following operations that attempt to mix `Double` and `Logarithm` values generate type errors:

```scala
val d: Double = l         // error: found: Logarithm, required: Double
val l2: Logarithm = 1.0   // error: found: Double, required: Logarithm
l * 2                     // error: found: Int(2), required: Logarithm
l / l2                    // error: `/` is not a member of Logarithm
```


