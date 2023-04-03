---
layout: singlepage-overview
title: JDK Compatibility
permalink: /overviews/jdk-compatibility/overview.html
---

Scala's primary platform is the Java Virtual Machine (JVM). (Other supported platforms: [Scala.js](https://www.scala-js.org/), [Scala Native](https://scala-native.readthedocs.io/).)

Sometimes new JVM and JDK (Java Development Kit) versions require us to update Scala to remain compatible.

## Version compatibility table

| JDK version | Minimum Scala versions                                       |
|:-----------:|:-------------------------------------------------------------|
| 20          | 3.3.0 (soon), 2.13.11 (soon), 2.12.18 (soon)                 |
| 19          | 3.2.0, 2.13.9, 2.12.16                                       |
| 18          | 3.1.3, 2.13.7, 2.12.15                                       |
| 17 (LTS)    | 3.0.0, 2.13.6, 2.12.15                                       |
| 11 (LTS)    | 3.0.0, 2.13.0, 2.12.4, 2.11.12                               |
| 8 (LTS)     | 3.0.0, 2.13.0, 2.12.0, 2.11.0                                |

**Using latest patch version is always recommended**

Even when a version combination isn't listed as supported, most features may still work.

In general, Scala works on JDK 11+, including GraalVM, but may not take special advantage of features that were added after JDK 8. See [below](#jdk-11-compatibility-notes).

Lightbend offers [commercial support](https://www.lightbend.com/lightbend-platform-subscription) for Scala 2. The linked page includes contact information for inquiring about supported and recommended versions.

## Running versus compiling

JDK 8, 11, 17, and 20 are all reasonable choices both for *compiling* and *running* Scala code.

Since the JVM is normally backwards compatible, it is usually safe to use a newer JVM for *running* your code than the one it was compiled on, especially if you are not using JVM features designated "experimental" or "unsafe".

JDK 8 remains in use at some shops (as of early 2023), but usage is declining and some projects are dropping support. If you compile on JDK 11+ but want to allow your users to stay on 8, additional care is needed to avoid using APIs and features that don't exist in 8. (For this reason, some Scala developers use a newer JDK for their daily work but do release builds on JDK 8.)

## Long Term Support (LTS) versions

After Java 8, Oracle introduced the concept of LTS versions of the JDK. These versions will remain supported (by Oracle, and likely by the rest of the ecosystem, including Scala) for longer than the versions in between. See <https://www.oracle.com/technetwork/java/eol-135779.html>.

JDK 8, 11, and 17 are LTS versions. (The next LTS version will be 21.)

Scala provides experimental support for running the Scala compiler on non-LTS versions of the JDK. The current LTS versions are normally tested in our CI matrix and by the Scala community build. We may also test non-LTS versions, but any issues found there are considered lower priority, and will not be considered release blockers. (Lightbend may be able to offer faster resolution of issues like this under commercial support.)

As already mentioned, Scala code compiled on JDK 8 should run without problems in later JVMs. We will give higher priority to bugs that break this property. (For example, in 2.13.x we might eventually provide support for JPMS module access checks, to ensure your code won't incur `LinkageErrors` due to module access violations.)

## JDK vendors and distributions

In almost every case, you're free to use the JDK and JVM of your choice.

JDK 8 users typically use the Oracle JDK or some flavor of OpenJDK.

Most JDK 11+ users are using OpenJDK, or GraalVM which runs in the context of OpenJDK. GraalVM performs well on the Scala benchmarks, and it benefits from GraalVM runtime and runs faster too.

OpenJDK comes in various flavors, offered by different providers.  We build and test Scala using [Temurin](https://adoptium.net) primarily, but the differences are unlikely to matter to most users.

## JDK 11 compatibility notes

The Scala test suite and Scala community build are green on JDK 11.

The Scala compiler does not enforce the restrictions of the Java Platform Module System, which means that code that typechecks may incur linkage errors at runtime. Scala 2.13.x will eventually provide [rudimentary support](https://github.com/scala/scala/pull/7218) for this (perhaps only in nightlies built on JDK 11).

For sbt users, JDK 11 support requires minimum sbt version 1.1.0.  sbt 1.3.9 or newer is recommended.  (If you are still on the 0.13.x series, use 0.13.18.)

To track progress on JDK 11 related issues in Scala, watch:

* the ["Support JDK 11"](https://github.com/scala/scala-dev/issues/139 "scala/scala-dev #139") issue
* the [jdk11 label](https://github.com/scala/bug/labels/jdk11) in scala/bug

## JDK 17 compatibility notes

JDK 17 is an LTS release.

Scala 2.13.6+ and 2.12.15+ support JDK 17.

The Scala test suite and Scala community build are green on JDK 17.

For sbt users, sbt 1.6.0-RC1 is the first version to support JDK 17, but in practice sbt 1.5.5 may also work. (It will print a warning on startup about `TrapExit` that you can ignore.)

For possible Scala issues, see the [jdk11](https://github.com/scala/bug/labels/jdk11) and [jdk17](https://github.com/scala/bug/labels/jdk17) labels in the Scala 2 bug tracker.

## JDK 18 compatibility notes

JDK 18, a non-LTS release, came out in March 2022.

Support for JDK 18 was included in Scala 2.13.7 and 2.12.15.

## JDK 19 compatibility notes

JDK 19, a non-LTS release, came out in September 2022.

Support for JDK 19 was included in Scala 2.13.9 and 2.12.16.

## JDK 20 compatibility notes

JDK 20, a non-LTS release, came out in March 2023.

Support for JDK 20 has already been merged and is available in
[nightly builds](https://stackoverflow.com/questions/40622878/how-do-i-tell-sbt-or-scala-cli-to-use-a-nightly-build-of-scala-2-12-or-2-13)
of Scala 2.12, 2.13, and 3.

The support will be included in forthcoming Scala releases: 2.12.18,
2.13.11, and 3.3.0.  We hope to release these in April 2023, or not
long after.

<!--
## JDK 21 compatibility notes

Early access builds of JDK 21, a non-LTS release, are already available.

Initial support for JDK 20 has been merged and is already available in
nightly builds of Scala 2.12, 2.13, and 3.  (The support will be
included in forthcoming Scala releases: 2.12.19, 2.13.12, and 3.3.1.)
-->

## GraalVM Native Image compatibility notes

There are several records of successfully using Scala with [GraalVM](https://www.graalvm.org) Native Image (i.e., ahead of time compiler) to produce directly executable binaries.
Beware that, even using solely the Scala standard library, Native Image compilation have some heavy requirements in terms of [reflective access](https://www.graalvm.org/reference-manual/native-image/metadata/), and it very likely require additional configuration steps to be performed.

A few sbt plugins are offering support for GraalVM Native Image compilation:

- [sbt-native-packager](https://www.scala-sbt.org/sbt-native-packager/formats/graalvm-native-image.html)
- [sbt-native-image](https://github.com/scalameta/sbt-native-image)

## Scala 3

>The Scala 3.x series supports JDK 8, as well as 11 and beyond.

As Scala and the JVM continue to evolve, some eventual Scala version may drop support for JDK 8, in order to better take advantage of new JVM features.  It isn't clear yet what the new minimum supported version might become.
