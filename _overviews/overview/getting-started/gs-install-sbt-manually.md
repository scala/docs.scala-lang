---
title: Installing sbt Manually
description: This page describes how to install sbt so you can compile Scala 3 projects.
---


The preferred way to install sbt (and the other tools you need) [is by using Coursier](gs-install-coursier.md). But if you want to use other approaches, this page describes several other options.



## Install sbt with SDKMAN

If you’re comfortable with [SDKMAN](https://sdkman.io), you can install sbt with this `sdk` command:

```sh
sdk install sbt
```



## Install sbt manually

If you prefer to install your development tools manually, you can download the latest version of sbt from the [sbt download page](https://www.scala-sbt.org/download.html), and then install it.

On a macOS or Linux system, download the latest version and then unpack it on your system. For instance, if you keep tools like this in a *bin* directory under your `HOME` directory, unpack the archive file you downloaded underneath your *~/bin* directory. When you’re finished you should have a new *~/bin/sbt* directory on your system.

Now just add sbt’s *bin* directory to your `PATH` variable in your startup file:

```
PATH=$PATH:~/bin/sbt/bin
```

Follow a similar technique use sbt on Windows.



## Other installation options

You can also use other approaches to install sbt. See these pages for more details:

- [Installing sbt on macOS](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Mac.html)
- [Installing sbt on Windows](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Windows.html)
- [Installing sbt on Linux](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Linux.html)













