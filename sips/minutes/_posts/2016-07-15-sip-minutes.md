---
layout: sip-landing
title: SIP Meeting Minutes - 13th July 2016
---

# Minutes II

The following agenda was distributed to attendees:

| Topic | Reviewer |
| --- | --- |
| [Discussion of the new SIP process](http://docs.scala-lang.org/sips/sip-submission.html) | Jorge Vicente Cantero |
| [SIP 25 - Trait parameters](http://docs.scala-lang.org/sips/pending/trait-parameters.html) | Adriaan Moors |
| [SIP 26 - Unsigned Integer Data Types](https://github.com/scala/slip/pull/30) | Martin Odersky |
| [SIP 22 - Async](http://docs.scala-lang.org/sips/pending/async.html) | Eugene Burmako |
| [SIP 20 - Improved lazy val initialization](http://docs.scala-lang.org/sips/pending/improved-lazy-val-initialization.html) | Sébastien Doeraene |
| [Trailing commas SIP](https://github.com/scala/scala.github.com/pull/533) | Eugene Burmako |

Jorge Vicente Cantero was the Process Lead and acting secretary of the meeting.

The following proposals were numbered:

* SIP-26: Unsigned Integer Data Types
* SIP-27: Trailing commas

(When a SIP is numbered, it can be thought of as a first-round of acceptance.
That is, the committee has voted in favor of the changed being accepted into
Scala in theory, so long as all potential design and implementation flaws are
eventually addressed and worked through. Typically, the committee will raise a
number of important concerns about the SIP that must be addressed, as next
steps, ideally before the next meeting of the SIP committee.)

The following other proposals were discussed:

* SIP-22: Async (postponed)
* SIP-20: Improved lazy val initialization
* SIP-25: Trait Parameters

Some other library proposals were evaluated and the committee gave feedback to
the authors.

## Date, Time and Location

The meeting took place at 5:00pm Central European Time / 8:00am Pacific Daylight
Time on Wednesday, July 13th, 2016 via Google Hangouts.

Minutes were taken by Jorge Vicente Cantero, acting secretary.

## Attendees

Attendees Present:

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), Scala Center
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), EPFL
* Andrew Marki ([@som-snytt](https://github.com/som-snytt)), independent
* Josh Suereth ([@jsuereth](https://github.com/jsuereth)), Google
* Dmitry Petrashko ([@DarkDimius](https://github.com/DarkDimius)), as a guest
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead

## Guests

* Dmitry Petrashko ([@DarkDimius](https://github.com/DarkDimius)), EPFL (guest)

## Proceedings

### Opening Remarks

As acting Process Lead, Jorge Vicente Cantero conducted the meeting, made the
opening remarks, and introduced the guest Dmitry, who was present to help
discuss the proposal for an improved lazy val initialization (SIP-20).

### Scala Improvement Proposals

#### Proposal SIP-25: Trait Parameters proposed by Martin Odersky

Adriaan Moors, as the assigned reviewer of this SIP, quickly introduced the
proposal. The proposal helps to abstract over traits by introducing type
parameters, a feature that was only possible in classes.

Adriaan points out that it needs a little bit more of work. He generally advises
to give more details about how the proposed changes interact with other
features. In concrete, he'd like to know what the modifiers mean, and what would
happen if there's an implicit modifier. On a side note, he thinks that there
should be some guidelines on how the proposal impacts programmers and what
technical issues are addressed. He thinks that it would be great to see an
implementation, as the one in Dotty. He considers this proposal is a good
candidate for 2.13.

Martin and Heather also discuss what the role of a reviewer is. Jorge clarifies
that technical discussions should take place in the meeting.

**Outcome**: The board agreed to schedule the next iteration of the evaluation
process in 6 months, since there's no implementation yet and the authors need
time to produce one.

#### Proposal SIP-26: Unsigned Integer Data Types by Denys Shabalin and Sébastien Doeraene

Martin is the reviewer of this SIP. He's on the fence of accepting this
proposal, he would prefer to see it in the platform as a library, since putting
it in the core would require too much work and he's unsure if that would be a
priority.

Sébastien, one of the authors, points out that placing it as a library defeats
the purpose of the SIP (because cooperative equality would not exist), which is
to allow the native platforms to benefit from it (Scala.js and Scala Native). He
explains that, in order to make it a library, he would need at least two SIPs to
make it interact correctly with Scala.js (the value classes formalization is not
suitable for what he wants to address).

Dmitry, Martin and Sébastien start to discuss about the performance of other
alternatives that would need to change the representation of scala number.
Adriaan and Josh agree that the proposal would be better as a library.

**Outcome**: The board voted; all were in favor of giving it a number. Jorge asks
the authors to make a PR to the SIP website repo. The next iteration would be in
September because Sébastien is on vacation in August. He needs to prepare its
evaluation in September by tweaking the changes in BoxesRunTime.scala so that
the performance of existing codebases does not suffer any degradation, and so
that the performance of non-unsigned integer comparisons is not affected (or
very little) by the unrelated addition of unsigned integers in the codebase.

#### Proposal SIP-22: Async proposed by Philipp Haller and Jason Zaugg
Eugene Burmako does a thorough description of the SIP and describes its
historical background. He roughly talks about the implementation, which uses
macros, and he's impressed of its quality in the design and implementation.

Other languages like F#, C# and JS have something similar. There's a restriction
that the functionality cannot be used inside a try catch. Eugene reveals that
the authors have asked for a timeout to improve the implementation and the
design. He recommends them to add more documentation as in C# and suggests to
close it and wait until the authors resubmit it.

Jorge and Heather discuss about what are the differences between postponing and
marking a SIP as dormant. The idea is that SIPs marked as dormant are the ones
that have been evaluated, but there hasn’t been any activity in two months.
Postponing a SIP is done when we know beforehand that some constraints need to
be resolved before resuming its evaluation.

**Outcome**: The Process Lead postpones it until the authors want to decide to
revisit the support of async/await in try/catch blocks. When that's considered,
this SIP should be reopened and it should see another round of discussion.

#### Proposal SIP-20: Improved lazy val initialization presented
Sébastien reviews the SIP and asks Dmitry, present in the meeting, to correct
him if he's wrong. He agrees that the SIP is desirable but he's unsure about the
benchmarks and which of the proposals is faster. Dmitry explains that the
benchmarks are in the repository. Sébastien also points out that there's an
implementation missing for scalac, and recommends the author to include more
documentation..

**Outcome**: For the next iteration, the reviewer suggests that the SIP should
have an updated specification, implementation and benchmarks. The Process Lead
schedules the next iteration by October 2016.

#### Proposal SIP-27: Trailing Commas
Eugene Burmako, who also reviewed this recently submitted SIP, explains what the
proposal addresses. The proposal seeks to introduce changes in the syntax of the
language that will not error when commas are placed in concrete valid places. He
makes the point that it has several benefits; for instance, diffs in github will
only show one changed line when a new element is added in a list whose elements
are placed in independent lines.

He also discusses that there are some issues with the interaction of Tuple1 and
pretty printing. The proposal is minor but addresses day-to-day annoyances.
Martin fears that this proposal would interfere with another important future
SIP that will integrate generic programming with Scala. Adriaan doesn't like the
idea. Josh proposes to unify tuples with other features of the language, like
parameters lists and the apply methods.

Adriaan wants to wait for the proposal of how to do generics over tuples, and
integrating hlists with Scala, which he thinks it’s the really important
proposal.

**Outcome**: 2 people abstain, 3 people vote in favor of it. Josh's connectivity
drops out, and he's not able to vote. The Process Lead decides to give it a
number. Authors are asked to prepare for the first iteration of the evaluation
process in August. This involves exploring interactions with other language
features by exhaustively enumerating the locations in the grammar where trailing
commas may be used.

### SLIPs
Jorge asks the SIP committee to provide  feedback to the authors to speed up the
SLIP process in the future.

* JSON AST: No news from the last discussion in the slip repo. It's been
integrated into Play and sbt server 1.0. The committee considers that it's a
prime candidate for the platform.
* Extensions of Futures and Promises: the committee calls for an implementation.
This SLIP will be addressed by the next SLIP committee.
* Either monadic bias: it was merged one day before by the Lightbend team. Therefore, this SIP is both accepted and merged.
* scala.io.Target: Martin proposes to delay it until the SLIP committee decides
how the platform would look like. Then, they will take care of it.
* Redesigning collections views: Jorge explains what Josh, who is author of the
SLIP, proposes for its design:
	* Iterator-based API (supports join and efficient deferred operation with one time parse)
	* Transducer-based API (supports non-iterable collections and efficient deferred operations, but doesn’t support co-iteration, i.e. efficient join).
	Martin and Dmitry discuss that iterators are more powerful, and are looking forward to an implementation. Therefore, authors are asked to provide one for the first iteration in the SLIP meeting.

## Other business
Jorge confirms that there will be a new SLIP process proposed for the middle of
August.

## Closing remarks
See you next time!
