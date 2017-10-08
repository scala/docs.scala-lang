---
layout: sips
title: Scala Improvement Process
---


<div style="font-size: 1.25rem; color: #073642; font-weight: 400; font-family: 'Roboto Slab', serif; margin-bottom: 18px;"> There are <strong>two</strong> ways to make changes to Scala.</div>

<ol style="margin-bottom: 24px;">
  <li style="margin-bottom: 4px;">Library changes, typically to the Scala standard library and other central libraries.</li>
  <li style="margin-bottom: 4px;">Compiler/language changes.</li>
</ol>

The Scala Platform Process (SPP) is intended for library changes, and the Scala
Improvement Process (SIP) is intended for changes to the Scala compiler or
language.


## Scala Platform Process (SPP)

The Scala Platform aims to be a stable collection of libraries with widespread
use and a low barrier to entry for beginners and intermediate users. The
Platform consists of several independent modules that solve specific problems.
The Scala community sets the overall direction of the Platform.

<a class="button" href="https://scalacenter.github.io/platform/">Learn more</a>



## Scala Improvement Process (SIP)

The **SIP** (_Scala Improvement Process_) is a process for submitting changes to
the Scala language. All changes to the language go through design documents,
called Scala Improvement Proposals (SIPs), which are openly discussed by a
committee and only upon reaching a consensus are accepted to be merged into the
Scala compiler.

The aim of the Scala Improvement Process is to apply openness and collaboration
to the process of evolving the language. SIPs are for changes to the Scala
language and/or compiler and are subject to a [rigorous review process](./sip-submission.html)
and are usually accompanied by changes to the
[Scala language specification](http://www.scala-lang.org/files/archive/spec/2.12/), lots of
review and discussion on the [Scala Contributors](https://contributors.scala-lang.org/) mailing list and
voting/approval milestones. Please read [Submitting a SIP](./sip-submission.html) and our
[SIP tutorial](./sip-tutorial.html) for more information.

> Note: the SIP process replaced the older SID (Scala Improvement Document) process,
however the old completed SID documents are still available to review in the
[completed section of the SIP list](sip-list.html).
