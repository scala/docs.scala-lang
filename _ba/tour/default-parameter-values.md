---
layout: tour
title: Podrazumijevane vrijednosti parametara
language: ba
partof: scala-tour

num: 33
next-page: named-arguments
previous-page: annotations
prerequisite-knowledge: named-arguments, function syntax

---

Scala omogućuje davanje podrazumijevanih vrijednosti parametrima koje dozvoljavaju korisniku metode da izostavi te parametre.

```scala mdoc
def log(message: String, level: String = "INFO") = println(s"$level: $message")

log("System starting")  // prints INFO: System starting
log("User not found", "WARNING")  // prints WARNING: User not found
```

Parametar `level` ima podrazumijevanu vrijednost tako da je opcioni. Na zadnjoj liniji, argument `"WARNING"` prebrisava podrazumijevani argument `"INFO"`. Gdje biste koristili overloadane metode u Javi, možete koristiti metode s opcionim parametrima da biste postigli isti efekat. Međutim, ako korisnik izostavi argument, bilo koji sljedeći argumenti moraju biti imenovani.

```scala mdoc  
class Point(val x: Double = 0, val y: Double = 0)

val point1 = new Point(y = 1)
```
Ovdje moramo reći `y = 1`.

Podrazumijevani parametri u Scali nisu opcioni kada se koriste iz Java koda:

```scala mdoc:reset
// Point.scala
class Point(val x: Double = 0, val y: Double = 0)
```

```java
// Main.java
public class Main {
    public static void main(String[] args) {
        Point point = new Point(1);  // does not compile
    }
}
```
