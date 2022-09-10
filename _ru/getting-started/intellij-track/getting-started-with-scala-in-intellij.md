---
title: Начало работы со Scala в IntelliJ
layout: singlepage-overview
partof: getting-started-with-scala-in-intellij
language: ru
disqus: true
next-page: /ru/building-a-scala-project-with-intellij-and-sbt
---

В этом руководстве мы увидим, как создать минимальный проект Scala с помощью IntelliJ IDE со Scala плагином. 
В этом руководстве IntelliJ загрузит Scala за вас.

## Установка

1. Убедитесь, что у вас установлена Java 8 JDK (также известная как 1.8)
    * Запустите `javac -version` в командной строке и убедитесь, что выдается
    `javac 1.8.___`
    * Если у вас нет версии 1.8 или выше, [установите JDK](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
1. Затем загрузите и установите [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/)
1. Затем, после запуска IntelliJ, вы можете загрузить и установить Scala плагин, следуя 
   [инструкции по установке плагинов IntelliJ](https://www.jetbrains.com/help/idea/installing-updating-and-uninstalling-repository-plugins.html) (найдите "Scala" в меню плагинов).

Когда мы создадим проект, то установим последнюю версию Scala.
Примечание: Если вы хотите открыть существующий проект Scala, вы можете нажать **Open**
при запуске IntelliJ.

## Создание проекта

1. Откройте IntelliJ и нажмите **File** => **New** => **Project**
1. На левой панели выберите Scala. На правой панели - IDEA.
1. Назовите проект **HelloWorld**
1. Если вы впервые создаете Scala проект с помощью IntelliJ, вам необходимо установить Scala SDK.
   Справа от поля Scala SDK нажмите кнопку **Create**.
1. Выберите последний номер версии (например, {{ site.scala-version }}) и нажмите **Download**. 
Это может занять несколько минут, но тот же пакет SDK могут использовать последующие проекты.
1. Когда SDK будет установлен и вы вернетесь в окно "New Project", нажмите **Finish**.

## Написание кода

1. На левой панели **Project** щелкните правой кнопкой мыши на папке `src` и выберите
**New** => **Scala class**. Если вы не видите **Scala class**, щелкните правой кнопкой мыши на **HelloWorld**
и выберите **Add Framework Support...**, затем - **Scala** и продолжить.
Если вы видите ошибку **Error: library is not specified**, вы можете либо нажать кнопку загрузки,
либо выбрать путь к библиотеке вручную. Если вы видите только **Scala Worksheet** попробуйте развернуть папку `src` 
и её подпапку `main`, а затем правой кнопкой мыши на папке `scala`.
1. Назовите класс `Hello` и измените **Kind** на `object`.
1. Вставьте следующий код:

{% tabs hello-world-entry-point class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-entry-point %}

```
object Hello extends App {
  println("Hello, World!")
}
```

{% endtab %}

{% tab 'Scala 3' for=hello-world-entry-point %}

```
@main def hello(): Unit =
  println("Hello, World!")
```

В Scala 3 вы можете удалить объект `Hello` и вместо него определить метод верхнего уровня `hello`
с аннотацией `@main`.

{% endtab %}

{% endtabs %}

## Запуск

{% tabs hello-world-run class=tabs-scala-version %}

{% tab  'Scala 2' for=hello-world-run %}

* Щелкните правой кнопкой мыши на `Hello` в своем коде и выберите **Run 'Hello'**.
* Готово!

{% endtab %}

{% tab 'Scala 3' for=hello-world-run %}

* Щелкните правой кнопкой мыши на `hello` в своем коде и выберите **Run 'hello'**.
* Готово!

{% endtab %}

{% endtabs %}

## Эксперименты со Скалой

Хороший способ попробовать примеры кода — использовать Scala Worksheets.

1. В левой панели проекта щелкните правой кнопкой мыши на
`src` и выберите **New** => **Scala Worksheet**.
2. Назовите новый Scala worksheet "Mathematician".
3. Введите следующий код в worksheet:

{% tabs square %}
{% tab 'Scala 2 and 3' for=square %}
```
def square(x: Int): Int = x * x

square(2)
```
{% endtab %}
{% endtabs %}

После запуска кода вы заметите, что результаты его выполнения выводятся на правой панели.
Если вы не видите правую панель, щелкните правой кнопкой мыши на вашем Scala worksheet на панели "Проект" 
и выберите "Evaluate Worksheet".

## Следующие шаги

Теперь вы знаете, как создать простой Scala проект, который можно использовать для изучения языка. 
В следующем уроке мы представим важный инструмент сборки под названием sbt, 
который можно использовать для простых проектов и рабочих приложений.

Далее: [Создание проекта Scala с IntelliJ и sbt](building-a-scala-project-with-intellij-and-sbt.html)
