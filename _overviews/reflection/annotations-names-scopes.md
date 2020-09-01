---
layout: multipage-overview
title: Annotations, Names, Scopes, and More
partof: reflection
overview-name: Reflection

num: 4

languages: [ja]
permalink: /overviews/reflection/:title.html
---

<span class="label important" style="float: right;">EXPERIMENTAL</span>

## Annotations

In Scala, declarations can be annotated using subtypes of
`scala.annotation.Annotation`. Furthermore, since Scala integrates with
[Java's annotation system](https://docs.oracle.com/javase/7/docs/technotes/guides/language/annotations.html#_top),
it's possible to work with annotations produced by a
standard Java compiler.

Annotations can be inspected reflectively if the corresponding annotations
have been persisted, so that they can be read from the classfile containing
the annotated declarations. A custom annotation type can be made persistent by
inheriting from `scala.annotation.StaticAnnotation` or
`scala.annotation.ClassfileAnnotation`. As a result, instances of the
annotation type are stored as special attributes in the corresponding
classfile. Note that subclassing just
`scala.annotation.Annotation` is not enough to have the corresponding metadata
persisted for runtime reflection. Moreover, subclassing
`scala.annotation.ClassfileAnnotation` does not make your annotation visible
as a Java annotation at runtime; that requires writing the annotation class
in Java.

The API distinguishes between two kinds of annotations:

- *Java annotations:* annotations on definitions produced by the Java compiler, _i.e.,_ subtypes of `java.lang.annotation.Annotation` attached to program definitions. When read by Scala reflection, the `scala.annotation.ClassfileAnnotation` trait is automatically added as a subclass to every Java annotation.
- *Scala annotations:* annotations on definitions or types produced by the Scala compiler.

The distinction between Java and Scala annotations is manifested in the
contract of `scala.reflect.api.Annotations#Annotation`, which exposes both
`scalaArgs` and `javaArgs`. For Scala or Java annotations extending
`scala.annotation.ClassfileAnnotation` `scalaArgs` is empty and the arguments
(if any) are stored in `javaArgs`. For all other Scala annotations, the
arguments are stored in `scalaArgs` and `javaArgs` is empty.

Arguments in `scalaArgs` are represented as typed trees. Note that these trees
are not transformed by any phases following the type-checker. Arguments in
`javaArgs` are represented as a map from `scala.reflect.api.Names#Name` to
`scala.reflect.api.Annotations#JavaArgument`. Instances of `JavaArgument`
represent different kinds of Java annotation arguments:

- literals (primitive and string constants),
- arrays, and
- nested annotations.

## Names

Names are simple wrappers for strings.
[Name](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Names$NameApi.html)
has two subtypes `TermName` and `TypeName` which distinguish names of terms (like
objects or members) and types (like classes, traits, and type members). A term
and a type of the same name can co-exist in the same object. In other words,
types and terms have separate name spaces.

Names are associated with a universe. Example:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val mapName = TermName("map")
    mapName: scala.reflect.runtime.universe.TermName = map

Above, we're creating a `Name` associated with the runtime reflection universe
(this is also visible in its path-dependent type
`reflect.runtime.universe.TermName`).

Names are often used to look up members of types. For example, to search for
the `map` method (which is a term) declared in the `List` class, one can do:

    scala> val listTpe = typeOf[List[Int]]
    listTpe: scala.reflect.runtime.universe.Type = scala.List[Int]

    scala> listTpe.member(mapName)
    res1: scala.reflect.runtime.universe.Symbol = method map

To search for a type member, one can follow the same procedure, using
`TypeName` instead.

### Standard Names

Certain names, such as "`_root_`", have special meanings in Scala programs. As
such they are essential for reflectively accessing certain Scala constructs.
For example, reflectively invoking a constructor requires using the
*standard name* `universe.termNames.CONSTRUCTOR`, the term name `<init>` which represents the
constructor name on the JVM.

There are both

- *standard term names,* _e.g.,_ "`<init>`", "`package`", and "`_root_`", and
- *standard type names,* _e.g.,_ "`<error>`", "`_`", and "`_*`".

Some names, such as "package", exist both as a type name and a term name.
Standard names are made available through the `termNames` and `typeNames` members of
class `Universe`. For a complete specification of all standard names, see the
[API documentation](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/StandardNames.html).

## Scopes

A scope object generally maps names to symbols available in a corresponding
lexical scope. Scopes can be nested. The base type exposed in the reflection
API, however, only exposes a minimal interface, representing a scope as an
iterable of [Symbol](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Symbols$Symbol.html)s.

Additional functionality is exposed in *member scopes* that are returned by
`members` and `decls` defined in
[scala.reflect.api.Types#TypeApi](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Types$TypeApi.html).
[scala.reflect.api.Scopes#MemberScope](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Scopes$MemberScope.html)
supports the `sorted` method, which sorts members *in declaration order*.

The following example returns a list of the symbols of all final members
of the `List` class, in declaration order:

    scala> val finals = listTpe.decls.sorted.filter(_.isFinal)
    finals: List(method isEmpty, method map, method collect, method flatMap, method takeWhile, method span, method foreach, method reverse, method foldRight, method length, method lengthCompare, method forall, method exists, method contains, method find, method mapConserve, method toList)

## Exprs

In addition to type `scala.reflect.api.Trees#Tree`, the base type of abstract
syntax trees, typed trees can also be represented as instances of type
[`scala.reflect.api.Exprs#Expr`](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Exprs$Expr.html).
An `Expr` wraps
an abstract syntax tree and an internal type tag to provide access to the type
of the tree. `Expr`s are mainly used to simply and conveniently create typed
abstract syntax trees for use in a macro. In most cases, this involves methods
`reify` and `splice` (see the
[macros guide]({{ site.baseurl }}/overviews/macros/overview.html) for details).

## Flags and flag sets

Flags are used to provide modifiers for abstract syntax trees that represent
definitions via the `flags` field of `scala.reflect.api.Trees#Modifiers`.
Trees that accept modifiers are:

- `scala.reflect.api.Trees#ClassDef`. Classes and traits.
- `scala.reflect.api.Trees#ModuleDef`. Objects.
- `scala.reflect.api.Trees#ValDef`. Vals, vars, parameters, and self type annotations.
- `scala.reflect.api.Trees#DefDef`. Methods and constructors.
- `scala.reflect.api.Trees#TypeDef`. Type aliases, abstract type members and type parameters.

For example, to create a class named `C` one would write something like:

    ClassDef(Modifiers(NoFlags), TypeName("C"), Nil, ...)

Here, the flag set is empty. To make `C` private, one would write something
like:

    ClassDef(Modifiers(PRIVATE), TypeName("C"), Nil, ...)

Flags can also be combined with the vertical bar operator (`|`). For example,
a private final class is written something like:

    ClassDef(Modifiers(PRIVATE | FINAL), TypeName("C"), Nil, ...)

The list of all available flags is defined in
`scala.reflect.api.FlagSets#FlagValues`, available via
`scala.reflect.api.FlagSets#Flag`. (Typically, one uses a wildcard import for
this, _e.g.,_ `import scala.reflect.runtime.universe.Flag._`.)

Definition trees are compiled down to symbols, so that flags on modifiers of
these trees are transformed into flags on the resulting symbols. Unlike trees,
symbols don't expose flags, but rather provide test methods following the
`isXXX` pattern (_e.g.,_ `isFinal` can be used to test finality). In some
cases, these test methods require a conversion using `asTerm`, `asType`, or
`asClass`, as some flags only make sense for certain kinds of symbols.

*Of note:* This part of the reflection API is being considered a candidate
for redesign. It is quite possible that in future releases of the reflection
API, flag sets could be replaced with something else.

## Constants

Certain expressions that the Scala specification calls *constant expressions*
can be evaluated by the Scala compiler at compile time. The following kinds of
expressions are compile-time constants (see [section 6.24 of the Scala language specification](https://scala-lang.org/files/archive/spec/2.11/06-expressions.html#constant-expressions)):

1. Literals of primitive value classes ([Byte](https://www.scala-lang.org/api/current/index.html#scala.Byte), [Short](https://www.scala-lang.org/api/current/index.html#scala.Short), [Int](https://www.scala-lang.org/api/current/index.html#scala.Int), [Long](https://www.scala-lang.org/api/current/index.html#scala.Long), [Float](https://www.scala-lang.org/api/current/index.html#scala.Float), [Double](https://www.scala-lang.org/api/current/index.html#scala.Double), [Char](https://www.scala-lang.org/api/current/index.html#scala.Char), [Boolean](https://www.scala-lang.org/api/current/index.html#scala.Boolean) and [Unit](https://www.scala-lang.org/api/current/index.html#scala.Unit)) - represented directly as the corresponding type.

2. String literals - represented as instances of the string.

3. References to classes, typically constructed with [scala.Predef#classOf](https://www.scala-lang.org/api/current/index.html#scala.Predef$@classOf[T]:Class[T]) - represented as [types](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Types$Type.html).

4. References to Java enumeration values - represented as [symbols](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Symbols$Symbol.html).

Constant expressions are used to represent

- literals in abstract syntax trees (see `scala.reflect.api.Trees#Literal`), and
- literal arguments for Java class file annotations (see `scala.reflect.api.Annotations#LiteralArgument`).

Example:

    scala> Literal(Constant(5))
    val res6: reflect.runtime.universe.Literal = 5

The above expression creates an AST representing the integer literal `5` in
Scala source code.

`Constant` is an example of a "virtual case class", _i.e.,_ a class whose
instances can be constructed and matched against as if it were a case class.
Both types `Literal` and `LiteralArgument` have a `value` method returning the
compile-time constant underlying the literal.

Examples:

    Constant(true) match {
      case Constant(s: String)  => println("A string: " + s)
      case Constant(b: Boolean) => println("A Boolean value: " + b)
      case Constant(x)          => println("Something else: " + x)
    }
    assert(Constant(true).value == true)

Class references are represented as instances of
`scala.reflect.api.Types#Type`. Such a reference can be converted to a runtime
class using the `runtimeClass` method of a `RuntimeMirror` such as
`scala.reflect.runtime.currentMirror`. (This conversion from a type to a
runtime class is necessary, because when the Scala compiler processes a class
reference, the underlying runtime class might not yet have been compiled.)

Java enumeration value references are represented as symbols (instances of
`scala.reflect.api.Symbols#Symbol`), which on the JVM point to methods that
return the underlying enumeration values. A `RuntimeMirror` can be used to
inspect an underlying enumeration or to get the runtime value of a reference
to an enumeration.

Example:

    // Java source:
    enum JavaSimpleEnumeration { FOO, BAR }

    import java.lang.annotation.*;
    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.TYPE})
    public @interface JavaSimpleAnnotation {
      Class<?> classRef();
      JavaSimpleEnumeration enumRef();
    }

    @JavaSimpleAnnotation(
      classRef = JavaAnnottee.class,
      enumRef = JavaSimpleEnumeration.BAR
    )
    public class JavaAnnottee {}

    // Scala source:
    import scala.reflect.runtime.universe._
    import scala.reflect.runtime.{currentMirror => cm}

    object Test extends App {
      val jann = typeOf[JavaAnnottee].typeSymbol.annotations(0).javaArgs

      def jarg(name: String) = jann(TermName(name)) match {
        // Constant is always wrapped in a Literal or LiteralArgument tree node
        case LiteralArgument(ct: Constant) => value
        case _ => sys.error("Not a constant")
      }

      val classRef = jarg("classRef").value.asInstanceOf[Type]
      println(showRaw(classRef))         // TypeRef(ThisType(), JavaAnnottee, List())
      println(cm.runtimeClass(classRef)) // class JavaAnnottee

      val enumRef = jarg("enumRef").value.asInstanceOf[Symbol]
      println(enumRef)                   // value BAR

      val siblings = enumRef.owner.typeSignature.decls
      val enumValues = siblings.filter(sym => sym.isVal && sym.isPublic)
      println(enumValues)                // Scope {
                                         //   final val FOO: JavaSimpleEnumeration;
                                         //   final val BAR: JavaSimpleEnumeration
                                         // }

      val enumClass = cm.runtimeClass(enumRef.owner.asClass)
      val enumValue = enumClass.getDeclaredField(enumRef.name.toString).get(null)
      println(enumValue)                 // BAR
    }

## Printers

Utilities for nicely printing
[`Trees`](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Trees.html) and
[`Types`](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Types.html).

### Printing Trees

The method `show` displays the "prettified" representation of reflection
artifacts. This representation provides one with the desugared Java
representation of Scala code. For example:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> def tree = reify { final class C { def x = 2 } }.tree
    tree: scala.reflect.runtime.universe.Tree

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

The method `showRaw` displays the internal structure of a given reflection
object as a Scala abstract syntax tree (AST), the representation that the
Scala typechecker operates on.

Note that while this representation appears to generate correct trees that one
might think would be possible to use in a macro implementation, this is not
usually the case. Symbols aren't fully represented (only their names are).
Thus, this method is best-suited for use simply inspecting ASTs given some
valid Scala code.

    scala> showRaw(tree)
    res1: String = Block(List(
      ClassDef(Modifiers(FINAL), TypeName("C"), List(), Template(
        List(Ident(TypeName("AnyRef"))),
        emptyValDef,
        List(
          DefDef(Modifiers(), termNames.CONSTRUCTOR, List(), List(List()), TypeTree(),
            Block(List(
              Apply(Select(Super(This(typeNames.EMPTY), typeNames.EMPTY), termNames.CONSTRUCTOR), List())),
              Literal(Constant(())))),
          DefDef(Modifiers(), TermName("x"), List(), List(), TypeTree(),
            Literal(Constant(2))))))),
      Literal(Constant(())))

The method `showRaw` can also print `scala.reflect.api.Types` next to the artifacts being inspected.

    scala> import scala.tools.reflect.ToolBox // requires scala-compiler.jar
    import scala.tools.reflect.ToolBox

    scala> import scala.reflect.runtime.{currentMirror => cm}
    import scala.reflect.runtime.{currentMirror=>cm}

    scala> showRaw(cm.mkToolBox().typeCheck(tree), printTypes = true)
    res2: String = Block[1](List(
      ClassDef[2](Modifiers(FINAL), TypeName("C"), List(), Template[3](
        List(Ident[4](TypeName("AnyRef"))),
        emptyValDef,
        List(
          DefDef[2](Modifiers(), termNames.CONSTRUCTOR, List(), List(List()), TypeTree[3](),
            Block[1](List(
              Apply[4](Select[5](Super[6](This[3](TypeName("C")), typeNames.EMPTY), ...))),
              Literal[1](Constant(())))),
          DefDef[2](Modifiers(), TermName("x"), List(), List(), TypeTree[7](),
            Literal[8](Constant(2))))))),
      Literal[1](Constant(())))
    [1] TypeRef(ThisType(scala), scala.Unit, List())
    [2] NoType
    [3] TypeRef(NoPrefix, TypeName("C"), List())
    [4] TypeRef(ThisType(java.lang), java.lang.Object, List())
    [5] MethodType(List(), TypeRef(ThisType(java.lang), java.lang.Object, List()))
    [6] SuperType(ThisType(TypeName("C")), TypeRef(... java.lang.Object ...))
    [7] TypeRef(ThisType(scala), scala.Int, List())
    [8] ConstantType(Constant(2))

### Printing Types

The method `show` can be used to produce a *readable* string representation of a type:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> def tpe = typeOf[{ def x: Int; val y: List[Int] }]
    tpe: scala.reflect.runtime.universe.Type

    scala> show(tpe)
    res0: String = scala.AnyRef{def x: Int; val y: scala.List[Int]}

Like the method `showRaw` for `scala.reflect.api.Trees`, `showRaw` for
`scala.reflect.api.Types` provides a visualization of the Scala AST operated
on by the Scala typechecker.

    scala> showRaw(tpe)
    res1: String = RefinedType(
      List(TypeRef(ThisType(scala), TypeName("AnyRef"), List())),
      Scope(
        TermName("x"),
        TermName("y")))

The `showRaw` method also has named parameters `printIds` and `printKinds`,
both with default argument `false`. When passing `true` to these, `showRaw`
additionally shows the unique identifiers of symbols, as well as their kind
(package, type, method, getter, etc.).

    scala> showRaw(tpe, printIds = true, printKinds = true)
    res2: String = RefinedType(
      List(TypeRef(ThisType(scala#2043#PK), TypeName("AnyRef")#691#TPE, List())),
      Scope(
        TermName("x")#2540#METH,
        TermName("y")#2541#GET))

## Positions

Positions (instances of the
[Position](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Position.html) trait)
are used to track the origin of symbols and tree nodes. They are commonly used when
displaying warnings and errors, to indicate the incorrect point in the
program. Positions indicate a column and line in a source file (the offset
from the beginning of the source file is called its "point", which is
sometimes less convenient to use). They also carry the content of the line
they refer to. Not all trees or symbols have a position; a missing position is
indicated using the `NoPosition` object.

Positions can refer either to only a single character in a source file, or to
a *range*. In the latter case, a *range position* is used (positions that are
not range positions are also called *offset positions*). Range positions have
in addition `start` and `end` offsets. The `start` and `end` offsets can be
"focused" on using the `focusStart` and `focusEnd` methods which return
positions (when called on a position which is not a range position, they just
return `this`).

Positions can be compared using methods such as `precedes`, which holds if
both positions are defined (_i.e.,_ the position is not `NoPosition`) and the
end point of `this` position is not larger than the start point of the given
position. In addition, range positions can be tested for inclusion (using
method `includes`) and overlapping (using method `overlaps`).

Range positions are either *transparent* or *opaque* (not transparent). The
fact whether a range position is opaque or not has an impact on its permitted
use, because trees containing range positions must satisfy the following
invariants:

- A tree with an offset position never contains a child with a range position
- If the child of a tree with a range position also has a range position, then the child's range is contained in the parent's range.
- Opaque range positions of children of the same node are non-overlapping (this means their overlap is at most a single point).

Using the `makeTransparent` method, an opaque range position can be converted
to a transparent one; all other positions are returned unchanged.
