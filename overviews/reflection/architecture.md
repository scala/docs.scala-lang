---
layout: overview-large
title: Architecture

partof: reflection
num: 6
---

===TreeCreator===
A mirror-aware factory for trees.

In the reflection API, artifacts are specific to universes and
symbolic references used in artifacts (e.g. `scala.Int`) are resolved by mirrors.

Therefore to build a tree one needs to know a universe that the tree is going to be bound to
and a mirror that is going to resolve symbolic references (e.g. to determine that `scala.Int`
points to a core class `Int` from scala-library.jar).

`TreeCreator` implements this notion by providing a standalone tree factory.

This is immediately useful for reification. When the compiler reifies an expression,
the end result needs to make sense in any mirror. That's because the compiler knows
the universe it's reifying an expression into (specified by the target of the `reify` call),
but it cannot know in advance the mirror to instantiate the result in (e.g. on JVM
it doesn't know what classloader use to resolve symbolic names in the reifee).

Due to a typechecker restriction (no eta-expansion for dependent method types),
`TreeCreator` can't have a functional type, so it's implemented as class with an apply method.

===TypeCreator===
A mirror-aware factory for types.

In the reflection API, artifacts are specific to universes and
symbolic references used in artifacts (e.g. `scala.Int`) are resolved by mirrors.

Therefore to build a type one needs to know a universe that the type is going to be bound to
and a mirror that is going to resolve symbolic references (e.g. to determine that `scala.Int`
points to a core class `Int` from scala-library.jar).

`TypeCreator` implements this notion by providing a standalone type factory.

This is immediately useful for type tags. When the compiler creates a type tag,
the end result needs to make sense in any mirror. That's because the compiler knows
the universe it's creating a type tag for (since `TypeTag` is path-dependent on a universe),
but it cannot know in advance the mirror to instantiate the result in (e.g. on JVM
it doesn't know what classloader use to resolve symbolic names in the type tag).

Due to a typechecker restriction (no eta-expansion for dependent method types),
`TypeCreator` can't have a functional type, so it's implemented as class with an apply method.


<!-- From scala.reflect.api.Universe
* Each of these types are defined in their own enclosing traits, which are ultimately all inherited by class
 * [[scala.reflect.api.Universe Universe]]. The main universe defines a minimal interface to the above types.
 * Universes that provide additional functionality such as deeper introspection or runtime code generation,
 * are defined in packages [[scala.reflect.macros]] and `scala.tools.reflect`.
 *
 * The cake pattern employed here requires to write certain Scala idioms with more indirections that usual.
 * What follows is a description of these indirections, which will help to navigate the Scaladocs easily.
 *
 * For instance, consider the base type of all abstract syntax trees: [[scala.reflect.api.Trees#Tree]].
 * This type is not a class but is abstract and has an upper bound of [[scala.reflect.api.Trees#TreeApi]],
 * which is a class defining the minimal base interface for all trees.
 *
 * For a more interesting tree type, consider [[scala.reflect.api.Trees#If]] representing if-expressions.
 * It is defined next to a value `If` of type [[scala.reflect.api.Trees#IfExtractor]].
 * This value serves as the companion object defining a factory method `apply` and a corresponding `unapply`
 * for pattern matching.
 *
 * {{{
 * import scala.reflect.runtime.universe._
 * val cond = reify{ condition }.tree // <- just some tree representing a condition
 * val body = Literal(Constant(1))
 * val other = Literal(Constant(2))
 * val iftree = If(cond,body,other)
 * }}}
 *
 * is equivalent to
 *
 * {{{
 * import scala.reflect.runtime.universe._
 * val iftree = reify{ if( condition ) 1 else 2 }.tree
 * }}}
 *
 * and can be pattern matched as
 *
 * {{{
 * iftree match { case If(cond,body,other) => ... }
 * }}}
 *
 * Moreover, there is an implicit value [[scala.reflect.api.Trees#IfTag]] of type
 * `ClassTag[If]` that is used by the Scala compiler so that we can indeed pattern match on `If`:
 * {{{
 *   iftree match { case _:If => ... }
 * }}}
 * Without the given implicit value, this pattern match would raise an "unchecked" warning at compile time
 * since `If` is an abstract type that gets erased at runtime. See [[scala.reflect.ClassTag]] for details.
 *
 * To summarize: each tree type `X` (and similarly for other types such as `Type` or `Symbol`) is represented
 * by an abstract type `X`, optionally together with a class `XApi` that defines `X`'s' interface.
 * `X`'s companion object, if it exists, is represented by a value `X` that is of type `XExtractor`.
 * Moreover, for each type `X`, there is a value `XTag` of type `ClassTag[X]` that allows to pattern match on `X`.
 -->


<!--  FROM CONSTANTS.SCALA
-/** A slice of [[scala.reflect.api.Universe the Scala reflection cake]] that defines compile-time constants and operations on them.
- *  See [[scala.reflect.api.Universe]] for a description of how the reflection API is encoded with the cake pattern.
- *
- *  According to the section 6.24 "Constant Expressions" of the Scala language specification,	  	
- *  certain expressions (dubbed ''constant expressions'') can be evaluated by the Scala compiler at compile-time.
- *
- *  [[scala.reflect.api.Constants#Constant]] instances represent certain kinds of these expressions
- *  (with values stored in the `value` field and its strongly-typed views named `booleanValue`, `intValue` etc.), namely:
- *    1. Literals of primitive value classes (bytes, shorts, ints, longs, floats, doubles, chars, booleans and voids).
- *    1. String literals.
- *    1. References to classes (typically constructed with [[scala.Predef#classOf]]).
- *    1. References to enumeration values.
- *
- *  Such constants are used to represent literals in abstract syntax trees (the [[scala.reflect.api.Trees#Literal]] node)
- *  and literal arguments for Java class file annotations (the [[scala.reflect.api.Annotations#LiteralArgument]] class).
- *
- *  === Example ===
- *
- *  The `value` field deserves some explanation. Primitive and string values are represented as themselves, whereas
- *  references to classes and enums are a bit roundabout.
- *
- *  Class references are represented as instances of [[scala.reflect.api.Types#Type]]
- *  (because when the Scala compiler processes a class reference, the underlying runtime class might not yet have been compiled).
- *  To convert such a reference to a runtime class, one should use the `runtimeClass` method of a mirror such as [[scala.reflect.api.Mirrors#RuntimeMirror]]
- *  (the simplest way to get such a mirror is using [[scala.reflect.runtime.package#currentMirror]]).
- *
- *  Enumeration value references are represented as instances of [[scala.reflect.api.Symbols#Symbol]], which on JVM point to methods
- *  that return underlying enum values. To inspect an underlying enumeration or to get runtime value of a reference to an enum,
- *  one should use a [[scala.reflect.api.Mirrors#RuntimeMirror]] (the simplest way to get such a mirror is again [[scala.reflect.runtime.package#currentMirror]]).
-
- *  {{{
- *  enum JavaSimpleEnumeration { FOO, BAR }
- *
- *  import java.lang.annotation.*;
- *  @Retention(RetentionPolicy.RUNTIME)
- *  @Target({ElementType.TYPE})
- *  public @interface JavaSimpleAnnotation {
- *    Class<?> classRef();
- *    JavaSimpleEnumeration enumRef();
- *  }
- *	
- *  @JavaSimpleAnnotation(
- *    classRef = JavaAnnottee.class,
- *    enumRef = JavaSimpleEnumeration.BAR	
- *  )
- *  public class JavaAnnottee {}
- *  }}}
- *  {{{
- *  import scala.reflect.runtime.universe._
- *  import scala.reflect.runtime.{currentMirror => cm}
- *
- *  object Test extends App {
- *    val jann = typeOf[JavaAnnottee].typeSymbol.annotations(0).javaArgs
- *    def jarg(name: String) = jann(newTermName(name)).asInstanceOf[LiteralArgument].value
- *
- *    val classRef = jarg("classRef").typeValue
- *    println(showRaw(classRef))             // TypeRef(ThisType(<empty>), JavaAnnottee, List())
- *    println(cm.runtimeClass(classRef))     // class JavaAnnottee
- *
- *    val enumRef = jarg("enumRef").symbolValue
- *    println(enumRef)                       // value BAR
- *
- *    val siblings = enumRef.owner.typeSignature.declarations
- *    val enumValues = siblings.filter(sym => sym.isVal && sym.isPublic)
- *    println(enumValues)                    // Scope{
- *                                           //   final val FOO: JavaSimpleEnumeration;
- *                                           //   final val BAR: JavaSimpleEnumeration
- *                                           // }	  	
- *
- *    // doesn't work because of https://issues.scala-lang.org/browse/SI-6459
- *    // val enumValue = mirror.reflectField(enumRef.asTerm).get
- *    val enumClass = cm.runtimeClass(enumRef.owner.asClass)
- *    val enumValue = enumClass.getDeclaredField(enumRef.name.toString).get(null)
- *    println(enumValue)                     // BAR	
- *  }
- *  }}} -->