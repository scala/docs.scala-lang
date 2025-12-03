---
layout: sip
number: 64
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
presip-thread: https://contributors.scala-lang.org/t/pre-sip-improve-syntax-for-context-bounds-and-givens/6576/97
stage: completed
status: shipped
title: Improve Syntax for Context Bounds and Givens
---

**By: Martin Odersky**

## History

| Date          | Version            |
|---------------|--------------------|
| March 11, 2024| Initial Draft      |
| July 18, 2024 | Revised Draft      |

## Summary

We propose some syntactic improvements that make context bounds and given clauses more
expressive and easier to read. The proposed additions and changes comprise:

 - naming context bounds, as in `A: Monoid as a`,
 - a new syntax for multiple context bounds, as in `A: {Monoid, Ord}`,
 - context bounds for type members,
 - replacing abstract givens with a more powerful and convenient mechanism,
 - a cleaner syntax for given definitions that eliminates some syntactic warts.

## Motivation

This SIP is part of an effort to get state-of-the art typeclasses and generic in Scala. It fixes several existing pain points:

 - The inability to name context bounds causes awkward and obscure workarounds in practice.
 - The syntax for multiple context bounds is not very clear or readable.
 - The existing syntax for givens is unfortunate, which hinders learning and adoption.
 - Abstract givens are hard to specify and implement and their syntax is easily confused
   with simple concrete givens.

These pain points are worth fixing on their own, independently of any other proposed improvements to typeclass support. What's more, the changes
are time sensitive since they affect existing syntax that was introduced in 3.0, so it's better to make the change at a time when not that much code using the new syntax is written yet.

## Proposed Solution

### 1. Naming Context Bounds

Context bounds are a convenient and legible abbreviation. A problem so far is that they are always anonymous, one cannot name the implicit parameter to which a context bound expands. For instance, consider the classical pair of type classes
```scala
  trait SemiGroup[A]:
    extension (x: A) def combine(y: A): A

  trait Monoid[A] extends SemiGroup[A]:
    def unit: A
```
and a `reduce` method defined like this:
```scala
def reduce[A : Monoid](xs: List[A]): A = ???
```
Since we don't have a name for the `Monoid` instance of `A`, we need to resort to `summon` in the body of `reduce`:
```scala
def reduce[A : Monoid](xs: List[A]): A =
  xs.foldLeft(summon[Monoid[A]].unit)(_ `combine` _)
```
That's generally considered too painful to write and read, hence people usually adopt one of two alternatives. Either, eschew context bounds and switch to using clauses:
```scala
def reduce[A](xs: List[A])(using m: Monoid[A]): A =
  xs.foldLeft(m.unit)(_ `combine` _)
```
Or, plan ahead and define a "trampoline" method in `Monoid`'s companion object:
```scala
  trait Monoid[A] extends SemiGroup[A]:
    def unit: A
  object Monoid:
    def unit[A](using m: Monoid[A]): A = m.unit
  ...
  def reduce[A : Monoid](xs: List[A]): A =
    xs.foldLeft(Monoid.unit)(_ `combine` _)
```
This is all accidental complexity which can be avoided by the following proposal.

**Proposal:** Allow to name a context bound, like this:
```scala
  def reduce[A : Monoid as m](xs: List[A]): A =
    xs.foldLeft(m.unit)(_ `combine` _)
```

We use `as x` after the type to bind the instance to `x`. This is analogous to import renaming, which also introduces a new name for something that comes before.

**Benefits:** The new syntax is simple and clear. It avoids the awkward choice between concise context bounds that can't be named and verbose using clauses that can.

### 2. New Syntax for Aggregate Context Bounds

Aggregate context bounds like `A : X : Y` are not obvious to read, and it becomes worse when we add names, e.g. `A : X as x : Y as y`.

**Proposal:** Allow to combine several context bounds inside `{...}`, analogous
to import clauses. Example:

```scala
  trait A:
    def showMax[X : {Ordering, Show}](x: X, y: X): String
  class B extends A:
    def showMax[X : {Ordering as ordering, Show as show}](x: X, y: X): String =
      show.asString(ordering.max(x, y))
```

The old syntax with multiple `:` should be phased out over time. There's more about migration at the end of this SIP.


### 3. Expansion of Context Bounds

