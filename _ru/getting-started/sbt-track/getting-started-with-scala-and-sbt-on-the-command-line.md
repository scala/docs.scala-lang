---
title: Начало работы со Scala и sbt в командной строке
layout: singlepage-overview
partof: getting-started-with-scala-and-sbt-on-the-command-line
language: ru
disqus: true
next-page: /ru/testing-scala-with-sbt-on-the-command-line
---

В этом руководстве вы увидите, как создавать проекты Scala из шаблона. 
Это можно использовать как отправную точку для своих собственных проектов. 
Мы будем использовать [sbt](https://www.scala-sbt.org/1.x/docs/index.html), де-факто инструмент сборки для Scala. 
sbt компилирует, запускает и тестирует ваши проекты среди других связанных задач. 
Мы предполагаем, что вы знаете, как пользоваться терминалом.

## Установка
1. Убедитесь, что у вас установлена Java 8 JDK (также известная как 1.8)
    * Запустите `javac -version` в командной строке и убедитесь, что выдается
    `javac 1.8.___`
    * Если у вас нет версии 1.8 или выше, [установите JDK](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
1. Установите sbt
    * [Mac](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Mac.html)
    * [Windows](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Windows.html)
    * [Linux](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Linux.html)

## Создание проекта

{% tabs sbt-welcome-1 class=tabs-scala-version %}
{% tab 'Scala 2' for=sbt-welcome-1 %}

1. `cd` в пустую папку.
1. Запустите следующую команду `sbt new scala/hello-world.g8`.
   Она извлекает шаблон 'hello-world' из GitHub.
   Она также создаст папку `target`, которую пока можно игнорировать.
1. При появлении запроса назовите приложение `hello-world`. Это создаст проект под названием "hello-world".
1. Давайте взглянем на то, что только что было сгенерировано:

{% endtab %}
{% tab 'Scala 3' for=sbt-welcome-1 %}

1. `cd` в пустую папку.
1. Запустите следующую команду `sbt new scala/scala3.g8`.
   Она извлекает шаблон 'scala3' из GitHub.
   Она также создаст папку `target`, которую пока можно игнорировать.
1. При появлении запроса назовите приложение `hello-world`. Это создаст проект под названием "hello-world".
1. Давайте взглянем на то, что только что было сгенерировано:

{% endtab %}
{% endtabs %}


```
- hello-world
    - project (sbt использует эту папку для установки и настройки плагинов и зависимостей)
        - build.properties
    - src
        - main
            - scala (весь Scala код находится в этой папке)
                - Main.scala (точка входа в программу) <-- это все, что вам сейчас нужно
    - build.sbt (файл определения сборки для sbt)
```

После того как вы создадите свой проект, sbt создаст дополнительные каталоги `target` для сгенерированных файлов. 
Вы можете игнорировать их.

## Запуск проекта
1. `cd` в `hello-world`.
1. Запустите `sbt`. Эта команда запустит sbt console.
1. Запустите `~run`. `~` опциональна и заставляет sbt перекомпилировать
   и повторно запускать проект при каждом сохранении изменений в файле проекта 
   для быстрого цикла редактирование/запуск/отладка. 
   sbt также сгенерит директорию `target`, которую можно игнорировать.

## Доработка кода
1. Откройте файл `src/main/scala/Main.scala` в вашем любимом текстовом редакторе.
1. Измените "Hello, World!" на "Hello, New York!"
1. Если вы не остановили команду sbt, то должны увидеть "Hello, New York!", напечатанным в консоли.
1. Вы можете продолжить вносить изменения и видеть результаты доработки в консоли.

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
Теперь в любом файле Scala можно импортировать классы, объекты и т.д. из `scala-parser-combinators` с помощью обычного импорта.

Вы можете найти больше опубликованных библиотек на [Scaladex](https://index.scala-lang.org/), каталоге библиотек Scala,
где вы также можете скопировать указанную выше информацию о зависимостях для вставки в свой файл `build.sbt`.

> **Примечание для Java библиотек:** Для обычной библиотеки Java следует использовать только один знак процента (`%`) 
> между названием организации и именем артефакта. Двойной процент (`%%`) — это специализация Scala библиотек.
> Подробнее об этом можно узнать в [документации sbt][sbt-docs-lib-dependencies].

## Следующие шаги

Перейдите к следующему учебнику из серии _getting started with sbt_ и узнайте, как [тестировать Scala c sbt и ScalaTest в командной строке](testing-scala-with-sbt-on-the-command-line.html).

**или**

- Продолжайте изучать Scala в интерактивном режиме на
 [Scala Exercises](https://www.scala-exercises.org/scala_tutorial).
- Узнайте о возможностях Scala с помощью небольших статей, ознакомившись с нашим [туром по Scala]({{ site.baseurl }}/ru/tour/tour-of-scala.html).

[sbt-docs-lib-dependencies]: https://www.scala-sbt.org/1.x/docs/Library-Dependencies.html#Getting+the+right+Scala+version+with
