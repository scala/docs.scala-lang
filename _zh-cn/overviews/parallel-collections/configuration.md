---
layout: multipage-overview
title: 配置并行集合

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 7
language: zh-cn
---


### 任务支持

并行集合是以操作调度的方式建模的。每一个并行集合都有一个任务支持对象作为参数，该对象负责处理器任务的调度和负载均衡。

任务支持对象内部有一个线程池实例的引用，并且决定着任务细分成更小任务的方式和时机。更多关于这方面的实现细节，请参考技术手册 [[1](http://infoscience.epfl.ch/record/165523/files/techrep.pdf)]。

并行集合的任务支持现在已经有一些可用的实现。ForkJoinTaskSupport内部使用fork-join池，并被默认用与JVM1.6以及更高的版本。ThreadPoolTaskSupport 效率更低，是JVM1.5和不支持fork-join池的JVM的回退。ExecutionContextTaskSupport 使用在scala.concurrent中默认的执行上下文实现，并且它重用在scala.concurrent使用的线程池（根据JVM版本，可能是fork join 池或线程池执行器）。执行上下文的任务支持被默认地设置到每个并行集合中，所以并行集合重用相同的fork-join池。

以下是一种改变并行集合的任务支持的方法：

    scala> import scala.collection.parallel._
    import scala.collection.parallel._

    scala> val pc = mutable.ParArray(1, 2, 3)
    pc: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 2, 3)

    scala> pc.tasksupport = new ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(2))
    pc.tasksupport: scala.collection.parallel.TaskSupport = scala.collection.parallel.ForkJoinTaskSupport@4a5d484a

    scala> pc map { _ + 1 }
    res0: scala.collection.parallel.mutable.ParArray[Int] = ParArray(2, 3, 4)

以上代码配置并行集合使用parallelism 级别为2的fork-join池。配置并行集合使用线程池执行器：

    scala> pc.tasksupport = new ThreadPoolTaskSupport()
    pc.tasksupport: scala.collection.parallel.TaskSupport = scala.collection.parallel.ThreadPoolTaskSupport@1d914a39

    scala> pc map { _ + 1 }
    res1: scala.collection.parallel.mutable.ParArray[Int] = ParArray(2, 3, 4)

当一个并行集合被序列化，它的任务支持域免于序列化。当对一个并行集合反序列化时，任务支持域被设置为默认值——执行上下文的任务支持。

通过继承TaskSupport 特征并实现下列方法，可实现一个典型的任务支持：

    def execute[R, Tp](task: Task[R, Tp]): () => R

    def executeAndWaitResult[R, Tp](task: Task[R, Tp]): R

    def parallelismLevel: Int

execute方法异步调度任务并且返回等待计算结果的未来状态。executeAndWait 方法功能一样，但只当任务完成时才返回。parallelismLevel 简单地返回任务支持用于调度任务的处理器目标数量。

**引用**

1. [On a Generic Parallel Collection Framework, June 2011](http://infoscience.epfl.ch/record/165523/files/techrep.pdf)
