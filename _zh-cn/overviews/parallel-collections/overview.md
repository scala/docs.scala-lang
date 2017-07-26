---
layout: multipage-overview
title: 概述

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 1
language: zh-cn
---

**Aleksandar Prokopec, Heather Miller**

## 动机

近年来，处理器厂家在单核向多核架构迁移的过程中，学术界和工业界都认为当红的并行编程仍是一个艰巨的挑战。

在Scala标准库中包含的并行容器通过免去并行化的底层细节，以方便用户并行编程,同时为他们提供一个熟悉而简单的高层抽象。希望隐藏在抽象容器之后的隐式并行性将带来可靠的并行执行，并进一步靠近主流开发者的工作流程。

原理其实很简单-容器是抽象编程中被广泛熟识和经常使用的类，并且考虑到他们的规则性，容器能够使程序高效且透明的并行化。通过使用户能够在并行操作有序容器的同时改变容器序列，Scala的并行容器在使代码能够更容易的并行化方面做了很大改进。

下面是个序列的例子，这里我们在某个大的容器上执行一个一元运算：

    val list = (1 to 10000).toList
    list.map(_ + 42)
为了并行的执行同样的操作，我们只需要简单的调用序列容器（列表）的par方法。这样，我们就可以像通常使用序列容器的方式那样来使用并行容器。上面的例子可以通过执行下面的来并行化：

	list.par.map(_ + 42)
Scala的并行容器库设计创意般的同Scala的（序列）容器库（从2.8引入）密切的整合在一起。在Scala（序列）容器库中，它提供了大量重要的数据结构对应的东西，包括：

- ParArray
- ParVector
- mutable.ParHashMap
- mutable.ParHashSet
- immutable.ParHashMap
- immutable.ParHashSet
- ParRange
- ParTrieMap (collection.concurrent.TrieMaps are new in 2.10)

在通常的架构之外，Scala的并行容器库也同序列容器库(sequential collections)一样具有可扩展性。这就是说，像通常的序列容器那样，用户可以整合他们自己的容器类型，并且自动继承所有的可用在别的并行容器（在标准库里的）的预定义（并行）操作。

### 下边是一些例子

为了说明并行容器的通用性和实用性，我们提供几个简单的示例用法，所有这些都被透明的并行执行。

提示：随后某些例子操作小的容器，实际中不推荐这样做。他们提供的示例仅为演示之用。一般来说，当容器的尺寸比较巨大（通常为成千上万个元素时）时，加速才会比较明显。（关于并行容器的尺寸和性能更多的信息，请参见）

#### map

使用parallel map来把一个字符串容器变为全大写字母：

    scala> val lastNames = List("Smith","Jones","Frankenstein","Bach","Jackson","Rodin").par
    astNames: scala.collection.parallel.immutable.ParSeq[String] = ParVector(Smith, Jones, Frankenstein, Bach, Jackson, Rodin)

    scala> lastNames.map(_.toUpperCase)
    res0: scala.collection.parallel.immutable.ParSeq[String] = ParVector(SMITH, JONES, FRANKENSTEIN, BACH, JACKSON, RODIN)

#### fold

通过fold计算一个ParArray中所有数的累加值：

    scala> val parArray = (1 to 10000).toArray.par
    parArray: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 2, 3, ...

    scala> parArray.fold(0)(_ + _)
    res0: Int = 50005000

#### filter

使用并行过滤器来选择按字母顺序排在“K”之后的姓名。（译者注：这个例子有点问题，应该是排在“J”之后的）

    scala> val lastNames = List("Smith","Jones","Frankenstein","Bach","Jackson","Rodin").par
    astNames: scala.collection.parallel.immutable.ParSeq[String] = ParVector(Smith, Jones, Frankenstein, Bach, Jackson, Rodin)

    scala> lastNames.filter(_.head >= 'J')
    res0: scala.collection.parallel.immutable.ParSeq[String] = ParVector(Smith, Jones, Jackson, Rodin)

## 创建一个并行容器

并行容器(parallel collections)同顺序容器(sequential collections)完全一样的被使用，唯一的不同是要怎样去获得一个并行容器。

通常，我们有两种方法来创建一个并行容器:

第一种，通过使用new关键字和一个适当的import语句:

    import scala.collection.parallel.immutable.ParVector
    val pv = new ParVector[Int]

第二种，通过从一个顺序容器转换得来：

	val pv = Vector(1,2,3,4,5,6,7,8,9).par

这里需要着重强调的是这些转换方法：通过调用顺序容器(sequential collections)的par方法，顺序容器(sequential collections)可以被转换为并行容器；通过调用并行容器的seq方法，并行容器可以被转换为顺序容器。

注意：那些天生就有序的容器（意思是元素必须一个接一个的访问），像lists，queues和streams，通过拷贝元素到类似的并行容器中被转换为它们的并行对应物。例如List--被转换为一个标准的不可变的并行序列中，就是ParVector。当然，其他容器类型不需要这些拷贝的开销，比如：Array，Vector，HashMap等等。

