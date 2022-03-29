---
title: Primi passi su scala e sbt con la linea di comando
layout: singlepage-overview
partof: getting-started-with-scala-and-sbt-on-the-command-line
language: it
disqus: true
next-page: /it/testing-scala-with-sbt-on-the-command-line
---

In questo tutorial si vedrà come creare un progetto Scala a partire da un template, che può essere usato come punto di partenza anche per progettti personali. 
Lo strumento utilizzato per tale scopo è [sbt](https://www.scala-sbt.org/1.x/docs/index.html), che è lo standard di build per Scala.
sbt permette di compilare, eseguire e testare i tuoi progetti, ma permette di svolgere anche altri compiti.
Si presuppone una conoscenza dell'uso della linea di comando.

## Installazione
1. Assicurarsi di avere la Java 8 JDK (conosciuta anche come 1.8) installata
    * Per verificarlo, eseguire `javac -version` da linea di comando e controllare che nell'output sia riportato
    `javac 1.8.___`
    * Se non si possiede la versione 1.8 o superiore, installarla seguendo [queste indicazioni](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
1. Installare sbt
    * [Mac](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Mac.html)
    * [Windows](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Windows.html)
    * [Linux](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Linux.html)

## Creare il progetto
1. Eseguire il comando `cd` specificando una cartella vuota per spostarsi in essa.
1. Eseguire il comando `sbt new scala/hello-world.g8`. Questo effettuerà una pull del template 'hello-world' da GitHub.
    Si occuperà inoltre di creare la cartella `target`, che per ora può essere ignorata. 
1. Quando richiesto verrà richiesto il nome dell'applicazione, indicare `hello-world`. In questo modo verrà creato un progetto chiamato "hello-world".
1. Osserviamo cosa è stato generato una volta eseguiti i passaggi sopra riportati:

```
- hello-world
    - project (sbt usa questa cartella per installare e gestire plugins e dipendenze)
        - build.properties
    - src
        - main
            - scala (Tutto il codice scala che viene scritto dovrà andare qui)
                - Main.scala (Entry point dell'applicazione) <-- per ora è tutto ciò che ci seervirà
    - build.sbt (il file di definizione della build interpretato da sbt)
```

Una volta che verrà buildato il progetto, sbt creerà diverse cartelle `target` per i file generati. Possono essere ignorate per lo scopo di questo tutorial.

## Eseguire il progetto
1. `cd` nella cartella `hello-world`.
1. Lanciare il comando `sbt`. Questo aprirà la console di sbt.
1. Eseguire `~run`. Il carattere `~` è opzionale. Indica ad sbt di eseguirsi ad ogni salvataggio di un file, permettendo un ciclo di modifica,esecuzione e debug più veloce. sbt genererà anche una cartella chiamata `target` che può essere ignorata.

## Modificare il codice
1. Aprire il file `src/main/scala/Main.scala` in un qualsiasi editor di testo.
1. Modificare "Hello, World!" in "Hello, New York!"
1. Se non è stato interrotto il comando sbt, dovrebbe ora apparire "Hello, New York!" sulla console.
1. Si può continuare a modificare il file, e le modifiche dovrebbero apparire a schermo se non vengono riportati errori. 

## Aggiungere una dipendenza
Vediamo ora come utilizzare librerie pubblicate da terzi per aggiungere ulteriori funzionalità alle nostre applicazioni.

1. Aprire il file `build.sbt` con un qualsiasi editor di testo e aggiungere la seguente riga:

```
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.2"
```
`libraryDependencies` è un set (un tipo di collection in scala), e utilizzando il simbolo `+=`,
si sta aggiungendo la dipendenza [scala-parser-combinators](https://github.com/scala/scala-parser-combinators) al set di dipendenze che sbt fetcherà quando verà inizializzato.
Una volta eseguito questo passaggio, sarà possibile importare classi, object ed altro da scala-parser-combinators tramite una semplice istruzione di import.

ulteriori librerie pubblicate possono essere trovate sul sito
[Scaladex](https://index.scala-lang.org/), dove è possibile copare le informazioni delle dipendenze cercate nel file `build.sbt`.

## Next steps

Si consiglia di continuare al tutorial successivo della serie  _getting started with sbt_ , ed imparare a [testare il codice Scala con sbt tramite linea di comando](testing-scala-with-sbt-on-the-command-line.html).

**oppure**

- Continuare ad imparare Scala online e in maniera interattiva su
 [Scala Exercises](https://www.scala-exercises.org/scala_tutorial).
- Imparare le feature di Scala tramite articoli più concisi su [Tour of Scala]({{ site.baseurl }}/tour/tour-of-scala.html).