With named context bounds, we need a revision to how the witness parameters of such bounds are added. Context bounds are currently translated to implicit parameters in the last parameter list of a method or class. This is a problem if a context bound is mentioned in one of the preceding parameter types. For example, consider a type class of parsers with associated type members `Input` and `Result` describing the input type on which the parsers operate and the type of results they produce:
```scala
trait Parser[P]:
  type Input
  type Result
```
Here is a method `run` that runs a parser on an input of the required type:
```scala
def run[P : Parser as p](in: p.Input): p.Result
```
With the current translation this does not work since it would be expanded to:
```scala
  def run[P](x: p.Input)(using p: Parser[P]): p.Result
```
Note that the `p` in `p.Input` refers to the `p` introduced in the using clause, which comes later. So this is ill-formed.

This problem would be fixed by changing the translation of context bounds so that they expand to using clauses immediately after the type parameter. But such a change is infeasible, for two reasons:

 1. It would be a source- and binary-incompatible change. We cannot simply change the expansion of existing using clauses because
    then clients that pass explicit using arguments would no longer work.
 2. Putting using clauses earlier can impair type inference. A type in
    a using clause can be constrained by term arguments coming before that
    clause. Moving the using clause first would miss those constraints, which could cause ambiguities in implicit search.

But there is an alternative which is feasible:

**Proposal:** Map the context bounds of a method or class as follows:

 1. If one of the bounds is referred to by its term name in a subsequent parameter clause, the context bounds are mapped to a using clause immediately preceding the first such parameter clause.
 2. Otherwise, if the last parameter clause is a using (or implicit) clause, merge all parameters arising from context bounds in front of that clause, creating a single using clause.
 3. Otherwise, let the parameters arising from context bounds form a new using clause at the end.

Rules (2) and (3) are the status quo, and match Scala 2's rules. Rule (1) is new but since context bounds so far could not be referred to, it does not apply to legacy code. Therefore, binary compatibility is maintained.

**Discussion** More refined rules could be envisaged where context bounds are spread over different using clauses so that each comes as late as possible. But it would make matters more complicated and the gain in expressiveness is not clear to me.


### 4. Context Bounds for Type Members, Deferred Givens

It's not very orthogonal to allow subtype bounds for both type parameters and abstract type members, but context bounds only for type parameters. What's more, we don't even have the fallback of an explicit using clause for type members. The only alternative is to also introduce a set of abstract givens that get implemented in each subclass. This is extremely heavyweight and opaque to newcomers.

**Proposal**: Allow context bounds for type members. Example:

```scala
  class Collection:
    type Element : Ord
```

The question is how these bounds are expanded. Context bounds on type parameters
are expanded into using clauses. But for type members this does not work, since we cannot refer to a member type of a class in a parameter type of that class. What we are after is an equivalent of using parameter clauses but represented as class members.

**Proposal:**
Introduce a new way to implement a given definition in a trait like this:
```scala
given T = deferred
```
`deferred` is a new method in the `scala.compiletime` package, which can appear only as the right hand side of a given defined in a trait. Any class implementing that trait will provide an implementation of this given. If a definition is not provided explicitly, it will be synthesized by searching for a given of type `T` in the scope of the inheriting class. Specifically, the scope in which this given will be searched is the environment of that class augmented by its parameters but not containing its members (since that would lead to recursive resolutions). If an implementation _is_ provided explicitly, it counts as an override of a concrete definition and needs an `override` modifier.

Deferred givens allow a clean implementation of context bounds in traits,
as in the following example:
```scala
trait Sorted:
  type Element : Ord

class SortedSet[A : Ord] extends Sorted:
  type Element = A
```
The compiler expands this to the following implementation.
```scala
trait Sorted:
  type Element
  given Ord[Element] = compiletime.deferred

class SortedSet[A](using evidence$0: Ord[A]) extends Sorted:
  type Element = A
  override given Ord[Element] = evidence$0
```

The using clause in class `SortedSet` provides an implementation for the deferred given in trait `Sorted`.

**Benefits:**

 - Better orthogonality, type parameters and abstract type members now accept the same kinds of bounds.
 - Better ergonomics, since deferred givens get naturally implemented in inheriting classes, no need for boilerplate to fill in definitions of abstract givens.

