---
layout: sip
number: 31
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
  - /sips/pending/byname-implicits.html
stage: completed
status: shipped
title: Byname implicit arguments
---

> This proposal has been implemented in Scala 2.13.0 and Scala 3.0.0.

**Author: Miles Sabin**

**Supervisor and advisor: Martin Odersky**

## History

| Date           | Version                                                            |
| ---------------|--------------------------------------------------------------------|
| Nov 20th 2017  | Initial SIP                                                        |
| Mar 8th  2018  | Simplified covering-set based algorithm                            |
| Apr 17th 2018  | Updated termination proof, non-lazy desugaring, incorporated       |
|                | feedback on covering-set criterion from Martin                     |
| Apr 18th 2018  | Updated link to induction heuristics PR                            |

## Introduction

This SIP proposes extending the support for byname method arguments from just explicit arguments to
both explicit and _implicit_ arguments.

The aim is to support similar use cases to shapeless's `Lazy` type, but without having to rely on a
third party library or fragile and non-portable macros.

The primary use case for shapeless's `Lazy`, and the byname implicit arguments described below, is to
enable the implicit construction of recursive values. This has proven to be a vital capability for
type class derivation, where a type class instance for a recursive data type must typically itself be
recursive. For such a value to be constructible via implicit resolution it must be possible to "tie
the knot" implicitly.

### Implementation status

