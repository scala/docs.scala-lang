---
title: 创建可以返回函数的方法
type: section
description: This page demonstrates how to create and use higher-order functions in Scala.
language: zh-cn
num: 33
previous-page: fun-write-map-function
next-page: fun-summary

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


由于 Scala 的一致性，编写一个返回函数的方法与您在前几节中看到的所有内容相似。
例如，假设您想编写一个返回函数的 `greet` 方法。
我们再次从问题陈述开始：

> 我想创建一个返回函数的 `greet` 方法。
> 该函数将接受一个字符串参数并使用 `println` 打印它。
> 为了简化第一个示例，`greet` 不会接受任何输入参数；它只会构建一个函数并返回它。

鉴于该声明，您可以开始构建 `greet`。
你知道这将是一种方法：

{% tabs fun-write-method-returns-function-1 %}
{% tab 'Scala 2 and 3' %}
```scala
def greet()
```
{% endtab %}
{% endtabs %}

您还知道此方法将返回一个函数，该函数 (a) 采用 `String` 参数，并且 (b) 使用 `println` 打印该字符串。
因此，该函数的类型为 `String => Unit`：

{% tabs fun-write-method-returns-function-2 %}
{% tab 'Scala 2 and 3' %}
```scala
def greet(): String => Unit = ???
           ----------------
```
{% endtab %}
{% endtabs %}

现在你只需要一个方法体。
您知道该方法需要返回一个函数，并且该函数接受一个“字符串”并打印它。
此匿名函数与该描述匹配：

{% tabs fun-write-method-returns-function-3 %}
{% tab 'Scala 2 and 3' %}
```scala
(name: String) => println(s"Hello, $name")
```
{% endtab %}
{% endtabs %}

现在您只需从方法中返回该函数：

{% tabs fun-write-method-returns-function-4 %}
{% tab 'Scala 2 and 3' %}
```scala
// a method that returns a function
def greet(): String => Unit = 
  (name: String) => println(s"Hello, $name")
```
{% endtab %}
{% endtabs %}

因为这个方法返回一个函数，所以你可以通过调用`greet()`来得到这个函数。
这是在 REPL 中做的一个很好的步骤，因为它验证了新函数的类型：

{% tabs fun-write-method-returns-function-5 %}
{% tab 'Scala 2 and 3' %}
````
scala> val greetFunction = greet()
val greetFunction: String => Unit = Lambda....
    -----------------------------------------
````
{% endtab %}
{% endtabs %}

现在你可以调用`greetFunction`了：

{% tabs fun-write-method-returns-function-6 %}
{% tab 'Scala 2 and 3' %}
```scala
greetFunction("Joe")   // prints "Hello, Joe"
```
{% endtab %}
{% endtabs %}

恭喜，您刚刚创建了一个返回函数的方法，然后执行了该函数。

## 改进方法

如果您可以传递问候语，我们的方法会更有用，所以让我们这样做。
您所要做的就是将问候语作为参数传递给 `greet` 方法，并在 `println` 中的字符串中使用它：

{% tabs fun-write-method-returns-function-7 %}
{% tab 'Scala 2 and 3' %}
```scala
def greet(theGreeting: String): String => Unit =
  (name: String) => println(s"$theGreeting, $name")
```
{% endtab %}
{% endtabs %}

现在，当您调用您的方法时，该过程更加灵活，因为您可以更改问候语。
当您从此方法创建函数时，它是这样的：

{% tabs fun-write-method-returns-function-8 %}
{% tab 'Scala 2 and 3' %}
````
scala> val sayHello = greet("Hello")
val sayHello: String => Unit = Lambda.....
    ----------------------
````
{% endtab %}
{% endtabs %}

REPL 类型签名输出显示 `sayHello` 是一个接受 `String` 输入参数并返回 `Unit`（无）的函数。
所以现在当你给 `sayHello` 一个 `String` 时，它会打印问候语：