**Alternative:** It was suggested that we use a modifier for a deferred given instead of a `= deferred`. Something like `deferred given C[T]`. But a modifier does not suggest the concept that a deferred given will be implemented automatically in subclasses unless an explicit definition is written. In a sense, we can see `= deferred` as the invocation of a magic macro that is provided by the compiler. So from a user's point of view a given with `deferred` right hand side is not abstract.
It is a concrete definition where the compiler will provide the correct implementation. And if users want to provide their own overriding
implementations, they will need an explicit `override` modifier.

### 5. Abolish Abstract Givens

With `deferred` givens there is no need anymore to also define abstract givens. The two mechanisms are very similar, but the user experience for
deferred givens is generally more ergonomic. Abstract givens also are uncomfortably close to concrete class instances. Their syntax clashes
with the quite common case where we want to establish a given without any nested definitions. For instance, consider a given that constructs a type tag:
```scala
class Tag[T]
```
Then this works:
```scala
given Tag[String]()
given Tag[String] with {}
```
But the following more natural syntax fails:
```scala
given Tag[String]
```
The last line gives a rather cryptic error:
```
1 |given Tag[String]
  |                 ^
  |                 anonymous given cannot be abstract
```
The underlying problem is that abstract givens are very rare (and should become completely unnecessary once deferred givens are introduced), yet occupy a syntax that looks very close to the more common case of concrete
typeclasses without nested definitions.

**Proposal:** In the future, let the `= deferred` mechanism be the only way to deliver the functionality of abstract givens. Deprecate the current version of abstract givens, and remove them in a future Scala version.

**Benefits:**

 - Simplification of the language since a feature is dropped
 - Eliminate non-obvious and misleading syntax.

The only downside is that deferred givens are restricted to be used in traits, whereas abstract givens are also allowed in abstract classes. But I would be surprised if actual code relied on that difference, and such code could in any case be easily rewritten to accommodate the restriction.


### 6. Context Bounds for Polymorphic Functions

Currently, context bounds can be used in methods, but not in function types or function literals. It would be nice  propose to drop this irregularity and allow context bounds also in these places. Example:

```scala
type Comparer = [X: Ord] => (x: X, y: X) => Boolean
val less: Comparer = [X: Ord as ord] => (x: X, y: X) =>
  ord.compare(x, y) < 0
```

The expansion of such context bounds is analogous to the expansion in method types, except that instead of adding a using clause in a method, we insert a context function type.

For instance, the `type` and `val` definitions above would expand to
```scala
type Comparer = [X] => (x: X, y: X) => Ord[X] ?=> Boolean
val less: Comparer = [X] => (x: X, y: X) => (ord: Ord[X]) ?=>
  ord.compare(x, y) < 0
```

The expansion of using clauses does look inside alias types. For instance,
here is a variation of the previous example that uses a parameterized type alias:
```scala
type Cmp[X] = (x: X, y: X) => Ord[X] ?=> Boolean
type Comparer2 = [X: Ord] => Cmp[X]
```
The expansion of the right hand side of `Comparer2` expands the `Cmp[X]` alias
and then inserts the context function at the same place as what's done for `Comparer`.

### 7. Cleanup of Given Syntax

A good language syntax is like a Bach fugue: A small set of motifs is combined in a multitude of harmonic ways. Dissonances and irregularities should be avoided.

When designing Scala 3, I believe that, by and large, we achieved that goal, except in one area, which is the syntax of givens. There _are_ some glaring dissonances, as seen in this code for defining an ordering on lists:
```scala
given [A](using Ord[A]): Ord[List[A]] with
  def compare(x: List[A], y: List[A]) = ...
```
The `:` feels utterly foreign in this position. It's definitely not a type ascription, so what is its role? Just as bad is the trailing `with`. Everywhere else we use braces or trailing `:` to start a scope of nested definitions, so the need of `with` sticks out like a sore thumb.

Sometimes unconventional syntax grows on you and becomes natural after a while. But here it was unfortunately the opposite. The longer I used given definitions in this style the more awkward they felt, in particular since the rest of the language seemed so much better put together by comparison. And I believe many others agree with me on this. Since the current syntax is unnatural and esoteric, this means it's difficult to discover and very foreign even after that. This makes it much harder to learn and apply givens than it need be.

The previous conditional given syntax was inspired by method definitions. If we add the optional name to the previous example, we obtain something akin to an implicit method in Scala 2:
```scala
given listOrd[A](using Ord[A]): Ord[List[A]] with
  def compare(x: List[A], y: List[A]) = ...
```
The anonymous syntax was then obtained by simply dropping the name.
But without a name, the syntax looks weird and inconsistent.

