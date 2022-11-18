---
title: How to write assertions?
type: section
description: Comparing what you obtain with what you expect
num: 4
previous-page: munit-test-suite
next-page: munit-exceptions
---

{% include markdown.html path="_markdown/install-munit.md" %}

Assertions describe what to check in your tests. If any assertion in a unit test
fails, then the test fails. This tutorial shows the main assertion operations
supported by [MUnit](https://index.scala-lang.org/scalameta/munit):
- `assertEquals` to check that what you obtain is equal to what you expect,
- `assert` to check a boolean condition on the result of a method.

## Comparing What You Get With What You Expect

The most common form of assertions consists of comparing a result obtained from
the tested program with an expected value that you know is correct. You achieve
this with the method `assertEquals`, which you inherit from the test suite base
class, `munit.FunSuite`.

For instance, assuming your program provides a method `double`, which takes an
integer value as parameter and returns that value multiplied by two, you can
write the following test specification to check that the double of 21 is 42:

{% tabs assertions-0 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
class MyTests extends munit.FunSuite {
  test("a unit test") {
    assertEquals(double(21), 42)
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
class MyTests extends munit.FunSuite:
  test("a unit test") {
    assertEquals(double(21), 42)
  }
```
{% endtab %}
{% endtabs %}

Note the order of the arguments: the first one is the result of the program, and
the second one is the expected correct result. If, by mistake, you swapped the
order of the arguments of the call to `assertEquals`, you would get a confusing
test report.

## Checking a Boolean Condition

You can check that a boolean condition holds by using the method `assert`, which
is also inherited from the base class `munit.FunSuite`.

For instance, you can check that all the values returned by `double` are even values
as follows:

{% tabs assertions-1 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
class MyTests extends munit.FunSuite {
  test("a unit test") {
    // create a list containing some arbitrary input values
    val input = List(1, 2, 3, 4)
    // compute the double of every input value
    val obtainedResults = input.map(double)
    // check that they are all even numbers
    assert(obtainedResults.forall(x => x % 2 == 0))
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
class MyTests extends munit.FunSuite:
  test("a unit test") {
    // create a list containing some arbitrary input values
    val input = List(1, 2, 3, 4)
    // compute the double of every input value
    val obtainedResults = input.map(double)
    // check that they are all even numbers
    assert(obtainedResults.forall(x => x % 2 == 0))
  }
```
{% endtab %}
{% endtabs %}

## Next Steps

This tutorial only covered the two main types of assertions that you can use with
MUnit. You can discover other assertion operations in the
[documentation of MUnit](https://scalameta.org/munit/docs/assertions.html):
`assertNotEquals`, `assertNoDiff`, `fail`, and `compileErrors`.
