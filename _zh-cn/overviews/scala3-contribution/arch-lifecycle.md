---
title: 编译器概述
type: section
description: 本页面描述了Scala 3编译器的生命周期。
num: 13
previous-page: arch-intro
next-page: arch-context
language: zh-cn
---

在高层次上，`dotc` 是一个交互式编译器（见[what is a compiler?][whats-a-compiler]），可以经常调用，例如回答IDE的问题，提供REPL补全，或管理增量构建等等。
这些用例中的每一个都需要一个定制的工作流程，但它们共享一个共同的核心。

## 编译器的生命周期简介

#### Core

定制是通过扩展[Compiler]类来提供的，该类维护一个有序的[phases][Phases]列表，以及如何[run][Run]它们。
与编译器的每一次交互都会创建一个新的运行，这是编译器的phases在输入源列表上的一次完整迭代。
每次运行都可以创建新的定义或使旧的定义失效，`dotc`可以[track these changes over time][time]。

#### Runs
在运行过程中，输入源被转换为[compilation units][CompilationUnit]（即与每个输入源相关的编译器状态的抽象）；然后迭代：在进入下一阶段之前，对每个compilation unit应用一个phase。

#### Phases
一个phase是对一个compilation unit的抽象转换，它通常负责转换代表源文件的代码的树和类型。编译器的一些phase有：
- `parser`， 它将符合Scala[syntax]的文本转换为抽象语法树，即ASTs
- `typer`，检查树是否符合预期类型
- `erasure`， 它将一个更简化的程序重新类型化，使其具有与JVM相同的类型。
- `genBCode`， JVM后端，它将擦除的编译器树转换为Java字节码格式。

[You can read more about phases here][phase-categories].

#### Drivers

核心编译器还需要在使用前初始化很多状态，比如[settings][ScalaSettings]和[Context][contexts]。
为了方便，[Driver]类包含了配置编译器和以编程方式调用编译器的高级函数。对象[Main]继承自`Driver`，由`scalac`脚本调用。

## Code Structure

编译器的代码可以在包[dotty.tools]中找到，包含以下子包。
```scala
tools // 包含帮助程序和`scala`通用运行器
├── backend // 编译器后端 (当前是 JVM 和 JS)
├── dotc // 主要的编译器，有子包:
│   ├── ast // 抽象语法树
│   ├── classpath
│   ├── config // 编译器配置、设置、平台特定定义
│   ├── core // 核心数据结构和操作，有特定的子包用于：
│   │   ├── classfile // 将Java类文件读入核心数据结构
│   │   ├── tasty // 读写TASTY文件，与核心数据结构之间的转换
│   │   └── unpickleScala2 // 将Scala2符号信息读入核心数据结构中
│   ├── decompiler // 将TASTY当做代码漂亮的打印
│   ├── fromtasty // 用于从TASTY重新编译的驱动器
│   ├── interactive // 交互式编译器和代码补全
│   ├── parsing // 扫描和解析器
│   ├── plugins // 编辑插件定义
│   ├── printing // 漂亮地打印树、类型和其他数据
│   ├── profile // 对编译器进行分析的内部程序
│   ├── quoted // quoted反射的内部构件
│   ├── reporting // 报告错误信息、警告和其他信息
│   ├── rewrites // 用于将Scala 2的结构重写成Scala 3的结构的帮助工具
│   ├── sbt // 用于与Zinc编译器通信的帮助程序.
│   ├── semanticdb // 用于从树中导出semanticdb的帮助工具
│   ├── transform // 用于树转换的Miniphases和帮助工具
│   ├── typer // 类型检查
│   └── util // 通用的工具类和模块
├── io // 用于文件访问和classpath处理的帮助模块
├── repl // REPL驱动程序和与终端的交互
├── runner // `scala`通用运行脚本的帮助工具
└── scripting // scala运行器的-script参数
```

[whats-a-compiler]: {% link _overviews/scala3-contribution/contribution-intro.md %}#what-is-a-compiler
[Phases]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/core/Phases.scala
[CompilationUnit]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/CompilationUnit.scala
[time]: {% link _overviews/scala3-contribution/arch-time.md %}
[dotty.tools]: https://github.com/lampepfl/dotty/tree/master/compiler/src/dotty/tools
[ScalaSettings]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/config/ScalaSettings.scala
[phase-categories]: {% link _overviews/scala3-contribution/arch-phases.md %}#phase-categories
[syntax]: {{ site.scala3ref }}/syntax.html
[Main]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Main.scala
[Driver]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Driver.scala
[Compiler]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Compiler.scala
[Run]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Run.scala
[contexts]: {% link _overviews/scala3-contribution/arch-context.md %}
