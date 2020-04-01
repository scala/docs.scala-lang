---
layout: singlepage-overview
title: Getting Started
partof: getting-started
languages: [ja]
includeTOC: true

redirect_from: "/getting-started.html"
---
## Try Scala without installing anything 
You can [try Scala in your browser](https://scastie.scala-lang.org/MHc7C9iiTbGfeSAvg8CKAA), with access to all Scala compilers and 
all published libraries.

##  Installing Scala
### Using the Scala Installer (recommended way)
The Scala installer is a tool named `cs` that ensures that a JVM and standard Scala tools are installed on your system.  

* Download the `cs` tool and execute the `setup` command

<div class="main-download">
    <div id="download-step-one">
        <p>Follow <a href="https://get-coursier.io/docs/cli-overview.html#install-native-launcher" target="_blank">the instructions to install the <code>cs</code> launcher</a> then run:</p>
        <p><code>$ ./cs setup</code></p>
    </div>
</div>


Along with managing JVMs, it also installs useful command line tools: 
ammonite, coursier, scala, scalac, sbt-launcher, scalafmt.

For more information, read [coursier-cli documentation](https://get-coursier.io/docs/cli-overview)

### ...Or manually
1. if you don't have Java 1.8 or 11 installed, download 
Java from [Oracle Java 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html), [
Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html), 
or [AdoptOpenJDK 8/11](https://adoptopenjdk.net/). Refer [JDK Compatibility](/overviews/jdk-compatibility/overview.html) for Scala/Java compatibility detail.
1. Install [sbt](https://www.scala-sbt.org/download.html)


## Create a Hello-world project with sbt
### Using command-line
sbt is a build tool for Scala. sbt compiles, runs, 
and tests your projects among other related tasks.

1. `cd` to an empty folder.
1. Run the following command `sbt new scala/hello-world.g8`.
This pulls the 'hello-world' template from GitHub.
It will also create a `target` folder, which you can ignore.
1. When prompted, name the application `hello-world`. This will
create a project called "hello-world".
1. Let's take a look at what just got generated:

```
- hello-world
    - project (sbt uses this to install and manage plugins and dependencies)
        - build.properties
    - src
        - main
            - scala (All of your scala code goes here)
                - Main.scala (Entry point of program) <-- this is all we need for now
    - build.sbt (sbt's build definition file)
```

More documentation about sbt can be found in the [Scala Book](/overviews/scala-book/scala-build-tool-sbt.html) 
or in the official sbt [documentation](https://www.scala-sbt.org/1.x/docs/index.html)

### Without using command-line
You can skip the rest of this page and go directly to [Building a Scala Project with IntelliJ and sbt](/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html#next-steps)


## Open hello-world project
### Using Intellij
1. Download and install [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/)
1. Install Scala plugin by following [the instructions on how to install IntelliJ plugins](https://www.jetbrains.com/help/idea/managing-plugins.html)
1. Open the `build.sbt` file then choose *Open as a project*

### Using VSCode with metals 
1. Download [VSCode](https://code.visualstudio.com/Download)
1. Install the Metals extension from [the Marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals)
1. Next, open the directory containing a `build.sbt` file. When prompted to do so, select *Import build*.

## Run Hello World
Open a terminal
1. `cd` into `hello-world`.
1. Run `sbt`. This will open up the sbt console.
1. Type `~run`. The `~` is optional and causes sbt to re-run on every file save,
allowing for a fast edit/run/debug cycle. sbt will also generate a `target` directory
which you can ignore.


## Next Steps
Once you've finished these tutorials, check out:

* [The Scala Book](/overviews/scala-book/introduction.html), which provides a set of short lessons introducing Scala’s main features.
* [The Tour of Scala](/tour/tour-of-scala.html) for bite-sized introductions to Scala's features.
* [Learning Resources](/learn.html), which includes online interactive tutorials and courses.
* [Our list of some popular Scala books](/books.html).

## Getting Help
There are a multitude of mailing lists and real-time chat channels in case you want to quickly connect with other Scala users. Check out our [community](https://scala-lang.org/community/) page for a list of these resources, and for where to reach out for help.

<!-- Hidden elements whose content are used to provide OS-specific download instructions.
 -- This is handled in `resources/js/functions.js`.
 --> 
<div style="display:none" id="stepOne-linux">
       <code class="hljs">$ curl -Lo cs https://git.io/coursier-cli-linux && chmod +x cs && ./cs setup </code> <br>
</div>
 
<div style="display:none" id="stepOne-unix">
    <p>Follow <a href="https://get-coursier.io/docs/cli-overview.html#install-native-launcher" target="_blank">the instructions to install the <code>cs</code> launcher</a> then run:</p>
    <p><code>$ ./cs setup</code></p>
</div>
 
<div style="display:none" id="stepOne-osx">
    <div class="highlight">
        <code class="hljs">$ brew install coursier/formulas/coursier && cs setup </code> <br>
    </div>
    <p>Alternatively, if you don't use Homebrew</p>
    <div class="highlight">
        <code class="hljs">$ curl -Lo cs https://git.io/coursier-cli-macos && chmod +x cs &&  (xattr -d com.apple.quarantine cs || true) && ./cs  setup </code> <br>
    </div>
</div>
  
<div style="display:none" id="stepOne-windows">
    <p>Download and execute <a href="https://git.io/coursier-cli-windows-exe">the Scala installer for Windows</a> based on coursier</p>
</div>
