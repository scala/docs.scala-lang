---
layout: overview-large
title: Introduction

disqus: true

partof: quasiquotes
num: 1
outof: 12
---
**Denys Shabalin** <span class="label warning" style="float: right;">EXPERIMENTAL</span>

## Before you start {:#before-you-start}

Before you start reading this guide it's recommended to start a Scala REPL with one extra line:

    scala> val universe = reflect.runtime.universe; import universe._

REPL is the best place to explore quasiquotes and this guide will use it extensively to demonstrate handling of trees. All of the examples will assume that import.

Additionally some examples that use `ToolBox` API might need a few more lines to get things rolling:

    scala> import reflect.runtime.currentMirror
    scala> import tools.reflect.ToolBox
    scala> val toolbox = currentMirror.mkToolBox()

Another tool you might want to be aware of is new and shiny `showCode` pretty printer (contributed by [@VladimirNik](https://github.com/VladimirNik)):

    scala> val C = q"class C"
    C: universe.ClassDef =
    class C extends scala.AnyRef {
      def <init>() = {
        super.<init>();
        ()
      }
    }

    scala> println(showCode(C))
    class C

Default pretty printer shows you contents of the tree in imaginary low-level Scala-like notation. `showCode` on the other hand will do its best to reconstruct actual source code equivalent to the given tree in proper Scala syntax.

On the other side of spectrum there is also a `showRaw` pretty printer that shows direct internal organization of the tree:

    scala> println(showRaw(q"class C"))
    ClassDef(Modifiers(), TypeName("C"), List(), Template(List(Select(Ident(scala), TypeName("AnyRef"))), noSelfType, List(DefDef(Modifiers(), termNames.CONSTRUCTOR, List(), List(List()), TypeTree(), Block(List(pendingSuperCall), Literal(Constant(())))))))

## Basics {:#basics}

Quasiquotes are a neat notation that lets you manipulate Scala syntax trees with ease:

    scala> val tree = q"i am { a quasiquote }"
    tree: universe.Tree = i.am(a.quasiquote)

Every time you wrap a snippet of code into `q"..."` quotation it would become a tree that represents given snippet. As you might have already noticed quotation syntax is in just another usage of extensible string interpolation introduced in 2.10. Although they look like strings they operate on syntactic trees under the hood.

The same syntax can be used to match trees as patterns:

    scala> println(tree match { case q"i am { a quasiquote }" => "it worked!" })
    it worked!

Whenever you match a tree with a quasiquote it would match whenever a *structure* of given tree is equivalent to the one you\'ve provided as a pattern. You can check for structural equality manually with the help of `equalsStructure` method:

    scala> println(q"foo + bar" equalsStructure q"foo.+(bar)")
    true

You can also put things into quasiquotation with the help of `$`:

    scala> val aquasiquote = q"a quasiquote"
    aquasiquote: universe.Select = a.quasiquote

    scala> val tree = q"i am { $aquasiquote }"
    tree: universe.Tree = i.am(a.quasiquote)

This operation is also known as unquoting. Whenever you unquote an expression of `Tree` type in a quasiquote it will *structurally substitute* that tree into that location. Most of the time such substitution between quotes is equivalent to textual substitution of the source code.

Similarly one can structurally deconstruct a tree using unquoting in pattern matching:

    scala> val q"i am $what" = q"i am { a quasiquote }"
    what: universe.Tree = a.quasiquote

## Interpolators {:#interpolators}

Scala is the language with rich syntax that differs greatly depending on the syntactical context:

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

Each of this contexts is covered by separate interpolator:

    | Used for
----|----------------
 q  | [expressions](/overviews/quasiquotes/syntax-summary.html#exprs), [definitions](/overviews/quasiquotes/syntax-summary.html#defns) and [imports](http://localhost:4000/overviews/quasiquotes/expression-details.html#import)
 tq | [types](/overviews/quasiquotes/syntax-summary.html#types)
 pq | [patterns](/overviews/quasiquotes/syntax-summary.html#pats)

Syntactical similiarity between different contexts doesn\'t imply similarity between underlying trees:

    scala> println(q"List[Int]" equalsStructure tq"List[Int]")
    false

If we peek under the hood we'll see that trees are indeed different:

    scala> println(showRaw(q"List[Int]"))
    TypeApply(Ident(TermName("List")), List(Ident(TypeName("Int"))))

    scala> println(showRaw(tq"List[Int]"))
    AppliedTypeTree(Ident(TypeName("List")), List(Ident(TypeName("Int"))))

Similarly patterns and expressions are not equivalent either:

    scala> println(pq"List(a, b)" equalsStructure q"List(a, b)")
    false

So it's extremely important to use the right interpotor for the job to construct a valid syntax tree.

Additionally there are two auxilary interpolators that let you work with minor areas of scala syntax:

    | Used for
----|-------------------------------------
 cq | [case clause](/overviews/quasiquotes/syntax-summary.html#aux)
 fq | [for loop enumerator](/overviews/quasiquotes/syntax-summary.html#aux)

See [syntax summary](/overviews/quasiquotes/syntax-summary.html) section for details.

## Splicing {:#splicing}

Unquote splicing is a way to unquote a variable number of elements:

    scala> val ab = List(q"a", q"b")
    scala> val fab = q"f(..$ab)"
    fab: universe.Tree = f(a, b)

Dots near unquotee annotate degree of flattenning and are also called splicing rank. `..$` expects argument to be an `Iterable[Tree]` and `...$` expects `Iterable[Iterable[Tree]]`.

Splicing can be easily combined with regular unquotation:

    scala> val c = q"c"
    scala> val fabc = q"f(..$ab, $c)"
    fabc: universe.Tree = f(a, b, c)

    scala> val fcab = q"f($c, ..$ab)"
    fcab: universe.Tree = f(c, a, b)

    scala> val fabcab = q"f(..$ab, $c, ..$ab)"
    fabcab: universe.Tree = f(a, b, c, a, b)

If you want to abstract over applications even further you can use `...$`:

    scala> val argss = List(ab, List(c))
    arglists: List[List[universe.Ident]] = List(List(a, b), List(c))

    scala> val fargss = q"f(...$argss)"
    fargss: universe.Tree = f(a, b)(c)

At the moment `...$` splicing is only supported for function applications and parameter lists in def and class definitions.

Similarly to construction one can also use `..$` and `...$` to tear trees apart:

    scala> val q"f(..$args)" = q"f(a, b)"
    args: List[universe.Tree] = List(a, b)

    scala> val q"f(...$argss)" = q"f(a, b)(c)"
    argss: List[List[universe.Tree]] = List(List(a, b), List(c))

Although there are some limitations to the way to you can combine it with regular `$` variable extraction:

    case q"f($first, ..$rest)" => // ok
    case q"f(..$init, $last)"  => // ok
    case q"f(..$a, ..$b)"      => // not allowed

So in general only one `..$` is allowed per given list. Similar restrictions also apply to `...$`:

    case q"f(..$first)(...$rest)" => // ok
    case q"f(...$init)(..$first)" => // ok
    case q"f(...$a)(...$b)"       => // not allowed

In this section we only worked with function arguments but the same splicing rules are true for all syntax forms with variable amount of elements. [Syntax summary](/overviews/quasiquotes/syntax-summary.html) and corresponding details sections demonstrate how you can splice into other syntactic forms.

