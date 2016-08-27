---
layout: tutorial
title: XML procesiranje

disqus: true

tutorial: scala-tour
num: 13
outof: 33
language: ba
---

Scala se može koristiti za jednostavno kreiranje, parsiranje, i procesiranje XML dokumenata.
XML podaci mogu biti predstavljeni u Scali generičkom reprezentacijom podataka, ili reprezentacijom specifičnom podacima.
Drugi tip je podržan s *data-binding* alatom `schema2src`.

### Runtime reprezentacija ###
XML podaci su predstavljeni kao stabla s labelama.
Počev od Scale 1.2 (prethodne verzije morale su koristiti -Xmarkupoption), 
možete pogodno kreirati takva stabla koristeći standardnu XML sintaksu.

Razmotrimo sljedeći XML dokument:

    <html>
      <head>
        <title>Hello XHTML world</title>
      </head>
      <body>
        <h1>Hello world</h1>
        <p><a href="http://scala-lang.org/">Scala</a> talks XHTML</p>
      </body>
    </html>

Ovaj dokument može biti kreiran sljedećim Scala programom:

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

Moguće je miješati Scala izraze i XML:

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

### Vezivanje podataka (Data Binding) ###
Često imate DTD za XML dokumente koje želite procesirati.
Želite kreirati posebne Scala klase za nju, i kod za parsiranje i spremanje XML-a.
Scala ima zgodan alat koji pretvara Vašu DTD u kolekciju Scala klasa.
Dokumentacija i primjeri alata schema2src mogu se naći u Burakovoj
[draft scala xml knjizi](http://burak.emir.googlepages.com/scalaxbook.docbk.html).

