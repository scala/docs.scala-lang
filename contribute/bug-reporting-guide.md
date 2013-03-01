---
layout: page
title: Bug Reporting
---

# Reporting bugs to the Scala project

The Scala project tracker is located at:

> [http://issues.scala-lang.org](http://issues.scala-lang.org)


<!--
WHAT THIS PAGE SHOULD TALK ABOUT:
 - tracker
 - what's a bug and what's not a bug?
   - is it in the scala area?
     - library
     - compiler
     - reflection
     - scaladoc
     - external libraries have their own trackers:
       - akka
       - play
       - lift
       - slick
   - if it's a compiler crasher, it's a bug
   - if the code generated throws a VerifyError, it's a bug
   - if it's a regression, i.e. it worked in the previous version, it's a bug
   - if the code generated is not doing what you expected, then it may or may not be a bug
     - minimize the problem
       - decouple from libraries
       - decouple from complex build systems
         - it could be a separate compilation issue - does it happen if you clean everything before?
       - create small and self-contained files that, when compiled, will exhibit the behavior
   - even if the behavior is not what you hoped for, it might still be correct
     - if possible, look at the Scala Reference Specification and SIP documents
     - or ask on the scala-internals mailing list
 - okay, I'm sure it's a bug, now what?
   - search for similar bugs
     - the exception name and phase should be the best keywords to search for
     - if the bug is there, add your test case as a comment. When someone picks up the bug, they will have to add your test case as a confirmation test
   - if there's no similar bug
     - try to fill in as many fields as possible:
       - scala version
       - component (if you know)
       - labels
       - assigneee may be left empty, as all new bugs are triaged
       - environment - Machine architecture, Operating system, Java virtual machine version, any other environment necessary
       - description -
          - the test case
          - the commands to trigger the bug
          - the expected output
          - the actual output
 -->
