---
layout: multipage-overview
title: 从头定义新容器

discourse: false

partof: collections
overview-name: Collections

num: 16
language: zh-cn
---


我们已经知道`List(1, 2, 3)`可以创建出含有三个元素的列表，用`Map('A' -> 1, 'C' -> 2)`可以创建含有两对绑定的映射。实际上各种Scala容器都支持这一功能。任意容器的名字后面都可以加上一对带参数列表的括号，进而生成一个以这些参数为元素的新容器。不妨再看一些例子：

    Traversable() // 一个空的Traversable对象
    List() // 空列表
    List(1.0, 2.0) // 一个以1.0、2.0为元素的列表
    Vector(1.0, 2.0) // 一个以1.0、2.0为元素的Vector
    Iterator(1, 2, 3) // 一个迭代器，可返回三个整数
    Set(dog, cat, bird) // 一个包含三个动物的集合
    HashSet(dog, cat, bird) // 一个包含三个同样动物的HashSet
    Map('a' -> 7, 'b' -> 0) // 一个将字符映射到整数的Map

实际上，上述每个例子都被“暗地里”转换成了对某个对象的apply方法的调用。例如，上述第三行会展开成如下形式：

    List.apply(1.0, 2.0)

可见，这里调用的是List类的伴生对象的apply方法。该方法可以接受任意多个参数，并将这些参数作为元素，生成一个新的列表。在Scala标准库中，无论是List、Stream、Vector等具体的实现类还是Seq、Set、Traversable等抽象基类，每个容器类都伴一个带apply方法的伴生对象。针对后者，调用apply方法将得到对应抽象基类的某个默认实现，例如：

    scala > List(1,2,3)
    res17: List[Int] = List(1, 2, 3)
    scala> Traversable(1, 2, 3)
    res18: Traversable[Int] = List(1, 2, 3)
    scala> mutable.Traversable(1, 2, 3)
    res19: scala.collection.mutable.Traversable[Int] = ArrayBuffer(1, 2, 3)

除了apply方法，每个容器类的伴生对象还定义了一个名为empty的成员方法，该方法返回一个空容器。也就是说，`List.empty`可以代替`List()`，`Map.empty`可以代替`Map()`，等等。

Seq的子类同样在它们伴生对象中提供了工厂方法，总结如下表。简而言之，有这么一些：

concat，将任意多个Traversable容器串联起来  
fill 和 tabulate，用于生成一维或者多维序列，并用给定的初值或打表函数来初始化。    
range，用于生成步长为step的整型序列，并且iterate，将某个函数反复应用于某个初始元素，从而产生一个序列。  

## 序列的工厂方法

| WHAT IT IS | WHAT IT DOES |
|-------------------|---------------------|
| S.empty | 空序列 |
| S(x, y, z) | 一个包含x、y、z的序列 |
| S.concat(xs, ys, zs) | 将xs、ys、zs串街起来形成一个新序列。 |
| S.fill(n) {e}  | 以表达式e的结果为初值生成一个长度为n的序列。 |
| S.fill(m, n){e} | 以表达式e的结果为初值生成一个维度为m x n的序列（还有更高维度的版本） |
| S.tabulate(n) {f}  | 生成一个厂素为n、第i个元素为f(i)的序列。 |
| S.tabulate(m, n){f} | 生成一个维度为m x n，第(i, j)个元素为f(i, j)的序列（还有更高维度的版本）。 |
| S.range(start, end) | start, start + 1, ... end-1的序列。（译注：注意始左闭右开区间） |
| S.range(start, end, step) | 生成以start为起始元素、step为步长、最大值不超过end的递增序列（左闭右开）。 |
| S.iterate(x, n)(f) | 生成一个长度为n的序列，其元素值分别为x、f(x)、f(f(x))、…… |
