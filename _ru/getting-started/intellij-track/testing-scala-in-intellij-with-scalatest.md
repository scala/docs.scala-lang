---
title: Тестирование Scala в IntelliJ с помощью ScalaTest
layout: singlepage-overview
partof: testing-scala-in-intellij-with-scalatest
language: ru
disqus: true
previous-page: /ru/building-a-scala-project-with-intellij-and-sbt
---

Для Scala существует множество библиотек и методологий тестирования, 
но в этом руководстве мы продемонстрируем один популярный вариант из фреймворка ScalaTest 
под названием [AnyFunSuite](https://www.scalatest.org/getting_started_with_fun_suite).

Это предполагает, что вы знаете, [как создать проект в IntelliJ](building-a-scala-project-with-intellij-and-sbt.html).

## Настройка
1. Создайте sbt проект в IntelliJ.
1. Добавьте зависимость ScalaTest:
    1. Добавьте зависимость ScalaTest в свой файл `build.sbt`:
        ```
        libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.19" % Test
        ```
    1. Если вы получили уведомление "build.sbt was changed", выберите **auto-import**.
    1. Эти два действия заставят `sbt` подгрузить библиотеки ScalaTest.
    1. Дождитесь окончания синхронизации `sbt`; в противном случае, `AnyFunSuite` и `test()` не будет распознаны.
1. На панели проекта слева разверните `src` => `main`.
1. Щелкните правой кнопкой мыши на `scala` и выберите **New** => **Scala class**.
1. Назовите новый класс `CubeCalculator`, измените **Kind** на `object`, или дважды щелкните на `object`.
1. Вставьте следующий код:
    ```
    object CubeCalculator:
      def cube(x: Int) =
        x * x * x
    ```

## Создание теста
1. На панели проекта слева разверните `src` => `test`.
1. Щелкните правой кнопкой мыши на `scala` и выберите **New** => **Scala class**.
1. Назовите новый класс `CubeCalculatorTest` и нажмите **Enter** или дважды щелкните на `class`.
1. Вставьте следующий код:
    ```
    import org.scalatest.funsuite.AnyFunSuite
    
    class CubeCalculatorTest extends AnyFunSuite:
      test("CubeCalculator.cube") {
        assert(CubeCalculator.cube(3) === 27)
      }
    ```
1. В исходном коде щелкните правой кнопкой мыши на `CubeCalculatorTest` и выберите
    **Run 'CubeCalculatorTest'**.

## Разбор кода

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
1. Добавьте еще один оператор `assert` после первого, который проверяет 0 в кубе.
1. Перезапустите тест `CubeCalculatorTest`, кликнув правой кнопкой мыши и выбрав
    **Run 'CubeCalculatorTest'**.

## Заключение
Вы видели один из способов тестирования Scala кода. 
Узнать больше о AnyFunSuite от ScalaTest можно на [официальном сайте](https://www.scalatest.org/getting_started_with_fun_suite).
Вы также можете использовать другие тестовые фреймворки, такие, как [ScalaCheck](https://www.scalacheck.org/) и [Specs2](https://etorreborre.github.io/specs2/).
