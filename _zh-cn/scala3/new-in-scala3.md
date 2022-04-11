---
layout: singlepage-overview
title: New in Scala 3
scala3: true
---

令人振奋的新版 Scala 3 带来了许多改进和新功能。在这里，我们为你提供最重要的变更的快速概述。如果你想深入挖掘，还有一些参考资料供你使用。

- [Scala 3 Book]({% link _overviews/scala3-book/introduction.md %}) 面向刚接触 Scala 语言的开发人员。
- [Syntax Summary][syntax-summary] 为您提供了新语法的正式描述。
- [Language Reference][reference] 对 Scala 2 到 Scala 3 的变化做了详细说明。
- [Migration Guide][migration] 为你提供了从 Scala 2 迁移到 Scala 3 的所有必要信息。
- [Scala 3 Contributing Guide][contribution] Scala 3 贡献指南，更深入地探讨了编译器，包括修复问题的指南。

## What's new in Scala 3
Scala 3 是对 Scala 语言的一次彻底改造。在其核心部分，类型系统的许多方面都被改变了，变得更有原则性。虽然这也带来了令人兴奋的新功能（比如联合类型），但首先意味着类型系统变得（甚至）不那么碍事了，例如[类型推断][type-inference]和 overload resolution 都得到了很大的改善。

### 新的和闪亮的：语法

除了许多（小的）清理，Scala 3 的语法还提供了以下改进：

- 用于控制结构的新“quiet”语法，如 `if`、`while` 和 `for` 。 ([new control syntax][syntax-control])
- `new` 关键字是可选的 (_aka_ [creator applications][creator])
- [Optional braces][syntax-indentation]：可选的大括号，支持不受干扰、缩进敏感的编程风格
- [类型级通配符][syntax-wildcard] 从 `_` 更改为 `?`。
- implicit（和它们的语法）已被[大量修订][implicits]。

### Opinionated: Contextual Abstractions
Scala的一个基本核心概念是（在某种程度上仍然是）为用户提供一小部分强大的功能，这些功能可以被组合成巨大的（有时甚至是不可预见的）表达能力。例如，_implicit_ 的特性被用来模拟上下文抽象、表达类型级计算、模拟类型类、执行隐式强制、编码扩展方法等等。从这些用例中学习，Scala 3 采取了一种略微不同的方法，专注于 __意图__ 而非 __机制__。Scala 3 没有提供一个非常强大的功能，而是提供了多个定制的语言功能，让程序员直接表达他们的意图。

- **Abtracting over contextual information**. [Using clauses][contextual-using] 允许程序员对调用上下文中的信息进行抽象，这些信息应该以隐式方式传递。作为对 Scala 2 implicits 的改进，可以按类型指定`using`子句，从而将函数签名从从未显式引用的术语变量名中解放出来。

- **Providing Type-class instances**. [Given instances][contextual-givens] 允许程序员定义某个类型的 _规范值_ 。这使得使用类型类的编程更加简单，而不会泄露实现细节。

- **Retroactively extending classes**. 在 Scala 2 中，扩展方法必须使用隐式转换或隐式类进行编码。相比之下，在 Scala 3 中，[extension methods][contextual-extension]现在直接内置于语言中，从而产生更好的错误消息和改进的类型推断。

- **Viewing one type as another**. 隐式转换已经被重新[设计][contextual-conversions]为类型类转`Conversion`的实例。

- **Higher-order contextual abstractions**. [context functions][contextual-functions]的 _全新_ 功能使上下文抽象成为一流的公民。它们是库作者的一个重要工具，允许表达简洁的特定领域语言。

