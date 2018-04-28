---
layout: multipage-overview
title: Unlifting

discourse: true

partof: quasiquotes
overview-name: Quasiquotes

num: 4

permalink: /overviews/quasiquotes/:title.html
---
**Denys Shabalin** <span class="tag" style="float: right;">EXPERIMENTAL</span>

Unlifting is the reverse operation to [lifting](lifting.html): it takes a tree and recovers a value from it:

    trait Unliftable[T] {
      def unapply(tree: Tree): Option[T]
    }

Due to the fact that the tree may not be a representation of our data type, the return type of unapply is `Option[T]` rather than just `T`. This signature makes it easy to use `Unliftable` instances as extractors.

Whenever an implicit instance of `Unliftable` is available for a given data type you can use it for pattern matching with the help of an ascription syntax:

    scala> val q"${left: Int} + ${right: Int}" = q"2 + 2"
    left: Int = 2
    right: Int = 2

    scala> left + right
    res4: Int = 4

It's important to note that unlifting will not be performed at locations where `Name`, `TermName` or `Modifiers` are extracted by default:

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

Analogously to lifting, this would unlift arguments of the function, element-wise and wrap the result into a `List`.

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

Here one must pay attention to a few nuances:

1. Similarly to `Liftable`, `Unliftable` defines a helper `apply` function in
   the companion object to simplify the creation of `Unliftable` instances. It
   take a type parameter `T` as well as a partial function `PartialFunction[Tree, T]`
   and returns an `Unliftable[T]`. At all inputs where a partial function is defined
   it is expected to return an instance of `T` unconditionally.

2. We've only define `Unliftable` for the runtime universe, it won't be available in macros.
   (see [sharing liftable implementations](lifting.html#reusing-liftable-implementation-between-universes))

3. Patterns used in this unliftable will only match a fully qualified reference to `Point` that
   starts with `_root_`. It won't match other possible shapes of the reference; they have
   to be specified by hand. This problem is caused by a lack of [hygiene](hygiene.html).

4. The pattern will only match trees that have literal `Int` arguments.
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
