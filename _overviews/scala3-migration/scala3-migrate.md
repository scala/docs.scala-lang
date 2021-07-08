---
title: Scala3-migrate plugin (sbt)
type: chapter
description: This section shows how to use scala3-migrate to migrate a project
num: 7
previous-page: tooling-tour
next-page: tooling-migration-mode
---

## Context

Scala3-migrate tool is part of a series of initiatives to make the migration to Scala 3 as easy as possible.
The goal is to provide a tool that will help you migrate both your build and your code to Scala 3.
The solution consists of 4 independent steps that are packaged into an sbt plugin:

- **migrate-libs**: helps you update the list of `libraryDependencies`
- **migrate-scalacOptions**: helps you update the list of `scalacOptions`
- **migrate-syntax**: fixes a number of syntax incompatibilities in Scala 2.13 code
- **migrate**: tries to make your code compile with Scala 3 by adding the minimum required inferred types and implicit arguments.

Each one of these steps is an sbt command that is described in details below.

> #### Requirements
> - Scala 2.13, preferred 2.13.7
> - sbt 1.5 or higher
> - **Disclaimer:** This tool cannot migrate libraries containing macros.

## Installation

Currently, you can use scala3-migrate via an sbt plugin. You can add it as follows to your build.

``` scala
// project/plugins.sbt
addSbtPlugin("ch.epfl.scala" % "sbt-scala3-migrate" % "0.5.0")
```
<div><p>The latest published version is  <a href="https://index.scala-lang.org/scalacenter/scala3-migrate/scala3-migrate">
<img src="https://index.scala-lang.org/scalacenter/scala3-migrate/scala3-migrate/latest-by-scala-version.svg" alt="scala3-migrate Scala version support" style="margin-bottom: 0px; max-width: 30%;">
</a></p>
</div>

