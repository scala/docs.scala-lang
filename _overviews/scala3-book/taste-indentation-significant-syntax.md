---
title: Indentation-Significant-syntax
type: section
description: This section shows that some lexical scopes can be delimited by indentation instead of braces.
num: 8
previous-page: taste-vars-data-types
next-page: taste-control-structures
---

Indentation refers to the increase or decrease of space between the left and right margin of a paragraph.


In Scala,  it is common practice that each level of indentation is 2 spaces.  Thus, instead of
indenting like this:

    // wrong!
    class Foo {
        def fourspaces = {
            val x = 4
            ..
        }
    }

it is better to indent like this:

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

it is best practice to avoid any method which takes more than two or
three parameters! When calling a method which takes numerous arguments (in the range of
five or more),though,  it is often necessary to wrap the method invocation onto
multiple lines. In such cases, put each argument on a line by
itself, indented two spaces from the current indent level:

    foo(
      someVeryLongFieldName,
      andAnotherVeryLongFieldName,
      "this is a string",
      3.1415)

This way, all parameters line up, and you don't need to re-align them if
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


## Optional Braces

The compiler will insert `<indent>` or `<outdent>`
tokens at certain line breaks. Grammatically, pairs of `<indent>` and `<outdent>` tokens have the same effect as pairs of braces `{` and `}`.

The algorithm makes use of a stack `IW` of previously encountered indentation widths. The stack initially holds a single element with a zero indentation width. The _current indentation width_ is the indentation width of the top of the stack.

There are two rules:

1. An `<indent>` is inserted at a line break, if

    - An indentation region can start at the current position in the source, and
    - the first token on the next line has an indentation width strictly greater
      than the current indentation width

   An indentation region can start

    - after the leading parameters of an `extension`, or
    - after a `with` in a given instance, or
    - after a `:` at the start of a template body (see discussion of `<colon>` below), or
    - after one of the following tokens:

      ```
      =  =>  ?=>  <-  catch  do  else  finally  for
      if  match  return  then  throw  try  while  yield
      ```

    - after the closing `)` of a condition in an old-style `if` or `while`.
    - after the closing `)` or `}` of the enumerations of an old-style `for` loop without a `do`.

   If an `<indent>` is inserted, the indentation width of the token on the next line
   is pushed onto `IW`, which makes it the new current indentation width.

2. An `<outdent>` is inserted at a line break, if

    - the first token on the next line has an indentation width strictly less
      than the current indentation width, and
    - the last token on the previous line is not one of the following tokens
      which indicate that the previous statement continues:
      ```
      then  else  do  catch  finally  yield  match
      ```
    - if the first token on the next line is a
      [leading infix operator](../changed-features/operators.md).
      then its indentation width is less then the current indentation width,
      and it either matches a previous indentation width or is also less
      than the enclosing indentation width.

   If an `<outdent>` is inserted, the top element is popped from `IW`.
   If the indentation width of the token on the next line is still less than the new current indentation width, step (2) repeats. Therefore, several `<outdent>` tokens
   may be inserted in a row.

   The following two additional rules support parsing of legacy code with ad-hoc layout. They might be withdrawn in future language versions:

    - An `<outdent>` is also inserted if the next token following a statement sequence starting with an `<indent>` closes an indentation region, i.e. is one of `then`, `else`, `do`, `catch`, `finally`, `yield`, `}`, `)`, `]` or `case`.

    - An `<outdent>` is finally inserted in front of a comma that follows a statement sequence starting with an `<indent>` if the indented region is itself enclosed in parentheses.

It is an error if the indentation width of the token following an `<outdent>` does not match the indentation of some previous line in the enclosing indentation region. For instance, the following would be rejected.

```scala
if x < 0 then
    -x
  else   // error: `else` does not align correctly
    x
```

Indentation tokens are only inserted in regions where newline statement separators are also inferred:
at the top-level, inside braces `{...}`, but not inside parentheses `(...)`, patterns or types.

**Note:** The rules for leading infix operators above are there to make sure that
```scala
  one
  + two.match
      case 1 => b
      case 2 => c
  + three
```
is parsed as `one + (two.match ...) + three`. Also, that
```scala
if x then
    a
  + b
  + c
else d
```
is parsed as `if x then a + b + c else d`.

For more Information on optional braces indentation, check [Optional Braces](https://docs.scala-lang.org/scala3/reference/other-new-features/indentation.html).
