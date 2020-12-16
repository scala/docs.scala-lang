---
layout: tour
title: Lokalna inferencja typów
partof: scala-tour

num: 30
language: pl
next-page: operators
previous-page: polymorphic-methods
---

Scala posiada wbudowany mechanizm inferencji typów, który pozwala programiście pominąć pewne informacje o typach. Przykładowo zazwyczaj nie wymaga się podawania typów zmiennych, gdyż kompilator sam jest w stanie go wydedukować na podstawie typu wyrażenia inicjalizacji zmiennej. Także typy zwracane przez metody mogą być często pominięte, ponieważ odpowiadają one typowi ciała metody, który jest inferowany przez kompilator.

Oto przykład:

```scala mdoc
object InferenceTest1 extends App {
  val x = 1 + 2 * 3         // typem x jest Int
  val y = x.toString()      // typem y jest String
  def succ(x: Int) = x + 1  // metoda succ zwraca wartości typu Int
}
```

Dla metod rekurencyjnych kompilator nie jest w stanie określić zwracanego typu. Oto przykład programu, który zakończy się niepowodzeniem kompilacji z tego powodu:

```scala mdoc:fail
object InferenceTest2 {
  def fac(n: Int) = if (n == 0) 1 else n * fac(n - 1)
}
```

Nie jest też konieczne określenie parametrów typu, kiedy są wywoływane [metody polimorficzne](polymorphic-methods.html) lub kiedy tworzymy [klasy generyczne](generic-classes.html). Kompilator Scali sam określi typ brakujących parametrów typów na podstawie kontekstu oraz typów właściwych parametrów metody/konstruktora.

Oto ilustrujący to przykład:

```
case class MyPair[A, B](x: A, y: B)
object InferenceTest3 extends App {
  def id[T](x: T) = x
  val p = MyPair(1, "scala") // typ: MyPair[Int, String]
  val q = id(1)              // typ: Int
}
```

Dwie ostatnie linie tego programu są równoważne poniższemu kodu, gdzie wszystkie inferowane typy są określone jawnie:

```
val x: MyPair[Int, String] = MyPair[Int, String](1, "scala")
val y: Int = id[Int](1)
```

W niektórych sytuacjach poleganie na inferencji typów w Scali może być niebezpieczne, tak jak demonstruje to poniższy program:

```scala mdoc:fail
object InferenceTest4 {
  var obj = null
  obj = new Object()
}
```

Ten program się nie skompiluje, ponieważ typ określony dla zmiennej `obj` jest `Null`. Ponieważ jedyną wartością tego typu jest `null`, nie jest możliwe przypisanie tej zmiennej innej wartości.