关于并行容器的转换的更多信息请参见 [conversions](http://docs.scala-lang.org/overviews/parallel-collections/conversions.html) 和 [concrete parallel collections classes](http://docs.scala-lang.org/overviews/parallel-collections/concrete-parallel-collections.html)章节

## 语义(semantic)

尽管并行容器的抽象概念很像通常的顺序容器，重要的是要注意它的语义的不同，特别是关于副作用(side-effects)和无关操作(non-associative operations)。

为了看看这是怎样的情况，首先，我们设想操作是如何被并行的执行。从概念上讲，Scala的并行容器框架在并行容器上通过递归的“分解"给定的容器来并行化一个操作，在并行中，容器的每个部分应用一个操作，然后“重组”所有这些并行执行的结果。

这些并发和并行容器的“乱序”语义导致以下两个影响：

1. 副作用操作可能导致结果的不确定性
2. 非关联(non-associative)操作导致不确定性

### 副作用操作

为了保持确定性，考虑到并行容器框架的并发执行的语义，一般应该避免执行那些在容器上引起副作用的操作。一个简单的例子就是使用访问器方法，像在 foreach 之外来增加一个 var 定义然后传递给foreach。

    scala> var sum = 0
    sum: Int = 0

    scala> val list = (1 to 1000).toList.par
    list: scala.collection.parallel.immutable.ParSeq[Int] = ParVector(1, 2, 3,…

    scala> list.foreach(sum += _); sum
    res01: Int = 467766

    scala> var sum = 0
    sum: Int = 0

    scala> list.foreach(sum += _); sum
    res02: Int = 457073    

    scala> var sum = 0
    sum: Int = 0

    scala> list.foreach(sum += _); sum
    res03: Int = 468520    

从上述例子我们可以看到虽然每次 sum 都被初始化为0，在list的foreach每次调用之后，sum都得到不同的值。这个不确定的源头就是数据竞争 -- 同时读/写同一个可变变量(mutable variable)。

在上面这个例子中，可能同时有两个线程在读取同一个sum的值，某些操作花了些时间后，它们又试图写一个新的值到sum中，可能的结果就是某个有用的值被覆盖了（因此丢失了），如下表所示：

    线程A: 读取sum的值, sum = 0         sum的值: 0
    线程B: 读取sum的值, sum = 0         sum的值: 0
    线程A:  sum 加上760,      写 sum = 760            sum的值: 760
    线程B:  sum 加上12,      写 sum = 12            sum的值: 12

上面的示例演示了一个场景:两个线程读相同的值：0。在这种情况下，线程A读0并且累计它的元素：0+760，线程B，累计0和它的元素：0+12。在各自计算了和之后，它们各自把计算结果写入到sum中。从线程A到线程B，线程A写入后，马上被线程B写入的值覆盖了，值760就完全被覆盖了（因此丢失了）。

### 非关联(non-associative)操作

对于”乱序“语义，为了避免不确定性，也必须注意只执行相关的操作。这就是说，给定一个并行容器：pcoll，我们应该确保什么时候调用一个pcoll的高阶函数，例如：pcoll.reduce(func)，被应用到pcoll元素的函数顺序是任意的。一个简单但明显不可结合(non-associative)例子是减法运算：

    scala> val list = (1 to 1000).toList.par
    list: scala.collection.parallel.immutable.ParSeq[Int] = ParVector(1, 2, 3,…

    scala> list.reduce(_-_)
    res01: Int = -228888

    scala> list.reduce(_-_)
    res02: Int = -61000

    scala> list.reduce(_-_)
    res03: Int = -331818

在上面这个例子中，我们对 ParVector[Int]调用 reduce 函数，并给他 _-_ 参数（简单的两个非命名元素），从第二个减去第一个。因为并行容器(parallel collections)框架创建线程来在容器的不同部分执行reduce(-)，而由于执行顺序的不确定性，两次应用reduce(-)在并行容器上很可能会得到不同的结果。

注意：通常人们认为，像不可结合(non-associative)作，不可交换(non-commutative)操作传递给并行容器的高阶函数同样导致非确定的行为。但和不可结合是不一样的，一个简单的例子是字符串联合(concatenation)，就是一个可结合但不可交换的操作：

    scala> val strings = List("abc","def","ghi","jk","lmnop","qrs","tuv","wx","yz").par
    strings: scala.collection.parallel.immutable.ParSeq[java.lang.String] = ParVector(abc, def, ghi, jk, lmnop, qrs, tuv, wx, yz)

    scala> val alphabet = strings.reduce(_++_)
    alphabet: java.lang.String = abcdefghijklmnopqrstuvwxyz

并行容器的“乱序”语义仅仅意味着操作被执行是没有顺序的（从时间意义上说，就是非顺序的），并不意味着结果的重“组合”也是乱序的（从空间意义上）。恰恰相反，结果一般总是按序组合的 -- 一个并行容器被分成A，B，C三部分，按照这个顺序，将重新再次按照A，B，C的顺序组合。而不是某种其他随意的顺序如B，C，A。

关于并行容器在不同的并行容器类型上怎样进行分解和组合操作的更多信息，请参见。
