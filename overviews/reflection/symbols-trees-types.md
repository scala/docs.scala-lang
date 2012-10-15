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


<!--  FROM TRES.SCALA
- *  Newly instantiated trees have `tpe` set to null (though it
- *  may be set immediately thereafter depending on how it is
- *  constructed.) When a tree is passed to the typechecker
- *  (via toolboxes in runtime reflection or using
- *  [[scala.reflect.macros.Context#typeCheck]] in comple-time reflection)
- *  under normal circumstances the `tpe` must be
- *  `null` or the typechecker will ignore it. Furthermore, the typechecker is not
- *  required to return the same tree it was passed.
- *
- *  Trees can be easily traversed with e.g. `foreach` on the root node;
- *  for a more nuanced traversal, subclass `Traverser`. Transformations
- *  are done by subclassing `Transformer`.
- *
- *  Copying Trees should be done with care depending on whether
- *  it needs be done lazily or strictly (see [[scala.reflect.api.Trees#newLazyTreeCopier]] and
- *  [[scala.reflect.api.Trees#newStrictTreeCopier]]) and on whether the contents of the mutable
- *  fields should be copied. The tree copiers will copy the mutable
- *  attributes to the new tree. A shortcut way of copying trees is [[scala.reflect.api.Trees#Tree#duplicate]]
- *  which uses a strict copier.
- *
- *  Trees can be coarsely divided into four mutually exclusive categories:
- *
- *  - Subclasses of `TermTree`, representing terms
- *  - Subclasses of `TypTree`, representing types.  Note that is `TypTree`, not `TypeTree`.
- *  - Subclasses of `SymTree`, which either define or reference symbols.
- *  - Other trees, which have none of those as superclasses.
- *
- *  `SymTrees` include important nodes `Ident` (which represent references to identifiers)
- *  and `Select` (which represent member selection). These nodes can be used as both terms and types;
- *  they are distinguishable based on whether their underlying [[scala.reflect.api.Names#Name]]
- *  is a `TermName` or `TypeName`.  The correct way to test any Tree for a type or a term are the `isTerm`/`isType
- *  methods on Tree.
- *
- *  "Others" are mostly syntactic or short-lived constructs. Take, for example,
- *  `CaseDef`, which wraps individual match cases: such nodes are neither terms nor types,
- *  nor do they carry a symbol.
- *
- *  === How to get a tree that corresponds to a snippet of Scala code? ===
- *
- *  With the introduction of compile-time metaprogramming and runtime compilation in Scala 2.10.0,
- *  quite often it becomes necessary to convert Scala code into corresponding trees.
- *
- *  The simplest was to do that is to use [[scala.reflect.api.Universe#reify]].
- *  The `reify` method takes an valid Scala expression (i.e. it has to be well-formed
- *  with respect to syntax and has to typecheck, which means no unresolved free variables).
- *  and produces a tree that represents the input.
- *
- *  {{{
- *  scala> import scala.reflect.runtime.universe._
- *  import scala.reflect.runtime.universe._
- *
- *  // trying to reify a snippet that doesn't typecheck
- *  // leads to a compilation error
- *  scala> reify(x + 2)
- *  <console>:31: error: not found: value x
- *                reify(x + 2)
- *                      ^
- *
- *  scala> val x = 2
- *  x: Int = 2
- *
- *  // now when the variable x is in the scope
- *  // we can successfully reify the expression `x + 2`
- *  scala> val expr = reify(x + 2)
- *  expr: reflect.runtime.universe.Expr[Int] = Expr[Int](x.$plus(2))
- *
- *  // the result of reification is of type Expr
- *  // exprs are thin wrappers over trees
- *  scala> expr.tree
- *  res2: reflect.runtime.universe.Tree = x.$plus(2)
- *
- *  // we can see that the expression `x + 2`
- *  // is internally represented as an instance of the `Apply` case class
- *  scala> res2.getClass.toString
- *  res3: String = class scala.reflect.internal.Trees$Apply
- *
- *  // when it comes to inspecting the structure of the trees,
- *  // the default implementation of `toString` doesn't help much
- *  // the solution is discussed in one of the next sections
- *  }}}
- *
- *  The alternative way of getting an AST of a snippet of Scala code
- *  is having it parsed by a toolbox (see [[scala.reflect.api.package the overview page]]
- *  for more information about toolboxes):
- *  {{{
- *  scala> import scala.reflect.runtime.universe._
- *  import scala.reflect.runtime.universe._
- *
- *  scala> import scala.reflect.runtime.{currentMirror => cm}
- *  import scala.reflect.runtime.{currentMirror=>cm}
- *
- *  scala> import scala.tools.reflect.ToolBox // requires scala-compiler.jar
- *  import scala.tools.reflect.ToolBox
- *
- *  scala> val tb = cm.mkToolBox()
- *  tb: scala.tools.reflect.ToolBox[reflect.runtime.universe.type] = ...
- *
- *  scala> tb.parse("x + 2")
- *  res0: tb.u.Tree = x.$plus(2)
- *  }}}
- *
- *  === How to evaluate a tree? ===
- *
- *  Once there's a way to get a tree that represents Scala code, the next question
- *  is how to evaluate it. The answer to this question depends on what flavor of reflection is used:
- *  runtime reflection or compile-time reflection (macros).
- *
- *  Within runtime reflection, evaluation can be carried out using toolboxes.
- *  To create a toolbox one wraps a classloader in a mirror and then uses the mirror
- *  to instantiate a toolbox. Later on the underlying classloader will be used to map
- *  symbolic names (such as `List`) to underlying classes of the platform
- *  (see [[scala.reflect.api.package the overview page]] for more information about universes,
- *  mirrors and toolboxes):
- *
- *  {{{
- *  scala> import scala.reflect.runtime.universe._
- *  import scala.reflect.runtime.universe._
- *
- *  scala> import scala.tools.reflect.ToolBox // requires scala-compiler.jar
- *  import scala.tools.reflect.ToolBox
- *
- *  scala> val mirror = runtimeMirror(getClass.getClassLoader)
- *  mirror: reflect.runtime.universe.Mirror = JavaMirror with ...
- *
- *  scala> val tb = mirror.mkToolBox()
- *  tb: scala.tools.reflect.ToolBox[reflect.runtime.universe.type] = ...
- *
- *  scala> tb.eval(tb.parse("2 + 2"))
- *  res0: Int = 4
- *  }}}
- *
- *  At compile-time, [[scala.reflect.macros.Context]] provides the [[scala.reflect.macros.Evals#eval]] method,
- *  which doesn't require manual instantiation of mirrors and toolboxes and potentially will have better performance
- *  (at the moment it still creates toolboxes under the cover, but in later releases it might be optimized
- *  to reuse the infrastructure of already running compiler).
- *
- *  Behind the scenes tree evaluation launches the entire compilation pipeline and creates an in-memory virtual directory
- *  that holds the resulting class files (that's why it requires scala-compiler.jar when used with runtime reflection).
- *  This means that the tree being evaluated should be valid Scala code (e.g. it shouldn't contain type errors).
- *
- *  Quite often though there is a need to evaluate code in some predefined context. For example, one might want to use a dictionary
- *  that maps names to values as an environment for the code being evaluated. This isn't supported out of the box,
- *  but nevertheless this scenario is possible to implement. See a [[http://stackoverflow.com/questions/12122939 Stack Overflow topic]]
- *  for more details.
- *
- *  === How to get an internal representation of a tree? ===
- *
- *  The `toString` method on trees is designed to print a close-to-Scala representation
- *  of the code that a given tree represents. This is usually convenient, but sometimes
- *  one would like to look under the covers and see what exactly are the AST nodes that
- *  constitute a certain tree.
- *
- *  Scala reflection provides a way to dig deeper through [[scala.reflect.api.Printers]]
- *  and their `showRaw` method. Refer to the page linked above for a series of detailed
- *  examples.
- *
- *  {{{
- *  scala> import scala.reflect.runtime.universe._
- *  import scala.reflect.runtime.universe._
- *
- *  scala> def tree = reify{ final class C { def x = 2 } }.tree
- *  tree: reflect.runtime.universe.Tree	  	
- *
- *  // show displays prettified representation of reflection artifacts
- *  // which is typically close to Scala code, but sometimes not quite
- *  // (e.g. here the constructor is shown in a desugared way)
- *  scala> show(tree)
- *  res0: String =	
- *  {
- *    final class C extends AnyRef {
- *      def <init>() = {
- *        super.<init>();
- *        ()
- *      };
- *      def x = 2
- *    };
- *    ()	
- *  }
- *
- *  // showRaw displays internal structure of a given reflection object
- *  // trees and types (type examples are shown below) are case classes
- *  // so they are shown in a form that's almost copy/pasteable
- *  //
- *  // almost copy/pasteable, but not completely - that's because of symbols
- *  // there's no good way to get a roundtrip-surviving representation of symbols
- *  // in general case, therefore only symbol names are shown (e.g. take a look at AnyRef)	
- *  //
- *  // in such a representation, it's impossible to distinguish Idents/Selects
- *  // that have underlying symbols vs ones that don't have symbols, because in both cases
- *  // only names will be printed	
- *  //
- *  // to overcome this limitation, use `printIds` and `printKinds` - optional parameters
- *  // of the `showRaw` method (example is shown on the scala.reflect.api.Printers doc page)
- *  scala> showRaw(tree)
- *  res1: String = Block(List(
- *    ClassDef(Modifiers(FINAL), newTypeName("C"), List(), Template(
- *      List(Ident(newTypeName("AnyRef"))),
- *      emptyValDef,
- *      List(
- *        DefDef(Modifiers(), nme.CONSTRUCTOR, List(), List(List()), TypeTree(),
- *          Block(List(
- *            Apply(Select(Super(This(tpnme.EMPTY), tpnme.EMPTY), nme.CONSTRUCTOR), List())),
- *            Literal(Constant(())))),
- *        DefDef(Modifiers(), newTermName("x"), List(), List(), TypeTree(),
- *          Literal(Constant(2))))))),
- *    Literal(Constant(())))
- *  }}} -->

<!-- FROM SYMBOLS.SCALA
- *  Symbols are used by the Scala compiler to establish bindings. When typechecking a Scala program,
- *  the compiler populates [[scala.reflect.api.Trees#RefTrees ref trees]], such as [[scala.reflect.api.Trees#Ident Ident]]
- *  (references to identifiers) and [[scala.reflect.api.Trees#Select Select]] (references to members)
- *  with symbols that represent the declarations being referred to. Populating means setting the `symbol`
- *  field to a non-empty value.
- *
- *  Here's an example of how trees look after the `typer` phase of the Scala compiler (this phase performs the typechecking).
- *  {{{
- *  >cat Test.scala
- *  def foo[T: TypeTag](x: Any) = x.asInstanceOf[T]
- *
- *  >scalac -Xprint:typer -uniqid Test.scala
- *  [[syntax trees at end of typer]]// Scala source: Test.scala
- *  def foo#8339
- *    [T#8340 >: Nothing#4658 <: Any#4657]
- *    (x#9529: Any#4657)
- *    (implicit evidence$1#9530: TypeTag#7861[T#8341])
- *    : T#8340 =
- *  x#9529.asInstanceOf#6023[T#8341];
- *  }}} -->


<!-- FROM NAMES.SCALA
-  /**
-   * The abstract type of names	
-   *
-   * A Name wraps a string as the name for either a type ([[TypeName]]) of a term ([[TermName]]). 	
-   * Two names are equal, if the wrapped string are equal and they are either both `TypeName` or both `TermName`.
-   * The same string can co-exist as a `TypeName` and a `TermName`, but they would not be equal.
-   * Names are interned. That is, for two names `name11 and `name2`,
-   *  `name1 == name2` implies `name1 eq name2`.
-   *
-   *  One of the reasons for the existence of names rather than plain strings is being more explicit about what is a name and if it represents a type or a term. -->

<!-- FROM TYPETAG.SCALA
- * A type tag encapsulates a representation of type T.
- *
- * Type tags replace the pre-2.10 concept of a [[scala.reflect.Manifest]] and are integrated with reflection.
- *
- * === Overview and examples ===
- *
- * Type tags are organized in a hierarchy of three classes:
- * [[scala.reflect.ClassTag]], [[scala.reflect.api.Universe#TypeTag]] and [[scala.reflect.api.Universe#WeakTypeTag]].
- *
- * @see [[scala.reflect.ClassTag]], [[scala.reflect.api.Universe#TypeTag]], [[scala.reflect.api.Universe#WeakTypeTag]]
- *
- * Examples:
- *   {{{
- *   scala> class Person
- *   scala> class Container[T]
- *   scala> import scala.reflect.ClassTag
- *   scala> import scala.reflect.runtime.universe.TypeTag
- *   scala> import scala.reflect.runtime.universe.WeakTypeTag
- *   scala> def firstTypeArg( tag: WeakTypeTag[_] ) = (tag.tpe match {case TypeRef(_,_,typeArgs) => typeArgs})(0)
- *   }}}
- *   TypeTag contains concrete type arguments:
- *   {{{
- *   scala> firstTypeArg( implicitly[TypeTag[Container[Person]]] )
- *   res0: reflect.runtime.universe.Type = Person
- *   }}}
- *   TypeTag guarantees concrete type arguments (fails for references to unbound type arguments):
- *   {{{
- *   scala> def foo1[T] = implicitly[TypeTag[Container[T]]]
- *   <console>:11: error: No TypeTag available for Container[T]
- *          def foo1[T] = implicitly[TypeTag[Container[T]]]
- *   }}}
- *   WeakTypeTag allows references to unbound type arguments:
- *   {{{
- *   scala> def foo2[T] = firstTypeArg( implicitly[WeakTypeTag[Container[T]]] )
- *   foo2: [T]=> reflect.runtime.universe.Type
- *   scala> foo2[Person]
- *   res1: reflect.runtime.universe.Type = T
- *   }}}
- *   TypeTag allows unbound type arguments for which type tags are available:
- *   {{{
- *   scala> def foo3[T:TypeTag] = firstTypeArg( implicitly[TypeTag[Container[T]]] )
- *   foo3: [T](implicit evidence$1: reflect.runtime.universe.TypeTag[T])reflect.runtime.universe.Type
- *   scala> foo3[Person]
- *   res1: reflect.runtime.universe.Type = Person
- *   }}}
- *   WeakTypeTag contains concrete type arguments if available via existing tags:
- *   {{{
- *   scala> def foo4[T:WeakTypeTag] = firstTypeArg( implicitly[WeakTypeTag[Container[T]]] )
- *   foo4: [T](implicit evidence$1: reflect.runtime.universe.WeakTypeTag[T])reflect.runtime.universe.Type
- *   scala> foo4[Person]
- *   res1: reflect.runtime.universe.Type = Person
- *   }}}
- *
- *
- * [[scala.reflect.api.Universe#TypeTag]] and [[scala.reflect.api.Universe#WeakTypeTag]] are path dependent on their univers
- *
- * The default universe is [[scala.reflect.runtime.universe]]
- *
- * Type tags can be migrated to another universe given the corresponding mirror using
- *
- *  {{{
- *  tag.in( other_mirror )
- *  }}}
- *
- *  See [[scala.reflect.api.TypeTags#WeakTypeTag.in]]
- *
- * === WeakTypeTag vs TypeTag ===
- *
- * Be careful with WeakTypeTag, because it will reify types even if these types are abstract.
- * This makes it easy to forget to tag one of the methods in the call chain and discover it much later in the runtime
- * by getting cryptic errors far away from their source. For example, consider the following snippet:
- *   def bind[T: WeakTypeTag](name: String, value: T): IR.Result = bind((name, value))
- *   def bind(p: NamedParam): IR.Result                          = bind(p.name, p.tpe, p.value)
- *   object NamedParam {
- *     implicit def namedValue[T: WeakTypeTag](name: String, x: T): NamedParam = apply(name, x)
- *     def apply[T: WeakTypeTag](name: String, x: T): NamedParam = new Typed[T](name, x)
+ * === `WeakTypeTag`s ===
  *
- * This fragment of the Scala REPL implementation defines a `bind` function that carries a named value along with its type
- * into the heart of the REPL. Using a [[scala.reflect.api.Universe#WeakTypeTag]] here is reasonable, because it is desirable
- * to work with all types, even if they are type parameters or abstract type members.
- * However if any of the three `WeakTypeTag` context bounds is omitted, the resulting code will be incorrect,
- * because the missing `WeakTypeTag` will be transparently generated by the compiler, carrying meaningless information.
- * Most likely, this problem will manifest itself elsewhere, making debugging complicated.
- * If `WeakTypeTag` context bounds were replaced with `TypeTag`, then such errors would be reported statically.
- * But in that case we wouldn't be able to use `bind` in arbitrary contexts.
- * === Backward compatibility with Manifests ===- * More precisely:
- * The previous notion of a [[scala.reflect.ClassManifest]] corresponds to a scala.reflect.ClassTag,
- * The previous notion of a [[scala.reflect.Manifest]] corresponds to scala.reflect.runtime.universe.TypeTag
- * Type tags correspond loosely to manifests.
- * More precisely:
- * The previous notion of a [[scala.reflect.ClassManifest]] corresponds to a scala.reflect.ClassTag,
- * The previous notion of a [[scala.reflect.Manifest]] corresponds to scala.reflect.runtime.universe.TypeTag
- * In Scala 2.10, manifests are deprecated, so it's advisable to migrate them to tags,
- * because manifests will probably be removed in the next major release.
- * In most cases it will be enough to replace ClassManifest with ClassTag and Manifest with TypeTag.
- * There are however a few caveats:
- * 1) The notion of OptManifest is no longer supported. Tags can reify arbitrary types, so they are always available.
- * 2) There's no equivalent for AnyValManifest. Consider comparing your tag with one of the base tags
- *    (defined in the corresponding companion objects) to find out whether it represents a primitive value class.
- *    You can also use `<tag>.tpe.typeSymbol.isPrimitiveValueClass` for that purpose (requires scala-reflect.jar).
- * 3) There's no replacement for factory methods defined in `ClassManifest` and `Manifest` companion objects.
- *    Consider assembling corresponding types using the reflection APIs provided by Java (for classes) and Scala (for types).
- * 4) Certain manifest functions (such as `<:<`, `>:>` and `typeArguments`) weren't included in the tag API.
- *    Consider using the reflection APIs provided by Java (for classes) and Scala (for types) instead.
-   * If an implicit value of type WeakTypeTag[T] is required, the compiler will create one.
-   * A reflective representation of T can be accessed via the tpe field.
-   * Components of T can be references to type parameters or abstract types. WeakTypeTag makes an effort to
-   * be as concrete as possible, i.e. if type tags are available for the referenced type arguments or abstract types,
-   * they are used to embed the concrete types into the WeakTypeTag. Otherwise the WeakTypeTag will contain a reference
-   * to an abstract type. This behavior can be useful, when one expects T to be possibly partially abstract, but
-   * requires special care to handle this case. If however T is expected to be fully known, use
 -->