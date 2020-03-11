---
layout: sips
title: SIP Meeting Minutes - January 27 2020

partof: minutes
---

# Minutes

The meeting took place without a pre-defined agenda, but with the overall goal of reviewing progress and
updating the status of features in the Scala 3 feature list
([link](https://dotty.epfl.ch/docs/reference/overview.html)).

The topics that were discussed were:

* Binary Integer Literal
* Open Classes
* Explicit Nullability
* Enumerations
* TASTy

## Date and Location

The meeting took place on the 27th January 2020 at 17:00 CET via Zoom at EPFL in Lausanne, Switzerland, as well
as other locations.

The meeting was broadcast and recorded on the Scala Process's YouTube channel:
[SIP meeting January 2020](https://www.youtube.com/watch?v=ws2AaDUg-6E) [1:00:53].

Minutes were taken by Dale Wijnand.

## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), Scala Center
* Guillaume Martres ([@smarter](https://github.com/smarter)), EPFL
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Josh Suereth ([@jsuereth](https://github.com/jsuereth)), independent
* Dale Wijnand ([@dwijnand](https://twitter.com/dwijnand)), secretary

## Not present

* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Process Lead
* Iulian Dragos ([@dragos](https://github.com/dragos)), Triplequote
* Lukas Rytz ([@lrytz](https://twitter.com/lrytz)), Lightbend
* Miles Sabin ([@milessabin](https://github.com/milessabin)), independent
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), CMU

## Proceedings

(Unfortunately, while the lovely external microphone was fully functional for the Zoom call, unknowing to
everyone at the meeting (until near the end), the laptop microphone was what was being used for the YouTube OBS
capture.  Therefore, it is near impossible to hear what was said from the YouTube recording, so the minutes this
month will be an opinionated executive summary of only the highlights.)

### Binary Integer Literal

Thread: <https://contributors.scala-lang.org/t/pre-sip-support-binary-integer-literals/3559>

The committee feels that, despite the benefits outlined in the proposal in this Pre-SIP, it doesn't fit the
criteria for inclusion in the initial release of Scala 3 (that is, Scala 3.0), specifically given it can be
added later without technical breakages or changes in understanding of Scala ("book breaking").  However it
might come up again when Dotty's `FromDigits` is discussed (in some future meeting).

### Open Classes

Thread: <https://contributors.scala-lang.org/t/sip-public-review-open-classes/3888>

After Seb initially summarises the public review contributors' thread, some more technical details are
discussed.

One suggestion from the thread was that instead of being a new keyword it could be an `@open` annotation that
users can opt-in to.  Martin responds that an `@open` annotation doesn't make the language any simpler, and
it's a bit of a cop-out to use an annotation instead of a keyword, particularly as the principle is that
annotations shouldn't change semantics (and it's intended that `open` does).

It's also highlighted that perhaps one of the biggest motivations for this proposal is to make the default
`class Foo` be the right choice most of the time, countering the blog and conference talk advice that unless
they're doing `final class Foo` (particularly `final case class Foo()`) then their code is "broken" or "not
professional".

Finally, a strawpoll was taken, with the committee members present, with the following results:
  * Aye, by Martin
  * Aye, by Sébastien
  * Aye, by Guillaume
  * Aye, by Adriaan
  * Unsure, by Seth, but strongly in favour for just case classes
  * Aye, by Josh, but with some nuance on some technical details

### Explicit Nullability

Thread: <https://contributors.scala-lang.org/t/sip-public-review-explicit-nulls/3889>

Again, after some initial review of the thread feedback and chatting about some of that feedback, one of the
highlights is that roughly Kotlin's platform types are very similar to Dotty's union type implementation, but
that it would be worth comparing more closely to understand where they're different.

The general update on the proposal is that there are some concerns, and both the proposal and the implementation
require more work and more study.  Particularly there are implementation concerns with how unchecked null is
handled, which has consequences on what code is consider valid.  As there are other paths to handle Java interop
(including reviewing how platform types work), the proposal is going be somewhat withdrawn, so that the Dotty
team can work on it some more and come back to this SIP proposal.

Anyone interested in participating in experimentation is very welcome, as experimentation at this point would
be very, very valuable.

### enum

Dotty's enum proposal is ready for public review, so Josh will open a thread.

There are specific topics that need discussing:
* the type of the enum (e.g. is `Some(5)` a `Some[Int]` or a `Option[Int]`)
* details of the Java enum aspect
* some implementation details, like the `toString` of enum variants

Enums will be discussed at the next SIP meeting.

Here's the public review thread, by Josh: <https://contributors.scala-lang.org/t/proposal-for-enumerations-in-scala/4020>

### TASTy

The TASTy format isn't really a SIP, but it should be one.

Seb explains how it has mostly been discussed in terms of a new "binary format" for Scala.  But he believes that
it instead should be considered as an intermediate language, with a spec, and the golden standard for what Scala
is and means, and what it means for compatibility in the future.

He continues that up to now the JVM bytecode was considered as the compatibility, and that we have tools like
MiMa to verify backwards compatibility.  The TASTy proposal is to change that and use TASTy for that very
purpose.  Under that idea, a breaking change to TASTy would mean a breaking change to Scala, and should
therefore mean a new major version (such as Scala 4).

## Next

The next meeting will be on the last week of February, at 17:00 CET.  In March the Committee will meet for a 3
day retreat but it will still come online for an hour, to provide a summary of what happened.
