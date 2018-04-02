---
layout: sip
discourse: true
title: SIP-20 - Improved Lazy Vals Initialization

vote-status: dormant
vote-text: This proposal lacks an implementation for Scalac and is looking for a new owner.
permalink: /sips/:title.html
redirect_from: /sips/pending/improved-lazy-val-initialization.html
---

**By: Aleksandar Prokopec, Dmitry Petrashko, Miguel Garcia, Jason Zaugg, Hubert Plociniczak, Viktor Klang, Martin Odersky**


## Abstract ##

This SIP describes the changes in the lazy vals initialization mechanism that address some of the unnecessary deadlock scenarios. The newly proposed lazy val initialization mechanism aims to eliminate the acquisition of resources during the execution of the lazy val initializer block, thus reducing the possibility of a deadlock. The concrete deadlock scenarios that the new lazy val initialization scheme eliminates are summarized below.

The changes in this SIP have previously been discussed in depth on the mailing lists \[[1][1]\] \[[2][2]\] \[[9][9]\] \[[10][10]\].


## Description ##

The current lazy val initialization scheme uses double-checked locking to initialize the lazy val only once. A separate volatile bitmap field is used to store the state of the lazy val - a single bit in this bitmap denotes whether the lazy val is initialized or not.
Assume we have the following declaration.

    final class LazyCell {
      lazy val value = <RHS>
    }

Here is an example of a manually written implementation equivalent to what the compiler currently does:

    final class LazyCell {
      @volatile var bitmap_0: Boolean = false
      var value_0: Int = _
      private def value_lzycompute(): Int = {
        this.synchronized {
          if (!bitmap_0) {
            value_0 = <RHS>
            bitmap_0 = true
          }
        }
        value_0
      }
      def value = if (bitmap_0) value_0 else value_lzycompute()
    }

We now describe several deadlock scenarios in an attempt to classify deadlocks related to the current lazy val initialization implementation.

### No circular dependencies ###

Assume there are two objects A and B with lazy vals `a0` and `a1`, and `b`, respectively:

    object A {
      lazy val a0 = B.b
      lazy val a1 = 17
    }

    object B {
      lazy val b = A.a1
    }

The initialization block of `a0` above refers to `b` in B, and the initialization of `B.b` refers to `A.a1`. While a circular dependency exists between these two objects, there is no circular dependency **between specific lazy vals** `a0`, `a1` and `b`.

In the scheme, there exists a possibility of a deadlock if thread Ta attempts to initialize `A.a0` and thread Tb attempts to initialize `B.b`. Assume that both Ta and Tb start their synchronized blocks simultaneously. A deadlock can occur due to each thread trying to grab the lock of the other object, while holding their own lock until the initialization completes.

This SIP attempts to address this issue.

### Circular dependencies ###

Assume there are two objects A and B with lazy vals `a` and `b` respectively, where `a` needs `b` for initialization and vice versa. The current implementation scheme can cause a deadlock in this situation. Furthermore: in a single threaded scenario, circular dependencies between lazy vals lead to stack overflows with the current implementation:

    scala> object Test {
      |   object A { lazy val a: Int = B.b }
      |   object B { lazy val b: Int = A.a }
      | }
    defined object Test

    scala> Test
    res0: Test.type = Test$@6fd1046d

    scala> Test.A.a
    java.lang.StackOverflowError

This is considered erroneous code, and this SIP does not attempt to address this.

### No circular dependencies with other synchronization constructs ###

Consider the declaration of the following lazy val:

    class A { self =>
      lazy val x: Int = {
        val t = new Thread() {
          override def run() { self.synchronized {} }
        }
        t.start()
        t.join()
        1
      }
    }

In the source there appears to be no circular dependency between the lazy val initialization block and the other synchronization construct, so there should be no reason for deadlock. As long as thread `t` completes a condition that the caller depends on and eventually lets go of the current object `self`, the lazy val should be able to initialize itself.

With the current initialization scheme, however, initializing `x` causes a deadlock. The calling thread initializing `x`, holds the monitor of the current object `self`. The same monitor is needed by thread `t`, since it also synchronizes on `self`, thus causing a deadlock.

This SIP attempts to address this issue.

The thread that fulfills the condition that the lazy val initializer block suspends on could on the other hand permanently grab a hold of the monitor of the `self` object. Although this is not strictly speaking a deadlock, it is worth mentioning that the current lazy val initialization implementation might not complete in the following scenario case.

    class A { self =>
      val latch = new java.util.concurrent.CountDownLatch(1)
      val t = new Thread() {
        override def run() {
          latch.countDown()
          self.synchronized { while (true) {} }
        }
      }
      t.start()
      lazy val x: Int = {
        latch.await()
        1
      }
      x
    }

