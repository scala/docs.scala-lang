---
layout: sips
title: SIP Meeting Minutes - 30th August 2018

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

|Topic|Reviewers| Accepted/Rejected |
| --- | --- | --- |
|Summary of the Contributors thread [“Proposal to remove auto application from the language”](https://contributors.scala-lang.org/t/proposal-to-remove-auto-application-from-the-language/2145) | Miles Sabin | Pending
|Summary of the Contributors thread [“Proposal to remove XML literals from the language”](https://contributors.scala-lang.org/t/proposal-to-remove-xml-literals-from-the-language/2146) | Sébastien Doeraene | Pending
|Summary of the Contributors thread [“Proposal to remove the procedure Syntax”](https://contributors.scala-lang.org/t/proposal-to-remove-procedure-syntax/2143) | Josh Suereth | Pending |
|Summary of the Contributors thread [“Proposal to remove early initializers from the language”](https://contributors.scala-lang.org/t/proposal-to-remove-early-initializers-from-the-language/2144) | Adriaan Moors | Pending |
|Summary of the Contributors thread [“DelayedInit or OnCreate, any solution?”](https://contributors.scala-lang.org/t/delayedinit-or-oncreate-any-solution/1748)  | Adriaan Moors | pending |

Jorge Vicente Cantero was the Process Lead and Darja Jovanovic was the secretary.


## Date and Location
The meeting took place on the 30th August 2018 at 5 PM CEST via Google Hangouts at EPFL in Lausanne, Switzerland as well as other locations.

[Watch on Scala Center YouTube channel](https://youtu.be/gnlL4PlstFY)


Minutes were taken by Darja Jovanovic.

## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Iulian Dragos ([@dragos](https://github.com/dragos)), Triplequote
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), Twitter
* Josh Suereth ([@jsuereth](https://github.com/jsuereth)), Independent
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), Scala Center
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Miles Sabin ([@milessabin](https://github.com/milessabin)), Independent
* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Scala Center

## Not present
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), CMU



## Proceedings
### Opening Remarks

**Jorge** opens the meeting, explains SIP dynamics:

Selected batches (proposals for language change in Scala 3) are published on Contributors

Community has 1 month deadline to discuss the proposals

Committee summarises the comments and discusses during the meeting

Decision / voting / postponing the discussion

[More in May 2018 minutes](https://docs.scala-lang.org/sips/minutes/2018-05-18-sip-minutes.html)

### Summaries of discussions of the First Scala 3 batch

### [“Proposal to remove auto application from the language”](https://contributors.scala-lang.org/t/proposal-to-remove-auto-application-from-the-language/2145)
([YouTube time: 2’15’’ - 11’22’’ ](https://youtu.be/gnlL4PlstFY?t=136))

**Miles Sabin**  summarised discussion on Contributors thread.
- Focuses on the Contributors discussion rather than on the proposal itself
- Underlines a lack of motivation in the light of a separate issue from [Dotty: Weak eta-expansion](https://github.com/lampepfl/dotty/issues/2570)
- Concludes that this proposal should be aligned with eta-extension issue

Summary:

References

+ [Scala Contributors thread](https://contributors.scala-lang.org/t/proposal-to-remove-auto-application-from-the-language/2145).

+ [Dotty issue: Weak eta-expansion](https://github.com/lampepfl/dotty/issues/2570).

+ [Martin's comment on the issue above](https://github.com/lampepfl/dotty/issues/2570#issuecomment-306202339).

Comments

+ One comment to the effect that the motivation doesn't actually provide any
  motivating reasons.

  Commenter is pointed to the Dotty issue referenced above. The issue is a
  request to make eta expansion more uniform and predictable, and is addressed
  in Martin's comment linked to above.  This proposal would appear to be a
  corrolary of of that comment.

+ Some questions about parentheses and implicit argument lists.

  Resolution from Sébastiane: implicit argument application syntax unaffected
  by this proposal.

+ A request for clarification about Java/Scala 2/3 mixed overrides, given the
  Java exception.

  Resolution from Martin: "As long as there is a Scala-2 or Java version in the
  set of overridden variants, the rule is relaxed"

+ Some discussion of the use of "()" to indicate effects.

+ Comment about interaction with type parameter lists, eg. `Promise[Unit]` vs.
  `Promise[Unit]()`.

+ Comment about interaction with methods returning values with an `apply`
  method. How does a programmer tell whether the following are equivalent or not?

  ```scala
  f()()
  f.apply().apply()
  f().apply()
  ```
+ Counter proposal from Rex following from the above,

  1. Empty parameter lists, whether implicit or explicit, whether
     zero-parameter or filled completely with default parameters, may be elided.
     This matches what you’re allowed to do with overriding vs overloading anyway
     at the JVM level.

  2. Ambiguous parses are forbidden at the use-site. If `foo()` may be elided to
     foo, then if its return value has an apply method, that apply method cannot
     be called using foo().

  3. `.()` is another synonym for .apply(), so you can compactly disambiguate
     parses.

+ Comment from Gabriele,

  > I’m very much in favor of the spirit of this change, but a bit worried
  > about the actual result.
  >
  > The idea is to normalize things, which makes total sense, but after this
  > change we end up with more inconsistencies than before, due to the backward
  > compatibility towards Scala 2.

+ Interaction with nullary constructors. Currently `class Foo` is interpreted as
  `class Foo()`. Mutatis mutandis for case class `apply` methods.

**Martin** ([Youtube time: 11.37](https://youtu.be/gnlL4PlstFY?t=688)) mentiones that this proposal also came about due to New collection usecases that surfaced in recent work - showing that without a strict rule there is a high amount of "un-disciplined" use of (). But he agrees with Miles about merging the two proposals together.

**Conclusion** **Jorge** takes the task to merge the proposals and extend the motivation.  


### [“Proposal to remove XML literals from the language”](https://contributors.scala-lang.org/t/proposal-to-remove-xml-literals-from-the-language/2146)

**Sébastien** ([YouTube time” 14’53’ - 40’10’’](https://youtu.be/gnlL4PlstFY?t=891)) summarised discussion on Contributors thread. 

Summary: 

In favor of the removal:

- Significant language specification weight, as well as compiler implementation. The whole XML spec must be embedded in Scala!

- scala-xml is very complicated, and has serious usability problems

- Adding the extra xml"""...""" shouldn’t be a bother
  - For JSX-style support, maybe a jsx"" interpolator could have the same semantics as JSX, rather than that of scala-xml
- Direct language support for XML only existed because string interpolators did not exist back then (supposedly). It seems to be an obviously better design to build on string interpolators.
- Removes XML as a special case. With interpolators, one can embed arbitrary languages within Scala.
  - Similar argument: XML should have no higher place in the language than YAML, JSON, etc.
- JSX-style use cases should use ScalaTags-style libraries anyway.
- XML being part of the language is the reason that XML libraries have stalled, and that JSON ones have flourished
  - Counter-argument: lib stalling is due to the “symbol”-based translation. A name-based translation would not have this issue.

Against the removal

- Difficulty of syntax highlighting
  - Shouldn’t be a real issue as long as editors are on board
- The promised XML interpolator was never materialized
- JSX is now in widespread use in languages for front-end development. It is ironic that Scala would drop support for a similar feature now. It is even built in some languages, e.g., TypeScript.
  - JSX is simpler than scala-xml, though: no namespace support, in particular.
- For front-end devs looking at Scala/Scala.js, string interpolators will look horrible compared to JSX, and it might be one of those “no-no” things that will push them away.
- Being able to just copy-paste examples from the Net is nice. (8 Likes on this one)
- No one uses XML anymore, right?
  - Some answer that they do. Especially in non-greenfield projects.
  - Kojo uses XML literals as building blocks for the Storytelling feature.

Counter-proposal

Named-based XML desugaring: https://contributors.scala-lang.org/t/pre-sip-name-based-xml-literals/2175

- Less complexity in the language/compiler
- Open for library competition
- Compared to a string interpolator, flavors can be implemented using normal library code, without (whitebox) macros.
  - Whiteboxness is necessary for xml”””<button …></button>””” to return a more precise type such as `xml.tags.Button` rather than `xml.Node`

Other ideas
- Can it be a compiler plugin or a macro?
  - No, a compiler plugin cannot hook into the parser, neither can a macro.

Related links

- Other XML libraries:
  - https://note.github.io/xml-lens/
  - One in scalaz-deriving: https://gitlab.com/fommil/scalaz-deriving/tree/master/examples/xmlformat/src/main/scala/xmlformat (link behind a login wall, it seems)
- JSX-style libraries for Scala:
  - https://github.com/OlivierBlanvillain/monadic-html
  - Binding.scala, TODO app: https://scalafiddle.io/sf/dGkVqlV/9
- Ammonite script to convert HTML to the VDOM DSL of scalajs-react (a ScalaTags flavor):
https://gist.github.com/nafg/112bf83e5676ed316f17cea505ea5d93

Discussion:

**Eugene**  ([YouTube time: 25’30’]( https://youtu.be/gnlL4PlstFY?t=1530)) thinks that the proposal needs to be cleared about the impact, referring to possible replacements with string literals that might never happen. Suggests to position this proposal as simply removing the feature and leaving it up to the community to decide and implement the replacements.

**Josh** ([YouTube time: 27’16’’](https://youtu.be/gnlL4PlstFY?t=1636)) clarifies that in order to replace the libraries one would need a proof of concept, and currently there is none.

**Adriaan** ([YouTube time 30’](https://youtu.be/gnlL4PlstFY?t=1796)) summarises the discussion, pointing out that Committee needs to answer a question *will we support XML in some way* and *waht would be the most "Scala-like" way to do so* and *who will be maintaing it*.  

**Seth** ([YouTube time 35’57’’](https://youtu.be/gnlL4PlstFY?t=2157)) is under the impression that large portion of XML user base are the ones using it to do generation and rarer to be reading in XML using the existing Scala XML support and asks others to share their impressions.
**Martin** re-phrases it as “using XML for pattern matching”.
**Sébastien** says it is super rare.
**Iulian** says it is used more than we think in pattern matching and in value definitions he seen in not OS projects; they can be found in old, large code basis; probably decreasing.
He suggests to ask IntelliJ to collect and share the XML usage patterns.  

### [“Proposal to remove the procedure Syntax”](https://contributors.scala-lang.org/t/proposal-to-remove-procedure-syntax/2143)

([YouTube time: 40’13’’ - 52’10](https://youtu.be/gnlL4PlstFY?t=2404 ))

**Josh Suereth** summarised the discussion on Contributors thread:

- Underlines the general concern about the lack of motivation part of the proposal; 
- Notes that in the Contributors discussion, ones that were for the removal would mostly put “+1” while ones against the removal would be more elaborate, that gives a false impression there were more arguments against the removal;
- Structures his presentation around community’s points in a light of better motivation adding his opinion after each 
- Concludes that that going forward procedure syntax should be removed because in the long run it helps new developers learn Scala faster and better (more details below).

Summary + **Josh’s** comments: 

Fixable/Addressable Concerns
- Concerned that rewrite tools (and people) would use def foo() = {} syntax instead of def foo(): Unit = {}

Pros

- Clean up inconsistency in the language
- Dropping return value is dangerous, in general
*Experience teaching Scala gave an insight to how often the return value is dropped which leads to broken code leaving students confused* 

Cons
- More verbose syntax to safely ignore return values
*Semi legitimate concern; developers need to change their habits and annotate return values when it’s important*  
- Lazy people will just write def foo() = {} and get bad behavior.
*The way it is written leads to a confusion and should be removed from the proposal why: https://youtu.be/gnlL4PlstFY?t=2795 *

Not well motivated Pros

- Safer
*We need to detail “why” it is safer*

- Cleaner for refactoring tools to treat methods of this sort.
*Given the way things are structured, this issue comes down to the way the methods are parsed => change the parser betters the refactoring tools. This point needs to be clear in the proposal*

Not well motivated Cons

- People have to change their habits
- Proposal coming from people who don't mutate state
*After analyzing two of his “side-effecty” codebases, looking to find where he uses the most procedure syntaxes, Josh concluded that there are many : Unit*
- Call into question authority/judgement of proposer
*Josh doesn’t find it appropriate and will ignore such comments stating that “...it is not a legitimate way to make a technical argument.” [YouTube time 42’07’’](https://youtu.be/gnlL4PlstFY?t=2522)*

Counter Proposals

- Effect tracking
*A bit of an “overkill”*
- Multiple "def" keywords, one which would mean side-effecting function
:= for side effects 

**Josh** concludes: big point to debate would the language consistency be worth the change to more verbose expresion.   

**Iulian** ([You/tube time: ]( https://youtu.be/gnlL4PlstFY?t=2928)) adds that 1. last 5 years Syntax procedure was anyway deprecated; 2. going forward we should consider Scala 3 in a light of next 15 years, now is the right moment to clean up the language and 3. this is “the easiest refactoring to automate the code base” that could be a “zero cost migration” 


**Josh** points out that current developers would need to change their habits but motivation lies in introducing new developers to Scala and having this consistency to help them stay, given that as it is now it takes longer to learn and making mistakes here is bad.

**Jorge** says IntelliJ already warns developer whenever they use procedure syntax, and suggests them to rewrite it with an automatic rewrite. It’s true that not all Scala developers use IntelliJ, but a big part of do, and thanks to IntelliJ they are strictly discouraged to use procedure syntax.

**Eugene** ([YouTube time: 50’49’’](https://youtu.be/gnlL4PlstFY?t=3049)) asks what is the migration strategy; is it possible to do a batch migration for the big code base or would it be necessary to go through your code in IntelliJ? 

**Seth** reminds the viewers/Committee that it was deprecated only in 2.13 OM4, which is probably why this proposal got so many responses.
 
**Conclusion** Before making a final decision, the proposal needs a better motivation 1. Why it is safer 2. Refactoring tools / parsing 3. IntelliJ tool explained?


### [“Proposal to remove early initializers from the language”](https://contributors.scala-lang.org/t/proposal-to-remove-early-initializers-from-the-language/2144) 
([YouTube time: 54’12’’ - 59’35’](https://youtu.be/gnlL4PlstFY?t=3250))

**Adriaan’s** best summarised in comment: https://contributors.scala-lang.org/t/proposal-to-remove-early-initializers-from-the-language/2144/24?u=adriaanm

### [“DelayedInit or OnCreate, any solution?”](https://contributors.scala-lang.org/t/delayedinit-or-oncreate-any-solution/1748) 
([YouTube time: 59’35’’ - end ’](https://youtu.be/gnlL4PlstFY?t=3575))

**Adriaan’s** best summarised in comment: https://contributors.scala-lang.org/t/delayedinit-or-oncreate-any-solution/1748/36

**Conclusion** 14 days left on the Contributors thread, Committee should revisit this topic later on.
