---
title: 上下文参数
type: section
description: This page demonstrates how to declare context parameters, and how the compiler infers them at call-site.
language: zh-cn
num: 60
previous-page: ca-extension-methods
next-page: ca-context-bounds

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


Scala 提供了两个重要的上下文抽象特性：

- **上下文参数** 允许你指定参数，这些参数程序员可以在调用时省略，这些参数由上下文自动提供。
- **Given 实例** (在 Scala 3 中) 或者 **Implicit 定义** （在 Scala 2 中） 让您定义 Scala 编译器可以用来填充缺失参数的术语。

## 上下文参数

在设计系统时，通常需要向系统的不同组件提供上下文信息，如 _配置_ 或设置。
实现此目的的一种常见方法是将配置作为附加参数传递给您的方法。

在下面的示例中，我们定义了一个样例类 `Config` 来模拟一些网站配置并在不同的方法中传递它。

{% tabs nonusing %}
{% tab 'Scala 2 and 3' %}

```scala
case class Config(port: Int, baseUrl: String)

def renderWebsite(path: String, c: Config): String =
    "<html>" + renderWidget(List("cart"), c)  + "</html>"

def renderWidget(items: List[String], c: Config): String = ???

val config = Config(8080, "docs.scala-lang.org")
renderWebsite("/home", config)
```

{% endtab %}
{% endtabs %}

让我们假设配置在我们的大部分代码库中都没有改变。
将 `c` 传递给每个方法调用（如 `renderWidget`）变得非常乏味并且使我们的程序更难阅读，因为我们需要忽略 `c` 参数。

#### 标记参数标作为上下文

我们可以将方法的一些参数标记为 _上下文_。

{% tabs 'contextual-parameters' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def renderWebsite(path: String)(implicit config: Config): String =
    "<html>" + renderWidget(List("cart")) + "</html>"
    //                                  ^
    //                   no argument config required anymore

def renderWidget(items: List[String])(implicit config: Config): String = ???
```
{% endtab %}
{% tab 'Scala 3' %}

```scala
def renderWebsite(path: String)(using c: Config): String =
    "<html>" + renderWidget(List("cart"))    + "</html>"
    //                                   ^^^
    //                   no argument c required anymore

def renderWidget(items: List[String])(using c: Config): String = ???
```

{% endtab %}
{% endtabs %}

通过在 Scala 3  中使用关键字 `using`，或在 Scala 2 的参数前面添加`implicit`，我们告诉编译器它应该在调用处自动找到具有正确类型的参数。
因此，Scala 编译器执行**术语推断**。

在我们对 `renderWidget(List("cart"))` 的调用中，Scala 编译器将看到作用域（`c`）中有一个类型为 `Config` 的术语，并自动将其提供给 `renderWidget`。
所以程序等同于上面的程序。

事实上，由于我们不再需要在 `renderWebsite` 的实现中引用 `c`，我们甚至可以在签名中省略它的名字：

{% tabs 'anonymous' %}
{% tab 'Scala 3 Only' %}

```scala
//        no need to come up with a parameter name
//                             vvvvvvvvvvvvv
def renderWebsite(path: String)(using Config): String =
    "<html>" + renderWidget(List("cart")) + "</html>"
```

在 Scala 2 中, implicit 参数的名字仍然需要。

{% endtab %}
{% endtabs %}

#### 明确提供上下文参数

我们已经了解了如何 _抽象_ 上下文参数，并且 Scala 编译器可以自动为我们提供参数。
但是我们如何指定调用 `renderWebsite` 时使用的配置呢？

{% tabs 'explicit' class=tabs-scala-version %}
{% tab 'Scala 2' %}
我们可以像使用普通的参数那样提供参数值：
```scala
renderWebsite("/home")(config)
```
{% endtab %}
{% tab 'Scala 3' %}
就像我们使用 `using` 指定参数部分一样，我们也可以使用 `using` 显式提供上下文参数：

```scala
renderWebsite("/home")(using config)
```

{% endtab %}
{% endtabs %}

如果我们在范围内有多个有意义的不同值，并且我们希望确保将正确的值传递给函数，则显式提供上下文参数可能很有用。

对于所有其他情况，正如我们将在下一节中看到的，还有另一种方法可以将上下文值引入范围。

## Give 实例 (在 Scala 2 中是 Implicit 定义)

我们已经看到，我们可以显示传递参数来作为上下文参数。
但是，如果某个特定类型有一个 _单一的规范值_，则还有另一种首选方法可以使其对 Scala 编译器可用：在 Scala 3 中将其标记为 `given`，或者在 Scala 2 中用 `implicit`。

{% tabs 'instances' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
implicit val config: Config = Config(8080, "docs.scala-lang.org")
//           ^^^^^^
// this is the value the Scala compiler will infer
// as argument to contextual parameters of type Config
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
val config = Config(8080, "docs.scala-lang.org")
//  this is the type that we want to provide the
//  canonical value for
//    vvvvvv
given Config = config
//             ^^^^^^
// this is the value the Scala compiler will infer
// as argument to contextual parameters of type Config
```

{% endtab %}
{% endtabs %}

在上面的示例中，我们指定每当在当前范围内省略 `Config` 类型的上下文参数时，编译器应该将 `config` 推断为参数。

为 `Config` 定义了一个规范值，我们可以简单地调用 `renderWebsite`：

{% tabs given2 %}
{% tab 'Scala 3 Only' %}

```scala
renderWebsite("/home")
//                    ^^^^^
//   again  no argument
```

{% endtab %}
{% endtabs %}

Scala 在哪查找规范值的详细指南可以在 [the FAQ]({% link _overviews/FAQ/index.md %}#where-does-scala-look-for-implicits) 中找到。

[reference]: {{ site.scala3ref }}/overview.html
[blog-post]: /2020/11/06/explicit-term-inference-in-scala-3.html
