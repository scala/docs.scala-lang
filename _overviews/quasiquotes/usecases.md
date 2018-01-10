---
layout: multipage-overview
title: Use cases

discourse: true

partof: quasiquotes
overview-name: Quasiquotes

num: 6

permalink: /overviews/quasiquotes/:title.html
---
**Denys Shabalin** <span class="tag" style="float: right;">EXPERIMENTAL</span>

## AST manipulation in macros and compiler plugins

Quasiquotes were designed primary as tool for ast manipulation in macros. A common workflow is to deconstruct arguments with quasiquote patterns and then construct a rewritten result with another quasiquote:

    // macro that prints the expression code before executing it
    object debug {
      def apply[T](x: => T): T = macro impl
      def impl(c: Context)(x: c.Tree) = { import c.universe._
        val q"..$stats" = x
        val loggedStats = stats.flatMap { stat =>
          val msg = "executing " + showCode(stat)
          List(q"println($msg)", stat)
        }
        q"..$loggedStats"
      }
    }

    // usage
    object Test extends App {
      def faulty: Int = throw new Exception
      debug {
        val x = 1
        val y = x + faulty
        x + y
      }
    }

    // output
    executing val x: Int = 1
    executing val y: Int = x.+(Test.this.faulty)
    java.lang.Exception
    ...

To simplify integration with macros we've also made it easier to simply use trees in macro implementations instead of the reify-centric `Expr` api that might be used previously:

    // 2.10
    object Macro {
      def apply(x: Int): Int = macro impl
      def impl(c: Context)(x: c.Expr[Int]): c.Expr[Int] = { import c.universe._
        c.Expr(q"$x + 1")
      }
    }

    // in 2.11 you can also do it like that
    object Macro {
      def apply(x: Int): Int = macro impl
      def impl(c: Context)(x: c.Tree) = { import c.universe._
        q"$x + 1"
      }
    }

You no longer need to wrap the return value of a macro with `c.Expr`, or to specify the argument types twice, and the return type in `impl` is now optional.

Quasiquotes can also be used "as is" in compiler plugins as the reflection API is strict subset of the compiler's `Global` API.

## Just in time compilation

Thanks to the `ToolBox` API, one can generate, compile and run Scala code at runtime:

    scala> val code = q"""println("compiled and run at runtime!")"""
    scala> val compiledCode = toolbox.compile(code)
    scala> val result = compiledCode()
    compiled and run at runtime!
    result: Any = ()

## Offline code generation

Thanks to the new `showCode` "pretty printer" one can implement an offline code generator that does AST manipulation with the help of quasiquotes, and then serializes that into actual source code right before writing it to disk:

    object OfflineCodeGen extends App {
      def generateCode() =
        q"package mypackage { class MyClass }"
      def saveToFile(path: String, code: Tree) = {
        val writer = new java.io.PrintWriter(path)
        try writer.write(showCode(code))
        finally writer.close()
      }
      saveToFile("myfile.scala", generateCode())
    }
