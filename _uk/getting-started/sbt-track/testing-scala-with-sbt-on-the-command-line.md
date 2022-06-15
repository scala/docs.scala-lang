---
title: Тестування Scala з sbt та ScalaTest в командному рядку
layout: singlepage-overview
partof: testing-scala-with-sbt-on-the-command-line
language: uk
disqus: true
previous-page: /uk/getting-started-with-scala-and-sbt-on-the-command-line
---

Існує кілька бібліотек і методологій тестування для Scala,
але в цьому туторіалі ми продемонструємо один популярний варіант для фреймворку ScalaTest,
що називається [AnyFunSuite](https://www.scalatest.org/scaladoc/3.2.2/org/scalatest/funsuite/AnyFunSuite.html).

Ми припускаємо, що ви знаєте [як створити проєкт Scala за допомогою sbt](getting-started-with-scala-and-sbt-on-the-command-line.html).

## Налаштування
1. Створіть десь новий каталог через командний рядок.
1. Перейдіть (`cd`) в директорію та запустіть `sbt new scala/scalatest-example.g8`
1. Назвіть проєкт `ScalaTestTutorial`.
1. Проєкт вже має ScalaTest як залежність у файлі `build.sbt`.
1. Перейдіть (`cd`) в директорію та запустіть `sbt test`. Це запустить тестове середовище `CubeCalculatorTest` з єдиним тестом `CubeCalculator.cube`.

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

## Розуміння тестів
1.  Відкрийте два файли в текстовому редакторі:
    * `src/main/scala/CubeCalculator.scala`
    * `src/test/scala/CubeCalculatorTest.scala`
1. У файлі `CubeCalculator.scala`, визначте функцію `cube`.
1. У файлі `CubeCalculatorTest.scala`, ви побачите, що клас, що названий так само як і об'єкт, що ми тестуємо.

```
  import org.scalatest.funsuite.AnyFunSuite

  class CubeCalculatorTest extends AnyFunSuite {
      test("CubeCalculator.cube") {
          assert(CubeCalculator.cube(3) === 27)
      }
  }
```

Переглянемо кожний рядок окремо.

* `class CubeCalculatorTest` означає, що ми тестуємо об'єкт `CubeCalculator`
* `extends AnyFunSuite` використовуємо функціональність класу AnyFunSuite з ScalaTest, насамперед функцію `test`
* `test` функція з AnyFunSuite, що збирає результати тверджень (assertions) у тілі функції.
* `"CubeCalculator.cube"` назва тесту. Ви можете обрати будь-яку назву, але існує домовленість називати "ClassName.methodName".
* `assert` приймає булеву умову і визначає, пройшов тест чи не пройшов.
* `CubeCalculator.cube(3) === 27` перевіряє чи дорівнює результат функції `cube` значенню 27. 
   Оператор `===` є частиною ScalaTest та надає чисті повідомлення про помилки.

## Додати інший тест-кейс
1. Додайте інший тестовий блок з власним `assert`, що перевіряє значення кубу `0`.

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

1. Виконайте `sbt test` знову, щоб побачити результати.

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

## Висновок
Ви побачили один шлях тестування вашого Scala коду. Більше про
FunSuite ScalaTest на [офіційному вебсайті](https://www.scalatest.org/getting_started_with_fun_suite). 
Ви можете проглянути інші фреймворки для тестування такі як [ScalaCheck](https://www.scalacheck.org/) та [Specs2](https://etorreborre.github.io/specs2/).
