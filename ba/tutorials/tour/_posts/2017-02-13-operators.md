---
layout: tutorial
title: Operatori

discourse: false

tutorial: scala-tour
categories: tour
num: 29
outof: 33
language: ba

next-page: automatic-closures
previous-page: local-type-inference
---

Bilo koja metoda koja prima samo jedan parametar može biti korištena kao *infiksni operator* u Scali.
Slijedi definicija klase `MyBool` koja definiše tri metode `and`, `or`, i `negate`.

    class MyBool(x: Boolean) {
      def and(that: MyBool): MyBool = if (x) that else this
      def or(that: MyBool): MyBool = if (x) this else that
      def negate: MyBool = new MyBool(!x)
    }

Sada je moguće koristiti `and` i `or` kao infiksne operatore:

    def not(x: MyBool) = x negate; // tačka-zarez je obavezna ovdje
    def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)

Prva linija navedenog koda pokazuje da je također moguće koristiti besparametarske metode kao postfiksne operatore.
Druga linija definiše funkciju `xor` koristeći `and` i `or` metode kao i novu `not` funkciju.
U ovom primjeru korištenje _infiksnih operatora_ pomaže da definiciju `xor`-a učinimo čitljivijom.

Ovo je primjer sintakse tradicionalnih objektno orijenitsanih programskih jezika:

    def not(x: MyBool) = x.negate; // tačka-zarez je obavezna ovdje
    def xor(x: MyBool, y: MyBool) = x.or(y).and(x.and(y).negate)
