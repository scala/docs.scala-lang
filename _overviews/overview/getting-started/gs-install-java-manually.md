---
title: Installing Java and sbt
description: This section describes how to get started with Scala 3 by installing Java and sbt.
---

<!--
- This page (https://www.scala-lang.org/download/) has other installation info.
-->


The preferred way to install tools like Java, sbt, and scalac/scala [is by using Coursier](gs-install-coursier.md). But if you want to use other approaches, this page describes several other options.



## Installing Java and sbt

The [*sbt* build tool](https://www.scala-sbt.org) lets you build Scala projects on your computer. sbt can download everything it needs to compile Scala projects, and the only thing it requires is that you have a Java development kit installed on your computer.

Therefore, the two steps to getting sbt running are:

1. Install the Java 8 or Java 11 JDK
1. Install sbt

These steps are explained in detail below.

>Once you have these two tools installed, you can [compile the “Hello, world” project using sbt](gs-hello-world-examples.md).
<!-- TODO: link to the second section of the “Hello, world” doc? -->



## 1) Install Java

If you already have the Java 8 or the Java 11 JDK installed on your computer, skip to the [installing sbt section](#install-sbt).
<!-- TODO: link to the next section -->

Otherwise, you’ll need to install one of them so you can use sbt. There are several ways to do this:

- Install a JDK manually
- Install a JDK with a tool


### a) Install a JDK manually

You can manually download and install the Java 8 or Java 11 JDK from these URLs:

- [Oracle Java 8](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)
- [Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [AdoptOpenJDK 8/11](https://adoptopenjdk.net/)

If you’re not sure which version to choose, install the latest version of OpenJDK 11 from the AdoptOpenJDK website.


### b) Install a SDK with a tool

If you don’t want to manually install a JDK, you can also use several different tools to install and manage them.

#### Coursier

As discussed in [Installing Scala tools with Coursier page](gs-install-coursier.md), you can use Coursier to install all of the tools you need. But if you just want to install a JDK with Coursier, you can do that as well.

The first thing you need to do is to install Coursier on your system. The <a href="https://get-coursier.io/docs/cli-installation" target="_blank">Coursier installation page</a> shows how to install Coursier and its `cs` command on macOS, Windows, and Linux systems. See that page for how to install Coursier, and then come back to this page.

Once you have Coursier installed, use this command to install the latest Java 11 JDK:

```sh
cs java --jvm 11
```

If you’ve already installed Java 11 with Coursier, that command simply runs the `java` command, but if it’s not installed, that command downloads and installs the latest version of AdoptOpenJDK 11.

On a macOS system, the JDK is installed in this directory:

```
~/Library/Caches/Coursier/jvm/adopt@1.11.0-9
```

You can see the `JAVA_HOME` environment by running this Coursier command:

```sh
$ cs java-home
/Users/al/Library/Caches/Coursier/jvm/adopt@1.11.0-9/Contents/Home
```

If you want an automated way to set the `JAVA_HOME` variable, this command results in the necessary `export` command:

```sh
$ cs java --jvm 11 --env
export JAVA_HOME="/Users/al/Library/Caches/Coursier/jvm/adopt@1.11.0-9/Contents/Home"
```

You can use that command to set your `JAVA_HOME` variable like this:

```sh
$ eval "$(cs java --jvm 11 --env)"
```

See the Coursier [Overview page](https://get-coursier.io/docs/cli-overview) and [Install page](https://get-coursier.io/docs/cli-install) for more details on using Coursier.


#### Mac/Homebrew

If you’re using macOS and like using Homebrew, you can install Java with the `brew` command. The installation commands have varied over time, but the general approach is to install Homebrew Cask, and then install Java.

To install Homebrew Cask, use these commands:

```sh
brew tap homebrew/cask-versions
brew update
brew tap caskroom/cask
```

After running those commands, install your desired Java version with these commands:

<!-- TODO:  -->
```sh
brew tap adoptopenjdk/openjdk

brew cask install adoptopenjdk8
brew cask install adoptopenjdk11
```

<!--
- TODO: i found several different versions of these instructions
- ALSO: `brew cask install java11`
- SEE: https://devqa.io/brew-install-java/
-->


#### SDKMAN

If you like to use [SDKMAN](https://sdkman.io), you can install the latest Java version with this command:

<!-- TODO: i have found several different versions of this command -->
```sh
sdk install java 11.0.9.hs-adpt
```



## <a name="install-sbt"></a>2) Install sbt

Once you have JDK 8 or 11 installed, it’s time to install sbt. The sbt website has directions on [how to install sbt](https://www.scala-sbt.org/1.x/docs/Setup.html) on macOS, Windows, and Linux.


### Install sbt with Coursier

List installed JDKs:

> cs java --installed
adopt:1.8.0-252
adopt:1.11.0-7
adopt:1.11.0-8
adopt:1.11.0-9
adopt:1.14.0-1

List available JDKs
Lists 303 availble:

  cs java --available

  > cs java --available | grep adopt | grep 11
  adopt:1.11.0-0
  adopt:1.11.0-1
  adopt:1.11.0-2
  adopt:1.11.0-3
  adopt:1.11.0-4
  adopt:1.11.0-5
  adopt:1.11.0-6
  adopt:1.11.0-7
  adopt:1.11.0-8
  adopt:1.11.0-9






### Install sbt manually

To install sbt manually, download the latest version of sbt from the [sbt download page](https://www.scala-sbt.org/download.html).

On a macOS or Linux system, download that version and then unpack it on your system. For instance, if you keep tools like this in a *bin* directory under your `HOME` directory, unpack the zip or tgz file you download underneath that *~/bin* directory. When you’re finished you should have a new *~/bin/sbt* directory on your system.

Now just add sbt’s *bin* directory to your `PATH` variable in your startup file:

```
PATH=$PATH:~/bin/sbt/bin
```


### Install sbt with SDKMAN

The [sbt download page](https://www.scala-sbt.org/download.html) shows that you can install sbt with this SDKMAN command:

```sh
sdk install sbt
```