{% tabs fun-write-method-returns-function-9 %}
{% tab 'Scala 2 and 3' %}
```scala
sayHello("Joe")   // prints "Hello, Joe"
```
{% endtab %}
{% endtabs %}

您还可以根据需要更改问候语以创建新函数：

{% tabs fun-write-method-returns-function-10 %}
{% tab 'Scala 2 and 3' %}
```scala
val sayCiao = greet("Ciao")
val sayHola = greet("Hola")

sayCiao("Isabella")   // prints "Ciao, Isabella"
sayHola("Carlos")     // prints "Hola, Carlos"
```
{% endtab %}
{% endtabs %}

## 一个更真实的例子

当您的方法返回许多可能的函数之一时，这种技术会更加有用，例如返回自定义构建函数的工厂。

例如，假设您想编写一个方法，该方法返回用不同语言问候人们的函数。
我们将其限制为使用英语或法语问候的函数，具体取决于传递给方法的参数。

您知道的第一件事是，您想要创建一个方法，该方法 (a) 将“所需语言”作为输入，并且 (b) 返回一个函数作为其结果。
此外，由于该函数会打印给定的字符串，因此您知道它的类型为 `String => Unit`。
使用该信息编写方法签名：

{% tabs fun-write-method-returns-function-11 %}
{% tab 'Scala 2 and 3' %}
```scala
def createGreetingFunction(desiredLanguage: String): String => Unit = ???
```
{% endtab %}
{% endtabs %}

接下来，因为您知道可能返回的函数接受一个字符串并打印它，所以您可以为英语和法语编写两个匿名函数：

{% tabs fun-write-method-returns-function-12 %}
{% tab 'Scala 2 and 3' %}
```scala
(name: String) => println(s"你好，$name")
(name: String) => println(s"Bonjour, $name")
```
{% endtab %}
{% endtabs %}

在方法内部，如果你给这些匿名函数起一些名字，它可能会更易读，所以让我们将它们分配给两个变量：

{% tabs fun-write-method-returns-function-13 %}
{% tab 'Scala 2 and 3' %}
```scala
val englishGreeting = (name: String) => println(s"Hello, $name")
val frenchGreeting = (name: String) => println(s"Bonjour, $name")
```
{% endtab %}
{% endtabs %}

现在您需要做的就是 (a) 如果 `desiredLanguage` 是英语，则返回 `englishGreeting`，并且 (b) 如果 `desiredLanguage` 是法语，则返回 `frenchGreeting`。
一种方法是使用 `match` 表达式：

{% tabs fun-write-method-returns-function-14 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def createGreetingFunction(desiredLanguage: String): String => Unit = {
  val englishGreeting = (name: String) => println(s"Hello, $name")
  val frenchGreeting = (name: String) => println(s"Bonjour, $name")
  desiredLanguage match {
    case "english" => englishGreeting
    case "french" => frenchGreeting
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
def createGreetingFunction(desiredLanguage: String): String => Unit =
  val englishGreeting = (name: String) => println(s"Hello, $name")
  val frenchGreeting = (name: String) => println(s"Bonjour, $name")
  desiredLanguage match
    case "english" => englishGreeting
    case "french" => frenchGreeting
```
{% endtab %}
{% endtabs %}

这是最后的方法。
请注意，从方法返回函数值与返回字符串或整数没有什么不同呃值。

这就是 `createGreetingFunction` 构建法语问候函数的方式：

{% tabs fun-write-method-returns-function-15 %}
{% tab 'Scala 2 and 3' %}
```scala
val greetInFrench = createGreetingFunction("french")
greetInFrench("Jonathan")   // prints "Bonjour, Jonathan"
```
{% endtab %}
{% endtabs %}

这就是它构建英语问候功能的方式：

{% tabs fun-write-method-returns-function-16 %}
{% tab 'Scala 2 and 3' %}
```scala
val greetInEnglish = createGreetingFunction("english")
greetInEnglish("Joe")   // prints "Hello, Joe"
```
{% endtab %}
{% endtabs %}

如果你对这段代码感到满意——恭喜——你现在知道如何编写返回函数的方法了。

