---
title: Probar Scala en IntelliJ con ScalaTest
layout: singlepage-overview
partof: testing-scala-in-intellij-with-scalatest
language: es
disqus: true
previous-page: /es/building-a-scala-project-with-intellij-and-sbt
---

Existen múltiples bibliotecas y metodologías de pruebas para Scala,
pero en este tutorial mostraremos una opción popular del framework ScalaTest
llamada [FunSuite](https://www.scalatest.org/getting_started_with_fun_suite).

Esto asume que sabes [cómo construir un proyecto en IntelliJ](building-a-scala-project-with-intellij-and-sbt.html).

## Configuración
1. Crea un proyecto sbt en IntelliJ.
1. Agrega la dependencia de ScalaTest:
    1. Agrega la dependencia de ScalaTest a tu archivo `build.sbt`:
        ```
        libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.19" % Test
        ```
    1. Si recibes la notificación "build.sbt was changed", selecciona **auto-import**.
    1. Estas dos acciones harán que `sbt` descargue la biblioteca ScalaTest.
    1. Espera a que termine la sincronización de `sbt`; de lo contrario, `AnyFunSuite` y `test()` no
        serán reconocidos.
1. En el panel del proyecto a la izquierda, expande `src` => `main`.
1. Haz clic derecho sobre `scala` y selecciona **New** => **Scala class**.
1. Llámala `CubeCalculator`, cambia **Kind** a `object`, y presiona Enter o haz doble clic en `object`.
1. Reemplaza el código por el siguiente:
    ```
    object CubeCalculator:
      def cube(x: Int) =
        x * x * x
    ```

## Crear una prueba
1. En el panel del proyecto a la izquierda, expande `src` => `test`.
1. Haz clic derecho sobre `scala` y selecciona **New** => **Scala class**.
1. Nombra la clase `CubeCalculatorTest` y presiona Enter o haz doble clic en `class`.
1. Reemplaza el código por el siguiente:
    ```
    import org.scalatest.funsuite.AnyFunSuite
    
    class CubeCalculatorTest extends AnyFunSuite:
      test("CubeCalculator.cube") {
        assert(CubeCalculator.cube(3) === 27)
      }
    ```
1. En el código fuente, haz clic derecho sobre `CubeCalculatorTest` y selecciona
    **Run 'CubeCalculatorTest'**.

## Entender el código

Repasémoslo línea por línea:

* `class CubeCalculatorTest` significa que estamos probando el objeto `CubeCalculator`
* `extends AnyFunSuite` nos permite usar la funcionalidad de la clase AnyFunSuite de ScalaTest,
como la función `test`
* `test` es una función que proviene de la biblioteca FunSuite y que recopila
los resultados de las aserciones dentro del cuerpo de la función.
* `"CubeCalculator.cube"` es un nombre para la prueba. Puedes llamarla como quieras, pero
una convención es "NombreDeClase.nombreDeMétodo".
* `assert` recibe una condición booleana y determina si la prueba pasa o falla.
* `CubeCalculator.cube(3) === 27` comprueba si la salida de la función `cube` es
efectivamente 27. El `===` es parte de ScalaTest y proporciona mensajes de error claros.

## Agregar otro caso de prueba
1. Agrega otra sentencia `assert` después de la primera que compruebe el cubo
    de `0`.
1. Vuelve a ejecutar la prueba haciendo clic derecho sobre `CubeCalculatorTest` y seleccionando
    'Run **CubeCalculatorTest**'.

## Conclusión
Has visto una forma de probar tu código Scala. Puedes aprender más sobre FunSuite de ScalaTest
en el [sitio web oficial](https://www.scalatest.org/getting_started_with_fun_suite).
