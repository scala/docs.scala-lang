---
layout: singlepage-overview
title: Ein Scala Tutorial für Java Programmierer

partof: scala-for-java-programmers

discourse: false
language: de
---

Von Michel Schinz und Philipp Haller.
Deutsche Übersetzung von Christian Krause.

## Einleitung

Dieses Tutorial dient einer kurzen Vorstellung der Programmiersprache Scala und deren Compiler. Sie
ist für fortgeschrittene Programmierer gedacht, die sich einen Überblick darüber verschaffen wollen,
wie man mit Scala arbeitet. Grundkenntnisse in Objekt-orientierter Programmierung, insbesondere
Java, werden vorausgesetzt.

## Das erste Beispiel

Als erstes folgt eine Implementierung des wohlbekannten *Hallo, Welt!*-Programmes. Obwohl es sehr
einfach ist, eignet es sich sehr gut, Scalas Funktionsweise zu demonstrieren, ohne dass man viel
über die Sprache wissen muss.

    object HalloWelt {
      def main(args: Array[String]) {
        println("Hallo, Welt!")
      }
    }

Die Struktur des Programmes sollte Java Anwendern bekannt vorkommen: es besteht aus einer Methode
namens `main`, welche die Kommandozeilenparameter als Feld (Array) von Zeichenketten (String)
übergeben bekommt. Der Körper dieser Methode besteht aus einem einzelnen Aufruf der vordefinierten
Methode `println`, die die freundliche Begrüßung als Parameter übergeben bekommt. Weiterhin hat die
`main`-Methode keinen Rückgabewert - sie ist also eine Prozedur. Daher ist es auch nicht notwendig,
einen Rückgabetyp zu spezifizieren.

Was Java-Programmierern allerdings weniger bekannt sein sollte, ist die Deklaration `object
HalloWelt`, welche die Methode `main` enthält. Eine solche Deklaration stellt dar, was gemeinhin als
*Singleton Objekt* bekannt ist: eine Klasse mit nur einer Instanz. Im Beispiel oben werden also mit
dem Schlüsselwort `object` sowohl eine Klasse namens `HalloWelt` als auch die dazugehörige,
gleichnamige Instanz definiert. Diese Instanz wird erst bei ihrer erstmaligen Verwendung erstellt.

Dem aufmerksamen Leser ist vielleicht aufgefallen, dass die `main`-Methode nicht als `static`
deklariert wurde. Der Grund dafür ist, dass statische Mitglieder (Attribute oder Methoden) in Scala
nicht existieren. Die Mitglieder von Singleton Objekten stellen in Scala dar, was Java und andere
Sprachen mit statischen Mitgliedern erreichen.

### Das Beispiel kompilieren

Um das obige Beispiel zu kompilieren, wird `scalac`, der Scala-Compiler verwendet. `scalac` arbeitet
wie die meisten anderen Compiler auch: er akzeptiert Quellcode-Dateien als Parameter, einige weitere
Optionen, und übersetzt den Quellcode in Java-Bytecode. Dieser Bytecode wird in ein oder mehrere
Java-konforme Klassen-Dateien, Dateien mit der Endung `.class`, geschrieben.

Schreibt man den obigen Quellcode in eine Datei namens `HalloWelt.scala`, kann man diese mit dem
folgenden Befehl kompilieren (das größer-als-Zeichen `>` repräsentiert die Eingabeaufforderung und
sollte nicht mit geschrieben werden):

    > scalac HalloWelt.scala

Damit werden einige Klassen-Dateien in das aktuelle Verzeichnis geschrieben. Eine davon heißt
`HalloWelt.class` und enthält die Klasse, die direkt mit dem Befehl `scala` ausgeführt werden kann,
was im folgenden Abschnitt erklärt wird.

### Das Beispiel ausführen

Sobald kompiliert, kann ein Scala-Programm mit dem Befehl `scala` ausgeführt werden. Die Anwendung
ist dem Befehl `java`, mit dem man Java-Programme ausführt, nachempfunden und akzeptiert dieselben
Optionen. Das obige Beispiel kann demnach mit folgendem Befehl ausgeführt werden, was das erwartete
Resultat ausgibt:

    > scala -classpath . HalloWelt
    Hallo, Welt!

## Interaktion mit Java

Eine Stärke der Sprache Scala ist, dass man mit ihr sehr leicht mit Java interagieren kann. Alle
Klassen des Paketes `java.lang` stehen beispielsweise automatisch zur Verfügung, während andere
explizit importiert werden müssen.

Als nächstes folgt ein Beispiel, was diese Interoperabilität demonstriert. Ziel ist es, das aktuelle
Datum zu erhalten und gemäß den Konventionen eines gewissen Landes zu formatieren, zum Beispiel
Frankreich.

