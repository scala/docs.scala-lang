---
title: Создание проекта Scala с IntelliJ и sbt
layout: singlepage-overview
partof: building-a-scala-project-with-intellij-and-sbt
language: ru
disqus: true
previous-page: /ru/getting-started/intellij-track/getting-started-with-scala-in-intellij
next-page: /ru/testing-scala-in-intellij-with-scalatest
---

В этом руководстве мы увидим, как создать проект Scala с помощью [sbt](https://www.scala-sbt.org/1.x/docs/index.html). 
sbt — популярный инструмент для компиляции, запуска и тестирования проектов Scala любой сложности. 
Использование инструмента сборки, такого как sbt (или Maven/Gradle), становится необходимым, 
если вы создаете проекты с зависимостями или несколькими файлами кода. 
Мы предполагаем, что вы прочитали [первое руководство](getting-started-with-scala-in-intellij.html).

## Создание проекта
В этом разделе мы покажем вам, как создать проект в IntelliJ.
Однако, если вы знакомы с командной строкой, мы рекомендуем вам попробовать 
[Начало работы со Scala и sbt в командной строке]({{site.baseurl}}/ru/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html)
а затем вернуться к разделу "Написание Scala кода".

1. Если вы не создавали проект из командной строки, откройте IntelliJ и выберите "Create New Project"
  * На левой панели выберите Scala, а на правой панели - sbt
  * Нажмите **Next**
  * Назовите проект "SbtExampleProject"
1. Если вы уже создали проект в командной строке, откройте IntelliJ, выберите *Import Project* и откройте `build.sbt` файл вашего проекта
1. Убедитесь, что ваша **JDK version** - это 1.8, а **sbt version** не ниже 0.13.13
1. Выберите **Use auto-import**, чтобы доступные зависимости загружались автоматически.
1. Выберите **Finish**

## Разбор структуры каталогов
sbt создает множество каталогов, которые могут быть полезны, когда вы начнете создавать более сложные проекты.
На данный момент вы можете игнорировать большинство из них, но вот объяснение, для чего все это:

```
- .idea (файлы IntelliJ)
- project (плагины и дополнительные настройки sbt)
- src (исходные файлы)
    - main (код приложения)
        - java (исходные файлы Java)
        - scala (исходные файлы Scala) <-- это все, что вам сейчас нужно
        - scala-2.12 (файлы, специфичные для Scala 2.12)
    - test (модульные тесты)
- target (сгенерированные файлы)
- build.sbt (файл определения сборки для sbt)
```


## Написание Scala-кода
1. На панели слева **Project**, разверните `SbtExampleProject` => `src` => `main`
1. Щелкните правой кнопкой мыши на `scala` и выберете **New** => **Package**
1. Назовите пакет `example` и нажмите **OK** (или просто нажмите клавишу **Enter** или **Return**).
1. Щелкните правой кнопкой мыши на пакете `example` и выберите **New** => **Scala class** 
(если вы не видите эту опцию, щелкните правой кнопкой мыши на `SbtExampleProject`, кликните на **Add Frameworks Support**, выберете **Scala** и продолжите)
1. Назовите класс `Main` и измените **Kind** на `Object`.
1. Вставьте следующий код:

```
@main def run() =
  val ages = Seq(42, 75, 29, 64)
  println(s"The oldest person is ${ages.max}")
```

Примечание: IntelliJ имеет собственную реализацию компилятора Scala, 
и иногда ваш код верен, даже если IntelliJ указывает обратное. 
Вы всегда можете проверить, может ли sbt запустить ваш проект в командной строке.

## Запуск проекта
1. В меню **Run**, выберите **Edit configurations**
1. Нажмите кнопку **+** и выберите **sbt Task**.
1. Назовите задачу `Run the program`.
1. В поле **Tasks**, введите `~run`. `~` заставляет sbt перекомпилировать 
и повторно запускать проект при каждом сохранении изменений в файле проекта.
1. Нажмите **OK**.
1. В меню **Run** нажмите **'Run the program'**.
1. В коде измените `75` на `61` и посмотрите на обновленные результаты в консоли.

## Добавление зависимости
Немного меняя тему, давайте посмотрим, как использовать опубликованные библиотеки 
для добавления дополнительных функций в наши приложения.
1. Откройте `build.sbt` и добавьте следующую строку:

```
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.2"
```
Здесь `libraryDependencies` представляет набор зависимостей, 
и с помощью `+=` мы добавляем зависимость [scala-parser-combinators](https://github.com/scala/scala-parser-combinators) 
к набору зависимостей, которые sbt будет загружать при запуске. 
Теперь в любой файл Scala можно импортировать классы, объекты и т.д. из `scala-parser-combinators` с помощью обычного импорта.

Вы можете найти больше опубликованных библиотек на [Scaladex](https://index.scala-lang.org/), каталоге библиотек Scala, 
где вы также можете скопировать указанную выше информацию о зависимостях для вставки в свой файл `build.sbt`.

## Следующие шаги

Перейдите к следующему руководству из серии _getting started with IntelliJ_ и узнайте, как [тестировать Scala в IntelliJ с помощью ScalaTest](testing-scala-in-intellij-with-scalatest.html).

**или**

* [The Scala Book](/scala3/book/introduction.html), содержащая набор коротких уроков, знакомящих с основными функциями Scala.
* [The Tour of Scala](/ru/tour/tour-of-scala.html) для краткого ознакомления с возможностями Scala.
- Продолжайте изучать Scala в интерактивном режиме на
 [Scala Exercises](https://www.scala-exercises.org/scala_tutorial).
