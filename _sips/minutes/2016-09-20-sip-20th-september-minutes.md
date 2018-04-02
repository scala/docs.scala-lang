---
layout: sips
title: SIP Meeting Minutes - 20th September 2016

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

| Topic | Reviewer |
| --- | --- |
| [SIP-NN: Scala Meta SIP](https://github.com/scala/docs.scala-lang/pull/567) | Iulian Dragos and Josh Suereth |
| [SIP-21: Spores](http://docs.scala-lang.org/sips/spores.html) | Martin Odersky |
| [SIP-26: Unsigned Integer Data Types](https://github.com/scala/slip/pull/30) | Martin Odersky |
| [SIP-27: Trailing commas](https://github.com/scala/docs.scala-lang/pull/533#issuecomment-232959066) | Eugene Burmako |

Jorge Vicente Cantero was the Process Lead and acting secretary of the meeting.

* **Accepted**: SIP-27: Trailing commas
* **Rejected**: SIP-26: Unsigned Integer Data Types
* **Under review**: SIP-21: Spores
* **Numbered**: SIP-28: Inline (part of Scala Meta SIP)
* **Numbered**: SIP-29: Meta (part of Scala Meta SIP)

## Date, Time and Location

The meeting took place at 5:00pm Central European Time / 8:00am Pacific Daylight
Time on Tuesday, September 20th, 2016 via Google Hangouts.

Minutes were taken by Jorge Vicente Cantero, acting secretary.

## Attendees

Attendees Present:

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), EPFL
* Iulian Dragos ([@dragos](https://github.com/dragos)), Independent
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), Scala Center
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), EPFL
* Josh Suereth ([@jsuereth](https://github.com/jsuereth)), Google
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead

## Guests

* Dale Wijnand ([@dwijnand](https://github.com/dwijnand)), author of SIP-27

## Apologies

* Andrew Marki ([@som-snytt](https://github.com/som-snytt)), independent
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend

## Proceedings
### Opening Remarks

As acting Process Lead, Jorge gave the welcome to Iulian Dragos, who has just
joined the Committee. He's a natural fit for the Committee, because of
his historical significance in the evolution of Scala and his vast experience in
the current Scala compiler.

Following to his introduction, he described the main points to the agenda and
proceed to introduce the discussions.

### Discussion of SIP-NN: Scala Meta SIP

Josh and Iulian are the reviewers of the proposal. Josh starts explaining what
the proposal is about. Scala Meta is split into two main parts: inline
and meta. The purpose of this meeting is to number the proposal and kick start a
previous discussion. Jorge proposes to vote. Iulian proposes to consider that
inline and meta should be separate SIPs.

Seth asks for further information on the interdependency. Sébastien answers that
there are two aspects to this.

Firstly, inline is necessary for meta blocks to see ASTs of method arguments.
Without inline, meta blocks would only see formal parameters of the enclosing
method. Secondly, inline precaches method arguments in temporary variables, and
that is undesirable for meta, because, again meta needs to see ASTs of actual
arguments, not references to variables, where these arguments are
precached. Eugene claims that we could see inline as just a mechanism to get the
right hand side of a method definition and puts it in the call-site. Eugene also
clarifies that the dependency between the two is dual: inline also depends on
meta, because inline also accounts for the presence of meta. Martin is not sure
if that's completely true; his inline implementation in Dotty (that doesn't
support meta yet) doesn't feature this dependency.

Sébastien claims that one could argue that inline does not depend on meta, and
that the requirement of recursively inlining arguments and method definitions
before the macro expansion is unique to meta, not inline.

Josh understands that both parts are specially hooked together so that their
interaction has concrete results. Martin argues that it would make sense to
split both proposals and study them independently if we can give some guarantees
on the finally-accepted proposals. Martin proposes to have two different
proposals but to accept inline only when we know the future of meta. Eugene
votes in favor conditionally, he emphasizes that the meta-inline dependency
should be honored in the proposals review. Everyone in the meeting agrees.

**Outcome**: The Committee will review two independent SIPs out of the original
Meta proposal: inline and meta. All the attendees agree unanimously. They are
numbered SIP-28 and SIP-29 respectively.

### Discussion of SIP-21: Spores

Martin introduces the spores proposal and its history, that dates back to 2013.
He thinks that spores are very useful for controlling the environment of a
function, but he doesn't think that they should go into the compiler, as they
are already implemented as a macro.

Sébastien points out that the proposal needs to be updated. A major point of
contention for the spores implementation is that 2.12 introduces Scala SAM
types, and implicit conversions between functions and spores will not kick in
because the right hand side will automatically get the spore type. Removing this
limitation is fairly easy, though: just introduce an abstract member in the
spore class definition to avoid the automatic conversion to a SAM type. This has
no performance hit on the eventual representation of a spore into JVM classes,
since JVM SAM types cannot be used.

Heather joins the conversation. Jorge explains the current discussion and Martin
asks her what's her opinion on not including spores into the compiler. She
says that could be left out and she mentions that spores can only provide a
shallow analysis, a "skin-deep" check of what's captured.  Pickling provided a
transitive way of checking the spores contract, but the proposal doesn't take it
into account. Everyone agrees that the proposal should be more general and only
focus on ways to control the captured environment. Sébastien proposes a
typeclass-based way of overcoming the current limitations of spores, but it's
yet to be seen its feasibility in practice. Martin suggests that as the
Committee should analyze spores as it is right now. Heather emphasizes that the
current design is not very useful, so she asks whether we should keep it as such
or try to improve it.

Martin encourages to improve the spores proposal, but suggests to close the
proposal because it's not yet ready. Heather proposes to give the proposal
another iteration to update and improve it.

**Outcome**: The spores proposal will have another iteration in two months
(November). By then, Heather is asked to update the proposal and try to find out
a way to provide more thorough checks (spores transitivity).

### Discussion of SIP-26: Unsigned Integer Data Types

Sébastien introduces his updates on the proposal. He's tried hard to remove the
performance regression in his implementation, but he hasn't found a way. He
describes that the implementation is still 6% slower because of performance hits
in the hashCode and equals implementation of a case class. To work around this
issue, two things are required:

  * Changing the underlying implementation of byte and short ints.
  * Making the super class of unsigned integer extend *java.lang.Number*

The second option is not feasible because unsigned numbers are AnyVals, and they
can only extend `Object`. Working around this in the backend is, in Sébastien's
opinion, not an exciting adventure to embark on: a lot of patches and quirky
fixes are required in the compiler. Sébastien, recognizing his unability to fix
the issue, recommends to reject the proposal.

Josh needs to leave. Eugene wonders if these problems are only JVM-specific.
Sébastien replies that both yes and no, and he confirms that unsigned integers
will be implemented in Scalajs alone, so the implementation won't be
platform-independent. Eugene is interested in knowing if there will be any code
duplication in the implementation, and Sébastien doesn't think so, since Scala
Native implements unsigned integer in a different way.

**Outcome**: The proposal is rejected unanimously.

### Discussion of SIP-27: Trailing commas

Jorge welcomes the guest Dale Wijnand, author of the trailing commas proposal.
Jorge also expects the discussion about the proposal to shed some light on its
future status, be it rejected, accepted or given another iteration.

Eugene introduces the updates on the proposal. Dale has asked several questions
to the committee, the most important being if they would accept trailing commas
only for multi-line comma separated lines. The Committee focuses on this main
question, although some other questions about the trailing commas specification
are on the table.

Sébastien points out that it's a good compromise, he personally likes it. He
compares trailing commas to the semantics of semicolons in Scala. Martin is not
convinced by the specialized version and makes the points that trailing commas
wouldn't be like semicolons, because you can write several semicolons together,
when the equivalent in trailing commas should emit an error. Martin thinks that
it messes with another fundamental concept of the language and doesn't think it
deserves to drop all the fundamental ideas for good language design. He proposes
that trailing commas should be implemented in the sbt parser if the main use
case is sbt.

Heather is starting to see the IDE argument more favorably, and she is on the
fence about the proposal. She invites Dale to interject about the "IDE" argument
(namely, that IDEs should make easier to deal with trailing commas). Dale thinks
that Scala gives a lot of syntactic sugar and ease to developers by design, in
its compiler. He encourages solving editing problems into the compiler as well,
since they greatly affect developers' life.

Iulian is not in favor for the multi-line specialized case, he would certainly
use the feature but he doesn't think it should be only for the multi-line case.
He points out that Scala had this feature a while ago, and then it was removed.
He sees the clear benefits of the proposal (configuration files, for instance),
but he's still against the specialized case version.

Seth is on the fence about this proposal as well. He leans against it, but not
strongly against it. He says it sorrowfully, because he considers that Dale's
work has been great and that the problem he tries to solve is real.

Jorge, seeing everyone's reactions, proposes to vote on the proposal. In his
view, it doesn't make sense to give it another iteration and make everyone
spend more time on it. At this point, the Committee doesn't have more meaningful
feedback to improve the proposal, and decisions need to be made.

4 people of the Committee voted yes, 2 no (Martin and Seth). Martin needs to
leaves the room. After the acceptance of the proposal, the Committee proceeds to
decide whether the specialized-case version should be the accepted one. Everyone
in the meeting votes yes. At the time of the meeting, the Committee doesn't know
if Martin will veto the proposal (as the lead language designer of Scala, he has
this right).

**Outcome**: Martin does not veto the proposal and trailing commas are accepted.
The Committee proposes the Compiler team to include trailing commas in a future
Scala release.  The concrete version will be suggested by the compiler
maintainers soon.

## Closing remarks
See you next time!
