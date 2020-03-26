---
layout: multipage-overview
title: Introduction
partof: quasiquotes
overview-name: Quasiquotes

num: 2

permalink: /overviews/quasiquotes/:title.html
---
**Denys Shabalin** <span class="tag" style="float: right;">EXPERIMENTAL</span>

Quasiquotes are a neat notation that lets you manipulate Scala syntax trees with ease:

    scala> val tree = q"i am { a quasiquote }"
    tree: universe.Tree = i.am(a.quasiquote)

Every time you wrap a snippet of code in `q"..."` it will become a tree that represents a given snippet. As you might have already noticed, quotation syntax is just another usage of extensible string interpolation, introduced in 2.10. Although they look like strings they operate on syntactic trees under the hood.

The same syntax can be used to match trees as patterns:

    scala> println(tree match { case q"i am { a quasiquote }" => "it worked!" })
    it worked!

Whenever you match a tree with a quasiquote it will match whenever the *structure* of a given tree is equivalent to the one you\'ve provided as a pattern. You can check for structural equality manually with the help of `equalsStructure` method:

    scala> println(q"foo + bar" equalsStructure q"foo.+(bar)")
    true

You can also put things into quasiquotation with the help of `$`:

    scala> val aquasiquote = q"a quasiquote"
    aquasiquote: universe.Select = a.quasiquote

    scala> val tree = q"i am { $aquasiquote }"
    tree: universe.Tree = i.am(a.quasiquote)

This operation is also known as *unquoting*. Whenever you unquote an expression of type `Tree` in a quasiquote it will *structurally substitute* that tree into that location. Most of the time such substitutions between quotes is equivalent to a textual substitution of the source code.

Similarly, one can structurally deconstruct a tree using unquoting in pattern matching:

    scala> val q"i am $what" = q"i am { a quasiquote }"
    what: universe.Tree = a.quasiquote

## Interpolators

Scala is a language with rich syntax that differs greatly depending on the syntactical context:

    scala> val x = q"""
             val x: List[Int] = List(1, 2) match {
               case List(a, b) => List(a + b)
             }
           """
    x: universe.ValDef =
    val x: List[Int] = List(1, 2) match {
      case List((a @ _), (b @ _)) => List(a.$plus(b))
    }

In this example we see three primary contexts being used:

1. `List(1, 2)` and `List(a + b)` are expressions
2. `List[Int]` is a type
3. `List(a, b)` is a pattern

Each of these contexts is covered by a separate interpolator:

    | Used for
----|----------------
 q  | [expressions]({{ site.baseurl }}/overviews/quasiquotes/syntax-summary.html#expressions), [definitions]({{ site.baseurl }}/overviews/quasiquotes/syntax-summary.html#definitions) and [imports]({{ site.baseurl }}/overviews/quasiquotes/expression-details.html#import)
 tq | [types]({{ site.baseurl }}/overviews/quasiquotes/syntax-summary.html#types)
 pq | [patterns]({{ site.baseurl }}/overviews/quasiquotes/syntax-summary.html#patterns)

Syntactical similarity between different contexts doesn't imply similarity between underlying trees:

    scala> println(q"List[Int]" equalsStructure tq"List[Int]")
    false

If we peek under the hood we'll see that trees are, indeed different:

    scala> println(showRaw(q"List[Int]"))
    TypeApply(Ident(TermName("List")), List(Ident(TypeName("Int"))))

    scala> println(showRaw(tq"List[Int]"))
    AppliedTypeTree(Ident(TypeName("List")), List(Ident(TypeName("Int"))))

Similarly, patterns and expressions are also not equivalent:

    scala> println(pq"List(a, b)" equalsStructure q"List(a, b)")
    false

It's extremely important to use the right interpolator for the job in order to construct a valid syntax tree.

Additionally there are two auxiliary interpolators that let you work with minor areas of scala syntax:

    | Used for
----|-------------------------------------
 cq | [case clause]({{ site.baseurl }}/overviews/quasiquotes/syntax-summary.html#auxiliary)
 fq | [for loop enumerator]({{ site.baseurl }}/overviews/quasiquotes/syntax-summary.html#auxiliary)

See the section [syntax summary]({{ site.baseurl }}/overviews/quasiquotes/syntax-summary.html) for details.

## Splicing

Unquote splicing is a way to unquote a variable number of elements:

    scala> val ab = List(q"a", q"b")
    scala> val fab = q"f(..$ab)"
    fab: universe.Tree = f(a, b)

Dots before the unquotee annotate indicate a degree of flattening and are called a *splicing rank*. `..$` expects the argument to be an `Iterable[Tree]` and `...$` expects an `Iterable[Iterable[Tree]]`.

Splicing can easily be combined with regular unquotation:

    scala> val c = q"c"
    scala> val fabc = q"f(..$ab, $c)"
    fabc: universe.Tree = f(a, b, c)

    scala> val fcab = q"f($c, ..$ab)"
    fcab: universe.Tree = f(c, a, b)

    scala> val fabcab = q"f(..$ab, $c, ..$ab)"
    fabcab: universe.Tree = f(a, b, c, a, b)

If you want to abstract over applications even further, you can use `...$`:

    scala> val argss = List(ab, List(c))
    arglists: List[List[universe.Ident]] = List(List(a, b), List(c))

    scala> val fargss = q"f(...$argss)"
    fargss: universe.Tree = f(a, b)(c)

At the moment `...$` splicing is only supported for function applications and parameter lists in `def` and `class` definitions.

Similarly to construction one can also use `..$` and `...$` to tear trees apart:

    scala> val q"f(..$args)" = q"f(a, b)"
    args: List[universe.Tree] = List(a, b)

    scala> val q"f(...$argss)" = q"f(a, b)(c)"
    argss: List[List[universe.Tree]] = List(List(a, b), List(c))

There are some limitations in the way you can combine splicing with regular `$` variable extraction:

    case q"f($first, ..$rest)" => // ok
    case q"f(..$init, $last)"  => // ok
    case q"f(..$a, ..$b)"      => // not allowed

So, in general, only one `..$` is allowed per given list. Similar restrictions also apply to `...$`:

    case q"f(..$first)(...$rest)" => // ok
    case q"f(...$init)(..$first)" => // ok
    case q"f(...$a)(...$b)"       => // not allowed

In this section we only worked with function arguments but the same splicing rules are true for all syntax forms with a variable number of elements. [Syntax summary]({{ site.baseurl }}/overviews/quasiquotes/syntax-summary.html) and the corresponding details sections demonstrate how you can use splicing with other syntactic forms.
