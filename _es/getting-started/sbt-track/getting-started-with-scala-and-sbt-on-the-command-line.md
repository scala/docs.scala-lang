---
title: Primeros pasos con Scala y sbt en la línea de comandos
layout: singlepage-overview
partof: getting-started-with-scala-and-sbt-on-the-command-line
language: es
disqus: true
next-page: /es/testing-scala-with-sbt-on-the-command-line
---

En este tutorial verás cómo crear un proyecto de Scala a partir de
una plantilla. Puedes usarlo como punto de partida para tus propios
proyectos. Usaremos [sbt](https://www.scala-sbt.org/1.x/docs/index.html), la herramienta de construcción de facto para Scala. sbt compila,
ejecuta y prueba tus proyectos, entre otras tareas relacionadas.
Asumimos que sabes usar una terminal.

## Instalación
1. Asegúrate de tener el JDK de Java 8 (también conocido como 1.8)
    * Ejecuta `javac -version` en la línea de comandos y asegúrate de ver
    `javac 1.8.___`
    * Si no tienes la versión 1.8 o superior, [instala el JDK](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
1. Instala sbt
    * [Mac](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Mac.html)
    * [Windows](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Windows.html)
    * [Linux](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Linux.html)

## Crear el proyecto

{% tabs sbt-welcome-1 class=tabs-scala-version %}
{% tab 'Scala 2' for=sbt-welcome-1 %}

1. Haz `cd` a una carpeta vacía.
1. Ejecuta el siguiente comando `sbt new scala/hello-world.g8`.
Esto descarga la plantilla 'hello-world' desde GitHub.
También creará una carpeta `target`, que puedes ignorar.
1. Cuando se te solicite, nombra la aplicación `hello-world`. Esto
creará un proyecto llamado "hello-world".
1. Veamos qué se acaba de generar:

{% endtab %}
{% tab 'Scala 3' for=sbt-welcome-1 %}

1. Haz `cd` a una carpeta vacía.
1. Ejecuta el siguiente comando `sbt new scala/scala3.g8`.
Esto descarga la plantilla 'scala3' desde GitHub.
También creará una carpeta `target`, que puedes ignorar.
1. Cuando se te solicite, nombra la aplicación `hello-world`. Esto
creará un proyecto llamado "hello-world".
1. Veamos qué se acaba de generar:

{% endtab %}
{% endtabs %}


```
- hello-world
    - project (sbt usa esto para instalar y administrar plugins y dependencias)
        - build.properties
    - src
        - main
            - scala (Todo tu código Scala va aquí)
                - Main.scala (Punto de entrada del programa) <-- esto es todo lo que necesitamos por ahora
    - build.sbt (archivo de definición de construcción de sbt)
```

Después de construir tu proyecto, sbt creará más directorios `target`
para los archivos generados. Puedes ignorarlos.

## Ejecutar el proyecto
1. Haz `cd` a `hello-world`.
1. Ejecuta `sbt`. Esto abrirá la consola de sbt.
1. Escribe `~run`. La `~` es opcional y hace que sbt vuelva a ejecutar el programa cada vez que guardes un archivo,
lo que permite un ciclo rápido de edición/ejecución/depuración. sbt también generará un directorio `target`
que puedes ignorar.

## Modificar el código
1. Abre el archivo `src/main/scala/Main.scala` en tu editor de texto favorito.
1. Cambia "Hello, World!" por "Hello, New York!"
1. Si no has detenido el comando sbt, deberías ver "Hello, New York!"
impreso en la consola.
1. Puedes seguir haciendo cambios y ver los resultados en la consola.

## Agregar una dependencia
Cambiando un poco de tema, veamos cómo usar bibliotecas publicadas para agregar
funcionalidad adicional a nuestras aplicaciones.

1. Abre `build.sbt` y agrega la siguiente línea:

```
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "2.1.1"
```
Aquí, `libraryDependencies` es un conjunto de dependencias, y al usar `+=`,
estamos agregando la dependencia [scala-parser-combinators](https://github.com/scala/scala-parser-combinators) al conjunto de dependencias que sbt
irá a buscar cuando se inicie. Ahora, en cualquier archivo de Scala, puedes importar clases,
objetos, etc. de `scala-parser-combinators` con un import normal.

Puedes encontrar más bibliotecas publicadas en
[Scaladex](https://index.scala-lang.org/), el índice de bibliotecas de Scala, donde
también puedes copiar la información de dependencia anterior para pegarla en tu archivo
`build.sbt`.

> **Nota para bibliotecas de Java:** Para una biblioteca de Java normal, solo debes usar un signo de porcentaje (`%`) entre el
> nombre de la organización y el nombre del artefacto. El doble porcentaje (`%%`) es una especialización para bibliotecas de Scala.
> Puedes aprender más sobre el motivo en la [documentación de sbt][sbt-docs-lib-dependencies].

## Siguientes pasos

Continúa con el siguiente tutorial de la serie _primeros pasos con sbt_ y aprende sobre [cómo probar código Scala con sbt en la línea de comandos](testing-scala-with-sbt-on-the-command-line.html).

**o**

- Conoce las características de Scala en pequeñas porciones recorriendo nuestro [Tour de Scala]({{ site.baseurl }}/tour/tour-of-scala.html).

[sbt-docs-lib-dependencies]: https://www.scala-sbt.org/1.x/docs/Library-Dependencies.html#Getting+the+right+Scala+version+with
