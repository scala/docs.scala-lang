---
layout: tutorial
title: XML Processing

disqus: true

tutorial: scala-tour
num: 33
---

Scala can be used to easily create, parse, and process XML documents. XML data can be represented in Scala either by using a generic data representation, or with a data-specific data representation. The latter approach is supported by the *data-binding* tool `schema2src`.

### Runtime Representation ###
XML data is represented as labeled trees. Starting with Scala 1.2 (previous versions need to use the -Xmarkupoption), you can conveniently create such labeled nodes using standard XML syntax.

Consider the following XML document:

    <html>
      <head>
        <title>Hello XHTML world</title>
      </head>
      <body>
        <h1>Hello world</h1>
        <p><a href="http://scala-lang.org/">Scala</a> talks XHTML</p>
      </body>
    </html>

This document can be created by the following Scala program:

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

It is possible to mix Scala expressions and XML:

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
It many cases, you have a DTD for the XML documents you want to process. You will want to create special Scala classes for it, and some code to parse the XML, and to save. Scala comes with a nifty tool that turns your DTDs into a collection of Scala class definitions which do all of this for you.
Note that documentation and examples on the schema2src tool can be found in Burak's [draft scala xml book](http://burak.emir.googlepages.com/scalaxbook.docbk.html).