Javas Klassen-Bibliothek enthält viele nützliche Klassen, beispielsweise `Date` und `DateFormat`.
Dank Scala Fähigkeit, nahtlos mit Java zu interoperieren, besteht keine Notwendigkeit, äquivalente
Klassen in der Scala Klassen-Bibliothek zu implementieren - man kann einfach die entsprechenden
Klassen der Java-Pakete importieren:

    import java.util.{Date, Locale}
    import java.text.DateFormat
    import java.text.DateFormat._

    object FrenchDate {
      def main(args: Array[String]) {
        val now = new Date
        val df = getDateInstance(LONG, Locale.FRANCE)
        println(df format now)
      }
    }

Scala Import-Anweisung ähnelt sehr der von Java, obwohl sie viel mächtiger ist. Mehrere Klassen des
gleichen Paketes können gleichzeitig importiert werden, indem sie, wie in der ersten Zeile, in
geschweifte Klammern geschrieben werden. Ein weiterer Unterschied ist, dass, wenn man alle
Mitglieder eines Paketes importieren will, einen Unterstrich (`_`) anstelle des Asterisk (`*`)
verwendet. Der Grund dafür ist, dass der Asterisk ein gültiger Bezeichner in Scala ist,
beispielsweise als Name für Methoden, wie später gezeigt wird. Die Import-Anweisung der dritten
Zeile importiert demnach alle Mitglieder der Klasse `DateFormat`, inklusive der statischen Methode
`getDateInstance` und des statischen Feldes `LONG`.

Innerhalb der `main`-Methode wird zuerst eine Instanz der Java-Klasse `Date` erzeugt, welche
standardmäßig das aktuelle Datum enthält. Als nächstes wird mithilfe der statischen Methode
`getDateInstance` eine Instanz der Klasse `DateFormat` erstellt. Schließlich wird das aktuelle Datum
gemäß der Regeln der lokalisierten `DateFormat`-Instanz formatiert ausgegeben. Außerdem
veranschaulicht die letzte Zeile eine interessante Fähigkeit Scalas Syntax: Methoden, die nur einen
Parameter haben, können in der Infix-Syntax notiert werden. Dies bedeutet, dass der Ausdruck

    df format now

eine andere, weniger verbose Variante des folgenden Ausdruckes ist:

    df.format(now)

Dies scheint nur ein nebensächlicher, syntaktischer Zucker zu sein, hat jedoch bedeutende
Konsequenzen, wie im folgenden Abschnitt gezeigt wird.

Um diesen Abschnitt abzuschließen, soll bemerkt sein, dass es außerdem direkt in Scala möglich ist,
von Java-Klassen zu erben sowie Java-Schnittstellen zu implementieren.

## Alles ist ein Objekt

Scala ist eine pur Objekt-orientierte Sprache, in dem Sinne dass *alles* ein Objekt ist, Zahlen und
Funktionen eingeschlossen. Der Unterschied zu Java ist, dass Java zwischen primitiven Typen, wie
`boolean` und `int`, und den Referenz-Typen unterscheidet und es nicht erlaubt ist, Funktionen wie
Werte zu behandeln.

### Zahlen sind Objekte

Zahlen sind Objekte und haben daher Methoden. Tatsächlich besteht ein arithmetischer Ausdruck wie
der folgende

    1 + 2 * 3 / x

exklusiv aus Methoden-Aufrufen, da es äquivalent zu folgendem Ausdruck ist, wie in vorhergehenden
Abschnitt gezeigt wurde:

    (1).+(((2).*(3))./(x))

Dies bedeutet außerdem, dass `+`, `*`, etc. in Scala gültige Bezeichner sind.

Die Zahlen umschließenden Klammern der zweiten Variante sind notwendig, weil Scalas lexikalischer
Scanner eine Regel zur längsten Übereinstimmung der Token verwendet. Daher würde der folgende
Ausdruck:

    1.+(2)

in die Token `1.`, `+`, und `2` zerlegt werden. Der Grund für diese Zerlegung ist, dass `1.` eine
längere, gültige Übereinstimmung ist, als `1`. Daher würde das Token `1.` als das Literal `1.0`
interpretiert, also als Gleitkommazahl anstatt als Ganzzahl. Den Ausdruck als

    (1).+(2)

zu schreiben, verhindert also, dass `1.` als Gleitkommazahl interpretiert wird.

### Funktionen sind Objekte