This SIP does not attempt to solve this issue - lazy val initialization semantics assume that the `self` object monitor is available or can be made available throughout the lazy val initialization.

### Circular dependencies with other synchronization constructs ###

Consider the declaration of the following lazy val:

    lazy val x: Int = {
      val t = new Thread() {
        override def run() { println(x) }
      }
      t.start()
      t.join()
      1
    }

In this code, the lazy val initialization block suspends until a condition is fulfilled. This condition can only be fulfilled by reading the value of lazy val `x` - another thread that is supposed to complete this condition cannot do so. Thus, a circular dependency is formed, and the lazy val cannot be initialized. Similar problems can arise with Scala singleton object initialization \[[3][3]\] when creating threads from the singleton object constructor and waiting for their completion, and with static initializer blocks in Java \[[4][4]\] \[[5][5]\].

Note that this problem can also happen if two separate threads try to initialize two singleton objects that refer to each other, which is somewhat more severe. The rule of the thumb for programmers should be - singleton objects should not refer to each other during initialization.

This is considered an anti-pattern, and this SIP does not attempt to address these issues.

## Implementation ##

The solution to the problems that this SIP attempts to address is based on avoiding the acquisition of the current object monitor during the time that the lazy val initializer block executes. Instead of executing the initializer block from within a synchronized block, the synchronized block is run twice, once at the beginning to publicize the information that the initializer block is being run and once after the initializer block to publicize the information that the lazy val field has been computed and assigned. The new scheme will require maintaining 2 bits per lazy field instead of 1, as in the current implementation.
We will refer to the existing, current lazy val initialization implementation as V1.

### Version V2 ###

Here is an example of manually written implementation for the `LazyCell` class from the previous section:

    class LazyCell {
      @volatile var bitmap_0: Int = 0
      var value_0: Int = _
      private def value_lzycompute(): Int = {
        this.synchronized {
          if (bitmap_0 == 0) {
            bitmap_0 = 1
          } else {
            while (bitmap_0 == 1) {
              this.wait()
            }
            return value_0
          }
        }
        val result = <RHS>
        this.synchronized {
          value_0 = result
          bitmap_0 = 3
          this.notifyAll()
        }
        value_0
      }
      def value = if (bitmap_0 == 3) value_0 else value_lzycompute()
    }

The state of the lazy val is represented with 3 values: 0, 1 and 3. Note that only 2 bits are sufficient to represent them but we use an entire integer here for purposes of clarity. The state 0 represents a non-initialized lazy val. The state 1 represents the lazy val that is currently being initialized by some thread. The state 3 represents the lazy val that has been initialized.

The first-arriving thread sets the state 1 from the synchronized block, leaves the synchronized block and proceeds by executing the initializer block. Subsequently arriving threads enter the synchronized block, see state 1 and `wait` until they are notified that the lazy val has been assigned. The first-arriving thread sets the state to 3 and notifies them after it computes the result and enters the second synchronized block.

### Version V3 - the `notifyAll` improvement ###

As noted in the previous discussions \[[1][1]\] \[[2][2]\] \[[6][6]\] \[[7][7]\], the `notifyAll` call in the proposed implementation bears a significant cost - in the uncontended case it slows down the initialization by a factor of at least 4x measured on a  3.4 GHz i7-2600 and JDK 7 update 4.

Therefore, we propose the following implementation that avoids calling `notifyAll` unless the first-arriving thread knows that there are concurrent readers of the lazy val. We introduce the fourth state corresponding to the bitmap value 2, that denotes that there are concurrent readers of the lazy val. The first-arriving thread only calls the `notifyAll` if it finds state 2 in the second synchronized block.

    class LazyCell {
      @volatile var bitmap_0 = 0
      var value_0: Int = _
      private def value_lzycompute(): Int = {
        this.synchronized {
          (bitmap_0: @annotation.switch) match {
            case 0 =>
              bitmap_0 = 1
            case 1 =>
              bitmap_0 = 2
              do this.wait() while (bitmap_0 == 2.toByte)
              return value_0
            case 2 =>
              do this.wait() while (bitmap_0 == 2.toByte)
              return value_0
            case 3 =>
              return value_0
          }
        }
        val result = <RHS>
        this.synchronized {
          val oldstate = bitmap_0
          value_0 = result
          bitmap_0 = 3
          if (oldstate == 2) this.notifyAll()
        }
        value_0
      }
      def value = if (bitmap_0 == 3) value_0 else value_lzycompute()
    }

