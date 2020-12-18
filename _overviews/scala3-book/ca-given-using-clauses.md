---
title: Given Instances and Using Clauses
type: section
description: This page demonstrates how to use 'given' instances and 'using' clauses in Scala 3.
num: 59
previous-page: ca-contextual-abstractions-intro
next-page: types-type-classes
---

Scala 3 offers two important feature for contextual abstraction:

- **Using Clauses** allow you to specify parameters that, at the call site, can be omitted by the programmer and should be automatically provided by the context.
- **Given Instances** let you define terms that can be used by the Scala compiler to fill in the missing arguments.

## Using Clauses
When designing a system, often context information like _configuration_ or settings need to be provided to the different components of your system.
One common way to achieve this is by passing the configuration as additional argument to your methods.

In the following example, we define a case class `Config` to model some website configuration and pass it around in the different methods.
```scala
case class Config(port: Int, baseUrl: String)

def renderWebsite(path: String, c: Config): String =
    "<html>" + renderWidget(List("cart"), c)  + "</html>"

def renderWidget(items: List[String], c: Config): String = ???

val config = Config(8080, "docs.scala-lang.org")
renderWebsite("/home")(config)
```
Let us assume that the configuration does not change throughout most of our code base.
Passing `c` to each and every method call (like `renderWidget`) becomes very tedious and makes our program more difficult to read, since we need to ignore the `c` argument.

#### Using `using` to mark parameters as contextual
In Scala 3, we can mark some of the parameters of our methods as _contextual_.
```scala
def renderWebsite(path: String)(using c: Config): String =
    "<html>" + renderWidget(List("cart"))    + "</html>"
    //                                   ^^^
    //                   no argument c required anymore

def renderWidget(items: List[String])(using c: Config): String = ???
```
By starting a parameter section with the keyword `using`, we tell the Scala compiler that at the callsite it should automatically find an argument with the correct type.
The Scala compiler thus performs **term inference**.

In our call to `renderWidget(List("cart"))` the Scala compiler will see that there is a term of type `Config` in scope (the `c`) and automatically provide it to `renderWidget`.
So the program is equivalent to the one above.

In fact, since we do not need to refer to `c` in our implementation of `renderWebsite` anymore, we can even omit it in the signature:

```scala
//        no need to come up with a parameter name
//                             vvvvvvvvvvvvv
def renderWebsite(path: String)(using Config): String =
    "<html>" + renderWidget(List("cart")) + "</html>"
```

#### Explicitly providing contextual arguments
We have seen how to _abstract_ over contextual parameters and that the Scala compiler can provide arguments automatically for us.
But how can we specify which configuration to use for our call to `renderWebsite`?

Like we specified our parameter section with `using`, we can also explicitly provide contextual arguments with `using:`

```scala
renderWebsite("/home")(using config)
```
Explicitly providing contextual parameters can be useful if we have multiple different values in scope that would make sense and we want to make sure that the correct one is passed to the function.

For all other cases, as we will see in the next Section, there is also another way to bring contextual values into scope.

## Given Instances
We have seen that we can explicitly pass arguments as contextual parameters by marking the argument section of the _call_ with `using`.
However, if there is _a single canonical value_ for a particular type, there is another preferred way to make it available to the Scala compiler: by marking it as `given`.

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
In the above example we specify that whenever a contextual parameter of type `Config` is omitted in the current scope, the compiler should infer `config` as an argument.

Having defined a given for `Config`, we can simply call `renderWebsite`:

```scala
renderWebsite("/home")
//                    ^^^^^
//   again  no argument
```

[reference]: {{ site.scala3ref }}/overview.html
[blog-post]: /2020/11/06/explicit-term-inference-in-scala-3.html
