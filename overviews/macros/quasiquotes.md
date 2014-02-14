---
layout: overview-large
title: Quasiquotes

disqus: true

partof: macros
num: 7
languages: [ja]
---
<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako**

Quasiquotes are shipped with recent milestone builds of Scala 2.11, starting from 2.11.0-M4. They are also available in Scala 2.10 with the macro paradise plugin. Follow the instructions at the ["Macro Paradise"](/overviews/macros/paradise.html) page to download and use our compiler plugin.

Note that both in 2.10.x and in 2.11, quasiquotes don't bring transitive dependencies on macro paradise,
which means that you can write macros using quasiquotes from macro paradise for 2.10.x, and people will be able
to use them with vanilla 2.10.x.
Neither your code that uses quasiquotes from macro paradise, nor the users of such code will need to have macro paradise
on their classpath at runtime.

## Intuition

Consider an `async` [macro annotation](/overviews/macros/annotations.html), which takes a class or an object and duplicates their methods with asynchronous counterparts wrapped in `future`.

    @async
    class D {
      def x = 2
      // def asyncX = future { 2 }
    }

    val d = new D
    d.asyncX onComplete {
      case Success(x) => println(x)
      case Failure(_) => println("failed")
    }

An implementation of such a macro might look as the code at the snippet below. This routine - acquire, destructure, wrap in generated code, restructure again - is quite familiar to macro writers.

    case ClassDef(_, _, _, Template(_, _, defs)) =>
      val defs1 = defs collect {
        case DefDef(mods, name, tparams, vparamss, tpt, body) =>
          val tpt1 = if (tpt.isEmpty) tpt else AppliedTypeTree(
            Ident(newTermName("Future")), List(tpt))
          val body1 = Apply(
            Ident(newTermName("future")), List(body))
          val name1 = newTermName("async" + name.capitalize)
          DefDef(mods, name1, tparams, vparamss, tpt1, body1)
      }
      Template(Nil, emptyValDef, defs ::: defs1)

However even seasoned macro writers will admit that this code, even though it's quite simple, is exceedingly verbose, requiring one to understand the details internal representation of code snippets, e.g. the difference between `AppliedTypeTree` and `Apply`. Quasiquotes provide a neat domain-specific language that represents parameterized Scala snippets with Scala:

    val q"class $name extends Liftable { ..$body }" = tree

    val newdefs = body collect {
      case q"def $name[..$tparams](...$vparamss): $tpt = $body" =>
        val tpt1 = if (tpt.isEmpty) tpt else tq"Future[$tpt]"
        val name1 = newTermName("async" + name.capitalize)
        q"def $name1[..$tparams](...$vparamss): $tpt1 = future { $body }"
    }

    q"class $name extends AnyRef { ..${body ++ newdefs} }"

At the moment quasiquotes suffer from [SI-6842](https://issues.scala-lang.org/browse/SI-6842), which doesn't let one write the code as concisely as mentioned above. A [series of casts](https://gist.github.com/7ab617d054f28d68901b) has to be applied to get things working.

## Details

Quasiquotes are implemented as a part of the `scala.reflect.api.Universe` cake, which means that it is enough to do `import c.universe._` to use quasiquotes in macros. Exposed API provides `q`, `tq`, `cq` and `pq` [string interpolators](/overviews/core/string-interpolation.html) (corresponding to term and type quasiquotes), which support both construction and deconstruction, i.e. can be used both in normal code and on the left-hand side of a pattern case.

| Flavor | Works with | Construction          | Deconstruction                |
|--------|------------|-----------------------|-------------------------------|
| `q`    | Term trees | `q"future{ $body }"`  | `case q"future{ $body }" =>`  |
| `tq`   | Type trees | `tq"Future[$t]"`      | `case tq"Future[$t]" =>`      |
| `cq`   | Cases      | `cq"x => x"`          | `case cq"$pat => ${_}" =>`    |
| `pq`   | Patterns   | `pq"xs @ (hd :: tl)"` | `case pq"$id @ ${_}" =>`      |

Unlike regular string interpolators, quasiquotes support multiple flavors of splices in order to distinguish between inserting/extracting single trees, lists of trees and lists of lists of trees. Mismatching cardinalities of splicees and splice operators results in a compile-time error.

    scala> val name = TypeName("C")
    name: reflect.runtime.universe.TypeName = C

    scala> val q"class $name1" = q"class $name"
    name1: reflect.runtime.universe.Name = C

    scala> val args = List(Literal(Constant(2)))
    args: List[reflect.runtime.universe.Literal] = List(2)

    scala> val q"foo(..$args1)" = q"foo(..$args)"
    args1: List[reflect.runtime.universe.Tree] = List(2)

    scala> val argss = List(List(Literal(Constant(2))), List(Literal(Constant(3))))
    argss: List[List[reflect.runtime.universe.Literal]] = List(List(2), List(3))

    scala> val q"foo(...$argss1)" = q"foo(...$argss)"
    argss1: List[List[reflect.runtime.universe.Tree]] = List(List(2), List(3))

## Tips and tricks

### Liftable

To simplify splicing of non-trees, quasiquotes provide the `Liftable` type class, which defines how values are transformed into trees when spliced in. We provide instances of `Liftable` for primitives and strings, which wrap those in `Literal(Constant(...))`. You might want to define your own instances for simple case classes and lists.

    trait Liftable[T] {
      def apply(universe: api.Universe, value: T): universe.Tree
    }
