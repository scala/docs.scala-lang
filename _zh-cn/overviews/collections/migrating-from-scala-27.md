---
layout: multipage-overview
title: Scala 2.7迁移指南

discourse: false

partof: collections
overview-name: Collections

num: 18
language: zh-cn
---


现有应用中新旧Scala容器类型的移植基本上是自动的。只有几种情况需要特别注意。

Scala 2.7中容器的旧有功能基本上全部予以保留。某些功能被标记为deprecated，这意味着今后版本可能会删除它们。如果在Scala 2.8中使用这些方法，将会得到一个deprecation警告。在2.8下编译时，这些情况被视作迁移警告（migration warnings）。要得到完整的deprecation和迁移警告以及代码修改建议，请在编译时给Scala编译器scalac加上-deprecation和-Xmigration参数（注意，-Xmigration是扩展参数，因此以X开头）。你也可以将参数传给Scala REPL，从而在交互式环境中得到警告，例如：

    >scala -deprecation -Xmigration
    Welcome to Scala version 2.8.0.final
    键入表达式来运行
    键入 :help来看更多信息
    scala> val xs = List((1, 2), (3, 4))
    xs: List[(Int, Int)] = List((1, 2), (3, 4))
    scala> List.unzip(xs)
    <console>:7: warning: method unzip in object List is deprecated: use xs.unzip instead of List.unzip(xs)
           List.unzip(xs)
                ^
    res0: (List[Int], List[Int]) = (List(1, 3), List(2, 4))
    scala> xs.unzip
    res1: (List[Int], List[Int]) = (List(1, 3), List(2, 4))
    scala> val m = xs.toMap
    m: scala.collection.immutable.Map[Int, Int] = Map((1, 2), (3, 4))
    scala> m.keys
    <console>:8: warning: method keys in trait MapLike has changed semantics:
    As of 2.8 keys returns Iterable[A] rather than Iterator[A].
           m.keys
             ^
    res2: Iterable[Int] = Set(1, 3)

老版本的库中有两个部分被整个移除，所以在deprecation警告中看不到它们。

scala.collection.jcl包被移除了。这个包试图在Scala中模拟某些Java的容器，但是该包破坏了Scala的一些对称性。绝大多数人，当他们需要Java容器的时候，他们会直接选用java.util。  
Scala 2.8通过JavaConversions对象提供了自动的在Java和Scala容器类型间转换的机制，这一机制替代了老的jcl包。
各种投影操作被泛化整理成了视图。从实际情况来看，投影的用处并不大，因此受影响的代码应该不多。
所以，如果你的代码用了jcl包或者投影（projections），你将不得不进行一些小的修改。
