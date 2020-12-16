---
layout: sip
title: SIP-NN - Converters among optional Functions, PartialFunctions and extractor objects
vote-status: pending
permalink: /sips/:title.html
redirect_from: /sips/pending/converters-among-optional-functions-partialfunctions-and-extractor-object.html
---

**By: Yang Bo**


## History

| Date          | Version       |
|---------------|---------------|
| Aug 20th 2018 | Initial Draft |

## Motivation

There are three types in Scala to represent a function that accept some of the parameters:

1. optional functions: `A => Option[B]`
2. extracter objects: `{ def unapply(a: A): Option[B] }` and `{ def unapplySeq(a: A): Option[Seq[B]] }`
3. partial fucntions: `PartialFunction[A, B]`

Optional functions and partial functions can be converted to each other via `PartialFunction.lift` and `Function.unlift`. However, there is no simple approach to convert a partial function to an extractor object. As a result, partial functions are not composable. You cannot create a partial function then use it as a pattern in another partial function.

This proposal makes `PartialFunction` be an extractor, and provides an `unlift` method to convert optional functions to `PartialFunction`s.

## Motivating Examples

{% highlight scala %}
// Define a PartialFunction
val pf: PartialFunction[Int, String] = {
  case 1 => "matched by a PartialFunction"
}

// Define an optional function
val of: Int => Option[String] = { i =>
  if (i == 2) {
    Some("matched by an optional function")
  } else {
    None
  }
}

util.Random.nextInt(4) match {
  case pf(m) => // A PartialFunction itself is a pattern
    println(m)
  case of.unlift(m) => // Convert an optional function to a pattern
    println(m)
  case _ =>
    println("Not matched")
}
{% endhighlight %}

In addition, `elementWise` can be used to create an object with a `unapplySeq` method, which extracts each element of a sequence data.

{% highlight scala %}
val firstChar: String => Option[Char] = _.headOption

Seq("foo", "bar", "baz") match {
  case firstChar.unlift.elementWise(c0, c1, c2) =>
    println(s"$c0, $c1, $c2") // Output: f, b, b
}
{% endhighlight %}

## Cheat sheet

This proposal allows converting among optional Functions, PartialFunctions and extractor objects as shown in the following table.

<table>
  <thead>
    <tr>
      <th>
        How to convert ...
      </th>
      <th>
        to a partial function
      </th>
      <th>
        to an optional function
      </th>
      <th>
        to an extractor
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>
        from a partial function
      </th>
      <td>
        <code>partialFunction</code>
      </td>
      <td>
        <code>partialFunction.lift</code>
      </td>
      <td>
        <code>partialFunction</code>
      </td>
    </tr>
    <tr>
      <th>
        from an optional function
      </th>
      <td>
        <code>optionalFunction.unlift</code> or <code>Function.unlift(optionalFunction)</code>
      </td>
      <td>
        <code>optionalFunction</code>
      </td>
      <td>
        <code>optionalFunction.unlift</code>
      </td>
    </tr>
    <tr>
      <th>
        from an extractor
      </th>
      <td>
        <code>{ case extractor(x) => x }</code>
      </td>
      <td>
        <code>extractor.unapply _</code>
      </td>
      <td>
        <code>extractor</code>
      </td>
    </tr>
  </tbody>
</table>

Note that `optionalFunction.unlift` is preferred to `Function.unlift(optionalFunction)` when creating extractors, because only nullary methods are allowed in `case` expressions.

## Implementation

The idea was originally implemented in a library: [Extractor.scala](https://github.com/ThoughtWorksInc/Extractor.scala), which has been used in [Binding.scala](https://github.com/ThoughtWorksInc/Binding.scala/blob/10.0.x/XmlExtractor/src/main/scala/com/thoughtworks/binding/XmlExtractor.scala#L63) and [sbt-api-mappings](https://github.com/ThoughtWorksInc/sbt-api-mappings/blob/f4e1353/src/main/scala/com/thoughtworks/sbtApiMappings/ApiMappings.scala#L48).

The new implementation aims to become part of core library. The pull request can be found at [#7111][2].

## References

1. [Existing Implementation (Extractor.scala)][1]
2. [Related Pull Request][2]

[1]: https://github.com/ThoughtWorksInc/Extractor.scala "Extractor.scala"
[2]: https://github.com/scala/scala/pull/7111 "#7111"
