---
title: Installing Scala Tools with Coursier
description: This section describes how to get started with Scala 3 by using the Coursier command line tool to install everything you need.
---


If you don’t already have Java and [sbt](https://www.scala-sbt.org) installed on your system, and you’d like a simple way to install those two tools — along with other popular tools in the Scala ecosystem — a great way to install them is with a tool named [Coursier](https://get-coursier.io/docs/cli-overview).

[Coursier](https://get-coursier.io/docs/cli-overview) is an “artifact-fetching” tool written in Scala. It’s designed to fetch dependencies and work in parallel, so the artifacts you need are rapidly downloaded.



## What Coursier does for you

Once Coursier is installed, you can run this one command to set up everything you need:

```sh
cs setup
```

<!-- TODO: be more clear about “if it’s not already installed” -->
That command installs all of the following software, if it’s not already installed:

- A JDK
- The [sbt](https://www.scala-sbt.org) and [mill](https://www.lihaoyi.com/mill) build tools
- [Ammonite](https://ammonite.io), an enhanced REPL
- [scalafmt](https://scalameta.org/scalafmt/), the Scala formatter
- The [Coursier CLI](https://get-coursier.io/docs/cli-overview), to install further Scala-based applications
- The `scala` and `scalac` command-line tools
<!-- TODO: be more clear about what JDK is installed -->

Later, when you want to update those tools, use this command to update the installation:
<!-- TODO: be more clear about what `update` means -->

```sh
cs update
```



## Install Coursier

Therefore, the first thing you need is to install Coursier on your system.

The <a href="https://get-coursier.io/docs/cli-installation" target="_blank">Coursier installation page</a> shows how to install Coursier and its `cs` command on macOS, Windows, and Linux systems. See that page for how to install Coursier, and then come back to this page.

<!-- this code is used on the Scala 2 Getting Started page -->
<!-- Hidden elements whose content are used to provide OS-specific download instructions.
 -- This is handled in `resources/js/functions.js`.
 --> 
<!--
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
-->



## Run the Coursier setup command

<!-- TODO: need to be more clear about what JDK is installed -->
Once Coursier is installed, run this `cs` command to install a JDK, sbt, and the other tools mentioned above:

```sh
cs setup
```
<!-- TODO: show the Coursier output here -->

>If you prefer more control on what the `cs` command does, see [the `cs setup` page](https://get-coursier.io/docs/cli-setup) for more configuration options.

After that command runs, you can verify that the tools you need are installed on your system and in your `PATH` with these commands:

```sh
$ java -version
$ sbt --script-version
```

The output of those commands should show that you now have Java 11 and sbt 1.4.4 or newer installed. Assuming that worked, you’re now ready to create a “Hello, world” project with Scala 3 and sbt.



## What’s next

With Java and sbt installed on your system, you’re ready for the next step:

- [How to create and run a Scala 3 “Hello, world” project](gs-hello-world-sbt.md)








