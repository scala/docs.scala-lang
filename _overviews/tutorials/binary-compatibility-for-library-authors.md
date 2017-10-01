---
layout: singlepage-overview
title: Binary Compatibility for library authors

discourse: true
permalink: /tutorials/:title.html
---

## Introduction

A diverse and comprehensive set of libraries is important to any productive software ecosystem. While it is easy to develop and distribute Scala libraries, good library authorship goes
beyond just writing code and publishing it.

In this guide, we will cover the important topic of **Binary Compatibility**:

* How binary incompatibility can cause production failures in your applications
* How to avoid breaking binary compatibility
* How to reason about and communicate the impact of their code changes

Before we start, let's understand how code is compiled and executed on the Java Virtual Machine (JVM).

## The JVM execution model

Scala is compiled to a platform-independent format called **JVM bytecode** and stored in `.class` files. These class files are collated in JAR files for distribution.

When some code depends on a library, its compiled bytecode references the library's bytecode. The library's bytecode is referenced by its class/method signatures and loaded lazily
by the the JVM classloader during runtime. If a class or method matching the signature is not found, an exception is thrown. 

As a result of this execution model:

* We need to provide the JARs of every library used in our dependency tree when starting an application, since the library's bytecode is only referenced -- not merged into its user's bytecode
* A missing class/method problem may only surface after the application has been running for a while, due to lazy loading.

Common exceptions from classloading failures includes 
`InvocationTargetException`, `ClassNotFoundException`, `MethodNotFoundException`, and `AbstractMethodError`.

Let's illustrate this with an example:

Consider an application `App` that depends on `A` which itself depends on library `C`. When starting the application we need to provide the class files
for all of `App`, `A` and `C` (something like `java -cp App.jar:A.jar:C.jar:. MainClass`). If we did not provide `C.jar` or if we provided a `C.jar` that does not contain some classes/methods
which `A` calls, we will get classloading exceptions when our code attempts to invoke the missing classes/methods.

These are what we call **Binary Incompatibility Errors**. An error caused by binary incompatibility happens when the compiled bytecode references a name that cannot be resolved during runtime

## What are Evictions, Source Compatibility and Binary Compatibility?

### Evictions
When a class is needed during execution, the JVM classloader loads the first matching class file from the classpath (any other matching class files are ignored).
Because of this, having multiple versions of the same library in the classpath is generally undesireable:

* Unnecessary application size increase
* Unexpected runtime behaviour if the order of class files changes

Therefore, when resolving JARs to use for compilation and packaging, most build tools will pick only one version of each library and **evict** the rest.

### Source Compatibility
Two library versions are **Source Compatible** if switching one for the other does not incur any compile errors.  
For example, If we can upgrade `v1.0.0` of a dependency to `v1.1.0` and recompile our code without any compilation errors, `v1.1.0` is source compatible with `v1.0.0`.

### Binary Compatibility
Two library versions are **Binary Compatible** if the compiled bytecode of these versions can be interchanged without causing binary compatibility errors.  
For example, if we can replace the class files of a library's `v1.0.0` with the class files of `v1.1.0` without any binary compatibility errors during runtime,
`v1.1.0` is binary compatible with `v1.0.0`.

**NOTE:** While breaking source compatibility normally results in binary compatibility breakages as well, they are actually orthogonal -- breaking one does not imply breaking the other.

### Forwards and Backwards Compatibility

There are two "directions" when we describe compatibility of a library release:

**Backwards Compatible** means that a newer library version can be used in an environment where an older version is expected. When talking about binary and source compatibility,
this is the common and implied direction.