- **Actionable feedback from the compiler**. 如果一个隐式参数不能被编译器解决，它现在提供了可能解决这个问题的[import suggestions](https://www.scala-lang.org/blog/2020/05/05/scala-3-import-suggestions.html)。

### Say What You Mean: 类型系统改进
除了极大地改进了类型推断，Scala 3 类型系统还提供了许多新的功能，还为你提供了强大的工具来静态地表达类型中的不变量。

- **Enumerations**. [枚举][enums]已经被重新设计，以便与样例类很好地融合，并形成表达[代数数据类型][enums-adts]的新标准。

- **Opaque Types**.  将实现细节隐藏在[opaque type aliases][types-opaque]的别名后面，而不需要在性能上付出代价! Opaque types 取代了值类，并允许你建立一个抽象的屏障，而不会造成额外的装箱开销。

- **Intersection and union types**. 将类型系统建立在新的基础上，导致了新的类型系统功能的引入：[intersection types][types-intersection]的实例，如`A & B`，既是`A`的实例，也是`B`的实例；[union types][types-union]的实例，如`A | B`，是`A`或`B`的实例。这两种结构都允许程序员在继承层次结构之外灵活地表达类型约束。

- **Dependent function types**. Scala 2 已经允许返回类型依赖于（值）参数。在 Scala 3 中，现在可以对这种模式进行抽象，表达[dependent function types][types-dependent]。在类型`F = (e: Entry) => e.Key`中，结果类型取决于参数。

- **Polymorphic function types**. 与 dependent function types 一样，Scala 2 支持拥有类型参数的方法，但不允许程序员对这些方法进行抽象。在 Scala 3 中，像`[A] => List[A] => List[A]`这样的[polymorphic function types][types-polymorphic]可以抽象出除值参数外还接受 _类型参数_ 的函数。

- **Type lambdas**. 在 Scala 2 中需要用[编译器插件](https://github.com/typelevel/kind-projector)来表达的东西，现在在 Scala 3 中是第一类的功能：类型lambdas是类型级别的函数，可以作为（高等类型的）类型参数传递，而不需要辅助类型定义。

- **Match types**. Scala 3 提供了对[matching on types][types-match]的直接支持，而不是使用隐式解析对类型级别的计算进行编码。将类型级计算整合到类型检查器中，可以改进错误信息，并消除对复杂编码的需求。

### 重新设想的：面向对象的编程

Scala 一直处于函数式编程和面向对象编程的前沿 -- 而 Scala 3 在这两个方向上都推动了边界的发展! 上述类型系统的变化和上下文抽象的重新设计使得 _函数式编程_ 比以前更容易。同时，以下的新特性使结构良好的 _面向对象设计_ 成为可能，并支持最佳实践。

- **Pass it on**.  Trait 更接近于 class，现在也可以接受[参数][oo-trait-parameters]，使其作为模块化软件分解的工具更加强大。

- **Plan for extension**.  在面向对象的设计中，扩展那些不打算扩展的类是一个长期存在的问题。为了解决这个问题，[open classes][oo-open]要求库设计者 _明确地_ 将类标记为 open（开放的）。

- **Hide implementation details**.  实施行为的实用性traits有时不应该是推断类型的一部分。在 Scala 3 中，这些traits可以被标记为[transparent][oo-transparent]，（在推断类型中）向用户隐藏继承性。

- **Composition over inheritance**.  这句话经常被引用，但实现起来却很繁琐。Scala 3 的[export clauses][oo-export]则不然：与imports对应，export clauses 允许用户为对象的选定成员定义别名。

- **No more NPEs**.  Scala 3 比以往任何时候都更安全：[explicit null][oo-explicit-null]将`null`移出了类型层次结构，帮助你静态地捕捉错误；[safe initialization][oo-safe-init]的额外检查可以检测对未初始化对象的访问。

### Batteries Included: 元编程
Scala 2 中的宏只是一个实验性的功能，而 Scala 3 则为元编程提供了强大的工具库。[宏教程]({% link _overviews/scala3-macros/tutorial/index.md %})中包含了关于不同设施的详细信息。特别是，Scala 3 为元编程提供了以下功能：

作为基本的起点，[inline feature][meta-inline]允许在编译时减少数值和方法。这个简单的功能已经涵盖了许多使用情况，同时也为更高级的功能提供了入口。

- **Inline**. [inline feature][meta-inline]允许在编译时减少数值和方法。这个简单的功能已经涵盖了许多使用情况，同时也为更高级的功能提供了入口。
- **Compile-time operations**. 包[`scala.compiletime`][meta-compiletime]中包含了额外的功能，可以用来实现内联方法。
- **Quoted code blocks**. Scala 3为代码增加了[quasi-quotation][meta-quotes]的新功能，这为构建和分析代码提供了方便的高级接口。构建加一加一的代码就像`'{ 1 + 1 }`一样简单。
- **Reflection API**. 对于更高级的用例，[quotes.reflect][meta-reflection]提供了更详细的控制来检查和生成程序树。


如果你想进一步了解 Scala 3 中的元编程，我们邀请你参加我们的[教程][meta-tutorial]。

[enums]: {{ site.scala3ref }}/enums/enums.html
[enums-adts]: {{ site.scala3ref }}/enums/adts.html

[types-intersection]: {{ site.scala3ref }}/new-types/intersection-types.html
[types-union]: {{ site.scala3ref }}/new-types/union-types.html
[types-dependent]: {{ site.scala3ref }}/new-types/dependent-function-types.html
[types-lambdas]: {{ site.scala3ref }}/new-types/type-lambdas.html
[types-polymorphic]: {{ site.scala3ref }}/new-types/polymorphic-function-types.html
[types-match]: {{ site.scala3ref }}/new-types/match-types.html
[types-opaque]: {{ site.scala3ref }}/other-new-features/opaques.html

[type-inference]: {{ site.scala3ref }}/changed-features/type-inference.html
[overload-resolution]: {{ site.scala3ref }}/changed-features/overload-resolution.html
[reference]: {{ site.scala3ref }}/overview.html
[creator]: {{ site.scala3ref }}/other-new-features/creator-applications.html
[migration]: {% link _overviews/scala3-migration/compatibility-intro.md %}
[contribution]: {% link _overviews/scala3-contribution/contribution-intro.md %}

[implicits]: {{ site.scala3ref }}/contextual.html
[contextual-using]: {{ site.scala3ref }}/contextual/using-clauses.html
[contextual-givens]: {{ site.scala3ref }}/contextual/givens.html
[contextual-extension]: {{ site.scala3ref }}/contextual/extension-methods.html
[contextual-conversions]: {{ site.scala3ref }}/contextual/conversions.html
[contextual-functions]: {{ site.scala3ref }}/contextual/context-functions.html

[syntax-summary]: {{ site.scala3ref }}/syntax.html
[syntax-control]: {{ site.scala3ref }}/other-new-features/control-syntax.html
[syntax-indentation]: {{ site.scala3ref }}/other-new-features/indentation.html
[syntax-wildcard]: {{ site.scala3ref }}/changed-features/wildcards.html

[meta-tutorial]: {% link _overviews/scala3-macros/tutorial/index.md %}
[meta-inline]: {% link _overviews/scala3-macros/tutorial/inline.md %}
[meta-compiletime]: {% link _overviews/scala3-macros/tutorial/compiletime.md %}
[meta-quotes]: {% link _overviews/scala3-macros/tutorial/quotes.md %}
[meta-reflection]: {% link _overviews/scala3-macros/tutorial/reflection.md %}

[oo-explicit-null]: {{ site.scala3ref }}/other-new-features/explicit-nulls.html
[oo-safe-init]: {{ site.scala3ref }}/other-new-features/safe-initialization.html
[oo-trait-parameters]: {{ site.scala3ref }}/other-new-features/trait-parameters.html
[oo-open]: {{ site.scala3ref }}/other-new-features/open-classes.html
[oo-transparent]: {{ site.scala3ref }}/other-new-features/transparent-traits.html
[oo-export]: {{ site.scala3ref }}/other-new-features/export.html
