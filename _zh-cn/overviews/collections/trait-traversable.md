---
layout: multipage-overview
title: Trait Traversable

discourse: false

partof: collections
overview-name: Collections

num: 3
language: zh-cn
---

Traversable（遍历）是容器(collection)类的最高级别特性，它唯一的抽象操作是foreach:

`def foreach[U](f: Elem => U) `

需要实现Traversable的容器(collection)类仅仅需要定义与之相关的方法，其他所有方法可都可以从Traversable中继承。

foreach方法用于遍历容器（collection）内的所有元素和每个元素进行指定的操作（比如说f操作）。操作类型是Elem => U，其中Elem是容器（collection）中元素的类型，U是一个任意的返回值类型。对f的调用仅仅是容器遍历的副作用，实际上所有函数f的计算结果都被foreach抛弃了。

Traversable同时定义的很多具体方法，如下表所示。这些方法可以划分为以下类别：

- **相加操作++（addition）**表示把两个traversable对象附加在一起或者把一个迭代器的所有元素添加到traversable对象的尾部。

- **Map**操作有map，flatMap和collect，它们可以通过对容器中的元素进行某些运算来生成一个新的容器。

- **转换器（Conversion）**操作包括toArray，toList，toIterable，toSeq，toIndexedSeq，toStream，toSet，和toMap，它们可以按照某种特定的方法对一个Traversable 容器进行转换。等容器类型已经与所需类型相匹配的时候，所有这些转换器都会不加改变的返回该容器。例如，对一个list使用toList，返回的结果就是list本身。

- **拷贝（Copying）**操作有copyToBuffer和copyToArray。从字面意思就可以知道，它们分别用于把容器中的元素元素拷贝到一个缓冲区或者数组里。

- **Size info**操作包括有isEmpty，nonEmpty，size和hasDefiniteSize。Traversable容器有有限和无限之分。比方说，自然数流Stream.from(0)就是一个无限的traversable 容器。hasDefiniteSize方法能够判断一个容器是否可能是无限的。若hasDefiniteSize返回值为ture，容器肯定有限。若返回值为false，根据完整信息才能判断容器（collection）是无限还是有限。

- **元素检索（Element Retrieval）**操作有head，last，headOption，lastOption和find。这些操作可以查找容器的第一个元素或者最后一个元素，或者第一个符合某种条件的元素。注意，尽管如此，但也不是所有的容器都明确定义了什么是“第一个”或”最后一个“。例如，通过哈希值储存元素的哈希集合（hashSet），每次运行哈希值都会发生改变。在这种情况下，程序每次运行都可能会导致哈希集合的”第一个“元素发生变化。如果一个容器总是以相同的规则排列元素，那这个容器是有序的。大多数容器都是有序的，但有些不是（例如哈希集合）-- 排序会造成一些额外消耗。排序对于重复性测试和辅助调试是不可或缺的。这就是为什么Scala容器中的所有容器类型都把有序作为可选项。例如，带有序性的HashSet就是LinkedHashSet。

- **子容器检索（sub-collection Retrieval）**操作有tail，init，slice，take，drop，takeWhilte，dropWhile，filter，filteNot和withFilter。它们都可以通过范围索引或一些论断的判断返回某些子容器。

- **拆分（Subdivision）**操作有splitAt，span，partition和groupBy，它们用于把一个容器（collection）里的元素分割成多个子容器。

- **元素测试（Element test）**包括有exists，forall和count，它们可以用一个给定论断来对容器中的元素进行判断。

- **折叠（Folds）**操作有foldLeft，foldRight，/:，:\，reduceLeft和reduceRight，用于对连续性元素的二进制操作。

- **特殊折叠（Specific folds）**包括sum, product, min, max。它们主要用于特定类型的容器（数值或比较）。

- **字符串（String）**操作有mkString，addString和stringPrefix，可以将一个容器通过可选的方式转换为字符串。

- **视图（View）**操作包含两个view方法的重载体。一个view对象可以当作是一个容器客观地展示。接下来将会介绍更多有关视图内容。

## Traversable对象的操作

