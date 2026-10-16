---
title: Preparing on Scala 2.13
type: chapter
description: Changes to make on Scala 2.13 before migrating to Scala 3
num: 3
previous-page: interoperability
next-page: migrating-to-3-3
redirect_from:
  - /scala3/guides/migration/tutorial-prerequisites.html
  - /scala3/guides/migration/dependencies.html
---

A first round of changes should be made while the project is still on Scala 2.13, to keep the migration itself smaller.
Make each of them as a separate change:

1. Upgrade to JDK 17.
2. Update the dependencies to versions that are published for Scala 3, and replace those that do not exist for Scala 3.
3. Replace compiler plugins.
4. Enable `-Xsource:3` and fix the migration warnings.

## 1. JDK 17

Scala 3.8 and later require JDK 17 or newer, both to compile and to run.
See [JDK Compatibility]({% link _overviews/jdk-compatibility/overview.md %}).
This step is not strictly required when migrating to Scala 3.3 only, but recommended.
Even on 3.3, some dependencies might require you to switch to JDK 17.

## 2. Dependencies

Update each dependency to a version that is published for both Scala 2.13 and Scala 3.

With the module-by-module and top-down routes, the build keeps using the `_2.13` versions of all libraries until the migration is complete (see [Interoperability](interoperability.html)), so the updates could wait.
But the final switch to Scala 3 needs versions that are published for Scala 3, so it is simplest to update first in every case.

### Finding versions for Scala 3

The version matrix of a library on [Scaladex](https://index.scala-lang.org/) shows which versions are published for Scala 2.13 and Scala 3.

For example, `"org.scalatest" %% "scalatest" % "3.0.9"` is not published for Scala 3, but 3.2.20 is:

```scala
libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.20"
```

In sbt, the `migrateDependencies` command of [sbt-scala3-migrate](scala3-migrate.html) lists the versions that are published for Scala 3.

### Libraries without a direct replacement

Some libraries rely on Scala 2 features that do not exist in Scala 3: macros, macro annotations, compiler plugins or `scala-reflect`.
Some have no Scala 3 version, others have one with a different API:

| Scala 2.13 | Scala 3 |
|-|-|
| [shapeless 2](https://github.com/milessabin/shapeless) | [shapeless 3](https://github.com/typelevel/shapeless-3), with a different API, or the built-in [type class derivation]({{ site.scala3ref }}/contextual/derivation.html) |
| Macro annotations, such as circe's `@JsonCodec` | `derives` clauses, such as `derives Codec.AsObject` |
| `scala-reflect`, for example `TypeTag` | `ClassTag`, Java reflection, or [izumi-reflect](https://github.com/zio/izumi-reflect) (also for Scala 2.13) |
| The silencer compiler plugin | `@nowarn` (also in Scala 2.13) |

Libraries often depend on `scala-reflect` transitively; sbt's `dependencyTree` task shows where it comes from.

When a replacement exists for Scala 2.13 too, switch to it before the migration.
Otherwise, the change is part of the migration, or the code goes to the version-specific `scala-2` and `scala-3` source directories of a cross-built module.

### Libraries not published for Scala 3

Scala 3 can use the Scala 2.13 version of a library, with `CrossVersion.for3Use2_13`, unless the code uses its Scala 2 macros.
This has limitations, explained in [Interoperability](interoperability.html).
If this does not work, replace the library, or help its maintainers publish it for Scala 3.

## 3. Compiler Plugins

Scala 2 compiler plugins do not work with Scala 3.
They are configured in `build.sbt` with `addCompilerPlugin(...)` or `compilerPlugin(...)`, or added by sbt plugins.
The compiler options show all of them:

{% highlight text %}
sbt:example> show example / Compile / scalacOptions
[info] * -Xplugin:target/compiler_plugins/wartremover_2.13.6-2.4.15.jar
[info] * -Xplugin:target/compiler_plugins/semanticdb-scalac_2.13.6-4.4.18.jar
[info] * -Yrangepos
[info] * -P:semanticdb:targetroot:/example/target/scala-2.13/meta
{% endhighlight %}

Some plugins have a replacement in Scala 3:

- **SemanticDB** is built into the Scala 3 compiler.
  sbt configures it with the setting `semanticdbEnabled := true`.
- **Scala.js** and **Scala Native** support Scala 3 with recent versions of their sbt plugins.
- **Kind projector**: Scala 3 supports a subset of its syntax under `-Xkind-projector` (`-Ykind-projector` before Scala 3.5).
  See [Kind Projector Migration](kind-projector.html).

For the other plugins, check whether the project provides a Scala 3 version, or remove them.

## 4. `-Xsource:3`

With the `-Xsource:3` option, the Scala 2.13 compiler reports code that changes or breaks in Scala 3.
Many of these messages have a quick fix, which the compiler applies with `-quickfix:cat=scala3-migration`:

```scala
scalacOptions ++= Seq("-Xsource:3", "-quickfix:cat=scala3-migration")
```

The messages are reported as errors, but the quick fixes are applied to the source files.
Then remove `-quickfix`, keep `-Xsource:3`, and fix the remaining messages by hand.
If some of them need to wait, report them as warnings with `-Wconf:cat=scala3-migration:w`.

[Scala 2 with -Xsource:3](scala2-xsource3.html) describes the option in detail, including `-Xsource-features` for projects that cross-build with Scala 2.13 and Scala 3.
