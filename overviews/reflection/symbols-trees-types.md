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

### Symbols

Symbols are at the heart of the reflection API. Along with [[Types.Type types]], which are the most important use of reflection, they provide comprehensive information about the underlying definitions.

Here's an example of how trees look after the `typer` phase of the Scala compiler (this phase performs the typechecking).

	>cat Test.scala
	def foo[T: TypeTag](x: Any) = x.asInstanceOf[T]

	>scalac -Xprint:typer -uniqid Test.scala
	[[syntax trees at end of typer]]// Scala source: Test.scala
	def foo#8339
	  [T#8340 >: Nothing#4658 <: Any#4657]
	  (x#9529: Any#4657)
	  (implicit evidence$1#9530: TypeTag#7861[T#8341])
	  : T#8340 =
	x#9529.asInstanceOf#6023[T#8341];


Shortly put, we write a small snippet and then compile it with scalac, asking the compiler to dump the trees
after the typer phase, printing unique ids of the symbols assigned to trees (if any).

The resulting printout shows that identifiers have been linked to corresponding definitions.
For example, on the one hand, the `ValDef("x", ...)`, which represents the parameter of the method `foo`,
defines a method symbol with `id=9529`. On the other hand, the `Ident("x")` in the body of the method
got its `symbol` field set to the same symbol, which establishes the binding.

In the light of this discussion, it might come as a surprise that the definition of the type parameter `T`
has a symbol with `id=8340`, whereas references to this type parameter all have a symbol with `id=8341`.
This is the only exception from the general principe outlined above. It happens because the Scala compiler
skolemizes type parameters (creates new symbols very similar to the original ones) before entering scopes
that define these parameters. This is an advanced feature of Scala, and the knowledge of it is needed only
when writing complex macros, but symbols in the macro universe [[scala.reflect.macros.Universe]] have the
`deskolemize` method, which goes back from skolems to the originating type parameters.

### Symbols from a runtime perspective

From the point of view of a runtime reflection framework, symbols are akin to `java.lang.reflect.Member` from Java
and `System.Reflection.MemberInfo` from .NET. But not only they represent members - they also represent
classes, objects and even packages.

Scala symbols have subclasses that describe particular flavors of definitions. [[scala.reflect.api.Symbols#TermSymbol]] models term definitions
(such as lazy and eager vals, vars and parameters of methods). Its subclasses are [[scala.reflect.api.Symbols#MethodSymbol]]
and [[scala.reflect.api.Symbols#ModuleSymbol]] (representing "modules", which in Scala compiler speak mean "objects").
[[scala.reflect.api.Symbols#TypeSymbol]] along with its subclass [[scala.reflect.api.Symbols#ClassSymbol]]
describes type definitions in Scala (type aliases, type members, type parameters, classes and traits).

Most methods in the reflection API that return symbols return non-specific [[scala.reflect.api.Symbols#Symbol]], because upon failure
they don't raise exceptions, but rather produce `NoSymbol`, a special singleton, which is a null object for symbols.
Therefore to use such APIs one has to first check whether a callee returned a valid symbol and, if yes, then perform
a cast using one of the `asTerm`, `asMethod`, `asModule`, `asType` or `asClass` methods. 

Unlike [[scala.reflect.api.Trees trees]] and [[scala.reflect.api.Types types]], symbols should not be created directly.
Instead, one should load the symbols from the global symbol table maintained by the compiler.
To get a symbol that corresponds to a top-level class or object, one can use the [[Mirror.staticClass]] and [[Mirror.staticModule]]
methods of [[scala.reflect.api.Mirror]]. To get a symbol that corresponds to a certain member, there are `members`
and `declarations` methods of [[scala.reflect.api.Types#Type]].

Each symbol has a type signature, which describes its type and is available via the [[Symbol.typeSignature]] method. 
Classes have signatures of type [[scala.reflect.api.Types#ClassInfoType]],
which knows the list of its members and declarations. Module symbols per  don't have interesting signatures. To access members
of modules, one first has to obtain a module class (using the `moduleClass` method) and then inspect its signature.
Members have type signatures of their own: method signatures feature information about parameters and result types,
type member signatures store upper and lower bounds and so on.

### Exploring symbols

In this example we'll try to get a hold on a symbol that represents the `map` method of `List`,
and then do something interesting with it.

First of all, to obtain a symbol, one needs to load its enclosing top-level class or module.
There are two ways of doing that. The first one is getting a symbol by its name using a mirror
(refer to [[scala.reflect.api.package the reflection overview]] for information about mirrors).
Another one is getting a type with [[scaa.reflect.api.Types#typeOf]] and using its `typeSymbol` method.
The second approach is preferable, because it's typesafe, but sometimes it's unavailable.

	scala> import scala.reflect.runtime.universe._
	import scala.reflect.runtime.universe._

	scala> val cm = runtimeMirror(getClass.getClassLoader)
	cm: reflect.runtime.universe.Mirror = JavaMirror with ...

	scala> val list = cm.staticClass("scala.List")
	list: reflect.runtime.universe.ClassSymbol = class List

	scala> val list = typeOf[List[_]].typeSymbol
	list: reflect.runtime.universe.Symbol = class List
	}}}

	Now when the enclosing class is obtained, there's a straight path to getting its member
	using `typeSignature` and `member` methods discussed above:

	{{{
	scala> val map = list.typeSignature.member("map": TermName).asMethod
	map: reflect.runtime.universe.MethodSymbol = method map

	scala> map.typeSignature
	res0: reflect.runtime.universe.Type = [B, That](f: A => B)(implicit bf:
	scala.collection.generic.CanBuildFrom[Repr,B,That])That

	scala> map.typeSignatureIn(typeOf[List[Int]])
	res1: reflect.runtime.universe.Type = [B, That](f: Int => B)(implicit bf:
	scala.collection.generic.CanBuildFrom[List[Int],B,That])That

	scala> map.params
	res2: List[List[reflect.runtime.universe.Symbol]] = List(List(value f), List(value bf))

	scala> val filter = map.params(0)(0)
	filter: reflect.runtime.universe.Symbol = value f

	scala> filter.name
	res3: reflect.runtime.universe.Name = f

	scala> filter.typeSignature
	res4: reflect.runtime.universe.Type = A => B

### Overloaded methods

Overloaded methods are represented as instances of TermSymbol with multiple `alternatives` that have to be resolved manually. For example, a lookup
for a member named `mkString` will produce not a MethodSymbol, but a TermSymbol:


	scala> list.typeSignature.member("mkString": TermName)
	res1: reflect.runtime.universe.Symbol = value mkString

	scala> val mkString = list.typeSignature.member("mkString": TermName).asTerm
	mkString: reflect.runtime.universe.TermSymbol = value mkString

	scala> mkString.isMethod
	res0: Boolean = false

	scala> mkString.alternatives
	res1: List[reflect.runtime.universe.Symbol] = List(method mkString, method mkString, method mkString)

	scala> mkString.alternatives foreach println
	method mkString
	method mkString
	method mkString

	scala> mkString.alternatives foreach (alt => println(alt.typeSignature))
	=> String
	(sep: String)String
	(start: String, sep: String, end: String)String


Once one has a symbol, that symbol can be used for reflective invocations. For example,
having a TermSymbol corresponding to a field it's possible to get or set a value of that field.
Having a MethodSymbol makes it possible to invoke the corresponding methods. ClassSymbols
can be instantiated. ModuleSymbols can provide corresponding singleton instances. This is described
in detail on [[scala.reflect.api.package the reflection overview page]].

### Module classes

Internally the Scala compiler represents objects with two symbols: a module symbol and a module class symbol.
The former is a term symbol, used everywhere a module is referenced (e.g. in singleton types or in expressions),
while the latter is a type symbol, which carries the type signature (i.e. the member list) of the module.
This implementation detail can be easily seen by compiling a trivial snippet of code. Invoking the Scala
compiler on `object C` will generate C$.class. That's exactly the module class.

Note that module classes are different from companion classes. Say, for `case class C`, the compiler
will generate three symbols: `type C`, `term C` and (another one) `type C`, where the first type `C`
represents the class `C` (which contains auto-generated `copy`, `productPrefix`, `productArity` etc) and
the second type `C` represents the signature of object `C` (which contains auto-generated factory,
extractor etc). There won't be any name clashes, because the module class isn't added to the symbol table
directly and is only available through `<module>.moduleClass`. For the sake of completeness, it is possible
to go back from a module class to a module via `<module class>.module`.

Separation between modules and module classes is something that we might eliminate in the future, but for now
this obscure implementation detail has to be taken into account when working with reflection. On the one hand,
it is necessary to go to a module class to get a list of members for an object. On the other hand, it is
necessary to go from a module class back to a module to get a singleton instance of an object. The latter
scenario is described at Stack Overflow: [[http://stackoverflow.com/questions/12128783 How can I get the actual object referred to by Scala 2.10 reflection?]].







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

