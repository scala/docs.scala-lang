---
title: Prerequisites
type: section
description: This section details the prerequisites of migration to Scala 3
num: 10
previous-page: tutorial-intro
next-page: scala3-migrate
---

The migration to Scala 3 is made easier thanks to the interoperability between Scala 2.13 and Scala 3, as described in the [Compatibility Reference](compatibility-intro.html) page.

However, there are a few prerequisites that a Scala 2.13 project must meet before being ported to Scala 3:
- It must not depend on a macro library that has not yet been ported to Scala 3.
- It must not use a compiler plugin that has no equivalent in Scala 3.
- It must not depend on `scala-reflect`.

The following paragraphs explain how to check those prerequisites and, in case they are unmet, what you can do about it.

If you are ready to proceed with the migration you can jump straight to the [sbt Migration Tutorial](tutorial-sbt.html).

## Macro dependencies

A macro library is a Scala library that exposes a macro method.

Those libraries tend to be more expressive and as such they are widely used in Scala 2.
We can mention as examples: 
- [lightbend/scala-logging](https://index.scala-lang.org/lightbend/scala-logging)
- [milessabin/shapeless](https://index.scala-lang.org/milessabin/shapeless)
- [playframework/play-json](https://index.scala-lang.org/playframework/play-json)
- [scalatest/scalatest](https://index.scala-lang.org/scalatest/scalatest)

But the Scala 3 compiler cannot expand Scala 2.13 macros.
So, before jumping to Scala 3, you should make sure that your project does not depend on a macro library that has not yet been ported.

You can find the migration status of many macro libraries in the [Scala Macro Libraries](https://scalacenter.github.io/scala-3-migration-guide/docs/macros/macro-libraries.html) page.
Hopefully many will already be ported by the time you read these lines.

For each of these macro dependencies in your project, you need to upgrade it to a cross-built version---a version available on both Scala 2.13 and Scala 3.

Let's take a quick example.

The dependency to `"scalatest" %% "scalatest" % "3.0.9"` must be upgraded because:
- The `scalatest` API is based on some macro definitions.
- The `3.0.9` version is not published for Scala 3.

We can upgrade it to version `3.2.19`, which is cross-published in Scala 2.13 and Scala 3.

```scala
libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.19"
```

## Compiler plugins

The Scala 2 compiler plugins are not compatible with Scala 3.

Compiler plugins are generally configured in the `build.sbt` file by one of these settings:

```scala
// build.sbt
libraryDependencies +=
  compilerPlugin("org.typelevel" %% "kind-projector" % "0.11.0" cross CrossVersion.full)

addCompilerPlugin("org.typelevel" %% "kind-projector" % "0.11.0" cross CrossVersion.full)
```

Some compiler plugins may also be automatically added by an sbt plugin.

You can find all configured compiler plugins by looking at the compiler options of your project.

{% highlight text %}
sbt:example> show example / Compile / scalacOptions
[info] * -Xplugin:target/compiler_plugins/wartremover_2.13.6-2.4.15.jar
[info] * -Xplugin:target/compiler_plugins/semanticdb-scalac_2.13.6-4.4.18.jar
[info] * -Yrangepos
[info] * -P:semanticdb:targetroot:/example/target/scala-2.13/meta
{% endhighlight %}

In the above example we can see that two compiler plugins are used: wartremover and semanticdb.
For each of these plugins, we need to check that there is an alternative solution, or we need to disable it.

Alternative solutions to the most used compiler plugins are given below.

### SemanticDB

The support of [SemanticDB](https://scalameta.org/docs/semanticdb/guide.html) is now shipped into the Scala 3 compiler:
- The `-Ysemanticdb` option activates the generation of semanticDB files.
- The `-semanticdb-target` option can be used to specify the output directory of semanticDB files.

sbt is able to configure SemanticDB automatically with this single setting: `semanticdbEnabled := true`.

### Scala.js

The [Scala.js](https://www.scala-js.org/) compilation on Scala 3 does not rely on a compiler plugin anymore.

To compile your Scala.js project you can use the `sbt-scalajs` plugin version `1.5.0` or higher.

```scala
// project/plugins.sbt
addSbtPlugin("org.scala-js" % "sbt-scalajs" % "1.5.0")
```

### Scala Native

Scala 3 is supported in [Scala Native](https://scala-native.org/) since v0.4.3.

The minimal version of Scala 3 supported by Scala Native is 3.1.0, due to fatal blockers in Scala 3.0.x

### Kind Projector

A subset of [the Kind Projector](https://github.com/typelevel/kind-projector) syntax is supported by Scala 3 under the `-Ykind-projector` option.

AdditionalLy, we now have the following features that make `kind-projector` not needed in many cases:
- [Type Lambdas](http://nightly.scala-lang.org/docs/reference/new-types/type-lambdas.html)
- [Polymorphic Functions](http://nightly.scala-lang.org/docs/reference/new-types/polymorphic-function-types.html)
- [Kind Polymorphism](http://nightly.scala-lang.org/docs/reference/other-new-features/kind-polymorphism.html)

You can learn more about the Kind Projector migration in its [dedicated page](plugin-kind-projector.html).

## Runtime reflection

`scala-reflect` will not be ported to Scala 3 because it exposes Scala 2 compiler internals that do not exist in Scala 3.

If your project depends on `scala-reflect`, or consumes instances of the `Manifest` class, it cannot be compiled by the Scala 3 compiler.
To remedy this situation, you can try to re-implement the corresponding parts of the code, using Java reflection or the [Scala 3 metaprogramming features](compatibility-metaprogramming.html).

If `scala-reflect` is transitively added in your classpath, you probably need to upgrade the dependency that brings it.
