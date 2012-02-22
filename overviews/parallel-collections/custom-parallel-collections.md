---
layout: overview-large
title: Creating Custom Parallel Collections

disqus: true

partof: parallel-collections
num: 2
---

**Aleksandar Prokopec**


## Parallel collections without combiners

Just as it is possible to define custom sequential collections without defining their builders,
it is possible to define parallel collections without defining their combiners. The consequence
of not having a combiner is that transformer methods (e.g. `map`, `flatMap`, `collect`, `filter`, ...)
will by default return a standard collection type which is nearest in the hierarchy. For example,
ranges do not have builders, so mapping elements of a range creates a vector.

In the following example we define a parallel string collection. Since strings are logically
immutable sequences, we have parallel strings inherit `immutable.ParSeq[Char]`:

    class ParString(val str: String)
    extends immutable.ParSeq[Char] {

Next, we define methods found in every immutable sequence:

      def apply(i: Int) = str.charAt(i)
      
      def length = str.length

We have to also define the sequential counterpart of this parallel collection. In this case,
we return the `WrappedString` class:

      def seq = new collection.immutable.WrappedString(str)

Finally, we have to define a splitter for our parallel string collection. We name the splitter
`ParStringSplitter` and have it inherit a sequence splitter, that is, `SeqSplitter[Char]`:

      def splitter = new ParStringSplitter(str, 0, str.length)
      
      class ParStringSplitter(private var s: String, private var i: Int, private val ntl: Int)
      extends SeqSplitter[Char] {

        final def hasNext = i < ntl
		
        final def next = {
          val r = s.charAt(i)
          i += 1
          r
        }

Above, `ntl` represents the total length of the string, `i` is the current position and `s` is
the string itself.

Parallel collection iterators or splitters require a few more methods in addition to `next` and
`hasNext` found in sequential collection iterators. First of all, they have a method called
`remaining` which returns the number of elements this splitter has yet to traverse. Next, they
have a method called `dup` which duplicates the current splitter.

        def remaining = ntl - i
		
        def dup = new ParStringSplitter(s, i, ntl)
		
Finally, methods `split` and `psplit` are used to create splitters which traverse
subsets of the elements of the current splitter.
Method `split` has the contract that it returns a sequence of splitters which traverse disjoint,
non-overlapping subsets of elements that the current splitter traverses, none of which is empty.
If the current splitter has 1 or less elements, then `split` just returns a sequence of this splitter.
Method `psplit` has to return a sequence of splitters which traverse exactly as many elements as
specified by the `sizes` parameter. If the `sizes` parameter specifies less elements than the
current splitter, then an additional splitter with the rest of the elements is appended at the
end. If the `sizes` parameter requires more elements than there are remaining in the current
splitter, it will append an empty splitter for each size. Finally, calling either `split` or
`psplit` invalidates the current splitter.

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

Above, `split` is implemented in terms of `psplit`, which is often the case with parallel
sequences. Implementing a splitter for parallel maps, sets or iterables is often easier,
since it does not require `psplit`.

Thus, we obtain a parallel string class. The only downside is that calling transformer methods
such as `filter` will not produce a parallel string, but a parallel vector instead, which
may be suboptimal - producing a string again after filtering may be costly.


## Parallel collections with combiners

Lets say we want to `filter` the characters of the parallel string, to get rid of commas for example.
As noted above, calling `filter` produces a parallel vector and we want to obtain a parallel string
(since some interface in the API might require a sequential string).

To avoid this, we have to write a combiner for the parallel string collection. We will also inherit
the `ParSeqLike` trait this time to ensure that return type of `filter` is more specific - a `ParString`
instead of a `ParSeq[Char]`. The `ParSeqLike` has a third type parameter which specifies the type of
the sequential counterpart of the parallel collection (unlike sequential `*Like` traits which have
only two type parameters).

    class ParString(val str: String)
    extends immutable.ParSeq[Char]
       with ParSeqLike[Char, ParString, collection.immutable.WrappedString]

All the methods remain the same as before, but we add an additional protected method `newCombiner` which
is internally used by `filter`.

      protected[this] override def newCombiner: Combiner[Char, ParString] = new ParStringCombiner

Next we define the `ParStringCombiner` class. Combiners are subtypes of builders and they introduce an additional
method called `combine`, which takes another combiner as an argument and returns a new combiner which contains
the elements of both the current and the argument combiner. The current and the argument combiner are invalidated
after calling `combine`. If the argument is the same object as the current combiner, then `combine` just returns
the current combiner. This method is expected to be efficient, having logarithmic running time with respect to
the number of elements in the worst case, since it is called multiple times during a parallel computation.

Our `ParStringCombiner` will internally maintain a sequence of string builders. It will implement `+=` by adding
an element to the last string builder in the sequence, and `combine` by concatenating the lists of string builders
of the current and the argument combiner. The `result` method, which is called at the end of the parallel computation,
will produce a parallel string by appending all the string builders together. This way, elements are copied only
once at the end instead of being copied every time `combine` is called. Ideally, we would like to parallelize this
process and copy them in parallel (this is being done for parallel arrays), but without tapping into the internal
represenation of strings this is the best we can do - we have to live with this sequential bottleneck.

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



## Integration with the collections framework

Our `ParString` class is not complete yet. Although we have implemented a custom combiner which will be used
by methods such as `filter`, `partition`, `takeWhile` or `span`, most transformer methods require an implicit
`CanBuildFrom` evidence (see Scala collections guide for a full explanation). To make it available and completely
integrate `ParString` with the collections framework, we have to mix an additional trait called `GenericParTemplate`
and define the companion object of `ParString`.

    class ParString(val str: String)
    extends immutable.ParSeq[Char]
       with GenericParTemplate[Char, ParString]
       with ParSeqLike[Char, ParString, collection.immutable.WrappedString] {
	  
	  def companion = ParString

Inside the companion object we provide an implicit evidence for the `CanBuildFrom` parameter.

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



## Further customizations

writing concurrent combiners - overriding canBeShared
iterators which don't use size to decide when to stop splitting -
overriding shouldSplitFurther
methods that call remaining - overriding isRemainingCheap
strict and nonstrict splitters - overriding isStrictSplitterCollection




