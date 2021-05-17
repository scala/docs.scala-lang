---
title: Building a Scala Project with IntelliJ and sbt
layout: singlepage-overview
partof: building-a-scala-project-with-intellij-and-sbt
languages: [ja]
disqus: true
previous-page: getting-started/intellij-track/getting-started-with-scala-in-intellij
next-page: testing-scala-in-intellij-with-scalatest

redirect_from: "/getting-started-intellij-track/building-a-scala-project-with-intellij-and-sbt.html"
---

In this tutorial, we'll see how to build a Scala project using [sbt](https://www.scala-sbt.org/1.x/docs/index.html). sbt is a popular tool for compiling, running, and testing Scala projects of any
size. Using a build tool such as sbt (or Maven/Gradle) becomes essential once you create projects with dependencies
or more than one code file.
 We assume you've completed the
[first tutorial](getting-started-with-scala-in-intellij.html).

## Creating the project
In this section, we'll show you how to create the project in IntelliJ. However, if you're
comfortable with the command line, we recommend you try [Getting
Started with Scala and sbt on the Command Line]({{site.baseurl}}/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html) and then come back
 here to the section "Writing Scala code".

1. If you didn't create the project from the command line, open up IntelliJ and select "Create New Project"
  * On the left panel, select Scala and on the right panel, select sbt
  * Click **Next**
  * Name the project "SbtExampleProject"
1. If you already created the project on the command line, open up IntelliJ, select *Import Project* and open the `build.sbt` file for your project
1. Make sure the **JDK version** is 1.8 and the **sbt version** is at least 0.13.13
1. Select **Use auto-import** so dependencies are automatically downloaded when available
1. Select **Finish**

## Understanding the directory structure
sbt creates many directories which can be useful once you start building
more complex projects. You can ignore most of them for now
but here's a glance at what everything is for:

```
- .idea (IntelliJ files)
- project (plugins and additional settings for sbt)
- src (source files)
    - main (application code)
        - java (Java source files)
        - scala (Scala source files) <-- This is all we need for now
        - scala-2.12 (Scala 2.12 specific files)
    - test (unit tests)
- target (generated files)
- build.sbt (build definition file for sbt)
```


## Writing Scala code
1. On the **Project** panel on the left, expand `SbtExampleProject` => `src`
=> `main`
1. Right-click `scala` and select **New** => **Package**
1. Name the package `example` and click **OK** (or just press the Enter or Return key).
1. Right-click the package `example` and select **New** => **Scala class** (if you don't see this option, right-click the `SbtExampleProject`, click **Add Frameworks Support**, select **Scala** and proceed)
1. Name the class `Main` and change the **Kind** to `Object`.
1. Change the code in the class to the following:

```
object Main extends App {
  val ages = Seq(42, 75, 29, 64)
  println(s"The oldest person is ${ages.max}")
}
```

Note: IntelliJ has its own implementation of the Scala compiler, and sometimes your
code is correct even though IntelliJ indicates otherwise. You can always check
to see if sbt can run your project on the command line.

## Running the project
1. From the **Run** menu, select **Edit configurations**
1. Click the **+** button and select **sbt Task**.
1. Name it `Run the program`.
1. In the **Tasks** field, type `~run`. The `~` causes sbt to rebuild and rerun the project
when you save changes to a file in the project.
1. Click **OK**.
1. On the **Run** menu. Click **Run 'Run the program'**.
1. In the code, change `75` to `61`
and look at the updated output in the console.

## Adding a dependency
Changing gears a bit, let's look at how to use published libraries to add
extra functionality to our apps.
1. Open up `build.sbt` and add the following line:

```
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.2"
```
Here, `libraryDependencies` is a set of dependencies, and by using `+=`,
we're adding the [scala-parser-combinators](https://github.com/scala/scala-parser-combinators) dependency to the set of dependencies that sbt will go
and fetch when it starts up. Now, in any Scala file, you can import classes,
objects, etc, from scala-parser-combinators with a regular import.

You can find more published libraries on
[Scaladex](https://index.scala-lang.org/), the Scala library index, where you
can also copy the above dependency information for pasting into your `build.sbt`
file.

## Next steps

Continue to the next tutorial in the _getting started with IntelliJ_ series, and learn about [testing Scala code in IntelliJ with ScalaTest](testing-scala-in-intellij-with-scalatest.html).

**or**

* [The Scala Book](/overviews/scala-book/introduction.html), which provides a set of short lessons introducing Scala’s main features.
* [The Tour of Scala](/tour/tour-of-scala.html) for bite-sized introductions to Scala's features.
- Continue learning Scala interactively online on
 [Scala Exercises](https://www.scala-exercises.org/scala_tutorial).
