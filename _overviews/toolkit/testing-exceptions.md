---
title: How to test exceptions?
type: section
description: Describe the intercept assertion
num: 6
previous-page: testing-run-only
next-page: testing-asynchronous
---

{% include markdown.html path="_markdown/install-munit.md" %}

## Intercepting an exception

In a test, you can use `intercept` to check that your code throws an exception.

{% tabs 'intercept-1' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc
import java.nio.file.NoSuchFileException

class FileTests extends munit.FunSuite {
  test("read missing file") {
    val missingFile = os.pwd / "missing.txt"
    
    intercept[NoSuchFileException] { 
      os.read(missingFile)
    }
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import java.nio.file.NoSuchFileException

class FileTests extends munit.FunSuite:
  test("read missing file") {
    val missingFile = os.pwd / "missing.txt"
    intercept[NoSuchFileException] {
      // the code that should throw an exception
      os.read(missingFile)
    }
  }
```
{% endtab %}
{% endtabs %}

The type parameter of the `intercept` assertion is the expected exception.
Here it is `NoSuchFileException`.
The body of the `intercept` assertion contains the code that should throw the exception.

The test passes if the code throws the expected exception and it fails otherwise.

The `intercept` method returns the exception that is thrown.
You can check more assertions on it.

{% tabs 'intercept-2' %}
{% tab 'Scala 2 and 3' %}
```scala
val exception = intercept[NoSuchFileException](os.read(missingFile))
assert(clue(exception.getMessage).contains("missing.txt"))
```
{% endtab %}
{% endtabs %}

You can also use the more concise `interceptMessage` method to test the exception and its message in a single assertion.
Learn more about it in the [MUnit documentation](https://scalameta.org/munit/docs/assertions.html#interceptmessage).