Byname implicits have been implemented in [Dotty](https://github.com/lampepfl/dotty/issues/1998)
with an earlier iteration of the divergence checking algorithm described below. A full
implementation of this proposal exists as a [pull request](https://github.com/scala/scala/pull/6050)
relative to the 2.13.x branch of the Lightbend Scala compiler and it is scheduled to be included in
the next [Typelevel Scala](https://github.com/typelevel/scala) release. As of [this
comment](https://github.com/scala/scala/pull/6050#issuecomment-347814587) the Scala and Dotty
implementations compile their test cases equivalently.

## Proposal

### Proposal summary

This SIP proposes allowing implicit arguments to be marked as byname. At call sites recursive uses of
implicit values are permitted if they occur in an implicit byname argument.

Consider the following example,

```scala
trait Foo {
  def next: Foo
}

object Foo {
  implicit def foo(implicit rec: Foo): Foo =
    new Foo { def next = rec }
}

val foo = implicitly[Foo]
assert(foo eq foo.next)
```

This diverges due to the recursive implicit argument `rec` of method `foo`. This SIP allows us to
mark the recursive implicit parameter as byname,

```scala
trait Foo {
  def next: Foo
}

object Foo {
  implicit def foo(implicit rec: => Foo): Foo =
    new Foo { def next = rec }
}

val foo = implicitly[Foo]
assert(foo eq foo.next)
```

When compiled, recursive byname implicit arguments of this sort are extracted out as `val`
members of a local synthetic object at call sites as follows,

```scala
val foo: Foo = scala.Predef.implicitly[Foo](
  {
    object LazyDefns$1 {
      val rec$1: Foo = Foo.foo(rec$1)
                       //      ^^^^^
                       // recursive knot tied here
    }
    LazyDefns$1.rec$1
  }
)
assert(foo eq foo.next)
```

and the example compiles with the assertion successful. Note that the recursive use of `rec$1` occurs
within the byname argument of `foo` and is consequently deferred. The desugaring matches what a
programmer would do to construct such a recursive value _explicitly_.

This general pattern is essential to the derivation of type class instances for recursive data
types, one of shapeless's most common applications.

Byname implicits have a number of benefits over the macro implementation of `Lazy` in shapeless,

+ the implementation of `Lazy` in shapeless is extremely delicate, relying on non-portable compiler
  internals. As a language feature, byname implicits are more easily portable to other
  compilers.

+ the shapeless implementation is unable to modify divergence checking, so to solve recursive
  instances it effectively disables divergence checking altogether. This means that incautious use
  of `Lazy` can cause the typechecker to loop indefinitely. A byname implicits implementation is
  able to both solve recursive occurrences _and_ check for divergence.

+ the implementation of `Lazy` interferes with the heuristics for solving inductive implicits in
  this [Scala PR](https://github.com/scala/scala/pull/6481) because the latter depends on being able
  to verify that induction steps strictly reduce the size of the types being solved for; the
  additional `Lazy` type constructors make types appear be non-decreasing in size. Whilst this
  could be special-cased, doing so would require some knowledge of shapeless to be incorporated into
  the compiler. Being a language-level feature, byname implicits can be accommodated directly in the
  induction heuristics.

+ in common cases more implicit arguments would have to be marked as `Lazy` than would have to be
  marked as byname, due to limitations of macros and their interaction with divergence checking. Given
  that there is a runtime cost associated with capturing the thunks required for both `Lazy` and
  byname arguments, any reduction in the number is beneficial.

### Motivating examples

Type class derivation is a technique for inferring instances of type classes for ADTs from a set of
primitive instances, and rules for combining them which are driven by the structure of the ADT.  For
example, `Semigroup` is a type class which expresses that a type has an associative binary operation,

```scala
trait Semigroup[A] {
  def combine(x: A, y: A): A
}
```

If we have instances for basic types,

```scala
object Semigroup {
  implicit val intSemigroup: Semigroup[Int] =
    new Semigroup[Int] {
      def combine(x: Int, y: Int): Int = x + y
    }

  implicit val stringSemigroup: Semigroup[String] =
    new Semigroup[String] {
      def combine(x: String, y: String): String = x + y
    }

  implicit val unitSemigroup: Semigroup[Unit] =
    new Semigroup[Unit] {
      def combine(x: Unit, y: Unit): Unit = ()
    }
}
```

then we can manually write instances for, for example, tuples of types which have `Semigroup`
instances,

```scala
implicit def tuple2Semigroup[A, B]
  (implicit
    sa: Semigroup[A],
    sb: Semigroup[B]):
        Semigroup[(A, B)] =
  new Semigroup[(A, B)] {
    def combine(x: (A, B), y: (A, B)): (A, B) =
      (sa.combine(x._1, y._1),
       sb.combine(x._2, y._2))
  }

implicit def tuple3Semigroup[A, B, C]
  (implicit
    sa: Semigroup[A],
    sb: Semigroup[B],
    sc: Semigroup[C]):
        Semigroup[(A, B, C)] =
  nee Semigroup[(A, B, C)] {
    def combine(x: (A, B, C), y: (A, B, C)): (A, B, C) =
      (sa.combine(x._1, y._1),
       sb.combine(x._2, y._2),
       sc.combine(x._3, y._3))
  }

// etc. ...
```

And we could round this out for all case classes, which have the same product-like structure. Of
course doing this manually requires huge amounts of repetitive boilerplate.

Type class derivation is a mechanism for eliminating this boilerplate. The approach taken in
shapeless is to map ADTs to a sum of products representation (essentially a nested `Either` of
nested pairs), and define type class instances in terms of the representation type.

shapeless provides a a type class `Generic` (see [Appendix 1](#appendix-1--shapeless-excerpts) for
its signature) and instances taking product types to nested pairs and sealed traits to nested
`Eithers` (while shapeless provides instances of this type class via a macro, that is independent
from this SIP, and any similar mechanism might be used) which we can use to provide instances for
arbitrary type classes without needing boilerplate for specific ADTs.

For type classes like `Semigroup` which are meaningful for types which only have a product structure
this is straightforward,

```scala
implicit def genericSemigroup[T, R]
  (implicit
    gen: Generic.Aux[T, R]
    sr:  Semigroup[R]):
         Semigroup[T] =
  new Semigroup[T] {
    def combine(x: T, y: T): T =
      gen.from(sr.combine(gen.to(x), gen.to(y)))
  }
}

// A case class with a Generic instance
case class Foo(i: Int, s: String)

implicitly[Semigroup[Foo]]
```

A `Semigroup` instance for `Foo` is constructed by implicit resolution as follows,

```scala
genericSemigroup(
  generic[Foo], // type R inferred as (Int, (String, Unit))
  tuple2Semigroup(
    intSemigroup,
    tuple2Semigroup(
      stringSemigroup,
      unitSemigroup
    )
  )
)
```

Intuitively we are confident that the nested implicit resolutions will not diverge because once we
have mapped into the tuple representation type `(Int, (String, Unit))` each nested step of the
implicit resolution reduces the size of the required type.

The need for shapeless's `Lazy` or byname implicit arguments becomes apparent when we want to derive
type class instances for recursive ADTs. These come into play when we consider types which are sums of
products rather than just simple products. We can use a basic cons-list as an example,

```scala
sealed trait List[+T]
case class Cons[T](hd: T, tl: List[T]) extends List[T]
case object Nil extends List[Nothing]
```

Here our data type, `List`, is the sum of two product types, `Cons` and `Nil`. The `Cons` constructor
contains a recursive occurrence of `List` as its tail. Working through a simple type class
derivation will illustrate a new issue to be solved.

Let's attempt to derive a `Show` type class instance for `List` similarly to the way we derived
`Semigroup` above. In this case `Generic` will map `List` and its constructors as follows,

```scala
List[T]  -> Either[Cons[T], Unit]
Cons[T]  -> (T, (List[T], Unit))
Nil      -> Unit
```

We define instances for the basic types, pairs, `Either` and types with a `Generic` instance like
so,

```scala
trait Show[T] {
  def show(x: T): String
}

object Show {
  def apply[T](implicit st: Show[T]): Show[T] = st

  implicit val showInt: Show[Int] = new Show[Int] {
    def show(x: Int): String = x.toString
  }

  implicit val showString: Show[String] = new Show[String] {
    def show(x: String): String = x
  }

  implicit val showUnit: Show[Unit] = new Show[Unit] {
    def show(x: Unit): String = ""
  }

  implicit def showPair[T, U]
    (implicit
      st: Show[T],
      su: Show[U]):
          Show[(T, U)] = new Show[(T, U)] {
    def show(t: (T, U)): String = {
      val fst = st.show(t._1)
      val snd = su.show(t._2)
      if(snd == "") fst else s"$fst, $snd"
    }
  }

  implicit def showEither[T, U]
    (implicit
      st: Show[T],
      su: Show[U]):
          Show[Either[T, U]] = new Show[Either[T, U]] {
    def show(x: Either[T, U]): String = x match {
      case Left(t)  => st.show(t)
      case Right(u) => su.show(u)
    }
  }

  implicit def showGeneric[T, R]
    (implicit
      gen: Generic.Aux[T, R],
      sr:  Show[R]):
           Show[T] = new Show[T] {
    def show(x: T): String = sr.show(gen.to(x))
  }
}

val sl = Show[List[Int]] // diverges
assert(
  sl.show(Cons(1, Cons(2, Cons(3, Nil)))) == "1, 2, 3"
)
```

with the aim of having the inferred instance for `List` render as asserted.

However the right hand side of the definition of `sl` does not compile because the implicit
resolution involved is seen as divergent by the compiler. To see why this is the case, observe that
the chain of implicits required to produce a value of type `Show[List[Int]]` develops as follows,

```
       Show[List[Int]]

              V

Show[Either[Cons[Int], Unit]]

              V

      Show[Cons[Int]]

              V

   Show[(Int, List[Int])]

              V

       Show[List[Int]]
```

This chain of implicit expansions repeats, and would do so indefinitely if the compiler didn't detect
and reject expansions of this sort. Indeed, this is what we should expect because the value we are
attempting to construct is itself recursive, and there is no mechanism here to allow us to tie the
knot.

If we were to try to construct a value of this sort by hand we would make use of byname arguments,

```scala
val showListInt: Show[List[Int]] =
  showGeneric(
    generic[List[Int]],
    showEither(
      showGeneric(
        generic[Cons[Int]],
        showPair(
          showInt,
          showPair(
            showListInt,
            showUnit
          )
        )
      ),
      showUnit
    )
  )
```

where at least one argument position between the val definition and the recursive occurrence of
`showListInt` is byname.

This SIP proposes automating the above manual process by,

+ allowing implicit arguments to be byname.

+ constucting a dictionary at call sites where recursive references within byname arguments can be
  defined as vals.

To allow the above example to work as intended we modify the `Show` instance definition as follows,

```scala
object Show {
  def apply[T](implicit st: => Show[T]): Show[T] = st

  // other definitions unchanged ...

  implicit def showGeneric[T, R]
    (implicit
      gen:    Generic.Aux[T, R],
      sr:  => Show[R]):
              Show[T] = new Show[T] {
    def show(x: T): String = sr.show(gen.to(x))
  }
}

val sl = Show[List[Int]] // compiles
assert(
  sl.show(Cons(1, Cons(2, Cons(3, Nil)))) == "1, 2, 3"
)
```

and now the definition of `sl` compiles successfully as,

```scala
val sl: Show[List[Int]] = Show.apply[List[Int]](
  {
    object LazyDefns$1 {
      val rec$1: Show[List[Int]] =
        showGeneric(
          generic[List[Int]],
          showEither(
            showGeneric(
              generic[Cons[Int]]
              showCons(
                showInt,
                showCons(
                  rec$1,
                  showUnit
                )
              )
            ),
            showUnit
          )
        )
    }
    LazyDefns$1.rec$1
  }
)
```

### Proposal details

#### Divergence checking algorithm

We want to ensure that the typechecking of implicit argument expansions terminates, which entails
that all valid implicit expansions must be finite and that all potentially infinite (henceforth
_divergent_) implicit expansions must be detected and rejected in finite time.

The Scala Language Specification describes a divergence checking algorithm in [7.2
Implicit
Parameters](https://www.scala-lang.org/files/archive/spec/2.11/07-implicits.html#implicit-parameters).
We summarize it here.

In the expansion of an implicit argument, implicit resolution identifies a corresponding implicit
definition (the mechanism for selecting one definition where there are alternatives is not relevant
to the discussion of divergence) which might in turn have implicit arguments. This gives rise to a
tree of implicit expansions. If all paths from the root terminate with an implicit definition which
does not itself have further implicit arguments then we say that it _converges_. If it does not then
it _diverges_.

To prevent divergent expansions the specification requires the Scala compiler to maintain a stack of
"open" implicit types and conservatively check that the _core_ type of new types to be added to the
end of that stack are not part of a divergent sequence (the core type of _T_ is _T_ with aliases
expanded, top-level type annotations and refinements removed, and occurrences of top-level
existentially bound variables replaced by their upper bounds). When an implicit argument is fully
resolved it is removed from the end of the stack. The stack represents the current path from the
root of the implicit expansion being explored, in effect it is the state corresponding to a depth
first traversal of the tree of implicit expanions.

The criteria for detecting divergence are that the newly added core type must not _dominate_ any of
the types already on the stack, where a core type _T_ dominates a type _U_ if _T_ is equivalent to
_U_, or if the top-level type constructors of _T_ and _U_ have a common element and _T_ is more
_complex_ than _U_.  The precise definition of the complexity of a type is not relevant here but
roughly corresponds to the size of the AST representing it: intuitively, if we represent types as a
tree with type constructors as internal nodes and types of kind \* as leaf nodes then a type _T_ is
more complex than a type _U_ if the tree representing _T_ has more nodes than the tree representing
_U_. Note in particular that given these definitions the domination relation is partial: there might
be pairs of distinct types with a common top-level type constructor and the same complexity, in
which case neither dominates the other.

A sequence of types _T<sub>n</sub>_ is called _non dominating_ if no _T<sub>i</sub>_ is dominated by
any _T<sub>j</sub>_, where _i_ < _j_.

#### Divergence checking in the Scala Language Specification

The essence of the algorithm described in the Scala Language Specification is as follows,

> Call the sequence of open implicit types _O_. This is initially empty.
>
> To resolve an implicit of type _T_ given stack of open implicits _O_,
>
> + Identify the definition _d_ which satisfies _T_.
>
> + If the core type of _T_ dominates any element of _O_ then we have observed divergence and we're
>   done.
>
> + If _d_ has no implicit arguments then the result is the value yielded by _d_.
>
> + Otherwise for each implicit argument _a_ of _d_, resolve _a_ against _O+T_, and the result is the
>   value yielded by _d_ applied to its resolved arguments.

This procedure yields a tree of implicit expansions where the nodes are labelled with pairs _<d, T>_,
_T_ being the core of the type for which a value is being resolved implicitly and _d_ being the
implicit definition used to supply that value. The children (if any) of _<d, T>_ correspond to the
implicit arguments of _d_, and the tree is rooted at the outermost implicit argument, ie. an implicit
argument of an explicit method call. By construction all paths from the root of the tree are non
dominating.

The following is an informal proof that given this procedure all implicit expansions either converge
or are detected as divergent. This claim is equivalent to the claim that the tree of implicit
expansions is finite.

We make the following assumptions: in any given program there is,

**P1**. a finite number of distinct types with complexity less than or equal to any given complexity _c_.

**P2**. a finite upper bound on the number of implicit arguments of any definition.

First we observe that in any given program all non dominiating sequence of types _T<sub>n</sub>_ are
finite. The type _T<sub>0</sub>_ has some complexity _c_ and **P1** asserts that there are a finite
number of types with complexity less than or equal to _c_, so a standard pigeonhole argument tells us
that eventually the sequence must terminate or visit a type that has a complexity greater than _c_ ∎.

We can show that the tree of implicit expansions is finite by showing that (a) all paths from the root
to a leaf are finite, and then that (b) there is a finite number of paths. (a) follows from the fact
that all paths from the root are non-dominating and the lemma above which shows that all such paths
are finite.  (b) follows from **P2** above and (a): each node has a finite number of children, so can
only introduce a finite number of subpaths and given that all paths are finite we know they can branch
only finitely often ∎.

#### Divergence checking in the Scala compiler

The current Scala compiler implements this algorithm with one variation, which safely admits more
programs as convergent. When checking for divergence the Scala compiler only compares types for
dominance if they correspond to the same implicit definition. In effect this "stripes" the
divergence check across the set of relevant implicit definitions.

This gives us the following,

> To resolve an implicit of type _T_ given stack of open implicits _O_,
>
> + Identify the definition _d_ which satisfies _T_.
>
> + If the core type of _T_ dominates the type _U_ of some element _<d, U>_ of _O_ then we have
>   observed divergence and we're done.
>
> + If _d_ has no implicit arguments then the result is the value yielded by _d_.
>
> + Otherwise for each implicit argument _a_ of _d_, resolve _a_ against _O+<d, T>_, and the result is
>   the value yielded by _d_ applied to its resolved arguments.

Once again this procedure yields a tree of implicit expansions where the nodes are labelled with pairs
_<d, T>_. Given a path from the root of the tree, we call the sequence of nodes which are labelled
with a given definition _d_, in path order, the _definitional subpath_ with respect to _d_. By
construction all definitional subpaths are non-dominating.

We can adapt the previous informal proof to the Scala compiler implementation by showing that (a)
still holds with the additional assumption that in any given program there is,

**P3**. a finite set of implicit definitions _D_.

Each path in the tree consists of nodes labelled with some element of _D_ and so can be
decomposed into an interleaving of definitional subpaths with respect to each of those definitions.
These definitional subpaths are non-dominating and hence, by the earlier lemma, finite. **P3** asserts
that there are only a finite number of these finite paths, so we know that their interleaving must
also be finite ∎.

The practical difference between these two algorithms is illustrated by the following,

```scala
implicit def requiresPair[T](implicit tt: (T, T)): List[T] =
  List(tt._1, tt._2)

implicit def providesPair[T](implicit t: T): (T, T) = (t, t)

implicit val singleInt: Int = 23

implicitly[List[Int]]
```

The tree of implicit expansions is in this case a single path,

```scala
<requiresPair, List[Int]>

           V

<providesPair, (Int, Int)>

           V

   <singleInt, Int>
```

Here, the complexity of `(T, T)` is greater than the complexity of `List[Int]` and so, without the
striping by definition, the more conservative algorithm given in the specification would report
divergence. Thanks to the striping the Scala compiler accepts this program.

#### Divergence checking proposed in this SIP

This SIP changes the above algorithm to accomodate byname cycles. It also revises the definition of
domination to allow an additional class of non-cyclic programs to be safely admitted as convergent
&mdash; whilst non-cyclic, these programs commonly arise in the same sort of type class derivation
scenarios as the cyclic cases we have already seen. See the [further motivating example below](
#motivating-example-for-the-covering-set-based-divergence-critera) for more details.

Call the set of types and type constructors which are mentioned in a type its _covering set_. For
example, given the following types,

```scala
type A = List[(Int, Int)]
type B = List[(Int, (Int, Int))]
type C = List[(Int, String)]
```

the corresponding covering sets are,

```
A: List, Tuple2, Int
B: List, Tuple2, Int
C: List, Tuple2, Int, String
```

Here `A` and `B` have the same covering set, which is distinct from the covering set of `C`. Note that
by the definition given earlier, `A` is not more complex than `B` or `C`, and `B` is more complex than
both `A` and `C`.

We revise the definition of domination as follows: a core type _T_ dominates a type _U_ if _T_ is
equivalent to _U_, or if the top-level type constructors of _T_ and _U_ have a common element and _T_
is more _complex_ than _U_, and _U_ and _T_ have the same covering set. For intuition, observe that if
_T_ is more complex than _U_, and _U_ and _T_ have the same covering set then _T_ is structurally
larger than _U_ despite using only elements that are present in _U_.

This gives us the following,

> To resolve an implicit of type _T_ given stack of open implicits _O_,
>
> + Identify the definition _d_ which satisfies _T_.
>
> + if there is an element _e_ of _O_ of the form _<d, T>_ such that at least one element between _e_
>   and the top of the stack is of the form _<d', => U>_ then we have observed an admissable cycle
>   and we're done.
>
> + If the core type of _T_ dominates the type _U_ of some element _<d, U>_ of _O_ then we have
>   observed divergence and we're done.
>
> + If _d_ has no implicit arguments then the result is the value yielded by _d_.
>
> + Otherwise for each implicit argument _a_ of _d_, resolve _a_ against _O+<d, T>_, and the result is
>   the value yielded by _d_ applied to its resolved arguments.

An informal proof that this this procedure will either converge or are detect divergence is similar
the two given earlier.

First we show that with the revised definition of domination all non dominating sequences of types are
finite, using the additional assumption that in any given program there is,

**P4**. a finite number of type definitions.

And we observe as a consequence that the powerset of the set of type definitions must also be finite,
hence that in any given program there can only be a finite number of distinct covering sets.

Call the complexity of type _T_, _c(T)_, the covering set of _T_, _cs(T)_, the set of all type
definitions in the program _S_ and the powerset of the latter _P(S)_.

From **P1** we know that the number of types with complexity less than or equal to _c(T<sub>0</sub>)_
is finite, so eventually the sequence must reach a type _T<sub>p</sub>_ with a complexity greater than
_c(T<sub>0</sub>)_. For this to be non dominating its covering set _cs(T<sub>p</sub>)_ must differ
from _cs(T<sub>0</sub>)_. Again from **P1** we know that the number of types with complexity less that
_c(T<sub>p</sub>)_ is finite, so eventually the sequence must reach a type _T<sub>q</sub>_ with a
complexity greater than _c(T<sub>p</sub>)_ and so to continue _T<sub>q</sub>_ must have a covering set
_cs(T<sub>q</sub>)_ which is distinct from both _cs(T<sub>0</sub>)_ and _cs(T<sub>p</sub>)_.
Continuing in this way the sequence can increase in complexity while running through distinct covering
sets _cs(T<sub>0</sub>)_, _cs(T<sub>p</sub>)_, _cs(T<sub>q</sub>)_, _cs(T<sub>r</sub>)_ ... which from
**P4** we know must eventually exhaust _P(S)_.

Call the type at which this happens _T<sub>ps</sub>_. Once again from **P1** we know that the number
of types with complexity less than or equal to _c(T<sub>ps</sub>)_ is finite and so will eventually be
exhausted. This time, however, the sequence cannot be extended, because there are no more distinct
covering sets available to be introduced to avoid dominating an earlier element of the sequence ∎.

Finally, as in the previous proof each path in the tree consists of nodes labelled with some element
of _D_ and so can be decomposed into an interleaving of definitional subpaths with respect to each of
those definitions.  These definitional subpaths are non-dominating and hence, by the earlier lemma,
finite. **P3** asserts that there are only a finite number of these finite paths, so we know that
their interleaving must also be finite ∎.


#### Motivating example for the covering set based divergence critera

We follow with a motivating example for the introduction of the covering condition in new divergence
checking model. In current Scala, consider the following set of instances for a type class `Foo`, as
might arise in a type class derivation for simple product types,

```scala
trait Generic[T] {
  type Repr
}
object Generic {
  type Aux[T, R] = Generic[T] { type Repr = R }
}

trait Foo[T]
object Foo {
  implicit val fooUnit: Foo[Unit] = ???
  implicit val fooInt: Foo[Int] = ???
  implicit val fooString: Foo[String] = ???
  implicit val fooBoolean: Foo[Boolean] = ???

  implicit def fooPair[T, U]
    (implicit fooT: Foo[T], fooU: Foo[U]): Foo[(T, U)] = ???

  implicit def fooGen[T, R]
    (implicit gen: Generic.Aux[T, R], fr: Foo[R]): Foo[T] = ???
}

case class A(b: B, i: Int)
object A {
  implicit val genA: Generic.Aux[A, (B, (Int, Unit))] = ???
}

case class B(c: C, i: Int, b: Boolean)
object B {
  implicit val genB:
    Generic.Aux[B, (C, (Int, (Boolean, Unit)))] = ???
}

case class C(i: Int, s: String, b: Boolean)
object C {
  implicit val genC:
    Generic.Aux[C, (Int, (String, (Boolean, Unit)))] = ???
}

implicitly[Foo[C]] // OK
implicitly[Foo[B]] // Diverges
implicitly[Foo[A]] // Diverges
```

Here we have simple product types `A`, `B` and `C` which are nested, but none of which are recursive.
We can see that there is a simple terminating unfolding of their elements into nested pairs, like so,

```
C ->   (Int, (String, (Boolean, Unit)))

B ->  ((Int, (String, (Boolean, Unit))),
       (Int, (Boolean, Unit)))

A -> (((Int, (String, (Boolean, Unit))),
       (Int, (Boolean, Unit))),
       (Int,  Unit))
```

and yet this diverges, why?

The answer is clear if we follow the expansion of `Foo[A]` through from the beginning,

```
               Foo[A]

                 V

       Foo[(B, (Int, Unit))]

                 V

               Foo[B]

                 V

  Foo[(C, (Int, (Boolean, Unit)))]

                 V

               Foo[C]

                 V

Foo[(Int, (String, (Boolean, Unit)))]
```

Here we can see immediately that, on the current critera, divergence will be detected on the fourth
step because we have a more complex type (`Foo[(C, (Int, (Boolean, Unit)))]` vs. `Foo[(B, (Int,
Unit))]`) being resolved in the same context (`fooGen`).

Unsurprisingly examples of this sort arose very early in the developement of shapeless-based type
class derivation, first being documented in a [StackOverflow question from Travis
Brown](https://stackoverflow.com/questions/25923974), even in advance of attempts to derive type
class instances for recursive ADTs.

The new divergence checking algorithm proposed in this SIP permits the example above because the
covering condition is not met. If we look at the covering sets and complexities of the sequence,

```
  Complexity      Covering set

  2               Foo, A
* 6               Foo, B, Int, Unit
  2               Foo, B
* 8               Foo, C, Int, Boolean, Unit
  2               Foo, C
* 8               Foo, Int, String, Boolean, Unit
```

(the `*` prefix indicates steps which are generated via `fooGen` and are hence subject to divergence
checking within the same definitional stripe) we can see that at the 2nd, 4th and 6th steps, although
the size of the types is growing, the covering sets differ.

## Follow on work from this SIP

Byname implicits significantly advance the state of the art, however they are not a complete
replacement for shapeless's `Lazy` pseudo type.  Byname parameters don't generate stable paths for
dependent types. This means that the following shapeless idiom,

```scala
trait Foo {
  type Out
  def out: Out
}

object Test {
  implicit def bar(implicit foo: Lazy[Foo]): foo.value.Out =
    foo.value.out
}
```

cannot be directly translated as,

```scala
trait Foo {
  type Out
  def out: Out
}

object Test {
  implicit def bar(implicit foo: => Foo): foo.Out = foo.out
}
```

because the path `foo` in `foo.Out` is not stable. Full parity with shapeless's `Lazy` would require
lazy (rather than byname) implicit parameters (see [this Dotty
ticket](https://github.com/lampepfl/dotty/issues/3005) for further discussion) and is orthogonal to
this SIP in that they would drop out of support for lazy parameters more generally, as described in
[this Scala ticket](https://github.com/scala/bug/issues/240).

In the meantime we can work around this limitation using the Aux pattern,

```scala
trait Foo {
  type Out
  def out: Out
}

object Foo {
  type Aux[Out0] = Foo { type Out = Out0 }
}

object Test {
  implicit def bar[T](implicit foo: => Foo.Aux[T]): T = foo.out
}
```

shapeless also provides a `Cached` type which has similar characteristics to `Lazy` and which also
shares resolved values between call sites. Future work might address instance sharing generally,
although it would be desirable for this to be an implementation level optimization rather than a
user visible language feature.

## Appendix 1 -- shapeless excerpts

Extracts from shapeless relevant to the motivating examples for this SIP,

```scala
trait Lazy[+T] extends Serializable {
  val value: T
}

object Lazy {
  implicit def apply[T](t: => T): Lazy[T] =
    new Lazy[T] {
      lazy val value = t
    }

  implicit def mkLazy[I]: Lazy[I] = macro ...
}

trait Generic[T] {
  type Repr
  def to(t: T): Repr
  def from(r: Repr): T
}
```
