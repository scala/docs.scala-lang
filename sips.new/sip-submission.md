---
layout: sip-landing
title: SIP Submission Process
---

## How do I get started? ##

Before submitting a SIP, it is a good to float your proposal on [scala-debate](https://groups.google.com/forum/#!forum/scala-debate). Be specific and already draw up a document that contains all relevant details. Often, public discussions help to refine a proposal to a point where it can become a SIP.

## How do I submit? ##

The process to submit is simple:

* Fork the [scala/sips github project](http://github.com/jsuereth/sips)
* Create a new SIP file in the `pending/_posts/`.  Check the [Writing a SIP Tutorial](sip-tutorial.html)
  * Make sure the new file follows the format:  `YYYY-MM-dd-{title}.md`.  Use the proposal date for `YYYY-MM-dd`.
  * Use the [Markdown Syntax](http://daringfireball.net/projects/markdown/syntax) to write your SIP.
  * Use the `run-server.sh` script locally to ensure your SIP looks correct in the website.
* Create a link to your SIP in the "pending sips" section of `index.md`
* Commit your changes to your forked repository
* Create a new [pull request](https://github.com/jsuereth/sips/pull/new/gh-pages).  This will notify the Scala SIP team.

## What will happen next ##

The SIP committee will have a look at your proposal. If it is looks promising, it will be made into a SIP. At that point, you'll have to sign a CLA (contributor license agreement) which says that you are OK with the text of the proposal and the implementation being used in the Scala project.

## What will happen afterwards ##

The SIP will get a unique number. It should be discussed on the scala-sips mailing list. In these mails, every mail that is specific to a SIP ### should be prefixed with \[SIP-###\]. Typically, a SIP under discussion will have a member of the committee as sheperd, to help move it forward.

Before a SIP can be accepted, it also needs a full implementation that can be evaluated in practice. That implementation can be done before the SIP is submitted, or else concurrently with the discussion period.

## What happens last ##

The committee will decide for each SIP whether it should be accepted, rejected, or kept under discussion for further improvements. Accepted SIPs will be rolled into an upcoming Scala release.  Rejected SIPs will be left in the SIP repository under the "rejected sips" section.

## Who is on the SIP committee ##

TBD
