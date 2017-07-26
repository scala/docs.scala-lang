---
layout: multipage-overview
title: 创建自定义并行容器

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 6
language: zh-cn
---

### 没有组合器的并行容器

正如可以定义没有构造器的个性化序列容器一样，我们也可以定义没有组合器的并行容器。没有组合器的结果就是容器的transformer方法（比如，map，flatMap，collect，filter，……）将会默认返回一个标准的容器类型，该类型是在继承树中与并行容器最接近的一个。举个例子，range类没有构造器，因此一个range类的元素映射会生成一个vector。

在接下来的例子中，我们定义了一个并行字符串容器。因为字符串在逻辑上是非可变序列，我们让并行字符串继承 immutable.ParSeq[Char]：

    class ParString(val str: String)
    extends immutable.ParSeq[Char] {

接着，我们定义非可变序列必须实现的方法：

      def apply(i: Int) = str.charAt(i)

      def length = str.length

我们还得定义这个并行容器的序列化副本。这里，我们返回WrappedString类：

    def seq = new collection.immutable.WrappedString(str)

最后，我们必须为并行字符串容器定义一个splitter。我们给这个splitter起名ParStringSplitter，让它继承一个序列splitter，即，SeqSplitter[Char]：

      def splitter = new ParStringSplitter(str, 0, str.length)

      class ParStringSplitter(private var s: String, private var i: Int, private val ntl: Int)
      extends SeqSplitter[Char] {

        final def hasNext = i < ntl

        final def next = {
          val r = s.charAt(i)
          i += 1
          r
        }

上面的代码中，ntl为字符串的总长，i是当前位置，s是字符串本身。

除了next和hasNext方法，并行容器迭代器，或者称它为splitter，还需要序列容器迭代器中的一些其他的方法。首先,他们有一个方法叫做 remaining，它返回这个分割器尚未遍历的元素数量。其次，需要dup方法用于复制当前的分割器。

      def remaining = ntl - i

      def dup = new ParStringSplitter(s, i, ntl)

最后,split和psplit方法用于创建splitter，这些splitter 用来遍历当前分割器的元素的子集。split方法,它返回一个分割器的序列，它用来遍历互不相交，互不重叠的分隔器元素子集，其中没有一个是空的。如果当前分割器有1个或更少的元素，然后就返回一个序列的分隔器。psplit方法必须返回和指定sizes参数个数一致的分割器序列。如果sizes参数指定元素数量小于当前分配器，然后一个带有额外的分配器就会附加在分配器的尾部。如果sizes参数比在当前分配器的剩余元素大很多，需要更多的元素，它将为每个分配器添加一个空的分配器。最后,调用split或psplit方法使得当前分配器无效。

       def split = {
          val rem = remaining
          if (rem >= 2) psplit(rem / 2, rem - rem / 2)
          else Seq(this)
        }

        def psplit(sizes: Int*): Seq[ParStringSplitter] = {
          val splitted = new ArrayBuffer[ParStringSplitter]
          for (sz <- sizes) {
            val next = (i + sz) min ntl
            splitted += new ParStringSplitter(s, i, next)
            i = next
          }
          if (remaining > 0) splitted += new ParStringSplitter(s, i, ntl)
          splitted
        }
      }
    }

综上所述，split方法是通过psplit来实现的，它常用于并行序列计算中。由于不需要psplit，并行映射、集合、迭代器的实现，通常就更容易些。

因此，我们得到了一个并行字符串类。它唯一的缺点是，调用类似filter等转换方法不是生成并行串，而是生成并行向量，这可能是个折中的选择 - filter方法如果生成串而非向量，代价也许是昂贵的。

### 带组合子的并行容器

假设我们想要从并行字符串中过滤掉某些字符，例如，去除其中的逗号。如上所述，调用filter方法会生成一个并行向量，但是我们需要得到的是一个并行串（因为API中的某些接口可能需要一个连续的字符串来作为参数）。

