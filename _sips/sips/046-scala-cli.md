---
layout: sip
number: 46
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
stage: completed
status: shipped
title: Scala CLI as default Scala command
---

**By: Krzysztof Romanowski and  Scala CLI team**

## History

| Date          | Version            |
|---------------|--------------------|
| July 15th 2022 | Initial Draft      |

## Summary

We propose to replace current script that is installed as `scala` with Scala CLI - a batteries included tool to interact with Scala. Scala CLI brings all the features that the commands above provide and expand them with incremental compilation, dependency management, packaging and much more.

Even though Scala CLI could replace `scaladoc` and `scalac` commands as well for now, we do not propose to replace them.


## Motivation

The current default `scala` script is quite limited since it can only start repl or run pre-compile Scala code.

The current script are lacking basic features such as support for resolving dependencies, incremental compilation or support for outputs other than JVM. This forces any user that wants to do anything more than just basic things to learn and use SBT, Mill or an other build tool and that adds to the complexity of learning Scala.

We observe that the current state of tooling in Scala is limiting creativity, with quite a high cost to create e.g. an application or a script with some dependencies that target Node.js. Many Scala developers are not choosing Scala for their personal projects, scripts, or small applications and we believe that the complexity of setting up a build tool is one of the reasons.

With this proposal our main goal is to turn Scala into a language with "batteries included" that will also respect the community-first aspect of our ecosystem.

### Why decided to work on Scala CLI rather then improve existing tools like sbt or Mill?

Firstly, Scala CLI is in no way an actual replacement for SBT or Mill - nor was it ever meant to be. We do not call it a build tool, even though it does share some similarities with build tools. It doesn't aim at supporting multi-module
projects, nor to be extended via a task system. The main advantages of SBT and Mill: multi-module support and plugin ecosystem in the use cases for Scala CLI and scala command can often be disadvantages as it affects performance: configuration needs to be compiled, plugins resolved etc.

Mill and SBT uses turing complete configuration for build so the complexity of build scripts in theory is unlimited. Scala CLI is configuration-only and that limits the complexity what put a hard cap how complex Scala CLI builds can be.

`scala` command should be first and foremost a command line tool. Requirements for a certain project structure or presence configuration files limit SBT and Mill usability certain use cases related to command line.

One of the main requirements for the new `scala` commands was speed, flexibility and focus on command-line use cases. Initially, we were considering improving SBT or Mill as well as building Scala CLI on top one. We have quickly realized that getting Mill or SBT to reply within Milliseconds (for cases where no hard work like compilation is require) would be pretty much out of reach. Mill and SBT's codebases are too big to compile them to native image using GraalVM, not to mention problems with dynamic loading and reflection. Adding flexibility when in comes to input sources (e.g. support for Gists) and making the tool that can accept most of the configuration using simple command-line parameters would involve writhing a lot of glue code. That is why we decided to build the tool from scratch based on existing components like coursier, bloop or scalafmt.

## Proposed solution

We propose to gradually replace the current `scala`, `scalac` and `scaladoc` commands by single `scala` command that under the hood will be `scala-cli`. We could also add wrapper scripts for `scalac` and `scaladoc` that will mimic the functionality that will use `scala-cli` under the hood.