Vermutlich überraschender für Java-Programmierer ist, dass auch Funktionen in Scala Objekte sind.
Daher ist es auch möglich, Funktionen als Parameter zu übergeben, als Werte zu speichern, und von
anderen Funktionen zurückgeben zu lassen. Diese Fähigkeit, Funktionen wie Werte zu behandeln, ist
einer der Grundsteine eines sehr interessanten Programmier-Paradigmas, der *funktionalen
Programmierung*.

Ein sehr einfaches Beispiel, warum es nützlich sein kann, Funktionen wie Werte zu behandeln, ist
eine Timer-Funktion, deren Ziel es ist, eine gewisse Aktion pro Sekunde durchzuführen. Wie übergibt
man die durchzuführende Aktion? Offensichtlich als Funktion. Diese einfache Art der Übergabe einer
Funktion sollte den meisten Programmieren bekannt vorkommen: dieses Prinzip wird häufig bei
Schnittstellen für Rückruf-Funktionen (call-back) verwendet, die ausgeführt werden, wenn ein
bestimmtes Ereignis eintritt.

Im folgenden Programm akzeptiert die Timer-Funktion `oncePerSecond` eine Rückruf-Funktion als
Parameter. Deren Typ wird `() => Unit` geschrieben und ist der Typ aller Funktionen, die keine
Parameter haben und nichts zurück geben (der Typ `Unit` ist das Äquivalent zu `void`). Die
`main`-Methode des Programmes ruft die Timer-Funktion mit der Rückruf-Funktion auf, die einen Satz
ausgibt. In anderen Worten: das Programm gibt endlos den Satz "Die Zeit vergeht wie im Flug."
einmal pro Sekunde aus.

    object Timer {
      def oncePerSecond(callback: () => Unit) {
        while (true) {
          callback()
          Thread sleep 1000
        }
      }

      def timeFlies() {
        println("Die Zeit vergeht wie im Flug.")
      }

      def main(args: Array[String]) {
        oncePerSecond(timeFlies)
      }
    }

Weiterhin ist zu bemerken, dass, um die Zeichenkette auszugeben, die in Scala vordefinierte Methode
`println` statt der äquivalenten Methode in `System.out` verwendet wird.

#### Anonyme Funktionen

Während das obige Programm schon leicht zu verstehen ist, kann es noch verbessert werden. Als erstes
sei zu bemerken, dass die Funktion `timeFlies` nur definiert wurde, um der Funktion `oncePerSecond`
als Parameter übergeben zu werden. Dieser nur einmal verwendeten Funktion einen Namen zu geben,
scheint unnötig und es wäre angenehmer, sie direkt mit der Übergabe zu erstellen. Dies ist in Scala
mit *anonymen Funktionen* möglich, die eine Funktion ohne Namen darstellen. Die überarbeitete
Variante des obigen Timer-Programmes verwendet eine anonyme Funktion anstatt der Funktion
`timeFlies`:

    object TimerAnonymous {
      def oncePerSecond(callback: () => Unit) {
        while (true) {
          callback()
          Thread sleep 1000
        }
      }

      def main(args: Array[String]) {
        oncePerSecond(() => println("Die Zeit vergeht wie im Flug."))
      }
    }

Die anonyme Funktion erkennt man an dem Rechtspfeil `=>`, der die Parameter der Funktion von deren
Körper trennt. In diesem Beispiel ist die Liste der Parameter leer, wie man an den leeren Klammern
erkennen kann. Der Körper der Funktion ist derselbe, wie bei der `timeFlies` Funktion des
vorangegangenen Beispiels.

## Klassen

Wie weiter oben zu sehen war, ist Scala eine pur Objekt-orientierte Sprache, und als solche enthält
sie das Konzept von Klassen (der Vollständigkeit halber soll bemerkt sein, dass nicht alle
Objekt-orientierte Sprachen das Konzept von Klassen unterstützen, aber Scala ist keine von denen).
Klassen in Scala werden mit einer ähnlichen Syntax wie Java deklariert. Ein wichtiger Unterschied
ist jedoch, dass Scalas Klassen Argumente haben. Dies soll mit der folgenden Definition von
komplexen Zahlen veranschaulicht werden:

    class Complex(real: Double, imaginary: Double) {
      def re() = real
      def im() = imaginary
    }

Diese Klasse akzeptiert zwei Argumente, den realen und den imaginären Teil der komplexen Zahl. Sie
müssen beim Erzeugen einer Instanz der Klasse übergeben werden:

    val c = new Complex(1.5, 2.3)

Weiterhin enthält die Klasse zwei Methoden, `re` und `im`, welche als Zugriffsfunktionen (Getter)
dienen. Außerdem soll bemerkt sein, dass der Rückgabe-Typ dieser Methoden nicht explizit deklariert
ist. Der Compiler schlussfolgert ihn automatisch, indem er ihn aus dem rechten Teil der Methoden
ableitet, dass der Rückgabewert vom Typ `Double` ist.

