---
layout: tour
title: Traits
partof: scala-tour

num: 4
next-page: tuples
previous-page: classes
language: pt-br
---

Similar a interfaces em Java, traits são utilizadas para definir tipos de objetos apenas especificando as assinaturas dos métodos suportados. Como em Java 8, Scala permite que traits sejam parcialmente implementadas; ex. é possível definir uma implementação padrão para alguns métodos. Diferentemente de classes, traits não precisam ter construtores com parâmetros.
Veja o exemplo a seguir:
 
```scala mdoc
trait Similaridade {
  def eSemelhante(x: Any): Boolean
  def naoESemelhante(x: Any): Boolean = !eSemelhante(x)
}
```
 
Tal trait consiste em dois métodos `eSemelhante` e `naoESemelhante`. Equanto `eSemelhante` não fornece um método com implementação concreta (que é semelhante ao abstract na linguagem Java), o método `naoESemelhante` define um implementação concreta. Consequentemente, classes que integram essa trait só precisam fornecer uma implementação concreta para o método `eSemelhante`. O comportamento para `naoESemelhante` é herdado diretamente da trait. Traits são tipicamente integradas a uma [classe](classes.html) (ou outras traits) utilizando a [composição mesclada de classes](mixin-class-composition.html):
 
```scala mdoc
class Point(xc: Int, yc: Int) extends Similaridade {
  var x: Int = xc
  var y: Int = yc
  def eSemelhante(obj: Any) =
    obj.isInstanceOf[Point] &&
    obj.asInstanceOf[Point].x == x
}
object TraitsTest extends App {
  val p1 = new Point(2, 3)
  val p2 = new Point(2, 4)
  val p3 = new Point(3, 3)
  val p4 = new Point(2, 3)
  println(p1.eSemelhante(p2))
  println(p1.eSemelhante(p3))
  // Ponto.naoESemelhante foi definido na classe Similaridade
  println(p1.naoESemelhante(2))
  println(p1.naoESemelhante(p4))
}
```
 
Aqui a saída do programa:

```
true
false
true
false
```
