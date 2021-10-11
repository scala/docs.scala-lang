The instructions below cover both Scala 2 and Scala 3.

## Try Scala without installing anything

To start experimenting with Scala right away, use <a href="https://scastie.scala-lang.org/pEBYc5VMT02wAGaDrfLnyw" target="_blank">“Scastie” in your browser</a>.
_Scastie_ is an online “playground” where you can experiment with Scala examples to see how things work, with access to all Scala compilers and published libraries.

> Scastie supports both Scala 2 and Scala 3, but it defaults
> to Scala 3. If you are looking for a Scala 2 snippet to play with,
> [click here](https://scastie.scala-lang.org/MHc7C9iiTbGfeSAvg8CKAA).

##  Install Scala on your computer

Installing Scala means installing various command-line tools such as the Scala compiler and build tools.
We recommend using the Scala installer tool "Coursier" that automatically installs all the requirements, but you can still manually install each tool.

### Using the Scala Installer (recommended way)

The Scala installer is a tool named [Coursier](https://get-coursier.io/docs/cli-overview), whose main command is named `cs`.
It ensures that a JVM and standard Scala tools are installed on your system.
Install it on your system with the following instructions.

<div class="main-download">
    <div id="download-step-one">
        <p>Follow <a href="https://get-coursier.io/docs/cli-installation.html#native-launcher" target="_blank">the instructions to install the <code>cs</code> launcher</a> then run:</p>
        <p><code>$ ./cs setup</code></p>
    </div>
</div>


Along with managing JVMs, `cs setup` also installs useful command-line tools:

- A JDK (if you don't have one already)
- The [sbt](https://www.scala-sbt.org/) build tool
- [Ammonite](https://ammonite.io/), an enhanced REPL
- [scalafmt](https://scalameta.org/scalafmt/), the Scala code formatter
- `scalac` (the Scala 2 compiler)
- `scala` (the Scala 2 REPL and script runner).

For more information about `cs`, read
[coursier-cli documentation](https://get-coursier.io/docs/cli-overview).

> Currently, `cs setup` installs the Scala 2 compiler and runner (the `scalac` and
> `scala` commands, respectively). This is usually not an issue because most projects
> use a build tool that works with both Scala 2 and Scala 3.
> Nevertheless, you can install the Scala 3 compiler and runner as command-line tools
> by running the following additional commands:
> ```
> $ cs install scala3-compiler
> $ cs install scala3
> ```

### ...or manually

You only need two tools to compile, run, test, and package a Scala project: Java 8 or 11,
and sbt.
To install them manually:

1. if you don't have Java 8 or 11 installed, download
   Java from [Oracle Java 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html), [Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html),
   or [AdoptOpenJDK 8/11](https://adoptopenjdk.net/). Refer to [JDK Compatibility](/overviews/jdk-compatibility/overview.html) for Scala/Java compatibility detail.
1. Install [sbt](https://www.scala-sbt.org/download.html)

## Create a "Hello World" project with sbt

Once you have installed sbt, you are ready to create a Scala project, which
is explained in the following sections.

To create a project, you can either use the command line or an IDE.
If you are familiar with the command line, we recommend that approach.

### Using the command line

sbt is a build tool for Scala. sbt compiles, runs,
and tests your Scala code. (It can also publish libraries and do many other tasks.)

To create a new Scala project with sbt:

1. `cd` to an empty folder.
1. Run the command `sbt new scala/scala3.g8` to create a Scala 3 project, or `sbt new scala/hello-world.g8` to create a Scala 2 project.
   This pulls a project template from GitHub.
   It will also create a `target` folder, which you can ignore.
1. When prompted, name the application `hello-world`. This will
   create a project called "hello-world".
1. Let's take a look at what just got generated:

```
- hello-world
    - project (sbt uses this for its own files)
        - build.properties
    - build.sbt (sbt's build definition file)
    - src
        - main
            - scala (all of your Scala code goes here)
                - Main.scala (Entry point of program) <-- this is all we need for now
```

More documentation about sbt can be found in the [Scala Book](/scala3/book/tools-sbt.html) (see [here](/overviews/scala-book/scala-build-tool-sbt.html) for the Scala 2 version)
and in the official sbt [documentation](https://www.scala-sbt.org/1.x/docs/index.html)

### With an IDE

You can skip the rest of this page and go directly to [Building a Scala Project with IntelliJ and sbt](/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html)


## Open hello-world project

Let's use an IDE to open the project. The most popular ones are IntelliJ and VSCode.
They both offer rich IDE features, but you can still use [many other editors.](https://scalameta.org/metals/docs/editors/overview.html)

### Using IntelliJ

1. Download and install [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/)
1. Install the Scala plugin by following [the instructions on how to install IntelliJ plugins](https://www.jetbrains.com/help/idea/managing-plugins.html)
1. Open the `build.sbt` file then choose *Open as a project*

### Using VSCode with metals

1. Download [VSCode](https://code.visualstudio.com/Download)
1. Install the Metals extension from [the Marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals)
1. Next, open the directory containing a `build.sbt` file (this should be the directory `hello-world` if you followed the previous instructions). When prompted to do so, select *Import build*.

>[Metals](https://scalameta.org/metals) is a “Scala language server” that provides support for writing Scala code in VS Code and other editors like [Atom, Sublime Text, and more](https://scalameta.org/metals/docs/editors/overview.html), using the Language Server Protocol.
>
> Under the hood, Metals communicates with the build tool by using
> the [Build Server Protocol (BSP)](https://build-server-protocol.github.io/). For details on how Metals works, see, [“Write Scala in VS Code, Vim, Emacs, Atom and Sublime Text with Metals”](https://www.scala-lang.org/2019/04/16/metals.html).

### Play with the source code

View these two files in your IDE:

- _build.sbt_
- _src/main/scala/Main.scala_

When you run your project in the next step, the configuration in _build.sbt_ will be used to run the code in _src/main/scala/Main.scala_.

## Run Hello World

If you’re comfortable using your IDE, you can run the code in _Main.scala_ from your IDE.

Otherwise, you can run the application from a terminal with these steps:

1. `cd` into `hello-world`.
1. Run `sbt`. This opens up the sbt console.
1. Type `~run`. The `~` is optional and causes sbt to re-run on every file save,
   allowing for a fast edit/run/debug cycle. sbt will also generate a `target` directory
   which you can ignore.

When you’re finished experimenting with this project, press `[Enter]` to interrupt the `run` command.
Then type `exit` or press `[Ctrl+D]` to exit sbt and return to your command line prompt.

## Next Steps

Once you've finished the above tutorials, consider checking out:

* [The Scala Book](/scala3/book/introduction.html) (see the Scala 2 version [here](/overviews/scala-book/introduction.html)), which provides a set of short lessons introducing Scala’s main features.
* [The Tour of Scala](/tour/tour-of-scala.html) for bite-sized introductions to Scala's features.
* [Learning Resources](/learn.html), which includes online interactive tutorials and courses.
* [Our list of some popular Scala books](/books.html).
* [The migration guide](/scala3/guides/migration/compatibility-intro.html) helps you to migrate your existing Scala 2 code base to Scala 3.

## Getting Help
There are a multitude of mailing lists and real-time chat rooms in case you want to quickly connect with other Scala users. Check out our [community](https://scala-lang.org/community/) page for a list of these resources, and for where to reach out for help.

<!-- Hidden elements whose content are used to provide OS-specific download instructions.
 -- This is handled in `resources/js/functions.js`.
 --> 
<div style="display:none" id="stepOne-linux">
       <code class="hljs">$ curl -fLo cs https://git.io/coursier-cli-linux && chmod +x cs && ./cs setup </code> <br>
</div>

<div style="display:none" id="stepOne-unix">
    <p>Follow <a href="https://get-coursier.io/docs/cli-installation" target="_blank">the instructions to install the <code>cs</code> launcher</a> then run:</p>
    <p><code>$ ./cs setup</code></p>
</div>

<div style="display:none" id="stepOne-osx">
    <div class="highlight">
        <code class="hljs">$ brew install coursier/formulas/coursier && cs setup </code> <br>
    </div>
    <p>Alternatively, if you don't use Homebrew</p>
    <div class="highlight">
        <code class="hljs">$ curl -fLo cs https://git.io/coursier-cli-macos && chmod +x cs &&  (xattr -d com.apple.quarantine cs || true) && ./cs setup</code> <br>
    </div>
</div>

<div style="display:none" id="stepOne-windows">
    <p>Download and execute <a href="https://git.io/coursier-cli-windows-exe">the Scala installer for Windows</a> based on coursier</p>
</div>
