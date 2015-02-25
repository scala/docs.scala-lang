---
layout: sip-landing
title: SLIP Submission Process
---

## How do I get started? ##

SLIP (Scala Library Improvement Process) is a way to suggest, define, implement and submit
changes, additions and enhancements to the Scala core libraries. Because it benefits us
as a community to avoid adding libraries and APIs without careful thought, please read the
following before deciding to create you SLIP:

* Suggested functionality should not duplicate existing capabilities in the core libraries.
  If you want to change existing functionality, suggest that, but be ready for questions of
  backwards compatibility, migration strategies and other concerns. However if you want to
  add APIs to the core libraries, they should be demonstrably different from those already
  there, or offer extra functionality not available in the current APIs, or ideally both.
* Any additions or modifications must maintain the existing "feel" of the current core Scala libraries.
  Design questions will likely be asked through during the SLIP reviews to ensure that
  this aspect has been considered.
* Additions or modifications must also be tried and tested. Tested means a strong, complete
  testing suite, tried usually means that the functionality will be drawn from an existing,
  established library that has demonstrated it's utility, reliability and stability already.
* Typically your contributions will go into an auxiliary library jar that is distributed
  with the Scala language download, as with the parser combinator and reflection modules
  (there is a push towards greater modularity within the libraries now). Give some thought
  to the name of the library you are proposing. If you believe it should be included
  in the core Scala library jar, you will likely be asked to explain and defend
  that position.
* The best starting point is an existing, working library from which you can draw your
  implementation. Likely you will be cherry picking functionality from the library
  rather than submitting the whole thing.

## How do I submit? ##

The process to submit is simple:

* Fork the Scala documentation repository, [http://github.com/scala/scala.github.com](http://github.com/scala/scala.github.com).
* Create a new SLIP file in the `sips/pending/_posts/` using the [SLIP Template](./slip-template.html) in
  `sips/pending/slip-template.md` as
  a starting point. Check the [Writing a SIP Tutorial](sip-tutorial.html) for more help.
  * Make sure the new file follows the format:  `YYYY-MM-dd-{title}.md`.  Use the proposal date for `YYYY-MM-dd`.
  * Use the [Markdown Syntax](http://daringfireball.net/projects/markdown/syntax) to write your SLIP.
  * Follow the instructions in the [README](https://github.com/scala/scala.github.com/blob/gh-pages/README.md)
    to build your SLIP locally so you can ensure that it looks correct on the website.
  * Ensure the SLIP is listed under Pending SLIPs on the [SIPs index page](./index.html)
* Commit your changes to your forked repository
* Create a new [pull request](https://github.com/scala/scala.github.com/pull/new/gh-pages).  This will notify the Scala SIP team.

## What will happen next ##

The SLIP committee will have a look at your proposal. If it is looks promising, it will be made into a SLIP. At that point, you'll have to sign a CLA (contributor license agreement) which says that you are OK with the text of the proposal and the implementation being used in the Scala project.

It will also be opened to a brief public review, no more than 2 weeks to gather comments and concerns from anyone interested.
The result of this public review period may be some requested changes to the design or implementation
of the library, its tests, or its scope.

## What will happen afterwards ##

The SLIP will get a unique number. It should be discussed on the [scala-sips mailing list](https://groups.google.com/forum/#!forum/scala-sips).
In these mails, every mail that is specific to a SLIP ### should be prefixed with \[SLIP-###\].

Before a SIP can be accepted, it also needs a full implementation that can be evaluated in practice. That implementation can be done before the SLIP is submitted, or else concurrently with the discussion period.

## What is the provisional voting status? ##

When a release is drawing near, the SLIP committee will hold on provisional vote on pending SLIPs.  This vote places slips in one of the current status:

* `Accepted` - The SLIP will be included in the next release, pending an acceptable implementation.
* `Deferred - Next Meeting` - The committee has concerned that need to be addressed in the SLIP before inclusion in the Release. If the concerns are handled before the next release, the SLIP will be re-evaluated.
* `Delay - Next Release` - The SLIP committee has larger concerns with the state of the SLIP and would prefer to wait until the next Scala release to consider inclusion.
* `Not Accepted` - The SLIP committee feels the SLIP is not needed for the Scala language and turns down the proposal, with an explanation of why.

## What happens for a Scala major release? ##

Before a Scala release, the committee will make a final decision for each SLIP whether it should be accepted, rejected, or delayed for the next release. Accepted SLIPs will be rolled into an upcoming Scala release and placed in the accepted folder.  Rejected SLIPs will be left in the SIP repository under the "rejected slips" section.  Delayed SLIPs will remain pending.


## Who is on the SLIP committee ##

Right Now:

* Martin Odersky
* Josh Suereth
* Adriaan Moors

We will ask new members to join from time to time.   The committee decides collectively, but Martin reserves the final say if there is a disagreement.
