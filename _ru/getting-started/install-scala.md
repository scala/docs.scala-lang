---
layout: singlepage-overview
title: Начало работы
partof: getting-started
language: ru
includeTOC: true

newcomer_resources:
  - title: Вы пришли с Java?
    description: Что нужно знать, чтобы ускорить работу со Scala после первоначального запуска.
    icon: "fa fa-coffee"
    link: /tutorials/scala-for-java-programmers.html
  - title: Scala в браузере
    description: >
      Чтобы сразу начать экспериментировать со Scala, используйте "Scastie" в своем браузере.
    icon: "fa fa-cloud"
    link: https://scastie.scala-lang.org/pEBYc5VMT02wAGaDrfLnyw
---

Приведенные ниже инструкции охватывают как Scala 3, так и Scala 2.

<div class="inline-sticky-top">
{% altDetails need-help-info-box 'Нужна помощь?' class=help-info %}
*Если у вас возникли проблемы с настройкой Scala, смело обращайтесь за помощью в канал `#scala-users`
[нашего Discord](https://discord.com/invite/scala).*
{% endaltDetails %}
</div>

## Ресурсы для новичков

{% include inner-documentation-sections.html links=page.newcomer_resources %}

## Установка Scala на компьютер

Установка Scala означает установку различных инструментов командной строки, 
таких как компилятор Scala и инструменты сборки. 
Мы рекомендуем использовать инструмент установки "Coursier", 
который автоматически устанавливает все зависимости. 
Также возможно установить по отдельности каждый инструмент вручную.

### Использование Scala Installer (рекомендованный путь)

Установщик Scala — это инструмент [Coursier](https://get-coursier.io/docs/cli-overview), 
основная команда которого называется `cs`. 
Он гарантирует, что в системе установлены JVM и стандартные инструменты Scala. 
Установите его в своей системе, следуя следующим инструкциям.

<!-- Display tabs for each OS -->
{% tabs install-cs-setup-tabs class=platform-os-options %}

<!-- macOS -->
{% tab macOS for=install-cs-setup-tabs %}
Запустите в терминале следующую команду, следуя инструкциям на экране:
{% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-brew %}
{% altDetails cs-setup-macos-nobrew  "В качестве альтернативы, если вы не используете Homebrew:" %}
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-x86-64 %}
{% endaltDetails %}
{% endtab %}
<!-- end macOS -->

<!-- Linux -->
{% tab Linux for=install-cs-setup-tabs %}
  Запустите в терминале следующую команду, следуя инструкциям на экране:
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.linux-x86-64 %}
{% endtab %}
<!-- end Linux -->

<!-- Windows -->
{% tab Windows for=install-cs-setup-tabs %}
  Загрузите и запустите [установщик Scala для Windows]({{site.data.setup-scala.windows-link}})
  на базе Coursier и следуйте инструкциям на экране.
{% endtab %}
<!-- end Windows -->

