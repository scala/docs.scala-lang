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

