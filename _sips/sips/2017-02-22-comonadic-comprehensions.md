---
layout: sip
discourse: true
title: SIP-NN - comonadic-comprehensions

vote-status: rejected
permalink: /sips/:title.html
redirect_from: /sips/pending/comonadic-comprehensions.html
---

**By: Shimi Bandiel**

## History

| Date          | Version       |
|---------------|---------------|
| Feb 22nd 2017 | Initial Draft |

## Motivation

Scala provides a concise syntax for working with Monads(map & flatMap):
the <b>for comprehension</b>.

Following is a proposal for a concise syntax for working with Comonads(map, extract & coflatMap):
the <b>cofor comprehension</b>.

The proposal has an existing implementation in <a href="https://github.com/scala/scala/pull/5725">PR 5725</a>

## Motivating Examples

### Examples

Consider the following class:

{% highlight scala %}

case class StreamZipper[A](left: Stream[A], focus: A, right: Stream[A]) {
  def map[B](f: A => B): StreamZipper[B] =
    StreamZipper(left.map(f), f(focus), right.map(f))
  def extract: A =
	focus
  def coflatMap(f: StreamZipper[A] => B): StreamZipper[B] =
	???
}

{% endhighlight %}

<i>StreamZipper[A]</i> represents a <b>non-empty</b> Stream of <i>A</i>s with a cursor (focus).

<ul>
<li>The <i>map</i> method invokes <i>f</i> on every element and produces a StreamZipper of
the results.</li>
<li>The <i>extract</i> method returns the value at the cursor</li>
<li>The <i>coflatMap</i> method invokes <i>f</i> on every cursor (all possible zippers) providing a contextual global operation.
The result is a StreamZipper[B] of the results with a cursor pointing at the same location as <i>this</i>.
</li>
</ul>

The above implementation for `coflatMap` was left out for brevity. See [3].

Now, consider the following methods:
{% highlight scala %}

  // returns whether the current cursor in a zipper of ints is between the previous
  // and the next numbers.
  def isInTheMiddle(z : StreamZipper[Int]): Boolean =
    z match {
      case StreamZipper(pi +: _, i, ni +: _) if (pi < i && i < ni) => true
      case _ => false
    }  

  // counts how many consecutive values of <i>true</i> starting from the cursor
  def numberOfTrues(z: StreamZipper[Boolean]) : Int  =
    if (z.focus) 1 + z.right.takeWhile(true ==).size else 0

{% endhighlight %}

And, let's say we have a StreamZipper[Person]:
{% highlight scala %}
  case class Person(name: String, age: Int)

  // a given stream with cursor at some position
  val people: StreamZipper[Person] = ???
{% endhighlight %}

We would like to get the following:
{% highlight scala %}

  /*
  * A StreamZipper of triplets containing:
  *  _1 -- the original Person value.
  *  _2 -- whether this Person's age is higher than the previous and lower than the next.
  *         We'll call this boolean TAG.
  *  _3 -- how many consecutive TAGs with value "true" starting from current cursor.
  */
	val goal: StreamZipper[(Person, Boolean, Int)] = ???

{% endhighlight %}

It seems we can re-use the <i>isInTheMiddle</i> and <i>numberOfTrues</i> methods.
However, <b>without the proposed cofor</b> syntax we'll probably end with:
{% highlight scala %}
   val goal = people.map(p => (p, p.age)).coflatMap { zipperOfTuple =>
		val ages = zipperOfTuple.map(_._2)
		(zipperOfTuple.extract._1, isInTheMiddle(ages))
   }.coflatMap { zipperOfTuple =>
		val tags = zipperOfTuple.map(_._2)
		val persons = zipperOfTuple.map(_._1)
		val trues = numberOfTrues(tags)
		persons.extract, tags.extract, trues)
   }
{% endhighlight %}
From the code above, you can see that it is quite cumbersome to handle the passing of
the <i>context</i> between the invocations of <i>coflatMap</i>.

The proposed syntax allows for the following usage:
{% highlight scala %}
  val flow : StreamZipper[Person] => (Person, Boolean, Int) =
    cofor (p @ Person(_, age)) {
      tag <- isInTheMiddle(age)
      count <- numberOfTrues(tag)
    } yield (p.extract, tag.extract, count.extract)

  val goal = people.coflatMap(flow)
{% endhighlight %}


## Syntax

The proposed syntax is based on the paper by Dominic Orchard and Alan Mycroft [1].

The syntax for `cofor` is defined as:
{% highlight scala %}
	cofor (pattern0) {
		pattern1 <- generator1
		pattern2 <- generator2
		...
	} yield body

	patternN    = regular case patterns
	generatorN  = expr
	body        = expr

{% endhighlight %}

The result type of a `cofor` expression is a function from the comonad type to
a result (`T[A] => B`).
This means that the return type must be available at call-site!
Note that unlike `for`, guards and assignments are not supported.

## Desugaring

A `cofor` desugaring is much more complex than the respective `for`.

Desugaring example:

{% highlight scala %}
  val flow : StreamZipper[Person] => (Person, Boolean, Int) =
    cofor (p @ Person(_, age)) {
      tag <- isInTheMiddle(age)
      count <- numberOfTrues(tag)
    } yield (p.extract, tag.extract, count.extract)

  val goal = people.coflatMap(flow)
{% endhighlight %}

The above `cofor` expression will be desugared into the following function:
{% highlight scala %}
	input => {
	  // desugaring the generators
	  val enums =
		// assign values to input variables
		// actual assignment is done through pattern matching
		input.map(p => (
			p match {
				case p @ Person(_, age) => p
			}
			, (p match {
				case p @ Person(_, age) => age
			}, ()))).
		coflatMap(env => {
			// extracting collected values from the context
			val p = env.map(env => env._1)
			val age = env.map(env => env._2._1)
			// now we pass the current context and the generator result
			(isInTheMiddle(age), env.extract)
		}).coflatMap(env => {
			// extracting collected values from the context
			val tag = env.map(env => env._1)
			val p = env.map(env => env._2._1)
			val age = env.map(env => env._2._2._1)
			// now we pass the current context and the generator result
			(numberOfTrues(tag), env.extract)
		})
		// the body phase (yield)
		{
			// deconstructing the collected context
			val count = enums.map(env => env._1)
			val tag = enums.map(env => env._2._1)
			val p = enums.map(env => env._2._2._1)
			val age = enums.map(env => env._2._2._2._1)
			(p.extract, tag.extract, count.extract)
		}
	}
{% endhighlight %}

## Drawbacks

<ol>
<li>Adding a new keyword to the language makes it more complex</li>
<li>Understanding the desugaring and concept behind <i>cofor</i> is not
trivial and it's much more complex than <i>for</i> (which many developers still
don't feel at ease with).</li>
</ol>


## References

1. [A Notation for Comonads][1]
2. [Implementation Pull-Request][2]
3. [StreamZipper Example][3]

[1]: https://www.cl.cam.ac.uk/~dao29/publ/codo-notation-orchard-ifl12.pdf "codo-notation"
[2]: https://github.com/scala/scala/pull/5725
[3]: https://github.com/shimib/scala/blob/5e257cd4b371769deafba2be1ae3932d772ca67d/test/files/neg/cofor.scala