This is a problem since at least for typeclasses, anonymous givens should be the norm.
Givens are like extends clauses. We state a _fact_, that a
type implements a type class, or that a value can be used implicitly. We don't need a name for that fact. It's analogous to extends clauses, where we state that a class is a subclass of some other class or trait. We would not think it useful to name an extends clause, it's simply a fact that is stated.
It's also telling that every other language that defines type classes uses anonymous syntax. Somehow, nobody ever found it necessary to name these instances.

A more intuitive and in my opinion cleaner alternative is to decree that a given should always look like it _implements a type_. Conditional givens should look like they implement function types. The `Ord` typeclass instances for `Int` and `List` would then look like this:
```scala
given Ord[String]:
  def compare(x: String, y: String) = ...

given [A : Ord] => Ord[List[A]]:
  def compare(x: List[A], y: List[A]) = ...
```
The second, conditional instance looks like it implements the function type
```scala
[A : Ord] => Ord[List[A]]
```
Another way to see this is as an implication:
If `A` is a type that is `Ord`, then `List[A]` is `Ord` (and the rest of the given clause gives the implementation that makes it so).
Equivalently, `A` is `Ord` _implies_ `List[A]` is `Ord`, hence the `=>`.

Yet another related meaning is that the given clause establishes a _context function_ of type `[A: Ord] ?=> Ord[List[A]]` that is automatically applied to evidence arguments of type `Ord[A]` and that yields instances of type `Ord[List[A]]`. Since givens are in any case applied automatically to all their arguments, we don't need to specify that separately with `?=>`, a simple `=>` arrow is sufficiently clear and is easier to read.

All these viewpoints are equivalent, in a deep sense. This is exactly the Curry Howard isomorphism, which equates function types and implications.

**Proposal:** Change the syntax for given clauses so that a `given` clause consists of the following elements:

 - An optional name binding `id :`
 - Zero or more _conditions_, which introduce type or value parameters. Each precondition ends in a `=>`.
 - the implemented _type_,
 - an implementation which consists of either an `=` and an expression,
   or a template body.

**Examples:**

Here is an enumeration of common forms of given definitions in the new syntax. We show the following use cases:

 1. A simple typeclass instance, such as `Ord[Int]`.
 2. A parameterized type class instance, such as `Ord` for lists.
 3. A type class instance with an explicit context parameter.
 4. A type class instance with a named eexplicit context parameter.
 4. A simple given alias.
 5. A parameterized given alias
 6. A given alias with an explicit context parameter.
 8. An abstract or deferred given
 9. A by-name given, e.g. if we have a given alias of a mutable variable, and we
    want to make sure that it gets re-evaluated on each access.
```scala
  // Simple typeclass
  given Ord[Int]:
    def compare(x: Int, y: Int) = ...

  // Parameterized typeclass with context bound
  given [A: Ord] => Ord[List[A]]:
    def compare(x: List[A], y: List[A]) = ...

  // Parameterized typeclass with context parameter
  given [A] => Ord[A] => Ord[List[A]]:
    def compare(x: List[A], y: List[A]) = ...

  // Parameterized typeclass with named context parameter
  given [A] => (ord: Ord[A]) => Ord[List[A]]:
    def compare(x: List[A], y: List[A]) = ...

  // Simple alias
  given Ord[Int] = IntOrd()

  // Parameterized alias with context bound
  given [A: Ord] => Ord[List[A]] =
    ListOrd[A]

  // Parameterized alias with context parameter
  given [A] => Ord[A] => Ord[List[A]] =
    ListOrd[A]

  // Abstract or deferred given
  given Context = deferred

  // By-name given
  given () => Context = curCtx
```
Here are the same examples, with optional names provided:
```scala
  // Simple typeclass
  given intOrd: Ord[Int]:
    def compare(x: Int, y: Int) = ...

  // Parameterized typeclass with context bound
  given listOrd: [A: Ord] => Ord[List[A]]:
    def compare(x: List[A], y: List[A]) = ...

  // Parameterized typeclass with context parameter
  given listOrd: [A] => Ord[A] => Ord[List[A]]:
    def compare(x: List[A], y: List[A]) = ...

  // Parameterized typeclass with named context parameter
  given listOrd: [A] => (ord: Ord[A]) => Ord[List[A]]:
    def compare(x: List[A], y: List[A]) = ...

  // Simple alias
  given intOrd: Ord[Int] = IntOrd()

  // Parameterized alias with context bound
  given listOrd: [A: Ord] => Ord[List[A]] =
    ListOrd[A]

  // Parameterized alias with context parameter
  given listOrd: [A] => Ord[A] => Ord[List[A]] =
    ListOrd[A]

  // Abstract or deferred given
  given context: Context = deferred

  // By-name given
  given context: () => Context = curCtx
```