The complete set of `scala-cli` features can be found in [its documentation](https://scala-cli.virtuslab.org/docs/overview).

Scala CLI brings many features like testing, packaging, exporting to sbt / Mill or upcoming support for publishing micro-libraries. Initially, we propose to limit the set of features available in the `scala` command by default. Scala CLI is a relatively new project and we should battle-proof some of its features before we commit to support them as part of the official `scala` command.

Scala CLI offers [multiple native ways to be installed](https://scala-cli.virtuslab.org/install#advanced-installation) so most users should find a suitable method. We propose that these packages to become the default `scala` package in most repositories, often replacing existing `scala` packages but the fact how new `scala` command would be installed is not intended to be a part of this SIP.

### High-level overview

Let us show a few examples where adopting Scala CLI as `scala` command would be a significant improvement over current scripts. For this, we have assumed a minimal set of features (described as MUST have and SHOULD have). Each additional  Scala CLI feature included in the future, such as `package`, would add more and more use cases.

**Using REPL with a 3rd-party dependency**

Currently, to start a Scala REPL with a dependency on the class path, users need to resolve this dependency with all its transitive dependencies (coursier can help here) and pass those to the `scala` command using the `--cp` option. Alternatively, one can create an sbt project including a single dependency and use the `sbt console` task. Ammonite gives a better experience with its magic imports.

With Scala CLI, starting a REPL with a given dependency is as simple as running:

```
scala-cli repl --dep com.lihaoyi::os-lib:0.7.8
```

Compared to Ammonite, default Scala REPLs provided by Scala 2 and 3 - that Scala CLI uses by default - are somewhat limited. However, Scala CLI also offers to start Ammonite instead of the default Scala REPL, by passing `--ammonite` (or `--amm`) option to `scala-cli repl` but we do not propose to include `--ammonite` to the `scala` command not to commit to its maintenance.

Additionally, `scala-cli repl` can also put code from given files / directories / snippets on the class path by just providing their locations as arguments. Running `scala-cli repl foo.scala baz` will compile code from `foo.scala` and the `baz` directory, and put their classes on the REPL class path (including their dependencies, scalac options etc. defined within those files).

Compilation (and running scaladoc as well) benefit in a similar way from the ability to manage dependencies.

** Providing reproductions of bugs **

Currently, when reporting a bug in the compiler (or any other Scala-related) repository, users need to provide dependencies, compiler options etc. in comments, create a repository containing a projet with a Mill / sbt configuration to reproduce. In general, testing the reproduction or working on further minimization is not straightforward.

"Using directives", provided by Scala CLI give the ability to include the whole configuration in single file, for example:

```scala
//> using platform "native"
//> using "com.lihaoyi::os-lib:0.7.8"
//> using options "-Xfatal-warnings"

def foo = println("<here comes the buggy warning with Scala Native and os-lib>")
```

The snippet above when run with Scala CLI without any configuration provided will use Scala Native, resolve and include `os-lib` and provide `-Xfatal-warnings` to the compiler. Even things such as the runtime JVM version can be configured with using directives.

Moreover, Scala CLI provides the ability to run GitHub gists (including multi-file ones), and more.

** Watch mode **

When working on a piece of code, it is often useful to have it compiled/run every time the file is changed, and build tools offer a watch mode for that. This is how most people are using watch mode through a build tool. Scala CLI offers a watch mode for most of its commands (by using `--watch` / `-w` flags).


### Specification

 In order to be able to expand the functionality of Scala CLI and yet use the same core to power the `scala` command, we propose to include both `scala` and `scala-cli` commands in the installation package. Scala CLI already has a feature to limit accessible sub-commands based the binary name (all sub-commands in `scala-cli`, and a curated list in `scala`). On later date, more features from `scala-cli` could be included into `scala` command by additional SIPs or similar processes.

These sub-commands MUST be included in the the specification of the new `scala` command:

 - compile: Compile Scala code
 - doc: Generate Scaladoc documentation
 - repl: Fire-up a Scala REPL
 - run: Compile and run Scala code.
 - shebang: Like `run`, but more handy from shebang scripts

These sub-commands SHOULD be included in the the specification of the new `scala` command:

 - fmt: Format Scala code
 - test: Compile and test Scala code
 - version: Print `scala-cli` version


The subcommand that MAY be included in the specification of the new `scala` command. Those sub-commands are specific to implementation of Scala CLI and provide important, user-facing features like integration with IDE or cleaning up incremental compilation state:

 - about: Print details about this application
 - bsp: Start BSP server
 - clean: Clean the workspace
 - doctor: Print details about this application
 - help: Print help message
 - install-completions: Installs completions into your shell
 - install-home: Install `scala-cli` in a sub-directory of the home directory
 - setup-ide: Generate a BSP file that you can import into your IDE
 - uninstall: Uninstall scala-cli - only works when installed by the installation script
 - uninstall-completions: Uninstalls completions from your shell
 - update: Update scala-cli - only works when installed by the installation script

Last section of this proposal is the list of options that each sub-command MUST HAVE and SHOULD HAVE for each sub-commands that MUST or SHOULD be included in the specification of the new `scala` command. The options that are specific to the implementation (MAY have) as well as options for implementation specific sub-commands (MAY have) are included in [full specification](https://romanowski.github.io/scala-cli/docs/reference/scala-command/runner-specification).

Scala CLI can also be configured with ["using directives"](https://scala-cli.virtuslab.org/docs/guides/introduction/using-directives) - a comment-based configuration syntax that should be placed at the top of Scala files. This allows for self-containing examples within one file since most of the configuration can be provided either from the command line or via using directives (command line has precedence). This is a game changer for use cases like scripting, reproduction, or within the academic scope.

We have described the motivation, syntax and implementation basis in the [dedicated pre-SIP](https://contributors.scala-lang.org/t/pre-sip-using-directives/5700). Currently, we recommend to write using directives as comments, so making them part of the language specification is not necessary at this stage. Moreover, the new `scala` command could ignore using directives in the initial version, however we strongly suggest to include comment-based using directives from the start.

Last section of this proposal contains a sumamry of Using Directives syntax as well as list of directives that MUST and SHOULD be supported.

### Compatibility

Adopting Scala CLI as the new `scala` command, as is, will change some of the behavior of today's scripts. Some examples:

- Scala CLI recognizes tests based on the extension used (`*.test.scala`) so running `scala compile a.scala a.test.scala` will only compile `a.scala`
- Scala CLI has its own versioning scheme, that is not related to the Scala compiler. Default version used may dynamically change when new Scala version is released. Similarly to Scala 3, we intend for Scala CLI to be backward compatible and this should help mitigate this risk.
- By default, Scala CLI manages its own dependencies (e.g. scalac, zinc, Bloop) and resolves them lazily. This means that the first run of Scala CLI resolves quite some dependencies. Moreover, Scala CLI periodically checks for updates, new defaults accessing online resources (but it is not required to work, so Scala CLI can work in offline environment once setup)
- Scala CLI can also be configured via using directives. Command line options have precedence over using directives, however using directives override defaults. Compiling a file starting with `//> using scala 2.13.8`, without providing a Scala version on the command line, will result in using `2.13.8` rather than the default Scala version. We consider this a feature. However, technically, this is a breaking change.

### Other concerns

Scala CLI brings [using directives](https://scala-cli.virtuslab.org/docs/guides/introduction/using-directives) and  [conventions to mark the test files](https://scala-cli.virtuslab.org/docs/commands/test#test-sources). We suggest to accept both accepted as a part of this SIP but we are ready to open dedicated SIPs for both (we have opened a [pre-SIP for using directives](https://contributors.scala-lang.org/t/pre-sip-using-directives/5700/15))

Scala CLI is an ambitious project and may seem hard to maintain in the long-run.


### Open questions

The release cadence: should the new `scala` command follow the current release cadence for Scala CLI (every 2 weeks) or stick to Scala one (every 6 weeks)?

## Alternatives

Scala CLI has many alternatives. The most obvious ones are sbt, Mill, or other build tools. However, these are more complicated than Scala CLI, and what is more important they are not designed as command-line first tools. Ammonite, is another alternative, however it covers only part of the Scala CLI features (REPL and scripting), and lacks many of the Scala CLI features (incremental compilation, Scala version selection, support for Scala.js and Scala Native, just to name a few).

## Related work

- [Scala CLI website](https://scala-cli.virtuslab.org/) and [road map](https://github.com/VirtusLab/scala-cli/discussions/1101)
- [Pre-SIP](https://contributors.scala-lang.org/t/pre-sip-scala-cli-as-new-scala-command/5628/22)
- [leiningen](https://leiningen.org/) - a similar tool from Closure, but more configuration-oriented

## FAQ

This section will probably initially be empty. As discussions on the proposal progress, it is likely that some questions will come repeatedly. They should be listed here, with appropriate answers.

# Scala Runner Specification

This section describes proposed Scala Runner specification and was generated from Scala CLI documentation. It contains `MUST` have and `SHOULD` have commands (each with complete list of MUST have and SHOULD have options) followed by a list of using directives.

## Scalac options

Scala Runner MUST support following options from Scala Compiler directly:
 - `-encoding`
 - `-release`
 - `-color`
 - `-nowarn`
 - `-feature`
 - `-deprecation`


 Additionally, all options that start with:
- `-g`
- `-language`
- `-opt`
- `-P`
- `-target`
- `-V`
- `-W`
- `-X`
- `-Y`

SHOULD be treated as be Scala compiler options and  be propagated to Scala Compiler. This applies to all commands that uses compiler directly or indirectly.

# MUST have commands

## `compile` command

Compile Scala code

### MUST have options

- `--dependency`, `--dep`: Add dependencies
- `--compiler-plugin`, `-P`, `--plugin`: Add compiler plugin dependencies
- `--scala-version`, `--scala`, `-S`: Set the Scala version
- `--scala-binary-version`, `--scala-binary`, `--scala-bin`, `-B`: Set the Scala binary version
- `--extra-jars`, `--jar`, `--jars`, `--extra-jar`, `--class`, `--extra-class`, `--classes`, `--extra-classes`, `-classpath`, `-cp`, `--classpath`, `--class-path`, `--extra-class-path`: Add extra JARs and compiled classes to the class path
- `--resource-dirs`, `--resource-dir`: Add a resource directory
- `--compilation-output`, `--output-directory`, `-d`, `--destination`, `--compile-output`, `--compile-out`: Copy compilation results to output directory using either relative or absolute path
### SHOULD have options

- `--js`: Enable Scala.js. To show more options for Scala.js pass `--help-js`
- `--js-version`: The Scala.js version
- `--js-mode`: The Scala.js mode, either `dev` or `release`
- `--js-module-kind`: The Scala.js module kind: commonjs/common, esmodule/es, nomodule/none
- `--js-check-ir`:
- `--js-emit-source-maps`: Emit source maps
- `--js-source-maps-path`: Set the destination path of source maps
- `--js-dom`: Enable jsdom
- `--js-header`: A header that will be added at the top of generated .js files
- `--js-es-version`: The Scala.js ECMA Script version: es5_1, es2015, es2016, es2017, es2018, es2019, es2020, es2021
- `--native`: Enable Scala Native. To show more options for Scala Native pass `--help-native`
- `--native-version`: Set the Scala Native version
- `--native-mode`: Set Scala Native compilation mode
- `--native-gc`: Set the Scala Native garbage collector
- `--native-linking`: Extra options passed to `clang` verbatim during linking
- `--native-compile`: List of compile options
- `--embed-resources`: Embed resources into the Scala Native binary (can be read with the Java resources API)
- `--repository`, `--repo`, `-r`: Add repositories
- `--debug`: Turn debugging on
- `--debug-port`: Debug port (5005 by default)
- `--debug-mode`: Debug mode (attach by default)
- `--java-home`: Set the Java home directory
- `--jvm`, `-j`: Use a specific JVM, such as `14`, `adopt:11`, or `graalvm:21`, or `system`
- `--javac-plugin`: Javac plugin dependencies or files
- `--javac-option`, `--javac-opt`: Javac options
- `--script-snippet`: Allows to execute a passed string as a Scala script
- `--execute-script`, `--execute-scala-script`, `--execute-sc`, `-e`: A synonym to --script-snippet, which defaults the sub-command to `run` when no sub-command is passed explicitly
- `--scala-snippet`: Allows to execute a passed string as Scala code
- `--extra-compile-only-jars`, `--compile-only-jar`, `--compile-only-jars`, `--extra-compile-only-jar`: Add extra JARs in the compilaion class path. Mainly using to run code in managed environments like Spark not to include certain depenencies on runtime ClassPath.
- `--extra-source-jars`, `--source-jar`, `--source-jars`, `--extra-source-jar`: Add extra source JARs
- `--platform`: Specify platform
- `--semantic-db`: Generate SemanticDBs
- `--watch`, `-w`: Watch source files for changes
- `--restart`, `--revolver`: Run your application in background and automatically restart if sources have been changed
- `--test`: Compile test scope
---

## `doc` command

Generate Scaladoc documentation

### MUST have options

- `--dependency`, `--dep`: Add dependencies
- `--compiler-plugin`, `-P`, `--plugin`: Add compiler plugin dependencies
- `--scala-version`, `--scala`, `-S`: Set the Scala version
- `--scala-binary-version`, `--scala-binary`, `--scala-bin`, `-B`: Set the Scala binary version
- `--extra-jars`, `--jar`, `--jars`, `--extra-jar`, `--class`, `--extra-class`, `--classes`, `--extra-classes`, `-classpath`, `-cp`, `--classpath`, `--class-path`, `--extra-class-path`: Add extra JARs and compiled classes to the class path
- `--resource-dirs`, `--resource-dir`: Add a resource directory
- `--compilation-output`, `--output-directory`, `-d`, `--destination`, `--compile-output`, `--compile-out`: Copy compilation results to output directory using either relative or absolute path
- `--output`, `-o`: Set the destination path
- `--force`, `-f`: Overwrite the destination directory, if it exists
### SHOULD have options

- `--js`: Enable Scala.js. To show more options for Scala.js pass `--help-js`
- `--js-version`: The Scala.js version
- `--js-mode`: The Scala.js mode, either `dev` or `release`
- `--js-module-kind`: The Scala.js module kind: commonjs/common, esmodule/es, nomodule/none
- `--js-check-ir`:
- `--js-emit-source-maps`: Emit source maps
- `--js-source-maps-path`: Set the destination path of source maps
- `--js-dom`: Enable jsdom
- `--js-header`: A header that will be added at the top of generated .js files
- `--js-es-version`: The Scala.js ECMA Script version: es5_1, es2015, es2016, es2017, es2018, es2019, es2020, es2021
- `--native`: Enable Scala Native. To show more options for Scala Native pass `--help-native`
- `--native-version`: Set the Scala Native version
- `--native-mode`: Set Scala Native compilation mode
- `--native-gc`: Set the Scala Native garbage collector
- `--native-linking`: Extra options passed to `clang` verbatim during linking
- `--native-compile`: List of compile options
- `--embed-resources`: Embed resources into the Scala Native binary (can be read with the Java resources API)
- `--repository`, `--repo`, `-r`: Add repositories
- `--debug`: Turn debugging on
- `--debug-port`: Debug port (5005 by default)
- `--debug-mode`: Debug mode (attach by default)
- `--java-home`: Set the Java home directory
- `--jvm`, `-j`: Use a specific JVM, such as `14`, `adopt:11`, or `graalvm:21`, or `system`
- `--javac-plugin`: Javac plugin dependencies or files
- `--javac-option`, `--javac-opt`: Javac options
- `--script-snippet`: Allows to execute a passed string as a Scala script
- `--execute-script`, `--execute-scala-script`, `--execute-sc`, `-e`: A synonym to --script-snippet, which defaults the sub-command to `run` when no sub-command is passed explicitly
- `--scala-snippet`: Allows to execute a passed string as Scala code
- `--extra-compile-only-jars`, `--compile-only-jar`, `--compile-only-jars`, `--extra-compile-only-jar`: Add extra JARs in the compilaion class path. Mainly using to run code in managed environments like Spark not to include certain depenencies on runtime ClassPath.
- `--extra-source-jars`, `--source-jar`, `--source-jars`, `--extra-source-jar`: Add extra source JARs
- `--platform`: Specify platform
- `--semantic-db`: Generate SemanticDBs
- `--default-scaladoc-options`, `--default-scaladoc-opts`: Control if scala CLI should use default options for scaladoc, true by default. Use `--default-scaladoc-opts:false` to not include default options.
---

## `repl` command

Aliases: `console`

Fire-up a Scala REPL

### MUST have options

- `--dependency`, `--dep`: Add dependencies
- `--compiler-plugin`, `-P`, `--plugin`: Add compiler plugin dependencies
- `--scala-version`, `--scala`, `-S`: Set the Scala version
- `--scala-binary-version`, `--scala-binary`, `--scala-bin`, `-B`: Set the Scala binary version
- `--extra-jars`, `--jar`, `--jars`, `--extra-jar`, `--class`, `--extra-class`, `--classes`, `--extra-classes`, `-classpath`, `-cp`, `--classpath`, `--class-path`, `--extra-class-path`: Add extra JARs and compiled classes to the class path
- `--resource-dirs`, `--resource-dir`: Add a resource directory
- `--compilation-output`, `--output-directory`, `-d`, `--destination`, `--compile-output`, `--compile-out`: Copy compilation results to output directory using either relative or absolute path
- `--java-opt`, `-J`: Set Java options, such as `-Xmx1g`
- `--java-prop`: Set Java properties

### SHOULD have options

- `--js`: Enable Scala.js. To show more options for Scala.js pass `--help-js`
- `--js-version`: The Scala.js version
- `--js-mode`: The Scala.js mode, either `dev` or `release`
- `--js-module-kind`: The Scala.js module kind: commonjs/common, esmodule/es, nomodule/none
- `--js-check-ir`:
- `--js-emit-source-maps`: Emit source maps
- `--js-source-maps-path`: Set the destination path of source maps
- `--js-dom`: Enable jsdom
- `--js-header`: A header that will be added at the top of generated .js files
- `--js-es-version`: The Scala.js ECMA Script version: es5_1, es2015, es2016, es2017, es2018, es2019, es2020, es2021
- `--native`: Enable Scala Native. To show more options for Scala Native pass `--help-native`
- `--native-version`: Set the Scala Native version
- `--native-mode`: Set Scala Native compilation mode
- `--native-gc`: Set the Scala Native garbage collector
- `--native-linking`: Extra options passed to `clang` verbatim during linking
- `--native-compile`: List of compile options
- `--embed-resources`: Embed resources into the Scala Native binary (can be read with the Java resources API)
- `--repository`, `--repo`, `-r`: Add repositories
- `--debug`: Turn debugging on
- `--debug-port`: Debug port (5005 by default)
- `--debug-mode`: Debug mode (attach by default)
- `--java-home`: Set the Java home directory
- `--jvm`, `-j`: Use a specific JVM, such as `14`, `adopt:11`, or `graalvm:21`, or `system`
- `--javac-plugin`: Javac plugin dependencies or files
- `--javac-option`, `--javac-opt`: Javac options
- `--script-snippet`: Allows to execute a passed string as a Scala script
- `--execute-script`, `--execute-scala-script`, `--execute-sc`, `-e`: A synonym to --script-snippet, which defaults the sub-command to `run` when no sub-command is passed explicitly
- `--scala-snippet`: Allows to execute a passed string as Scala code
- `--extra-compile-only-jars`, `--compile-only-jar`, `--compile-only-jars`, `--extra-compile-only-jar`: Add extra JARs in the compilaion class path. Mainly using to run code in managed environments like Spark not to include certain depenencies on runtime ClassPath.
- `--extra-source-jars`, `--source-jar`, `--source-jars`, `--extra-source-jar`: Add extra source JARs
- `--platform`: Specify platform
- `--semantic-db`: Generate SemanticDBs
- `--watch`, `-w`: Watch source files for changes
- `--restart`, `--revolver`: Run your application in background and automatically restart if sources have been changed

---

## `run` command

Compile and run Scala code.

To pass arguments to the application, just add them after `--`, like:

```sh
scala-cli MyApp.scala -- first-arg second-arg
```

### MUST have options

- `--dependency`, `--dep`: Add dependencies
- `--compiler-plugin`, `-P`, `--plugin`: Add compiler plugin dependencies
- `--scala-version`, `--scala`, `-S`: Set the Scala version
- `--scala-binary-version`, `--scala-binary`, `--scala-bin`, `-B`: Set the Scala binary version
- `--extra-jars`, `--jar`, `--jars`, `--extra-jar`, `--class`, `--extra-class`, `--classes`, `--extra-classes`, `-classpath`, `-cp`, `--classpath`, `--class-path`, `--extra-class-path`: Add extra JARs and compiled classes to the class path
- `--resource-dirs`, `--resource-dir`: Add a resource directory
- `--compilation-output`, `--output-directory`, `-d`, `--destination`, `--compile-output`, `--compile-out`: Copy compilation results to output directory using either relative or absolute path
- `--java-opt`, `-J`: Set Java options, such as `-Xmx1g`
- `--java-prop`: Set Java properties
- `--main-class`, `-M`: Specify which main class to run

### SHOULD have options

- `--js`: Enable Scala.js. To show more options for Scala.js pass `--help-js`
- `--js-version`: The Scala.js version
- `--js-mode`: The Scala.js mode, either `dev` or `release`
- `--js-module-kind`: The Scala.js module kind: commonjs/common, esmodule/es, nomodule/none
- `--js-check-ir`:
- `--js-emit-source-maps`: Emit source maps
- `--js-source-maps-path`: Set the destination path of source maps
- `--js-dom`: Enable jsdom
- `--js-header`: A header that will be added at the top of generated .js files
- `--js-es-version`: The Scala.js ECMA Script version: es5_1, es2015, es2016, es2017, es2018, es2019, es2020, es2021
- `--native`: Enable Scala Native. To show more options for Scala Native pass `--help-native`
- `--native-version`: Set the Scala Native version
- `--native-mode`: Set Scala Native compilation mode
- `--native-gc`: Set the Scala Native garbage collector
- `--native-linking`: Extra options passed to `clang` verbatim during linking
- `--native-compile`: List of compile options
- `--embed-resources`: Embed resources into the Scala Native binary (can be read with the Java resources API)
- `--repository`, `--repo`, `-r`: Add repositories
- `--debug`: Turn debugging on
- `--debug-port`: Debug port (5005 by default)
- `--debug-mode`: Debug mode (attach by default)
- `--java-home`: Set the Java home directory
- `--jvm`, `-j`: Use a specific JVM, such as `14`, `adopt:11`, or `graalvm:21`, or `system`
- `--javac-plugin`: Javac plugin dependencies or files
- `--javac-option`, `--javac-opt`: Javac options
- `--script-snippet`: Allows to execute a passed string as a Scala script
- `--execute-script`, `--execute-scala-script`, `--execute-sc`, `-e`: A synonym to --script-snippet, which defaults the sub-command to `run` when no sub-command is passed explicitly
- `--scala-snippet`: Allows to execute a passed string as Scala code
- `--extra-compile-only-jars`, `--compile-only-jar`, `--compile-only-jars`, `--extra-compile-only-jar`: Add extra JARs in the compilaion class path. Mainly using to run code in managed environments like Spark not to include certain depenencies on runtime ClassPath.
- `--extra-source-jars`, `--source-jar`, `--source-jars`, `--extra-source-jar`: Add extra source JARs
- `--platform`: Specify platform
- `--semantic-db`: Generate SemanticDBs
- `--watch`, `-w`: Watch source files for changes
- `--restart`, `--revolver`: Run your application in background and automatically restart if sources have been changed
- `--main-class-ls`, `--main-class-list`, `--list-main-class`, `--list-main-classes`: List main classes available in the current context
- `--command`: Print the command that would have been run (one argument per line), rather than running it

---

## `shebang` command

Like `run`, but more handy from shebang scripts

This command is equivalent to `run`, but it changes the way
`scala-cli` parses its command-line arguments in order to be compatible
with shebang scripts.

Normally, inputs and scala-cli options can be mixed. Program have to be specified after `--`

```sh
scala-cli [command] [scala_cli_options | input]... -- [program_arguments]...
```

Contrary, for shebang command, only a single input file can be set, all scala-cli options
have to be set before the input file, and program arguments after the input file
```sh
scala-cli shebang [scala_cli_options]... input [program_arguments]...
```

Using this, it is possible to conveniently set up Unix shebang scripts. For example:
```sh
#!/usr/bin/env -S scala-cli shebang --scala-version 2.13
println("Hello, world)
```

### MUST have options

- `--dependency`, `--dep`: Add dependencies
- `--compiler-plugin`, `-P`, `--plugin`: Add compiler plugin dependencies
- `--scala-version`, `--scala`, `-S`: Set the Scala version
- `--scala-binary-version`, `--scala-binary`, `--scala-bin`, `-B`: Set the Scala binary version
- `--extra-jars`, `--jar`, `--jars`, `--extra-jar`, `--class`, `--extra-class`, `--classes`, `--extra-classes`, `-classpath`, `-cp`, `--classpath`, `--class-path`, `--extra-class-path`: Add extra JARs and compiled classes to the class path
- `--resource-dirs`, `--resource-dir`: Add a resource directory
- `--compilation-output`, `--output-directory`, `-d`, `--destination`, `--compile-output`, `--compile-out`: Copy compilation results to output directory using either relative or absolute path
- `--java-opt`, `-J`: Set Java options, such as `-Xmx1g`
- `--java-prop`: Set Java properties
- `--main-class`, `-M`: Specify which main class to run

### SHOULD have options

- `--js`: Enable Scala.js. To show more options for Scala.js pass `--help-js`
- `--js-version`: The Scala.js version
- `--js-mode`: The Scala.js mode, either `dev` or `release`
- `--js-module-kind`: The Scala.js module kind: commonjs/common, esmodule/es, nomodule/none
- `--js-check-ir`:
- `--js-emit-source-maps`: Emit source maps
- `--js-source-maps-path`: Set the destination path of source maps
- `--js-dom`: Enable jsdom
- `--js-header`: A header that will be added at the top of generated .js files
- `--js-es-version`: The Scala.js ECMA Script version: es5_1, es2015, es2016, es2017, es2018, es2019, es2020, es2021
- `--native`: Enable Scala Native. To show more options for Scala Native pass `--help-native`
- `--native-version`: Set the Scala Native version
- `--native-mode`: Set Scala Native compilation mode
- `--native-gc`: Set the Scala Native garbage collector
- `--native-linking`: Extra options passed to `clang` verbatim during linking
- `--native-compile`: List of compile options
- `--embed-resources`: Embed resources into the Scala Native binary (can be read with the Java resources API)
- `--repository`, `--repo`, `-r`: Add repositories
- `--debug`: Turn debugging on
- `--debug-port`: Debug port (5005 by default)
- `--debug-mode`: Debug mode (attach by default)
- `--java-home`: Set the Java home directory
- `--jvm`, `-j`: Use a specific JVM, such as `14`, `adopt:11`, or `graalvm:21`, or `system`
- `--javac-plugin`: Javac plugin dependencies or files
- `--javac-option`, `--javac-opt`: Javac options
- `--script-snippet`: Allows to execute a passed string as a Scala script
- `--execute-script`, `--execute-scala-script`, `--execute-sc`, `-e`: A synonym to --script-snippet, which defaults the sub-command to `run` when no sub-command is passed explicitly
- `--scala-snippet`: Allows to execute a passed string as Scala code
- `--extra-compile-only-jars`, `--compile-only-jar`, `--compile-only-jars`, `--extra-compile-only-jar`: Add extra JARs in the compilaion class path. Mainly using to run code in managed environments like Spark not to include certain depenencies on runtime ClassPath.
- `--extra-source-jars`, `--source-jar`, `--source-jars`, `--extra-source-jar`: Add extra source JARs
- `--platform`: Specify platform
- `--semantic-db`: Generate SemanticDBs
- `--watch`, `-w`: Watch source files for changes
- `--restart`, `--revolver`: Run your application in background and automatically restart if sources have been changed
- `--main-class-ls`, `--main-class-list`, `--list-main-class`, `--list-main-classes`: List main classes available in the current context
- `--command`: Print the command that would have been run (one argument per line), rather than running it

---

# SHOULD have commands

## `fmt` command

Aliases: `format`, `scalafmt`

Format Scala code

### MUST have options

- `--dependency`, `--dep`: Add dependencies
- `--compiler-plugin`, `-P`, `--plugin`: Add compiler plugin dependencies
- `--scala-version`, `--scala`, `-S`: Set the Scala version
- `--scala-binary-version`, `--scala-binary`, `--scala-bin`, `-B`: Set the Scala binary version
- `--extra-jars`, `--jar`, `--jars`, `--extra-jar`, `--class`, `--extra-class`, `--classes`, `--extra-classes`, `-classpath`, `-cp`, `--classpath`, `--class-path`, `--extra-class-path`: Add extra JARs and compiled classes to the class path
- `--resource-dirs`, `--resource-dir`: Add a resource directory
- `--compilation-output`, `--output-directory`, `-d`, `--destination`, `--compile-output`, `--compile-out`: Copy compilation results to output directory using either relative or absolute path
### SHOULD have options

- `--js`: Enable Scala.js. To show more options for Scala.js pass `--help-js`
- `--js-version`: The Scala.js version
- `--js-mode`: The Scala.js mode, either `dev` or `release`
- `--js-module-kind`: The Scala.js module kind: commonjs/common, esmodule/es, nomodule/none
- `--js-check-ir`:
- `--js-emit-source-maps`: Emit source maps
- `--js-source-maps-path`: Set the destination path of source maps
- `--js-dom`: Enable jsdom
- `--js-header`: A header that will be added at the top of generated .js files
- `--js-es-version`: The Scala.js ECMA Script version: es5_1, es2015, es2016, es2017, es2018, es2019, es2020, es2021
- `--native`: Enable Scala Native. To show more options for Scala Native pass `--help-native`
- `--native-version`: Set the Scala Native version
- `--native-mode`: Set Scala Native compilation mode
- `--native-gc`: Set the Scala Native garbage collector
- `--native-linking`: Extra options passed to `clang` verbatim during linking
- `--native-compile`: List of compile options
- `--embed-resources`: Embed resources into the Scala Native binary (can be read with the Java resources API)
- `--repository`, `--repo`, `-r`: Add repositories
- `--debug`: Turn debugging on
- `--debug-port`: Debug port (5005 by default)
- `--debug-mode`: Debug mode (attach by default)
- `--java-home`: Set the Java home directory
- `--jvm`, `-j`: Use a specific JVM, such as `14`, `adopt:11`, or `graalvm:21`, or `system`
- `--javac-plugin`: Javac plugin dependencies or files
- `--javac-option`, `--javac-opt`: Javac options
- `--script-snippet`: Allows to execute a passed string as a Scala script
- `--execute-script`, `--execute-scala-script`, `--execute-sc`, `-e`: A synonym to --script-snippet, which defaults the sub-command to `run` when no sub-command is passed explicitly
- `--scala-snippet`: Allows to execute a passed string as Scala code
- `--extra-compile-only-jars`, `--compile-only-jar`, `--compile-only-jars`, `--extra-compile-only-jar`: Add extra JARs in the compilaion class path. Mainly using to run code in managed environments like Spark not to include certain depenencies on runtime ClassPath.
- `--extra-source-jars`, `--source-jar`, `--source-jars`, `--extra-source-jar`: Add extra source JARs
- `--platform`: Specify platform
- `--semantic-db`: Generate SemanticDBs
- `--check`: Check if sources are well formatted

---

## `test` command

Compile and test Scala code

### MUST have options

- `--dependency`, `--dep`: Add dependencies
- `--compiler-plugin`, `-P`, `--plugin`: Add compiler plugin dependencies
- `--scala-version`, `--scala`, `-S`: Set the Scala version
- `--scala-binary-version`, `--scala-binary`, `--scala-bin`, `-B`: Set the Scala binary version
- `--extra-jars`, `--jar`, `--jars`, `--extra-jar`, `--class`, `--extra-class`, `--classes`, `--extra-classes`, `-classpath`, `-cp`, `--classpath`, `--class-path`, `--extra-class-path`: Add extra JARs and compiled classes to the class path
- `--resource-dirs`, `--resource-dir`: Add a resource directory
- `--compilation-output`, `--output-directory`, `-d`, `--destination`, `--compile-output`, `--compile-out`: Copy compilation results to output directory using either relative or absolute path
- `--java-opt`, `-J`: Set Java options, such as `-Xmx1g`
- `--java-prop`: Set Java properties
### SHOULD have options

- `--js`: Enable Scala.js. To show more options for Scala.js pass `--help-js`
- `--js-version`: The Scala.js version
- `--js-mode`: The Scala.js mode, either `dev` or `release`
- `--js-module-kind`: The Scala.js module kind: commonjs/common, esmodule/es, nomodule/none
- `--js-check-ir`:
- `--js-emit-source-maps`: Emit source maps
- `--js-source-maps-path`: Set the destination path of source maps
- `--js-dom`: Enable jsdom
- `--js-header`: A header that will be added at the top of generated .js files
- `--js-es-version`: The Scala.js ECMA Script version: es5_1, es2015, es2016, es2017, es2018, es2019, es2020, es2021
- `--native`: Enable Scala Native. To show more options for Scala Native pass `--help-native`
- `--native-version`: Set the Scala Native version
- `--native-mode`: Set Scala Native compilation mode
- `--native-gc`: Set the Scala Native garbage collector
- `--native-linking`: Extra options passed to `clang` verbatim during linking
- `--native-compile`: List of compile options
- `--embed-resources`: Embed resources into the Scala Native binary (can be read with the Java resources API)
- `--repository`, `--repo`, `-r`: Add repositories
- `--debug`: Turn debugging on
- `--debug-port`: Debug port (5005 by default)
- `--debug-mode`: Debug mode (attach by default)
- `--java-home`: Set the Java home directory
- `--jvm`, `-j`: Use a specific JVM, such as `14`, `adopt:11`, or `graalvm:21`, or `system`
- `--javac-plugin`: Javac plugin dependencies or files
- `--javac-option`, `--javac-opt`: Javac options
- `--script-snippet`: Allows to execute a passed string as a Scala script
- `--execute-script`, `--execute-scala-script`, `--execute-sc`, `-e`: A synonym to --script-snippet, which defaults the sub-command to `run` when no sub-command is passed explicitly
- `--scala-snippet`: Allows to execute a passed string as Scala code
- `--extra-compile-only-jars`, `--compile-only-jar`, `--compile-only-jars`, `--extra-compile-only-jar`: Add extra JARs in the compilaion class path. Mainly using to run code in managed environments like Spark not to include certain depenencies on runtime ClassPath.
- `--extra-source-jars`, `--source-jar`, `--source-jars`, `--extra-source-jar`: Add extra source JARs
- `--platform`: Specify platform
- `--semantic-db`: Generate SemanticDBs
- `--watch`, `-w`: Watch source files for changes
- `--restart`, `--revolver`: Run your application in background and automatically restart if sources have been changed
- `--test-framework`: Name of the test framework's runner class to use while running tests
- `--require-tests`: Fail if no test suites were run
---

# Using Directives


As a part of this SIP we propose to introduce Using Directives, a special comments containing configuration. Withing Scala CLI and by extension `scala` command, the command line arguments takes precedence over using directives.

Using directives can be place on only top of the file (above imports, package definition etx.) and can be proceed only by plain comments (e.g. to comment out an using directive)

Comments containing directives needs to start by `//>`, for example:

```
//> using scala 3
//> using platform scala-js
//> using options -Xasync
```

We propose following sytax for Using Directives (within special comments described above):

```
UsingDirective ::= "using" Setting
Setting ::= Ident ( Value | Values )
Ident ::= ScalaIdent { "." ScalaIdent }
Values ::= Value { " " [","] Values }
Value ::= Ident | stringLiteral | numericLiteral | true | false
```

Where:

- Ident is the standard Scala identifier or list of identifiers separated by dots:

```
foo

foo.bar

`foo-bar`.bazz
```

- String literals and numeric literals are similar to Scala.
- No value after the identifier is treated as true value: `using scalaSettings.fatalWarnings`
- Specifying a setting with the same path more than once and specifying the same setting with a list of values are equivalent

The list of proposed directives split into MUST have and SHOULD have groups:

## MUST have directives:

 - `option`, `options`: Add Scala compiler options
 - `plugin`, `plugins`: Adds compiler plugins
 - `lib`, `libs`: Add dependencies
 - `javaOpt`, `javaOptions`, `java-opt`, `java-options`: Add Java options which will be passed when running an application.
 - `javaProp`: Add Java properties
 - `main-class`, `mainClass`: Specify default main class
 - `scala`: Set the default Scala version
## SHOULD have directives:

 - `jar`, `jars`: Manually add JAR(s) to the class path
 - `file`, `files`: Manually add sources to the Scala CLI project
 - `java-home`, `javaHome`: Sets Java home used to run your application or tests
 - `javacOpt`, `javacOptions`, `javac-opt`, `javac-options`: Add Javac options which will be passed when compiling sources.
 - `platform`, `platforms`: Set the default platform to Scala.js or Scala Native
 - `repository`, `repositories`: Add a repository for dependency resolution
 - `resourceDir`, `resourceDirs`: Manually add a resource directory to the class path
 - `native-gc`, `native-mode`, `native-version`, `native-compile`, `native-linking`, `native-clang`, `native-clang-pp`, `native-no-embed`, `nativeGc`, `nativeMode`, `nativeVersion`, `nativeCompile`, `nativeLinking`, `nativeClang`, `nativeClangPP`, `nativeEmbedResources`: Add Scala Native options
 - `jsVersion`, `jsMode`, `jsModuleKind`, `jsCheckIr`, `jsEmitSourceMaps`, `jsSmallModuleForPackage`, `jsDom`, `jsHeader`, `jsAllowBigIntsForLongs`, `jsAvoidClasses`, `jsAvoidLetsAndConsts`, `jsModuleSplitStyleStr`, `jsEsVersionStr`: Add Scala.js options
 - `test-framework`, `testFramework`: Set the test framework