Der Compiler ist nicht immer fähig, auf den Rückgabe-Typ zu schließen, und es gibt leider keine
einfache Regel, vorauszusagen, ob er dazu fähig ist oder nicht. In der Praxis stellt das
üblicherweise kein Problem dar, da der Compiler sich beschwert, wenn es ihm nicht möglich ist.
Scala-Anfänger sollten versuchen, Typ-Deklarationen, die leicht vom Kontext abzuleiten sind,
wegzulassen, um zu sehen, ob der Compiler zustimmt. Nach einer gewissen Zeit, bekommt man ein Gefühl
dafür, wann man auf diese Deklarationen verzichten kann und wann man sie explizit angeben sollte.

### Methoden ohne Argumente

Ein Problem der obigen Methoden `re` und `im` ist, dass man, um sie zu verwenden, ein leeres
Klammerpaar hinter ihren Namen anhängen muss:

    object ComplexNumbers {
      def main(args: Array[String]) {
        val c = new Complex(1.2, 3.4)
        println("imaginary part: " + c.im())
      }
    }

Besser wäre es jedoch, wenn man den realen und imaginären Teil so abrufen könnte, als wären sie
Felder, also ohne das leere Klammerpaar. Mit Scala ist dies möglich, indem Methoden *ohne Argumente*
definiert werden. Solche Methoden haben keine Klammern nach ihrem Namen, weder bei ihrer Definition
noch bei ihrer Verwendung. Die Klasse für komplexe Zahlen kann demnach folgendermaßen umgeschrieben
werden:

    class Complex(real: Double, imaginary: Double) {
      def re = real
      def im = imaginary
    }

### Vererbung und Überschreibung

Alle Klassen in Scala erben von einer Oberklasse. Wird keine Oberklasse angegeben, wie bei der
Klasse `Complex` des vorhergehenden Abschnittes, wird implizit `scala.AnyRef` verwendet.

Außerdem ist es möglich, von einer Oberklasse vererbte Methoden zu überschreiben. Dabei muss jedoch
explizit das Schlüsselwort `override` angegeben werden, um versehentliche Überschreibungen zu
vermeiden. Als Beispiel soll eine Erweiterung der Klasse `Complex` dienen, die die Methode
`toString` neu definiert:

    class Complex(real: Double, imaginary: Double) {
      def re = real
      def im = imaginary

      override def toString() =
        "" + re + (if (im < 0) "" else "+") + im + "i"
    }

## Container-Klassen und Musterabgleiche

Eine Datenstruktur, die häufig in Programmen vorkommt, ist der Baum. Beispielsweise repräsentieren
Interpreter und Compiler Programme intern häufig als Bäume, XML-Dokumente sind Bäume und einige
Container basieren auf Bäumen, wie Rot-Schwarz-Bäume.

Als nächstes wird anhand eines kleinen Programmes für Berechnungen gezeigt, wie solche Bäume in
Scala repräsentiert und manipuliert werden können. Das Ziel dieses Programmes ist, einfache
arithmetische Ausdrücke zu manipulieren, die aus Summen, Ganzzahlen und Variablen bestehen.
Beispiele solcher Ausdrücke sind: `1+2` und `(x+x)+(7+y)`.

Dafür muss zuerst eine Repräsentation für die Ausdrücke gewählt werden. Die natürlichste ist ein
Baum, dessen Knoten Operationen (Additionen) und dessen Blätter Werte (Konstanten und Variablen)
darstellen.

In Java würde man solche Bäume am ehesten mithilfe einer abstrakten Oberklasse für den Baum und
konkreten Implementierungen für Knoten und Blätter repräsentieren. In einer funktionalen Sprache
würde man algebraische Datentypen mit dem gleichen Ziel verwenden. Scala unterstützt das Konzept
einer Container-Klasse (case class), die einen gewissen Mittelweg dazwischen darstellen. Der
folgenden Quellcode veranschaulicht deren Anwendung:

    abstract class Tree
    case class Sum(l: Tree, r: Tree) extends Tree
    case class Var(n: String) extends Tree
    case class Const(v: Int) extends Tree

Die Tatsache, dass die Klassen `Sum`, `Var` und `Const` als Container-Klassen deklariert sind,
bedeutet, dass sie sich in einigen Gesichtspunkten von normalen Klassen unterscheiden:

-   das Schlüsselwort `new` ist nicht mehr notwendig, um Instanzen dieser Klassen zu erzeugen (man
    kann also `Const(5)` anstelle von `new Const(5)` schreiben)
