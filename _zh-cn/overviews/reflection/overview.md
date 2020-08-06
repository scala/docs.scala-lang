---
layout: multipage-overview
title: 概览

partof: reflection
overview-name: Reflection

num: 1
language: zh-cn

permalink: /zh-cn/overviews/reflection/:title.html
---

<span class="label important" style="float: right;">EXPERIMENTAL</span>

**Heather Miller, Eugene Burmako, Philipp Haller**

*反射(Reflection)*是指程序在运行过程中可以解析并甚至修改自身的一种能力。
在横跨面向对象、函数式编程以及逻辑编程范式方面有着悠久的历史。
虽然一些编程语言在设计之初就引入了反射作为指导原则，但是也有一些编程语言是随着时间演化逐渐引入了反射这一能力。

反射就是在程序运行中，将程序中隐式元素具体化(比如，使之显式化)的能力。
这些隐式元素可以是静态编程中的元素，比如类、方法、或表达式。
也可以是动态的元素，比如当前正在执行的[计算续体](https://zh.wikipedia.org/wiki/%E8%AE%A1%E7%AE%97%E7%BB%AD%E4%BD%93)或方法调用和访问字段这种正在执行的事件。
一般根据在编译阶段执行反射还是在运行阶段执行反射来区分反射的类型。
在程序编译期的反射是用于开发转换器和生成器时的好办法。
在程序运行器的反射常用于调整语言语义或用于支持软件组件之间的后期绑定。

Scala 2.10版本以前一直没有反射功能。
相应的替代品是借用了一部分Java的反射API实现了动态类型检查和对象成员的访问。
然而很多Scala特有元素单用Java反射是无效的，反射操作只能暴露出Java元素以及类型。
另外，使用Java反射也不能覆盖到运行时环境的类型信息，且对Scala中的泛型类型也存在限制。

在Scala 2.10版本中引入了一个全新的反射库，不仅弥补了原使用Java方式无法在Scala特定类型和泛型类型上进行反射操作的缺陷，而且还为Scala添加了一个功能更强大的通用反射工具箱。
伴随着提供针对Scala类型和泛型全功能覆盖的运行时反射机制，Scala 2.10还提供了[宏](https://docs.scala-lang.org/overviews/macros/overview.html)形式的编译时反射功能，以及可以将Scala表达式修整改写后添入抽象语法树的能力。


## 1. 运行时反射

什么是运行时反射呢？就是指在程序运行时，给定某个类型或某些对象的实例，反射可以做到：

- 解析包括泛型在内的各种对象的类型
- 能去实例化一个对象
- 能去访问或调用对象中的成员

针对上面描述，下文中我们分别举例说明。

### 1.1 举例说明

#### 1.1.1 解析运行时的类型 (包括运行时的泛型)

和其它的JVM系语言一样，Scala的类型在编译阶段会进行类型擦除（比如泛型信息擦除）。
这意味着如果想解析某个实例运行时类型，那些Scala编译器在编译阶段所产生的全部类型信息则不一定能访问到了。

`类型标签(TypeTag)`可以理解为将编译时的类型信息全部带到运行时的一个对象。
不过需要注意的是，一般`类型标签`都是由编译器生成。
有隐式参数或`类型标签`与上下文绑定时被用到了，都会触发编译器生成类型标签。
这意味着通常只能在用隐式参数或上下文绑定的地方获得`类型标签`。

举个上下文边界的例子：

```scala
scala> import scala.reflect.runtime.{universe => ru}
import scala.reflect.runtime.{universe=>ru}

scala> val l = List(1,2,3)
l: List[Int] = List(1, 2, 3)

scala> def getTypeTag[T: ru.TypeTag](obj: T) = ru.typeTag[T]
getTypeTag: [T](obj: T)(implicit evidence$1: reflect.runtime.universe.TypeTag[T])reflect.runtime.universe.TypeTag[T]

scala> val theType = getTypeTag(l).tpe
theType: ru.Type = List[Int]
```

在上面的例子中，我们首先引入了`scala.reflect.runtime.universe`（通常用这个包就是想用`类型标签`），接着我们创建了一个`List[Int]`叫`l`。然后我们定义了一个`getTypeTag`方法，其中包含类型参数`T`。这个`T`就是一个上下文绑定的参数。（如REPL中所示，这个`T`等同于同时定义了一个隐式声明的`evidence`，以此为据让编译器为`T`生成一个`类型标签`）。最终我们用`l`作为参数传入该方法，然后调用`tpe`返回了`类型标签`所包含的类型。
最终我们获得了一个正确完整的类型（包含List的具体类型参数）—— `List[Int]`。

一旦我们获得了所需的`类型`实例，我们就可以将它解析出来，例如：

```scala
scala> val decls = theType.decls.take(10)
decls: Iterable[ru.Symbol] = List(constructor List, method companion, method isEmpty, method head, method tail, method ::, method :::, method reverse_:::, method mapConserve, method ++)
```

#### 1.1.2 运行时实例化一个类型

通过反射获得的类型，可以通过使用适当的“调用器”镜像调用它们的构造函数来实例化（镜像`mirros`的概念在[后续文档中说明](https://docs.scala-lang.org/overviews/reflection/overview.html#mirrors)）。
让我们通过一个REPL的示例说明：


```scala
scala> case class Person(name: String)
defined class Person

scala> val m = ru.runtimeMirror(getClass.getClassLoader)
m: scala.reflect.runtime.universe.Mirror = JavaMirror with ...
```

第一步我们获得一个镜像`m`，包括`Person`类在内的所有类和类型都被加载到当前的`classloader`。

```scala
scala> val classPerson = ru.typeOf[Person].typeSymbol.asClass
classPerson: scala.reflect.runtime.universe.ClassSymbol = class Person

scala> val cm = m.reflectClass(classPerson)
cm: scala.reflect.runtime.universe.ClassMirror = class mirror for Person (bound to null)
```

第二步针对`Person`类使用`reflectClass`方法获得一个`ClassMirror`。
`ClassMirror`提供了访问`class Person`构造器的能力。

```scala
scala> val ctor = ru.typeOf[Person].decl(ru.termNames.CONSTRUCTOR).asMethod
ctor: scala.reflect.runtime.universe.MethodSymbol = constructor Person
```

`Person`构造器方法的标识(`MethodSymbol`)只能在 `runtime universe`的`ru`中使用`Person`类型的声明获取.

```scala
scala> val ctorm = cm.reflectConstructor(ctor)
ctorm: scala.reflect.runtime.universe.MethodMirror = constructor mirror for Person.<init>(name: String): Person (bound to null)

scala> val p = ctorm("Mike")
p: Any = Person(Mike)
```

#### 1.1.3 访问和调用运行时类型的成员

通常，想访问运行时类型的成员主要是用到”调用器“类似的`镜像`的方式。
让我们通过一个REPL的示例说明：

```scala
scala> case class Purchase(name: String, orderNumber: Int, var shipped: Boolean)
defined class Purchase

scala> val p = Purchase("Jeff Lebowski", 23819, false)
p: Purchase = Purchase(Jeff Lebowski,23819,false)
```

本例中，我们将尝试反射的方式获取并设置`Purchase p`中的`shipped`字段。

```scala
scala> import scala.reflect.runtime.{universe => ru}
import scala.reflect.runtime.{universe=>ru}

scala> val m = ru.runtimeMirror(p.getClass.getClassLoader)
m: scala.reflect.runtime.universe.Mirror = JavaMirror with ...
```

同上面示例一样，我们先获取一个镜像`m`，用于在`classloader`内加装好所有的类和类型，其中包含`p (Purchase)`类，我们用`m`去访问其成员`shipped`。

```scala
scala> val shippingTermSymb = ru.typeOf[Purchase].decl(ru.TermName("shipped")).asTerm
shippingTermSymb: scala.reflect.runtime.universe.TermSymbol = method shipped
```

通过`TermSymbol`(一种`Symbol`符号类型)去查询`shipped`字段声明。
稍后，我们将需要使用此`Symbol`获取一个镜像，该镜像使我们可以访问所指向实例中字段的值。

```scala
scala> val im = m.reflect(p)
im: scala.reflect.runtime.universe.InstanceMirror = instance mirror for Purchase(Jeff Lebowski,23819,false)

scala> val shippingFieldMirror = im.reflectField(shippingTermSymb)
shippingFieldMirror: scala.reflect.runtime.universe.FieldMirror = field mirror for Purchase.shipped (bound to Purchase(Jeff Lebowski,23819,false))
```

上面这段代码中，`p`的实例镜像`im`是为了访问该实例中成员`shipped`的所要用到的反射镜像。
通过实例镜像，我们可以将表示`p`类型字段声明的意思的`TermSymbol`对应到`FieldMirror`。

`FieldMirror`就是代表着当前我们指定的想反射操作的字段，我们可以使用`get`和`set`方法去获取/设置对应实例里的`shipped`成员。
此处先将`shipped`的状态设置为`true`。

```scala
scala> shippingFieldMirror.get
res7: Any = false

scala> shippingFieldMirror.set(true)

scala> shippingFieldMirror.get
res9: Any = true
```

### 1.2 对比Java运行时类和Scala运行时类型

如果你已经熟悉Java中反射运行中的类实例，或许已经注意到我们在Scala中使用运行时类型做为相应的替代品。

下面REPL示例了一种非常简单的使用场景，使用Java去反射Scala类可能会返回奇怪的结果。

首先，我们定义了一个带着抽象类型`T`的`E`类。然后又有两个继承了E的子类`C`和`D`。 

```scala
scala> class E {
     |   type T
     |   val x: Option[T] = None
     | }
defined class E

scala> class C extends E
defined class C

scala> class D extends C
defined class D
```

然后，分别创建`C`和`D`的实例，同时指给成员`T`具体类型，均声明为`String`。

```scala
scala> val c = new C { type T = String }
c: C{type T = String} = $anon$1@7113bc51

scala> val d = new D { type T = String }
d: D{type T = String} = $anon$1@46364879
```

现在我们用Java的反射方法`getClass`和`isAssignableFrom`去获取代表`c`和`d`运行时类的`java.lang.Class`实例，
然后去测试看看`d`的运行时类是不是一个`c`的运行时类的子类形式存在。

```scala
scala> c.getClass.isAssignableFrom(d.getClass)
res6: Boolean = false
```

我们明明看到`D`是继承于`C`的，但是执行结果有些意外。
在尝试执行如此简单的运行时类型解析过程中，对于”d是否为c的子类“这一问题本来默认预期是得到`true`。
然而如你所见，当`c`和`d`实例化后Scala编译器实际上分别为它们创建了各自的匿名子类。

事实上，Scala编译器需要将Scala特有的语言功能转译成同功能的Java字节码才能上JVM去执行。
因此，Scala编译器经常会创建运行时使用的合成类（比如自动生产类）来代替用户自定义类。
在使用Java反射功能与Scala一些功能结合时候经常会发生这种自动合成的情况，比如闭包、类型成员、类型优化，局部类等。

为了避开上述情况，我们改用Scala反射去获取Scala对象在运行时的精确的类型信息。
这样的话就可以做到让Scala运行时类携带着编译阶段的所有类型，避免了编译时和运行时的类型不匹配问题。

接下来我们定义了一个使用Scala反射方式的方法去判断两个运行时类型的关系，检查他们之间是否是子类型的关系。
如果第一个参数的类型是第二个参数的子类型，那就返回`true`：

```scala
scala> import scala.reflect.runtime.{universe => ru}
import scala.reflect.runtime.{universe=>ru}

scala> def m[T: ru.TypeTag, S: ru.TypeTag](x: T, y: S): Boolean = {
    |   val leftTag = ru.typeTag[T]
    |   val rightTag = ru.typeTag[S]
    |   leftTag.tpe <:< rightTag.tpe
    | }
m: [T, S](x: T, y: S)(implicit evidence$1: scala.reflect.runtime.universe.TypeTag[T], implicit evidence$2: scala.reflect.runtime.universe.TypeTag[S])Boolean

scala> m(d, c)
res9: Boolean = true
```

`d`的运行时类型确实是`c`的运行时类型的子类型，符合预期。

## 2. 编译阶段反射

Scala反射实现了允许在编译阶段就对程序进行修改的一种元编程形式。
编译阶段反射通过宏的形式实现，宏提供了在编译时候对抽象语法数修改的能力。

一个比较有趣的地方是，宏和Scala运行时反射都是通过包`scala.reflect.api`用相同的API实现。
这样就可以用同一套代码去实现宏和运行时反射。

需要注意的是[关于宏的指南](https://docs.scala-lang.org/overviews/macros/overview.html)中侧重于讲解其特性。本文档侧重于反射API方面。本文档中针对宏与反射相关概念有所直述，比如在抽象语法树部分有许多关于[Symbols, Trees, and Types](https://docs.scala-lang.org/overviews/reflection/symbols-trees-types.html)的概念有细讲。

## 3. 反射环境

所有的反射任务都需要设置一个相应的反射环境。
这个反射环境根据是在运行时环境完成反射任务还是在编译时环境完成反射任务而有所区别。
这个区别被封装于所谓的`universe`中。
反射环境的另一个重要方面就是我们可以访问想反射的那组实体，
这组实体由所谓的镜像`mirros`去确定。

镜像不仅决定反射化操作有哪些实体要被访问到，而且它还提供了反射操作去执行那些实体。
比如在运行时反射过程中可以调用镜像去操作类中一个方法或构造器。

### 3.1 Universes

`Universe`是Scala反射的切入点。

`universe`提供了使用反射所关联的很多核心概念，比如`Types`，`Trees`，以及`Annotations`。
更多细节请参阅指南中[Universes](https://docs.scala-lang.org/overviews/reflection/environment-universes-mirrors.html)部分，或者看`scala.reflect.api`包的[Universes API文档](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Universe.html)。

本指南中提供了大多数情况下Scala反射要用到的部分，一般在使用运行时反射的场景下，直接导入所有`universe`成员去用即可：

```scala
import scala.reflect.runtime.universe._
```

### 3.2 Mirrors

`Mirrors`(镜像) 是Scala反射中的核心概念。
反射所能提供的信息都是通过镜像去访问的。
根据不同的类型信息或不同的反射操作，必须要使用不同类型的镜像。

更多细节请参阅指南中[Mirros](https://docs.scala-lang.org/overviews/reflection/environment-universes-mirrors.html)部分，或者看`scala.reflect.api`包的[Mirrors API文档](https://www.scala-lang.org/api/current/scala-reflect/scala/reflect/api/Mirrors.html)。
