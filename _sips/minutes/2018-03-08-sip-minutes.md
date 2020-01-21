---
layout: sips
title: SIP Meeting Minutes - 8th March 2018

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

|Topic|Reviewers| Accepted/Rejected |
| --- | --- | --- |
|[SIP-35: Opaque types: updates on the proposal](http://docs.scala-lang.org/sips/opaque-types.html) | Sébastien Doeraene | N/A
|[SIP-NN: Byname implicit arguments](http://docs.scala-lang.org/sips/byname-implicits.html) | Martin Odersky | N/A
|Discussions about the future of Scala 2.13 and 2.14 |  | |


Jorge Vicente Cantero was the Process Lead and Darja Jovanovic as secretary.

## Date and Location
The meeting took place on the 8th March 2018 at 5 PM CEST via Google Hangouts at EPFL in Lausanne, Switzerland.

[Watch on Scala Center YouTube channel](https://youtu.be/dFEkS71rbW8)

Minutes were taken by Jamie Thompson.

## Attendees
* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Scala Center
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Scala Center

## Joined Online
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), Twitter
* Iulian Dragos ([@dragos](https://github.com/dragos)), Triplequote
* Miles Sabin ([@milessabin](https://github.com/milessabin)], Independent
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend

## Guest
* Erik Osheim, SIP-35 author.

## Not present
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), CMU

## Proceedings

### Opening Remarks

[YouTube time 0'00'' - 1'20''](https://youtu.be/dFEkS71rbW8): **Jorge** introduces the meeting by outlining the three
items on the agenda, the first two being SIP proposals and the third being an overview of potential features for Scala
2.13 which may lead to more concrete proposals.
Beginning with point three, **Jorge** explains that three ideas are scheduled for discussion at the meeting,
and invites **Adriaan** to open with the first of them.

### Discussion about the future of Scala 2.13 and 2.14
[YouTube time 1'23'' - 23'31''](https://youtu.be/dFEkS71rbW8?t=83)

#### [Proposal to Drop Package Objects with Inheritance](https://github.com/scala/scala-dev/issues/441)

This was an open discussion.

**Adriaan** introduces the idea that package objects should no longer support
inheritance, and possibly be replaced altogether with top level definitions.

#### Questions about Package Objects

1) **Miles** asks for clarification on what is problematic with the current implementation of package objects and if it
   is worth the cost of creating a new feature to replace them.

   **Adriaan** responds:
   - Inheritance from a parent in the same package creates problems.
   - package objects already carry a lot of constraints compared to ordinary objects.
   - They are worth changing to simplify the implementation.
   - Simple migration for package object with extends clauses: change to a regular object and import its definitions.

2) **Miles** asks if replacing package objects with top level definitions puts an end to the
   long standing goal of replacing packages by objects.

   **Adriaan** agrees that is what he is suggesting, motivated by the many issues that
   have been discovered with the current implementation in the context of incremental compilation, IDE's and more.

   **Iulian** adds to **Adriaan's** comment: he believes the implementation is too complicated and not correct, with
   many workarounds leading to brittle compilation, such as cyclic references between a package object and its parents
   if one is the same package.

   **Martin** in response to **Iulian** suggests that the issues experienced with package objects are only due to the
   implementation, suggesting that in Dotty, he does not recall many special cases. He suggests that package objects
   should behave like ordinary objects and reject parents in the same package.

3) **Iulian** asks what is the extra benefit of a package object over wrappers for top level definitions.

   **Miles** highlights that they are first class values.

   **Erik** shares examples of uses at his workplace for package objects: access to members without
   imports, such as implicit definitions, similar to a Prelude.

   **Sébastien** suggests that a package object may contain another package, which is not possible in an ordinary object

#### In Favour of Top Level Definitions

1) **Adriaan**: in his experience package objects are usually
   aggregates for new definitions, without extends clauses, which **Miles** agrees is his typical usage of them.

2) **Sébastien** believes that the extends clause in typical code is used only to inherit from a class in the same
   package, so concludes that given the known issues with inheritence, it should be dropped in favour of top level
   definitions.

   ([YouTube time from 2'35'' -  3'50''](https://youtu.be/dFEkS71rbW8?t=155)) He proposes two solutions for their
   implementation:

   1) The Kotlin way, which is to create a single wrapper object for each file, with a name derived from the file.
      - **Drawback**: a name change to the file breaks binary compatibility.
   2) Individual wrapper classes for each definition, with a name derived from the definition and any parameters.
      - **Benefit**: no binary compatibility issue as names are fully qualified.
      - **Drawback**: many more class files generated.

   **Sébastien** believes that these solutions do not introduce new issues for type checking.

3) **Martin** believes that top level definitions are simpler to understand than package objects and is in favour.

#### Implementation of Top Level Definitions

- **Erik** is concerned with the impact of top level definitions in multiple files on incremental compilation.
- **Martin** is concerned about how to reason about overloaded and conflicting top level definitions in different files.

**Sébastien** believes that both concerns above are not issues, proceding to outline how it is similar to regular member
scoping. After some discussion, **Martin** believes that an implementation is possible in Dotty.

#### Skepticism Around Top Level Definitions

1) **Seth** would like to keep package objects, but improve safety by adding some restrictions

   He suggests that investigating code and communicating with users will likely have the least disruptive change,
   favouring the most popular use-cases.

