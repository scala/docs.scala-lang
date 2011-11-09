---
layout: overview-large
title: How does yield work?

disqus: true

partof: FAQ
num: 2
---
Though there's a `yield` in other languages such as Python and Ruby, Scala's
`yield` does something very different from them. In Scala, `yield` is part
of for comprehensions -- a generalization of Ruby and Python's list-comprehensions.

Scala's "for comprehensions" are equivalent to Haskell's "do" notation, and it
is nothing more than a syntactic sugar for composition of multiple monadic
operations. As this statement will most likely not help anyone who needs help,
let's try again...

Translating for-comprehensions
------------------------------

Scala's "for comprehensions" are syntactic sugar for composition of multiple
operations with `foreach`, `map`, `flatMap`, `filter` or `withFilter`. 
Scala actually translates a for-expression into calls to those methods, 
so any class providing them, or a subset of them, can be used with for comprehensions.

First, let's talk about the translations. There are very simple rules:

#### Example 1

    for(x <- c1; y <- c2; z <-c3) {...}

is translated into

    c1.foreach(x => c2.foreach(y => c3.foreach(z => {...})))

#### Example 2

    for(x <- c1; y <- c2; z <- c3) yield {...}

is translated into

    c1.flatMap(x => c2.flatMap(y => c3.map(z => {...})))

#### Example 3

    for(x <- c; if cond) yield {...}

is translated into

    c.withFilter(x => cond).map(x => {...})

with a fallback into

    c.filter(x => cond).map(x => {...})

if method `withFilter` is not available but `filter` is. 
The next chapter has more information on this.

#### Example 4

    for(x <- c; y = ...) yield {...}

is translated into

    c.map(x => (x, ...)).map((x,y) => {...})


When you look at very simple for comprehensions, the map/foreach alternatives
look, indeed, better. Once you start composing them, though, you can easily get
lost in parenthesis and nesting levels. When that happens, for comprehensions
are usually much clearer.

I'll show one simple example, and intentionally omit any explanation. You can
decide which syntax is easier to understand.

    l.flatMap(sl => sl.filter(el => el > 0).map(el => el.toString.length))

or

    for{
      sl <- l
      el <- sl
      if el > 0
    } yield el.toString.length


About withFilter, and strictness
----------------------------------

Scala 2.8 introduced a method called `withFilter`, whose main difference is
that, instead of returning a new, filtered, collection, it filters on-demand.
The `filter` method has its behavior defined based on the strictness of the
collection. To understand this better, let's take a look at some Scala 2.7 with
`List` (strict) and `Stream` (non-strict):

    scala> var found = false
    found: Boolean = false
    
    scala> List.range(1,10).filter(_ % 2 == 1 && !found).foreach(x => if (x == 5) found = true else println(x))
    1
    3
    7
    9
    
    scala> found = false
    found: Boolean = false
    
    scala> Stream.range(1,10).filter(_ % 2 == 1 && !found).foreach(x => if (x == 5) found = true else println(x))
    1
    3

The difference happens because filter is immediately applied with `List`,
returning a list of odds -- since `found` is `false`. Only then `foreach` is
executed, but, by this time, changing `found` is meaningless, as `filter` has
already executed.

In the case of `Stream`, the condition is not immediatelly applied. Instead, as
each element is requested by `foreach`, `filter` tests the condition, which
enables `foreach` to influence it through `found`. Just to make it clear, here
is the equivalent for-comprehension code:

    for (x <- List.range(1, 10); if x % 2 == 1 && !found) 
      if (x == 5) found = true else println(x)

    for (x <- Stream.range(1, 10); if x % 2 == 1 && !found) 
      if (x == 5) found = true else println(x)

This caused many problems, because people expected the `if` to be considered
on-demand, instead of being applied to the whole collection beforehand.

Scala 2.8 introduced `withFilter`, which is _always_ non-strict, no matter the
strictness of the collection. The following example shows `List` with both
methods on Scala 2.8:

    scala> var found = false
    found: Boolean = false
    
    scala> List.range(1,10).filter(_ % 2 == 1 && !found).foreach(x => if (x == 5) found = true else println(x))
    1
    3
    7
    9
    
    scala> found = false
    found: Boolean = false
    
    scala> List.range(1,10).withFilter(_ % 2 == 1 && !found).foreach(x => if (x == 5) found = true else println(x))
    1
    3

This produces the result most people expect, without changing how `filter`
behaves. As a side note, `Range` was changed from non-strict to strict between
Scala 2.7 and Scala 2.8.

This answer was originally submitted in response to [this question on Stack Overflow][1].

  [1]: http://stackoverflow.com/questions/1052476/can-someone-explain-scalas-yield/1052510#1052510
