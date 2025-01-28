---
title: Contexts
type: section
description: 本页介绍了Scala 3编译器中的symbols。
num: 14
previous-page: arch-lifecycle
next-page: arch-phases
language: zh-cn
---

`dotc`几乎没有全局状态（除了name表，它将字符串散列成唯一的name）。相反，所有可能在编译器[run]中发生变化的重要信息都被收集在一个`Context`中（在[Contexts]中定义）。

编译器中的大多数方法都依赖于一个隐式的匿名`Context`参数。一个典型的定义如下：
```scala
import dotty.tools.dotc.Contexts.{Context, ctx}

def doFoo(using Context): Unit =
  val current = ctx.run // 使用ctx访问Context
```

## 内存泄露
> **小心：** 上下文可能会很重，所以要注意内存泄漏

良好的做法是确保隐式上下文不被捕获在闭包或其他长期存在的对象中，以避免在一个闭包可以在编译器运行几次后仍然存在的情况下出现空间泄漏（例如，为一个永远不需要的库类提供服务的lazy completer）。
在这种情况下，惯例是将`Context`作为一个显式参数，以跟踪其使用情况。

## 上下文属性

| 上下文属性             | 定义                                     |
|-------------------|----------------------------------------|
| `compilationUnit` | current compilation unit               |
| `phase`           | current phase                          |
| `run`             | current run                            |
| `period`          | current period                         |
| `settings`        | the config passed to the compiler      |
| `reporter`        | operations for logging errors/warnings |
| `definitions`     | the standard built in definitions      |
| `platform`        | operations for the underlying platform |
| `tree`            | current tree                           |
| `scope`           | current scope                          |
| `typer`           | current typer                          |
| `owner`           | current owner symbol                   |
| `outer`           | outer Context                          |
| `mode`            | type checking mode                     |
| `typerState`      |                                        |
| `searchHistory`   |                                        |
| `implicits`       |                                        |
| ...               | and so on                              |


[Contexts]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/core/Contexts.scala
[run]: {% link _overviews/scala3-contribution/arch-lifecycle.md %}#runs
