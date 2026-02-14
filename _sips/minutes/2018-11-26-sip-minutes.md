---
layout: sips
title: SIP Meeting Minutes - November 1-3 2018

partof: minutes
---

# Minutes

The following agenda distributed to attendees is [here](https://docs.google.com/spreadsheets/d/1JdTyAxqqKqXtiXnZBPTaesMrWk7lyTWna1VPL3N5KWo/edit?usp=sharing).


Jorge Vicente Cantero and Darja Jovanovic were the Process Leads.


## Date and Location
The meeting took place on November 1-3 2018, during the working hours 9 AM - 5 PM CET, at EPFL in Lausanne, Switzerland as well as other locations.

The meeting was not recorded.


## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Iulian Dragos ([@dragos](https://github.com/dragos)), Triplequote
* Josh Suereth ([@jsuereth](https://github.com/jsuereth)), Independent
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), Scala Center
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Miles Sabin ([@milessabin](https://github.com/milessabin)), Independent
* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Scala Center

## Joined online

* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), Twitter

## Not present

* Heather Miller ([@heathermiller](https://github.com/heathermiller)), CMU

## Proceedings
### Opening Remarks

The SIP Committee gathered for the first time face-to-face, for an extensive 3-day SIP meeting. The main goals and achievements of these meetings were:

- Understand better the upcoming changes to Scala; 
- Agree about the role of the Committee in the Scala 2 to Scala 3 transition;
- Outline an action plan within a set time-frame;
- Other: Unanimously voted for Guillaume Martres to join the Committee.

*Better understanding* was enabled by in depth presentations and Q&As with the EPFL Dotty team; *the Approach* was agreed upon the first day which resulted in creating “FAQs about Scala 3” (see below) and *the Action Plan* was outlined and is still under construction; several issues were opened (please see the list at the end of this document) and a project plan ["Meta-programming in Scala 3"](https://github.com/scala/scala3/issues/5489) has been developed.

As the most important points and summary is reflected in “FAQs about Scala 3”, it will stand as an official “minutes” for this unique SIP meeting.

The following document is not intended to fully answer the listed questions, but to acknowledge them; the SIP Committee is outlining a frame and will pursue answers moving forward. Answers may change down the line, as the Process evolves. 

## Frequently Asked Questions about Scala 3

### What is the goal of Scala 3?
This new iteration of the language will be focused on simplification, ergonomics, and on creating a stronger foundation for future evolution.
In addition,  the goal is for Scala 3 to be friendlier to newcomers with a swift onboarding experience.
As usual, existing Scala code should be able to transition to Scala 3 with minimum pain.


### What’s the timeline for Scala 3?
 Scala 3 is planned to be released in 2020. There will be two phases.
The first phase will end in 2019 with a feature freeze. Before the feature freeze, the SIP Committee and the Scala 3 team will focus on ironing out the set of language features and concrete semantics.
The second phase will continue into 2020, where the focus will shift to hardening, tooling and polishing documentation to ensure a smooth migration. 

### Who’s behind Scala 3?
Over the last five years, Prof. Martin Odersky and his team at EPFL have developed Scala 3. (Also, several Scala 2 features were first incubated in Scala 3.)
Scala 3 will continue to leverage this collaboration with the Scala 2 team at Lightbend to improve the language for existing Scala users and ease migration. 


### What’s the role of the SIP Committee in the Scala 3 migration?
The SIP Committee takes account of the interests of the varied stakeholders of the Scala language. Regarding the transition to Scala 3, the Committee is tasked with:
1. Curating language changes in the Scala specification;
2. Providing recommendations for migration from Scala 2 to Scala 3;
3. Work with the Scala Center to be a point of reference during the transition to Scala 3, incorporating feedback from implementation experience and from the community.

The Committee came up with the curated list, based on 3 categories, "core", "essential", and "not core".

"Core" are well-defined features or changes that are already designed and implemented. They have been accepted on principle, but the finer details are still up for discussion.

"Essential" are wide, unsolved areas for which the Committee recognizes that it cannot decently ship Scala 3.0 without a final design and implementation to solve them. Nothing has been accepted yet because they're not even fully designed yet.

"Not core" 

Please see the [full list here](https://docs.google.com/spreadsheets/d/1GWJUo0U3JbBtrfg5vqgb6H5S6wlU5HnTxebLcHwD1zw/edit?usp=sharing), naming the "core" features as follows:

[Early Initializers](https://nightly.scala-lang.org/docs/reference/dropped-features/early-initializers.html)

[Trait Parameters](https://nightly.scala-lang.org/docs/reference/other-new-features/trait-parameters.html)

[Intersection Types](https://nightly.scala-lang.org/docs/reference/new-types/intersection-types.html)

[Union Types](https://nightly.scala-lang.org/docs/reference/new-types/union-types.html)

[Dependent Function Types](https://nightly.scala-lang.org/docs/reference/new-types/dependent-function-types.html)

Implicit Function Types (https://nightly.scala-lang.org/docs/reference/instances/implicit-function-types.html)

[Weak Conformance](https://nightly.scala-lang.org/docs/reference/dropped-features/weak-conformance.html)

[Type Lambdas](https://nightly.scala-lang.org/docs/reference/new-types/type-lambdas.html)

Type Checking

[Type Inference](https://nightly.scala-lang.org/docs/reference/changed-features/type-inference.html)

[Implicit Resolution](https://nightly.scala-lang.org/docs/reference/changed-features/implicit-resolution.html)

[Pattern matching](https://nightly.scala-lang.org/docs/reference/changed-features/pattern-matching.html)

[Existential Types](https://nightly.scala-lang.org/docs/reference/dropped-features/existential-types.html)

[Type Projection](https://nightly.scala-lang.org/docs/reference/dropped-features/type-projection.html)

[Class Shadowing](https://nightly.scala-lang.org/docs/reference/dropped-features/class-shadowing.html)



### What’s the plan for keeping the migration period as short as possible?
A smooth migration process is key for the success of Scala 3. We have learned from our own past experience as well as that of other language communities (for example, Python 3) to recommend the following plan.

These are the key properties of a successful upgrade plan that we recommend to incorporate in the migration to Scala 3.

1. **Static types.** Most Scala code leverages static types which makes migrating safer and easier.
2. **Tooling to ease upgrades.** There should be a rewriting tool for automatic migrations and changes in the current Scala tooling. This tool should accommodate most of the needed changes.
3. **Shared standard library.** Scala 2.14 and Scala 3.0 should share the same Scala standard library.

In addition, Scala community has a culture of upgrading the ecosystem on every major version of Scala through the community build. We  recommend to leverage the same mechanism to vet Scala upgrades with the migration to Scala 3.

**Incremental.** Instead of a one-time big upgrade, users should be able to adopt Scala 3 at their own pace. 

  a) Compatibility and cross-building. Users should be able to use a common subset of Scala to mix Scala 2 and Scala 3 projects (to be determined after the feature freeze) in the same codebase. Scala 2 should guide users towards this subset through deprecation warnings.
  
  b) [Tasty](https://www.scala-lang.org/blog/2018/04/30/in-a-nutshell.html) compatibility. Scala 2 and Scala 3 should converge on the use of Tasty, an intermediate representation format, that will have a strong backwards compatibility policy.

### How will the transition to Scala 3 affect users of Scala 2 macros and reflection?

The dependency of Scala 2 macros and reflection on internal implementation details of the Scala 2 compiler means that significant change is inevitable if Scala is to evolve.
We recognize that important parts of the Scala ecosystem have made essential use of the Scala 2 facilities and that it is vital that as many as possible of these use cases be accommodated in Scala 3 in some form or another. This will be disruptive, but we hope to mitigate the disruption by providing facilities which make the more straightforward and important scenarios simpler while still leaving others possible.
Our direction is still evolving; however we believe that replacing the current excessively general and expressive macro system with a suite of less powerful but complementary tools is the way forward.
Currently we are exploring options which range from improved support for type level programming in the language itself (eg. specialized inline, match types, stable definitions, GADT improvements); intrinsifying certain features currently supported by macros (eg. by-name implicits, generic programming primitives); through to less general forms of metaprogramming (quote/splice and staging) and portable reflection via Tasty (which we [recommend](https://github.com/scalacenter/advisoryboard/pull/40)) to support in both Scala 2/3 and via compiler-independent libraries and tools. We recommend that most current uses of Scala macros and reflection can be accommodated by some combination of these tools.
For more about the project's progress, please see https://github.com/scala/scala3/issues/5489

### How do we plan to address language experimentation?
We acknowledge that language experimentation is necessary for improving the language. We also believe it requires a different vehicle than stable Scala releases. We don’t have a concrete solution for now, but we’re working on one.

### Other “documents” created during the meetings:

[SIP: Structural Types](https://github.com/scala/scala3/issues/5372)

[SIP: TASTY changes](https://github.com/scala/scala3/issues/5378)

[SIP: Underscore Syntax for Type Lambdas](https://github.com/scala/scala3/issues/5379)

[Should we bring back rewrite methods?](https://github.com/scala/scala3/issues/5381)

[Features work progress overview](https://docs.google.com/spreadsheets/d/1GWJUo0U3JbBtrfg5vqgb6H5S6wlU5HnTxebLcHwD1zw/edit?usp=sharing)

For more info please consult the Dotty documentation:
https://nightly.scala-lang.org/docs/reference/overview.html 

