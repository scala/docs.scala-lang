---
layout: singlepage-overview
title: JDK Compatibility
permalink: /overviews/jdk-compatibility/overview.html
---

Scala's primary platform is the Java Virtual Machine (JVM). (Other supported platforms: [Scala.js](https://www.scala-js.org/), [Scala Native](https://scala-native.readthedocs.io/).)

Sometimes new JVM and JDK (Java Development Kit) versions require us to update Scala to remain compatible.

## Version compatibility table

| JDK version | Minimum Scala versions           | Recommended Scala versions                                 |
|:-----------:|:---------------------------------|:-----------------------------------------------------------|
| 18          | 2.13.7, 2.12.15                  | 2.13.7, 2.12.15                                            |
| 17          | 2.13.6, 2.12.15                  | 2.13.7, 2.12.15                                            |
| 11          | 2.13.0, 2.12.4, 2.11.12          | 2.13.7, 2.12.15, 2.11.12                                   |
| 8           | 2.13.0, 2.12.0, 2.11.0, 2.10.2   | 2.13.7, 2.12.15, 2.11.12, 2.10.7                           |
| 6, 7        | 2.11.0, 2.10.0                   | 2.11.12, 2.10.7                                            |

Even when a version combination isn't listed as supported, most features may still work.  (But Scala 2.12+ definitely doesn't work at all on JDK 6 or 7.)

In general, Scala works on JDK 11+, including GraalVM, but it probably won't take special advantage of features that were added after JDK 8. See [below](#jdk-11-compatibility-notes).

Lightbend offers [commercial support](https://www.lightbend.com/lightbend-platform-subscription) for Scala 2. The linked page includes contact information for inquiring about supported and recommended versions.

## Running versus compiling

We generally recommend JDK 8 or 11 for *compiling* Scala code. Since the JVM tends to be backward compatible, it is usually safe to use a newer JVM for *running* your code, especially if you are not using JVM features designated "experimental" or "unsafe".

If you compile on JDK 11+ but have users on JDK 8, additional care is needed to avoid using APIs and features that don't exist in 8. Therefore, compiling on 8 may be the safer choice. Some Scala developers use JDK 11+ for their daily work but do release builds on JDK 8.

Additionally, you can also run your Scala application on GraalVM which is a JVM. GraalVM performs well on the Scala benchmarks, and it benefits from GraalVM runtime and runs faster too.

## Long Term Support (LTS) versions

After Java 8, Oracle introduced the concept of LTS versions of the JDK. These versions will remain supported (by Oracle, and likely by the rest of the ecosystem, including Scala) for longer than the versions in between. See <https://www.oracle.com/technetwork/java/eol-135779.html>.

JDK 8, 11, and 17 are LTS versions.

Scala provides experimental support for running the Scala compiler on non-LTS versions of the JDK. The current LTS versions are normally tested in our CI matrix and by the Scala community build. We may also test non-LTS versions, but any issues found there are considered lower priority, and will not be considered release blockers. (Lightbend may be able to offer faster resolution of issues like this under commercial support.)

As already mentioned, Scala code compiled on JDK 8 should run without problems in later JVMs. We will give higher priority to bugs that break this property. (For example, later in the 2.13.x series we hope to provide support for JPMS module access checks, to ensure your code won't incur `LinkageErrors` due to module access violations.)

## JDK vendors and distributions

In almost every case, you're free to use the JDK and JVM of your choice.

JDK 8 users typically use the Oracle JDK or some flavor of OpenJDK.

Most JDK 11+ users are using either OpenJDK or GraalVM which runs in the context of OpenJDK.

OpenJDK comes in various flavors, offered by different providers.  We build and test Scala using [AdoptOpenJDK](https://adoptopenjdk.net) in particular, but the differences are unlikely to matter to most users.

## JDK 11 compatibility notes

The Scala test suite and Scala community build are green on JDK 11.

The Scala compiler does not enforce the restrictions of the Java Platform Module System, which means that code that typechecks may incur linkage errors at runtime. Scala 2.13.x will eventually provide [rudimentary support](https://github.com/scala/scala/pull/7218) for this (perhaps only in nightlies built on JDK 11).

For sbt users, JDK 11 support requires minimum sbt version 1.1.0.  sbt 1.3.9 or newer is recommended.  (If you are still on the 0.13.x series, use 0.13.18.)

To track progress on JDK 11 related issues, watch:

* the ["Support JDK 11"](https://github.com/scala/scala-dev/issues/139 "scala/scala-dev #139") issue
* the [jdk11 label](https://github.com/scala/bug/labels/jdk11) in scala/bug

## JDK 17 compatibility notes

JDK 17 is an LTS release.

Scala 2.13.6 and 2.12.15 support JDK 17.

The Scala test suite and Scala community build are green on JDK 17.

For possible issues, see the [jdk11](https://github.com/scala/bug/labels/jdk11) and [jdk17](https://github.com/scala/bug/labels/jdk17) labels in the Scala 2 bug tracker.

## JDK 18 compatibility notes

Early access builds of JDK 18, a non-LTS release, are already available.

Initial support for JDK 18 is included in Scala 2.13.7 and 2.12.15.

## GraalVM Native Image compatibility notes

There are several records of successfully using Scala with [GraalVM](https://www.graalvm.org) Native Image(i.e.: ahead of time compiler) to produce directly executable binaries.
Beware that, even using solely the Scala standard library, Native Image compilation have some heavy requirements in terms of [reflective access](https://www.graalvm.org/reference-manual/native-image/Reflection/), and it very likely require additional configuration steps to be performed.

A few sbt plugins are offering support for GraalVM Native Image compilation:

- [sbt-native-packager](https://www.scala-sbt.org/sbt-native-packager/formats/graalvm-native-image.html)
- [sbt-native-image](https://github.com/scalameta/sbt-native-image)

## Scala 3

>The Scala 3.x series supports JDK 8, as well as 11 and beyond.

As Scala and the JVM continue to evolve, some eventual Scala version may drop support for JDK 8, in order to better take advantage of new JVM features.  It isn't clear yet what the new minimum supported version might become.
