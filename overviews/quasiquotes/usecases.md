---
layout: overview-large
title: Use cases

disqus: true

partof: quasiquotes
num: 6
outof: 13
languages: [ko]
---
**Denys Shabalin** <span class="label warning" style="float: right;">EXPERIMENTAL</span>

## AST manipulation in macros and compiler plugins

Quasiquotes were designed primary as tool for ast manipulation in macros. Common workflow is to deconstruct arguments with quasiquotes patterns and construct rewritten result with another quasiquote:

    // macro that prints expression code before executing it
    object debug {
      def apply[T](x: =>T): T = macro impl
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

To simplify integration with macros we've also made it easier to just use trees in macro implementations instead of previous reify-centric `Expr` api:

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

You don't have to manually wrap return value of a macro into `c.Expr` or specify argument types twice any more. Return type in `impl` is optional too.

Quasiquotes can also be used as is in compiler plugins as reflection api is strict subset of compiler's `Global` api.

## Just in time compilation

Thanks to `ToolBox` api one can generate, compile and run Scala code at runtime:

    scala> val code = q"""println("compiled and run at runtime!")"""
    scala> val compiledCode = toolbox.compile(code)
    scala> val result = compiledCode()
    compiled and run at runtime!
    result: Any = ()

## Offline code generation

Thanks to new `showCode` pretty printer one can implement offline code generator that does AST manipulation with the help of quasiquotes and then serializes into actual source right before writing them to disk:

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


