---
layout: sips
title: SIP Meeting Minutes - 29th November 2016

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

|Topic|Reviewers| Accepted/Rejected |
| --- | --- | --- |
| [SIP-28 and SIP-29 - Inline and meta](https://github.com/scala/improvement-proposals/pull/28) | Josh Suereth and Iulian Dragos | Pending |
| [SIP-24 - Repeated By Name Parameters](https://github.com/scala/improvement-proposals/pull/23) | Heather Miller | Pending |
| [SIP-30 - Static members](https://github.com/scala/docs.scala-lang/pull/491/files) | Adriaan Moors | Pending |
| [SIP-27 - Trailing commas](https://docs.scala-lang.org/sips/trailing-commas.html) |Eugene Burkamo | Accepted |

Jorge Vicente Cantero was the Process Lead and Travis Lee was the secretary.


## Date and Location
The meeting took place on 29 November 2016 via Google Hangouts at EPFL in Lausanne, Switzerland as well as other locations.

Minutes were taken by Travis Lee.

## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), Scala Center
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), EPFL
* Iulian Dragos ([@dragos](https://github.com/dragos)), Independent
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Dale Wijnand ([@dwijnand](https://github.com/dwijnand)), author of SIP-27


## Proceedings
### Opening Remarks

**Jorge** We'll talk about the SIPS for Scala Meta. Eugene will start.

### [SIP-28 and SIP-29 - Inline and meta](https://github.com/scala/improvement-proposals/pull/28)

Eugene and co have been working hard for two months on inline and Scala Meta. Previously discussed new macro system with new inline and meta features. Inline provides a facility to declare methods with inline right hand side into call side (0:01:24) and meta implements compile-time function execution to do meta-programming. Martin implemented inline mechanism in Dotty. Eugene worked on macro notations. New style macros will integrate with tools. Eugene shows how it works in IntelliJ. For example, you can print the value of the parameters. Meta blocks supported by IntelliJ. So are quasi-quotes. You can also expand macros. Will greatly help debugability.

Iulian says we should flesh out the Scala meta API.

The spec needs to be updated based on Martin's Dotty implementation. We need to split the SIPs for the next meeting.

**Conclusion** This proposal needs at least another iteration to shape up and provide concrete implementation and specification details. This proposal is therefore under revision -- Eugene, the author, will gather and address more feedback and will resubmit the proposal to analysis when it's ready.

### [SIP-24 - Repeated By Name Parameters](https://github.com/scala/improvement-proposals/pull/23)

Heather says the debate is about the semantics or translation rules. All arguments are evaluated each time the parameter is referenced in the method. This is implemented in Dotty. Should this be implemented in Scalac?

Sébastien thinks that Java bridge should be forbidden in this case. It's annotation that we add, so we could just make it an error.

The SIP needs more examples. Martin says it's to remove an annoying restriction; there's no reason we can't we mix repeated and by name parameters. Evaluating them all together is much simpler. There's another reason regarding case classes. Inline function should maintain call by value semantics. Pass parameters by name just to be clean.

The main motivation is to prepare for inline. Inline won't work very well without this. Need to flesh this out in SIP.

**Conclusion** There is not an implementation for Scalac, but for Dotty. This proposal is on hold until the Committee decides the specifics of the Inline proposal and how it relates to it. After that, the author will resubmit the proposal for further analysis.

### [SIP-NN:Static](https://github.com/scala/docs.scala-lang/pull/491/files)

Iulian says too much code is generated by annotations. We could solve name clashes the way Scala.js does by specifying the exported name. How can we wake code generation predictable without looking at annotations? How do we emit public static field without accessors? Having everything emitted as static and object where possible is going to simplify reasoning about how things are initialized.

How should a user decide when to use static? It is platform-dependent.

This would generate another set of accessors. It changes the bytecode. It has a special relationship with lazy vals. Maybe it shouldn't be an annotation.

Seth thinks it ought to be an annotation because it's affecting an external representation of the code and not the meaning from Scala's perspective.

Martin says it's important that there are these restrictions, that they come first in order not to have surprises with initialization order.

A lot of people are surprised about initialization order.

Sometimes we need something to be static for Java interop.

Sébastien says binary compatibility is also an argument in favor of having explicit @static annotation. If in one version you have a static method, in the next version you add a method with same name and signature. The static implementation is not there anymore, then you have broken binary compatibility in a silent way.

**Conclusion** There are a lot of edge cases when not using annotations. The authors need time to work on the specifics of the proposal and address the Committee's feedback. We need to think about cases around initialization to simplify it. Why do statics need to go first? Show surprising results. There are different implementation strategies. Is this more like @tailrec or does it change generated code? This is the first review iteration of this proposal.

### [SIP-27: Trailing commas](https://docs.scala-lang.org/sips/trailing-commas.html)

Dale talks about how we wanted trailing commas for multi-line elements. Should be easy. Need to discuss which parts of the syntax can use trailing commas. There are two variants of the SIP to vote on. The first is _parameters and arguments_. The other variant is _everywhere_ for consistency. Dale implemented the first one. The second one shouldn't be more hard to implement except for tuples. It needs to fail compilation somehow.

It could be confusing if trailing commas are only allowed some places and not others. We'd need lots of error messages.

Seth isn't that excited about trailing commas but if we have them, they should be everywhere.

In the case where you have a one-element tuple like `(1,)` it would create an normal expression. This should fail.

Martin suggests a rule could be "a trailing comma followed by a new line and a closing paren, bracket, or brace, is ignored". That would include imports but not a lot of other things. That could be done in the scanner only.

**Conclusion** Give this one week. Generally people feel good about it. Dale needs to implement Martin's newline rule.
