---
layout: sips
title: SIP Meeting Minutes - March 13-15 2019

partof: minutes
---

# Minutes

The agenda distributed to the attendees is [here](https://contributors.scala-lang.org/t/third-batch-of-scala-3-sips/2862).

13-15 March 2019 the SIP Committee met for the second time in person for a 3-day intense SIP meetings to discuss the upcoming changes proposed by the Dotty team. 

In [2018 November’s meeting](https://docs.scala-lang.org/sips/minutes/2018-11-26-sip-minutes.html) the SIP Committee agreed to treat the Dotty proposals as an exception to the standard process. Change is in that the Committee would focus on Dotty proposals for the next year, analyse the proposed changes one by one, include the community feedback, and publicly discuss the pros and cons of each.

The purpose would be to help the Committee and the community get familiarized with all the changes and features, share their experiences, comments & concerns, and in turn help the Dotty team to integrate the feedback before the Scala 3 release.

To be able to assimilate all proposed changes (~30), the Committee agreed to adapt the process as follows: the Committee would propose the batches (4-6 features) for discussion in the community for a month, in monthly SIP meetings each feature would be discussed by the Committee and a summary of the Community discussion would be included. Voting was preliminary, no final decisions were made during this period.

Committee also agreed to have intensive 3-day meetings once a quarter in order to cover the numerous changes, understanding that one hour meeting a month would not suffice. 

## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Sebastien Doeraene ([@sjrd](https://github.com/sjrd)), Scala Center
* Guillaume Martres ([@smarter](https://github.com/smarter)), EPFL
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Iulian Dragos ([@dragos](https://github.com/dragos)), Triplequote
* Miles Sabin ([@milessabin](https://github.com/milessabin)), Independent
* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Scala Center

## Proceedings

Committee was faced with about 30 features they needed to go over, discuss, and have action points or conclusions come out of it. The following minutes are a summary of what was said during 3-day meetings, they are not exhaustive or to be taken ad-verbatim, they serve as a record and a situation at the current state.

There’s a total of ~30 features to be discussed and decided upon.

We started with a quick run through all the issues and discussed what would take less or more than 30 min. Starting with the "fast" ones. 

### Class Shadowing

Surprisingly many objections on the contributors thread.

**Conclusion:** We go as planned, class shadowing goes away

Deprecation in 2.14 or 2.13? Depends if this affects TASTY, but it can be deprecated later in the 2.13 section.

### Existential types

What do we do about them in TASTY, since they remain in Scala 2, and TASTY needs to be the common format between Scala 2 and 3.

`Map[Class[_], Class[_]]` will be encoded as is.

What about pairs where the existential type should be the same, `(T, T) forSome T`? They can be encoded as a type alias with a refinement. This seems like a common case.

Adriaan mentions wildcard capture as the hardest thing about Java wildcards, and seems harder to understand than existentials. If the removal of existentials leads to wildcard capture, it’s not a clear win.

Martin is not convinced that existentials interaction with the rest of the type-system is sound. Rebinding is the crux of the problem. They are also related to dependent types, and we already have that.

Miles: leave the door open to re-introduce them later in the 3-series.

Adriaan wants to spec wildcard capture as a way forward. It would also make it easier to interop with Java and the Streams collection, where wildcard capture is very common and currently it’s hard to use from Scala 2.

Martin on the flip chart:

~~~
def f[X](x: C[X])

f(C[_])
~~~

Here the compiler needs to add a skolem for `C[X1]` and use it as a type arg for `f`, or else the types don’t match. Later it needs to be removed or else unsoundness ensues. 

**Conclusion**: needs spec for what "capture" does. When do skolems get created, reused or removed.

**Deprecation:** Can we deprecate only the syntax, but leave the inference as-is? Several options:

* Deprecate in 2.14

* Warning only with -Xsource:3

### Weak Conformance

Scala Contributors feedback: only literals should be converted, not "constant types".

An inline val is a ConstantType which carries the exact value (inline val three = 3) is the type Int(3). Discussion revolves around whether List(three, 2.0) should promote three to Double, if three is a constant type. Seb is concerned about this, since three has a type Int, and this will change it to Double.

What about def f = 3, f has a constant type but it may have side-effects. Currently Dotty will still inline and promote it to Double. This should be done only for pure expressions?

Martin feels strongly about keeping `inline` as clean as possible, and less about the actual weak conformance rules.

**The decision is**: inline vals are going to be transparent and weak conformance happens just like if they were literals.

### Auto application

Adriaan: we should allow overriding a Java-defined method without a parameter list. Then auto-application only happens for Java-defined methods.

Martin tried that but lots of stuff broke and decided not to go that way. Even the standard library is inconsistent. For instance, Iterator.next. Seb might want to take a shot at it and see what breaks.

What about the convention that () is used to indicate that the method is impure?

Starting point to experiment in Dotty compiler: Method `isAutoApplied` in Typer.scala

### Delayed Init

We should delay until we know more about meta-programming. We need a credible replacement. 

### Opaque Type Aliases

Adriaan would like them in 2.13, but there is a part that relies on having union types and it didn’t work. But there is a way to implement this in the 2 series.

Guillaume thinks opaque type aliases shouldn’t be there. People want it for performance, but this is for semantics. Compared to value classes, which give you similar benefits, the only difference is performance.

Adriaan believes opaque type aliases are `newtype` and that’s useful on its own.

Seb: opaque type give you better interoperability with the platform (Java, JS, C).

When Java adds value classes Scala will have to have that too, and we’re left with two concepts for the same use-case.

Seth: implicit classes are not widely used in Scala. One use-case is for extension methods, and that has a specific replacement in Scala 3.

Miles: value classes may be avoided because they’re buggy and performance is unpredictable.

**Conclusion:** We should emphasize the interop aspects.

### Eta expansion

All methods are eta-expanded to a function type. Same goes for SAM types, but they need to be annotated with @FunctionalInterface (or gives a warning).

The vote is YES.

Seth makes the larger point: where should documentation go? There’s a gap between the Scala Language Tour and the Scala Spec.

### Union Types

Martin: it still requires some work and experimentation, but the current status is the most restricted version possible, so we can open it up more in subsequent releases.

Seb: union types exist and work well in Scala.js. If it’s too restricted in 3.0 it may break a lot of Scala.js code.

Miles: there is a distinction between how typing works, and how typing inference works, w.r.t to explicit types the user wrote -- widening vs not-widening.

Singleton types have a similar issue w.r.t. to widening, Miles is going to work on a proposal.

### Symbol Literals

They are deprecated in 2.13, they’re going away.

### Type Lambdas

There’s been some waiting on kind-projector by Erik Osheim.

Guillaume: They can be curried. Is that a good idea?

Miles found a use of these in translating a macro from the Monocle library.

**Conclusion**: They are in, but do we want to restrict currying?

#### Syntax of type lambdas and existentials

Discussion on syntax, and whether we should use ? for existential wildcards (conflicts with kind-projector) and __ for type lambdas.** **

Conclusion:

* In the 2 series already, ? can be used interchangeably with _ for existentials

* In the 3 series, __ is used for type lambdas

* Later in the 3 series we move to _ for type lambdas

See also: Dotty issue #5739.

### Dependent function types

Miles discusses some implementation details on how functions are represented in the Dotty compiler.

Guillaume explains that `compose` is a tricky case to encode in the current state with dependent function types.

**Conclusion:** YES

### Name based pattern matching

Miles discusses Boolean-extractors and the fact that the only way to bind on the match is using an @ binder, which seems too verbose. Martin insists that the return type of the unapply should tell you all you need to know about what to bind variables too, and Boolean doesn’t give any of that.

Miles asked about the relation to his issue(/PR?) about boolean extractors, there was one use case

So we intend to accept the proposal as-is, with just an addition that we are explicitly excluding implicits, and leaving that to a possible future separate SIP, but note that to support implicits, we would have to re-architect the compiler, the implementation would be complicated.

Miles expressed some doubt about the proposal, but he's not going to make a stand about it.

Martin: The text at [https://dotty.epfl.ch/docs/reference/changed-features/pattern-matching.html](https://dotty.epfl.ch/docs/reference/changed-features/pattern-matching.html) needs to be updated (in other respects than just the implicits question) before we vote on it. (Maybe there's an inflight PR about it? Not sure.)

### **structural types**

Adriaan: you want to support records, where you can represent a selection of fields, and a smaller selection will be a subtype.

There is existing art in Shapeless, Miles says.

Martin: SAP has settled on structural types for this (HLists? too slow, Martin: maybe we can make it faster? but no). Adriaan: we need to have it say so then, if that's the motivation.

Iulian asked about overlap between selectable and applyDynamic. Martin says he intentionally made them nearly isomorphic, and with similar naming, but says there are separate things.

Seb: scala.Dynamic is an empty trait. Martin: that's because we wanted to allow the methods to come in through implicits.

Martin: we should read the paper by Philipp about the records (Miles & I haven't read it either, maybe none of us have yet?) to understand that use case better. Let's read the paper and then see if we need more use cases, there are people we could talk to who have them.

Adriaan: can we model this with applyDynamic and an appropriate implicit, or does this really need to be separate.

Martin: Chisel is another important use case where they need structural types. If we use applyDynamic we won't get that.

Adriaan and Miles suspect, but are not yet sure, these can still be combined, using structural types, via match types. But there might still need to be a new compiler feature, perhaps via typeclass derivation?

Martin: the members don't exist as members of a class, so it has to take the form of a normal refinement or Chisel won't work.

Adriaan: the core distinction is: dynamic says if there's no member, you get the rewrite. This thing says if there *is* a member, you get the rewrite. Maybe these two opposite sides of the coin could be subsumed in something more general, and maybe that would open up even more interesting uses.

Adriaan: Without having more methods on Dynamic, we just allow the existing methods to take implicits, so they can witness that (e.g.) the right fields are present.

Adriaan: is this a good stepping stone to the eventual generalized form? It seems yes, I think we could generalize it later. Miles: I'd need to read Philipp's paper first to be sure.

Seb: separately, there is one change in the existing proposal we should consider instead of always ascribing simply Selectable, we should allow a more specific subtype of Selectable to arise, by trying to adapt v to Selectable via implicits and if that results in a more specific type, use it.

Adriaan: let's look at the typing rule in the proposal and see if we can refine it further, as Seb suggests. The group collectively revised the rule. Get the resulting rule from Adriaan's own notes?

Seb: with the new rule, Selectable becomes an empty trait.

Then Adriaan also put up the existing rule for Dynamic, to explore the possibility of unifying the two rules.

What about the ClassTags in the new proposal? Do we even need them? The ClassTags could come in instead via the implicit?

Instead of adding a cast that supplies the types of all the arguments. But we don't have vararg type parameters, so we would need to pass an HList type (which Scala 3 stdlib has) to represent the argument types. Different use cases would be free to also require ClassTag or any other such type that would be needed later at runtime; Miles and Seb agree this could be done with match types.

Martin's conclusion: let's try it, I would support it if it works.

Seb: "I can try to put that on my plate."

Here's the notes from Adriaan:

Selectable as marker trait similar to Dynamic

~~~
G |- v.a : U ~> (v': Q).a   Q =:= C { ... a: U ... }  - Member(C, a, _)    G |- v' : Selectable ~> v''
~~~

~~~
G |- v.a : U ~> v''.selectDynamic[U]("a")

G |- v.m(ai...) : U ~> (v': Q).a   Q =:= C { ... m: (ai: Ai)U ... }  - Member(C, m, _)    G |- v' : Selectable ~> v''
~~~

~~~
G |- v.m(ai...) : U ~> v''.applyDynamic[(A1,...An), U]("m")
~~~

Java-reflect based Selectable:

~~~
 def applyDynamic[Ai, U](name: String)(implicit ev: SummonAll[Ai, ClassTag])
~~~

~~~
G |- v ~> v': Q  - Member(Q, a, U)    G |- Q <: Dynamic
~~~

~~~
G |- v.a : U ~> v'.selectDynamic("a")
~~~

Guillaume called our attention to this Chisel example that relies heavily on structural types: [https://contributors.scala-lang.org/t/better-type-inference-for-scala-send-us-your-problematic-cases/2410/88](https://contributors.scala-lang.org/t/better-type-inference-for-scala-send-us-your-problematic-cases/2410/88) , which links to [https://github.com/freechipsproject/chisel-template/blob/release/src/main/scala/gcd/GCD.scala#L13](https://github.com/freechipsproject/chisel-template/blob/release/src/main/scala/gcd/GCD.scala#L13)

Guillaume's response is here [https://contributors.scala-lang.org/t/better-type-inference-for-scala-send-us-your-problematic-cases/2410/90](https://contributors.scala-lang.org/t/better-type-inference-for-scala-send-us-your-problematic-cases/2410/90)

Guillaume a somewhat conservative option to satisfy Chisel would be: provide a trait that Chisel could mix in to Bundle. We already have a class scala.reflect.Selectable, it uses Java reflection to support structural access. And you also get inference of anonymous subclasses that works like Scala 2. reflectiveSelectable

Martin: go back to the Scala 2 behavior where we always keep the members of anonymous subclasses as part of a type refinement.

Scala 2 has reflectiveCalls, Scala 3 has reflectiveSelectable, Scala 3 could make the former an alias to the latter, to support cross-compilation. But then the discussion on this got complicated, Martin suggested to Guillaume that they work it out later.

### **Extension methods**

Martin: the this-based syntax "felt weird". but Adriaan thinks the def (c: Circle) circumference: Double = ...syntax is weird. Martin says he thought so initially but after a few months of experience, came around. "I tried it, I gave talks about it, it just didn't feel right."

Miles: this is fine for single extension methods, but if you want to define a group of related methods, it gets repetitive.

So if you want to avoid the repetitiveness, you can use the existing mechanism (implicit class ... extends AnyVal), do we want to continue to support both?

Martin: the infix syntax works well with right-associative (ends with colon) methods

Martin mentioned that Jon Pretty thought the colon thing ought to be for extension methods *only*

Seb is concerned that if visibility of extension methods is sometimes based on whether the simple name of the method is visible, that accidental shadowing will become more common.

Martin: implicit class will be deprecated.

Miles asks what about:

~~~
extends (x: A) {

  def foo(y: A) = ...

}
~~~

Adriaan dislikes losing the regularity of our syntax for definition, Seth has the same feeling. To argue for it, Martin showed the "semigroups and monoids" example from the document; he thinks it shows that extension methods are core to typeclass support, which helps us think of them as something core enough to the language to make it plausible to have an unusual new syntax for them.

Adriaan: can we summarize as, the syntax does take some getting used to, but it's the outcome of a long design process where the alternatives were all weighed (and even, in the case of this syntax, implemented); as a compromise, we might consider offering something like the extends syntax to avoid having to write the first argument over and over again. (But Seb objects it looks like a block but isn't.)

### **Implicit resolution**

Background in "Changes in Implicit Resolution". We went down the points in this document one by one; Martin offered the motivation for each point. Seth suggests that the motivations be added to the document, to help the community understand the changes. (I didn't have time to summarize all the motivations for these notes.)

Martin: implicits were designed to have as short as spec as possible, by saying either the name is visible or it isn't. But it's "pretty unusable".

The "A takes more inferable parameters than B" clause of point 7 is under discussion; Martin currently intends to drop that rule (inverting it was also considered).

### **Implicits redesign**

Note that for compatibility, 3.0 will still have to allow implicit def for conversions, for cross-building. See "relationship with Scala 2 implicits" section on the Dotty site, under "Contextual" (add link).

Guillaume is uncomfortable with implied mapping to different underlying semantics (points 1, 2, 3 at [https://dotty.epfl.ch/docs/reference/contextual/relationship-implicits.html](https://dotty.epfl.ch/docs/reference/contextual/relationship-implicits.html)). Will users think of these things in terms of the desugaring into Scala 2 implicits (as Guillaume is doing), or will they understand them directly (as Martin hopes)?

Miles shares Guillaume's worry about implied mapping down to different underlying constructs/semantics.

Adriaan this is a core principle we have to agree on before we can agree on the syntax changes. This is a change of philosophy for Scala, we are trying to make Scala more approachable. If we are successful, then users shouldn't *need* to understand these things by mentally mapping onto Scala 2 implicits. Martin: don't read this "comparison with Scala 2 page" with the idea that this is what users will read in order to understand the new system.

Adriaan is worried about the TASTy-compat implications of the naming rule for the anonymous implied instances, could we support this directly in TASTy so that the names don't get baked in to the TASTy files?

Perhaps we don't need both the and implicitly, we could deprecate and get rid of one of them.

Martin: motivation. I invented implicits, why turn away? There have been negative reactions, specific uses of implicits have a good reputation. For example, Kotlin copies everything about Scala except implicits. Implicits as a general mechanism have a poor reputation are not obviously a coherent single concept.

Martin is quite passionate about not understanding the new constructs primarily by mentally mapping them onto Scala 2.

Miles sees a different criticism coming from the Haskell direction, which he doesn't agree with but considers better motivated than the Kotlin direction one. "The really nice thing Scala has done is to treat typeclasses as types and instances as values."

So Miles likes the use sites, but he's not happy with the definition sites, "it's obscuring what the definitions actually are" (agreeing with Guillaume). "You're adding magic to appease the Haskellers" when what we had was already coherent.

Martin is "100% convinced this *is* the syntax". "It's an eye-opener, these things are so clear now!" <-- example feedback

"The whole point of implicits is synthesizing terms from types. You, compiler, you do that, you synthesize the terms for me, it's tedious." Martin: The new syntax allows the definition site to "go straight to the point" and "specify the minimum needed" to do the synthesis.

(At some point there was a discussion involving Miles where it was suggested that Cats needs to be ported to this new stuff, not all of Cats immediately but the kernel, to see how it looks and make sure it works.)

Seb: there are two widely different things in this proposal that are mixed together, we don't know how to talk about them separately. One is, what is the real new expressive power, what can I write, how do I write it. Two, there is the names of things, implied and given, not so much as syntax, but as the names of the concepts.

Martin: avoiding the word implicit was something of an exercise, to avoid confusing the old system and new system in the minds of people who know the old system. In the long run, it might be better to just go ahead and talk about "implicits".

Seth: how will we teach this from scratch? Martin: pages like [https://dotty.epfl.ch/docs/reference/contextual/givens.html](https://dotty.epfl.ch/docs/reference/contextual/givens.html) actually are an attempt at this.

Miles: in the `ListOrd[T]` example, it's essentially a function definition, a function from `Ord[T]` to `Ord[List[T]]`, why doesn't it look like I'm writing a function?

Seb: could we do implied def..? (But we're introducing a new type (ListOrd), where does that go?)

Martin: because "it doesn't work for anonymous and most people will want to write it anonymous. this is the one syntax that works for both named and anonymous."

Guillaume: do we need anonymous? "I'm not a fan" of anonymous things. In UX, there's the concept of affordance, how do you interact with a thing, like a door with a handle? If I write an implied thing, it has an effect on other parts of my program. How do I "find all references"? In my IDE, if I ask to see what the use site expands to, what does it show me? What does an error message say when it needs to refer to this thing?

Martin: the way we produce anonymous named instances is spec'ed and is intended to produce halfway usable names, in the cases where they're needed. Martin feels very strongly it's "so much more beautiful" if you allow anonymous (and he mentioned similar feedback from one of Kotlin's designers).

Guillaume: it's spooky action at a distance. (But I [Seth] don't understand why the presence or absence of a name is what makes it spooky or not.)

Seth: there are names, they're just automatically generated. Guillaume: but there's no name in my source code I can ask for "Find All References" on.

Miles: "all of my concerns are at the definition site"

### **Querying implied instances**

discussion between Adriaan, Martin, and Miles about the `implied [T] given (x: X) for T = e` syntax, Miles wishes it were more like function definition syntax, as mentioned above.

what about context bounds? that's covered in the comparison-with-Scala-2 document, Miles and I asked Martin about it, he said maybe we could later decide it's unnecessary sugar, no rush

### **Implicit conversions**

Everyone in the room agrees that it's good to make implicit conversions a separate concept and not allow them to just be function values in implicit scope. Instead they're now scala.Conversions in implicit scope.

Discussion about whether the additional performance cost of requiring scala.Conversion objects is worth it, and/or can it be mitigated?

Miles finds the syntax clunky. Do we care, if this is a feature we don't expect or want to be used much?

Adriaan suggests using SAM syntax, the example on the Implicit Conversions page would be shorter that way. But Seb points out it will increase the runtime cost... unless we can optimize it away? Unclear. (Miles wondered if there might be primitive-boxing overhead, but Seb thought not, but there is definitely allocation unless we optimize it away.)

Guillaume: it's hard to talk about this separately from the rest of the implied/given stuff.

Are we fine with requiring Conversion? Yes, we are. implicit def for conversions will be deprecated and go away at some point (post-3.0, iiuc).

### **Inferrable parameters**

We all like the concept. (The syntax questions are mixed up with the other implicits changes.)

### **Implied instances**

Adriaan: people are currently writing implicit val which doesn't allocate every time, but the new syntax desugars to implicit def which will allocate unless you make a separate val.

Martin: could we say if it's a val if it doesn't take parameters...? I had decided earlier that it was better to always desugar to def and say if you want a val, make one and have the def forward to it.

Miles really wants to see how this would play out in a real codebase before voting. Currently he could "at best abstain". Guillaume feels the same way.

### **Implied imports**

~~~
import implied
~~~

Martin: there's a PR, not yet merged, that refines this rule considerably compared to what's on the Dotty feature page?

It's [https://github.com/lampepfl/dotty/pull/6041](https://github.com/lampepfl/dotty/pull/6041) -- it has the new impl as well as the changes to the web page.

Martin: we now have a custom error message so if something fails but changing import to import implied would fix it, the compiler will tell you.

Miles: in e.g. a Show typeclass you might have a fallback instance (e.g. one that calls `toString). The typeclass is provided by one person, the data class is provided by another, a third person is writing the instance. This change, combined with changes to implicit priorities, makes Miles worried this pattern won't work.

Miles: do we still need this in *addition* to the scoping rules? Martin: it wasn't motivated by that, the motivation here is different, it's as listed on the web page.

Martin: People have big lists of imports`, it's important to call out the ones that bring in implicits, those are the ones you really need to know about when you're reading code.

Seb is really against this, he thinks it's wishful thinking that it solves anything that isn't already solved by IDEs.

Anyone else against? Iulian is a little iffy.

Miles: "Bringing implicits into scope should be done *explicitly*."

Martin: there is a new idea, neither spec'ed nor implemented yet, to simplify lookup? (I didn't catch what the idea was.)

Martin: there's only one namespace, but names have a flag of whether they're implicit or not, determining which form of import will import them.

Seb: we already have a way to do this in user space, which is to put implicits in an object, e.g. Implicits, but people don't do it, our recommendation hasn't been followed. You can't tell people what to do... but this proposal will successfully do that, won't it? Martin thinks it does. Seb asks, do we know whether the *users* of the libraries who *have* followed the recommendation are happier?

Miles points out the grossness that even import cats.Implicits._ imports a bunch of irrelevant identifiers like toString and hashCode.

Martin: "Implicits are much more dangerous than normal names."

Seb: This solves nothing, you will *still* need to use your IDE to find out where something comes from, *always*.

Guillaume: people just add imports until their code compiles, and then a bunch of extra implicits can easily come along for the ride, this will really cut back on that.

Martin: part of the reason the implicits changes are more than just marketing is that we're trying to take away sharp edges, this and conversions are the two biggest sharp edges.

Seth to Seb: it doesn't help, does it hurt? Seb: well basically migration pain. Iulian: well, and there's a thing where before you could get by with one import and now you'll often need two?

Seb: usually implicits come in via other avenues anyway, so even if this helps, it helps in the relatively unusual cases where you're getting implicits via an explicit import.

Guillaume: what about import all which does both? Martin: let's do the restrictive version first and then see if it turns out that import all is really common and we ought to support it after all.

### **Toplevel definitions**

Miles: when is a val evaluated? Martin: implementation is that it's wrapped in an enclosing object, so it's whenever anything in that object is accessed. Seb: this rule is consistent with the rest of the language.

Iulian: separate compilation will be trickier, because you have to look at all the source files? Martin: but an outliner would tell you. Somebody: and anyway in general we can't count on people following the conventions that tell an IDE where to look. Guillaume: maybe we should come back to it.

Guillaume: everybody keeps asking, what about main? Can I put def main somewhere that doesn't make it hard to call from java? Guillaume: well if you use scala (/dotr) to run it and not java, it could find it.

Martin: we'll also need to consider main as part of DelayedInit, so maybe let's talk about it then.

Guillaume: can we unify several concepts: the REPL wraps things in object, in worksheet mode also, now we're doing that in toplevel definitions too? Can we have toplevel definitions also be how the REPL and worksheets are implemented?

Guillaume: .sc, even before Ammonite the ScalaIDE worksheet used .sc files, so the convention is at least somewhat established. So only .sc files would allow statements at the top level, and the script runnner would know about them.

Should statements be allowed in top level files? Seth: yeah, why not, seems natural? Seb: but they'll only run if you reference something that's *next* to them, and there's no way to explicitly run them. Miles: isn't object already weird in exactly the same way?

If I have

~~~
package p

val a = (1, 2)

def b = a._2
~~~

in a._2, is it this.a._2, and then this is a value?

Iulian: so if I have top-level object, is it a nested object? But then if you remove all the top-level definitions, it's not a nested object anymore? It might especially matter if you have an implicit object, Martin: except implicit objectcan't stand on its own, because for package objects, the compiler can look for all the $package files only.

What if I have a type Foo and an object Foo, the former will be lifted into a wrapper object and the latter won't...?

Seth: is this merely implemented as involving a wrapper object, or is that actually the spec? Martin: it's the spec.

Seb: the web page says "the wrapping is transparent", but Seb thinks we should add "except for binary compatibility", because of e.g. the object vs implicit object example.

Miles: opaque type can have a companion, why doesn't or shouldn't ordinary type have a companion? Martin, Guillaume: we haven't tried that, maybe we should? (This sparked some technical discussion about dealiasing in typer.)

Miles: what if I want to have two source files that add top level definitions to the same package, e.g. one of the source files is Scala version independent and one is independent, but they both want to add top level things. Guillaume: "Don't do that. You'll get a redefinition error." Seth: it'll be enough to just rename one of the source files? Guillaume: yes, and the compiler will tell you that.

Nobody's against this *in some form*, details.

### **Runtime reflection**

Guillaume is supporting some form of runtime reflection (other than Java runtime reflection; analogous to scala.reflect) explicitly a non-goal of Scala 3? For 3.0, or for all 3.x versions?

Can we finally deprecate Manifest in 2.14? Because it's going to go away in 3. It's been marked as TODO to deprecate since 2.10, Guillaume observes.

So Dotty does have something like TypeTag internally (core.Type), but we do restrict it to be compile-time-only?

"Runtime reflection" should be on the list of dropped features (is it already?).

Miles: let's offer deriving Typeable instead (like Shapeless's Typeable).

Adriaan: no we have to offer something like TypeTag? But what? And on what calendar? Unclear answer. Oh, never mind, he ended with "well, okay" (maybe he thought ClassTag was going away).

To be clear, ClassTag isn't going anywhere.

Martin: let's wait to SIP the removal of runtime reflection until the metaprogramming story is clear. (Perhaps it will end up offering something in this area.)

### **Metaprograming**

What's the metaprogramming status?

Martin: quote and splice are stable, but don't support pattern matching yet. TASTY reflection is not complete yet and is still undergoing revisions based on use cases that are being tried.

No one has done any meaningful whitebox macros yet in the new system, but the door is now open. (<-- not sure if I should include this in the notes without understanding in what context we want to allow whitebox macros?) This only got merged "last week". The relevant PR is [https://github.com/lampepfl/dotty/pull/5846](https://github.com/lampepfl/dotty/pull/5846) "The main motivation for moving staging to typer is to support whitebox macros" but it's still very early days, no one has tried to actually use this.

# **Kind polymorphism**

Martin: the page doesn't have motivation. But we do have a strong motivation now, which is staging:

~~~
type T

'T
~~~

What happens at runtime? It becomes `'the[quoted.Type[T]]`, that's how lifting types into quoted contexts work.

But what if you have `F[_]` instead? It didn't work before, but with kind polymorphism it does.

Miles: I tried for a long time to encode kind polymorphism in a way that would help typeclass derivation. The truth was, I thought AnyKind would give us all sorts of capabilities, but it turned out not. It turns out you need much more, you need the ability to abstract over method signatures.

But "where it's useful it's really useful". Seth: is it okay to add the limited version in the meantime? Miles: sure.

Seth: will it still be experimental in 3.0? Martin: if it's a part of metaprogramming, it can't be experimental. (So the web page should be updated at some point.)

Guillaume: it really needs examples. (Miles: Typelevel can help with that.)

### **Enums**

We discussed this last time (in November). The main area of change we decided on then is to support Java style enums with extends java.lang.Enum or whatever it is. The work on this hasn't been done yet.

Martin: we need to represent this in a way that doesn't pull in the collections API, we'll need a lightweight interface, probably using an immutable array which erases to Array.

Guillaume: the dividing line of what can or can't be a Java enum is fuzzy, and perhaps changing...? We may have to do some experimentation with what javac recogniaes, what IntelliJ and Eclipse recognize, and so forth.

The "perhaps changing" part is JEP 301 which hasn't been updated recently, is it still active? Seb: it's fine if we need to change further later if those changes happen.

### **ADTs**

[https://dotty.epfl.ch/docs/reference/enums/adts.html](https://dotty.epfl.ch/docs/reference/enums/adts.html)

Guillaume & Martin: this went through many iterations, there were hundreds of comments, we're pretty sure this is the design.

Adriaan is skeptical this matters so much, it doesn't let you do anything new you couldn't do before. Several other committee members think it's important, both because Java interop on the enum side, *and* to make plain ADTs more convenient.

Questions about the magic automatic extends clauses, how does the compiler know, in the Option example, that Someis [T] and None is [Nothing]? Adriaan: okay, as long as the rules are clear...?

"Generally, all covariant type parameters of the enum class are minimized in a compiler-generated extends clause whereas all contravariant type parameters are maximized", says the doc

There was some discussion of the details of the rules for type parameters -- this then erupted into a full-on debate. e.g. isn't it weird that if you add an extends clause, suddenly T isn't in scope any more? see [https://github.com/lampepfl/dotty/pull/6095](https://github.com/lampepfl/dotty/pull/6095)

conclusion: Martin: I'll try to update the rules to reflect the behavior of the compiler.

### **Volatile lazy vals**

In current implementation, lazy vals only have synchronization if you explicitly declare it as volatile.

But this is a breaking change.

Seth: can we get there gradually, by migration stages?

Guillaume: I don't know if it's worth it.

The concern isn't only accidental deadlocks, it's also performance, you don't want to pay for locking if you don't need it.

Seth: isn't it just strange that a core language construct includes this locking, thread-safety baggage by default?

Martin: like var, it's unsafe unless you declare it volatile.

Iulian argues that it makes sense because it's a val.

Guillaume had an example of when this bit them in practice when copying code from scalac.

Seth: can we agree this shouldn't happen unless it's done in migration stages? And that it isn't required for 3.0, it's not tied to anything else?

Guillaume: even supposing we change the default, do we still want to offer the non-volatile version?

Seth: I find that quite appealing, yes. I always see people advising beginners about lazy vals, look out for locking, look out for performance, maybe don't use it.

Iulian: no, let's not have this knob, let's do one thing and do it right. "The unsafe version is super easy to code yourself if you need it."

Martin: but it matters because lazy val is stable, if you code it yourself it'll be a def and then it's not stable. (But, not clear how big a deal that is.)

If changing anything in this area, check on the status of local lazy vals, there is a separate implementation.

### Typeclass Derivation

Can we move shapeless into the stdlib given enough compiler support?

Fix following restrictions in shapeless:

* Implicits to encode type-level folds
* Lots of boilerplate for users (e.g. in writing these folds)
* Ad-hoc handling of type constructors of various shapes
* Distinction between Generic and LabelGeneric (can be unified thanks to match types)

Needs polymorphic functions

What does the compiler need to generate in the companion object?

* Which companion object? Just the top type or each subclass (too much codegen?)
* Type members for T, Repr, Name, Labels
    * They could also be baked in: `type ReprOf[T]` = <magic>
    * Don’t use `Either` for Repr (would pull in stdlib)
* def select for coproduct that maps each subclass to an index into "instances"

Differences with Martin’s proposal

* Names are different, but they work the same way: 
    * case = product (types for nested entities)
    * Cases = coproduct

Criteria

* Generate least amount of code
* Can erasedApply be unified with companion-object’s implementation of FunctionN’s apply (maybe not, since users can implement it themselves). Do we even need it? (just saves one eta-expansion)

Product element names duplicates? Mostly run-time facility.

Can we derive the case class methods? 

### Specialization

Need something to deal with boxing. What’s the subset that 3.0 should support for biggest bang for buck? FunctionN / TupleN / all final classes?

An inline method can override a concrete method. Would require changes to design of the collections.

Hard parts of specialization:

* fields of non-final classes
* Traits (e.g. superaccessors)
* Overriding specialized methods

If you can limit it to final classes. 

### Multi-versal equality

Needs more thinking & community feedback. Can we come up with rules for a single-param variant?
