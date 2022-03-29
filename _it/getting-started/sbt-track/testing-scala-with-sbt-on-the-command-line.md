---
title: Testare scala con sbt da linea di comando 
layout: singlepage-overview
partof: testing-scala-with-sbt-on-the-command-line
language: it
disqus: true
previous-page: /it/getting-started-with-scala-and-sbt-on-the-command-line
---

Ci sono diverse librerie e modalità per testare il codice Scala, ma in questo tutorial verrà mostrato come eseguire il testing usando [AnyFunSuite](https://www.scalatest.org/scaladoc/3.2.2/org/scalatest/funsuite/AnyFunSuite.html) del framework ScalaTest.
Si assume che si sappia [creare un progetto Scala con sbt](getting-started-with-scala-and-sbt-on-the-command-line.html).

## Setup
1. Da linea di comando, creare una nuova directory in una posizione a propria scelta.
1. `cd` nella cartella appena creata ed eseguire `sbt new scala/scalatest-example.g8`
1. Quando richiesto, rinominare il progetto come `ScalaTestTutorial`.
1. Il progetto avrà già in se la libreria ScalaTest come dipendenza indicata nel file `build.sbt`.
1. `cd` nel progetto ed eseguire `sbt test`. Questo eseguirà la test suite
`CubeCalculatorTest` con un unico test chiamato `CubeCalculator.cube`.

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

## Comprendere i test
1. In qualsiasi editor di testo aprire i seguenti due file: 
    * `src/main/scala/CubeCalculator.scala`
    * `src/test/scala/CubeCalculatorTest.scala`
1. Nel file `CubeCalculator.scala`, è riportata la definizione della funzione `cube`.
1. Nel file `CubeCalculatorTest.scala`, è presente una classe chiamata allo stesso modo dell'oggetto che stiamo testando.

```
  import org.scalatest.funsuite.AnyFunSuite

  class CubeCalculatorTest extends AnyFunSuite {
      test("CubeCalculator.cube") {
          assert(CubeCalculator.cube(3) === 27)
      }
  }
```

Analizziamo ogni riga di codice.

* `class CubeCalculatorTest` significa che stiamo testando l'oggetto `CubeCalculator`
* `extends AnyFunSuite` ci permette di utilizzare la funzionalità della classe AnyFunSuite, come ad esempio la funzione `test`
* `test` è una funzione proveniente da AnyFunSuite che raccoglie i risultati delle asserzioni all'interno del corpo della funzione.
* `"CubeCalculator.cube"` è il nome del test. Può essere chiamato in qualsiasi modo, ma la convenzione è "NomeClasse.nomeMetodo".
* `assert` prende una condizione booleana e stabilisce se il test è superato o no.
* `CubeCalculator.cube(3) === 27` controlla se l'output della funzione `cube` sia realmente 27.
Il simbolo `===` è parte di ScalaTest e restituisce messaggi di errore comprensibili.

## Aggiungere un altro test case
1. Aggiungere un altro blocco di testo contenente il proprio enunciato `assert` che verificherà il cubo di `0`.

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

1. Lanciare `sbt test` nuovamente e controllare i risultati.

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

## Conclusioni
In questo tutorial è stato mostrato una delle modalità per testare il codice Scala. Per saperne di più su FunSuite si può consultare [il sito ufficiale](https://www.scalatest.org/getting_started_with_fun_suite). 
Si possono anche consultare altri framework di testing come [ScalaCheck](https://www.scalacheck.org/) e [Specs2](https://etorreborre.github.io/specs2/).
