---
layout: tour
title: Domyślne wartości parametrów
partof: scala-tour

num: 5
language: pl
next-page: named-arguments
previous-page: classes
---

Scala zezwala na określenie domyślnych wartości dla parametrów, co pozwala wyrażeniu wywołującemu ją na pominięcie tych parametrów.

W Javie powszechną praktyką jest definiowanie implementacji metod, które służa wyłącznie określeniu domyślnych wartości dla pewnych parametrów dużych metod. Najczęściej stosuje się to w konstruktorach:

```java
public class HashMap<K,V> {
  public HashMap(Map<? extends K,? extends V> m);
  /** Utwórz mapę z domyślną pojemnością (16)
    * i loadFactor (0.75)
    */
  public HashMap();
  /** Utwórz mapę z domyślnym loadFactor (0.75) */
  public HashMap(int initialCapacity);
  public HashMap(int initialCapacity, float loadFactor);
}
```

Mamy tutaj do czynienia tylko z dwoma konstruktorami. Pierwszy przyjmuje inną mapę, a drugi wymaga podania pojemności i load factor. Trzeci oraz czwarty konstruktor pozwala użytkownikom `HashMap` na tworzenie instancji z domyślnymi wartościami tych parametrów, które są prawdopodobnie dobre w większości przypadków.

Bardziej problematyczne jest to, że domyślne wartości zapisane są zarówno w Javadoc oraz w kodzie. Można łatwo zapomnieć o odpowiedniej aktualizacji tych wartości. Dlatego powszechnym wzorcem jest utworzenie publicznych stałych, których wartości pojawią się w Javadoc:

```java
public class HashMap<K,V> {
  public static final int DEFAULT_CAPACITY = 16;
  public static final float DEFAULT_LOAD_FACTOR = 0.75;

  public HashMap(Map<? extends K,? extends V> m);
  /** Utwórz mapę z domyślną pojemnością (16)
    * i loadFactor (0.75)
    */
  public HashMap();
  /** Utwórz mapę z domyślnym loadFactor (0.75) */
  public HashMap(int initialCapacity);
  public HashMap(int initialCapacity, float loadFactor);
}
```

Mimo że powstrzymuje to nas od powtarzania się, to podejście nie jest zbyt wyraziste.

Scala wprowadza bezpośrednie wsparcie dla domyślnych parametrów:

```scala mdoc
class HashMap[K,V](initialCapacity: Int = 16, loadFactor: Float = 0.75f) {
}

// Używa domyślnych wartości
val m1 = new HashMap[String,Int]

// initialCapacity 20, domyślny loadFactor
val m2 = new HashMap[String,Int](20)

// nadpisujemy oba
val m3 = new HashMap[String,Int](20,0.8f)

// nadpisujemy tylko loadFactor przez argumenty nazwane
val m4 = new HashMap[String,Int](loadFactor = 0.8f)
```

Należy zwrócić uwagę, w jaki sposób możemy wykorzystać *dowolną* domyślną wartość poprzez użycie [parametrów nazwanych](named-arguments.html).
