---
layout: overview-large
title: What is breakOut, and how does it work?

disqus: true

partof: FAQ
num: 5
---
You might have encountered some code like the one below, and wonder what is
`breakOut`, and why is it being passed as parameter?

    import scala.collection.breakOut
    val map : Map[Int,String] = List("London", "Paris").map(x => (x.length, x))(breakOut)


The answer is found on the definition of `map`:

    def map[B, That](f : (A) => B)(implicit bf : CanBuildFrom[Repr, B, That]) : That 

Note that it has two parameters. The first is your function and the second is
an implicit. If you do not provide that implicit, Scala will choose the most
_specific_ one available. 

### About breakOut

So, what's the purpose of `breakOut`? Consider the example given at the
beginning , You take a list of strings, transform each string into a tuple
`(Int, String)`, and then produce a `Map` out of it. The most obvious way to do
that would produce an intermediary `List[(Int, String)]` collection, and then
convert it.

Given that `map` uses a `Builder` to produce the resulting collection, wouldn't
it be possible to skip the intermediary `List` and collect the results directly
into a `Map`? Evidently, yes, it is. To do so, however, we need to pass a
proper `CanBuildFrom` to `map`, and that is exactly what `breakOut` does.

Let's look, then, at the definition of `breakOut`:

    def breakOut[From, T, To](implicit b : CanBuildFrom[Nothing, T, To]) =
      new CanBuildFrom[From, T, To] {
        def apply(from: From) = b.apply() ; def apply() = b.apply()
      }

Note that `breakOut` is parameterized, and that it returns an instance of
`CanBuildFrom`. As it happens, the types `From`, `T` and `To` have already been
inferred, because we know that `map` is expecting `CanBuildFrom[List[String],
(Int, String), Map[Int, String]]`. Therefore:

    From = List[String]
    T = (Int, String)
    To = Map[Int, String]

To conclude let's examine the implicit received by `breakOut` itself. It is of
type `CanBuildFrom[Nothing,T,To]`. We already know all these types, so we can
determine that we need an implicit of type
`CanBuildFrom[Nothing,(Int,String),Map[Int,String]]`. But is there such a
definition?

Let's look at `CanBuildFrom`'s definition:

    trait CanBuildFrom[-From, -Elem, +To] 
    extends AnyRef

So `CanBuildFrom` is contra-variant on its first type parameter. Because
`Nothing` is a bottom class (ie, it is a subclass of everything), that means
*any* class can be used in place of `Nothing`.

Since such a builder exists, Scala can use it to produce the desired output.

### About Builders

A lot of methods from Scala's collections library consists of taking the
original collection, processing it somehow (in the case of `map`, transforming
each element), and storing the results in a new collection.

To maximize code reuse, this storing of results is done through a _builder_
(`scala.collection.mutable.Builder`), which basically supports two operations:
appending elements, and returning the resulting collection. The type of this
resulting collection will depend on the type of the builder. Thus, a `List`
builder will return a `List`, a `Map` builder will return a `Map`, and so on.
The implementation of the `map` method need not concern itself with the type of
the result: the builder takes care of it.

On the other hand, that means that `map` needs to receive this builder somehow.
The problem faced when designing Scala 2.8 Collections was how to choose the
best builder possible. For example, if I were to write `Map('a' ->
1).map(_.swap)`, I'd like to get a `Map(1 -> 'a')` back. On the other hand, a
`Map('a' -> 1).map(_._1)` can't return a `Map` (it returns an `Iterable`).

The magic of producing the best possible `Builder` from the known types of the
expression is performed through this `CanBuildFrom` implicit.

### About CanBuildFrom

To better explain what's going on, I'll give an example where the collection
being mapped is a `Map` instead of a `List`. I'll go back to `List` later. For
now, consider these two expressions:

    Map(1 -> "one", 2 -> "two") map Function.tupled(_ -> _.length)
    Map(1 -> "one", 2 -> "two") map (_._2)

The first returns a `Map` and the second returns an `Iterable`. The magic of
returning a fitting collection is the work of `CanBuildFrom`. Let's consider
the definition of `map` again to understand it.

The method `map` is inherited from `TraversableLike`. It is parameterized on
`B` and `That`, and makes use of the type parameters `A` and `Repr`, which
parameterize the class. Let's see both definitions together:

