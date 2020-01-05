---
layout: sips
title: SIP Meeting Minutes - 24th October 2017

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

|Topic|Reviewers| Accepted/Rejected |
| --- | --- | --- |
| [SIP-34: Right-Associative By-Name Operators](https://docs.scala-lang.org/sips/right-associative-by-name-operators.html) | Adriaan Moors | Accepted |
| [SIP-35: Opaque types](https://docs.scala-lang.org/sips/opaque-types.html) | Sébastien Doeraene | Pending |
| [SIP-33: Match infix and prefix types to meet expression rules](https://docs.scala-lang.org/sips/priority-based-infix-type-precedence.html)| Josh Suereth | Pending |
|[SIP-28 and SIP-29: Inline meta](https://docs.scala-lang.org/sips/inline-meta.html)|Josh Suereth and Iulian Dragos| Pending |

Jorge Vicente Cantero was the Process Lead and Darja Jovanovic as secretary.

## Date and Location
The meeting took place on the 24th October 2017 at 5 PM CEST via Google Hangouts at EPFL in Lausanne, Switzerland as well as other locations.

[Watch on Scala Center YouTube channel](https://youtu.be/aIc-o1pcRhw)

Minutes were taken by Darja Jovanovic.

## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), Scala Center
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), Twitter
* Iulian Dragos ([@dragos](https://github.com/dragos)), Independent
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Scala Center
* Ólafur Páll Geirsson ([olafurpg](https://github.com/olafurpg)), Scala Center



## Proceedings
### Opening Remarks

**Jorge** opens the meeting and introduces Olaf as a guest presenter for the SIP 28 and 29. Goes on to the first item on the agenda.


### [SIP-34: Right-Associative By-Name Operators](https://docs.scala-lang.org/sips/right-associative-by-name-operators.html)
[YouTube time: 00.31''- 2'03''](https://youtu.be/aIc-o1pcRhw?t=32)

**Jorge** states that this SIP is uncontroversial and that Committee should vote, if there are no further comments. **Sébastien** adds that community didn't have any comments either.
The Committee votes.

**Conclusion**: The SIP is accepted by unanimity.

### [SIP-35: Opaque types](https://docs.scala-lang.org/sips/opaque-types.html)
[YouTube time: 02'03''- 03'10''](https://youtu.be/aIc-o1pcRhw?t=122)

**Jorge** gives a brief update about the stage of the SIP-35, says that both community and the committee members gave a lot of feedback.
They are working on updates, but don't have any to share for this meeting.

**Conclusion**: The SIP-35 will be proposed on the agenda once the updates are provided.

### [SIP-33: Match infix and prefix types to meet expression rules](https://docs.scala-lang.org/sips/priority-based-infix-type-precedence.html)
[YouTube time: 03'12''- 10'04''](https://youtu.be/aIc-o1pcRhw?t=194)

**Jorge** introduces the SIP adding that **Oron** provided the implementation for associativity of the infix type, not for the prefix type. **Martin** makes the remark that Dotty does the same thing. He continues by saying he is "skeptical" about *prefix* types, as it seems to be another feature and "a necessary compromise to the mathematical conventions". On the other hand, he believes that once the rules for  associativity are fixed then types and terms will be consistent.
**Martin** concludes by saying "yes" to the infix part and "no" to the prefix part. **Adriaan** agrees and adds that the best way to go forward would be to split up the SIP, based on the "one idea one SIP" motto, noting that *prefix* and *infix* types, even though related, are not dependent therefore should be treated separately.
The Committee agrees with Adriaan.

**Conclusion**: The SIP 35 should be split in two separate SIPs, underlining that one related to *prefix* types needs more convincing as for now it looks like a "dead-end".
The *infix* type has sound ground and should be worked on.
The feedback will be given to the author.



### [SIP-28 and SIP-29: Inline and meta](https://docs.scala-lang.org/sips/inline-meta.html)
[YouTube time: 10'05'' until the end](https://youtu.be/aIc-o1pcRhw?t=605)

**Jorge** introduces **Olaf** as a new Team Lead of SIP-28 and SIP-29.
**Heather** pitches in to contextualize **Olaf's** following presentation. She makes clear that the SIPs are not to be voted on today. As **Olaf** had a month to familiarize himself with the project, he will not speak about the implementation or problem-solving, but update the Committee about the "current data point in the design space"

**Olaf** introduces himself as the new SIP project lead, and goes as
[YouTube time: 10'05'' - 15'32''](https://youtu.be/aIc-o1pcRhw?t=605):

SIP-29: Macros update October 2017

From the last SIP meeting:
>  Conclusion: The SIP is delayed until Olaf gathers the team and has some new
>  updates to share with the Committee.

We have a team of contributors:
- myself, project lead working for the Scala Center on proposal SCP-014:
  towards "non-experimental" macro system (my interpretation: portable and
  robust macros).
- Liu Fengyun, on behalf of the Dotty team.
- Mikhail Mutcianco, on behalf of Jetbrains.

We are in a dialogue with:
- Eugene Burmako
- Scala community via contributors.scala-lang.org
- Heather Miller
- Ryan Culpepper
- Adriaan Moors/Jason Zaugg, Scala compiler team


My role as I see it is to
- communicate with involved parties,
- research the macro landscape/ecosystem,
- coordinate engineering efforts on the new macro system so that it 1) addresses
  existing pains and 2) at least something is delivered within a timeline of 4-6 months.

What I'd like to get out of this meeting is to present our findings from the
past 3 weeks, give my personal recommendations and collect your feedback on how
to prioritize our upcoming work

**Olaf** continues by presenting his overview of the project

[YouTube time: 15'32'' - 23'39''](https://youtu.be/aIc-o1pcRhw?t=930)

*SIP-29: meta*

- Scoping changes are a concern.

*Macros by feature needs*

I think there are roughly four categories of macros grouped by features
they require from the macro system: code transformation, code generation,
inlining for performance reasons, and "linting".

Example:

|                    | transformation | generation | inline | linting |
|------------------- | -------------- | ---------- | ------ | ------- |
| scala-async        |  x             |            |        |         |
| ScalaTest assert   |  x             |            |        |         |
| f"" interpolator   |  x             |            |        |         |
| Json.serialize\[T] |                | x          |        |         |
| ScalaTest Position |                | x          |        |         |
| sourcecode.Name    |                | x          |        |         |
| log4s logger.info  |                |            | x      |         |
| Refined Positive   |                |            |        | x       |

We can view these categories by the features they require:

|                       | transformation | generation | inline | linting |
| -------------------   | -------------- | ---------- | ------ | ------- |
| Inspect trees         | x              |            | x      | x       |
| Inspect types/symbols | x              | x          |        |         |
| Construct trees       | x              | x          |        |         |
| Report errors         | x              | x          | x      | x       |
| Solvable with SIP-28  |                |            | x      |         |


*Transformation macros*

There are still many hard/open/unsolved problems, most notably:
* splicing untyped tree under typed trees causes breaks typer invariants, causing compiler crashes
* splicing typed tree under untyped trees causes owner chain corruptions, causing compiler crashes

Several techniques have been explored to solve these problems:

* c.untypecheck, breaks for certain tree nodes due to non-idempotency
* c.typecheck or manually construct typed trees, requires expertise
  from macro authors and can still cause cryptic errors in later phases.
* automatic repair of owner chains, works for some limited macros
* automatic typechecking of spliced untyped trees, little explored

These solutions have different trade-offs with regards to

- feature support
- portability
- breaking changes with existing macro ecosystem


*Generation macros*

There seem to be no roadblockers for supporting macros that do no tree
inspection, only untyped tree construction.
Code generation macros cannot change.

Open discussion about the above proposed

[YouTube time: 23'39'' until the end](https://youtu.be/aIc-o1pcRhw?t=1419)

About 40 minutes were dedicated to finding a common ground for the  direction of the project as well as the technical details that should be addressed going forward.

**Adriaan** immediately pointed out that going forward, project should focus on the "hard stuff" to deal with first in order to give clarity to what could be supported for the next year. He believes that tackling the more ambitious features first, by experimenting in a current macro system, is a "cheap way" to discover the "unknown". The ultimate goal would be to find out how to implement it in the next macro system.
Challenges that can be taken on:

- splicing trees, ending up with owner chains that are correct
- hygiene
- better tools for macro authors, to experiment in a current macro system

**Eugene** agrees with both **Adriaan** and **Olaf**, on one hand "prototyping" in the current macro system can be beneficial e.g automatic owner chain fixer but on the other, scala reflect is fundamentally different from the prototype macro system and even if the tests are run there might be no point to it.
He does agree with **Olaf** that classification of the macros is useful. Concluding that supporting the generation transformation macros shouldn't be that hard, but then the question of how valuable to the community these are needs to be raised.

Other question raised:

- typed quasiquotes (by **Martin**, **Olaf** and **Heather**)

**Martin** encourages to promote typed tree transformations as the default way to implement macros. The experience with this approach has been good in Dotty.
 "How restrictive is to demand all quasiquote to be fully typed instead of free name reference to type up the abstract" *Martin*
**Heather** questions whether if this leads to departing from quasiquotes, **Martin** suggests to separate typed and untyped quasiquotes rather than getting rid of them.

 - White box / Black box(by **Martin** / **Olaf**)
  Main concern "when do tools have to run the untrusted code?"

 - Annotation macros (Community)

**Martin** insists on leaving the paradise functionality in "paradise scala" and annotations that prove themselves to be essential can be considered for inclusion in the main scala.

 He strongly believes that macro annotations are a "complete abuse of macros" and will make sure that "this things are not possible anymore"

- The interaction between type inference and macros (**Iulian**)
This interaction seems to be one of the hard unsolved problems in the current macro system. For example, code that uses shapeless typically has two type parameters where one parameter is unbounded and it's inferred type is guided by the shapeless macro.

**Adriaan** thinks that's a great example for the language feature.

- Inline (**Martin**)
"Keep inline as a sort of enabler of meta to get full macros. Main job moving the code from A to B, doing simplifications, wheres actual generation and inspection of quasiquote is the job of macros."
Adding that it is also an interesting idea to split generation and inspection

- Untyped trees
**Eugene** thinks that mixing of untyped trees and typed trees is one of the hard problems. He believes we are only a "few steps" away from solving. Solving this problem should be the focus of next month and the fruit of that work will benefit both the new macro system as well as existing scala.reflect macros and open opportunities for more macro applications.


**Conclusion**: Moving forward, **Olaf** and the team should focus on the above suggested and keep the Committee informed about the progress. The SIP will be up on the agenda once it's ready with the implementation, by **Olaf** estimation, within 4 to 6 months.
