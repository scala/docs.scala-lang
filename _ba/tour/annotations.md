---
layout: tour
title: Anotacije

discourse: false

partof: scala-tour

num: 31

language: ba

next-page: default-parameter-values
previous-page: case-classes
---

Anotacije pridružuju meta-informacije definicijama.

Jednostavna anotacija ima formu `@C` ili `@C(a1, .., an)`. Ovdje je `C` konstruktor klase `C`, koja mora naslijediti klasu `scala.Annotation`.
Svi argumenti konstruktora `a1, .., an` moraju biti konstante (npr. izrazi ili numeričke primitive, stringovi, primitive klasa,
Java enumeracije i jednodimenzionalni nizovi (`Array`) navedenih).

Anotacijska klauza (ili više njih) primjenjuje se na prvu definiciju ili deklaraciju koja slijedi nakon nje.
Redoslijed anotacijskih klauza nije bitan.

Značenje anotacijskih klauza je _implementacijski-nezavisno_. Na Java platformi, sljedeće Scala anotacije imaju standardno značenje.

|           Scala           |           Java           |
|           ------          |          ------          |
|  [`scala.SerialVersionUID`](https://www.scala-lang.org/api/current/scala/SerialVersionUID.html)   |  [`serialVersionUID`](http://java.sun.com/j2se/1.5.0/docs/api/java/io/Serializable.html#navbar_bottom) (polje)  |
|  [`scala.deprecated`](https://www.scala-lang.org/api/current/scala/deprecated.html)   |  [`java.lang.Deprecated`](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/Deprecated.html) |
|  [`scala.inline`](https://www.scala-lang.org/api/current/scala/inline.html) (od 2.6.0)  |  nema ekvivalent |
|  [`scala.native`](https://www.scala-lang.org/api/current/scala/native.html) (od 2.6.0)  |  [`native`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_ključna riječs.html) (ključna riječ) |
|  [`scala.remote`](https://www.scala-lang.org/api/current/scala/remote.html) |  [`java.rmi.Remote`](http://java.sun.com/j2se/1.5.0/docs/api/java/rmi/Remote.html) |
|  [`scala.throws`](https://www.scala-lang.org/api/current/scala/throws.html) |  [`throws`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (ključna riječ) |
|  [`scala.transient`](https://www.scala-lang.org/api/current/scala/transient.html) |  [`transient`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (ključna riječ) |
|  [`scala.unchecked`](https://www.scala-lang.org/api/current/scala/unchecked.html) (od 2.4.0) |  nema ekvivalent |
|  [`scala.volatile`](https://www.scala-lang.org/api/current/scala/volatile.html) |  [`volatile`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (ključna riječ) |
|  [`scala.beans.BeanProperty`](https://www.scala-lang.org/api/current/scala/beans/BeanProperty.html) |  [`Dizajn patern`](http://docs.oracle.com/javase/tutorial/javabeans/writing/properties.html) |

U sljedećem primjeru dodajemo `throws` anotaciju definiciji metode `read` da bi uhvatili izuzetak (exception) u Java main programu.

> Java kompajler provjerava da li program sadrži rukovatelje (handler) za [provjereni izuzetak (checked exception)](http://docs.oracle.com/javase/specs/jls/se5.0/html/exceptions.html)
analizom koji se izuzeci mogu dobiti izvršenjem neke metode ili konstruktora.
Za svaki mogući provjereni izuzetak **throws** klauza metodi ili konstruktora _mora_ navesti klasu izuzetka ili neku nadklasu izuzetka.
> Pošto Scala nema provjerene izuzetke, Scala metode _moraju_ imati jednu ili više `throws` anotacija kako bi Java kod mogao uhvatiti iste.

    package examples
    import java.io._
    class Reader(fname: String) {
      private val in = new BufferedReader(new FileReader(fname))
      @throws(classOf[IOException])
      def read() = in.read()
    }

Sljedeći Java program prikazuje sadržaj fajla s imenom koje je proslijeđeno kao prvi argument `main` metode.

    package test;
    import examples.Reader;  // Scala klasa !!
    public class AnnotaTest {
        public static void main(String[] args) {
            try {
                Reader in = new Reader(args[0]);
                int c;
                while ((c = in.read()) != -1) {
                    System.out.print((char) c);
                }
            } catch (java.io.IOException e) {
                System.out.println(e.getMessage());
            }
        }
    }

Kada bi zakomentarisali `throws` anotaciju u klasi `Reader` dobili bi sljedeću grešku s porukom pri kompajliranju Java main programa:

    Main.java:11: exception java.io.IOException is never thrown in body of
    corresponding try statement
            } catch (java.io.IOException e) {
              ^
    1 error

### Java anotacije ###

**Napomena:** Pobrinite se da koristite `-target:jvm-1.5` opciju sa Java anotacijama.

Java 1.5 je uvela korisnički definisane metapodatke u formi [anotacija](http://java.sun.com/j2se/1.5.0/docs/guide/language/annotations.html). Ključna sposobnost anotacija je da koriste parove ime-vrijednost za inicijalizaciju svojih elemenata. Naprimjer, ako nam treba anotacija da pratimo izvor neke klase mogli bismo je definisati kao

    @interface Source {
      public String URL();
      public String mail();
    }

I upotrijebiti je kao npr.:

    @Source(URL = "http://coders.com/",
            mail = "support@coders.com")
    public class MyClass extends HisClass ...

Primjena anotacije u Scali izgleda kao poziv konstruktora, dok se za instanciranje Javinih anotacija moraju koristiti imenovani argumenti:

    @Source(URL = "http://coders.com/",
            mail = "support@coders.com")
    class MyScalaClass ...

Ova sintaksa je ponekad naporna, npr. ako anotacija ima samo jedan element (bez podrazumijevane vrijednosti), pa po konvenciji,
ako se koristi naziv `value` onda se u Javi može koristiti i konstruktor-sintaksa:

    @interface SourceURL {
        public String value();
        public String mail() default "";
    }

I upotrijebiti je kao npr.:

    @SourceURL("http://coders.com/")
    public class MyClass extends HisClass ...

U ovom slučaju, Scala omogućuje istu sintaksu:

    @SourceURL("http://coders.com/")
    class MyScalaClass ...

Element `mail` je specificiran s podrazumijevanom vrijednošću tako da ne moramo eksplicitno navoditi vrijednost za njega.
Međutim, ako trebamo, ne možemo miješati dva Javina stila:

    @SourceURL(value = "http://coders.com/",
               mail = "support@coders.com")
    public class MyClass extends HisClass ...

Dok u Scali možemo:

    @SourceURL("http://coders.com/",
               mail = "support@coders.com")
        class MyScalaClass ...
