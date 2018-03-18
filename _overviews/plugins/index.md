---
layout: multipage-overview
title: Scala Compiler Plugins

discourse: true
---

**Lex Spoon (2008)**

## Introduction

This tutorial briefly walks you through writing a plugin for the Scala
compiler. It does not go into depth, but just shows you the very basics
needed to write a plugin and hook it into the Scala compiler. For the
details on how to make your plugin accomplish some task, you must
consult other documentation. At the time of writing, your best option is
to look at other plugins and to study existing phases within the
compiler source code.

The command lines given in this tutorial assume you are using a Unixy
Bourne shell and that you have the `SCALA_HOME` environment variable
pointing to the root of your Scala installation.

## When to write a plugin

A compiler plugin lets you modify the behavior of the compiler itself
without needing to change the main Scala distribution. You should not
actually need to modify the Scala compiler very frequently, because
Scala's light, flexible syntax will frequently allow you to provide a
better solution using a clever library. There are some times, though,
where a compiler modification is the best choice even for Scala. Here
are a few examples:

-   You might want to add additional compile-time checks, as with Gilad
    Bracha's pluggable types point of view.
-   You might want to add compile-time optimizations for a heavily used
    library.
-   You might want to rewrite Scala syntax into an entirely different,
    custom meaning. Beware of this kind of plugin, however, because any
    code relying on the plugin will be unusable when the plugin is not
    available.

Compiler plugins lets you make and distribute a compiler modification
without needing to change the main Scala distribution. You can instead
write a compiler plugin that embodies your compiler modification, and
then anyone you distribute the plugin to will be able to access your
modification. These modifications fall into two large categories with
the current plugin support:

-   You can add a phase to the compiler, thus adding extra checks or
    extra tree rewrites that apply after type checking has finished.
-   You can tell the compiler type-checking information about an
    annotation that is intended to be applied to types.

This tutorial walks through the most basic aspects of writing compiler
plugins. For more information, you will need to read the source of other
people's compiler plugins and of the compiler itself.

## A simple plugin, beginning to end {#Asimplepluginbeginningtoend}

A plugin is a kind of compiler component that lives in a separate jar
file from the main compiler. The compiler can then load that plugin and
gain extra functionality.

This section walks through writing a simple plugin. Suppose you want to
write a plugin that detects division by zero in obvious cases. For
example, suppose someone compiles a silly program like this:

    object Test {
      val five = 5
      val amount = five / 0
      def main(args: Array[String]) {
        println(amount)
      }
    }

Your plugin could generate an error like this:

    Test.scala:3: error: definitely division by zero
      val amount = five / 0
                        ^
    one error found

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
        val runsAfter = "refchecks"
        // Using the Scala Compiler 2.8.x the runsAfter should be written as below
        // val runsAfter = List[String]("refchecks");
        val phaseName = DivByZero.this.name
        def newPhase(_prev: Phase) = new DivByZeroPhase(_prev)    
        
        class DivByZeroPhase(prev: Phase) extends StdPhase(prev) {
          override def name = DivByZero.this.name
          def apply(unit: CompilationUnit) {
            for ( tree @ Apply(Select(rcvr, nme.DIV), List(Literal(Constant(0)))) <- unit.body;
                 if rcvr.tpe <:< definitions.IntClass.tpe) 
              {
                unit.error(tree.pos, "definitely division by zero")
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

Beginning with the Scala Compiler version 2.8 a new system for handling
compiler phases will be introduced. This new system gives the plugin
writer greater control over when the phase is executed. As seen in the
comment in the code example above, the runsAfter constraint is now a
list of phase names. This makes is possible to specify multiple phase
names to preceed the plugin. It is also possible, but optional, to
specify a runsBefore constraint of phase names that this phase should
preceed. It is also possible, but again optional, to specify a
runsRightAfter constraint on a specific phase. Examples of this can be
seen below and more information on these constraints and how they are
resolved can be found in [Compiler Phase and Plug-in Initialization
SID](../sid/2.html#).

      private object Component extends PluginComponent {
        val global = DivByZero.this.global
        val runsAfter = List[String]("refchecks","typer");
        override val runsBefore = List[String]("tailcalls");
        // Enable this and both runsAfter and runsBefore will have no effect
        // override val runsRightAfter = "refcheks"
        val phaseName = DivByZero.this.name
        def newPhase(_prev: Phase) = new DivByZeroPhase(_prev)
      }

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
    fsc -d classes ExPlugin.scala
    cp scalac-plugin.xml classes
    (cd classes; jar cf ../divbyzero.jar .)

Now you can use your plugin with `scalac` by adding the `-Xplugin:`
option:

    $ scalac -Xplugin:divbyzero.jar Test.scala
    Test.scala:3: error: definitely division by zero
      val amount = five / 0
                        ^
    one error found
    $

When you are happy with how the plugin behaves, you can install it by
putting it in the directory `misc/scala-devel/plugins` within your Scala
installation. You can install your plugin with the following commands:

    $ mkdir -p $SCALA_HOME/misc/scala-devel/plugins
    $ cp divbyzero.jar $SCALA_HOME/misc/scala-devel/plugins
    $

Now the plugin will be loaded by default:

    $ scalac Test.scala
    Test.scala:3: error: definitely division by zero
      val amount = five / 0
                        ^
    one error found
    $

## Useful compiler options

The previous section walked you through the basics of writing, using,
and installing a compiler plugin. There are several compiler options
related to plugins that you should know about.

-   `-Xshow-phases`---show a list of all compiler phases, including ones
    that come from plugins.
-   `-Xplugin-list`---show a list of all loaded plugins.
-   `-Xplugin-disable:`---disable a plugin. Whenever the compiler
    encounters a plugin descriptor for the named plugin, it will skip
    over it and not even load the associated `Plugin` subclass.
-   `-Xplugin-require:`---require that a plugin is loaded or else abort.
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
      
      override def processOptions(options: List[String], error: String => Unit) {
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
        val runsAfter = "refchecks"
        // Using the Scala Compiler 2.8.x the runsAfter should be written as shown below
        // val runsAfter = List[String]("refchecks");
        val phaseName = Silly.this.name
        def newPhase(_prev: Phase) = new SillyPhase(_prev)    
      
        class SillyPhase(prev: Phase) extends StdPhase(prev) {
          override def name = Silly.this.name
          def apply(unit: CompilationUnit) {
            println("Silliness level: " + level)
          }
        }
      }
    }

## Going further

### Download the code

The above code can be found in the scala developer code examples as a
template compiler plugin. The example code also shows how to modify the
trees and types instead of only traversing them.

<http://lampsvn.epfl.ch/trac/scala/browser/scala/trunk/docs/examples/plugintemplate>

You can use [sbaz](../tools/sbaz/index.html) to install the examples
locally.  Type \"`sbaz install scala-devel-docs`\" and navigate to the
directory `docs/scala-devel-docs/examples/plugintemplate`.

### Develop using Eclipse

Based on a [discussion on the
scala-tools](http://www.nabble.com/-scala-tools--running-debuging-compiler-plugin-from-Eclipse-to21328595.html)
mailing list, here is how to develop and debug a compiler plugin using
Eclipse:

-   put scala-compiler.jar in the class path
-   create a launch configuration for scala.tools.nsc.Main
-   pass the -Xplugin argument within this configuration which points to
    a jar containing the scalac-plugin-xml (but not any classfiles)
-   provide the plugin-implementation in a project referenced from the
    launch configuration
