---
layout: sips
title: SIP Meeting Minutes - 10th August 2016

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

| Topic | Reviewer |
| --- | --- |
| [SIP-12: Uncluttering Scala's syntax for control structures](http://docs.scala-lang.org/sips/uncluttering-control.html) | Seth Tisue |
| [SIP-16: Self-cleaning macros](http://docs.scala-lang.org/sips/self-cleaning-macros.html) | Eugene Burmako |
| [SIP-21: Spores](http://docs.scala-lang.org/sips/spores.html) | Martin Odersky |
| [SIP-23: Literal-based singleton types](http://docs.scala-lang.org/sips/42.type.html) | Adriaan Moors |
| [SIP-24: Repeated by-name parameters](http://docs.scala-lang.org/sips/repeated-byname.html) | Andrew Marki |
| [SIP-27: Trailing commas](https://github.com/scala/docs.scala-lang/pull/533#issuecomment-232959066) | Eugene Burmako |

Jorge Vicente Cantero was the Process Lead and acting secretary of the meeting.

The following proposals were rejected:

* SIP-12: Uncluttering Scala's syntax for control structures
* SIP-16: Self-cleaning macros

The following proposals will have a follow-up evaluation:

* SIP-23: Literal-based singleton types
* SIP-27: Trailing commas

## Date, Time and Location

The meeting took place at 5:15pm Central European Time / 8:15am Pacific Daylight
Time on Wednesday, July 13th, 2016 via Google Hangouts.

Minutes were taken by Jorge Vicente Cantero, acting secretary.

## Attendees

Attendees Present:

* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), EPFL
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), Scala Center
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), EPFL
* Andrew Marki ([@som-snytt](https://github.com/som-snytt)), independent
* Josh Suereth ([@jsuereth](https://github.com/jsuereth)), Google
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead

## Apologies

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL

## Proceedings
### Opening Remarks

As acting Process Lead, Jorge Vicente Cantero conducted the meeting, and made
some opening remarks:

* No abstentions are allowed, abstentions count as 'no's.

* The quorum is 2/3 out of the committee. The quorum for this meeting is
  reached.

### Discussion of SIP-12: Uncluttering Scala's syntax for control structures

The original proposer Martin Odersky is not present, so he can't weigh in. Seth
Tisue presents the main points of his review and kick starts the discussion.

Seth Tisue presents the main points of his review:

* There is no clear consensus that this change is desirable.
* The major downsides are that it makes Scala look and feel noticeably less
like Java and other C-like languages, significant migration pain for
users would be involved, and it's unclear that the actual benefits of the
change are really that big.

Seth also points out that the community isn't really clamoring this change,
there seems to be no interest.

In the ensuing discussion, there is a bit of confusion over whether the old
syntax would continue to be supported, and if so, if adding more ways to
express the same thing is bad. The proposal recommends supporting the old
syntax temporarily, and deprecate it after some concrete period.

The Committee sees no added value in the proposal, and all seem to be against
it. Adriaan wants only one way to do things, and avoid diversity of syntax
options.  Josh points out that second ways for specifying constructs
are useful under concrete scenarios, but not in this one. Andrew proposes to put
the feature under -Y (experimental flag) as a starting point. Heather questions
the utility of such a syntax change. The committee discusses about the parens
and braces differences.

Jorge and Josh point out that in addition to the obvious migration pain of
users needing to update their code, there would be pain for the makers of tools
such as IDEs and the proposed code-rewriting tool. Adriaan says that even if an
automatic code-writing tool existed, you still have the universal pain of
having the needed changes cluttering up the version control history of every
Scala project.

**Outcome**: The committee votes unanimously to reject the change. The
conclusion is that there is not a clear benefit for it and the required
invested time and efforts would be too high.

### Discussion of SIP-16: Self-cleaning macros

Eugene Burmako, reviewer and author of the proposal, acknowledges the value of
macros in the language and how useful they are for the Scala community to build
their tools and frameworks. He thinks that macros have been a successful
experiment, but one that needs to end. He then points out some of the issues
with macros (IDE support and dependency on Scala Reflection, which he considers
overdesigned for its purpose).

As these are problems present in the very foundations of macros, he proposes to
reject the SIP and commits to write up a new proposal based on [Scala
Meta](http://scalameta.org/), the successor of the old Scala macros, redesigned
from the ground up to overcome the current metaprogramming shortcomings.

Josh agrees that macros are very useful but, as in their existing form, not
really what the Committee wants long-term. The Committee discusses how to
announce this decision, Adriaan is worried that people will believe that macros
are going away.  Everybody agrees that the communication of this decision should
be made carefully.

Andrew proposes to use the same number proposal for the upcoming Scala Meta
proposal. Jorge thinks that it would make more sense to create a new proposal
with a new number, since they will greatly differ in design.

**Outcome**: The board votes and the proposal is therefore rejected unanimously.
A new Scala Meta proposal is coming soon.

### Discussion of SIP-27: Trailing Commas

Eugene Burmako thanks Dale, the author of the proposal, by the provided
feedback from the last meeting's discussion. Dale did a detailed analysis of the
required feature interaction for trailing commas. Eugene explains the concerns
of the last meeting and encourages the Committee to have a look at the recent
comments provided by Martin on the GitHub discussion.

Heather reads Martin's reply. Martin says that we need to be careful with this
proposal, because it could disable future support for `HList`s (heterogeneous
lists, tuples of unbounded sizes). This proposal is of primary concern for both
Martin and other people in the Committee. He proposes to accept trailing
commas just in tuples to avoid overshooting.

Adriaan points out that this is a problem that IDEs should solve, not the
design of programming languages. He doesn't share the motivation of this
change. Seth says that it's not worth it to accept this change only in tuples,
because the major benefit would come in parameter lists. Andrew says that it
would also be important to adopt trailing commas in import syntax and agrees
with Adriaan.

Josh wants trailing commas, but if he needs to judge his utility he wants to
know more about the HList proposal. He also thinks that including this change
would be a huge win for sbt. Adriaan proposes to include trailing commas only
in sbt, instead of the Scala parser. Josh states it's physically possible, but
he's not sure the sbt team would welcome such change.

The Committee engages in more discussion about how cherry-pick parts of the
proposal or study it further.

**Conclusion**: The Committee asks Dale to explicitly summarize the potential
conflicts with tuple syntax, review the initial [HList proposal in
Dotty](https://github.com/lampepfl/dotty/issues/964) to figure out potential
conflicts with his proposal. Eugene also proposes Dale to consider whether the
Committee can salvage non-controversial parts of this proposal and reduce this
SIP just to them, as well as discussing the utility of having two ways of doing
the same thing.

### Discussion of SIP-23: Singleton literal-based types

Adriaan explains what the proposal is about. He's happy that George Leontiev's
proposal is getting to the finish line by Miles. He wants to decouple more the
design and implementation of the proposal, e.g. removing implementation details
in the original SIP. Adriaan will also want the authors to better work out the
interaction with other Scala features, like the equality against the `Any` type,
and `asInstanceOf`. He points out that quasiquotes should eventually be
addressed.

Josh needs to leave the meeting and transfers his vote to Adriaan. The
Committee agrees to put this under review for the next meeting, waiting for the
author's feedback.

**Outcome**: The proposal is under review until the next meeting. Adriaan asks
the authors to separate the spec and the implementation and address some
technical issues in the current implementation. More information on Adriaan's
review can be found in [the original GitHub proposal](https://github.com/scala/docs.scala-lang/pull/346#issuecomment-240029772).

## Closing remarks
See you next time!
