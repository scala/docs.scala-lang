---
layout: tutorial
title: 介绍
languages:[en,es,"zh-cn""]

disqus: true

tutorial: scala-tour
num: 1
---

Scala是一门现代的多范式编程语言，致力于以简洁，优雅并且类型安全的方式表达通用的编程模式。它平滑地融合了面向对象和函数式语言的特性。

## Scala 是面向对象的 ##

Scala是一门纯面向对象语言，因为[一切值都是对象](unified-types.html)。对象的类型和行为通过[类](classes.html)和[特性](traits.html)描述。类可以通过子类和一个灵活的[基于混合类的组合](mixin-class-composition.html)(mixin-based composition)机制被继承，作为多继承的简单替代方案。

## Scala 是函数式的 ##

Scala也是一门函数式语言，因为[一切函数都是值](unified-types.html)。Scala提供了轻量的语法用于定义匿名函数，它支持[高阶函数](higher-order-functions.html)(high-order)，允许函数[嵌套](nested-functions.html)，支持[柯里化](currying.html)(currying)。Scala的[实例类](case-classes.html)(case class)及其内置支持的[模式匹配](pattern-matching.html)（pattern matching）模型代数类型在许多函数式编程语言中被使用到。

此外，Scala原生模式匹配的概念，借助[右侧忽略序列模式](regular-expression-patterns.html)(right-ignoring sequence patterns)，可以很自然的扩展到[XML数据的处理](xml-processing.html)。从这个角度来讲，[序列推导式](sequence-comprehensions.html)(sequence comprehensions)对于编写公式化查询非常有用。这些特性使得Scala成为开发诸如Web服务等应用的理想解决方案。

## Scala 是静态类型的 ##

Scala配备了一套富有表现力的类型系统，静态地强制抽象是以安全而清晰地方式被使用。值得指出的是，这个类型系统支持：

* [范型类](generic-classes.html)
* [型变注释](variances.html)
* 类型[上限](upper-type-bounds.html)和[下限](lower-type-bounds.html)
* [内部类](inner-classes.html)和[抽象类型](abstract-types.html)作为对象成员
* [复合类型](compound-types.html)
* [显式类型的自身引用](explicitly-typed-self-references.html)
* [视图](views.html)
* [多态方法](polymorphic-methods.html)

[本地类型推断机制](local-type-inference.html)确保使用者不需要利用冗余的类型信息为程序作注解。综合而言，这些特性为编程抽象化的安全复用以及软件的类型安全扩展奠定了强大的基础。

## Scala是可扩展的 ##
 
实际上，特定领域(domain-specific)应用的开发往往需要特定领域语言(DSL)的扩展。Scala将语言机制独特的融合到一起，使得易于通过库的形式平滑地增添新的语言结构：

* 任何方法均可用作[中缀或后缀操作符](operators.html)
* [闭包(Closure)可根据期望类型自动创建](automatic-closures.html)（即目标类型）

将两种特性结合使用有助于在不扩展语法而且不使用类似宏的元编程工具的情况下定义新的语句。

Scala可与Java与.NET平台互操作。 
Scala被设计与当下流行的Java2运行环境(JRE)有着良好的互操作性。特别是，与主流面向对象的Java编程语言的交互及其平滑。Scala的编译模型与Java类似（分离编译，动态类加载），并且可以访问成千上万现存的高质量类库。也支持.NET框架（CLR）。

请至下一页继续阅读

<a href="http://haoch.me" alt="译：陈浩"/>