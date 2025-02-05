---
layout: style-guide
title: Files
partof: style
overview-name: Style Guide
num: 9
previous-page: method-invocation
next-page: scaladoc
---

As a rule, files should contain a *single* class, trait or object. One exception to this
guideline is for classes or traits which have companion objects.
Companion objects should be grouped with their corresponding class or
trait in the same file. These files should be named according to the
class, trait or object they contain:

{% tabs files_1 class=tabs-scala-version%}
{% tab 'Scala 2' for=files_1 %}
```scala
package com.novell.coolness

class Inbox { ... }

// companion object
object Inbox { ... }
```
{% endtab %}
{% tab 'Scala 3' for=files_1 %}
```scala
package com.novell.coolness

class Inbox:
  ...

// companion object
object Inbox:
  ...
```
{% endtab %}
{% endtabs %}

These compilation units should be placed within a file named
`Inbox.scala` within the `com/novell/coolness` directory. In short, the
Java file naming and positioning conventions should be preferred,
despite the fact that Scala allows for greater flexibility in this
regard.

## Multi-Unit Files

Despite what was said above, there are some important situations which
warrant the inclusion of multiple compilation units within a single
file. One common example is that of a sealed trait and several
sub-classes (often emulating the ADT language feature available in
functional languages):

{% tabs files_2 %}
{% tab 'Scala 2 and 3' for=files_2 %}
```scala
sealed trait Option[+A]

case class Some[A](a: A) extends Option[A]

case object None extends Option[Nothing]
```
{% endtab %}
{% endtabs %}

Because of the nature of sealed superclasses (and traits), all subtypes
*must* be included in the same file. Thus, such a situation definitely
qualifies as an instance where the preference for single-unit files
should be ignored.

Another case is when multiple classes logically form a single, cohesive
group, sharing concepts to the point where maintenance is greatly served
by containing them within a single file. These situations are harder to
predict than the aforementioned sealed supertype exception. Generally
speaking, if it is *easier* to perform long-term maintenance and
development on several units in a single file rather than spread across
multiple, then such an organizational strategy should be preferred for
these classes. However, keep in mind that when multiple units are
contained within a single file, it is often more difficult to find
specific units when it comes time to make changes.

**All multi-unit files should be given camelCase names with a lower-case
first letter.** This is a very important convention. It differentiates
multi- from single-unit files, greatly easing the process of finding
declarations. These filenames may be based upon a significant type which
they contain (e.g. `option.scala` for the example above), or may be
descriptive of the logical property shared by all units within (e.g.
`ast.scala`).