**By Name Givens**

We sometimes find it necessary that a given alias is re-evaluated each time it is called. For instance, say we have a mutable variable `curCtx` and we want to define a given that returns the current value of that variable. A normal given alias will not do since by default given aliases are mapped to
lazy vals.

In general, we want to avoid re-evaluation of the given. But there are situations like the one above where we want to specify _by-name_ evaluation instead. The proposed new syntax for this is shown in the last clause above. This is arguably the a natural way to express by-name givens. We want to use a conditional given, since these map to methods, but the set of preconditions is empty, hence the `()` parameter. Equivalently, under the context function viewpoint, we are defining a context function of the form `() ?=> T`, and these are equivalent to by-name parameters.

Compare with the current best way to do achieve this, which is to use a dummy type parameter.
```scala
  given [DummySoThatItsByName]: Context = curCtx
```
This has the same effect, but feels more like a hack than a clean solution.

**Dropping `with`**

In the new syntax, all typeclass instances introduce definitions like normal
class bodies, enclosed in braces `{...}` or following a `:`. The irregular
requirement to use `with` is dropped. In retrospect, the main reason to introduce `with` was since a definition like

```scala
given [A](using Ord[A]): Ord[List[A]]:
  def compare(x: List[A], y: List[A]) = ...
```
was deemed to be too cryptic, with the double meaning of colons. But since that syntax is gone, we don't need `with` anymore. There's still a double meaning of colons, e.g. in
```scala
given intOrd: Ord[Int]:
  ...
```
but since now both uses of `:` are very familiar (type ascription _vs_ start of nested definitions), it's manageable. Besides, the problem occurs only for named typeclass instances, which should be the exceptional case anyway.


**Possible ambiguities**

If one wants to define a given for an a actual function type (which is probably not advisable in practice), one needs to enclose the function type in parentheses, i.e. `given ([A] => F[A])`. This is true in the currently implemented syntax and stays true for all discussed change proposals.

The double meaning of : with optional prefix names is resolved as usual. A : at the end of a line starts a nested definition block. If for some obscure reason one wants to define a named given on multiple lines, one has to format it as follows:
```scala
  given intOrd
    : Ord = ...
```
**Comparison with Status Quo**

To facilitate a systematic comparison, here is the listing of all 9x2 cases discussed previously with the current syntax.

Unnamed:
```scala
  // Simple typeclass
  given Ord[Int] with
    def compare(x: Int, y: Int) = ...

  // Parameterized typeclass with context bound
  given [A: Ord]: Ord[List[A]] with
    def compare(x: List[A], y: List[A]) = ...

  // Parameterized typeclass with context parameter
  given [A](using Ord[A]): Ord[List[A]] with
    def compare(x: List[A], y: List[A]) = ...

  // Parameterized typeclass with named context parameter
  given [A](using ord: Ord[A]): Ord[List[A]] with
    def compare(x: List[A], y: List[A]) = ...

  // Simple alias
  given Ord[Int] = IntOrd()

  // Parameterized alias with context bound
  given [A: Ord]: Ord[List[A]] =
    ListOrd[A]

  // Parameterized alias with context parameter
  given [A](using Ord[A]): Ord[List[A]] =
    ListOrd[A]

  // Abstract or deferred given: no unnamed form possible

  // By-name given
  given [DummySoItsByName]: Context = curCtx
```
Named:
```scala
  // Simple typeclass
  given intOrd: Ord[Int] with
    def compare(x: Int, y: Int) = ...

  // Parameterized typeclass with context bound
  given listOrd[A: Ord]: Ord[List[A]] with
    def compare(x: List[A], y: List[A]) = ...

  // Parameterized typeclass with context parameter
  given listOrd[A](using Ord[A]): Ord[List[A]] with
    def compare(x: List[A], y: List[A]) = ...

  // Parameterized typeclass with named context parameter
  given listOrd[A](using ord: Ord[A]): Ord[List[A]] with
    def compare(x: List[A], y: List[A]) = ...

  // Simple alias
  given intOrd: Ord[Int] = IntOrd()

  // Parameterized alias with context bound
  given listOrd[A: Ord]: Ord[List[A]] =
    ListOrd[A]

  // Parameterized alias with context parameter
  given listOrd[A](using Ord[A]): Ord[List[A]] =
    ListOrd[A]

  // Abstract or deferred given
  given context: Context

  // By-name given
  given context[DummySoItsByName]: Context = curCtx
```

