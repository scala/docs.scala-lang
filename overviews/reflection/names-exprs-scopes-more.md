---
layout: overview-large
title: Names, Exprs, Scopes, and More

partof: reflection
num: 5
---
===Names===
Names are separated into two distinct namespaces for terms and types. For example it is possible to have
a class named `C` and an object named `C` declared in the same lexical scope.

Therefore the Scala reflection API models names using strongly-typed objects rather than strings:
[[scala.reflect.api.Names#TermName]] and [[scala.reflect.api.Names#TypeName]].

A Name wraps a string as the name for either a type ([[TypeName]]) of a term ([[TermName]]).
Two names are equal, if the wrapped string are equal and they are either both `TypeName` or both `TermName`.
The same string can co-exist as a `TypeName` and a `TermName`, but they would not be equal.
Names are interned. That is, for two names `name1` and `name2`, `name1 == name2` implies `name1 eq name2`.
Name instances also can perform mangling and unmangling of symbolic names.



An alternative notation makes use of implicit conversions from `String` to `TermName` and `TypeName`:
`typeOf[List[_]].member("map": TermName)`. Note that there's no implicit conversion from `String` to `Name`,
because it would be unclear whether such a conversion should produce a term name or a type name.

Finally some names that bear special meaning for the compiler are defined in [[scala.reflect.api.StandardNames]].
For example, `WILDCARD` represents `_` and `CONSTRUCTOR` represents the standard JVM name for constructors, `<init>`.
Prefer using such constants instead of spelling the names out explicitly.
===Annotations===
### Annotation Example
 
Entry points to the annotation API are [[scala.reflect.api.Symbols#Symbol.annotations]] (for definition annotations) and [[scala.reflect.api.Types#AnnotatedType]] (for type annotations).
 
To get annotations attached to a definition, first load the corresponding symbol (either explicitly using a [[scala.reflect.api.Mirror]] such as [[scala.reflect.runtime.package#currentMirror]] or implicitly using [[scala.reflect.api.TypeTags#typeOf]] and then either acquiring its `typeSymbol` or navigating its `members`). After the symbol is loaded, call its `annotations` method.
 
When inspecting a symbol for annotations, one should make sure that the inspected symbol is indeed the target of the annotation being looked for. Since single Scala definitions might produce multiple underlying definitions in bytecode, sometimes the notion of annotation's target is convoluted. For example, by default an annotation placed on a `val` will be attached to the private underlying field rather than to the getter (therefore to get such an annotation, one needs to do not `getter.annotations`, but `getter.asTerm.accessed.annotations`). This can get nasty with abstract vals, which don't have underlying fields and therefore ignore their annotations unless special measures are taken. See [[scala.annotation.meta.package]] for more information.
 
To get annotations attached to a type, simply pattern match that type against [[scala.reflect.api.Types#AnnotatedType]].

    object Test extends App {
      val x = 2
    
      // Scala annotations are the most flexible with respect to
      // the richness of metadata they can store.
      // Arguments of such annotations are stored as abstract syntax trees,
      // so they can represent and persist arbitrary Scala expressions.
      @S(x, 2) class C
      val c = typeOf[C].typeSymbol
      println(c.annotations)                           // List(S(Test.this.x, 2))
      val tree = c.annotations(0).scalaArgs(0)
      println(showRaw(tree))                           // Select(..., newTermName("x"))
      println(tree.symbol.owner)                       // object Test
      println(showRaw(c.annotations(0).scalaArgs(1)))  // Literal(Constant(2))
    
      // Java annotations are limited to predefined kinds of arguments:
      // literals (primitives and strings), arrays and nested annotations.
      @J(x = 2, y = 2) class D
      val d = typeOf[D].typeSymbol
      println(d.annotations)                           // List(J(x = 2, y = 2))
      println(d.annotations(0).javaArgs)               // Map(x -> 2, y -> 2)
    }

===Positions===
For interactive IDE's there are also range positions and transparent positions. A range position indicates a `start` and an `end`
in addition to its point. Range positions need to be non-overlapping and a tree node's range position must contain
the positions of all its children. Transparent positions were added to work around the invariants if the code
structure requires it. Non-transparent positions 

Trees with RangePositions need to satisfy the following invariants.
 - INV1: A tree with an offset position never contains a child
       with a range position
 - INV2: If the child of a tree with a range position also has a range position,
       then the child's range is contained in the parent's range.
 - INV3: Opaque range positions of children of the same node are non-overlapping
       (this means their overlap is at most a single point).

The following tests are useful on positions:
 `pos.isDefined`     true if position is not a NoPosition,
 `pos.isRange`       true if position is a range,
 `pos.isOpaqueRange` true if position is an opaque range,

There are also convenience methods, such as
 `pos.startOrPoint`,
 `pos.endOrPoint`,
 `pos.pointOrElse(default)`.
These are less strict about the kind of position on which they can be applied.

The following conversion methods are often used:
 `pos.focus`           converts a range position to an offset position, keeping its point;
                       returns all other positions unchanged,
 `pos.makeTransparent` converts an opaque range position into a transparent one.
                       returns all other positions unchanged.
==== Known issues ====
As it currently stands, positions cannot be created by a programmer - they only get emitted by the compiler
and can only be reused in compile-time macro universes.

Also positions are neither pickled (i.e. saved for runtime reflection using standard means of scalac) nor
reified (i.e. saved for runtime reflection using the [[Universe#reify]] macro).

This API is considered to be a candidate for redesign. It is quite probable that in future releases of the reflection API
positions will undergo a dramatic rehash.

<!-- FROM ANNOTATIONS.SCALA
- *  Scala reflection supports:
- *    1. Annotations on definitions or types produced by the Scala compiler, i.e. subtypes of both
- *    [[scala.annotation.StaticAnnotation]] and [[scala.annotation.ClassfileAnnotation]] attached to program definitions or types
- *    (note: subclassing just [[scala.annotation.Annotation]] is not enough to have the corresponding
- *    metadata persisted for runtime reflection).
- *    1. Annotations on definitions produced by the Java compiler, i.e. subtypes of [[java.lang.annotation.Annotation]] -->

<!-- FROM ANNOTATIONS.SCALA
- *  First of all [[scala.reflect.api.Annotations#Annotation]] provides `tpe`, which describes the type of the annotation.
- *  Depending on the superclasses of `tpe`, there are two flavors of annotations.
- *
- *  When annotations that subclass of [[scala.annotation.StaticAnnotation]] (dubbed ''Scala annotations'') are compiled by the Scala compiler,
- *  the information about them is ''pickled'', i.e. stored in special attributes in class files. To the contrast,
- *  annotations subclassing [[scala.annotation.ClassfileAnnotation]] (called ''Java annotations'') are written to class files as Java annotations.
- *  This distinction is manifested in the contract of [[scala.reflect.api.Annotations#Annotation]], which exposes
- *  both `scalaArgs` and `javaArgs`.
- *
- *  For Scala annotations, arguments are stored in `scalaArgs` and `javaArgs` is empty. Arguments in
- *  `scalaArgs` are represented as typed trees. Note that these trees are not transformed by any phases
- *  following the type-checker.
- *
- *  For Java annotations, `scalaArgs` is empty and arguments are stored in `javaArgs`.
- *  In this case, unlike in Java, Scala reflection only provides a key-value store of type [[scala.collection.immutable.ListMap]] from [[scala.reflect.api.Names#Name]] to
- *  [[scala.reflect.api.Annotations#JavaArgument]] that describes the annotations. Instances of `JavaArgument`
- *  represent different kinds of Java annotation arguments: literals (primitive and string constants), arrays and nested annotations.
- *  One shoud match against [[scala.reflect.api.Annotations#LiteralArgument]], [[scala.reflect.api.Annotations#ArrayArgument]] and [[scala.reflect.api.Annotations#NestedArgument]]
- *  to analyze them. We acknowledge that this process can be made more convenient and created [[https://issues.scala-lang.org/browse/SI-6423 an issue]] in the issue tracker
- *  to discuss possible improvements and track progress. -->

  
<!-- FROM EXPRS.SCALA
- *  Thanks to using TreeCreators, exprs are essentially tree factories, capable of instantiating
- *  themselves in any universe and mirror. This is achieved by the `in` method, which performs
- *  migration of a given expression to another mirror. Migration means that all symbolic references
- *  to classes/objects/packages in the expression are re-resolved within the new mirror
- *  (typically using that mirror's classloader). Default universe of an expr is typically
- *  [[scala.reflect.runtime.package#universe]], default mirror is typically [[scala.reflect.runtime.package#currentMirror]].
- *
- *  Exprs can also be created manually, but then the burden of providing a TreeCreator lies on the programmer.
- *  However, on the one hand, manual creation is very rarely needed when working with runtime reflection,
- *  while, on the other hand, compile-time reflection via macros provides an easier way to instantiate exprs,
- *  described in [[scala.reflect.macros.Aliases]]. 
- *  === Known issues ===
- *
- *  Exprs are marked as serializable, but this functionality is not yet implemented.
- *  An issue tracker entry: [[https://issues.scala-lang.org/browse/SI-5919 https://issues.scala-lang.org/browse/SI-5919]]
- *  has been created to track the implementation of this feature. -->


<!-- FROM POSITIONS.SCALA, note: Hubert says this is wrong...
- *  - INV1: A tree with an offset position never contains a child
- *        with a range position
- *  - INV2: If the child of a tree with a range position also has a range position,
- *        then the child's range is contained in the parent's range.
- *  - INV3: Opaque range positions of children of the same node are non-overlapping
- *        (this means their overlap is at most a single point).
- *
- *  The following tests are useful on positions:
- *  `pos.isDefined`     true if position is not a NoPosition,
- *  `pos.isRange`       true if position is a range,
- *  `pos.isOpaqueRange` true if position is an opaque range,
- *
- *  There are also convenience methods, such as
- *  `pos.startOrPoint`,
- *  `pos.endOrPoint`,
- *  `pos.pointOrElse(default)`.
- *  These are less strict about the kind of position on which they can be applied.
- *
- *  The following conversion methods are often used:
- *  `pos.focus`           converts a range position to an offset position, keeping its point;
- *                        returns all other positions unchanged,
- *  `pos.makeTransparent` converts an opaque range position into a transparent one.
- *                        returns all other positions unchanged.
- *
- *  === Known issues ===
- *
- *  As it currently stands, positions cannot be created by a programmer - they only get emitted by the compiler
- *  and can only be reused in compile-time macro universes.
- *
- *  Also positions are neither pickled (i.e. saved for runtime reflection using standard means of scalac) nor
- *  reified (i.e. saved for runtime reflection using the [[scala.reflect.api.Universe#reify]] macro).
- *
- *  This API is considered to be a candidate for redesign. It is quite probable that in future releases of the reflection API
- *  positions will undergo a dramatic rehash.
 -->