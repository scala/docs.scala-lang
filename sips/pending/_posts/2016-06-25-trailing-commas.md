---
layout: sip
disqus: true
title: SIP-27 - Trailing Commas
---

# SIP-27: Trailing Commas

**By: Dale Wijnand**

## History

| Date           | Version                                      |
| ---------------|----------------------------------------------|
| Jun 25th 2016  | Initial Draft                                |
| Jun 27th 2016  | Added drawback of changing existing tools    |
| Jun 27th 2016  | Added motivation that it simplifies codegen  |
| Jun 28th 2016  | Fixed a typo                                 |
| Aug 10th 2016  | Renamed from SIP-NN to SIP-27                |
| Aug 10th 2016  | Changed scala-commas URL (repo was moved)    |
| Aug 10th 2016  | Dialed back some of the language from review |
| Sep 04th 2016  | Split the motivation into sections           |
| Sep 04th 2016  | Add VCS authorship attribution to motivation |
| Sep 04th 2016  | Add Cross building hinderance to drawbacks   |

## Motivation

### Easy to modify lists

When using a comma-separated sequence of elements on multiple lines, such as:

{% highlight scala %}
Seq(
  foo,
  bar,
  baz
)
{% endhighlight %}

It is quite inconvenient to remove or comment out any element because one has to think about the fact that the last element mustn't have a trailing comma:

{% highlight scala %}
Map(
  foo,
  bar //,
//  baz
)
{% endhighlight %}

Secondly, it is quite inconvenient to re-order the sequence, for instance if you wanted `baz` before `bar` you need to micromanage which is followed by a comma and which isn't:

{% highlight scala %}
val xs = Seq(
  foo,
  baz   // This isn't going to work
  bar,
)
{% endhighlight %}

### Reduce diff noise

Allowing trailing commas also reduces a lot of noise in diffs, such as:

{% highlight diff %}
@@ -4,7 +4,8 @@
 Map(
   foo,
   bar,
-  baz
+  baz,
+  quux
 )
{% endhighlight %}

### VCS authorship attribution

Using the example above, the authorship of the `baz` line would be preserved, instead of becoming that of the author of the `quux` line.

### Simplify code generation

Such a feature would also simplify generating Scala source code.

### Long standing ticket

There is an open ticket ([SI-4986][]) where this feature was requested, referencing the fact that it facilitates code generation by tools and allows for easier sorting of the values, initially in the context of import selectors but later also for other constructs in the syntax.

### Real-world use-cases

Some real-world use-cases where elements of a sequence are typically added, removed or moved are:

* invoking constructors or methods (such as `apply` or `copy`) which present a lot of options defined with default values
* `settings(...)` arguments or elements of `libraryDependencies`, `scalacOptions` or `javaOptions` sequences in sbt

## Design Decisions

There are a number of different elements of the Scala syntax that are comma separated, but instead of changing them all a subset of the more useful ones was chosen:

* tuples
* argument and parameter groups, including for implicits, for functions, methods and constructors
* import selectors

From the spec these are:

* SimpleExpr1, ArgumentExprs via Exprs
* ParamClause, ParamClauses via Params
* ClassParamClause, ClassParamClauses via ClassParams
* ImportSelector

The elements that have not changed are:

* ValDcl, VarDcl, VarDef via ids
* Type via FunctionArgTypes
* SimpleType, TypeArgs via Types
* Expr, ResultExpr via Bindings
* SimplePattern via Patterns
* TypeParamClause, FunTypeParamClause
* ImportExp
* PatDef

## Implementation

The implementation is a simple change to the parser, allowing for a trailing comma, for the groups detailed above, and has been proposed in [scala/scala#5245][].

## Drawbacks/Trade-offs

The drawback, or trade-off, to this change is that it adds another way in which it is possible to do something in Scala. But it is the opinion of this SIP that the pragmatic advantage of being able to have trailing commas is worth this drawback.

Given that this is a change in syntax, another drawback is that it requires changing the existing tools, such as those that parse Scala: intellij-scala, scalariform, scala.meta and scalaparse.

Another drawback is that for projects that cross build to previous versions of Scala they would have to take into account that this feature wouldn't be available for those versions (assuming this feature isn't backported).

## Alternatives

As an alternative, trailing commas support could be added universally to all the comma-separated elements of the syntax. This would mean changing more (but still only in the parser), but it would make it consistent.

As an alternative to changing the language, there already exists today a compiler plugin called [scala-commas][] that provides this feature. It also provides some evidence that people would even use unsupported compiler apis and reflection to add this functionality, even when such a plugin won't compose with other plugins well, though arguably only weak evidence as it's a young and obscure plugin.

## References

1. [SI-4986][]
2. [scala/scala#5245][]
3. [scala-commas][]

[SI-4986]: https://issues.scala-lang.org/browse/SI-4986
[scala/scala#5245]: https://github.com/scala/scala/pull/524://github.com/scala/scala/pull/5245
[scala-commas]: https://github.com/47deg/scala-commas
