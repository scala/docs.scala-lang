---
layout: multipage-overview
title: 具体的可变容器类
partof: collections
overview-name: Collections

num: 9
language: zh-cn
---


目前你已经看过了Scala的不可变容器类，这些是标准库中最常用的。现在来看一下可变容器类。

## Array Buffers

一个[ArrayBuffer](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/ArrayBuffer.html)缓冲包含数组和数组的大小。对数组缓冲的大多数操作，其速度与数组本身无异。因为这些操作直接访问、修改底层数组。另外，数组缓冲可以进行高效的尾插数据。追加操作均摊下来只需常量时间。因此，数组缓冲可以高效的建立一个有大量数据的容器，无论是否总有数据追加到尾部。

    scala> val buf = scala.collection.mutable.ArrayBuffer.empty[Int]
    buf: scala.collection.mutable.ArrayBuffer[Int] = ArrayBuffer()
    scala> buf += 1
    res32: buf.type = ArrayBuffer(1)
    scala> buf += 10
    res33: buf.type = ArrayBuffer(1, 10)
    scala> buf.toArray
    res34: Array[Int] = Array(1, 10)

## List Buffers

[ListBuffer](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/ListBuffer.html) 类似于数组缓冲。区别在于前者内部实现是链表， 而非数组。如果你想把构造完的缓冲转换为列表，那就用列表缓冲，别用数组缓冲。

    scala> val buf = scala.collection.mutable.ListBuffer.empty[Int]
    buf: scala.collection.mutable.ListBuffer[Int] = ListBuffer()
    scala> buf += 1
    res35: buf.type = ListBuffer(1)
    scala> buf += 10
    res36: buf.type = ListBuffer(1, 10)
    scala> buf.toList
    res37: List[Int] = List(1, 10)

## StringBuilders

数组缓冲用来构建数组，列表缓冲用来创建列表。类似地，[StringBuilder](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/StringBuilder.html) 用来构造字符串。作为常用的类，字符串构造器已导入到默认的命名空间。直接用 new StringBuilder就可创建字符串构造器 ，像这样：

    scala> val buf = new StringBuilder
    buf: StringBuilder =
    scala> buf += 'a'
    res38: buf.type = a
    scala> buf ++= "bcdef"
    res39: buf.type = abcdef
    scala> buf.toString
    res41: String = abcdef

## 链表

链表是可变序列，它由一个个使用next指针进行链接的节点构成。它们的支持类是[LinkedList](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/LinkedList.html)。在大多数的编程语言中，null可以表示一个空链表，但是在Scalable集合中不是这样。因为就算是空的序列，也必须支持所有的序列方法。尤其是 `LinkedList.empty.isEmpty` 必须返回`true`，而不是抛出一个 `NullPointerException` 。空链表用一种特殊的方式编译：

它们的 next 字段指向它自身。链表像他们的不可变对象一样，是最佳的顺序遍历序列。此外，链表可以很容易去插入一个元素或链接到另一个链表。

## 双向链表

双向链表和单向链表相似，只不过它们除了具有 next字段外，还有一个可变字段 prev用来指向当前节点的上一个元素 。这个多出的链接的好处主要在于可以快速的移除元素。双向链表的支持类是[DoubleLinkedList](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/DoubleLinkedList.html).

## 可变列表

[MutableList](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/MutableList.html) 由一个单向链表和一个指向该链表终端空节点的指针构成。因为避免了贯穿整个列表去遍历搜索它的终端节点，这就使得列表压缩了操作所用的时间。MutableList 目前是Scala中[mutable.LinearSeq](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/LinearSeq.html) 的标准实现。

## 队列

Scala除了提供了不可变队列之外，还提供了可变队列。你可以像使用一个不可变队列一样地使用一个可变队列，但你需要使用+= 和++=操作符进行添加的方式来替代排队方法。
当然，在一个可变队列中，出队方法将只移除头元素并返回该队列。这里是一个例子：

    scala> val queue = new scala.collection.mutable.Queue[String]
    queue: scala.collection.mutable.Queue[String] = Queue()
    scala> queue += "a"
    res10: queue.type = Queue(a)
    scala> queue ++= List("b", "c")
    res11: queue.type = Queue(a, b, c)
    scala> queue
    res12: scala.collection.mutable.Queue[String] = Queue(a, b, c)
    scala> queue.dequeue
    res13: String = a
    scala> queue
    res14: scala.collection.mutable.Queue[String] = Queue(b, c)

## 数组序列

Array Sequences 是具有固定大小的可变序列。在它的内部，用一个 `Array[Object]`来存储元素。在Scala 中，[ArraySeq](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/ArraySeq.html) 是它的实现类。

