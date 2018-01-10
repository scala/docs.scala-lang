---
layout: multipage-overview
title: 等价性

discourse: false

partof: collections
overview-name: Collections

num: 13
language: zh-cn
---


容器库有标准的等价性和散列法。这个想法的第一步是将容器划分为集合，映射和序列。不同范畴的容器总是不相等的。例如，即使包含相同的元素，`Set(1, 2, 3)` 与 `List(1, 2, 3)` 不等价。另一方面，在同一范畴下的容器是相等的，当且仅当它们具有相同的元素（对于序列：元素要相同，顺序要相同）。例如`List(1, 2, 3) == Vector(1, 2, 3)`， `HashSet(1, 2) == TreeSet(2, 1)`。

一个容器可变与否对等价性校验没有任何影响。对于一个可变容器，在执行等价性测试的同时，你可以简单地思考下它的当前元素。意思是，一个可变容器可能在不同时间等价于不同容器，这是由增加或移除了哪些元素所决定的。当你使用可变容器作为一个hashmap的键时，这将是一个潜在的陷阱。例如：

    scala> import collection.mutable.{HashMap, ArrayBuffer}
    import collection.mutable.{HashMap, ArrayBuffer}
    scala> val buf = ArrayBuffer(1, 2, 3)
    buf: scala.collection.mutable.ArrayBuffer[Int] =
    ArrayBuffer(1, 2, 3)
    scala> val map = HashMap(buf -> 3)
    map: scala.collection.mutable.HashMap[scala.collection。
    mutable.ArrayBuffer[Int],Int] = Map((ArrayBuffer(1, 2, 3),3))
    scala> map(buf)
    res13: Int = 3
    scala> buf(0) += 1
    scala> map(buf)
    java.util.NoSuchElementException: key not found:
    ArrayBuffer(2, 2, 3)

在这个例子中，由于数组xs的散列码已经在倒数第二行发生了改变，最后一行的选择操作将很有可能失败。因此，基于散列码的查找函数将会查找另一个位置，而不是xs所存储的位置。
