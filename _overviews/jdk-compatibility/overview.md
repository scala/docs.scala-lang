---
layout: singlepage-overview
title: JDK Compatibility
permalink: /overviews/jdk-compatibility/overview.html
---

Scala runs primarily on the Java Virtual Machine (JVM).

Sometimes new JVM versions require us to update Scala to remain compatible.

And as Scala and the JVM improve independently over time, Scala may drop compatibility with older JVM versions, in order to better take advantage of new JVM features.

## Version compatibility table

This table shows the first Scala release in each series that works with each JVM release.

| JVM version | Minimum Scala versions                                                                        |
|:-----------:|:----------------------------------------------------------------------------------------------|
| 12          | see [below](#jdk-12-compatibility-notes)                                                      |
| 11          | 2.13.0, 2.12.4, 2.11.12, 2.10.7 (but also, see [below](#jdk-11-compatibility-notes))          |
| 8           | 2.13.0, 2.12.0, 2.11.0, 2.10.2                                                                |
| 7           | 2.11.0, 2.10.0                                                                                |
| 6           | 2.11.0, 2.10.0                                                                                |

## Running versus compiling

We recommend using Java 8 for *compiling* Scala code. Since the JVM is backward compatible, it is usually safe to use a newer JVM to *run* your code compiled by the Scala compiler for older JVM versions. There are notable exceptions with experimental/unsafe features, and the introduction of the module system in Java 9. The Scala compiler does usually need updates to run properly on newer versions of the JVM, so make sure to use the appropriate JVM when compiling your code.

We try to provide experimental support for running the Scala compiler on LTS versions of Java ("Long Term Support"; see <http://www.oracle.com/technetwork/java/eol-135779.html>), and to the extent possible will include the current LTS Java version in our CI matrix and the community build. We will not, a priori, consider non-LTS Java versions. Compiler bugs related to Java versions other than the supported one (Java 8), will be scheduled with lower priority, and will not be considered release blockers. Lightbend does offer commercial support for faster resolution of issues like this.

Scala code compiled on Java 8 should run without problems in later JVMs, and we will give higher priority to bugs that break this property. For example, in the 2.13.x series we intend to provide support for JPMS module access checks, to allow ensuring your code won't incur `LinkageErrors` due to module access violations.

## Dropping old JVMs

Some Scala releases increase the *required* JVM versions for a Scala release. To leverage new features offered by a JVM release, we must sometimes drop support for older JVMs.

For example, Scala 2.12 raised the minimum JVM, for both compiling and running, from version from 6 to 8. This was done so we could take advantage of new features in 8 such as lambdas and default methods.

Like the 2.12.x series, the Scala 2.13.x series will support Java 8 and higher. (We may bump this to Java 11, but this is unlikely to happen in the 2.x series.)

## JDK 11 compatibility notes

Although the table above jumps from 8 to 11, JDK 9 and 10 will probably also work wherever 11 does. But unlike 9 and 10, 11 is an LTS release, so 11 is what we actually test on and recommend.

As of Scala 2.13.0, 2.12.8 and 2.11.12, **JDK 11 support is incomplete**. Notably, `scalac` will not enforce the restrictions of the Java Platform Module System, which means that code that typechecks may incur linkage errors at runtime. Scala 2.13.x will eventually provide [rudimentary support](https://github.com/scala/scala/pull/7218) for this, but likely only in nightlies built on Java 11.

JDK 11 support requires minimum sbt version 1.1.0, or 0.13.17 in the 0.13.x series.

To track progress on JDK 11 compatibility, watch:

* the ["Support JDK 11"](https://github.com/scala/scala-dev/issues/139 "scala/scala-dev #139") issue
* the [jdk11 label](https://github.com/scala/bug/labels/jdk11) in scala/bug

To help with testing on JDK 11, see [scala/scala-dev#559](https://github.com/scala/scala-dev/issues/559).

## JDK 12 compatibility notes

JDK 12 was released in March 2019.  But it is not an LTS release, so the remarks above about non-LTS releases apply.

Scala has not been extensively tested on JDK 12.

However, the Scala 2.12 community build is [up and running](https://scala-ci.typesafe.com/view/scala-2.12.x/job/scala-2.12.x-jdk12-integrate-community-build/) on an early-access JDK 12 build, and most projects are green.

Two significant known issues with Scala 2.12.8 on JDK 12 are:

* the `-release` flag doesn't work ([scala/bug#11403](https://github.com/scala/bug/issues/11403))
* the optimizer doesn't work ([scala/bug#11372](https://github.com/scala/bug/issues/11372))

Both issues have already been fixed.  The fixes will be included in [Scala 2.12.9](https://github.com/scala/scala/milestone/77).  2.12.9 is tentatively planned for release in June 2019.  In the meantime, consider using a [Scala nightly build](https://stackoverflow.com/questions/40622878/how-do-i-tell-sbt-to-use-a-nightly-build-of-scala-2-12-or-2-13) to test the fixes.

In other respects, so far it appears that 12 is similar to 11 with respect to Scala compatibility.

To track progress on JDK 12 compatibility, watch:

* the [jdk12 label](https://github.com/scala/bug/labels/jdk12) in scala/bug (as well as the [jdk11 label](https://github.com/scala/bug/labels/jdk11))
* the JDK 11 and 12 community build ticket ([scala/community-builds#796](https://github.com/scala/community-builds/issues/796))