-   Zugriffsfunktionen werden automatisch anhand der Parameter des Konstruktors erstellt (man kann
    den Wert `v` einer Instanz `c` der Klasse `Const` erhalten, indem man `c.v` schreibt)
-   der Compiler fügt Container-Klassen automatisch Implementierungen der Methoden `equals` und
    `hashCode` hinzu, die auf der *Struktur* der Klassen basieren, anstelle deren Identität
-   außerdem wird eine `toString`-Methode bereitgestellt, die einen Wert in Form der Quelle
    darstellt (der String-Wert des Baum-Ausdruckes `x+1` ist `Sum(Var(x),Const(1))`)
-   Instanzen dieser Klassen können mithilfe von Musterabgleichen zerlegt werden, wie weiter unten
    zu sehen ist

Da jetzt bekannt ist, wie die Datenstruktur der arithmetischen Ausdrücke repräsentiert wird, können
jetzt Operationen definiert werden, um diese zu manipulieren. Der Beginn dessen soll eine Funktion
darstellen, die Ausdrücke in einer bestimmten *Umgebung* auswertet. Das Ziel einer Umgebung ist es,
Variablen Werte zuzuweisen. Beispielsweise wird der Ausdruck `x+1` in der Umgebung, die der Variable
`x` den Wert `5` zuweist, geschrieben als `{ x -> 5 }`, mit dem Resultat `6` ausgewertet.

Demnach muss ein Weg gefunden werden, solche Umgebungen auszudrücken. Dabei könnte man sich für eine
assoziative Datenstruktur entscheiden, wie eine Hash-Tabelle, man könnte jedoch auch direkt eine
Funktion verwenden. Eine Umgebung ist nicht mehr als eine Funktion, die Werte mit Variablen
assoziiert. Die obige Umgebung `{ x -> 5 }` wird in Scala folgendermaßen notiert:

    { case "x" => 5 }

Diese Schreibweise definiert eine Funktion, welche bei dem String `"x"` als Argument die Ganzzahl
`5` zurückgibt, und in anderen Fällen mit einer Ausnahme fehlschlägt.

Vor dem Schreiben der Funktionen zum Auswerten ist es sinnvoll, für die Umgebungen einen eigenen Typ
zu definieren. Man könnte zwar immer `String => Int` verwenden, es wäre jedoch besser einen
dedizierten Namen dafür zu verwenden, der das Programmieren damit einfacher macht und die Lesbarkeit
erhöht. Dies wird in Scala mit der folgenden Schreibweise erreicht:

    type Environment = String => Int

Von hier an wird `Environment` als Alias für den Typ von Funktionen von `String` nach `Int`
verwendet.

Nun ist alles für die Definition der Funktion zur Auswertung vorbereitet. Konzeptionell ist die
Definition sehr einfach: der Wert der Summe zweier Ausdrücke ist die Summe der Werte der einzelnen
Ausdrücke, der Wert einer Variablen wird direkt der Umgebung entnommen und der Wert einer Konstante
ist die Konstante selbst. Dies in Scala auszudrücken, ist nicht viel schwieriger:

    def eval(t: Tree, env: Environment): Int = t match {
      case Sum(l, r) => eval(l, env) + eval(r, env)
      case Var(n)    => env(n)
      case Const(v)  => v
    }

Diese Funktion zum Auswerten von arithmetischen Ausdrücken nutzt einen *Musterabgleich* (pattern
matching) am Baumes `t`. Intuitiv sollte die Bedeutung der einzelnen Fälle klar sein:

1.  Als erstes wird überprüft, ob `t` eine Instanz der Klasse `Sum` ist. Falls dem so ist, wird der
linke Teilbaum der Variablen `l` und der rechte Teilbaum der Variablen `r` zugewiesen. Daraufhin
wird der Ausdruck auf der rechten Seite des Pfeiles ausgewertet, der die auf der linken Seite
gebundenen Variablen `l` und `r` verwendet.

2.  Sollte die erste Überprüfung fehlschlagen, also `t` ist keine `Sum`, wird der nächste Fall
abgehandelt und überprüft, ob `t` eine `Var` ist. Ist dies der Fall, wird analog zum ersten Fall der
Wert an `n` gebunden und der Ausdruck rechts vom Pfeil ausgewertet.

3.  Schlägt auch die zweite Überprüfung fehl, also `t` ist weder `Sum` noch `Val`, wird überprüft,
ob es eine Instanz des Typs `Const` ist. Analog wird bei einem Erfolg wie bei den beiden
vorangegangenen Fällen verfahren.

4.  Schließlich, sollten alle Überprüfungen fehlschlagen, wird eine Ausnahme ausgelöst, die
signalisiert, dass der Musterabgleich nicht erfolgreich war. Dies wird unweigerlich geschehen,
sollten neue Baum-Unterklassen erstellt werden.

