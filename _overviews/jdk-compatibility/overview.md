---
layout: singlepage-overview
title: JDK Compatibility
permalink: /overviews/jdk-compatibility/overview.html
---

Scala's primary platform is the Java Virtual Machine (JVM). Other supported platforms are [Scala.js](https://www.scala-js.org/) and [Scala Native](https://scala-native.org/).

Sometimes new JVM and JDK (Java Development Kit) versions require us to update Scala to remain compatible.

## Scala 3 compatibility

At present, both Scala 3.3 LTS and Scala 3.7 still support JDK 8 and above.

As per [this blog post](https://www.scala-lang.org/news/next-scala-lts-jdk.html),
Scala 3.8 will have a new minimum JDK version of 17.

The next Scala 3 LTS release will be Scala 3.9.

Minimum Scala 3 versions for each JDK:

| JDK         | 3.8*   | 3.4+     | 3.3 LTS  |
|:-----------:|:------:|:--------:|:--------:|
| 25 (LTS)    | 3.8.0* | 3.7.1    | 3.3.6    |
| 21 (LTS)    | 3.8.0* | 3.4.0    | 3.3.1    |
| 17 (LTS)    | 3.8.0* | 3.4.0    | 3.3.0    |
| 11 (LTS)    |        | 3.4.0    | 3.3.0    |
| 8 (LTS)     |        | 3.4.0    | 3.3.0    |

\* = forthcoming; support available in [nightly builds](https://docs.scala-lang.org/overviews/core/nightlies.html)

Even when a version combination isn't listed as supported, most features might still work.

Using the latest patch version of your chosen Scala version line is always recommended.

## Scala 2 compatibility

Minimum Scala 2 versions for each JDK:

| JDK         | 2.13      | 2.12      |
|:-----------:|:---------:|:---------:|
| 25 (LTS)    | 2.13.17   | 2.12.21*  |
| 21 (LTS)    | 2.13.11   | 2.12.18   |
| 17 (LTS)    | 2.13.6    | 2.12.15   |
| 11 (LTS)    | 2.13.0    | 2.12.4    |
| 8 (LTS)     | 2.13.0    | 2.12.0    |

\* = forthcoming; support available in [nightly builds](https://docs.scala-lang.org/overviews/core/nightlies.html)

Even when a version combination isn't listed as supported, most features might still work.

Using the latest patch version of your chosen Scala version line is always recommended.

Akka offers [commercial support](https://akka.io/pricing) for Scala 2. The linked page includes contact information for inquiring about supported and recommended versions.

## Tooling compatibility table

Minimum working versions:

| JDK         | scala-cli   | sbt       | mill       |
|:-----------:|:-----------:|:---------:|:-----------|
| 25 (LTS)    | 1.10.0      | 1.9.0     | 1.0.0      |
| 21 (LTS)    | 1.0.0       | 1.9.0     | 0.11.5     |
| 17 (LTS)    | 1.0.0       | 1.6.0     | 0.7.0      |
| 11 (LTS)    | 1.0.0       | 1.1.0     | 0.1.5      |
| 8 (LTS)     | 1.0.0       | 1.0.0     | 0.1.0      |

Even when a version combination isn't listed as supported, most features might still work.

The sbt developers have primarily tested on JDK 8, 11, and 17, but 21 and 25 are believed to also work.

Some tools may print warnings on startup on JDK 25.

Using a different build tool, such as Gradle or Maven? We invite pull requests adding additional columns to this table.

## Running versus compiling

JDK 17, 21, and 25 are all good choices both for *compiling* and *running* Scala code.

JDK 8 and 11 are also possible choices. As of 2025, these versions remain in use at some shops, but usage has declined greatly and many projects are dropping support. If you compile on JDK 17+ but want to allow your users to stay on 8, use `--release 8` to avoid using APIs and features that don't exist in 8. Another option is to use a newer JDK for your daily work but do release builds on JDK 8.

Since the JVM is normally backwards compatible, it is usually safe to use a newer JVM for *running* your code than the one it was compiled on, especially if you are not using JVM features designated "experimental" or "unsafe".

As per [this blog post](https://www.scala-lang.org/news/next-scala-lts-jdk.html), Scala 3.8 will have a new minimum JDK version of 17.

## Long Term Support (LTS) versions

After Java 8, Oracle introduced the concept of LTS versions of the JDK. These versions will remain supported (by Oracle, and likely by the rest of the ecosystem, including Scala) for longer than the versions in between. See <https://www.oracle.com/technetwork/java/eol-135779.html>.

JDK 8, 11, 17, 21, and 25 are LTS versions. (The next LTS version will be 29.)

Scala provides experimental support for running the Scala compiler on non-LTS versions of the JDK. The current LTS versions are normally tested in our CI matrix and by the Scala community build. We may also test non-LTS versions, but any issues found there are considered lower priority, and will not be considered release blockers. (The Scala teams at VirtusLab and Akka may be able to offer faster resolution of issues like this under commercial support.)

As already mentioned, Scala code compiled on JDK 8 should run without problems in later JVMs. We will give higher priority to bugs that break this property. (For example, we might eventually provide support for JPMS module access checks, to ensure your code won't incur `LinkageErrors` due to module access violations.)

## JDK vendors and distributions

In almost every case, you're free to use the JDK and JVM of your choice.

JDK 8 users typically use the Oracle JDK or some flavor of OpenJDK.

OpenJDK comes in various flavors, offered by different providers. We typically build and test Scala using [Temurin](https://adoptium.net) or [Zulu](https://www.azul.com/downloads/), but the differences are unlikely to matter to most users.

## JDK 11 compatibility notes

The Scala test suite and Scala community build are green on JDK 11.

In general, Scala works on JDK 11+, but may not take special advantage of features that were added after JDK 8.

For example, the Scala compiler does not enforce the restrictions of the Java Platform Module System, which means that code that typechecks may incur linkage errors at runtime. Scala 2.13.x will eventually provide [rudimentary support](https://github.com/scala/scala/pull/7218) for this (perhaps only in nightlies built on JDK 11).

To track progress on JDK 11 related issues in Scala, watch:

* the ["Support JDK 11"](https://github.com/scala/scala-dev/issues/139 "scala/scala-dev #139") issue
* the [jdk11 label](https://github.com/scala/bug/labels/jdk11) in scala/bug

## JDK 17 compatibility notes

JDK 17 is an LTS release.

Scala 2.13.6+ and 2.12.15+ support JDK 17.

The Scala test suite and Scala community build are green on JDK 17.

For sbt users, sbt 1.6.0-RC1 is the first version to support JDK 17, but in practice sbt 1.5.5 may also work. (It will print a warning on startup about `TrapExit` that you can ignore.)

For possible Scala 3 issues, see the [area:jdk](https://github.com/scala/scala3/labels/area%3Ajdk) and [compat:java](https://github.com/scala/scala3/labels/compat%3Ajava) labels in [the Scala 3 issue tracker](https://github.com/scala/scala3/issues).

For possible Scala 2 issues, see the [jdk11](https://github.com/scala/bug/labels/jdk11) and [jdk17](https://github.com/scala/bug/labels/jdk17) labels in [the Scala 2 bug tracker](https://github.com/scala/bug/issues).

## JDK 21 compatibility notes

JDK 21 is an LTS release.

Scala 3.3.1+, 2.13.11+, and 2.12.18+ support JDK 21.

The Scala test suite and Scala 2.13 community build are green on JDK 21.

For sbt users, sbt 1.9.0 is the first version to support JDK 21.

For possible Scala 2 issues, see the [jdk11](https://github.com/scala/bug/labels/jdk11), [jdk17](https://github.com/scala/bug/labels/jdk17), and [jdk21](https://github.com/scala/bug/labels/jdk21) labels in the Scala 2 bug tracker.

## JDK 25 compatibility notes

JDK 25 is an LTS release.

Scala 3.3.6+, 3.7.1+ and 2.13.17+ support JDK 25.

The Scala test suite and Scala 2.13 community build are green on JDK 25.

The forthcoming 2.12.21 release will support JDK 25.
Support is already available in [nightlies](https://docs.scala-lang.org/overviews/core/nightlies.html).

For information on timing of the forthcoming release, see:

* https://contributors.scala-lang.org/t/scala-2-12-21-release-planning/6753

For possible Scala 3 issues, see the [area:jdk](https://github.com/scala/scala3/labels/area%3Ajdk) and [compat:java](https://github.com/scala/scala3/labels/compat%3Ajava) labels in [the Scala 3 issue tracker](https://github.com/scala/scala3/issues).

For possible Scala 2 issues, see the [jdk11](https://github.com/scala/bug/labels/jdk11), [jdk17](https://github.com/scala/bug/labels/jdk17), [jdk21](https://github.com/scala/bug/labels/jdk21), and [jdk25](https://github.com/scala/bug/labels/jdk25) labels in [the Scala 2 bug tracker](https://github.com/scala/bug/issues).

## GraalVM Native Image compatibility notes

There are several records of successfully using Scala with [GraalVM](https://www.graalvm.org) Native Image (i.e., ahead of time compiler) to produce directly executable binaries.
Beware that, even using solely the Scala standard library, Native Image compilation have some heavy requirements in terms of [reflective access](https://www.graalvm.org/reference-manual/native-image/metadata/), and it very likely require additional configuration steps to be performed.

A few sbt plugins are offering support for GraalVM Native Image compilation:

- [sbt-native-packager](https://www.scala-sbt.org/sbt-native-packager/formats/graalvm-native-image.html)
- [sbt-native-image](https://github.com/scalameta/sbt-native-image)