|     WHAT IT IS          |WHAT IT DOES           |
|------------------------|------------------------------|
|  **抽象方法：** 	|              |
| xs foreach f | 对xs中的每一个元素执行函数f |
|  **加运算（Addition）：**  | 	              |
| xs ++ ys	| 生成一个由xs和ys中的元素组成容器。ys是一个TraversableOnce容器，即Taversable类型或迭代器。
|  **Maps:**	 |                |
| xs map f	| 通过函数xs中的每一个元素调用函数f来生成一个容器。 |
| xs flatMap f	| 通过对容器xs中的每一个元素调用作为容器的值函数f，在把所得的结果连接起来作为一个新的容器。 |
| xs collect f	| 通过对每个xs中的符合定义的元素调用偏函数f，并把结果收集起来生成一个集合。 |
|  **转换（Conversions）：**	  | 	             |
| xs.toArray	| 把容器转换为一个数组 |
| xs.toList	| 把容器转换为一个list |
| xs.toIterable	| 把容器转换为一个迭代器。 |
| xs.toSeq	| 把容器转换为一个序列 |
| xs.toIndexedSeq	| 把容器转换为一个索引序列 |
| xs.toStream	| 把容器转换为一个延迟计算的流。 |
| xs.toSet	| 把容器转换为一个集合（Set）。 |
| xs.toMap	| 把由键/值对组成的容器转换为一个映射表（map）。如果该容器并不是以键/值对作为元素的，那么调用这个操作将会导致一个静态类型的错误。 |
|  **拷贝（Copying）：**	  | 	                    |
| xs copyToBuffer buf	| 把容器的所有元素拷贝到buf缓冲区。 |
| xs copyToArray(arr, s, n)	| 拷贝最多n个元素到数组arr的坐标s处。参数s，n是可选项。 |
|  **大小判断（Size info）：**	  | 	             |
| xs.isEmpty	| 测试容器是否为空。 |
| xs.nonEmpty	| 测试容器是否包含元素。 |
| xs.size	| 计算容器内元素的个数。 |
| xs.hasDefiniteSize	| 如果xs的大小是有限的，则为true。 |
|  **元素检索（Element Retrieval）：**  	|                 	 |
| xs.head	| 返回容器内第一个元素（或其他元素，若当前的容器无序）。 |
| xs.headOption	| xs选项值中的第一个元素，若xs为空则为None。 |
| xs.last	| 返回容器的最后一个元素（或某个元素，如果当前的容器无序的话）。 |
| xs.lastOption	| xs选项值中的最后一个元素，如果xs为空则为None。 |
| xs find p	| 查找xs中满足p条件的元素，若存在则返回第一个元素；若不存在，则为空。 |
|  **子容器（Subcollection）：**	   | 	           |
| xs.tail	| 返回由除了xs.head外的其余部分。 |
| xs.init	| 返回除xs.last外的其余部分。 |
| xs slice (from, to)	| 返回由xs的一个片段索引中的元素组成的容器（从from到to，但不包括to）。 |
| xs take n	| 由xs的第一个到第n个元素（或当xs无序时任意的n个元素）组成的容器。 |
| xs drop n	| 由除了xs take n以外的元素组成的容器。 |
| xs takeWhile p	| 容器xs中最长能够满足断言p的前缀。 |
| xs dropWhile p	| 容器xs中除了xs takeWhile p以外的全部元素。 |
| xs filter p	| 由xs中满足条件p的元素组成的容器。 |
| xs withFilter p	| 这个容器是一个不太严格的过滤器。子容器调用map，flatMap，foreach和withFilter只适用于xs中那些的满足条件p的元素。 |
| xs filterNot p	| 由xs中不满足条件p的元素组成的容器。 |
|  **拆分（Subdivision）：**  	| 	           |
| xs splitAt n	| 把xs从指定位置的拆分成两个容器（xs take n和xs drop n）。 |
| xs span p	| 根据一个断言p将xs拆分为两个容器（xs takeWhile p, xs.dropWhile p）。 |
| xs partition p	| 把xs分割为两个容器，符合断言p的元素赋给一个容器，其余的赋给另一个(xs filter p, xs.filterNot p)。 |
| xs groupBy f	| 根据判别函数f把xs拆分一个到容器（collection）的map中。 |
|  **条件元素（Element Conditions）：**	|                   |
| xs forall p	| 返回一个布尔值表示用于表示断言p是否适用xs中的所有元素。 |
| xs exists p	| 返回一个布尔值判断xs中是否有部分元素满足断言p。 |
| xs count p	| 返回xs中符合断言p条件的元素个数。 |
|  **折叠（Fold）：**		|                    |
| (z /: xs)(op)	| 在xs中，对由z开始从左到右的连续元素应用二进制运算op。 |
| (xs :\ z)(op)	| 在xs中，对由z开始从右到左的连续元素应用二进制运算op |
| xs.foldLeft(z)(op)	| 与(z /: xs)(op)相同。 |
| xs.foldRight(z)(op)	| 与 (xs :\ z)(op)相同。 |
| xs reduceLeft op	| 非空容器xs中的连续元素从左至右调用二进制运算op。 |
| xs reduceRight op	| 非空容器xs中的连续元素从右至左调用二进制运算op。 |
|  **特殊折叠（Specific Fold）：**  	| 	                |
| xs.sum	| 返回容器xs中数字元素的和。 |
| xs.product	| xs返回容器xs中数字元素的积。 |
| xs.min	| 容器xs中有序元素值中的最小值。 |
| xs.max	| 容器xs中有序元素值中的最大值。 |
|  **字符串（String）：**		|                 |
| xs addString (b, start, sep, end)	| 把一个字符串加到StringBuilder对象b中，该字符串显示为将xs中所有元素用分隔符sep连接起来并封装在start和end之间。其中start，end和sep都是可选的。 |
| xs mkString (start, sep, end)	| 把容器xs转换为一个字符串，该字符串显示为将xs中所有元素用分隔符sep连接起来并封装在start和end之间。其中start，end和sep都是可选的。 |
| xs.stringPrefix	| 返回一个字符串，该字符串是以容器名开头的xs.toString。 |
|  **视图（View）：**	 | 	                 |
| xs.view	| 通过容器xs生成一个视图。 |
| xs view (from, to)	| 生成一个表示在指定索引范围内的xs元素的视图。 |
