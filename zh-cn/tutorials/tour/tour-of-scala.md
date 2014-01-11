---
layout: tutorial
title: Introduction
languages:["zh-cn"]

disqus: true

tutorial: scala-tour
num: 1
---

Scala is a modern multi-paradigm programming language designed to express common programming patterns in a concise, elegant, and type-safe way. It smoothly integrates features of object-oriented and functional languages.

Scala是一门现代的多范式编程语言，致力于以简洁，优雅并且类型安全的方式表达通用的编程模式。它平缓地融合了面向对象和函数式语言的特性。

## Scala is object-oriented ##
Scala is a pure object-oriented language in the sense that [every value is an object](unified-types.html). Types and behavior of objects are described by [classes](classes.html) and [traits](traits.html). Classes are extended by subclassing and a flexible [mixin-based composition](mixin-class-composition.html) mechanism as a clean replacement for multiple inheritance.

## Scala 是面向对象的 ##
Scala是一门纯面向对象语言，因为[一切值都是对象](unified-types.html)。对象的类型和行为通过[Class](classes.html)和[Trait](traits.html)描述。类可以通过子类和一个灵活的[基于混合类的组合](mixin-class-composition.html)(mixin-based composition)机制被继承，作为多重继承的简单替代方案。

## Scala is functional ##
Scala is also a functional language in the sense that [every function is a value](unified-types.html). Scala provides a [lightweight syntax](anonymous-function-syntax.html) for defining anonymous functions, it supports [higher-order functions](higher-order-functions.html), it allows functions to be [nested](nested-functions.html), and supports [currying](currying.html). Scala's [case classes](case-classes.html) and its built-in support for [pattern matching](pattern-matching.html) model algebraic types used in many functional programming languages.

Furthermore, Scala's notion of pattern matching naturally extends to the [processing of XML data](xml-processing.html) with the help of [right-ignoring sequence patterns](regular-expression-patterns.html). In this context, [sequence comprehensions](sequence-comprehensions.html) are useful for formulating queries. These features make Scala ideal for developing applications like web services.

## Scala 是函数式的 ##
Scala也是一个函数式语言，因为[一切函数都是值](unified-types.html)。Scala提供了轻量的语法用于定义匿名函数，它支持[高阶函数](higher-order-functions.html)(high-order)，允许函数[嵌套](nested-functions.html)，支持[柯里化](currying.html)(currying)。Scala的[实例类](case-classes.html)(case class)及其内置支持的[模式匹配](pattern-matching.html)模型代数类型在许多函数式编程语言中被使用。

此外，Scala原生模式匹配的概念结合[右侧忽略序列模式](regular-expression-patterns.html)(right-ignoring sequence patterns)可用于[XML数据的处理](xml-processing.html).就此角度而言，[序列推导式](sequence-comprehensions.html)(sequence comprehensions)对于编写公式化查询非常有用。这些特性使得Scala成为开发诸如Web服务等应用的理想解决方案。

## Scala is statically typed ##
Scala is equipped with an expressive type system that enforces statically that abstractions are used in a safe and coherent manner. In particular, the type system supports:
* [generic classes](generic-classes.html)
* [variance annotations](variances.html)
* [upper](upper-type-bounds.html) and [lower](lower-type-bounds.html) type bounds,
* [inner classes](inner-classes.html) and [abstract types](abstract-types.html) as object members
* [compound types](compound-types.html)
* [explicitly typed self references](explicitly-typed-self-references.html)
* [views](views.html)
* [polymorphic methods](polymorphic-methods.html)

A [local type inference mechanism](local-type-inference.html) takes care that the user is not required to annotate the program with redundant type information. In combination, these features provide a powerful basis for the safe reuse of programming abstractions and for the type-safe extension of software.

## Scala 是静态类型的 ##
Scala配备了一套富有表现力的类型系统，静态地强制是抽象得以安全与一致性地方式进行。值得指出的是，这个类型系统支持：

* [范型类](generic-classes.html)
* [型变注释](variances.html)
* 类型[上限](upper-type-bounds.html)和[下限](lower-type-bounds.html)
* [内部类](inner-classes.html)和[抽象类型](abstract-types.html)作为对象成员
* [复合类型](compound-types.html)
* [声明类型的自身引用](explicitly-typed-self-references.html)
* [视图](views.html)
* [多态方法](polymorphic-methods.html)

[本地类型推断机制](local-type-inference.html)令使用者无需使用过剩的类型信息为程序做注解。综合而言，这些特性为编程抽象化的安全复用以及软件的类型安全扩展提供了强大的基础。

## Scala is extensible ##

In practice, the development of domain-specific applications often requires domain-specific language extensions. Scala provides a unique combination of language mechanisms that make it easy to smoothly add new language constructs in form of libraries:
* any method may be used as an [infix or postfix operator](operators.html)
* [closures are constructed automatically depending on the expected type](automatic-closures.html) (target typing).

A joint use of both features facilitates the definition of new statements without extending the syntax and without using macro-like meta-programming facilities.

Scala interoperates with Java and .NET.
Scala is designed to interoperate well with the popular Java 2 Runtime Environment (JRE). In particular, the interaction with the mainstream object-oriented Java programming language is as smooth as possible. Scala has the same compilation model (separate compilation, dynamic class loading) like Java and allows access to thousands of existing high-quality libraries. Support for the .NET Framework (CLR) is also available.

Please continue to the next page to read more.

## Scala是可扩展的 ##
 
实践中，特定领域(domain-specific)应用的开发往往需要特定领域语言(DSL)的扩展。Scala将语言机制独特的融合到一起，使得易于通过库的形式平滑地增添新的语言构成：

* 任何方法均可用作[中缀或后缀操作符](operators.html)
* [闭包(Closure)可根据期望类型自动创建](automatic-closures.html)（即目标类型）

将两种特性结合使用有助于在不扩展语法而且不使用类似宏的元编程工具的情况下定义新的声明。

Scala可与Java与.NET平台互操作。 

Scala被设计与当下流行的Java运行环境(JRE)有着良好的互操作。尤其是，Scala与主流的面向对象的Java编程语言可尽的交互尽可能的平滑。Scala的编译模型与Java类似（分离编译，动态类加载），并可以访问成千上万现存的高质量类库。对.NET框架（CLR）支持的也同样可能。

请至下一页继续阅读