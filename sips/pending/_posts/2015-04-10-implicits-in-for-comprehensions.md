---
layout: sip
disqus: true
title: SIP-24 - Implicits in for comprehensions
---

**By Harold Lee**

## Motivation

This change would allow the use of `implicit` when defining new variables in for
loops and for comprehensions, for example

    for (implicit v <- e) e'

    // is equivalent to

    e.foreach { implicit v => e' }

This SIP is based on the ticket [SI-2823](https://issues.scala-lang.org/browse/SI-2823).

For comprehensions allow the declaration and definition of new variable
bindings, but do not allow those variable bindings to be marked `implicit`. When
the for comprehension computes a value and then uses that variable in later
clauses or in the body, it would allow more elegant Scala code that value can be
passed implicitly. The use of the `implicit` with the generator clauses of a for
comprehension is intuitive and mirrors other places where `implicit` is allowed.

The benefit of this enhancement is even stronger in Scala codebases which make
heavy use of for comprehensions (in the `do` syntax style of Haskell monads).
In those cases, the alternatives are ugly: break the code into several for
comprehensions or explicitly pass the implicit parameter to other methods.

We would like to write the following (where f4 and f5 have an implicit param),
and maybe there is code in the body of the `yield` that also would use
the implicit value v3:

    def f4(implicit v: T) = ...
    def f5(implicit v: T) = ...

    for {
      v1 <- f1
      v2 <- f2
      implicit v3 <- f3
      v4 <- f4
      v5 <- f5
    } yield { ... }

But instead we must write one of the following:

    // Split into 2 passes to make the value implicit
    val part1 = for {
      v1 <- f1
      v2 <- f2
      v3 <- f3
    } yield { v3 }
    part1.map { implicit v =>
      for {
        v4 <- f4
        v5 <- f5
      } yield { ... }
    }

    // Pass the implicit value explicitly
    for {
      v1 <- f1
      v2 <- f2
      v3 <- f3
      v4 <- f4(v3)
      v5 <- f5(v3)
    } yield {
      implicit val _ = v3
      ...
    }

If generators later in the for comprehension are expresions that each make
several function calls using an explicit value, such as with a DSL, then this
could make otherwise clean code very difficult to read.

## Proposal

Allow the use of the `implicit` modifier when defining new variable bindings in
a for loop or for comprehension. Such implicit values would be scoped to all
subsequent clauses in the for expression and the body of the for
loop/comprehension itself.

This applies to both generators and value definitions, thus the following would
be valid Scala:

    for (implicit p1 <- e1 ; implicit p2 = e2) [yield] e3

## Overview of the implementation strategy

For loops and for comprehensions are syntax sugar: the Scala compiler translates
these expressions into other Scala code so that the compiler backend does not
need to know how to generate code for a for loop or for comprehension. To
introduce the `implicit` modifier here we simply need to define how to desugar
for loops and comprehensions that use `implicit`. For example,

    for (implicit v <- e) e'

    // becomes

    e.foreach { implicit v => e' }

In cases where a pattern is used instead of a simple variable name, a for
comprehension expands to include a partial function with a case clause. To
support an implicit pattern, we need to introduce a fresh variable name to
temporarily hold the value before unapplying the pattern.

    for (implicit p <- e) yield e'

    // becomes

    e.map { x$1 =>
      implicit val p = x$1
      e'
    }

## Challenges

The existing Scala Language Specification defines For Comprehensions and For
Loops in a very elegant way that makes this tricky to implement in practice. The
biggest difficulty for supporting `implicit` in for comprehensions comes from
the way that Scala folds value definitions and `if` guards into the preceeding
generator clause, expanding the left-hand side of the generator into a tuple.

    for (p1 <- e1 ; p2 = e2 ; if g) ...

    // is expanded to

    for ((p1, p2) <- for (x1@p1 <- e1) yield { val x2@p2 = e2; (x1, x2) } ; if g) ...

    // is expanded to

    for ((p1, p2) <- (for (x1@p1 <- e1) yield { val x2@p2 = e2; (x1, x2) })
                       .withFilter((a0, ..., an) => g)) ...

In the above example, either `p1`, `p2` or both may be marked as implicit. If
`p1` is implicit, then it should be scoped such that it is available in
`e2`, `p2`, `g` and in the body of the for loop/comprehension. If `p2` is
implicit, then it should be scoped such that it is available in `g` and in the
body.

## Formalization

Section 6.19 of the Scala Language Specification are changed to specify the
following grammar rules for for comprehensions and for loops. Only the optional
`implicit` modifier is added (in 2 places), but all of the rules are reproduced
here for completeness.

    Expr1         ::= `for' ( `(' Enumerators `)' | `{' Enumerators `}' )
                        {nl} [`yield'] Expr
    Enumerators   ::= Generator { semi Enumerator }
    Enumerator    ::= Generator
                    | Guard
                    | [`implicit'] Pattern1 `=' Expr
    Generator     ::= [`implicit'] Pattern1 `<-' Expr [Guard]
    Guard         ::= `if' PostfixExpr

The following changes are made to the rules for desugaring for loops/comprehensions:

* A for comprehension `for ([implicit] p <- e) yield e'` is translated to
  * `e.map { case p => e' }` or, if implicit, to
  * `e.map { x => implicit val p = x ; e' }` where x is a fresh name.
* A for loop `for ([implicit] p <- e) e'` is translated to
  * `e.foreach { case p => e' }` or, if implicit, to
  * `e.foreach { x => implicit val p = x ; e' }` where x is a fresh name.
* A for comprehension
    `for ([implicit] p <- e; [implicit] p' <- e'; ...) yield e''`
  where ... is a (possibly empty) sequence of generators, definitions, or
  guards, is translated to
  * `e.flatMap { case p => for ([implicit] p' <- e' ...) yield e'' }`
  or, if the first generator `p <- e` is marked implicit, to
  * `e.flatMap { x => implicit val p = x ; for ([implicit] p' <- e'; ...) e'' }`
* A for loop `for ([implicit] p <- e; [implicit] p' <- e'; ...) e''`
  where ... is a (possibly empty) sequence of generators, definitions, or
  guards, is translated to
  * `e.foreach { case p => for ([implicit] p' <- e' ...) yield e'' }`
  or, if the first generator `p <- e` is marked implicit, to
  * `e.foreach { x => implicit val p = x ; for ([implicit] p' <- e'; ...) e'' }`
* Rule 5 is unchanged (`p <- e` followed by `if g`: fold the guard into the
  generator).
* Rule 6 is unchanged (`p <- e` followed by `p' = e'`: fold the value definition
  into the generator).
* (new) Perform **Implicit Generator Desugaring** (defined below) for these two
  cases where ... is a (possibly empty) sequence of generators, definitions, or
  guards.
  * `for (implicit p <- e; ...) [yield] e''`
  * `for (p <- e; implicit p' = e'; ...) [yield] e''`

Rules 1 and 2 have new analogs for the `implicit` modifier. This uses a pattern
variable assignment instead of a `case` clause defining a partial function, but
this will still throw the same exception if the pattern cannot be matched by the
value (`scala.MatchError`).

The changes to rules 1-4 do not change the definition of any code that does not
use the new support for `implicit`, and so these changes can not change the
behavior of Scala code valid against a version of the Scala language before this
SIP is adopted. Rules 5-6 are unchanged and can not change the behavior of
existing Scala code. Because the new rule is matched after all other rules, it
can not change the behavior of existing Scala code either.

## Implicit Generator Desugaring

Implicit generator desugaring translates a single generator (and any following
value definitions and guards) into a `flatMap`/`map`/`foreach` call in a way
that allows patterns to be marked as `implicit`. This process works by
collapsing value definitions and guards into the body of the for
loop/comprehension instead of folding them into the preceeding generator. This
is effectively a different way to desugar a for loop/comprehension that
addresses the key challenge regarding value definitions and guards described
above. A disadvantage of this approach is that it make take more time and memory
to run due to the way guards can now introduce a layer of `Option[T]` that is
then immediately flattened away. That is done in order to provide a block where
implicit values can be introduced with the correct lexical scope.

Implicit generator desugaring starts with the AST of a for loop/comprehension
which matches one of 2 cases:

    for (implicit p <- e; clauses...) [yield] e''

    for (p <- e; implicit p' = e'; clauses...) [yield] e''

In either case the first clause is a generator. We gather that generator and all
value definitions and guards that follow (which may be none of, part of or all
of the remaining clauses above) and split the rest into a nested for
loop/comprehension.

If there are no more generators in the clauses:

    for' (implicit p <- e; ...) [yield] e''

    for' (p <- e; implicit p' = e'; ...) [yield] e''

If there are more generators in the clauses:

    for' (implicit p <- e; ...)
      [yield] for (...) [yield] e''

    for' (p <- e; implicit p' = e'; ...)
      [yield] for (...) [yield] e''

The rewritten `for'` expression will contain both `yield`s or neither, and will
contain them if and only if the original `for` expression contained `yield`.

The implementation will not go the route of defining a `for'` AST node and desugaring it
separately. Instead, the `for'` code is desugared immediately via the following
rules.

For loops:

1. `for' (...; [implicit] p = e) e'` becomes `for' (...) { [implicit] val p = e ; e' }`
2. `for' (...; if g) e'` becomes `for' (...) { if (g) e' }`
3. `for' (p <- e) e'` becomes `e.foreach { case p => e' }`
4. `for' (implicit p <- e) e'` becomes `e.foreach { x => implicit val p = x; e' }`
   where x is a fresh name.

For comprehensions:

1. `for' (...; [implicit] p = e) yield e'` becomes
   `for' (...) yield { [implicit] val p = e ; e' }`
2. `for' (...; if g) yield e'` becomes
   `(for' (...) yield { if (g) Some(e') else None }).flatten`
3. `for' (p <- e) yield e'` becomes `e.flatMap/map { case p => e' }`
4. `for' (implicit p <- e) yield e'` becomes
   `e.flatMap/map { x => implicit val p = x ; e' }` where x is a fresh name.

In rules 3-4 for comprehensions, we use `map` if there were no more generators
in the original `for` expression, and `flatMap` otherwise.

Actually, the implementation will use `_.flatMap(Predef.identity)` instead of
`_.flatten` because the contract for generators requires `flatMap` but not
`flatten`. `flatten` is used above for clarity. It would be valid to optimize
this to `_.flatten` if the compiler knows that the data type leading generator
supports `flatten`, e.g. if it extends `GenTraversable`.

## Implementation

Parsers.scala is modified to parse the `implicit` keyword when parsing
generators and value definitions inside a for loop or comprehension. This is
kept as a boolean flag on the `ValFrom` or `ValEq` node in the AST for use
during desugaring.

For loop/desugaring is peformed in `mkFor` in TreeGen.scala, where the code
rules map to the Scala Language Specification rules that we are changing in the
Formalization section above. Those changes to the desugaring rules are
translated into Scala code in `mkFor`.

See the
[work-in-progress implementation](https://github.com/haroldl/scala/tree/sip24)
for details.
