---
layout: singlepage-overview
title: Nightly Versions of Scala
permalink: /overviews/core/:title.html
---

We regularly publish nightly versions of both Scala 3 and 2 so that users can preview and test the contents of upcoming releases.

Here's how to find and use these versions.

## Scala 3

Scala 3 nightly versions are published to Maven Central. If you know the full version number of the nightly you want to use, you can use it just like any other Scala 3 version.

One quick way to get that version number is to visit [https://dotty.epfl.ch](https://dotty.epfl.ch) and look in the upper left corner.

Another way is to scrape Maven Central, as shown in this script: [https://raw.githubusercontent.com/VirtusLab/community-build3/master/scripts/lastVersionNightly.sc](https://raw.githubusercontent.com/VirtusLab/community-build3/master/scripts/lastVersionNightly.sc)

A third way is to use [scala-cli](https://scala-cli.virtuslab.org), as follows. (Since Scala 3.5.0, the `scala` command runs `scala-cli`.)

### scala-cli

You can run nightlies with commands such as:

    scala-cli -S 3.nightly
    scala-cli -S 3.3.nightly

The default command is `repl`, but all the other scala-cli subcommands such as `compile` and `run` work, too. It also works with `//>` directives in your script itself, for example:

    //> using scala 3.nightly

See this [scala-cli doc page](https://scala-cli.virtuslab.org/docs/commands/compile#scala-nightlies) for details.

## Scala 2.13 or 2.12

We informally refer to Scala 2 “nightly” versions, but technically it's a misnomer. A so-called “nightly” is built for every merged PR.

Scala 2 nightly versions are published to a special resolver. Unless you are using scala-cli, you'll need to add that resolver to your build configuration in order to use these versions.

### quick version (sbt)

    Global / resolvers += "scala-integration" at
      "https://scala-ci.typesafe.com/artifactory/scala-integration/"
    scalaVersion := "2.13.15-bin-abcd123"

For a 2.12 nightly, substitute e.g. `2.12.20` for `2.13.15`; in either case, it's the version number of the _next_ release on that branch.

For `abcd123`, substitute the first 7 characters of the SHA of the latest commit to the [2.13.x branch](https://github.com/scala/scala/commits/2.13.x) or [2.12.x branch](https://github.com/scala/scala/commits/2.12.x) that has a green checkmark. (Clicking the checkmark will show a CI job name with the whole version in its name.)

A quick way to find out the full version number of a current nightly is to use [scala-cli](https://scala-cli.virtuslab.org), as follows.

### quick version (scala-cli)

You can run nightlies with:

    scala-cli -S 2.13.nightly
    scala-cli -S 2.nightly     # same as 2.13.nightly
    scala-cli -S 2.12.nightly

The default command is `repl`, but all the other scala-cli subcommands such as `compile` and `run` work, too. It also works with `//>` directives in your script itself, for example:

    //> using scala 2.nightly

### Longer explanation

We no longer publish `-SNAPSHOT` versions of Scala 2.

But the team does publish nightly versions, each with its own fixed version number. The version number of a nightly looks like e.g. `2.13.1-bin-abcd123`. (`-bin-` signals binary compatibility to sbt; all 2.13.x releases since 2.13.0 are binary compatible with each other.)

To tell sbt to use one of these nightlies, you need to do three things.

First, add the resolver where the nightlies are kept:

    Global / resolvers += "scala-integration" at
      "https://scala-ci.typesafe.com/artifactory/scala-integration/"

Second, specify the Scala version:

    scalaVersion := "2.13.1-bin-abcd123"

But that isn't a real version number. Manually substitute a version number containing the 7-character SHA of the last commit in the [scala/scala repository](https://github.com/scala/scala) for which a nightly version was published.  Look at [https://travis-ci.org/scala/scala/branches](https://travis-ci.org/scala/scala/branches) and you'll see the SHA in the upper right corner of the 2.13.x (or 2.12.x) section.

As soon as 2.13.1 is released, the version number in the nightly will bump to 2.13.2, and so on.

If you have a multiproject build, be sure you set these settings across all projects when you modify your build definition. Or, you may set them temporarily in the sbt shell with `++2.13.1-bin-abcd123` (sbt 0.13.x) or `++2.13.1-bin-abcd123!` (sbt 1.x; the added exclamation point is necessary to force a version not included in `crossScalaVersions` to be used).

Ideally, we would suggest an automated way to ask Travis-CI for the right SHA. This is presumably possible via Travis-CI's API, but as far as we know, nobody has looked into it yet. (Is there a volunteer?)
