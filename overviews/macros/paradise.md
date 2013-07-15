---
layout: overview-large
title: Macro Paradise

disqus: true

partof: macros
num: 2
outof: 7
languages: [ja]
---
<span class="label important" style="float: right;">MACRO PARADISE</span>

**Eugene Burmako**

## Macro paradise for 2.11.x

Macro paradise is an alias of the experimental `paradise/macros` branch in the official Scala repository, designed to facilitate rapid development of macros without compromising the stability of Scala. To learn more about this branch, check out [my talk](http://scalamacros.org/news/2012/12/18/macro-paradise.html).

We have set up a nightly build which publishes snapshot artifacts to Sonatype. Consult [https://github.com/scalamacros/sbt-example-paradise](https://github.com/scalamacros/sbt-example-paradise) for an end-to-end example of using our nightlies in SBT, but in a nutshell playing with macro paradise is as easy as adding these three lines to your build (granted you've already [set up SBT](/overviews/macros/overview.html#using_macros_with_maven_or_sbt) to use macros):

    scalaVersion := "2.11.0-SNAPSHOT"
    scalaOrganization := "org.scala-lang.macro-paradise"
    resolvers += Resolver.sonatypeRepo("snapshots")

Currently SBT has some problems with updating custom `scala-compiler.jar` to new snapshot versions. The symptoms are as follows. The first time
you compile a project that uses macro paradise, everything works fine. But in a few days when you do `sbt update`, SBT fetches new nightly
builds for `scala-library.jar` and `scala-reflect.jar`, but not for `scala-compiler.jar`. The solution is to use `sbt reboot full`, which
re-downloads SBT itself and the underlying scalac instance. We're investigating this unfortunate issue, but in the meanwhile you can join the discussion of this matter [at the mailing list](https://groups.google.com/forum/?fromgroups=#!topic/simple-build-tool/UalhhX4lKmw/discussion).

Scaladocs corresponding to paradise nightlies can be found at [our Jenkins server](https://scala-webapps.epfl.ch/jenkins/view/misc/job/macro-paradise-nightly-main/ws/dists/latest/doc/scala-devel-docs/api/index.html). For example, here's the new API for working with top-level definitions: [scala.reflect.macros.Synthetics](https://scala-webapps.epfl.ch/jenkins/view/misc/job/macro-paradise-nightly-main/ws/dists/latest/doc/scala-devel-docs/api/index.html#scala.reflect.macros.Synthetics).

## Macro paradise for 2.10.x

There is also a special build of macro paradise that targets Scala 2.10.x <span class="label success">NEW</span>. With macro paradise 2.10, you can already make use of **quasiquotes in production versions of 2.10.x**: compile your macros using the `2.10.3-SNAPSHOT` build of macro paradise, and then these macros will be perfectly usable with a vanilla 2.10.x compiler. It works in such a neat way, because quasiquotes themselves are macros, so after being expanded they leave no traces of dependencies on macro paradise (well, almost). Check out [https://github.com/scalamacros/sbt-example-paradise210](https://github.com/scalamacros/sbt-example-paradise210) for an end-to-end example and a detailed explanation of this cool trick.

Please note that due to binary compatibility restrictions, macro paradise for 2.10.x doesn't include any features from macro paradise 2.11.x except for quasiquotes. According to our compatibility policy, we cannot update the public API with new methods in any of the minor releases of the 2.10.x series, and essentially everything in the full-fledged paradise requires new APIs. Therefore the only difference between scalac 2.10.2 and macro paradise 2.10.x is the addition of quasiquotes.