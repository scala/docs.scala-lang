---
layout: sips
title: SIP Meeting Minutes - March 13 2020

partof: minutes
---

# Minutes

The meeting took place with the following agenda:

1. Review `@main` functions and numeric literals
2. Review indentation syntax changes
3. Review implicit resolution changes
4. Review autotupling, multiversal equality, name based pattern matching and finally structural types

## Date and Location

The meeting took place on the 13th March 2020 throughout the day on Zoom.

The meeting wasn't broadcast.

Minutes were taken by Jamie Thompson.

## Committee Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Guillaume Martres ([@smarter](https://github.com/smarter)), EPFL
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), Scala Center

## Sitting in

* Lukas Rytz ([@lrytz](https://twitter.com/lrytz)), Lightbend
* Jamie Thompson ([@bishabosha](https://github.com/bishabosha)), Scala Center
* Nicolas Stucki ([@nicolasstucki](https://github.com/nicolasstucki)), EPFL
* Olivier Blanvillain ([@OlivierBlanvillain](https://github.com/OlivierBlanvillain))
* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Process Lead

### Revisiting Whitebox Inline Definitions

Martin had an idea for a potential cleanup of syntax for whitebox inline definitions:

Currently in Dotty:
```scala
inline def f() <: T = …
inline given C as _ <: T = …
```
Downsides to this approach:
- Differences between `def` and `given`
- Obscure syntax is bad for teaching.
- Hard to Google.

He suggested to use a modifier instead:
```scala
inline flextype def f(): T = …
inline flextype given C as T = …
```
Benefits:

- `flextype` is more searchable.

Adrian likes the idea from `inline given` to represent the return type as a bounded existential.

#### Other considerations:

Nicolas:

- 1: `whitebox[T]`, where Martins' response was: specialised syntax is harder to swallow, when its specific only to the whitebox and doesn't extend to other types.
- 2: Maybe a new modifier to represent both inline and whitebox?

### @main functions

Martin presented `@main` functions:

- Motivation is replacement for behaviour of DelayedInit:
  - Initialisation code in object can cause problems for thread safety.
- Because we have top level definitions, it makes perfect sense to allow program entrypoint to be method at the top level.
- What should the program be called? We use the `@main` annotation to capture the method name and create a wrapper class of the same name in the package containing the method.
- Also provide minimal commandline argument processing to map directly to method parameters, using the `FromString` type class.

#### Concerns with Commandline Argument Processing

Jamie: Should it allow named arguments?

Sébastien:

- How far should the language go to support command line parsing?
  - Should the language go all the way to a bespoke solution, because the potential use cases are unknown.
  - Or just stick to basic primitives with no pluggability.
- Problematic to avoid optional flags

Guillaume: All large programs need a `-help` flag

Addressing the above, Martin suggests that the intended use case for argument mapping is as follows:

- Ideal for test programs, simple scripts
  - e.g. data science
- Any program needing more sophisticated processing should probably use `String*`
  - avoids mutable array
  - processing can then be delegated to a library like Scopt

#### Concern with FromString Type Class

Sébastien:
- FromString is very general, but the usecase presented is just for CLI, falls apart too quickly due to custom formatting and expressing multi-argument structures such as ranges etc.
- He would stop at `@main` methods with `String*`

Adriaan:

- Is `FromString` too general to use for CLI processing, it could make evolution harder if people use it for other cases.
- Lots of options for the problem of structuring unstructured data, such as `:` separated lists for class paths. A general type class is too basic for this situation.
- However, it is easier to make a local specific `FromString` just for CLI than in haskell where you must consider global importance.
- Agrees that whatever argument processing should be able to map directly to method arguments, but something more specialised than `FromString` should be used.
- Alternatively the current proposal could go ahead, but removing hooks for extension in the StdLib.

Martin, addressing these concerns:

- Haskell uses `Read` everywhere, if we have `toString`, we should have a general `fromString` method.
- Maybe `@main` methods should have a single argument with type class to parse all command line arguments into it, which is one step removal from single argument of `String*`.
- We must have support for the simple case, `@main` is about boilerplate free work, if you have a need for complex args, the complexity of the program has grown too much for this concern.

Adriaan suggests that maybe someone can try a new proposal for argument parsing.

#### Concern for Use Case

Sébastien: How many programs are so trivial that they dont need argument processing?

Martin:

- 99% in his estimate.
- For most people, e.g. simple scripting, these just need either none or few primitive args.

Guillaume: What's the story for refactoring from the simple case to the more complex cases?

Martin:

- We should look into this
- But transitioning to full cli parser is huge step, it will be complex to join the dots.

#### Existing Solutions Suggested in the meeting

[1. Swift Argument Parser](https://swift.org/blog/argument-parser/)

Guillaume: Simple, but it allows validation

[2. Ammonite Scripts](http://ammonite.io/#ScriptArguments):

Guillaume: `@main` from ammonite is more complicated (than the SIP proposal) but scales.

Sébastien: Overloaded mains look more complicated

Guillaume:

- It generates help text if args are not correct
- We should be able to document args to main, and support should be in StdLib

#### Summary

The main concerns with the proposal are the interactions between the intended use case and the pressure it imposes on the Standard Library. If it is only intended for very simple ordered arguments then perhaps a pluggable `FromString` type class is too simple to include in the standard library. If the language should support more complicated processing, then `FromString` is too basic to be pluggable.

In a straw poll the present members of the committee were in favour of having the `@main` annotation for program entry points, but perhaps someone could come up with a proposal for a more sophisticated processing solution.

### Numeric Literals

Sébastien presented the proposal:

- Uses a type class which is very similar to `FromString`, with several sub-types for different kinds of literals.
- takes string representation of literal, and converts to an expected type.
- the expected type also specialises which type class instance to search for.

#### Concerns with Requiring an Expected Type

Jamie:

- Only works well for named constants, or passing to unambiguous method arguments.

Sébastien:

- In Scala we often lack a concrete expected type, e.g. the left hand side of an operation.
- How well does this scale
- Concerns for loss of precision, e.g. different behaviour of adding different numeric types etc.

Lukas in chat, to demonstrate lack of inference on LHS of an expression:

```scala
scala> val x: Long = 10_000_000_000
val x: Long = 10000000000
scala> val x: Long = 10_000_000_000 + 1
1 |val x: Long = 10_000_000_000 + 1
  |              ^^^^^^^^^^^^^^
  |              number too large
```

Martin in response to concerns:
- By default, each sub expression of an expression of an expected type will have the same behaviour as without generic literals,
- More specific behaviour is only activated with an expected type, making this feature perfect for named constants, (which should have an expected type if public).

#### Concerns for Aesthetics

Martin:
- Using a string literal constant as a number would look embarassing to introduce to a Python programmer.
- Especially the `BigInt` constructor, its really ugly.

Guillaume: In Python there is no syntactic overhead for BigInt, Scala would add noise with the expected type.

Sébastien:
- Its already embarassing enough to explain the different numeric types.
- The situation of overflow in smaller types will not be solved by generic literals, therefore you must explain the existance of `BigInt`, so may as well explain its `String` argument constructor.

#### Concerns for Use Case

Adriaan: Will this work well in specific use cases, such as
  - Data Science
  - REPL

#### Concerns with Behaviour

Jamie: There is a problem with failure of conversion with `fromDigits`, if literal format doesnt match defined type class, then there is silent failure

Nicolas: What can we do with final vals and constant types.

Martin, in response:
- We can take another look at the specific implementation for activating conversions, and even the type classes in the library.
- Open question: should we have a user pluggable notion of constant type for generic literals.

#### Alternatives

#### 1. Numeric Suffixes

Guillaume:
- Suffixes may be more suited to Scala as an expected type only works well when the whole expression is a simple literal.
- Precedent with prefixes for string interpolator, numeric suffixes could have similar pluggable implementation.

Martin:
- Suffix is ad-hoc and visually ugly
- Not so bad if its a general pluggable solution, but we can have leaner syntax rules by using types.
- In general, non trivial literals shouldn't be used inline, we should write a named constant.
- Guy Steele suggested it as a more beautiful solution.

#### 2. Special case Factory Methods

Olivier:
- The less inference on things, the better
- Python behaviour of conversions is confusing to data scientists, so literals are not always clear to understand

Sébastien:

- Assume magical way to pass any literal to an apply method on a companion object of a numeric type. Works for custom types

#### Scheduling Of Release Discussion

Martin suggested this was not urgent to ship in 3.0, and asks if it could be put under a flag to ensure it gets tested.

Guillaume:
- Its tricky because it adds a lot of noise to the std lib and we must be careful what is included there.
- Could we ship it in separate library?

Adriaan:
- The more we can delay from all proposals, the better.

#### Conclusion

There has been little testing in applications of this feature, not enough to make a judgement on its utility. With more consultation from potential users, the SIP committee can gather conclusive evidence.

There are several concerns, relating to the scope of where this feature makes sense, due to limited type inference, and the verbosity required in inline expressions. It is suggested that this is a non-issue because by default, `Long` literals can't be inferred on the LHS of an addition expression without an expected type, and non-trivial literals should be lifted to named constants.

Alternatives suggested have been user-defined numeric suffixes, and specialised factory methods for user defined types.

### Indentation Syntax

Martin presents the proposal as consisting of several parts:

- New control syntax (`if then`, `for do`, drop `do while`)
- Optional braces for control expressions if you indent on new line after specific token.
- Optional braces are extended to named definitions:
  - Experience showed that without a marker, indentation of 2 spaces was no longer enough to clearly distinguish member definitions.
  - `with` worked as a marker for a while but had some disambiguation issues.
  - colon marker is settled as the proposal

#### Usability Anecdotes

Martin:
- Totally sold as a productivity boost
- Used widely in compiler codebase for 6 months
  - Does find is necessary to have vertical bars in editor for indentation
- Examples at:
  - https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/semanticdb/ExtractSemanticDB.scala
  - https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/typer/Nullables.scala
- `then` in if expression was harder to get used to

Guillaume:
- `then` feels like noise but then with multiline conditions is harder to read without it, but was fine with the original parens on condition.
- `end` marker, by being optional, leads to too much bikeshedding

Martin:
- we can rely on style guides to enforce consistency in a codebase.
- In general, a 10 line block with any empty lines should have an end marker.
- recommends this style for class with companion:
```scala
class Foo:

  def foo = ???

object Foo:

  def bar = ???

end Foo
```

#### On Composability of Features

Sébastien asks:
- If the implementation of the separate features are orthogonal
- As a consequence, who then has experience using the old control syntax with optional braces, as originally it was thought that indentation was dependent on the new control syntax.

Martin:
- The features are independent.
- However it seems natural to transition to use them together in 1 step.

Sebastien had a concern about the performance for parsing, compared to old style code, eg:
```scala
if (x || y)
  && (a || b) then foo()
```

Martin: Lookahead in the parser is necessary, but this is possible due to operators being accepted on new lines

#### On Enforcing One Style

Adriaan:
- Main worry with the whole proposal is too much choice, which could have negative feedback.
- Dotty should enforce one syntactic style, with leniency under the Scala2 language mode

Guillaume, in disagreement:
- Today its easy to port to Dotty by copy pasting code, or just changing a version number.
- e.g. StackOverflow answers wont work

Sébastien:
- We need to decide on one choice
- Too many ways to do `if`.
- Dotty supposed to be about simplification, but this makes one of the most basic things complex
- perhaps the compiler should flag if styles are mixed

#### Conclusion

No one present at the meeting showed outright objection to the specific new syntax changes. Comments given suggest that for users in the meeting, overall there is a boost to productivity.

The main objection to the proposal is the amount of choice the user has in the syntax they may choose to use. And there is an open question of what should be restricted in the launch of Scala 3.

### Implicit Resolution changes

Martin outines the rules in the [documentation](http://dotty.epfl.ch/docs/reference/changed-features/implicit-resolution.html):

#### 1) Types must be explicit for implicit vals and results of defs
- Exception for local block

#### 2) Nesting of implicits is significant
- Implicits look from inside out
- Now resolution of a symbol, not a name
- No more shadowing, but nesting is important

#### Concerns with Nesting rule

Guillaume:
- We should be careful with what code from Scala 2 will change under the new rules.
- Concretely in the community build, compilation of Scalacheck inferred a different `map` method for `String` then the one under Scala 2.
- There can be new ambiguities when mixing lexical scope with inheritance scope rules
- People probably do not check that the semantics have changed if you were to change the Scala version and it compiles.
- But perhaps for this meeting we should not focus on migration, just the objective quality of the changes.

Sébastien, in response:
- if this is dangerous to change, we could delay the changes beyond 3.0
- Migration is important

Adriaan, in response:
- I don't think we should be concerned about laziness to read new rules

Guillaume:
- When looking for an implicit conversion to add a method, the innermost match way not type check, should we look in the outer scope for an objectively better definition?

Martin, in response:
- This could be problematic because of performance cost of backtracking. We have caches of innermost to outermost.
- Because of cost of new types such as union and intersection, we need savings elsewhere

Martin, concluding:
- In terms of standardisation, is this acceptable as is to go in?

#### 3) package prefix no longer contributes to implicit scope

Martin: Motivation is that it is too easy to pollute everywhere with implicit definitions.

Guillaume: Doesn't appear to break much code so it seems ok so far.

#### 4-5) clean up surprising behaviour of divergence or ambiguity

- in Scala 2 ambiguity wasnt fatal in the presence of an alternative, now it is fails immediately.
- This breaks `Not[T]` encodings, which is now special cased in compiler.

Sébastien:
- Why are the new rules better?
- My experience in Scala 2 is that diverging implicits are not very easy to understand

Guillaume: Is the specification of Scala 2 divergence in user documentation?

Martin: problem with fatal divergence now is that it seems underspecified, e.g. visitation order of search has an effect.

#### 6) Implicit Conversions with By-Name Parameters Now Have the Same Priority

Martin: In Scala 2, by-name conversions were added in a "bolt on" fashion, making spec strange for no principled reason.

#### 7) Context Parameters Lower Specificity of Implicits

Guillaume:
- Worst feature change as it is seems the most arbitrary
- It may be better for reducing ambiguity, but is more complex.

Martin believes the inheritance model is very fragile, but this version is more modular.

Sébastien:
- Believes the older version leads to easier evolution of a library in a binary compatible fashion.
- Demonstrates Scala.js [Union Types](https://github.com/scala-js/scala-js/blob/master/library/src/main/scala/scala/scalajs/js/Union.scala) as a way to evolve priorities with a new base type.
- Asks if the new rules allow to add an implicit definition of a priority in-between two other definitions while preserving binary compatability?

Martin, in response:
- Shows a [demo](https://github.com/lampepfl/dotty/blob/master/tests/run/implied-priority.scala) of how to insert a new implicit in between existing definitions.
- The new scheme of priorities is more simple to grow than before because inheritance is fragile

Sébastien is satisfied with the demo, is fine either way to add to 3.0 or later. Someone should champion it.

Guillaume:
- Will support if library authors are behind it like Cats.
- It's hard to teach and hard to understand.
- Is it really better than status quo? Yes the old system is clunky but is well understood.
- So is it worth it?

Martin, in response:
- Yes, it's better for the small number of library authors who really need it.
- The old way with traits is a hack, this has principles, why should we deprive ourselves of the correct solution?
- It would be a pity to remove, it took a lot of thought, and is an objectively better design.
- We should have a tutorial documentation for the new rules

#### Conclusion

There is fair skepticism for introducing the changes immediately, as the migration path from Scala 2 can be complicated if runtime behaviour changes undetected without a warning or error at compile time. Additionally there are concerns about the effort required to re-educate users with the new rules.

### Drop Autotupling

Sébastien: The main challenge is migration, what is the ideal scenario?

Martin: In the future, there is no autotupling, and then any parens following an infix operator is the start of a tuple and not an argument list.

Sébastien:
- It looks like most of the use cases for requiring the extra parens have been dropped in 2.13
- What is the state of deprecation in 2.13

Martin:
- Symbolic operators with multiple arguments
- We could delay beyond 3.0, and migration concerns will be less.

Sébastien:
- It sounds reasonable to delay, and definitely warn/error at definition infix ops with multiple arguments.
- Coupled with ensuring the definitions of infix calls have the infix annotation.

#### Conclusion
There is general favorability of the proposal from present members, the main concerns are whether or not to delay the feature to aid migration.

### Multiversal Equality

Sébastien: has this changed since last discussion?

Guillaume:
- not changed in very long time
- `strictEquality` probably not tested in the wild much.

Martin: There has been concern about why we have two type parameters, which was resolved with the people concerned.

Adriaan:
- Highlights an issue with `strictEquality` and not compiling the standard library:
```scala
$ dotr -language:strictEquality
Starting dotty REPL...
scala> Some(1) == Some(2)
1 |Some(1) == Some(2)
  |^^^^^^^^^^^^^^^^^^
  |Values of types Some[Int] and Some[Int] cannot be compared with == or !=
```
- Asks if is this crucial for 3.0

Martin: Scala 2 has some checks which give a warning on comparing nonsensical types, which do not exist in dotty. So he would be uncomfortable to ship without a similar feature.

Guillaume: one solution to the warning could be disjoint checking, like implemented for match types.

Martin: highlights that the match type implementation doesnt work for traits.

Guillaume:
- `Eql` doesn't help against comparing two values of statically disjoint subtypes of an ADT, if they have the same type parameter.
- Could we combine warning on disjoint with `Eql`?
- Or possibly a `Disjoint[A,B]` type class which could feed into warnings?

Martin: There are far more cases where things are disjoint than not so there would be much more noise.

#### Conclusion
There is mixed favorability for the proposal as is, with concern for precision of errors in the presence of known static divergence and the timing of release.

### Name based pattern matching

Name based pattern matching is presented as a formalisation of the rules included in Scala 2, with a few new ones. It is used as the implementation of pattern matching for case classes in Dotty.

Sébastien: should we use `Product` as a marker trait for this?

Olivier: We use it to reduce the noise in the LUB of case classes.

Sébastien demonstrates how [scala-unboxed-option](https://github.com/sjrd/scala-unboxed-option/blob/master/src/main/scala/uoption/package.scala) uses name based patten matching on a value class to achieve matching with no allocations.

Nicolas: Can we use extension methods to do name based pattern match? (Rather than extend `AnyVal`)

Guillaume: No because this is run at a later phase that does not resolve dotty extension methods.

#### On the concern of case class unapply

(This concern is separate to the SIP proposal)

Guillaume:
- Some people rely on `unapply` of case class companion to extract an `Option` of some tuple, in Dotty, the `unapply` method is the identity.
- One solution is to special-case case classes in patterns, like Scala 2.

Martin in response:
- Is it worth the effort to make the compiler more complex for the sake of binary compatability?

#### Conclusion

The main concern is the use of `Product` as a marker trait, and the current inability of Dotty extension methods to be used for name-based extractors. But overall everyone present is in favour.

### Structural Types

Sébastien: should `Selectable` become a marker trait rather than require specific methods?

Guillaume:
- Not seen any real-world usage, can some existing "Record" Style macros benefit from this.
- Seems ugly and we need to prove it can be used equivalently to `HMap` in all use cases.

Martin: Performance concerns with using `HMap`.

Guillaume: Whatever we propose, it needs to be convenient for calling.

Martin: We need something to support Chisel in Scala 3.

Guillaume, in response:
- This is more complicated as Dotty breaks their use case.
- We really need to see it tried in a real application for its intended use case.

Martin:
- To get people to really try it out, it seems you need a full tutorial. And current docs seems lacking.
