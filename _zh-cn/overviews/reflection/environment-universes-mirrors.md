---
layout: multipage-overview
title: Environment, Universes, and Mirrors
partof: reflection
overview-name: Reflection

num: 2
language: zh-cn
---

<span class="label important" style="float: right;">EXPERIMENTAL</span>

## Environment

反射环境根据反射工作是在运行时还是在编译时完成而有所不同。在运行时和编译时使用的环境之间的区别被封装在一个所谓的 *宇宙（universe）* 中。
反射环境的另一个重要方面是我们可以反射的访问一组实体。这组实体由所谓的 *镜像（mirror）* 决定。

例如，可通过运行时反射访问的实体由`ClassloaderMirror`提供。该镜像仅提供对由特定类加载器加载的实体（包，类型和成员）的访问。

镜像不仅可以确定反射访问的实体集。它们还提供对这些实体执行的反射操作。例如，在运行时反射中，可以使用*调用者镜像*（invoker mirror）来调用类的方法或构造函数。

## Universes

宇宙有两种主要类型 - 由于同时具有运行时和编译时反射功能，一个人必须使用与即将完成的工作相对应的宇宙。二者之一：

- `scala.reflect.runtime.universe` 用于 **运行时反射**，或者
- `scala.reflect.macros.Universe` 用于 **编译时反射**。

一个宇宙提供了反射中使用的所有主要概念的接口，例如类型（`Types`），树（`Trees`）和注解（`Annotations`）。

## Mirrors

反射提供的所有信息都可以通过*镜像*访问。根据要获得的信息类型或要采取的反射动作，必须使用不同类型的镜像。*类加载器镜像*可用于获取类型和成员的表示。
从类加载器镜像中，可以获得更专门的*调用者*镜像（最常用的镜像），这些镜像实现了反射调用，例如方法或构造函数调用以及字段访问。

总结：

- **"类加载器" 镜像**。这些镜像将名称转换为符号 (通过方法 `staticClass`/`staticModule`/`staticPackage`)。

- **"调用者" 镜像**。这些镜像实现反射调用（通过方法 `MethodMirror.apply`，`FieldMirror.get`，等等。）。这些"调用者"镜像是最常用的镜像类型。

### Runtime Mirrors

在运行时使用的镜像的入口点是通过`ru.runtimeMirror(<classloader>)`，其中`ru`是`scala.reflect.runtime.universe`。

一个`scala.reflect.api.JavaMirrors＃runtimeMirror`的调用结果是一个类型为`scala.reflect.api.Mirrors＃ReflectiveMirror`的类加载器镜像，它可以按名称加载符号。

一个类加载器镜像可以创建多个调用者镜像（包括`scala.reflect.api.Mirrors#InstanceMirror`，`scala.reflect.api.Mirrors#MethodMirror`，`scala.reflect.api.Mirrors#FieldMirror`，`scala.reflect.api.Mirrors#ClassMirror`，和`scala.reflect.api.Mirrors#ModuleMirror`）。

下面提供了这两种类型的反射镜像如何相互作用的示例。

### Types of Mirrors, Their Use Cases & Examples

`ReflectiveMirror`用于按名称加载符号，并用作调用者镜像的入口。入口点：`val m = ru.runtimeMirror(<classloader>)`。例如：

    scala> val ru = scala.reflect.runtime.universe
    ru: scala.reflect.api.JavaUniverse = ...

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror ...

`InstanceMirror`用于为方法和字段以及内部类和内部对象（模块）创建调用者镜像。入口点：`val im = m.reflect(<value>)`。例如：

    scala> class C { def x = 2 }
    defined class C

    scala> val im = m.reflect(new C)
    im: scala.reflect.runtime.universe.InstanceMirror = instance mirror for C@3442299e

`MethodMirror`用于调用实例方法（Scala仅具有实例方法-对象的方法是对象实例的实例方法，可通过`ModuleMirror.instance`获得）。入口点：`val mm = im.reflectMethod(<method symbol>)`）。例如：

    scala> val methodX = ru.typeOf[C].decl(ru.TermName("x")).asMethod
    methodX: scala.reflect.runtime.universe.MethodSymbol = method x

    scala> val mm = im.reflectMethod(methodX)
    mm: scala.reflect.runtime.universe.MethodMirror = method mirror for C.x: scala.Int (bound to C@3442299e)

    scala> mm()
    res0: Any = 2

`FieldMirror`用于获取/设置实例字段（与方法类似，Scala仅具有实例字段，请参见上文）。入口点：`val fm = im.reflectField(<field or accessor symbol>)`。例如：

    scala> class C { val x = 2; var y = 3 }
    defined class C

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror ...

    scala> val im = m.reflect(new C)
    im: scala.reflect.runtime.universe.InstanceMirror = instance mirror for C@5f0c8ac1

    scala> val fieldX = ru.typeOf[C].decl(ru.TermName("x")).asTerm.accessed.asTerm
    fieldX: scala.reflect.runtime.universe.TermSymbol = value x

    scala> val fmX = im.reflectField(fieldX)
    fmX: scala.reflect.runtime.universe.FieldMirror = field mirror for C.x (bound to C@5f0c8ac1)

    scala> fmX.get
    res0: Any = 2

    scala> fmX.set(3)

    scala> val fieldY = ru.typeOf[C].decl(ru.TermName("y")).asTerm.accessed.asTerm
    fieldY: scala.reflect.runtime.universe.TermSymbol = variable y

    scala> val fmY = im.reflectField(fieldY)
    fmY: scala.reflect.runtime.universe.FieldMirror = field mirror for C.y (bound to C@5f0c8ac1)

    scala> fmY.get
    res1: Any = 3

    scala> fmY.set(4)

    scala> fmY.get
    res2: Any = 4
    
`ClassMirror`用于为构造函数创建调用者镜像。入口点：对于静态类`val cm1 = m.reflectClass(<class symbol>)`，对于内部类`val mm2 = im.reflectClass(<class symbol>)`。例如：

    scala> case class C(x: Int)
    defined class C

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror ...

    scala> val classC = ru.typeOf[C].typeSymbol.asClass
    classC: scala.reflect.runtime.universe.Symbol = class C

    scala> val cm = m.reflectClass(classC)
    cm: scala.reflect.runtime.universe.ClassMirror = class mirror for C (bound to null)

    scala> val ctorC = ru.typeOf[C].decl(ru.termNames.CONSTRUCTOR).asMethod
    ctorC: scala.reflect.runtime.universe.MethodSymbol = constructor C

    scala> val ctorm = cm.reflectConstructor(ctorC)
    ctorm: scala.reflect.runtime.universe.MethodMirror = constructor mirror for C.<init>(x: scala.Int): C (bound to null)

    scala> ctorm(2)
    res0: Any = C(2)

`ModuleMirror`用于访问单例对象的实例。入口点：对于静态对象`val mm1 = m.reflectModule(<module symbol>)`，对于内部对象`val mm2 = im.reflectModule(<module symbol>)`。例如：

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

编译时镜像仅使用类加载器镜像来按名称加载符号。

类加载器镜像的入口点通过`scala.reflect.macros.Context＃mirror`。使用类加载器镜像的典型方法包括`scala.reflect.api.Mirror＃staticClass`，`scala.reflect.api.Mirror＃staticModule`和`scala.reflect.api.Mirror＃staticPackage`。例如：

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

注意：有几种高级替代方法，可以避免必须手动查找符号。例如，`typeOf[Location.type].termSymbol`（如果需要`ClassSymbol`，则为`typeOf[Location].typeSymbol`），因为我们不必使用字符串来查找符号，所以它们是类型安全的。