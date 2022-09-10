---
title: Тестирование Scala c sbt и ScalaTest в командной строке
layout: singlepage-overview
partof: testing-scala-with-sbt-on-the-command-line
language: ru
disqus: true
previous-page: /ru/getting-started-with-scala-and-sbt-on-the-command-line
---

Для Scala существует множество библиотек и методологий тестирования,
но в этом руководстве мы продемонстрируем один популярный вариант из фреймворка ScalaTest
под названием [AnyFunSuite](https://www.scalatest.org/getting_started_with_fun_suite).

Это предполагает, что вы знаете, [как создать проект с sbt](getting-started-with-scala-and-sbt-on-the-command-line.html).

## Настройка
1. Используя командную строку создайте новую директорию.
1. Перейдите (`cd`) в этот каталог и запустите `sbt new scala/scalatest-example.g8`.
1. Назовите проект `ScalaTestTutorial`.
1. Проект поставляется с зависимостью ScalaTest в файле `build.sbt`.
1. Перейдите (`cd`) в этот каталог и запустите `sbt test`. Это запустит набор тестов
`CubeCalculatorTest` с одним тестом под названием `CubeCalculator.cube`.

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

## Разбор кода
1.  Откройте два файла в текстовом редакторе:
    * `src/main/scala/CubeCalculator.scala`
    * `src/test/scala/CubeCalculatorTest.scala`
1. В файле `CubeCalculator.scala` увидите определение функции `cube`.
1. В файле `CubeCalculatorTest.scala` тестируемый класс, названный так же как и объект.

```
  import org.scalatest.funsuite.AnyFunSuite

  class CubeCalculatorTest extends AnyFunSuite:
      test("CubeCalculator.cube") {
          assert(CubeCalculator.cube(3) === 27)
      }
```

Давайте разберем код построчно:

* `class CubeCalculatorTest` означает, что мы тестируем `CubeCalculator`
* `extends AnyFunSuite` позволяет нам использовать функциональность класса AnyFunSuite из ScalaTest,
  такую как функция `test`
* `test` это функция из библиотеки FunSuite, которая собирает результаты проверок в теле функции.
* `"CubeCalculator.cube"` - это имя для теста. Вы можете называть тест как угодно, но по соглашению используется имя — "ClassName.methodName".
* `assert` принимает логическое условие и определяет, пройден тест или нет.
* `CubeCalculator.cube(3) === 27` проверяет, действительно ли вывод функции `cube` равен 27.
  `===` является частью ScalaTest и предоставляет понятные сообщения об ошибках.

## Добавление еще одного теста
1. Добавьте еще один тестовый блок с собственным оператором assert, который проверяет 0 в кубе.

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

1. Запустите `sbt test` еще раз, чтобы увидеть результаты.

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

## Заключение
Вы видели один из способов тестирования Scala кода.
Узнать больше о AnyFunSuite от ScalaTest можно на [официальном сайте](https://www.scalatest.org/getting_started_with_fun_suite).
Вы также можете использовать другие тестовые фреймворки, такие, как [ScalaCheck](https://www.scalacheck.org/) и [Specs2](https://etorreborre.github.io/specs2/).
