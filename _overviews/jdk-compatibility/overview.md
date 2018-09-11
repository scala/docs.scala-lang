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
| 9, 10       | 2.12.4[¹](#jdk-9--10-compatibility-notes), 2.11.12[¹](#jdk-9--10-compatibility-notes), 2.10.7 |
| 8           | 2.12.0, 2.11.0, 2.10.2                                                                        |
| 7           | 2.11.0, 2.10.0                                                                                |
| 6           | 2.11.0, 2.10.0                                                                                |



## Running versus compiling

For most users, we still recommend using Java 8 for *compiling* (and running) Scala code. Since the JVM is backward compatible, it is usually safe to use a newer JVM to *run* your code compiled by the Scala compiler for older JVM versions. There are notable exceptions with experimental/unsafe features, and the introduction of the module system in Java 9. The Scala compiler does usually need updates to run properly on newer versions of the JVM, so make sure to use the appropriate JVM when compiling your code.

Issues with using the Scala compiler on *non-LTS* ("Long Term Support"; see http://www.oracle.com/technetwork/java/eol-135779.html) versions of Java will not necessarily be considered blockers for releases, but we will do our best to run CI on more versions of Java to catch bugs early, and to fix them as quickly as reasonably possible. If regressions do occur with non-LTS (or, generally, unsupported) versions of Java, we may bring the next minor release deadline a bit closer, so that these issues are generally resolved within a month or two. Lightbend does offer commercial support for faster resolution of issues like this.

## Dropping old JVMs

Some Scala releases increase the *required* JVM versions for a Scala release. To leverage new features offered by a JVM release, we must sometimes drop support for older JVMs.

For example, Scala 2.12 raised the minimum JVM, for both compiling and running, from version from 6 to 8. This was done so we could take advantage of new features in 8 such as lambdas and default methods.

Like the 2.12.x series, the Scala 2.13.x series will support Java 8 and higher.  (Eventually Java 11 or higher will become required, but the earliest this might happen is Scala 2.14.)

## ¹JDK 9 & 10 compatibility notes

As of Scala 2.12.6 and 2.11.12, **JDK 9 & 10 support is incomplete**. Notably, `scalac` will not enforce the restrictions of the Java Platform Module System, which means that code that typechecks may incur linkage errors at runtime.

JDK 9 & 10 support requires minimum sbt version 1.1.0, or 0.13.17 in the 0.13.x series.

For more information on JDK 9 & 10 compatibility, watch the ["Support JDK 9"](https://github.com/scala/scala-dev/issues/139 "scala/scala-dev #139") issue on GitHub.