Die prinzipielle Idee eines Musterabgleiches ist, einen Wert anhand einer Reihe von Mustern
abzugleichen und, sobald ein Treffer erzielt wird, Werte zu extrahieren, mit denen darauf
weitergearbeitet werden kann.

Erfahrene Objekt-orientierte Programmierer werden sich fragen, warum `eval` nicht als Methode der
Klasse `Tree` oder dessen Unterklassen definiert wurde. Dies wäre möglich, da Container-Klassen
Methoden definieren können, wie normale Klassen auch. Die Entscheidung, einen Musterabgleich oder
Methoden zu verwenden, ist Geschmackssache, hat jedoch wichtige Auswirkungen auf die
Erweiterbarkeit:

-   einerseits ist es mit Methoden einfach, neue Arten von Knoten als Unterklassen von `Tree`
    hinzuzufügen, andererseits ist die Ergänzung einer neuen Operation zur Manipulation des Baumes
    mühsam, da sie die Modifikation aller Unterklassen von `Tree` erfordert
-   nutzt man einen Musterabgleich kehrt sich die Situation um: eine neue Art von Knoten erfordert
    die Modifikation aller Funktionen die einen Musterabgleich am Baum vollführen, wogegen eine neue
    Operation leicht hinzuzufügen ist, indem einfach eine unabhängige Funktion dafür definiert wird

Einen weiteren Einblick in Musterabgleiche verschafft eine weitere Operation mit arithmetischen
Ausdrücken: partielle Ableitungen. Dafür gelten zur Zeit folgende Regeln:

1.  die Ableitung einer Summe ist die Summe der Ableitungen
2.  die Ableitung einer Variablen ist eins, wenn sie die abzuleitende Variable ist, ansonsten `0`
3.  die Ableitung einer Konstanten ist `0`

Auch diese Regeln können fast wörtlich in Scala übersetzt werden:

    def derive(t: Tree, v: String): Tree = t match {
      case Sum(l, r) => Sum(derive(l, v), derive(r, v))
      case Var(n) if (v == n) => Const(1)
      case _ => Const(0)
    }

Diese Funktion führt zwei neue, mit dem Musterabgleich zusammenhängende Konzepte ein. Der zweite,
sich auf eine Variable beziehende Fall hat eine *Sperre* (guard), einen Ausdruck, der dem
Schlüsselwort `if` folgt. Diese Sperre verhindert eine Übereinstimmung, wenn der Ausdruck falsch
ist. In diesem Fall wird sie genutzt, die Konstante `1` nur zurückzugeben, wenn die Variable die
abzuleitende ist. Die zweite Neuerung ist der *Platzhalter* `_`, der mit allem übereinstimmt, jedoch
ohne einen Namen dafür zu verwenden.

Die volle Funktionalität von Musterabgleichen wurde mit diesen Beispielen nicht demonstriert, doch
soll dies fürs Erste genügen. Eine Vorführung der beiden Funktionen an realen Beispielen steht immer
noch aus. Zu diesem Zweck soll eine `main`-Methode dienen, die den Ausdruck `(x+x)+(7+y)` als
Beispiel verwendet: zuerst wird der Wert in der Umgebung `{ x -> 5, y -> 7 }` berechnet und darauf
die beiden partiellen Ableitungen gebildet:

    def main(args: Array[String]) {
      val exp: Tree = Sum(Sum(Var("x"),Var("x")),Sum(Const(7),Var("y")))
      val env: Environment = {
        case "x" => 5
        case "y" => 7
      }
      println("Ausdruck: " + exp)
      println("Auswertung mit x=5, y=7: " + eval(exp, env))
      println("Ableitung von x:\n " + derive(exp, "x"))
      println("Ableitung von y:\n " + derive(exp, "y"))
    }

Führt man das Programm aus, erhält man folgende Ausgabe:

    Ausdruck: Sum(Sum(Var(x),Var(x)),Sum(Const(7),Var(y)))
    Auswertung mit x=5, y=7: 24
    Ableitung von x:
     Sum(Sum(Const(1),Const(1)),Sum(Const(0),Const(0)))
    Ableitung von y:
     Sum(Sum(Const(0),Const(0)),Sum(Const(0),Const(1)))

Beim Anblick dieser Ausgabe ist offensichtlich, dass man die Ergebnisse der Ableitungen noch
vereinfachen sollte. Eine solche Funktion zum Vereinfachen von Ausdrücken, die Musterabgleiche
nutzt, ist ein interessantes, aber gar nicht so einfaches Problem, was als Übung offen steht.

## Traits

