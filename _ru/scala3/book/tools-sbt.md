---
layout: multipage-overview
title: Сборка и тестирование проектов Scala с помощью Sbt
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе рассматриваются широко используемый инструмент сборки sbt и библиотека тестирования ScalaTest.
language: ru
num: 70
previous-page: scala-tools
next-page: tools-worksheets
---

В этом разделе будут показаны два инструмента, которые обычно используются в проектах Scala:

- инструмент сборки [sbt](https://www.scala-sbt.org)
- [ScalaTest](https://www.scalatest.org) - среда тестирования исходного кода

Начнем с использования sbt для создания Scala-проектов, а затем рассмотрим, как использовать sbt и ScalaTest вместе для тестирования.

> Если вы хотите узнать об инструментах, которые помогут вам перенести код Scala 2 на Scala 3,
> ознакомьтесь с нашим [Руководством по миграции на Scala 3](/scala3/guides/migration/compatibility-intro.html).

## Создание проектов Scala с помощью sbt

Можно использовать несколько различных инструментов для создания проектов Scala, включая Ant, Maven, Gradle, Mill и другие.
Но инструмент под названием _sbt_ был первым инструментом сборки, специально созданным для Scala.

> Чтобы установить sbt, см. [страницу загрузки](https://www.scala-sbt.org/download/) или нашу страницу ["Начало работы"][getting_started].

### Создание проекта "Hello, world"

Вы можете создать sbt проект "Hello, world" всего за несколько шагов.
Сначала создайте каталог для работы и перейдите в него:

```bash
$ mkdir hello
$ cd hello
```

В каталоге `hello` создайте подкаталог `project`:

```bash
$ mkdir project
```

Создайте файл с именем _build.properties_ в каталоге `project` со следующим содержимым:

```text
sbt.version=1.10.11
```

Затем создайте файл с именем _build.sbt_ в корневом каталоге проекта, содержащий следующую строку:

```scala
scalaVersion := "{{ site.scala-3-version }}"
```

Теперь создайте файл с именем _Hello.scala_ (первая часть имени не имеет значения) со следующей строкой:

```scala
@main def helloWorld = println("Hello, world")
```

Это все, что нужно сделать.

Должна получиться следующая структура проекта:

```bash
$ tree
.
├── build.sbt
├── Hello.scala
└── project
    └── build.properties
```

Теперь запустите проект с помощью команды `sbt`:

```bash
$ sbt run
```

Вы должны увидеть вывод, который выглядит следующим образом, включая `"Hello, world"` из программы:

```bash
$ sbt run
[info] welcome to sbt 1.6.1 (AdoptOpenJDK Java 11.x)
[info] loading project definition from project ...
[info] loading settings for project from build.sbt ...
[info] compiling 1 Scala source to target/scala-3.0.0/classes ...
[info] running helloWorld
Hello, world
[success] Total time: 2 s
```

Программа запуска — средство командной строки `sbt` - загружает версию sbt, установленную в файле _project/build.properties_,
которая загружает версию компилятора Scala, установленную в файле _build.sbt_,
компилирует код в файле _Hello.scala_ и запускает результирующий байт-код.

Если посмотреть на корневой каталог, то можно увидеть, что появилась папка с именем _target_.
Это рабочие каталоги, которые использует sbt.

Создание и запуск небольшого проекта Scala с помощью sbt занимает всего несколько простых шагов.

### Использование sbt в более крупных проектах

Для небольшого проекта это все, что требует sbt для запуска.
Для более крупных проектов с большим количеством файлов исходного кода, зависимостей или плагинов,
потребуется создать организованную структуру каталогов.
Остальная часть этого раздела демонстрирует структуру, которую использует sbt.

### Структура каталогов sbt

Как и Maven, sbt использует стандартную структуру каталогов проекта.
Преимуществом стандартизации является то, что, как только структура станет привычной,
станет легко работать с другими проектами Scala/sbt.

Первое, что нужно знать - это то, что под корневым каталогом проекта sbt ожидает структуру каталогов,
которая выглядит следующим образом:

```text
.
├── build.sbt
├── project/
│   └── build.properties
├── src/
│   ├── main/
│   │   ├── java/
│   │   ├── resources/
│   │   └── scala/
│   └── test/
│       ├── java/
│       ├── resources/
│       └── scala/
└── target/
```

Также в корневой каталог можно добавить каталог _lib_,
если необходимо в свой проект добавить внешние зависимости — файлы JAR.

Если достаточно создать проект, который имеет только файлы исходного кода Scala и тесты,
но не будет использовать Java файлы и не нуждается в каких-либо "ресурсах" (встроенные изображения, файлы конфигурации и т.д.),
то в каталоге _src_ можно оставить только:

```text
.
└── src/
    ├── main/
    │   └── scala/
    └── test/
        └── scala/
```

### "Hello, world" со структурой каталогов sbt

Создать такую структуру каталогов просто.
Существуют инструменты, которые сделают это за вас, но если вы используете систему Unix/Linux,
можно использовать следующие команды для создания структуры каталогов проекта sbt:

```bash
$ mkdir HelloWorld
$ cd HelloWorld
$ mkdir -p src/{main,test}/scala
$ mkdir project target
```

После запуска этих команд, по запросу `find .` вы должны увидеть такой результат:

```bash
$ find .
.
./project
./src
./src/main
./src/main/scala
./src/test
./src/test/scala
./target
```

Если вы это видите, отлично, вы готовы для следующего шага.

> Существуют и другие способы создания файлов и каталогов для проекта sbt.
> Один из способов - использовать команду sbt new, которая [задокументирована на scala-sbt.org](https://www.scala-sbt.org/1.x/docs/Hello.html).
> Этот подход здесь не показан, поскольку некоторые из создаваемых им файлов более сложны, чем необходимо для такого введения.

### Создание первого файла build.sbt

На данный момент нужны еще две вещи для запуска проекта "Hello, world":

- файл _build.sbt_
- файл _Hello.scala_

Для такого небольшого проекта файлу _build.sbt_ нужна только запись `scalaVersion`, но мы добавим три строки:

```scala
name := "HelloWorld"
version := "0.1"
scalaVersion := "{{ site.scala-3-version }}"
```

Поскольку проекты sbt используют стандартную структуру каталогов, sbt может найти все, что ему нужно.

Теперь осталось просто добавить небольшую программу "Hello, world".

### Программа "Hello, world"

В больших проектах все файлы исходного кода будут находиться в каталогах _src/main/scala_ и _src/test/scala_,
но для небольшого примера, подобного этому, можно поместить файл исходного кода в корневой каталог.
Поэтому создайте файл с именем _HelloWorld.scala_ в корневом каталоге со следующим содержимым:

```scala
@main def helloWorld = println("Hello, world")
```

Этот код определяет "main" метод, который печатает `"Hello, world"` при запуске.

Теперь используйте команду `sbt run` для компиляции и запуска проекта:

```bash
$ sbt run

[info] welcome to sbt
[info] loading settings for project ...
[info] loading project definition
[info] loading settings for project root from build.sbt ...
[info] Compiling 1 Scala source ...
[info] running helloWorld
Hello, world
[success] Total time: 4 s
```

При первом запуске `sbt` загружает все, что ему нужно (это может занять несколько секунд),
но после первого раза запуск становится намного быстрее.

Кроме того, после выполнения первого шага можно обнаружить, что гораздо быстрее запускать sbt в интерактивном режиме.
Для этого вначале отдельно запустите команду `sbt`:

```bash
$ sbt

[info] welcome to sbt
[info] loading settings for project ...
[info] loading project definition ...
[info] loading settings for project root from build.sbt ...
[info] sbt server started at
       local:///${HOME}/.sbt/1.0/server/7d26bae822c36a31071c/sock
sbt:hello-world> _
```

Затем внутри этой оболочки выполните команду `run`:

```
sbt:hello-world> run

[info] running helloWorld
Hello, world
[success] Total time: 0 s
```

Так намного быстрее.

Если вы наберете `help` в командной строке sbt, то увидите список других команд, доступных для запуска.
Введите `exit` (или нажмите `CTRL-D`), чтобы выйти из оболочки sbt.

### Использование шаблонов проектов

Ручное создание структуры проекта может быть утомительным. К счастью, sbt может создать структуру на основе шаблона.

Чтобы создать проект Scala 3 из шаблона, выполните следующую команду в оболочке:

```
$ sbt new scala/scala3.g8
```

Sbt загрузит шаблон, задаст несколько вопросов и создаст файлы проекта в подкаталоге:

```
$ tree scala-3-project-template
scala-3-project-template
├── build.sbt
├── project
│   └── build.properties
├── README.md
└── src
    ├── main
    │   └── scala
    │       └── Main.scala
    └── test
        └── scala
            └── Test1.scala
```

> Если вы хотите создать проект Scala 3, который кросс-компилируется со Scala 2, используйте шаблон `scala/scala3-cross.g8`:
>
> ```
> $ sbt new scala/scala3-cross.g8
> ```

Узнайте больше о `sbt new` и шаблонах проектов в [документации sbt](https://www.scala-sbt.org/1.x/docs/sbt-new-and-Templates.html#sbt+new+and+Templates).

### Другие инструменты сборки для Scala

Хотя sbt широко используется, есть и другие инструменты, которые можно использовать для создания проектов Scala:

- [Ant](https://ant.apache.org/)
- [Gradle](https://gradle.org/)
- [Maven](https://maven.apache.org/)
- [Mill](https://com-lihaoyi.github.io/mill/)

#### Coursier

[Coursier](https://get-coursier.io/docs/overview) - это "преобразователь зависимостей", похожий по функциям на Maven и Ivy.
Он написан на Scala с нуля, "охватывает принципы функционального программирования"
и для быстроты параллельно загружает артефакты.
sbt использует Coursier для обработки большинства разрешений зависимостей,
а в качестве инструмента командной строки его можно использовать для простой установки таких инструментов,
как sbt, Java и Scala, как показано на странице ["С чего начать?"][getting_started].

Этот пример со страницы `launch` показывает, что команда `cs launch` может использоваться для запуска приложений из зависимостей:

```scala
$ cs launch org.scalameta::scalafmt-cli:2.4.2 -- --help
scalafmt 2.4.2
Usage: scalafmt [options] [<file>...]

  -h, --help               prints this usage text
  -v, --version            print version
  more ...
```

Подробнее см. на странице [запуска Coursier](https://get-coursier.io/docs/cli-launch).

## Использование sbt со ScalaTest

[ScalaTest](https://www.scalatest.org) — одна из основных библиотек тестирования для проектов Scala.
В этом разделе рассмотрим шаги, необходимые для создания проекта Scala/sbt, использующего ScalaTest.

### 1) Создание структуры каталогов проекта

Как и в предыдущем уроке, создаем структуру каталогов sbt для проекта с именем _HelloScalaTest_ с помощью следующих команд:

```bash
$ mkdir HelloScalaTest
$ cd HelloScalaTest
$ mkdir -p src/{main,test}/scala
$ mkdir project
```

### 2) Создание файлов build.properties и build.sbt

Затем создаем файл _build.properties_ в подкаталоге _project/_ проекта с такой строкой:

```text
sbt.version=1.10.11
```

Создаем файл _build.sbt_ в корневом каталоге проекта со следующим содержимым:

```scala
name := "HelloScalaTest"
version := "0.1"
scalaVersion := "{{site.scala-3-version}}"

libraryDependencies ++= Seq(
  "org.scalatest" %% "scalatest" % "3.2.19" % Test
)
```

Первые три строки этого файла практически такие же, как и в первом примере.
Строки `libraryDependencies` сообщают sbt о включении зависимостей (файлов JAR), которые необходимы для добавления ScalaTest.

> Документация по ScalaTest всегда была хорошей, и вы всегда можете найти актуальную информацию о том,
> как должны выглядеть эти строки, на странице ["Установка ScalaTest"](https://www.scalatest.org/install).

### 3) Создание файла исходного кода Scala

Затем создаем программу Scala, которую можно использовать для демонстрации ScalaTest.
Сначала создайте каталог в _src/main/scala_ с именем _math_:

```bash
$ mkdir src/main/scala/math
            ----
```

Внутри этого каталога создайте файл _MathUtils.scala_ со следующим содержимым:

```scala
package math

object MathUtils:
  def double(i: Int) = i * 2
```

Этот метод обеспечивает простой способ демонстрации ScalaTest.

### 4) Создание первых тестов ScalaTest

ScalaTest очень гибок и предлагает несколько различных способов написания тестов.
Простой способ начать работу — написать тесты с помощью `AnyFunSuite`.
Для начала создайте каталог с именем _math_ в каталоге _src/test/scala_:

```bash
$ mkdir src/test/scala/math
            ----
```

Затем создайте в этом каталоге файл с именем _MathUtilsTests.scala_ со следующим содержимым:

```scala
package math

import org.scalatest.funsuite.AnyFunSuite

class MathUtilsTests extends AnyFunSuite:

  // test 1
  test("'double' should handle 0") {
    val result = MathUtils.double(0)
    assert(result == 0)
  }

  // test 2
  test("'double' should handle 1") {
    val result = MathUtils.double(1)
    assert(result == 2)
  }

  test("test with Int.MaxValue") (pending)

end MathUtilsTests
```

Этот код демонстрирует `AnyFunSuite` подход.
Несколько важных моментов:

- тестовый класс должен расширять `AnyFunSuite`
- тесты создаются, задавая каждому `test` уникальное имя
- в конце каждого теста необходимо вызвать `assert`, чтобы проверить, выполнено ли условие
- когда вы знаете, что хотите написать тест, но не хотите писать его прямо сейчас,
  создайте тест как "pending" (ожидающий) с показанным синтаксисом

Подобное использование ScalaTest напоминает JUnit, так что если вы переходите с Java на Scala, это должно показаться знакомым.

Теперь можно запустить эти тесты с помощью команды `sbt test`.
Пропуская первые несколько строк вывода, результат выглядит следующим образом:

```
sbt:HelloScalaTest> test

[info] Compiling 1 Scala source ...
[info] MathUtilsTests:
[info] - 'double' should handle 0
[info] - 'double' should handle 1
[info] - test with Int.MaxValue (pending)
[info] Total number of tests run: 2
[info] Suites: completed 1, aborted 0
[info] Tests: succeeded 2, failed 0, canceled 0, ignored 0, pending 1
[info] All tests passed.
[success] Total time: 1 s
```

Если все работает хорошо, вы увидите примерно такой результат. 
Добро пожаловать в мир тестирования приложений Scala с помощью sbt и ScalaTest.

### Поддержка различных видов тестов

В этом примере демонстрируется стиль тестирования, аналогичный стилю xUnit _Test-Driven Development_ (TDD),
с некоторыми преимуществами _Behavior-Driven Development_ (BDD).

Как уже упоминалось, ScalaTest является гибким, и вы также можете писать тесты, используя другие стили,
такие как стиль, похожий на RSpec Ruby.
Вы также можете использовать моканные объекты, тестирование на основе свойств
и использовать ScalaTest для тестирования кода Scala.js.

Дополнительные сведения о различных доступных стилях тестирования
см. в Руководстве пользователя на [веб-сайте ScalaTest](https://www.scalatest.org).

## Что дальше?

Дополнительные сведения о sbt и ScalaTest см. в следующих ресурсах:

- [The sbt documentation](https://www.scala-sbt.org/1.x/docs/)
- [The ScalaTest website](https://www.scalatest.org/)

[getting_started]: {{ site.baseurl }}/ru/getting-started/install-scala.html
