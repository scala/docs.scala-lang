---
title: Створення проєкту на Scala з IntelliJ і sbt
layout: singlepage-overview
partof: building-a-scala-project-with-intellij-and-sbt
language: uk
disqus: true
previous-page: /uk/getting-started/intellij-track/getting-started-with-scala-in-intellij
next-page: /uk/testing-scala-in-intellij-with-scalatest
---

В цьому посібнику ми побачимо як будувати Scala проєкти використовуючи [sbt](https://www.scala-sbt.org/1.x/docs/index.html).
sbt — популярний інструмент для компіляції, запуску та тестування проєктів Scala будь-якої складності.
Використання інструменту збірки, такого як sbt (або Maven/Gradle), стає необхідним, коли ви створюєте проєкти із залежностями або кількома файлами коду.
Ми припускаємо, що ви завершили [перший посібник](./getting-started-with-scala-in-intellij.html).

## Створення проєкту
У цьому розділі ми покажемо вам, як створити проєкт в IntelliJ. Однак, якщо вам
комфортніше працювати у терміналі, ми рекомендуємо подивитись [початок роботи зі Scala і sbt у командному рядку](/uk/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html)
і потім повернутися сюди до розділу «Написання коду на Scala».

1. Якщо ви ще не створили проєкт у терміналі, запустіть IntelliJ та оберіть "Створити новий проєкт (Create New Project)"
  * На панелі зліва оберіть Scala, а на панелі справа оберіть sbt
  * Натисніть **Next**
  * Назвіть ваш проєкт "SbtExampleProject"
1. Якщо ви вже створили проєкт через термінал, запустіть IntelliJ, оберіть *Імпортувати проєкт (Import Project)* та відкрийте файл `build.sbt` вашого проєкту
1. Впевніться, що **версія JDK** 1.8 або вище, та **версія sbt** 0.13.13 та вище
1. Натисніть **Use auto-import**, щоб залежності автоматично завантажились
1. Натисніть **Finish**

## Розуміння структури директорій
Завдяки sbt створюються директорії, які можуть бути корисні у разі розробки складніших проєктів.
Поки що ви можете проігнорувати більшість із них, але ось для чого це все:

```
- .idea (IntelliJ files)
- project (plugins and additional settings for sbt)
- src (source files)
    - main (application code)
        - java (Java source files)
        - scala (Scala source files) <-- This is all we need for now
        - scala-2.12 (Scala 2.12 specific files)
    - test (unit tests)
- target (generated files)
- build.sbt (build definition file for sbt)
```


## Написання коду на Scala
1. На панелі **Project** зліва розкрийте `SbtExampleProject` => `src` => `main`
1. Натисніть праву кнопку миші, `scala` та оберіть **New** => **Package**
1. Назвіть пакет `example` та натисніть **OK** (або просто натисніть клавішу Enter або Return).
1. Натисніть праву кнопку миші на пакет `example` та оберіть **New** => **Scala class** (якщо ви не бачите цю опцію, натисніть праву кнопку миші на `SbtExampleProject`, натисніть **Add Frameworks Support**, оберіть **Scala** та продовжить)
1. Назвіть клас `Main` та змініть **Kind** на `Object`.
1. Змініть код у класі на наступний:

```
object Main extends App {
  val ages = Seq(42, 75, 29, 64)
  println(s"The oldest person is ${ages.max}")
}
```

Примітка: IntelliJ має власну реалізацію компілятора Scala, тому іноді ваш код є правильним, навіть якщо IntelliJ вказує інше.
Ви завжди можете перевірити у командному рядку, чи може sbt запустити ваш проєкт.

## Запуск проєкту
1. З меню **Run** оберіть **Edit configurations**
1. Натисніть кнопку **+** та оберіть **sbt Task**.
1. Назвіть його `Run the program`.
1. В полі **Tasks** наберіть `~run`. Опція `~` змушує sbt перебудовувати та перезапускати проєкт, коли ви зберігаєте зміни у файлі проєкту.
1. Натисніть **OK**.
1. В меню **Run** натисніть **Run 'Run the program'**.
1. В коді змініть `75` на `61` та подивіться оновлений результат в консолі.

## Додавання залежностей
Давайте ненадовго змістимо фокус на використання опублікованих бібліотек для забезпечення додаткової функціональності ваших програм.
1. Відкрийте `build.sbt` та додайте наступний рядок:

```
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.2"
```

Тут `libraryDependencies` є набором залежностей та використовуючи `+=`,
ми додаємо залежність [scala-parser-combinators](https://github.com/scala/scala-parser-combinators) до набору залежностей,
які необхідні для sbt та які завантажаться при його запуску. Тепер в будь-якому Scala файлі ви можете використати
класи, об'єкти тощо з scala-parser-combinators через звичайний "import".

Більше опублікованих бібліотек можна знайти на
[Scaladex](https://index.scala-lang.org/) - індекс бібліотек Scala, місце куди ви можете зайти, щоб скопіювати інформацію про бібліотеку
та додати у ваш `build.sbt` файл.

## Наступні кроки

Перейдіть до наступного навчального матеріалу з серії _початок роботи з IntelliJ_, та дізнайтесь про [тестування Scala в IntelliJ зі ScalaTest](testing-scala-in-intellij-with-scalatest.html).

**або**

* [Книга по Scala](/overviews/scala-book/introduction.html), що є набором коротких вступних уроків з основних особливостей.
* [Тур по Scala](/tour/tour-of-scala.html) серія коротких оглядових статей про можливості Scala.
* Продовжить вчити Scala інтерактивно виконуючи
  [вправи зі Scala](https://www.scala-exercises.org/scala_tutorial).