如果你想拥有 Array 的性能特点，又想建立一个泛型序列实例，但是你又不知道其元素的类型，在运行阶段也无法提供一个`ClassTag` ，那么你通常可以使用 `ArraySeq` 。这些问题在[arrays](https://docs.scala-lang.org/overviews/collections/arrays.html)一节中有详细的说明。

## 堆栈

你已经在前面看过了不可变栈。还有一个可变栈，支持类是[mutable.Stack](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/Stack.html)。它的工作方式与不可变栈相同，只是适当的做了修改。

    scala> val stack = new scala.collection.mutable.Stack[Int]           
    stack: scala.collection.mutable.Stack[Int] = Stack()
    scala> stack.push(1)
    res0: stack.type = Stack(1)
    scala> stack
    res1: scala.collection.mutable.Stack[Int] = Stack(1)
    scala> stack.push(2)
    res0: stack.type = Stack(1, 2)
    scala> stack
    res3: scala.collection.mutable.Stack[Int] = Stack(1, 2)
    scala> stack.top
    res8: Int = 2
    scala> stack
    res9: scala.collection.mutable.Stack[Int] = Stack(1, 2)
    scala> stack.pop    
    res10: Int = 2
    scala> stack    
    res11: scala.collection.mutable.Stack[Int] = Stack(1)

## 数组堆栈

[ArrayStack](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/ArrayStack.html) 是另一种可变栈的实现，用一个可根据需要改变大小的数组做为支持。它提供了快速索引，使其通常在大多数的操作中会比普通的可变堆栈更高效一点。

## 哈希表

Hash Table 用一个底层数组来存储元素，每个数据项在数组中的存储位置由这个数据项的Hash Code 来决定。添加一个元素到Hash Table不用花费多少时间，只要数组中不存在与其含有相同Hash Code的另一个元素。因此，只要Hash Table能够根据一种良好的hash codes分配机制来存放对象，Hash Table的速度会非常快。所以在Scala中默认的可变map和set都是基于Hash Table的。你也可以直接用[mutable.HashSet](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/HashSet.html) 和 [mutable.HashMap](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/HashMap.html) 来访问它们。

Hash Set 和 Map 的使用和其他的Set和Map是一样的。这里有一些简单的例子：

    scala> val map = scala.collection.mutable.HashMap.empty[Int,String]
    map: scala.collection.mutable.HashMap[Int,String] = Map()
    scala> map += (1 -> "make a web site")
    res42: map.type = Map(1 -> make a web site)
    scala> map += (3 -> "profit!")
    res43: map.type = Map(1 -> make a web site, 3 -> profit!)
    scala> map(1)
    res44: String = make a web site
    scala> map contains 2
    res46: Boolean = false

Hash Table的迭代并不是按特定的顺序进行的。它是按任何可能的顺序，依次处理底层数组的数据。为了保证迭代的次序，可以使用一个Linked Hash Map 或 Set 来做为替代。Linked Hash Map 或 Set 像标准的Hash Map 或 Set一样，只不过它包含了一个Linked List,其中的元素按添加的顺序排列。在这种容器中的迭代都是具有相同的顺序，就是按照元素最初被添加的顺序进行迭代。

## Weak Hash Maps

Weak Hash Map 是一种特殊的Hash Map，垃圾回收器会忽略从Map到存储在其内部的Key值的链接。这也就是说，当一个key不再被引用的时候，这个键和对应的值会从map中消失。Weak Hash Map 可以用来处理缓存，比如当一个方法被同一个键值重新调用时，你想重用这个大开销的方法返回值。如果Key值和方法返回值存储在一个常规的Hash Map里，Map会无限制的扩展，Key值也永远不会被垃圾回收器回收。用Weak Hash Map会避免这个问题。一旦有一个Key对象不再被引用，那它的实体会从Weak Hash Map中删除。在Scala中，[WeakHashMap](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/WeakHashMap.html)类是Weak Hash Map的实现类，封装了底层的Java实现类`java.util.WeakHashMap`。

## Concurrent Maps

Concurrent Map可以同时被多个线程访问。除了[Map](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/Map.html)的通用方法，它提供了下列的原子方法：

### Concurrent Map类中的方法：

|WHAT IT IS | WHAT IT DOES  |
|-----------------------|----------------------|
|m putIfAbsent(k, v)    | 添加 键/值 绑定 k -> m ，如果k在m中没有被定义过 |
|m remove (k, v)     | 如果当前 k 映射于 v，删除k对应的实体。 |
|m replace (k, old, new)     | 如果k先前绑定的是old，则把键k 关联的值替换为new。 |
|m replace (k, v)     | 如果k先前绑定的是其他值，则把键k对应的值替换为v |


`ConcurrentMap`体现了Scala容器库的特性。目前，它的实现类只有Java的`java.util.concurrent.ConcurrentMap`, 它可以用[standard Java/Scala collection conversions](https://docs.scala-lang.org/overviews/collections/conversions-between-java-and-scala-collections.html)(标准的java/Scala容器转换器)来自动转换成一个Scala map。

## Mutable Bitsets

一个类型为[mutable.BitSet](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/mutable/BitSet.html)的可变bit集合和不可变的bit集合很相似，它只是做了适当的修改。Mutable bit sets在更新的操作上比不可变bit set 效率稍高，因为它不必复制没有发生变化的 Long值。

    scala> val bits = scala.collection.mutable.BitSet.empty
    bits: scala.collection.mutable.BitSet = BitSet()
    scala> bits += 1
    res49: bits.type = BitSet(1)
    scala> bits += 3
    res50: bits.type = BitSet(1, 3)
    scala> bits
    res51: scala.collection.mutable.BitSet = BitSet(1, 3)
