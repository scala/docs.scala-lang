---
layout: multipage-overview
title: 具体的不可变集实体类
partof: collections
overview-name: Collections

num: 8
language: zh-cn
---


Scala中提供了多种具体的不可变集类供你选择，这些类(maps, sets, sequences)实现的接口(traits)不同，比如是否能够是无限(infinite)的，各种操作的速度也不一样。下面的篇幅介绍几种Scala中最常用的不可变集类型。

## List（列表）

列表[List](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/immutable/List.html)是一种有限的不可变序列式。提供了常数时间的访问列表头元素和列表尾的操作，并且提供了常数时间的构造新链表的操作，该操作将一个新的元素插入到列表的头部。其他许多操作则和列表的长度成线性关系。

List通常被认为是Scala中最重要的数据结构，所以我们在此不必过于赘述。版本2.8中主要的变化是，List类和其子类::以及其子对象Nil都被定义在了其逻辑上所属的scala.collection.immutable包里。scala包中仍然保留了List，Nil和::的别名，所以对于用户来说可以像原来一样访问List。

另一个主要的变化是，List现在更加紧密的融入了Collections Framework中，而不是像过去那样更像一个特例。比如说，大量原本存在于与List相关的对象的方法基本上全部都过时(deprecated)了，取而代之的是被每种Collection所继承的统一的构造方法。

## Stream（流）

流[Stream](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/immutable/Stream.html)与List很相似，只不过其中的每一个元素都经过了一些简单的计算处理。也正是因为如此，stream结构可以无限长。只有那些被要求的元素才会经过计算处理，除此以外stream结构的性能特性与List基本相同。

鉴于List通常使用 `:: `运算符来进行构造，stream使用外观上很相像的`#::`。这里用一个包含整数1，2和3的stream来做一个简单的例子：

    scala> val str = 1 #:: 2 #:: 3 #:: Stream.empty
    str: scala.collection.immutable.Stream[Int] = Stream(1, ?)

该stream的头结点是1，尾是2和3.尾部并没有被打印出来，因为还没有被计算。stream被特别定义为懒惰计算，并且stream的toString方法很谨慎的设计为不去做任何额外的计算。

下面给出一个稍复杂些的例子。这里讲一个以两个给定的数字为起始的斐波那契数列转换成stream。斐波那契数列的定义是，序列中的每个元素等于序列中在它之前的两个元素之和。

    scala> def fibFrom(a: Int, b: Int): Stream[Int] = a #:: fibFrom(b, a + b)
    fibFrom: (a: Int,b: Int)Stream[Int]

这个函数看起来比较简单。序列中的第一个元素显然是a，其余部分是以b和位于其后的a+b为开始斐波那契数列。这段程序最大的亮点是在对序列进行计算的时候避免了无限递归。如果函数中使用`::`来替换`#::`，那么之后的每次调用都会产生另一次新的调用，从而导致无限递归。在此例中，由于使用了`#::`，等式右值中的调用在需要求值之前都不会被展开。这里尝试着打印出以1，1开头的斐波那契数列的前几个元素：

    scala> val fibs = fibFrom(1, 1).take(7)
    fibs: scala.collection.immutable.Stream[Int] = Stream(1, ?)
    scala> fibs.toList
    res9: List[Int] = List(1, 1, 2, 3, 5, 8, 13)

## Vector（向量）

对于只需要处理数据结构头结点的算法来说，List非常高效。可是相对于访问、添加和删除List头结点只需要固定时间，访问和修改头结点之后元素所需要的时间则是与List深度线性相关的。

向量[Vector](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/immutable/Vector.html)是用来解决列表(list)不能高效的随机访问的一种结构。Vector结构能够在“更高效”的固定时间内访问到列表中的任意元素。虽然这个时间会比访问头结点或者访问某数组元素所需的时间长一些，但至少这个时间也是个常量。因此，使用Vector的算法不必仅是小心的处理数据结构的头结点。由于可以快速修改和访问任意位置的元素，所以对Vector结构做写操作很方便。

Vector类型的构建和修改与其他的序列结构基本一样。

    scala> val vec = scala.collection.immutable.Vector.empty
    vec: scala.collection.immutable.Vector[Nothing] = Vector()
    scala> val vec2 = vec :+ 1 :+ 2
    vec2: scala.collection.immutable.Vector[Int] = Vector(1, 2)
    scala> val vec3 = 100 +: vec2
    vec3: scala.collection.immutable.Vector[Int] = Vector(100, 1, 2)
    scala> vec3(0)
    res1: Int = 100

