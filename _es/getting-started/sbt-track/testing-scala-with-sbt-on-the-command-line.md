---
title: Probar Scala con sbt y ScalaTest en la línea de comandos
layout: singlepage-overview
partof: testing-scala-with-sbt-on-the-command-line
language: es
disqus: true
previous-page: /es/getting-started-with-scala-and-sbt-on-the-command-line
---

Existen múltiples bibliotecas y metodologías de pruebas para Scala,
pero en este tutorial mostraremos una opción popular del framework ScalaTest
llamada [AnyFunSuite](https://www.scalatest.org/scaladoc/3.2.2/org/scalatest/funsuite/AnyFunSuite.html).
Asumimos que sabes [cómo crear un proyecto de Scala con sbt](getting-started-with-scala-and-sbt-on-the-command-line.html).

## Configuración
1. En la línea de comandos, crea un nuevo directorio en cualquier lugar.
1. Haz `cd` al directorio y ejecuta `sbt new scala/scalatest-example.g8`
1. Nombra el proyecto `ScalaTestTutorial`.
1. El proyecto incluye ScalaTest como dependencia en el archivo `build.sbt`.
1. Haz `cd` al directorio y ejecuta `sbt test`. Esto ejecutará la suite de pruebas
`CubeCalculatorTest` con una única prueba llamada `CubeCalculator.cube`.

```
sbt test
[info] Loading global plugins from /Users/username/.sbt/0.13/plugins
[info] Loading project definition from /Users/username/workspace/sandbox/my-something-project/project
[info] Set current project to scalatest-example (in build file:/Users/username/workspace/sandbox/my-something-project/)
[info] CubeCalculatorTest:
[info] - CubeCalculator.cube
[info] Run completed in 267 milliseconds.
[info] Total number of tests run: 1
[info] Suites: completed 1, aborted 0
[info] Tests: succeeded 1, failed 0, canceled 0, ignored 0, pending 0
[info] All tests passed.
[success] Total time: 1 s, completed Feb 2, 2017 7:37:31 PM
```

## Entender las pruebas
1.  Abre dos archivos en un editor de texto:
    * `src/main/scala/CubeCalculator.scala`
    * `src/test/scala/CubeCalculatorTest.scala`
1. En el archivo `CubeCalculator.scala`, verás cómo definimos la función `cube`.
1. En el archivo `CubeCalculatorTest.scala`, verás que tenemos una clase
con el nombre del objeto que estamos probando.

```
  import org.scalatest.funsuite.AnyFunSuite

  class CubeCalculatorTest extends AnyFunSuite {
      test("CubeCalculator.cube") {
          assert(CubeCalculator.cube(3) === 27)
      }
  }
```

Repasémoslo línea por línea.

* `class CubeCalculatorTest` significa que estamos probando el objeto `CubeCalculator`
* `extends AnyFunSuite` nos permite usar la funcionalidad de la clase AnyFunSuite de ScalaTest,
como la función `test`
* `test` es una función que proviene de AnyFunSuite y que recopila
los resultados de las aserciones dentro del cuerpo de la función.
* `"CubeCalculator.cube"` es un nombre para la prueba. Puedes llamarla como quieras, pero
una convención es "NombreDeClase.nombreDeMétodo".
* `assert` recibe una condición booleana y determina si la prueba pasa o falla.
* `CubeCalculator.cube(3) === 27` comprueba si la salida de la función `cube` es
efectivamente 27. El `===` es parte de ScalaTest y proporciona mensajes de error claros.

## Agregar otro caso de prueba
1. Agrega otro bloque `test` con su propia sentencia `assert` que compruebe el cubo de `0`.

    ```
      import org.scalatest.funsuite.AnyFunSuite
    
      class CubeCalculatorTest extends AnyFunSuite {
          test("CubeCalculator.cube 3 should be 27") {
              assert(CubeCalculator.cube(3) === 27)
          }

          test("CubeCalculator.cube 0 should be 0") {
              assert(CubeCalculator.cube(0) === 0)
          }
      }
    ```

1. Ejecuta `sbt test` de nuevo para ver los resultados.

    ```
    sbt test
    [info] Loading project definition from C:\projects\scalaPlayground\scalatestpractice\project
    [info] Loading settings for project root from build.sbt ...
    [info] Set current project to scalatest-example (in build file:/C:/projects/scalaPlayground/scalatestpractice/)
    [info] Compiling 1 Scala source to C:\projects\scalaPlayground\scalatestpractice\target\scala-2.13\test-classes ...
    [info] CubeCalculatorTest:
    [info] - CubeCalculator.cube 3 should be 27
    [info] - CubeCalculator.cube 0 should be 0
    [info] Run completed in 257 milliseconds.
    [info] Total number of tests run: 2
    [info] Suites: completed 1, aborted 0
    [info] Tests: succeeded 2, failed 0, canceled 0, ignored 0, pending 0
    [info] All tests passed.
    [success] Total time: 3 s, completed Dec 4, 2019 10:34:04 PM
    ```

## Conclusión
Has visto una forma de probar tu código Scala. Puedes aprender más sobre
FunSuite de ScalaTest en el [sitio web oficial](https://www.scalatest.org/getting_started_with_fun_suite). También puedes explorar otros frameworks de pruebas como [ScalaCheck](https://www.scalacheck.org/) y [Specs2](https://etorreborre.github.io/specs2/).