**Summary**

This will be a fairly significant change to the given syntax. I believe there's still a possibility to do this. Not so much code has migrated to new style givens yet, and code that was written can be changed fairly easily. Specifically, there are about a 900K definitions of `implicit def`s
in Scala code on Github and about 10K definitions of `given ... with`. So about 1% of all code uses the Scala 3 syntax, which would have to be changed again.

Changing something introduced just recently in Scala 3 is not fun,
but I believe these adjustments are preferable to let bad syntax
sit there and fester. The cost of changing should be amortized by improved developer experience over time, and better syntax would also help in migrating Scala 2 style implicits to Scala 3. But we should do it quickly before a lot more code
starts migrating.

Migration to the new syntax is straightforward, and can be supported by automatic rewrites. For a transition period we can support both the old and the new syntax. It would be a good idea to backport the new given syntax to the LTS version of Scala so that code written in this version can already use it. The current LTS would then support old and new-style givens indefinitely, whereas new Scala 3.x versions would phase out the old syntax over time.


## Summary of Syntax Changes

Here is the complete context-free syntax for all proposed features.
```
TmplDef           ::=  'given' GivenDef
GivenDef          ::=  [id ':'] GivenSig
GivenSig          ::=  GivenImpl
                    |  '(' ')' '=>' GivenImpl
                    |  GivenConditional '=>' GivenSig
GivenImpl         ::=  GivenType ([‘=’ Expr] | TemplateBody)
                    |  ConstrApps TemplateBody
GivenConditional  ::=  DefTypeParamClause
                    |  DefTermParamClause
                    |  '(' FunArgTypes ')'
                    |  GivenType
GivenType         ::=  AnnotType1 {id [nl] AnnotType1}

TypeDef           ::=  id [TypeParamClause] TypeAndCtxBounds
TypeParamBounds   ::=  TypeAndCtxBounds
TypeAndCtxBounds  ::=  TypeBounds [‘:’ ContextBounds]
ContextBounds     ::=  ContextBound | '{' ContextBound {',' ContextBound} '}'
ContextBound      ::=  Type ['as' id]

FunType           ::=  FunTypeArgs (‘=>’ | ‘?=>’) Type
                    |  DefTypeParamClause '=>' Type
FunExpr           ::=  FunParams (‘=>’ | ‘?=>’) Expr
                    |  DefTypeParamClause ‘=>’ Expr
```

## Compatibility

All additions are fully compatible with existing Scala 3. The prototype implementation contains a parser that accepts both old and new idioms. That said, we would
want to deprecate and remove over time the following existing syntax:

 1. Multiple context bounds of the form `X : A : B : C`.
 2. The previous syntax for given clauses which required a `:` in front of the implemented type and a `with` after it.
 3. Abstract givens

The changes under (1) and (2) can be automated using existing rewrite technology in the compiler or Scalafix. The changes in (3) are more global in nature but are still straightforward.

## Alternatives

One alternative put forward in the Pre-SIP was to deprecate context bounds altogether and only promote using clauses. This would still be a workable system and arguably lead to a smaller language. On the other hand, dropping context bounds for using clauses worsens
some of the ergonomics of expressing type classes. First, it is longer. Second, it separates the introduction of a type name and the constraints on that type name. Typically, there can be many normal parameters between a type parameter and the using clause that characterized it. By contrast, context bounds follow the
general principle that an entity should be declared together with its type, and in a very concrete sense context bounds define types of types. So I think context bounds are here to stay, and improvements to the ergonomics of context bounds will be appreciated.

