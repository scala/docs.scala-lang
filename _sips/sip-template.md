---
layout: sips
discourse: true
title: SIP-NN - SIP Title
---

**By: Author 1 and Author 2 and Author 3**

This document is provided as a template to get you started. Feel free to add, augment,
remove, restructure and otherwise adapt the structure for what you need after cloning it.
The cloned document should be placed in sips/pending/_posts according to the naming
conventions described in the [SIP tutorial](./sip-tutorial.html).

## History

| Date          | Version       |
|---------------|---------------|
| Feb 19th 2015 | Initial Draft |
| Feb 20th 2015 | Alteration Details |

## Introduction/Motivation/Abstract

(feel free to rename this section to Introduction, Motivation, Abstract, whatever best suits
  your library proposal.)

A high level overview of the library with:

* Description of the scope/features of the library.
* An explanation of the reason the library is needed, what's missing in the core libs
  that is supplied.
* Simple code examples if they help clarify, note that there will be ample opportunity
  for more detailed code examples later in the SIP

Think of the introduction as serving to describe the library addition in a way
that lets a reader decide if this is what they are looking for, whether they think
this is the right approach to supply the extra functionality, and whether they might
want to get involved.

## Motivating Examples

### Examples

Code heavy description of how the library functionality can be used.

{% highlight scala %}
// here is some example scala code, highlighted nicely
import scala.concurrent._

class Foo extends Bar {
  val x = 10
  def yo(name: String): String = s"hello $name"
}
{% endhighlight %}

### Comparison Examples

Code demonstrating why the library is needed, how equivalent functionality
might be provided without it.

### Counter-Examples

What the library is not intended to be used for. Examples of what to avoid and
why.

## Design

Discuss design decisions (including, as examples):

* Reason about correctness of the implementation.
* "Feel and fit" with existing core libraries.
* Performance and threading considerations.
* Naming of classes, traits, methods.
* Footprint of API.
* Potential conflicts with existing libraries, e.g. name clashes, IDE auto-import friction, etc.

## Implementation

Include consideration of the following:

* Is this library intended to be bundled with the current core libs, or (recommended) live in
a separate module distributed with the core distribution of Scala
(e.g. parser combinators, reflection, etc.)
* **Existing implementation(s)** (e.g. donor library, github project, etc.). Note that
having an existing implementation library from which this will be drawn, and that people
can download and try now, is highly recommended.
* Time frame, target Scala version for inclusion.
* Roll-out plan (start with external module, include in std distribution, move to core).
* Other volunteers/contributors (with areas of expertise, github contact info, etc.)

## Counter-Examples

What the library is not intended to be used for. Examples of what to avoid and
why.

## Drawbacks

Why should we *not* do this. Be honest, these questions will come out during the
process anyway so it's better to get them out up front.

## Alternatives

* What other possibilities have been examined?
* What is the impact of not implementing this proposal?

## References

1. [Existing (Donor) Project][1]
2. [API Documentation][2]
3. [Academic/Research papers/supporting material][3]
4. [Alternative Libraries/Implementations][4]
5. [Discussion forum/post/gitter/IRC][5]

[1]: http://github.com "GitHub"
[2]: http://www.scala-lang.org/api/ "Scaladoc"
[3]: http://en.wikipedia.org/wiki/Academic_publishing "Academic/Research"
[4]: https://github.com/dogescript/dogescript "Alternatives"
[5]: https://gitter.im "Gitter"
