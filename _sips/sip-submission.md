---
layout: sips
title: SIP Specification and Submission
---

A **SIP** (_Scala Improvement Process_) is a process for submitting changes to
the Scala language. Its main motivation is to become the primary mechanism to
propose, discuss and implement language changes. In this process, all changes to
the language go through design documents, called Scala Improvement Proposals
(SIPs), which are openly discussed by a committee and only upon reaching a
consensus are accepted to be merged into the Scala compiler.

The aim of the Scala Improvement Process is to apply the openness and
collaboration that have shaped Scala's documentation and implementation to the
process of evolving the language. This document captures our guidelines,
commitments and expectations regarding this process.

## Why write a SIP?

SIPs are key to making Scala better for the good of everyone. If you decide to
invest the time and effort of putting a SIP forward and seeing it through, your
efforts and time will shape and improve the language, which means that your
proposal may impact the life of a myriad of developers all over the world,
including those on your own team. For many, this aspect alone can be quite
worthwhile.

However, it's important to note that seeing a SIP through to its conclusion is
an involved task. On the one hand, it takes time to convince people that your
suggestions are a worthwhile change for hundreds of thousands of developers to
accept. Particularly given the sheer volume of developers that could be affected
by your SIP, SIP acceptance is conservative and carefully thought through.
Typically, this includes many rounds of discussion with core Scala maintainers
and the overall community, several iterations on the design of the SIP, and some
effort at prototyping the proposed change. Often, it takes months of discussion,
re-design, and prototyping for a SIP to be accepted and included in the Scala
compiler. It is, therefore important to note that seeing a SIP through to its
conclusion can be time-consuming and not all SIPs may end up in the Scala
compiler, although they may teach us all something!

If you’re motivated enough to go through this involved but rewarding process, go
on with writing and keep on reading.

## What's the process for submitting a SIP?

There are four major steps in the SIP process:

1. Initial informal discussion (2 weeks)
2. Submission
3. Formal presentation (up to 1 month)
4. Formal evaluation (up to 6 months)

### Initial informal discussion (2 weeks)

Before submitting a SIP, it is required that you perform necessary preparations:

