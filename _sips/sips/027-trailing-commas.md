---
layout: sip
number: 27
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
  - /sips/pending/trailing-commas.html
stage: completed
status: shipped
title: Trailing Commas
---

> This proposal has been shipped in Scala 2.12.2.

**By: Dale Wijnand**

## History

| Date           | Version                                                    |
| ---------------|------------------------------------------------------------|
| Jun 25th 2016  | Initial Draft ([#533][])                                   |
| Jun 27th 2016  | New drawback: changing existing tools ([#533][])           |
| Jun 27th 2016  | New motivation: simplifies codegen ([#533][])              |
| Aug 10th 2016  | SIP numbered: Renamed to SIP-27 ([#533][])                 |
| Aug 10th 2016  | Changed scala-commas URL (repo was moved) ([#533][])       |
| Aug 10th 2016  | Dialed back some of the language ([#533][])                |
| Sep 04th 2016  | Split the motivation into sections ([#533][])              |
| Sep 04th 2016  | New motivation: VCS authorship attribution ([#533][])      |
| Sep 04th 2016  | New drawback: Cross building hinderance ([#533][])         |
| Sep 12th 2016  | Remove cross building hinderance from drawbacks ([#533][]) |
| Nov 12th 2016  | Major rework: multi-line, 2 variants & spec ([#625][])     |
| Mar 14th 2017  | Final rework: multi-line, scanner level ([#731][])         |

## Motivation

### Ease of modification

When using a comma-separated sequence of elements on multiple lines, such as:

{% highlight scala %}
Seq(
  foo,
  bar,
  baz
)
{% endhighlight %}

It is inconvenient to remove or comment out elements because the last element mustn't have a trailing comma:

{% highlight scala %}
Seq(
  foo,
  bar,
//  baz
)       // error: illegal start of simple expression
{% endhighlight %}

It is also inconvenient to reorder because every element but the last one must be followed by a comma:

{% highlight scala %}
val xs = Seq(
  foo,
  baz
  bar,
)       // error: illegal start of simple expression
{% endhighlight %}

### Diff noise reduction

Adding and removing commas also introduces unnecessary noise in diffs:

{% highlight diff %}
@@ -4,7 +4,8 @@
 Seq(
   foo,
   bar,
-  baz
+  baz,
+  quux
 )
{% endhighlight %}

### VCS authorship attribution

Adding and removing commas also unnecessarily changed the authorship of the line:

~~~
^199861c (Alice Doe 2016-12-20 10:20:05 +0000 1) Seq(
^199861c (Alice Doe 2016-12-20 10:20:05 +0000 2)   foo,
^199861c (Alice Doe 2016-12-20 10:20:05 +0000 3)   bar,
66dddcc3 (Bob Doe   2017-01-10 11:45:10 +0000 4)   baz,
66dddcc3 (Bob Doe   2017-01-10 11:45:10 +0000 5)   quux
^199861c (Alice Doe 2016-12-20 10:20:05 +0000 6) )
~~~

### Simplify code generation

Allowing trailing commas would also simplify generating Scala source code.

### Long standing ticket

([SI-4986][]) was opened in 2011 requesting support for trailing commas, referencing that it facilitates code generation by tools and allows easier sorting of values. It was initially in the context of import selectors but later also for other constructs in the syntax.

### Real-world use-cases

Some real-world use-cases where elements of a sequence are typically added, removed or moved are:

* invoking constructors or methods (such as `apply` or `copy`) which present a lot of options defined with default values
* `settings(...)` arguments or elements of `libraryDependencies`, `scalacOptions` or `javaOptions` sequences in sbt

## Design Decisions

### Multi-line

It is not the intent of introducing trailing commas to promote a code style such as:

{% highlight scala %}
val xs = Seq(foo, baz, bar, )
{% endhighlight %}

for a number of reasons:

1. Subjectively, it's an ugly style.
2. Some people utilise commas as a mechanism for counting, so introducing an optional trailing commas interferes with this technique; when elements are one by line, then line-counting can be used.
3. Adding or removing elements is less cumbersome on one line.
4. Commenting out elements isn't any less cumbersome with an optional trailing comma.

Trailing comma support is therefore restricted to only comma-separated elements that are on separate lines:

{% highlight scala %}
val xs = Seq(
  foo,
  baz,
  bar,
)
{% endhighlight %}

### What parts of the Scala grammar to change

There are a number of different parts of the Scala grammar that are comma-separated and, therefore, could support trailing commas. Specifically:

* `ArgumentExprs`
* `Params` and `ClassParams`
* `SimpleExpr1`
* `TypeArgs`, `TypeParamClause` and `FunTypeParamClause`
* `SimpleType` and `FunctionArgTypes`
* `SimplePattern`
* `ImportSelectors`
* `Import`
* `Bindings`
* `ids`, `ValDcl`, `VarDcl`, `VarDef` and `PatDef`

Following Dr. Martin Odersky's suggestion, the proposal is that trailing commas are only supported in comma-separated elements that are enclosed by parentheses, square brackets or curly braces (`)`, `]`, and `}`, respectively).

## Implementation

As such, the suggested implementation would be a Scanner-level implementation, in which newlines and the closing delimiters are taken into account.

Such an implementation can be found at [scala/scala#5245][].

## Drawbacks/Trade-offs

One drawback, or trade-off, to this change is that it adds an alternative way in which it is possible to do something in Scala. But I believe that the pragmatic advantage of being able to have trailing commas is worth this drawback.

Another drawback, given this is a change in syntax, is that it requires changing the existing tools, such as those that parse Scala: intellij-scala, scalariform, scala.meta and scalaparse.

## Alternatives

As an alternative to changing the language, there already exists today a compiler plugin called [scala-commas][] that provides a variant of this feature. It also provides some evidence that people would even use unsupported compiler apis and reflection to add this functionality, even when such a plugin won't compose with other plugins well, though arguably only weak evidence as it's a young and obscure plugin.

## References

1. [SI-4986][]
2. [scala/scala#5245][]
3. [scala-commas][]

[SI-4986]: https://issues.scala-lang.org/browse/SI-4986
[scala/scala#5245]: https://github.com/scala/scala/pull/5245
[scala-commas]: https://github.com/47deg/scala-commas
[#533]: https://github.com/scala/docs.scala-lang/pull/533
[#625]: https://github.com/scala/docs.scala-lang/pull/625
[#731]: https://github.com/scala/docs.scala-lang/pull/731
