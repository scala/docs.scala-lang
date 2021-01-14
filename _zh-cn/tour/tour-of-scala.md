---
layout: tour
title: 导言
partof: scala-tour

num: 1

language: zh-cn

next-page: basics
---

## 欢迎来到Scala之旅
本次 Scala 之旅教程包含了对于大多数 Scala 特性的简单介绍。主要针对 Scala 这门语言的初学者。

这是个简化的教程，如果希望得到完整的话，可以考虑购买[书籍](/books.html)或者参考[其他资源](/learn.html)。

## Scala是什么？
Scala是一门现代的多范式语言，志在以简洁、优雅及类型安全的方式来表达常用的编程模型。它平滑地集成了面向对象和函数式语言的特性。

## Scala是面向对象的 ##
鉴于[一切值都是对象](unified-types.html)，可以说Scala是一门纯面向对象的语言。对象的类型和行为是由[类](classes.html)和[特质](traits.html)来描述的。类可以由子类化和一种灵活的、基于mixin的组合机制（它可作为多重继承的简单替代方案）来扩展。

## Scala是函数式的 ##

鉴于[一切函数都是值](unified-types.html)，又可以说Scala是一门函数式语言。Scala为定义匿名函数提供了[轻量级的语法](basics.html#函数)，支持[高阶函数](higher-order-functions.html)，允许[函数嵌套](nested-functions.html)及[柯里化](multiple-parameter-lists.html)。Scala的[样例类](case-classes.html)和内置支持的[模式匹配](pattern-matching.html)代数模型在许多函数式编程语言中都被使用。对于那些并非类的成员函数，[单例对象](singleton-objects.html)提供了便捷的方式去组织它们。

此外，通过对提取器的一般扩展，Scala的模式匹配概念使用了[right-ignoring序列模式](regular-expression-patterns.html)，自然地延伸到[XML数据的处理](https://github.com/scala/scala-xml/wiki/XML-Processing)。其中，[for表达式](for-comprehensions.html)对于构建查询很有用。这些特性使得Scala成为开发web服务等程序的理想选择。

## Scala是静态类型的 ##
Scala配备了一个拥有强大表达能力的类型系统，它可以静态地强制以安全、一致的方式使用抽象。典型来说，这个类型系统支持：

* [泛型类](generic-classes.html)
* [型变注解](variances.html)
* [上](upper-type-bounds.html)、[下](lower-type-bounds.html) 类型边界
* 作为对象成员的[内部类](inner-classes.html)和[抽象类型](abstract-type-members.html)
* [复合类型](compound-types.html)
* [显式类型的自我引用](self-types.html)
* [隐式参数](implicit-parameters.html)和[隐式转化](implicit-conversions.html)
* [多态方法](polymorphic-methods.html)

[类型推断](type-inference.html)让用户不需要标明额外的类型信息。这些特性结合起来为安全可重用的编程抽象以及类型安全的扩展提供了强大的基础。

## Scala是可扩展的

在实践中，特定领域应用的发展往往需要特定领域的语言扩展。Scala提供了一种语言机制的独特组合方式，使得可以方便地以库的形式添加新的语言结构。

很多场景下，这些扩展可以不通过类似宏（macros）的元编程工具完成。例如：

* [隐式类](https://docs.scala-lang.org/overviews/core/implicit-classes.html)允许给已有的类型添加扩展方法。
* [字符串插值](/overviews/core/string-interpolation.html)可以让用户使用自定义的插值器进行扩展。

## Scala的互操作性

Scala设计的目标是与流行的Java运行环境（JRE）进行良好的互操作，特别是与主流的面向对象编程语言——Java的互操作尽可能的平滑。Java的最新特性如函数接口（SAMs）、[lambda表达式](higher-order-functions.html)、[注解](annotations.html)及[泛型类](generic-classes.html) 在Scala中都有类似的实现。

另外有些Java中并没有的特性，如[缺省参数值](default-parameter-values.html)和[带名字的参数](named-arguments.html)等，也是尽可能地向Java靠拢。Scala拥有类似Java的编译模型（独立编译、动态类加载），且允许使用已有的成千上万的高质量类库。

## 尽享学习之乐

请点击菜单上的[下一页](basics.html)继续阅读。
