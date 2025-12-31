---
layout: sip
number: 51
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
stage: completed
status: shipped
title: Drop Forwards Binary Compatibility of the Scala 2.13 Standard Library
---

**By: Lukas Rytz**


## History

| Date           | Version            |
|----------------|--------------------|
| Dec 8, 2022    | Initial Version    |


## Summary

I propose to drop the forwards binary compatibility requirement that build tools enforce on the Scala 2.13 standard library.
This will allow implementing performance optimizations of collection operations that are currently not possible.
It also unblocks adding new classes and new members to existing classes in the standard library.


## Backwards and Forwards Compatibility

A library is backwards binary compatible if code compiled against an old version works with a newer version on the classpath.
Forwards binary compatibility requires the opposite: code compiled against a new version of a library needs to work with an older version on the classpath.
A more in-depth explanation of binary compatibility is available on the [Scala documentation site](https://docs.scala-lang.org/overviews/core/binary-compatibility-of-scala-releases.html).

Scala build tools like sbt automatically update dependencies on the classpath to the latest patch version that any other dependency on the classpath requires.
For example, with the following definition

~~~ scala
libraryDependencies ++= List(
  "com.softwaremill.sttp.client3" %% "core" % "3.8.3", // depends on ws 1.3.10
  "com.softwaremill.sttp.shared"  %% "ws"   % "1.2.7", // for demonstration
)
~~~

sbt updates the `ws` library to version 1.3.10.
Running the `evicted` command in sbt displays all dependencies whose version were changed.

This build tool feature allows library authors to only maintain backwards binary compatibility in new versions, they don't need to maintain forwards binary compatibility.
Backwards binary compatible changes include the addition of new methods in existing classes and the addition of new classes.
Such additions don't impact existing code that was compiled against an older version, all definitions that were previously present are still there.

### The Standard Library

The Scala standard library is treated specially by sbt and other build tools, its version is always pinned to the `scalaVersion` of the build definition and never updated automatically.

For example, the `"com.softwaremill.sttp.client3" %% "core" % "3.8.3"` library has a dependency on `"org.scala-lang" % "scala-library" % "2.13.10"` in its POM file.
When a project uses this version of the sttp client in a project with `scalaVersion` 2.13.8, sbt will put the Scala library version 2.13.8 on the classpath.

This means that the standard library is required to remain both backwards and forwards binary compatible.
The implementation of sttp client 3.8.3 can use any feature available in Scala 2.13.10, and that compiled code needs to work correctly with the Scala 2.13.8 standard library.

The suggested change of this SIP is to drop this special handling of the Scala standard library and therefore lift the forwards binary compatibility requirement.


## Motivation

### Adding Overrides for Performance

The forwards binary compatibility constraint regularly prevents adding optimized overrides to collection classes.
The reason is that the bytecode signature of an overriding method is not necessarily identical to the signature of the overridden method.
Example:

~~~ scala
class A { def f: Object = "" }
class B extends A { override def f: String = "" }
~~~

The bytecode signature of `B.f` has return type `String`.
(In order to implement dynamic dispatch at run time (overriding), the compiler generates a "bridge" method `B.f` with return type `Object` which forwards to the other `B.f` method.)
Adding such an override is not forwards binary compatible, because code compiled against `B` can link to the `B.f` method with return type `String`, which would not exist in the previous version.

It's common that forwards binary compatibility prevents adding optimizing overrides, most recently in [LinkedHashMap](https://github.com/scala/scala/pull/10235#issuecomment-1336781619).

Sometimes, if an optimization is considered important, a type test is added to the existing implementation to achieve the same effect.
These workarounds could be cleaned up.
Examples are [`mutable.Map.mapValuesInPlace`](https://github.com/scala/scala/blob/v2.13.10/src/library/scala/collection/mutable/Map.scala#L201-L204), [`IterableOnce.foldLeft`](https://github.com/scala/scala/blob/v2.13.10/src/library/scala/collection/IterableOnce.scala#L669-L670), [`Set.concat`](https://github.com/scala/scala/blob/v2.13.10/src/library/scala/collection/Set.scala#L226-L227), and many more.

### Adding Functionality

Dropping forwards binary compatiblity allows adding new methods to existing classes, as well as adding new classes.
While this opens a big door in principle, I am certain that stability, consistency and caution will remain core considerations when discussing additions to the standard library.
However, I believe that allowing to (carefully) evolve the standard library is greatly beneficial for the Scala community.

Examples that came up in the past
  - various proposals for new operations are here: https://github.com/scala/scala-library-next/issues and https://github.com/scala/scala-library-next/pulls
  - addition of `ExecutionContext.opportunistic` in 2.13.4, which could not be made public: https://github.com/scala/scala/pull/9270
  - adding `ByteString`: https://contributors.scala-lang.org/t/adding-akkas-bytestring-as-a-scala-module-and-or-stdlib/5967
  - new string interpolators: https://github.com/scala/scala/pull/8654

## Alternatives and Related Work

For binary compatible overrides, it was considered to add an annotation that would enforce the existing signature in bytecode.
However, this approach turned out to be too complex in the context of further overrides and Java compatibility.
Details are in the [corresponding pull request](https://github.com/scala/scala/pull/9141).

Extensions to the standard library can be implemented in a separate library, and such a library exists since 2020 as [scala-library-next](https://github.com/scala/scala-library-next).
This library has seen very little adoption so far, and I personally don't think this is likely going (or possible) to change.
One serious drawback of an external library is that operations on existing classes can only be added as extension methods, which makes them less discoverable and requires adding an import.
This drawback could potentially be mitigated with improvements in Scala IDEs.

An alternative to `scala-library-next` would be to use the Scala 3 library (`"org.scala-lang" % "scala3-library_3"`) which is published with Scala 3 releases.
This library is handled by build tools like any other library and therefore open for backwards binary compatible additions.
Until now, the Scala 3 library is exclusively used as a "runtime" library for Scala 3, i.e., it contanis definitions that are required for running code compiled with Scala 3.
Additions to the Scala 3 library would not be available to the still very large userbase of Scala 2.13.
Like for `scala-library-next`, additions to existing classes can again only be done in the form of extension methods.
Also, I believe that there is great value in keeping the Scala 2.13 and 3 standard libraries aligned for now.


## Implications

### Possible Linkage Errors

The policy change can only be implemented in new build tool releases, which makes it possible that projects run into linkage errors at run time.
Concretely, a project might update one of its dependencies to a new version which requires a more recent Scala library than the one defined in the project's `scalaVersion`.
If the project continues using an old version of sbt, the build tool will keep the Scala library pinned.
The new library might reference definitions that don't exist in the older Scala library, leading to linkage errors.

### Scala.js and Scala Native

Scala.js distributes a JavaScript version of the Scala library.
This artifact is currently released once per Scala.js version.
When a new Scala version comes out, a new Scala.js compiler is released, but the Scala library artifact continues to be used until the next Scala.js version.
This scheme does not work if the new Scala version has new definitions, so it needs to be adjusted.
Finding a solution for this problem is necessary and part of the implementation phase.

A similar situation might exist for Scala Native.

### Compiler and Library Version Mismatch

Defining the `scalaVersion` in a project would no longer pin the standard library to that exact version.
The Scala compiler on the other hand would be kept at the specified version.
This means that Scala compilers will need to be able to run with a newer version of the Scala library, e.g., the Scala compiler 2.13.10 needs to be able to run with a 2.13.11 standard library on the compilation classpath.
I think this will not cause any issues.

Note that there are two classpaths at play here: the runtime classpath of the JVM that is running the Scala compiler, and the compilation classpath in which the compiler looks up symbols that are referenced in the source code being compiled.
The Scala library on the JVM classpath could remain in sync with the compiler version.
The Scala library on the compilation classpath would be updated by the build tool according to the dependency graph.

### Newer than Expected Library

Because the build tool can update the Scala library version, a project might accidentally use / link to new API that does not yet exist in the `scalaVersion` that is defined in the build definition.
This is safe, as the project's POM file will have a dependency on the newer version of the Scala library.
The same situation can appear with any other dependency of a project.

### Applications with Plugin Systems

In applications where plugins are dynamically loaded, plugins compiled with a new Scala library could fail to work correctly if the application is running with an older Scala library.

This is however not a new issue, the proposed change would just extend the existing problem to the Scala library.

## Limitations

Adding new methods or fields to existing traits remains a binary incompatible change.
This is unrelated to the Standard library, the same is true for other libraries.
[MiMa](https://github.com/lightbend/mima) is a tool for ensuring changes are binary compatible.


## Build Tools

### Mill

In my testing, Mill has the same behavior as sbt, the Scala library version is pinned to the project's `scalaVersion`.

<details>

~~~
$> cat build.sc
import mill._, scalalib._
object proj extends ScalaModule {
  def scalaVersion = "2.13.8"
  def ivyDeps = Agg(
    ivy"com.softwaremill.sttp.client3::core:3.8.3",
    ivy"com.softwaremill.sttp.shared::ws:1.2.7",
  )
}
$> mill show proj.runClasspath
[1/1] show > [37/37] proj.runClasspath
[
  "qref:868554b6:/Users/luc/Library/Caches/Coursier/v1/https/repo1.maven.org/maven2/com/softwaremill/sttp/client3/core_2.13/3.8.3/core_2.13-3.8.3.jar",
  "qref:f3ba6af6:/Users/luc/Library/Caches/Coursier/v1/https/repo1.maven.org/maven2/com/softwaremill/sttp/shared/ws_2.13/1.3.10/ws_2.13-1.3.10.jar",
  "qref:438104da:/Users/luc/Library/Caches/Coursier/v1/https/repo1.maven.org/maven2/org/scala-lang/scala-library/2.13.8/scala-library-2.13.8.jar",
  "qref:0c9ef1ab:/Users/luc/Library/Caches/Coursier/v1/https/repo1.maven.org/maven2/com/softwaremill/sttp/model/core_2.13/1.5.2/core_2.13-1.5.2.jar",
  "qref:9b3d3f7d:/Users/luc/Library/Caches/Coursier/v1/https/repo1.maven.org/maven2/com/softwaremill/sttp/shared/core_2.13/1.3.10/core_2.13-1.3.10.jar"
]
~~~

</details>

### Gradle

Gradle handles the Scala library the same as other dependencies, so it already implements the behavior proposed by this SIP.

<details>

~~~
$> cat build.gradle
plugins {
    id 'scala'
}
repositories {
    mavenCentral()
}
dependencies {
    implementation 'org.scala-lang:scala-library:2.13.8'
    implementation 'com.softwaremill.sttp.client3:core_2.13:3.8.3'
    implementation 'com.softwaremill.sttp.shared:ws_2.13:1.2.7'
}
$> gradle dependencies --configuration runtimeClasspath

> Task :dependencies

------------------------------------------------------------
Root project 'proj'
------------------------------------------------------------

runtimeClasspath - Runtime classpath of source set 'main'.
+--- org.scala-lang:scala-library:2.13.8 -> 2.13.10
+--- com.softwaremill.sttp.client3:core_2.13:3.8.3
|    +--- org.scala-lang:scala-library:2.13.10
|    +--- com.softwaremill.sttp.model:core_2.13:1.5.2
|    |    \--- org.scala-lang:scala-library:2.13.8 -> 2.13.10
|    +--- com.softwaremill.sttp.shared:core_2.13:1.3.10
|    |    \--- org.scala-lang:scala-library:2.13.9 -> 2.13.10
|    \--- com.softwaremill.sttp.shared:ws_2.13:1.3.10
|         +--- org.scala-lang:scala-library:2.13.9 -> 2.13.10
|         +--- com.softwaremill.sttp.shared:core_2.13:1.3.10 (*)
|         \--- com.softwaremill.sttp.model:core_2.13:1.5.2 (*)
\--- com.softwaremill.sttp.shared:ws_2.13:1.2.7 -> 1.3.10 (*)

(*) - dependencies omitted (listed previously)
~~~

</details>

### Maven

Maven [does not update](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html) versions of dependencies that are explicitly listed in the `pom.xml` file, so it's possible to run into linkage errors at run time already now.
The maven versions plugin can display and update dependencies to newer versions.

<details>

~~~
$> cat pom.xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
   <modelVersion>4.0.0</modelVersion>
   <groupId>a.b</groupId>
   <artifactId>proj</artifactId>
   <version>1.0.0-SNAPSHOT</version>
   <properties>
      <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
      <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
      <java.version>1.8</java.version>
      <scala.version>2.13.8</scala.version>
   </properties>
   <dependencies>
      <dependency>
         <groupId>org.scala-lang</groupId>
         <artifactId>scala-library</artifactId>
         <version>${scala.version}</version>
      </dependency>
      <dependency>
         <groupId>com.softwaremill.sttp.client3</groupId>
         <artifactId>core_2.13</artifactId>
         <version>3.8.3</version>
      </dependency>
      <dependency>
         <groupId>com.softwaremill.sttp.shared</groupId>
         <artifactId>ws_2.13</artifactId>
         <version>1.2.7</version>
      </dependency>
   </dependencies>
   <build>
      <plugins>
         <plugin>
            <groupId>net.alchim31.maven</groupId>
            <artifactId>scala-maven-plugin</artifactId>
            <version>4.8.0</version>
         </plugin>
      </plugins>
   </build>
</project>
$> mvn dependency:build-classpath
[INFO] --- maven-dependency-plugin:2.8:build-classpath (default-cli) @ proj ---
[INFO] Dependencies classpath:
/Users/luc/.m2/repository/org/scala-lang/scala-library/2.13.8/scala-library-2.13.8.jar:/Users/luc/.m2/repository/com/softwaremill/sttp/client3/core_2.13/3.8.3/core_2.13-3.8.3.jar:/Users/luc/.m2/repository/com/softwaremill/sttp/model/core_2.13/1.5.2/core_2.13-1.5.2.jar:/Users/luc/.m2/repository/com/softwaremill/sttp/shared/core_2.13/1.3.10/core_2.13-1.3.10.jar:/Users/luc/.m2/repository/com/softwaremill/sttp/shared/ws_2.13/1.2.7/ws_2.13-1.2.7.jar
$> mvn versions:display-dependency-updates
[INFO] --- versions-maven-plugin:2.13.0:display-dependency-updates (default-cli) @ proj ---
[INFO] The following dependencies in Dependencies have newer versions:
[INFO]   com.softwaremill.sttp.client3:core_2.13 ............... 3.8.3 -> 3.8.5
[INFO]   com.softwaremill.sttp.shared:ws_2.13 ................. 1.2.7 -> 1.3.12
[INFO]   org.scala-lang:scala-library ....................... 2.13.8 -> 2.13.10
~~~

</details>

### Bazel

I have never used bazel and did not manage set up / find a sample build definition to test its behavior.
Help from someone knowing bazel would be appreciated.

### Pants

As with bazel, I did not yet manage to set up / find an example project.

### Other Tools

The SIP might also require changes in other tools such as scala-cli, coursier or bloop.
