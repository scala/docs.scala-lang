---
layout: tour
title: Adnotacje
partof: scala-tour

num: 33
next-page: packages-and-imports
previous-page: by-name-parameters
language: pl
---

Adnotacje dodają meta-informacje do różnego rodzaju definicji.

Podstawową formą adnotacji jest `@C` lub `@C(a1, ..., an)`. Tutaj `C` jest konstruktorem klasy `C`, który musi odpowiadać klasie `scala.Annotation`. Wszystkie argumenty konstruktora `a1, ..., an` muszą być stałymi wyrażeniami (czyli wyrażeniami takimi jak liczby, łańcuchy znaków, literały klasowe, enumeracje Javy oraz ich jednowymiarowe tablice).

Adnotację stosuje się do pierwszej definicji lub deklaracji która po niej następuje. Możliwe jest zastosowanie więcej niż jednej adnotacji przed definicją lub deklaracją. Kolejność według której są one określone nie ma istotnego znaczenia.

Znaczenie adnotacji jest zależne od implementacji. Na platformie Java poniższe adnotacje domyślnie oznaczają:

|           Scala           |           Java           |
|           ------          |          ------          |
|  [`scala.SerialVersionUID`](https://www.scala-lang.org/api/current/scala/SerialVersionUID.html)   |  [`serialVersionUID`](https://java.sun.com/j2se/1.5.0/docs/api/java/io/Serializable.html#navbar_bottom) (pole)  |
|  [`scala.deprecated`](https://www.scala-lang.org/api/current/scala/deprecated.html)   |  [`java.lang.Deprecated`](https://java.sun.com/j2se/1.5.0/docs/api/java/lang/Deprecated.html) |
|  [`scala.inline`](https://www.scala-lang.org/api/current/scala/inline.html) (since 2.6.0)  |  brak odpowiednika |
|  [`scala.native`](https://www.scala-lang.org/api/current/scala/native.html) (since 2.6.0)  |  [`native`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (słowo kluczowe) |
|  [`scala.throws`](https://www.scala-lang.org/api/current/scala/throws.html) |  [`throws`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (słowo kluczowe) |
|  [`scala.transient`](https://www.scala-lang.org/api/current/scala/transient.html) |  [`transient`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (słowo kluczowe) |
|  [`scala.unchecked`](https://www.scala-lang.org/api/current/scala/unchecked.html) (od 2.4.0) |  brak odpowiednika |
|  [`scala.volatile`](https://www.scala-lang.org/api/current/scala/volatile.html) |  [`volatile`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (słowo kluczowe) |
|  [`scala.beans.BeanProperty`](https://www.scala-lang.org/api/current/scala/beans/BeanProperty.html) |  [`Design pattern`](https://docs.oracle.com/javase/tutorial/javabeans/writing/properties.html) |

W poniższym przykładzie dodajemy adnotację `throws` do definicji metody `read` w celu obsługi rzuconego wyjątku w programie w Javie.

> Kompilator Javy sprawdza, czy program zawiera obsługę dla [wyjątków kontrolowanych](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html) poprzez sprawdzenie, które wyjątki mogą być wynikiem wykonania metody lub konstruktora. Dla każdego kontrolowanego wyjątku, który może być wynikiem wykonania, adnotacja **throws** musi określić klasę tego wyjątku lub jedną z jej klas bazowych.
> Ponieważ Scala nie pozwala na definiowanie wyjątków kontrolowanych, jeżeli chcemy obsłużyć wyjątek z kodu w Scali w Javie, należy dodać jedną lub więcej adnotacji `throws` określających klasy rzucanych wyjątków.

```
package examples
import java.io._
class Reader(fname: String) {
  private val in = new BufferedReader(new FileReader(fname))
  @throws(classOf[IOException])
  def read() = in.read()
}
```

Poniższy program w Javie wypisuje zawartość pliku, którego nazwa jest podana jako pierwszy argument w metodzie `main`:

```
package test;
import examples.Reader;  // Klasa Scali !!
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
```

Zakomentowanie adnotacji `throws` w klasie `Reader` spowoduje poniższy błąd kompilacji głównego programu w Javie:

```
Main.java:11: exception java.io.IOException is never thrown in body of
corresponding try statement
        } catch (java.io.IOException e) {
          ^
1 error
```

### Adnotacje Javy ###

Java w wersji 1.5 wprowadziła możliwość definiowania metadanych przez użytkownika w postaci [adnotacji](https://docs.oracle.com/javase/tutorial/java/annotations/). Kluczową cechą adnotacji jest to, że polegają one na określaniu par nazwa-wartość w celu inicjalizacji jej elementów. Na przykład, jeżeli potrzebujemy adnotacji w celu śledzenia źródeł pewnej klasy, możemy ją zdefiniować w następujący sposób:

```
@interface Source {
  public String URL();
  public String mail();
}
```

I następnie zastosować w taki sposób:

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
public class MyClass extends HisClass ...
```

Zastosowanie adnotacji w Scali wygląda podobnie jak wywołanie konstruktora, gdzie wymagane jest podanie nazwanych argumentów:

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
class MyScalaClass ...
```

Składnia ta może się wydawać nieco nadmiarowa, jeżeli adnotacja składa się tylko z jednego elementu (bez wartości domyślnej), zatem jeżeli nazwa pola jest określona jako `value`, może być ona stosowana w Javie stosując składnię podobną do konstruktora:

```
@interface SourceURL {
    public String value();
    public String mail() default "";
}
```

Następnie ją można zastosować:

```
@SourceURL("https://coders.com/")
public class MyClass extends HisClass ...
```

W tym przypadku Scala daje taką samą możliwość:

```
@SourceURL("https://coders.com/")
class MyScalaClass ...
```

Element `mail` został zdefiniowany z wartością domyślną, zatem nie musimy jawnie określać wartości dla niego. Jednakże, jeżeli chcemy tego dokonać, Java nie pozwala nam na mieszanie tych styli:

```
@SourceURL(value = "https://coders.com/",
           mail = "support@coders.com")
public class MyClass extends HisClass ...
```

Scala daje nam większą elastyczność w tym aspekcie:

```
@SourceURL("https://coders.com/",
           mail = "support@coders.com")
    class MyScalaClass ...
```
