---
layout: sip
title: SIP 26 - Partial Type Argument Lists
disqus: true
---

__Ahmad Salim Al-Sibahi__

__First submitted 01 September 2015__

## Motivation ##
The Scala compiler currently tries to automatically infer type arguments when calling functions, which reduces verbosity and makes it easier for programmers to use libraries with complex type signatures.
Due to the expressiveness of the Scala type system the compiler can not always infer the desired types and at that point the programmer is required to provide *all* type arguments explicitly, even though it could partially infer some of them.
This proposal aims to introduce a way of providing a partial list of type arguments explicitly and letting the compiler infer the rest in order to reduce verbosity while still retaining precision.

## Proposed Solution ##

The proposed solution is to support named type arguments in the same way that Scala already supports named function arguments.
This includes:

1. Extending the syntax such that it is possible to provide type arguments of the form `A = T`, and extend the relevant semantic checking phase to ensure that `A` is indeed declared as a formal type argument in the relevant function. When positional and named type arguments are mixed, the same restrictions are enforced as with normal function arguments, i.e. positional arguments must come before named arguments. It may additionally be useful to support empty type argument lists, when providing higher-order types as type arguments themselves e.g. `Set[]` instead of requiring `Set[A = ...]` when A can be inferred automatically.
2. Extend the type checker to use the provided type arguments when trying to infer the type arguments on function calls (and other relevant contexts), and additionally ensure that the provided arguments meet any required constraints (such as subtyping bounds).

## Examples ##
The new proposal allows us to write the following code:

{% highlight scala %}
import scalaz.\/._
object Application extends App {
  // Instead of requiring right[String, Int] explicitly
  val _ = Set(1,2,3).foldLeft(right[A = String](0)) { (acc, i) => left("...") }
}
{% endhighlight %}

and

{% highlight scala %}
import scalaz.\/
import scalaz.\/._
object Application extends App {
  // Instead of needing to duplicate the first argument of flatMap in the second argument
  // e.g. writing flatMap[String \/ Int, Set[String \/ Int]]
  val _ = Set(1,2,3).flatMap[String \/ Int, Set[]](a => Set(right(a)))
}
{% endhighlight %}


## Related Discussion ##
This section summarizes the important discussion points take from the following relevant discussion threads: [Partial type inference, and named type arguments](https://groups.google.com/forum/#!topic/scala-debate/tGMUQzSCsKc), [Another matter of syntax][an-ma-syn], [Why no inference of type parameter subsets?](https://groups.google.com/forum/#!searchin/scala-language/currying$20type/scala-language/jAj30PtFbg8/VV22g3qXT0IJ).

### Placeholder Arguments ###
Originally the proposal included a way to specify which arguments are to be inferred by position using a form of placeholder such as `_` or `?` (or even nothing like C#). There were however some issues which made it not possible to use the aforementioned placeholder characters and since there were no alternative characters proposed nor agreed on, the proposal was dropped.
The issues were:

* Using `_` as a placeholder would lead to confusion when used in conjunction with the existing notion of `_` as a wildcard (unbound type parameter) and so e.g., `HashMap[Int,_]` and `HashMap[Int,_](1 -> "a")` would each use a different semantics of `_` even though they are structurally very similar.
* There were some thoughts on reserving `?` for future use as shorthand for nullable types, so type `T?` would be equivalent to something like `T|Null` or `Option[T]`.
* Having no placeholder argument, would make types harder to read and parser errors harder to report.

### Currying ###
An alternative proposal to placeholders, was to allow users to "curry" type arguments (or rather, provide possibly more than one partial argument list); for example, writing `HashMap[Int](1 -> "a")` and `HashMap[Int][String](1 -> "a")`. Besides technical difficulties mentioned in the discussions, a shortcoming of this approach is that it forces the user to provide arguments in a specified order and it is unclear how to provide a type argument without explicitly providing all prior ones.

## Acknowledgements ##
I would not have been able to write this proposal without help, suggestions and constructive suggestions from the Scala community.
Neither was I the first person to suggest this feature, since Paul Phillips had brought similar suggestions already in a [thread from March 2012][an-ma-syn] (and more later on as well).
Therefore, I would like to thank everyone who initiated and joined the discussion for their contributions to the final proposal.

[an-ma-syn]: https://groups.google.com/d/msg/scala-language/_oMKtyXQtEk/aMHYyl-cmloJ
