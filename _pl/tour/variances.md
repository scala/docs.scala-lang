---
layout: tour
title: Wariancje
partof: scala-tour

num: 20
language: pl
next-page: upper-type-bounds
previous-page: generic-classes
---

Scala wspiera adnotacje wariancji parametrów typów [klas generycznych](generic-classes.html). W porównaniu do Javy adnotacje wariancji mogą zostać dodane podczas definiowania abstrakcji klasy, gdy w Javie adnotacje wariancji są podane przez użytkowników tych klas.

Na stronie o [klasach generycznych](generic-classes.html) omówiliśmy przykład zmiennego stosu. Wyjaśniliśmy, że typ definiowany przez klasę `Stack[T]` jest poddany niezmiennemu podtypowaniu w stosunku do parametru typu. Może to ograniczyć możliwość ponownego wykorzystania abstrakcji tej klasy. Spróbujemy teraz opracować funkcyjną (tzn. niemutowalną) implementację dla stosów, które nie posiadają tego ograniczenia. Warto zwrócić uwagę, że jest to zaawansowany przykład łączący w sobie zastosowanie [funkcji polimorficznych](polymorphic-methods.html), [dolnych ograniczeń typu](lower-type-bounds.html) oraz kowariantnych adnotacji parametru typu. Dodatkowo stosujemy też [klasy wewnętrzne](inner-classes.html), aby połączyć ze sobą elementy stosu bez jawnych powiązań.

```scala mdoc
class Stack[+T] {
  def push[S >: T](elem: S): Stack[S] = new Stack[S] {
    override def top: S = elem
    override def pop: Stack[S] = Stack.this
    override def toString: String =
      elem.toString + " " + Stack.this.toString
  }
  def top: T = sys.error("no element on stack")
  def pop: Stack[T] = sys.error("no element on stack")
  override def toString: String = ""
}

object VariancesTest extends App {
  var s: Stack[Any] = new Stack().push("hello")
  s = s.push(new Object())
  s = s.push(7)
  println(s)
}
```

Adnotacja `+T` określa typ `T` tak, aby mógł być zastosowany wyłącznie w pozycji kowariantnej. Podobnie `-T` deklaruje `T` w taki sposób, że może być użyty tylko w pozycji kontrawariantnej. Dla kowariantnych parametrów typu uzyskujemy kowariantną relację podtypowania w stosunku do tego parametru typu. W naszym przykładzie oznacza to, że `Stack[T]` jest podtypem `Stack[S]` jeżeli `T` jest podtypem `S`. Odwrotnie relacja jest zachowana dla parametrów typu określonych przez `-`.

Dla przykładu ze stosem chcielibyśmy użyć kowariantnego parametru typu `T` w kontrawariantnej pozycji, aby móc zdefiniować metodę `push`. Ponieważ chcemy uzyskać kowariantne podtypowanie dla stosów, użyjemy sposobu polegającego na abstrahowaniu parametru typu w metodzie `push`. Wynikiem tego jest metoda polimorficzna, w której element typu `T` jest wykorzystany jako ograniczenie dolne zmiennej typu metody `push`. Dzięki temu wariancja parametru `T` staje się zsynchronizowana z jej deklaracją jako typ kowariantny. Teraz stos jest kowariantny, ale nasze rozwiązanie pozwala na przykładowo dodanie łańcucha znaków do stosu liczb całkowitych. Wynikiem takiej operacji będzie stos typu `Stack[Any]`, więc jeżeli ma on być zastosowany w kontekście, gdzie spodziewamy się stosu liczb całkowitych, zostanie wykryty błąd. W innym przypadku uzyskamy stos o bardziej uogólnionym typie elementów.
