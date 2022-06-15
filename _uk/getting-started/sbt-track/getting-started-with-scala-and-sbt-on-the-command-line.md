---
title: Початок роботи зі Scala і sbt у командному рядку
layout: singlepage-overview
partof: getting-started-with-scala-and-sbt-on-the-command-line
language: uk
disqus: true
next-page: /uk/testing-scala-with-sbt-on-the-command-line
---

У цьому туторіалі ви дізнаєтесь, як створити проєкт Scala шаблон. 
Ви можете використовувати це як відправну точку для власного проєкту. 
Ми використаємо [sbt](https://www.scala-sbt.org/1.x/docs/index.html), що де-факто є основним інструментом збірки для Scala.
sbt компілює, запускає, та тестує ваші проєкти поміж інших корисних задач.
Ми припускаємо, що ви знаєте, як користуватися терміналом.

## Встановлення
1. Впевніться, що ви вже встановили Java 8 JDK (також відому як 1.8)
    * Запустіть `javac -version` у командному рядку і впевніться, що бачите  
    `javac 1.8.___`
    * Якщо у вас не встановлена версія 1.8 або вище, [встановіть JDK](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
1. Встановіть sbt
    * [Mac](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Mac.html)
    * [Windows](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Windows.html)
    * [Linux](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Linux.html)

## Створити проєкт
1. Перейдіть (`cd`) у пусту директорію.
1. Виконайте наступну команду `sbt new scala/hello-world.g8`.
Це завантажує шаблон 'hello-world' з GitHub.
Також буде створена директорія `target`, яку можна ігнорувати.
1. Коли буде запропоновано, назвіть застосунок `hello-world`. Це створить проєкт з назвою "hello-world".
1. А тепер подивимось що було згенеровано:

```
- hello-world
    - project (sbt uses this to install and manage plugins and dependencies)
        - build.properties
    - src
        - main
            - scala (All of your scala code goes here)
                - Main.scala (Entry point of program) <-- this is all we need for now
    - build.sbt (sbt's build definition file)
```

Після збірки вашого проєкту, sbt створить більше `target` директорій для згенерованих файлів.

## Запуск проєкту
1. Перейдіть (`cd`) у `hello-world`.
1. Виконайте `sbt`. Це запустить sbt консоль.
1. Наберіть `~run`. Символ `~` є опціональним та означає пере-збірку при кожному збереженні файлу,
що дає можливість пришвидшити цикл редагування/запуск/відлагодження.

## Модифікація коду
1. Відкрийте файл `src/main/scala/Main.scala` у вашому текстовому редакторі.
1. Змініть "Hello, World!" на "Hello, New York!"
1. Якщо ви не зупинили роботу sbt, ви побачите як на консолі з'явиться "Hello, New York!".
1. Ви можете продовжити робити зміни та бачити результати на консолі.

## Додання залежностей
Трохи змінивши фокус уваги, подивімось, як використовувати опубліковані бібліотеки, щоб додати додаткову функціональність до наших програм.

1. Відкрийте `build.sbt` та додайте наступний рядок:

```
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.2"
```

Тут `libraryDependencies` є набором залежностей та використовуючи `+=`,
ми додаємо залежність [scala-parser-combinators](https://github.com/scala/scala-parser-combinators) до набору залежностей,
які необхідні для sbt та які завантажаться при його запуску. Тепер в будь-якому Scala файлі ви можете використати
класи, об'єкти, тощо з scala-parser-combinators через звичайний "import".

Більше опублікованих бібліотек можна знайти на 
[Scaladex](https://index.scala-lang.org/) - індекс бібліотек Scala, місце куди ви можете зайти, щоб скопіювати інформацію про бібліотеку 
та додати у ваш `build.sbt` файл.

## Наступні кроки

Перейдіть до наступного туторіалу з серії _початок роботи з sbt_, та дізнайтесь про [тестування Scala з sbt та ScalaTest в командному рядку](testing-scala-with-sbt-on-the-command-line.html).

**або**

- Продовжить вивчати Scala інтерактивно нам [Вправи зі Scala](https://www.scala-exercises.org/scala_tutorial).
- Дізнайтеся про можливості Scala у коротких статтях, переглянувши наш [Тур по Scala]({{ site.baseurl }}/tour/tour-of-scala.html).
