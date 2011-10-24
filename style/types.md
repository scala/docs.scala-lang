---
layout: overview-large
title: Types

partof: style-guide
num: 4
---

## Inference

Use type inference as much as possible. You should almost never annotate
the type of a `val` field as their type will be immediately evident in
their value:

    val name = "Daniel"

However, type inference has a way of coming back to haunt you when used
on non-trivial methods which are part of the public interface. Just for
the sake of safety, you should annotate all public methods in your
class.

### Function Values

Function values support a special case of type inference which is worth
calling out on its own:

    val ls: List[String] = ...
    ls map { str => str.toInt }

In cases where Scala already knows the type of the function value we are
declaring, there is no need to annotate the parameters (in this case,
`str`). This is an intensely helpful inference and should be preferred
whenever possible. Note that implicit conversions which operate on
function values will nullify this inference, forcing the explicit
annotation of parameter types.

### "Void" Methods

The exception to the "annotate everything public" rule is methods which
return `Unit`. *Any* method which returns `Unit` should be declared
using Scala's syntactic sugar for that case:

    def printName() {
      println("Novell")
    }

This compiles into:

    def printName(): Unit = {
      println("Novell")
    }

You should prefer the former style (without the annotation or the equals
sign) as it reduces errors and improves readability. For the record, it
is also possible (and encouraged!) to declare abstract methods returning
`Unit` with an analogous syntax:

    def printName()         // abstract def for printName(): Unit

## Annotations

Type annotations should be patterned according to the following
template:

    value: Type

This is the style adopted by most of the Scala standard library and all
of Martin Odersky's examples. The space between value and type helps the
eye in accurately parsing the syntax. The reason to place the colon at
the end of the value rather than the beginning of the type is to avoid
confusion in cases such as this one:

    value :::

This is actually valid Scala, declaring a value to be of type `::`.
Obviously, the prefix-style annotation colon muddles things greatly.

## Ascription

Type ascription is often confused with type annotation, as the syntax in
Scala is identical. The following are examples of ascription:

-   `Nil: List[String]`
-   `Set(values: _*)`
-   `"Daniel": AnyRef`

Ascription is basically just an up-cast performed at compile-time for
the sake of the type checker. Its use is not common, but it does happen
on occasion. The most often seen case of ascription is invoking a
varargs method with a single `Seq` parameter. This is done by ascribing
the `_*` type (as in the second example above).

Ascription follows the type annotation conventions; a space follows the
colon.

## Functions

Function types should be declared with a space between the parameter
type, the arrow and the return type:

    def foo(f: Int => String) = ...

    def bar(f: (Boolean, Double) => List[String]) = ...

Parentheses should be omitted wherever possible (e.g. methods of
arity-1, such as `Int => String`).

### Arity-1

Scala has a special syntax for declaring types for functions of arity-1.
For example:

    def map[B](f: A => B) = ...

Specifically, the parentheses may be omitted from the parameter type.
Thus, we did *not* declare `f` to be of type "`(A) => B`, as this would
have been needlessly verbose. Consider the more extreme example:

    // wrong!
    def foo(f: (Int) => (String) => (Boolean) => Double) = ...

    // right!
    def foo(f: Int => String => Boolean => Double) = ...

By omitting the parentheses, we have saved six whole characters and
dramatically improved the readability of the type expression.

## Structural Types

Structural types should be declared on a single line if they are less
than 50 characters in length. Otherwise, they should be split across
multiple lines and (usually) assigned to their own type alias:

    // wrong!
    def foo(a: { def bar(a: Int, b: Int): String; val baz: List[String => String] }) = ...

    // right!
    private type FooParam = {
      val baz: List[String => String]
      def bar(a: Int, b: Int): String
    }

    def foo(a: FooParam) = ...

Simpler structural types (under 50 characters) may be declared and used
inline:

    def foo(a: { val bar: String }) = ...

When declaring structural types inline, each member should be separated
by a semi-colon and a single space, the opening brace should be
*followed* by a space while the closing brace should be *preceded* by a
space (as demonstrated in both examples above).
