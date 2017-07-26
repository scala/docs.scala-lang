---
layout: multipage-overview
title: Iterators

discourse: false

partof: collections
overview-name: Collections

num: 15
language: zh-cn
---

迭代器不是一个容器，更确切的说是逐一访问容器内元素的方法。迭代器it的两个基本操作是next和hasNext。调用it.next()会返回迭代器的下一个元素，并且更新迭代器的状态。在同一个迭代器上再次调用next，会产生一个新元素来覆盖之前返回的元素。如果没有元素可返回，调用next方法会抛出一个NoSuchElementException异常。你可以调用[迭代器]的hasNext方法来查询容器中是否有下一个元素可供返回。

让迭代器it逐个返回所有元素最简单的方法是使用while循环：

    while (it.hasNext)
      println(it.next())

Scala为Traversable, Iterable和Seq类中的迭代器提供了许多类似的方法。比如：这些类提供了foreach方法以便在迭代器返回的每个元素上执行指定的程序。使用foreach方法可以将上面的循环缩写为：

    it foreach println

与往常一样，for表达式可以作为foreach、map、withFilter和flatMap表达式的替代语法，所以另一种打印出迭代器返回的所有元素的方式会是这样：

    for (elem <- it) println(elem)

在迭代器或traversable容器中调用foreach方法的最大区别是：当在迭代器中完成调用foreach方法后会将迭代器保留在最后一个元素的位置。所以在这个迭代器上再次调用next方法时会抛出NoSuchElementException异常。与此不同的是，当在容器中调用foreach方法后，容器中的元素数量不会变化（除非被传递进来的函数删除了元素，但不赞成这样做，因为这会导致意想不到的结果）。

迭代器的其他操作跟Traversable一样具有相同的特性。例如：迭代器提供了map方法，该方法会返回一个新的迭代器：

    scala> val it = Iterator("a", "number", "of", "words")
    it: Iterator[java.lang.String] = non-empty iterator
    scala> it.map(_.length)
    res1: Iterator[Int] = non-empty iterator
    scala> res1 foreach println
    1
    6
    2
    5
    scala> it.next()
    java.util.NoSuchElementException: next on empty iterator

如你所见，在调用了it.map方法后，迭代器it移动到了最后一个元素的位置。

另一个例子是关于dropWhile方法，它用来在迭代器中找到第一个具有某些属性的元素。比如：在上文所说的迭代器中找到第一个具有两个以上字符的单词，你可以这样写：

    scala> val it = Iterator("a", "number", "of", "words")
    it: Iterator[java.lang.String] = non-empty iterator
    scala> it dropWhile (_.length < 2)
    res4: Iterator[java.lang.String] = non-empty iterator
    scala> it.next()
    res5: java.lang.String = number

再次注意it在调用dropWhile方法后发生的变化：现在it指向了list中的第二个单词"number"。实际上，it和dropWhile返回的结果res4将会返回相同的元素序列。

只有一个标准操作允许重用同一个迭代器：

    val (it1, it2) = it.duplicate

这个操作返回两个迭代器,每个都相当于迭代器it的完全拷贝。这两个iterator相互独立；一个发生变化不会影响到另外一个。相比之下，原来的迭代器it则被指定到元素的末端而无法再次使用。

总的来说，如果调用完迭代器的方法后就不再访问它，那么迭代器的行为方式与容器是比较相像的。Scala容器库中的抽象类TraversableOnce使这一特质更加明显，它是 Traversable 和 Iterator 的公共父类。顾名思义，TraversableOnce 对象可以用foreach来遍历，但是没有指定该对象遍历之后的状态。如果TraversableOnce对象是一个迭代器，它遍历之后会位于最后一个元素，但如果是Traversable则不会发生变化。TraversableOnce的一个通常用法是作为一个方法的参数类型，传递的参数既可以是迭代器，也可以是traversable。Traversable类中的追加方法++就是一个例子。它有一个TraversableOnce 类型的参数，所以你要追加的元素既可以来自于迭代器也可以来自于traversable容器。

下面汇总了迭代器的所有操作。

## Iterator类的操作

