---
layout: page
title: Scala hacker guide
by: Eugene Burmako
---
<br>
This guide is intended to help you get from an idea of fixing a bug or implementing a new feature into a nightly Scala build, and, ultimately, to a production release of Scala incorporating your idea.

This guide covers the entire process, from the conception of your idea or bugfix to the point where it is merged into Scala. Throughout, we will use a running example of an idea or bugfix one might wish to contribute.

## The Running Example

Let's say that you particularly enjoy the new string interpolation language feature introduced in Scala 2.10.0, and you use it quite heavily.

Though, there's an annoying issue
which you occasionally stumble upon: the formatting string interpolator `f` [does not support](https://issues.scala-lang.org/browse/SI-6725)
new line tokens `%n`.

One approach would be to go the mailing list, request that the bug be fixed, and then to wait indefinitely for the fix arrive. Another approach would be to instead patch Scala oneself, and to submit the fix to the Scala repository in hopes that it might make it into a subsequent release.

**_Of note_**: There are several types of releases/builds. Nightly builds are produced every night at a fixed time. Minor releases happen once every few months. Major releases typically happen once per year.

## 1. Connect

Sometimes it's appealing to hack alone and not to have to interact with others out of fear, or out of comfort. However, in the context a big project such as Scala,
this might not be the very best idea. There are people in the Scala community who have spent years accumulating knowledge about Scala libraries and internals. They might provide
unique insights and, what's even better, direct assistance in their areas, so it is not only advantageous, but recommended to communicate with the community about your new patch.

Typically bug fixes and new features start out as an idea or an experiment posted on one of [our mailing lists]({{ site.baseurl }}/community/index.html#mailing_lists) to find out how people feel
about things you want to implement. People proficient in certain areas of Scala usually monitor mailing lists, so you'll often get some help
by simply posting a message. But the most efficient way to connect is to cc your message to one of the people responsible for maintaining the aspect of Scala which you wish to contribute to.

This is the list of language features/libraries along with their maintainer's full names and GitHub usernames:

{% include maintainers.html %}

Since Martin is the person who submitted the string interpolation Scala Improvement Proposal and implemented this language feature for Scala 2.10.0, he might be interested in learning of new bugfixes to that feature.

As alluded to earlier, one must also choose an appropriate mailing list. Typically, one would use the scala-internals mailing list, as it is devoted to discussions about the core internal design and implementation of the Scala system. However, since this issue has been discussed previously on the scala-user mailing list,
in this example, we post to the [the scala-user mailing list](http://groups.google.com/group/scala-user) about our issue.

<img src="{{ site.baseurl }}/resources/img/01-post.png" alt="Posting to scala-user" class="centerclear" />
<img src="{{ site.baseurl }}/resources/img/02-post.png" alt="Response from Martin" class="centerclear" />

Now that we have the approval of the feature's author, we can get to work!

## 2. Set up

Hacking Scala begins with creating a branch for your work item. To develop Scala we use [Git](http://git-scm.com/)
and [GitHub](http://github.com/). This section of the guide provides a short walkthrough, but if you are new to Git,
it probably makes sense to familiarize yourself with Git first. We recommend

* the [Git Pro](http://git-scm.com/book/en/) online book.
* the help page on [Forking a Git Repository](https://help.github.com/articles/fork-a-repo).
* this great training tool [LearnGitBranching](http://pcottle.github.io/learnGitBranching/). One hour hands-on training helps more than 1000 hours reading. 

### Fork

Log into [GitHub](http://github.com/), go to [https://github.com/scala/scala](https://github.com/scala/scala) and click the `Fork`
button in the top right corner of the page. This will create your own copy of our repository that will serve as a scratchpad for your work.

If you're new to Git, don't be afraid of messing up-- there is no way you can corrupt our repository.

<img src="{{ site.baseurl }}/resources/img/03-fork.png" alt="Fork scala/scala" class="centerclear" />

### Clone

If everything went okay, you will be redirected to your own fork at `https://github.com/username/scala`, where `username`
is your github user name. You might find it helpful to read [http://help.github.com/fork-a-repo/](http://help.github.com/fork-a-repo/),
which covers some of the things that will follow below. Then, _clone_ your repository (i.e. pull a copy from GitHub to your local machine) by running the following on the command line:

    16:35 ~/Projects$ git clone https://github.com/xeno-by/scala
    Cloning into 'scala'...
    remote: Counting objects: 258564, done.
    remote: Compressing objects: 100% (58239/58239), done.
    remote: Total 258564 (delta 182155), reused 254094 (delta 178356)
    Receiving objects: 100% (258564/258564), 46.91 MiB | 700 KiB/s, done.
    Resolving deltas: 100% (182155/182155), done.

This will create a local directory called `scala`, which contains a clone of your own copy of our repository. The changes that you make
in this directory can be propagated back to your copy hosted on GitHub and, ultimately, pushed into Scala when your patch is ready.

### Branch

Before you start making changes, always create your own branch. Never work on the `master` branch. Think of a name that describes
the changes you plan on making. Use a prefix that describes the nature of your change. There are essentially two kinds of changes:
bug fixes and new features.

* For bug fixes, use `issue/NNNN` or `ticket/NNNN` for bug NNNN from the [Scala issue tracker](https://issues.scala-lang.org/).
* For new feature use `topic/XXX` for feature XXX. Use feature names that make sense in the context of the whole Scala project and not just to you personally. For example, if you work on diagrams in Scaladoc, use `topic/scaladoc-diagrams` instead of just `topic/diagrams` would be a good branch name.

Since in our example, we're going to fix an existing bug [SI-6725](https://issues.scala-lang.org/browse/SI-6725), we'll create a branch named `ticket/6725`.

    16:39 ~/Projects/scala (master)$ git checkout -b ticket/6725
    Switched to a new branch 'ticket/6725'

If you are new to Git and branching, read the [Branching Chapter](http://git-scm.com/book/en/Git-Branching) in the Git Pro book.

### Build

The next step after cloning your fork is setting up your machine to build Scala.

* It is recommended to use Java `1.6` (not `1.7` or `1.8`, because they might cause occasional glitches).
* The build tool is `ant`.
* The build runs the `pull-binary-libs.sh` script to download bootstrap libs. This requires `bash` and `curl`.
* The majority of our team works on Linux and OS X, so these operating systems are guaranteed to work.
* Windows is supported, but it might have issues. Please report to [the issue tracker](https://issues.scala-lang.org/) if you encounter any.

Building Scala is as easy as running `ant` in the root of your cloned repository. Be prepared to wait for a while-- a full "clean" build
takes 8+ minutes depending on your machine (and up to 30 minutes on older machines with less memory). Incremental builds are usually within 30-120 seconds range (again, your mileage might vary
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

    pack.bin:
        [mkdir] Created dir: /Users/xeno_by/Projects/scala/build/pack/bin

    pack.done:

    build:

    BUILD SUCCESSFUL
    Total time: 9 minutes 41 seconds

### IDE

There's no single editor of choice for working with Scala sources, as there are trade-offs associated with each available tool.

Both Eclipse and IntelliJ IDEA have Scala plugins, which are known to work with our codebase.
Both of those Scala plugins provide navigation, refactoring and error reporting functionality as well as integrated debugging.

There also exist lighter-weight editors such as Emacs, Sublime or jEdit which are faster and much less memory/compute-intensive to run, while
lacking semantic services and debugging. To address this shortcoming, they can integrate with ENSIME,
a helper program, which hosts a resident Scala compiler providing some of the features implemented in traditional IDEs. However despite
having significantly matured over the last year, support for our particular code base is still being improved, and is not as mature as for Eclipse and IntelliJ.

Due to the immense variability in personal preference between IDE/editor experience, it's difficult to recommend a particular tool, and your choice should boil down to your personal preferences.

## 3. Hack

When hacking on your topic of choice, you'll be modifying Scala, compiling it and testing it on relevant input files.
Typically you would want to first make sure that your changes work on a small example and afterwards verify that nothing break
by running a comprehensive test suite.

We'll start by creating a `sandbox` directory (this particular name doesn't bear any special meaning), which will hold a single test file and its compilation results. First, let's make sure that
[the bug](https://issues.scala-lang.org/browse/SI-6725) is indeed reproducible by putting together a simple test and compiling and running it with the Scala compiler that we built using `ant`. The Scala compiler that we just built is located in `build/pack/bin`.

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
    1%n1 // %n should've been replaced by a newline here

### Implement

Now, implement your bugfix or new feature!

Here are also some tips & tricks that have proven useful in Scala development:

* If after introducing changes or updating your clone, you get `AbstractMethodError` or other linkage exceptions,
  try doing `ant clean build`. Due to the way how Scala compiles traits, if a trait changes, then it's sometimes not enough to recompile
  just that trait, but it might also be necessary to recompile its users. The `ant` tool is not smart enough to do that, which might lead to
  very strange errors. Full-rebuilds fix the problem. Fortunately that's rarely necessary, because full-rebuilds take a lot of time-- the same 8-30 minutes as mentioned above.
* Even on solid state drives packaging Scala distribution (i.e. creating jars from class files) is a non-trivial task. To save time here,
  some people in our team do `ant quick.comp` instead of `ant` and then create custom scripts ([here](https://github.com/adriaanm/binfu/blob/master/scafu.sh) are some examples to get you started) to launch Scala from `build/quick/classes`.
* Don't underestimate the power of `print`. When starting with Scala, I spent a lot of time in the debugger trying to figure out how
  things work. However later I found out that print-based debugging is often more effective than jumping around. While it might be obvious
  to some, I'd like to explicitly mention that it's also useful to print stack traces to understand the flow of execution. When working with `Trees`, you might want to use `showRaw` to get the `AST` representation.
* You can publish your newly-built scala version locally to use it from sbt. Here's how:

         $ ant publish-local-opt -Dmaven.version.suffix="-test"
         $ sbt
         [info] Set current project to test (in build file:/Users/georgii/workspace/test/)
         > set resolvers += Resolver.mavenLocal
         [info] Defining *:resolvers
         [info] The new value will be used by *:externalResolvers
         [info] Reapplying settings...
         [info] Set current project to test (in build file:/Users/georgii/workspace/test/)
         > ++2.12.0-test
         [info] Setting version to 2.12.0-test
         [info] Set current project to test (in build file:/Users/georgii/workspace/test/)
         > console
         [info] Starting scala interpreter...
         [info]
         Welcome to Scala version 2.12.0-20140623-155543-8bdacad317 (Java HotSpot(TM) 64-Bit Server VM, Java 1.7.0_51).
         Type in expressions to have them evaluated.
         Type :help for more information.

         scala>

* Adding a macro to the `Predef` object is a pretty involved task. Due to bootstrapping, you cannot just throw a macro into it. For this reason, the process is more involved. You might want to follow the way `StringContext.f` itself is added. In short, you need to define your macro under `src/compiler/scala/tools/reflect/` and provide no implementation in `Predef` (`def fn = macro ???`). Now you have to set up the wiring. Add the name of your macro to `src/reflect/scala/reflect/internal/StdNames.scala`, add the needed links to it to `src/reflect/scala/reflect/internal/Definitions.scala`, and finally specify the bindings in `src/compiler/scala/tools/reflect/FastTrack.scala`. [Here's](https://github.com/folone/scala/commit/59536ea833ca16c985339727baed5d70e577b0fe) an example of adding a macro.

### Documentation

There are several areas that one could contribute to-- there is the Scala library, the Scala compiler, and other tools such as Scaladoc. Each area has varying amounts of documentation.

##### The Scala Library

Contributing to the Scala standard library is about the same as working on one of your own libraries. Beyond the Scala collections hierarchy, there are no complex internals or architectures to have to worry about. Just make sure that you code in a "don't-repeat-yourself" (DRY) style, obeying the "boy scout principle" (i.e. make sure you've left the code cleaner than you found it).

If documentation is necessary for some trait/class/object/method/etc in the Scala standard library, typically maintainers will include inline comments describing their design decisions or rationale for implementing things the way they have, if it is not straightforward.

If you intend on contributing to Scala collections, please make sure you're familiar with the design of the Scala collections library. It can be easy to put an implementation in the wrong location if you are unfamiliar with the collections architecture. There is an excellent and very detailed guide covering [the Architecture of Scala Collections](http://docs.scala-lang.org/overviews/core/architecture-of-scala-collections.html), as well as a larger more general [Scala collections Guide](http://docs.scala-lang.org/overviews/collections/introduction.html) covering the sequential portion of collections. For parallel collections, there also exists a detailed [Scala Parallel Collections Guide](http://docs.scala-lang.org/overviews/parallel-collections/overview.html).

##### The Scala Compiler

Documentation about the internal workings of the Scala compiler is scarce, and most of the knowledge is passed around by email (scala-internals mailing list), ticket, or word of mouth. However the situation is steadily improving. Here are the resources that might help:

* [Compiler internals videos by Martin Odersky](http://www.scala-lang.org/old/node/598.html) are quite dated, but still very useful. In this three-video
  series Martin explains the general architecture of the compiler, and the basics of the front-end, which has recently become Scala reflection API.
* [Reflection documentation](http://docs.scala-lang.org/overviews/reflection/overview.html) describes fundamental data structures (like `Tree`s, `Symbol`s, and `Types`) that
  are used to represent Scala programs and operations defined on then. Since much of the compiler has been factored out and made accessible via the Reflection API, all of the fundamentals needed for reflection are the same for the compiler.
* [Reflection and Compilers by Martin Odersky](http://channel9.msdn.com/Events/Lang-NEXT/Lang-NEXT-2012/Reflection-and-Compilers), a talk
  at Lang.NEXT 2012 in which Martin elaborates on the design of scalac and the architecture of the reflection API.
* [Scala compiler corner](http://lampwww.epfl.ch/~magarcia/ScalaCompilerCornerReloaded/) contains extensive documentation about
  most of the post-typer phases (i.e. the backend) in the Scala compiler.
* [scala-internals](http://groups.google.com/group/scala-internals), a mailing list which hosts discussions about the core
  internal design and implementation of the Scala system.

##### Other Projects

Tools like Scaladoc also welcome contributions. Unfortunately these smaller projects have less developer documentation. In these cases, the best thing to do is to directly explore the code base (which often contains documentation as inline comments) or to write to the appropriate maintainers for pointers.

### Interlude

To fix [the bug we're interested in](https://issues.scala-lang.org/browse/SI-6725) we've tracked the `StringContext.f` interpolator
down to a macro implemented in `MacroImplementations.scala` There we notice that the interpolator only processes conversions,
but not tokens like `%n`. Looks like an easy fix.

    18:44 ~/Projects/scala/sandbox (ticket/6725)$ git diff
    diff --git a/src/compiler/scala/tools/reflect/MacroImplementations.scala b/src/compiler/scala/tools/
    index 002a3fce82..4e8f02084d 100644
    --- a/src/compiler/scala/tools/reflect/MacroImplementations.scala
    +++ b/src/compiler/scala/tools/reflect/MacroImplementations.scala
    @@ -117,7 +117,8 @@ abstract class MacroImplementations {
           if (!strIsEmpty) {
             val len = str.length
             while (idx < len) {
    -          if (str(idx) == '%') {
    +          def notPercentN = str(idx) != '%' || (idx + 1 < len && str(idx + 1) != 'n')
    +          if (str(idx) == '%' && notPercentN) {
                 bldr append (str substring (start, idx)) append "%%"
                 start = idx + 1
               }

After applying the fix and running `ant`, our simple test case in `sandbox/Test.scala` started working!

    18:51 ~/Projects/scala/sandbox (ticket/6725)$ cd ..
    18:51 ~/Projects/scala (ticket/6725)$ ant
    Buildfile: /Users/xeno_by/Projects/scala/build.xml

    ...

    quick.comp:
    [scalacfork] Compiling 1 file to /Users/xeno_by/Projects/scala/build/quick/classes/compiler
    [propertyfile] Updating property file: /Users/xeno_by/Projects/scala/build/quick/classes/compiler/compiler.properties
    [stopwatch] [quick.comp.timer: 6.588 sec]

    ...

    BUILD SUCCESSFUL
    Total time: 18 seconds

    18:51 ~/Projects/scala (ticket/6725)$ cd sandbox
    18:51 ~/Projects/scala/sandbox (ticket/6725)$ ../build/pack/bin/scalac Test.scala
    18:51 ~/Projects/scala/sandbox (ticket/6725)$ ../build/pack/bin/scala Test
    1
    1 // no longer getting the %n here - it got transformed into a newline

### Test

To guard your change against accidental breakage in the future, it is important to add tests.
I have already written one test earlier, so that's a good start but not enough! Apart from obvious usages of our new functionality, we need to cover corner-cases as well.

Adding tests to the test suite is as easy as moving them to the appropriate directory:

* Code which should compile successfully, but doesn't need to be executed, needs to go into the [“pos” directory](https://github.com/scala/scala/tree/2.12.x/test/files/pos).
* Code which should not compile needs to go into the [“neg” directory](https://github.com/scala/scala/tree/2.12.x/test/files/neg).
* Code which should compile and get executed by the test suite needs to go into the [“run” directory](https://github.com/scala/scala/tree/2.12.x/test/files/run) and have a corresponding `.check` file with the expected output. You will get test failures if the content of a `.check` file is different from what the test produces while running. If the change in the output is an expected product of your work, you might not want to change the `.check` file by hand. To make partest change the `.check` file, run it with a `--update-check` flag, like so `./test/partest --update-check path/to/test.scala`. For more information on partest, please refer to its [documentation](http://docs.scala-lang.org/tutorials/partest-guide.html).
* Everything that can be unit-tested should go to ["junit" directory](https://github.com/scala/scala/tree/2.12.x/test/junit)
* Property-based tests go to the ["scalacheck" directory](https://github.com/scala/scala/tree/2.12.x/test/files/scalacheck)

Here are some more testing tips:

* If you have several tests, and want a tool for only running tests that conform to some regular expression, you can use `partest-ack` in the `tools` directory: `./tools/partest-ack "dottype"`
* If your tests fail in the following way:

        test.bc:
           [echo] Checking backward binary compatibility for scala-library (against 2.11.0)
           [mima] Found 2 binary incompatibiities
           [mima] ================================
           [mima]  * synthetic method
           [mima]    scala$package$Class$method(java.lang.String)Unit in trait
           [mima]    scala.package.Class does not have a correspondent in old version
           [mima]  * synthetic method
           [mima]    scala$package$AnotherClass$anotherMethod(java.lang.String)Unit in trait
           [mima]    scala.package.AnotherClass does not have a correspondent in old version
           [mima] Generated filter config definition
           [mima] ==================================
           [mima]
           [mima]     filter {
           [mima]         problems=[
           [mima]             {
           [mima]                 matchName="scala.package.Class$method"
           [mima]                 problemName=MissingMethodProblem
           [mima]             },
           [mima]             {
           [mima]                 matchName="scala.package.AnotherClass$anotherMethod"
           [mima]                 problemName=MissingMethodProblem
           [mima]             }
           [mima]         ]
           [mima]     }
           [mima]

         BUILD FAILED
         /localhome/jenkins/c/workspace/pr-scala-test/scala/build.xml:1530: The following error occurred while executing this line:
         /localhome/jenkins/c/workspace/pr-scala-test/scala/build-ant-macros.xml:791: The following error occurred while executing this line:
         /localhome/jenkins/c/workspace/pr-scala-test/scala/build-ant-macros.xml:773: Java returned: 2

         Total time: 6 minutes 46 seconds
         Build step 'Execute shell' marked build as failure
         Archiving artifacts
         Notifying upstream projects of job completion
         Finished: FAILURE

This means your change is backward or forward binary incompatible with the specified version (the check is performed by the [migration manager](https://github.com/typesafehub/migration-manager)). The error message is actually saying what you need to add to `bincompat-backward.whitelist.conf` or `bincompat-forward.whitelist.conf` to make the error go away. If you are getting this on an internal/experimental api, it should be safe to add suggested sections to the config. Otherwise, you might want to target a newer version of scala for this change.

### Verify

Now to make sure that my fix doesn't break anything I need to run the test suite using the `partest` tool we wrote to test Scala.
Read up [the partest guide](partest-guide.html) to learn the details about partest, but in a nutshell you can either
run `ant test` to go through the entire test suite (30+ minutes) or use wildcards to limit the tests to something manageable:

    18:52 ~/Projects/scala/sandbox (ticket/6725)$ cd ../test
    18:56 ~/Projects/scala/test (ticket/6725)$ partest files/run/*interpol*
    Testing individual files
    testing: [...]/files/run/interpolationArgs.scala                      [  OK  ]
    testing: [...]/files/run/interpolationMultiline1.scala                [  OK  ]
    testing: [...]/files/run/interpolationMultiline2.scala                [  OK  ]
    testing: [...]/files/run/sm-interpolator.scala                        [  OK  ]
    testing: [...]/files/run/interpolation.scala                          [  OK  ]
    testing: [...]/files/run/stringinterpolation_macro-run.scala          [  OK  ]
    All of 6 tests were successful (elapsed time: 00:00:08)

## 4. Publish

After development is finished, it's time to publish the code and submit your patch for discussion and potential inclusion into Scala.
In a nutshell, this involves:

1. making sure that your code and commit messages are of high quality,
2. clicking a few buttons in the GitHub interface,
3. assigning one or more reviewers who will look through your pull request.

Let's go into each of these points in more detail.

### Commit

The [Git Basics](http://git-scm.com/book/en/Git-Basics) chapter in the Git online book covers most of the basic workflow during this stage.
There are two things you should know here:

1. Commit messages are often the only way to understand the intentions of authors of code written a few years ago. Thus, writing a quality is of utmost importance. The more context you provide for the change you've introduced, the larger the chance that some future maintainer understand your intentions. Consult [the pull request policy](https://github.com/scala/scala/wiki/Pull-Request-Policy) for more information about the desired style of your commits.
2. Keeping Scala's git history clean is also important. Therefore we won't accept pull requests for bug fixes that have more than one commit. For features, it is okay to have several commits, but all tests need to pass after every single commit. To clean up your commit structure, you want to [rewrite history](http://git-scm.com/book/en/Git-Branching-Rebasing) using `git rebase` so that your commits are against the latest revision of `master`.

Once you are satisfied with your work, synced with `master` and cleaned up your commits you are ready to submit a patch to the central Scala repository. Before proceeding make sure you have pushed all of your local changes to your fork on GitHub.

    19:22 ~/Projects/scala/test (ticket/6725)$ git add ../src/compiler/scala/tools/reflect/MacroImplementations.scala
    19:22 ~/Projects/scala/test (ticket/6725)$ git commit
    [ticket/6725 3c3098693b] SI-6725 `f` interpolator now supports %n tokens
     1 file changed, 2 insertions(+), 1 deletion(-)
    19:34 ~/Projects/scala/test (ticket/6725)$ git push origin ticket/6725
    Username for 'https://github.com': xeno-by
    Password for 'https://xeno-by@github.com':
    Counting objects: 15, done.
    Delta compression using up to 8 threads.
    Compressing objects: 100% (8/8), done.
    Writing objects: 100% (8/8), 1.00 KiB, done.
    Total 8 (delta 5), reused 0 (delta 0)
    To https://github.com/xeno-by/scala
     * [new branch]            ticket/6725 -> ticket/6725

### Submit

Now, we must simply submit our proposed patch. Navigate to your branch in GitHub (for me it was `https://github.com/xeno-by/scala/tree/ticket/6725`)
and click the pull request button to submit your patch as a pull request to Scala. If you've never submitted patches to Scala, you will
need to sign the contributor license agreement, which [can be done online](http://typesafe.com/contribute/cla/scala) within a few minutes.

<img src="{{ site.baseurl }}/resources/img/04-submit.png" alt="Submit a pull request" class="centerclear" />

### Review

After the pull request has been submitted, you need to pick a reviewer (usually the person you've contacted in the beginning of your
workflow) and be ready to elaborate and adjust your patch if necessary. In this example, we picked Martin, because we had such a nice chat on the mailing list:

<img src="{{ site.baseurl }}/resources/img/05-review.png" alt="SAssign the reviewer" class="centerclear" />

## Merge

After your reviewer is happy with your code (usually signaled by a LGTM — “Looks good to me”), your job is done.
Note that there can be a gap between a successful review and the merge, because not every reviewer has merge rights. In that case, someone else from the team will pick up your pull request and merge it.
So don't be confused if your reviewer says “LGTM”, but your code doesn't get merged immediately.