为了避免这种情况的发生，我们需要为并行串容器写一个组合子。同时，我们也将继承ParSeqLike trait，以确保filter的返回类型是更具体的类型 - - ParString而不是ParSeq[Char]。ParSeqLike的第三个参数，用于指定并行容器对应的序列的类型（这点和序列化的 *Like trait 不同，它们只有两个类型参数）。

    class ParString(val str: String)
    extends immutable.ParSeq[Char]
       with ParSeqLike[Char, ParString, collection.immutable.WrappedString]

所有的方法仍然和以前一样，只是我们会增加一个额外的protected方法newCombiner，它在内部被filter方法调用。

  	protected[this] override def newCombiner: Combiner[Char, ParString] = new ParStringCombiner

接下来我们定义ParStringCombiner类。组合子是builders的子类型，它们引进了名叫combine的方法，该方法接收另一个组合子作为参数，并返回一个新的组合子，该新的组合子包含了当前组合子和参数中的组合子中的所有元素。当前组合子和参数中的组合子在调用combine方法之后将会失效。如果参数中的组合子和当前的组合子是同一个对象，那么combine方法仅仅返回当前的组合子。该方法通常情况下是高效的，最坏情况下时间复杂度为元素个数的对数，因为它在一次并行计算中会被多次调用。

我们的ParStringCombiner会在内部维护一个字符串生成器的序列。它通过在序列的最后一个字符串builder中增加一个元素的方式，来实现+=方法。并且通过串联当前和参数中的组合子的串builder列表来实现combine方法。result方法，在并行计算结束后被调用，它会通过将所有字符串生成器添加在一起来产生一个并行串。这样一来，元素只在末端被复制一次，避免了每调一次combine方法就被复制一次。理想情况下，我们想并行化这一进程，并在它们并行时候进行复制（并行数组正在被这样做），但没有办法检测到的字符串的内部表现，这是我们能做的最好的 - 我们不得不忍受这种顺序化的瓶颈。

    private class ParStringCombiner extends Combiner[Char, ParString] {
      var sz = 0
      val chunks = new ArrayBuffer[StringBuilder] += new StringBuilder
      var lastc = chunks.last

      def size: Int = sz

      def +=(elem: Char): this.type = {
        lastc += elem
        sz += 1
        this
      }

      def clear = {
        chunks.clear
        chunks += new StringBuilder
        lastc = chunks.last
        sz = 0
      }

      def result: ParString = {
        val rsb = new StringBuilder
        for (sb <- chunks) rsb.append(sb)
        new ParString(rsb.toString)
      }

      def combine[U <: Char, NewTo >: ParString](other: Combiner[U, NewTo]) = if (other eq this) this else {
        val that = other.asInstanceOf[ParStringCombiner]
        sz += that.sz
        chunks ++= that.chunks
        lastc = chunks.last
        this
      }
    }

### 大体上我如何来实现一个组合子？

没有现成的秘诀——它的实现依赖于手头上的数据结构，通常在实现上也需要一些创造性。但是，有几种方法经常被采用：

1. 连接和合并。一些数据结构在这些操作上有高效的实现（经常是对数级的）。如果手头的容器可以由这样的一些数据结构支撑，那么它们的组合子就可以是容器本身。 Finger trees，ropes和各种堆尤其适合使用这种方法。

2. 两阶段赋值，是在并行数组和并行哈希表中采用的方法，它假设元素子集可以被高效的划分到连续的排序桶中，这样最终的数据结构就可以并行的构建。第一阶段，不同的处理器独立的占据这些桶，并把这些桶连接在一起。第二阶段，数据结构被分配，不同的处理器使用不相交的桶中的元素并行地占据部分数据结构。必须注意的是，各处理器修改的部分不能有交集，否则，可能会产生微妙的并发错误。正如在前面的篇幅中介绍的，这种方法很容易应用到随机存取序列。

