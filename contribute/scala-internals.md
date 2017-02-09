---
title: Scala Internals Mailing List
layout: inner-page-no-masthead
permalink: /contribute/scala-internals/
includeTOC: true
---

## scala-internals

The [scala-internals mailing list](https://groups.google.com/d/forum/scala-internals) is where technical and logistical discussions concerning bugs, bug fixes, documentation, improvements, new features and other contributor related topics occur. 

### Coordinating on scala-internals

Prior to commencing on contribution work on larger changes to the Scala project, it is recommended (but not required) that you make a post on scala-internals announcing your intention. It's a great time to invite any help, advice or ask any questions you might have. It's also a great place to meet peers, one of whom will probably be reviewing your contribution at some point.  For smaller bug fixes or documentation changes where the risk of effort duplication is minimal, you can skip this post. 

To help subscribers on the scala-internals list to sort through the postings, we request that the following topic labels are applied when you start a new post please:

| Label     | Topics                                                |
|-----------|-------------------------------------------------------|
| [docs]    | Documentation, e.g. docs.scala-lang.org, API (scaladoc), etc. |
| [issues]  | Bug reporting/fixing |
| [tools]   | Tools including sbt, IDE plugins, testing, scaladoc generator, etc. |
| [libs]    | Core libraries, extension libraries |
| [compiler] | Scala compiler discussions/features/issues |
| [admin]   | Administrative/coordination topics |

So, to talk about this list (an admin activity primarily) one might use:

`[admin] more suggested labels for topic differentiation.`

as a title, which then shows up on the mailing lists as

`[scala-internals] [admin] more suggested labels for topic differentiation.`

### Why It's a Good Idea

While it is optional to announce your intentions/work items on scala-internals before starting, it is recommended and a smart thing to do for a number of reasons:

* To attempt to cut down on duplicate effort (i.e. to avoid two people working on the same bug at the same time without coordinating effort).
* Related to the above: to allow the compiler team and core committers to warn of or smooth over potential merge conflicts between separate bugs that might affect the same code.
* Potentially someone has already thought about or even worked on that issue or a related one, and has valuable insight that might save you time (including warnings about what you might find and may want to avoid - dead ends that have already been explored).
* You might find a group of impassioned individuals want to volunteer to help you, since you got there first with your post it's up to you to decide if you want help or not.
* Posting could start a dialog with a potential reviewer, smoothing the latter, merge stages of the issue.
* There are a lot of nice people waiting to talk to you on scala-internals, you might be surprised how valuable and pleasant you find the experience of talking to them.

If all of this has not convinced you then, please, go ahead and work on contributions anyway. It *is* less important to post to scala-internals first for small, self contained bugs than it is for larger issues or features, and not having posted first will not be a reason for your PR to be rejected, it just might be a rougher review/merge process than if you had posted first. It's your choice.

