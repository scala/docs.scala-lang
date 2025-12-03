---
layout: sip
number: 60
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
presip-thread: https://contributors.scala-lang.org/t/pre-sip-bind-variables-for-alternative-patterns/6321/13
stage: implementation
status: waiting-for-implementation
title: Bind variables within alternative patterns
---

**By: Yilin Wei**

## History

| Date          | Version            |
|---------------|--------------------|
| Sep 17th 2023 | Initial Draft      |
| Jan 16th 2024 | Amendments         |

## Summary

Pattern matching is one of the most commonly used features in Scala by beginners and experts alike. Most of
the features of pattern matching compose beautifully — for example, a user who learns about bind variables
and guard patterns can mix the two features intuitively.

One of the few outstanding cases where this is untrue, is when mixing bind variables and alternative patterns. The part of
current [specification](https://scala-lang.org/files/archive/spec/2.13/08-pattern-matching.html) which we are concerned with is under section **8.1.12** and is copied below, with the relevant clause
highlighted.

> … All alternative patterns are type checked with the expected type of the pattern. **They may not bind variables other than wildcards**. The alternative …

We propose that this restriction be lifted and this corner case be eliminated.

Removing the corner case would make the language easier to teach, reduce friction and allow users to express intent in a more natural manner.

## Motivation

## Scenario

The following scenario is shamelessly stolen from [PEP 636](https://peps.python.org/pep-0636), which introduces pattern matching to the
Python language.

Suppose a user is writing classic text adventure game such as [Zork](https://en.wikipedia.org/wiki/Zork). For readers unfamiliar with
text adventure games, the player typically enters freeform text into the terminal in the form of commands to interact with the game
world. Examples of commands might be `"pick up rabbit"` or `"open door"`.

Typically, the commands are tokenized and parsed. After a parsing stage we may end up with a encoding which is similar to the following:

```scala
enum Word
  case Get, North, Go, Pick, Up
  case Item(name: String)

  case class Command(words: List[Word])
```

In this encoding, the string `pick up jar`, would be parsed as `Command(List(Pick, Up, Item("jar")))`.

Once the command is parsed, we want to actually *do* something with the command. With this particular encoding,
we would naturally reach for a pattern match — in the simplest case, we could get away with a single recursive function for
our whole program.

Suppose we take the simplest example where we want to match on a command like `"north"`. The pattern match consists of
matching on a single stable identifier, `North` and the code would look like this:

~~~ scala
import Command.*

def loop(cmd: Command): Unit =
  cmd match
    case Command(North :: Nil) => // Code for going north
~~~

However as we begin play-testing the actual text adventure, we observe that users type `"go north"`. We decide
our program should treat the two distinct commands as synonyms. At this point we would reach for an alternative pattern `|` and
refactor the code like so:

~~~ scala
  case Command(North :: Nil | Go :: North :: Nil) => // Code for going north
~~~

This clearly expresses our intent that the two commands map to the same underlying logic.

Later we decide that we want more complex logic in our game; perhaps allowing the user to pick up
items with a command like `pick up jar`. We would then extend our function with another case, binding the variable `name`:

~~~ scala
  case Command(Pick :: Up :: Item(name) :: Nil) => // Code for picking up items
~~~

Again, we might realise through our play-testing that users type `get` as a synonym for `pick up`. After playing around
with alternative patterns, we may reasonably write something like:

~~~ scala
  case Command(Pick :: Up :: Item(name) :: Nil | Get :: Item(name) :: Nil) => // Code for picking up items
~~~

Unfortunately at this point, we are stopped in our tracks by the compiler. The bind variable for `name` cannot be used in conjunction with alternative patterns.
We must either choose a different encoding. We carefully consult the specification and that this is not possible.

We can, of course, work around it by hoisting the logic to a helper function to the nearest scope which function definitions:

~~~ scala
def loop(cmd: Cmd): Unit =
  def pickUp(item: String): Unit = // Code for picking up item
    cmd match
      case Command(Pick :: Up :: Item(name)) => pickUp(name)
      case Command(Get :: Item(name)) => pickUp(name)
~~~

Or any number of different encodings. However, all of them are less intuitive and less obvious than the code we tried to write.

## Commentary

Removing the restriction leads to more obvious encodings in the case of alternative patterns. Arguably, the language
would be simpler and easier to teach — we do not have to remember that bind patterns and alternatives
do not mix and need to teach newcomers the workarounds.

For languages which have pattern matching, a significant number also support the same feature. Languages such as [Rust](https://github.com/rust-lang/reference/pull/957) and [Python](https://peps.python.org/pep-0636/#or-patterns) have
supported it for some time. While
this is not a great reason for Scala to do the same, having the feature exist in other languages means that users
that are more likely to expect the feature.

A smaller benefit for existing users, is that removing the corner case leads to code which is
easier to review; the absolute code difference between adding a bind variable within an alternative versus switching to a different
encoding entirely is smaller and conveys the intent of such changesets better.

It is acknowledged, however, that such cases where we share the same logic with an alternative branches are relatively rare compared to
the usage of pattern matching in general. The current restrictions are not too arduous to workaround for experienced practitioners, which
can be inferred from the relatively low number of comments from the original [issue](https://github.com/scala/bug/issues/182) first raised in 2007.

To summarize, the main arguments for the proposal are to make the language more consistent, simpler and easier to teach. The arguments
against a change are that it will be low impact for the majority of existing users.

## Proposed solution

Removing the alternative restriction means that we need to specify some additional constraints. Intuitively, we
need to consider the restrictions on variable bindings within each alternative branch, as well as the types inferred
for each binding within the scope of the pattern.

## Bindings

The simplest case of mixing an alternative pattern and bind variables, is where we have two `UnApply` methods, with
a single alternative pattern. For now, we specifically only consider the case where each bind variable is of the same
type, like so:

~~~ scala
enum Foo:
  case Bar(x: Int)
  case Baz(y: Int)

  def fun = this match
    case Bar(z) | Baz(z) => ... // z: Int
~~~

For the expression to make sense with the current semantics around pattern matches, `z` must be defined in both branches; otherwise the
case body would be nonsensical if `z` was referenced within it (see [missing variables](#missing-variables) for a proposed alternative).

Removing the restriction would also allow recursive alternative patterns:

~~~ scala
enum Foo:
  case Bar(x: Int)
  case Baz(x: Int)

enum Qux:
  case Quux(y: Int)
  case Corge(x: Foo)

  def fun = this match
    case Quux(z) |  Corge(Bar(z) | Baz(z)) => ... // z: Int
~~~

Using an `Ident` within an `UnApply` is not the only way to introduce a binding within the pattern scope.
We also expect to be able to use an explicit binding using an `@` like this:

~~~ scala
enum Foo:
  case Bar()
  case Baz(bar: Bar)

  def fun = this match
    case Baz(x) | x @ Bar() => ... // x: Foo.Bar
~~~

## Types

We propose that the type of each variable introduced in the scope of the pattern be the least upper-bound of the type
inferred within within each branch.

~~~ scala
enum Foo:
  case Bar(x: Int)
  case Baz(y: String)

  def fun = this match
    case Bar(x) | Baz(x) => // x: Int | String
~~~

We do not expect any inference to happen between branches. For example, in the case of a GADT we would expect the second branch of
the following case to match all instances of `Bar`, regardless of the type of `A`.

~~~ scala
enum Foo[A]:
  case Bar(a: A)
  case Baz(i: Int) extends Foo[Int]

  def fun = this match
    case Baz(x) | Bar(x) => // x: Int | A
~~~

### Given bind variables

It is possible to introduce bindings to the contextual scope within a pattern match branch.

Since most bindings will be anonymous but be referred to within the branches, we expect the _types_ present in the contextual scope for each branch to be the same rather than the _names_.

~~~ scala
  case class Context()

  def run(using ctx: Context): Unit = ???

  enum Foo:
    case Bar(ctx: Context)
    case Baz(i: Int, ctx: Context)

    def fun = this match
      case Bar(given Context) | Baz(_, given Context) => run // `Context` appears in both branches
~~~

This begs the question of what to do in the case of an explicit `@` binding where the user binds a variable to the same _name_ but to different types. We can either expose a `String | Int` within the contextual scope, or simply reject the code as invalid.

~~~ scala
  enum Foo:
    case Bar(s: String)
    case Baz(i: Int)

    def fun = this match
      case Bar(x @ given String) | Baz(x @ given Int) => ???
~~~

To be consistent with the named bindings, we argue that the code should compile and a contextual variable added to the scope with the type of `String | Int`.

### Quoted patterns

[Quoted patterns](https://docs.scala-lang.org/scala3/guides/macros/quotes.html#quoted-patterns) will not be supported in this SIP and the behaviour of quoted patterns will remain the same as currently i.e. any quoted pattern appearing in an alternative pattern binding a variable or type variable will be rejected as illegal.

### Alternatives

#### Enforcing a single type for a bound variable

We could constrain the type for each bound variable within each alternative branch to be the same type. Notably, this is what languages such as Rust, which do not have sub-typing do.

However, since untagged unions are part of Scala 3 and the fact that both are represented by the `|`, it felt more natural to discard this restriction.

#### Type ascriptions in alternative branches

Another suggestion is that an _explicit_ type ascription by a user ought to be defined for all branches. For example, in the currently proposed rules, the following code would infer the return type to be `Int | A` even though the user has written the statement `id: Int`.

~~~scala
enum Foo[A]:
  case Bar[A](a: A)
  case Baz[A](a: A)

  def test = this match
    case Bar(id: Int) | Baz(id) => id
~~~

In the author's subjective opinion, it is more natural to view the alternative arms as separate branches — which would be equivalent to the function below.

~~~scala
def test = this match
  case Bar(id: Int) => id
  case Baz(id) => id
~~~

On the other hand, if it is decided that each bound variable ought to be the same type, then arguably "sharing" explicit type ascriptions across branches would reduce boilerplate.

#### Missing variables

Unlike in other languages, we could assign a type, `A | Null`, to a bind variable which is not present in all of the alternative branches. Rust, for example, is constrained by the fact that the size of a variable must be known and untagged unions do not exist.

Arguably, missing a variable entirely is more likely to be an error — the absence of a requirement for `var` declarations before assigning variables in Python means that beginners can easily assign variables to the wrong variable.

It may be, that the enforcement of having to have the same bind variables within each branch ought to be left to a linter rather thana a hard restriction within the language itself.

## Specification

We do not believe there are any syntax changes since the current specification already allows the proposed syntax.

We propose that the following clauses be added to the specification:

Let $`p_1 | \ldots | p_n`$ be an alternative pattern at an arbitrary depth within a case pattern and $`\Gamma_n`$ is the named scope associated with each alternative.

If `p_i` is a quoted pattern binding a variable or type variable, the alternative pattern is considered invalid. Otherwise, let the named variables introduced within each alternative $`p_n`$, be $`x_i \in \Gamma_n`$ and the unnamed contextual variables within each alternative have the type $`T_i \in \Gamma_n`$.

Each $`p_n`$ must introduce the same set of bindings, i.e. for each $`n`$, $`\Gamma_n`$ must have the same **named** members $`\Gamma_{n+1}`$ and the set of $`{T_0, ... T_n}`$ must be the same.

If $`X_{n,i}`$, is the type of the binding $`x_i`$ within an alternative $`p_n`$, then the consequent type, $`X_i`$, of the
variable $`x_i`$ within the pattern scope, $`\Gamma`$ is the least upper-bound of all the types $`X_{n, i}`$ associated with
the variable, $`x_i`$ within each branch.

## Compatibility

We believe the changes would be backwards compatible.

# Related Work

The language feature exists in multiple languages. Of the more popular languages, Rust added the feature in [2021](https://github.com/rust-lang/reference/pull/957) and
Python within [PEP 636](https://peps.python.org/pep-0636/#or-patterns), the pattern matching PEP in 2020. Of course, Python is untyped and Rust does not have sub-typing
but the semantics proposed are similar to this proposal.

Within Scala, the [issue](https://github.com/scala/bug/issues/182) first raised in 2007. The author is also aware of attempts to fix this issue by [Lionel Parreaux](https://github.com/dotty-staging/dotty/compare/main...LPTK:dotty:vars-in-pat-alts) and the associated [feature request](https://github.com/lampepfl/dotty-feature-requests/issues/12) which
was not submitted to the main dotty repository.

The associated [thread](https://contributors.scala-lang.org/t/pre-sip-bind-variables-for-alternative-patterns/6321) has some extra discussion around semantics. Historically, there have been multiple similar suggestions — in [2023](https://contributors.scala-lang.org/t/qol-sound-binding-in-pattern-alternatives/6226) by Quentin Bernet and in [2021](https://contributors.scala-lang.org/t/could-it-be-possible-to-allow-variable-binging-in-patmat-alternatives-for-scala-3-x/5235) by Alexey Shuksto.

## Implementation

The author has a current in-progress implementation focused on the typer which compiles the examples with the expected types. Interested
 parties are welcome to see the WIP [here](https://github.com/lampepfl/dotty/compare/main...yilinwei:dotty:main).

### Further work

#### Quoted patterns

More investigation is needed to see how quoted patterns with bind variables in alternative patterns could be supported.

## Acknowledgements

Many thanks to **Zainab Ali** for proof-reading the draft, **Nicolas Stucki** and **Guillaume Martres** for their pointers on the dotty
compiler codebase.