<!-- Other -->
{% tab Иное for=install-cs-setup-tabs defaultTab %}
  <noscript>
    <p><span style="font-style:italic;">JavaScript is disabled, click the tab relevant for your OS.</span></p>
  </noscript>
  Следуйте документации Coursier о том, 
  [как установить и запустить `cs setup`](https://get-coursier.io/docs/cli-installation).
{% endtab %}
<!-- end Other -->

{% endtabs %}
<!-- End tabs -->

<!-- Alternative Detail - test the `scala` command -->
{% altDetails testing-your-setup 'Тестирование установки' %}
Проверьте корректность установки с помощью команды `scala -version`, которая должна вывести:
```bash
$ scala -version
Scala code runner version: 1.4.3
Scala version (default): {{site.scala-3-version}}
```
Если сообщение не выдано, возможно, необходимо перезайти в терминал (или перезагрузиться), 
чтобы изменения вступили в силу.
{% endaltDetails %}
<!-- end Alternative Detail -->

Наряду с JVM `cs setup` также устанавливает полезные инструменты командной строки:

| Commands      | Description                                                                          |
|---------------|--------------------------------------------------------------------------------------|
| `scalac`      | компилятор Scala                                                                     |
| `scala`       | Scala REPL и средство запуска сценариев                                              |
| `scala-cli`   | [Scala CLI](https://scala-cli.virtuslab.org), интерактивный инструментарий для Scala |
| `sbt`, `sbtn` | Инструмент сборки [sbt](https://www.scala-sbt.org/)                                  |
| `amm`         | [Ammonite](https://ammonite.io/) — улучшенный REPL                                   |
| `scalafmt`    | [Scalafmt](https://scalameta.org/scalafmt/) - средство форматирования кода Scala     |

Дополнительная информация о cs [доступна по ссылке](https://get-coursier.io/docs/cli-overview).

> `cs setup` по умолчанию устанавливает компилятор и исполняющую программу Scala 3 
> (команды `scalac` и `scala` соответственно). Независимо от того, собираетесь ли вы использовать Scala 2 или 3, 
> обычно это не проблема, потому что в большинстве проектов используется инструмент сборки, 
> который будет использовать правильную версию Scala независимо от того, какая версия установлена "глобально". 
> Тем не менее, вы всегда можете запустить конкретную версию Scala, используя
> ```
> $ cs launch scala:{{ site.scala-version }}
> $ cs launch scalac:{{ site.scala-version }}
> ```
> Если предпочтительно, чтобы по умолчанию запускалась Scala 2, вы можете принудительно установить эту версию с помощью:
> ```
> $ cs install scala:{{ site.scala-version }} scalac:{{ site.scala-version }}
> ```

### ...или вручную

Для компиляции, запуска, тестирования и упаковки проекта Scala нужны только два инструмента: 
Java 8 или 11 и sbt. 
Чтобы установить их вручную:

1. если не установлена Java 8 или 11, загрузите Java из
   [Oracle Java 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html), [Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html),
   или [AdoptOpenJDK 8/11](https://adoptopenjdk.net/).
   Подробную информацию о совместимости Scala/Java см. в разделе [Совместимость с JDK](/overviews/jdk-compatibility/overview.html).
1. установить [sbt](https://www.scala-sbt.org/download/)

## Создание проекта "Hello World" с помощью sbt

В следующих разделах объясняется как создавать проект Scala после того, как установлен sbt.

Для создания проекта можно использовать командную строку или IDE.
Мы рекомендуем командную строку, если вы с ней знакомы.

### Использование командной строки

sbt — это инструмент сборки для Scala. sbt компилирует, запускает и тестирует Scala код 
(он также может публиковать библиотеки и выполнять множество других задач).

Чтобы создать новый проект Scala с помощью sbt:

1. `cd` в пустую папку.
1. Запустите команду `sbt new scala/scala3.g8`, чтобы создать проект на Scala 3, 
   или `sbt new scala/hello-world.g8` для создания проекта на Scala 2.
   Она извлекает шаблон проекта из GitHub.
   Эта команда также создает папку `target`, которую вы можете игнорировать.
1. При появлении запроса назовите приложение `hello-world`. 
   Это создаст проект под названием "hello-world".
1. Будет сгенерировано следующее:

```
- hello-world
    - project (sbt использует эту папку для собственных файлов)
        - build.properties
    - build.sbt (файл определения сборки sbt)
    - src
        - main
            - scala (здесь весь Scala code)
                - Main.scala (точка входа в программу) <-- это все, что сейчас нужно
```

Дополнительную документацию по sbt можно найти в [Scala Book](/scala3/book/tools-sbt.html)
(см. [здесь](/overviews/scala-book/scala-build-tool-sbt.html) для версии Scala 2)
и в официальной [документации sbt](https://www.scala-sbt.org/1.x/docs/index.html).

### С интегрированной средой разработки (IDE)

Вы можете пропустить оставшуюся часть страницы и сразу перейти к [созданию проекта Scala с помощью IntelliJ и sbt](/ru/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html).


## Открыть проект hello-world

Давайте используем IDE, чтобы открыть проект. Самые популярные из них — IntelliJ и VSCode. 
Оба предлагают обширные возможности, но вы по-прежнему можете использовать [множество других редакторов](https://scalameta.org/metals/docs/editors/overview.html).


### Использование IntelliJ

1. Загрузите и установите [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/)
1. Установите Scala plugin, следуя [инструкциям по установке плагинов IntelliJ](https://www.jetbrains.com/help/idea/managing-plugins.html)
1. Откройте файл `build.sbt`, затем выберете *Open as a project*

### Использование VSCode с metals

1. Загрузите [VSCode](https://code.visualstudio.com/Download)
1. Установите расширение Metals из [Marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals)
1. Затем откройте каталог, содержащий файл `build.sbt` (это должен быть каталог `hello-world`, если вы следовали предыдущим инструкциям). Когда будет предложено, выберите *Import build*.

> [Metals](https://scalameta.org/metals) — это “языковой сервер Scala”, обеспечивающий поддержку написания кода Scala в VS Code и других редакторах, 
> таких как [Atom, Sublime Text и других](https://scalameta.org/metals/docs/editors/overview.html), использующих Language Server Protocol.
>
> Под капотом Metals взаимодействует со средством сборки с помощью
> [Build Server Protocol (BSP)](https://build-server-protocol.github.io/). 
> Подробнее о том, как работает Metals, см. [“Написание Scala в VS Code, Vim, Emacs, Atom и Sublime Text с помощью Metals”](https://www.scala-lang.org/2019/04/16/metals.html).

### Знакомство с исходным кодом

Просмотрите эти два файла в своей IDE:

- _build.sbt_
- _src/main/scala/Main.scala_

При запуске проекта на следующем шаге, конфигурация в _build.sbt_ будет использована для запуска кода в _src/main/scala/Main.scala_.

## Запуск Hello World

Код в _Main.scala_ можно запускать из IDE, если удобно.

Но вы также можете запустить приложение из терминала, выполнив следующие действия:

1. `cd` в `hello-world`.
1. Запустить `sbt`. Эта команда открывает sbt-консоль.
1. В консоле введите `~run`. `~` является необязательным, но заставляет sbt повторно запускаться при каждом сохранении файла,
   обеспечивая быстрый цикл редактирования/запуска/отладки. sbt также создаст директорию `target`, которую пока можно игнорировать.

После окончания экспериментирования с проектом, нажмите `[Enter]`, чтобы прервать команду `run`. 
Затем введите `exit` или нажмите `[Ctrl+D]`, чтобы выйти из sbt и вернуться в командную строку.

## Следующие шаги

После того как пройдете приведенные выше обучающие материалы, подумайте о том, чтобы проверить:

* [The Scala Book](/scala3/book/introduction.html) (см. версию для Scala 2 [здесь](/overviews/scala-book/introduction.html)), которая содержит набор коротких уроков, знакомящих с основными функциями Scala.
* [The Tour of Scala](/ru/tour/tour-of-scala.html) для краткого ознакомления с функциями Scala.
* [Обучающие ресурсы](/online-courses.html), которые включают в себя интерактивные онлайн-учебники и курсы.
* [Наш список некоторых популярных книг по Scala](/books.html).
* [Руководство по миграции](/scala3/guides/migration/compatibility-intro.html) поможет перенести существующую кодовую базу Scala 2 на Scala 3.

## Получение помощи

Существует множество рассылок и real-time чатов на случай, если вы хотите быстро связаться с другими пользователями Scala. 
Посетите страницу [нашего сообщества](https://scala-lang.org/community/), чтобы ознакомиться со списком этих ресурсов и узнать, куда можно обратиться за помощью.