2) **Eugene** asks if the behaviour of package objects could be documented, as
   currently there is no formal specification except for the implementation.
   He is concerned that changes could being made without considering the wider industry, as they will have large code
   bases that will need to migrate package objects if they break.

   **Sébastien** answers by suggesting that package objects with no parents can be automatically rewritten to top level
   definitions, however, further thought would be required to deal with package objects that have extends clauses.

>#### YouTube Comment
>[YouTube time from 17'06'' to 18'02''](https://youtu.be/dFEkS71rbW8?t=1026)
>
>**Sébastien** addresses a comment on the stream about which kinds of definitions are safe to be allowed at the top
>level and there is some discussion.
>
>Overall, it is believed that defs can be at the top level, but vals are order
>dependent so might not be allowed.

**Jorge** notes that there is no longer enough time to discuss the other two ideas for 2.13.

**Adriaan** finishes by inviting participation in the discussion of the remaining issues in the
[Scala 2.14 milestone on GitHub](https://github.com/scala/scala-dev/issues?q=is%3Aopen+is%3Aissue+milestone%3A2.14).

#### Conclusion
The committee members are overall in agreement that package objects are a pain point, and there are mixed opinions as to
whether they become further restricted for safety, or replaced with top level definitions which raised concerns for
migration.

### [SIP-35: Opaque types: updates on the proposal](http://docs.scala-lang.org/sips/opaque-types.html)
[YouTube time from 23'31'' -  43'02''](https://youtu.be/dFEkS71rbW8?t=1411)

**Jorge** introduces the proposal, noting that it had been updated in the morning before the meeting and directs
**Sébastien**, the reviewer, to begin the discussion on the high level parts of the proposal.

#### Concerns About The Motivation

1) **Sébastien** believes that the current wording of the proposal could lead to wrong expectations,
   mostly in the meaning of "boxing" (i.e. primitive boxing vs an instance of a user defined wrapper class).

   **Erik** agrees that further clarification is needed, giving specific examples on when a value is left unboxed,
   concluding that the value of an opaque type will have semantics of the underlying type.

2) **Sébastien** points out that some examples claim to not box, but do in fact, for example in the tagging
   demonstration, the tag method is generic and will box the Double value passed in the code.

   **Erik** clarifies that a specialised annotation was intended to be on that method, which would avoid the boxing
   but was cut for readability.

   **Sébastien** concludes by stating that examples must agree with any claims made about them.

3) **Sébastien** suggests that most of the examples in the motivation are not not have advantageous runtime performance
   over the existing value class feature.

4) **Miles** suggests that the performance benefits of avoiding boxing is a secondary concern to the semantics that
   opaque type aliases bring to the language and asks which is the primary motivation.

   **Erik** answers that both are really key motivations. Originally, the idea was to create a replacement for the
   current value class implementation that was a less leaky abstraction, but as use cases were discovered,
   the motivation grew to include them as the more obvious method for information hiding. On the other hand,
   opaque type aliases are more future proof against changes to the JVM as the feature has no runtime footprint.

   **Jorge** agrees that the feature is good for information hiding and believes the feature will enable many more
   library designs that benefit from this style of programming.

5) **Adriaan** suggests that the proposal could clarify the language used to explain boxing by simplification to
   emphasise that values of opaque type aliases share the runtime behaviour of the underlying type.

   **Jorge** believes that the point is already made in the document, but wants to make it clear that an extra layer of
   indirection at runtime is avoided for opaque type aliases to subtypes of AnyRef.

**Sébastien** concludes that action should be taken to further emphasise in the proposal the semantics of the feature
over its performance benefits.

#### In Favour of the Proposal

1) **Sébastien** highlights examples of opaque types in the proposal that are advantageous over value classes:
   - Primitive arrays will be chosen if the underlying type is primitive.
   - Specialised methods will be selected if the underlying type is primitive.
   - In generic contexts, allocations of wrappers are avoided for opaque types aliasing reference types.

2) **Miles** is in favour for the feature because it would be a safer intrinsic replacement for the tagging used in
   Shapeless, as in his opinion it is an accident that the implementation of tagging can work in the current version of
   Scala.

   **Erik** agrees that the current solution for tagging is not idiomatic and points out that value classes are not a
   correct replacement either.

#### Concerns With the Proposal