Neben dem Vererben von Oberklassen ist es in Scala auch möglich von mehreren, sogenannten *Traits*
zu erben. Der beste Weg für einen Java-Programmierer einen Trait zu verstehen, ist sich eine
Schnittstelle vorzustellen, die Implementierungen enthält. Wenn in Scala eine Klasse von einem Trait
erbt, implementiert sie dessen Schnittstelle und erbt dessen Implementierungen.

Um die Nützlichkeit von Traits zu demonstrieren, werden wir ein klassisches Beispiel implementieren:
Objekte mit einer natürlichen Ordnung oder Rangfolge. Es ist häufig hilfreich, Instanzen einer
Klasse untereinander vergleichen zu können, um sie beispielsweise sortieren zu können. In Java
müssen die Klassen solcher Objekte die Schnittstelle `Comparable` implementieren. In Scala kann dies
mit einer äquivalenten, aber besseren Variante von `Comparable` als Trait bewerkstelligt werden, die
im Folgenden `Ord` genannt wird.

Wenn Objekte verglichen werden, sind sechs verschiedene Aussagen sinnvoll: kleiner, kleiner gleich,
gleich, ungleich, größer, und größer gleich. Allerdings ist es umständlich, immer alle sechs
Methoden dafür zu implementieren, vor allem in Anbetracht der Tatsache, dass vier dieser sechs durch
die verbliebenen zwei ausgedrückt werden können. Sind beispielsweise die Aussagen für gleich und
kleiner gegeben, kann man die anderen damit ausdrücken. In Scala können diese Beobachtungen mit
dem folgenden Trait zusammengefasst werden:

    trait Ord {
      def < (that: Any): Boolean
      def <=(that: Any): Boolean =  (this < that) || (this == that)
      def > (that: Any): Boolean = !(this <= that)
      def >=(that: Any): Boolean = !(this < that)
    }

Diese Definition erzeugt sowohl einen neuen Typ namens `Ord`, welcher dieselbe Rolle wie Javas
Schnittstelle `Comparable` spielt, und drei vorgegebenen Funktionen, die auf einer vierten,
abstrakten basieren. Die Methoden für Gleichheit und Ungleichheit erscheinen hier nicht, da sie
bereits in allen Objekten von Scala vorhanden sind.

Der Typ `Any`, welcher oben verwendet wurde, stellt den Ober-Typ aller Typen in Scala dar. Er kann
als noch allgemeinere Version von Javas `Object` angesehen werden, da er außerdem Ober-Typ der
Basis-Typen wie `Int` und `Float` ist.

Um Objekte einer Klasse vergleichen zu können, ist es also hinreichend, Gleichheit und die
kleiner-als-Beziehung zu implementieren, und dieses Verhalten gewissermaßen mit der eigentlichen
Klasse zu vermengen (mix in). Als Beispiel soll eine Klasse für Datumsangaben dienen, die Daten
eines gregorianischen Kalenders repräsentiert. Solche Daten bestehen aus Tag, Monat und Jahr, welche
durch Ganzzahlen dargestellt werden:

    class Date(y: Int, m: Int, d: Int) extends Ord {
      def year  = y
      def month = m
      def day   = d

      override def toString = year + "-" + month + "-" + day

Der wichtige Teil dieser Definition ist die Deklaration `extends Ord`, welche dem Namen der Klasse
und deren Parametern folgt. Sie sagt aus, dass `Date` vom Trait `Ord` erbt.

Nun folgt eine Re-Implementierung der Methode `equals`, die von `Object` geerbt wird, so dass die
Daten korrekt nach ihren Feldern verglichen werden. Die vorgegebene Implementierung von `equals` ist
dafür nicht nützlich, da in Java Objekte physisch, also nach deren Adressen im Speicher, verglichen
werden. Daher verwenden wir folgende Definition:

      override def equals(that: Any): Boolean =
        that.isInstanceOf[Date] && {
          val o = that.asInstanceOf[Date]
          o.day == day && o.month == month && o.year == year
        }

Diese Methode verwendet die vordefinierten Methoden `isInstanceOf` und `asInstanceOf`. Erstere
entspricht Javas `instanceof`-Operator und gibt `true` zurück, wenn das zu testende Objekt eine
Instanz des angegebenen Typs ist. Letztere entspricht Javas Operator für Typ-Umwandlungen (cast):
ist das Objekt eine Instanz des angegebenen Typs, kann es als solcher angesehen und gehandhabt
werden, ansonsten wird eine `ClassCastException` ausgelöst.

Schließlich kann die letzte Methode definiert werden, die für `Ord` notwendig ist, und die
kleiner-als-Beziehung implementiert. Diese nutzt eine andere, vordefinierte Methode, namens `error`,
des Paketes `sys`, welche eine `RuntimeException` mit der angegebenen Nachricht auslöst.

      def <(that: Any): Boolean = {
        if (!that.isInstanceOf[Date])
          sys.error("cannot compare " + that + " and a Date")

        val o = that.asInstanceOf[Date]
        (year < o.year) ||
        (year == o.year && (month < o.month ||
                           (month == o.month && day < o.day)))
      }
    }