Measured on the same machine, this change seems to be 50% slower than the current lazy val implementation for the uncontended case.

### Version V4 - the CAS improvement ###

Each exit or entrance to a synchronized block in principle requires one atomic instruction, amounting to roughly 4 atomic instructions per lazy val initialization. This can be reduced by using the CAS instruction to switch between lazy val states.
Here is an example of a simple implementation obtained by extending the `AtomicInteger` class:

    class LazyCell
    extends java.util.concurrent.atomic.AtomicInteger {
      var value_0: Int = _
      @tailrec final def value(): Int = (get: @switch) match {
        case 0 =>
          if (compareAndSet(0, 1)) {
            val result = <RHS>
            value_0 = result
            if (getAndSet(3) != 1) synchronized { notify() }
            result
          } else value()
        case 1 =>
          compareAndSet(1, 2)
          synchronized {
            while (get != 3) wait()
            notify()
          }
          value_0
        case 2 =>
          synchronized {
            while (get != 3) wait()
            notify()
          }
          value_0
        case 3 => value_0
      }
    }

This implementation has the following advantages:
- it seems to have the same initialization performance as the current implementation, in the uncontended case
- it relies less on synchronized blocks, needing them only in case of contention, thus being less prone to deadlocks

Some disadvantages:
- we cannot always extend `AtomicInteger`, some classes already inherit something else
- in the contended worst-case, this scheme is equally prone to deadlocks, because it needs to acquire the synchronized block

However, in the more general setting where there are two or more lazy val fields in an object:
- the overall memory footprint could possibly increase - we would spend a minimum of 4 bytes per bitmap on first lazy val, where this was previously 1 byte
- in a setting with multiple bitmaps or an existing base class, we cannot extend `AtomicInteger` (which internally uses `Unsafe` directly), and instead need to use `AtomicIntegerFieldUpdater`s that are slower due to extra checks
- in a setting with multiple lazy val fields, we can no longer use `getAndSet` in the initialization (concurrent accesses to other lazy fields may modify the bitmap - we have to read and recompute the expected bitmap state) - we need a `compareAndSet` and have some retry-logic (see the `complete` method below), which is slower
- due to the restrictions on the `AtomicIntegerFieldUpdater`s, we would need to make the `bitmap_0` field publicly visible on the byte-code level, which might be an issue for Java code interfacing with Scala code
- it is much more complicated than the 2 synchronized blocks implementation

Here is a more general implementation(V4-general), that is slower in the uncontended case than both the current implementation (V1) and the proposed implementation with synchronized blocks (V3). This implementation is, however, in the contended case twice as fast than the current implementation (V1).
See the evaluation section for more information.

    class LazyCellBase { // in a Java file - we need a public bitmap_0
      public static AtomicIntegerFieldUpdater<LazyCellBase> arfu_0 =
        AtomicIntegerFieldUpdater.newUpdater(LazyCellBase.class, "bitmap_0");
      public volatile int bitmap_0 = 0;
    }

    final class LazyCell extends LazyCellBase {
      import LazyCellBase._
      var value_0: Int = _
      @tailrec final def value(): Int = (arfu_0.get(this): @switch) match {
        case 0 =>
          if (arfu_0.compareAndSet(this, 0, 1)) {
            val result = <RHS>
            value_0 = result

            @tailrec def complete(): Unit = (arfu_0.get(this): @switch) match {
              case 1 =>
                if (!arfu_0.compareAndSet(this, 1, 3)) complete()
              case 2 =>
                if (arfu_0.compareAndSet(this, 2, 3)) {
                  synchronized { notifyAll() }
                } else complete()
            }

            complete()
            result
          } else value()
        case 1 =>
          arfu_0.compareAndSet(this, 1, 2)
          synchronized {
            while (arfu_0.get(this) != 3) wait()
          }
          value_0
        case 2 =>
          synchronized {
            while (arfu_0.get(this) != 3) wait()
          }
          value_0
        case 3 => value_0
      }
    }


### Version 5 - retry in case of failure ###

The current Scala semantics demand retrying the initialization in case of failure.
The four versions presented above provide good performance characteristics in benchmarks, but may leave threads waiting forever due to failed initializations, thus leaking threads. Consider this example:

    class LazyCell {
      private var counter = -1
      lazy val value = {
          counter = counter + 1
          if(counter < 42)
            throw null
          else 0
        }
    }

