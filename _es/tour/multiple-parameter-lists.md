---
layout: tour
title: Currying
partof: scala-tour

num: 15
language: es

next-page: automatic-closures
previous-page: nested-functions
---

_Nota de traducción: Currying es una técnica de programación funcional nombrada en honor al matemático y lógico Haskell Curry. Es por eso que no se intentará hacer ninguna traducción sobre el término Currying. Entiéndase este como una acción, técnica base de PF. Como una nota al paso, el lenguaje de programación Haskell debe su nombre a este eximio matemático._

Los métodos pueden definir múltiples listas de parámetros. Cuando un método es invocado con un número menor de listas de parámetros, en su lugar se devolverá una función que toma las listas faltantes como sus argumentos.

### Ejemplos

A continuación hay un ejemplo, tal y como se define en el trait `TraversableOnce` en el API de colecciones de Scala:

```scala mdoc:fail
def foldLeft[B](z: B)(op: (B, A) => B): B
```

`foldLeft` aplica una función (que recibe dos parámetros) `op` a un valor inicial `z` y todos los elementos de esta colección, de izquierda a derecha. A continuación se muestra un ejemplo de su uso.

Comenzando con un valor inicial 0, `foldLeft` aplica la función `(m, n) => m + n` a cada uno de los elementos de la lista y al valor acumulado previo.

{% scalafiddle %}
```scala mdoc
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
println(res) // 55
```
{% endscalafiddle %}


A continuación se muestra otro ejemplo:

{% scalafiddle %}
```scala mdoc
    object CurryTest extends App {

      def filter(xs: List[Int], p: Int => Boolean): List[Int] =
        if (xs.isEmpty) xs
        else if (p(xs.head)) xs.head :: filter(xs.tail, p)
        else filter(xs.tail, p)

      def modN(n: Int)(x: Int) = ((x % n) == 0)

      val nums = List(1, 2, 3, 4, 5, 6, 7, 8)
      println(filter(nums, modN(2)))
      println(filter(nums, modN(3)))
    }
```
{% endscalafiddle %}

_Nota: el método `modN` está parcialmente aplicado en las dos llamadas a `filter`; esto significa que solo su primer argumento es realmente aplicado. El término `modN(2)` devuelve una función de tipo `Int => Boolean` y es por eso un posible candidato para el segundo argumento de la función `filter`._

Aquí se muestra la salida del programa anterior:

```scala mdoc
List(2,4,6,8)
List(3,6)
```

### Casos de uso

Casos de uso sugeridos para múltiples listas de parámetros incluyen:

#### Inferencia de tipos

En Scala, la inferencia de tipos se realiza parámetro a parámetro.
Suponer que se dispone del siguiente método:

```scala mdoc
def foldLeft1[A, B](as: List[A], b0: B, op: (B, A) => B) = ???
```

Si se invoca de la siguiente manera, se puede comprobar que no compila correctamente:

```scala mdoc:fail
def notPossible = foldLeft1(numbers, 0, _ + _)
```

Debes invocarlo de alguna de las maneras propuestas a continuación:

```scala mdoc
def firstWay = foldLeft1[Int, Int](numbers, 0, _ + _)
def secondWay = foldLeft1(numbers, 0, (a: Int, b: Int) => a + b)
```

Esto se debe a que Scala no será capaz de inferir el tipo de la función `_ + _`, como está aún infiriendo `A` y `B`.
Moviéndo el parámetro `op` a su propia lista de parámetros, los tipos de `A` y `B` son inferidos en la primera lista de parámetros.
Una vez se han inferido sus tipos, estos están disponibles para la segunda lista de parámetros y `_ + _ ` podrá casar con los tipos inferidos `(Int, Int) => Int`

```scala mdoc
def foldLeft2[A, B](as: List[A], b0: B)(op: (B, A) => B) = ???
def possible = foldLeft2(numbers, 0)(_ + _)
```

Esta definición no necesita de ninguna pista adicional y puede inferir todos los tipos de los parámetros.


#### Parámetros implícitos

Para especificar solamente ciertos parámetros como [`implicit`](https://docs.scala-lang.org/tour/implicit-parameters.html), ellos deben ser colocados en su propia lista de parámetros implícitos (`implicit`).

Un ejemplo de esto se muestra a continuación:

```scala mdoc
def execute(arg: Int)(implicit ec: scala.concurrent.ExecutionContext) = ???
```

#### Aplicación parcial

Cuando un método es invocado con menos parámetros que los que están declarados en la definición del método, esto generará una función que toma los parámetros faltantes como argumentos. Esto se conoce formalmente como [aplicación parcial](https://en.wikipedia.org/wiki/Partial_application).

Por ejemplo,

```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]()) _

val squares = numberFunc((xs, x) => xs :+ x*x)
println(squares) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs :+ x*x*x)
println(cubes)  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```
