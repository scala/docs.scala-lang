---
layout: sips
title: Process Specification
redirect_from: /sips/sip-submission.html
---

The Scala Improvement Process (sometimes called SIP process) is a process for
submitting changes to the Scala language. This process aims to evolve Scala
openly and collaboratively.

The SIP process covers the Scala language (syntax, type system and semantics)
and the core of the Scala standard library. The core is anything that is
referenced from the language spec (such as primitive types or the definition
of `Seq`). The SIP process is not concerned with compiler changes that do not
affect the language (including but not limited to linting warnings,
optimizations, quality of error messages).

A proposed change requires a design document, called a Scala Improvement
Proposal (SIP). The committee meets monthly to discuss, and eventually vote
upon, proposals.

The committee follows the following process when evaluating SIP documents,
from an idea to the inclusion in the language.

## Definitions

- SIP (Scala Improvement Proposal): a particular proposal for changing the Scala
  language (additions, changes, and/or removals).
- Committee: a group of experienced Scala practitioners and language designers,
  who evaluate changes to the Scala programming language. It consists of a
  Secretary, a Chairperson, and Members.
- Chairperson: person in charge of executing the process. They organize and
  chair the meetings of the Committee, and generally make sure the process is
  followed, but do not vote on proposals. The Chairperson is an appointed
  employee of the Scala Center.
- Committee Member: member of the Committee with voting rights. The Chairperson
  cannot be a Member at the same time.
- Secretary: person attending the regular meetings and responsible for writing
  notes of the discussions.
- SIP Author: any individual or group of people who writes a SIP for submission
  to the Committee. The Chairperson and Committee Members may also be SIP Authors.
  Authors are responsible for building consensus within the community and
  documenting dissenting opinions before the SIP is officially discussed by the
  SIP Committee. Their goal is to convince the committee that their proposal is
  useful and addresses pertinent problems in the language as well as interactions
  with already existing features. Authors can change over the life-cycle of the
  SIP.
- SIP Reviewers: a subset of Committee Members assigned by the Chairperson to
  review in detail a particular SIP. The same person cannot be both a SIP Author
  and a SIP Reviewer for the same SIP.
- SIP Manager: one of the SIP Reviewers who is responsible for all the
  communications related to the SIP, throughout its entire life-cycle. This includes requesting a vote on the SIP from the whole Committee, presenting the SIP to the Committee at the plenary meetings, merging or closing the corresponding PR, reporting to the community on the vote outcome, and announcing when it is available for testing.

## Stages

From being an idea to being part of the language, a SIP goes through several
Stages that indicate the "maturity" level of the SIP. The following table
summarizes the intent of the various stages.

<table>
    <thead>
        <tr>
            <td>Stage</td>
            <td>Purpose</td>
            <td>Entry criteria</td>
            <td>Post-entry changes expected</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Pre-SIP</td>
            <td>Gather initial community feedback and support.</td>
            <td>N/A. Opening a "Pre-SIP" post on the Scala Contributors forum can be done by anyone at any time</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Design</td>
            <td>Make the case for the proposal. Make the design of the feature precise. Evaluate the solution among other possible solutions. Identify potential challenges.</td>
            <td>Community support was demonstrated in the Pre-SIP forum post. This is loosely defined.</td>
            <td>Major changes expected.</td>
        </tr>
        <tr>
            <td>Implementation</td>
            <td>Provide an Experimental implementation of the changes in the compiler. Evaluate how they hold up in practice. Get feedback from implementers and users.</td>
            <td>The SIP contains a precise specification for the changes and how they should interact with the rest of the language.<br />
               The Committee votes in favor of the SIP to be "Accepted for implementation".</td>
            <td>Minor changes based on feedback from implementers and early users.</td>
        </tr>
        <tr>
            <td>Completed</td>
            <td>Ship the feature. Once accepted, the feature will ship as stable in the next Minor release of the Scala language.</td>
            <td>A complete implementation, with tests, was merged in the mainline compiler and shipped as Experimental. Implementers do not have any concerns left wrt. the implementation of the feature and its interactions.<br />
             The Committee votes in favor of the SIP to be "Accepted".</td>
            <td>No changes allowed.</td>
        </tr>
    </tbody>
