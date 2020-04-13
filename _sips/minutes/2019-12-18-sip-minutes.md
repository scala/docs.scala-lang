---
layout: sips
title: SIP Meeting Minutes - December 18 2019

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

Review the following SIPs:

1. Open classes (aka "sealed classes by default") - Seb
2. Explicit Nulls - Seb
3. Main functions - needs a champion

## Date and Location

The meeting took place on the 18th December 2019 at 17:00 CET via Zoom at EPFL in Lausanne, Switzerland, as well as other locations.

The meeting was broadcast and recorded on the Scala Process's YouTube channel:
[SIP meeting December 2019](https://www.youtube.com/watch?v=ZUHmo1MXhRA) [58:37].

Minutes were taken by Dale Wijnand.

## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Process Lead
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), Scala Center
* Guillaume Martres ([@smarter](https://github.com/smarter)), EPFL
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Iulian Dragos ([@dragos](https://github.com/dragos)), Triplequote
* Lukas Rytz ([@lrytz](https://twitter.com/lrytz)), visiting from Lightbend
* Dale Wijnand ([@dwijnand](https://twitter.com/dwijnand)), secretary

## Not present

* Miles Sabin ([@milessabin](https://github.com/milessabin)), Independent
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), CMU
* Josh Suereth ([@jsuereth](https://github.com/jsuereth)), Independent

## Proceedings

### Organisational changes

Darja gave an update on some recently agreed upon changes to help streamline the SIP process for Scala 3.  Each
member of the committee will "own" a certain number of features, which they will either champion to the
committee and/or which they will spend time investigating and trying to poke holes into.  The goals are:

1. make sure that a good number of people exercise the feature, try to break it, refine it and raise any red
   flags about it;
2. provide a detailed review of the feature, especially for the contentious ones; and, finally
3. straw poll will be taken on each feature, as a smoke test for the real vote

Note that the feature review will still involve the community; it will not be done in a vacuum.

### Quick update on the "given" redesign

Sébastien gave a quick, side-line, update on the "given" redesign thread
([link](https://contributors.scala-lang.org/t/updated-proposal-revisiting-implicits/3821)) stating how the
discussion is still ongoing and how some changes were done on it recently (particularly around conditional given
instances), so invites any interested parties to have a look at it.

### Review the "Open classes" / "sealed classes by default" SIP

Thread: <https://contributors.scala-lang.org/t/sip-make-classes-sealed-by-default/3767>

Sébastien championing and presenting.

The gist of the proposal is we currently have 3 kinds of classes:
* sealed classes, which can only be extended in the same file;
* final classes, cannot be extended at all; and
* non-final, non-sealed classes, which can be extended from anywhere

This situation is typically problematic for library authors who can accidentally leave a class open, which means
that those classes can't be evolved in any way without breaking someone's code somewhere.  So the idea is to
introduce a 4th option: explicitly open classes.  This would be a strong signal to say "I have intended this
class to be open and extended, and I have a contract for extension".  And, therefore, not having any modifier
would be taken to mean "I haven't done all the effort to make sure it makes sense to extend this class, but I'm
not preventing anyone from doing it".  Then the compiler would emit a warning when you extend the class and you
can disable the warning with a language import/flag.

The feedback from the contributors thread could be summarised as comprising of 2 categories of people:

* people that like the feature very much, which Sébastien thinks are all library authors;
* people who are concerned that this is removing their ability to patch up libraries by extending and
    overrinding some methods, which seem to be application developers

Sébastien's response to the feedback is that you can still patch up libraries, as it just emits a warning, which
you can also suppress, and therefore he summises that it's overwhelmingly in favour.

Iulian shared that he believes there is a lot more application code than library code and so application
developers' concerns should be weighed a bit more than libraries authors, particularly given library authors are
more advanced language users, and so they can just use final and sealed when needed.  He also wonders: if
everyone's going to add this flag, is that a good default?  But it's good that there's a way to keep exisiting
behaviour, like the precedent in Kotlin.  As a second remark, he sees enums/ADTs as being a large percentage of
the target of this problem, as in sealed and final is used for ADTs, so he wonders maybe the feature should be
just for those, and not for the other classes.

Martin said he's not sure as he thinks that most people will continue to use normal classes and that there are a
lot of application areas where people use normal classes.  His impression is that a good compromise has been
found with the language import as library writers are protected, it clearly communicates what could be
overriden and what couldn't, and users who still want to override can.  Today either a library writer has to
accept that people could override the class, so any change could break, or they have to be paranoid and make
everything final and some possibly good use cases, such as mocking, can't be done.  So the proposal make the
default that someone didn't write an inheritance contract, which is 95% of the time.

Sébastien goes further on the topic of inheritance contracts, explaining how they are much more difficult to
write and think about than usage contracts.  In a usage contract you have to define what happens when you call a
method in every public method; while in an inheritence contract you have to define not only that but also very
precisely describe, for every public or protected method, when will those be called and what it means to
override them...  in the flow of internal things that can happen inside the class.  They are so many moving
parts, and it's really crazy.  So typically people don't think about inheritence contract at all.

Dale mentions he has a quick question and a comment.  The question is whether classes with no modifiers are
considered by the exhaustivity checker as sealed.  The comment is: as a library author, if I don't have final,
isn't adding final a breaking change?  Because he sees it as a breaking change for any of his users that use the
language flag, so it's just as breaking as it is today.

Sébastien first answers the question stating the exhaustivity checker can't change: no modifier classes aren't
considered sealed.  With regards to making something final is breaking, he agrees, but suggests you could
explicitly make it sealed, which is source-breaking but not binary-breaking.  The point of the feature is the
signal to the user that extending a non-open class is "exploiting" something that was not intended, exposing
themselves to a risk.

Guillaume has 2 comments:

1. The proposal is that no modifier classes are extendable within the same file as the class (with no warnings),
   much like sealed classes are only extendable within the same file.  This makes sense for sealed, for
   implementation reasons, but the examples in the proposal are more project/package level concerns, about a
   user in another codebase extending, so it's not really a file-level concern.  It would be nicer if this were
   at project level rather than file level (but harder to implement).

2. He also has a concern over the introduction/usage of language flags/imports, as typically people see a
   warning, silence it, and never see the warning ever again.  You end up with language dialects.  So one idea
   he had was that when you extend you have to do something more explicit, like  a "force extends" - some kind
   of keyword or syntax - at the extension point.  Then you wouldn't create a new language dialect, and wouldn't
   need to introduce a new import/flag.

* Seb: that wouldn't work for mocking library, where you would typically just enable it for the
compilation of test sources.
* Gui: if mocking libraries work with macros, then the macro can just write the right tree, with the force extends
* Seb: yeah, maybe

Seth comments that he find the whole thing so questionable.  To him it seems like an area where everything was
fine, and there wasn't a big pain point.  Sébastien says that this is a big pain point for him, along with
nulls, and that every time he writes a library this trips him up, every single time.  Martin mentions how there
are public code guides that state "you must put final on every case class" which is bad as it promotes a very
verbose and boilerplate-y style, due to the lack of this feature.  Seth counter-responds that he would then like
to see this explore how the feature can be restricted to just case classes, as he's seen people often talk about
the fact that case classes aren't final, but not so much about normal classes.

Sébastien wraps up and, together with Guillaume and Seth, decides that, given the proposal has evolved throughout
the original contributors thread, to open a new contributors thread, stating the current status and some of the
alternatives discussed in this SIP meeting, formally opening a round of public review.

New thread: [SIP public review: Open classes](https://contributors.scala-lang.org/t/sip-public-review-open-classes/3888)

### Review the "Explicit nulls" SIP

Thread: <https://dotty.epfl.ch/docs/reference/other-new-features/explicit-nulls.html>

Sébastien championing and presenting.

The feature was just merged into Dotty (at the time of the meeting).

Sébastien explains how null is an issue, given every reference type is nullable.  The Scala type system doesn't
protect you from NullPointerException's coming up anywhere.  So the goal of this proposal is to fix this.  The
basic idea is that a reference type like String is not nullable, so you can't assign null to something that is
of type String.  So how would one write a nullable type?  To Sébastien the obvious answer is using a union type:
String | Null.

That's it... basically.  Then there's the tail of consequences from that.

One big consequence is Java interop, obviously.  Because if you want to talk to a Java library any reference
type might be a null and the library might even use nulls as signals.  But at the same time many Java types are
not, in fact, nullable, in practice, in the API.  So there is a tricky balance: do you translate every reference
type to String | Null and deal with it with ifs and pattern matching or some flatMap-y API/syntax, every time,
evne when you know it's not nullable?  Or you can just say if it comes from Java then you just accept it might
be a null, but then you don't have any checks any more in practice.  So here the proposal - and it's one of the
more delicate points - says that things that come from Java are a bit special.  A String that comes from Java is
neither String nor String | Null, it's String | UncheckedNull.  That type has some special properties, like you
can dot-select on it, for example.  It's something in the middle.

Guillaume asks: how in the middle?  What can you _not_ do?

Seb: when it becomes something that is just String it will eagerly fail there.  So if your Scala API declares
something is a String, and you use a Java API that returns String | UncheckedNull, it will throw in the body of
your method.  It can't "give the null away".

The other big thing in the proposal is that there's a lot of code that writes "if x == null do something else do
something with x" that assumes x is not null.  Here the idea is to introduce some form of flow typing, that can
prove that in the else branch x is a String.

Seth mentions how he's really enthusiastic about this proposal, with the exception of the flow typing.  It seems
odd to him to introduce that in such a limited way.  To him it seems like something that either the language
should go all in on or not do at all.  Sébastien responds that that's a valid concern, sharing he's not entirely
convinced himself.  He mentions how the question is how inconvenient would it be if we didn't have the flow
typing for all the legacy code that has that kind of code.  Martin shares that every other language that
introduced explicit nulls has some form of flow typing - he doesn't think there are any exception - you
basically need to do that.

Guillaume asks: flow typing or the elvis operator?

Iulian mentions how he wanted to talk about the elvis operator.  He asks: what is the recommended way to call
methods on nullable types?  What is the equivalent of the elvis operator?

Seb: you don't call methods on nullable types, you have to first test if it's null.  The problem with the elvis
operator is that it looks like flatMap but it's not.  It's unboxed, so it confuses the equivalent of None and
Some(None).  That seems theoretical but it's not - it boils down to practical things.  For instance, Map#get
returns null - if the Map's value type is itself nullable you can't distinguish if the key is set in the Map to
null, or if the Map is signalling it doesn't contain the key.  You really need to just write the if/elses or
flatMap.  Sébastien doesn't think this will happen very often in typical Scala code.  Iulian says he thinks this
feature is very useful as it adds null safety, but he would guess that users would want the elvis operator.

Sébastien, responding to YouTube chat comments, shares that Option.apply is changed to take A | Null and return
Option[A], so it continues to be the direct way to deal with nulls.

Sébastien is reminded that he hasn't yet talked about `.nn`.  `nn` is an extension method added to `A | Null`
that, when invoked, is an assertiong that a value is not null (thus "nn") and will throw a NPE if it is and
return `A` if it's not.

Sébastien shares he doesn't like that `.nn` is available everywhere, without even an import.  Guillaume says
it's a bit like `.get` on Option.  Martin says he would defend .get and .nn, say that users should not use them
if they don't like them.  Martin also says that maybe after the Scala 3 transition we could deprecate it and/or
move it, but for now he thinks it's good to have universally available.

* Seth asks Martin: is null only for performance-critical code, or is that just one of the use cases?
* Martin: Java interop or performance-critical code
* Seth: Doesn't the UncheckedNull cover the Java case?
* Martin: well, no, you might want to use A | Null in some code adjacent to some Java interop code, which wouldn't
be terribly low level code.  So in that case you might continue to use null.
* Seb: an easier way to answer is that UncheckedNull is only to select a member.  You cannot assign a String |
UncheckedNull to a String.  If you want to store the value in a String, it will be checked then, at runtime.

Iulian comments: UncheckedNull seems to exist to allow unsafe selection, I think the elvis operator is slightly
better for that.  Martin shares how Kotlin went through all that.  They initially had the elvis operator but it
meant you had to write `System.out?.print` and no one was prepared to do that.  So they relented and come up
with something similar called "platform types" which is their analog of our UncheckedNull.  Iulian says that he
still finds that UncheckedNull is a very easy way to turn a blind eye on nulls and fears its existing will
continue to allow lots of NPEs to be generated.  He thinks it's very easy not to realise that these are
unchecked nulls, using a Java method, and you don't get any warnings.  Martin says how no, as soon as you
typecheck it in Scala as String, then that means String, not String | UncheckedNull, so that's theoretically
your firewall.

Guillaume also shares how with the proposal also come a bunch of annotations for the Java standard library that
are supposed to know which methods take or return null, so for thins that return null Scala could make it type
as `A | Null` instead of `A | UncheckedNull`.

Sébastien shares that some users don't like the magic of UncheckedNull, so maybe that could be behind a language
flag, though there are language dialect concerns with language flags.

Seth then asks about the status of the -Y flag associated with this feature: is the intention of the feature to
be on by default?  Sébastien says: hopefully, if it all works out.  Martin says maybe it could be turned on by
default by Scala 3.1.  Guillaume says he's confused what it means for some libraries to enable the flag and some not to.
Martin summarises that, basically, we need to get to the point where we have it on by default.

Sébastien, looking at the YouTube chat, shares Eugene Yokota's question: "what about `var x: String = _`?"
Sébastien shares how it's "evil" and how it should've been removed a long time ago.  Martin counters that it's
quite the opposite: it should not be taken to mean that it's assigning null, it should be taken to mean that the
variable is unassigned and the initialisation checker should check that before each usage.  That's better than
assigning null.

Dale states how it seems there aren't any good ergonomics for using a value of type `A | Null`.  Sébastien says
that's a good thing: use if/else or Option.  Dale clarifies that he was trying to make a case for promoting
`UOption` (from [sjrd/scala-unboxed-option](https://github.com/sjrd/scala-unboxed-option)).  Sébastien says that
the meeting is running out of time, but he has a solution with UOption.  Martin seems pleased and ask "Can we
get it, please, for 3.0?".  Seth comments how Sébastien comment sounds like "too long to fit in this margin". :D

### Review the "main functions" SIP

Docs: <https://dotty.epfl.ch/docs/reference/changed-features/main-functions.html>

Sébastien shares that there are only a few minutes left in the meeting but the gist is that DelayedInit is gone
(so far) and the obvious question is: what do you do for a simple main method?  The idea for now is to have an
`@main` annotation and you can write a `def foo`, which takes parameters, and you write the body inside, and,
since we have top level functions, you can write that at the top level, which is even better and everyone is
happy.  But there are details, of course.

Martin states it lacks a champion and asks if anyone wants to champion it.  Seth agrees and, so, Sébastien asks
him to open a contributors thread on it.

## Next

The next meeting will be on the last week of January, at 17:00 CET.  The same will happen in February.  In March
the Committee will meet for a 3 day retreat but it will still come online for an hour, to provide a summary
of what happened.
