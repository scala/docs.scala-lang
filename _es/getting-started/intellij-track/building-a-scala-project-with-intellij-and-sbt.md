---
title: Construir un proyecto de Scala con IntelliJ y sbt
layout: singlepage-overview
partof: building-a-scala-project-with-intellij-and-sbt
language: es
disqus: true
previous-page: /es/getting-started/intellij-track/getting-started-with-scala-in-intellij
next-page: /es/testing-scala-in-intellij-with-scalatest
---

En este tutorial veremos cómo construir un proyecto de Scala usando [sbt](https://www.scala-sbt.org/1.x/docs/index.html). sbt es una herramienta popular para compilar, ejecutar y probar proyectos de Scala de cualquier tamaño. Usar una herramienta de construcción como sbt (o Maven/Gradle) se vuelve esencial cuando creas proyectos con dependencias
o con más de un archivo de código.
 Asumimos que has completado el
[primer tutorial](getting-started-with-scala-in-intellij.html).

## Crear el proyecto
En esta sección te mostraremos cómo crear el proyecto en IntelliJ. Sin embargo, si te sientes
cómodo con la línea de comandos, te recomendamos probar [Primeros pasos con Scala y sbt en la línea de comandos]({{site.baseurl}}/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html) y luego volver
aquí a la sección "Escribir código Scala".

1. Si no creaste el proyecto desde la línea de comandos, abre IntelliJ y selecciona "Create New Project"
  * En el panel izquierdo, selecciona Scala y en el panel derecho, selecciona sbt
  * Haz clic en **Next**
  * Nombra el proyecto "SbtExampleProject"
1. Si ya creaste el proyecto desde la línea de comandos, abre IntelliJ, selecciona *Import Project* y abre el archivo `build.sbt` de tu proyecto
1. Asegúrate de que la **versión de JDK** sea 1.8 y la **versión de sbt** sea al menos 0.13.13
1. Selecciona **Use auto-import** para que las dependencias se descarguen automáticamente cuando estén disponibles
1. Selecciona **Finish**

## Entender la estructura de directorios
sbt crea muchos directorios que pueden resultar útiles cuando empieces a construir
proyectos más complejos. Por ahora puedes ignorar la mayoría de ellos,
pero aquí tienes un vistazo de para qué sirve cada uno:

```
- .idea (archivos de IntelliJ)
- project (plugins y configuraciones adicionales para sbt)
- src (archivos fuente)
    - main (código de la aplicación)
        - java (archivos fuente de Java)
        - scala (archivos fuente de Scala) <-- Esto es todo lo que necesitamos por ahora
        - scala-2.12 (archivos específicos de Scala 2.12)
    - test (pruebas unitarias)
- target (archivos generados)
- build.sbt (archivo de definición de construcción para sbt)
```


## Escribir código Scala
1. En el panel **Project** de la izquierda, expande `SbtExampleProject` => `src`
=> `main`
1. Haz clic derecho sobre `scala` y selecciona **New** => **Package**
1. Nombra el paquete `example` y haz clic en **OK** (o simplemente presiona la tecla Enter o Return).
1. Haz clic derecho sobre el paquete `example` y selecciona **New** => **Scala class** (si no ves esta opción, haz clic derecho sobre `SbtExampleProject`, haz clic en **Add Frameworks Support**, selecciona **Scala** y continúa)
1. Nombra la clase `Main` y cambia **Kind** a `Object`.
1. Cambia el código de la clase por el siguiente:

```
@main def run() =
  val ages = Seq(42, 75, 29, 64)
  println(s"The oldest person is ${ages.max}")
```

Nota: IntelliJ tiene su propia implementación del compilador de Scala, y a veces tu
código es correcto aunque IntelliJ indique lo contrario. Siempre puedes comprobar
si sbt puede ejecutar tu proyecto desde la línea de comandos.

## Ejecutar el proyecto
1. En el menú **Run**, selecciona **Edit configurations**
1. Haz clic en el botón **+** y selecciona **sbt Task**.
1. Nómbralo `Run the program`.
1. En el campo **Tasks**, escribe `~run`. La `~` hace que sbt reconstruya y vuelva a ejecutar el proyecto
cuando guardes cambios en un archivo del proyecto.
1. Haz clic en **OK**.
1. En el menú **Run**, haz clic en **Run 'Run the program'**.
1. En el código, cambia `75` por `61`
y observa la salida actualizada en la consola.

## Agregar una dependencia
Cambiando un poco de tema, veamos cómo usar bibliotecas publicadas para agregar
funcionalidad adicional a nuestras aplicaciones.
1. Abre `build.sbt` y agrega la siguiente línea:

```
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.2"
```
Aquí, `libraryDependencies` es un conjunto de dependencias, y al usar `+=`,
estamos agregando la dependencia [scala-parser-combinators](https://github.com/scala/scala-parser-combinators) al conjunto de dependencias que sbt
irá a buscar cuando se inicie. Ahora, en cualquier archivo de Scala, puedes importar clases,
objetos, etc. de scala-parser-combinators con un import normal.

Puedes encontrar más bibliotecas publicadas en
[Scaladex](https://index.scala-lang.org/), el índice de bibliotecas de Scala, donde
también puedes copiar la información de dependencia anterior para pegarla en tu archivo
`build.sbt`.

## Siguientes pasos

Continúa con el siguiente tutorial de la serie _primeros pasos con IntelliJ_ y aprende sobre [cómo probar código Scala en IntelliJ con ScalaTest](testing-scala-in-intellij-with-scalatest.html).

**o**

* [El Libro de Scala](/scala3/book/introduction.html), que ofrece un conjunto de lecciones breves que presentan las principales características de Scala.
* [El Tour de Scala](/tour/tour-of-scala.html), con introducciones breves a las características de Scala.
- Continúa aprendiendo Scala de forma interactiva en línea en
