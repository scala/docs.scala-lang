---
layout: sip
number: 56
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
stage: completed
status: shipped
title: Proper Specification for Match Types
---

**By: Sébastien Doeraene**

## History

| Date          | Version            |
|---------------|--------------------|
| Aug 11th 2023 | Initial Draft      |

## Summary

Currently, match type reduction is not specified, and its implementation is by nature not specifiable.
This is an issue because match type reduction spans across TASTy files (unlike, for example, type inference or GADTs), which can and will lead to old TASTy files not to be linked again in future versions of the compiler.

This SIP proposes a proper specification for match types, which does not involve type inference.
It is based on `baseType` computations and subtype tests involving only fully-defined types.
That is future-proof, because `baseType` and subtyping are defined in the specification of the language.

The proposed specification defines a subset of current match types that are considered legal.
Legal match types use the new, specified reduction rules.
Illegal match types are rejected, which is a breaking change, and can be recovered under `-source:3.3`.

In addition, the proposal gives a specification for `provablyDisjoint` and for the reduction algorithm.

## Motivation

Currently, match type reduction is implementation-defined.
The core of the logic is matching a scrutinee type `X` against a pattern `P` with captures `ts`.
Captures are similar to captures in term-level pattern matching: in the type-level `case List[t] =>`, `t` is a (type) capture, just like in the term-level `case List(x) =>`, `x` is a (term) capture.
Matching works as follows:

1. we create new type variables for the captures `ts'` giving a pattern `P'`,
2. we ask the compiler's `TypeComparer` (the type inference black box) to "try and make it so" that `X <:< P'`,
3. if it manages to do so, we get constraints for `ts'`; we then have a match, and we instantiate the body of the pattern with the received constraints for `ts`.

The problem with this approach is that, by essence, type inference is an unspecified black box.
There are *guidelines* about how it should behave in common cases, but no actual guarantee.
This is fine everywhere else in the language, because what type inference comes up with is stored once and for all in TASTy.
When we read TASTy files, we do not have to perform the work of type inference again; we reuse what was already computed.
When a new version of the compiler changes type inference, it does not change what was computed and stored in TASTy files by previous versions of the compiler.

For match types, this is a problem, because reduction spans across TASTy files.
Given some match type `type M[X] = X match { ... }`, two codebases may refer to `M[SomeType]`, and they must reduce it in the same way.
If they don't, hard incompatibilities can appear, such as broken subtyping, broken overriding relationships, or `AbstractMethodError`s due to inconsistent erasure.

In order to guarantee compatibility, we must ensure that, for any given match type:

* if it reduces in a given way in version 1 of the compiler, it still reduces in the same way in version 2, and
* if it does not reduce in version 1 of the compiler, it still does not reduce in version 2.
* (it is possible for version 1 to produce an *error* while version 2 successfully reduces or does not reduce)

Reduction depends on two decision produces:

* *matching* a scrutinee `X` against a pattern `P` (which we mentioned above), and
* deciding whether a scrutinee `X` is *provably disjoint* from a pattern `P`.

When a scrutinee does not match a given pattern and cannot be proven disjoint from it either, the match type is "stuck" and does not reduce.

If matching is delegated to the `TypeComparer` black box, then it is impossible in practice to guarantee the first compatibility property.

In addition to the compatibility properties above, there is also a soundness property that we need to uphold:

* if `X match { ... }` reduces to `R` and `Y <: X`, then `Y match { ... }` also reduces to `R`.