In this case, the first attempt to initialize the cell would fail. In version 4 this will leave the bitmap with a value still indicating that there's a thread currently computing the value. All the threads trying to access the value would wait for this (non-existent) thread to finish computation, causing the application to leak threads.

In order to maintain current Scala semantics, we need to correctly handle failed initializations. Version 5 presented below, does this correctly:


    class LazyCellBase { // in a Java file - we need a public bitmap_0
      public static AtomicIntegerFieldUpdater<LazyCellBase> arfu_0 =
        AtomicIntegerFieldUpdater.newUpdater(LazyCellBase.class, "bitmap_0");
      public volatile int bitmap_0 = 0;
    }

    final class LazyCell extends LazyCellBase {
      import LazyCellBase._
      var value_0: Int = _
      @tailrec final def value(): Int = (arfu_0.get(this): @switch) match {
        case 0 =>
          if (arfu_0.compareAndSet(this, 0, 1)) {
            val result =
              try {<RHS>} catch {
                case x: Throwable =>
                  complete(0);
                  throw x
              }
            value_0 = result

            @tailrec def complete(newState: Int): Unit = (arfu_0.get(this): @switch) match {
              case 1 =>
                if (!arfu_0.compareAndSet(this, 1, newState)) complete()
              case 2 =>
                if (arfu_0.compareAndSet(this, 2, newState)) {
                  synchronized { notifyAll() }
                } else complete()
            }

            complete(3)
            result
          } else value()
        case 1 =>
          arfu_0.compareAndSet(this, 1, 2)
          synchronized {
            while (arfu_0.get(this) != 3) wait()
          }
          value_0
        case 2 =>
          synchronized {
            while (arfu_0.get(this) != 3) wait()
          }
          value_0
        case 3 => value_0
      }
    }

This version is basically the same as Version 4, but it handles retries in accordance with current Scala specification.
Unfortunately, this comes with a slight performance slowdown. See the evaluation section for more information.


### Version 6 - No synchronization on `this` and concurrent initialization of fields ###

Note that the current lazy val initialization implementation is robust against the following scenario, in which the initialization block starts an asynchronous computation attempting to indefinitely grab the monitor of the current object.

    class A { self =>
      lazy val x: Int = {
        (new Thread() {
          override def run() = self.synchronized { while (true) {} }
        }).start()
        1
      }
    }

In the current implementation, the monitor is held throughout the lazy val initialization and released once the initialization block completes.
All versions proposed above, release the monitor during the initialization block execution and re-acquire it back, so the code above could stall indefinitely.

Additionally, usage of `this` as synchronization point may disallow concurrent initialization of different lazy vals in the same object. Consider the example below:

    class TwoLazies {
      lazy val slow = { Thread.sleep(100000); 0}
      lazy val fast = 1
      lazy val bad: Int = {
        (new Thread() {
          override def run() = self.synchronized { while (true) {} }
        }).start()
        1
      }
    }

Although the two `slow` and `fast` vals are independent, `fast` is required to
wait for `slow` to be computed. This is due to the fact that they both
synchronize on `this` for the entire initialization in the current
implementation.

In the versions presented above, a single call to `bad` may lead to the monitor
for `this` being held forever, making calls to `slow` and `fast` also block
forever.

Note that these interactions are very surprising to users as they leak the
internal limitations of the lazy val implementation.

To overcome these limitations we propose a version that does not synchronize on
`this` and instead uses external monitor-objects that are used solely for
synchronization.

    final class LazyCell {
      import dotty.runtime.LazyVals
      var value_0: Int = _
      private var bitmap = 0
      @static private bitmap_offset = LazyVals.getOffset(classOf[LazyCell], "bitmap")
      def value(): Int = {
        var result: Int = 0
        var retry: Boolean = true
        val fieldId: Int = 0 // id of lazy val
        var flag: Long = 0L
        while retry do {
          flag = LazyVals.get(this, bitmap_offset)
          LazyVals.STATE(flag, 0) match {
            case 0 =>
              if LazyVals.CAS(this, bitmap_offset, flag, 1) {
                try {result = <RHS>} catch {
                  case x: Throwable =>
                    LazyVals.setFlag(this, bitmap_offset, 0, fieldId)
                    throw x
                }
                value_0 = result
                LazyVals.setFlag(this, bitmap_offset, 3, fieldId)
                retry = false
                }
            case 1 =>
              LazyVals.wait4Notification(this, bitmap_offset, flag, fieldId)
            case 2 =>
              LazyVals.wait4Notification(this, bitmap_offset, flag, fieldId)
            case 3 =>
              retry = false
              result = $target
            }
          }
        result
      }
    }