**Forwards Compatible** means that an older library can be used in an environment where a newer version is expected.  
Forward compatibility is generally not upheld for userland libraries. It is only important in situations where an older version of a library is commonly 
used at runtime against code that is compiled with newer version. (e.g. Scala's standard library)

Let's look at an example where library `A v1.0.0` is compiled with library `C v1.1.0`.

![Forwards and Backwards Compatibility]({{ site.baseurl }}/resources/images/library-author-guide/fowards_backwards_compatibility.png){: style="width: 65%; margin: auto; display: block"}

`C v1.1.0 ` is **Forwards Binary Compatible** with `v1.0.0` if we can use `v1.0.0`'s JAR at runtime instead of `v1.1.0`'s JAR without any binary compatibility errors.

`C v1.2.0 ` is **Backwards Binary Compatible** with `v1.1.0` if we can use `v1.2.0`'s JAR at runtime instaed of `v1.1.0`'s JAR without any binary compatibility errors..

## Why binary compatibility matters

Binary Compatibility matters because failing to maintain it makes life hard for everyone.

* End users has to update all library versions in their whole transitive dependency tree such that they are binary compatible, otherwise binary compatibility errors will happen at runtime
* Library authors are forced to update the dependencies of their library so users can continue using them, greatly increases the effort required to maintain libraries

Constant binary compatibility breakages in libraries, especially ones that are used by other libraries, is detrimental to our ecosystem as they require a lot of effort
from users and library authors to resolve.

Let's look at an example where binary incompatibility can cause grief and frustration:

### An example of "Dependency Hell"

Our application `App` depends on library `A` and `B`. Both `A` and `B` depends on library `C`. Initially both `A` and `B` depends on `C v1.0.0`.

![Initial dependency graph]({{ site.baseurl }}/resources/images/library-author-guide/before_update.png){: style="width: 50%; margin: auto; display: block;"}

Some time later, we see `B v1.1.0` is available and upgrade its version in our build. Our code compiles and seems to work so we push it to production and go home for dinner.

Unfortunately at 2am, we got frantic calls from customers saying that our application is broken! Looking at the logs, you find lots of `NoSuchMethodError` is being thrown by some code in `A`! 

![Binary incompatibility after upgrading]({{ site.baseurl }}/resources/images/library-author-guide/after_update.png){: style="width: 50%; margin: auto; display: block;"}

Why did we get a `NoSuchMethodError`? Remember that `A v1.0.0` is compiled with `C v1.0.0` and thus calls methods available in `C v1.0.0`.  
While `B v1.1.0` and `App` has been recompiled with `C v2.0.0`, `A v1.0.0`'s bytecode hasn't changed - it still calls the method that is now missing in `C v2.0.0`!

This situation can only be resolved by ensuring that the chosen version of `C` is binary compatible with all other evicted versions of `C` in your dependency tree. In this case, we need a new version of `A` that depends
on `C v2.0.0` (or any other future `C` version that is binary compatible with `C v2.0.0`).

Now imagine if `App` is more complex with lots of dependencies themselves depending on `C` (either directly or transitively) - it becomes extremely difficult to upgrade any dependencies because it now
pulls in a version of `C` that is incompatible with the rest of `C` versions in our dependency tree!

In the example below, we cannot upgrade to `D v1.1.1` because it will transitively pull in `C v2.0.0`, causing breakages
due to binary incompatibility. This inability to upgrade any packages without breaking anything is commonly known as **Dependency Hell**.

![Dependency Hell]({{ site.baseurl }}/resources/images/library-author-guide/dependency_hell.png)

How can we, as library authors, spare our users of runtime errors and dependency hell?

* Use **Migration Manager** (MiMa) to catch unintended binary compatibility breakages before releasing a new library version
* **Avoid breaking binary compatibility** through careful design and evolution of your library interfaces
* Communicate binary compatibility breakages clearly through **versioning**

## MiMa - Checking binary compatibility against previous library versions 

The [Migration Manager for Scala](https://github.com/typesafehub/migration-manager) (MiMa) is a tool for diagnosing binary incompatibilities between different library versions.  
It works by comparing the class files of two provided JARs and report any binary incompatibilities found.

By incorporating [MiMa SBT plugin](https://github.com/typesafehub/migration-manager/wiki/Sbt-plugin) into your SBT build, you can easily check whether 
you have accidentally introduced binary incompatible changes. Detailed instruction on how to use the SBT plugin can be found in the link.

We strongly encourage every library author to incorporate MiMa into their library release workflow.

## Evolving code without breaking binary compatibility

Binary compatibility breakages can often be avoided through careful use of certain Scala features as well as some techniques you can apply when modifying code.

Some language features may break binary compatibility:

* Default parameter values for methods or classes
* Case classes
* Default methods on traits (doesn't cause breakages since 2.12)

Techniques you can use to avoid breaking binary compatibility:

* Annotate public methods's return type explicitly
* Mark methods as package private when you want to remove a method or modify its signature
* Don't use inlining (for libraries)

For brevity of this guide, detailed explanation and runnable code examples can be found in [Binary Compatibility Code Examples & Explanation](https://github.com/jatcwang/binary-compatibility-guide).

Again, we recommend using MiMa to double check that you have not broken binary compatibility after making changes.

## Versioning Scheme - Communicating compatibility breakages

Library authors use verioning schemes to communicate compatibility guarantees between library releases to their users. Versioning schemes like [Semantic Versioning](http://semver.org/)(SemVer) allow
users to easily reason about the impact of a updating a library, without needing to read the detailed release note.

In the following section we will outline a versioning scheme based on Semantic Versioning that we **strongly encourage** you to adopt for your libraries. The rules listed below are **in addition** to 
Semantic Versioning v2.0.0.

### Recommmended Versioning Scheme

* If backwards **binary compatibility** is broken, **major version number** must be increased
* If backwards **source compatibility** is broken, **minor version number** must be increased
* A change in **patch version number** signals **no binary nor source incompatibility**. According to SemVer, patch versions should contain only bug fixes that fixes incorrect behavior so major behavioral
change in method/classes should result in a minor version bump.
* When major version is `0`, a minor version bump **may contain both source and binary breakages**
* Some libraries may take a harder stance on maintaining source compatibility, bumping the major version number for ANY source incompatibility even if they are binary compatible

Some examples:

* `v1.0.0 -> v2.0.0` is <span style="color: red">binary incompatible</span>. Cares needs to be taken to make sure no evicted versions are still in the `v1.x.x` range to avoid runtime errors
* `v1.0.0 -> v1.1.0` is <span style="color: blue">binary compatible</span> and maybe source incompatible
* `v1.0.0 -> v1.0.1` is <span style="color: blue">binary compatible</span> and source compatible
* `v0.4.0 -> v0.5.0` is <span style="color: red">binary incompatible</span> and maybe source incompatible
* `v0.4.0 -> v0.4.1` is <span style="color: blue">binary compatible</span> and source compatible

Many libraries in the Scala ecosystem has adopted this versioning scheme. A few examples are [Akka](http://doc.akka.io/docs/akka/2.5/scala/common/binary-compatibility-rules.html),
[Cats](https://github.com/typelevel/cats#binary-compatibility-and-versioning) and [Scala.js](https://www.scala-js.org/).

If this version scheme is followed, reasoning about binary compatibility is now very simple:

* Ensure major versions of the all versions of a library in the dependency tree are the same
* Pick latest version and evict the rest (This is the default behavior of SBT).

### Explanation

Why do we use the major version number to signal binary incompatible releases?

From our [example](#why-binary-compatibility-matters) above, we have learned two important lessons:

* Binary incompatibility releases often leads to dependency hell, rendering your users unable to update any of their libraries without breaking their application
* If a new library version is binary compatible but source incompatible, the user can simply fix the compile errors in their application and everything will work

Therefore, **binary incompatible releases should be avoided if possible** and be more noticeable when they happen, warranting the use of the major version number. While source compatibility
is also important, if they are minor breakages that does not require effort to fix, then it is best to let the major number signal just binary compatibility.

## Conclusion

In this guide we covered the importance of binary compatibility and showed you a few tricks to avoid breaking binary compatibility. Finally, we laid out a versioning scheme to communicate 
binary compatibility breakages clearly to your users. 

If we follow these guidelines, we as a community can spend less time untangling dependency hell and more time building cool things!