3. 一个并发的数据结构。尽管后两种方法实际上不需要数据结构本身有同步原语，它们假定数据结构能够被不修改相同内存的不同处理器，以并发的方式建立。存在大量的并发数据结构，它们可以被多个处理器安全的修改——例如，并发skip list，并发哈希表，split-ordered list，并发 avl树等等。需要注意的是，并发的数据结构应该提供水平扩展的插入方法。对于并发并行容器，组合器可以是容器本身，并且，完成一个并行操作的所有的处理器会共享一个单独的组合器实例。

### 使用容器框架整合

ParString类还没有完成。虽然我们已经实现了一个自定义的组合子，它将会被类似filter，partition，takeWhile，或者span等方式使用，但是大部分transformer方法都需要一个隐式的CanBuildFrom出现（Scala collections guide有详细的解释）。为了让ParString可能，并且完全的整合到容器框架中，我们需要为其掺入额外的一个叫做GenericParTemplate的trait，并且定义ParString的伴生对象。

    class ParString(val str: String)
    extends immutable.ParSeq[Char]
       with  GenericParTemplate[Char, ParString]
       with ParSeqLike[Char, ParString, collection.immutable.WrappedString] {

      def companion = ParString
在这个伴生对象内部，我们隐式定义了CanBuildFrom。

    object ParString {
      implicit def canBuildFrom: CanCombineFrom[ParString, Char, ParString] =
        new CanCombinerFrom[ParString, Char, ParString] {
          def apply(from: ParString) = newCombiner
          def apply() = newCombiner
        }

      def newBuilder: Combiner[Char, ParString] = newCombiner

      def newCombiner: Combiner[Char, ParString] = new ParStringCombiner

      def apply(elems: Char*): ParString = {
        val cb = newCombiner
        cb ++= elems
        cb.result
      }
    }

### 进一步定制——并发和其他容器

实现一个并发容器（与并行容器不同，并发容器是像collection.concurrent.TrieMap一样可以被并发修改的）并不总是简单明了的。尤其是组合器，经常需要仔细想想。到目前为止，在大多数描述的并行容器中，组合器都使用两步评估。第一步元素被不同的处理器加入到组合器中，组合器被合并在一起。第二步，在所有元素完成处理后，结果容器就被创建。

组合器的另一种方式是把结果容器作为元素来构建。前提是：容器是线程安全的——组合器必须允许并发元素插入。这样的话，一个组合器就可以被所有处理器共享。

为了使一个并发容器并行化，它的组合器必须重写canBeShared方法以返回真。这会保证当一个并行操作被调用，只有一个组合器被创建。然后，+=方法必须是线程安全的。最后，如果当前的组合器和参数组合器是相同的，combine方法仍然返回当前的组合器，要不然会自动抛出异常。

为了获得更好的负载均衡，Splitter被分割成更小的splitter。默认情况下，remaining方法返回的信息被用来决定何时停止分割splitter。对于一些容器而言，调用remaining方法是有花销的，一些其他的方法应该被使用来决定何时分割splitter。在这种情况下，需要重写splitter的shouldSplitFurther方法。

如果剩余元素的数量比容器大小除以8倍并行级别更大，默认的实现将拆分splitter。

    def shouldSplitFurther[S](coll: ParIterable[S], parallelismLevel: Int) =
        remaining > thresholdFromSize(coll.size, parallelismLevel)

同样的，一个splitter可以持有一个计数器，来计算splitter被分割的次数。并且，如果split次数超过3+log（并行级别），shouldSplitFurther将直接返回true。这避免了必须去调用remaining方法。

此外，对于一个指定的容器如果调用remaining方法开销不低（比如，他需要评估容器中元素的数量），那么在splitter中的方法isRemainingCheap就应该被重写并返回false。

最后，若果在splitter中的remaining方法实现起来极其麻烦，你可以重写容器中的isStrictSplitterCollection方法，并返回false。虽然这些容器将不能够执行一些严格依赖splitter的方法，比如，在remaining方法中返回一个正确的值。重点是，这并不影响 for-comprehension 中使用的方法。