Vector结构通常被表示成具有高分支因子的树（树或者图的分支因子是指数据结构中每个节点的子节点数目）。每一个树节点包含最多32个vector元素或者至多32个子树节点。包含最多32个元素的vector可以表示为一个单一节点，而一个间接引用则可以用来表示一个包含至多`32*32=1024`个元素的vector。从树的根节点经过两跳到达叶节点足够存下有2的15次方个元素的vector结构，经过3跳可以存2的20次方个，4跳2的25次方个，5跳2的30次方个。所以对于一般大小的vector数据结构，一般经过至多5次数组访问就可以访问到指定的元素。这也就是我们之前所提及的随机数据访问时“运行时间的相对高效”。

由于Vectors结构是不可变的，所以您不能通过修改vector中元素的方法来返回一个新的vector。尽管如此，您仍可以通过update方法从一个单独的元素中创建出区别于给定数据结构的新vector结构：

    scala> val vec = Vector(1, 2, 3)
    vec: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3)
    scala> vec updated (2, 4)
    res0: scala.collection.immutable.Vector[Int] = Vector(1, 2, 4)
    scala> vec
    res1: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3)

从上面例子的最后一行我们可以看出，update方法的调用并不会改变vec的原始值。与元素访问类似，vector的update方法的运行时间也是“相对高效的固定时间”。对vector中的某一元素进行update操作可以通过从树的根节点开始拷贝该节点以及每一个指向该节点的节点中的元素来实现。这就意味着一次update操作能够创建1到5个包含至多32个元素或者子树的树节点。当然，这样做会比就地更新一个可变数组败家很多，但比起拷贝整个vector结构还是绿色环保了不少。

由于vector在快速随机选择和快速随机更新的性能方面做到很好的平衡，所以它目前正被用作不可变索引序列的默认实现方式。

    scala> collection.immutable.IndexedSeq(1, 2, 3)
    res2: scala.collection.immutable.IndexedSeq[Int] = Vector(1, 2, 3)

## Immutable stacks（不可变栈）

如果您想要实现一个后入先出的序列，那您可以使用[Stack](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/immutable/Stack.html)。您可以使用push向栈中压入一个元素，用pop从栈中弹出一个元素，用top查看栈顶元素而不用删除它。所有的这些操作都仅仅耗费固定的运行时间。

这里提供几个简单的stack操作的例子：

    scala> val stack = scala.collection.immutable.Stack.empty
    stack: scala.collection.immutable.Stack[Nothing] = Stack()
    scala> val hasOne = stack.push(1)
    hasOne: scala.collection.immutable.Stack[Int] = Stack(1)
    scala> stack
    stack: scala.collection.immutable.Stack[Nothing] = Stack()
    scala> hasOne.top
    res20: Int = 1
    scala> hasOne.pop
    res19: scala.collection.immutable.Stack[Int] = Stack()

不可变stack一般很少用在Scala编程中，因为List结构已经能够覆盖到它的功能：push操作同List中的::基本相同，pop则对应着tail。

## Immutable Queues（不可变队列）

[Queue](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/immutable/Queue.html)是一种与stack很相似的数据结构，除了与stack的后入先出不同，Queue结构的是先入先出的。

这里给出一个创建空不可变queue的例子：

    scala> val empty = scala.collection.immutable.Queue[Int]()
    empty: scala.collection.immutable.Queue[Int] = Queue()

您可以使用enqueue方法在不可变Queue中加入一个元素：

    scala> val has1 = empty.enqueue(1)
    has1: scala.collection.immutable.Queue[Int] = Queue(1)

如果想要在queue中添加多个元素需要在调用enqueue方法时用一个collection对象作为参数：

    scala> val has123 = has1.enqueue(List(2, 3))
    has123: scala.collection.immutable.Queue[Int]
      = Queue(1, 2, 3)

如果想要从queue的头部删除一个元素，您可以使用dequeue方法：

    scala> val (element, has23) = has123.dequeue
    element: Int = 1
    has23: scala.collection.immutable.Queue[Int] = Queue(2, 3)

请注意，dequeue方法将会返回两个值，包括被删除掉的元素和queue中剩下的部分。

## Ranges (等差数列)

[Range]表示的是一个有序的等差整数数列。比如说，“1，2，3，”就是一个Range，“5，8，11，14，”也是。在Scala中创建一个Range类，需要用到两个预定义的方法to和by。

    scala> 1 to 3
    res2: scala.collection.immutable.Range.Inclusive = Range(1, 2, 3)
    scala> 5 to 14 by 3
    res3: scala.collection.immutable.Range = Range(5, 8, 11, 14)

