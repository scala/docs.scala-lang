---
layout: overview-large
title: Unlifting

disqus: true

partof: quasiquotes
num: 4
outof: 13
languages: [ko]
---
**Denys Shabalin** <span class="label warning" style="float: right;">EXPERIMENTAL</span>

Unlifting is the reverse operation to [lifting](/overviews/quasiquotes/lifting.html): it takes a tree and recovers value from it:

    trait Unliftable[T] {
      def unapply(tree: Tree): Option[T]
    }

Due to the fact that tree might not be a represention of our data type, the return type of unapply is `Option[T]` rather than just `T`. Such signature also makes it easy to use `Unliftable` instances as extractors.

Whenever implicit instance of `Unliftable` is available for given data type you can use it for pattern matching with the help of ascription syntax:

    scala> val q"${left: Int} + ${right: Int}" = q"2 + 2"
    left: Int = 2
    right: Int = 2

    scala> left + right
    res4: Int = 4

It's important to note that unlifting will not be performed at locations where `Name`, `TermName` or `Modifiers` is extracted by default:

    scala> val q"foo.${bar: Int}" = q"foo.bar"
    <console>:29: error: pattern type is incompatible with expected type;
     found   : Int
     required: universe.NameApi
           val q"foo.${bar: Int}" = q"foo.bar"
                            ^

One can also successfully combine unquote splicing and unlifting:

    scala> val q"f(..${ints: List[Int]})" = q"f(1, 2, 3)"
    ints: List[Int] = List(1, 2, 3)

    scala> val q"f(...${intss: List[List[Int]]})" = q"f(1, 2, 3)(4, 5)(6)"
    intss: List[List[Int]] = List(List(1, 2, 3), List(4, 5), List(6))

Analogously to lifting it would unlift arguments of the function elementwise and wrap the result into a list.

## Bring your own

Similarly to liftables one can define your own unliftables:

    package Points

    import scala.universe._

    case class Point(x: Int, y: Int)
    object Point {
      implicit val unliftPoint = Unliftable[points.Point] {
        case q"_root_.points.Point(${x: Int}, ${y: Int})" => Point(x, y)
      }
    }

Here one needs to pay attention to a few nuances:

0. Similarly to `Liftable`, `Unliftable` defines a helper `apply` function in companion
   to simplify creation of `Unliftable` instances which takes a type parameter `T` and
   a partial function `PartialFunction[Tree, T]` and returns `Unliftable[T]`. At all
   inputs where partial function is defined it's expected to unconditionally return
   instance of `T`.

1. We only define `Unliftable` for runtime universe, it won't be available in macros.
   (see [sharing liftable implementations](/overviews/quasiquotes/lifting.html#reusing-liftable-implementation-between-universes))

2. Pattern used in this unliftable will only match fully qualified reference to Point that
   starts with `_root_`. It won't match other possible shapes of the reference and they have
   to be specified by hand. This problem is caused by lack of [hygiene](/overviews/quasiquotes/hygiene.html).

3. The pattern will also only match trees that have literal `Int` arguments.
   It won't work for other expressions that might evaluate to `Int`.

## Standard Unliftables

 Type                           | Representation        | Value
--------------------------------|-----------------------|------
 `Byte`, `Short`, `Int`, `Long` | `q"0"`                | `0`
 `Float`                        | `q"0.0"`              | `0.0`
 `Double`                       | `q"0.0D"`             | `0.0D`
 `Boolean`                      | `q"true"`, `q"false"` | `true`, `false`
 `Char`                         | `q"'c'"`              | `'c'`
 `Unit`                         | `q"()"`               | `()`
 `String`                       | `q""" "string" """`   | `"string"`
 `Symbol`                       | `q"'symbol"`          | `'symbol`
 `TermName`                     | `q"foo"`, `pq"foo"`   | `TermName("foo")`
 `TypeName`                     | `tq"foo"`             | `TypeName("foo")`
 `Type`                         | `tt: TypeTree`        | `tt.tpe`
 `Constant`                     | `lit: Literal`        | `lit.value`
 `TupleN[...]` \*               | `q"(1, 2)"`           | `(1, 2)`

 (\*) Unliftable for tuples is defined for all N in [2, 22] range. All type parameters have to be Unliftable themselves.


