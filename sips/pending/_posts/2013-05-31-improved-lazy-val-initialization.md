---
layout: sip
disqus: true
title: SIP-20 - Improved Lazy Vals Initialization

vote-status: deferred
vote-text: This SIP is in Deferred status currently. The decision will be made at the next SIP committee meeting.
---

**By: Aleksandar Prokopec, Miguel Garcia, Jason Zaugg, Hubert Plociniczak, Martin Odersky**

## Abstract ##

This SIP describes the changes in the lazy vals initialization mechanism that address some of the unnecessary deadlock scenarios. The newly proposed lazy val initialization mechanism aims to eliminate the acquisition of resources during the execution of the lazy val initializer block, thus reducing the possibility of a deadlock. The concrete deadlock scenarios that the new lazy val initialization scheme eliminates are summarized below.

The changes in this SIP have previously been discussed in depth on the mailing lists \[[1][1]\] \[[2][2]\].


## Description ##

The current lazy val initialization scheme uses double-checked locking to initialize the lazy val only once. A separate volatile bitmap field is used to store the state of the lazy val - a single bit in this bitmap denotes whether the lazy val is initialized or not.
Assume we have the following declaration.

    final class LazyCell {
      lazy val value = 0
    }

Here is an example of an manually written implementation equivalent to what the compiler currently does:

    final class LazyCell {
      @volatile var bitmap_0: Boolean = false
      var value_0: Int = _
      private def value_lzycompute(): Int = {
        this.synchronized {
          if (bitmap_0) {
            value_0 = 0
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

The initialization block of `a0` above refers to `b` in B, and the initialization of `B.b` refers to `A.a1`. While a circular dependency exists between these two objects, there is actually no circular dependency between specific lazy vals `a0`, `a1` and `b`.

In the current lazy vals implementation there exists a possibility of a deadlock if thread Ta attempts to initialize `A.a0` and thread Tb attempts to initialize `B.b`. Assume now that both Ta and Tb start the synchronized blocks simultaneously - a deadlock can occur due to each thread trying to grab a lock of the other object and not releasing their own until the initialization completes.

This SIP attempts to address this issue.

### Circular dependencies ###

Assume there are two objects A and B with lazy vals `a` and `b` respectively, where `a` needs `b` for initialization and vice versa. The current lazy vals implementation can cause a deadlock in this situation. Furthermore, in a single threaded scenario lazy val circular dependencies also lead to stack overflows with the current implementation:

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

In the current lazy initialization scheme initializing `x` causes a deadlock. The caller thread that initializes the lazy val `x` holds the monitor of the current object `self`, but the monitor is needed by another thread that sets a condition that the caller blocks on.

There is no circular dependency between the lazy val initialization block and the other synchronization construct, so logically there is no reason for a deadlock. As long as the other thread completes a condition that the caller depends on and eventually lets go of the current object `self`, the lazy val should be able to initialize itself.

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

In this code, the lazy val initialization block suspends until a condition is fulfilled. This condition can only be fulfilled by reading the value of lazy val `x` - another thread that is supposed to complete this condition cannot do so. Thus, a circular dependency is formed, and the lazy val cannot be initialized. Similar problems can arise with Scala singleton object initialization [1] when creating threads from the singleton object constructor and waiting for their completion, and with static initializer blocks in Java \[[2][2]\] \[[3][3]\].

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
        val result = 0 // the initializer block goes here
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
        val result = 0
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
            val result = 0
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
- it seems to have the same initialization performance as the current implementation in the uncontended case
- it relies less on the synchronized block, needing it only in the case of contention, thus being less prone to deadlocks

Some disadvantages:
- we cannot always extend an `AtomicInteger`, some classes already inherit something else
- in the contended worst-case, this scheme is equally prone to deadlocks, because it needs to acquire the synchronized block

However, in the more general setting where there are two or more lazy val fields in an object:
- the overall memory footprint is possibly increased - we would spend a minimum of 4 bytes per bitmap on first lazy val, where this was previously 1 byte
- in a setting with multiple bitmaps or an existing base class, we cannot extend `AtomicInteger` (that internally uses `Unsafe` directly), but need to use `AtomicIntegerFieldUpdater`s that are slower due to extra checks
- in a setting with multiple lazy val fields, we can no longer use a `getAndSet` in the initialization (concurrent accesses to other lazy fields may modify the bitmap - we have to read and recompute the expected bitmap state) - we need a `compareAndSet` and have some retry-logic (see the `complete` method below), which is slower
- due to the restrictions on the `AtomicIntegerFieldUpdater`s, we would need to make the bitmap_0 field publicly visible on the bytecode level, which might be an issue for Java code interfacing Scala code
- it is much complicated than the 2 synchronized blocks implementation

Here is a more general implementation, that is slower in the uncontended case than both the current implementation (V1) and the proposed implementation with synchronized blocks (V3). This implementation is, however, in the contended case twice as fast than the current implementation (V1).
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
            val result = 0
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

The `Unsafe` class has a disadvantage that it can be disallowed with a custom `SecurityManager`, so we cannot use it instead.

We propose the slightly less efficient, but simpler synchronized approach.


## Evaluation ##

We focus on the memory footprint increase and the performance comparison. Note that the fast path (i.e. the cost of accessing a lazy val after it has been initialized) stays the same as in the current implementation. We thus focus on measuring the overheads in the lazy val initialization in both the uncontended and the contended case.
The microbenchmarks used for evaluation are available in a GitHub repo \[[6][6]\] and the graphs of the evaluation results are available online \[[7][7]\]. We uses the ScalaMeter tool for measurements \[[9][9]\].

### Memory usage footprint ###

We expect that the proposed changes will not change the memory footprint for most objects that contain lazy val declarations. Each lazy val currently requires a 4 or 8 bytes for the field, and an additional bit in the bitmap. As soon as the first bit is introduced into the bitmap, 1 additional byte is allocated for the object.

Since we now use 2 bits per lazy val field instead of 1, for classes having 4 or less lazy val field declarations the memory footprint per instance will thus not grow. For classes having more lazy val field declarations the instance memory footprint per instance will in most cases not grow since the objects have to be aligned to an 8 byte boundary anyway.

We measured the memory footprint of an array of objects with single lazy val fields. The memory footprint did not change with respect to the current version \[[6][6]\] \[[7][7]\].

### Performance ###

We measured performance in both the uncontended and the contended case. We measured on an i7-2600, a 64-bit Oracle JVM, version 1.7 update 4.

For the uncontended case, we measure the cost of creating N objects and initializing their lazy val fields. The measurement includes both the object creation times and their initialization, where the initialization is the dominant factor.

For the contended case, we measure the cost of initializing the lazy fields of N objects, previously created and stored in an array, by 4 different threads that linearly try to read the lazy field of an object before proceeding to the next one. The goal of this test is to asses the effect of entering the synchronized block and notifying the waiting threads - since the slow path is slower, the threads that “lag” behind should quickly reach the first object with an uninitialized lazy val, causing contention.

The current lazy val implementation (V1) seems to incur initialization costs that are at least 6 times greater compared to referencing a regular val. The handwritten implementation produces identical bytecode, with the difference that the calls are virtual instead of just querying the field value, probably the reason due to which it is up to 50% slower. The 2 synchronized blocks design with an eager notify (V2) is 3-4 times slower than the current lazy val implementation - just adding the `notifyAll` call changes things considerably. The 4 state/2 synchronized blocks approach (V3) is only 33-50% slower than the current lazy val implementation (V1). The CAS-based approach where `AtomicInteger`s are extended is as fast as the current lazy val initialization (V1), but when generalized and replaced with `AtomicReferenceFieldUpdater`s as discussed before, it is almost 50% slower than the current implementation V1.

The CAS-based approaches appear to have the best performance here, being twice as fast than the current lazy val initialization implementation (V1). The proposed solution with 4 states and 2 synchronized blocks (V3) is 25% slower than the current lazy val implementation. It’s worth mentioning that this is not a typical use-case that reflects a practical application, but rather a synthetic borderline designed to perform the worst-case comparison in the contention case.

The concrete microbenchmark code is available as a GitHub repo \[[6][6]\].


## Acknowledgements ##

We would like to thank Peter Levart and the other members of the concurrency-interest mailing list for their suggestions, as well as the members of the scala-internals mailing list for the useful discussions and their input.


## References ##
1. [Summary of lazy vals discussions, Scala Internals Mailing list, May 2013][1]
2. [The cost of `notifyAll`, Concurrency Interest Mailing List, May 2013][2]
3. [Scala Parallel Collection in Object Initializer Causes a Program to Hang][3]
4. [Program Hangs If Thread Is Created In Static Initializer Block][4]
5. [Java Language Specification, 12.4.2][5]
6. [GitHub Repo with Microbenchmarks][6]
7. [Evaluation Results][7]
8. [ScalaMeter GitHub Repo][8]

  [1]: https://groups.google.com/forum/#!topic/scala-internals/cCgBMp5k8R8 "scala-internals"
  [2]: http://cs.oswego.edu/pipermail/concurrency-interest/2013-May/011354.html "concurrency-interest"
  [3]: http://stackoverflow.com/questions/15176199/scala-parallel-collection-in-object-initializer-causes-a-program-to-hang "pc-object-hang"
  [4]: http://stackoverflow.com/questions/7517964/program-hangs-if-thread-is-created-in-static-initializer-block "static-init-hang"
  [5]: http://docs.oracle.com/javase/specs/jls/se7/html/jls-12.html#jls-12.4.2 "jls-spec"
  [6]: https://github.com/axel22/lazy-val-bench "lazy-val-bench-code"
  [7]: http://lampwww.epfl.ch/~prokopec/lazyvals/report/ "lazy-val-bench-report"
  [8]: http://axel22.github.io/scalameter/ "scalameter-code"



