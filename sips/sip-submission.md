---
layout: sip-landing
title: SIP Submission Process
---

## How do I get started? ##

Before submitting a SIP, it is a good to float your proposal on [scala-debate](https://groups.google.com/forum/#!forum/scala-debate). Be specific and already draw up a document that contains all relevant details. Often, public discussions help to refine a proposal to a point where it can become a SIP.

## How do I submit? ##

The process to submit is simple:

* Fork the Scala documentation repository, [http://github.com/scala/scala.github.com](http://github.com/scala/scala.github.com).
* Create a new SIP file in the `sips/pending/_posts/`.  Check the [Writing a SIP Tutorial](sip-tutorial.html)
  * Make sure the new file follows the format:  `YYYY-MM-dd-{title}.md`.  Use the proposal date for `YYYY-MM-dd`.
  * Use the [Markdown Syntax](http://daringfireball.net/projects/markdown/syntax) to write your SIP.
  * Follow the instructions in the [README](https://github.com/scala/scala.github.com/blob/gh-pages/README.md) to build your SIP locally so you can ensure that it looks correct on the website.
* Create a link to your SIP in the "pending sips" section of `index.md`
* Commit your changes to your forked repository
* Create a new [pull request](https://github.com/scala/scala.github.com/pull/new/gh-pages).  This will notify the Scala SIP team.

## What will happen next ##

The SIP committee will have a look at your proposal. If it is looks promising, it will be made into a SIP. At that point, you'll have to sign a CLA (contributor license agreement) which says that you are OK with the text of the proposal and the implementation being used in the Scala project.

## What will happen afterwards ##

The SIP will get a unique number. It should be discussed on the scala-sips mailing list. In these mails, every mail that is specific to a SIP ### should be prefixed with \[SIP-###\]. Typically, a SIP under discussion will have a member of the committee as sheperd, to help move it forward.

Before a SIP can be accepted, it also needs a full implementation that can be evaluated in practice. That implementation can be done before the SIP is submitted, or else concurrently with the discussion period.

## What is the provisonal voting status? ##

When a release is drawing near, the SIP committee will hold on provisonal vote on pending SIPs.  This vote places sips in one of the current status:

* `Accepted` - The SIP will be included in the next release, pending an acceptable implementation.
* `Deferred - Next Meeting` - The committee has concerned that need to be addressed in the SIP before inclusion in the Release. If the concerns are handled before the next release, the SIP will be re-evaluated.
* `Delay - Next Release` - The SIP comittee has larger concerns with the state of the SIP and would prefer to wait until the next Scala release to consider inclusion.
* `Not Accepted` - The SIP comittee feels the SIP is not needed for the Scala language and turns down the proposal, with an explanation of why.

## What happens for a Scala major release? ##

Before a Scala release, the committee will make a final decision for each SIP whether it should be accepted, rejected, or delayed for the next release. Accepted SIPs will be rolled into an upcoming Scala release and placed in the accepted folder.  Rejected SIPs will be left in the SIP repository under the "rejected sips" section.  Delayed SIPs will remain pending.
 

## Who is on the SIP committee ##

Right Now:

* Martin Odersky
* Paul Philips
* Josh Suereth
* Adriaan Moors

We will ask new members to join from time to time.   The committee decides collectively, but Martin reserves the final say if there is a disagreement.
