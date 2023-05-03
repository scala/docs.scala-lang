---
title: Context Parameters
type: section
description: This page demonstrates how to declare context parameters, and how the compiler infers them at call-site.
languages: [zh-cn]
num: 60
previous-page: ca-extension-methods
next-page: ca-context-bounds
redirect_from: /scala3/book/ca-given-using-clauses.html
---

Scala offers two important features for contextual abstraction:

- **Context Parameters** allow you to specify parameters that, at the call-site, can be omitted by the programmer and should be automatically provided by the context.
- **Given Instances** (in Scala 3) or **Implicit Definitions** (in Scala 2) are terms that can be used by the Scala compiler to fill in the missing arguments.

## Context Parameters

When designing a system, often context information like _configuration_ or settings need to be provided to the different components of your system.
One common way to achieve this is by passing the configuration as additional argument to your methods.

In the following example, we define a case class `Config` to model some website configuration and pass it around in the different methods.

{% tabs example %}
{% tab 'Scala 2 and 3' %}
```scala
case class Config(port: Int, baseUrl: String)

def renderWebsite(path: String, config: Config): String =
  "<html>" + renderWidget(List("cart"), config)  + "</html>"

def renderWidget(items: List[String], config: Config): String = ???

val config = Config(8080, "docs.scala-lang.org")
renderWebsite("/home", config)
```
{% endtab %}
{% endtabs %}

Let us assume that the configuration does not change throughout most of our code base.
Passing `config` to each and every method call (like `renderWidget`) becomes very tedious and makes our program more difficult to read, since we need to ignore the `config` argument.

### Marking parameters as contextual

We can mark some parameters of our methods as _contextual_.

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
def renderWebsite(path: String)(using config: Config): String =
    "<html>" + renderWidget(List("cart")) + "</html>"
    //                                  ^
    //                   no argument config required anymore

def renderWidget(items: List[String])(using config: Config): String = ???
```
{% endtab %}
{% endtabs %}

By starting a parameter section with the keyword `using` in Scala 3 or `implicit` in Scala 2, we tell the compiler that at the call-site it should automatically find an argument with the correct type.
The Scala compiler thus performs **term inference**.

In our call to `renderWidget(List("cart"))` the Scala compiler will see that there is a term of type `Config` in scope (the `config`) and automatically provide it to `renderWidget`.
So the program is equivalent to the one above.

In fact, since we do not need to refer to `config` in our implementation of `renderWebsite` anymore, we can even omit its name in the signature in Scala 3:

{% tabs 'anonymous' %}
{% tab 'Scala 3 Only' %}
```scala
//        no need to come up with a parameter name
//                             vvvvvvvvvvvvv
def renderWebsite(path: String)(using Config): String =
    "<html>" + renderWidget(List("cart")) + "</html>"
```
{% endtab %}
{% endtabs %}

In Scala 2, the name of implicit parameters is still mandatory.

### Explicitly providing contextual arguments

We have seen how to _abstract_ over contextual parameters and that the Scala compiler can provide arguments automatically for us.
But how can we specify which configuration to use for our call to `renderWebsite`?

{% tabs 'explicit' class=tabs-scala-version %}
{% tab 'Scala 2' %}
We explicitly supply the argument value as if it was a regular argument:
```scala
renderWebsite("/home")(config)
```
{% endtab %}
{% tab 'Scala 3' %}
Like we specified our parameter section with `using`, we can also explicitly provide contextual arguments with `using`:
```scala
renderWebsite("/home")(using config)
```
{% endtab %}
{% endtabs %}

Explicitly providing contextual parameters can be useful if we have multiple different values in scope that would make sense, and we want to make sure that the correct one is passed to the function.

For all other cases, as we will see in the next section, there is also another way to bring contextual values into scope.

## Given Instances (Implicit Definitions in Scala 2)

We have seen that we can explicitly pass arguments as contextual parameters.
However, if there is _a single canonical value_ for a particular type, there is another preferred way to make it available to the Scala compiler: by marking it as `given` in Scala 3 or `implicit` in Scala 2.

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

In the above example we specify that whenever a contextual parameter of type `Config` is omitted in the current scope, the compiler should infer `config` as an argument.

Having defined a canonical value for the type `Config`, we can call `renderWebsite` as follows:

```scala
renderWebsite("/home")
//                   ^
//   again no argument
```

A detailed guide to where Scala looks for canonical values can be found in [the FAQ]({% link _overviews/FAQ/index.md %}#where-does-scala-look-for-implicits).

[reference]: {{ site.scala3ref }}/overview.html
[blog-post]: /2020/11/06/explicit-term-inference-in-scala-3.html
