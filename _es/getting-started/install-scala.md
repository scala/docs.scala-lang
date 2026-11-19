---
layout: singlepage-overview
title: Primeros pasos
partof: getting-started
language: es
includeTOC: true
newcomer_resources:
  - title: ¿Vienes de Java?
    description: Lo que debes saber para ponerte al día con Scala después de la configuración inicial.
    icon: "fa fa-coffee"
    link: /tutorials/scala-for-java-programmers.html
  - title: Scala en el navegador
    description: >
      Para empezar a experimentar con Scala de inmediato, usa "Scastie" en tu navegador.
    icon: "fa fa-cloud"
    link: https://scastie.scala-lang.org/pEBYc5VMT02wAGaDrfLnyw

redirect_from:
  - /es/scala3/getting-started.html # saw this in the japanese version
---

Las instrucciones a continuación cubren tanto Scala 2 como Scala 3.

<div class="inline-sticky-top">
{% altDetails need-help-info-box '¿Necesitas ayuda?' class=help-info %}
*Si tienes problemas para configurar Scala, no dudes en pedir ayuda en el canal `#scala-users` de
[nuestro Discord](https://discord.com/invite/scala).*
{% endaltDetails %}
</div>

## Recursos para quienes empiezan

{% include inner-documentation-sections.html links=page.newcomer_resources %}

##  Instalar Scala en tu computadora

Instalar Scala significa instalar varias herramientas de línea de comandos, como el compilador de Scala y las herramientas de construcción (*build tools*).
Recomendamos usar la herramienta de instalación de Scala, "Coursier", que instala automáticamente todos los requisitos, aunque también puedes instalar cada herramienta de forma manual.

### Usando el instalador de Scala (forma recomendada)

El instalador de Scala es una herramienta llamada [Coursier](https://get-coursier.io/docs/cli-overview), cuyo comando principal es `cs`.
Se asegura de que tengas instalados una JVM y las herramientas estándar de Scala en tu sistema.
Instálalo en tu sistema siguiendo estas instrucciones.

<!-- Display tabs for each OS -->
{% tabs install-cs-setup-tabs class=platform-os-options %}

<!-- macOS -->
{% tab macOS for=install-cs-setup-tabs %}
Ejecuta el siguiente comando en tu terminal y sigue las instrucciones en pantalla:
{% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-brew %}
{% altDetails cs-setup-macos-nobrew  "Alternativamente, si no usas Homebrew:" %}
  En la arquitectura Apple Silicon (M1, M2, …):
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-arm64 %}
  En caso contrario, en la arquitectura x86-64:
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-x86-64 %}
{% endaltDetails %}
{% endtab %}
<!-- end macOS -->

<!-- Linux -->
{% tab Linux for=install-cs-setup-tabs %}
  Ejecuta el siguiente comando en tu terminal y sigue las instrucciones en pantalla.

  En la arquitectura x86-64:
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.linux-x86-64 %}
  En caso contrario, en la arquitectura ARM64:
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.linux-arm64 %}
{% endtab %}
<!-- end Linux -->

<!-- Windows -->
{% tab Windows for=install-cs-setup-tabs %}
  Descarga y ejecuta [el instalador de Scala para Windows]({{site.data.setup-scala.windows-link}})
  basado en Coursier, y sigue las instrucciones en pantalla.
{% endtab %}
<!-- end Windows -->

