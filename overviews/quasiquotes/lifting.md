---
layout: overview-large
title: Lifting

disqus: true

partof: quasiquotes
num: 3
outof: 13
languages: [ko]
---
**Denys Shabalin** <span class="label warning" style="float: right;">EXPERIMENTAL</span>

Lifting is an extensible way to unquote custom data types in quasiquotes. Its primary use-case is support unquoting of [literal](/overviews/quasiquotes/expression-details.html#literal) values and a number of reflection primitives as trees:

    scala> val two = 1 + 1
    two: Int = 2

    scala> val four = q"$two + $two"
    four: universe.Tree = 2.$plus(2)

This code runs successfully because `Int` is considered to be `Liftable` by default. `Liftable` type is just a trait with a single abstract method that defines a mapping of given type to tree:

    trait Liftable[T] {
      def apply(value: T): Tree
    }

Whenever there is an implicit value of `Liftable[T]` available, one can unquote `T` in quasiquotes. This design pattern is known as a type class. You can read more about it in ["Type Classes as Objects and Implicits"](http://ropas.snu.ac.kr/~bruno/papers/TypeClasses.pdf).

A number of data types that are supported natively by quasiquotes will never trigger usage of `Liftable` representation even if it\'s available: subtypes of `Tree`, `Symbol`, `Name`, `Modifiers` and `FlagSet`.

One can also combine lifting and unquote splicing:

    scala> val ints = List(1, 2, 3)
    scala> val f123 = q"f(..$ints)"
    f123: universe.Tree = f(1, 2, 3)

    scala> val intss = List(List(1, 2, 3), List(4, 5), List(6))
    scala> val f123456 = q"f(...$intss)"
    f123456: universe.Tree = f(1, 2, 3)(4, 5)(6)

In this case each element of the list will be lifted separately and the result will be spliced right in.

## Bring your own

To define tree representation for your own data type just provide an implicit instance of `Liftable` for it:

    package points

    import scala.universe._

    case class Point(x: Int, y: Int)
    object Point {
      implicit val lift = Liftable[Point] { p =>
        q"_root_.points.Point(${p.x}, ${p.y})"
      }
    }

This way whenever a value of Point type is unquoted in runtime quasiquote it will be automatically transformed
into a case class constructor call. In this example there two important points to take into account:

0. Liftable companion contains helper `apply` method to simplifies creation of `Liftable` instances.
   It takes a single type parameter `T` and a `T => Tree` function as a single value parameter and
   returns a `Liftable[T]`.

1. Here we only defined `Liftable` for runtime reflection. It won't be found if you try to
   use it from a macro due to the fact that each universe contains its own `Liftable` which is not
   compatible with the others. This problem is caused by path-dependent nature of current reflection
   api. (see [sharing liftable implementation between universes](#reusing-liftable-implementation-between-universes))

2. Due to lack of [hygiene](/overviews/quasiquotes/hygiene.html), reference to point companion
   has to be fully qualified to ensure correctness in of this tree in every possible context. Another
   way to workaround reference issue is to use symbols to refer to things:

       val PointSym = symbolOf[Point].companionModule
       implicit val lift = Liftable[Point] { p =>
         q"$PointSym(${p.x}, ${p.y})"
       }

## Standard Liftables

 Type                           | Value                 | Representation
--------------------------------|-----------------------|---------------
 `Byte`, `Short`, `Int`, `Long` | `0`                   | `q"0"`
 `Float`                        | `0.0`                 | `q"0.0"`
 `Double`                       | `0.0D`                | `q"0.0D"`
 `Boolean`                      | `true`, `false`       | `q"true"`, `q"false"`
 `Char`                         | `'c'`                 | `q"'c'"`
 `Unit`                         | `()`                  | `q"()"`
 `String`                       | `"string"`            | `q""" "string" """`
 `Symbol`                       | `'symbol`             | `q"'symbol"`
 `Array[T]` †                   | `Array(1, 2)`         | `q"s.Array(1, 2)"` ‡
 `Option[T]` †                  | `Some(1)`             | `q"s.Some(1)"` ‡
 `Vector[T]` †                  | `Vector(1, 2)`        | `q"s.c.i.Vector(1, 2)"` ‡
 `List[T]` †                    | `List(1, 2)`          | `q"s.c.i.List(1, 2)"` ‡
 `Map[K, V]` †                  | `Map(1 -> 2)`         | `q"s.c.i.Map((1, 2))"` ‡
 `Set[T]` †                     | `Set(1, 2)`           | `q"s.c.i.Set(1, 2)"` ‡
 `Either[L, R]` †               | `Left(1)`             | `q"s.u.Left(1)"` ‡
 `TupleN[...]` \* †             | `(1, 2)`              | `q"(1, 2)"`
 `TermName`                     | `TermName("foo")`     | `q"foo"`
 `TypeName`                     | `TypeName("foo")`     | `tq"foo"`
 `Tree`                         | `tree`                | `tree`
 `Expr`                         | `expr`                | `expr.tree`
 `Type`                         | `typeOf[Int]`         | `TypeTree(typeof[Int])`
 `TypeTag`                      | `ttag`                | `TypeTree(ttag.tpe)`
 `Constant`                     | `const`               | `Literal(const)`

 (\*) Liftable for tuples is defined for all `N` in `[2, 22]` range.

 (†) All type parameters have to be Liftable themselves.

 (‡) `s.` is shorthand for scala, `s.c.i.` for `scala.collection.immutable`, `s.u.` for `scala.util.`

## Reusing Liftable implementation between universes

Due to path dependent nature of current reflection API it isn't trivial to share the same Liftable definition between both macro and runtime universes. A possible way to do this is to define Liftable implementations in a trait and instantiate it for each universe separately:

    import scala.reflect.api.Universe
    import scala.reflect.macros.blackbox.Context

    trait LiftableImpls {
      val universe: Universe
      import universe._

      implicit val liftPoint = Liftable[points.Point] { p =>
        q"_root_.points.Point(${p.x}, ${p.y})"
      }
    }

    object RuntimeLiftableImpls extends LiftableImpls {
      val universe: universe.type = universe
    }

    trait MacroLiftableImpls extends LiftableImpls {
      val c: Context
      val universe: c.universe.type = c.universe
    }

    // macro impls defined as a bundle
    class MyMacro(val c: Context) extends MacroLiftableImpls {
      // ...
    }

So in practice it's much easier to just define a liftable for given universe at hand:

    import scala.reflect.macros.blackbox.Context

    // macro impls defined as a macro bundle
    class MyMacros(c: Context) {
      import c.universe._

      implicit val liftPoint = Liftable[points.Point] { p =>
        q"_root_.points.Point(${p.x}, ${p.y})"
      }

      // ...
    }


