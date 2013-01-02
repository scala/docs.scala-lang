---
layout: overview-large
title: Macro Paradise

disqus: true

partof: macros
num: 2
outof: 4
---
<span class="label important" style="float: right;">MACRO PARADISE</span>

**Eugene Burmako**

Macro paradise is an alias of the experimental `paradise/macros` branch in the official Scala repository, designed to facilitate rapid development of macros without compromising the stability of Scala. To learn more about this branch, check out [my talk](http://scalamacros.org/news/2012/12/18/macro-paradise.html).

We have set up a nightly build which publishes snapshot artifacts to Sonatype. Consult [https://github.com/scalamacros/sbt-example-paradise](https://github.com/scalamacros/sbt-example-paradise) for an end-to-end example of using our nightlies in SBT, but in a nutshell playing with macro paradise is as easy as adding these three lines to your build:

    scalaVersion := "2.11.0-SNAPSHOT"
    scalaOrganization := "org.scala-lang.macro-paradise"
    resolvers += Resolver.sonatypeRepo("snapshots")

Currently SBT has some problems with updating custom `scala-compiler.jar` to new snapshot versions. The symptoms are as follows. The first time
you compile a project that uses macro paradise, everything works fine. But in a few days when you do `sbt update`, SBT fetches new nightly
builds for `scala-library.jar` and `scala-reflect.jar`, but not for `scala-compiler.jar`. We're investigating this unfortunate issue, but
in the meanwhile you can join the discussion and check out a workaround [at the mailing list](https://groups.google.com/forum/?fromgroups=#!topic/simple-build-tool/UalhhX4lKmw/discussion).

Scaladocs corresponding to paradise nightlies can be found at [our Jenkins server](https://scala-webapps.epfl.ch/jenkins/view/misc/job/macro-paradise-nightly-main/ws/dists/latest/doc/scala-devel-docs/api/index.html). For example, here's the new API for working with top-level definitions: [scala.reflect.macros.Synthetics](https://scala-webapps.epfl.ch/jenkins/view/misc/job/macro-paradise-nightly-main/ws/dists/latest/doc/scala-devel-docs/api/index.html#scala.reflect.macros.Synthetics).