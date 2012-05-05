---
layout: tutorial
title: Procesamiento de documentos XML

disqus: true

tutorial: scala-tour
num: 33
language: es
---

Scala ha sido usado para crear, parsear y procesar de forma fácil documentos XML. Datos XML pueden ser representados en Scala tanto usando una representación genérica, o con una representación específica. Este último es soportado por la herramienta de *data-binding* `schema2src`.

### Representación en ejecución ###
Los datos en XML son representados como árboles etiquetados. A partir de Scala 1.2 (versiones previas debían usar la opción -Xmarkup), te es posible crear convenientemente tales nodos etiquetados utilizando sintaxis XML.

Considera la siguiente documento XMl:

    <html>
      <head>
        <title>Hello XHTML world</title>
      </head>
      <body>
        <h1>Hello world</h1>
        <p><a href="http://scala-lang.org/">Scala</a> talks XHTML</p>
      </body>
    </html>

Este documento puede ser creado por el siguiente programa en Scala:

    object XMLTest1 extends App {
      val page = 
      <html>
        <head>
          <title>Hello XHTML world</title>
        </head>
        <body>
          <h1>Hello world</h1>
          <p><a href="scala-lang.org">Scala</a> talks XHTML</p>
        </body>
      </html>;
      println(page.toString())
    }

Es posible mezclar expresiones Scala y XML:

    object XMLTest2 extends App {
      import scala.xml._
      val df = java.text.DateFormat.getDateInstance()
      val dateString = df.format(new java.util.Date())
      def theDate(name: String) = 
        <dateMsg addressedTo={ name }>
          Hello, { name }! Today is { dateString }
        </dateMsg>;
      println(theDate("John Doe").toString())
    }

### Data Binding ###

En muchos casos se tiene un DTD para los documentos XML que se quieren procesar. En este caso se quiere crear clases especiales para esto, y algo de código para parsear y guardar el XML. Scala tiene una ingeniosa herramienta que transofrma tus DTDs en una colección de definiciones de clases en Scala que hacen todo el trabajo por ti.
La documentación y ejemplos para la herramienta `schema2src` pueden ser hallados en el libro de Burak [draft scala xml book](http://burak.emir.googlepages.com/scalaxbook.docbk.html).
