---
layout: multipage-overview
title: 并行容器的转换

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 3
language: zh-cn
---

### 顺序容器和并行容器之间的转换

每个顺序容器都可以使用par方法转换成它的并行形式。某些顺序容器具有直接的并行副本。对于这些容器，转换是非常高效的（它所需的时间是个常量），因为顺序容器和并行容器具有相同的数据结构上的表现形式（其中一个例外是可变hash map和hash set，在第一次调用par进行转换时，消耗略高，但以后对par的调用将只消耗常数时间）。要注意的是，对于可变容器，如果顺序容器和并行容器共享底层数据结构，那么对顺序容器的修改也会在他的并行副本中可见。

| 顺序 |并行 |
|------|-----|
|可变性(mutable)|          |
|Array|ParArray|
|HashMap| ParHashMap|
|HashSet| ParHashSet|
|TrieMap| ParTrieMap|
|不可变性(immutable)|         |
|Vector | ParVector|
|Range | ParRange|
|HashMap | ParHashMap|
|HashSet | ParHashSet|

其他容器，如列表（list），队列（queue）及流（stream），从“元素必须逐个访问”这个意义上来讲，天生就是顺序容器。它们可以通过将元素拷贝到类似的并行容器的方式转换成其并行形式。例如，函数式列表可以转换成标准的非可变并行序列，即并行向量。

所有的并行容器都可以用 seq 方法转换成其顺序形式。从并行容器转换成顺序容器的操作总是很高效（耗费常数时间）。在可变并行容器上调用seq方法，会生成一个顺序容器，并使用相同的存储空间。对其中一个容器的更新会同时反映到另一个容器上。

### 不同类型容器之间的转换

通过顺序容器和并行容器之间的正交变换，容器可以在不同容器类型之间相互转换。例如，调用toSeq会将顺序集合转变成顺序序列，而在并行集合上调用toSeq，会将它转换成一个并行序列。基本规律是：如果存在一个X的并行版本，那么toX方法会将容器转换成ParX容器。

下面是对所有转换方法的总结：

|方法 |	返回值类型 |
|----------|-----------|
|toArray | Array |
|toList | List |
|toIndexedSeq | IndexedSeq |
|toStream | Stream |
|toIterator | Iterator |
|toBuffer | Buffer |
|toTraversable | GenTraverable |
|toIterable | ParIterable |
|toSeq | ParSeq |
|toSet | ParSet |
|toMap | ParMap |
