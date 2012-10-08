---
layout: overview-large
title: Names, Exprs, Scopes, and More

partof: reflection
num: 5
---

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
