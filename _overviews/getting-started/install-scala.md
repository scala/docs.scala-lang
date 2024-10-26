---
layout: singlepage-overview
title: Getting Started
partof: getting-started
languages: [fr, ja, ru, uk]
includeTOC: true
newcomer_resources:
  - title: Are You Coming From Java?
    description: What you should know to get to speed with Scala after your initial setup.
    icon: "fa fa-coffee"
    link: /tutorials/scala-for-java-programmers.html
  - title: Scala in the Browser
    description: >
      To start experimenting with Scala right away, use "Scastie" in your browser.
    icon: "fa fa-cloud"
    link: https://scastie.scala-lang.org/pEBYc5VMT02wAGaDrfLnyw

redirect_from:
  - /getting-started.html
  - /scala3/getting-started.html # we deleted the scala 3 version of this page
---

The instructions below cover both Scala 2 and Scala 3.

<div class="inline-sticky-top">
{% altDetails need-help-info-box 'Need Help?' class=help-info %}
*If you are having trouble with setting up Scala, feel free to ask for help in the `#scala-users` channel of
[our Discord](https://discord.com/invite/scala).*
{% endaltDetails %}
</div>

## Resources For Newcomers

{% include inner-documentation-sections.html links=page.newcomer_resources %}

##  Install Scala on your computer

Installing Scala means installing various command-line tools such as the Scala compiler and build tools.
We recommend using the Scala installer tool "Coursier" that automatically installs all the requirements, but you can still manually install each tool.

### Using the Scala Installer (recommended way)

The Scala installer is a tool named [Coursier](https://get-coursier.io/docs/cli-overview), whose main command is named `cs`.
It ensures that a JVM and standard Scala tools are installed on your system.
Install it on your system with the following instructions.

<!-- Display tabs for each OS -->
{% tabs install-cs-setup-tabs class=platform-os-options %}

<!-- macOS -->
{% tab macOS for=install-cs-setup-tabs %}
Run the following command in your terminal, following the on-screen instructions:
{% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-brew %}
{% altDetails cs-setup-macos-nobrew  "Alternatively, if you don't use Homebrew:" %}
  On the Apple Silicon (M1, M2, …) architecture:
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-arm64 %}
  Otherwise, on the x86-64 architecture:
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-x86-64 %}
{% endaltDetails %}
{% endtab %}
<!-- end macOS -->

<!-- Linux -->
{% tab Linux for=install-cs-setup-tabs %}
  Run the following command in your terminal, following the on-screen instructions.

  On the x86-64 architecture:
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.linux-x86-64 %}
  Otherwise, on the ARM64 architecture:
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.linux-arm64 %}
{% endtab %}
<!-- end Linux -->

<!-- Windows -->
{% tab Windows for=install-cs-setup-tabs %}
  Download and execute [the Scala installer for Windows]({{site.data.setup-scala.windows-link}})
  based on Coursier, and follow the on-screen instructions.
{% endtab %}
<!-- end Windows -->

