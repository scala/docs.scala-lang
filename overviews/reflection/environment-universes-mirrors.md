---
layout: overview-large
title: Environment, Universes, and Mirrors

disqus: true

partof: reflection
num: 2
outof: 7
languages: [ko, ja]
---

<span class="label important" style="float: right;">EXPERIMENTAL</span>

## Environment

The reflection environment differs based on whether the reflective task is to
be done at run time or at compile time. The distinction between an environment to be used at
run time or compile time is encapsulated in a so-called *universe*. Another
important aspect of the reflective environment is the set of entities that we
have reflective access to. This set of entities is determined by a so-called
*mirror*.

For example, the entities accessible through runtime
reflection are made available by a `ClassloaderMirror`. This mirror provides
only access to entities (packages, types, and members) loaded by a specific
classloader.

Mirrors not only determine the set of entities that can be accessed
reflectively. They also provide reflective operations to be performed on those
entities. For example, in runtime reflection an *invoker mirror* can be used
to invoke a method or constructor of a class.

## Universes

There are two principal
types of universes-- since there exists both runtime and compile-time
reflection capabilities, one must use the universe that corresponds to
whatever the task is at hand. Either:

- `scala.reflect.runtime.universe` for **runtime reflection**, or
- `scala.reflect.macros.Universe` for **compile-time reflection**.

A universe provides an interface to all the principal concepts used in
reflection, such as `Types`, `Trees`, and `Annotations`.

## Mirrors

All information provided by
reflection is made accessible through *mirrors*. Depending on
the type of information to be obtained, or the reflective action to be taken,
different flavors of mirrors must be used. *Classloader mirrors* can be used to obtain representations of types and
members. From a classloader mirror, it's possible to obtain more specialized *invoker mirrors* (the most commonly-used mirrors), which implement reflective
invocations, such as method or constructor calls and field accesses.

Summary:

- **"Classloader" mirrors**.
These mirrors translate names to symbols (via methods `staticClass`/`staticModule`/`staticPackage`).

- **"Invoker" mirrors**.
These mirrors implement reflective invocations (via methods `MethodMirror.apply`, `FieldMirror.get`, etc.). These "invoker" mirrors are the types of mirrors that are most commonly used.

### Runtime Mirrors

The entry point to mirrors for use at runtime is via `ru.runtimeMirror(<classloader>)`, where `ru` is `scala.reflect.runtime.universe`.

The result of a `scala.reflect.api.JavaMirrors#runtimeMirror` call is a classloader mirror, of type `scala.reflect.api.Mirrors#ReflectiveMirror`, which can load symbols by name.

A classloader mirror can create invoker mirrors (including `scala.reflect.api.Mirrors#InstanceMirror`, `scala.reflect.api.Mirrors#MethodMirror`, `scala.reflect.api.Mirrors#FieldMirror`, `scala.reflect.api.Mirrors#ClassMirror`, and `scala.reflect.api.Mirrors#ModuleMirror`).

Examples of how these two types of mirrors interact are available below.

### Types of Mirrors, Their Use Cases & Examples

A `ReflectiveMirror` is used for loading symbols by name, and as an entry point into invoker mirrors. Entry point: `val m = ru.runtimeMirror(<classloader>)`. Example:

    scala> val ru = scala.reflect.runtime.universe
    ru: scala.reflect.api.JavaUniverse = ...

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror ...

An `InstanceMirror` is used for creating invoker mirrors for methods and fields and for inner classes and inner objects (modules). Entry point: `val im = m.reflect(<value>)`. Example:

    scala> class C { def x = 2 }
    defined class C

    scala> val im = m.reflect(new C)
    im: scala.reflect.runtime.universe.InstanceMirror = instance mirror for C@3442299e

A `MethodMirror` is used for invoking instance methods (Scala only has instance methods-- methods of objects are instance methods of object instances, obtainable via `ModuleMirror.instance`). Entry point: `val mm = im.reflectMethod(<method symbol>)`. Example:

    scala> val methodX = ru.typeOf[C].declaration(ru.TermName("x")).asMethod
    methodX: scala.reflect.runtime.universe.MethodSymbol = method x

    scala> val mm = im.reflectMethod(methodX)
    mm: scala.reflect.runtime.universe.MethodMirror = method mirror for C.x: scala.Int (bound to C@3442299e)

    scala> mm()
    res0: Any = 2