## Choose a module
If your project contains more than one module, the first step is to choose which module to migrate first.
Follow [this section to choose the first module.](tutorial-sbt.html#2-choose-a-module)

> Scala3-migrate operates on one module at a time.
> Make sure the module you choose is not an aggregate of modules.

## Migrate library dependencies
> All the commands will be run in an sbt shell

**Usage:** `migrate-libs projectId` where projectId is the name of the module to migrate.

For example, let's migrate the following sbt build.
```scala
//build.sbt
lazy val main = project
  .in(file("."))
  .settings(
    name := "main",
    scalaVersion := "2.13.7",
    semanticdbEnabled := true,
    scalacOptions ++= Seq("-explaintypes", "-Wunused"),
    libraryDependencies ++= Seq(
      "org.typelevel"                    %% "cats-core"           % "2.2.0",
      "ch.epfl.scala"                     % "scalafix-interfaces" % "0.9.26",
      "com.softwaremill.scalamacrodebug" %% "macros"              % "0.4.1" % Test,
      "ch.epfl.scala"                    %% "scalafix-rules"      % "0.9.26" % Test,
      compilerPlugin("org.typelevel" %% "kind-projector" % "0.11.0" cross CrossVersion.full),
      compilerPlugin("com.olegpy" %% "better-monadic-for" % "0.3.1")
    )
  )
```

First, let's run the command and see the result.
```
> migrate-libs main
[info] Starting to migrate libDependencies for main
[info]
[info] X             : Cannot be updated to Scala 3
[info] Valid         : Already a valid version for Scala 3
[info] To be updated : Need to be updated to the following version
[info]
[info] com.softwaremill.scalamacrodebug:macros:0.4.1:test           -> X : Contains Macros and is not yet published for Scala 3.
[info] com.olegpy:better-monadic-for:0.3.1:plugin->default(compile) -> X : Scala 2 compiler plugins are not supported in Scala 3. You need to find an alternative.
[info] "ch.epfl.scala" % "scalafix-interfaces" % "0.9.26"           -> Valid : Java libraries are compatible.
[info] ch.epfl.scala:scalafix-rules:0.9.26:test                     -> "ch.epfl.scala" %% "scalafix-rules" % "0.9.26" % "test" cross CrossVersion.for3Use2_13 : It's only safe to use the 2.13 version if it's inside an application.
[info] org.typelevel:cats-core:2.2.0                                -> "org.typelevel" %% "cats-core" % "2.6.1" : Other versions are avaialble for Scala 3: "2.7.0"
[info] org.typelevel:kind-projector:0.11.0:plugin->default(compile) -> -Ykind-projector : This compiler plugin has a scalacOption equivalent. Add it to your scalacOptions.
```

### Valid libraries
```
[info] ch.epfl.scala:scalafix-interfaces:0.9.26 -> Valid
```
Valid libraries are libraries that can be kept as they are. Those libraries are either already 
compatible with Scala 3, or they are Java libraries.

### Libraries that need to be updated

```text
org.typelevel:cats-core:2.2.0            -> "org.typelevel" %% "cats-core" % "2.6.1" : Other versions are avaialble for Scala 3: "2.7.0"
ch.epfl.scala:scalafix-rules:0.9.26:test -> "ch.epfl.scala" %% "scalafix-rules" % "0.9.26" % "test" cross CrossVersion.for3Use2_13 : It's only safe to use the 2.13 version if it's inside an application.
```

- For `cats-core` there is a version that has been published for Scala 3
  which is the proposed version `2.6.1`. We can update the build with this new version. There is also
  a more recent version available which is `2.7.0` (but we need to use at least version 2.6.1 to get Scala 3 compatibility).

- For `scalafix-rules`, there is no available version for Scala 3, but the library does not contain macros,
  and therefore the `2.13` version can be used as it is in Scala 3. The syntax still needs to be updated to
  `"ch.epfl.scala" %% "scalafix-rules" % "0.9.26" % "test" cross CrossVersion.for3Use2_13`. 
  It’s not recommended to publish a Scala 3 library that depends on a Scala 2.13 library. 
  The reason is to prevent library users from ending up with two conflicting versions of 
  the same library in their classpath (one for Scala 2.13 and one for Scala 3), this problem can not be solved in some cases.
  Read more about this topic in [the interoperability-overview](compatibility-classpath.html#interoperability-overview).

### Macro library
```text
com.softwaremill.scalamacrodebug:macros:0.4.1:test -> X : Contains Macros and is not yet published for Scala 3.
```
Scala 2 macros cannot be executed by the Scala 3 compiler.
So if you depend on a library that relies on macros, you will have to wait until this library is published for Scala 3.

### Compiler plugins
```text
com.olegpy:better-monadic-for:0.3.1:plugin->default(compile) -> X : Scala 2 compiler plugins are not supported in Scala 3. You need to find an alternative.
org.typelevel:kind-projector:0.11.0:plugin->default(compile) -> -Ykind-projector : This compiler plugin has a scalacOption equivalent. Add it to your scalacOptions.
```

`better-monadic-for` is a Scala 2 compiler plugin.
As explained in this [section](tutorial-sbt.html#2-choose-a-module), Scala 2 compiler plugins are not
supported in Scala 3.
In this case, we need to remove `better-monadic-for` and fix the code manually to make it compile without the compiler plugin.

For `kind-projector`, which is also a Scala 2 compiler plugin, there is an equivalent compiler option, `-Ykind-projector` (as shown in the message), which
can be added to your `scalacOptions`. 

### The new build file
To update the build, for all incompatible settings or libraries, we assign different `scalacOptions` and `libraryDependencies` depending on the `scalaVersion`.

```scala
//build.sbt
lazy val main = project
  .in(file("."))
  .settings(
    name := "main",
    scalaVersion := "2.13.7",
    semanticdbEnabled := true,
    scalacOptions ++= (if (scalaVersion.value.startsWith("3")) Seq("-Werror", "-Ykind-projector")
    else Seq("-Werror", "-Wunused")),
    libraryDependencies ++= (
      if (scalaVersion.value.startsWith("3")) Seq()
      else
        Seq(compilerPlugin("org.typelevel" %% "kind-projector" % "0.13.2" cross CrossVersion.full))
      ),
    libraryDependencies ++= Seq(
      "org.typelevel"                    %% "cats-core"           % "2.6.1",
      "ch.epfl.scala"                     % "scalafix-interfaces" % "0.9.26",
      "ch.epfl.scala" %% "scalafix-rules" % "0.9.26" % "test" cross CrossVersion.for3Use2_13
    )
  )
```

## Migrate `scalacOptions`
**Usage:** `migrate-scalacOptions projectId` where projectId is the name of the module chosen to be migrated.

This command helps with the process of updating the compiler settings. It is based on 
[the Compiler Options Table](options-lookup.html).
Between Scala 2.13 and Scala 3.1.0, the available compiler options are different:
- some Scala 2.13 settings have been removed
- others have been renamed 
- some remain the same.

The previous build file specifies two scalacOptions: `-Werror` and `-Wunused`
```
> migrate-scalacOptions main
[info] X       : the option is not available in Scala 3
[info] Renamed : the option has been renamed
[info] Valid   : the option is still valid
[info] Plugin  : the option is related to a plugin, previously handled by migrate-libs
[info]
[info] -Wunused -> X
[info] -Werror  -> -Xfatal-warnings

[info] Plugins options
[info] -Yrangepos -> X
[info] -Xplugin:/Users/meriamlachkar/Library/Caches/Coursier/v1/https/repo1.maven.org/maven2/org/typelevel/kind-projector_2.13.3/0.13.2/kind-projector_2.13.3-0.13.2.jar       -> Plugin
[info] -Xplugin:/Users/meriamlachkar/Library/Caches/Coursier/v1/https/repo1.maven.org/maven2/org/scalameta/semanticdb-scalac_2.13.3/4.4.20/semanticdb-scalac_2.13.3-4.4.20.jar -> Plugin
[info] -P:semanticdb:synthetics:on                                                                                                                                             -> Plugin
[info] -P:semanticdb:sourceroot:/Users/meriamlachkar/perso/plugin-test                                                                                                         -> Plugin
[info] -P:semanticdb:targetroot:/Users/meriamlachkar/perso/plugin-test/target/scala-2.13/meta                                                                                  -> Plugin
[info] -P:semanticdb:failures:warning                                                                                                                                          -> Plugin

```

We see that `-Wunusued` is specific to Scala 2 and doesn't have an equivalent in scala3, so we need to
remove it, whereas `-Werror` exists under a different name: `-Xfatal-warnings`, and can be renamed.

The command also outputs information specific to sbt plugins.
There is no need to modify them, the plugins are supposed to adapt the settings for Scala 3.

In this specific case:
 - we don’t need to remove `-Yrangepos`. 
 - `kind-projector` plugin has been replaced in the previous step
 - `Xplugin:semanticdb` is added through an sbt setting `semanticdbEnabled := true`
that is set by scala3-migrate (this tool). If `semanticdb` is added through `compilerPlugin` or 
`addCompilerPlugin`, it will be listed as a library dependency when we execute migrate-libs. 
The support of SemanticDB is now shipped into the Scala 3 compiler, and will be configured with the same setting: 
`semanticdbEnabled := true`. Scala3-migrate doesn't enable SemanticDB in Scala 3 unless it's configured in the build.

To conclude, all the information specific to the sbt plugins displayed by `migrate-scalacOption` can be
ignored if the previous step has been followed successfully.

### The new build file
In the previous build file change, we have already introduce the distinction between scala verions, so this time we only need to update the values.

```scala
    scalacOptions ++=
      (if (scalaVersion.value.startsWith("3"))
        Seq("-Xfatal-warnings", "-Ykind-projector")
      else Seq("-Werror", "-Wunused"))
```

> The build is now fully updated.
> You can change the `scalaVersion` in the sbt shell, and launch the compile task. 
> Your project may already successfully compile in scala 3!

## Fix some syntax incompatibilities
An incompatibility is a piece of code that compiles in Scala 2.13 but does not compile in Scala 3.
Migrating a code base involves finding and fixing all the incompatibilities of the source code.

This third command applies a number of scalafix rules that fix some of the deprecated syntaxes. 
Once those changes are applied, the code still compiles in Scala 2.13 and you can 
already commit those changes.

**Usage:** `migrate-syntax projectId` where projectId is the name of the module chosen to be migrated.

The list of scalafix rules applied are: 
- ProcedureSyntax
- fix.scala213.ConstructorProcedureSyntax
- fix.scala213.ExplicitNullaryEtaExpansion
- fix.scala213.ParensAroundLambda
- fix.scala213.ExplicitNonNullaryApply
- fix.scala213.Any2StringAdd

For more information on the fixed incompatibilities, please refer to 
[the Incompatibility Table](incompat-syntactic.html).

> There are more incompatibilities listed in the migration guide. 
> Most of them are not frequent and can easily be fixed by hand. 
> If you want to contribute by developing automatic rewrite with scalafix, 
> we will be happy to add your rule in the migrate-syntax command.

This is the output of `migrate-syntax`.
```
> migrate-syntax main
[info] We are going to fix some syntax incompatibilities
[info]
[info] Successfully run fixSyntaxForScala3  in 8839 milliseconds
[info]
[info] The syntax incompatibilities have been fixed on the project main
[info] You can now commit the change!
[info] You can also execute the next command to try to migrate to 3.1.0
[info]
[info] migrate main
[info]
[success] Total time: 2 s, completed 9 Apr 2021, 11:12:05
```

## Fix other Scala 3 incompatibilities
> First reload the build to take into account the modifications 
> in scalacOptions and libraryDependencies.

**Usage:** `migrate projectId`: tries compiling your code in Scala 3 by adding the minimum required inferred types and implicit values.

Scala 3 uses a new type inference algorithm, therefore the Scala 3 compiler 
can infer a different type than the one inferred by the Scala 2.13. 
The goal of this command is to find the minimal set of type ascriptions to add to make your code compile with Scala 3.

If the libraries have not been ported correctly, running `migrate projectId` will 
fail reporting the problematic libraries.

The command will display the following output:
```
> migrate main
[info] We are going to migrate main / [Compile, Test] to 3.1.0
2022.01.06 21:56:39 [INFO] migrate:24 - Found 1 required patch(es) in Incompat4.scala after 823 milliseconds ms
2022.01.06 21:56:39 [INFO] compileWithRewrite:114 - Finalizing the migration: compiling in Scala 3 with -rewrite option
[info]
[info] main / Compile has been successfully migrated to Scala 3.1.0
[info]     
[info] You can now commit the change!
[info] Then you can permanently change the scalaVersion of main:
[info]
[info] crossScalaVersions += "3.1.0"  // or
[info] scalaVersion := "3.1.0"
```

In this example, a file has been modified by adding some implicit parameters, 
implicit conversions or explicit result types.

## What to do next ?
If you project contains only one module, you're done. Depending on the nature of your project, 
you will either change permanently the `scalaVersion` of your project, or add Scala 3 to `crossScalaVerions`. 
If you have more than one module, you can stard again with a second module `MODULE2`. 
if `MODULE2` depends on the last module migrated which is now compiling in Scala 3, you can either keep this module in Scala 3 and add `-Ytasty-reader` to `MODULE2 scalacOptions`, or `reload` the project to keep the migrated module on Scala 2 during the entire migration
which implies cross-compiling during the process of the migration. 

Once you are done, you can remove scala3-migrate from your plugins.

## Contributions and feedback are welcome
The tool is still under development, and we would love to hear from you. 
Every feedback will help us build a better tool: typos, clearer log messages, better documentation, 
bug reports, ideas of features, so please open a [GitHub issue](https://github.com/scalacenter/scala3-migrate) 
or contact us on [discord](https://discord.com/invite/scala).
