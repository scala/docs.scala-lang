---
layout: tour
title: Hierarchia typów
partof: scala-tour

num: 3
language: pl
next-page: classes
previous-page: basics
---

W Scali wszystkie wartości mają określony typ, włączając w to wartości numeryczne i funkcje.
Poniższy diagram ilustruje podzbiór hirarchii typów.

<a href="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg" alt="Scala Type Hierarchy"></a>

## Hierarchia Typów Scali ##

Typem bazowym dla wszystkich klas jest `Any`, jest on też nazywany typem górnym (top type).
Definiuje on uniwersalne metody takie jak `equals`, `hashCode` oraz `toString`.
`Any` posiada dwa bezpośrednie podtypy: `AnyVal` i `AnyRef`.

`AnyVal` reprezentuje typy wartości.
Żaden z tych typów nie może przyjąć wartości `null`.
Istnieje dziewięć predefiniowanych typów wartości: `Double`, `Float`, `Long`, `Int`, `Short`, `Byte`, `Char`, `Unit` oraz `Boolean`.
`Unit` to typ wartości, która nie niesie ze sobą żadnej znaczącej informacji.
Istnieje dokładnie jedna instancja typu `Unit` i jest zdefiniowana dosłownie jako: `()`.
Wszystkie funkcje muszą coś zwracać, dlatego w niektórych przypadkach trzeba użyć `Unit` do oznaczenia zwracanego typu.

`AnyRef` reprezentuje typy referencyjne.
Przez referencje mamy w tym przypadku na myśli wskaźniki do innych obiektów.
Wszystkie typy niebędące wartościami są zdefiniowane jako typy referencyjne.
Każdy typ zdefiniowany przez użytkownika jest podtypem `AnyRef`.
Jeżeli Scala użyta jest w kontekście środowiska uruchomieniowego Javy, to `AnyRef` odnosi się do `java.lang.Object`.

Poniższy przykład pokazuje, że łańcuchy znakowe, liczby całkowite, znaki, wartości logiczne oraz funkcje są obiektami tak samo jak każdy inny obiekt:

{% scalafiddle %}
```scala mdoc
val list: List[Any] = List(
  "Łancuch znaków",
  732,  // liczba całkowita
  'c',  // znak
  true, // wartość Boolowska
  () => "funkcja anonimowa zwracająca łańcuch znaków"
)

list.foreach(element => println(element))
```
{% endscalafiddle %}

Program deklaruje wartość `list` typu `List[Any]`.
Lista jest zainicjowana elementami różnego typu, ale będącymi podtypami `scala.Any` - dlatego można je umieścić na tej liście.

Wynik działania powyższego programu:

```
Łancuch znaków
732
c
true
<function>
```

## Rzutowanie typów

Typy wartości mogą być rzutowane w następujący sposób:

<a href="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg" alt="Scala Type Hierarchy"></a>

Dla przykładu:

```scala mdoc
val x: Long = 987654321
val y: Float = x  // 9.8765434E8 (w tym wypadku tracimy część precyzji)

val face: Char = '☺'
val number: Int = face  // 9786
```

Rzutowanie jest jednokierunkowe, następujący kod nie zadziała:

```
val x: Long = 987654321
val y: Float = x  // 9.8765434E8
val z: Long = y  // Błąd: Does not conform
```

Możliwe jest też rzutowanie referencji typu jego podtyp.
Zostanie to dokładniej omówione w kolejnych rozdziałach.

## Typy Nothing oraz Null

`Nothing` jest podtypem wszystkich typów, istnieje na samym dole hierarchii i jest nazywany typem dolnym (bottom type).
Nie istnieje żadna wartość typu `Nothing`.
Częstym przykładem użycia jest zasygnalizowanie stanów nieoznaczonych np. wyrzucony wyjątek, wyjście z programu, 
nieskończona pętla (ściślej mówiąc - jest to typ wyrażenia które nie ewaluuje na żadną wartość lub metoda, która nie zwraca wyniku). 

`Null` jest podtypem wszystkich typów referencyjnych (wszystkich podtypów `AnyRef`).
Ma pojedynczą wartosć identyfikowaną przez słowo kluczowe `null`.
`Null` przydaje się głównie do współpracy z innymi językami platformy JVM i nie powinien być praktycznie nigdy używany 
w kodzie w jęzku Scala.
W dalszej części przewodnika omówimy alternatywy dla `null`.
