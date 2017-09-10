---
layout: singlepage-overview
title: Binary Compatibility for library authors

discourse: true
permalink: /tutorials/:title.html
---

## Introduction

A diverse and comprehensive set of libraries is important to any productive software ecosystem. While it is easy to develop and distribute Scala libraries, good library authorship goes far
beyond just writing code and publishing them.

In this guide, we will cover the important topic of **Binary Compatibility**:

* How binary incompatibility can cause production failures in your applications
* How library authors can avoid breaking binary compatibility, and/or convey breakages clearly to library users when they happen

Before we start, first we need to understand how code is compiled and executed on the Java Virtual Machine (JVM).

## The JVM execution model

Code compiled to run on the JVM is compiled to a platform-independent format called **JVM bytecode** and stored in **Class File** format (with `.class` extension) and these class files are stored
in JAR files. The bytecode is what we refer to as the **Binary** format.

When application or library code is compiled, their bytecode invokes named references of classes/methods from their dependencies instead of including the dependencies' actual bytecode
(unless inlining is explicitly requested). During runtime, the JVM classloader will search through the provided class files for classes/methods referenced by and invoke them.

Let's illustrate with an example:  

We got an application `App` that depends on `A` which itself depends on library `C`. When starting the application we need to provide the class files
for all of `App`, `A` and `C` (something like `java -cp App.jar:A.jar:C.jar:. MainClass`). If we did not provide `C.jar`, or if we provided a `C.jar` that does not contain certain classes/methods
which `A` expected to exist in library `C`, we will get an exception when our code attempt to invoke the missing classes/methods.

This is what we call **Binary Incompatibility Errors** - The bytecode interface used for compilation differs and is incompatible with the bytecode provided during runtime.

## What are Evictions, Source Compatibility and Binary Compatibility?

Since the classloader only loads the first match of a class, having multiple versions of the same library in the classpath is redundant. 
Therefore when deciding which JARs to use for compilation, SBT only selects one version from each library (by default the highest), 
and all other versions of the same library are **evicted**. When packaging applications, the same versions of libraries that was used for compiling the 
application is packaged and used during runtime.

Two library versions are said to be **Source Compatible** if switching one for the other does not incur any compile errors. For example, If we can switch from `v1.0.0` of a dependency to `v2.0.0` and
recompile our code without causing any compilation errors, `v2.0.0` is said to be source compatible with `v1.0.0`.

Two library versions are said to be **Binary Compatible** if the compiled bytecode of these versions are compatible. Using the example above, removing a class will render two version
binary incompatible too, as the compiled bytecode for v2.0.0 will no longer contain the removed class.

When talking about two versions being compatible, the direction matters too. If we can use `v2.0.0` in place of `v1.0.0`, `v2.0.0` is said to be **backwards compatible** with `v1.0.0`. Conversely,
if we say that any library release of `v1.x.x` will be forwards compatible, we can use `v1.0.0` anywhere where `v1.1.0` was originally used.
For the rest of the guide, when the 'compatible' is used we mean backwards compatible, as it is the more common case of compatibility guarantee.

An important note to make is that while breaking source compatibility normally results in breaking binary compatibility, they are actually orthorgonal 
(breaking one does not imply breaking the other). See below for more examples (TODO: make sure we have examples?)
TODO: more facts?

## Why binary compatibility matters

Let's look at an example where binary incompatibility between versions of a library can have catastrophic consequences:

Our application depends on library `A` and `B`. Both `A` and `B` depends on library `C`. Initially both `A` and `B` depends on `C v1.0.0`.

![Initial dependency graph]({{ site.baseurl }}/resources/images/library-author-guide/before_update.png){: style="width: 280px; margin: auto; display: block;"}

Some time later, we see `B v1.1.0` is now available and we upgraded the version in our `build.sbt`. Our code compiles and seems to work so we push it to production and goes home for dinner.

Unfortunately at 2am, we got frantic calls from customers saying that our App is broken! Looking at the logs, you find lots of `NoSuchMethodError` is being thrown by some code in `A`! 

![Binary incompatibility after upgrading]({{ site.baseurl }}/resources/images/library-author-guide/after_update.png){: style="width: 280px; margin: auto; display: block;"}

Why did we get a `NoSuchMethodError`? Remember that `A v1.0.0` is compiled with `C v1.0.0` and thus calls methods availble in `Cv1.0.0`. While `B` and
our App has been recompiled with available classes/methods in `C v2.0.0`, `A v1.0.0`'s bytecode hasn't changed - it still calls the same method that is now missing in `C v2.0.0`!

