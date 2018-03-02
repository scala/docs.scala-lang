---
layout: multipage-overview
title: 测量性能

disqus: true

partof: parallel-collections
num: 8
language: zh-cn
---

### 在JVM上的性能

对JVM性能模型的评论常常令人费解，其结论也往往不易理解。由于种种原因，代码也可能不像预期的那样高性能、可扩展。在这里，我们提供了一些示例。

其中一个原因是JVM应用程序的编译过程不同于静态编译语言（见[[2](http://www.ibm.com/developerworks/library/j-jtp12214/)]）。Java和Scala的编译器将源代码转换为JVM的字节码，做了非常少的优化。大多数现代JVM，运行时，会把字节码转化成相应机器架构的机器代码。这个过程被称为即时编译。由于追求运行速度，所以实时编译的代码优化程度较低。为了避免重新编译，所谓的HotSpot编译器只优化了部分经常被运行的代码。这对于基准程序作者来说，这意味着程序每次运行时的性能都可能不同。在同一个JVM实例中多次执行一段相同的代码（比如一个方法）可能会得到非常不同的性能结果，这取决于这段代码在运行过程中是否被优化。另外，在测量某些代码的执行时间时其中可能包含JIT编译器对代码进行优化的时间，因此可能得到不一致的结果。

另一个在JVM上隐藏执行的是内存自动管理。每隔一段时间，程序的运行就被阻塞并且启动垃圾收集器。如果被进行基准测试的程序分配了任何堆内存（大部分JVM程序都会分配），垃圾收集器将会工作，因此可能会影响测量结果。为了缓冲垃圾收集的影响，被测量的程序应该运行多次以便触发多次垃圾回收。

性能恶化的常见原因之一是将原始类型作为参数传递给泛型方法时发生的隐式装箱和拆箱。在运行时，原始类型被转换为封装对象，这样它们就可以作为参数传给有泛型类型参数的方法。这会导致额外的空间分配并且运行速度会更慢，也会在堆中产生额外的垃圾。

就并行性能而言，一个常见的问题是存储冲突，因为程序员针对对象的内存分配没有做明确的控制。事实上，由于GC的影响，冲突可以发生在应用程序生命期的最后，在对象被移出内存后。在编写基准测试时这种影响需要被考虑到。

### 微基准测试的例子

有几种方法可以在测试中避免上述影响。首先，目标微基准测试必须被执行足够多次来确保实时编译器将程序编译为机器码并被优化过。这就是所谓的预热阶段。

微基准测试本身需要被运行在单独的JVM实例中，以便减少在程序不同部分或不相关的实时编译过程中针对对象分配的垃圾收集所带来的干扰。

微基准测试应该跑在会做更多积极优化的服务器版本的HotSpot JVM上。

最后，为了减少在基准测试中间发生垃圾回收的可能性，理想的垃圾回收周期应该发生在基准测试之前，并尽可能的推迟下一个垃圾回收周期。

scala.testing.Benchmark trait 是在Scala标准库中被预先定义的，并按前面提到的方式设计。下面是一个用于测试并行算法中映射操作的例子：

    import collection.parallel.mutable.ParTrieMap
    import collection.parallel.ForkJoinTaskSupport
    
    object Map extends testing.Benchmark {
      val length = sys.props("length").toInt
      val par = sys.props("par").toInt
      val partrie = ParTrieMap((0 until length) zip (0 until length): _*)
    
      partrie.tasksupport = new ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(par))
    
      def run = {
        partrie map {
          kv => kv
        }
      }
    }
    
run方法包含了基准测试代码，重复运行时测量执行时间。上面的Map对象扩展了scala.testing.Benchmark trait，同时，参数par为系统的并行度，length为trie中元素数量的长度。

在编译上面的程序之后，可以这样运行：

	java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=300000 Map 10
    
server参数指定需要使用server类型的虚拟机。cp参数指定了类文件的路径，包含当前文件夹的类文件以及以及scala类库的jar包。参数-Dpar和-Dlength分别对应并行度和元素数量。最后，10意味着基准测试需要在同一个JVM中运行的次数。

在i7四核超线程处理器上将par的值设置为1、2、4、8并获得对应的执行时间。

    Map$ 126 57 56 57 54 54 54 53 53 53
    Map$ 90 99 28 28 26 26 26 26 26 26
    Map$ 201 17 17 16 15 15 16 14 18 15
    Map$ 182 12 13 17 16 14 14 12 12 12

我们从上面的结果可以看到运行时间在最初的几次运行中是较高的，但是在代码被优化后时间就缩短了。另外，我们可以看到在这个例子中超线程带来的好处并不明显，从4线程到8线程的结果说明性能只有小幅提升。

### 多大的容器才应该使用并发？

这是一个经常被问到的问题。答案是有些复杂的。

collection的大小所对应的实际并发消耗取决于很多因素。部分原因如下：

- 硬件架构。不同的CPU类型具有不同的性能和可扩展能力。取决于硬件是否为多核或者是否有多个通过主板通信的处理器。
- JVM的供应商及版本。在运行时不同的虚拟机应用不同的代码优化。它们的内存管理实现不同，同步技术也不同。有些不支持ForkJoinPool，转而使用ThreadPoolExecutor，这会导致更多的开销。
- 元素负载。用于并行操作的函数或断言决定了每个元素的负载有多大。负载越小，并发运行时用来提高运行速度的元素数量就越高。
- 特定的容器。例如：ParArray和ParTrieMap的分离器在遍历容器时有不同的速度，这意味着在遍历过程中要有更多的per-element work。
- 特定的操作。例如：ParVector在转换方法中（比如filter）要比在存取方法中（比如foreach）慢得多。
- 副作用。当同时修改内存区域或者在foreach、map等语句中使用同步时，就会发生竞争。
- 内存管理。当分配大量对象时垃圾回收机制就会被触发。GC循环会消耗多长时间取决于新对象的引用如何进行传递。

即使单独的来看，对上面的问题进行推断并给出关于容器应有大小的明确答案也是不容易的。为了粗略的说明容器的应有大小，我们给出了一个无副作用的在i7四核处理器（没有使用超线程）和JDK7上运行的并行矢量减（在这个例子中进行的是求和）处理性能的例子：

    import collection.parallel.immutable.ParVector
    
    object Reduce extends testing.Benchmark {
      val length = sys.props("length").toInt
      val par = sys.props("par").toInt
      val parvector = ParVector((0 until length): _*)
    
      parvector.tasksupport = new collection.parallel.ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(par))
    
      def run = {
        parvector reduce {
          (a, b) => a + b
        }
      }
    }
    
    object ReduceSeq extends testing.Benchmark {
      val length = sys.props("length").toInt
      val vector = collection.immutable.Vector((0 until length): _*)
    
      def run = {
        vector reduce {
          (a, b) => a + b
        }
      }
      
    }
