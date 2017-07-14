---
title: Testing Scala with sbt and ScalaTest in the Command Line
layout: inner-page-no-masthead
disqus: true
previous-page: getting-started-with-scala-and-sbt-in-the-command-line
---

There are multiple libraries and testing methodologies for Scala,
but in this tutorial, we'll demonstrate one popular option from the ScalaTest framework
called [FunSuite](http://www.scalatest.org/getting_started_with_fun_suite).
We assume you know [how to create a Scala project with sbt](getting-started-with-scala-and-sbt-in-the-command-line.html).

## Setup
1. In the command line, create a new directory somewhere (e.g. `Documents`).
1. `cd` into the directory and run `sbt new scala/scalatest-example.g8`
1. Name the project `ScalaTestTutorial`.
1. The project comes with ScalaTest as a dependency in the `build.sbt` file.
1. `cd` into the directory and run `sbt test`. This will run the test suite
`CubeCalculatorTest` with a single test called `CubeCalculatorTest.cube`.

```
sbt test
[info] Loading global plugins from /Users/travislee/.sbt/0.13/plugins
[info] Loading project definition from /Users/travislee/workspace/sandbox/my-something-project/project
[info] Set current project to scalatest-example (in build file:/Users/travislee/workspace/sandbox/my-something-project/)
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
    import org.scalatest.FunSuite

    class CubeCalculatorTest extends FunSuite {
        test("CubeCalculator.cube") {
            assert(CubeCalculator.cube(3) === 27)
        }
    }

```

Let's go over this line by line.

* `class CubeCalculatorTest` means we are testing the object `CubeCalculator`
* `extends FunSuite` lets us use functionality of ScalaTest's FunSuite class
such as the `test` function
* `test` is function that comes from FunSuite that collects
results from assertions within the function body.
* `"CubeCalculator.cube"` is a name for the test. You can call it anything but
one convention is "ClassName.methodName".
* `assert` takes a boolean condition and determines whether the test passes or fails.
* `CubeCalculator.cube(3) === 27` checks whether the output of the `cube` function is
indeed 27. The `===` is part of ScalaTest and provides clean error messages.

## Adding another test case
1. Add another `assert` statement after the first one that checks for the cube
of `0`.
1. Execute `sbt test` again to see the results.

## Conclusion
You've seen one way to test your Scala code. You can learn more about
ScalaTest's FunSuite on the [official website](http://www.scalatest.org/getting_started_with_fun_suite). You can also check out other testing frameworks such as  [ScalaCheck](https://www.scalacheck.org/) and [Specs2](https://etorreborre.github.io/specs2/).
