---
layout: tutorial
title: Polimorfne metode

discourse: false

tutorial: scala-tour
categories: tour
num: 27

outof: 33
language: ba

next-page: local-type-inference
previous-page: implicit-conversions
---

Metode u Scali mogu biti parametrizovane i s vrijednostima i s tipovima.
Kao i na nivou klase, parameteri vrijednosti su ograđeni parom zagrada, dok su tipski parameteri deklarisani u paru uglatih zagrada.

Slijedi primjer:

    def dup[T](x: T, n: Int): List[T] =
      if (n == 0)
        Nil
      else
        x :: dup(x, n - 1)

    println(dup[Int](3, 4))
    println(dup("three", 3))

Metoda `dup` je parametrizovana tipom `T` i vrijednostima parametara `x: T` i `n: Int`.
Pri prvom pozivu `dup`, programer navodi sve zahtijevane parametre, ali kako vidimo u sljedećoj liniji,
programer ne mora eksplicitno navesti tipske parametre.
Scalin sistem tipova može zaključiti takve tipove sam.
Scalin kompajler ovo postiže gledanjem tipova vrijednosti datih parametara i konteksta u kojem je metoda pozvana.