This implementation relies on the helper functions provided in \[[11][11]\]
module. The most important of these functions, `wait4Notification` and
`setFlag`, are presented below:

     def setFlag(t: Object, offset: Long, v: Int, fieldId: Int) = {
       var retry = true
       while (retry) {
         val cur = get(t, offset)
         if (STATE(cur) == 1) retry = CAS(t, offset, cur, v)
         else {
           // cur == 2, somebody is waiting on monitor
           if (CAS(t, offset, cur, v)) {
             val monitor = getMonitor(t, fieldId)
             monitor.synchronized {
               monitor.notifyAll()
             }
             retry = false
           }
         }
       }
     }

    def wait4Notification(t: Object, offset: Long, cur: Long, fieldId: Int) = {
      var retry = true
      while (retry) {
        val cur = get(t, offset)
        val state = STATE(cur)
        if (state == 1) CAS(t, offset, cur, 2)
        else if (state == 2) {
          val monitor = getMonitor(t, fieldId)
          monitor.synchronized {
            monitor.wait()
          }
        }
        else retry = false
      }
    }

    val processors: Int = java.lang.Runtime.getRuntime.availableProcessors()
    val base: Int = 8 * processors * processors
    val monitors: Array[Object] = (0 to base).map {
      x => new Object()
    }.toArray

    def getMonitor(obj: Object, fieldId: Int = 0) = {
      var id = (java.lang.System.identityHashCode(obj) + fieldId) % base
      if (id < 0) id += base
      monitors(id)
    }

This implementation has the following advantages compared to previous version:
- it allows concurrent initialization of independent fields
- it does not interact with user-written code that synchronizes on `this`
- it does not require expanding monitor on the object to support `notifyAll`

Some disadvantages:
- the `Unsafe` class, used internally has a disadvantage that it can be disallowed with a custom `SecurityManager`.
Note that this class is extracted from other place in standard library that uses it: scala.concurrent.util.Unsafe.instance
- it requires usage of `identityHashCode` that is stored for every object inside object header.
- as global arrays are used to store monitors, seemingly unrelated things may create contention. This is addressed in detail in evaluation section.

Both absence of monitor expansion and usage of `idetityHashCode` interact with
each other, as both of them operate on the object header. \[[12][12]\] presents
the complete graph of transitions between possible states of the object header.
What can be seen from this transition graph is that in the contended case,
versions V2-V5 were promoting object into the worst case, the `heavyweight
monitor` object, while the new scheme only disables biasing.

Note that under the schemes presented here, V2-V5, this change only happens in
the event of contention and happens per-object.

### Non-thread-safe lazy vals ###
While the new versions introduce speedups in the contended case, they do
generate complex byte-code and this may lead to the new scheme being less
appropriate for lazy vals that are not used in concurrent setting. In order to
perfectly fit this use-case we propose to introduce an encoding for
single-threaded lazy vals that is very simple and efficient:

    final class LazyCell {
      var value_0 = 0
      var flag = false
      def value =
        if (flag) value_0
        else {
          value_0 = <RHS>;
          flag = true;
        }
    }

This version is faster than all other versions on benchmarks but does not correctly handle safe publication in the case of multiple threads. It can be used in applications that utilize multiple threads if some other means of safe publication is used instead.

### Elegant Local lazy vals ###
Aside from lazy vals that are fields of objects, scala supports local lazy vals, defined inside methods:

    def method = {
      lazy val s = <RHS>
      s
    }

