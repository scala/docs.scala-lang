---
title: 什么是函数式编程？
type: section
description: This section provides an answer to the question, what is functional programming?
language: zh-cn
num: 42
previous-page: fp-intro
next-page: fp-immutable-values

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


[维基百科定义_函数式编程_](https://en.wikipedia.org/wiki/Functional_programming)如下：

<blockquote>
<p>函数式编程是一种编程范式，通过应用和组合函数来构建程序。
它是一种声明式编程范例，其中函数定义是表达式树，每个表达式都返回一个值，而不是改变程序状态的命令式语句序列。</p>
<p>&nbsp;</p>
<p>在函数式编程中，函数被视为一等公民，这意味着它们可以绑定到名称（包括本地标识符）、作为参数传递以及从其他函数返回，就像任何其他数据类型一样。
这允许以声明式和可组合的方式编写程序，其中小函数以模块化方式组合。</p>
</blockquote>

知道这样的情况对你很有帮助：有经验的函数式程序员非常倾向于将他们的代码视为数学，将纯函数组合在一起就像组合一系列代数方程一样。

当你编写函数式代码时，你会感觉自己像个数学家，一旦你理解了范式，你就会想编写总是返回_值_---而不是异常或空值---的纯函数，这样你就可以将它们组合（结合）在一起以创建解决方案。
编写类似数学的方程式（表达式）的感觉是驱使您_只_使用纯函数和不可变值的动力，因为这就是您在代数和其他形式的数学中使用的东西。

函数式编程是一个很大的主题，没有简单的方法可以将整个主题浓缩为一章，但希望以下部分能够概述主要主题，并展示 Scala 为编写函数式代码提供的一些工具。

