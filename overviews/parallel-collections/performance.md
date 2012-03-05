---
layout: overview-large
title: Measuring Performance

disqus: true

partof: parallel-collections
num: 1
---

**Aleksandar Prokopec**




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

boxing/unboxing

closures




## Microbenchmarking examples




## Tips and tricks

server vm

use cond card mark




## References

1. [Anatomy of a flawed microbenchmark, Brian Goetz][1]
2. [Dynamic compilation and performance measurement, Brian Goetz][2]

  [1]: http://www.ibm.com/developerworks/java/library/j-jtp02225/index.html "flawed-benchmark"
  [2]: http://www.ibm.com/developerworks/library/j-jtp12214/ "dynamic-compilation"
