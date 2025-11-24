---
layout: singlepage-overview
title: Binary Compatibility of Scala Releases

partof: binary-compatibility

permalink: /overviews/core/:title.html
---

When two versions of Scala are binary compatible, it is safe to compile your project on one Scala version and link against another Scala version at run time. Safe run-time linkage (only!) means that the JVM does not throw a (subclass of) [`LinkageError`](https://docs.oracle.com/javase/8/docs/api/java/lang/LinkageError.html) when executing your program in the mixed scenario, assuming that none arise when compiling and running on the same version of Scala. Concretely, this means you may have external dependencies on your run-time classpath that use a different version of Scala than the one you're compiling with, as long as they're binary compatible. In other words, separate compilation on different binary compatible versions does not introduce problems compared to compiling and running everything on the same version of Scala.

We check binary compatibility automatically with [MiMa](https://github.com/lightbend/mima). We strive to maintain a similar invariant for the `behavior` (as opposed to just linkage) of the standard library, but this is not checked mechanically (Scala is not a proof assistant so this is out of reach for its type system).

Note that for Scala.js and Scala Native, binary compatibility issues result in errors at build time, as opposed to run-time exceptions.
They happen during their respective "linking" phases: `{fast,full}LinkJS` for Scala.js and `nativeLink` for Scala Native.

#### Forward and Back
We distinguish forward and backward compatibility (think of these as properties of a sequence of versions, not of an individual version). Maintaining backward compatibility means code compiled on an older version will link with code compiled with newer ones. Forward compatibility allows you to compile on new versions and run on older ones.

Thus, backward compatibility precludes the removal of (non-private) methods, as older versions could call them, not knowing they would be removed, whereas forward compatibility disallows adding new (non-private) methods, because newer programs may come to depend on them, which would prevent them from running on older versions (private methods are exempted here as well, as their definition and call sites must be in the same source file).

#### Guarantees and Versioning
For Scala 2, the *minor* version is the *third* number in a version, e.g., 18 in v2.13.18.
The major version is the second number, which is 13 in our example.

Scala 2 up to 2.13.18 guarantees both backward and forward compatibility across *minor* releases within a single major release.
This is about to change now that [SIP-51 has been accepted](https://docs.scala-lang.org/sips/drop-stdlib-forwards-bin-compat.html), future Scala 2.13 releases may be backward compatible only.

For Scala 3, the minor version is the *second* number in a version, e.g., 2 in v3.2.1.
The third number is the *patch* version.
The major version is always 3.

Scala 3 guarantees both backward and forward compatibility across *patch* releases within a single minor release (enforcing forward binary compatibility is helpful to maintain source compatibility).
In particular, this applies within an entire [Long-Term-Support (LTS) series](https://www.scala-lang.org/blog/2022/08/17/long-term-compatibility-plans.html) such as Scala 3.3.x.

Scala 3 also guarantees *backward* compatibility across *minor* releases in the entire 3.x series, but not forward compatibility.
This means that libraries compiled with any Scala 3.x version can be used in projects compiled with any Scala 3.y version with y >= x.

In addition, Scala 3.x provides backward binary compatibility with respect to Scala 2.13.y.
Libraries compiled with Scala 2.13.y can be used in projects using Scala 3.x.
This policy does not apply to experimental Scala 2 features, which notably includes *macros*.

In general, none of those guarantees apply to *experimental* features and APIs.

#### Checking
For the Scala library artifacts (`scala-library`, `scala-reflect` and `scala3-library`), these guarantees are mechanically checked with [MiMa](https://github.com/lightbend/mima).

The *policies* above extend to libraries compiled by particular Scala compiler versions.
Every effort is made to preserve the binary compatibility of artifacts produced by the compiler.
*However*, that cannot be mechanically checked.
It is therefore possible, due to bugs or unforeseen consequences, that recompiling a library with a different compiler version affects its binary API.
We cannot *guarantee* that it will never happen.

We recommend that library authors use [MiMa](https://github.com/lightbend/mima) themselves to verify compatibility of minor versions before releasing.

#### TASTy and Pickle Compatibility
*Binary* compatibility is a concept relevant at link time of the target platform (JVM, Scala.js or Scala Native).
TASTy and Pickle compatibility are similar but apply at *compile* time for the Scala compiler.
TASTy applies to Scala 3, Pickle to Scala 2.

If a library was compiled with an older version of the compiler, we say that the library is backward TASTy/Pickle compatible if it can be used within an application compiled with a newer compiler version.
Likewise, forward TASTy/Pickle compatibility goes in the other direction.

The same policies as for binary compatibility apply to TASTy/Pickle compatibility, although they are not mechanically checked.

Library authors may automatically check TASTy/Pickle backward compatibility for their libraries using [TASTy-MiMa](https://github.com/scalacenter/tasty-mima).
Disclaimer: TASTy-MiMa is a young project.
At this point, you are likely going to run into bugs.
Please report issues you find to its issue tracker.

#### Concretely
We guarantee backward compatibility of the `"org.scala-lang" % "scala-library" % "2.N.x"` and `"org.scala-lang" % "scala-reflect" % "2.N.x"` artifacts, except for
- the `scala.reflect.internal` and `scala.reflect.io` packages, as scala-reflect is experimental, and
- the `scala.runtime` package, which contains classes used by generated code at runtime.

We also strongly discourage relying on the stability of `scala.concurrent.impl`, `scala.sys.process.*Impl`, and `scala.reflect.runtime`, though we will only break compatibility for severe bugs here.

We guarantee backward compatibility of the `"org.scala-lang" % "scala3-library_3" % "3.x.y"` artifact.
Forward compatibility is only guaranteed for `3.N.y` within a given `N`.

We enforce *backward* (but not forward) binary compatibility for *modules* (artifacts under the groupId `org.scala-lang.modules`). As they are opt-in, it's less of a burden to require having the latest version on the classpath. (Without forward compatibility, the latest version of the artifact must be on the run-time classpath to avoid linkage errors.)

#### Build Tools
Build tools like sbt and mill have assumptions about backward binary compatibility built in.
They build a graph of a project's dependencies and select the most recent versions that are needed.
To learn more, see the page on [library dependencies](https://www.scala-sbt.org/1.x/docs/Library-Dependencies.html) in the sbt documentation.
