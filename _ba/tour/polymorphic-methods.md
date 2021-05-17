---
layout: tour
title: Polimorfne metode
language: ba
partof: scala-tour

num: 28

next-page: type-inference
previous-page: implicit-conversions
prerequisite-knowledge: unified-types

---

Metode u Scali mogu biti parametrizovane i s vrijednostima i s tipovima.
Sintaksa je slična kao kod generičkih klasa.
Vrijednosni parameteri ("obični") su ograđeni parom zagrada, dok su tipski parameteri deklarisani u paru uglatih zagrada.

Slijedi primjer:

```scala mdoc
def listOfDuplicates[A](x: A, length: Int): List[A] = {
    if (length < 1)
        Nil
    else
        x :: listOfDuplicates(x, length - 1)
}
println(listOfDuplicates[Int](3, 4))  // List(3, 3, 3, 3)
println(listOfDuplicates("La", 8))  // List(La, La, La, La, La, La, La, La)
```

Metoda `listOfDuplicates` je parametrizovana tipom `A` i vrijednostima parametara `x: A` i `n: Int`.
Ako je `length < 1` vraćamo praznu listu. U suprotnom dodajemo `x` na početak liste duplikata vraćene rekurzivnim pozivom `listOfDuplicates`. (napomena: `::` znači dodavanje elementa na početak sekvence).

Kada pozovemo `listOfDuplicates` s `[Int]` kao tipskim parametrom, prvi argument mora biti `Int` a povratni tip će biti `List[Int]`. Međutim, ne morate uvijek eksplicitno navoditi tipski parametaryou jer kompajler često može zaključiti tip argumenta (`"La"` je String). Ustvari, ako se ova metoda poziva iz Jave, nemoguće je da se proslijedi tipski parametar.
