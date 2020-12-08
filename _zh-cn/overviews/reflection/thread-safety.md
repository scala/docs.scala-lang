---
layout: multipage-overview
title: 线程安全
partof: reflection
overview-name: Reflection

num: 6
language: zh-cn
---

<span class="label important" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako**

遗憾的是，在scala2.10.0发布的现行状态下，反射不是线程安全的。
这里有个JIRA问题 [SI-6240](https://issues.scala-lang.org/browse/SI-6240)，它可以用来跟踪我们的进度和查找技术细节，下面是最新技术的简要总结。

<p><span class="label success">NEW</span>Thread safety issues have been fixed in Scala 2.11.0-RC1, but we are going to keep this document available for now, since the problem still remains in the Scala 2.10.x series, and we currently don't have concrete plans on when the fix is going to be backported.</p>

目前，在反射相关方面存在两种竞争状态。 第一是反射的初始化（当调用代码首次访问`scala.reflect.runtime.universe`时）无法从多个线程安全地调用。第二是符号的初始化（当调用代码第一次访问符号的标记或类型签名时）也不安全。
这是一个典型的表现：

    java.lang.NullPointerException:
    at s.r.i.Types$TypeRef.computeHashCode(Types.scala:2332)
    at s.r.i.Types$UniqueType.<init>(Types.scala:1274)
    at s.r.i.Types$TypeRef.<init>(Types.scala:2315)
    at s.r.i.Types$NoArgsTypeRef.<init>(Types.scala:2107)
    at s.r.i.Types$ModuleTypeRef.<init>(Types.scala:2078)
    at s.r.i.Types$PackageTypeRef.<init>(Types.scala:2095)
    at s.r.i.Types$TypeRef$.apply(Types.scala:2516)
    at s.r.i.Types$class.typeRef(Types.scala:3577)
    at s.r.i.SymbolTable.typeRef(SymbolTable.scala:13)
    at s.r.i.Symbols$TypeSymbol.newTypeRef(Symbols.scala:2754)

好消息是，编译时反射（通过`scala.reflect.macros.Context`暴露给宏的那一种）比运行时反射（通过`scala.reflect.runtime.universe`暴露出的那一种）更不容易受到线程问题的影响。
第一个原因是，当宏有机会运行时，编译时反射`universe`已经初始化，这规避了我们的竞争条件1。第二个理由是至今为止没有编译程序本身就是线程安全，所以没有并行执行的工具。但是，如果您的宏产生了多个线程，则你仍应该小心。


不过，对于运行时反射来说，情况要糟糕得多。首次初始化`scala.reflect.runtime.universe`时，称为反射初始化，而且这种初始化可以间接发生。
此处最突出的示例是，调用带有`TypeTag`上下文边界的方法可能会带来问题，因为调用这种方法，Scala通常需要构造一个自动生成的类型标签，该标签需要创建一个类型，并需要初始化反射`universe`。
这个结果是，如果不采取特殊措施，就无法在测试中可靠地调用基于`TypeTag`的方法，这是因为sbt等很多工具并行执行测试。

汇总：
* 如果您正在编写一个没有显式创建线程的宏那就没有问题。
* 线程或参与者（actors）混在一起的运行时反射可能很危险。
* 多个带有`TypeTag`上下文边界的线程调用方法可能导致不确定的结果。
* 请查看 [SI-6240](https://issues.scala-lang.org/browse/SI-6240)，以了解我们在此问题上的进展。