1) **Martin** raises that an issue has been found with the proposals inclusion of recursive opaque type aliases, and is
   skeptical that they can be allowed as they introduce a fundamentally new kind of recursion to the language.

   **Jorge** asks for clarification if this is referring to the example for a Fix point type given in the proposal.

   **Martin** confirms and suggests an alternative version could be achieved with conversions, but believes that the
   idea implies too many changes to the language than the non-recursive cases.

   **Adriaan** asks the authors how importantly they value the recursive example.

   **Erik** answers that it he wouldn't mind if that part was dropped. The example was included because the methods
   used in present Scala to get the same result again rely on "compiler tricks".
   He clarifies that it was added under the assumption that if it is possible then it should be documented.

   **Jorge** agrees.

   **Adriaan** suggests that the recursive example is quite niche and could be postponed until a later time, as the rest
   of the proposal is favoured by the committee.

#### Other Remarks
> [YouTube time from 38'25'' - 41'54''](https://youtu.be/dFEkS71rbW8?t=2305)
>
>**Miles** asks **Martin** why he thinks that the fix type example is an entirely new kind of recursion.
>
>**Martin** answers that there is not a clear mapping to the DOT calculus, where recursion over types is through the
>self type of the current object. On the other hand, the fix example is recursion over a type parameter.
>
>**Miles** responds by questioning if this is so different because the fix example syntactically maps directly to an
>equivalent class-based implementation.
>
>**Martin** then offers a solution to fix that does not require recursion: two type aliases representing `Fix[F]` and
>`F[Fix[F]]` with conversions between the two. He summarises that the problem with the opaque types proposal is that it
>suggests that
>these two types are the same type, which is not friendly to a compiler.

**Jorge** ends the item by clarifying that an implementation is available in Dotty in a pull request where
discussion is also taking place.

#### Conclusion

Opaque types are a method of hiding the right hand side of a type alias, with the runtime semantics of the underlying
type. It is discussed as an idiomatic method for tagging, and possibly a fixed point type, with performance benefits
over value classes.
The committee members who commented are in favour of the feature, with concerns for the semantics of recursive
types and the precision of the language used in the proposal.

**Actions:**
  - Emphasise semantics over performance benefits in document.
  - Postpone the inclusion of recursive opaque types.

### [SIP-NN: Byname implicit arguments](http://docs.scala-lang.org/sips/byname-implicits.html)
[YouTube time from 43'02'' - end](https://youtu.be/dFEkS71rbW8?t=2582)

**Jorge** explains that the committee are waiting for an implementation in Scalac, and are currently acting on the
proposal alone. At the end of the discussion the comittee will vote on whether or not to number the proposal. He also
suggests that Martin will review the proposal.

**Miles** introduces Byname implicits as a feature that adds the functionality of the Lazy macro in Shapeless as an
intrinsic part of the Scala language, with the added motivation that the macro implementation in Scala 2 is very high
maintenance, with unsafe casts to compiler internal classes.
He explains that byname implicits are intended to be used to derive recursive implicit parameters,
for example type class derivation for recursive types such as List. The SIP proposal is simplified when compared to the
Lazy macro implementation and reuses exisiting byname parameter syntax.
He explains that it is advantageous over the exisiting macro because it supports detection of implicit divergence.

**Jorge** asks if this feature is desirable because users of Lazy have reported long compilation times with stack
overflows.

**Miles** answers by proposing that these cases are likely due to undetected implicit divergence, as the Lazy
macro implementation turns off the implicit divergence checks, which is not an issue in the implementation for this SIP
proposal. He clarifies that in any case, there is still performance overhead that could be improved for the
intrinsic implementation, highlighting the high rate of creation of thunks, but proposed that the SIP should not add
additional overhead to what is already given by using the Lazy macro.

**Jorge** asks for comments from the other committee members.

**Sébastien** offers that he has been convinced by the motivation section of the SIP, despite never personally requiring
the feature. However he disagrees that the parameters should desugar to lazy vals after implicit
expansion. Apart from concerns about performance, he suggests that the semantics are also surprising compared to
ordinary byname parameters.

After unproductive discussions about the correct encoding for the desugaring, **Adriaan** suggests that discussion
should be taken to the pull request for the SIP.

**Jorge** proceeds to introduce voting on numbering the issue, but notes that at this point **Iulian** has left the
meeting, so there is no quorum. Therefore, the votes for him and the other members will be collected after the meeting.

Votes of those present in favour of numbering:
- **Sébastien**
- **Martin**
- **Adriaan**
- **Miles**
- **Seth**
- **Eugene**

No votes against from present members.

#### Conclusion

Byname implicits are a feature to construct recursive implicit parameters, replacing a brittle macro implementation but
with idiomatic syntax and improved behaviour.
The committee seems in favour of the feature, with some concerns for performance. All members
present chose to number the proposal, but a quorum was not reached at the time.
