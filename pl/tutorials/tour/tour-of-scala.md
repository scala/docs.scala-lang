---
layout: tutorial
title: Wprowadzenie

disqus: true

tutorial: scala-tour
num: 1
outof: 33
language: pl
tutorial-next: unified-types
---

Scala jest nowoczesnym, wieloparadygmatowym językiem programowania zaprojektowanym do wyrażania powszechnych wzorców programistycznych w zwięzłym, eleganckim i bezpiecznie typowanym stylu. Scala płynnie integruje ze sobą cechy języków funkcyjnych i zorientowanych obiektowo.

## Scala jest zorientowana obiektowo ##
Scala jest czysto obiektowym językiem w tym sensie, że każda [wartość jest obiektem](unified-types.html). Typy oraz zachowania obiektów są opisane przez [klasy](classes.html) oraz [cechy](traits.html). Klasy są rozszerzane przez podtypowanie i elastyczny mechanizm [kompozycji domieszek](mixin-class-composition.html) jako zastępnik dla wielodziedziczenia.

## Scala jest funkcyjna ##
Scala jest też funkcyjnym językiem w tym sensie, że [każda funkcja jest wartością](unified-types.html). Scala dostarcza [lekką składnię](anonymous-function-syntax.html) do definiowana funkcji anonimowych, wspiera [funkcje wyższego rzędu](higher-order-functions.html), pozwala funkcjom by były [zagnieżdżone](nested-functions.html) oraz umożliwia [rozwijanie funkcji](currying.html). [Klasy przypadków](case-classes.html) oraz wbudowane wsparcie dla [dopasowania wzorców](pattern-matching.html) wprowadzają do Scali mechanizm typów algebraicznych, stosowany w wielu funkcyjnych językach programowania. [Obiekty singleton](singleton-objects) są wygodną metodą grupowania funkcji, które nie należą do żadnej klasy. 

Ponadto, mechanizm dopasowania wzorca w naturalny sposób rozszerza się do obsługi [przetwarzania danych w formacie XML](xml-processing.html) z pomocą [wzorców sekwencji ignorujących prawą stronę](regular-expression-patterns.html), z wykorzystaniem rozszerzeń [obiektów ekstraktorów](extractor-objects.html). W tym kontekście, [instrukcje for](sequence-comprehensions.html) są użyteczne w formułowaniu zapytań. Ta funkcjonalność sprawia, że Scala jest idealnym językiem do tworzenia aplikacji takich jak usługi sieciowe.

## Scala jest statycznie typowana ##
Scala posiada ekspresywny system typów, który zapewnia, że abstrakcje są używane w sposób zgodny oraz bezpieczny. W szczególności, system typów wspiera:

* [klasy generyczne](generic-classes.html)
* [adnotacje wariancji](variances.html)
* [górne](upper-type-bounds.html) oraz [dolne](lower-type-bounds.html) ograniczenia typów
* [klasy zagnieżdżone](inner-classes.html) i [typy abstrakcyjne](abstract-types.html) jako elementy obiektów
* [typy złożone](compound-types.html)
* [jawnie typowane samoreferencje](explicitly-typed-self-references.html)
* [parametry domniemane](implicit-parameters.html) i [konwersje niejawne](implicit-conversions.html)
* [metody polimorficzne](polymorphic-methods.html)

[Mechanizm lokalnej inferencji typów](local-type-inference.html) sprawia, że nie jest konieczne podawanie nadmiarowych informacji o typach w programie. W połączeniu, te funkcje języka pozwalają na bezpiecznie typowane ponowne wykorzystanie programistycznych abstrakcji.

## Scala jest rozszerzalna ##
W praktyce, rozwiązania specyficzne dla domeny wymagają odpowiednich rozszerzeń języka. Scala dostarcza unikalne mechanizmy, dzięki którym można łatwo dodawać nowe konstrukcje do języka w postaci bibliotek:

* każda metoda może być używana jako [operator infiksowy lub prefiksowy](operators.html)
* [domknięcia są konstruowane automatycznie zależnie od wymaganego typu](automatic-closures.html)

Powyższe mechanizmy pozwalają na definicję nowych rodzajów wyrażeń, bez potrzeby rozszerzania składni języka czy też wykorzystywania meta-programowania w postaci makr.

Scala jest zaprojektowana tak, aby współpracować dobrze ze środowiskiem uruchomieniowym JRE oraz językiem Java. Funkcje Javy takie jak [adnotacje](annotations.html) oraz typy generyczne posiadają swoje bezpośrednie odwzorowanie w Scali. Unikalne funkcje Scali, jak na przykład [domyślne wartości parametrów](default-parameter-values.html) oraz [nazwane parametry](named-parameters.html) są kompilowane w taki sposób, aby zachować jak największą zgodność z Javą. Scala ma także taki sam model kompilacji (oddzielna kompilacja, dynamiczne ładowanie klas) dzięki czemu umożliwia korzystanie z całego ekosystemu Javy.