Diese Methode vervollständigt die Definition der `Date`-Klasse. Instanzen dieser Klasse stellen
sowohl Daten als auch vergleichbare Objekte dar. Vielmehr implementiert diese Klasse alle sechs
Methoden, die für das Vergleichen von Objekten notwendig sind: `equals` und `<`, die direkt in der
Definition von `Date` vorkommen, sowie die anderen, in dem Trait `Ord` definierten Methoden.

Traits sind nützlich in Situationen wie der obigen, den vollen Funktionsumfang hier zu zeigen, würde
allerdings den Rahmen dieses Dokumentes sprengen.

## Generische Programmierung

Eine weitere Charakteristik Scalas, die in diesem Tutorial vorgestellt werden soll, behandelt das
Konzept der generischen Programmierung. Java-Programmierer, die die Sprache noch vor der Version 1.5
kennen, sollten mit den Problemen vertraut sein, die auftreten, wenn generische Programmierung nicht
unterstützt wird.

Generische Programmierung bedeutet, Quellcode nach Typen zu parametrisieren. Beispielsweise stellt
sich die Frage für einen Programmierer bei der Implementierung einer Bibliothek für verkettete
Listen, welcher Typ für die Elemente verwendet werden soll. Da diese Liste in verschiedenen
Zusammenhängen verwendet werden soll, ist es nicht möglich, einen spezifischen Typ, wie `Int`, zu
verwenden. Diese willkürliche Wahl wäre sehr einschränkend.

Aufgrund dieser Probleme griff man in Java vor der Einführung der generischen Programmierung zu dem
Mittel, `Object`, den Ober-Typ aller Typen, als Element-Typ zu verwenden. Diese Lösung ist
allerdings auch weit entfernt von Eleganz, da sie sowohl ungeeignet für die Basis-Typen, wie `int`
oder `float`, ist, als auch viele explizite Typ-Umwandlungen für den nutzenden Programmierer
bedeutet.

Scala ermöglicht es, generische Klassen und Methoden zu definieren, um diesen Problemen aus dem Weg
zu gehen. Für die Demonstration soll ein einfacher, generischer Container als Referenz-Typ dienen,
der leer sein kann, oder auf ein Objekt des generischen Typs zeigt:

    class Reference[T] {
      private var contents: T = _

      def get: T = contents

      def set(value: T) {
        contents = value
      }
    }

Die Klasse `Reference` ist anhand des Types `T` parametrisiert, der den Element-Typ repräsentiert.
Dieser Typ wird im Körper der Klasse genutzt, wie bei dem Feld `contents`. Dessen Argument wird
durch die Methode `get` abgefragt und mit der Methode `set` verändert.

Der obige Quellcode führt veränderbare Variablen in Scala ein, welche keiner weiteren Erklärung
erfordern sollten. Schon interessanter ist der initiale Wert dieser Variablen, der mit `_`
gekennzeichnet wurde. Dieser Standardwert ist für numerische Typen `0`, `false` für Wahrheitswerte,
`()` für den Typ `Unit` und `null` für alle anderen Typen.

Um diese Referenz-Klasse zu verwenden, muss der generische Typ bei der Erzeugung einer Instanz
angegeben werden. Für einen Ganzzahl-Container soll folgendes Beispiel dienen:

    object IntegerReference {
      def main(args: Array[String]) {
        val cell = new Reference[Int]
        cell.set(13)
        println("Reference contains the half of " + (cell.get * 2))
      }
    }

Wie in dem Beispiel zu sehen ist, muss der Wert, der von der Methode `get` zurückgegeben wird, nicht
umgewandelt werden, wenn er als Ganzzahl verwendet werden soll. Es wäre außerdem nicht möglich,
einen Wert, der keine Ganzzahl ist, in einem solchen Container zu speichern, da er speziell und
ausschließlich für Ganzzahlen erzeugt worden ist.

## Zusammenfassung

Dieses Dokument hat einen kurzen Überblick über die Sprache Scala gegeben und dazu einige einfache
Beispiele verwendet. Interessierte Leser können beispielsweise mit dem Dokument *Scala by Example*
fortfahren, welches fortgeschrittenere Beispiele enthält, und die *Scala Language Specification*
konsultieren, sofern nötig.
