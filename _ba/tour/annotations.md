---
layout: tour
title: Anotacije
language: ba
partof: scala-tour

num: 32
next-page: packages-and-imports
previous-page: by-name-parameters

---

Anotacije pridružuju meta-informacije definicijama.
Npr, anotacija `@deprecated` prije metode tjera kompajler da ispište upozorenje ako se metoda koristi.
```
object DeprecationDemo extends App {
  @deprecated
  def hello = "hola"

  hello  
}
```
Ovo će se kompajlirati ali će kompajler ispisati upozorenje: "there was one deprecation warning".

Anotacijska klauza odnosi se na prvu definiciju ili deklaraciju koja slijedi nakon nje. 
Anotacijskih klauza može biti i više od jedne.
Redoslijed anotacijskih klauza nije bitan.

## Anotacije za korektnost enkodiranja
Određene anotacije će uzrokovati pad kompajliranja ako određeni uslovi nisu ispunjeni. 
Npr, anotacija `@tailrec` osigurava da je metoda [tail-rekurzivna](https://en.wikipedia.org/wiki/Tail_call). Tail-rekurzija može zadržati memorijske zahtjeve konstantnim. 
Evo kako se koristi na metodi koja izračunava faktorijel:
```scala mdoc
import scala.annotation.tailrec

def factorial(x: Int): Int = {

  @tailrec
  def factorialHelper(x: Int, accumulator: Int): Int = {
    if (x == 1) accumulator else factorialHelper(x - 1, accumulator * x)
  }
  factorialHelper(x, 1)
}
```
Metoda `factorialHelper` ima `@tailrec` koja osigurava da je metoda zaista  tail-rekurzivna. Ako bismo promijenili implementaciju  `factorialHelper` na sljedeće, palo bi:
```
import scala.annotation.tailrec

def factorial(x: Int): Int = {
  @tailrec
  def factorialHelper(x: Int): Int = {
    if (x == 1) 1 else x * factorialHelper(x - 1)
  }
  factorialHelper(x)
}
```
Dobili bismo poruku "Recursive call not in tail position".


## Anotacije koje utiču na generisanje koda

Neke anotacije kao što je `@inline` utiču na generisanje koda (npr. Vaš jar fajl može imati drugačije bajtove ako ne koristite anotaciju). Inlining znači ubacivanje koda u tijelo metode na mjestu poziva. Rezultujući bajtkod je duži, ali bi trebao da radi brže. 
Koristeći anotaciju `@inline` ne osigurava da će metoda biti inline, ali će uzrokovati da to kompajler odradi ako heuristička analiza bude zadovoljavajuća.

### Java anotacije ###

Kada se piše Scala kod koji radi sa Javom, postoji par razlika u sintaksi anotacija.
**Napomena:** Pobrinite se da koristite `-target:jvm-1.8` opciju sa Java anotacijama.

Java ima korisnički definisane metapodatke u formi [anotacija](https://docs.oracle.com/javase/tutorial/java/annotations/). Ključna sposobnost anotacija je da koriste parove ime-vrijednost za inicijalizaciju svojih elemenata. Naprimjer, ako nam treba anotacija da pratimo izvor neke klase mogli bismo je definisati kao

```
@interface Source {
  public String URL();
  public String mail();
}
```

I upotrijebiti je ovako:

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
public class MyClass extends HisClass ...
```

Primjena anotacije u Scali izgleda kao poziv konstruktora, dok se za instanciranje Javinih anotacija moraju koristiti imenovani argumenti:

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
class MyScalaClass ...
```

Ova sintaksa je ponekad naporna, npr. ako anotacija ima samo jedan element (bez podrazumijevane vrijednosti), pa po konvenciji,
ako se koristi naziv `value` onda se u Javi može koristiti i konstruktor-sintaksa:

```
@interface SourceURL {
    public String value();
    public String mail() default "";
}
```

I upotrijebiti je kao:

```
@SourceURL("https://coders.com/")
public class MyClass extends HisClass ...
```

U ovom slučaju, Scala omogućuje istu sintaksu:

```
@SourceURL("https://coders.com/")
class MyScalaClass ...
```

Element `mail` je specificiran s podrazumijevanom vrijednošću tako da ne moramo eksplicitno navoditi vrijednost za njega.
Međutim, ako trebamo, ne možemo miješati dva Javina stila:

```
@SourceURL(value = "https://coders.com/",
           mail = "support@coders.com")
public class MyClass extends HisClass ...
```

Scala omogućuje veću fleksibilnost u ovom pogledu:

```
@SourceURL("https://coders.com/",
           mail = "support@coders.com")
    class MyScalaClass ...
```

