---
layout: multipage-overview
title: Java和Scala容器的转换

discourse: false

partof: collections
overview-name: Collections

num: 17
language: zh-cn
---


和Scala一样，Java同样提供了丰富的容器库，Scala和Java容器库有很多相似点，例如，他们都包含迭代器、可迭代结构、集合、 映射和序列。但是他们有一个重要的区别。Scala的容器库特别强调不可变性，因此提供了大量的新方法将一个容器变换成一个新的容器。

某些时候，你需要将一种容器类型转换成另外一种类型。例如，你可能想要像访问Scala容器一样访问某个Java容器，或者你可能想将一个Scala容器像Java容器一样传递给某个Java方法。在Scala中，这是很容易的，因为Scala提供了大量的方法来隐式转换所有主要的Java和Scala容器类型。其中提供了如下的双向类型转换：

    Iterator <=> java.util.Iterator
    Iterator <=> java.util.Enumeration
    Iterable <=> java.lang.Iterable
    Iterable <=> java.util.Collection
    mutable.Buffer <=> java.util.List
    mutable.Set <=> java.util.Set
    mutable.Map <=> java.util.Map
    mutable.ConcurrentMap <=> java.util.concurrent.ConcurrentMap

使用这些转换很简单，只需从JavaConversions对象中import它们即可。

    scala> import collection.JavaConversions._
    import collection.Java.Conversions._

import之后，就可以在Scala容器和与之对应的Java容器之间进行隐式转换了

    scala> import collection.mutable._
    import collection.mutable._
    scala> val jul: java.util.List[Int] = ArrayBuffer(1, 2, 3)
    jul: java.util.List[Int] = [1, 2, 3]
    scala> val buf: Seq[Int] = jul
    buf: scala.collection.mutable.Seq[Int] = ArrayBuffer(1, 2, 3)
    scala> val m: java.util.Map[String, Int] = HashMap("abc" -> 1, "hello" -> 2)
    m: java.util.Map[String, Int] = {hello=2, abc=1}

在Scala内部，这些转换是通过一系列“包装”对象完成的，这些对象会将相应的方法调用转发至底层的容器对象。所以容器不会在Java和Scala之间拷贝来拷贝去。一个值得注意的特性是，如果你将一个Java容器转换成其对应的Scala容器，然后再将其转换回同样的Java容器，最终得到的是一个和一开始完全相同的容器对象（译注：这里的相同意味着这两个对象实际上是指向同一片内存区域的引用，容器转换过程中没有任何的拷贝发生）。

还有一些Scala容器类型可以转换成对应的Java类型，但是并没有将相应的Java类型转换成Scala类型的能力，它们是：

    Seq => java.util.List
    mutable.Seq => java.util.List
    Set => java.util.Set
    Map => java.util.Map

因为Java并未区分可变容器不可变容器类型，所以，虽然能将`scala.immutable.List`转换成`java.util.List`，但所有的修改操作都会抛出“UnsupportedOperationException”。参见下例：

    scala> jul = List(1, 2, 3)
    jul: java.util.List[Int] = [1, 2, 3]
    scala> jul.add(7)
    java.lang.UnsupportedOperationException
            at java.util.AbstractList.add(AbstractList.java:131)
