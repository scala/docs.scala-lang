---
layout: tour
title: Wprowadzenie

discourse: false

partof: scala-tour

num: 1
language: pl
next-page: basics
---

## Witaj
Ten przewodnik składa się z drobnych wprowadzeń do najczęściej używanych funkcjonalności języka Scala.

Jest to jedynie krótkie wprowadzenie, a nie pełny samouczek.
Jeżeli szukasz tego drugiego, rozważ jedną z [książek](/books.html) lub [inne zasoby](/learn.html).

## Czym jest Scala?
Scala jest nowoczesnym, wieloparadygmatowym językiem programowania zaprojektowanym do wyrażania powszechnych wzorców programistycznych w zwięzłym, eleganckim i bezpiecznie typowanym stylu.
Scala płynnie integruje ze sobą cechy języków funkcyjnych i zorientowanych obiektowo.

## Scala jest zorientowana obiektowo ##
Scala jest czysto obiektowym językiem w tym sensie, że każda [wartość jest obiektem](unified-types.html).
Typy oraz zachowania obiektów są opisane przez [klasy](classes.html) oraz [cechy](traits.html).
Klasy są rozszerzane przez podtypowanie i elastyczny mechanizm [kompozycji domieszek](mixin-class-composition.html) jako zastępstwo dla wielodziedziczenia.

## Scala jest funkcyjna ##
Scala jest też funkcyjnym językiem w tym sensie, że [każda funkcja jest wartością](unified-types.html).
Scala dostarcza [lekką składnię](basics.html#funkcje) do definiowana funkcji anonimowych, wspiera [funkcje wyższego rzędu](higher-order-functions.html), pozwala funkcjom, by były [zagnieżdżone](nested-functions.html), a także umożliwia [rozwijanie funkcji](multiple-parameter-lists.html).
[Klasy przypadków (case class)](case-classes.html) oraz wbudowane wsparcie dla [dopasowania wzorców (pattern matching)](pattern-matching.html) wprowadzają do Scali mechanizm typów algebraicznych stosowany w wielu funkcyjnych językach programowania. [Obiekty singleton](singleton-objects.html) są wygodną metodą grupowania funkcji, które nie należą do żadnej klasy.

Ponadto, mechanizm dopasowania wzorców w naturalny sposób rozszerza się do obsługi [przetwarzania danych w formacie XML](https://github.com/scala/scala-xml/wiki/XML-Processing) z pomocą [wzorców sekwencji ignorujących prawą stronę](regular-expression-patterns.html), z wykorzystaniem rozszerzeń [obiektów ekstraktorów](extractor-objects.html).
W tym kontekście [wyrażenia for](for-comprehensions.html) są użyteczne w formułowaniu zapytań.
Te i inne funkcjonalności sprawiają, że Scala jest idealnym językiem do tworzenia aplikacji takich jak usługi sieciowe.

## Scala jest statycznie typowana ##
Scala posiada ekspresywny system typów, który zapewnia, że abstrakcje są używane w bezpieczny i należyty sposób.
W szczególności system typów wspiera:

* [klasy generyczne](generic-classes.html),
* [adnotacje wariancji](variances.html),
* [górne](upper-type-bounds.html) oraz [dolne](lower-type-bounds.html) ograniczenia typów,
* [klasy zagnieżdżone](inner-classes.html) i [typy abstrakcyjne](abstract-types.html) jako elementy obiektów,
* [typy złożone](compound-types.html),
* [jawnie typowane samoreferencje](self-types.html),
* [parametry domniemane](implicit-parameters.html) i [konwersje niejawne](implicit-conversions.html),
* [metody polimorficzne](polymorphic-methods.html).

[Mechanizm lokalnej inferencji typów](type-inference.html) sprawia, że nie jest konieczne podawanie nadmiarowych informacji o typach w programie.
Wszystkie te funkcje języka pozwalają na bezpieczne ponowne użycie programistycznych abstrakcji oraz rozwijanie oprogramowania z bezpieczeństwem dla typów.

## Scala jest rozszerzalna ##
W praktyce rozwiązania specyficzne dla domeny często wymagają odpowiednich, również specyficznych domenowo, rozszerzeń języka.
Scala dostarcza unikalne mechanizmy, dzięki którym można łatwo dodawać nowe konstrukcje do języka w postaci bibliotek.

W większości przypadków można to uzyskać bez potrzeby używania technik meta-programowania takich jak np. makra.
Oto kilka przykładów:

* [Klasy domniemane](http://docs.scala-lang.org/overviews/core/implicit-classes.html) pozwalają na rozszerzanie już istniejących klas o nowe metody,
* [Interpolacja łańcuchów znaków](/overviews/core/string-interpolation.html) jest rozszerzalna o niestandardowe interpolatory użytkownika.

## Scala współdziała z językami JVM
Scala jest zaprojektowana tak, aby jak najlepiej współpracować z popularnym środowiskiem uruchomieniowym Java Runtime Environment (JRE).
W szczególności interakcja z językiem Java jest tak płynna, jak tylko jest to możliwe.
Nowsze funkcje języka Java takie jak interfejsy funkcyjne (SAM), [funkcje anonimowe (lambda)](higher-order-functions.html), [adnotacje](annotations.html) oraz [typy generyczne](generic-classes.html) posiadają swoje bezpośrednie odwzorowania w języku Scala.

Unikalne dla Scali funkcje, które nie mają odwzorowania w Javie, jak na przykład [domyślne wartości parametrów](default-parameter-values.html) oraz [parametry nazwane](named-arguments.html), są kompilowane tak, aby zachować jak największą zgodność z Javą.
Scala posiada taki sam model kompilacji (oddzielna kompilacja, dynamiczne ładowanie klas) jak Java, dzięki czemu umożliwa korzystanie z tysięcy już istniejących, wysokiej klasy bibliotek.

## Do dzieła!

Przejdź do [kolejnej strony](basics.html) aby dowiedzieć się więcej.
