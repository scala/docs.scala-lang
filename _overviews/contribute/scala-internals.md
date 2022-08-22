---
title: Scala Contributors Forum
num: 9
---

The [Scala Contributors Forum][scala-contributors] is where discussions about the Scala ecosystem
occur, from the perspectives of core compiler, documentation and library contributors. It features updates from the
Scala Center, along with technical and logistical discussions concerning bugs, bug fixes, documentation, improvements,
new features and other contributor related topics.

> The now legacy [scala-internals mailing list](https://groups.google.com/d/forum/scala-internals) used to fulfil this
> purpose, but has since expanded to encompass more topics in the new [forum][scala-contributors].

## Coordinating on Scala Contributors

Prior to commencing on contribution work on larger changes to the Scala project, it is recommended (but not required)
that you make a post on [Scala Contributors][scala-contributors] announcing your intention.
It's a great time to invite any help, advice or ask any questions you might have. It's also a great place to meet peers,
one of whom will probably be reviewing your contribution at some point.
For smaller bug fixes or documentation changes where the risk of effort duplication is minimal, you can skip this post.

To help users to sort through the posts, we request that the following categories are applied when you start a
new post please:

| Category                    | Topics                                                              |
|-----------------------------|---------------------------------------------------------------------|
| `Documentation`             | Documentation, e.g. docs.scala-lang.org, API (scaladoc), etc.       |
| `Compiler`                  | Bug reporting/fixing, Scala compiler discussions/issues             |
| `Tooling`                   | Tools including sbt, IDE plugins, testing, scaladoc generator, etc. |
| `Scala Standard Library`    | Core libraries                                                      |
| `Scala Platform`            | Extension libraries                                                 |
| `Language Design`           | Scala language feature discussions / informal proposals             |
| `Scala Improvement Process` | Scala language feature formal proposals                             |
| `Meta Discourse`            | Administrative/coordination topics                                  |
| `Community`                 | Discussions about events, community organising                      |

### Why It's a Good Idea

While it is optional to announce your intentions/work items on [Scala Contributors][scala-contributors] before starting, it is recommended thing to do for a number of reasons:

* To attempt to cut down on duplicate effort (i.e. to avoid two people working on the same bug at the same time without coordinating effort).
* Related to the above: to allow the compiler team and core committers to warn of or smooth over potential merge conflicts between separate bugs that might affect the same code.
* Potentially someone has already thought about or even worked on that issue or a related one, and has valuable insight
that might save you time (including warnings about what you might find and may want to avoid - perhaps one option
already tried lead to no benefit).
* You might find a group of impassioned individuals who want to volunteer and help you. You will have the momentum since
you posted first, so then it's up to you to decide if you want their help or not.
* Posting could start a dialog with a potential reviewer, smoothing the later stages of your contribution before
merging your changes.
* There are a lot of nice people waiting to talk to you on [Scala Contributors][scala-contributors], you might be
surprised how valuable and pleasant you find the experience of talking to them.

Even if you do not wish to post on [Scala Contributors][scala-contributors], please feel welcome to make contributions
anyway, as posting to the forum is *not* criteria for it to be accepted. For smaller, self-contained bugs it is
especially less important to make a post, however larger issues or features take more time to consider accepting them.
For large contributions we strongly recommend that you do to notify of your intention, which will help you determine if
there is large community support for your change, making it more likely that your large contribution will be accepted,
before you spend a long time implementing it.

[scala-contributors]: https://contributors.scala-lang.org