首先我们设定在元素数量为250000的情况下运行基准测试，在线程数设置为1、2、4的情况下得到了如下结果：

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=250000 Reduce 10 10
    Reduce$ 54 24 18 18 18 19 19 18 19 19
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=250000 Reduce 10 10
    Reduce$ 60 19 17 13 13 13 13 14 12 13
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=250000 Reduce 10 10
    Reduce$ 62 17 15 14 13 11 11 11 11 9
然后我们将元素数量降低到120000，使用4个线程来比较序列矢量减运行的时间：

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=120000 Reduce 10 10
    Reduce$ 54 10 8 8 8 7 8 7 6 5
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dlength=120000 ReduceSeq 10 10
    ReduceSeq$ 31 7 8 8 7 7 7 8 7 8
在这个例子中，元素数量为120000时看起来正处于阈值附近。

在另一个例子中，我们使用mutable.ParHashMap和map方法（一个转换方法），并在同样的环境中运行下面的测试程序：

    import collection.parallel.mutable.ParHashMap
    
    object Map extends testing.Benchmark {
      val length = sys.props("length").toInt
      val par = sys.props("par").toInt
      val phm = ParHashMap((0 until length) zip (0 until length): _*)
    
      phm.tasksupport = new collection.parallel.ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(par))
    
      def run = {
        phm map {
          kv => kv
        }
      }
    }
    
    object MapSeq extends testing.Benchmark {
      val length = sys.props("length").toInt
      val hm = collection.mutable.HashMap((0 until length) zip (0 until length): _*)
    
      def run = {
        hm map {
          kv => kv
        }
      }
    }
在元素数量为120000、线程数量从1增加至4的时候，我们得到了如下结果：

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=120000 Map 10 10    
    Map$ 187 108 97 96 96 95 95 95 96 95
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=120000 Map 10 10
    Map$ 138 68 57 56 57 56 56 55 54 55
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=120000 Map 10 10
    Map$ 124 54 42 40 38 41 40 40 39 39
    
现在，如果我们将元素数量降低到15000来跟序列化哈希映射做比较：

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=15000 Map 10 10
    Map$ 41 13 10 10 10 9 9 9 10 9
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=15000 Map 10 10
    Map$ 48 15 9 8 7 7 6 7 8 6
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dlength=15000 MapSeq 10 10
    MapSeq$ 39 9 9 9 8 9 9 9 9 9
    
对这个容器和操作来说，当元素数量大于15000的时候采用并发是有意义的（通常情况下，对于数组和向量来说使用更少的元素来并行处理hashmap和hashset是可行的但不是必须的）。

**引用**

1. [Anatomy of a flawed microbenchmark，Brian Goetz](http://www.ibm.com/developerworks/java/library/j-jtp02225/index.html)
2. [Dynamic compilation and performance measurement, Brian Goetz](http://www.ibm.com/developerworks/library/j-jtp12214/)

