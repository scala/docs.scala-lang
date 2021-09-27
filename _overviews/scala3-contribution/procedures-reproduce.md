---
title: Reproduce the issue
type: section
description: This page describes reproducing an issue in the Scala 3 compiler.
num: 5
previous-page: procedures-cheatsheet
next-page: procedures-navigation
---

An issue usually contains some code that manifests some undesired behaviour. It's important to have a quick and well-defined way to reproduce the issue.

A good way to run an issue is from the sbt console opened in the Dotty project: `scalac <path to file>`. `scalac` is an sbt task defined for the Dotty project that compiles a given file.

## Dotty Issue Workspace

To simplify issue reproduction, [dotty-issue-workspace](https://github.com/anatoliykmetyuk/dotty-issue-workspace) was created. It does the same thing for sbt as shell scripts do for bash commands: it allows to bundle sbt commands for issue reproduction in one file and then run them from the Dotty project's sbt console.

The procedure of reproducing an issue with dotty-issue-workspace installed (see its README to see how) is as follows:

1. Create a folder for an issue and put the files reproducing the issue in that folder.
2. Create a file `launch.iss` and write there all sbt commands needed to reproduce an issue. See below for examples.
3. From the sbt console opened in the Dotty repo, run `issue <issue_folder_name>`. E.g. if the folder name is `i1`, the command will be `issue i1`. This will execute all the sbt commands in `launch.iss` file one by one from the Dotty project. If you've set up dotty-issue-workspace as described in its README, the `issue` task will know where to find the folder by its name.

### Examples

#### Basic

Say you want to reproduce locally issue [#7710](https://github.com/lampepfl/dotty/issues/7710). To do so:

1. Follow [steps in README](https://github.com/anatoliykmetyuk/dotty-issue-workspace#getting-started) to install the plugin
2. In your Issue Workspace folder (as defined in the plugin's README file, "Getting Started" section, step 2), create a subfolder for the issue: `mkdir i7710`
3. Create a file with the reproduction: `cd i7710; touch Test.scala`. In that file, insert the code from the issue.
4. Create a file `launch.iss` with the following content: `scala3/scalac $here/Test.scala`
5. Open sbt console in the Dotty main repo. If you still don't have the Dotty repo cloned locally, run `git clone <https://github.com/lampepfl/dotty.git`>
6. From sbt console opened in the Dotty repo, run `issue i7710` to reproduce the issue

The most basic usage for the `launch.iss` demonstrated above is as follows:
```bash
scala3/scalac $here/Test.scala
```

This will compile the `Test.scala` file in the current issue folder. `$here` is a magic variable that will be replaced by the absolute path to the issue folder.

#### Defining the Output Folder

Compiling files form Dotty's sbt shell has an undesirable effect of outputting class files to the Dotty repository directory thus polluting it. You can explicitly specify where class files should go as follows:

```bash
$ rm -rv *.tasty *.class out || true  # Remove any compiler-generated artefacts. `|| true` is needed in case no files were deleted.
$ mkdir out  # Create an output directory where all the compiler artefacts go

scala3/scalac -d $here/out $here/Test.scala # Invoke the compiler task defined by the Dotty sbt project
```

Lines starting from `$` are bash commands and not sbt ones.

#### Specifying the file to compile with a task argument

What if you have several files in your issue, say `Test.scala` and `Main.scala`, and you want to compile them selectively? If the name of your issue is `foo`, you want to be able to compile `Test.scala` file via `issue foo Test` command, and `Main.scala` – with `issue foo Main`. You can achieve this via the following `launch.iss`:

```bash
$ rm -rv *.tasty *.class out || true  # Remove any compiler-generated artefacts. `|| true` is needed in case no files were deleted.
$ mkdir out  # Create an output directory where all the compiler artefacts go

scala3/scalac -d $here/out $here/$1.scala # Invoke the compiler task defined by the Dotty sbt project
```

You can refer to arguments passed to the `issue <issue_name>` command using the dollar notation: `$1` for the first argument, `$2` for the second and so on.

This is useful, e.g., if you have one source that reproduces the issue and another one, very close to the issue reproduction, but failing to manifest the issue.

#### All together

The following template also includes some debug compiler flags, commented out. The advantage of having them is, if you need one them, you can enable it quickly by uncommenting it – as opposed to looking it up and typing it in your existing command. Put your favourite flags there for quick usage.

```bash
$ rm -rv *.tasty *.class out || true  # Remove any compiler-generated artefacts. `|| true` is needed in case no files were deleted.
$ mkdir out  # Create an output directory where all the compiler artefacts go

scala3/scalac  # Invoke the compiler task defined by the Dotty sbt project
  -d $here/out  # All the artefacts go to the `out` folder created earlier
  # -Xprint:typer  # Useful debug flags, commented out and ready for quick usage. Should you need one, you can quickly access it by uncommenting it.
  # -Ydebug-error
  # -Yprint-debug
  # -Yprint-debug-owners
  # -Yshow-tree-ids
  # -Ydebug-tree-with-id 340
  # -Ycheck:all
  $here/$1.scala  # Invoke the compiler on the file passed as the second argument to the `issue` command. E.g. `issue foo Hello` will compile `Hello.scala` assuming the issue folder name is `foo`.

scala3/scala -classpath $here/out Test  # Run the class `Test` generated by the compiler run (assuming the compiled issue contains such an entry point, otherwise comment this line)
```
