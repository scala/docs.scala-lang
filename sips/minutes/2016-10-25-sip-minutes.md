---
layout: sip-landing
title: SIP Meeting Minutes - 25th October 2016
---

# Minutes

The following agenda was distributed to attendees:

| Topic | Reviewer |
| --- | --- |
| Discussion of the voting system | N/A |
| [SIP-20: Improved Lazy Val Initialization](http://docs.scala-lang.org/sips/pending/improved-lazy-val-initialization.html) | Sébastien Doeraene |
| [SIP-27: Trailing commas](https://github.com/scala/scala.github.com/pull/533#issuecomment-232959066) | Eugene Burmako |

Jorge Vicente Cantero was the Process Lead and acting secretary of the meeting.

* **Decided to reaccept for review**: SIP-27: Trailing commas
* **Under review**: SIP-20: Improved Lazy Val Initialization

## Date, Time and Location

The meeting took place at 5:00pm Central European Time / 8:00am Pacific Daylight
Time on Tuesday, October 25th, 2016 via Google Hangouts.

Minutes were taken by Jorge Vicente Cantero, acting secretary.

## Attendees

Attendees Present:

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), EPFL
* Iulian Dragos ([@dragos](https://github.com/dragos)), Independent
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), Scala Center
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), EPFL
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend

## Apologies

* Josh Suereth ([@jsuereth](https://github.com/jsuereth)), Google

## Proceedings
### Opening Remarks

After some controversy sprung by the [latest SIP-27
vote](https://github.com/scala/scala-lang/pull/477), the SIP Process Lead
cancelled the vote on the SIP-27: Trailing Commas, and invited the Committee to
discuss new voting rules to help clarify the process voting system.

The issue was caused by a legal void on the rounding of the 70% rule.
Traditionally, votes are not rounded up. However, the SIP Process Lead
took the decision to round up the SIP-27 vote percentage, which was 66%.
This decision was taken in the best spirit of the rule, which was only introduced
to ensure that simple majorities (50%) are not enough for accepting a proposal.

Before the meeting, the SIP Process Lead shared this email with all the
Committee members:

> The majority-plus-two rule sets a concrete threshold and fits the spirit of
> the rule (not having simple majority, but a
> [supermajority](https://en.wikipedia.org/wiki/Supermajority)). The 70% rule is
> too strict, especially for committees that are not big, as ours. After some
> research, we can choose the [two-thirds
> rule](https://en.wikipedia.org/wiki/Supermajority#Two-thirds_vote) used in a
> lot of political parties, parliaments, boards and committees.

### Deciding the voting system

Sébastien starts the discussion pointing out that he would like to have a simple
percentage, without any rounding. Heather argues that this percentage changes
depending on the number of the present Committee Members. Seth comments that
it has been proposed in several online channels that all the Committee members
should vote, even if they cannot attend the meeting. All the Committee agrees on
this, but the main consequence is that the voting period is not predictable
anymore, since there's not a fixed deadline to vote. Martin proposes to choose
this fixed deadline case-by-case.

Martin proposes that there's a meta rule to only accept a proposal if 50% of
all the Committee members vote for it, and then to have another percentage on
the actual vote. Seth, Eugene and Heather don't like this idea. Heather brings
up the issue of abstentions, should they still be considered as no's even if
people are on vacation or cannot vote?. Adriaan says this is a fair concern, and
thinks that there should be a fixed deadline for voting.

All the Committee agrees that with the new rules the Committee wouldn't vote
publicly, because Committee members can notify their vote after the meeting and
before the fixed deadline.

Martin proposes to keep the old rules, the 70% percentage rule. Jorge proposes
to have simpler and more predictable rules, and replace 70% with the two-thirds
rule. Martin comes back to the abstentions point: he doesn't want them to be
considered as no, because with the current rules Committee members could block
the whole decision process. Some Committee members point out that this wouldn't
happen because then the quorum wouldn't be reached. The discussion shifts
towards the quorum point: is it necessary anymore? Heather and Adriaan say that
it is, because it ensures that a reasonable number of Committee members meet to
discuss proposals and convince each other about the pros and cons. All the
Committee finally decides to not consider abstentions as no's. Adriaan, however,
suggests that we should penalize people that abstain too often.

Another system proposed by Martin helps survive the abstention issue mentioned
before. For a proposal to pass, at least 50% of all the Committee 
and two-thirds of all the people voting (not counting abstentions) must accept
it. The quorum rule is kept. After some discussion, the Committee unanimously
votes in favor of the new rules.

### Discussion of SIP-27: Trailing Commas

Eugene describes what happened in the last meeting. Martin asks if there is a
concrete proposal. Jorge says that he thinks that Dale would push for the new
line specialized case. Martin proposes to push for a more concrete proposal
because the specification cannot be so open-ended to properly analyze the
consequences of the suggested changes.

Seth and Adriaan voice their opinions on trailing commas again, they don't agree
this is a problem that should be solved in the language. Martin changes his view
on the subject, and provided that the proposal does no harm to the syntax of the
language and doesn't cause problems, he would accept the change. He also says
that it wouldn't be good to contradict last month's vote on the proposal.
Heather says that she's in favor of trailing commas because makes beginners be
less confused by the syntax and help people get started with the language.
Iulian doesn't like the specialized version, he would prefer a general version.

**Outcome**: All the Committee decides to vote on accepting the proposal again for a final
review with a clear specification of the changes. Seth and Adriaan vote against,
the rest of the Committee except Josh vote in favor of it. According to our new
rules, Josh gets to decide whether the proposal will be readmitted for review or
cancelled (**NOTE**: Josh votes in favor of trailing commas one week after the
meeting). Trailing commas will be reviewed in November.

### Discussion of SIP-20: Improved Lazy Val Initialization

Sébastien comments the changes that Dmitry has introduced to the proposal.
Several new schemes have been added to the proposal based on his experience in
Dotty, in which the championed scheme is already implemented.

There are no clear winner in the case of local lazy vals, but there seems to be
two clear candidates for the non-local lazy vals (B4-general and B6).
Both are faster than the existing implementation in the contended case but B4
general is 4x and B6 is only 2x. However, for the uncontended case B4 general is
30% slower than the existing implementation, while B6 is on par, up to +-5%.
Dmitry recommends the B6 case because it's a *pure* win. Memory-wise, B6 would
have a smaller memory footprint.

Sébastien comments on the increase of the bytecode for the getter of the lazy
val, which is 4x bigger. This could make a difference, although the benchmarks
do not show any negative impact of it (probably because the previous
implementation was bigger than the limits set by the JVM to benefit from
code inlining).

Jorge comments that there's no implementation of this proposal for scalac. This
means that someone should step up and provide such implementation, because
Dmitry does not have time for it. Adriaan comments on the fact that B6 uses
`sun.misc.Unsafe`, which he prefers that the compiler doesn't depend on to run
in other platforms that don't allow it (Google App Engine). Sébastien highlights
that the proposal could use var handles, which are planned to be shipped on Java
9.

Heather proposes to mark this proposal as dormant, since it's lacking an
implementation. She wants to let other people claim its ownership and provide an
implementation if they care about this issue.

**Outcome**: The Committee agrees to mark the proposal as dormant and let
someone pick it up and provide an implementation. Ideally, this implementation
should run in Java 8 and don't depend on var handles. The SIP Process Lead will
wait some time to receive another candidate from the current author, Dmitry. If
he doesn't propose anything, the SIP will be marked as dormant.

## Closing remarks
See you next time!
