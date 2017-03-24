---
layout: overview-large
title: Type details

disqus: true

partof: quasiquotes
num: 9
outof: 13
languages: [ko]
---
**Denys Shabalin** <span class="label warning" style="float: right;">EXPERIMENTAL</span>

## Empty Type

Empty type (`tq""`) is a canonical way to say that type at given location isn't given by the user and should be inferred by the compiler:

1. [Method](/overviews/quasiquotes/definition-details.html#method-definition) with unknown return type
2. [Val or Var](/overviews/quasiquotes/definition-details.html#val-and-var-definitions) with unknown type
3. [Anonymous function](/overviews/quasiquotes/expression-details.html#function) with unknown argument type

## Type Identifier

Similarly to [term identifiers](/overviews/quasiquotes/expression-details.html#identifier-and-selection) one can construct a type identifier based on a name:

    scala> val name = TypeName("Foo")
    name: universe.TypeName = Foo

    scala> val foo = tq"$name"
    foo: universe.Ident = Foo

And deconstruct it back through [unlifting](/overviews/quasiquotes/unlifting.html):

    scala> val tq"${name: TypeName}" = tq"Foo"
    name: universe.TypeName = Foo

It's recommended to always ascribe name as `TypeName` when you work with type identifiers. Non-ascribed pattern is equivalent to just a pattern variable binding.

## Singleton Type

A singleton type is a way to express a type of a term definition that is being referenced:

    scala> val singleton = tq"foo.bar.type".sr
    singleton: String = SingletonTypeTree(Select(Ident(TermName("foo")), TermName("bar")))

    scala> val tq"$ref.type" = tq"foo.bar.type"
    ref: universe.Tree = foo.bar

## Type Projection

Type projection is a fundamental way to select types as members of other types:

    scala> val proj = tq"Foo#Bar"
    proj: universe.SelectFromTypeTree = Foo#Bar

    scala> val tq"$foo#$bar" = proj
    foo: universe.Tree = Foo
    bar: universe.TypeName = Bar

Similarly to identifiers it\'s recommended to always ascribe name as `TypeName`. Non-ascribed matching behaviour might change in the future.

As a convenience one can also select type members of terms:

    scala> val int = tq"scala.Int"
    int: universe.Select = scala.Int

    scala> val tq"scala.$name" = int
    name: universe.TypeName = Int

But semantically such selections are just a shortcut for a combination of singleton types and type projections:

    scala> val projected = tq"scala.type#Int"
    projected: universe.SelectFromTypeTree = scala.type#Int

Lastly [similarly to expressions](/overviews/quasiquotes/expression-details.html#super-and-this) one can select members through super and this:

    scala> val superbar = tq"super.Bar"
    superbar: universe.Select = super.Bar

    scala> val tq"$pre.super[$parent].$field" = superbar
    pre: universe.TypeName =
    parent: universe.TypeName =
    field: universe.Name = Bar

    scala> val thisfoo = tq"this.Foo"
    thisfoo: universe.Select = this.Foo

    scala> val tq"this.${tpname: TypeName}" = thisfoo
    tpname: universe.TypeName = Foo

## Applied Type

Instantiations of parametized types can be expressed with the help of applied types (type-level equivalent of type application):

    scala> val applied = tq"Foo[A, B]"
    applied: universe.Tree = Foo[A, B]

    scala> val tq"Foo[..$targs]" = applied
    targs: List[universe.Tree] = List(A, B)

Deconstruction of non-applied types will cause `targs` begin extracted as empty list:

    scala> val tq"Foo[..$targs]" = tq"Foo"
    targs: List[universe.Tree] = List()

## Annotated Type

Similarly to expressions types can be annotated:

    scala> val annotated = tq"T @Fooable"
    annotated: universe.Annotated = T @Fooable

    scala> val tq"$tpt @$annot" = annotated
    tpt: universe.Tree = T
    annot: universe.Tree = Fooable

## Compound Type

Compound type lets users to express a combination of a number of types with optional refined member list:

    scala> val compound = tq"A with B with C"
    compound: universe.CompoundTypeTree = A with B with C

    scala> val tq"..$parents { }" = compound
    parents: List[universe.Tree] = List(A, B, C)
    defns: List[universe.Tree] = List()

Braces after parents are required to signal that this type is a compound type even if there are no refinements and we just want to extract a sequence of types combined with `with` keyword.

On the other side of the spectrum are pure refinements without explicit parents (a.k.a. structural types):

    scala> val structural = tq"{ val x: Int; val y: Int }"
    structural: universe.CompoundTypeTree =
    scala.AnyRef {
      val x: Int;
      val y: Int
    }

    scala> val tq"{ ..$defns }" = structural
    defns: List[universe.Tree] = List(val x: Int, val y: Int)

Here we can see that AnyRef is a parent that is inserted implicitly if we don't provide any.

## Existential Type

Existential types consist of a type tree and a list of definitions:

    scala> val tq"$tpt forSome { ..$defns }" = tq"List[T] forSome { type T }"
    tpt: universe.Tree = List[T]
    defns: List[universe.MemberDef] = List(type T)

Alternatively there is also an underscrore notation:

    scala> val tq"$tpt forSome { ..$defns }" = tq"List[_]"
    tpt: universe.Tree = List[_$1]
    defns: List[universe.MemberDef] = List(<synthetic> type _$1)

## Tuple Type

[Similarly to expressions](/overviews/quasiquotes/expression-details.html#tuple), tuple types are just a syntactic sugar over `TupleN` classes:

    scala> val tup2 = tq"(A, B)"
    tup2: universe.Tree = scala.Tuple2[A, B]

    scala> val tq"(..$tpts)" = tup2
    tpts: List[universe.Tree] = List(A, B)

Analogously `Unit` type is considered to be nullary tuple:

    scala> val tq"(..$tpts)" = tq"_root_.scala.Unit"
    tpts: List[universe.Tree] = List()

It's important to mention that pattern matching of reference to `Unit` is limited to either fully qualified path or a reference that contains symbols. (see [hygiene](/overviews/quasiquotes/hygiene.html))

## Function Type

Similarly to tuples, function types are a syntactic sugar over `FunctionN` classes:

    scala> val funtype = tq"(A, B) => C"
    funtype: universe.Tree = _root_.scala.Function2[A, B, C]

    scala> val tq"..$foo => $bar" = funtype
    foo: List[universe.Tree] = List(A, B)
    bar: universe.Tree = C


