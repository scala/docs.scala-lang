---
layout: tour
title: Varianzas
partof: scala-tour

num: 31
language: es

next-page: implicit-conversions
previous-page: unified-types
---

Scala soporta anotaciones de varianza para parámetros de tipo para [clases genéricas](generic-classes.html). A diferencia de Java 5, las anotaciones de varianza pueden ser agregadas cuando una abstracción de clase es definidia, mientras que en Java 5, las anotaciones de varianza son dadas por los clientes cuando una albstracción de clase es usada.

En el artículo sobre clases genéricas dimos un ejemplo de una pila mutable. Explicamos que el tipo definido por la clase `Stack[T]` es objeto de subtipos invariantes con respecto al parámetro de tipo. Esto puede restringir el reuso de la abstracción (la clase). Ahora derivaremos una implementación funcional (es decir, inmutable) para pilas que no tienen esta restricción. Nótese que este es un ejemplo avanzado que combina el uso de [métodos polimórficos](polymorphic-methods.html), [límites de tipado inferiores](lower-type-bounds.html), y anotaciones de parámetros de tipo covariante de una forma no trivial. Además hacemos uso de [clases internas](inner-classes.html) para encadenar los elementos de la pila sin enlaces explícitos.

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

La anotación `+T` declara que el tipo `T` sea utilizado solamente en posiciones covariantes. De forma similar, `-T` declara que `T` sea usado en posiciones contravariantes. Para parámetros de tipo covariantes obtenemos una relación de subtipo covariante con respecto al parámetro de tipo. Para nuestro ejemplo, esto significa que `Stack[T]` es un subtipo de `Stack[S]` si `T` es un subtipo de `S`. Lo contrario se cumple para parámetros de tipo que son etiquetados con un signo `-`.

Para el ejemplo de la pila deberíamos haber usado el parámetro de tipo covariante `T` en una posición contravariante para que nos sea posible definir el método `push`. Ya que deseamos que existan subtipos covariantes para las pilas, utilizamos un truco y utilizamos un parámetro de tipo abstracto en el método `push`. De esta forma obtenemos un método polimórfico en el cual utilizamos el tipo del elemento `T` como límite inferior de la variable de tipo de `push`. Esto tiene el efecto de sincronizar la varianza de `T` con su declaración como un parámetro de tipo covariante. Ahora las pilas son covariantes, y nuestra solución permite por ejemplo apilar un String en una pila de enteros (Int). El resultado será una pila de tipo `Stack[Any]`; por lo tanto solo si el resultado es utilizado en un contexto donde se esperan pilas de enteros se detectará un error. De otra forma, simplemente se obtiene una pila con un tipo más general.