</table>

### The process in one graph

![](/resources/images/sip/process-chart.png)

### Pre-SIP Stage

To initiate a discussion, any individual opens a "Pre-SIP" post in the Scala
Contributors forum. The post should be in the
[Scala Improvement Process](https://contributors.scala-lang.org/c/sip/13)
category, and its title should start with "Pre-SIP:". The purpose of the Pre-SIP
post is to present an idea to the Scala community: a Pre-SIP should present a
problem that needs solving (i.e., motivate the changes) and present possible
solutions with pros and cons. The community is encouraged to engage in the
discussions by voicing support, comments and concerns.

During the Pre-SIP stage, the Committee is not required to be involved.
Committee Members and the Chairperson are expected to follow Pre-SIP
discussions, but not required to engage.

Once at least one month has passed and the author has built some community
support for their Pre-SIP, they can Submit a SIP for discussion by the
Committee. "Community support" is loosely defined. It involves a mix of positive
comments, likes, etc. Generally, the Chairperson or a Committee member will post
a comment on the thread suggesting to submit a SIP when they see that a Pre-SIP
is ready to enter the process.

### Entry into the process (SIP Submission)

To submit a SIP, a SIP Author writes a pull request to the
[scala/improvement-proposals](https://github.com/scala/improvement-proposals)
repository, following the [tutorial]({% link _sips/sip-tutorial.md %}), and
pointing to the Pre-SIP discussion. If the proposal correctly follows the
template, and the Pre-SIP discussion seems to show some community support,
the Chairperson will accept the SIP for review, assign a SIP number, assign
3 reviewers to the SIP among the Committee Members, and assign one of the reviewers
to be the Manager of that SIP. Since "community support" is
loosely defined, any Committee Member can also comment on the PR to accept the
SIP for review (this is meant mostly as an escape hatch to prevent the
Chairperson from unilaterally blocking a SIP from entering the process). From
that point onwards, the SIP has entered the Design Stage.

If the template has not been correctly followed, or if none of the Committee
Members nor the Chairperson think that the Pre-SIP has gathered enough support,
the PR may be closed after 2 weeks.

### PR states and GitHub labels

As soon as a SIP PR is opened, the GitHub labels `stage:pre-sip` and
`status:submitted` are applied to it. At any given moment, a SIP PR will have as
labels one of the following possibilities:

|                        |                                     |                         |
|------------------------|-------------------------------------|-------------------------|
| `stage:pre-sip`        | `status:submitted`                  |                         |
| `stage:design`         | `status:under-review`               |                         |
| `stage:design`         | `status:vote-requested`             | `recommendation:accept` |
| `stage:design`         | `status:vote-requested`             | `recommendation:reject` |
| `stage:implementation` | `status:waiting-for-implementation` |                         |
| `stage:implementation` | `status:under-review `              |                         |
| `stage:implementation` | `status:vote-requested`             | `recommendation:accept` |
| `stage:implementation` | `status:vote-requested`             | `recommendation:reject` |
| `stage:completed`      | `status:accepted`                   |                         |
| `stage:completed`      | `status:shipped`                    |                         |
|                        | `status:rejected`                   |                         |
|                        | `status:withdrawn`                  |                         |

### Design Stage -- Review

Once a SIP has entered the Design Stage, the assigned reviewers will review (as
a GitHub Review on the SIP PR) the proposal within 3 weeks. The authors may then
address the concerns by pushing additional commits and ask for a new review.
This phase is iterative, like any pull request to an implementation repository.
After each request for a new review, the reviewers have 3 weeks to do another
round.

When the reviewers are confident that the SIP is in good shape to be discussed
with the full Committee, the Manager sets its status to "Vote Requested" and decide on a
Vote Recommendation that they will bring to the Committee. A Vote Recommendation
is either "Recommend Accept" or "Recommend Reject". The proposal is then
scheduled on the agenda of the next Committee meeting (which happens once a
month).

At any time, the SIP Author may voluntarily Withdraw their SIP, in which case it
exits the process. It is possible for someone else (or the same person) to
become the new SIP Author for that SIP, and therefore bring it back to the
process. If a SIP Author does not follow up on Reviewers' comments for 2 months,
the SIP will automatically be considered to be Withdrawn.

### Design Stage -- Vote

During the Committee meeting, the Managers of any scheduled SIP present the SIP
to the Committee, their recommendation, and explain why they made that
recommendation. After discussion, the Committee votes for advancing the SIP to
the Implementation Stage. There are three possible outcomes:

- Accept for implementation: the proposal then advances to the Implementation
  Stage, and therefore becomes a formal recommendation to be implemented as an
  Experimental feature into the compiler.
- Reject: the proposal is rejected and the PR closed. It exits the process at
  this point. The reviewers will communicate on the PR the reason(s) for the
  rejection.
- Keep: the proposal remains in the Design Stage for further iterations. The
  reviewers will communicate on the PR the current concerns raised by the
  Committee.

In order to be accepted for implementation and advance to the next stage, a SIP
must gather strictly more than 50% of "Advance" votes among the whole Committee. This means that an abstention is equivalent to "Do not advance" for this purpose, biasing the process in favor of the status quo. Furthermore, if more than half of the Committee members are absent at the meeting, the vote is cancelled.

For instance, if the Committee is made of 11 members, at least 6 members have to vote "Advance" for the SIP to move to the next stage.

If there was a strict majority in favor of "Advance", the PR for the SIP is Merged at this point by its Manager.
Otherwise, a second vote between
Reject and Keep will be used. A proposal needs more than 50% "Reject" votes to
be rejected in that case. Otherwise, it is kept.

The SIP Manager shares the outcome of the vote with the community by posting a comment to proposal’s Pre-SIP discussion.

### Implementation Stage

Once in the implementation stage, the Committee is not concerned with the SIP
anymore, until new concerns are discovered or until the implementation is ready.
The SIP is now a recommendation for the compiler team or any other individual or
group of people to provide an implementation of the proposal, as a pull request
to the Scala 3 compiler repository. There is no set timeline for this phase.

Often, proposals not only need to be implemented in the compiler, but also in
several other tools (IDEs, syntax highlighters, code formatters, etc.). As soon
as a proposal reaches the implementation stage, the Chairperson notifies the
impacted tools that they should start implementing support for it. A list of
tools of the ecosystem is maintained in [this document][tooling ecosystem].

An implementation will be reviewed by the compiler team, and once the
implementation is deemed good enough, it can ship as an Experimental feature in
the next release of the compiler where it's practical to do so. At that point, the SIP Manager posts a follow-up comment on the Pre-SIP discussion to invite the community to test the feature and provide feedback.

The implementers may hit challenges that were not foreseen by the Committee.
Early users may also provide feedback based on practical experience with the
Experimental feature. This feedback can be sent back to the Committee by
implementers. This is done with a PR to the SIP repository, amending the
previously merged SIP document or raising questions for challenges. In that
case, the SIP Author and Reviewers will work together with the implementers to
address the feedback. This is again an iterative process. Reviewers may merge
changes to the proposal at their discretion during this phase.

Once the implementation is deemed stable, including appropriate tests and
sufficient support by the tooling ecosystem, the implementers and reviewers can
schedule the SIP to the next Committee meeting for final approval. Once again, a
SIP needs to gather strictly more than 50% "Accept" votes to be Completed. If
that is not achieved, it may likewise be sent back for refinements, or be
rejected, with the same rules as in the "Design Stage -- Vote" section.

### Completed Stage

Once a SIP is accepted for shipping, it will be enabled by default (as
non-Experimental) in the next practical Minor release of the language.

From this point onwards, the feature is stable and cannot be changed anymore.
Any further changes would have to come as an entirely new SIP.

## The SIP Committee

The current committee members are:

- Björn Regnell ([@bjornregnell](https://github.com/bjornregnell)), Lund University
- Chris Andrews ([@chrisandrews-ms](https://github.com/chrisandrews-ms)), Morgan Stanley
- Guillaume Martres ([@smarter](https://github.com/smarter)), EPFL
- Haoyi Li ([@lihaoyi](https://github.com/lihaoyi)), Databricks
- Lukas Rytz ([@lrytz](https://github.com/lrytz)), Lightbend
- Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
- Michał Pałka ([@prolativ](https://github.com/prolativ)), VirtusLab
- Oron Port ([@soronpo](https://github.com/soronpo)), DFiant Inc
- Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL

The current Chairperson is:

- Oliver Bračevac ([@bracevac](https://github.com/bracevac)), EPFL

The current Secretary is:

- Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend

### Committee Meetings

The plenary Committee Meetings are scheduled monthly by the Chairperson. They
have the following purposes:

- Vote to accept, keep or reject SIPs that are in a "Vote Requested" state
- Be aware of the list of SIPs that are "Under review". If a SIP stays too long
  under review, Committee Members may request for it to be put to discussion
  and/or vote in a subsequent plenary meeting, even if the Reviewers do not
  think it is ready. This is meant primarily as an escape hatch, preventing
  Reviewers from blocking a SIP by infinitely stalling it.
- Make any exception to the process that they judge necessary to unblock a
  situation.

If a Committee Member cannot attend a meeting, they are welcome to share their feedback about the proposals listed in the agenda of the meeting with the Chairperson, who will relate it during the meeting. A Committee Member cannot give their voting power to someone else. If a Committee Member misses more than 2 meetings within a year, they lose their seat.

### Responsibilities of the Committee Members

- Review the proposals they are assigned to:
   1. Discuss unclear points with the authors,
   2. Help them address their issues and questions,
   3. Provide them feedback from the discussions in the meetings, and
   4. Explain the latest progress in every meeting.
- Play a role in the discussions, learn in advance about the topic if needed,
  and make up their mind in the voting process.
- Establish communication channels with the community to share updates about the evolution of proposals and collect feedback.

### Guests

Experts in some fields of the compiler may be invited to concrete meetings as
guests when discussing related SIPs. Their input would be important to discuss
the current state of the proposal, both its design and implementation.

### On what basis are proposals evaluated?

The Committee ultimately decides how to evaluate proposals, and on what grounds.
The Committee does not need to justify its decisions, although it is highly
encouraged to provide reasons.

Nevertheless, here is a non-exhaustive list of things that the Reviewers and
Committee are encouraged to take into account:

- The proposal follows the "spirit" of Scala
- The proposal is well motivated; it solves a recurring problem
- The proposal evaluates the pros and cons of its solution; the solution put
  forward is believed to be the best one
- The proposal can be implemented in a way that does not break backward binary
  nor TASTy compatibility
- The proposal makes an effort not to break backward source compatibility
- The proposal does not change the meaning of existing programs
- The proposal can be implemented on all major platforms (JVM, JS and Native)

## Exceptions and changes

The present document tries to account for most situations that could occur in
the lifetime of SIPs. However, it does not pretend to be an ultimate solution to
all cases. At any time, the Committee can decide, by consensus, to make
exceptions to the process, or to refine the process.

## How do I submit?

Follow the [submission tutorial]({% link _sips/sip-tutorial.md %}).

[tooling ecosystem]: https://github.com/scala/improvement-proposals/blob/main/tooling-ecosystem.md
