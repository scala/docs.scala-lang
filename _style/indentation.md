---
layout: style-guide
title: Indentation

partof: style
overview-name: "Style Guide"

num: 2

previous-page: overview
next-page: naming-conventions
---

Each level of indentation is 2 spaces. Tabs are not used. Thus, instead of
indenting like this:

    // wrong!
    class Foo {
        def fourspaces = {
            val x = 4
            ..
        }
    }

You should indent like this:

    // right!
    class Foo {
      def twospaces = {
        val x = 2
        ..
      }
    }

The Scala language encourages a startling amount of nested scopes and
logical blocks (function values and such). Do yourself a favor and don't
penalize yourself syntactically for opening up a new block. Coming from
Java, this style does take a bit of getting used to, but it is well
worth the effort.

## Line Wrapping

There are times when a single expression reaches a length where it
becomes unreadable to keep it confined to a single line (usually that
length is anywhere above 80 characters). In such cases, the *preferred*
approach is to simply split the expression up into multiple expressions
by assigning intermediate results to values. However, this is not
always a practical solution.

When it is absolutely necessary to wrap an expression across more than
one line, each successive line should be indented two spaces from the
*first*. Also remember that Scala requires each "wrap line" to either
have an unclosed parenthetical or to end with an infix method in which
the right parameter is not given:

    val result = 1 + 2 + 3 + 4 + 5 + 6 +
      7 + 8 + 9 + 10 + 11 + 12 + 13 + 14 +
      15 + 16 + 17 + 18 + 19 + 20

Without this trailing method, Scala will infer a semi-colon at the end
of a line which was intended to wrap, throwing off the compilation
sometimes without even so much as a warning.

## Methods with Numerous Arguments

When calling a method which takes numerous arguments (in the range of
five or more), it is often necessary to wrap the method invocation onto
multiple lines. In such cases, put each argument on a line by
itself, indented two spaces from the current indent level:

    foo(
      someVeryLongFieldName,
      andAnotherVeryLongFieldName,
      "this is a string",
      3.1415)

This way, all parameters line up, but you don't need to re-align them if
you change the name of the method later on.

Great care should be taken to avoid these sorts of invocations well into
the length of the line. More specifically, such an invocation should be
avoided when each parameter would have to be indented more than 50
spaces to achieve alignment. In such cases, the invocation itself should
be moved to the next line and indented two spaces:

    // right!
    val myLongFieldNameWithNoRealPoint =
      foo(
        someVeryLongFieldName,
        andAnotherVeryLongFieldName,
        "this is a string",
        3.1415)

    // wrong!
    val myLongFieldNameWithNoRealPoint = foo(someVeryLongFieldName,
                                             andAnotherVeryLongFieldName,
                                             "this is a string",
                                             3.1415)

Better yet, just try to avoid any method which takes more than two or
three parameters!
