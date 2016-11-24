---
layout: sip
disqus: true
title: SIP-27 - Trailing Commas

vote-status: under review
vote-text: The following proposal needs to be updated, since only the specialized case version (with new lines) has been accepted. For more information, check the <a href="http://docs.scala-lang.org/sips/minutes/sip-20th-september-minutes.html">minutes</a>.
---

// TODO: Move from sips/completed to sips/pending

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

Using the example above, adding a comma after `baz` also unnecessarily changed the authorship of the line.

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

With this proposal I would like to present 2 variants:

1. The first variant adds trailing comma support to only multi-line `ArgumentExprs`, `Params` and `ClassParams`, which I consider to be the parts of the grammar that would most benefit from trailing commas.

2. The second variant adds trailing comma support to the whole grammar (again, only for multi-line), which means more consistency, but also supporting trailing commas in places that doesn't really need it, such as `ids`.

In this proposal, only the first variant is considered: trailing comma support for `ArgumentExprs`, `Params` and `ParamClasses` for the sake of simplicity.

See below for more details on what that would mean.

#### Changing `ArgumentExprs`

**Spec change**

{% highlight diff %}
         Exprs ::= Expr {‘,’ Expr}
-ArgumentExprs ::= ‘(’ [Exprs] ‘)’
+ArgumentExprs ::= ‘(’ [Exprs] [‘,’] ‘)'
{% endhighlight %}

**Example**
{% highlight scala %}
Seq(
  foo,
  bar,
  baz,
)
{% endhighlight %}

## `Params` and `ClassParams`

**Spec change**
{% highlight diff %}
       Params ::=  Param {‘,’ Param}
- ParamClause ::=  [nl] ‘(’ [Params] ‘)’
-ParamClauses ::=  {ParamClause} [[nl] ‘(’ ‘implicit’ Params ‘)’]
+ ParamClause ::=  [nl] ‘(’ [Params] [‘,’] ‘)’
+ParamClauses ::=  {ParamClause} [[nl] ‘(’ ‘implicit’ Params [‘,’] ‘)’]

       ClassParams ::=  ClassParam {‘,’ ClassParam}
- ClassParamClause ::=  [nl] ‘(’ [ClassParams] ‘)’
-ClassParamClauses ::=  {ClassParamClause} [[nl] ‘(’ ‘implicit’ ClassParams ‘)’]
+ ClassParamClause ::=  [nl] ‘(’ [ClassParams] [‘,’] ‘)’
+ClassParamClauses ::=  {ClassParamClause} [[nl] ‘(’ ‘implicit’ ClassParams [‘,’] ‘)’]
{% endhighlight %}

**examples**
{% highlight scala %}
def bippy(
  foo: Int,
  bar: String,
  baz: Boolean,
)

class Bippy(
  foo: Int,
  bar: String,
  baz: Boolean,
)
{% endhighlight %}

## Implementation

The implementation of trailing commas is a matter of changing some of the implementation of Scala's parser. An implementation of this proposal can be found at [scala/scala#5245][].

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
[scala/scala#5245]: https://github.com/scala/scala/pull/524://github.com/scala/scala/pull/5245
[scala-commas]: https://github.com/47deg/scala-commas
[#533]: https://github.com/scala/scala.github.com/pull/533
[#625]: https://github.com/scala/scala.github.com/pull/625