This requires both that *matching* with a tighter scrutinee gives the same result, and that `provablyDisjoint(X, P)` implies `provablyDisjoint(Y, P)`.
(Those properties must be relaxed when `Y <: Nothing`, in order not to create more problems; see Olivier Blanvillain's thesis section 4.4.2 for details.)
With the existing implementation for `provablyDisjoint`, there are reasonable, non-contrived examples that violate this property.

In order to solve these problems, this SIP provides a specification for match type reduction that is independent of the `TypeComparer` black box.
It defines a subset of match type cases that are considered legal.
Legal cases get a specification for when and how they should reduce for any scrutinee.
Illegal cases are rejected as being outside of the language.

For compatibility reasons, such now-illegal cases will still be accepted under `-source:3.3`; in that case, they reduce using the existing, unspecified (and prone to breakage) implementation.
Due to practical reasons (see "Other concerns"), doing so does *not* emit any warning.
Eventually, support for this fallback may be removed if the compiler team decides that its maintenance burden is too high.
As usual, this SIP does not by itself provide any specific timeline.
In particular, there is no relationship with 3.3 being an "LTS"; it just happens to be the latest "Next" as well at the time of this writing (the changes in this SIP will only ever apply to 3.4 onwards, so the LTS is not affected in any way).

For legal cases, the proposed reduction specification should reduce in the same way as the current implementation for all but the most obscure cases.
Our tests, including the entire dotty CI and its community build, did not surface any such incompatibility.
It is however not possible to guarantee that property for *all* cases, since the existing implementation is not specified in the first place.

## Proposed solution

### Specification

#### Preamble

Some of the concepts mentioned here are defined in the existing Scala 3 specification draft.
That draft can be found in the dotty repository at https://github.com/lampepfl/dotty/tree/main/docs/_spec.
It is not rendered anywhere yet, though.

Here are some of the relevant concepts that are perhaps lesser-known:

* Chapter 3, section "Internal types": concrete v abstract syntax of types.
* Chapter 3, section "Base Type": the `baseType` function.
* Chapter 3, section "Definitions": whether a type is concrete or abstract (unrelated to the concrete or abstract *syntax*).

#### Syntax

Syntactically, nothing changes.
The way that a pattern is parsed and type captures identified is kept as is.

Once type captures are identified, we can represent the *abstract* syntax of a pattern as follows:

```
// Top-level pattern
MatchTypePattern ::= TypeWithoutCapture
                   | MatchTypeAppliedPattern

// A type that does not contain any capture, such as `Int` or `List[String]`
TypeWithoutCapture ::= Type // `Type` is from the "Internal types" section of the spec

// Applied type pattern with at least one capture, such as `List[Seq[t]]` or `*:[Int, t]`
MatchTypeAppliedPattern ::= TyconWithoutCapture ‘[‘ MatchTypeSubPattern { ‘,‘ MatchTypeSubPattern } ‘]‘

// The type constructor of a MatchTypeAppliedPattern never contains any captures
TyconWithoutCapture ::= Type

// Type arguments can be captures, types without captures, or nested applied patterns
MatchTypeSubPattern ::= TypeCapture
                      | TypeWithoutCapture
                      | MatchTypeAppliedPattern

TypeCapture ::= NamedTypeCapture    // e.g., `t`
              | WildcardTypeCapture // `_` (with inferred bounds)
```

In the concrete syntax, `MatchTypeAppliedPattern`s can take the form of `InfixType`s.
A common example is `case h *: t =>`, which is desugared into `case *:[h, t] =>`.

The cases `MatchTypeAppliedPattern` are only chosen if they contain at least one `TypeCapture`.
Otherwise, they are considered `TypeWithoutCapture` instead.
Each named capture appears exactly once.

#### Legal patterns

A `MatchTypePattern` is legal if and only if one of the following is true:

* It is a `TypeWithoutCapture`, or
* It is a `MatchTypeAppliedPattern` with a legal `TyconWithoutCapture` and each of its arguments is either:
  * A `TypeCapture`, or
  * A `TypeWithoutCapture`, or
  * The type constructor is *covariant* in that parameter, and the argument is recursively a legal `MatchTypeAppliedPattern`.

A `TyconWithoutCapture` is legal if one of the following is true:

* It is a *class* type constructor, or
* It is the `scala.compiletime.ops.int.S` type constructor, or
* It is an *abstract* type constructor, or
* It is a refined type of the form `Base { type Y = t }` where:
  * `Base` is a `TypeWithoutCapture`,
  * There exists a type member `Y` in `Base`, and
  * `t` is a `TypeCapture`.
* It is a type alias to a type lambda such that:
  * Its bounds contain all possible values of its arguments, and
  * When applied to the type arguments, it beta-reduces to a new legal `MatchTypeAppliedPattern` that contains exactly one instance of every type capture present in the type arguments.

#### Examples of legal patterns

Given the following definitions:

```scala
class Inv[A]
class Cov[+A]
class Contra[-A]

class Base {
  type Y
}

type YExtractor[t] = Base { type Y = t }
type ZExtractor[t] = Base { type Z = t }

type IsSeq[t <: Seq[Any]] = t
```

Here are examples of legal patterns:

```scala
// TypeWithoutCapture's
case Any => // also the desugaring of `case _ =>` when the _ is at the top-level
case Int =>
case List[Int] =>
case Array[String] =>

// Class type constructors with direct captures
case scala.collection.immutable.List[t] => // not Predef.List; it is a type alias
case Array[t] =>
case Contra[t] =>
case Either[s, t] =>
case Either[s, Contra[Int]] =>
case h *: t =>
case Int *: t =>

// The S type constructor
case S[n] =>

// An abstract type constructor
// given a [F[_]] or `type F[_] >: L <: H` in scope
case F[t] =>

// Nested captures in covariant position
case Cov[Inv[t]] =>
case Cov[Cov[t]] =>
case Cov[Contra[t]] =>
case Array[h] *: t => // sugar for *:[Array[h], t]
case g *: h *: EmptyTuple =>

// Type aliases
case List[t] => // which is Predef.List, itself defined as `type List[+A] = scala.collection.immutable.List[A]`

// Refinements (through a type alias)
case YExtractor[t] =>
```

The following patterns are *not* legal:

```scala
// Type capture nested two levels below a non-covariant type constructor
case Inv[Cov[t]] =>
case Inv[Inv[t]] =>
case Contra[Cov[t]] =>

// Type constructor with bounds that do not contain all possible instantiations
case IsSeq[t] =>

// Type refinement where the refined type member is not a member of the parent
case ZExtractor[t] =>
```

#### Matching

Given a scrutinee `X` and a match type case `case P => R` with type captures `ts`, matching proceeds in three steps:

1. Compute instantiations for the type captures `ts'`, and check that they are *specific* enough.
2. If successful, check that `X <:< [ts := ts']P`.
3. If successful, reduce to `[ts := ts']R`.

The instantiations are computed by the recursive function `matchPattern(X, P, variance, scrutIsWidenedAbstract)`.
At the top level, `variance = 1` and `scrutIsWidenedAbstract = false`.

`matchPattern` behaves according to what kind is `P`:

* If `P` is a `TypeWithoutCapture`:
  * Do nothing (always succeed).
* If `P` is a `WildcardCapture` `ti = _`:
  * Instantiate `ti` so that the subtype test in Step (2) above always succeeds:
    * If `X` is of the form `_ >: L <: H`, instantiate `ti := H` (resp. `L`, `X`) if `variance = 1` (resp. `-1`, `0`).
    * Otherwise, instantiate `ti := X`.
* If `P` is a `TypeCapture` `ti`:
  * If `X` is of the form `_ >: L <: H`,
    * If `scrutIsWidenedAbstract` is `true`, fail as not specific.
    * Otherwise, if `variance = 1`, instantiate `ti := H`.
    * Otherwise, if `variance = -1`, instantiate `ti := L`.
    * Otherwise, fail as not specific.
  * Otherwise, if `variance = 0` or `scrutIsWidenedAbstract` is `false`, instantiate `ti := X`.
  * Otherwise, fail as not specific.
* If `P` is a `MatchTypeAppliedPattern` of the form `T[Qs]`:
  * Assert: `variance = 1` (from the definition of legal patterns).
  * If `T` is a class type constructor of the form `p.C`:
    * If `baseType(X, C)` is not defined, fail as not matching.
    * Otherwise, it is of the form `q.C[Us]`.
    * If `p =:= q` is false, fail as not matching.
    * Let `innerScrutIsWidenedAbstract` be true if either `scrutIsWidenedAbstract` or `X` is not a concrete type.
    * For each pair of `(Ui, Qi)`, compute `matchPattern(Ui, Qi, vi, innerScrutIsWidenedAbstract)` where `vi` is the variance of the `i`th type parameter of `T`.
  * If `T` is `scala.compiletime.ops.int.S`:
    * If `n = natValue(X)` is undefined or `n <= 0`, fail as not matching.
    * Otherwise, compute `matchPattern(n - 1, Q1, 1, scrutIsWidenedAbstract)`.
  * If `T` is an abstract type constructor:
    * If `X` is not of the form `F[Us]` or `F =:= T` is false, fail as not matching.
    * Otherwise, for each pair of `(Ui, Qi)`, compute `matchPattern(Ui, Qi, vi, scrutIsWidenedAbstract)` where `vi` is the variance of the `i`th type parameter of `T`.
  * If `T` is a refined type of the form `Base { type Y = ti }`:
    * Let `q` be `X` if `X` is a stable type, or the skolem type `∃α:X` otherwise.
    * If `q` does not have a type member `Y`, fail as not matching (that implies that `X <:< Base` is false, because `Base` must have a type member `Y` for the pattern to be legal).
    * If `q.Y` is abstract, fail as not specific.
    * If `q.Y` is a class member:
      * If `q` is a skolem type `∃α:X`, fail as not specific.
      * Otherwise, compute `matchPattern(ti, q.Y, 0, scrutIsWidenedAbstract)`.
    * Otherwise, the underlying type definition of `q.Y` is of the form `= U`:
      * If `q` is not a skolem type `∃α:X`, compute `matchPattern(ti, U, 0, scrutIsWidenedAbstract)`.
      * Otherwise, let `U' = dropSkolem(U)` be computed as follow:
        * `dropSkolem(q)` is undefined.
        * `dropSkolem(p.T) = p'.T` where `p' = dropSkolem(p)` if the latter is defined. Otherwise:
          * If the underlying type of `p.T` is of the form `= V`, then `dropSkolem(V)`.
          * Otherwise `dropSkolem(p.T)` is undefined.
        * `dropSkolem(p.x) = p'.x` where `p' = dropSkolem(p)` if the latter is defined. Otherwise:
          * If the dealiased underlying type of `p.x` is a singleton type `r.y`, then `dropSkolem(r.y)`.
          * Otherwise `dropSkolem(p.x)` is undefined.
        * For all other types `Y`, `dropSkolem(Y)` is the type formed by replacing each component `Z` of `Y` by `dropSkolem(Z)`.
      * If `U'` is undefined, fail as not specific.
      * Otherwise, compute `matchPattern(ti, U', 0, scrutIsWidenedAbstract)`.
  * If `T` is a concrete type alias to a type lambda:
    * Let `P'` be the beta-reduction of `P`.
    * Compute `matchPattern(P', X, variance, scrutIsWidenedAbstract)`.

#### Disjointness

This proposal initially did not include a discussion of disjointness.
After initial review, it became apparent that it should also provide a specification for the "provably disjoint" test involved in match type reduction.
Additional study revealed that, while *specifiable*, the current algorithm is very ad hoc and severely lacks desirable properties such as preservation along subtyping (see towards the end of this section).

Therefore, this proposal now also includes a proposed specification for "provably disjoint".
To the best of our knowledge, it is strictly stronger than what is currently implemented, with one exception.

The current implementation considers that `{ type A = Int }` is provably disjoint from `{ type A = Boolean }`.
However, it is not able to prove disjointness between any of the following:

* `{ type A = Int }` and `{ type A = Boolean; type B = String }` (adding another type member)
* `{ type A = Int; type B = Int }` and `{ type B = String; type A = String }` (switching the order of type members)
* `{ type A = Int }` and class `C` that defines a member `type A = String`.

Therefore, we drop the very ad hoc case of one-to-one type member refinements.

On to the specification.

A scrutinee `X` is *provably disjoint* from a pattern `P` iff it is provably disjoint from the type `P'` obtained by replacing every type capture in `P` by a wildcard type argument with the same bounds.

We note `X ⋔ Y` to say that `X` and `Y` are provably disjoint.
Intuitively, that notion is based on the following properties of the Scala language:

* Single inheritance of classes
* Final classes cannot be extended
* Sealed traits have a known set of direct children
* Constant types with distinct values are nonintersecting
* Singleton paths to distinct `enum` case values are nonintersecting

However, a precise definition of provably-disjoint is complicated and requires some helpers.
We start with the notion of "simple types", which are a minimal subset of Scala types that capture the concepts mentioned above.

A "simple type" is one of:

* `Nothing`
* `AnyKind`
* `p.C[...Xi]` a possibly parameterized class type, where `p` and `...Xi` are arbitrary types (not just simple types)
* `c` a literal type
* `p.C.x` where `C` is an `enum` class and `x` is one of its value `case`s
* `X₁ & X₂` where `X₁` and `X₂` are both simple types
* `X₁ | X₂` where `X₁` and `X₂` are both simple types
* `[...ai] =>> X₁` where `X₁` is a simple type

We define `⌈X⌉` a function from a full Scala type to a simple type.
Intuitively, it returns the "smallest" simple type that is a supertype of `X`.
It is defined as follows:

* `⌈X⌉ = X` if `X` is a simple type
* `⌈X⌉ = ⌈U⌉` if `X` is a stable type but not a simple type and its underlying type is `U`
* `⌈X⌉ = ⌈H⌉` if `X` is a non-class type designator with upper bound `H`
* `⌈X⌉ = ⌈η(X)⌉` if `X` is a polymorphic class type designator, where `η(X)` is its eta-expansion
* `⌈X⌉ = ⌈Y⌉` if `X` is a match type that reduces to `Y`
* `⌈X⌉ = ⌈H⌉` if `X` is a match type that does not reduce and `H` is its upper bound
* `⌈X[...Ti]⌉ = ⌈Y⌉` where `Y` is the beta-reduction of `X[...Ti]` if `X` is a type lambda
* `⌈X[...Ti]⌉ = ⌈⌈X⌉[...Ti⌉` if `X` is neither a type lambda nor a class type designator
* `⌈X @a⌉ = ⌈X⌉`
* `⌈X { R }⌉ = ⌈X⌉`
* `⌈{ α => X } = ⌈X⌉⌉`
* `⌈X₁ & X₂⌉ = ⌈X₁⌉ & ⌈X₂⌉`
* `⌈X₁ | X₂⌉ = ⌈X₁⌉ | ⌈X₂⌉`
* `⌈[...ai] =>> X₁⌉ = [...ai] =>> ⌈X₁⌉`

The following properties hold about `⌈X⌉` (we have paper proofs for those):

* `X <: ⌈X⌉` for all type `X`.
* If `S <: T`, and the subtyping derivation does not use the "lower-bound rule" of `<:` anywhere, then `⌈S⌉ <: ⌈T⌉`.

The "lower-bound rule" states that `S <: T` if `T = q.X `and `q.X` is a non-class type designator and `S <: L` where `L` is the lower bound of the underlying type definition of `q.X`".
That rule is known to break transitivy of subtyping in Scala already.

Second, we define the relation `⋔` on *classes* (including traits and hidden classes of objects) as:

* `C ⋔ D` if `C ∉ baseClasses(D)` and `D` is `final`
* `C ⋔ D` if `D ∉ baseClasses(C)` and `C` is `final`
* `C ⋔ D` if there exists `class`es `C' ∈ baseClasses(C)` and `D' ∈ baseClasses(D)` such that `C' ∉ baseClasses(D')` and `D' ∉ baseClasses(C')`.
* `C ⋔ D` if `C` is `sealed` without anonymous child and `Ci ⋔ D` for all direct children `Ci` of `C`
* `C ⋔ D` if `D` is `sealed` without anonymous child and `C ⋔ Di` for all direct children `Di` of `D`

We can now define `⋔` for *types*.

For arbitrary types `X` and `Y`, we define `X ⋔ Y` as `⌈X⌉ ⋔ ⌈Y⌉`.

Two simple types `S` and `T` are provably disjoint if there is a finite derivation tree for `S ⋔ T` using the following rules.
Most rules go by pair, which makes the whole relation symmetric:

* `Nothing` is disjoint from everything (including itself):
  * `Nothing ⋔ T`
  * `S ⋔ Nothing`
* A union type is disjoint from another type if both of its parts are disjoint from that type:
  * `S ⋔ T1 | T2` if `S ⋔ T1` and `S ⋔ T2`
  * `S1 | S2 ⋔ T` if `S1 ⋔ T` and `S2 ⋔ T`
* An intersection type is disjoint from another type if at least one of its parts is disjoint from that type:
  * `S ⋔ T1 & T2` if `S ⋔ T1` or `S ⋔ T2`
  * `S1 & S2 ⋔ T` if `S1 ⋔ T` or `S1 ⋔ T`
* A type lambda is disjoint from any other type that is not a type lambda with the same number of parameters:
  * `[...ai] =>> S1 ⋔ q.D.y`
  * `[...ai] =>> S1 ⋔ d`
  * `[...ai] =>> S1 ⋔ q.D[...Ti]`
  * `p.C.x ⋔ [...bi] =>> T1`
  * `c ⋔ [...bi] =>> T1`
  * `p.C[...Si] ⋔ [...bi] =>> T1`
  * `[a1, ..., an] =>> S1 ⋔ [b1, ..., bm] =>> T1` if `m != n`
* Two type lambdas with the same number of type parameters are disjoint if their result types are disjoint:
  * `[a1, ..., an] =>> S1 ⋔ [b1, ..., bn] =>> T1` if `S1 ⋔ T1`
* An `enum` value case is disjoint from any other `enum` value case (identified by either not being in the same `enum` class, or having a different name):
  * `p.C.x ⋔ q.D.y` if `C != D` or `x != y`
* Two literal types are disjoint if they are different:
  * `c ⋔ d` if `c != d`
* An `enum` value case is always disjoint from a literal type:
  * `c ⋔ q.D.y`
  * `p.C.x ⋔ d`
* An `enum` value case or a constant is disjoint from a class type if it does not extend that class (because it's essentially final):
  * `p.C.x ⋔ q.D[...Ti]` if `baseType(p.C.x, D)` is not defined
  * `p.C[...Si] ⋔ q.D.y` if `baseType(q.D.y, C)` is not defined
  * `c ⋔ q.D[...Ti]` if `baseType(c, D)` is not defined
  * `p.C[...Si] ⋔ d` if `baseType(d, C)` is not defined
* Two class types are disjoint if the classes themselves are disjoint, or if there exist a common super type with conflicting type arguments.
  * `p.C[...Si] ⋔ q.D[...Ti]` if `C ⋔ D`
  * `p.C[...Si] ⋔ q.D[...Ti]` if there exists a class `E` such that `baseType(p.C[...Si], E) = a.E[...Ai]` and `baseType(q.D[...Ti], E) = b.E[...Bi]` and there exists a pair `(Ai, Bi)` such that
    * `Ai ⋔ Bi` and it is in invariant position, or
    * `Ai ⋔ Bi` and it is in covariant position and there exists a field of that type parameter in `E`

It is worth noting that this definition disregards prefixes entirely.
`p.C` and `q.C` are never provably disjoint, even if `p` could be proven disjoint from `q`.
It also disregards type members.

We have a proof sketch of the following property for `⋔`:

* If `S <: T` and `T ⋔ U`, then `S ⋔ U`.

This is a very desirable property, which does not hold at all for the current implementation of match types.
It means that if we make the scrutinee of a match type more precise (a subtype) through substitution, and the match type previously reduced, then the match type will still reduce to the same case.

Note: if `⋔` were a "true" disjointness relationship, and not a *provably*-disjoint relationship, that property would trivially hold based on elementary set theoretic properties.
It would amount to proving that if `S ⊆ T` and `T ⋂ U = ∅`, then `S ⋂ U = ∅`.

#### Reduction

The final piece of the match types puzzle is to define the reduction as a whole.

In addition to matching and `provablyDisjoint`, the existing algorithm relies on a `provablyEmpty` property for a single type.
It was added a safeguard against matching an empty (`Nothing`) scrutinee.
The problem with doing so is that an empty scrutinee will be considered *both* as matching the pattern *and* as provably disjoint from the pattern.
This can result in the match type reducing to different cases depending on the context.
To sidestep this issue, the current algorithm refuses to consider a scrutinee that is `provablyEmpty`.

If we wanted to keep that strategy, we would also have to specify `provablyEmpty` and prove some properties about it.
Instead, we choose a much simpler and safer strategy: we always test both matching *and* `provablyDisjoint`.
When both apply, we deduce that the scrutinee is empty is refuse to reduce the match type.

Therefore, in summary, the whole reduction algorithm works as follows.
The result of reducing `X match { case P1 => R1; ...; case Pn => Rn }` can be a type, undefined, or a compile error.
For `n >= 1`, it is specified as:

* If `X` matches `P1` with type capture instantiations `[...ts => ts']`:
  * If `X ⋔ P1`, do not reduce.
  * Otherwise, reduce as `[...ts => ts']R1`.
* Otherwise,
  * If `X ⋔ P1`, the result of reducing `X match { case P2 => R2; ...; case Pn => Rn }` (i.e., proceed with subsequent cases).
  * Otherwise, do not reduce.

The reduction of an "empty" match type `X match { }` (which cannot be written in user programs) is a compile error.

#### Subtyping

As is already the case in the existing system, match types tie into subtyping as follows:

* `X match { ... } <: T` if `X match { ... }` reduces to `S1` and `S1 <: T`
* `S <: X match { ... }` if `X match { ... }` reduces to `T1` and `S <: T1`
* `X match { ... }  <: T` if `X match { ... }` has the upper bound `H` and `H <: T`
* `X match { case P1 => A1; ...; case Pn => An } <: Y match { case Q1 => B1; ...; Qn => Bn }` if `X =:= Y` and `Pi =:= Qi` for each `i` and `Ai <: Bi` for each `i`

### Compatibility

Compatibility is inherently tricky to evaluate for this proposal, and even to define.
One could argue that, from a pure specification point of view, it breaks nothing since it only specifies things that were unspecified before.
However, that is not very practical.
In practice, this proposal definitely breaks some code that compiled before, due to making some patterns illegal.
In exchange, it promises that all the patterns that are considered legal will keep working in the future; which is not the case with the current implementation, even for the legal subset.

In order to evaluate the practical impact of this proposal, we conducted a quantitative analysis of *all* the match types found in Scala 3 libraries published on Maven Central.
We used [Scaladex](https://index.scala-lang.org/) to list all Scala 3 libraries, [coursier](https://get-coursier.io/docs/api) to resolve their classpaths, and [tasty-query](https://github.com/scalacenter/tasty-query) to semantically analyze the patterns of all the match types they contain.

Out of 4,783 libraries, 49 contained at least one match type definition.
These 49 libraries contained a total of 779 match type `case`s.
Of those, there were 8 `case`s that would be flagged as not legal by the current proposal.

These can be categorized as follows:

* 2 libraries with 1 type member extractor each where the `Base` does not contain `Y`; they are both to extract `SomeEnumClass#Value` (from Scala 2 `scala.Enumeration`-based "enums").
  * https://github.com/iheartradio/ficus/blob/dcf39d6cd2dcde49b093ba5d1507ca478ec28dac/src/main/scala-3/net/ceedubs/ficus/util/EnumerationUtil.scala#L4-L8
  * https://github.com/json4s/json4s/blob/5e0b92a0ca59769f3130e081d0f53089a4785130/ext/src/main/scala-3/org/json4s/ext/package.scala#L4-L8
    * the maintainers of `json4s` already accepted a PR with a workaround at https://github.com/json4s/json4s/pull/1347
* 1 library used to have 2 cases of the form `case HKExtractor[f] =>` with `type KHExtractor[f[_, _]] = Base { type Y[a, b] = f[a, b] }`.
  * Those used to be at https://github.com/7mind/idealingua-v1/blob/48d35d53ce1c517f9f0d5341871e48749644c105/idealingua-v1/idealingua-v1-runtime-rpc-http4s/src/main/scala-3/izumi/idealingua/runtime/rpc/http4s/package.scala#L10-L15 but they do not exist in the latest version of the library.
* 1 library used to have 1 `&`-type extractor (which "worked" who knows how?):
  https://github.com/Katrix/perspective/blob/f1643ac7a4e6a0d8b43546bf7b9e6219cc680dde/dotty/derivation/src/main/scala/perspective/derivation/Helpers.scala#L15-L18
  but the author already accepted a change with a workaround at
  https://github.com/Katrix/perspective/pull/1
* 1 library has 3 occurrences of using an abstract type constructor too "concretely":
  https://github.com/kory33/s2mc-test/blob/d27c6e85ad292f8a96d7d51af7ddc87518915149/protocol-core/src/main/scala/io/github/kory33/s2mctest/core/generic/compiletime/Tuple.scala#L16
  defined at https://github.com/kory33/s2mc-test/blob/d27c6e85ad292f8a96d7d51af7ddc87518915149/protocol-core/src/main/scala/io/github/kory33/s2mctest/core/generic/compiletime/Generic.scala#L12
  It could be replaced by a concrete `class Lock[A](phantom: A)` instead.

All the existing use cases therefore have either already disappeared or have a workaround.

### Other concerns

Ideally, this proposal would be first implemented as *warnings* about illegal cases, and only later made errors.
Unfortunately, the presence of the abstract type constructor case makes that impossible.
Indeed, because of it, a pattern that is legal at definition site may become illegal after some later substitution.

Consider for example the standard library's very own `Tuple.InverseMap`:

```scala
/** Converts a tuple `(F[T1], ..., F[Tn])` to `(T1,  ... Tn)` */
type InverseMap[X <: Tuple, F[_]] <: Tuple = X match {
  case F[x] *: t => x *: InverseMap[t, F]
  case EmptyTuple => EmptyTuple
}
```

If we instantiate `InverseMap` with a class type parameter, such as `InverseMap[X, List]`, the first case gets instantiated to
```scala
case List[x] *: t => x *: InverseMap[t, List]
```
which is legal.

However, nothing prevents us a priori to instantiate `InverseMap` with an illegal type constructor, for example
```scala
type IsSeq[t <: Seq[Any]] = t
InverseMap[X, IsSeq]
```
which gives
```scala
case IsSeq[x] *: t => x *: InverseMap[t, IsSeq]
```

These instantiatiations happen deep inside the type checker, during type computations.
Since types are cached, shared and reused in several parts of the program, by construction, we do not have any source code position information at that point.
That means that we cannot report *warnings*.

We can in fact report *errors* by reducing to a so-called `ErrorType`, which is aggressively propagated.
This is what we do in the proposed implementation (unless using `-source:3.3`).

### Open questions

None at this point.

## Alternatives

The specification is more complicated than we initially wanted.
At the beginning, we were hoping that we could restrict match cases to class type constructors only.
The quantitative study however revealed that we had to introduce support for abstract type constructors and for type member extractors.

As already mentioned, the standard library itself contains an occurrence of an abstract type constructor in a pattern.
If we made that an error, we would have a breaking change to the standard library itself.
Some existing libraries would not be able to retypecheck again.
Worse, it might not be possible for them to change their code in a way that preserves their own public APIs.

We tried to restrict abstract type constructors to never match on their own.
Instead, we wanted them to stay "stuck" until they could be instantiated to a concrete type constructor.
However, that led some existing tests to fail even for match types that were declared legal, because they did not reduce anymore in some places where they reduced before.

Type member extractors are our biggest pain point.
Their specification is complicated, and the implementation as well.
Our quantitative study showed that they were however used at least somewhat often (10 occurrences spread over 4 libraries).
In each case, they seem to be a way to express what Scala 2 type projections (`A#T`) could express.
While not quite as powerful as type projections (which were shown to be unsound), match types with type member extractors delay things enough for actual use cases to be meaningful.

As far as we know, those use cases have no workaround if we make type member extractors illegal.

## Related work

Notable prior work related to this proposal includes:

- [Current reference page for Scala 3 match types](https://dotty.epfl.ch/docs/reference/new-types/match-types.html)
- [Abstractions for Type-Level Programming](https://infoscience.epfl.ch/record/294024), Olivier Blanvillain, Chapter 4 (Match Types)
- ["Pre-Sip" discussion in the Contributors forum](https://contributors.scala-lang.org/t/pre-sip-proper-specification-for-match-types/6265) (submitted at the same time as this SIP document)
- [PR with the proposed implementation](https://github.com/lampepfl/dotty/pull/18262)

## FAQ

None at this point.
