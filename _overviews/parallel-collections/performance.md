---
layout: multipage-overview
title: Measuring Performance
partof: parallel-collections
overview-name: Parallel Collections

num: 8

languages: [ja, zh-cn, es, ru]
permalink: /overviews/parallel-collections/:title.html
---

## Performance on the JVM

The performance model on the JVM is sometimes convoluted in commentaries about
it, and as a result is not well understood. For various reasons, some code may
not be as performant or as scalable as expected. Here, we provide a few
examples.

One of the reasons is that the compilation process for a JVM application is
not the same as that of a statically compiled language (see \[[2][2]\]). The
Java and Scala compilers convert source code into JVM bytecode and do very
little optimization. On most modern JVMs, once the program bytecode is run, it
is converted into machine code for the computer architecture on which it is
being run. This is called the just-in-time compilation. The level of code
optimization is, however, low with just-in-time compilation, since it has to
be fast. To avoid recompiling, the so-called HotSpot compiler only optimizes
parts of the code which are executed frequently. What this means for the
benchmark writer is that a program might have different  performance each time
it is run. Executing the same piece of code (e.g. a method) multiple times in
the same JVM instance might give very different performance results depending
on whether the particular code was optimized in between the runs.
Additionally, measuring the execution time of some piece of code may include
the time during which the JIT compiler itself was performing the optimization,
thus giving inconsistent results.

Another hidden execution that takes part on the JVM is the automatic memory
management. Every once in a while, the execution of the program is stopped and
a garbage collector is run. If the program being benchmarked allocates any
heap memory at all (and most JVM programs do), the garbage collector will have
to run, thus possibly distorting the measurement. To amortize the garbage
collection effects, the measured program should run many times to trigger many
garbage collections.

One common cause of a performance deterioration is also boxing and unboxing
that happens implicitly when passing a primitive type as an argument to a
generic method. At runtime, primitive types are converted to objects which
represent them, so that they could be passed to a method with a generic type
parameter. This induces extra allocations and is slower, also producing
additional garbage on the heap.

Where parallel performance is concerned, one common issue is memory
contention, as the programmer does not have explicit control about where the
objects are allocated.
In fact, due to GC effects, contention can occur at a later stage in
the application lifetime after objects get moved around in memory.
Such effects need to be taken into consideration when writing a benchmark.


## Microbenchmarking example

There are several approaches to avoid the above effects during measurement.
First of all, the target microbenchmark must be executed enough times to make
sure that the just-in-time compiler compiled it to machine code and that it
was optimized. This is known as the warm-up phase.

The microbenchmark itself should be run in a separate JVM instance to reduce
noise coming from garbage collection of the objects allocated by different
parts of the program or unrelated just-in-time compilation.

It should be run using the server version of the HotSpot JVM, which does more
aggressive optimizations.

Finally, to reduce the chance of a garbage collection occurring in the middle
of the benchmark, ideally a garbage collection cycle should occur prior to the
run of the benchmark, postponing the next cycle as far as possible.

For proper benchmark examples, you can see the source code inside [Scala library benchmarks][3].

## How big should a collection be to go parallel?

This is a question commonly asked. The answer is somewhat involved.

The size of the collection at which the parallelization pays of really
depends on many factors. Some of them, but not all, include:

- Machine architecture. Different CPU types have different
  performance and scalability characteristics. Orthogonal to that,
  whether the machine is multicore or has multiple processors
  communicating via the motherboard.
- JVM vendor and version. Different VMs apply different
  optimizations to the code at runtime. They implement different memory
  management and synchronization techniques. Some do not support
  `ForkJoinPool`, reverting to `ThreadPoolExecutor`s, resulting in
  more overhead.
- Per-element workload. A function or a predicate for a parallel
  operation determines how big is the per-element workload. The
  smaller the workload, the higher the number of elements needed to
  gain speedups when running in parallel.
- Specific collection. For example, `ParArray` and
  `ParTrieMap` have splitters that traverse the collection at
  different speeds, meaning there is more per-element work in just the
  traversal itself.
- Specific operation. For example, `ParVector` is a lot slower for
  transformer methods (like `filter`) than it is for accessor methods (like `foreach`)
- Side-effects. When modifying memory areas concurrently or using
  synchronization within the body of `foreach`, `map`, etc.,
  contention can occur.
- Memory management. When allocating a lot of objects a garbage
  collection cycle can be triggered. Depending on how the references
  to new objects are passed around, the GC cycle can take more or less time.







## References

1. [Anatomy of a flawed microbenchmark, Brian Goetz][1]
2. [Dynamic compilation and performance measurement, Brian Goetz][2]
3. [Scala library benchmarks][3]

  [1]: https://www.ibm.com/developerworks/java/library/j-jtp02225/index.html "flawed-benchmark"
  [2]: https://www.ibm.com/developerworks/library/j-jtp12214/ "dynamic-compilation"
  [3]: https://github.com/scala/scala/tree/2.12.x/test/benchmarks
