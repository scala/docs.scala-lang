---
title: Porting an sbt Project
type: section
description: This section shows how to port an sbt project
num: 10
previous-page: tutorial-prerequisites
next-page: tutorial-macro-cross-building
---

> This tutorial is written for sbt.
> Yet the approach is very similar for any other build tool, as long as it supports Scala 3.

Before jumping to Scala 3, make sure you are on the latest Scala 2.13.x and sbt 1.5.x versions.

Let's now walk through the required steps to port an entire project to Scala 3.

## 1. Check the project prerequisites

Make sure your project is ready to be ported:
- It must not depend on a macro library that has not yet been ported to Scala 3.
- It must not use a compiler plugin that has no equivalent in Scala 3.
- It must not depend on `scala-reflect`.

Those prerequisites are described in more details in the [preceding page](tutorial-prerequisites.html).

## 2. Choose a module

Thanks to the interoperability between Scala 2.13 and Scala 3 you can start with any module.
However it is probably simpler to start with the module that has the fewest dependencies.

If you use macro definitions or macros annotations internally you will have to port them first.

## 3. Set up cross-building

The two main challenges of the codebase migration are:
- Make the code compile
- Make sure that the run-time behavior is unchanged

We recommend the cross-building strategy, that is to compile the code with both Scala 3 and Scala 2.13.
The logic behind is to be able to run the tests with Scala 2.13 after each fix and thus make sure that the runtime behavior is unchanged.
This is crucial to avoid bugs that could happen when fixing the incompatibilities.

Configuring cross-building in sbt is as short as:

```scala
scalaVersion := "3.0.0"
crossScalaVersions ++= Seq("2.13.6", "3.0.0")
```

This configuration means:
- The default version is `3.0.0`.
- 2.13.6 can be loaded by running the `++2.13.6` command.
- 3.0.0 can be loaded by running the `++3.0.0` command.

Beware that the `reload` command will always load the default version---here it is 3.0.0.

## 4. Prepare the dependencies

At this stage, if you run `compile`, it is likely that sbt complains about some dependencies being not found.
That is because the declared version of the dependency is not published for Scala 3.

You either need to upgrade the dependency to a newer version or to tell sbt to use the Scala 2.13 version of the library.

> When you change a library dependency, make sure to apply the same change in all modules of your project.

Check if there is an available Scala 3 version of the library.
To do so, you can use the version matrix in [Scaladex](https://index.scala-lang.org/).
Go to the project page of your library, click the version matrix button, filter on Scala 3 and Scala 2.13.

#### 1. There is a Scala 3 version of the library

We strongly suggest to use one of the available versions.
Make sure the one you choose does not bring any breaking change.

#### 2. There is no Scala 3 version of the library

You can use the Scala 2.13 version of the library. The syntax is:

```scala
("com.lihaoyi" %% "os-lib" % "0.7.7").cross(CrossVersion.for3Use2_13)
```

Or for a Scala.js dependencies:

```scala
("com.lihaoyi" %%% "os-lib" % "0.7.7").cross(CrossVersion.for3Use2_13)
```

Once you have fixed all the unresolved dependencies, you can check that the tests are still passing in Scala 2.13:

{% highlight text %}
sbt:example> ++2.13.6
[info] Setting Scala version to 2.13.6 on 1 project.
...
sbt:example> example / test
...
[success]
{% endhighlight %}

## 5. Configure the Scala 3 Compiler

The Scala 3 compiler options are different from the Scala 2.13 ones: some have been renamed, others are not yet supported.
You can refer to the [Compiler Options Lookup](options-lookup.html) page to adapt the list of `scalacOptions` to Scala 3.

You should come up with a list of common options, a list of Scala 2.13-specific options and a list of Scala 3-specific options.

A typical configuration looks like this:
```scala
scalacOptions ++= {
  Seq(
    "-encoding",
    "UTF-8",
    "-feature",
    "-language:implicitConversions",
    // disabled during the migration
    // "-Xfatal-warnings"
  ) ++ 
    (CrossVersion.partialVersion(scalaVersion.value) match {
      case Some((3, _)) => Seq(
        "-unchecked",
        "-source:3.0-migration"
      )
      case _ => Seq(
        "-deprecation",
        "-Xfatal-warnings",
        "-Wunused:imports,privates,locals",
        "-Wvalue-discard"
      )
    })
}
```

Add the `-source:3.0-migration` option to turn on the [Scala 3 Migration Mode](tooling-migration-mode.html).   
Also you should disable `-Xfatal-warnings` to take full advantage of the migration mode and the automatic rewrites.

## 6. Solve the Incompatibilities

It is now time to try compiling in Scala 3:

{% highlight text %}
sbt:example> ++3.0.0
[info] Setting Scala version to 3.0.0 on 1 project.
...
sbt:example> example / compile
...
sbt:example> example / Test / compile
{% endhighlight %}

> `example / compile` compiles the `main` sources of the example project.
> It is strictly equivalent to `example / Compile / compile`.
>
> `example / Test / compile` compiles the `test` sources.

The compiler produces diagnostics of two different levels:
- *Migration Warning*: These warnings can be automatically patched by the compiler with the `-rewrite` option.
- *Error*: A piece of code cannot be compiled anymore.

You can ignore the migration warnings since the compiler will automatically fix them.
However the incompatibility errors must be taken care of manually.

Many known incompatibilities are listed in the [Incompatibility Table](incompatibility-table.html). 
That's where you can find a description and some proposed solutions of the errors.

When possible you should try to find a fix that best preserves the binary compatibility of your code.
This is particularly crucial if your project is a published library.

> The macro incompatibilities cannot be easily solved.
> A lot of code must be rewritten from the ground up.
> See [Metaprogramming](compatibility-metaprogramming.html).

After fixing an incompatibility, you can validate the solution by running the tests in Scala 2.13.

{% highlight text %}
sbt:example> ++2.13.6
[info] Setting Scala version to 2.13.6 on 1 project.
...
sbt:example> example / test
...
[success]
{% endhighlight %}

Consider committing your changes regularly.

Once you have fixed all the errors you should be able to compile successfully in Scala 3.
Only the migration warnings are remaining.
You can patch them automatically by compiling with the `-source:3.0-migration -rewrite` options.

{% highlight text %}
sbt:example> ++3.0.0
sbt:example> set example / scalacOptions += "-rewrite"
sbt:example> example / compile
...
[info] [patched file /example/src/main/scala/app/Main.scala]
[warn] two warnings found
[success]
{% endhighlight %}

You should now remove the `-source:3.0-migration` option, and you can also add the `-Xfatal-warnings` option again.
Do not forget to reload.

## 7. Validate the migration

On rare occasions, different implicit values could possibly be resolved and alter the runtime behavior of the program.
Good tests are the only guarantee to prevent such bugs from going unnoticed.

Make sure that the tests are passing in both Scala 2.13 and Scala 3.

{% highlight text %}
sbt:example> ++2.13.6
sbt:example> example / test
...
[success]
sbt:example> ++3.0.0
sbt:example> example / test
...
[success]
{% endhighlight %}

If you have a continuous integration pipeline, it is time to set it up for Scala 3.

## 8. Finalize the migration

Congratulations! You have successfully ported a module to Scala 3.
The same process can be repeated for each module, until the project is fully migrated to Scala 3.

You can keep or drop the Scala 2.13 cross-building configuration depending on whether you want to cross-publish your program or not.

Here ends our walk through the migration of an sbt project.
