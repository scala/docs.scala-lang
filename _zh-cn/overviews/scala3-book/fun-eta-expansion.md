---
title: Eta 扩展
type: section
description: This page discusses Eta Expansion, the Scala technology that automatically and transparently converts methods into functions.
language: zh-cn
num: 31
previous-page: fun-function-variables
next-page: fun-hofs

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


当你查看 Scala 集合类的 `map` 方法的 Scaladoc 时，你会看到它被定义为接受一个_函数_：

{% tabs fun_1 %}
{% tab 'Scala 2 and 3' for=fun_1 %}
```scala
def map[B](f: (A) => B): List[B]
           ------------
```
{% endtab %}
{% endtabs %}

事实上，Scaladoc 明确指出，“`f` 是应用于每个元素的_函数_。”
但尽管如此，你可以通过某种方式将_方法_传递给 `map`，它仍然有效：

{% tabs fun_2 %}
{% tab 'Scala 2 and 3' for=fun_2 %}
```scala
def times10(i: Int) = i * 10   // a method
List(1, 2, 3).map(times10)     // List(10,20,30)
```
{% endtab %}
{% endtabs %}

你有没有想过这是如何工作的——如何将_方法_传递给需要_函数_的`map`？

这背后的技术被称为_Eta Expansion_。
它将 _方法类型_的表达式转换为 _函数类型_的等效表达式，并且它无缝而安静地完成了。

## 方法和函数的区别

{% comment %}
NOTE: I got the following “method” definition from this page (https://nightly.scala-lang.org/docs/reference/changed-features/eta-expansion-spec.html), but I’m not sure it’s 100% accurate now that 方法 can exist outside of classes/traits/objects.
I’ve made a few changes to that description that I hope are more accurate and up to date.
{% endcomment %}

从历史上看，_方法_一直是类定义的一部分，尽管在 Scala 3 中您现在可以拥有类之外的方法，例如 [Toplevel definitions][toplevel] 和 [extension 方法][extension]。

与方法不同，_函数_本身就是完整的对象，使它们成为第一等的实体。

它们的语法也不同。
此示例说明如何定义执行相同任务的方法和函数，确定给定整数是否为偶数：

{% tabs fun_3 %}
{% tab 'Scala 2 and 3' for=fun_3 %}
```scala
def isEvenMethod(i: Int) = i % 2 == 0         // a method
val isEvenFunction = (i: Int) => i % 2 == 0   // a function
```
{% endtab %}
{% endtabs %}

该函数确实是一个对象，因此您可以像使用任何其他变量一样使用它，例如将其放入列表中：

{% tabs fun_4 %}
{% tab 'Scala 2 and 3' for=fun_4 %}
```scala
val functions = List(isEvenFunction)
```
{% endtab %}
{% endtabs %}


{% tabs fun_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=fun_5 %}
```scala
// this example shows the Scala 2 error message
val methods = List(isEvenMethod)
                   ^
error: missing argument list for method isEvenMethod
Unapplied methods are only converted to functions when a function type is expected.
You can make this conversion explicit by writing `isEvenMethod _` or `isEvenMethod(_)` instead of `isEvenMethod`.
```

相反，从技术上讲，方法不是对象，因此在 Scala 2 中，您不能将方法放入 `List` 中，至少不能直接放入，如下例所示：

{% endtab %}
{% tab 'Scala 3' for=fun_5 %}

```scala
val functions = List(isEvenFunction)   // works
val methods = List(isEvenMethod)       // works
```

Scala 3 的重要部分是改进了 Eta 扩展技术，所以现在当您尝试将方法当作变量用，它是可以工作的---您不必自己处理手动转换：

{% endtab %}
{% endtabs %}

就这本入门书而言，需要了解的重要事项是：

- Eta Expansion 是 Scala 技术，让您可以像使用函数一样使用方法
- 该技术在 Scala 3 中得到了改进，几乎完全无缝

有关其工作原理的更多详细信息，请参阅参考文档中的 [Eta 扩展页面][eta_expansion]。

[eta_expansion]: {{ site.scala3ref }}/changed-features/eta-expansion.html
[extension]: {% link _zh-cn/overviews/scala3-book/ca-extension-methods.md %}
[toplevel]: {% link _zh-cn/overviews/scala3-book/taste-toplevel-definitions.md %}
