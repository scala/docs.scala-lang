---
layout: singlepage-overview
title: Перші кроки
partof: getting-started
language: uk
includeTOC: true
redirect_from:
  - /uk/scala3/getting-started.html  # we deleted the scala 3 version of this page
---

Інструкції нижче стосуються як Scala 2 так, і та Scala 3.

## Спробуйте Scala без інсталяції

Щоб швидко почати експериментувати зі Scala, відкрийте <a href="https://scastie.scala-lang.org/pEBYc5VMT02wAGaDrfLnyw" target="_blank">“Scastie” у вашому браузері</a>.
_Scastie_ це онлайн “пісочниця”, де ви можете експериментувати з прикладами на Scala та подивитись як все працює, з доступом до всіх компіляторів Scala та доступних бібліотек.

> Scastie підтримує як Scala 2 так, і Scala 3, але за замовчування
> використовується Scala 3. Якщо ж ви шукаєте приклади на Scala 2,
> [натисніть тут](https://scastie.scala-lang.org/MHc7C9iiTbGfeSAvg8CKAA).

##  Встановіть Scala на ваш комп'ютер

Інсталяція Scala означає встановлення різних command-line інструментів, таких як компілятор Scala та інструменти для збірки.
Ми радимо використовувати інсталятор "Coursier", який автоматично встановить всі необхідні залежності, але ви можете встановити окремо кожен інструмент.

### За допомогою інсталятора Scala (рекомендовано)

Інсталятор Scala називається [Coursier](https://get-coursier.io/docs/cli-overview), а його основна команда має назву `cs`.
Він гарантує, що JVM та стандартні інструменти Scala встановлені на вашій системі.
Щоб встановити його на вашій системі виконайте наступні інструкції.

<!-- Display tabs for each OS -->
{% tabs install-cs-setup-tabs class=platform-os-options %}

<!-- macOS -->
{% tab macOS for=install-cs-setup-tabs %}
Виконайте наступну команду в терміналі, виконуючи всі спливаючі інструкції:
{% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-brew %}
{% altDetails cs-setup-macos-nobrew "Якщо ви не використовуєте Homebrew:" %}
{% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-x86-64 %}
{% endaltDetails %}
{% endtab %}
<!-- end macOS -->

<!-- Linux -->
{% tab Linux for=install-cs-setup-tabs %}
Виконайте наступну команду в терміналі, виконуючи всі спливаючі інструкції:
{% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.linux-x86-64 %}
{% endtab %}
<!-- end Linux -->

<!-- Windows -->
{% tab Windows for=install-cs-setup-tabs %}
Завантажте та запустіть [the Scala installer for Windows]({{site.data.setup-scala.windows-link}})
інсталятор на основі Coursier, виконуючи всі спливаючі інструкції.
{% endtab %}
<!-- end Windows -->

<!-- Other -->
{% tab Other for=install-cs-setup-tabs defaultTab %}
<noscript>
<p><span style="font-style:italic;">JavaScript is disabled, click the tab relevant for your OS.</span></p>
</noscript>
Дотримуйтесь документації від Coursier з того,
[як встановити і запустити `cs setup`](https://get-coursier.io/docs/cli-installation).
{% endtab %}
<!-- end Other -->

{% endtabs %}
<!-- End tabs -->

<!-- Alternative Detail - test the `scala` command -->
{% altDetails testing-your-setup 'Перевірити налаштування' %}
Перевірте ваші налаштування виконавши команду `scala -version`, яка має вивести:
```bash
$ scala -version
Scala code runner version: 1.4.3
Scala version (default): {{site.scala-3-version}}
```
Якщо це не спрацювало, необхідно завершити сеанс та зайти в систему знову (або перезавантажити), щоб зміни застосувались на вашій системі.
{% endaltDetails %}
<!-- end Alternative Detail -->


Разом з менеджментом JVM-ів, `cs setup` також встановлює корисні command-line інструменти:

| Команда       | Опис                                                                                   |
|---------------|----------------------------------------------------------------------------------------|
| `scalac`      | компілятор Scala                                                                       |
| `scala`       | інтерактивне середовище Scala та інструмент для запуску скриптів                       |
| `scala-cli`   | [Scala CLI](https://scala-cli.virtuslab.org), інтерактивні інструменти для Scala       |
| `sbt`, `sbtn` | Інструмент збірки [sbt](https://www.scala-sbt.org/)                                    |
| `amm`         | [Ammonite](https://ammonite.io/) розширене інтерактивне середовище (REPL)              |
| `scalafmt`    | [Scalafmt](https://scalameta.org/scalafmt/) призначений для форматування коду на Scala |

Для більш детальної інформації про `cs`, прочитайте
[документацію coursier-cli](https://get-coursier.io/docs/cli-overview).

> `cs setup` встановлює компілятор Scala 3 та інтерактивне середовище за замовчування (команди `scalac` та
> `scala` відповідно). Незалежно від того, чи збираєтеся ви використовувати Scala 2 чи 3,
> тому що більшість проєктів використовує інструменти для збірки,
> які використовують правильні версії Scala незалежно від того, яка встановлена "глобально".
> Однак, ви завжди можете запустити певну версію Scala за допомогою
> ```
> $ cs launch scala:{{ site.scala-version }}
> $ cs launch scalac:{{ site.scala-version }}
> ```
> Якщо ви надаєте перевагу Scala 2 за замовчуванням, ви можете примусово встановити певну версію:
> ```
> $ cs install scala:{{ site.scala-version }} scalac:{{ site.scala-version }}
> ```

### ...або вручну

Вам необхідно лише два інструменти, для того, щоб скомпілювати, запустити, протестувати й упакувати Scala проєкт: Java 8 або 11, і sbt.
Щоб встановити їх вручну:

1. Якщо Java 8 або 11 не встановлені, необхідно завантажити
   Java з [Oracle Java 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html), [Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html),
   або [AdoptOpenJDK 8/11](https://adoptopenjdk.net/). Перевірте [сумісність JDK](/overviews/jdk-compatibility/overview.html) для Scala/Java.
1. Встановіть [sbt](https://www.scala-sbt.org/download/)

## Створити проєкт "Hello World" з sbt

Після встановлення sbt ви готові до створення проєкту на Scala, який ми розглянемо в подальших розділах.

Щоб створити проєкт, ви можете використати або термінал, або IDE.
Якщо ви знайомі з командним рядком, ми рекомендуємо такий підхід.

### За допомогою командного рядка

Інструмент sbt призначений для збірки проєкту на Scala. sbt компілює, запускає,
та тестує ваш код на Scala. (Також він публікує бібліотеки та виконує багато інших задач.)

Щоб створити новий Scala проєкт за допомогою sbt:

1. Перейдіть (`cd`) в пусту директорію.
1. Виконайте команду `sbt new scala/scala3.g8`, щоб створити проєкт на Scala 3, або `sbt new scala/hello-world.g8`, щоб створити проєкт на Scala 2.
   Команда завантажує шаблон проєкту з GitHub.
   Також, створює директорію `target`, яку ви можете проігнорувати.
1. Коли буде запропоновано, оберіть назву програми `hello-world`. В результаті буде створено проєкт "hello-world".
1. Подивимося, що щойно було створено:

```
- hello-world
    - project (sbt uses this for its own files)
        - build.properties
    - build.sbt (sbt's build definition file)
    - src
        - main
            - scala (весь ваш код на Scala буде тут)
                - Main.scala (Точка входу в програму) <-- це все, що потрібно наразі
```

Більше документації про sbt можна знайти у [Книзі по Scala](/scala3/book/tools-sbt.html) (див. [тут](/overviews/scala-book/scala-build-tool-sbt.html) версію для Scala 2)
та в офіційній [документації](https://www.scala-sbt.org/1.x/docs/index.html) sbt

### За допомогою IDE

Ви можете пропустити подальші кроки та перейти до [Створення Scala проєкту з IntelliJ і sbt](/uk/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html)


## Відкрити проєкт hello-world

Використаймо IDE, щоб відкрити проєкт. Найбільш популярними є IntelliJ та VSCode.
Обидва з них мають багатий функціонал, але ви також можете використати [багато інших редакторів.](https://scalameta.org/metals/docs/editors/overview.html)

### За допомогою IntelliJ

1. Завантажте та встановіть [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/)
1. Встановіть плагін Scala дотримуючись [інструкції з встановлення плагінів в IntelliJ](https://www.jetbrains.com/help/idea/managing-plugins.html)
1. Відкрийте файл `build.sbt` та оберіть *Відкрити як проєкт* (*Open as a project*)

### За допомогою VSCode та metals

1. Завантажте [VSCode](https://code.visualstudio.com/Download)
1. Встановіть розширення Metals з [the Marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals)
1. Відкрийте директорію, що містить файл `build.sbt` (це має бути директорія `hello-world` якщо ви виконали попередні інструкції). Коли буде запропоновано, оберіть *Імпортувати збірку* (*Import build*).

>[Metals](https://scalameta.org/metals) це “Сервер мови Scala” який забезпечує можливість написання коду на Scala в VS Code та інших редакторах на кшталт [Atom, Sublime Text, and more](https://scalameta.org/metals/docs/editors/overview.html), використовуючи Language Server Protocol.
>
> Під капотом, Metals комунікує з інструментом збірки використовуючи
> [Build Server Protocol (BSP)](https://build-server-protocol.github.io/). Більш детально про те, як працює Metals, можна подивитись на [“Write Scala in VS Code, Vim, Emacs, Atom and Sublime Text with Metals”](https://www.scala-lang.org/2019/04/16/metals.html).

### Внесення змін в початковий код

Перегляньте ці два файли у вашому IDE:

- _build.sbt_
- _src/main/scala/Main.scala_

Коли ви будете запускати ваш проєкт у наступному кроці, то будуть використані конфігурації з _build.sbt_ для запуску коду в _src/main/scala/Main.scala_.

## Запустити Hello World

Якщо вам зручно користуватися IDE, ви можете запустити код в _Main.scala_ з вашого IDE.

В іншому випадку ви можете запустити програму через термінал, виконавши такі дії:

1. `cd` в `hello-world`.
1. Запустіть `sbt`. Це відкриє консоль sbt.
1. Наберіть `~run`. Символ `~` опціональний і змушує sbt повторно запускатися після кожного збереження файлу,
   що забезпечує швидкий цикл редагування/запуск/налагодження. sbt також створить директорію `target`, яку ви можете проігнорувати.

Коли ви закінчите експериментувати з вашим проєктом, натисніть `[Enter]` щоб перервати команду `run`.
Потім наберіть `exit` або затисніть `[Ctrl+D]` щоб вийти з sbt та повернутись до вашого командного рядка.

## Наступні кроки

Після того, як ви закінчите наведені вище посібники, спробуйте пройти:

* [Книга по Scala](/scala3/book/introduction.html) (версія по Scala 2 [тут](/overviews/scala-book/introduction.html)), яка містить коротких ознайомчих уроків з основних можливостей Scala.
* [Тур по Scala](/tour/tour-of-scala.html) for bite-sized introductions to Scala's features.
* [Навчальні ресурси](/online-courses.html), що містять інтерактивні онлайн путівники та курси.
* [Наш список деяких популярних книжок по Scala](/books.html).
* [Посібник з міграції](/scala3/guides/migration/compatibility-intro.html) допомагає перевести ваш наявний проєкт зі Scala 2 на Scala 3.

## Отримати допомогу
Існує безліч поштових розсилок та чатів в режимі реального часу, якщо ви захочете зв'язатися з іншими користувачами Scala. Перейдіть на сторінку нашої [спільноти](https://scala-lang.org/community/), щоб побачити перелік можливих способів та попросити про допомогу.

