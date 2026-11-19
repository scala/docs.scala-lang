---
title: Primeros pasos con Scala en IntelliJ
layout: singlepage-overview
partof: getting-started-with-scala-in-intellij
language: es
disqus: true
next-page: /es/building-a-scala-project-with-intellij-and-sbt
---

En este tutorial veremos cómo construir un proyecto mínimo de Scala usando el IDE IntelliJ
con el plugin de Scala. En esta guía, IntelliJ descargará Scala por ti.

## Instalación
1. Asegúrate de tener el JDK de Java 8 (también conocido como 1.8) o más reciente:
    * ejecuta `javac -version` en la línea de comandos para comprobar la versión de Java,
    * si no tienes la versión 1.8 o superior, [instala el JDK](https://www.oracle.com/java/technologies/downloads/).
1. Luego, descarga e instala [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/).
1. Después, al iniciar IntelliJ, puedes descargar e instalar el plugin de Scala siguiendo las instrucciones sobre
[cómo instalar plugins de IntelliJ](https://www.jetbrains.com/help/idea/managing-plugins.html) (busca "Scala" en el menú de plugins).

Cuando creemos el proyecto, instalaremos la versión más reciente de Scala.
Nota: si quieres abrir un proyecto de Scala existente, puedes hacer clic en **Open**
cuando inicies IntelliJ.

## Crear el proyecto
1. Abre IntelliJ y haz clic en **File** => **New** => **Project**.
1. Nombra el proyecto **HelloWorld**.
1. Selecciona **Scala** en la lista **Language**.
1. Selecciona **IntelliJ** en la lista **Build system**.
1. Suponiendo que es la primera vez que creas un proyecto de Scala con IntelliJ,
necesitarás instalar un SDK de Scala. A la derecha del campo Scala SDK,
haz clic en el botón **Create**.
1. Selecciona el número de versión más alto (por ejemplo, {{ site.scala-version }}) y haz clic en **Download**. Esto puede
tardar unos minutos, pero los proyectos posteriores podrán usar el mismo SDK.
1. Una vez creado el SDK, y de vuelta en la ventana "New Project", haz clic en **Create**.


## Escribir código

1. En el panel **Project** de la izquierda, haz clic derecho sobre `src` y selecciona
**New** => **Scala class**. Si no ves **Scala class**, haz clic derecho sobre **HelloWorld** y haz clic en **Add Framework Support...**, selecciona **Scala** y continúa. Si ves **Error: library is not specified**, puedes hacer clic en el botón de descarga o seleccionar la ruta de la biblioteca manualmente. Si solo ves **Scala Worksheet**, intenta expandir la carpeta `src` y su subcarpeta `main`, y haz clic derecho sobre la carpeta `scala`.
1. Nombra la clase `Hello` y cambia **Kind** a `object`.
1. Cambia el código del archivo por el siguiente:

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

En Scala 3, puedes eliminar el objeto `Hello` y definir en su lugar un método de nivel superior
`hello`, al que anotas con `@main`.

{% endtab %}

{% endtabs %}

## Ejecutarlo

{% tabs hello-world-run class=tabs-scala-version %}

{% tab  'Scala 2' for=hello-world-run %}

* Haz clic derecho sobre `Hello` en tu código y selecciona **Run 'Hello'**.
* ¡Listo!

{% endtab %}

{% tab 'Scala 3' for=hello-world-run %}

* Haz clic derecho sobre `hello` en tu código y selecciona **Run 'hello'**.
* ¡Listo!

{% endtab %}

{% endtabs %}

## Experimentar con Scala
Una buena forma de probar ejemplos de código es con las hojas de trabajo de Scala (Scala Worksheets)

1. En el panel del proyecto a la izquierda, haz clic derecho sobre
`src` y selecciona **New** => **Scala Worksheet**.
2. Nombra tu nueva hoja de trabajo de Scala "Mathematician".
3. Ingresa el siguiente código en la hoja de trabajo:

{% tabs square %}
{% tab 'Scala 2 and 3' for=square %}
```
def square(x: Int): Int = x * x

square(2)
```
{% endtab %}
{% endtabs %}

A medida que cambias tu código, notarás que se evalúa
en el panel derecho. Si no ves un panel derecho, haz clic derecho sobre tu hoja de trabajo de Scala en el panel Project y haz clic en Evaluate Worksheet.

## Siguientes pasos

Ahora sabes cómo crear un proyecto sencillo de Scala que puede usarse
para comenzar a aprender el lenguaje. En el siguiente tutorial, presentaremos
una herramienta de construcción importante llamada sbt, que puede usarse para proyectos sencillos
y para aplicaciones de producción.

A continuación: [Construir un proyecto de Scala con IntelliJ y sbt](building-a-scala-project-with-intellij-and-sbt.html)
