---
layout: sip
title: SIP-NN - Quote escapes for interpolations
vote-status: pending
permalink: /sips/:title.html
redirect_from: /sips/pending/interpolation-quote-escape.html
---

**By: Martijn Hoekstra**

## History

| Date          | Version               |
|---------------|-----------------------|
| Jul 31th 2018 | Initial Draft         |
| Aug 1st 2018  | Process lead comments |
| Nov 2nd 2019  | Link dotty impl       |

## Introduction

It's not straight-forward how to have a quote character (`"`) in an
interpolation. Parsing interpolations does not process backslash escapes, but
rather passes the raw string to the interpolator, which then has the option to
process escapes itself as it sees fit. That means there are no lexing rules that
process the escape, and the sequence `\"` simply terminates the interpolation.

Interpolations have a different meta-character -- the `$` character -- which is
treated specially. Interpolations use this escape to splice in arguments, and it
can also be used to escape itself as the sequence `$$` to represent a literal
`$` character.

Because of its special handling during the parse, the `$` could be used to
escape a `"` character to represent a literal `"` withing a string.

## Motivating Example

That the `"` character can't be easily escaped in interpolations has been an
open issue since at least 2012[^1], and how to deal with this issue is a 
somewhat common SO question[^2][^3]

{% highlight Scala %}
s"A common question for Scala programmers is "How can I represent a literal " character in Scala interpolations?""
{% endhighlight %}

Doesn't work.

Neither does

{% highlight Scala %}
s"A common question for Scala programmers is \"How can I represent a literal \" character in Scala interpolations?\""
{% endhighlight %}

### Examples

{% highlight Scala %}
s"A common question for Scala programmers is $"How can I represent a literal $" character in Scala interpolations?$""
{% endhighlight %}

### Comparison Examples

There are a number of ways to work around the current restriction.

The simplest is triple-quoting the interpolation:
{% highlight Scala %}
s"""A common question for Scala programmers is "How can I represent a literal " character in Scala interpolations?""""
{% endhighlight %}

Another common workaround is splicing in a separate string in one way or another.

{% highlight Scala %}
//with a normal escape in a string in a block
s"A common question for Scala programmers is ${"\""}How can I represent a literal ${"\""} character in Scala interpolations?${"\""}"
//with a quote character as a block
s"A common question for Scala programmers is ${'"'}How can I represent a literal ${'"'} character in Scala interpolations?${'"'}"
//with an identifier referencing a string that contains a single quote
val quote = "\""
s"A common question for Scala programmers is ${q}How can I represent a literal $q character in Scala interpolations?$q"
{% endhighlight %}

The second set of workarounds is dependent on the actual interpolator, and the
quote becomes an argument. The `s`, `f` and `raw` interpolators splice their
arguments in to the string, as is the obvious use and implementation of an
interpolator. But it's not the only possible use and implementation for an
interpolator and this way of inserting quotes may not work for any given
interpolator.

## Design

This is a non-breaking change. Currently the sequence `$"` within an
interpolation is a syntax error, as has already been noted[^4]
on the original ticket.

## Implementation

The implementation is simple to the point of being trivial: see
the implementation [^5] for the actual change in functionality and the rest of
that PR for the spec and test changes.

There is also an implementation for Dotty.[^7]

## Drawbacks

Adding this feature makes the language just a bit more irregular. There already
is some amount of irregularity around string literals and interpolations in
the language. An argument could be made that this change makes that worse rather
than better.

Because it affects parsing, this change may affect syntax highlighters. Syntax
highlighters tend to already struggle around "funky" strings and interpolations.

## Alternatives

More ambitious proposals around interpolations are possible, and have been
proposed in different forms before. For example, there was a PR thatshows more options
around using `\` as a meta character in interpolations[^6]. It stranded somewhere
between red tape, ambition and changing processes.

I suspect the last word about interpolations hasn't been spoken, and that later
proposals may still make interpolations more regular. This proposal is
deliberately small, and intends not to be in the way of any potential further
proposals.

[^1]: https://github.com/Scala/bug/issues/6476 "\\\" escape does not work with string interpolation"
[^2]: https://stackoverflow.com/questions/31366563/string-interpolation-escaping-quotation-mark/31366588 ""
[^3]: https://stackoverflow.com/questions/17085354/escaping-quotation-marks-in-f-string-interpolation ""
[^4]: https://github.com/scala/bug/issues/6476#issuecomment-292412577 "@retronym said: +1 to s"$"". Because it doesn't compile today, we don't risk changing the meaning of existing programs."
[^5]: https://github.com/Scala/Scala/pull/6953/files#diff-0023b3bfa053fb16603156b785efa7ad ""
[^6]: https://github.com/Scala/Scala/pull/4308 "SI-6476 Accept escaped quotes in interp strings"
[^7]: https://github.com/lampepfl/dotty/pull/7486 "PR in dotty"
