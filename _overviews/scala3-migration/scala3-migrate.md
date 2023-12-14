---
title: Porting an sbt Project (using sbt-scala3-migrate)
type: section
description: This section shows how to use scala3-migrate to migrate a project
num: 10
previous-page: tutorial-prerequisites
next-page: tutorial-sbt
---

`sbt-scala3-migrate` is an sbt plugin to assist you during the migration of your sbt project to Scala 3.
It consists of four sbt commands:
- `migrateDependencies` helps you update the list of `libraryDependencies`
- `migrateScalacOptions` helps you update the list of `scalacOptions`
- `migrateSyntax` fixes a number of syntax incompatibilities between Scala 2.13 and Scala 3 
- `migrateTypes` tries to compile your code to Scala 3 by infering types and resolving implicits where needed.

Each one of these commands is described in details below.

> #### Requirements
> - Scala 2.13, preferred 2.13.11
> - sbt 1.5 or higher
> - **Disclaimer:** This tool cannot migrate libraries containing macros.
>
> #### Recommendation
> Before the migration, add `-Xsource:3` to your scalac options to enable some Scala 3 syntax and behavior.

In this tutorial, we will migrate the project in [scalacenter/scala3-migration-example](https://github.com/scalacenter/scala3-migration-example).
To learn about the migration, and train yourself, you can clone this repository and follow the tutorial steps.

## 1. Installation

Add `sbt-scala3-migrate` in the `project/plugins.sbt` file of your sbt project.

``` scala
// project/plugins.sbt
addSbtPlugin("ch.epfl.scala" % "sbt-scala3-migrate" % "0.6.1")
```

<div><p>The latest published version is  <a href="https://index.scala-lang.org/scalacenter/scala3-migrate/sbt-scala3-migrate">
<img src="https://index.scala-lang.org/scalacenter/scala3-migrate/sbt-scala3-migrate/latest-by-scala-version.svg" alt="scala3-migrate Scala version support" style="margin-bottom: 0px; max-width: 30%;">
</a></p>
</div>

## 2. Choose a module

If your project contains more than one module, the first step is to choose which module to migrate first.

Thanks to the interoperability between Scala 2.13 and Scala 3 you can start with any module.
However it is probably simpler to start with the module that has the fewest dependencies.

> `sbt-scala3-migrate` operates on one module at a time.
> Make sure the module you choose is not an aggregate.

## 3. Migrate the dependencies

> All the commands in this tutorial must be run in the sbt shell.

**Usage:** `migrateDependencies <project>`

For the purpose of this tutorial we will consider the following build configuration:

```scala
//build.sbt
lazy val main = project
  .in(file("."))
  .settings(
    scalaVersion := "2.13.11",
    libraryDependencies ++= Seq(
      "org.typelevel" %% "cats-core" % "2.4.0",
      "io.github.java-diff-utils" % "java-diff-utils" % "4.12",
      "org.scalameta" %% "parsers" % "4.8.9",
      "org.scalameta" %% "munit" % "0.7.23" % Test,
      "com.softwaremill.scalamacrodebug" %% "macros" % "0.4.1" % Test
    ),
    addCompilerPlugin(("org.typelevel" %% "kind-projector" % "0.13.2").cross(CrossVersion.full)),
    addCompilerPlugin("com.olegpy" %% "better-monadic-for" % "0.3.1")
  )
```

Running `migrateDependencies main` outputs:

<pre>
<code  class="hljs hljs-skip">
sbt:main> migrateDependencies main
[info] 
[info] Starting migration of libraries and compiler plugins of project main
[info] 
[info] <span style="color:green">Valid dependencies:</span>
[info] "io.github.java-diff-utils" % "java-diff-utils" % "4.12"

[warn] 
[warn] <span style="color:orange">Versions to update:</span>
[warn] "org.typelevel" %% "cats-core" % "<span style="color:orange">2.6.1</span>" <span style="color:orange">(Other versions: 2.7.0, ..., 2.10.0)</span>
[warn] "org.scalameta" %% "munit" % "<span style="color:orange">0.7.25</span>" % Test <span style="color:orange">(Other versions: 0.7.26, ..., 1.0.0-M8)</span>
[warn] 
[warn] <span style="color:orange">For Scala 3 use 2.13:</span>
[warn] ("org.scalameta" %% "parsers" % "4.8.9")<span style="color:orange">.cross(CrossVersion.for3Use2_13)</span>
[warn] 
[warn] <span style="color:orange">Integrated compiler plugins:</span>
[warn] addCompilerPlugin(("org.typelevel" %% "kind-projector" % "0.13.2").cross(CrossVersion.full))
[warn] replaced by <span style="color:orange">scalacOptions += "-Ykind-projector"</span>
[error] 
[error] <span style="color:red">Incompatible Libraries:</span>
[error] "com.softwaremill.scalamacrodebug" %% "macros" % "0.4.1" % Test <span style="color:red">(Macro Library)</span>
[error] addCompilerPlugin("com.olegpy" %% "better-monadic-for" % "0.3.1") <span style="color:red">(Compiler Plugin)</span>
[info] 
[success] Total time: 0 s, completed Aug 28, 2023 9:18:04 AM
</code>
</pre>

Let's take a closer look at each part of this output message.

### Valid dependencies

Valid dependencies are compatible with Scala 3, either because they are standard Java libraries or because they have been cross-published to Scala 3.

<pre>
<code  class="hljs hljs-skip">
[info] <span style="color:green">Valid dependencies:</span>
[info] "io.github.java-diff-utils" % "java-diff-utils" % "4.12"
</code>
</pre>

You can keep them as they are.

### Versions to update

These libraries have been cross-published to Scala 3 in later versions.
You need to update their versions.

<pre>
<code class="hljs hljs-skip">
[warn] <span style="color:orange">Versions to update:</span>
[warn] "org.typelevel" %% "cats-core" % "<span style="color:orange">2.6.1</span>" <span style="color:orange">(Other versions: 2.7.0, ..., 2.10.0)</span>
[warn] "org.scalameta" %% "munit" % "<span style="color:orange">0.7.25</span>" % Test <span style="color:orange">(Other versions: 0.7.26, ..., 1.0.0-M8)</span>
</code>
</pre>

In the given example we need to bump the version of cats-core to 2.6.1 and the version of munit to 0.7.25.

> The `Other versions` part of the output message indicates which other versions are available in Scala 3.
If you wish you can bump to one of the most recent version, but take care of choosing a source compatible version.
According to [the semantic versionning scheme](https://semver.org/), a patch or minor version bump is safe but not a major version bump.


### For Scala 3 use 2.13

These libraries are not yet cross-published to Scala 3 but they are cross-compatible.
You can use their 2.13 versions to compile to Scala 3.

Add `.cross(CrossVersion.for3Use2_13)` on the libraries to tell sbt to use the `_2.13` suffix, instead of `_3`.

<pre>
<code  class="hljs hljs-skip">
[warn] <span style="color:orange">For Scala 3 use 2.13:</span>
[warn] ("org.scalameta" %% "parsers" % "4.8.9")<span style="color:orange">.cross(CrossVersion.for3Use2_13)</span>
</code>
</pre>

> #### Disclaimer about `CrossVersion.for3Use2_13`:
- It can cause a conflict on the `_2.13` and `_3` suffixes of a transitive dependency.
In such situation, sbt will fail to resolve the dependency, with a clear error message.
- It is generally not safe to publish a Scala 3 library which depends on a Scala 2.13 library.
Otherwise users of the library can have conflicting `_2.13` and `_3` suffixes on the same dependency.

### Integrated compiler plugins

Some compiler plugins were integrated into the Scala 3 compiler itself.
In Scala 3 you don't need to resolve them as dependencies but you can activate them with compiler flags.

<pre>
<code  class="hljs hljs-skip">
[warn] <span style="color:orange">Integrated compiler plugins:</span>
[warn] addCompilerPlugin(("org.typelevel" %% "kind-projector" % "0.13.2").cross(CrossVersion.full))
[warn] replaced by <span style="color:orange">scalacOptions += "-Ykind-projector"</span>
</code>
</pre>

Here for instance you can activate kind-projector by adding `-Ykind-projector` to the list of `scalacOptions`.

During the migration process, it is important to maintain the compatibility with Scala 2.13.
The later `migrateSyntax` and `migrateTypes` commands will use the Scala 2.13 compilation to rewrite some parts of the code automatically.

You can configure kind-projector in a cross-compatible way like this:
```scala
// add kind-projector as a dependency on Scala 2
libraryDependencies ++= {
  if (scalaVersion.value.startsWith("3.")) Seq.empty
  else Seq(
    compilerPlugin(("org.typelevel" %% "kind-projector" % "0.13.2").cross(CrossVersion.full))
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

<pre>
<code  class="hljs hljs-skip">
[error] <span style="color:red">Incompatible Libraries:</span>
[error] "com.softwaremill.scalamacrodebug" %% "macros" % "0.4.1" % Test <span style="color:red">(Macro Library)</span>
[error] addCompilerPlugin("com.olegpy" %% "better-monadic-for" % "0.3.1") <span style="color:red">(Compiler Plugin)</span>
</code>
</pre>

To solve these incompatibilities, you can either:
- Check with the maintainers if they plan to port them to Scala 3, and possibly help them to do so.
- Remove these dependencies from your build and adapt the code accordingly.

### The updated build

After you updated the build, it should look like this:

```scala
//build.sbt
lazy val main = project
  .in(file("."))
  .settings(
    scalaVersion := "2.13.11",
    libraryDependencies ++= Seq(
      "org.typelevel" %% "cats-core" % "2.6.1",
      "io.github.java-diff-utils" % "java-diff-utils" % "4.12",
      ("org.scalameta" %% "parsers" % "4.8.9").cross(CrossVersion.for3Use2_13),
      "org.scalameta" %% "munit" % "0.7.25" % Test
    ),
    libraryDependencies ++= {
      if (scalaVersion.value.startsWith("3.")) Seq.empty
      else Seq(
        compilerPlugin(("org.typelevel" %% "kind-projector" % "0.13.2").cross(CrossVersion.full))
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
You can check out the [the Compiler Options Table](options-lookup.html) to get a full comparison of all the compilers options.

The `migrateScalacOptions` will help you update the list of `scalacOptions` in your build.

For the purpose of this tutorial we will consider the following build configuration:

```scala
lazy val main = project
  .in(file("."))
  .settings(
    scalaVersion := "2.13.11",
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
[info] Starting migration of scalacOptions in main
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
[success] Total time: 0 s, completed Aug 29, 2023 2:00:57 PM
</code>
</pre>

Some scalac options are still valid, some must be renamed and some must be removed.

> Some options can appear in the output of `migrateScalacOptions` but not in your `build.sbt`.
> They are added by sbt or by some sbt plugins.
> Make sure to use up-to-date versions of sbt and sbt plugins.
> They should be able to adapt the added compiler options to the Scala version automatically.

Once again, it is important to maintain the compatibility with Scala 2.13 because the `migrateSyntax` and `migrateTypes` commands will use the Scala 2.13 compilation to apply some patches automatically.

Here is how we can update the list of scalacOptions:
```scala
lazy val main = project
  .in(file("."))
  .settings(
    scalaVersion := "2.13.11",
    scalacOptions ++= {
      if (scalaVersion.value.startsWith("3.")) scala3Options
      else scala2Options
    }
  )

lazy val sharedScalacOptions =
  Seq("-encoding", "UTF-8", "-Wunused:imports,privates,locals")

lazy val scala2Options = sharedScalacOptions ++
  Seq("-target:jvm-1.8", "-Xsource:3", "-explaintypes")

lazy val scala3Options = sharedScalacOptions ++
  Seq("-Xunchecked-java-output-version:8", "-explain")
```

Reload sbt, check that the project compiles (to Scala 2.13), check that the tests run successfully, and commit your changes.
You are now ready to migrate the syntax.

## 5. Migrate the syntax

**Usage:** `migrateSyntax <project>`

This command runs a number of Scalafix rules to patch some discarded syntax.

The list of applied Scalafix rules are: 
- [ProcedureSyntax](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)
- [fix.scala213.ExplicitNullaryEtaExpansion](https://github.com/lightbend-labs/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)
- [migrate.ParensAroundLambda](https://github.com/scalacenter/scala3-migrate/blob/ebb4a4087ed11899b9010f4c75eb365532694c0a/scalafix/rules/src/main/scala/migrate/ParensAroundParam.scala#L9)
- [fix.scala213.ExplicitNonNullaryApply](https://github.com/lightbend-labs/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)
- [fix.scala213.Any2StringAdd](https://github.com/lightbend-labs/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)
- [ExplicitResultTypes](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html)

For more information about the syntax changes between Scala 2.13 and Scala 3, you can refer to [the Incompatibility Table](incompatibility-table.html).

> Some incompatibilities listed in [the Incompatibility Table](incompatibility-table.html) are not fixed by migrateSyntax.
> Most of them are not frequent and can easily be fixed by hand. 
> If you want to contribute with a Scalafix rewrite rule, we will be more than happy to add it in the `migrateSyntax` command.

Running `migrateSyntax main` outputs:
<pre>
<code  class="hljs hljs-skip">
sbt:main> migrateSyntax main
[info] Starting migration of syntax in main
[info] Run syntactic rules in 7 Scala sources successfully
[info] Applied 3 patches in src/main/scala/example/SyntaxRewrites.scala
[info] Run syntactic rules in 8 Scala sources successfully
[info] Applied 1 patch in src/test/scala/example/SyntaxRewritesTests.scala
[info] Migration of syntax in main succeeded.
[success] Total time: 2 s, completed Aug 31, 2023 11:23:51 AM
</code>
</pre>

Take a look at the applied changes, check that the project still compiles, check that the tests run successfully and commit the changes.
The next and final step is to migrate the types.

## 6. Migrate the types

**Usage:** `migrateTypes <project>`

The Scala 3 compiler uses a slightly different type inference algorithm.
It can sometimes fail at infering the same types as the Scala 2 compiler, which can lead to compilation errors.
This final step will add the needed type ascriptions to make the code compile to Scala 3.

Running `migrateTypes main` outputs:
<pre>
<code  class="hljs hljs-skip">
sbt:main> migrateTypes main
[info] compiling 8 Scala sources to /home/piquerez/github/scalacenter/scala3-migration-example/target/scala-2.13/classes ...
[warn] 1 deprecation; re-run with -deprecation for details
[warn] one warning found
[info] compiling 8 Scala sources to /home/piquerez/github/scalacenter/scala3-migration-example/target/scala-2.13/test-classes ...
[warn] 2 deprecations; re-run with -deprecation for details
[warn] one warning found
[success] Total time: 7 s, completed Aug 31, 2023 11:26:25 AM
[info] Defining scalaVersion
[info] The new value will be used by Compile / bspBuildTarget, Compile / dependencyTreeCrossProjectId and 68 others.
[info]  Run `last` for details.
[info] Reapplying settings...
[info] set current project to main (in build file:/home/piquerez/github/scalacenter/scala3-migration-example/)
[info] 
[info] Migrating types in main / Compile
[info] 
[info] Found 3 patches in 1 Scala source
[info] Starting migration of src/main/scala/example/TypeIncompat.scala
[info] 3 remaining candidates
[info] 1 remaining candidate
[info] Found 1 required patch in src/main/scala/example/TypeIncompat.scala
[info] Compiling to Scala 3 with -source:3.0-migration -rewrite
[info] compiling 1 Scala source to /home/piquerez/github/scalacenter/scala3-migration-example/target/scala-3.3.1/classes ...
[info] 
[info] Migrating types in main / Test
[info] 
[info] Found 4 patches in 1 Scala source
[info] Starting migration of src/test/scala/example/TypeIncompatTests.scala.scala
[info] 4 remaining candidates
[info] 3 remaining candidates
[info] 2 remaining candidates
[info] Found 1 required patch in src/test/scala/example/TypeIncompatTests.scala.scala
[info] Compiling to Scala 3 with -source:3.0-migration -rewrite
[info] 
[info] You can safely upgrade main to Scala 3:
[info] <span style="color:orange">scalaVersion := "3.3.1"</span>
[success] Total time: 18 s, completed Aug 31, 2023 11:26:45 AM
[info] Defining scalaVersion
[info] The new value will be used by Compile / bspBuildTarget, Compile / dependencyTreeCrossProjectId and 68 others.
[info]  Run `last` for details.
[info] Reapplying settings...
[info] set current project to main (in build file:/home/piquerez/github/scalacenter/scala3-migration-example/)
sbt:main>
</code>
</pre>

`migrateTypes main` found 2 required patches: one in `src/test/scala/example/TypeIncompatTests.scala.scala` and the other in `src/main/scala/example/TypeIncompat.scala`.
It applied them, then it compiled to Scala 3 with `-source:3.0-migration -rewrite` to finalize the migration.

Congratulations! Your project can now compile to Scala 3.

## What to do next ?

If you project contains only one module, you can set `scalaVersion := 3.3.1`.

If you have more than one module, you can start again from [3. Migrate the dependencies](#3-migrate-the-dependencies) with another module.

Once you are done with all modules, you can remove `sbt-scala3-migrate` from `project/plugins.abt`, and all Scala 2.13 related settings.

## Feedback and contributions are welcome

Every feedback will help us improve `sbt-scala3-migrate`: typos, clearer log messages, better documentation, 
bug reports, ideas of features.
Don't hesitate to open a [GitHub issue](https://github.com/scalacenter/scala3-migrate).
