---
layout: tour
title: Basics

discourse: false

partof: scala-tour
language: es

num: 2
next-page: unified-types
previous-page: tour-of-scala
---

En esta página, cubriremos lo básico de Scala.

## Probando Scala en el navegador

Puedes ejecutar Scala en tu navegador con ScalaFiddle.

1. Ve a [https://scalafiddle.io](https://scalafiddle.io).
2. Pega `println("Hello, world!")` en el panel izquierdo.
3. Presiona el botón de "Run". El resultado aparece en el panel de la derecha.

Esta es una forma simple y con cero configuración de experimentar con piezas de código en Scala.

Many of the code examples in this documentation are also integrated with ScalaFiddle, so you
can directly experiment with them simply by clicking the Run-button.
Muchos de los ejemplos de código en esta documentación están integrados también con ScalaFiddle, para que puedas experimentar directamente con ellos simplemente presionando el botón de "Run".

## Expresiones

En Scala todo es una expresión (cada sentencia "devuelve" un valor).

```tut
1 + 1
```

Se puede ver el resultado de evaluar expresiones usando `println`.

{% scalafiddle %}
```tut
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

## Valores

Se puede nombrar el resultado de expresiones con la palabra clave `val`.

```tut
val x = 1 + 1
println(x) // 2
```

Los resultados con nombre, como `x` en el ejemplo, son llamados valores. Referenciar un valor no lo vuelve a computar.

Los valores no pueden ser reasignados.

```tut:fail
x = 3 // This does not compile.
```

Los tipos de los valores pueden ser inferidos, pero también se pueden anotar explicitamente de la siguiente forma:

```tut
val x: Int = 1 + 1
```

Noten como la declaración de tipo `Int` va después del identificador `x`. También necesitas un `:`.

## Variables

Las variables son como los valores, excepto que no es posible re-asignarlos. Las variables se definen con la palabra clave `var`.

```tut
var x = 1 + 1
x = 3 // This compiles because "x" is declared with the "var" keyword.
println(x * x) // 9
```

Igual que con los valores, si queremos se puede especificar el tipo:

```tut
var x: Int = 1 + 1
```

## Bloques

Se pueden combinar expresiones rodeándolas con `{}` . A esto le llamamos un bloque.

El resultado de la ultima expresión del bloque es también el resultado total del bloque.

```tut
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## Funciones

Las funciones son expresiones que reciben parámetros.

Se pueden definir funciones anónimas, por ejemplo, una que retorne x + 1 para x entero:

```tut
(x: Int) => x + 1
```

A la izquierda de => esta la lista de parámetros. A la derecha esta el cuerpo de la función

También podemos asignarle un nombre a la función.

{% scalafiddle %}
```tut
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

Las funciones pueden tomar muchos parámetros.

{% scalafiddle %}
```tut
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

O ninguno.

```tut
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## Métodos

Los métodos se parecen y se comportan de forma muy similar a las funciones, pero hay un par de diferencias clave entre ellos.

Los métodos se definen con la palabra clave `def`, seguida por un nombre, una lista de parámetros, un tipo de retorno, y el cuerpo del método.

{% scalafiddle %}
```tut
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Notar como el tipo de retorno es declarado _después_ de la lista de parámetros y con dos puntos `: Int`.

Los métodos pueden tener mutiles listas de parámetros.

{% scalafiddle %}
```tut
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

O ninguna lista de parametros.

```tut
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```

Hay otras diferencias, pero para simplificar, podemos pensar que son similares a las funciones.

Los métodos también pueden tener expresiones de varias lineas.

```tut
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
```

La ultima expresión en el cuerpo del método es el valor de retorno del mismo.
(Scala tiene la palabra clave `return` pero raramente se usa)

## Clases

Se puede definir clases con la palabra clave `class` seguida del nombre y los parámetros del constructor.

```tut
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```

El tipo de retorno del método `greet` es `Unit`, que dice que no hay nada significativo que retornar. Se usa de forma similar al `void` de Java y C (Con la diferencia de que como toda expresión en Scala debe retornar un valor, existe un valor singleton para el tipo Unit que se escribe () y no lleva información )

Puedes crear una instancia de una clase con la palabra clave *new*.

```tut
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

Cubriremos las clases en profundidad [mas adelante](classes.html).

## Case Classes

Scala tiene un tipo especial de clases llamadas "case" classes. Por defecto, las case classes son inmutables y son comparadas por valor.
Las case classes se definen usando las palabras clave `case class`.

```tut
case class Point(x: Int, y: Int)
```

Se pueden instanciar sin necesidad de usar la palabra clave `new`.

```tut
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

Y son comparadas por valor.

```tut
if (point == anotherPoint) {
  println(point + " and " + anotherPoint + " are the same.")
} else {
  println(point + " and " + anotherPoint + " are different.")
} // Point(1,2) and Point(1,2) are the same.

if (point == yetAnotherPoint) {
  println(point + " and " + yetAnotherPoint + " are the same.")
} else {
  println(point + " and " + yetAnotherPoint + " are different.")
} // Point(1,2) and Point(2,2) are different.
```

Hay mucho mas sobre las case classes que queremos presentar, y estamos convencidos de que te vas a enamorar de ellas. Las cubriremos en profundidad [mas adelante](case-classes.html).

## Objetos

Los objetos son instancias de una sola clase de su propia definición. Puedes pensar en ellos como singleton de sus propias clases

Puedes definir objectos con la palabra clave `object`.

```tut
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

Para acceder al objeto, lo referencias por su nombre.

```tut
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

Cubriremos los objetos en profundidad [mas adelante](singleton-objects.html).

## Traits

Los traits son tipos que contienen campos y métodos. Se pueden combinar múltiples traits.

Los traits se definen con la palabra clave `trait`.

```tut
trait Greeter {
  def greet(name: String): Unit
}
```

Los traits pueden también tener implementación por defecto.

{% scalafiddle %}
```tut
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

También puedes extender traits con la palabra clave `extends` y sobrescribir una implementación con la palabra clave `override` .

```tut
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter {
  override def greet(name: String): Unit = {
    println(prefix + name + postfix)
  }
}

val greeter = new DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = new CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```
{% endscalafiddle %}

Aquí, `DefaultGreeter` extiende un solo trait, pero puede extender múltiples traits.

Cubriremos los traits en profundidad [mas adelante](traits.html).

## Método principal (Main Method)

El método principal (main) es el punto de entrada de un programa. La maquina virtual de java (JVM) requiere que el método principal sea llamado `main` y que tome un solo argumento: un arrray de Strings.

Usando un objeto, puedes definir el método principal de la siguiente forma:

```tut
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
