---
layout: multipage-overview
title: Programmatic Use of Scala REPL

discourse: true

partof: repl
overview-name: REPL

num: 2
permalink: /overviews/repl/:title.html
---

The REPL can be embedded and invoked programmatically.

It supports the `javax.script` API, or it can be used
as either a code interpreter or an interactive command line.

    import scala.tools.nsc.Settings
    import scala.tools.nsc.interpreter._
    import javax.script._

    /** A simple example showing programmatic usage of the REPL. */
    object Main extends App {

      // the REPL has some support for javax.script
      val scripter = new ScriptEngineManager().getEngineByName("scala")
      scripter.eval("""println("hello, world")""")

      // compiler settings
      val settings = new Settings
      settings.processArgumentString("-deprecation -feature -Xfatal-warnings -Xlint")

      // the interpreter is used by the javax.script engine
      val intp = new IMain(settings)
      def interpret(code: String): Unit = {
        import Results._
        val res = intp.interpret(code) match {
          case Success => "OK!"
          case _       => "Sorry, try again."
        }
        println(res)
      }
      interpret("""println("hello, world")""")
      interpret("""println(""")
      interpret("""val who = "world" ; println("hello, $who")""")

      // the REPL uses a line reader and an interpreter interactively
      val interactive = new ILoop()
      interactive.process(settings)

      // input to the REPL can be provided programmatically
      import java.io.{BufferedReader, StringReader, PrintWriter}
      val reader = new BufferedReader(new StringReader(""""hello, world""""))
      val canned = new ILoop(reader, new PrintWriter(Console.out, true))
      canned.process(settings)

      // more canning
      val code = """println("hello, world") ; 42"""
      val out = ILoop.run(code)
      println(s"Output is $out")
    }
