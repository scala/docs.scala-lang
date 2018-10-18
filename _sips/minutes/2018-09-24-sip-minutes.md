---
layout: sips
title: SIP Meeting Minutes - 24th September 2018

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

|Topic|Reviewers| Accepted/Rejected |
| --- | --- | --- |
| Summary of the Contributors thread [“Proposal to remove XML literals from the language”](https://contributors.scala-lang.org/t/proposal-to-remove-xml-literals-from-the-language/2146) | Sébastien Doeraene | Pending
| Summary of the Contributors thread [“Proposal to remove the procedure Syntax”](https://contributors.scala-lang.org/t/proposal-to-remove-procedure-syntax/2143) | Josh Suereth | Pending |
| [Proposal to add Intersection Types to the Language](https://dotty.epfl.ch/docs/reference/intersection-types.html) | Martin Odersky | Discussion opened until the 25th October 2018, comments welcomed [here](https://contributors.scala-lang.org/t/proposal-to-add-intersection-types-to-the-language/2351) |
| [Proposal to Add Union Types to the Language](https://dotty.epfl.ch/docs/reference/union-types.html) | Martin Odersky | Discussion opened until the 25th October 2018, comments welcomed [here](https://contributors.scala-lang.org/t/proposal-to-add-union-types-to-the-language/2352) | 
| [Proposal to add Implicit Function Types to the Language](https://dotty.epfl.ch/docs/reference/implicit-function-types.html) | Martin Odersky | Discussion opened until the 25th October 2018, comments welcomed [here](https://contributors.scala-lang.org/t/proposal-to-add-implicit-function-types-to-the-language/2353) |
| [Proposal to add Dependent Function Types to the Language](https://dotty.epfl.ch/docs/reference/dependent-function-types.html) | Martin Odersky | Discussion opened until the 25th October 2018, comments welcomed [here](https://contributors.scala-lang.org/t/proposal-to-add-dependent-function-types-to-the-language/2354/1) |
| [Proposal to add Trait Parameters to the Language](https://dotty.epfl.ch/docs/reference/trait-parameters.html) | Martin Odersky | Discussion opened until the 25th October 2018, comments welcomed [here](https://contributors.scala-lang.org/t/proposal-to-add-trait-parameters-to-the-language/2356) |

Jorge Vicente Cantero was the Process Lead and Darja Jovanovic was the secretary.


## Date and Location
The meeting took place on the 24th September 2018 at 5 PM CEST via Google Hangouts at EPFL in Lausanne, Switzerland as well as other locations.

[Watch on Scala Center YouTube channel](https://youtu.be/tEb4UF6RJrM)


Minutes were taken by Darja Jovanovic and Jorge Vicente Cantero.

## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Iulian Dragos ([@dragos](https://github.com/dragos)), Triplequote
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), Twitter
* Josh Suereth ([@jsuereth](https://github.com/jsuereth)), Independent
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), Scala Center
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Scala Center

## Not present
* Miles Sabin ([@milessabin](https://github.com/milessabin)), Independent
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), CMU

## Proceedings
### Opening Remarks

Jorge opens the meeting, explains SIP dynamics:
Finalising discussion about the 1st batch, action points
Introducing batch two
Decision / voting / postponing the discussion

### Discussion of the first Scala 3 batch

#### [“Proposal to remove XML literals from the language”](https://contributors.scala-lang.org/t/proposal-to-remove-xml-literals-from-the-language/2146)
([YouTube time 3’ - 16’50’’](https://youtu.be/gnlL4PlstFY?t=891))

**Sébastien** suggests to postpone the removal of XML and Procedure syntax, because when
the removal takes place it will be a code breaking change, not a binary or
tasty one. Adds it would be better to focus on changes that have an impact on
tasty and binary format and deal with these later.

**Seth** ([YouTube time:4’54](https://youtu.be/tEb4UF6RJrM?t=294)) suggests to have a warning
notes that it will eventually be removed.

**Eugene** asks what would be the positive effect of that change? And that we
need to vote on it first.

**Iulian** asks what are the promises with regards to binary-compatible and
source-compatible releases in Scala 3. To him it looks weird that we could
break the source between 3.0 and 3.1.

**Josh** notes that by enforcing binary compatibility across Scala 2 and Scala
3 we are sacrificing source compatibility. He asks for this decision to be
more thought over as it is a big decision with lots of impact for Scala
tooling. He agrees we can make source-breaking releases nicer to use in
source-based build tools like Pants or Bazel, but trading off binary
compatibility by source compatibility is not a decision to take lightly [more](
https://youtu.be/tEb4UF6RJrM?t=612).

**Martin** thinks that no matter what trade-offs we do with regards to
compatibility, he'd like to be able to remove XML literals in the first
release of Scala 3.0 because having the XML spec inside the Scala spec gives
a bad impression of complexity of the language, where he believes Scala is
instead a more lightweight language than its competitors. There is no way he
can make this argument if the XML spec continues to be in the relatively
simple Scala language specification [more](https://youtu.be/tEb4UF6RJrM?t=916).

(The discussion with regards to binary compatibility and source compatibility trade-offs is postponed.)

#### [“Proposal to remove the procedure Syntax”](https://contributors.scala-lang.org/t/proposal-to-remove-procedure-syntax/2143)

([YouTube time: 16’50’’ - 19.28’’](https://youtu.be/tEb4UF6RJrM?t=1010))

**Jorge** reminds that in the last meeting we agreed that before moving forward with the change we needed:
1. A better motivation
2. A good explanation of why this change promotes the use of types (making it safer)
3. A removal of the examples that were misleading
4. A link to a Scalafix rewrite that could make a migration.

**Jorge** then points out that the changes need to be done in order to move
forward, but is asking a Committee to voice their opinion about removing this
feature in Scala 3. 
**Josh** underlines that there were 2 parts in the debate
1) Are procedures different than a method, do we want them visually
distinctive? 
2) Other issues listed by **Jorge** above. In particular, the fact that we want people to explicitly annotate the unit in their methods because it makes code more readable.

A decision will be taken into the future when all those items are acted on.
 
### Discussion of the second Scala 3 batch

An overview of the second batch can be found [in this Scala Contributors thread](https://contributors.scala-lang.org/t/second-batch-of-scala-3-sips-additions-to-scalas-type-system/2376). The batches under discussion are:

1. https://contributors.scala-lang.org/t/proposal-to-add-trait-parameters-to-the-language/2356
2. https://contributors.scala-lang.org/t/proposal-to-add-intersection-types-to-the-language/2351
3. https://contributors.scala-lang.org/t/proposal-to-add-union-types-to-the-language/2352
4. https://contributors.scala-lang.org/t/proposal-to-add-dependent-function-types-to-the-language/2354
5. https://contributors.scala-lang.org/t/proposal-to-add-implicit-function-types-to-the-language/2353

Feedback on these proposals is open until the 25th October 2018, as describe
in the linked Scala Contributors thread.

#### [Proposal to add Intersection Types](https://dotty.epfl.ch/docs/reference/intersection-types.html) and [Union Types](https://dotty.epfl.ch/docs/reference/union-types.html) to the language

 ([YouTube time: 20’49’’ - 24'01](https://youtu.be/tEb4UF6RJrM?t=1250))

**Martin** presents the intersection types as per doc. He does a basic
description of the feature and points out that intersection types are the
duals of union types. He points out that union types have helped replace most
of the lubbing mechanism and early precocious lubbing that happened in Scala
2 (which happens in less degree in the current implementation of Scala 3 but
could be improved in future releases). **Martin** also thinks that union
types are useful for null safety, where any type coming from Java could be
annotated as `T | Null`. He then goes on describing further implementation
details and trade-offs that Scala 3 does in this space. **Adriaan** asks what
are the trade-offs between the encoding of union types that we have in Scala
and the one they use in other languages like Typescript. **Martin** points
out that performance-wise Scala union types would be more performant because
`T | Null` wouldn't box if `T` is a primitive type.

**Sebastien** ([YouTube time: 30’03’’](https://youtu.be/tEb4UF6RJrM?t=1803))
gives his input based on the fact that Scala.js already has Union Types in
Scala 2. He states that they are very limited; they were introduced for
modeling because some libraries “desperately needed” them but turned out they
were overused for no apparent reason. He advises to document the Union Types
proper usage well and not get discouraged by the possible “overusage”.

There is some back-and-forth between **Sebastien** and **Josh** with
regards to performance of union types and their boxing (especially in the
presence of specialization). [More](https://youtu.be/tEb4UF6RJrM?t=1913)

#### [Proposal to add Implicit Function Types to the Language](https://dotty.epfl.ch/docs/reference/implicit-function-types.html)

([YouTube time: 39’01’’ - 43’11’’](https://youtu.be/tEb4UF6RJrM?t=2341))

**Martin** explains what implicit function types are about and points out it's
a pretty “hot” feature that was published in POPL 2018.
He underlines the advantages of implicit function types (like further
abstraction of code that depends on a notion/representation of a context,
like Scala 3's compiler) and points out that implicit function types can
replace the reader monad, even though it's about 10x faster than the reader monad
is. A comprehensive explanation of what implicit function types can do can be
found in [Olivier's Blainvillain talk at
ScalaDays, Berlin 2018](https://slideslive.com/38908156/applications-of-implicit-function-types).
**Martin** thinks that implicit function types should be seen as the
canonical way of doing scope injection, which gives you a lot of
expressivity, to which **Sebastien** adds that what Martin means by canonical
scope injection doesn't necessarily correspond with the way people do normal
scope injection, because in normal scope injection you can't refer to
identifier or parent scopes. **Martin** clarifies that for him comonadic
abstraction are the classical way of scope injection in which we inject
things into an environment, hence the use of canonical scope injection when
referring to implicit function types which allow you to do the same. His
definition of scope injection comes more from a typing rules perspective
rather than the lexical point of view. **Martin** agrees that if there is a
name clash with implicit function types there is a problem indeed.

#### [Proposal to add Dependent Function Types to the Language](https://dotty.epfl.ch/docs/reference/dependent-function-types.html)
 ([YouTube time: 43’11’’ - 44’40’’](https://youtu.be/tEb4UF6RJrM?t=2591))

**Martin** mentions that dependent function types is the last big addition to Scala's type checker. The reason why they are added is because Scala has dependent methods and there is a need for dependent functions (the same rationale has been doing with regards to implicit methods and implicit function types). It's an obvious win because dependent function types allow us to abstract over the idea of implicit methods in functions, so the more we can do the better. Initially he was afraid of the feature because he thought it violated this Scala principle that in the end anything is an instance of a class in some way and it turned out that a new encoding of dependent function types made this initial argument moot. Dependent function types are now encoded as implicit function types with type refinements, so this way it doesn't violate that principle.
**Adriaan** mentions that the last missing bit is polymorphic function types
and Martin agrees and says that they are looking into that, but maybe not for
Scala 3.0 (Guillaume Martres is pushing for polymorphic function types).

#### [Proposal to add Trait Parameters to the Language](https://dotty.epfl.ch/docs/reference/trait-parameters.html)

([YouTube time: 44’42’’ - end ](https://youtu.be/tEb4UF6RJrM?t=2682)) 

**Martin** describes trait parameters and says that they subsume a large number of use
cases of early initializers. They were not added to Scala from the start because of
uncertainty in the way they would work with regards to linearization and
initialization of parameters. The way they solved this problem is by
enforcing the rule that only the class extending a trait with parameters can
pass the parameters. The motivation to add trait parameters is to regularize
the language and get rid of early initializers which are an ad-hoc feature
and are much harder to understand how to use correctly. Afterward, the
Committee discusses some of the limitations of trait parameters.
**Josh** ([YouTube time: 48’40’’](https://youtu.be/tEb4UF6RJrM?t=2920)
suggests he will find one of his libraries that uses a lot of early
initializers and see if trait parameters allow him to replace them. He's
curious about how clean would the code look after the change.

**Jorge** then wraps up the meeting, points out how feedback on these
proposals would work (check the following link
*https://contributors.scala-lang.org/t/second-batch-of-scala-3-sips-additions-to-scalas-type-system/2376*)
and finalizes the discussion.

**Conclusion** Next meeting will be dedicated to the Second Batch disscusion. 
