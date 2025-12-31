---
layout: sip
number: 44
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
stage: completed
status: shipped
title: Fewer Braces
---

**By: Martin Odersky**

## History

| Date           | Version            |
|----------------|--------------------|
| July 1st 2022  | Initial Draft      |
| July 21st 2022 | Expanded Other Conerns Section |

## Summary

The current state of Scala 3 makes braces optional around blocks and template definitions (i.e. bodies of classes, objects, traits, enums, or givens). This SIP proposes to allow optional braces also for function arguments.
The advantages of doing so is that the language feels more systematic, and programs become typographically cleaner.
The changes have been implemented and and made available under the language import `language.experimental.fewerBraces`. The proposal here is to make them available without a language import instead.


## Motivation

After extensive experience with the current indentation rules I conclude that they are overall a big success.
However, they still feel incomplete and a bit unsystematic since we can replace `{...}` in the majority of situations, but there are also important classes of situations where braces remain mandatory. In particular, braces are currently needed around blocks as function arguments.

It seems very natural to generalize the current class syntax indentation syntax to function arguments. In both cases, an indentation block is started by a colon at the end of a line. Doing so will bring two major benefits:

 - Better _consistency_, since we avoid the situation where braces are sometimes optional and in other places mandatory.
 - Better _readability_ in many common use cases, similar to why current
   optional braces lead to better readability.

## Proposed solution

The proposed solution is described in detail in https://dotty.epfl.ch/docs/reference/other-new-features/indentation.html#variant-indentation-marker--for-arguments. I inline the relevant sections here:

First, here is the spec for colons at ends of lines for template bodies. This is part of official Scala 3. I cited it here for context.

> A template body can alternatively consist of a colon followed by one or more indented statements. To this purpose we introduce a new `<colon>` token that reads as
the standard colon "`:`" but is generated instead of it where `<colon>`
is legal according to the context free syntax, but only if the previous token
is an alphanumeric identifier, a backticked identifier, or one of the tokens `this`, `super`, "`)`", and "`]`".

> An indentation region can start after a `<colon>`. A template body may be either enclosed in braces, or it may start with
`<colon> <indent>` and end with `<outdent>`.
Analogous rules apply for enum bodies, type refinements, and local packages containing nested definitions.

Generally, the possible indentation regions coincide with those regions where braces `{...}` are also legal, no matter whether the braces enclose an expression or a set of definitions. There is so far one exception, though: Arguments to functions can be enclosed in braces but they cannot be simply indented instead. Making indentation always significant for function arguments would be too restrictive and fragile.

To allow such arguments to be written without braces, a variant of the indentation scheme is implemented under language import
```scala
import language.experimental.fewerBraces
```
This SIP proposes to make this variant the default, so no language import is needed to enable it.
In this variant, a `<colon>` token is also recognized where function argument would be expected. Examples:

```scala
times(10):
  println("ah")
  println("ha")
```

or

```scala
credentials `++`:
  val file = Path.userHome / ".credentials"
  if file.exists
  then Seq(Credentials(file))
  else Seq()
```

or

```scala
xs.map:
  x =>
    val y = x - 1
    y * y
```
What's more, a `:` in these settings can also be followed on the same line by the parameter part and arrow of a lambda. So the last example could be compressed to this:

```scala
xs.map: x =>
  val y = x - 1
  y * y
```
and the following would also be legal:
```scala
xs.foldLeft(0): (x, y) =>
  x + y
```

The grammar changes for this variant are as follows.

```
SimpleExpr       ::=  ...
                   |  SimpleExpr ColonArgument
InfixExpr        ::=  ...
                   |  InfixExpr id ColonArgument
ColonArgument    ::=  colon [LambdaStart]
                      indent (CaseClauses | Block) outdent
LambdaStart      ::=  FunParams (‘=>’ | ‘?=>’)
                   |  HkTypeParamClause ‘=>’
```
## Compatibility

The proposed solution changes the meaning of the following code fragments:
```scala
  val x = y:
    Int

  val y = (xs.map: (Int => Int) =>
    Int)
```
In the first case, we have a type ascription where the type comes after the `:`. In the second case, we have
a type ascription in parentheses where the ascribing function type is split by a newline. Note that we have not found examples like this in the dotty codebase or in the community build. We verified this by compiling everything with success with `fewerBraces` enabled. So we conclude that incompatibilities like these would be very rare.
If there would be code using these idioms, it can be rewritten quite simply to avoid the problem. For instance, the following fragments would be legal (among many other possible variations):
```scala
  val x = y
    : Int

  val y = (xs.map: (Int => Int)
    => Int)
```

## Other concerns

### Tooling

Since this affects parsing, the scalameta parser and any other parser used in an IDE will also need to be updated. The necessary changes to the Scala 3 parser were made here: https://github.com/lampepfl/dotty/pull/15273/commits. The commit that embodies the core change set is here: https://github.com/lampepfl/dotty/pull/15273/commits/421bdd660b0456c2ff1ae386f032c41bb1e0212a.

### Handling Edge Cases

The design intentionally does not allow `:` to be placed after an infix operator or after a previous indented argument. This is a consequence of the following clause in the spec above:

> To this purpose we introduce a new `<colon>` token that reads as
the standard colon "`:`" but is generated instead of it where `<colon>`
is legal according to the context free syntax, but only if the previous token
is an alphanumeric identifier, a backticked identifier, or one of the tokens `this`, `super`, "`)`", and "`]`".

