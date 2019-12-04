---
layout: multipage-overview
title: 序列trait：Seq、IndexedSeq及LinearSeq
partof: collections
overview-name: Collections

num: 5
language: zh-cn
---


[Seq](https://www.scala-lang.org/api/current/scala/collection/Seq.html) trait用于表示序列。所谓序列，指的是一类具有一定长度的可迭代访问的对象，其中每个元素均带有一个从0开始计数的固定索引位置。

序列的操作有以下几种，如下表所示：

- **索引和长度的操作** apply、isDefinedAt、length、indices，及lengthCompare。序列的apply操作用于索引访问；因此，Seq[T]类型的序列也是一个以单个Int（索引下标）为参数、返回值类型为T的偏函数。换言之，Seq[T]继承自Partial Function[Int, T]。序列各元素的索引下标从0开始计数，最大索引下标为序列长度减一。序列的length方法是collection的size方法的别名。lengthCompare方法可以比较两个序列的长度，即便其中一个序列长度无限也可以处理。  
- **索引检索操作**（indexOf、lastIndexOf、indexofSlice、lastIndexOfSlice、indexWhere、lastIndexWhere、segmentLength、prefixLength）用于返回等于给定值或满足某个谓词的元素的索引。  
- **加法运算**（+:，:+，padTo）用于在序列的前面或者后面添加一个元素并作为新序列返回。  
- **更新操作**（updated，patch）用于替换原序列的某些元素并作为一个新序列返回。  
- **排序操作**（sorted, sortWith, sortBy）根据不同的条件对序列元素进行排序。  
- **反转操作**（reverse, reverseIterator, reverseMap）用于将序列中的元素以相反的顺序排列。  
- **比较**（startsWith, endsWith, contains, containsSlice, corresponds）用于对两个序列进行比较，或者在序列中查找某个元素。  
- **多集操作**（intersect, diff, union, distinct）用于对两个序列中的元素进行类似集合的操作，或者删除重复元素。

如果一个序列是可变的，它提供了另一种更新序列中的元素的，但有副作用的update方法，Scala中常有这样的语法，如seq(idx) = elem。它只是seq.update(idx, elem)的简写，所以update 提供了方便的赋值语法。应注意update 和updated之间的差异。update 再原来基础上更改序列中的元素，并且仅适用于可变序列。而updated 适用于所有的序列，它总是返回一个新序列，而不会修改原序列。  

### Seq类的操作

| WHAT IT IS | WHAT IT DOES   |
|------------------ | -------------------|
| **索引和长度**	 |            |
| xs(i) | (或者写作xs apply i)。xs的第i个元素 |
| xs isDefinedAt i | 测试xs.indices中是否包含i。 |
| xs.length | 序列的长度（同size）。 |
| xs.lengthCompare ys | 如果xs的长度小于ys的长度，则返回-1。如果xs的长度大于ys的长度，则返回+1，如果它们长度相等，则返回0。即使其中一个序列是无限的，也可以使用此方法。 |
| xs.indices | xs的索引范围，从0到xs.length - 1。 |
| **索引搜索** | 	      |
| xs indexOf x | 返回序列xs中等于x的第一个元素的索引（存在多种变体）。 |
| xs lastIndexOf x | 返回序列xs中等于x的最后一个元素的索引（存在多种变体）。 |
| xs indexOfSlice ys | 查找子序列ys，返回xs中匹配的第一个索引。 |
| xs lastIndexOfSlice ys | 查找子序列ys，返回xs中匹配的倒数一个索引。 |
| xs indexWhere p | xs序列中满足p的第一个元素。（有多种形式） |
| xs segmentLength (p, i) | xs中，从xs(i)开始并满足条件p的元素的最长连续片段的长度。 |
| xs prefixLength p | xs序列中满足p条件的先头元素的最大个数。 |
| **加法：** | 	     |
| x +: xs | 由序列xs的前方添加x所得的新序列。 |
| xs :+ x | 由序列xs的后方追加x所得的新序列。 |
| xs padTo (len, x) | 在xs后方追加x，直到长度达到len后得到的序列。 |
| **更新** | 	               |
| xs patch (i, ys, r) | 将xs中第i个元素开始的r个元素，替换为ys所得的序列。 |
| xs updated (i, x) | 将xs中第i个元素替换为x后所得的xs的副本。 |
| xs(i) = x | （或写作 xs.update(i, x)，仅适用于可变序列）将xs序列中第i个元素修改为x。 |
| **排序** | 	                   |
| xs.sorted | 通过使用xs中元素类型的标准顺序，将xs元素进行排序后得到的新序列。 |
| xs sortWith lt | 将lt作为比较操作，并以此将xs中的元素进行排序后得到的新序列。 |
| xs sortBy f | 将序列xs的元素进行排序后得到的新序列。参与比较的两个元素各自经f函数映射后得到一个结果，通过比较它们的结果来进行排序。 |
| **反转** | 	             |
| xs.reverse | 与xs序列元素顺序相反的一个新序列。 |
| xs.reverseIterator | 产生序列xs中元素的反序迭代器。 |
| xs reverseMap f | 以xs的相反顺序，通过f映射xs序列中的元素得到的新序列。 |
| **比较** |              |
| xs startsWith ys | 测试序列xs是否以序列ys开头（存在多种形式）。 |
| xs endsWith ys | 测试序列xs是否以序列ys结束（存在多种形式）。 |
| xs contains x | 测试xs序列中是否存在一个与x相等的元素。 |
| xs containsSlice ys | 测试xs序列中是否存在一个与ys相同的连续子序列。 |
| (xs corresponds ys)(p) | 测试序列xs与序列ys中对应的元素是否满足二元的判断式p。 |
| **多集操作** | 	      |
| xs intersect ys | 序列xs和ys的交集，并保留序列xs中的顺序。 |
| xs diff ys | 序列xs和ys的差集，并保留序列xs中的顺序。 |
| xs union ys | 并集；同xs ++ ys。 |
| xs.distinct | 不含重复元素的xs的子序列。 |   
|            |              |  


特性（trait) [Seq](https://www.scala-lang.org/api/current/scala/collection/Seq.html) 具有两个子特征（subtrait） [LinearSeq](https://www.scala-lang.org/api/current/scala/collection/IndexedSeq.html)和[IndexedSeq](https://www.scala-lang.org/api/current/scala/collection/IndexedSeq.html)。它们不添加任何新的操作，但都提供不同的性能特点：线性序列具有高效的 head 和 tail 操作，而索引序列具有高效的apply, length, 和 (如果可变) update操作。

常用线性序列有 `scala.collection.immutable.List`和`scala.collection.immutable.Stream`。常用索引序列有 `scala.Array scala.collection.mutable.ArrayBuffer`。Vector 类提供一个在索引访问和线性访问之间有趣的折中。它同时具有高效的恒定时间的索引开销，和恒定时间的线性访问开销。正因为如此，对于混合访问模式，vector是一个很好的基础。后面将详细介绍vector。

### 缓冲器

Buffers是可变序列一个重要的种类。它们不仅允许更新现有的元素，而且允许元素的插入、移除和在buffer尾部高效地添加新元素。buffer 支持的主要新方法有：用于在尾部添加元素的 `+=` 和 `++=`；用于在前方添加元素的`+=: `和` ++=:` ；用于插入元素的 `insert`和`insertAll`；以及用于删除元素的` remove` 和 `-=`。如下表所示。  

ListBuffer和ArrayBuffer是常用的buffer实现 。顾名思义，ListBuffer依赖列表（List），支持高效地将它的元素转换成列表。而ArrayBuffer依赖数组（Array），能快速地转换成数组。  

#### Buffer类的操作

| WHAT IT IS | WHAT IT DOES |
|--------------------- | -----------------------|
| **加法：**	|                 |
| buf += x | 将元素x追加到buffer，并将buf自身作为结果返回。 |
| buf += (x, y, z) | 将给定的元素追加到buffer。 |
| buf ++= xs | 将xs中的所有元素追加到buffer。 |
| x +=: buf | 将元素x添加到buffer的前方。 |
| xs ++=: buf | 将xs中的所有元素都添加到buffer的前方。 |
| buf insert (i, x) | 将元素x插入到buffer中索引为i的位置。 |
| buf insertAll (i, xs) | 将xs的所有元素都插入到buffer中索引为i的位置。 |
| **移除：**	 |              |
| buf -= x | 将元素x从buffer中移除。 |
| buf remove i | 将buffer中索引为i的元素移除。 |
| buf remove (i, n) | 将buffer中从索引i开始的n个元素移除。 |
| buf trimStart n | 移除buffer中的前n个元素。 |
| buf trimEnd n | 移除buffer中的后n个元素。 |
| buf.clear() | 移除buffer中的所有元素。 |
| **克隆：**	 |            |
| buf.clone | 与buf具有相同元素的新buffer。 |
