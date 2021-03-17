---
title: Testing Scala with sbt and ScalaTest on the Command Line
layout: singlepage-overview
partof: testing-scala-with-sbt-on-the-command-line
languages: [ja]
disqus: true
previous-page: getting-started-with-scala-and-sbt-on-the-command-line

redirect_from: "/getting-started-sbt-track/testing-scala-with-sbt-on-the-command-line.html"
---

There are multiple libraries and testing methodologies for Scala,
but in this tutorial, we'll demonstrate one popular option from the ScalaTest framework
called [AnyFunSuite](https://www.scalatest.org/scaladoc/3.2.2/org/scalatest/funsuite/AnyFunSuite.html).
We assume you know [how to create a Scala project with sbt](getting-started-with-scala-and-sbt-on-the-command-line.html).

## Setup
1. On the command line, create a new directory somewhere.
1. `cd` into the directory and run `sbt new scala/scalatest-example.g8`
1. Name the project `ScalaTestTutorial`.
1. The project comes with ScalaTest as a dependency in the `build.sbt` file.
1. `cd` into the directory and run `sbt test`. This will run the test suite
`CubeCalculatorTest` with a single test called `CubeCalculator.cube`.

```
sbt test
[info] Loading global plugins from /Users/username/.sbt/0.13/plugins
[info] Loading project definition from /Users/username/workspace/sandbox/my-something-project/project
[info] Set current project to scalatest-example (in build file:/Users/username/workspace/sandbox/my-something-project/)
[info] CubeCalculatorTest:
[info] - CubeCalculator.cube
[info] Run completed in 267 milliseconds.
[info] Total number of tests run: 1
[info] Suites: completed 1, aborted 0
[info] Tests: succeeded 1, failed 0, canceled 0, ignored 0, pending 0
[info] All tests passed.
[success] Total time: 1 s, completed Feb 2, 2017 7:37:31 PM
```

## Understanding tests
1.  Open up two files in a text editor:
    * `src/main/scala/CubeCalculator.scala`
    * `src/test/scala/CubeCalculatorTest.scala`
1. In the file `CubeCalculator.scala`, you'll see how we define the function `cube`.
1. In the file `CubeCalculatorTest.scala`, you'll see that we have a class
named after the object we're testing.

```
  import org.scalatest.funsuite.AnyFunSuite

  class CubeCalculatorTest extends AnyFunSuite {
      test("CubeCalculator.cube") {
          assert(CubeCalculator.cube(3) === 27)
      }
  }
```

Let's go over this line by line.

* `class CubeCalculatorTest` means we are testing the object `CubeCalculator`
* `extends AnyFunSuite` lets us use functionality of ScalaTest's AnyFunSuite class
such as the `test` function
* `test` is function that comes from AnyFunSuite that collects
results from assertions within the function body.
* `"CubeCalculator.cube"` is a name for the test. You can call it anything but
one convention is "ClassName.methodName".
* `assert` takes a boolean condition and determines whether the test passes or fails.
* `CubeCalculator.cube(3) === 27` checks whether the output of the `cube` function is
indeed 27. The `===` is part of ScalaTest and provides clean error messages.

## Adding another test case
1. Add another test block with its own `assert` statement that checks for the cube of `0`.

    ```
      import org.scalatest.funsuite.AnyFunSuite
    
      class CubeCalculatorTest extends AnyFunSuite {
          test("CubeCalculator.cube 3 should be 27") {
              assert(CubeCalculator.cube(3) === 27)
          }

          test("CubeCalculator.cube 0 should be 0") {
              assert(CubeCalculator.cube(0) === 0)
          }
      }
    ```

1. Execute `sbt test` again to see the results.

    ```
    sbt test
    [info] Loading project definition from C:\projects\scalaPlayground\scalatestpractice\project
    [info] Loading settings for project root from build.sbt ...
    [info] Set current project to scalatest-example (in build file:/C:/projects/scalaPlayground/scalatestpractice/)
    [info] Compiling 1 Scala source to C:\projects\scalaPlayground\scalatestpractice\target\scala-2.13\test-classes ...
    [info] CubeCalculatorTest:
    [info] - CubeCalculator.cube 3 should be 27
    [info] - CubeCalculator.cube 0 should be 0
    [info] Run completed in 257 milliseconds.
    [info] Total number of tests run: 2
    [info] Suites: completed 1, aborted 0
    [info] Tests: succeeded 2, failed 0, canceled 0, ignored 0, pending 0
    [info] All tests passed.
    [success] Total time: 3 s, completed Dec 4, 2019 10:34:04 PM
    ```

## Conclusion
You've seen one way to test your Scala code. You can learn more about
ScalaTest's FunSuite on the [official website](https://www.scalatest.org/getting_started_with_fun_suite). You can also check out other testing frameworks such as  [ScalaCheck](https://www.scalacheck.org/) and [Specs2](https://etorreborre.github.io/specs2/).