This situation can only be resolved by ensuring that the chosen version of `C` is binary compatible with all other evicted versions of `C`. In this case, we need a new version of `A` that depends
on `C v2.0.0` (or any other future `C` version that is binary compatible with `C v2.0.0`).

Now imagine if our App is more complex with lots of dependencies themselves depending on `C` (either directly or transitively) - it becomes extremely difficult to upgrade any dependencies because it now
pulls in a version of `C` that is incompatible with the rest of the versions of `C` in our dependency tree! In the example below, we cannot upgrade `D` because it will transitively pull in `C v2.0.0`, causing breakages
due to binary incompatibility. This inability to upgrade any packages without breaking anything is common known as **Dependency Hell**.

![Dependency Hell]({{ site.baseurl }}/resources/images/library-author-guide/dependency_hell.png)

How can we, as library authors, spare our users of runtime errors and dependency hell?

* Use **Migration Manager** (MiMa) to catch unintended binary compatibility breakages before releasing a new library version
* **Avoid breaking binary compatibility** through careful design and evolution of your library interfaces
* Communicate binary compatibility breakages clearly through **versioning**

## MiMa - Check Binary Compatibility with Previous Library Versions 

The [Migration Manager for Scala](https://github.com/typesafehub/migration-manager) (MiMa) is a tool for diagnosing binary incompatibilities between different library versions.

When run standalone in the command line, it will compare the .class files in the two provided JARs and report any binary incompatibilities found. Most library authors use the [SBT plugin](https://github.com/typesafehub/migration-manager/wiki/Sbt-plugin)
to help spot binary incompatibility between library releases. (Follow the link for instructions on how to use it in your project)

## Designing for Evolution - without breaking binary compatibility

TODO

## Versioning Scheme - Communicate binary compatiblity breakages

We recommend using the following schemes to communicate binary and source compatibility to your users:

* Any release with the same major version are **Binary Backwards Compatible** with each other
* A minor version bump signals new features and **may contain minor source incompatibilities** that can be easily fixed by the end user
* Patch version for bugfixes and minor behavioural changes
* For **expreimental library versions** (where the major version is `0`, such as `v0.1.0`), a minor version bump **may contain both source and binary breakages**
* Some libraries may take a harder stance on maintaining source compatibility, bumping the major version number for ANY source incompatibility even if they are binary compatible

Some examples:

* `v1.0.0 -> v2.0.0` is <span style="color: red">binary incompatible</span>. Cares needs to be taken to make sure no evicted versions are still in the `v1.x.x` range to avoid runtime errors
* `v1.0.0 -> v1.1.0` is <span style="color: blue">binary compatible</span> and maybe source incompatible
* `v1.0.0 -> v1.0.1` is <span style="color: blue">binary compatible</span> and source compatible
* `v0.4.0 -> v0.5.0` is <span style="color: red">binary incompatible</span> and maybe source incompatible
* `v0.4.0 -> v0.4.1` is <span style="color: blue">binary compatible</span> and source compatible

Many libraries in the Scala ecosystem has adopted this versioning scheme. A few examples are [Akka](http://doc.akka.io/docs/akka/2.5/scala/common/binary-compatibility-rules.html),
[Cats](https://github.com/typelevel/cats#binary-compatibility-and-versioning) and [Scala.js](https://www.scala-js.org/).

### Explanation

Why do we use the major version number to signal binary compatibility releases?

From our [example](#why-binary-compatibility-matters) above, we have learnt two important lessons:

* Binary incompatibility releases often leads to dependency hell, rendering your users unable to update any of their libraries without breaking their application
* If a new library version is binary compatible but source incompatible, the user can simply fix the compile errors in their application and everything will work

Therefore, **binary incompatible releases should be avoided if possible** and be more noticeable when they happen, warranting the use of the major version number. While source compatibility
is also important, if they are minor breakages that does not require effort to fix, then it is best to let the major number signal just binary compatibility.

## Conclusion

In this guide we covered the importance of binary compatibility and showed you a few tricks to avoid breaking binary compatibility. Finally, we laid out a versioning scheme to communicate 
binary compatibility breakages clearly to your users. 

If we follow these guidelines, we as a community can spend less time untangling dependency hell and more time making cool things!

