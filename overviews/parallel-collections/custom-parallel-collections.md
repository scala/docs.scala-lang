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
`ParStringSplitter` and have it inherit a sequence splitter, that is `SeqSplitter[Char]`:

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
have a method called `dup` which duplicates the current splitter. Finally, methods `split` and
`psplit` are used to create splitter which traverse subsets of the current splitter.

        def remaining = ntl - i
		
        def dup = new ParStringSplitter(s, i, ntl)
		
        def split = {
          val rem = remaining
          if (rem >= 2) psplit(rem / 2, rem - rem / 2)
          else Seq(this)
        }
		
        def psplit(sizes: Int*): Seq[ParIterator] = {
          val splitted = new ArrayBuffer[ParStringSplitter]
          for (sz <- sizes) {
            val next = (i + sz) min ntl
            splitted += new ParStringSplitter(s, i, next)
            i = next
          }
          splitted
        }
      }
    }



## Parallel collections with combiners

advanced example - write a combiner as well


## Integration with the collections framework

fully integrating with the collections hierarchy - add companion, mix
in templates, etc.


## Further customizations

writing concurrent combiners - overriding canBeShared
iterators which don't use size to decide when to stop splitting -
overriding shouldSplitFurther
methods that call remaining - overriding isRemainingCheap
strict and nonstrict splitters - overriding isStrictSplitterCollection




