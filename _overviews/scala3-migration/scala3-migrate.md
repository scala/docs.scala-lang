---
title: Using sbt-scala3-migrate
type: chapter
description: Using the sbt-scala3-migrate plugin to migrate an sbt module to Scala 3.3
num: 6
previous-page: migrating-to-3-9
next-page: macros
---

`sbt-scala3-migrate` is an sbt plugin by the Scala Center that migrates an sbt module from Scala 2.13 to Scala 3.3.

> #### An optional tool
> The plugin automates part of the step described in [Migrating to Scala 3.3](migrating-to-3-3.html); the migration works just as well without it.
> It only covers the step to Scala 3.3: the rewrites to later versions are described in [Migrating to Scala 3.9 and 3.10](migrating-to-3-9.html).
> It does not recognize all libraries that use Scala 2 macros or `scala-reflect` (see [For Scala 3 use 2.13](#for-scala-3-use-213)).

The plugin consists of four sbt commands:
- `migrateDependencies` helps you update the list of `libraryDependencies`
- `migrateScalacOptions` helps you update the list of `scalacOptions`
- `migrateSyntax` fixes a number of syntax incompatibilities between Scala 2.13 and Scala 3
- `migrateTypes` adds the types and implicit arguments that Scala 3 infers differently, and compiles the code with Scala 3

Each one of these commands is described in detail below.

> #### Requirements
> - Scala 2.13.15 or newer
> - sbt 1.9 or newer
> - **Disclaimer:** This tool cannot migrate libraries containing macros.
>
> #### Recommendation
> Before the migration, make the changes described in [Preparing on Scala 2.13](preparing.html).
> If `-Xsource:3` still reports migration errors, demote them to warnings with `-Wconf:cat=scala3-migration:w`: `migrateSyntax` and `migrateTypes` need the code to compile with Scala 2.13.

This page migrates the project in [scalacenter/scala3-migration-example](https://github.com/scalacenter/scala3-migration-example).
You can clone this repository and follow the steps.

## 1. Installation

Add `sbt-scala3-migrate` in the `project/plugins.sbt` file of your sbt project.

``` scala
// project/plugins.sbt
addSbtPlugin("ch.epfl.scala" % "sbt-scala3-migrate" % "0.7.5")
```

<div><p>The latest published version is  <a href="https://index.scala-lang.org/scalacenter/scala3-migrate/sbt-scala3-migrate">
<img src="https://index.scala-lang.org/scalacenter/scala3-migrate/sbt-scala3-migrate/latest-by-scala-version.svg" alt="scala3-migrate Scala version support" style="margin-bottom: 0px; max-width: 30%;">
</a></p>
</div>

## 2. Choose a module

If your project contains more than one module, the first step is to choose which module to migrate first (see [Migration Routes](planning.html#migration-routes)).

> `sbt-scala3-migrate` operates on one module at a time.
> Make sure the module you choose is not an aggregate.

## 3. Migrate the dependencies

> All the commands on this page must be run in the sbt shell.

**Usage:** `migrateDependencies <project>`

Consider the following build:

```scala
//build.sbt
lazy val main = project
  .in(file("."))
  .settings(
    scalaVersion := "2.13.18",
    libraryDependencies ++= Seq(
      "org.typelevel" %% "cats-core" % "2.4.0",
      "io.github.java-diff-utils" % "java-diff-utils" % "4.12",
      "org.scalameta" %% "parsers" % "4.8.9",
      "org.scalameta" %% "munit" % "0.7.23" % Test,
      "com.softwaremill.scalamacrodebug" %% "macros" % "0.4.1" % Test
    ),
    addCompilerPlugin(("org.typelevel" %% "kind-projector" % "0.13.4").cross(CrossVersion.full)),
    addCompilerPlugin("com.olegpy" %% "better-monadic-for" % "0.3.1")
  )
```

Running `migrateDependencies main` outputs:

<pre>
<code  class="hljs hljs-skip">
sbt:main> migrateDependencies main
[info]
[info] Starting migration of libraries and compiler plugins in project 'main'
[info]
[info] <span style="color:green">Valid dependencies:</span>
[info] "io.github.java-diff-utils" % "java-diff-utils" % "4.12"
[warn]
[warn] <span style="color:orange">Versions to update:</span>
[warn] "org.typelevel" %% "cats-core" % "<span style="color:orange">2.6.1</span>" <span style="color:orange">(Other versions: 2.7.0, ..., 2.13.0)</span>
[warn] "org.scalameta" %% "parsers" % "<span style="color:orange">4.12.1</span>" <span style="color:orange">(Other versions: 4.12.2, ..., 4.17.4)</span>
[warn] "org.scalameta" %% "munit" % "<span style="color:orange">0.7.25</span>" % Test <span style="color:orange">(Other versions: 0.7.26, ..., 1.3.6)</span>
[warn]
[warn] <span style="color:orange">Integrated compiler plugins:</span>
[warn] addCompilerPlugin(("org.typelevel" %% "kind-projector" % "0.13.4").cross(CrossVersion.full))
[warn] replaced by <span style="color:orange">scalacOptions += "-Ykind-projector"</span>
[error]
[error] <span style="color:red">Incompatible Libraries:</span>
[error] "com.softwaremill.scalamacrodebug" %% "macros" % "0.4.1" % Test <span style="color:red">(Macro Library)</span>
[error] addCompilerPlugin("com.olegpy" %% "better-monadic-for" % "0.3.1") <span style="color:red">(Compiler Plugin)</span>
[info]
[success] Total time: 0 s, completed 11 Oct 2026, 12:37:26
</code>
</pre>

Let's take a closer look at each part of this output message.

### Valid dependencies

Valid dependencies are compatible with Scala 3, either because they are standard Java libraries or because they have been cross-published to Scala 3.
You can keep them as they are.

### Versions to update

These libraries have been cross-published to Scala 3 in later versions.
You need to update their versions.

In the given example we need to bump the version of cats-core to 2.6.1, parsers to 4.12.1, and munit to 0.7.25.

> The `Other versions` part of the output message indicates which other versions are available in Scala 3.
> If you wish you can bump to one of the most recent versions, but take care of choosing a source compatible version.
> According to [the semantic versioning scheme](https://semver.org/), a patch or minor version bump is safe but not a major version bump.

### For Scala 3 use 2.13

Libraries that are not published for Scala 3 are listed in this section, with `.cross(CrossVersion.for3Use2_13)`: Scala 3 can use their Scala 2.13 version.
See [Interoperability](interoperability.html) for the limitations.

`migrateDependencies` does not recognize all Scala 2 macro libraries, nor `scala-reflect`, which do not work with Scala 3.
For example, it lists shapeless 2 in this section, and `scala-reflect` as a valid dependency.

### Integrated compiler plugins

Some compiler plugins were integrated into the Scala 3 compiler itself.
In Scala 3 you don't need to resolve them as dependencies but you can activate them with compiler flags.

Here for instance you can activate kind-projector by adding `-Ykind-projector` to the list of `scalacOptions` (the option is called `-Xkind-projector` since Scala 3.5).

During the migration process, it is important to maintain the compatibility with Scala 2.13.
The later `migrateSyntax` and `migrateTypes` commands will use the Scala 2.13 compilation to rewrite some parts of the code automatically.

You can configure kind-projector in a cross-compatible way like this:
```scala
// add kind-projector as a dependency on Scala 2
libraryDependencies ++= {
  if (scalaVersion.value.startsWith("3.")) Seq.empty
  else Seq(
    compilerPlugin(("org.typelevel" %% "kind-projector" % "0.13.4").cross(CrossVersion.full))
  )
},
// activate kind-projector in Scala 3
scalacOptions ++= {
  if (scalaVersion.value.startsWith("3.")) Seq("-Ykind-projector")
  else Seq.empty
}
```

### Incompatible libraries

Some macro libraries or compiler plugins are not compatible with Scala 3.

To solve these incompatibilities, you can either:
- Check with the maintainers if they plan to port them to Scala 3, and possibly help them to do so.
- Remove these dependencies from your build and adapt the code accordingly.

In the example, the code that uses better-monadic-for and the macro library needs to be changed by hand.

### The updated build

After you updated the build, it should look like this:

```scala
//build.sbt
lazy val main = project
  .in(file("."))
  .settings(
    scalaVersion := "2.13.18",
    libraryDependencies ++= Seq(
      "org.typelevel" %% "cats-core" % "2.6.1",
      "io.github.java-diff-utils" % "java-diff-utils" % "4.12",
      "org.scalameta" %% "parsers" % "4.12.1",
      "org.scalameta" %% "munit" % "0.7.25" % Test
    ),
    libraryDependencies ++= {
      if (scalaVersion.value.startsWith("3.")) Seq.empty
      else Seq(
        compilerPlugin(("org.typelevel" %% "kind-projector" % "0.13.4").cross(CrossVersion.full))
      )
    },
    scalacOptions ++= {
      if (scalaVersion.value.startsWith("3.")) Seq("-Ykind-projector")
      else Seq.empty
    }
  )
```

Reload sbt, check that the project compiles (to Scala 2.13), check that the tests run successfully, and commit your changes.
You are now ready to migrate the compiler options.

## 4. Migrate the compiler options

**Usage:** `migrateScalacOptions <project>`

The Scala 3 compiler does not contain the exact same set of options as the Scala 2 compiler.
See the [Compiler Options Lookup Table](compiler-options.html) for all compiler options.

`migrateScalacOptions` helps you update the list of `scalacOptions` in your build.

Consider the following build:

```scala
lazy val main = project
  .in(file("."))
  .settings(
    scalaVersion := "2.13.18",
    scalacOptions ++= Seq(
      "-encoding",
      "UTF-8",
      "-target:jvm-1.8",
      "-Xsource:3",
      "-Wunused:imports,privates,locals",
      "-explaintypes"
    )
  )
```

Running `migrateScalacOptions main` outputs:

<pre>
<code  class="hljs hljs-skip">
sbt:main> migrateScalacOptions main
[info]
[info] Starting migration of scalacOptions in project 'main'
[info]
[info] <span style="color:green">Valid scalacOptions:</span>
[info] -encoding UTF-8
[info] -Wunused:imports,privates,locals
[warn]
[warn] <span style="color:orange">Renamed scalacOptions:</span>
[warn] -target:jvm-1.8 -> <span style="color:orange">-Xunchecked-java-output-version:8</span>
[warn] -explaintypes   -> <span style="color:orange">-explain</span>
[warn]
[warn] <span style="color:orange">Removed scalacOptions:</span>
[warn] -Xsource:3
[warn] -Yrangepos
[info]
[info] For a full list of options check the Compiler Options Lookup Table at
[info] https://docs.scala-lang.org/scala3/guides/migration/options-lookup.html
[success] Total time: 2 s, completed 11 Oct 2026, 12:37:38
</code>
</pre>

Some scalac options are still valid, some must be renamed and some must be removed.

> Some options can appear in the output of `migrateScalacOptions` but not in your `build.sbt`.
> They are added by sbt or by some sbt plugins.
> Make sure to use up-to-date versions of sbt and sbt plugins.
> They should be able to adapt the added compiler options to the Scala version automatically.

Here is how we can update the list of scalacOptions:
```scala
lazy val main = project
  .in(file("."))
  .settings(
    scalaVersion := "2.13.18",
    scalacOptions ++= {
      if (scalaVersion.value.startsWith("3.")) scala3Options
      else scala2Options
    }
  )

lazy val sharedScalacOptions =
  Seq("-encoding", "UTF-8", "-Wunused:imports,privates,locals")

lazy val scala2Options = sharedScalacOptions ++
  Seq("-target:jvm-1.8", "-Xsource:3", "-Wconf:cat=scala3-migration:w", "-explaintypes")

lazy val scala3Options = sharedScalacOptions ++
  Seq("-Xunchecked-java-output-version:8", "-explain")
```

Reload sbt, check that the project compiles (to Scala 2.13), check that the tests run successfully, and commit your changes.
You are now ready to migrate the syntax.

## 5. Migrate the syntax

**Usage:** `migrateSyntax <project>`

This command runs these Scalafix rules to fix dropped syntax:
- [ProcedureSyntax](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)
- [fix.scala213.ExplicitNullaryEtaExpansion](https://github.com/scala-garden/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)
- [migrate.ParensAroundParam](https://github.com/scalacenter/scala3-migrate/blob/main/scalafix/rules/src/main/scala/migrate/ParensAroundParam.scala)
- [fix.scala213.ExplicitNonNullaryApply](https://github.com/scala-garden/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNonNullaryApply.scala)
- [fix.scala213.Any2StringAdd](https://github.com/scala-garden/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)
- [ExplicitResultTypes](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html)

For more information about the syntax changes between Scala 2.13 and Scala 3, you can refer to [the Incompatibility Table](incompatibilities.html).

> Some incompatibilities listed in [the Incompatibility Table](incompatibilities.html) are not fixed by migrateSyntax.
> Most of them are not frequent and can easily be fixed by hand.
> If you want to contribute with a Scalafix rewrite rule, we will be more than happy to add it in the `migrateSyntax` command.

Running `migrateSyntax main` outputs:
<pre>
<code  class="hljs hljs-skip">
sbt:main> migrateSyntax main
[info] Starting migration of syntax in project 'main'
[info] compiling 8 Scala sources to /example/target/scala-2.13/classes ...
[warn] /example/src/main/scala/example/SyntaxRewrites.scala:4:19: parentheses are required around the parameter of a lambda
[warn] Use '-Wconf:msg=lambda-parens:s' to silence this warning. [quickfixable]
[warn]   val square = { x: Int => x * x }
[warn]                   ^
[warn] one warning found
[info] done compiling
[info] compiling 8 Scala sources to /example/target/scala-2.13/test-classes ...
[warn] 2 deprecations in total; re-run with -deprecation for details
[info] done compiling
[info] Run syntactic rules in 7 Scala sources successfully
[info] Applied 2 patches in src/main/scala/example/SyntaxRewrites.scala
[info] Run syntactic rules in 8 Scala sources successfully
[info] Applied 1 patch in src/test/scala/example/SyntaxRewritesTests.scala
[info] Migration of syntax in main succeeded.
[success] Total time: 9 s, completed 11 Oct 2026, 12:39:37
</code>
</pre>

Take a look at the applied changes, check that the project still compiles, check that the tests run successfully and commit the changes.
The next and final step is to migrate the types.

## 6. Migrate the types

**Usage:** `migrateTypes <project>`

The Scala 3 compiler uses a slightly different type inference algorithm.
It can sometimes fail at inferring the same types as the Scala 2 compiler, which can lead to compilation errors.
This final step will add the needed type ascriptions to make the code compile to Scala 3.

Running `migrateTypes main` outputs:
<pre>
<code  class="hljs hljs-skip">
sbt:main> migrateTypes main
[info] compiling 8 Scala sources to /example/target/scala-2.13/classes ...
[info] done compiling
[info] compiling 8 Scala sources to /example/target/scala-2.13/test-classes ...
[warn] 1 deprecation; re-run with -deprecation for details
[warn] one warning found
[info] done compiling
[success] Total time: 4 s, completed 11 Oct 2026, 12:40:44
[info] Defining scalaVersion
[info] The new value will be used by Compile / bspBuildTarget, Compile / dependencyTreeCrossProjectId and 62 others.
[info] 	Run `last` for details.
[info] Reapplying settings...
[info] set current project to main (in build file:/example/)
[info]
[info] Migrating types in main / Compile
[info]
[info] Found 3 patches in 1 Scala source
[info] Starting migration of src/main/scala/example/TypeIncompat.scala
[info] 3 remaining candidates
[info] 1 remaining candidate
[info] Found 1 required patch in src/main/scala/example/TypeIncompat.scala
[info] Compiling to Scala 3 with -source:3.0-migration -rewrite
[info] compiling 8 Scala sources to /example/target/scala-3.3.7/classes ...
[info] done compiling
[info]
[info] Migrating types in main / Test
[info]
[info] Found 8 patches in 2 Scala sources
[info] Starting migration of src/test/scala/example/TypeIncompatTests.scala.scala
[info] 4 remaining candidates
[info] 3 remaining candidates
[info] 2 remaining candidates
[info] Found 1 required patch in src/test/scala/example/TypeIncompatTests.scala.scala
[info] Starting migration of src/test/scala/example/ScalametaTests.scala
[info] 4 remaining candidates
[info] 2 remaining candidates
[info] 1 remaining candidate
[info] Found 1 required patch in src/test/scala/example/ScalametaTests.scala
[info] Compiling to Scala 3 with -source:3.0-migration -rewrite
[info]
[info] You can safely upgrade main to Scala 3:
[info] <span style="color:orange">scalaVersion := "3.3.7"</span>
[success] Total time: 14 s, completed 11 Oct 2026, 12:40:59
</code>
</pre>

`migrateTypes main` found 3 required patches, in `TypeIncompat.scala`, `TypeIncompatTests.scala.scala` and `ScalametaTests.scala`.
For example, it added a type argument where Scala 3 infers a different type than Scala 2.13:

{% highlight diff %}
-  def buzz[A, B](foo: Foo[A]): Option[Bar[B]] = fizz(foo).map(toBar)
+  def buzz[A, B](foo: Foo[A]): Option[Bar[B]] = fizz(foo).map(toBar[B])
{% endhighlight %}

It applied them, then it compiled to Scala 3 with `-source:3.0-migration -rewrite` to finalize the migration.

`migrateTypes` fails if the Scala 3 compilation has errors that added types do not fix, for example uses of Scala 2 macros or of `scala-reflect`.
The error messages do not always mention macros. Fix these errors by hand first.

Congratulations! Your project can now compile to Scala 3.

## What to do next?

`migrateTypes` ends with the `-source:3.0-migration` rewrite.
To continue, add Scala 3.3.8, the latest 3.3 version, to the build as in [step 1 of Migrating to Scala 3.3](migrating-to-3-3.html#1-add-scala-3-to-the-build), and run the `-source:3.3-migration` rewrite of [step 4](migrating-to-3-3.html#4-apply-the-rewrites).

If you have more than one module, you can start again from [3. Migrate the dependencies](#3-migrate-the-dependencies) with another module.
Once you are done with all modules, you can remove `sbt-scala3-migrate` from `project/plugins.sbt`.

Before continuing to Scala 3.9: Scala 3.8 and later require JDK 17, so remove `-Xunchecked-java-output-version:8` or set it to 17, and rename `-Ykind-projector` to `-Xkind-projector`.

## Feedback and contributions are welcome

Every feedback will help us improve `sbt-scala3-migrate`: typos, clearer log messages, better documentation,
bug reports, ideas of features.
Don't hesitate to open a [GitHub issue](https://github.com/scalacenter/scala3-migrate).
