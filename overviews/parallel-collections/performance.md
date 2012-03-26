---
layout: overview-large
title: Measuring Performance

disqus: true

partof: parallel-collections
num: 8
outof: 8
---

## Performance on the JVM

The performance model on the JVM is sometimes convoluted and not well understood.
For various reasons the code may not have the expected performance or scalability.
We give a couple of examples.

One of the reasons is that the compilation process for a JVM application is not the same
as that of a statically compiled language (see \[[2][2]\]). The Java or Scala compilers
convert source code into JVM bytecodes and do very little optimization. On most modern
JVMs, once the program bytecode is run, it is converted into machine code for the computer
architecture on which it is being run.
This is called the just-in-time compilation. The level of code optimization is, however, low
with just-in-time compilation, since it has to be fast. To avoid recompiling, the so called HotSpot
compiler only optimizes parts of the code which are executed frequently.
What this means for the benchmark writer is that a program might not get executed with
the same performance each time it is run. Executing the same piece of code (e.g. a method)
multiple times in the same JVM instance might give very different performance results
depending on whether the particular code was optimised in between the runs. Additionally,
measuring the execution time of some piece of code may include the time during which
the JIT compiler itself was performing the optimization, thus giving inconsistent results.

Another hidden execution that takes part on the JVM is the automatic memory management.
Every once in a while, the execution of the program is stopped and a garbage collector is run.
If the program being benchmarked allocates any heap memory at all (and most JVM programs do), the garbage
collector will have to run, thus possibly distorting the measurement.
To amortize the garbage collection effects, the measured program should run many times to trigger
many garbage collections.

One common cause of a performance deterioration is also boxing and unboxing that happens implicitly
when passing a primitive type as an argument to a generic method.
At runtime, primitive types are converted to objects which represent them, so that they could
be passed to a method with a generic type parameter.
This induces extra allocations and is slower, also producing additional garbage on the heap.


## Microbenchmarking example

There are several approaches to avoid the above effects during measurement. First of all,
the target microbenchmark must be executed enough times to make sure that the just-in-time
compiler compiled it to machine code and that it was optimized. This is known as the warm-up
phase.

The microbenchmark itself should be run in a separate JVM instance to reduce noise coming from
garbage collection of the objects allocated by different parts of the program or unrelated just-in-time
compilation.

It should be run using the server version of the HotSpot JVM, which does more aggressive optimizations.

Finally, to reduce the chance of a garbage collection occurring in the middle of the benchmark,
ideally a garbage collection cycle should occur prior to the run of the benchmark, postponing the
next cycle as far as possible.

The `scala.testing.Benchmark` trait is predefined in the Scala standard library and is designed with
above in mind. Here is an example of benchmarking a map operation on a concurrent trie:


    import collection.parallel.mutable.ParCtrie
	import collection.parallel.ForkJoinTaskSupport
	
    object Map extends testing.Benchmark {
      val length = sys.props("length").toInt
      val par = sys.props("par").toInt
      val parctrie = ParCtrie((0 until length) zip (0 until length): _*)
      
      parctrie.tasksupport = new ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(par))
      
      def run = {
        parctrie map {
          kv => kv
        }
      }
    }

The `run` method embodies the microbenchmark code which will be run repetitively and whose running time
will be measured. The object `Map` above extends the `scala.testing.Benchmark` trait and parses system
specified parameters `par` for the parallelism level and `length` for the number of elements in the trie.

After compiling the program above, run it like this:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=300000 Map 10

The `server` flag specifies that the server VM should be used. The `cp` specifies the classpath and
includes classfiles in the current directory and the scala library jar. Arguments `-Dpar` and `-Dlength`
are the parallelism level and the number of elements. Finally, `10` means that the benchmark should
be run that many times within the same JVM.

Running times obtained by setting the `par` to `1`, `2`, `4` and `8` on a quad-core i7 with hyperthreading:

    Map$	126	57	56	57	54	54	54	53	53	53
    Map$	90	99	28	28	26	26	26	26	26	26
    Map$	201	17	17	16	15	15	16	14	18	15
    Map$	182	12	13	17	16	14	14	12	12	12

We can see above that the running time is higher during the initial runs, but is reduced after the
code gets optimized. Further, we can see that the benefit of hyperthreading is not high in this example,
as going from `4` to `8` threads results only in a minor performance improvement.


## References

1. [Anatomy of a flawed microbenchmark, Brian Goetz][1]
2. [Dynamic compilation and performance measurement, Brian Goetz][2]

  [1]: http://www.ibm.com/developerworks/java/library/j-jtp02225/index.html "flawed-benchmark"
  [2]: http://www.ibm.com/developerworks/library/j-jtp12214/ "dynamic-compilation"



