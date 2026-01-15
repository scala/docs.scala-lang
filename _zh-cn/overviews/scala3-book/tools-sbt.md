---
title: 使用 sbt 构建和测试 Scala 项目
type: section
description: This section looks at a commonly-used build tool, sbt, and a testing library, ScalaTest.
language: zh-cn
num: 70
previous-page: scala-tools
next-page: tools-worksheets

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


在本节中，您将看到 Scala 项目中常用的两个工具：

- [sbt](https://www.scala-sbt.org) 构建工具
- [ScalaTest](https://www.scalatest.org)，一个源代码测试框架

我们将首先展示如何使用 sbt 构建您的 Scala 项目，然后我们将展示如何一起使用 sbt 和 ScalaTest 来测试您的 Scala 项目。

> 如果您想了解帮助您将 Scala 2 代码迁移到 Scala 3 的工具，请参阅我们的 [Scala 3 迁移指南](/scala3/guides/migration/compatibility-intro.html)。

## 使用 sbt 构建 Scala 项目

您可以使用多种不同的工具来构建您的 Scala 项目，包括 Ant、Maven、Gradle、Mill 等。
但是名为 _sbt_ 的工具是第一个专门为 Scala 创建的构建工具。

> 要安装 sbt，请参阅 [其下载页面](https://www.scala-sbt.org/download/) 或我们的 [Getting Started][getting_started] 页面。

### 创建一个 “Hello, world” 项目

只需几个步骤，您就可以创建一个 sbt “Hello, world” 项目。
首先，创建一个工作目录，然后进入该目录：

```bash
$ mkdir hello
$ cd hello
```

在 `hello` 目录下，创建一个子目录 `project`：

```bash
$ mkdir project
```

在 `project` 目录中创建一个名为 _build.properties_ 的文件，其中
以下内容：

```text
sbt.version=1.10.11
```

然后在包含此行的项目根目录中创建一个名为 _build.sbt_ 的文件：

```scala
scalaVersion := "{{ site.scala-3-version }}"
```

现在创建一个名为 _Hello.scala_ 的文件——名称的第一部分无关紧要——使用这一行：

```scala
@main def helloWorld = println("Hello, world")
```

这就是你所要做的。

您应该具有如下的项目结构：

~~~ bash
$ tree
.
├── build.sbt
├── Hello.scala
└── project
    └── build.properties
~~~

现在使用 `sbt` 命令运行项目：

```bash
$ sbt run
```

您应该会看到如下所示的输出，包括程序中的 `"Hello, world"`：

```bash
$ sbt run
[info] welcome to sbt 1.5.4 (AdoptOpenJDK Java 11.x)
[info] loading project definition from project ...
[info] loading settings for project from build.sbt ...
[info] compiling 1 Scala source to target/scala-3.0.0/classes ...
[info] running helloWorld
Hello, world
[success] Total time: 2 s
```

sbt 启动器——`sbt` 命令行工具——加载文件 _project/build.properties_ 中设置的 sbt 版本，它加载文件 _build.sbt_ 中设置的 Scala 编译器版本，编译 _Hello.scala_ 文件中的代码，并运行生成的字节码。

当你查看你的目录时，你会看到 sbt 有一个名为 _target_ 的目录。
这些是 sbt 使用的工作目录。

如您所见，使用 sbt 创建和运行一个小的 Scala 项目只需要几个简单的步骤。

### 在大型项目中使用 sbt

对于一个小项目，这就是 sbt 运行所需的全部内容。
对于需要许多源代码文件、依赖项或 sbt 插件的大型项目，您需要创建一个有组织的目录结构。
本节的其余部分演示了 sbt 使用的结构。

### sbt 目录结构

与 Maven 一样，sbt 使用标准的项目目录结构。
这样做的一个很好的好处是，一旦你对它的结构感到满意，它就可以很容易地处理其他 Scala/sbt 项目。

首先要知道的是，在项目的根目录下，sbt 需要一个如下所示的目录结构：

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

如果您想将非托管依赖项---JAR 文件---添加到您的项目中，您还可以在根目录下添加一个 _lib_ 目录。

如果您要创建一个包含 Scala 源代码文件和测试的项目，但不会使用任何 Java 源代码文件，并且不需要任何“资源”——例如嵌入式图像、配置文件、等等---这就是你在_src_目录下真正需要的：

```text
.
└── src/
    ├── main/
    │   └── scala/
    └── test/
        └── scala/
```

### 带有 sbt 目录结构的 “Hello, world”

{% comment %}
LATER: using something like `sbt new scala/scala3.g8` may eventually
      be preferable, but that seems to have a few bugs atm (creates
      a 'target' directory above the root; renames the root dir;
      uses 'dottyVersion'; 'name' doesn’t match the supplied name;
      config syntax is a little hard for beginners.)
{% endcomment %}

创建这个目录结构很简单。
有一些工具可以为你做到这一点，但假设你使用的是 Unix/Linux 系统，你可以使用这些命令来创建你的第一个 sbt 项目目录结构：

```bash
$ mkdir HelloWorld
$ cd HelloWorld
$ mkdir -p src/{main,test}/scala
$ mkdir project target
```

在运行这些命令后运行 `find .` 命令时，您应该会看到以下结果：

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

如果你看到上面那样，那么没有问题，可以进行下一步了。

> 还有其他方法可以为 sbt 项目创建文件和目录。
> 一种方法是使用 `sbt new` 命令，[在 scala-sbt.org 上有文档](https://www.scala-sbt.org/1.x/docs/Hello.html)。
> 该方法未在此处显示，因为它创建的某些文件比像这样的介绍所必需的要复杂。

### 创建第一个 build.sbt 文件

此时，您只需要另外两件事来运行 “Hello, world” 项目：

- 一个 _build.sbt_ 文件
- 一个 _Hello.scala_ 文件

对于像这样的小项目，_build.sbt_ 文件只需要一个 `scalaVersion` 条目，但我们将添加您通常看到的三行：

```scala
name := "HelloWorld"
version := "0.1"
scalaVersion := "{{ site.scala-3-version }}"
```

因为 sbt 项目使用标准的目录结构，所以 sbt 可以找到它需要的所有其他内容。

现在你只需要添加一个小小的“Hello, world”程序。

### “Hello, world” 程序

在大型项目中，您所有的 Scala 源代码文件都将放在 _src/main/scala_ 和 _src/test/scala_ 目录下，但是对于像这样的小示例项目，您可以将源代码文件放在您项目的根目录下。
因此，在根目录中创建一个名为 _HelloWorld.scala_ 的文件，其中包含以下内容：

```scala
@main def helloWorld = println("Hello, world")
```

该代码定义了一个 Scala 3 “main” 方法，该方法在运行时打印 `"Hello, world"`。

现在，使用 `sbt run` 命令编译并运行您的项目：

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

第一次运行 `sbt` 时，它会下载所需的所有内容，这可能需要一些时间才能运行，但之后它会变得更快。

此外，一旦你完成了这第一步，你会发现以交互方式运行 sbt 会快得多。
为此，首先单独运行 `sbt` 命令：

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

然后在这个 sbt shell 中，执行它的 `run` 命令：

````
sbt:hello-world> run

[info] running helloWorld 
Hello, world
[success] Total time: 0 s
````

这要快得多。

如果您在 sbt 命令提示符下键入 `help`，您将看到可以运行的其他命令的列表。
但现在，只需键入 `exit`（或按 `CTRL-D`）离开 sbt shell。

### 使用项目模板

手动创建项目结构可能很乏味。谢天谢地，sbt 可以基于模板为你创建项目。

要从模板创建 Scala 3 项目，请在 shell 中运行以下命令：

~~~
$ sbt new scala/scala3.g8
~~~

Sbt 将加载模板，提出一些问题，并在子目录中创建项目文件：

~~~
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
~~~

> 如果要创建与 Scala 2 交叉编译的 Scala 3 项目，请使用模板 `scala/scala3-cross.g8`：
>
> ~~~
> $ sbt new scala/scala3-cross.g8
> ~~~

在 [sbt 文档](https://www.scala-sbt.org/1.x/docs/sbt-new-and-Templates.html#sbt+new+) 中了解有关 `sbt new` 和项目模板的更多信息。

### Scala 的其他构建工具

虽然 sbt 被广泛使用，但您还可以使用其他工具来构建 Scala 项目：

- [ant](https://ant.apache.org/)
- [Gradle](https://gradle.org/)
- [Maven](https://maven.apache.org/)
- [mill](https://com-lihaoyi.github.io/mill/)

#### Coursier 

在相关说明中，[Coursier](https://get-coursier.io/docs/overview) 是一个“依赖解析器”，在功能上类似于 Maven 和 Ivy。
它是用 Scala 从头开始编写的，“包含函数式编程原则”，并且可以并行下载工件以实现快速下载。
sbt 使用它来处理大多数依赖关系解析，并且作为一个命令行工具，它可以用于在您的系统上轻松安装 sbt、Java 和 Scala 等工具，如我们的 [Getting Started][getting_started] 页面所示。

来自 `launch` 网页的这个示例显示了 `cs launch` 命令可用于从依赖项启动应用程序：

```scala
$ cs launch org.scalameta::scalafmt-cli:2.4.2 -- --help
scalafmt 2.4.2
Usage: scalafmt [options] [<file>...]

  -h, --help               prints this usage text
  -v, --version            print version
  more ...
```

有关详细信息，请参阅 Coursier 的 [启动页面](https://get-coursier.io/docs/cli-launch)。

## 使用 sbt 和 ScalaTest

[ScalaTest](https://www.scalatest.org) 是 Scala 项目的主要测试库之一。
在本节中，您将看到创建使用 ScalaTest 的 Scala/sbt 项目所需的步骤。

### 1) 创建项目目录结构

与上一课一样，使用以下命令为名为 _HelloScalaTest_ 的项目创建一个 sbt 项目目录结构：

```bash
$ mkdir HelloScalaTest
$ cd HelloScalaTest
$ mkdir -p src/{main,test}/scala
$ mkdir project
```

### 2) 创建 build.properties 和 build.sbt 文件

接下来，把下面这行代码用于在项目的 _project/_ 子目录中创建一个 _build.properties_ 文件：

```text
sbt.version=1.10.11
```

接下来，在项目的根目录中创建一个 _build.sbt_ 文件，其中包含以下内容：

```scala
name := "HelloScalaTest"
version := "0.1"
scalaVersion := "{{site.scala-3-version}}"

libraryDependencies ++= Seq(
  "org.scalatest" %% "scalatest" % "3.2.19" % Test
)
```

该文件的前三行与第一个示例基本相同。
`libraryDependencies` 行告诉 sbt 包含包含 ScalaTest 所需的依赖项（JAR 文件）。

> ScalaTest 文档一直很优秀，您始终可以在 [安装 ScalaTest](https://www.scalatest.org/install) 页面上找到有关这些行应该是什么样子的最新信息。

### 3) 创建一个 Scala 源代码文件

接下来，创建一个可用于演示 ScalaTest 的 Scala 程序。
首先，在 _src/main/scala_ 下创建一个名为 _math_ 的目录：

```bash
$ mkdir src/main/scala/math
            ----
```

然后，在该目录中，使用以下内容创建一个名为 _MathUtils.scala_ 的文件：

```scala
package math

object MathUtils:
  def double(i: Int) = i * 2
```

该方法提供了一种演示 ScalaTest 的简单方法。

{% comment %}
Because this project doesn’t have a `main` method, we don’t try to run it with `sbt run`; we just compile it with `sbt compile`:

````
$ sbt compile

[info] welcome to sbt
[info] loading settings for project ...
[info] loading project definition ...
[info] loading settings for project ...
[info] Executing in batch mode. For better performance use sbt's shell
[success] Total time: 1 s
````

With that compiled, let’s create a ScalaTest file to test the `double` method.
{% endcomment %}

### 4) 创建你的第一个 ScalaTest 测试

ScalaTest 非常灵活，并提供了几种不同的方式来编写测试。
一个简单的入门方法是使用 ScalaTest `AnyFunSuite` 编写测试。
首先，在 _src/test/scala_ 目录下创建一个名为 _math_ 的目录：

```bash
$ mkdir src/test/scala/math
            ----
```

接下来，在该目录中创建一个名为 _MathUtilsTests.scala_ 的文件，其内容如下：

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

此代码演示了 ScalaTest `AnyFunSuite` 方法。
几个重要的点：

- 你的测试类应该继承 `AnyFunSuite`
- 如图所示，您可以通过为每个 `test` 指定一个唯一的名称来创建测试
- 在每个测试结束时，您应该调用 `assert` 来测试条件是否已满足
- 当你知道你想写一个测试，但你现在不想写它时，将测试创建为“待定”，语法如上例所示

像这样使用 ScalaTest 类似于 JUnit，所以如果你是从 Java 转到 Scala 的，希望这看起来相似。

现在您可以使用 `sbt test` 命令运行这些测试。
跳过前几行输出，结果如下所示：

````
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
````

如果一切正常，您将看到类似的输出。
欢迎来到使用 sbt 和 ScalaTest 测试 Scala 应用程序的世界。

### 支持多种类型的测试

此示例演示了一种类似于 xUnit _测试驱动开发_(TDD) 样式测试的测试样式，并具有_行为驱动开发_(BDD) 样式的一些优点。

如前所述，ScalaTest 很灵活，您还可以用其它风格来编写测试，例如类似于 Ruby 的 RSpec 的风格。
您还可以使用伪对象、基于属性的测试，并使用 ScalaTest 来测试 Scala.js 代码。

有关可用的不同测试风格的更多详细信息，请参阅 [ScalaTest 网站](https://www.scalatest.org) 上的用户指南。

## 从这往哪儿走

有关 sbt 和 ScalaTest 的更多信息，请参阅以下资源：

- [sbt 文档](https://www.scala-sbt.org/1.x/docs/)
- [ScalaTest 网站](https://www.scalatest.org/)


[getting_started]: {{ site.baseurl }}/scala3/getting-started.html
