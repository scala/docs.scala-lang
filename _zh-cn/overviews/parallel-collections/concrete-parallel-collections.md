---
layout: multipage-overview
title: 具体并行集合类
partof: parallel-collections
overview-name: Parallel Collections

num: 2
language: zh-cn
---

### 并行数组(Parallel Range)

一个并行数组由线性、连续的数组元素序列。这意味着这些元素可以高效的被访问和修改。正因为如此，遍历元素也是非常高效的。在此意义上并行数组就是一个大小固定的数组。

    scala> val pa = scala.collection.parallel.mutable.ParArray.tabulate(1000)(x => 2 * x + 1)
    pa: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 3, 5, 7, 9, 11, 13,...

    scala> pa reduce (_ + _)
    res0: Int = 1000000

    scala> pa map (x => (x - 1) / 2)
    res1: scala.collection.parallel.mutable.ParArray[Int] = ParArray(0, 1, 2, 3, 4, 5, 6, 7,...

在内部，分离一个并行数组[分离器](https://docs.scala-lang.org/overviews/parallel-collections/architecture.html)相当于使用它们的下标迭代器更新来创建两个分离器。[组合](https://docs.scala-lang.org/overviews/parallel-collections/architecture.html)稍微负责一点。因为大多数的分离方法(如：flatmap, filter, takeWhile等)我们不能预先知道元素的个数（或者数组的大小），每一次组合本质上来说是一个数组缓冲区的一种变量根据分摊时间来进行加减的操作。不同的处理器进行元素相加操作，对每个独立并列数组进行组合，然后根据其内部连结在再进行组合。在并行数组中的基础数组只有在知道元素的总数之后才能被分配和填充。基于此，变换方法比存取方法要稍微复杂一些。另外，请注意，最终数组分配在JVM上的顺序进行，如果映射操作本身是很便宜，这可以被证明是一个序列瓶颈。

通过调用seq方法，并行数组(parallel arrays)被转换为对应的顺序容器(sequential collections) ArraySeq。这种转换是非常高效的，因为新创建的ArraySeq 底层是通过并行数组(parallel arrays)获得的。

### 并行向量(Parallel Vector)

这个并行向量是一个不可变数列，低常数因子数的访问和更新的时间。

    scala> val pv = scala.collection.parallel.immutable.ParVector.tabulate(1000)(x => x)
    pv: scala.collection.parallel.immutable.ParVector[Int] = ParVector(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,...

    scala> pv filter (_ % 2 == 0)
    res0: scala.collection.parallel.immutable.ParVector[Int] = ParVector(0, 2, 4, 6, 8, 10, 12, 14, 16, 18,...
不可变向量表现为32叉树，因此[分离器]通过将子树分配到每个分离器(spliter)来分离。[组合(combiners)]存储元素的向量并通过懒惰(lazily)拷贝来组合元素。因此，转换方法相对于并行数组来说可伸缩性较差。一旦串联操作在将来scala的发布版本中成为可变的，组合器将会使得串联和变量器方法更加有效率。

并行向量是一个连续[向量]的并行副本，因此两者之间的转换需要一定的时间。

### 并行范围(Parallel Range)

一个ParRange表示的是一个有序的等差整数数列。一个并行范围(parallel range)的创建方法和一个顺序范围的创建类似。

    scala> 1 to 3 par
    res0: scala.collection.parallel.immutable.ParRange = ParRange(1, 2, 3)

    scala> 15 to 5 by -2 par
    res1: scala.collection.parallel.immutable.ParRange = ParRange(15, 13, 11, 9, 7, 5)

正如顺序范围有没有创建者(builders)，平行的范围(parallel ranges)有没有组合者(combiners)。映射一个并行范围的元素来产生一个并行向量。顺序范围(sequential ranges)和并行范围(parallel ranges)能够被高效的通过seq和par方法进行转换。

### 并行哈希表(Parallel Hash Tables)

并行哈希表存储在底层数组的元素，并将它们放置在由各自元素的哈希码的位置。并行不变的哈希集(set)（[mutable.ParHashSet](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/parallel/mutable/ParHashSet.html)）和并行不变的哈希映射([mutable.ParHashMap](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/parallel/mutable/ParHashMap.html)) 是基于哈希表的。

    scala> val phs = scala.collection.parallel.mutable.ParHashSet(1 until 2000: _*)
    phs: scala.collection.parallel.mutable.ParHashSet[Int] = ParHashSet(18, 327, 736, 1045, 773, 1082,...

    scala> phs map (x => x * x)
    res0: scala.collection.parallel.mutable.ParHashSet[Int] = ParHashSet(2181529, 2446096, 99225, 2585664,...

并行哈希表组合器元素排序是依据他们的哈希码前缀在桶(buckets)中进行的。它们通过简单地连接这些桶在一起。一旦最后的哈希表被构造出来（如：组合结果的方法被调用），基本数组分配和从不同的桶元素复制在平行于哈希表的数组不同的相邻节段。

连续的哈希映射和散列集合可以被转换成并行的变量使用par方法。并行哈希表内在上要求一个映射的大小在不同块的哈希表元素的数目。这意味着，一个连续的哈希表转换为并行哈希表的第一时间，表被遍历并且size map被创建，因此，第一次调用par方法的时间是和元素个数成线性关系的。进一步修改的哈希表的映射大小保持状态，所以以后的转换使用PAR和序列具有常数的复杂性。使用哈希表的usesizemap方法，映射大小的维护可以开启和关闭。重要的是，在连续的哈希表的修改是在并行哈希表可见，反之亦然。

### 并行散列Tries(Parallel Hash Tries)

并行hash tries是不可变(immutable)hash tries的并行版本，这种结果可以用来高效的维护不可变集合(immutable set)和不可变关联数组(immutable map)。他们都支持类[immutable.ParHashSet](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/parallel/immutable/ParHashSet.html)和[immutable.ParHashMap](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/parallel/immutable/ParHashMap.html)。

    scala> val phs = scala.collection.parallel.immutable.ParHashSet(1 until 1000: _*)
    phs: scala.collection.parallel.immutable.ParHashSet[Int] = ParSet(645, 892, 69, 809, 629, 365, 138, 760, 101, 479,...

    scala> phs map { x => x * x } sum
    res0: Int = 332833500

类似于平行散列哈希表，parallel hash trie在桶(buckets)里预排序这些元素和根据不同的处理器分配不同的桶(buckets) parallel hash trie的结果，这些构建subtrie是独立的。

并行散列试图可以来回转换的，顺序散列试图利用序列和时间常数的方法。

### 并行并发tries(Parallel Concurrent Tries)

[ concurrent.triemap ](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/concurrent/TrieMap.html)是竞争对手的线程安全的地图，而[ mutable.partriemap ](https://www.scala-lang.org/api/{{ site.scala-212-version}}/scala/collection/parallel/mutable/ParTrieMap.html) 是他的并行副本。如果这个数据结构在遍历的过程中被修改了，大多数竞争对手的数据结构不能确保一致遍历，尝试确保在下一次迭代中更新是可见的。这意味着，你可以在尝试遍历的时候改变这些一致性，如下例子所示输出1到99的平方根。

    scala> val numbers = scala.collection.parallel.mutable.ParTrieMap((1 until 100) zip (1 until 100): _*) map { case (k, v) => (k.toDouble, v.toDouble) }
    numbers: scala.collection.parallel.mutable.ParTrieMap[Double,Double] = ParTrieMap(0.0 -> 0.0, 42.0 -> 42.0, 70.0 -> 70.0, 2.0 -> 2.0,...

    scala> while (numbers.nonEmpty) {
         | numbers foreach { case (num, sqrt) =>
         | val nsqrt = 0.5 * (sqrt + num / sqrt)
         | numbers(num) = nsqrt
         | if (math.abs(nsqrt - sqrt) < 0.01) {
         | println(num, nsqrt)
         | numbers.remove(num)
         | }
         | }
         | }
    (1.0,1.0)
    (2.0,1.4142156862745097)
    (7.0,2.64576704419029)
    (4.0,2.0000000929222947)
    ...

合成器是引擎盖下triemaps实施——因为这是一个并行数据结构，只有一个组合构建整个变压器的方法调用和所有处理器共享。

与所有的并行可变容器(collections)，Triemaps和并行partriemaps通过调用序列或PAR方法得到了相同的存储支持，所以修改在一个在其他可见。转换发生在固定的时间。

### 性能特征

顺序类型(sequence types)的性能特点：

|               | head | tail | apply | update| prepend | append | insert |
| --------      | ---- | ---- | ----  | ----  | ----    | ----   | ----   |
| `ParArray`    | C    | L    | C     | C     |  L      | L      |  L     |
| `ParVector`   | eC   | eC   | eC    | eC    |  eC     | eC     |  -     |
| `ParRange`    | C    | C    | C     | -     |  -      | -      |  -     |

性能特征集(set)和映射类型：

|                          | lookup | add  | remove |
| --------                 | ----   | ---- | ----   |
| **immutable**            |        |      |        |
| `ParHashSet`/`ParHashMap`| eC     | eC   | eC     |
| **mutable**              |        |      |        |
| `ParHashSet`/`ParHashMap`| C      | C    | C      |
| `ParTrieMap`             | eC     | eC   | eC     |


####Key

上述两个表的条目，说明如下：

|C |该操作需要的时间常数（快）|
|-----|------------------------|
|eC|该操作需要有效的常数时间，但这可能依赖于一些假设，如一个向量或分配哈希键的最大长度。|
|aC|该操作需要分期常量时间。一些调用的操作可能需要更长的时间，但是如果很多操作都是在固定的时间就可以使用每个操作的平均了。|
|Log|该操作需要collection大小的对数时间比例。|
|L|这个操作是线性的，需要collection大小的时间比例。|
|-|这个操作是不被支持的。|
第一个表处理序列类型--可变和不可变--使用以下操作：|

| head | 选择序列的第一个元素。|
|-----|------------------------|
|tail|产生一个由除了第一个元素的所有元素组成的新的序列。|
|apply|标引，索引|
|update|对于不可变(immutable sequence)执行函数式更新(functional update)，对于可变数据执行带有副作用(side effect)的更新。|
|prepend|在序列的前面添加一个元素。 针对不可变的序列，这将产生一个新的序列，针对可变序列这将修改已经存在的序列。|
|append|在序列结尾添加一个元素。针对不可变的序列，这将产生一个新的序列，针对可变序列这将修改已经存在的序列。|
|insert|在序列中的任意位置插入一个元素。这是可变序列(mutable sequence)唯一支持的操作。|

第二个表处理可变和不可变集合(set)与关联数组(map)使用以下操作：

|lookup| 测试一个元素是否包含在集合，或选择一个键所关联的值。|
|-----|------------------------|
|add | 新增一个元素到集合(set)或者键/值匹配映射。|
|remove|从集合(set)或者关键映射中移除元素。|
|min|集合(set)中最小的元素，或者关联数组(map)中的最小的键(key)。|