如果您想创建一个不包含范围上限的Range类，那么用until方法代替to更为方便：

    scala> 1 until 3
    res2: scala.collection.immutable.Range = Range(1, 2)

Range类的空间复杂度是恒定的，因为只需要三个数字就可以定义一个Range类：起始、结束和步长值。也正是因为有这样的特性，对Range类多数操作都非常非常的快。

## Hash Tries

Hash try是高效实现不可变集合和关联数组(maps)的标准方法，[immutable.HashMap](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/immutable/HashMap.html)类提供了对Hash Try的支持。从表现形式上看，Hash Try和Vector比较相似，都是树结构，且每个节点包含32个元素或32个子树，差别只是用不同的hash code替换了指向各个节点的向量值。举个例子吧：当您要在一个映射表里找一个关键字，首先需要用hash code值替换掉之前的向量值；然后用hash code的最后5个bit找到第一层子树，然后每5个bit找到下一层子树。当存储在一个节点中所有元素的代表他们当前所在层的hash code位都不相同时，查找结束。

Hash Try对于快速查找和函数式的高效添加和删除操作上取得了很好的平衡，这也是Scala中不可变映射和集合采用Hash Try作为默认实现方式的原因。事实上，Scala对于大小小于5的不可变集合和映射做了更进一步的优化。只有1到4个元素的集合和映射被在现场会被存储在一个单独仅仅包含这些元素（对于映射则只是包含键值对）的对象中。空集合和空映射则视情况不同作为一个单独的对象，空的一般情况下就会一直空下去，所以也没有必要为他们复制一份拷贝。

## Red-Black Trees（红黑树）

红黑树是一种平衡二叉树，树中一些节点被设计成红节点，其余的作为黑节点。同任何平衡二叉树一样，对红黑树的最长运行时间随树的节点数成对数(logarithmic)增长。

Scala隐含的提供了不可变集合和映射的红黑树实现，您可以在[TreeSet](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/immutable/TreeSet.html)和[TreeMap](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/immutable/TreeMap.html)下使用这些方法。

    ## scala> scala.collection.immutable.TreeSet.empty[Int]
    res11: scala.collection.immutable.TreeSet[Int] = TreeSet()
    scala> res11 + 1 + 3 + 3
    res12: scala.collection.immutable.TreeSet[Int] = TreeSet(1, 3)

红黑树在Scala中被作为SortedSet的标准实现，因为它提供了一个高效的迭代器，可以用来按照拍好的序列返回所有的元素。

## Immutable BitSets（不可变位集合）

[BitSet](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/immutable/BitSet.html)代表一个由小整数构成的容器，这些小整数的值表示了一个大整数被置1的各个位。比如说，一个包含3、2和0的bit集合可以用来表示二进制数1101和十进制数13.

BitSet内部的使用了一个64位long型的数组。数组中的第一个long表示整数0到63，第二个表示64到27，以此类推。所以只要集合中最大的整数在千以内BitSet的压缩率都是相当高的。

BitSet操作的运行时间是非常快的。查找测试仅仅需要固定时间。向集合内增加一个项所需时间同BitSet数组中long型的个数成正比，但这也通常是个非常小的值。这里有几个关于BitSet用法的例子：

    scala> val bits = scala.collection.immutable.BitSet.empty
    bits: scala.collection.immutable.BitSet = BitSet()
    scala> val moreBits = bits + 3 + 4 + 4
    moreBits: scala.collection.immutable.BitSet = BitSet(3, 4)
    scala> moreBits(3)
    res26: Boolean = true
    scala> moreBits(0)
    res27: Boolean = false

## List Maps

[ListMap](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/immutable/ListMap.html)被用来表示一个保存键-值映射的链表。一般情况下，ListMap操作都需要遍历整个列表，所以操作的运行时间也同列表长度成线性关系。实际上ListMap在Scala中很少使用，因为标准的不可变映射通常速度会更快。唯一的例外是，在构造映射时由于某种原因，链表中靠前的元素被访问的频率大大高于其他的元素。

    scala> val map = scala.collection.immutable.ListMap(1->"one", 2->"two")
    map: scala.collection.immutable.ListMap[Int,java.lang.String] =
       Map(1 -> one, 2 -> two)
    scala> map(2)
    res30: String = "two"
