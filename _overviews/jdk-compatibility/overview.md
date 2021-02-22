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
| 16, 17      | see below                        | see below
| 13, 14, 15  | 2.13.2, 2.12.11                  | 2.13.5, 2.12.13                                            |
| 12          | 2.13.1, 2.12.9                   | 2.13.5, 2.12.13                                            |
| 11          | 2.13.0, 2.12.4, 2.11.12          | 2.13.5, 2.12.13, 2.11.12                                   |
| 8           | 2.13.0, 2.12.0, 2.11.0, 2.10.2   | 2.13.5, 2.12.13, 2.11.12, 2.10.7                           |
| 6, 7        | 2.11.0, 2.10.0                   | 2.11.12, 2.10.7                                            |

Even when a version combination isn't listed as supported, most features may still work.  (But Scala 2.12+ definitely doesn't work at all on JDK 6 or 7.)

In general, Scala works on JDK 11+, including GraalVM, but it probably won't take special advantage of features that were added after JDK 8. See [below](#jdk-11-compatibility-notes).

Lightbend offers [commercial support](https://www.lightbend.com/lightbend-platform-subscription) for Scala. The linked page includes contact information for inquiring about supported and recommended versions.

## Running versus compiling

We generally recommend JDK 8 or 11 for *compiling* Scala code. Since the JVM tends to be backward compatible, it is usually safe to use a newer JVM for *running* your code, especially if you are not using JVM features designated "experimental" or "unsafe".

If you compile on JDK 11+ but have users on JDK 8, additional care is needed to avoid using APIs and features that don't exist in 8. Therefore, compiling on 8 may be the safer choice. Some Scala developers use JDK 11+ for their daily work but do release builds on JDK 8.

## Long Term Support (LTS) versions

After Java 8, Oracle introduced the concept of LTS versions of the JDK. These versions will remain supported (by Oracle, and likely by the rest of the ecosystem, including Scala) for longer than the versions in between. See <https://www.oracle.com/technetwork/java/eol-135779.html>.

JDK 8 and 11 are LTS versions. The next LTS version will be JDK 17, planned for September 2021.

Scala provides experimental support for running the Scala compiler on non-LTS versions of the JDK. The current LTS versions are normally tested in our CI matrix and by the Scala community build. We may also test non-LTS versions, but any issues found there are considered lower priority, and will not be considered release blockers. (Lightbend may be able to offer faster resolution of issues like this under commercial support.)

As already mentioned, Scala code compiled on JDK 8 should run without problems in later JVMs. We will give higher priority to bugs that break this property. (For example, in the 2.13.x series we intend to provide support for JPMS module access checks, to ensure your code won't incur `LinkageErrors` due to module access violations.)

## JDK vendors and distributions

In almost every case, you're free to use the JDK and JVM of your choice.

JDK 8 users typically use the Oracle JDK or some flavor of OpenJDK.

Most JDK 11+ users are using either OpenJDK or GraalVM.

OpenJDK comes in various flavors, offered by different providers.  We build and test Scala using [AdoptOpenJDK](https://adoptopenjdk.net) in particular, but the differences are unlikely to matter to most users.

## JDK 11 compatibility notes

Although the table above jumps from 8 to 11, JDK 9 and 10 will probably also work wherever 11 does. But unlike 9 and 10, 11 is an LTS release, so 11 is what we actually test on and recommend.

The Scala compiler does not enforce the restrictions of the Java Platform Module System, which means that code that typechecks may incur linkage errors at runtime. Scala 2.13.x will eventually provide [rudimentary support](https://github.com/scala/scala/pull/7218) for this (perhaps only in nightlies built on JDK 11).

For sbt users, JDK 11 support requires minimum sbt version 1.1.0.  sbt 1.3.9 or newer is recommended.  (If you are still on the 0.13.x series, use 0.13.18.)

To track progress on JDK 11 related issues, watch:

* the ["Support JDK 11"](https://github.com/scala/scala-dev/issues/139 "scala/scala-dev #139") issue
* the [jdk11 label](https://github.com/scala/bug/labels/jdk11) in scala/bug

To help with testing on JDK 11, see [scala/scala-dev#559](https://github.com/scala/scala-dev/issues/559).

## JDK 12, 13, 14, and 15 compatibility notes

JDK 14 was released in March 2020, and JDK 15 was released in September 2020. But 12, 13, 14, 15 are not LTS releases, so the remarks above about non-LTS releases apply.  The next LTS release will be JDK 17.

JDK 12, 13, 14, and 15 are expected to work wherever JDK 11 does. The Scala community build now runs on JDK 15 (as well as 11 and 8).

As of October 2020, the [jdk12](https://github.com/scala/bug/labels/jdk12) and [jdk13](https://github.com/scala/bug/labels/jdk13) labels in scala/bug have no open bugs. New issues will likely be reported against the newer non-LTS [jdk14 label](https://github.com/scala/bug/labels/jdk14) and [jdk15 label](https://github.com/scala/bug/labels/jdk15) and [jdk16 label](https://github.com/scala/bug/labels/jdk15) or the LTS [jdk11 label](https://github.com/scala/bug/labels/jdk11).

As far as we know, 12, 13, 14, and 15 are similar to 11 with respect to Scala compatibility.

## JDK 16 compatibility notes

JDK 16 prereleases are now available. The final release is [targeted](https://openjdk.java.net/projects/jdk/16/) for March 2021.

The Scala community build now runs on JDK 16.  We shipped improved JDK 16 support in [Scala 2.13.5](https://github.com/scala/scala/releases/tag/v2.13.5) and intend to ship the same improvements soon in Scala 2.12.14 ([release timing thread](https://contributors.scala-lang.org/t/scala-2-12-14-planning/4852/2)).

## Scala 3

The Scala 3.0.x series supports JDK 8, as well as 11 and beyond.

As Scala and the JVM continue to evolve, some eventual Scala 3.x version may drop support for JDK 8, in order to better take advantage of new JVM features.  It isn't clear yet what the new minimum supported version might become.
