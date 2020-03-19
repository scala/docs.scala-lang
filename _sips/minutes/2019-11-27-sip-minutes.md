---
layout: sips
title: SIP Meeting Minutes - November 27 2019

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

1. Re-visiting what SIP Committee's role is given the Scala 2 to 3 transition
2. Dotty feature freeze is coming soon - what does that mean?
3. Review the "Curried varargs" SIP
4. Review the "Name-based XML literals" SIP
5. The priority of Dotty features the SIP Committee has to discuss

## Date and Location

The meeting took place on the 27th November 2019 at 17:00 CET via Zoom at EPFL in Lausanne, Switzerland, as well as other locations.

The meeting was broadcast and recorded on the Scala Process's YouTube channel, but due to technical difficulties
that broadcast had to be restarted half-way through and therefore there are two videos:

* part 1 (16:56): <https://www.youtube.com/watch?v=jjEcYY2R9mU>
* part 2 (06:43): <https://www.youtube.com/watch?v=jFjjYybY_wY>

Minutes were taken by Dale Wijnand.

## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Process Lead
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), Scala Center
* Guillaume Martres ([@smarter](https://github.com/smarter)), EPFL
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), CMU
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Iulian Dragos ([@dragos](https://github.com/dragos)), Triplequote
* Miles Sabin ([@milessabin](https://github.com/milessabin)), Independent
* Lukas Rytz ([@lrytz](https://twitter.com/lrytz)), visiting from Lightbend
* Dale Wijnand ([@dwijnand](https://twitter.com/dwijnand)), secretary

## Not present

* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Josh Suereth ([@jsuereth](https://github.com/jsuereth)), Independent

## Proceedings

### Re-visiting what SIP Committee's role is given the Scala 2 to 3 transition

* What happens to the current SIPs?
* What is the timeline for them?
* Who can make new proposals?
* Which changes to the process were made in November 2018?
* And which changes should be made going forward?

Darja presented the topic.  The background is that in November 2018 the SIP Committee accepted the "Dotty team
proposal of changes", which wasn't like the regular SIP proposals but is more like a large number of proposals
for Scala 3.  Those individual proposals still need to be individually reviewed, but doing so will take time.

During that time many pre-existing SIPs didn't progress in any way, some remained "open" when they should've
been closed a long time ago and, more generally, the status of them and the Dotty features SIPs wasn't clear or
well tracked.

Therefore the SIP Committee has decided to:

1. Make a commitment to update the state of all SIPs by March 2020;
2. Change the process to introduce the concept of a "SIP Champion", which is a member of the SIP Committee that
   a contributor finds to progress a Pre-SIP idea into a SIP and to champion the SIP through the process

### Dotty feature freeze is coming soon - what does that mean?

Guillaume presented.

A month ago a thread was created on the [Contributors forum announcing that the next Dotty release][freeze] will
initiate a feature freeze.  What that means is that new things won't be added, instead existing changes will
be refined.  That doesn't mean that new SIPs can't be proposed, but it does mean that such SIPs should adjust
their expectations that its very unlikely they'll be able to target Scala 3.0 and would have to wait for some
future 3.x release.

[freeze]: https://contributors.scala-lang.org/t/preparing-for-feature-freeze/3780

### Discuss the priority of Dotty features the SIP Committee has to discuss

Darja briefly mentioned this task the Committee has, but the discussion itself deferred to expedite the later
topics.

In order to discuss and make decisions on the features coming in Scala 3, the Committee has been looking at how
to prioritise such discussions.  Sebastien has started exploring the timing impacts of each change (related to
how they impact rewriting books/MOOCs, impact source and TASTy compatibility) and experimenting with different
logistical proposals.

This is still pending, but in the December SIP meeting the Committee will have features it's ready to discuss
and vote upon.

### Review the "Curried varargs" SIP

Link: <https://contributors.scala-lang.org/t/pre-sip-curried-varargs/3608>

Sebastien presented.

The proposal highlighted 2 issues with the current implementation of varargs:

1. Arguments LUB together, such as an `Int`, a `String`, and a user's `Foo` will LUB to `Any`, this means that
   one cannot make use of implicit lookup to summon typeclass instances for the specific types of the arguments
2. The current varargs use `Seq` which is an extra allocation that may be costly

The proposal is to add a builder-like interface (perhaps like a typeclass?) that avoid the type widening and the
intermediate `Seq` by building instead the desired data structure.

Martin believes that it should be possible to implement such a proposal with Dotty's meta-programming features,
specifically inline methods.  This would avoid having to "burn it into the language", particularly avoid adding
to the already complex aspects of parameter application.

Guillaume adds that that area also includes method overloading that is very complicated and already requires
attention.  He also adds that it might be that use cases that call for this proposals should look at Dotty's
union types, as he thinks that some of them might be satisfied by having a varargs of union types.

In response to the "but with macros it will be slow" pushback, Guillaume invites users to check the performance
of the Dotty-based implementation, and/or the union type-based solution.  Additionally he and Sebastien say how
making it part of the language (instead of just where the meta-programming solution is used) it would probably
make the whole compiler slower for everyone.

### Review the "Name-based XML literals" SIP

Link: <https://contributors.scala-lang.org/t/pre-sip-name-based-xml-literals/2175>

Sebastien presented.

The proposal is for a way to extend XML literals, perhaps allowing alternative implementation with a somewhat
similar API.  In general there is a resistence to keeping XML literals in the language at all, though the
front-end community has exhibited support for XML literals as it's a convenience that Scala.js brings.

The feedback from the Committee is (similarly to the previous SIP) to attempt to implement it using Dotty's
meta-programming facilities, so a meta-programming backed string interpolator.

Guillaume mentions that there is an interpolator at <https://github.com/lampepfl/xml-interpolator/>, which
implements all of the XML literals except for pattern matching (which just needs attention) and invites the SIP
authors to adapt that to the behaviour described in their SIP.

### Update on the "Revised implicits" SIP

Guillaume gave a quick update: a new thread was created on the Contributors forum to discuss how Scala's
implicits are being revised in Scala 3: <https://contributors.scala-lang.org/t/updated-proposal-revisiting-implicits/3821>

Because the discussion has returned to debating the naming change, he intends to split the thread so that
also-important discussions around the semantics changes aren't drowned out.

## Next

The next meeting will be December 18th at 5 PM CET, but also the Committee intends to have another retreat in
March 2020.
