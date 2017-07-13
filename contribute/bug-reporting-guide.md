---
title: Bug Reporting
layout: inner-page-no-masthead
# permalink: /contribute/bug-reporting-guide/
includeTOC: true
---

The Scala compiler and standard library bug tracker is located at [https://github.com/scala/bug](https://github.com/scala/bug). Before you submit a bug make sure that it is certainly a bug by following instructions in *Is it a Bug?*.

## Is it a Bug?

The first step in identifying a bug is to identify which component of the Scala distribution is affected. First, ensure that your issue falls within any of the following categories:

 - **Library** bugs typically manifest themselves as run-time exceptions, or as *unexpected*/*unintuitive* behavior of Scala Standard Library methods.
 - **Compiler** errors are manifested as compile time exceptions, unexpected behavior of your code at run time, or invalid behavior of the type system.
 - **Reflection** are bugs that appear in the ‘scala.reflect’ package. For the *reflection* bugs , the same rules apply as for the *library* bugs.
 - **Scaladoc** bugs are manifested as a logical problems in the information it presents (that is, the displayed information is incorrect, such as an incorrect subclassing relationship), or incorrect behavior of the user interface. If you'd like to suggest a change in the content of the documentation, please submit a pull request (possible to do in the browser using GitHub, which is easier and faster than filing a bug). Please file a bug about the content of documentation only if you cannot provide a suggestion for its fix.

If your issue is related to any of the following external projects, make sure to use its appropriate issue tracker:

 - [Akka](http://doc.akka.io/docs/akka/current/project/issue-tracking.html)
 - [Play!](http://github.com/playframework/Play20/issues)
 - [Slick](http://github.com/slick/slick/issues)
 - [Actors Migration Kit](http://github.com/scala/actors-migration/issues?state=open)
 - [Scala IDE](https://scala-ide-portfolio.assembla.com/spaces/scala-ide/support/tickets)
 - [sbt](https://github.com/sbt/sbt/issues)

The following are generally considered to be bugs:

- **Scala Compiler Crash** If the Scala compiler is crashing with an internal error (compile time exception) you have certainly found a bug, and can move on to the next section of this document on reporting confirmed bugs.
- **Regressions** If some code snippet worked in a previous Scala release, but now no longer compiles or results in an exception, it is probably a regression.
- **Verify Errors** happen when the compiled Scala program is loaded to the Java Virtual Machine. If you're getting a *Verify Error*, you've usually found a bug. Make sure first that your project is not using stale `.class` files before reporting a new issue.

If you have a code snippet that is resulting in bytecode which you believe is behaving incorrectly, you may or may not have found a bug. Before reporting your issue, please attempt the following:

* Make sure you minimize your problem. To correctly minimize the problem follow the following instructions:

   1. Gradually take apart the offensive code snippet until you believe you have the simplest representation of your problem.

   2. Ensure that you have decoupled your code snippet from any library that could be introducing the offensive behavior. One way to achieve this is to try to recompile the offensive code snippet in isolation, outside of the context of any complex build environment. If your code depends on some strictly Java library and source code is available for it, make sure that the latter is also minimized.

   3. Make sure you are compiling your project from a clean slate. Your problem could be related to separate compilation, which is difficult to detect without a clean build with new `.class` files.

   4. If you have encountered a bug while building your code in the IDE, then please reproduce it on the command line. The same rule applies for build tools like `sbt` or `ant`.

   5. If you want to file an improvement in the issue tracker please discuss it first on one of the mailing lists. They offer much bigger audience than issue tracker. The latter is not suitable for long discussions.

* Keep in mind that the behavior you are witnessing could be intended. Good formal resources for verifying whether or not the language behavior is intended is either in the [Scala Improvement Proposal Documents](http://docs.scala-lang.org/sips/sip-list.html) or in the [Scala Language Specification](http://www.scala-lang.org/files/archive/spec/2.12/). If in doubt, you may always ask on the [Community Category](https://contributors.scala-lang.org/c/community) or [Stack Overflow](https://stackoverflow.com/questions/tagged/scala).

In general, if you find yourself stuck on any of these steps, asking on [Scala Contributors](https://contributors.scala-lang.org/) can be helpful:

 - For unexpected behavior use the [Community Category](https://contributors.scala-lang.org/c/community).
 - For compiler bugs use the [Compiler Category](https://contributors.scala-lang.org/c/compiler).

* Examples of exceptions reported by the compiler which usually are not bugs:
  1. `StackOverflowError` is typically not a bug unless the stacktrace involves the internal packages of the compiler (like `scala.tools.nsc...`). Try to increase the Java stack size (`-Xss`), in most of the cases it helps.
  2. `AbstractMethodError` can occur when you did not recompile all the necessary Scala files (build tools, like `sbt`, can prevent that from happening) or you are mixing external libraries compiled for different Scala versions (for example one uses `2.10.x` and the other `2.11.x`).

## Reporting Confirmed Bugs is a Sin

Before reporting your bug, make sure to check the issue tracker for other similar bugs. The exception name or a compiler phase are the best keywords to search for. If you are experiencing unexpected behavior search for method/class names where it happens. Your issue might already be reported, and a workaround might already be available for you take advantage of. If your issue *is* reported, be sure to add your test case as a comment if it is different from any of the existing ones.

**Note:** reporting a bug that already exists creates an additional overhead for you, the Scala Team, and all people that search the issue database. To avoid this inconvenience make sure that you thoroughly search for an existing issue.

If you cannot find your issue in the issue tracker, create a new bug. The details about creating a bug report are in the following section.

## Creating a Bug Report

Please make sure to fill in as many fields as possible. Make sure you've indicated the following:

 1. **Exact Scala version** that you are using. For example, `2.10.1` or `2.11.0-RC`. If the bug happens in multiple versions indicate all of them.
 2. **The component** that is affected by the bug. For example, the Standard Library, Scaladoc, etc.
 3. **Labels** related to your issue. For example, if you think your issue is related to the typechecker, and if you have successfully minimized your issue, label your bug as "typechecker" and "minimized". Issue tracker will suggest names for existing labels as you type them so try not to create duplicates.
 4. **Running environment**. Are you running on Linux? Windows? What JVM version are you using?

In order for us to quickly triage the bug that you've found, it's important that the code snippet which produces the observed issue is as minimized as possible. For advice on minimizing your code snippet, please see the appropriate subsection of the above (Is it a Bug?).

### Description

In the description of your issue, be as detailed as you can. Bug reports which have the following information included are typically understood, triaged, and fixed very quickly:

 1. Include a test case (minimized if possible) enabling us to reproduce the problematic behavior. Include your test case (and output) in proper formatting `{code}` blocks:

    {code}Here you put your classes{code}

 2. The expected output.
 3. The actual output, including the stacktrace.
 4. Related discussion on the mailing lists, if applicable.
 5. If you have already looked into the issue provide interesting insights or proposals for fixing the issue.
