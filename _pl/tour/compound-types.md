---
layout: tour
title: Typy złożone
partof: scala-tour

num: 25
language: pl
next-page: self-types
previous-page: abstract-type-members
---

Czasami konieczne jest wyrażenie, że dany typ jest podtypem kilku innych typów. W Scali wyraża się to za pomocą *typów złożonych*, które są częścią wspólną typów obiektów.

Załóżmy, że mamy dwie cechy `Cloneable` i `Resetable`:

```scala mdoc
trait Cloneable extends java.lang.Cloneable {
  override def clone(): Cloneable = { 
    super.clone().asInstanceOf[Cloneable]
  }
}
trait Resetable {
  def reset: Unit
}
```

Teraz chcielibyśmy napisać funkcję `cloneAndReset`, która przyjmuje obiekt, klonuje go i resetuje oryginalny obiekt:

```
def cloneAndReset(obj: ?): Cloneable = {
  val cloned = obj.clone()
  obj.reset
  cloned
}
```

Pojawia się pytanie, jakiego typu powinen być parametr `obj`. Jeżeli jest to `Cloneable`, to dany obiekt może zostać sklonowany, ale nie zresetowany. W przypadku gdy jest to to `Resetable`, możemy go zresetować, ale nie mamy dostępu do operacji klonowania. Aby uniknąć rzutowania typów w tej sytuacji, możemy określić typ `obj` tak, aby był jednocześnie `Cloneable` i `Resetable`. Ten złożony typ jest zapisywany w taki sposób: `Cloneable with Resetable`.

Zaktualizowana funkcja:

```
def cloneAndReset(obj: Cloneable with Resetable): Cloneable = {
  //...
}
```

Typy złożone mogą składać się z kilku typów obiektów i mogą mieć tylko jedno wyrafinowanie, które może być użyte do zawężenia sygnatury istniejących elementów obiektu.
Przyjmują one postać: `A with B with C ... { wyrafinowanie }`

Przykład użycia wyrafinowania typów jest pokazany na stronie o [typach abstrakcyjnych](abstract-type-members.html).
