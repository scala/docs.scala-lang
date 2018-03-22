---
layout: multipage-overview
title: Overview

discourse: true

partof: jdk-compatibility
overview-name: JDK Compatibility

num: 1
permalink: /overviews/jdk-compatibility/:title.html
---

Scala runs primarily on the Java Virtual Machine (JVM). As Scala and the JVM improve independently over time, Scala drops compatibility with older versions of the Java Developer Kit (JDK) in order to focus development efforts on supporting new JVM features that benefit Scala.

This table shows the first Scala release in each series that functions on each JVM release.

| JVM version | First Scala compiler release supported to run on this JVM |
|:-----------:|:-----------------------------------------------------|
| 9           | 2.12.4, 2.11.12, 2.10.7                              |
| 8           | 2.12.0, 2.11.0, 2.10.0                               |
| 7           | 2.11.0, 2.10.0                                       |
| 6           | 2.11.0, 2.10.0                                       |

### Running versus compiling and required / supported JVM
For most users, we recommend using Java 8 for *compiling* (and running) Scala code. Since the JVM is backward compatible, it is usually safe to use a newer JVM to *run* your code compiled by the Scala compiler for older JVM versions. There are notable exceptions with experimental/unsafe features, and the introduction of the module system in Java 9. The Scala compiler does usually need updates to run properly on newer versions of the JVM, so make sure to use the appropriate JVM when compiling your code.

Issues with using the Scala compiler on *non-LTS* versions of Java will not necessarily be considered blockers for releases, but we will do our best to run CI on more versions of Java to catch bugs early, and to fix them as quickly as reasonably possible. If regressions do occur with non-LTS (or, generally, unsupported) versions of Java, we may bring the next minor release deadline a bit closer, so that these issues are generally resolved within a month or two. Lightbend does offer commercial support for faster resolution of issues like this.

The next step is to bump the *required* JVM versions for a Scala release, as we did for Scala 2.12 (raising the minimum JVM for compiling and running from version from 6 to 8). To leverage new features offered by a JVM release, we generally must drop support for older JVMs.

### JDK 9 compatibility notes

As of Scala 2.12.5 and 2.11.12, **JDK 9 support is incomplete**. Notably, `scalac` will not enforce the restrictions of the Java Platform Module System, which means that code that typechecks may incur linkage errors at runtime.

JDK 9 support requires minimum sbt version 1.1.0, or 0.13.17 in the 0.13.x series.

For more information on JDK 9 compatibility, watch the ["Support JDK 9"](https://github.com/scala/scala-dev/issues/139 "scala/scala-dev #139") issue on GitHub.