<!-- Other -->
{% tab Other for=install-cs-setup-tabs defaultTab %}
  <noscript>
    <p><span style="font-style:italic;">JavaScript is disabled, click the tab relevant for your OS.</span></p>
  </noscript>
  Follow the documentation from Coursier on
    [how to install and run `cs setup`](https://get-coursier.io/docs/cli-installation).
{% endtab %}
<!-- end Other -->

{% endtabs %}
<!-- End tabs -->

> <i class="fa fa-info"></i>&nbsp;&nbsp; You may need to restart your terminal, log out,
> or reboot in order for the changes to take effect.
{: .help-info}

<!-- Alternative Detail - test the `scala` command -->
{% altDetails testing-your-setup 'Testing your setup' %}
Check your setup with the command `scala -version`, which should output:
```bash
$ scala -version
Scala code runner version: 1.4.3
Scala version (default): {{site.scala-3-version}}
```
{% endaltDetails %}
<!-- end Alternative Detail -->


Along with managing JVMs, `cs setup` also installs useful command-line tools:

| Commands | Description |
|----------|-------------|
| `scalac` | the Scala compiler |
| `scala`, `scala-cli` | [Scala CLI](https://scala-cli.virtuslab.org), interactive toolkit for Scala |
| `sbt`, `sbtn` | The [sbt](https://www.scala-sbt.org/) build tool |
| `amm` | [Ammonite](https://ammonite.io/) is an enhanced REPL |
| `scalafmt` | [Scalafmt](https://scalameta.org/scalafmt/) is the Scala code formatter |

For more information about `cs`, read
[coursier-cli documentation](https://get-coursier.io/docs/cli-overview).

> `cs setup` installs the Scala 3 compiler and runner by default (the `scalac` and
> `scala` commands, respectively). Whether you intend to use Scala 2 or 3,
> this is usually not an issue because most projects use a build tool that will
> use the correct version of Scala irrespective of the one installed "globally".
> Nevertheless, you can always launch a specific version of Scala using
> ```
> $ cs launch scala:{{ site.scala-version }}
> $ cs launch scalac:{{ site.scala-version }}
> ```
> If you prefer Scala 2 to be run by default, you can force that version to be installed with:
> ```
> $ cs install scala:{{ site.scala-version }} scalac:{{ site.scala-version }}
> ```

### ...or manually

You only need two tools to compile, run, test, and package a Scala project: Java 8 or 11,
and Scala CLI.
To install them manually:

1. if you don't have Java 8 or 11 installed, download
   Java from [Oracle Java 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html), [Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html),
   or [AdoptOpenJDK 8/11](https://adoptopenjdk.net/). Refer to [JDK Compatibility](/overviews/jdk-compatibility/overview.html) for Scala/Java compatibility detail.
1. Install [Scala CLI](https://scala-cli.virtuslab.org/install)

## Using the Scala CLI

In a directory of your choice, which we will call `<project-dir>`, create a file named `hello.scala` with the following code:
```scala
//> using scala {{site.scala-3-version}}

@main
def hello(): Unit =
  println("Hello, World!")
```

You can define a method with the `def` keyword and mark it as a "main" method with the `@main` annotation, designating it as
the entry point in program execution. The method's type is `Unit`, which means it does not return a value. `Unit`
can be thought of as an analogue to the `void` keyword found in other languages. The `println` method will print the `"Hello, World!"`
string to standard output.

To run the program, execute `scala run hello.scala` command from a terminal, within the `<project-dir>` directory. The file will be compiled and executed, with console output
similar to following:
```
$ scala run hello.scala
Compiling project (Scala {{site.scala-3-version}}, JVM (20))
Compiled project (Scala {{site.scala-3-version}}, JVM (20))
Hello, World!
```

### Handling command-line arguments

Rewrite the `hello.scala` file so that the program greets the person running it.
```scala
//> using scala {{site.scala-3-version}}

@main
def hello(name: String): Unit =
  println(s"Hello, $name!")
```

The `name` argument is expected to be provided when executing the program, and if it's not found, the execution will fail.
The `println` method receives an interpolated string, as indicated by the `s` letter preceding its content. `$name` will be substituted by
the content of the `name` argument.

To pass the arguments when executing the program, put them after `--`:
```
$ scala run hello.scala -- Gabriel
Compiling project (Scala {{site.scala-3-version}}, JVM (20))
Compiled project (Scala {{site.scala-3-version}}, JVM (20))
Hello, Gabriel!
```

You can read more about [main methods](/scala3/book/methods-main-methods.html) and [string interpolation](/scala3/book/string-interpolation.html) in the Scala Book.

### Adding dependencies

We now write a program that will count the files and directories present in its working directory.
We use the [os-lib](https://github.com/com-lihaoyi/os-lib) library from the [Scala toolkit](/toolkit/introduction.html)
for that purpose. A dependency on the library can be added with the `//> using` directive. Put the following code in `counter.scala`.
```scala
//> using scala {{site.scala-3-version}}
//> using dep "com.lihaoyi::os-lib:0.10.7"

@main
def countFiles(): Unit =
  val paths = os.list(os.pwd)
  println(paths.length)
```

In the code above, `os.pwd` returns the current working directory. We pass it to `os.list`, which returns a sequence
of paths directly within the directory passed as an argument. We use a `val` to declare an immutable value, in this example storing the
sequence of paths.

Execute the program. The dependency will be automatically downloaded. The execution should result in a similar output:
```
$ scala run counter.scala
Compiling project (Scala {{site.scala-3-version}}, JVM (20))
Compiled project (Scala {{site.scala-3-version}}, JVM (20))
4
```
The printed number should be 4: `hello.scala`, `counter.scala` and two hidden directories created automatically when a program is executed:
`.bsp` containing information about project used by IDEs, and `.scala-build` containing the results of compilation.

As it turns out, the `os-lib` library is a part of Scala Toolkit, a collection of libraries recommended for tasks like testing,
operating system interaction or handling JSONs. You can read more about the libraries included in the toolkit [here](/toolkit/introduction.html).
To include the toolkit libraries, use the `//> using toolkit 0.5.0` directive:
```scala
//> using scala {{site.scala-3-version}}
//> using toolkit 0.5.0

@main
def countFiles(): Unit =
  val paths = os.list(os.pwd)
  println(paths.length)
```

This program is identical to the one above. However, other toolkit libraries will also be available to use, should you need them.

### Using the REPL

You can execute code interactively using the REPL provided by the `scala` command. Execute `scala` in the console without any arguments.
```
$ scala
Welcome to Scala {{site.scala-3-version}} (20-ea, Java OpenJDK 64-Bit Server VM).
Type in expressions for evaluation. Or try :help.

scala>
```

Write a line of code to be executed and press enter.
```
scala> println("Hello, World!")
Hello, World!

scala>
```

The result will be printed immediately after executing the line. You can declare values:
```
scala> val i = 1
val i: Int = 1

scala>
```

A new value of type `Int` has been created. If you provide an expression that can be evaluated, its result will be stored in an automatically created value.
```
scala> i + 3
val res0: Int = 4

scala>
```
You can exit the REPL with `:exit`.

## Using an IDE

> You can read a short summary of Scala IDEs on [a dedicated page](/getting-started/scala-ides.html).

Let's use an IDE to open the code we wrote above. The most popular ones are [IntelliJ](https://www.jetbrains.com/idea/) and
[VSCode](https://scalameta.org/metals/docs/editors/vscode).
They both offer rich IDE features, but you can still use [many other editors](https://scalameta.org/metals/docs/editors/overview.html).

### Prepare the project

First, remove all the using directives, and put them in a single file `project.scala` in the `<project-dir>` directory.
This makes it easier to import as a project in an IDE:

```scala
//> using scala {{site.scala-3-version}}
//> using toolkit 0.5.0
```

> Optionally, you can re-initialise the necessary IDE files from within the `<project-dir>` directory with the command `scala setup-ide .`, but these files will already exist if you have previously run the project with the Scala CLI `run` command.

### Using IntelliJ

1. Download and install [IntelliJ Community Edition](https://www.jetbrains.com/help/idea/installation-guide.html)
1. Install the Scala plugin by following [the instructions on how to install IntelliJ plugins](https://www.jetbrains.com/help/idea/discover-intellij-idea-for-scala.html)
1. Open the `<project-dir>` directory, which should be imported automatically as a BSP project.

### Using VSCode with Metals

1. Download [VSCode](https://code.visualstudio.com/Download)
1. Install the Metals extension from [the Marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals)
1. Next, open the `<project-dir>` directory in VSCode. Metals should activate and begin importing the project automatically.

### Play with the source code

View these three files in your IDE:

- _project.scala_
- _hello.scala_
- _counter.scala_

You should notice the benefits of an IDE, such as syntax highlighting, and smart code interactions.
For example you can place the cursor over any part of the code, such as `os.pwd` in _counter.scala_ and documentation for the method will appear.

When you run your project in the next step, the configuration in _project.scala_ will be used to run the code in the other source files.

### Run the code

If you’re comfortable using your IDE, you can run the code in _counter.scala_ from your IDE.
Attached to the `countFiles` method should be a prompt button. Click it to run the method. This should run without issue.
The `hello` method in _hello.scala_ needs arguments however, so will require extra configuration via the IDE to provide the argument.

Otherwise, you can run either application from the IDE's built-in terminal as described in above sections.

## Next steps

Now that you have tasted a little bit of Scala, you can further explore the language itself, consider checking out:

* [The Scala Book](/scala3/book/introduction.html) (see the Scala 2 version [here](/overviews/scala-book/introduction.html)), which provides a set of short lessons introducing Scala’s main features.
* [The Tour of Scala](/tour/tour-of-scala.html) for bite-sized introductions to Scala's features.
* [Learning Resources](/learn.html), which includes online interactive tutorials and courses.
* [Our list of some popular Scala books](/books.html).

There are also other tutorials for other build-tools you can use with Scala:
* [Getting Started with Scala and sbt](/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html)
* [Using Scala and Maven](/tutorials/scala-with-maven.html)

## Getting Help
There are a multitude of mailing lists and real-time chat rooms in case you want to quickly connect with other Scala users. Check out our [community](https://scala-lang.org/community/) page for a list of these resources, and for where to reach out for help.
