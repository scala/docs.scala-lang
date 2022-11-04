---
layout: multipage-overview
title: Проверка фрагмента
partof: scala3-scaladoc
language: ru
num: 8
previous-page: search-engine
next-page: settings
---

The main functionality of documentation is to help people understand and use the project properly. Sometimes a part of a project needs few words to show its usage, but every developer knows that there are moments where description is not enough and nothing is better than a good ol’ example. 

A convenient way of providing examples in documentation is to create code snippets presenting usage of given functionality. The problem with code snippets is that simultaneously with project development, they need to be updated. Sometimes changes in one part of a project may break examples in other parts. The number of snippets and the amount of time passed since they’ve been written makes it impossible to remember every place where you need to fix them. After some time you realize that your documentation is a complete mess and you need to go through all examples and rewrite them. 

Many Scala 2 projects use typechecked markdown documentation with [tut](https://tpolecat.github.io/tut/) or [mdoc](https://scalameta.org/mdoc/). Almost everyone at least heard about these tools. As they turned out to be very useful and the Scala community successfully adopted them, we’re planning to incorporate the features of tut and mdoc into the compiler so that it’s included out of the box with Scaladoc.

![]({{ site.baseurl }}/resources/images/scala3/scaladoc/snippet-compiler3.png)

## Getting started

By default, snippet validation is turned off for all snippets. It can be turned on by adding the following argument to Scaladoc:

`-snippet-compiler:compile`

For example, in sbt the configuration looks like this:

```scala
Compile / doc / scalacOptions ++= Seq("-snippet-compiler:compile")
```

This option turns on the snippet compiler for all `scala` snippets in the project documentation, and recognizes all snippets inside ```scala blocks. Currently, snippet validation works in both docstrings written in Markdown, and in static sites.
![]({{ site.baseurl }}/resources/images/scala3/scaladoc/snippet-compiler4.png)

If you are starting a new project, this configuration should be enough for you. However, in case you’re migrating an existing project, you might want to disable compilation for some snippets that can't currently be updated.

To do this, add a `nocompile` flag directly to the `scala` snippet:

````
```scala sc:nocompile
// under the hood `map` is transformed into
List(1).map( _  + 1)(<implicits>)
```
````

However, sometimes compilation failure is an intended behavior, e.g., to intentionally demonstrate an error. For this case, we expose a flag `fail` that introduces one of our features: [Assert compilation errors](#assert-compilation-errors).

````
```scala sc:fail
List(1,2,3).toMap
```
````

For a more thorough explanation and more sophisticated configurations, such as path-based flag settings, see the [Advanced configuration](#advanced-configuration) section.

## Features overview

### Assert compilation errors

Scala is a statically typed programming language. Sometimes, documentation should mention cases where code should not compile,or authors want to provide ways to recover from certain compilation errors.

For example, this code:

```scala
List(1,2,3).toMap
```

results in this output:

```nohighlight

At 18:21:
  List(1,2,3).toMap
Error: Cannot prove that Int <:< (K, V)

where:    K is a type variable with constraint 
          V is a type variable with constraint 
.
```

Examples that present code that fails at compile-time can be very important. For example, you can show how a library is secured against incorrect code. Another use case is to present common mistakes, and how to solve them. Taking these use cases into account, we decided to provide functionality to check if the marked code snippets don’t compile.

For snippets that intentionally fail to compile, such as the following one, add the `fail` flag to the code snippet:
````
```scala sc:fail
List(1,2,3).toMap
```
````
Snippet validation passes and shows expected compilation errors in documentation.
![]({{ site.baseurl }}/resources/images/scala3/scaladoc/assert-compilation-errors.gif)

For a snippet that compiles without error:
````
```scala sc:fail
List((1,2), (2,3)).toMap
```
````
the resulting output looks like this:
```nohighlight

In static site (./docs/docs/index.md):
Error: Snippet should not compile but compiled succesfully
```


### Context

Our goal is to make snippets behave as much as possible as if they were defined within a given scope (e.g., in a certain package, or inside a class). We believe this brings a natural feel to snippets. To achieve this, we implemented a wrapping mechanism that provides a context for each snippet. This preprocessing is done automatically for all snippets in docstrings.

For example, let’s assume that we want to document the method `slice` in a `collection.List`. We want to explain how it works by comparing it to a combination of `drop` and `take` method so using snippet like:
```scala
slice(2, 5) == drop(2).take(3)
```
Showing this example is one of the first things that comes to mind, but as you probably guessed, this won’t compile without a **context** feature.

Besides our main goal, it reduces the boilerplate of a snippet, because you don’t need to import members of the same package and instantiate documented class.

For people that are curious on how our context mechanism works, the snippet after preprocessing looks like this:
```scala
package scala.collection
trait Snippet[A] { self: List[A] =>
  slice(2,5) == drop(2).take(3)
}
```

### Hiding code

Despite having the context feature described above, sometimes an author needs to provide more elements to a scope. However, on one hand, a big block of imports and initializations of necessary classes can result in loss of readablity. But on the other hand, we’ve read a lot of opinions that people would like to be able to see the whole code. For this second case we’ve introduced special syntax for snippets that hides certain fragments of code---`import` statements, for example---but also allows that code to be expanded in the documentation with a single click.

Example:

```scala
//{
import scala.collection.immutable.List
//}
val intList: List[Int] = List(1, 2, 3)
```

![]({{ site.baseurl }}/resources/images/scala3/scaladoc/hiding-code.gif)

### Snippet includes

While writing code snippets, we often need a mechanism to reuse code from one snippet in another. For instance, take a look at the following piece of documentation:
![]({{ site.baseurl }}/resources/images/scala3/scaladoc/documentation-snippet.png)

To successfully compile the last snippet, we need to have previously declared definitions in scope. For this scenario---and probably many more---we added a new feature: snippet includes. This allows you to reuse code from one snippet in another, resulting in less redundancy and better maintainability.

To configure this, just add a `sc-name` argument to the snippet that you want to include in a later code block:
```` ```scala sc-name:<snippet-name> ````

where `snippet-name` should be unique in file scope, and cannot contain whitespaces and commas.

Then, in a later code block in your documentation, use a `sc-compile-with` argument in the `scala` snippet that should “include” the previous code block:
```` ```scala sc-compile-with:<snippet-name>(,<snippet-name>)+ ````

where `snippet-name` is the name of snippet that should be included.

After configuring this feature in our example, the code looks like this:
![]({{ site.baseurl }}/resources/images/scala3/scaladoc/documentation-snippet2.png)

and the output looks like this:
![]({{ site.baseurl }}/resources/images/scala3/scaladoc/snippet-includes.png)

You can specify more than one include. Note that the order in which they are specified defines the order of inclusion. 

**Warning**: you can only include snippets that are defined above the target snippet.

## Advanced configuration

Often turning on snippet validation for _all_ snippets is not the proper level of control, as the use cases can be more sophisticated. We prepared our tool for such situations, i.e., to allow users to adjust it to their needs.

### Available flags

To provide more control, the snippet compiler exposes three flags that let you change its behavior:
- `compile` - turns on snippet checking
- `nocompile` - turns off snippet checking
- `fail` - turns on snippet checking with compilation error assertion

### Path-based settings

For more flexibility, instead of setting one flag to control all snippets in a project, it can be set for a certain path only, by adding `<path>=` prefix before flag. For example:

`-snippet-compiler:docs=compile` - sets the `compile` flag for snippets in the `docs` file. If `docs` is a directory, the flag is set for all files inside `docs`

Additionally, the `-snippet-compiler` option can be controlled by more than one setting, with settings delimited by commas. For example:
```
-snippet-compiler:docs=compile,library/src=compile,library/src/scala/quoted=nocompile,library/src/scala/compiletime=fail
```
Flags are chosen by the longest prefix match, so we can define a general setting and then change that default behavior for more specific paths.
```
-snippet-compiler:compile,library/src/scala/quoted=nocompile,library/src/scala/compiletime=fail 
```
A flag without a path prefix---such as the `compile` flag in this example---is treated as the default.

### Override directly in the snippet

CLI arguments are a good mechanism for setting flags for certain files. However, this approach can’t be used to configure the snippet compiler for specific snippets. For example, an author wants to write one snippet that should fail, and other snippets that should compile. Again we took this under consideration, and added a feature to override settings directly inside snippets. These arguments are located in the snippet info part:

````
```scala <snippet-compiler-args>
// snippet
```
````

For instance, to configure snippet checking for a specific snippet, add the following argument to its snippet info part, where `flag` is one of the available flags listed above (e.g., `compile`, `nocompile`, or `fail`):

`sc:<flag>`

As a specific example, this code shows how to use the `fail` flag in an individual snippet:

````
```scala sc:fail
val itShouldFail: Int = List(1.1, 2, 3).head
```
````