Discuss your idea on the [Scala Contributors Page](https://contributors.scala-lang.org/) (currently, we suggest
cross-posting on
[Scala Improvement Process](https://contributors.scala-lang.org/c/sip) and
[Language Design](https://contributors.scala-lang.org/c/language-design). This
may change in the future.) Create a topic that starts with “Pre-SIP” and briefly
describe what you would like to change and why you think it’s a good idea.

Proposing your ideas on the mailing list is not an optional step. For every
change to the language, it is important to gauge interest from the compiler
maintainers and the community. Use this step to promote your idea and gather
early feedback on your informal proposal. It may happen that experts and
community members may have tried something similar in the past and may offer
valuable advice.

Within two weeks after your submission of the pre-SIP to the mailing list, the
Process Lead will intervene and advise you whether your idea can be submitted as
a SIP or needs more work.

### Submission

After receiving the green light from the Process Lead, you can write up your
idea and submit it as a SIP.

A SIP is a Markdown document written in conformance with the [process template](https://github.com/scala/docs.scala-lang/blob/master/_sips/sip-template.md).
It ought to contain a clear specification of the proposed changes. When such
changes significantly alter the compiler internals, the author is invited to
provide a proof of concept. Delivering a basic implementation can speed up the
process dramatically. Even compiler hackers find very difficult to predict the
interaction between the design and the implementation, so the sooner we have an
evidence of a working prototype that interacts with all the features in Scala,
the better. Otherwise, committee members may feel that the proposed changes are
impossible and automatically dismiss them. If your changes are big or somewhat
controversial, don’t let people hypothesize about them and show results upfront.

A SIP is submitted as a pull request against [the official Scala website
repo](https://github.com/scala/docs.scala-lang). Within a week of receiving the
pull request, the Process Lead will acknowledge your submission, validate it and
engage into some discussions with the author to improve the overall quality of
the document (if necessary).

When you and the Process Lead agree on the final document, it is formally
accepted for review: assigned a reviewer and scheduled for formal presentation.

### Formal presentation (up to 1 month)

During the next available SIP Committee meeting, the appointed reviewer presents
the SIP to the committee and kick starts the initial discussion.

If the committee agrees that following through the SIP is a good idea, then the
following happens:

1. The SIP is assigned a number.
2. The SIP pull request is merged into the official Scala website repo, and the
merged document becomes the official webpage of the proposal.
3. An issue to discuss the SIP is opened at the official Scala website repo. Then,
the reviewer submits the initial feedback from the committee.
4. An implementation is requested (if not already present).

Otherwise, the SIP is rejected. The reviewer submits the collected feedback as a
comment to the pull request, and the pull request is closed.

### Formal evaluation (up to 6 iterations)

Evaluation of a SIP is done in iterations. The maximum number of iterations is
six. These iterations take place in the SIP meetings and are usually monthly.
However, they can last longer, in which case the author has more time to
implement all the required changes.

The committee decides the duration of the next iteration depending upon the
feedback and complexity of the SIP. Consequently, authors have more time to
prepare all the changes. If they finish their revision before the scheduled
iteration, the Process Lead will reschedule it for the next available meeting.

During every iteration, the appointed reviewer presents the changes (updated
design document, progress with the implementation, etc) to the SIP Committee.
Based on the feedback, the SIP is either:

1. Accepted, in which case the committee asks the compiler maintainers to
   indicate the earliest version of Scala that can include the language change.
2. Rejected, in which case the SIP is closed and no longer evaluated in the
   future.
3. Under revision, in which case the author needs to continue the formal
   evaluation and address all the committee's feedback. Thus, the follow-up
   discussion is scheduled for the next iteration.
3. Postponed, in which case the committee does not evaluate the proposal anymore
   and sets it aside under some conditions are met.  Then, the SIP will be
   resubmitted. This situation happens when proposals entirely depend on another
   pending proposals and need their admission. In such cases, the dependent
   proposal is postponed until the Committee votes on the other one.

If no changes have been made to a SIP in two iterations, it’s marked as dormant
and both the PR and issue are closed. Dormant SIPs can be reopened by any
person, be it the same or different authors, at which point it will start from
the formal evaluation phase.

### Merging the proposal

If the SIP is accepted, the committee will propose a release date to the
compiler maintainers, where the role of the committee ends. Accepted SIPs will
then be merged under a flag. When SIPs introduce intricate changes and they
cannot be merged under a flag, the compiler maintainers will merge it directly.

## Structure of the process

The SIP process involves the following parties:

1. The SIP Author(s)
2. The Process Lead
3. The SIP Committee

### The SIP Author(s)

Authors are responsible for building consensus within the community and
documenting dissenting opinions before the SIP is officially discussed by the
SIP Committee. Their goal is to convince the committee that their proposal is
useful and addresses pertinent problems in the language as well as interactions
with already existing features. Authors can change over the life-cycle of the
SIP.

### The Process Lead

The Process Lead is the responsible of the smooth running of SIPs and SLIPs. He
or she appoints the committee members, calls the meetings monthly, assigns new
proposals to the members, and ensures that all of them are discussed within a
short period of time.

### The SIP Committee

The SIP Committee is an experienced group of people with knowledge of the
compiler internals, responsible for the strategic direction of Scala. Members
are tasked with (a) communicating with the community, (b) weighing in pros and
cons of every proposal, and (c) accepting, postponing or rejecting the proposal.

Committee members should be either individuals responsible for a specific part
of the Scala codebase, committers or contributors of the Scala compiler.
Exceptionally, members may also be important representatives of the community
with a high technical knowledge to understand the implications of every proposal
and participate into the discussions. New members are elected by existing
members of the SIP Committee, based on their expertise and involvement in the
community.

The current committee members are:

- Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
- Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
- Guillaume Martres ([@smarter](https://github.com/smarter)), EPFL
- Heather Miller ([@heathermiller](https://github.com/heathermiller)), Carnegie Mellon University
- Iulian Dragos ([@dragos](https://github.com/dragos)), Triplequote
- Josh Suereth ([@jsuereth](https://github.com/jsuereth)), Google
- Miles Sabin ([@milessabin](https://github.com/milessabin)), independent
- Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
- Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), Scala Center

The current Process Lead is:

- Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Scala Center

### Reviewers

The Process Lead assigns every proposal to a member of the committee, who
becomes the reviewer. The main tasks of the reviewer are the following:

1. Discuss unclear points with the authors,
2. Help them address their issues and questions,
3. Provide them feedback from the discussions in the meetings, and
4. Explain the latest progress in every meeting.

### SIP meetings

SIP meetings are scheduled monthly by the Process Lead, and require a quorum of
two-thirds (2/3) of the committee members. If the quorum is not reached the
meeting is rescheduled.

### Voting

All SIP Committee members vote. They can either vote in the meeting or by
casting their vote via email to the SIP Process Lead before the set deadline.

SIP Committee members can vote "in favor", "against" or "abstain".

For a SIP to be accepted, the following three requirements must be met:

- At least 50% of the committee members vote in favor.
- There are at least two-thirds "in favor" versus "against" votes.
- Martin Odersky does not veto it.

An alternative way to think of the two-thirds requirement is that the number of
votes in favor must be at least twice the number of votes against. Abstentions
are excluded in calculating a two-thirds vote.

Note that, when calculating the lower bound, numbers round up. Therefore for a
committee of 9 members, at least 50% means at least 5 members.

The deadline to vote a proposal is decided on a case-by-case basis. The deadline
will be decided by the committee members present at the last meeting and the SIP
Process Lead, and will be made public right after the meeting.

#### Examples

Several voting situations are explained next.

All of them assume that there are 9 committee members.  The 50% requirement
requires at least 5 members to vote in favor.  We also assume that Martin does
not veto them.

| In favor | Against | Abstentions | Voting members |    Result    |
| -------- | ------- | ----------- | -------------- | ------------ |
|     6    |    2    |      1      |        8       |   Accepted   |
|     5    |    3    |      1      |        8       | Not Accepted |
|     5    |    2    |      2      |        7       |   Accepted   |

In the first situation, the proposal is accepted because 6 is both greater than
the 50% (5) and more than twice the votes against (2).  In the second situation,
the proposal meets the 50% requirement but fails the two-thirds requirement
since 5 is less than twice the number of votes against, 3, therefore the
proposal is not accepted.  In the third situation, the proposal is accepted
because 5 is equal to 50% of all the committee members and is greater than twice
the number of votes against (2).

### Responsibilities of the members

- Review the proposals they are assigned to. The Process Lead will always notify
them two weeks in advance, at minimum.
- Play a role in the discussions, learn in advance about the topic if needed, and
make up their mind in the voting process.
- Decide which utilities should be inside the core module and are required by the
compiler. The goal is to shrink it over time, and, where possible, move modules
to the platform, that will be managed by the SLIP process.

### Guests

Experts in some fields of the compiler may be invited to concrete meetings as
guests when discussing related SIPs. Their input would be important to discuss
the current state of the proposal, both its design and implementation.

## Proposal states

The state of a proposal changes over time depending on the phase of the process
and the decisions taken by the committee. A given proposal can be in one of
several states:

1. **Validated:** The Process Lead has validated the proposal and checked that
meets all the formal requirements.
2. **Numbered:** The committee agrees that the proposal is a valid document and
it’s worth considering it. Then, the Process Lead gives it a number.
3. **Awaiting review:** The proposal has been scheduled to be reviewed for a
concrete date.
4. **Under review:** Once the author has delivered a new version, the proposal will
be under review until the next available SIP meeting takes place.
5. **Under revision:** Authors are addressing the issues pinpointed by the
committee or working on the implementation.
6. **Dormant:** When a SIP has been under revision for more than two iterations
   and no progress has been made, the Process Lead will mark it as dormant (note
   that the committee does not have such privilege). This status means that the
   Process Lead will not assign its review in future meetings until authors
   provide the requested feedback or progress. Also, authors can also mark their
   proposals as dormant, and they are encouraged to do so if they think they
   will not have time for their update.
7. **Postponed:** The SIP has been postponed under some concrete conditions. When these
are met, the SIP can be resubmitted.
8. **Rejected:** The SIP has been rejected with a clear and full explanation.
9. **Accepted:** The SIP has been accepted and it’s waiting for the merge into the
Scala compiler.

## How do I submit? ##

The process to submit is simple:

* Fork the Scala documentation repository, [https://github.com/scala/docs.scala-lang](https://github.com/scala/docs.scala-lang).
* Create a new SIP file in the `_sips/sips/`. Use the [S(L)IP template](https://github.com/scala/docs.scala-lang/blob/master/_sips/sip-template.md)
  * Make sure the new file follows the format:  `YYYY-MM-dd-{title}.md`.  Use the proposal date for `YYYY-MM-dd`.
  * Use the [Markdown Syntax](https://daringfireball.net/projects/markdown/syntax) to write your SIP.
  * Follow the instructions in the [README](https://github.com/scala/docs.scala-lang/) to build your SIP locally so you can ensure that it looks correct on the website.
* Create a link to your SIP in the "pending sips" section of `index.md`
* Commit your changes to your forked repository
* Create a new [pull request](https://github.com/scala/docs.scala-lang/pull/new/gh-pages).  This will notify the Scala SIP team.
