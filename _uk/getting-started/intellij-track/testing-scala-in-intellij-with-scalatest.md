---
title: Тестування Scala в IntelliJ зі ScalaTest
layout: singlepage-overview
partof: testing-scala-in-intellij-with-scalatest
language: uk
disqus: true
previous-page: /uk/building-a-scala-project-with-intellij-and-sbt
---

Існує кілька бібліотек і методологій тестування для Scala,
але в цьому туторіалі ми продемонструємо один популярний варіант для фреймворку ScalaTest,
що називається [FunSuite](https://www.scalatest.org/getting_started_with_fun_suite).

Ми припускаємо, що ви знаєте [як створити проєкт з IntelliJ](building-a-scala-project-with-intellij-and-sbt.html).

## Налаштування
1. Створіть sbt проєкт в IntelliJ.
1. Додайте залежність ScalaTest:
    1. Додайте залежність ScalaTest у файл `build.sbt` вашого проєкту:
        ```
        libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.11" % Test
        ```
    1. Ви побачите сповіщення "build.sbt was changed", оберіть **auto-import**.
    1. Ці дві дії призведуть до того, що `sbt` завантажить бібліотеку ScalaTest.
    1. Зачекайте завершення синхронізації `sbt`; інакше `AnyFunSuite` та `test()` не будуть розпізнані.
1. На панелі проєкту розкрийте `src` => `main`.
1. Клацніть правою кнопкою миші на `scala` та оберіть **New** => **Scala class**.
1. Назвіть його `CubeCalculator` та змініть **Kind** на `object` та натисніть Enter або двічі клацніть на `object`.
1. Замініть код на наступний:
    ```
    object CubeCalculator extends App {
      def cube(x: Int) = {
        x * x * x
      }
    }
    ```

## Створення тесту
1. Зліва на панелі проєкту розкрийте `src` => `test`.
1. Клацніть правою кнопкою миші на `scala` та оберіть **New** => **Scala class**.
1. Назвіть клас `CubeCalculatorTest` та натисніть Enter або двічі клацніть на `class`.
1. Замініть код на наступний:
    ```
    import org.scalatest.funsuite.AnyFunSuite
    
    class CubeCalculatorTest extends AnyFunSuite {
      test("CubeCalculator.cube") {
        assert(CubeCalculator.cube(3) === 27)
      }
    }
    ```
1. У початковому коді клацніть правою кнопкою миші на `CubeCalculatorTest` та оберіть **Run 'CubeCalculatorTest'**.

## Розуміння коду

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
1. Виконайте `sbt test` знову, двічі клацнувши правою кнопкою миші на `CubeCalculatorTest` та обравши 'Run **CubeCalculatorTest**'.

## Висновок
Ви побачили один шлях тестування вашого Scala коду. Більше про
FunSuite ScalaTest на [офіційному вебсайті](https://www.scalatest.org/getting_started_with_fun_suite). 
Ви можете проглянути інші фреймворки для тестування такі як [ScalaCheck](https://www.scalacheck.org/) та [Specs2](https://etorreborre.github.io/specs2/).
