---
layout: singlepage-overview
title: JDK Compatibility
discourse: true
permalink: /overviews/jdk-compatibility/overview.html
---

Scala runs primarily on the Java Virtual Machine (JVM).

Sometimes new JVM versions require us to update Scala to remain compatible.

And as Scala and the JVM improve independently over time, Scala may drop compatibility with older JVM versions, in order to better take advantage of new JVM features.

## Version compatibility table

This table shows the first Scala release in each series that works with each JVM release.

| JVM version | Minimum Scala versions                                                                        |
|:-----------:|:----------------------------------------------------------------------------------------------|
| 9, 10       | 2.12.4[¹](#jdk-9--up-compatibility-notes), 2.11.12[¹](#jdk-9--up-compatibility-notes), 2.10.7 |
| 8           | 2.12.0, 2.11.0, 2.10.2                                                                        |
| 7           | 2.11.0, 2.10.0                                                                                |
| 6           | 2.11.0, 2.10.0                                                                                |



## Running versus compiling

We recommend using Java 8 for *compiling* Scala code. Since the JVM is backward compatible, it is usually safe to use a newer JVM to *run* your code compiled by the Scala compiler for older JVM versions. There are notable exceptions with experimental/unsafe features, and the introduction of the module system in Java 9. The Scala compiler does usually need updates to run properly on newer versions of the JVM, so make sure to use the appropriate JVM when compiling your code.

We try to provide experimental support for running the Scala compiler on LTS versions of Java ("Long Term Support"; see http://www.oracle.com/technetwork/java/eol-135779.html), and to the extent possible will include the current LTS Java version in our CI matrix and the community build. We will not, a priori, consider non-LTS Java versions. Compiler bugs related to Java versions other than the supported one (Java 8), will be scheduled with lower priority, and will not be considered release blockers. Lightbend does offer commercial support for faster resolution of issues like this.

Scala code compiled on Java 8 should run without problems in later JVMs, and we will give higher priority to bugs that break this property. For example, in the 2.13.x series we intend to provide support for JPMS module access checks, to allow ensuring your code won't incur `LinkageErrors` due to module access violations.

## Dropping old JVMs

Some Scala releases increase the *required* JVM versions for a Scala release. To leverage new features offered by a JVM release, we must sometimes drop support for older JVMs.

For example, Scala 2.12 raised the minimum JVM, for both compiling and running, from version from 6 to 8. This was done so we could take advantage of new features in 8 such as lambdas and default methods.

Like the 2.12.x series, the Scala 2.13.x series will support Java 8 and higher. (We may bump this to Java 11, but this is unlikely to happen in the 2.x series.)

## ¹JDK 9 & up compatibility notes

As of Scala 2.12.6 and 2.11.12, **JDK 9+ support is incomplete**. Notably, `scalac` will not enforce the restrictions of the Java Platform Module System, which means that code that typechecks may incur linkage errors at runtime. Scala 2.13.x will provide [rudimentary support](https://github.com/scala/scala/pull/7218) for this, but likely only in nightlies built on Java 11.

JDK 9+ support requires minimum sbt version 1.1.0, or 0.13.17 in the 0.13.x series.

For more information on JDK 9+ compatibility, watch the ["Support JDK 9"](https://github.com/scala/scala-dev/issues/139 "scala/scala-dev #139") issue on GitHub. To help with testing Java 11, the next LTS version, see [scala/scala-dev#559](https://github.com/scala/scala-dev/issues/559).