A `FieldMirror` is used for getting/setting instance fields (like methods, Scala only has instance fields, see above). Entry point: `val fm = im.reflectField(<field or accessor symbol>)`. Example:

    scala> class C { val x = 2; var y = 3 }
    defined class C

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror ...

    scala> val im = m.reflect(new C)
    im: scala.reflect.runtime.universe.InstanceMirror = instance mirror for C@5f0c8ac1

    scala> val fieldX = ru.typeOf[C].declaration(ru.TermName("x")).asTerm.accessed.asTerm
    fieldX: scala.reflect.runtime.universe.TermSymbol = value x

    scala> val fmX = im.reflectField(fieldX)
    fmX: scala.reflect.runtime.universe.FieldMirror = field mirror for C.x (bound to C@5f0c8ac1)

    scala> fmX.get
    res0: Any = 2

    scala> fmX.set(3)

    scala> val fieldY = ru.typeOf[C].declaration(ru.TermName("y")).asTerm.accessed.asTerm
    fieldY: scala.reflect.runtime.universe.TermSymbol = variable y

    scala> val fmY = im.reflectField(fieldY)
    fmY: scala.reflect.runtime.universe.FieldMirror = field mirror for C.y (bound to C@5f0c8ac1)

    scala> fmY.get
    res1: Any = 3

    scala> fmY.set(4)

    scala> fmY.get
    res2: Any = 4

A `ClassMirror` is used for creating invoker mirrors for constructors. Entry points: for static classes `val cm1 = m.reflectClass(<class symbol>)`, for inner classes `val mm2 = im.reflectClass(<class symbol>)`. Example:

    scala> case class C(x: Int)
    defined class C

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror ...

    scala> val classC = ru.typeOf[C].typeSymbol.asClass
    classC: scala.reflect.runtime.universe.Symbol = class C

    scala> val cm = m.reflectClass(classC)
    cm: scala.reflect.runtime.universe.ClassMirror = class mirror for C (bound to null)

    scala> val ctorC = ru.typeOf[C].declaration(ru.nme.CONSTRUCTOR).asMethod
    ctorC: scala.reflect.runtime.universe.MethodSymbol = constructor C

    scala> val ctorm = cm.reflectConstructor(ctorC)
    ctorm: scala.reflect.runtime.universe.MethodMirror = constructor mirror for C.<init>(x: scala.Int): C (bound to null)

    scala> ctorm(2)
    res0: Any = C(2)

A `ModuleMirror` is used for accessing instances of singleton objects. Entry points: for static objects `val mm1 = m.reflectModule(<module symbol>)`, for inner objects `val mm2 = im.reflectModule(<module symbol>)`. Example:

    scala> object C { def x = 2 }
    defined module C

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror ...

    scala> val objectC = ru.typeOf[C.type].termSymbol.asModule
    objectC: scala.reflect.runtime.universe.ModuleSymbol = object C

    scala> val mm = m.reflectModule(objectC)
    mm: scala.reflect.runtime.universe.ModuleMirror = module mirror for C (bound to null)

    scala> val obj = mm.instance
    obj: Any = C$@1005ec04

### Compile-Time Mirrors

Compile-time mirrors make use of only classloader mirrors to load symbols by name.

The entry point to classloader mirrors is via `scala.reflect.macros.Context#mirror`. Typical methods which use classloader mirrors include `scala.reflect.api.Mirror#staticClass`, `scala.reflect.api.Mirror#staticModule`, and `scala.reflect.api.Mirror#staticPackage`. For example:

    import scala.reflect.macros.Context

    case class Location(filename: String, line: Int, column: Int)

    object Macros {
      def currentLocation: Location = macro impl

      def impl(c: Context): c.Expr[Location] = {
        import c.universe._
        val pos = c.macroApplication.pos
        val clsLocation = c.mirror.staticModule("Location") // get symbol of "Location" object
        c.Expr(Apply(Ident(clsLocation), List(Literal(Constant(pos.source.path)), Literal(Constant(pos.line)), Literal(Constant(pos.column)))))
      }
    }

*Of note:* There are several high-level alternatives that one can use to avoid having to manually lookup symbols. For example, `typeOf[Location.type].termSymbol` (or `typeOf[Location].typeSymbol` if we needed a `ClassSymbol`), which are typesafe since we don’t have to use strings to lookup the symbol.