| WHAT IT IS | WHAT IT DOES |
|--------------|---------------|
| 抽象方法：	|          |
| it.next() | 返回迭代器中的下一个元素，并将位置移动至该元素之后。 |
| it.hasNext | 如果还有可返回的元素，返回true。 |
| 变量：	|               |
| it.buffered | 被缓存的迭代器返回it的所有元素。 |
| it grouped size | 迭代器会生成由it返回元素组成的定长序列块。 |
| xs sliding size | 迭代器会生成由it返回元素组成的定长滑动窗口序列。 |
| 复制：	|            |
| it.duplicate | 会生成两个能分别返回it所有元素的迭代器。 |
| 加法：	 |                 |
| it ++ jt | 迭代器会返回迭代器it的所有元素，并且后面会附加迭代器jt的所有元素。 |
| it padTo (len, x) | 首先返回it的所有元素，追加拷贝x直到长度达到len。 |
| Maps:	  |        |
| it map f | 将it中的每个元素传入函数f后的结果生成新的迭代器。 |
| it flatMap f | 针对it指向的序列中的每个元素应用函数f，并返回指向结果序列的迭代器。 |
| it collect f | 针对it所指向的序列中的每一个在偏函数f上有定义的元素应用f，并返回指向结果序列的迭代器。 |
| 转换（Conversions）：	|            |
| it.toArray | 将it指向的所有元素归入数组并返回。 |
| it.toList | 把it指向的所有元素归入列表并返回 |
| it.toIterable | 把it指向的所有元素归入一个Iterable容器并返回。 |
| it.toSeq | 将it指向的所有元素归入一个Seq容器并返回。 |
| it.toIndexedSeq | 将it指向的所有元素归入一个IndexedSeq容器并返回。 |
| it.toStream | 将it指向的所有元素归入一个Stream容器并返回。 |
| it.toSet | 将it指向的所有元素归入一个Set并返回。 |
| it.toMap | 将it指向的所有键值对归入一个Map并返回。 |
| 拷贝：	|              |
| it copyToBuffer buf | 将it指向的所有元素拷贝至缓冲区buf。|
| it copyToArray(arr, s, n) | 将it指向的从第s个元素开始的n个元素拷贝到数组arr，其中后两个参数是可选的。 |
| 尺寸信息:	     |              |
| it.isEmpty | 检查it是否为空（与hasNext相反）。 |
| it.nonEmpty | 检查容器中是否包含元素（相当于 hasNext）。 |
| it.size | it可返回的元素数量。注意：这个操作会将it置于终点！ |
| it.length | 与it.size相同。 |
| it.hasDefiniteSize | 如果it指向的元素个数有限则返回true（缺省等同于isEmpty） |
| 按下标检索元素：	|                    |
| it find p |  返回第一个满足p的元素或None。注意：如果找到满足条件的元素，迭代器会被置于该元素之后；如果没有找到，会被置于终点。 |
| it indexOf x |  返回it指向的元素中index等于x的第一个元素。注意：迭代器会越过这个元素。 |
| it indexWhere p | 返回it指向的元素中下标满足条件p的元素。注意：迭代器会越过这个元素。 |
| 子迭代器：	 |               |
| it take n | 返回一个包含it指向的前n个元素的新迭代器。注意：it的位置会步进至第n个元素之后，如果it指向的元素数不足n个，迭代器将指向终点。 |
| it drop n |  返回一个指向it所指位置之后第n+1个元素的新迭代器。注意：it将步进至相同位置。 |
| it slice (m,n) | 返回一个新的迭代器，指向it所指向的序列中从开始于第m个元素、结束于第n个元素的片段。 |
| it takeWhile p | 返回一个迭代器，指代从it开始到第一个不满足条件p的元素为止的片段。 |
| it dropWhile p | 返回一个新的迭代器，指向it所指元素中第一个不满足条件p的元素开始直至终点的所有元素。 |
| it filter p | 返回一个新迭代器 ，指向it所指元素中所有满足条件p的元素。 |
| it withFilter p | 同it filter p 一样，用于for表达式。 |
| it filterNot p | 返回一个迭代器，指向it所指元素中不满足条件p的元素。 |
| 拆分（Subdivision）：	|                  |
| it partition p | 将it分为两个迭代器；一个指向it所指元素中满足条件谓词p的元素，另一个指向不满足条件谓词p的元素。 |
| 条件元素（Element Conditions）：	|                        |
| it forall p | 返回一个布尔值，指明it所指元素是否都满足p。 |
| it exists p | 返回一个布尔值，指明it所指元素中是否存在满足p的元素。 |
| it count p | 返回it所指元素中满足条件谓词p的元素总数。 |
| 折叠（Fold）：	|                     |
| (z /: it)(op) | 自左向右在it所指元素的相邻元素间应用二元操作op，初始值为z。|
| (it :\ z)(op) | 自右向左在it所指元素的相邻元素间应用二元操作op，初始值为z。 |
| it.foldLeft(z)(op) | 与(z /: it)(op)相同。 |
| it.foldRight(z)(op) | 与(it :\ z)(op)相同。 |
| it reduceLeft op | 自左向右对非空迭代器it所指元素的相邻元素间应用二元操作op。 |
| it reduceRight op | 自右向左对非空迭代器it所指元素的相邻元素间应用二元操作op。 |
| 特殊折叠（Specific Fold）：	|                |
| it.sum | 返回迭代器it所指数值型元素的和。 |
| it.product | 返回迭代器it所指数值型元素的积。 |
| it.min | 返回迭代器it所指元素中最小的元素。 |
| it.max | 返回迭代器it所指元素中最大的元素。 |
| 拉链方法（Zippers）：	|                    |
| it zip jt | 返回一个新迭代器，指向分别由it和jt所指元素一一对应而成的二元组序列。 |
| it zipAll (jt, x, y) | 返回一个新迭代器，指向分别由it和jt所指元素一一对应而成的二元组序列，长度较短的迭代器会被追加元素x或y，以匹配较长的迭代器。 |
| it.zipWithIndex | 返回一个迭代器，指向由it中的元素及其下标共同构成的二元组序列。 |
| 更新：	   |                 |
| it patch (i, jt, r) | 由it返回一个新迭代器，其中自第i个元素开始的r个元素被迭代器jt所指元素替换。  |
| 比对：	|                   |
| it sameElements jt | 判断迭代器it和jt是否依次返回相同元素注意：it和jt中至少有一个会步进到终点。 |
|字符串（String）：	|                 |
| it addString (b, start, sep, end) |  添加一个字符串到StringBuilder b，该字符串以start为前缀、以end为后缀，中间是以sep分隔的it所指向的所有元素。start、end和sep都是可选项。 |
| it mkString (start, sep, end) | 将it所指所有元素转换成以start为前缀、end为后缀、按sep分隔的字符串。start、sep、end都是可选项。 |

