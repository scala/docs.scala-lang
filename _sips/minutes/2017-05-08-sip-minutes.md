---
layout: sips
title: SIP Meeting Minutes - 8th May 2017

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

|Topic|Reviewers| Accepted/Rejected |
| --- | --- | --- |
| [SIP-NN - comonadic-comprehensions](https://docs.scala-lang.org/sips/comonadic-comprehensions.html) | Shimi Bandiel | Rejected |
| [SIP-33 - Match infix & prefix types to meet expression rules](https://docs.scala-lang.org/sips/priority-based-infix-type-precedence.html)| Oron Port | Pending |
|[Scala Library Changes](https://github.com/scala/scala-dev/issues/323)|Adriaan Moors| Scala-dev proposal |

Jorge Vicente Cantero was the Process Lead.


## Date and Location
The meeting took place on 8 May 2017 via Google Hangouts at EPFL in Lausanne, Switzerland as well as other locations.

[Watch on Scala Center YouTube channel](https://youtu.be/6rKa4OV7GfM)

Minutes were taken by Darja Jovanovic.

## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), EPFL
* Iulian Dragos ([@dragos](https://github.com/dragos)), Independent
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend


## Proceedings
### Opening Remarks

**Jorge** going over the agenda, points out that the second item will be skipped because they are waiting for the prototype from the author of the proposal.

### [SIP-NN - comonadic-comprehensions](https://docs.scala-lang.org/sips/comonadic-comprehensions.html)
[YouTube time: 1:39](https://youtu.be/6rKa4OV7GfM?t=99)

Proposal aims to introduce new syntax from comprehension for monads to comonads.
Martin is the reviewer. He asks others attendees for their opinion on this.  Everyone had read the SIP.

**Eugene** referred to original proposal and wishes to see a better motivation for this language feature encouraging use of “plain English” to simplify the use of Scala as practice oriented language. He believes that it could be critical how this SIP can be improved. During the recent conference, organized by Facebook, he spoke with TypeScript guys that are developing idiomatic solutions that would benefit TypeScript and JavaScript and allow community users to give their inputs.
Refers to the paper “Denotation” he linked in a proposal, that is not enough for Scala, but a good start.

**Jorge** is getting back discussion on voting on this proposal and he mentioned that Josh insisted on more examples and suggestions on motivation of this SIP.

**Eugene** wanted to add more syntax (map and flatMap), but **Martin** opposed to that saying that Scala is quite serious program and needs more reason to add any additional syntax to it. **Martin** would like to see more widespread use of comonadic constructs and Libraries, and before doing that, he wouldn’t consider any further change. **Sebastian** agrees with Martin and says that he doesn’t really understand Josh’s and Eugene’s proposal. **Iulian** agrees that the proposal is quite complicated and he wonders how it can be useful. He believes that it is an interesting research direction, but that it needs more users feedback in aim to be included in the Scala, therefore questioning if the proposal should be numbered in the current form. Seth and Adriaan agree with Martin and Iulian.

**Conclusion** Proposal discarded unanimously. They will send the feedback to the author.

### [SIP-33 - Match infix & prefix types to meet expression rules](https://docs.scala-lang.org/sips/priority-based-infix-type-precedence.html)

Skipped since they are waiting for the prototype from the author of the proposal.

### Scala Library Changes
 [YouTube time 10:52](https://youtu.be/6rKa4OV7GfM?t=652)

 **Adriaan** starts presentation and notes that feedbacks on his proposal are available through the 2.13 platform. It is more reorganization of things in different modules. He suggests list of packages, from the ticket, that he believes shouldn’t be in the core:
 *Scala concurrent*, *Scala.ref*, *Scala.sys*, *Scala.compat* (that is already totally deprecated), *Scala.text* (that has already couple of things that are deprecated), *Scala.util*; whereas *Scala.io* and *Scala.sys* are good candidates for replacements with better community modules.
 Also, some hashing could be removed in separate package and make Scala package cut clean. He is open to discuss if some of these packages should stay in the Scala Library jar. Most of these packages are subjects of deprecations.
 Scala concurrent could live in its current form, but it could be split out since it’s platform dependent however.

 **Jorge** asks what they should change in XML. **Adriaan** says that it’s already a model and all these packages should wing as Scala changes. If no one from the community does push forward to maintain that, they should continue maintaining them through depreciation cycle, helped by replacement through SPPs. All these packages and classes of packages should be available in 2.13 as jars, but you should add them by yourself to your classpath if you are using them.

 **Martin** asks what they’ll get with this breaking of the system, since each package depends on each other.

 **Adriaan** propose that Scala concurrent can stay, if there is no use of separation. He also agrees that Scala.util should not be removed. But others are good candidates for separation, due to their lower quality. That will allow them faster cycle of reparation.

 **Martin** says to keep Scala math.

 **Sebastian** also suggests that Scala.ref also should rest.

 **Adriaan** said that it was just a proposal of maximal list of packages that they could split out and he’s ready to put it down to the more reasonable size. (Adriaan sent a document). The document shows the list of parts that are dependable and how platform would work if they’d be split out.

 **Sebastian** believes that these platforms should not be split out for the moment.

 **Adriaan** agrees with that. He believes that is probably too painful to change anything about it.

 **Jorge** proposes to keep thinking on this and to discuss it in the next two months, migration cycle.

 **Seth** said that as the 2.13 cycle progresses will bring more information and feedback about the usage. He believes that it is a good start to begin with and they’ll know more as they go through it.

 **Adriaan** agreed and said that he’d love to get some statistics on the usage of the sub-packages.

**Conclusion** They should keep thinking on it, keep sending suggestions and to discuss more on it during the next meeting.
