---
layout: sips
title: SIP Meeting Minutes - 6th December 2017

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

|Topic|Reviewers| Accepted/Rejected |
| --- | --- | --- |
|Discussion and voting on Miles Sabin (Typelevel representative) joining the Committee |  | Accepted
|[SIP 23: Literal-based singleton types](https://docs.scala-lang.org/sips/42.type.html) | Adriaan Moors | Accepted
|[SIP-33: Priority-based infix type precedence rules](https://docs.scala-lang.org/sips/priority-based-infix-type-precedence.html) | Josh Suereth | Accepted |
|[SIP-NN: Adding prefix types](https://docs.scala-lang.org/sips/adding-prefix-types.html) | Josh Suereth | Pending |
|[SIP-35: Opaque types](https://docs.scala-lang.org/sips/opaque-types.html) | Sébastien Doeraene | Not discussed |
|Discussion about the future of Scala 2.13 and 2.14 |  | Not discussed |


Jorge Vicente Cantero was the Process Lead and Darja Jovanovic as secretary.

## Date and Location
The meeting took place on the 6th December 2017 at 5 PM CEST via Google Hangouts at EPFL in Lausanne, Switzerland as well as other locations.

[Watch on Scala Center YouTube channel](https://youtu.be/Mhwf15gjL9s)

Minutes were taken by Darja Jovanovic.

## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Scala Center
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), Twitter
* Iulian Dragos ([@dragos](https://github.com/dragos)), Triplequote
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Miles Sabin ([@milessabin](https://github.com/milessabin)], Independent
* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Scala Center

## Proceedings
### Opening Remarks

**Jorge** opens up the meeting by announcing **Miles Sabin** as a new Committee member, **Miles** joins the Committee meeting.

### [SIP 23: Literal-based singleton types](https://docs.scala-lang.org/sips/42.type.html)
[YouTube time 6'44''](https://youtu.be/Mhwf15gjL9s?t=402)

**Miles** introduces the SIP, giving a progress overview after taking charge of the SIP and about its implementation in Typelevel Scala.
He is reasonably confident that "the documentation matches the PR and that PR matches the people's expectations".
**Adriaan** clarifies that this PR finally brings to the language users features that have been, so far, commonly used inside of the compiler. Proper documentation and implementation on how type inference interacts with these features were crucial in the process.

**Jorge** asks for a comparison between **Miles'** implementation and the Dotty one.
They are now aligned in **Miles'** opinion, but he noticed some implementation differences in Dotty, notably "the use of the Singleton bound on a type variable to allow singleton type to be inferred"

**Sébastien** [YouTube time: 15'41'' - 21'30''](https://youtu.be/Mhwf15gjL9s?t=936) challenges the meaning of *asInstanceOf* in the text of the SIP, asking for the clarification between what it does and what it should do.
**Martin** points out that it is might be misunderstood, and continues by explaining that *asInstanceOf* never does an equality test and in general it does the minimum amount of work to satisfy the underlying platform "JVM" or "JS".
The consensus is that *asInstanceOf* should be corrected to which
**Adriaan** adds that "spec says that *asInstanceOf* is a pattern matching" and that's where the change needs to happen.
The Committee members agree the SIP is ready to be voted for, given the track record and it's actual use in the community.

**Conclusion** : The SIP-23  is accepted by unanimity. The "asInstanceOf" should be changed in the SIP text. 

*See also*:
Brief explanation about the "The presence of an upper bound of Singleton on a formal type parameter 3rd point in the SIP [YouTube time 14' to 15'35''](https://www.youtube.com/watch?v=Mhwf15gjL9s) and [YouTube Time 17'42'' to 18'20'']( https://youtu.be/Mhwf15gjL9s?t=1069)

### [SIP-33: Priority-based infix type precedence rules](https://docs.scala-lang.org/sips/priority-based-infix-type-precedence.html)
[YouTube time from 1'34'' -  6'45''](https://youtu.be/Mhwf15gjL9s?t=96)

**Jorge** shortly introduces the SIP and notifies the Committee that the author has amended all the changes as per Committee suggestions. The SIP-33 was split in two SIPs as follows:

a) [SIP-33: Priority-based infix type precedence rules](https://docs.scala-lang.org/sips/priority-based-infix-type-precedence.html)

b) [SIP-NN: Adding prefix types](https://docs.scala-lang.org/sips/adding-prefix-types.html)

**Seth** asks about the implementation status in Dotty and if there are any crucial differences in Scala 2 and Dotty?
**Martin** and **Sebastien** agree there are none in regards to this SIP.
The members are all in favour for this change and proceed to voting.

**Conclusion** : The SIP-33 is accepted by unanimity.


### [SIP-NN: Adding prefix types](https://docs.scala-lang.org/sips/adding-prefix-types.html)
[YouTube time: 25'00 until the end](https://youtu.be/Mhwf15gjL9s?t=1503)

**Jorge** introduces the SIP's development, based on the idea
(in **Oron's** words) "it is easier to reason about the language when mathematical and logical operations for both terms and types are expressed the same"; goes over the motivation examples **Oron** proposed since the last SIP (*splice prefix types for meta programing; singleton-ops library and DFiant library example*) and opens the discussion about the recent use-cases.

**Martin** starts with by introducing his PR, the use-case in Dotty, ["Principled Meta Programming"](https://gist.github.com/odersky/f91362f6d9c58cc1db53f3f443311140). **Sébastien** argues that **Martin's** use-case is not really related to what the SIP-NN is aiming to achieve, but in this context he would rather agree on special-casing the ˜ for macros and splices.

However, **Sebastian** gives his preference to the SIP itself.
**Martin**, on the other hand, is "dubious" about the SIP, stating that in Scala those 4 operators were defined originally because the syntax in Java. He disagrees with now making a step even further - elevating them to the principal. He is also sceptical because he foresees the "end-operator misuse" to which **Adriaan** adds the issue between *annotations* and *variants* that could make the confusion even deeper. 
**Seth** and **Eugene** agree it could be too confusing, and even though there is a potential in unifying the language features, this particular SIP doesn't seem to address it in a clear and persuasive way.

**Miles** proposes to let this SIP have its implementation in Typelevel Scala. He believes the arguments raised in this discussion could be tested and eventually even answered or "shaped" by the user's experience. He asks to defer the discussion until the use-case is ready. **Adriaan** supports the idea but underlines that it is important to know that implementation should not be considered as a guarantee leading to be a part of the language.

The Committee proceeds with voting on numbering the SIP.

**Conclusion**: The SIP-NN is numbered, from now SIP-36, it will be discussed once results of the Typelevel implementation are ready.

### To be discussed

Other announced agenda items were not discussed in this meeting because of the lack of time. They will be addressed in the next meeting.

- [SIP-35: Opaque types](https://docs.scala-lang.org/sips/opaque-types.html)

- Discussion about the future of Scala 2.13 and 2.14. In concrete, the following ideas that Adriaan has presented publicly in his talk, [the link](https://adriaanm.github.io/reveal.js/scala-2.13-beyond.html#/)
  Some examples of his ideas:
  
  [Remove package objects](https://github.com/scala/scala-dev/issues/441)
  
  [Only allow simple blackbox macros](https://github.com/scala/scala-dev/issues/445)
  
  Change implicit search semantics in [link 1](https://github.com/scala/scala-dev/issues/446) and [link 2](https://github.com/scala/scala-dev/issues/447)
