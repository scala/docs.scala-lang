---
layout: singlepage-overview
title: Scala Compiler Plugins
---

**Lex Spoon (2008)**  
**Seth Tisue (2018)**

## Introduction

A compiler plugin is a compiler component that lives in a separate JAR
file from the main compiler. The compiler can then load that plugin and
gain extra functionality.

This tutorial briefly walks you through writing a plugin for the Scala
compiler. It does not go into depth on how to make your plugin
actually do something useful, but just shows the basics needed to
write a plugin and hook it into the Scala compiler.

## You can read, but you can also watch TV

The contents of this guide overlaps substantially with Seth Tisue's
talk "Scala Compiler Plugins 101" ([32 minute video](https://www.youtube.com/watch?v=h5NZjuxS5Qo)).
Although the talk is from April 2018, nearly all of the information
in it still applies (as of November 2020).

## When to write a plugin

Plugins let you modify the behavior of the Scala compiler without
changing the main Scala distribution.  If you write a compiler
plugin that contains your compiler modification, then anyone you
distribute the plugin to will be able to use your modification.

You should not actually need to modify the Scala compiler very
frequently, because Scala's light, flexible syntax will frequently
allow you to provide a better solution using a clever library.

There are some times, though, where a compiler modification is the
best choice even for Scala.  Popular compiler plugins (as of 2018)
include:

- Alternate compiler back ends such as [Scala.js](https://www.scala-js.org), [Scala Native](http://scala-native.org), and
  [Fortify SCA for Scala](https://developer.lightbend.com/docs/fortify/current/).
- Linters such as [Wartremover](https://www.wartremover.org) and [Scapegoat](https://github.com/sksamuel/scapegoat).
- Plugins that support reformatting and other changes
  to source code, such as [scalafix](https://scalacenter.github.io/scalafix/) and [scalafmt](https://scalameta.org/scalafmt/) (which are
  built on the [semanticdb](https://scalameta.org/docs/semanticdb/guide.html) and [scalahost](https://github.com/Duhemm/scalahost) compiler plugins).
- Plugins that alter Scala's syntax, such as [kind-projector](https://github.com/typelevel/kind-projector).
- Plugins that alter Scala's behavior around errors and warnings,
  such as [silencer](https://github.com/ghik/silencer).
- Plugins that analyze the structure of source code, such as
  [Sculpt](https://github.com/lightbend/scala-sculpt) and [acyclic](https://github.com/lihaoyi/acyclic).
- Plugins that instrument user code to collect information,
  such as the code coverage tool [scoverage](https://github.com/scoverage/scalac-scoverage-plugin).
- Plugins that add metaprogramming facilities to Scala,
  such as [Macro Paradise](https://github.com/scalamacros/paradise).
- Plugins that add entirely new constructs to Scala by
  restructuring user code, such as [scala-continuations](https://github.com/scala/scala-continuations).

Some tasks that required a compiler plugin in very early Scala
versions can now be done using macros instead; see [Macros]({{ site.baseurl }}/overviews/macros/overview.html).

## How it works

A compiler plugin consists of:

- Some code that implements an additional compiler phase.
- Some code that uses the compiler plugin API to specify
  when exactly this new phase should run.
- Additional code that specifies what options the plugin
  accepts.
- An XML file containing metadata about the plugin

All of this is then packaged in a JAR file.

To use the plugin, a user adds the JAR file to their compile-time
classpath and enables it by invoking `scalac` with `-Xplugin:...`.
(Some build tools provide shortcuts for this; see below.)

All of this will be described in more detail below.

## A simple plugin, beginning to end

This section walks through writing a simple plugin.

Suppose you want to write a plugin that detects division by zero in
obvious cases. For example, suppose someone compiles a silly program
like this:

    object Test {
      val five = 5
      val amount = five / 0
      def main(args: Array[String]): Unit = {
        println(amount)
      }
    }

Our plugin will generate an error like:

    Test.scala:3: error: definitely division by zero
      val amount = five / 0
                        ^

There are several steps to making the plugin. First you need to write
and compile the source of the plugin itself. Here is the source code for
it:

    package localhost

    import scala.tools.nsc
    import nsc.Global
    import nsc.Phase
    import nsc.plugins.Plugin
    import nsc.plugins.PluginComponent

    class DivByZero(val global: Global) extends Plugin {
      import global._

      val name = "divbyzero"
      val description = "checks for division by zero"
      val components = List[PluginComponent](Component)

      private object Component extends PluginComponent {
        val global: DivByZero.this.global.type = DivByZero.this.global
        val runsAfter = List[String]("refchecks")
        val phaseName = DivByZero.this.name
        def newPhase(_prev: Phase) = new DivByZeroPhase(_prev)
        class DivByZeroPhase(prev: Phase) extends StdPhase(prev) {
          override def name = DivByZero.this.name
          def apply(unit: CompilationUnit): Unit = {
            for ( tree @ Apply(Select(rcvr, nme.DIV), List(Literal(Constant(0)))) <- unit.body
                 if rcvr.tpe <:< definitions.IntClass.tpe)
              {
                global.reporter.error(tree.pos, "definitely division by zero")
              }
          }
        }
      }
    }

There is a lot going on even with this simple plugin. Here are a few
aspects of note.

-   The plugin is described by a top-level class that inherits from
    `Plugin`, takes a `Global` as a constructor parameter, and exports
    that parameter as a `val` named `global`.
-   The plugin must define one or more component objects that inherits
    from `PluginComponent`. In this case the sole component is the
    nested `Component` object. The components of a plugin are listed in
    the `components` field.
-   Each component must define `newPhase` method that creates the
    component's sole compiler phase. That phase will be inserted just
    after the specified compiler phase, in this case `refchecks`.
-   Each phase must define a method `apply` that does whatever you
    desire on the given compilation unit. Usually this involves
    examining the trees within the unit and doing some transformation on
    the tree.
-   The pattern match inside the body of `apply` shows one way of
    detecting certain tree shapes in user code.
    (Quasiquotes are another way.)  `Apply` denotes a method call,
    and `Select` denotes the "selection" of a member, such as `a.b`.
    The details of tree processing are out of scope for this document,
    but see "Going further", below, for links to further documentation.

The `runsAfter` method gives the plugin author control over when the
phase is executed. As seen above, it is expected to return a list of
phase names. This makes it possible to specify multiple phase names to
precede the plugin. It is also possible, but optional, to specify a
`runsBefore` constraint of phase names that this phase should
precede. And it is also possible, but again optional, to specify a
`runsRightAfter` constraint to run immediately after a specific
phase.

More information on how phase ordering is controlled can be
found in the [Compiler Phase and Plug-in Initialization
SID](https://www.scala-lang.org/old/sid/2).  (This document was last
updated in 2009, so may be outdated in some details.)

The simplest way to specify an order is to implement `runsRightAfter`.

That's the plugin itself. The next thing you need to do is write a
plugin descriptor for it. A plugin descriptor is a small XML file giving
the name and the entry point for the plugin. In this case it should look
as follows:

    <plugin>
      <name>divbyzero</name>
      <classname>localhost.DivByZero</classname>
    </plugin>

The name of the plugin should match what is specified in your `Plugin`
subclass, and the `classname` of the plugin is the name of the `Plugin`
subclass. All other information about your plugin is in the `Plugin`
subclass.

Put this XML in a file named `scalac-plugin.xml` and then create a jar
with that file plus your compiled code:

    mkdir classes
    scalac -d classes ExPlugin.scala
    cp scalac-plugin.xml classes
    (cd classes; jar cf ../divbyzero.jar .)

That's how it works with no build tool. If you are using sbt to build
your plugin, then the XML file goes in `src/main/resources`.

## Using a plugin with scalac

Now you can use your plugin with `scalac` by adding the `-Xplugin:`
option:

    $ scalac -Xplugin:divbyzero.jar Test.scala
    Test.scala:3: error: definitely division by zero
      val amount = five / 0
                        ^
    one error found

## Publishing your plugin

When you are happy with how the plugin behaves, you may wish to
publish the JAR to a Maven or Ivy repository where it can be resolved
by a build tool.  (For testing purposes, you can also publish it to
your local machine only. In sbt, this is accomplished with
`publishLocal`.)

In most respects, compiler plugins are ordinary Scala libraries,
so publishing a plugin is like publishing any library.
See the [Library Author Guide]({{site.baseurl}}/overviews/contributors/index.html)
and/or your build tool's documentation on publishing.

## Using a plugin from sbt

To make it convenient for end users to use your plugin once it has
been published, sbt provides an `addCompilerPlugin` method you can
call in your build definition, e.g.:

    addCompilerPlugin("org.divbyzero" %% "divbyzero" % "1.0")

`addCompilerPlugin` performs multiple actions. It adds the JAR to the
classpath (the compilation classpath only, not the runtime classpath)
via `libraryDependencies`, and it also customizes `scalacOptions` to
enable the plugin using `-Xplugin`.

For more details, see [Compiler Plugin
Support](https://www.scala-sbt.org/1.x/docs/Compiler-Plugins.html) in
the sbt manual.

## Developing compiler plugins with an IDE

Internally, the use of path-dependent types in the Scala compiler
may confuse some IDEs such as IntelliJ.  Correct plugin code may
sometimes be highlighted as erroneous.  The IDE is usually still
useful under these circumstances, but remember to take its feedback
with a grain of salt.  If the error highlighting is distracting,
the IDE may have a setting where you can disable it.

## Useful compiler options

The previous section walked you through the basics of writing, using,
and installing a compiler plugin. There are several compiler options
related to plugins that you should know about.

-   `-Xshow-phases`---show a list of all compiler phases, including ones
    that come from plugins.
-   `-Xplugin-list`---show a list of all loaded plugins.
-   `-Xplugin-disable:...`---disable a plugin. Whenever the compiler
    encounters a plugin descriptor for the named plugin, it will skip
    over it and not even load the associated `Plugin` subclass.
-   `-Xplugin-require:...`---require that a plugin is loaded or else abort.
    This is mostly useful in build scripts.
-   `-Xpluginsdir`---specify the directory the compiler will scan to
    load plugins. Again, this is mostly useful for build scripts.

The following options are not specific to writing plugins, but are
frequently used by plugin writers:

-   `-Xprint:`---print out the compiler trees immediately after the
    specified phase runs.
-   `-Ybrowse:`---like `-Xprint:`, but instead of printing the trees,
    opens a Swing-based GUI for browsing the trees.

## Adding your own options

A compiler plugin can provide command-line options to the user. All such
option start with `-P:` followed by the name of the plugin. For example,
`-P:foo:bar` will pass option `bar` to plugin `foo`.

To add options to your own plugin, you must do two things. First, add a
`processOptions` method to your `Plugin` subclass with the following
type signature:

    override def processOptions(
        options: List[String],
        error: String => Unit)

The compiler will invoke this method with all options the users
specifies for your plugin. For convenience, the common prefix of `-P:`
followed by your plugin name will already be stripped from all of the
options passed in.

The second thing you should do is add a help message for your plugins
options. All you need to do is override the `val` named `optionsHelp`.
The string you specify will be printed out as part of the compiler's
`-help` output. By convention, each option is printed on one line. The
option itself is printed starting in column 3, and the description of
the option is printed starting in column 31. Type `scalac -help` to make
sure you got the help string looking right.

Here is a complete plugin that has an option. This plugin has no
behavior other than to print out its option.

    package localhost

    import scala.tools.nsc
    import nsc.Global
    import nsc.Phase
    import nsc.plugins.Plugin
    import nsc.plugins.PluginComponent

    class Silly(val global: Global) extends Plugin {
      import global._

      val name = "silly"
      val description = "goose"
      val components = List[PluginComponent](Component)

      var level = 1000000

      override def processOptions(options: List[String], error: String => Unit): Unit = {
        for (option <- options) {
          if (option.startsWith("level:")) {
            level = option.substring("level:".length).toInt
          } else {
            error("Option not understood: "+option)
          }
        }
      }

      override val optionsHelp: Option[String] = Some(
        "  -P:silly:level:n             set the silliness to level n")

      private object Component extends PluginComponent {
        val global: Silly.this.global.type = Silly.this.global
        val runsAfter = List[String]("refchecks");
        val phaseName = Silly.this.name
        def newPhase(_prev: Phase) = new SillyPhase(_prev)

        class SillyPhase(prev: Phase) extends StdPhase(prev) {
          override def name = Silly.this.name
          def apply(unit: CompilationUnit): Unit = {
            println("Silliness level: " + level)
          }
        }
      }
    }

## Going further

For the details on how to make your plugin accomplish some task, you
must consult other documentation on compiler internals. Relevant
documents include:

* [Symbols, Trees, and Types]({{site.baseurl}}/overviews/reflection/symbols-trees-types.html) is the single most important reference about the data structures used inside the compiler.
* [Quasiquotes]({{site.baseurl}}/overviews/quasiquotes/intro.html) are useful for pattern matching on ASTs.
  * The [syntax summary]({{site.baseurl}}/overviews/quasiquotes/syntax-summary.html) in the quasiquotes guide is a useful concordance between user-level syntax and AST node types.

It's also useful to look at other plugins and to study existing phases
within the compiler source code.