Currently, they use such encoding(we will call it L1):

    def method = {
      var @volatile flag: Byte = 0.toByte
      var s_0 = 0
      def s = {
        if(flag == 0){
          this.synchronized{
            if (flag == 0) {
              s_0 = <RHS>
              flag = 1
            }
          }
        s_0
        }
      s
    }

Which is later translated by subsequent phases to:

    private def method$s(flag: VolatileByteRef, s_0: IntRef) = {
        if(flag.value == 0){
          this.synchronized{
            if (flag.value == 0) {
              s_0.value = <RHS>
              flag.value = 1
            }
          }
        s_0.value
        }

    def method = {
      var flag = new VolatileByteRef(0)
      var s_0 = new IntRef(0)
      method$s(flag, s_0)
    }



The current implementation has several shortcomings:
 - it allocates two boxes
 - it synchronizes on `this`. This is most severe in case of lambdas, as lambdas do not introduce a new `this`.

We propose a new scheme, that is both simpler in implementation and is more efficient and slightly more compact.
The scheme introduces new helper classes to the standard library: such as `dotty.runtime.LazyInt`\[[17][17]\] and uses them to implement the local lazy val behavior.

    class LazyInt {
      var value: Int = _
      @volatile var initialized: Boolean = false
    }

    private def method$s(holder: LazyInt) = {
        if(!holder.initialized){
          holder.synchronized{
            if (!holder.initialized) {
              holder.value = <RHS>
              holder.initialized = true
            }
          }
        holder.value
        }

    def method = {
      var holder = new LazyInt()
      method$s(holder)
    }

This  solves the problem with deadlocks introduced by using java8 lambdas.\[[14][14]\]


### Language change ###
To address the fact that we now have both thread safe and single-threaded lazy vals,
we propose to bring lazy vals in sync with normal vals with regards to usage of `@volatile` annotation.

In order to simplify migration, Scalafix the migration tool that will be used to migrate between versions of Scala, including Dotty, supports a `VolatileLazyVal` rewrite that adds `@volatile` to all `lazy vals` present in the codebase.


## Evaluation ##

We focus on the memory footprint increase, the performance comparison and byte-code size. Note that the fast path (i.e. the cost of accessing a lazy val after it has been initialized) stays the same as in the current implementation. Thus, the focus of our measurements is on the overheads in the lazy val initialization in both the uncontended and the contended case.
The micro-benchmarks used for evaluation are available in a GitHub repo \[[6][6]\] and the graphs of the evaluation results are available online \[[7][7]\], \[[18][18]\], \[[19][19]\] . We used the ScalaMeter tool for measurements \[[9][9]\].

### Memory usage footprint ###

We expect that the proposed changes will not change the memory footprint for most objects that contain lazy vals. Each lazy val currently requires 4 or 8 bytes for the field, and an additional bit in the bitmap. As soon as the first bit is introduced into the bitmap, 1 additional byte is allocated for the object.

Since we now use 2 bits per lazy val field instead of 1, for classes having 4 or less lazy val field declarations the memory footprint per instance will thus not grow. For classes having more lazy val field declarations the memory footprint per instance will in most cases not grow since the objects have to be aligned to an 8 byte boundary anyway.

We measured the memory footprint of an array of objects with single lazy val fields. The memory footprint did not change with respect to the current version \[[6][6]\] \[[7][7]\].
The detailed experimental measurements  graphs of memory footprint can be seen in graphs.\[[18][18]\]

### Performance ###

We measured performance in both the uncontended and the contended case. We measured on an i7-2600, a 64-bit Oracle JVM, version 1.7 update 4.

For the uncontended case, we measure the cost of creating N objects and initializing their lazy val fields. The measurement includes both the object creation times and their initialization, where the initialization is the dominant factor.

For the contended case, we measure the cost of initializing the lazy fields of N objects, previously created and stored in an array, by 4 different threads that linearly try to read the lazy field of an object before proceeding to the next one. The goal of this test is to asses the effect of entering the synchronized block and notifying the waiting threads - since the slow path is slower, the threads that “lag” behind should quickly reach the first object with an uninitialized lazy val, causing contention.

The current lazy val implementation (V1) seems to incur initialization costs that are at least 6 times greater compared to referencing a regular val. The handwritten implementation produces identical byte-code, with the difference that the calls are virtual instead of just querying the field value; this is probably the reason as to why it is up to 50% slower. The 2 synchronized blocks design with an eager notify (V2) is 3-4 times slower than the current implementation - just adding the `notifyAll` call changes things considerably. The 4 state/2 synchronized blocks approach (V3) is only 33-50% slower than the current implementation (V1). The CAS-based approach where `AtomicInteger`s are extended is as fast as the current lazy val initialization (V1), but when generalized and replaced with `AtomicReferenceFieldUpdater`s as discussed before, it is almost 50% slower than the current implementation (V1). The final version, V6 uses `Unsafe` to bring back performance and is as around twice as fast as current implementation (V1) while maintaining correct semantics.

The CAS-based approaches (V4, V5 and V6) appear to offer the best performance here, being twice as fast than the current implementation (V1).

The proposed solution with (V6) is 50% faster\[[19][19]\] than the current lazy val implementation in the contended case. This comes at a price of synchronizing on a global array of monitors, which may create contention between seemingly unrelated things. The more monitors that are created, the less is the probability of such contention. There's also a positive effect though, the reuse of global objects for synchronization allows the monitors on the instances containing lazy vals to not be expanded, saving on non-local memory allocation. The current implementation uses `8 * processorCount * processorCount` monitors and the benchmarks and by-hand study with "Vtune Amplifier XE" demonstrate that the positive effect dominates, introducing a 2% speedup\[[13][13]\]. It’s worth mentioning that this is not a typical use-case that reflects a practical application, but rather a synthetic edge case designed to show the worst-case comparison demonstrating cache contention.

The local lazy vals implementation is around 6x faster than the current version, as it eliminates the need for boxing and reduces the number of allocations from 2 to 1.

The concrete micro-benchmark code is available as a GitHub repo \[[6][6]\]. It additionally benchmarks many other implementations that are not covered in the text of this SIP, in particular it tests versions based on MethodHandles and runtime code generation as well as versions that use additional spinning before synchronizing on the monitor.
For those wishing to reproduce the results, the benchmarking suite takes 90 minutes to run on contemporary CPUs. Enabling all the disabled benchmarks, in particular those that evaluate the `invokeDynamic` based implementation, will make the benchmarks take around 5 hours.

The final result of those benchmarks is that amount proposed versions, the two that worth considering are (V4-general) and (V6).
They both perform better than the current implementation in all the contended case.
Specifically, in the contended case, V6 is 2 times fater than V1, while V4-general is 4 times faster.
Unfortunately V4-general is 30% slower in the uncontended case than current implementation(V1), while V6 is in the same ballpark, being up to 5% slower or faster depending on the setup of the benchmark.

Based on this, we propose V6 to be used as default in future versions of Scala.

### Code size ###
The versions presented in V2-V6 have a lot more complex implementation and this shows up the size of the byte-code. In the worst-case scenario, when the `<RHS>` value is a constant, the current scheme (V1) creates an initializer method that has a size of 34 bytes, while dotty creates a version that is 184 bytes long. Local optimizations present in dotty linker\[[14][14]\] are able to reduce this size down to 160 bytes, but this is still substantially more than the current version.

On the other hand, the single-threaded version does not need separate initializer method and is around twice smaller than the current scheme (V1).

The proposed local lazy val transformation scheme also creates less byte-code, introducing 34 bytes instead of 42 bytes, mostly due to reduction in constant table size.

## Current status ##
Version V6 is implemented and used in Dotty, together with language change that makes lazy vals thread-unsafe if `@volatile` annotation is not specified.
Dotty implementation internally uses `@static` proposed in \[[16][16]\].

Both Dotty and released Scala 2.12 already implement "Elegant Local lazy vals". This was incorporated in the 2.12 release before this SIP was considered, as it was fixing a bug that blocked release\[[14][14]\].

### Unsafe ###
The proposed version, V6 relies on `sun.misc.Unsafe` in order to implement it's behaviour.
While `sun.misc.Unsafe` will remain availabe in Java9 there's an intention to deprecate it and replace it with VarHandles.\[[20][20]\].
The proposed version V6 can be implemented with using functionality present in Var Handles.

## Acknowledgements ##

We would like to thank Peter Levart and the other members of the concurrency-interest mailing list for their suggestions, as well as the members of the scala-internals mailing list for the useful discussions and input.


## References ##
1. [Summary of lazy vals discussions, Scala Internals Mailing list, May 2013][1]
2. [The cost of `notifyAll`, Concurrency Interest Mailing List, May 2013][2]
3. [Scala Parallel Collection in Object Initializer Causes a Program to Hang][3]
4. [Program Hangs If Thread Is Created In Static Initializer Block][4]
5. [Java Language Specification, 12.4.2][5]
6. [GitHub Repo with Microbenchmarks][6]
7. [Uncontended Performance Evaluation Results][7]
8. [ScalaMeter GitHub Repo][8]
9. [Lazy Vals in Dotty, Scala Internals Mailing list, February 2014][9]
10. [Lazy Vals in Dotty, Dotty Internals Mailing list, February 2014][10]
11. [LazyVals runtime module, Dotty sourcecode, February 2014][11]
12. [Synchronization, HotSpot internals wiki, April 2008][12]
13. [Lazy Vals in Dotty, cache contention discussion, February 2014][13]
14. [SI-9824 SI-9814 proper locking scope for lazy vals in lambdas, April 2016][14]
15. [Introducing Scalafix: a migration tool for Scalac to Dotty, October 2016][15]
16. [@static sip, January 2016][16]
17. [LazyVal Holders in Dotty][17]
18. [Memory Footprint Evaluation Results][18]
19. [Contended Performance Evaluation Results][19]
20. [JEP 193: Variable Handles][20]

  [1]: https://groups.google.com/forum/#!topic/scala-internals/cCgBMp5k8R8 "scala-internals"
  [2]: http://cs.oswego.edu/pipermail/concurrency-interest/2013-May/011354.html "concurrency-interest"
  [3]: http://stackoverflow.com/questions/15176199/scala-parallel-collection-in-object-initializer-causes-a-program-to-hang "pc-object-hang"
  [4]: http://stackoverflow.com/questions/7517964/program-hangs-if-thread-is-created-in-static-initializer-block "static-init-hang"
  [5]: http://docs.oracle.com/javase/specs/jls/se7/html/jls-12.html#jls-12.4.2 "jls-spec"
  [6]: https://github.com/DarkDimius/lazy-val-bench/blob/CallSites/src/test/scala/example/package.scala "lazy-val-bench-code"
  [7]: https://d-d.me/tnc/30/lazy-sip-perf/report/#config=%7B%22filterConfig%22%3A%7B%22curves%22%3A%5B%220%22%2C%221%22%2C%225%22%2C%226%22%2C%227%22%2C%228%22%2C%2210%22%2C%2212%22%5D%2C%22order%22%3A%5B%22param-size%22%2C%22date%22%5D%2C%22filters%22%3A%5B%5B%22100000%22%2C%22300000%22%2C%22500000%22%2C%221000000%22%2C%223000000%22%2C%225000000%22%5D%2C%5B%221477397877000%22%5D%5D%7D%2C%22chartConfig%22%3A%7B%22type%22%3A0%2C%22showCI%22%3Afalse%7D%7D "lazy-val-bench-report"
  [8]: http://axel22.github.io/scalameter/ "scalameter-code"
  [9]: https://groups.google.com/forum/#!msg/scala-internals/4sjw8pcKysg/GlXYDDzCgI0J "scala-internals"
  [10]: https://groups.google.com/forum/#!topic/dotty-internals/soWIWr3bRk8 "dotty-internals"
  [11]: https://github.com/lampepfl/dotty/blob/5cbd2fbc8409b446f8751792b006693e1d091055/src/dotty/runtime/LazyVals.scala
  [12]: https://wiki.openjdk.java.net/display/HotSpot/Synchronization
  [13]: https://groups.google.com/d/msg/scala-internals/4sjw8pcKysg/gD0au4dmTAsJ
  [14]: https://github.com/scala/scala-dev/issues/133
  [15]: http://scala-lang.org/blog/2016/10/24/scalafix.html
  [16]: https://github.com/scala/docs.scala-lang/pull/491
  [17]: https://github.com/lampepfl/dotty/blob/f92f278ab686ab218e841082dcb026c6c8ef89b7/library/src/dotty/runtime/LazyHolders.scala
  [18]: https://d-d.me/tnc/30/lazy-mem/report/#config=%7B%22filterConfig%22%3A%7B%22curves%22%3A%5B%22-1%22%2C%220%22%2C%221%22%2C%222%22%2C%223%22%2C%224%22%2C%225%22%2C%226%22%2C%227%22%2C%228%22%5D%2C%22order%22%3A%5B%22param-size%22%2C%22date%22%5D%2C%22filters%22%3A%5B%5B%221000000%22%2C%222000000%22%2C%223000000%22%2C%224000000%22%2C%225000000%22%5D%2C%5B%221477396691000%22%5D%5D%7D%2C%22chartConfig%22%3A%7B%22type%22%3A0%2C%22showCI%22%3Afalse%7D%7D
  [19]: https://d-d.me/tnc/30/lazy-sip-perf/report/#config=%7B%22filterConfig%22%3A%7B%22curves%22%3A%5B%2216%22%2C%2217%22%2C%2218%22%2C%2219%22%2C%2221%22%2C%2222%22%2C%2223%22%5D%2C%22order%22%3A%5B%22param-size%22%2C%22date%22%5D%2C%22filters%22%3A%5B%5B%22100000%22%2C%22300000%22%2C%22500000%22%2C%221000000%22%2C%223000000%22%2C%225000000%22%5D%2C%5B%221477397877000%22%5D%5D%7D%2C%22chartConfig%22%3A%7B%22type%22%3A0%2C%22showCI%22%3Afalse%7D%7D
  [20]: http://openjdk.java.net/jeps/193