## 带缓冲的迭代器

有时候你可能需要一个支持“预览”功能的迭代器，这样我们既可以看到下一个待返回的元素，又不会令迭代器跨过这个元素。比如有这样一个任务，把迭代器所指元素中的非空元素转化成字符串。你可能会这样写：

    def skipEmptyWordsNOT(it: Iterator[String]) =
      while (it.next().isEmpty) {}

但仔细看看这段代码，就会发现明显的错误：代码确实会跳过空字符串，但同时它也跳过了第一个非空字符串！

要解决这个问题，可以使用带缓冲能力的迭代器。[BufferedIterator]类是[Iterator]的子类，提供了一个附加的方法，head。在BufferedIterator中调用head 会返回它指向的第一个元素，但是不会令迭代器步进。使用BufferedIterator，跳过空字符串的方法可以写成下面这样：

    def skipEmptyWords(it: BufferedIterator[String]) =
      while (it.head.isEmpty) { it.next() }

通过调用buffered方法，所有迭代器都可以转换成BufferedIterator。参见下例：

    scala> val it = Iterator(1, 2, 3, 4)
    it: Iterator[Int] = non-empty iterator
    scala> val bit = it.buffered
    bit: java.lang.Object with scala.collection.
      BufferedIterator[Int] = non-empty iterator
    scala> bit.head
    res10: Int = 1
    scala> bit.next()
    res11: Int = 1
    scala> bit.next()
    res11: Int = 2

注意，调用`BufferedIterator bit`的head方法不会令它步进。因此接下来的`bit.next()`返回的元素跟`bit.head`相同。
