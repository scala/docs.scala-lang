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
This section summarizes the important discussion points take from the following relevant discussion threads: [Partial type inference, and named type arguments](https://groups.google.com/forum/#!topic/scala-debate/tGMUQzSCsKc), [Another matter of syntax](https://groups.google.com/d/msg/scala-language/_oMKtyXQtEk/aMHYyl-cmloJ), [Why no inference of type parameter subsets?](https://groups.google.com/forum/#!searchin/scala-language/currying$20type/scala-language/jAj30PtFbg8/VV22g3qXT0IJ).

### Placeholder Arguments ###

### Currying ###
