---
layout: style-guide
title: Types

partof: style
overview-name: "Style Guide"

num: 4

previous-page: naming-conventions
next-page: nested-blocks
---

## Inference

Use type inference where possible, but put clarity first, and favour
explicitness in public APIs.

You should almost never annotate the type of a private field or a local
variable, as their type will usually be immediately evident in
their value:

    private val name = "Daniel"

However, you may wish to still display the type where the assigned value has a
complex or non-obvious form.

All public methods should have explicit type annotations.  Type inference may
break encapsulation in these cases, because it depends on internal method
and class details.  Without an explicit type, a change to the internals
of a method or val could alter the public API of the class without warning,
potentially breaking client code.  Explicit type annotations can also help
to improve compile times.

### Function Values

Function values support a special case of type inference which is worth
calling out on its own:

    val ls: List[String] = ...
    ls map (str => str.toInt)

In cases where Scala already knows the type of the function value we are
declaring, there is no need to annotate the parameters (in this case,
`str`). This is an intensely helpful inference and should be preferred
whenever possible. Note that implicit conversions which operate on
function values will nullify this inference, forcing the explicit
annotation of parameter types.

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
Thus, we did *not* declare `f` to be of type `(A) => B`, as this would
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

Structural types are implemented with reflection at runtime, and are
inherently less performant than nominal types.  Developers should
prefer the use of nominal types, unless structural types provide a
clear benefit.
