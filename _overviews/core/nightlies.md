---
layout: singlepage-overview
title: Nightly Versions of Scala
permalink: /overviews/core/:title.html
---

We regularly publish nightly versions of both Scala 3 and 2 so that users can preview and test the contents of upcoming releases.

Here's how to find and use these versions.

## General information on nightlies

### Scala 3

Scala 3 nightly versions are published to [https://repo.scala-lang.org](https://repo.scala-lang.org). Historically, they used to be published to Maven Central. Old nightly versions of Scala 3 (all the way until `3.8.0-RC1-bin-20250822-658c8bd-NIGHTLY` in August 2025) are still available there, as well as via [https://repo.scala-lang.org](https://repo.scala-lang.org).

If you know the full version number of the nightly you want to use, you can use it just like any other Scala 3 version.

There are a number of ways to get that version number, as listed below.

### Scala 2

We informally refer to Scala 2 “nightly” versions, but technically it's a misnomer. A so-called “nightly” is built for every merged PR in the Scala 2 repo.

Similarly to Scala 3 nightlies, they are available at [https://repo.scala-lang.org](https://repo.scala-lang.org).

## How to use nightly versions

### Scala CLI

Scala CLI is the official runner of the language and has nightlies available without any extra configuration. From Scala 3.5.0 and on it's available under the `scala` command in Scala 3 installations. It can also be installed separately as `scala-cli`.

Note: The nightly repository is supported since Scala CLI v1.9.0 onwards (or `scala` installed with Scala 3.7.3 or newer).

You can run nightlies with commands such as:

    scala -e 'println("Hello") -S 3.nightly
    scala -e 'println("Hello") -S 3.3.nightly
    scala -e 'println("Hello") -S 2.13.nightly
    scala -e 'println("Hello") -S 2.nightly # same as 2.13.nightly
    scala -e 'println("Hello") -S 2.12.nightly

The default command is `repl` (unless sources are passed, in which case it switches to `run`), but all the other scala-cli subcommands such as `compile` and `run` work, too. It also works with `//> using` directives in your script itself, for example:

    //> using scala 3.nightly
    //> using scala 3.3.nightly
    //> using scala 2.nightly
    //> using scala 2.13.nightly
    //> using scala 2.12.nightly

See this [scala-cli doc page](https://scala-cli.virtuslab.org/docs/commands/compile#scala-nightlies) for details.

### Get it from the nightly website

A quick way to get that version number is to visit [https://nightly.scala-lang.org](https://nightly.scala-lang.org) and look in the upper left corner.

### Check the repository, directly

Another way is to scrape the repository, as shown in this script: [https://raw.githubusercontent.com/VirtusLab/community-build3/master/scripts/lastVersionNightly.sc](https://raw.githubusercontent.com/VirtusLab/community-build3/master/scripts/lastVersionNightly.sc)

### SBT

To use recent nightlies with SBT, adding the appropriate resolver to the build configuration is necessary.

    ThisBuild / scalaVersion := "3.8.0-RC1-bin-20250916-eb1bb73-NIGHTLY"
    ThisBuild / resolvers += Resolver.scalaNightlyRepository
    lazy val root = (project in file("."))
      .settings(name := "sbt-with-scala-nightlies")

Also note that SBT 1.11.5 or newer is necessary.

### Mill

To use recent nightlies with Mill, a custom resolver for the initial bootstrap of the build is needed. 
Here's an example `build.mill` file:

    package build
    import mill.*
    import mill.api.*
    import scalalib.*

    def scalaNightlyRepo = "https://repo.scala-lang.org/artifactory/maven-nightlies"

    object project extends ScalaModule {
      def jvmWorker = ModuleRef(CustomJvmWorkerModule)
      override def scalaVersion = "3.8.0-RC1-bin-20250916-eb1bb73-NIGHTLY"
      override def repositories = Task { super.repositories() ++ Seq(scalaNightlyRepo)}
    }

    object CustomJvmWorkerModule extends JvmWorkerModule, CoursierModule {
      override def repositories = Task { super.repositories() ++ Seq(scalaNightlyRepo)}
    }

Note how the custom `JvmWorkerModule` is necessary with the added repository. It is not enough to just define it as a repository for the module dependencies.

Also note that Mill 1.0.5 or newer is necessary for this.
