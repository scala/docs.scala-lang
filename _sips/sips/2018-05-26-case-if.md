---
layout: sips
discourse: true
title: SIP-NN - Uncluttering Abuse of Match

vote-status: new
vote-text:
permalink: /sips/:title.html
redirect_from: /sips/pending/case-if.html

---

**By: Som Snytt and A. P. Marki**

## History

| Date          | Version        |
|---------------|----------------|
| May 26th 2018 | Initial Draft  |
| May 28th 2018 | Underscoreless |

## Motivation

Since the demise of SIP-12, we have relied on Marie Kondo to declutter
what remains of our lives. But we can do better.

Currently, `case` syntax requires an underscore to represent a pattern,
even if the code of interest is the guard that follows.

Anxiety over this underscore is expressed in [a StackOverflow question][1]
in which a programmer mulls the question of "Abuse of Match" and whether
it actually makes you go blind.

We propose to go underscoreless, pace the famous consultancy.

If we can't have SIP-12 then we can have tidy syntax for `if-then` in `case` blocks.

Since `Scala <3` abhors two ways of doing a thing, we eliminate underscore
as a pattern. Underscore as a subpattern, that is, as a `pattern2`, is patterned
after placeholder syntax in expressions, just as constructor patterns are patterned
after constructor invocations. We read `C(_)` and `case C(_) =>` to mean construction
of `C` with an argument unspecified. Similarly, just as placeholder syntax is
restricted, so that an underscore is never an `Expr`, pattern syntax must disallow
underscore as a `Pattern` production.

In fact, underscore never quite functioned that way, since the definition

    val _ = 42

has always incorrectly introduced a variable named `_`.

Suggestions have surfaced that this syntax should mean something entirely different,
namely, the introduction of a freshly named variable which cannot be named in
source code, but induces the evaluation of the RHS of the definition, and which
can be accessed implicitly if defined as an implicit value.

However that may be, underscore must first be disallowed as a `Pattern`.

The only way to coherently define a `case` for which no pattern is applied is to omit
the pattern. And in the absence of alternative semantics, `val _` is not meaningful.
Underscore on the RHS of `var` definitions has already been deprecated, and it is
expected that that syntax will also be removed.

## Syntax

In lieu of

    42 match {
      case _ if now isAfter midnight => nothingGoodHappens()
      case _ => ()
    }

we write

    42 match {
      case if now isAfter midnight => nothingGoodHappens()
      case => ()
    }

The syntax accepts either a pattern with optional guard, or a guard with no pattern:

    CaseClause        ::=  ‘case’ (Pattern [Guard] | Guard) ‘=>’ Block
    Guard             ::=  ‘if’ PostfixExpr

## Further Justifications

In a respected online [forum][2] which brooks no fools, [Mulliganaceous][3] has posted
an "accepted" answer using the idiom, "in case if". This supports `case if` as
a natural locution.

In a response to one judgment about abuse of match, [one Scala user][4] whose handle I can
never spell quite right let alone pronounce finds the match version
"clearer and visually more pleasant" than the cluttered `if` expression.

From the beginning, Scala has made great strides in reducing vertical space in source code.
However, we are still constrained horizontally, despite curved OLED screens.
Recently, [a suggested edit][5] was declined because of maximum line length restrictions.
Every wasted character brings us closer to an unfortunate line break.

## Implementation

An implementation is [available][6]. It's pretty slick.

## References

1. [Abuse of Match?][1]
2. [Reputation requirements for creating tags and tag synonyms][2]
3. [Mulliganaceous user profile][3]
4. [huynhjl user profile][4]
5. [Sample line length limitation in a Scala project][5]
6. [Implementation][6]

[1]: https://stackoverflow.com/questions/12556236/abuse-of-match "Abuse of Match?"
[2]: https://meta.stackoverflow.com/a/368537/1296806 "Reputation requirements for creating tags and tag synonyms"
[3]: https://meta.stackoverflow.com/users/8242447/mulliganaceous "Mulliganaceous"
[4]: https://stackoverflow.com/users/257449/huynhjl "huynhjl"
[5]: https://github.com/apache/spark/pull/21369/files#r189794046 "scala-style enforces a max of 100 chars per line"
[6]: https://github.com/scala/scala/pull/6241 "Implementation PR 6241"

