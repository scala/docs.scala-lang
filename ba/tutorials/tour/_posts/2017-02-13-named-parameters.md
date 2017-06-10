---
layout: tutorial
title: Imenovani parametri

discourse: true

tutorial: scala-tour
categories: tour
num: 33
outof: 33
language: ba

previous-page: default-parameter-values
---

Kada se pozivaju metode i funkcije, možete koristiti imena varijabli eksplicitno pri pozivu:

      def printName(first: String, last: String) = {
        println(first + " " + last)
      }

      printName("John", "Smith")
      // ispisuje "John Smith"
      printName(first = "John", last = "Smith")
      // ispisuje "John Smith"
      printName(last = "Smith", first = "John")
      // ispisuje "John Smith"

Primijetite da kada koristite imenovane parametre pri pozivu, redoslijed nije bitan, dok god su svi parametri imenovani.
Ova sposobnost Scale radi vrlo dobro u paru sa [podrazumijevanim parametrima]({{ site.baseurl }}/tutorials/tour/default-parameter-values.html):

      def printName(first: String = "John", last: String = "Smith") = {
        println(first + " " + last)
      }

      printName(last = "Jones")
      // ispisuje "John Jones"

Pošto parametre možete navesti u bilo kom redoslijedu, možete koristiti podrazumijevane vrijednosti za parametre koji su zadnji u listi parametara.
