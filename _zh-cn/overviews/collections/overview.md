---
layout: multipage-overview
title: Mutable和Immutable集合
partof: collections
overview-name: Collections

num: 2
language: zh-cn
---


Scala 集合类系统地区分了可变的和不可变的集合。可变集合可以在适当的地方被更新或扩展。这意味着你可以修改，添加，移除一个集合的元素。而不可变集合类，相比之下，永远不会改变。不过，你仍然可以模拟添加，移除或更新操作。但是这些操作将在每一种情况下都返回一个新的集合，同时使原来的集合不发生改变。

所有的集合类都可以在包`scala.collection` 或`scala.collection.mutable`，`scala.collection.immutable`，`scala.collection.generic`中找到。客户端代码需要的大部分集合类都独立地存在于3种变体中，它们位于`scala.collection`, `scala.collection.immutable`, `scala.collection.mutable`包。每一种变体在可变性方面都有不同的特征。

`scala.collection.immutable`包是的集合类确保不被任何对象改变。例如一个集合创建之后将不会改变。因此，你可以相信一个事实，在不同的点访问同一个集合的值，你将总是得到相同的元素。。

`scala.collection.mutable`包的集合类则有一些操作可以修改集合。所以处理可变集合意味着你需要去理解哪些代码的修改会导致集合同时改变。

`scala.collection`包中的集合，既可以是可变的，也可以是不可变的。例如：[collection.IndexedSeq[T]](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/IndexedSeq.html)] 就是 [collection.immutable.IndexedSeq[T]](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/immutable/IndexedSeq.html) 和[collection.mutable.IndexedSeq[T]](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/mutable/IndexedSeq.html)这两类的超类。`scala.collection`包中的根集合类中定义了相同的接口作为不可变集合类，同时，`scala.collection.mutable`包中的可变集合类代表性的添加了一些有辅助作用的修改操作到这个immutable 接口。

根集合类与不可变集合类之间的区别是不可变集合类的客户端可以确保没有人可以修改集合。然而，根集合类的客户端仅保证不修改集合本身。即使这个集合类没有提供修改集合的静态操作，它仍然可能在运行时作为可变集合被其它客户端所修改。

默认情况下，Scala 一直采用不可变集合类。例如，如果你仅写了`Set` 而没有任何加前缀也没有从其它地方导入`Set`，你会得到一个不可变的`set`，另外如果你写迭代，你也会得到一个不可变的迭代集合类，这是由于这些类在从scala中导入的时候都是默认绑定的。为了得到可变的默认版本，你需要显式的声明`collection.mutable.Set`或`collection.mutable.Iterable`.

一个有用的约定，如果你想要同时使用可变和不可变集合类，只导入collection.mutable包即可。

	import scala.collection.mutable  //导入包scala.collection.mutable

然而，像没有前缀的Set这样的关键字， 仍然指的是一个不可变集合，然而`mutable.Set`指的是可变的副本（可变集合）。

集合树的最后一个包是`collection.generic`。这个包包含了集合的构建块。集合类延迟了`collection.generic`类中的部分操作实现，另一方面，集合框架的用户只需要在特殊情况下引用`collection.generic`。

为了方便和向后兼容性，一些导入类型在包scala中有别名，所以你能通过简单的名字使用它们而不需要import。这有一个例子是`List`类型，它可以用以下两种方法使用，如下：

    scala.collection.immutable.List // 这是它的定义位置
    scala.List //通过scala 包中的别名
    List // 因为scala._ 总是被自动导入。

其它类型的别名有： [Traversable](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/Traversable.html), [Iterable](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/Iterable.html), [Seq](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/Seq.html), [IndexedSeq](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/IndexedSeq.html), [Iterator](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/Iterator.html), [Stream](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/immutable/Stream.html), [Vector](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/immutable/Vector.html), [StringBuilder](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/mutable/StringBuilder.html), [Range](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/immutable/Range.html)。

下图显示了`scala.collection`包中所有的集合类。这些都是高级抽象类或特质，它们通常具备和不可变实现一样的可变实现。

[![General collection hierarchy][1]][1]

下图显示了`scala.collection.immutable`中所有的集合类。

[![Immutable collection hierarchy][2]][2]

下图显示了`scala.collection.mutable`中所有的集合类。

[![Mutable collection hierarchy][3]][3]

图例:

[![Graph legend][4]][4]

## 集合API概述

大多数重要的集合类都被展示在了上表。而且这些类有很多的共性。例如，每一种集合都能用相同的语法创建，写法是集合类名紧跟着元素。

    Traversable(1, 2, 3)
    Iterable("x", "y", "z")
    Map("x" -> 24, "y" -> 25, "z" -> 26)
    Set(Color.red, Color.green, Color.blue)
    SortedSet("hello", "world")
    Buffer(x, y, z)
    IndexedSeq(1.0, 2.0)
    LinearSeq(a, b, c)

相同的原则也应用于特殊的集合实现，例如：

    List(1, 2, 3)
    HashMap("x" -> 24, "y" -> 25, "z" -> 26)

所有这些集合类都通过相同的途径，用toString方法展示出来。  

Traversable类提供了所有集合支持的API，同时，对于特殊类型也是有意义的。例如，`Traversable`类的`map`方法会返回另一个`Traversable`对象作为结果，但是这个结果的类型在子类中被重写了。例如，在一个`List`上调用`map`会又生成一个`List`，在`Set`上调用会再生成一个`Set`，以此类推。  

    scala> List(1, 2, 3) map (_ + 1)
    res0: List[Int] = List(2, 3, 4)
    scala> Set(1, 2, 3) map (_ * 2)
    res0: Set[Int] = Set(2, 4, 6)

在集合类库中，这种在任何地方都实现了的行为，被称之为返回类型一致原则。  

大多数类在集合树中存在这于三种变体：root, mutable和immutable。唯一的例外是缓冲区特质，它仅在于mutable集合。  

下面我们将一个个的回顾这些类。


  [1]: /resources/images/tour/collections-diagram.svg
  [2]: /resources/images/tour/collections-immutable-diagram.svg
  [3]: /resources/images/tour/collections-mutable-diagram.svg
  [4]: /resources/images/tour/collections-legend-diagram.svg
