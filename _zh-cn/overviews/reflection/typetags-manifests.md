---
layout: multipage-overview
title: TypeTags 和 Manifests
partof: reflection
overview-name: Reflection

num: 5
language: zh-cn
---

与其他JVM语言一样，Scala的类型在运行时被擦除。这意味着，如果要检查某个实例的运行时类型，则可能无法访问Scala编译器在编译时可用的所有类型信息。

如`scala.reflect.Manifest`，`TypeTags`可以看作是将编译时可用的所有类型信息携带到运行时的对象。
例如，`TypeTag[T]`封装了某个编译时类型`T`的运行时类型表示。但是请注意，`TypeTag`应该被认为是对2.10之前的`Manifest`概念的更丰富的替代品，后者还与Scala反射完全集成。

有三种不同类型的类型标记：

1. `scala.reflect.api.TypeTags#TypeTag`。
Scala类型的完整类型描述符。例如，`TypeTag[List[String]]`包含所有类型信息，在本例中是类型`scala.List[String]`。

2. `scala.reflect.ClassTag`。
Scala类型的部分类型描述符。例如，`ClassTag[List[String]]`只包含已擦除、关于类的类型信息，在本例中为`scala.collection.immutable.List`。`ClassTag`只提供对类型的运行时类的访问。其类似于`scala.reflect.ClassManifest`。

3. `scala.reflect.api.TypeTags#WeakTypeTag`。
抽象类型的类型描述符（参见下面相应的小节）。

## 获取`TypeTag`

与`Manifest`类似，`TypeTag`总是由编译器生成，可以通过三种方式获得。

### 通过方法`typeTag`、`classTag`或`weakTypeTag`

通过使用通过`Universe`提供的方法`typeTag`，就可以直接获得特定类型的`TypeTag`。

例如，要获取表示`Int`的`TypeTag`，我们可以执行以下操作：

    import scala.reflect.runtime.universe._
    val tt = typeTag[Int]

或者类似地，要获得表示`String`的`ClassTag`，我们可以执行以下操作：

    import scala.reflect._
    val ct = classTag[String]

这些方法中的每个方法都为给定的类型参数`T`构造一个`TypeTag[T]`或`ClassTag[T]`。

### 使用类型为`TypeTag[T]`、`ClassTag[T]`或`WeakTypeTag[T]`的隐式参数
    
与`Manifest`一样，实际上可以 _请求_ 编译器生成`TypeTag`。这只需指定一个类型为`TypeTag[T]`的隐式 _证据_ 参数即可完成。如果编译器在隐式搜索期间找不到匹配的隐式值，它将自动生成一个`TypeTag[T]`。

_注意_：这通常是通过在方法上使用隐式参数来实现的，并且只能在类上。

例如，我们可以编写一个方法，它可以接受任意对象，并且使用`TypeTag`打印有关该对象的类型参数的信息：

    import scala.reflect.runtime.universe._

    def paramInfo[T](x: T)(implicit tag: TypeTag[T]): Unit = {
      val targs = tag.tpe match { case TypeRef(_, _, args) => args }
      println(s"type of $x has type arguments $targs")
    }

这里，我们在`T`上编写了一个参数化的泛型方法`paramInfo`，并提供了一个隐式参数`(implicit tag: TypeTag[T])`。
那我们就可以使用`TypeTag`的方法`tpe`直接访问`tag`表示的类型（`type`类型）。

然后，我们可以使用方法`paramInfo`，如下所示：

    scala> paramInfo(42)
    type of 42 has type arguments List()

    scala> paramInfo(List(1, 2))
    type of List(1, 2) has type arguments List(Int)

### 使用类型参数的上下文绑定

要实现与上述完全相同的效果，一种不太冗长的方法是在类型参数上使用上下文绑定。不需要提供单独的隐式参数，只需在类型参数列表中包含`TypeTag`，如下所示：

    def myMethod[T: TypeTag] = ...

给定上下文绑定的`[T: TypeTag]`，编译器只需生成类型为`TypeTag[T]`的隐式参数，这将重写方法以进行查找，就像上一节中使用隐式参数的示例一样。

上面重写为使用上下文边界的示例如下：


    import scala.reflect.runtime.universe._

    def paramInfo[T: TypeTag](x: T): Unit = {
      val targs = typeOf[T] match { case TypeRef(_, _, args) => args }
      println(s"type of $x has type arguments $targs")
    }

    scala> paramInfo(42)
    type of 42 has type arguments List()

    scala> paramInfo(List(1, 2))
    type of List(1, 2) has type arguments List(Int)

## WeakTypeTags

`WeakTypeTag[T]`泛化了`TypeTag`（意思是`TypeTag`是继承自`WeakTypeTag`的），`WeakTypeTag`与普通的`TypeTag`不同，

其类型表示的组件可以是对类型参数或抽象类型的引用。但是，`WeakTypeTag[T]`试图尽可能的具体（意思是如果都存在则优先更加具体的类型(参数)），也就是说，如果类型标记可用于被引用的类型参数或抽象类型，则它们用于将具体类型嵌入到`WeakTypeTag[T]`中。

继续上面的例子：

    def weakParamInfo[T](x: T)(implicit tag: WeakTypeTag[T]): Unit = {
      val targs = tag.tpe match { case TypeRef(_, _, args) => args }
      println(s"type of $x has type arguments $targs")
    }

    scala> def foo[T] = weakParamInfo(List[T]())
    foo: [T]=> Unit

    scala> foo[Int]
    type of List() has type arguments List(T)

## TypeTags and Manifests

`TypeTag`可以大致对应2.10之前的`scala.reflect.Manifest`、 虽然`scala.reflect.ClassTag`对应于`scala.reflect.ClassManifest`而`scala.reflect.api.TypeTags#TypeTag`主要对应于`scala.reflect.Manifest`，但其他2.10版之前的`Manifest`类型与2.10版的`Tag`类型没有直接对应关系。

- **不支持scala.reflect.OptManifest。**
这是因为`Tag`可以具体化任意类型，所以它们总是可用的。

- **没有对应的scala.reflect.AnyValManifest。**
取而代之的是，可以将其`Tag`与基本`Tag`之一（在相应的伴随对象中定义）进行比较，以找出其是否代表原始值类。此外，可以简单地使用`<tag>.tpe.typeSymbol.isPrimitiveValueClass`。

- **无法替换Manifest伴随对象中定义的工厂方法。**
取而代之的是，可以使用Java（用于类）和Scala（用于类型）提供的反射API生成相应的类型。

- **不支持某些manifest操作（即`<:<`, `>:>`和`typeArguments`）。**
取而代之的是，可以使用Java（用于类）和Scala（用于类型）提供的反射API。

在Scala 2.10中，不建议使用`scala.reflect.ClassManifest`，而推荐使用`TypeTag`和`ClassTag`，并且计划在即将发布的版本中弃用`scala.reflect.Manifest`。因此，建议迁移任何基于`Manifest`的API以使用`Tag`。
