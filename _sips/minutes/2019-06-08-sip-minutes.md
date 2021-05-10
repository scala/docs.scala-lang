---
layout: sips
title: SIP Meeting Minutes - June 08 2019

partof: minutes
---

# Minutes

The agenda distributed to the attendees is [here](https://docs.google.com/document/d/14Cby0d5t2CFnM76sEs9B6cI8rYxe218cyNjOPZ3kD1E/edit).

## Proceedings

### Implicit conversions

[https://dotty.epfl.ch/docs/reference/contextual/conversions.html](https://dotty.epfl.ch/docs/reference/contextual/conversions.html)

Mostly an uncontroversial change.

Someone: Do we want it as an abstract class, not a trait?
Someone: Yes, because we actively want to discourage it being used as a mixin.

Miles: There are lots of function types, could it be a refinement of Function1?
Someone: No, because it's not structural.

Seth: But it still needs a contributors.scala-lang.org thread for discussion outside by itself,
apart from the other implicits changes

### Auto-tupling

Implemented but not merged: [https://github.com/lampepfl/dotty/pull/4311](https://github.com/lampepfl/dotty/pull/4311)

The problem is when using infix (e.g. an operator method) there's confusion between a 1-argument tuple2 method
and a 2-argument method, of which there are a few in the standard library.

Someone asks: should we drop auto-tuple completely?  (unanswered, I believe)

One example is += on Map, which was deprecated in 2.13.

We could deprecate the definition of such methods in 2.14.

Adriaan: why, outside of overloads, can't auto-tupling kick in for 1-argument tuple2 methods?
Decision: let's try that

### Exports

[https://dotty.epfl.ch/docs/reference/other-new-features/export.html](https://dotty.epfl.ch/docs/reference/other-new-features/export.html)

The motivation is the same as package objects, and is by-and-large replaced by top-level definitions.

What's left over is: how do we compose namespaces?  Export is the answer there.

(It's also one of the longest standing feature requests of Scala.)

Seb: is wildcard exporting a good idea?  Maybe just name them (without full definitions).

Iulian: Does export fix the package object inheritance problem?  Yes, because export can be top-level.

Seth: What's the impact on Scaladoc?  Shared concerns with what the UX should be, maybe just forward references
instead of copying the Scaladoc.

Miles: Does this fix Daniel Spiewak's Monad/Traverse issue?
The issue is you want to implement the intersection by exporting monad instance methods and traverse instance methods
but sometimes you want to be selective on exporting ("every method that isn't (something something)")
for now you just name them

Martin(?): Export is entirely implemented in namer, it's a simple implementation, no types.

Josh: What about incremental compilation impact?
Answer: We'll treat it like a variant of inheritance.

Seth: Can this wait for 3.1 or later?
  * Martin argument 1: deprecate package object replacement
  * Martin argument 2: simpler structure, Scala 3 books should promote this instead of package objects

Seb: back to no-wildcard / named exports only: we can loosen it later to allow for wildcards

Miles/Seth: can we make the export relative to the type?  "Export everything in monadInstance from Traverse"?
  * Martin: it's meant to mirror import
  * Seb: but we have import implied for types in the talks...
  * Martin: it's not the same thing
  * Seb: but it is, kind of...
  * (someone): just ascribe the type "val monadInstance: Functor" and export from that

Adriaan: (using the Printer/Scanner example) method in scanner won't call method in printer
  * Martin: yeah it's not inheritance
  * Adriaan: right, we should make that clear

Seb: Javascript supports wildcard exports

Adriaan: we need to give good error messages in export conflicts

Adriaan: Also let's not forget the big Scaladoc impact, can't copy because of the type parameter and other different names
  * Martin: we should be able to use Scaladoc's variable redefining system
  * Adriaan: Scaladoc is very important to users, so let's not forget this issue

### Polymorphic function types

Merged but not documented: [https://github.com/lampepfl/dotty/pull/4672](https://github.com/lampepfl/dotty/pull/4672)

Presented by Guillaume.

First type lambda syntax was `type A = [T] => List[T]`
But we need term-level syntax and `=>` is taken by Function1
So switched type lambda to `type A = [T] =>> List[T]`
So the identity function can be `def id: [T] => T => T`

Miles(?): and now we have lots of function type (dependent functions, implicit functions, ...)
Miles: we should definitely lose the FunctionN types, if possible
Guillaume: should we eta-expand to polymorphic code? does it break existing code?
  * Martin: yeah it does
Miles: (summarising) it's lovely, we should have it (it's currently entirely experimental)
Martin: let's discuss if can we do it later
  * Miles: I need it for typeclass derivation, so no
  * Martin: ... Right, that clears that up

Seb: there's confusion in arrows between type parameters and term parameters
  * (lots of chat)
  * Adriaan: we'll need to decide the syntax later
  * Adriaan: maybe instead of `[T] =>> List[T]` use `List[__]`

No-one is expressly against including it, but details will need to be finalised later.

### @infix and @alpha

Presented by Sébastien.

The goal is to ensure all operators always have a name, for documentation purposes, IDE hover display,
googleable.

Also @alpha defines the JVM name of the method.
But it's a design decision to only have 1 way to call the method.

Nicolas: why not the other way round, have an `@op` annotation with the infix operator name?
  Seb(?): Because you can't call the alpha numeric name (e.g. `.append`)

Seth: Also having two methods (`+=` and `append`) interferes with overriding: you want one to alias the other,
but you want to be able to override to refine the result type of both methods.

Seb: And then there's @infix, to be prescriptive about methods that should only be used infix
Seb: it's a controversial issue
Seb: the plan is for now you can choose, then you'll get a warning, then it will error (forcing you to infix)

Seth: the hardcore infix fans is small

Iulian: I don't like the forcing from @infix either

Martin: There are too many choices with infix and non-infix usage

Adriaan: should this be in 2.14?
  * No definitive answer, there's no reason not to, outside of the already full roadmap plans

Also mentioned are the non-operator methods that are really designed for infix usage: `eq`, `is`(?),
Range's `to` and `be`.

Martin: this is already implemented, and forced with `-strict`

### Creator Applications

Presented by Martin.

Iulian: can you do both? `new Foo(x, y)` and `Foo(x, y)`
  * Martin: yes
  * Iulian: but that's inconsistent with the previous discussion about infix/non-infix
  * Martin: people will converge to not writing "new" (because it's shorter)
  * Iulian: so kill new
  * Martin: you need new for edge-cases
  * Seth: .new instead of prefix new?
  * Martin: also you need new for anonymous classes
  * Martin: it's important in chisel (spelling? It's some framework)

Martin: people define classes as case classes for it, so let's give it to classes

Josh: dart has this with builders and constructors, and it works out nicely
Josh: but dart has it so builders can't call builders and it's confusing so let's keep new

Adriaan: we should limit use of "new", lint thing or other compiler help
Seth: e.g. under -strict it warns if using unnecessary new (for some definition unnecessary)
Adriaan: figure out where new is absolutely needed and restrict to that
Adriaan: continue Scala 3's mantra of being more opinionated

### Nullability

If we get nullability over the summer, then we'll try to land it in Scala 3

### Inline

[https://dotty.epfl.ch/docs/reference/metaprogramming/inline.html](https://dotty.epfl.ch/docs/reference/metaprogramming/inline.html)

Presented by Nicolas

`inline` is guaranteed inline (unlike `final`)

Miles shared (unclear) concerns about limitations with literal types (42.type)

Miles: could we have a "fuel" (sp?) integer?  That is, an integer that goes down to 0.
  * (many): no, it's hard to prove these things in the compiler (and other implementation details)

Martin: Or could we just disallow recursion?
  * Nicolas: yeah, we could, and tell users to use staging for that (Olivier approves :D)

Martin: Hmm, we might not need inline on parameters
  * Nicolas: I agree, just can just use staging instead

### Staging

[https://dotty.epfl.ch/docs/reference/metaprogramming/macros.html](https://dotty.epfl.ch/docs/reference/metaprogramming/macros.html)

Presented by Olivier

Miles: the example is too basic, no recursion: can we do typeclass derivation with this? (need recursion)

Adriaan: how staging works must be clear to the SIP committee and to users, even if it targets advanced users
Adriaan has concerns about sneaking whitebox macro style problems back into the compiler
Adriaan/Seb: inline is simpler
  * Olivier: I disagree, you can't understand a large inline method, because it's entangled with the optimizer
  * Martin: with staging you can println half-way into staging
  * Martin: the ideal is that inline desugars to staging
  * Nicolas: except staging requires separate compilation (because we have no interpreter), inline doesn't
  * (Miles: or we can make an interpreter for a subset of the language)
  * Nicolas also has some ingenious half-way between inline and staging, that he mentioned (too) quickly

### More general meta-programming talks

Nicolas/Olivier present 3 "tiers" of meta-programming: inline, staging, dotty reflect

At the end it becomes clear that these aren't desugarings from one to another (e.g. staging doesn't desugar
to dotty reflect, it's its own thing, idem for inline to staging).

But even at the most powerful, dotty reflect, you cannot typecheck (or untypecheck), you only have typed trees.

No precise hanging questions, follow-up work or decisions, except:

Miles: how long to finish everything?
  Nicholas: hopefully by the end of the summer

### Typeclass Derivation

[https://dotty.epfl.ch/docs/reference/contextual/derivation.html](https://dotty.epfl.ch/docs/reference/contextual/derivation.html)

Presented by Miles.

For typeclasses that are monoidal (e.g. Monoid, Eq/Eqv, Show) just pass the summoned TC instances to the erased
infrastructure.

There is a "derived" magic method name on TC companions that matches the "derives" keyword that you can put at
the end of your case class.

Seth: no handling of higher-kinded types?
  * Miles: no need at the compiler/scala.deriving level, just a small kernel, and a veneer in Shapeless 3
  * Miles: AnyKind is not enough to do the necessary kind-polymorphism

Martin: But we said we weren't adding anything to the standard library in 3.0
  * (Someone): We can still add it to the 2.14 and 3.0 standard library

### Erased Terms

[https://dotty.epfl.ch/docs/reference/experimental/erased-defs.html](https://dotty.epfl.ch/docs/reference/experimental/erased-defs.html)

Olivier: Are they necessary?
  * Yes's and No's
  * Seb: in Scala.js I could use them
  * Seth: should we ask the community?
  * Miles: no, because you'll always find someone that says yes

Decision: Find use cases and test performance

Seth: Defer to 3.1+?

(Someone): Yes, it doesn't need to be in 3.0

(Someone): Maybe it's superseded by @compileTimeOnly, that's already in 2.13?

(A few): Should we delete the code or put it under a flag?

Guillaume: If we don't delete it it'll be in TASTY forever

Decision: delete the code, strive to make @compileTimeOnly its replacement

### Runtime reflection

Drop it, and push the problem to the community to experiment solutions.

### Enum

Update: if an enum extends java.lang.Enum, it's a Java enum!
Without extending it has a subset of java.lang.Enum's API.

### -strict vs -relaxed vs -Xsource

You use `-Xsource V` and `-migration` to help get to version V
Martin: I'd like a way to do it file-by-file
  * (Many): having different files use different versions of Scala sounds very confusing