<!-- Other -->
{% tab Otro for=install-cs-setup-tabs defaultTab %}
  <noscript>
    <p><span style="font-style:italic;">JavaScript está deshabilitado, haz clic en la pestaña correspondiente a tu sistema operativo.</span></p>
  </noscript>
  Sigue la documentación de Coursier sobre
    [cómo instalar y ejecutar `cs setup`](https://get-coursier.io/docs/cli-installation).
{% endtab %}
<!-- end Other -->

{% endtabs %}
<!-- End tabs -->

> <i class="fa fa-info"></i>&nbsp;&nbsp; Es posible que necesites reiniciar tu terminal, cerrar sesión
> o reiniciar tu computadora para que los cambios surtan efecto.
{: .help-info}

<!-- Alternative Detail - test the `scala` command -->
{% altDetails testing-your-setup 'Probar tu instalación' %}
Verifica tu instalación con el comando `scala -version`, que debería mostrar:
```bash
$ scala -version
Scala code runner version: 1.4.3
Scala version (default): {{site.scala-3-version}}
```
{% endaltDetails %}
<!-- end Alternative Detail -->


Además de administrar las JVM, `cs setup` también instala herramientas de línea de comandos útiles:

| Comandos | Descripción |
|----------|-------------|
| `scalac` | el compilador de Scala |
| `scala`, `scala-cli` | [Scala CLI](https://scala-cli.virtuslab.org), conjunto de herramientas interactivo para Scala |
| `sbt`, `sbtn` | La herramienta de construcción [sbt](https://www.scala-sbt.org/) |
| `amm` | [Ammonite](https://ammonite.io/) es un REPL mejorado |
| `scalafmt` | [Scalafmt](https://scalameta.org/scalafmt/) es el formateador de código de Scala |

Para más información sobre `cs`, lee la
[documentación de coursier-cli](https://get-coursier.io/docs/cli-overview).

> `cs setup` instala por defecto el compilador y el ejecutor de Scala 3 (los comandos `scalac` y
> `scala`, respectivamente). Ya sea que pienses usar Scala 2 o 3,
> normalmente esto no es un problema, porque la mayoría de los proyectos usan una herramienta de construcción que
> utilizará la versión correcta de Scala sin importar cuál esté instalada "globalmente".
> Aun así, siempre puedes lanzar una versión específica de Scala usando
> ```
> $ cs launch scala:{{ site.scala-version }}
> $ cs launch scalac:{{ site.scala-version }}
> ```
> Si prefieres que Scala 2 se ejecute por defecto, puedes forzar la instalación de esa versión con:
> ```
> $ cs install scala:{{ site.scala-version }} scalac:{{ site.scala-version }}
> ```

### ...o manualmente

Solo necesitas dos herramientas para compilar, ejecutar, probar y empaquetar un proyecto de Scala: Java 8 u 11,
y Scala CLI.
Para instalarlas manualmente:

1. Si no tienes Java 8 u 11 instalado, descarga
   Java desde [Oracle Java 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html), [Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html),
   o [AdoptOpenJDK 8/11](https://adoptopenjdk.net/). Consulta [Compatibilidad con JDK](/overviews/jdk-compatibility/overview.html) para los detalles de compatibilidad entre Scala y Java.
1. Instala [Scala CLI](https://scala-cli.virtuslab.org/install)

## Usando Scala CLI

En un directorio de tu elección, al que llamaremos `<project-dir>`, crea un archivo llamado `hello.scala` con el siguiente código:
```scala
//> using scala {{site.scala-3-version}}

@main
def hello(): Unit =
  println("Hello, World!")
```

Puedes definir un método con la palabra clave `def` y marcarlo como método "main" con la anotación `@main`, designándolo como
el punto de entrada de la ejecución del programa. El tipo del método es `Unit`, lo que significa que no devuelve ningún valor. `Unit`
puede considerarse un análogo de la palabra clave `void` que se encuentra en otros lenguajes. El método `println` imprimirá la cadena
`"Hello, World!"` en la salida estándar.

Para ejecutar el programa, ejecuta el comando `scala run hello.scala` desde una terminal, dentro del directorio `<project-dir>`. El archivo se compilará y ejecutará, con una salida en consola
similar a la siguiente:
```
$ scala run hello.scala
Compiling project (Scala {{site.scala-3-version}}, JVM (20))
Compiled project (Scala {{site.scala-3-version}}, JVM (20))
Hello, World!
```

### Manejo de argumentos de línea de comandos

Reescribe el archivo `hello.scala` para que el programa salude a la persona que lo ejecuta.
```scala
//> using scala {{site.scala-3-version}}

@main
def hello(name: String): Unit =
  println(s"Hello, $name!")
```

Se espera que el argumento `name` se proporcione al ejecutar el programa; si no se encuentra, la ejecución fallará.
El método `println` recibe una cadena interpolada, como lo indica la letra `s` que precede a su contenido. `$name` será sustituido por
el contenido del argumento `name`.

Para pasar los argumentos al ejecutar el programa, colócalos después de `--`:
```
$ scala run hello.scala -- Gabriel
Compiling project (Scala {{site.scala-3-version}}, JVM (20))
Compiled project (Scala {{site.scala-3-version}}, JVM (20))
Hello, Gabriel!
```

Puedes leer más sobre los [métodos main](/scala3/book/methods-main-methods.html) y la [interpolación de cadenas](/scala3/book/string-interpolation.html) en el Libro de Scala.

### Agregar dependencias

Ahora escribiremos un programa que cuente los archivos y directorios presentes en su directorio de trabajo.
Para ello usamos la biblioteca [os-lib](https://github.com/com-lihaoyi/os-lib) del [Scala toolkit](/toolkit/introduction.html).
Se puede agregar una dependencia de la biblioteca con la directiva `//> using`. Coloca el siguiente código en `counter.scala`.
```scala
//> using scala {{site.scala-3-version}}
//> using dep "com.lihaoyi::os-lib:0.11.4"

@main
def countFiles(): Unit =
  val paths = os.list(os.pwd)
  println(paths.length)
```

En el código anterior, `os.pwd` devuelve el directorio de trabajo actual. Lo pasamos a `os.list`, que devuelve una secuencia
de rutas que se encuentran directamente dentro del directorio pasado como argumento. Usamos un `val` para declarar un valor inmutable; en este ejemplo, almacena la
secuencia de rutas.

Ejecuta el programa. La dependencia se descargará automáticamente. La ejecución debería producir una salida similar a esta:
```
$ scala run counter.scala
Compiling project (Scala {{site.scala-3-version}}, JVM (20))
Compiled project (Scala {{site.scala-3-version}}, JVM (20))
4
```
El número impreso debería ser 4: `hello.scala`, `counter.scala` y dos directorios ocultos creados automáticamente cuando se ejecuta un programa:
`.bsp`, que contiene información sobre el proyecto utilizada por los IDE, y `.scala-build`, que contiene los resultados de la compilación.

Resulta que la biblioteca `os-lib` forma parte de Scala Toolkit, una colección de bibliotecas recomendadas para tareas como pruebas,
interacción con el sistema operativo o manejo de JSON. Puedes leer más sobre las bibliotecas incluidas en el toolkit [aquí](/toolkit/introduction.html).
Para incluir las bibliotecas del toolkit, usa la directiva `//> using toolkit 0.5.0`:
```scala
//> using scala {{site.scala-3-version}}
//> using toolkit 0.5.0

@main
def countFiles(): Unit =
  val paths = os.list(os.pwd)
  println(paths.length)
```

Este programa es idéntico al anterior. Sin embargo, las demás bibliotecas del toolkit también estarán disponibles, por si las necesitas.

### Usando el REPL

Puedes ejecutar código de forma interactiva usando el REPL que ofrece el comando `scala`. Ejecuta `scala` en la consola sin ningún argumento.
```
$ scala
Welcome to Scala {{site.scala-3-version}} (20-ea, Java OpenJDK 64-Bit Server VM).
Type in expressions for evaluation. Or try :help.

scala>
```

Escribe una línea de código para ejecutarla y presiona Enter.
```
scala> println("Hello, World!")
Hello, World!

scala>
```

El resultado se imprimirá inmediatamente después de ejecutar la línea. Puedes declarar valores:
```
scala> val i = 1
val i: Int = 1

scala>
```

Se ha creado un nuevo valor de tipo `Int`. Si proporcionas una expresión que se pueda evaluar, su resultado se almacenará en un valor creado automáticamente.
```
scala> i + 3
val res0: Int = 4

scala>
```
Puedes salir del REPL con `:exit`.

## Usando un IDE

> Puedes leer un breve resumen de los IDE de Scala en [una página dedicada](/es/getting-started/scala-ides.html).

Usemos un IDE para abrir el código que escribimos arriba. Los más populares son [IntelliJ](https://www.jetbrains.com/idea/) y
[VSCode](https://scalameta.org/metals/docs/editors/vscode).
Ambos ofrecen amplias funciones de IDE, pero aun así puedes usar [muchos otros editores](https://scalameta.org/metals/docs/editors/overview.html).

### Preparar el proyecto

Primero, elimina todas las directivas `using` y colócalas en un único archivo `project.scala` dentro del directorio `<project-dir>`.
Esto facilita importarlo como proyecto en un IDE:

```scala
//> using scala {{site.scala-3-version}}
//> using toolkit 0.5.0
```

> Opcionalmente, puedes reinicializar los archivos de IDE necesarios desde el directorio `<project-dir>` con el comando `scala setup-ide .`, pero estos archivos ya existirán si anteriormente ejecutaste el proyecto con el comando `run` de Scala CLI.

### Usando IntelliJ
<!-- might be worth pointing out in master that IntelliJ no longer ships a separate Community Edition, but you can however still use it for free after the trial is over -->
1. Descarga e instala [IntelliJ Community Edition](https://www.jetbrains.com/help/idea/installation-guide.html)
1. Instala el plugin de Scala siguiendo [las instrucciones sobre cómo instalar plugins de IntelliJ](https://www.jetbrains.com/help/idea/discover-intellij-idea-for-scala.html)
1. Abre el directorio `<project-dir>`, que debería importarse automáticamente como un proyecto BSP.

### Usando VSCode con Metals

1. Descarga [VSCode](https://code.visualstudio.com/Download)
1. Instala la extensión Metals desde [el Marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals)
1. A continuación, abre el directorio `<project-dir>` en VSCode. Metals debería activarse y comenzar a importar el proyecto automáticamente.

### Juega con el código fuente

Visualiza estos tres archivos en tu IDE:

- _project.scala_
- _hello.scala_
- _counter.scala_

Deberías notar las ventajas de un IDE, como el resaltado de sintaxis y las interacciones inteligentes con el código.
Por ejemplo, puedes colocar el cursor sobre cualquier parte del código, como `os.pwd` en _counter.scala_, y aparecerá la documentación del método.

Cuando ejecutes tu proyecto en el siguiente paso, se usará la configuración de _project.scala_ para ejecutar el código de los demás archivos fuente.

### Ejecuta el código

Si te sientes cómodo usando tu IDE, puedes ejecutar el código de _counter.scala_ desde el IDE.
Junto al método `countFiles` debería aparecer un botón de ejecución. Haz clic en él para ejecutar el método. Debería ejecutarse sin problemas.
Sin embargo, el método `hello` de _hello.scala_ necesita argumentos, por lo que requerirá configuración adicional en el IDE para proporcionarlos.

De lo contrario, puedes ejecutar cualquiera de las dos aplicaciones desde la terminal integrada del IDE, como se describió en las secciones anteriores.

## Siguientes pasos

Ahora que has probado un poco de Scala, puedes explorar más el lenguaje; considera revisar:

* [El Libro de Scala](/scala3/book/introduction.html) (consulta la versión de Scala 2 [aquí](/overviews/scala-book/introduction.html)), que ofrece un conjunto de lecciones breves que presentan las principales características de Scala.
* [El Tour de Scala](/tour/tour-of-scala.html), con introducciones breves a las características de Scala.
* [Cursos de aprendizaje](/online-courses.html), que incluye tutoriales y cursos interactivos en línea.
* [Nuestra lista de algunos libros populares sobre Scala](/books.html).

También hay otros tutoriales para otras herramientas de construcción que puedes usar con Scala:
* [Primeros pasos con Scala y sbt](/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html)
* [Usando Scala y Maven](/tutorials/scala-with-maven.html)

## Obtener ayuda
Existen multitud de listas de correo y salas de chat en tiempo real por si quieres conectar rápidamente con otros usuarios de Scala. Consulta nuestra página de [comunidad](https://scala-lang.org/community/) para ver una lista de estos recursos y saber dónde acudir en busca de ayuda.
