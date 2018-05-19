---
layout: multipage-overview
title: Trait Iterable

discourse: false

partof: collections
overview-name: Collections

num: 4
language: zh-cn
---

容器（collection）结构的上层还有另一个trait。这个trait里所有方法的定义都基于一个抽象方法，迭代器（iterator，会逐一的产生集合的所有元素）。从Traversable trait里继承来的foreach方法在这里也是利用iterator实现。下面是具体的实现。

    def foreach[U](f: Elem => U): Unit = {
      val it = iterator
      while (it.hasNext) f(it.next())
    }

许多Iterable 的子类覆写了Iteable的foreach标准实现，因为它们能提供更高效的实现。记住，foreach是Traversable所有操作的基础，所以它的性能表现很关键。

Iterable有两个方法返回迭代器：grouped和sliding。然而，这些迭代器返回的不是单个元素，而是原容器（collection）元素的全部子序列。这些最大的子序列作为参数传给这些方法。grouped方法返回元素的增量分块，sliding方法生成一个滑动元素的窗口。两者之间的差异通过REPL的作用能够清楚看出。

    scala> val xs = List(1, 2, 3, 4, 5)
    xs: List[Int] = List(1, 2, 3, 4, 5)
    scala> val git = xs grouped 3
    git: Iterator[List[Int]] = non-empty iterator
    scala> git.next()
    res3: List[Int] = List(1, 2, 3)
    scala> git.next()
    res4: List[Int] = List(4, 5)
    scala> val sit = xs sliding 3
    sit: Iterator[List[Int]] = non-empty iterator
    scala> sit.next()
    res5: List[Int] = List(1, 2, 3)
    scala> sit.next()
    res6: List[Int] = List(2, 3, 4)
    scala> sit.next()
    res7: List[Int] = List(3, 4, 5)

当只有一个迭代器可用时，Trait Iterable增加了一些其他方法，为了能被有效的实现的可遍历的情况。这些方法总结在下面的表中。

## Trait Iterable操作

| WHAT IT IS | WHAT IT DOES |
|--------------|--------------|
| **抽象方法：**	 |             |
| xs.iterator | xs迭代器生成的每一个元素，以相同的顺序就像foreach一样遍历元素。 |
| **其他迭代器：**	 |             |
| xs grouped size | 一个迭代器生成一个固定大小的容器（collection）块。 |
| xs sliding size | 一个迭代器生成一个固定大小的滑动窗口作为容器（collection）的元素。 |
| **子容器（Subcollection）：**	 |               |
| xs takeRight n | 一个容器（collection）由xs的最后n个元素组成（或，若定义的元素是无序，则由任意的n个元素组成）。 |
| xs dropRight n | 一个容器（collection）由除了xs 被取走的（执行过takeRight （）方法）n个元素外的其余元素组成。 |
| **拉链方法（Zippers）：**	 |             |
| xs zip ys | 把一对容器 xs和ys的包含的元素合成到一个iterabale。 |
| xs zipAll (ys, x, y) | 一对容器 xs 和ys的相应的元素合并到一个iterable ，实现方式是通过附加的元素x或y，把短的序列被延展到相对更长的一个上。 |
| xs.zip WithIndex | 把一对容器xs和它的序列，所包含的元素组成一个iterable 。 |
| **比对：**	 |                |
| xs sameElements ys | 测试 xs 和 ys 是否以相同的顺序包含相同的元素。 |


在Iterable下的继承层次结构你会发现有三个traits：[Seq](https://www.scala-lang.org/api/current/scala/collection/Seq.html)，[Set](https://www.scala-lang.org/api/current/scala/collection/Set.html)，和 [Map](https://www.scala-lang.org/api/current/scala/collection/Map.html)。这三个Traits有一个共同的特征，它们都实现了[PartialFunction](https://www.scala-lang.org/api/current/scala/PartialFunction.html) trait以及它的应用和isDefinedAt 方法。然而，每一个trait实现的 `PartialFunction` 方法却各不相同。

例如序列，使用用的是位置索引，它里面的元素的总是从0开始编号。即`Seq(1, 2, 3)(1) `为2。例如sets，使用的是成员测试。例如`Set('a', 'b', 'c')('b') `算出来的是true，而`Set()('a')`为false。最后，maps使用的是选择。比如`Map('a' -> 1, 'b' -> 10, 'c' -> 100)('b')` 得到的是10。

接下来，我们将详细的介绍三种类型的容器（collection）。
