---
layout: multipage-overview
title: 并发字典树

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 4
language: zh-cn
---


对于大多数并发数据结构，如果在遍历中途数据结构发生改变，都不保证遍历的一致性。实际上，大多数可变容器也都是这样。并发字典树允许在遍历时修改Trie自身，从这个意义上来讲是特例。修改只影响后续遍历。顺序并发字典树及其对应的并行字典树都是这样处理。它们之间唯一的区别是前者是顺序遍历，而后者是并行遍历。

这是一个很好的性质，可以让一些算法实现起来更加的容易。常见的是迭代处理数据集元素的一些算法。在这样种场景下，不同的元素需要不同次数的迭代以进行处理。

下面的例子用于计算一组数据的平方根。每次循环反复更新平方根值。数据的平方根收敛，就把它从映射中删除。

    case class Entry(num: Double) {
      var sqrt = num
    }

    val length = 50000

    // 准备链表
    val entries = (1 until length) map { num => Entry(num.toDouble) }
    val results = ParTrieMap()
    for (e <- entries) results += ((e.num, e))

    //  计算平方根
    while (results.nonEmpty) {
      for ((num, e) <- results) {
        val nsqrt = 0.5 * (e.sqrt + e.num / e.sqrt)
        if (math.abs(nsqrt - e.sqrt) < 0.01) {
          results.remove(num)
        } else e.sqrt = nsqrt
      }
    }

注意，在上面的计算平方根的巴比伦算法([3](http://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method))中，某些数据会比别的数据收敛的更快。基于这个因素，我们希望能够尽快把他们从结果中剔除，只遍历那些真正需要耗时处理的元素。

另一个例子是广度优先搜索算法，该算法迭代地在末端节点遍历，直到找到通往目标的路径，或遍历完所有周围节点。一个二维地图上的节点定义为Int的元组。map定义为二维布尔值数组，用来表示各个位置是否已经到达。然后，定义2个并行字典树映射，open和closed。其中，映射open保存接着需要被遍历的末端节点。映射closed保存所有已经被遍历过的节点。映射open使用恰当节点来初始化，用以从地图的一角开始搜索，并找到通往地图中心的路径。随后，并行地对映射open中的所有节点迭代遍历，直到没有节点可以遍历。每次一个节点被遍历时，将它从映射open中移除，并放置在映射closed中。一旦执行完成，输出从目标节点到初始节点的路径。
（译者注：如扫雷，不断判断当前位置（末端节点）上下左右是否为地雷（二维布尔数组），从起始位置逐渐向外扩张。）

    val length = 1000

    //定义节点类型
    type Node = (Int, Int);
    type Parent = (Int, Int);

    //定义节点类型上的操作
    def up(n: Node) = (n._1, n._2 - 1);
    def down(n: Node) = (n._1, n._2 + 1);
    def left(n: Node) = (n._1 - 1, n._2);
    def right(n: Node) = (n._1 + 1, n._2);

    // 创建一个map及一个target
    val target = (length / 2, length / 2);
    val map = Array.tabulate(length, length)((x, y) => (x % 3) != 0 || (y % 3) != 0 || (x, y) == target)
    def onMap(n: Node) = n._1 >= 0 && n._1 < length && n._2 >= 0 && n._2 < length

    //open列表 - 前节点
    // closed 列表 - 已处理的节点
    val open = ParTrieMap[Node, Parent]()
    val closed = ParTrieMap[Node, Parent]()

    // 加入一对起始位置
    open((0, 0)) = null
    open((length - 1, length - 1)) = null
    open((0, length - 1)) = null
    open((length - 1, 0)) = null

    //  贪婪广度优先算法路径搜索
    while (open.nonEmpty && !open.contains(target)) {
      for ((node, parent) <- open) {
        def expand(next: Node) {
          if (onMap(next) && map(next._1)(next._2) && !closed.contains(next) && !open.contains(next)) {
            open(next) = node
          }
        }
        expand(up(node))
        expand(down(node))
        expand(left(node))
        expand(right(node))
        closed(node) = parent
        open.remove(node)
      }
    }

    // 打印路径
    var pathnode = open(target)
    while (closed.contains(pathnode)) {
      print(pathnode + "->")
      pathnode = closed(pathnode)
    }
    println()
例如，GitHub上个人生游戏的示例，就是使用Ctries去选择性地模拟人生游戏中当前活跃的机器人([4](https://github.com/axel22/ScalaDays2012-TrieMap))。它还基于Swing实现了模拟的人生游戏的视觉化，以便很直观地观察到调整参数是如何影响执行。

并发字典树也支持线性化、无锁、及定时快照操作。这些操作会利用特定时间点上的所有元素来创建新并发 字典树。因此，实际上捕获了特定时间点上的字典树状态。快照操作仅仅为并发字典树生成一个新的根。子序列采用惰性更新的策略，只重建与更新相关的部分，其余部分保持原样。首先，这意味着，由于不需要拷贝元素，自动快照操作资源消耗较少。其次，写时拷贝优化策略只拷贝并发字典树的部分，后续的修改可以横向展开。readOnlySnapshot方法比Snapshot方法效率略高，但它返回的是无法修改的只读的映射。并发字典树也支持线性化，定时清除操作基于快照机制。了解更多关于并发字典树及快照的工作方式，请参阅 ([1](http://infoscience.epfl.ch/record/166908/files/ctries-techreport.pdf)) 和 ([2](http://lampwww.epfl.ch/~prokopec/ctries-snapshot.pdf)).

并发字典树的迭代器基于快照实现。在迭代器对象被创建之前，会创建一个并发字典树的快照，所以迭代器只在字典树的快照创建时的元素中进行遍历。当然，迭代器使用只读快照。

size操作也基于快照。一种直接的实现方式是，size调用仅仅生成一个迭代器（也就是快照），通过遍历来计数。这种方式的效率是和元素数量线性相关的。然而，并发字典树通过缓存其不同部分优化了这个过程，由此size方法的时间复杂度降低到了对数时间。实际上这意味着，调用过一次size方法后，以后对call的调用将只需要最少量的工作。典型例子就是重新计算上次调用size之后被修改了的字典数分支。此外，并行的并发字典树的size计算也是并行的。

**引用**

[缓存感知无锁并发哈希字典树][1](http://infoscience.epfl.ch/record/166908/files/ctries-techreport.pdf)  
[具有高效非阻塞快照的并发字典树][2](http://lampwww.epfl.ch/~prokopec/ctries-snapshot.pdf)  
[计算平方根的方法][3](http://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method)  
[人生游戏模拟程序][4](https://github.com/axel22/ScalaDays2012-TrieMap)（译注：类似大富翁的棋盘游戏）  
