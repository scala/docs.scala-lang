---
title: How to manage the resources of a test?
type: section
description: Describe the functional fixtures
num: 8
previous-page: testing-asynchronous
next-page: testing-what-else
---

{% include markdown.html path="_markdown/install-munit.md" %}

## `FunFixture`

In MUnit, we use functional fixtures to manage resources in a concise and safe way.
A `FunFixture` creates one resource for each test, ensuring that each test runs in isolation from the others.

In a test suite, you can define and use a `FunFixture` as follows:

{% tabs 'resources-1' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc
class FileTests extends munit.FunSuite {
  val usingTempFile: FunFixture[os.Path] = FunFixture(
    setup = _ => os.temp(prefix = "file-tests"),
    teardown = tempFile => os.remove(tempFile)
  )
  usingTempFile.test("overwrite on file") { tempFile =>
    os.write.over(tempFile, "Hello, World!")
    val obtained = os.read(tempFile)
    assertEquals(obtained, "Hello, World!")
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
class FileTests extends munit.FunSuite:
  val usingTempFile: FunFixture[os.Path] = FunFixture(
    setup = _ => os.temp(prefix = "file-tests"),
    teardown = tempFile => os.remove(tempFile)
  )
  usingTempFile.test("overwrite on file") { tempFile =>
    os.write.over(tempFile, "Hello, World!")
    val obtained = os.read(tempFile)
    assertEquals(obtained, "Hello, World!")
  }
```
{% endtab %}
{% endtabs %}

`usingTempFile` is a fixture of type `FunFixture[os.Path]`.
It contains two functions:
 - The `setup` function, of type `TestOptions => os.Path`, creates a new temporary file.
 - The `teardown` function, of type `os.Path => Unit`, deletes this temporary file.

We use the `usingTempFile` fixture to define a test that needs a temporary file.
Notice that the body of the test takes a `tempFile`, of type `os.Path`, as parameter.
The fixture automatically creates this temporary file, calls its `setup` function, and cleans it up after the test by calling `teardown`.

In the example, we used a fixture to manage a temporary file.
In general, fixtures can manage other kinds of resources, such as a temporary folder, a temporary table in a database, a connection to a local server, and so on.

## Composing `FunFixture`s

In some tests, you may need more than one resource.
You can use `FunFixture.map2` to compose two functional fixtures into one.

{% tabs 'resources-2' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
val using2TempFiles: FunFixture[(os.Path, os.Path)] =
  FunFixture.map2(usingTempFile, usingTempFile)

using2TempFiles.test("merge two files") {
  (file1, file2) =>
    // body of the test
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
val using2TempFiles: FunFixture[(os.Path, os.Path)] =
  FunFixture.map2(usingTempFile, usingTempFile)

using2TempFiles.test("merge two files") {
  (file1, file2) =>
    // body of the test
}
```
{% endtab %}
{% endtabs %}

Using `FunFixture.map2` on a `FunFixture[A]` and a `FunFixture[B]` returns a `FunFixture[(A, B)]`.

## Other fixtures

`FunFixture` is the recommended type of fixture because:
- it is explicit: each test declares the resource they need,
- it is safe to use: each test uses its own resource in isolation.

For more flexibility, `MUnit` contains other types of fixtures: the reusable fixture, the ad-hoc fixture and the asynchronous fixture.
Learn more about them in the [MUnit documentation](https://scalameta.org/munit/docs/fixtures.html).