This was done to prevent hard-to-decypher symbol salad as in the following cases: (1)
```scala
a < b || :  // illegal
  val x = f(c)
  x > 0
```
or (2)
```scala
source --> : x =>  // illegal
 val y = x * x
 println(y)
```
or (3)
```scala
xo.fold:
  defaultValue
:  // illegal
  x => f(x)
```
or (4)
```scala
xs.groupMapReduce: item =>
  key(item)
: item =>  // illegal
  value(item)
: (value1, value2) =>  // illegal
  reduce(value1, value2)
```

I argue that the language already provides mechanisms to express these examples without having to resort to braces. (Aside: I don't think that resorting to braces occasionally is a bad thing, but some people argue that it is, so it's good to have alternatives). Basically, we have three options

 - Use parentheses.
 - Use an explicit `apply` method call.
 - Use a `locally` call.

Here is how the examples above can be rewritten so that they are legal but still don't use braces:

For (1), use `locally`:
```scala
a < b || locally:
  val x = f(c)
  x > 0
```
For (2), use parentheses:
```scala
source --> ( x =>
  val y = x * x
  println(y)
)
```
For (3) and (4), use `apply`:
```scala
xo.fold:
  defaultValue
.apply:
  x => f(x)

xs.groupMapReduce: item =>
  key(item)
.apply: item =>
  value(item)
.apply: (value1, value2) =>
  reduce(value1, value2)
```
**Note 1:** I don't argue that this syntax is _more readable_ than braces, just that it is reasonable. The goal of this SIP is to have the nicer syntax for
all common cases and to not be atrocious for edge cases. I think this
goal is achieved by the presented design.

**Note 2:** The Scala compiler should add a peephole optimization
that elides an eta expansion in front of `.apply`. E.g. the `fold` example should be compiled to the same code as `xs.fold(defaultValue)(x => f(x))`.

**Note 3:** To avoid a runtime footprint, the `locally` method should be an inline method. We can achieve that by shadowing the stdlib, or else we can decide on a different name. `nested` or `block` have been proposed. In any case this could be done in a separate step.

### Syntactic confusion with type ascription

A frequently raised concern against using `:` as an indentation marker is that it is too close to type ascription and therefore might be confusing.

However, I have seen no evidence so far that this is true in practice. Of course, one can make up examples that look ambiguous. But as outlined, the community build and the dotty code base do not contain a single case where
a type ascription is now accidentally interpreted as an argument.

Also the fact that Python chose `:` for type ascription even though it was already used as an indentation marker should give us confidence.

In well written future Scala code we can use visual keys that would tell us immediately which is which. Namely:

> If the `:` or `=>` is at the end of a line, it's an argument, otherwise it's a type ascription.

According to the current syntax, if you want a multi-line type ascription, you _cannot_ write
```scala
anExpr:
  aType
```
It _must be_ rewritten to
```scala
anExpr
  : aType
```
(But, as stated above, it seems nobody actually writes code like that).
Similarly, it is _recommended_ that you put `=>` in a multi-line function type at the start of lines instead of at the end. I.e. this code does not follow the guidelines (even though it is technically legal):
```scala
xs.map: ((x: Int) =>
  Int)
```
You should reformat it like this:
```scala
val y = xs.map: ((x: Int)
  => Int)
```
If we propose these guidelines then the only problem that remains is that if one intentionally writes confusing layout _and_ one reads only superficially then things can be confusing. But that's really nothing out of the ordinary.


## Open questions

None directly related to the SIP. As mentioned above we should decide eventually whether we should stick with `locally` or replace it by something else. But that is unrelated to the SIP proper and can be decided independently.

## Alternatives

I considered two variants:

The first variant would allow lambda parameters without preceding colons. E.g.
```scala
xs.foldLeft(z)(a, b) =>
  a + b
```
We concluded that this was visually less good since it looks too much like a function call `xs.foldLeft(z)(a, b)`.

The second variant would always require `(...)` around function types in ascriptions (which is in fact what the official syntax requires). That would have completely eliminated the second ambiguity above since
```scala
val y = (xs.map: (Int => Int) =>
    Int)
```
would then not be legal anyway. But it turned out that there were several community projects that were using function types in ascriptions without enclosing parentheses, so this change was deemed to break too much code.

@sjrd proposed in a [feature request](https://github.com/lampepfl/dotty-feature-requests/issues/299) that the `:` could be left out when
followed by `case` on the next line. Example:
```scala
    val xs = List((1, "hello"), (true, "bar"), (false, "foo"))
    val ys = xs.collect // note: no ':' here
      case (b: Boolean, s) if b => s
    println(ys)
```
This is a tradeoff between conciseness and consistency. In the interest of minimality, I would leave it out of the first version of the implementation. We can always add it later if we feel a need for it.

## Related work

 - Doc page for proposed change: https://dotty.epfl.ch/docs/reference/other-new-features/indentation.html#variant-indentation-marker--for-arguments

 - Merged PR implementing the proposal under experimental flag: https://github.com/lampepfl/dotty/pull/15273/commits/421bdd660b0456c2ff1ae386f032c41bb1e0212a

 - Latest discussion on contributors (there were several before when we discussed indentation in general): https://contributors.scala-lang.org/t/make-fewerbraces-available-outside-snapshot-releases/5024/166

## FAQ

