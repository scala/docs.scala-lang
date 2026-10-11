---
title: Migrating to Scala 3.3
type: chapter
description: Migrating code from Scala 2.13 to Scala 3.3
num: 4
previous-page: preparing
next-page: migrating-to-3-9
redirect_from:
  - /scala3/guides/migration/tooling-migration-mode.html
  - /scala3/guides/migration/tutorial-sbt.html
  - /scala3/guides/migration/tutorial-intro.html
  - /scala3/guides/migration/tooling-tour.html
---

This step moves the code from Scala 2.13 to Scala 3.3, using the Scala 3.3 compiler.
Depending on the [migration route](planning.html#migration-routes), the result is released with Scala 3.3, or the code continues to [Scala 3.9 or 3.10](migrating-to-3-9.html) before the build switches to Scala 3.
In a build with several modules, the step is done for each module, in the order of the route.

The steps are shown with sbt; they are the same with other build tools.
Optionally, the [sbt-scala3-migrate](scala3-migrate.html) plugin automates part of them.

## 1. Add Scala 3 to the build

Add Scala 3.3 to the `crossScalaVersions` of the module:

```scala
scalaVersion := "2.13.18"
crossScalaVersions := Seq("2.13.18", "3.3.8")
```

In the sbt shell, `++3.3.8` switches the module to Scala 3.3.8, and `++2.13.18` back to Scala 2.13.
This way, the tests can run on Scala 2.13 after each change.

## 2. Configure the Scala 3 compiler

The Scala 3 compiler options are different, see the [Compiler Options Lookup Table](compiler-options.html).

Add the `-source:3.0-migration` option.
It makes the Scala 3 compiler accept Scala 2 code, and report the code that needs to change as migration warnings.
When the Scala 3 rules for implicit resolution find an ambiguity, the compiler uses the Scala 2 result and reports a warning.

```scala
scalacOptions ++= {
  CrossVersion.partialVersion(scalaVersion.value) match {
    case Some((3, _)) => Seq("-source:3.0-migration")
    case _            => Seq("-Xsource:3")
  }
}
```

If the build makes warnings fatal (`-Werror`), disable that for Scala 3 during the migration.

## 3. Fix the errors

Compile the main and test sources with Scala 3.3:

{% highlight text %}
sbt:example> ++3.3.8
sbt:example> example / Test / compile
{% endhighlight %}

If sbt cannot find a dependency, it is not published for Scala 3; see [Dependencies](preparing.html#2-dependencies).

The compiler reports two kinds of problems:
- *Migration warnings*: most of them are fixed automatically in the next step.
- *Errors* must be fixed by hand.
  The [Incompatibility Table](incompatibilities.html) describes the known incompatibilities and their solutions.
  The `-explain` option makes the compiler describe errors in more detail.

In case you are cross-building the project, changes must work on both Scala 2.13 and 3. You can check the code by running the tests with Scala 2.13:

{% highlight text %}
sbt:example> ++2.13.18
sbt:example> example / test
{% endhighlight %}

## 4. Apply the rewrites

Once only migration warnings are left, compile again with `-rewrite`:

{% highlight text %}
sbt:example> ++3.3.8
sbt:example> set example / scalacOptions += "-rewrite"
sbt:example> example / Test / compile
...
[info] [patched file /example/src/main/scala/app/Main.scala]
{% endhighlight %}

The [Incompatibility Table](incompatibilities.html) shows which changes are rewritten.
Fix the remaining warnings about implicit resolution now, for example by passing the implicit argument explicitly: they are only reported under `-source:3.0-migration`.

Then replace `-source:3.0-migration` in the build by `-source:3.3-migration`, `reload`, and run the three commands above again.
This fixes deprecations of Scala 3.2 and 3.3, such as refutable patterns in `for` generators and `val` definitions, which Scala 3.3 otherwise reports as warnings.

> #### Good to know
> - The rewrites change the source files. Commit before each run, to review the changes.
> - The rewrites are only applied if the compilation has no errors.
>   A single error, in any file, prevents all rewrites.
> - You cannot choose which rewrites are applied, the compiler runs all of them.

## 5. Check the result

Remove `-source:3.3-migration` from the build, and run the tests with both Scala 2.13 and Scala 3.3.
Different implicits can be resolved in rare cases, which only the tests can detect.

The module now compiles with Scala 3.3.
To release it with Scala 3.3, set its `scalaVersion` to `3.3.8`; 2.13 modules that depend on it need the `-Ytasty-reader` option.
Depending on your migration route, continue with [Migrating to Scala 3.9 and 3.10](migrating-to-3-9.html).

If you use [Scalafmt](https://scalameta.org/scalafmt/), set `runner.dialect = scala3` in `.scalafmt.conf`.
