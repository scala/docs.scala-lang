---
title: What is Functional Programming?
type: section
description: This section provides an answer to the question, what is functional programming?
num: 41
previous-page: fp-intro
next-page: fp-immutable-values
---



[Wikipedia defines *functional programming*](https://en.wikipedia.org/wiki/Functional_programming) like this:


{% comment %}
TODO: Update the CSS so this extra paragraph isn’t needed.
{% endcomment %}

<blockquote>
<p>Functional programming is a programming paradigm where programs are constructed by applying and composing functions.
It is a declarative programming paradigm in which function definitions are trees of expressions that each return a value, rather than a sequence of imperative statements which change the state of the program.</p>
<p>&nbsp;</p>
<p>In functional programming, functions are treated as first-class citizens, meaning that they can be bound to names (including local identifiers), passed as arguments, and returned from other functions, just as any other data type can.
This allows programs to be written in a declarative and composable style, where small functions are combined in a modular manner.</p>
</blockquote>

It can also be helpful to know that experienced functional programmers have a strong desire to see their code as math, that combining pure functions together is like combining a series of algebraic equations.

When you write functional code you feel like a mathematician, and once you understand the paradigm, you want to write pure functions that always return *values*---not exceptions or null values---so you can combine (compose) them together to create solutions.
The feeling that you’re writing math-like equations (expressions) is the driving desire that leads you to use *only* pure functions and immutable values, because that’s what you use in algebra and other forms of math.

Functional programming is a large topic, and there’s no simple way to condense the entire topic into one chapter, but hopefully the following sections will provide an overview of the main topics, and show some of the tools Scala provides for writing functional code.



