---
layout: sips
discourse: true
title: SIP-NN - Quote escapes for interpolations
---

**By: Martijn Hoekstra**

## History

| Date          | Version       |
|---------------|---------------|
| Jul 31th 2018 | Initial Draft |

## Motivation

It's not straight-forward how to have a quote character (`"`) in an
interpolation. Because parsing interpolations does not process backslash
escapes, but rather passes the raw string to the interpolator that than has the
option to process escapes itself as it sees fit, there are no lexing rules that
process the escape, and as such, the sequence `\"` simply terminates the
interpolation, and can't be used as an escape inside an interpolation.

Interpolations have a different meta-charcter -- the `$` character -- which is
treated specially. Interpolations use this escape to splice in arguments, and it
can also be used to escape itself as the sequence `$$` to represent a literal
`$` character.

Because of its special handling during the parse, the `$` could be used to
escape a `"` character to represent a literal `"` withing a string.

## Motivating Example

{% highlight scala %}
s"A common question for scala programmers is "How can I represent a literal " character in Scala interpolations?""
{% endhighlight %}

Doesn't work.

Neither does

{% highlight scala %}
s"A common question for scala programmers is \"How can I represent a literal \" character in Scala interpolations?\""
{% endhighlight %}

### Examples

{% highlight scala %}
s"A common question for scala programmers is $"How can I represent a literal $" character in Scala interpolations?$""
{% endhighlight %}

### Comparison Examples

There are a number of ways to work around the current restriction.

The simplest is triple-quoting the interpolation:
{% highlight scala %}
s"""A common question for scala programmers is "How can I represent a literal " character in Scala interpolations?""""
{% endhighlight %}

Another common workaround is splicing in a separate string in one way or another.

{% highlight scala %}
//with a normal escape in a string in a block
s"A common question for scala programmers is ${"\""}How can I represent a literal ${"\""} character in Scala interpolations?${"\""}"
//with a quote character as a block
s"A common question for scala programmers is ${'"'}How can I represent a literal ${'"'} character in Scala interpolations?${'"'}"
//with an identifier referencing a string that contains a single quote
val quote = "\""
s"A common question for scala programmers is ${q}How can I represent a literal $q character in Scala interpolations?$q"
{% endhighlight %}

The second set of workarounds is dependent on the actual interpolator, and the
quote becomes an argument. The `s`, `f` and `raw` interpolators splice their
arguments in to the string, as is the obvious use and implementation of an
interpolator. But it's not the only possible use and implementation for an
interpolator and this way of inserting quotes may not work for any given
interpolator.

## Design

This is a non-breaking change. Currently the sequence `$"` within an
interpolation is a syntax error.

## Implementation

The implementation is simple to the point of being trivial: see
[the implementation][1] for the actual change in functonality and the rest of
that PR for the spec and test changes.

## Drawbacks

Adding this feature makes the language just a bit more irregular. There already
is some amount of irregularity around string literals and interpolations in
the language. An argument could be made that this change makes that worse rather
than better.

Because it affects parsing, this change may affect syntax highlighters. Syntax
highlighters tend to already stuggle around "funky" strings and interpolations.

## Alternatives

More ambitious proposals around interpolations are possible, and have been
propsed in different forms before. [This PR][2] in particular shows more options
around using `\` as a meta character in interpolations. It stranded somewhere
between red tape, ambition and changing processes.

I suspect the last word about interpolations hasn't been spoken, and that later
proposals may still make interpolations more regular. This proposal is
deliberately small, and intends not to be in the way of any potential further
proposals.

[1]: https://github.com/scala/scala/pull/6953/files#diff-0023b3bfa053fb16603156b785efa7ad
[2]: https://github.com/scala/scala/pull/4308 "SI-6476 Accept escaped quotes in interp strings"