The Pre-SIP also contained a proposal for a default naming convention of context bounds. If no explicit `as` clause is given, the name of the witness for
`X : C` would be `X`, instead of a synthesized name as is the case now. This led to extensive discussions how to accommodate multiple context bounds.
I believe that a default naming convention for witnesses will be very beneficial in the long run, but as of today there are several possible candidate solutions, including:

 1. Use default naming for single bounds only.
 2. If there are multiple bounds, as in `X: {A, B, C}` create a synthetic companion object `X` where selections `X.m` translate into
    witness selections `A.m`, `B.m`, or `C.m`. Disallow any references to the companion that remain after that expansion.
 3. Like (2), but use the synthetic companion approach also for single bounds.
 4. Create real aggregate given objects that represent multiple bounds.

Since it is at present not clear what the best solution would be, I decided to defer the question of default names to a later SIP.

This SIP proposed originally a different syntax for givens that made use
of postfix `as name` for optional names and still followed method syntax in some elements. The 9x2 variants of the original proposal are as follows.

```scala
  // Simple typeclass
  given Ord[Int]:
    def compare(x: Int, y: Int) = ...

  // Parameterized typeclass
  given [A: Ord] => Ord[List[A]]:
    def compare(x: List[A], y: List[A]) = ...

  // Typeclass with context parameter
  given [A](using Ord[A]) => Ord[List[A]]:
    def compare(x: List[A], y: List[A]) = ...

  // Typeclass with named context parameter
  given [A](using ord: Ord[A]) => Ord[List[A]]:
    def compare(x: List[A], y: List[A]) = ...

  // Simple alias
  given Ord[Int] = IntOrd()

  // Parameterized alias
  given [A: Ord] => Ord[List[A]] =
    ListOrd[A]

  // Alias with explicit context parameter
  given [A](using Ord[A]) => Ord[List[A]] =
    ListOrd[A]

  // Abstract or deferred given
  given Context = deferred

  // By-name given
  given => Context = curCtx
```
Named:

```scala
  // Simple typeclass
  given Ord[Int] as intOrd:
    def compare(x: Int, y: Int) = ...

  // Parameterized typeclass
  given [A: Ord] => Ord[List[A]] as listOrd:
    def compare(x: List[A], y: List[A]) = ...

  // Typeclass with context parameter
  given [A](using Ord[A]) => Ord[List[A]] as listOrd:
    def compare(x: List[A], y: List[A]) = ...

  // Typeclass with named context parameter
  given [A](using ord: Ord[A]) => Ord[List[A]] as listOrd:
    def compare(x: List[A], y: List[A]) = ...

  // Simple alias
  given Ord[Int] as intOrd = IntOrd()

  // Parameterized alias
  given [A: Ord] => Ord[List[A]] as listOrd =
    ListOrd[A]

  // Alias with using clause
  given [A](using Ord[A]) => Ord[List[A]] as listOrd =
    ListOrd[A]

  // Abstract or deferred given
  given Context as context = deferred

  // By-name given
  given => Context as context = curCtx
```

The discussion on contributors raised some concerns with that original proposal. One concern was that changing to postfix `as` for optional names
would be too much of a change, in particular for simple given aliases. Another concern was that the `=>` felt unfamiliar in this place since it resembled a function type yet other syntactic elements followed method syntax. The revised proposal given here addresses these points by
going back to the usual `name:` syntax for optional names and doubling down
on function syntax to reinforce the intuition that givens implement types.


## Summary

The proposed set of changes removes awkward syntax and makes dealing with context bounds and givens a lot more regular and pleasant. In summary, the main proposed changes are:

 1. Allow to name context bounds with `as` clauses.
 2. Introduce a less cryptic syntax for multiple context bounds.
 3. Refine the rules how context bounds are expanded to account for explicit names.
 4. Allow context bounds on type members which expand to deferred givens.
 5. Drop abstract givens since they are largely redundant with deferred givens.
 6. Allow context bounds for polymorphic functions.
 7. Introduce a more regular and clearer syntax for givens.

These changes were implemented under the experimental language import
```scala
import language.experimental.modularity
```
which also covers some other prospective changes slated to be proposed  future SIPs. The new system has proven to work well and to address several fundamental issues people were having with
existing implementation techniques for type classes.

The changes proposed in this SIP are time-sensitive since we would like to correct some awkward syntax choices in Scala 3 before more code migrates to the new constructs (so far, it seems most code still uses Scala 2 style implicits, which will eventually be phased out). It is easy to migrate to the new syntax and to support both old and new for a transition period.