The class `TraversableLike` is defined as:

    trait TraversableLike[+A, +Repr] 
    extends HasNewBuilder[A, Repr] with AnyRef

    def map[B, That](f : (A) => B)(implicit bf : CanBuildFrom[Repr, B, That]) : That 


To understand where `A` and `Repr` come from, let's consider the definition of
`Map` itself:

    trait Map[A, +B] 
    extends Iterable[(A, B)] with Map[A, B] with MapLike[A, B, Map[A, B]]

Because `TraversableLike` is inherited by all traits which extend `Map`, `A`
and `Repr` could be inherited from any of them. The last one gets the
preference, though. So, following the definition of the immutable `Map` and all
the traits that connect it to `TraversableLike`, we have:

    trait Map[A, +B] 
    extends Iterable[(A, B)] with Map[A, B] with MapLike[A, B, Map[A, B]]

    trait MapLike[A, +B, +This <: MapLike[A, B, This] with Map[A, B]] 
    extends MapLike[A, B, This]
    
    trait MapLike[A, +B, +This <: MapLike[A, B, This] with Map[A, B]] 
    extends PartialFunction[A, B] with IterableLike[(A, B), This] with Subtractable[A, This]
    
    trait IterableLike[+A, +Repr] 
    extends Equals with TraversableLike[A, Repr]

    trait TraversableLike[+A, +Repr] 
    extends HasNewBuilder[A, Repr] with AnyRef

If you pass the type parameters of `Map[Int, String]` all the way down the
chain, we find that the types passed to `TraversableLike`, and, thus, used by
`map`, are:

    A = (Int,String)
    Repr = Map[Int, String]

Going back to the example, the first map is receiving a function of type
`((Int, String)) => (Int, Int)` and the second map is receiving a function of
type `((Int, String)) => Int`. I use the double parenthesis to emphasize it is
a tuple being received, as that's the type of `A` as we saw.

With that information, let's consider the other types.

    map Function.tupled(_ -> _.length):
    B = (Int, Int)

    map (_._2):
    B = Int

We can see that the type returned by the first `map` is `Map[Int,Int]`, and the
second is `Iterable[String]`. Looking at `map`'s definition, it is easy to see
that these are the values of `That`. But where do they come from? 

If we look inside the companion objects of the classes involved, we see some
implicit declarations providing them. On object `Map`:

    implicit def  canBuildFrom [A, B] : CanBuildFrom[Map, (A, B), Map[A, B]]  

And on object `Iterable`, whose class is extended by `Map`:

    implicit def  canBuildFrom [A] : CanBuildFrom[Iterable, A, Iterable[A]]  

These definitions provide factories for parameterized `CanBuildFrom`.

Scala will choose the most specific implicit available. In the first case, it
was the first `CanBuildFrom`. In the second case, as the first did not match,
it chose the second `CanBuildFrom`.

### Back to the first example

Let's see the first example, `List`'s and `map`'s definition (again) to
see how the types are inferred:

    val map : Map[Int,String] = List("London", "Paris").map(x => (x.length, x))(breakOut)

    sealed abstract class List[+A] 
    extends LinearSeq[A] with Product with GenericTraversableTemplate[A, List] with LinearSeqLike[A, List[A]]

    trait LinearSeqLike[+A, +Repr <: LinearSeqLike[A, Repr]] 
    extends SeqLike[A, Repr]

    trait SeqLike[+A, +Repr] 
    extends IterableLike[A, Repr]
    
    trait IterableLike[+A, +Repr] 
    extends Equals with TraversableLike[A, Repr]
    
    trait TraversableLike[+A, +Repr] 
    extends HasNewBuilder[A, Repr] with AnyRef

    def map[B, That](f : (A) => B)(implicit bf : CanBuildFrom[Repr, B, That]) : That 

The type of `List("London", "Paris")` is `List[String]`, so the types `A` and
`Repr` defined on `TraversableLike` are:

    A = String
    Repr = List[String]

The type for `(x => (x.length, x))` is `(String) => (Int, String)`, so the type
of `B` is:

    B = (Int, String)

The last unknown type, `That` is the type of the result of `map`, and we
already have that as well:

    val map : Map[Int,String] =

So,

    That = Map[Int, String]

That means `breakOut` must, necessarily, return a type or subtype of
`CanBuildFrom[List[String], (Int, String), Map[Int, String]]`.

This answer was originally submitted in response to [this question on Stack Overflow][1].

  [1]: http://stackoverflow.com/q/1715681/53013

