---
title: Scala Tools
type: chapter
description: This chapter looks at two commonly-used Scala tools, sbt and ScalaTest.
num: 69
previous-page: concurrency
next-page: interacting-with-java
---


In this chapter you’ll see two tools that are commonly used in Scala projects:

- The [sbt](https://www.scala-sbt.org) build tool
- [ScalaTest](https://www.scalatest.org), a source code testing framework

We’ll start by showing how to use sbt to build your Scala projects, and then we’ll show how to use sbt and ScalaTest together to test your Scala projects.

> If you want to learn about tools to help you migrate your Scala 2 code to Scala 3, see our [Scala 3 Migration Guide](https://scalacenter.github.io/scala-3-migration-guide/).



## Building Scala projects with sbt

You can use several different tools to build your Scala projects, including Ant, Maven, Gradle, Mill, and more.
But a tool named *sbt* was the first build tool that was specifically created for Scala, and these days it’s supported by [Lightbend](https://www.lightbend.com), the company that also maintains [Akka](https://akka.io), the [Play framework](https://www.playframework.com), the [Lagom framework](https://www.lagomframework.com), and more.

> To install sbt, see [its download page](https://www.scala-sbt.org/download.html) or our [Getting Started][getting_started] page.



### Creating a “Hello, world” project

You can create an sbt “Hello, world” project in just a few steps.
First, create a directory to work in, and move into that directory:

```bash
$ mkdir hello
$ cd hello
```

Then create a file named *build.sbt* that contains this line:

```scala
scalaVersion := "{{ site.scala-3-version }}"
```

Now create a file named something like *Hello.scala*---the first part of the name doesn’t matter---with this line:

```scala
@main def helloWorld = println("Hello, world")
```

That’s all you have to do.
Now run the project with this `sbt` command:

```bash
$ sbt run
```

You should see output that looks like this, including the `"Hello, world"` from your program:

```bash
$ sbt run
[info] welcome to sbt 1.4.4 (AdoptOpenJDK Java 11.x)
[info] loading project definition from project ...
[info] loading settings for project from build.sbt ...
[info] compiling 1 Scala source to target/scala-3.0.0/classes ...
[info] running helloWorld
Hello, world
[success] Total time: 2 s
```

When you look at your directory, you’ll see that sbt has created two directories named *project* and *target*.
These are working directories that sbt uses.

As you can see, creating and running a little Scala project with sbt takes just a few simple steps.

>For sbt version < 1.5.0, it is required to have the following line in a *project/plugins.sbt* file: `addSbtPlugin("ch.epfl.lamp" % "sbt-dotty" % "{{ site.scala-3-plugin-version }}")`


### Using sbt with larger projects

For a little project, that’s all that sbt requires to run.
For larger projects that require many source code files, dependencies, or sbt plugins, you’ll want to create an organized directory structure.
The rest of this section demonstrates the structure that sbt uses.


### The sbt directory structure

Like Maven, sbt uses a standard project directory structure.
A nice benefit of that is that once you’re comfortable with its structure, it makes it easy to work on other Scala/sbt projects.

The first thing to know is that underneath the root directory of your project, sbt expects a directory structure that looks like this:

```bash
build.sbt
project/
src/
-- main/
   |-- java/
   |-- resources/
   |-- scala/
|-- test/
   |-- java/
   |-- resources/
   |-- scala/
target/
```

You can also add a *lib* directory under the root directory if you want to add unmanaged dependencies---JAR files---to your project.

If you’re going to create a project that has Scala source code files and tests, but won’t be using any Java source code files, and doesn’t need any “resources”---such as embedded images, configuration files, etc.---this is all you really need under the *src* directory:

```bash
src/
-- main/
   |-- scala/
|-- test/
   |-- scala/
```


### “Hello, world” with an sbt directory structure

{% comment %}
TODO: using something like `sbt new scala/scala3.g8` may eventually
      be preferable, but that seems to have a few bugs atm (creates
      a 'target' directory above the root; renames the root dir;
      uses 'dottyVersion'; 'name' doesn’t match the supplied name;
      config syntax is a little hard for beginners.)
{% endcomment %}

Creating this directory structure is simple.
There are tools to do this for you, but assuming that you’re using a Unix/Linux system, you can use these commands to create your first sbt project directory structure:

```bash
$ mkdir HelloWorld
$ cd HelloWorld
$ mkdir -p src/{main,test}/scala
$ mkdir project target
```

When you run a `find .` command after running those commands, you should see this result:

```bash
$ find .
.
./project
./src
./src/main
./src/main/scala
./src/test
./src/test/scala
./target
```

If you see that, you’re in great shape for the next step.

> There are other ways to create the files and directories for an sbt project.
> One way is to use the `sbt new` command, [which is documented here on scala-sbt.org](https://www.scala-sbt.org/1.x/docs/Hello.html).
> That approach isn’t shown here because some of the files it creates are more complicated than necessary for an introduction like this.


### Creating a first build.sbt file

At this point you only need two more things to run a “Hello, world” project:

- A *build.sbt* file
- A *Hello.scala* file

For a little project like this, the *build.sbt* file only needs a `scalaVersion` entry, but we’ll add three lines that you commonly see:

```scala
name := "HelloWorld"
version := "0.1"
scalaVersion := "{{ site.scala-3-version }}"
```

Because sbt projects use a standard directory structure, sbt can find everything else it needs.

Now you just need to add a little “Hello, world” program.


### A “Hello, world” program

In large projects, all of your Scala source code files will go under the *src/main/scala* and *src/test/scala* directories, but for a little sample project like this, you can put your source code file in the root directory of your project.
Therefore, create a file named *HelloWorld.scala* in the root directory with these contents:

```scala
@main def helloWorld = println("Hello, world")
```

That code defines a Scala 3 “main” method that prints the `"Hello, world"` when it’s run.

Now, use the `sbt run` command to compile and run your project:

```bash
$ sbt run

[info] welcome to sbt
[info] loading settings for project ...
[info] loading project definition
[info] loading settings for project root from build.sbt ...
[info] Compiling 1 Scala source ...
[info] running helloWorld 
Hello, world
[success] Total time: 4 s
```

The first time you run `sbt` it downloads everything it needs, and that can take a few moments to run, but after that it gets much faster.

Also, once you get this first step working, you’ll find that it’s much faster to run sbt interactively.
To do that, first run the `sbt` command by itself:

```bash
$ sbt

[info] welcome to sbt
[info] loading settings for project ...
[info] loading project definition ...
[info] loading settings for project root from build.sbt ...
[info] sbt server started at
       local:///${HOME}/.sbt/1.0/server/7d26bae822c36a31071c/sock
sbt:hello-world> _
```

Then inside this sbt shell, execute its `run` command:

````
sbt:hello-world> run

[info] running helloWorld 
Hello, world
[success] Total time: 0 s
````

There, that’s much faster.

If you type `help` at the sbt command prompt you’ll see a list of other commands you can run.
But for now, just type `exit` (or press `CTRL-D`) to leave the sbt shell.


### Other build tools for Scala

While sbt is widely used, there are other tools you can use to build Scala projects:

- [Ant](https://ant.apache.org/)
- [Gradle](https://gradle.org/)
- [Maven](https://maven.apache.org/)
- [Mill](https://com-lihaoyi.github.io/mill/)

#### Coursier

In a related note, [Coursier](https://get-coursier.io/docs/overview) is a “dependency resolver,” similar to Maven and Ivy in function.
It’s written from scratch in Scala, “embraces functional programming principles,” and downloads artifacts in parallel for rapid downloads.
sbt uses it to handle most dependency resolutions, and as a command-line tool, it can be used to easily install tools like sbt, Java, and Scala on your system, as shown in our [Getting Started][getting_started] page.

This example from the `launch` web page shows that the `cs launch` command can be used to launch applications from dependencies:

```scala
$ cs launch org.scalameta::scalafmt-cli:2.4.2 -- --help
scalafmt 2.4.2
Usage: scalafmt [options] [<file>...]

  -h, --help               prints this usage text
  -v, --version            print version
  more ...
```

See Coursier’s [launch page](https://get-coursier.io/docs/cli-launch) for more details.



## Using sbt with ScalaTest

[ScalaTest](https://www.scalatest.org) is one of the main testing libraries for Scala projects, and in this section you’ll see how to create a Scala/sbt project that uses ScalaTest.


### Creating the project directory structure

As with the previous lesson, create an sbt project directory structure for a project named *HelloScalaTest* with the following commands:

```bash
$ mkdir HelloScalaTest
$ cd HelloScalaTest
$ mkdir -p src/{main,test}/scala
$ mkdir project target
```


### Creating the build.sbt file

Next, create a *build.sbt* file in the root directory of your project with these contents:

```scala
name := "HelloScalaTest"
version := "0.1"
scalaVersion := "{{site.scala-3-version}}"

libraryDependencies ++= Seq(
  "org.scalatest" %% "scalatest" % "3.3.0-SNAP3" % Test
)
```

The first three lines of this file are essentially the same as the first example.
The `libraryDependencies` lines tell sbt to include the dependencies (JAR files) that are needed to include ScalaTest.

> The ScalaTest documentation has always been good, and you can always find the up to date information on what those lines should look like on the [Installing ScalaTest](https://www.scalatest.org/install) page.


### Create a Scala source code file

Next, create a Scala program that you can use to demonstrate ScalaTest.
First, create a directory under *src/main/scala* named *math*:

```bash
$ mkdir src/main/scala/math
            ----
```

Then, inside that directory, create a file named *MathUtils.scala* with these contents:

```scala
package math

object MathUtils:
  def double(i: Int) = i * 2
```

That method provides a simple way to demonstrate ScalaTest.


{% comment %}
Because this project doesn’t have a `main` method, we don’t try to run it with `sbt run`; we just compile it with `sbt compile`:

````
$ sbt compile

[info] welcome to sbt
[info] loading settings for project ...
[info] loading project definition ...
[info] loading settings for project ...
[info] Executing in batch mode. For better performance use sbt's shell
[success] Total time: 1 s
````

With that compiled, let’s create a ScalaTest file to test the `double` method.
{% endcomment %}


### Your first ScalaTest tests

ScalaTest is very flexible, and offers several different ways to write tests.
A simple way to get started is to write tests using the ScalaTest `AnyFunSuite`.
To get started, create a directory named *math* under the *src/test/scala* directory:

```bash
$ mkdir src/test/scala/math
            ----
```

Next, create a file named *MathUtilsTests.scala* in that directory with the following contents:

```scala
package math
  
import org.scalatest.funsuite.AnyFunSuite

class MathUtilsTests extends AnyFunSuite:

  // test 1
  test("'double' should handle 0") {
    val result = MathUtils.double(0)
    assert(result == 0)
  }

  // test 2
  test("'double' should handle 1") {
    val result = MathUtils.double(1)
    assert(result == 2)
  }
 
  test("test with Int.MaxValue") (pending)

end MathUtilsTests
```

This code demonstrates the ScalaTest `AnyFunSuite` approach.
A few important points:

- Your test class should extend `AnyFunSuite`
- You create tests as shown, by giving each `test` a unique name
- At the end of each test you should call `assert` to test that a condition has been satisfied
- When you know you want to write a test, but you don’t want to write it right now, create the test as “pending,” with the syntax shown

Using ScalaTest like this is similar to JUnit, so if you’re coming to Scala from Java, hopefully this looks similar.

Now you can run these tests with the `sbt test` command.
Skipping the first few lines of output, the result looks like this:

````
sbt:HelloScalaTest> test

[info] Compiling 1 Scala source ...
[info] MathUtilsTests:
[info] - 'double' should handle 0
[info] - 'double' should handle 1
[info] - test with Int.MaxValue (pending)
[info] Total number of tests run: 2
[info] Suites: completed 1, aborted 0
[info] Tests: succeeded 2, failed 0, canceled 0, ignored 0, pending 1
[info] All tests passed.
[success] Total time: 1 s
````

If everything works well, you’ll see output that looks like that.
Welcome to the world of testing Scala applications with sbt and ScalaTest.


### Support for many types of tests

This example demonstrates a style of testing that’s similar to xUnit *Test-Driven Development* (TDD) style testing, with a few benefits of the *Behavior-Driven Development* (BDD) style.

As mentioned, ScalaTest is flexible and you can also write tests using other styles, such as a style similar to Ruby’s RSpec.
You can also use mock objects, property-based testing, and use ScalaTest to test Scala.js code.

See the User Guide on the [ScalaTest website](https://www.scalatest.org) for more details on the different testing styles that are available.



## Where to go from here

For more information about sbt and ScalaTest, see the following resources:

- [The sbt documentation](https://www.scala-sbt.org/1.x/docs/)
- [The ScalaTest website](https://www.scalatest.org/)



[getting_started]: {{ site.baseurl }}/scala3/getting-started.html
