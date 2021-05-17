---
layout: tour
title: Implicitni parametri
language: ba
partof: scala-tour

num: 26
next-page: implicit-conversions
previous-page: self-types

---

Metoda s _implicitnim parametrima_ može biti primijenjena na argumente kao i normalna metoda.
U ovom slučaju, implicitna labela nema nikakav efekt.
Međutim, ako takvoj metodi nedostaju argumenti za implicitne parametre, ti argumenti će biti proslijeđeni automatski.

Argumenti koji se mogu proslijediti kao implicitni parametri spadaju u dvije kategorije:

* Prva, kvalifikovani su svi identifikatori x koji su dostupni pri pozivu metode bez prefiksa i predstavljaju implicitnu definiciju ili implicitni parameter.
* Druga, kvalifikovani su također svi članovi prijateljskih objekata (modula) tipova implicitnih parametara.

U sljedećem primjeru definisaćemo metodu `sum` koja izračunava sumu liste elemenata koristeći `add` i `unit` operacije monoida.
Molimo primijetite da implicitne vrijednosti ne mogu biti top-level, već moraju biti članovi templejta.
 
```scala mdoc
abstract class SemiGroup[A] {
  def add(x: A, y: A): A
}
abstract class Monoid[A] extends SemiGroup[A] {
  def unit: A
}
object ImplicitTest extends App {
  implicit object StringMonoid extends Monoid[String] {
    def add(x: String, y: String): String = x concat y
    def unit: String = ""
  }
  implicit object IntMonoid extends Monoid[Int] {
    def add(x: Int, y: Int): Int = x + y
    def unit: Int = 0
  }
  def sum[A](xs: List[A])(implicit m: Monoid[A]): A =
    if (xs.isEmpty) m.unit
    else m.add(xs.head, sum(xs.tail))

  println(sum(List(1, 2, 3)))       // uses IntMonoid implicitly
  println(sum(List("a", "b", "c"))) // uses StringMonoid implicitly
}
```

Ovaj primjer koristi strukturu iz apstraktne algebre da pokaže kako implicitni parametri rade. Polugrupa, modelovana s `SemiGroup` ovdje, je algebarska struktura na skupu `A` s (asocijativnom) operacijom, zvanom `add` ovdje, koja kombinuje par `A`-ova i vraća neki `A`.

Monoid, modelovan s `Monoid` ovdje, je polugrupa s posebnim elementom `A`, zvanim `unit`, koji kada se kombinujes nekim drugim elementom `A` vraća taj drugi element.

Da bismo pokazali kako implicitni parametri rade, prvo definišemo monoide `StringMonoid` i `IntMonoid` za stringove i integere, respektivno. 
Ključna riječ `implicit` kaže da se dati objekat može koristiti implicitno, unutar ovog domena, kao parametar funkcije obilježene s implicit.

Metoda `sum` prima `List[A]` i vraća `A`, koji predstavlja rezultat primjene operacije monoida sukcesivno kroz cijelu listu. Navodeći parametar `m` implicitnim ovdje znači da samo moramo proslijediti `xs` parametar pri pozivu, pošto imamo `List[A]` znamo šta je tip `A` ustvari i stoga tip `Monoid[A]` se traži. 
Možemo implicitno naći bilo koji `val` ili `object` u trenutnom domenu koji ima taj tip i koristiti ga bez da ga navedemo eksplicitno.

Napokon, zovemo `sum` dvaput, sa samo jednim parametrom svaki put. 
Pošto je drugi parametar metode `sum`, `m`, implicitan, njegova vrijednost se traži u trenutnom domenu, bazirano na tipu monoida koji se traži, što znači da se oba izraza mogu izračunati potpuno.

Ovo je izlaz navedenog Scala programa:

```
6
abc
```
