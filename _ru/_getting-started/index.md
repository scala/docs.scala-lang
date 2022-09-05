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
который автоматически устанавливает все зависимости, 
но также возможно по отдельности установить каждый инструмент вручную.

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
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-default %}
{% endaltDetails %}
{% endtab %}
<!-- end macOS -->

<!-- Linux -->
{% tab Linux for=install-cs-setup-tabs %}
  Запустите в терминале следующую команду, следуя инструкциям на экране:
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.linux %}
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
Scala code runner version {{site.scala-3-version}} -- Copyright 2002-2022, LAMP/EPFL
```
Если сообщение не выдано, вам может потребоваться перезайти в терминал (или перезагрузиться), 
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
> If you prefer Scala 2 to be run by default, you can force that version to be installed with:
> ```
> $ cs install scala:{{ site.scala-version }} scalac:{{ site.scala-version }}
> ```

### ...или вручную

You only need two tools to compile, run, test, and package a Scala project: Java 8 or 11,
and sbt.
To install them manually:

1. if you don't have Java 8 or 11 installed, download
   Java from [Oracle Java 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html), [Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html),
   or [AdoptOpenJDK 8/11](https://adoptopenjdk.net/). Refer to [JDK Compatibility](/overviews/jdk-compatibility/overview.html) for Scala/Java compatibility detail.
1. Install [sbt](https://www.scala-sbt.org/download.html)

## Create a "Hello World" project with sbt

Once you have installed sbt, you are ready to create a Scala project, which
is explained in the following sections.

To create a project, you can either use the command line or an IDE.
If you are familiar with the command line, we recommend that approach.

### Using the command line

sbt is a build tool for Scala. sbt compiles, runs,
and tests your Scala code. (It can also publish libraries and do many other tasks.)

To create a new Scala project with sbt:

1. `cd` to an empty folder.
1. Run the command `sbt new scala/scala3.g8` to create a Scala 3 project, or `sbt new scala/hello-world.g8` to create a Scala 2 project.
   This pulls a project template from GitHub.
   It will also create a `target` folder, which you can ignore.
1. When prompted, name the application `hello-world`. This will
   create a project called "hello-world".
1. Let's take a look at what just got generated:

```
- hello-world
    - project (sbt uses this for its own files)
        - build.properties
    - build.sbt (sbt's build definition file)
    - src
        - main
            - scala (all of your Scala code goes here)
                - Main.scala (Entry point of program) <-- this is all we need for now
```

More documentation about sbt can be found in the [Scala Book](/scala3/book/tools-sbt.html) (see [here](/overviews/scala-book/scala-build-tool-sbt.html) for the Scala 2 version)
and in the official sbt [documentation](https://www.scala-sbt.org/1.x/docs/index.html)

### With an IDE

You can skip the rest of this page and go directly to [Building a Scala Project with IntelliJ and sbt](/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html)


## Open hello-world project

Let's use an IDE to open the project. The most popular ones are IntelliJ and VSCode.
They both offer rich IDE features, but you can still use [many other editors.](https://scalameta.org/metals/docs/editors/overview.html)

### Using IntelliJ

1. Download and install [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/)
1. Install the Scala plugin by following [the instructions on how to install IntelliJ plugins](https://www.jetbrains.com/help/idea/managing-plugins.html)
1. Open the `build.sbt` file then choose *Open as a project*

### Using VSCode with metals

1. Download [VSCode](https://code.visualstudio.com/Download)
1. Install the Metals extension from [the Marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals)
1. Next, open the directory containing a `build.sbt` file (this should be the directory `hello-world` if you followed the previous instructions). When prompted to do so, select *Import build*.

>[Metals](https://scalameta.org/metals) is a “Scala language server” that provides support for writing Scala code in VS Code and other editors like [Atom, Sublime Text, and more](https://scalameta.org/metals/docs/editors/overview.html), using the Language Server Protocol.
>
> Under the hood, Metals communicates with the build tool by using
> the [Build Server Protocol (BSP)](https://build-server-protocol.github.io/). For details on how Metals works, see, [“Write Scala in VS Code, Vim, Emacs, Atom and Sublime Text with Metals”](https://www.scala-lang.org/2019/04/16/metals.html).

### Play with the source code

View these two files in your IDE:

- _build.sbt_
- _src/main/scala/Main.scala_

When you run your project in the next step, the configuration in _build.sbt_ will be used to run the code in _src/main/scala/Main.scala_.

## Run Hello World

If you’re comfortable using your IDE, you can run the code in _Main.scala_ from your IDE.

Otherwise, you can run the application from a terminal with these steps:

1. `cd` into `hello-world`.
1. Run `sbt`. This opens up the sbt console.
1. Type `~run`. The `~` is optional and causes sbt to re-run on every file save,
   allowing for a fast edit/run/debug cycle. sbt will also generate a `target` directory
   which you can ignore.

When you’re finished experimenting with this project, press `[Enter]` to interrupt the `run` command.
Then type `exit` or press `[Ctrl+D]` to exit sbt and return to your command line prompt.

## Next Steps

Once you've finished the above tutorials, consider checking out:

* [The Scala Book](/scala3/book/introduction.html) (see the Scala 2 version [here](/overviews/scala-book/introduction.html)), which provides a set of short lessons introducing Scala’s main features.
* [The Tour of Scala](/tour/tour-of-scala.html) for bite-sized introductions to Scala's features.
* [Learning Resources](/learn.html), which includes online interactive tutorials and courses.
* [Our list of some popular Scala books](/books.html).
* [The migration guide](/scala3/guides/migration/compatibility-intro.html) helps you to migrate your existing Scala 2 code base to Scala 3.

## Getting Help
There are a multitude of mailing lists and real-time chat rooms in case you want to quickly connect with other Scala users. Check out our [community](https://scala-lang.org/community/) page for a list of these resources, and for where to reach out for help.
