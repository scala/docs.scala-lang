---
layout: page
title: Scala hacker guide
---

**Eugene Burmako**

This guide is intended to help you get from an idea of fixing a bug or implementing a new feature
to a nightly and, ultimately, to a production release of Scala incorporating your idea. Being able to
influence a programming language of your choice is amazing, and I'm excited to demonstrate that it's easier
than one might think.

I like string interpolation a lot. Doing debug prints with interpolators introduced in Scala 2.10.0
is so enjoyable that I often wonder how we ever lived without that feature. However there's an annoying issue
which I occasionally stumble upon: the formatting string interpolator `f` [does not support](https://issues.scala-lang.org/browse/SI-6725)
new line tokens `%n`. I could go the mailing list, ask to fix this bug and then indefinitely
wait for the fix. Or I could instead patch Scala myself and get the fix in a subsequent release (nightly builds get produced, well, every
night, minor releases are pumped every few months and major releases happen once a year). Let's get to work!

### 1. Connect ###

Sometimes it's appealing to hack alone and not to have to interact with humans, but in the context of such a big project like Scala
this might not be the very best idea. Our community has people who spent years accumulating knowledge about Scala. They might provide
unique insights and, what's even better, direct assistance in their areas.

Typically bug fixes and especially new features beging with posting to one of [our mailing lists](TODO) to find out how people feel
about things you want to implement. People proficient is certain areas of Scala usually monitor mailing lists, so you'll often get some help
by simply posting a message. But the most efficient way to connect is to cc your message to one of the go-to persons in your area. Here's the
list of people (Github usernames and real-life names) and their specialties:

    library: @phaller (Philipp Haller), @axel22 (Aleksandar Prokopec -- concurrent & collection)
    specialisation: @axel22 (Aleksander Prokopec), @vladureche (Vlad Ureche), @dragos (Iulian Dragos)
    named / default args, annotations, plugins: @lrytz (Lukas Rytz)
    macros, reflection, manifests, type tags: @xeno-by (Eugene Burmako), @cvogt (Christopher Vogt)
    type checker, inference: @odersky (Martin Odersky), @adriaanm (Adriaan Moors)
    language specification, string interpolation, value classes: @odersky (Martin Odersky)
    new pattern matcher, implicit search: @adriaanm (Adriaan Moors)
    partest, Continuations Plugin: @phaller (Philipp Haller)
    error handling, lazy vals: @hubertp (Hubert Plociniczak)
    backend: @magarciaEPFL (Miguel Garcia), @gkossakowski (Grzegorz Kossakowski), @dragos (Iulian Dragos)
    repl, compiler performance: @paulp (Paul Phillips)
    swing: @ingoem (Ingo Maier)
    scaladoc: @vladureche (Vlad Ureche)
    optimizer: @vladureche (Vlad Ureche), @magarciaEPFL (Miguel Garcia)
    build: @jsuereth (Josh Suereth)
    random compiler bugs: @lrytz, @adriaanm, @hubertp
    documentation: @heathermiller (Heather Miller)
    cps: @TiarkRompf (Tiark Rompf)

Martin is the one who submitted the string interpolation proposal and implemented this language features for Scala 2.10.0.
(TODO: how to choose a mailing list)
Therefore now I'm going to [the scala-user mailing list](http://groups.google.com/group/scala-user) and will post a topic
about my issue. Note that I put Martin in the cc list of the email. If I didn't do that, he would probably miss it in a bunch
of emails, which get posted to scala-user every day.

![Posting to scala-user](/contribute/01-post.png)

![Response from Martin](/contribute/02-post.png)

Now when I have an approval of the feature's author, it makes sense to start doing something.

### 2. Set up ###

Hacking Scala begins with creating a branch for your work item. In our workflow we use [Git](http://git-scm.com/)
and [GitHub](http://github.com/). This section of the guide provides a short walkthrough on how to use them.
If you are new to Git, it might make sense to familiarize with it first. We recommend the [Git Pro](http://git-scm.com/book/en/)
online book.

### Fork ###

Log into [GitHub](http://github.com/), go to [https://github.com/scala/scala](https://github.com/scala/scala) and click the `Fork`
button at the top of the page. This will create your own copy of our repository that will serve as a scratchpad for your experiments.
If you're new to Git, don't be afraid of messing it up - there is no way you can corrupt our repository.

![Fork scala/scala](/contribute/03-fork.png)

### Clone ###

If everything went okay, you will be redirected to your own fork at `https://github.com/username/scala`, where `username`
is your github user name. You might find it helpful to read [http://help.github.com/fork-a-repo/](http://help.github.com/fork-a-repo/),
which covers some of the things that will follow below. Then clone your repository by running something like the following on the command line:

    16:35 ~/Projects$ git clone https://github.com/xeno-by/scala
    Cloning into 'scala'...
    remote: Counting objects: 258564, done.
    remote: Compressing objects: 100% (58239/58239), done.
    remote: Total 258564 (delta 182155), reused 254094 (delta 178356)
    Receiving objects: 100% (258564/258564), 46.91 MiB | 700 KiB/s, done.
    Resolving deltas: 100% (182155/182155), done.

This will create a local directory called `scala`, which contains a clone of your own copy of our repository. The changes that you make
in this directory can be propagated back to your copy and, ultimately, pushed into Scala.

### Branch ###

Before you start making changes, always create your own branch. Never work on the `master` branch. Think of a name that describes
the changes you plan on doing. Use a prefix that describes the nature of your change. There are essentially two kinds of changes:
bug fixes and new features.

* For bug fixes, use `issue/NNNN` for bug NNNN from the [Scala issue tracker](https://issues.scala-lang.org/).
* For new feature use `topic/XXX` for feature XXX. Use feature names that make sense in the context of the whole Scala project and not just to you personally. For example, if you work on diagrams in Scaladoc, use `topic/scaladoc-diagrams` instead of just `topic/diagrams`.

Since I'm going to fix an existing bug [SI-6725](https://issues.scala-lang.org/browse/SI-6725), I'll create a branch named `ticket/6725`.

    16:39 ~/Projects/scala (master)$ git checkout -b ticket/6725
    Switched to a new branch 'ticket/6725'

If you are new to Git and branching, read the [Branching Chapter](http://git-scm.com/book/en/Git-Branching) in the Git Pro book.

### Build ###

The next step after cloning your fork is setting up your machine to build Scala. The definitive guide on building Scala is located at
[https://github.com/scala/scala/blob/master/README.rst](https://github.com/scala/scala/blob/master/README.rst), but here's the summary:

* It is recommended to use Java `1.6` (not `1.7` or `1.8`, because they might cause occasional glitches).
* The build tool we use is `ant`.
* The build script runs the `pull-binary-libs.sh` script to download bootstrap libs. This requires `bash` and `curl`.
* The majority of our team works on Linux and OS X.
* Windows is supported, but it might have issues. Please report to [the issue tracker](https://issues.scala-lang.org/) if you encounter them.

In a nutshell, build Scala is as easy as running `ant` in the root of your clone. Be prepared to wait for a while - a full rebuild
takes 7+ minutes depending on your machine. Incremental builds are usually within 30-90 seconds range (again, your mileage might vary
with your hardware).

    16:50 ~/Projects/scala (ticket/6725)$ ant
    Buildfile: /Users/xeno_by/Projects/scala/build.xml

    strap.clean:

    pack.clean:

    init.jars.check:

    init.jars:
         [echo] Updating bootstrap libs.  (To do this by hand, run ./pull-binary-libs.sh)
         [exec] Resolving [943cd5c8802b2a3a64a010efb86ec19bac142e40/lib/ant/ant-contrib.jar]

    ...
    ...
    ...

    pack.bin:
        [mkdir] Created dir: /Users/xeno_by/Projects/scala/build/pack/bin

    pack.done:

    build:

    BUILD SUCCESSFUL
    Total time: 9 minutes 41 seconds

### IDE ###

There's no single editor of choice to work with Scala sources, as there are trade-offs imposed by each available option.

Both Eclipse and Intellij IDEA have Scala plugins, which are known to work with our codebase. Here are
[instructions for Eclipse](https://github.com/scala/scala/blob/master/src/eclipse/README.md) and
[instructions for Intellij](https://github.com/scala/scala/blob/master/src/intellij/README). Both of those Scala plugins provide
navigation, refactoring and error reporting functionality as well as integrated debugging. Unfortunately this comes at a cost
of occasional sluggishness.

On the other hand, lightweight editors such as Emacs, Sublime or jEdit provide unparalleled scriptability and performance, while
lacking semantic services and debugging. To address this shortcoming, one can integrate with ENSIME,
a helper program, which hosts a resident Scala compiler providing some of the features implemented in traditional IDEs. However despite
having significantly matured over the last year, its support for our particular codebase is still far from being great.

We know of both novices and experienced Scala hackers who've been effective with using both IDEs and lightweight editors.
Therefore it's hard to recommend a particular tool here, and your choice should boil down to your personal preferences.

### 3. Hack ###

When hacking on your topic of choice, you'll be modifying Scala, compiling it and testing it on relevant input files.
Typically you would want to first make sure that your changes work on a few small example and afterwards verify that nothing break
by running the comprehensive test suite.

I'm going to start by creating a `sandbox` directory (this particular name doesn't bear any special meaning - it's just a tribute to
my first days in Scala team), which will hold a single test file and its compilation results. First I make sure that the bug is indeed
reproducible by throwing together a simple test and feeding it into the Scala distribution assembled by ant in `build/pack/bin`.

    17:25 ~/Projects/scala (ticket/6725)$ mkdir sandbox
    17:26 ~/Projects/scala (ticket/6725)$ cd sandbox
    17:26 ~/Projects/scala/sandbox (ticket/6725)$ edit Test.scala
    17:26 ~/Projects/scala/sandbox (ticket/6725)$ cat Test.scala
    object Test extends App {
      val a = 1
      val s = f"$a%s%n$a%s"
      println(s)
    }
    17:27 ~/Projects/scala/sandbox (ticket/6725)$ ../build/pack/bin/scalac Test.scala
    17:28 ~/Projects/scala/sandbox (ticket/6725)$ ../build/pack/bin/scala Test

### Implement ###

There's not much to be said about this step, which is bread & butter software development.

Here are also some tips & tricks that have proven useful in Scala development:

* If after introducing changes or updating your clone, you're getting `AbstractMethodError` or other linkage exceptions,
  try doing `ant clean build`. Due to the way how Scala compiles traits, if a trait changes, then it's sometimes not enough to recompile
  just that trait, but it might also be necessary to recompile its users. Ant is not smart enough to do that, which might lead to
  very strange errors. Full rebuilds fix the problem. Fortunately that's rarely necessary, because full rebuilds take significant time.
* Even on solid state drives packaging Scala distribution (i.e. creating jars from class files) is a non-trivial task. There are quite a few
  people in our team, who do `ant quick.comp` instead of `ant` and then create custom scripts to launch Scala from `build/quick/classes`.
* Don't underestimate the power of `print`. When starting with Scala, I spent a lot of time in the debugger trying to figure out how
  things work. However later I found out that print-based debugging is often more effective than jumping around. While it might be obvious
  to some, I'd like to explicitly mention that it's useful to print stack traces to understand the flow of execution.

Docs. Right, the docs. The documentation about internal workings of the compiler is scarce, and a lot of knowledge gets passed
exclusively as a folklore. However the situation is steadily improving. Here are the resources that might help:

* [Compiler internals videos by Martin Odersky](TODO) are quite dated, but still very useful. In this three-video
  series Martin explains inner working of the part of the compiler, which has recently become Scala reflection API.
* [Reflection and Compilers by Martin Odersky](http://channel9.msdn.com/Events/Lang-NEXT/Lang-NEXT-2012/Reflection-and-Compilers), a talk
  at Lang.NEXT 2012 in which Martin elaborates on the design of scalac and the reflection API.
* [Reflection documentation](http://docs.scala-lang.org/overviews/reflection/overview.html) describes fundamental data structures that
  are used to represent Scala programs and operations defined on then.
* [Scala compiler corner](http://lampwww.epfl.ch/~magarcia/ScalaCompilerCornerReloaded/) contains extensive documentation about
  most of the post-typer phases in the Scala compiler.
* [scala-internals](http://groups.google.com/group/scala-internals), a mailing list which hosts discussions about the core
  internal design and implementation of the Scala system.

### Verify ###

