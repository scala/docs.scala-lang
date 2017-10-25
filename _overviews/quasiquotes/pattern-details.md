---
layout: multipage-overview
title: Pattern details

discourse: true

partof: quasiquotes
overview-name: Quasiquotes

num: 10

permalink: /overviews/quasiquotes/:title.html
---
**Denys Shabalin** <span class="tag" style="float: right;">EXPERIMENTAL</span>

## Wildcard Pattern

The wildcard pattern (`pq"_"`) is the simplest pattern that matches any input.

## Literal Pattern

Literal patterns are equivalent to literal expressions on AST level:

    scala> val equivalent = pq"1" equalsStructure q"1"
    equivalent: Boolean = true

See the chapter on [literal expressions]({{ site.baseurl }}/overviews/quasiquotes/expression-details.html#literal) for details.

## Binding Pattern

A binding pattern is a way to name pattern or one of its parts to a local variable:

    scala> val bindtup = pq"foo @ (1, 2)"
    bindtup: universe.Bind = (foo @ scala.Tuple2(1, 2))

    scala> val pq"$name @ $pat" = bindtup
    name: universe.Name = foo
    pat: universe.Tree = scala.Tuple2(1, 2)

Binding without an explicit pattern is equivalent to one with the wildcard pattern:

    scala> val pq"$name @ $pat" = pq"foo"
    name: universe.Name = foo
    pat: universe.Tree = _

See [type pattern](#type-pattern) for an example of type variable binding.

## Extractor Pattern

Extractors are a neat way to delegate pattern matching to another object's unapply method:

    scala> val extractor = pq"Foo(1, 2, 3)"
    extractor: universe.Tree = Foo(1, 2, 3)

    scala> val pq"$id(..$pats)" = extractor
    id: universe.Tree = Foo
    pats: List[universe.Tree] = List(1, 2, 3)

## Type Pattern

Type patterns are a way to check the type of a scrutinee:

    scala> val isT = pq"_: T"
    isT: universe.Typed = (_: T)

    scala> val pq"_: $tpt" = isT
    tpt: universe.Tree = T

The combination of non-wildcard name and type pattern is represented as a bind over the wildcard type pattern:

    scala> val fooIsT = pq"foo: T"
    fooIsT: universe.Bind = (foo @ (_: T))

    scala> val pq"$name @ (_: $tpt)" = fooIsT
    name: universe.Name = foo
    tpt: universe.Tree = T

Another important thing to mention is a type variable pattern:

    scala> val typevar = pq"_: F[t]"
    typevar: universe.Typed = (_: F[(t @ <empty>)])

One can construct (and similarly deconstruct) such patterns with the following steps:

    scala> val name = TypeName("t")
    scala> val empty = q""
    scala> val t = pq"$name @ $empty"
    scala> val tpt = tq"F[$t]"
    scala> val typevar = pq"_: $tpt"
    typevar: universe.Typed = (_: F[(t @ _)])

## Alternative Pattern

Pattern alternatives represent a pattern that matches whenever, at least, one of the branches matches:

    scala> val alt = pq"Foo() | Bar() | Baz()"
    alt: universe.Alternative = (Foo()| Bar()| Baz())

    scala> val pq"$first | ..$rest" = alt
    head: universe.Tree = Foo()
    tail: List[universe.Tree] = List(Bar(), Baz())

    scala> val pq"..$init | $last" = alt
    init: List[universe.Tree] = List(Foo(), Bar())
    last: universe.Tree = Baz()

## Tuple Pattern

Similar to [tuple expressions]({{ site.baseurl }}/overviews/quasiquotes/expression-details.html#tuple) and [tuple types]({{ site.baseurl }}/overviews/quasiquotes/type-details.html#tuple-type), tuple patterns are just syntactic sugar that expands as a `TupleN` extractor:

    scala> val tup2pat = pq"(a, b)"
    tup2pat: universe.Tree = scala.Tuple2((a @ _), (b @ _))

    scala> val pq"(..$pats)" = tup2pat
    pats: List[universe.Tree] = List((a @ _), (b @ _))
