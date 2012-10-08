---
layout: overview-large
title: Symbols, Trees, and Types

partof: reflection
num: 3
---
=== Symbols ===

=== Trees ===
Trees can be easily traversed with e.g. `foreach` on the root node;
for a more nuanced traversal, subclass `Traverser`. Transformations
are done by subclassing `Transformer`.

Copying Trees should be done with care depending on whether
it needs be done lazily or strictly (see [[scala.reflect.api.Trees#newLazyTreeCopier]] and
[[scala.reflect.api.Trees#newStrictTreeCopier]]) and on whether the contents of the mutable
fields should be copied. The tree copiers will copy the mutable
attributes to the new tree. A shortcut way of copying trees is [[scala.reflect.api.Trees#Tree#duplicate]]
which uses a strict copier.

Trees can be coarsely divided into four mutually exclusive categories:

- Subclasses of `TermTree`, representing terms
- Subclasses of `TypTree`, representing types.  Note that is `TypTree`, not `TypeTree`.
- Subclasses of `SymTree`, which either define or reference symbols.
- Other trees, which have none of those as superclasses.

`SymTrees` include important nodes `Ident` (which represent references to identifiers)
and `Select` (which represent member selection). These nodes can be used as both terms and types;
they are distinguishable based on whether their underlying [[scala.reflect.api.Names#Name]]
is a `TermName` or `TypeName`.  The correct way to test any Tree for a type or a term are the `isTerm`/`isType`
methods on Tree.

"Others" are mostly syntactic or short-lived constructs. Take, for example,
`CaseDef`, which wraps individual match cases: such nodes are neither terms nor types,
nor do they carry a symbol.

=== How to get a tree that corresponds to a snippet of Scala code? ===

With the introduction of compile-time metaprogramming and runtime compilation in Scala 2.10.0,
quite often it becomes necessary to convert Scala code into corresponding trees.

The simplest was to do that is to use [[scala.reflect.api.Universe#reify]].
The `reify` method takes an valid Scala expression (i.e. it has to be well-formed
with respect to syntax and has to typecheck, which means no unresolved free variables).
and produces a tree that represents the input.

{{{
scala> import scala.reflect.runtime.universe._
import scala.reflect.runtime.universe._

// trying to reify a snippet that doesn't typecheck
// leads to a compilation error
scala> reify(x + 2)
<console>:31: error: not found: value x
              reify(x + 2)
                    ^

scala> val x = 2
x: Int = 2

// now when the variable x is in the scope
// we can successfully reify the expression `x + 2`
scala> val expr = reify(x + 2)
expr: reflect.runtime.universe.Expr[Int] = Expr[Int](x.$plus(2))

// the result of reification is of type Expr
// exprs are thin wrappers over trees
scala> expr.tree
res2: reflect.runtime.universe.Tree = x.$plus(2)

// we can see that the expression `x + 2`
// is internally represented as an instance of the `Apply` case class
scala> res2.getClass.toString
res3: String = class scala.reflect.internal.Trees$Apply

// when it comes to inspecting the structure of the trees,
// the default implementation of `toString` doesn't help much
// the solution is discussed in one of the next sections
}}}

The alternative way of getting an AST of a snippet of Scala code
is having it parsed by a toolbox (see [[scala.reflect.api.package the overview page]]
for more information about toolboxes):
{{{
scala> import scala.reflect.runtime.universe._
import scala.reflect.runtime.universe._

scala> import scala.reflect.runtime.{currentMirror => cm}
import scala.reflect.runtime.{currentMirror=>cm}

scala> import scala.tools.reflect.ToolBox // requires scala-compiler.jar
import scala.tools.reflect.ToolBox

scala> val tb = cm.mkToolBox()
tb: scala.tools.reflect.ToolBox[reflect.runtime.universe.type] = ...

scala> tb.parse("x + 2")
res0: tb.u.Tree = x.$plus(2)
}}}

=== How to evaluate a tree? ===

Once there's a way to get a tree that represents Scala code, the next question
is how to evaluate it. The answer to this question depends on what flavor of reflection is used:
runtime reflection or compile-time reflection (macros).

Within runtime reflection, evaluation can be carried out using toolboxes.
To create a toolbox one wraps a classloader in a mirror and then uses the mirror
to instantiate a toolbox. Later on the underlying classloader will be used to map
symbolic names (such as `List`) to underlying classes of the platform
(see [[scala.reflect.api.package the overview page]] for more information about universes,
mirrors and toolboxes):

{{{
scala> import scala.reflect.runtime.universe._
import scala.reflect.runtime.universe._

scala> import scala.tools.reflect.ToolBox // requires scala-compiler.jar
import scala.tools.reflect.ToolBox

scala> val mirror = runtimeMirror(getClass.getClassLoader)
mirror: reflect.runtime.universe.Mirror = JavaMirror with ...

scala> val tb = mirror.mkToolBox()
tb: scala.tools.reflect.ToolBox[reflect.runtime.universe.type] = ...

scala> tb.eval(tb.parse("2 + 2"))
res0: Int = 4
}}}

At compile-time, [[scala.reflect.macros.Context]] provides the [[scala.reflect.macros.Evals#eval]] method,
which doesn't require manual instantiation of mirrors and toolboxes and potentially will have better performance
(at the moment it still creates toolboxes under the cover, but in later releases it might be optimized
to reuse the infrastructure of already running compiler).

Behind the scenes tree evaluation launches the entire compilation pipeline and creates an in-memory virtual directory
that holds the resulting class files (that's why it requires scala-compiler.jar when used with runtime reflection).
This means that the tree being evaluated should be valid Scala code (e.g. it shouldn't contain type errors).

Quite often though there is a need to evaluate code in some predefined context. For example, one might want to use a dictionary
that maps names to values as an environment for the code being evaluated. This isn't supported out of the box,
but nevertheless this scenario is possible to implement. See a [[http://stackoverflow.com/questions/12122939 Stack Overflow topic]]
for more details.

=== How to get an internal representation of a tree? ===

The `toString` method on trees is designed to print a close-to-Scala representation
of the code that a given tree represents. This is usually convenient, but sometimes
one would like to look under the covers and see what exactly are the AST nodes that
constitute a certain tree.

Scala reflection provides a way to dig deeper through [[scala.reflect.api.Printers]]
and their `showRaw` method. Refer to the page linked above for a series of detailed
examples.

{{{
scala> import scala.reflect.runtime.universe._
import scala.reflect.runtime.universe._

scala> def tree = reify{ final class C { def x = 2 } }.tree
tree: reflect.runtime.universe.Tree

// show displays prettified representation of reflection artifacts
// which is typically close to Scala code, but sometimes not quite
// (e.g. here the constructor is shown in a desugared way)
scala> show(tree)
res0: String =
{
  final class C extends AnyRef {
    def <init>() = {
      super.<init>();
      ()
    };
    def x = 2
  };
  ()
}

// showRaw displays internal structure of a given reflection object
// trees and types (type examples are shown below) are case classes
// so they are shown in a form that's almost copy/pasteable
//
// almost copy/pasteable, but not completely - that's because of symbols
// there's no good way to get a roundtrip-surviving representation of symbols
// in general case, therefore only symbol names are shown (e.g. take a look at AnyRef)
//
// in such a representation, it's impossible to distinguish Idents/Selects
// that have underlying symbols vs ones that don't have symbols, because in both cases
// only names will be printed
//
// to overcome this limitation, use `printIds` and `printKinds` - optional parameters
// of the `showRaw` method (example is shown on the scala.reflect.api.Printers doc page)
scala> showRaw(tree)
res1: String = Block(List(
  ClassDef(Modifiers(FINAL), newTypeName("C"), List(), Template(
    List(Ident(newTypeName("AnyRef"))),
    emptyValDef,
    List(
      DefDef(Modifiers(), nme.CONSTRUCTOR, List(), List(List()), TypeTree(),
        Block(List(
          Apply(Select(Super(This(tpnme.EMPTY), tpnme.EMPTY), nme.CONSTRUCTOR), List())),
          Literal(Constant(())))),
      DefDef(Modifiers(), newTermName("x"), List(), List(), TypeTree(),
        Literal(Constant(2))))))),
  Literal(Constant(())))
}}}

=== Types ===

### How to get an internal representation of a type?

The `toString` method on types is designed to print a close-to-Scala representation
of the code that a given type represents. This is usually convenient, but sometimes
one would like to look under the covers and see what exactly are the elements that
constitute a certain type.

Scala reflection provides a way to dig deeper through [[scala.reflect.api.Printers]]
and their `showRaw` method. Refer to the page linked above for a series of detailed
examples.

	scala> import scala.reflect.runtime.universe._
	import scala.reflect.runtime.universe._

	scala> def tpe = typeOf[{ def x: Int; val y: List[Int] }]
	tpe: reflect.runtime.universe.Type

	scala> show(tpe)
	res0: String = scala.AnyRef{def x: Int; val y: scala.List[Int]}

	scala> showRaw(tpe)
	res1: String = RefinedType(
	  List(TypeRef(ThisType(scala), newTypeName("AnyRef"), List())),
	  Scope(
	    newTermName("x"),
	    newTermName("y")))

