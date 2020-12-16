---
layout: tour
title: Basics
partof: scala-tour
language: es

num: 2
next-page: unified-types
previous-page: tour-of-scala
---

En esta página, practicaremos conceptos básicos de Scala.

## Probando Scala en el navegador

Puedes ejecutar Scala en tu navegador con ScalaFiddle.

1. Ve a [https://scalafiddle.io](https://scalafiddle.io).
2. Escribe `println("Hello, world!")` en el panel a la izquierda.
3. Presiona el botón "Run". En el panel de la derecha aparecerá el resultado.

Así, de manera fácil y sin preparación, puedes probar fragmentos de código Scala.

Muchos ejemplos de código en esta documentación están integrados con ScalaFiddle, y así puedes probarlos directamente solo con pulsar el botón "Run".

## Expresiones

Las expresiones son sentencias computables.

```scala mdoc
1 + 1
```

Se puede ver el resultado de evaluar expresiones usando `println`.

{% scalafiddle %}
```scala mdoc
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

## Valores

Se puede dar un nombre al resultado de una expresión usando la palabra reservada `val`.

```scala mdoc
val x = 1 + 1
println(x) // 2
```

Los resultados con nombre, como `x` en el ejemplo, son llamados valores. Referenciar un valor no lo vuelve a computar.

Los valores no pueden ser reasignados.

```scala mdoc:fail
x = 3  // This does not compile.
```

Scala es capaz de inferir el tipo de un valor. Aun así, también se puede indicar el tipo usando una anotación:

```scala mdoc:nest
val x: Int = 1 + 1
```

Nótese que la anotación del tipo `Int` sigue al identificador `x` de la variable, separado por dos puntos `:`.

## Variables

Una variable es como un valor, excepto que a una variable se le puede re-asignar un valor después de declararla. Una variable se declara con la palabra reservada `var`.

```scala mdoc:nest
var x = 1 + 1
x = 3 // This compiles because "x" is declared with the "var" keyword.
println(x * x) // 9
```

Como con los valores, si se quiere se puede especificar el tipo de una variable mutable:

```scala mdoc:nest
var x: Int = 1 + 1
```

## Bloques

Se pueden combinar expresiones rodeándolas con `{}` . A esto le llamamos un bloque.

El resultado de la última expresión del bloque es también el resultado total del bloque.

```scala mdoc
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## Funciones

Una función es una expresión que acepta parámetros.

Una función se puede declarar anónima, sin nombre. Por ejemplo, ésta es una función que acepta un número entero `x`, y devuelve el resultado de incrementarlo:

```scala mdoc
(x: Int) => x + 1
```

La lista de parámetros de la función está a la izquierda de la flecha `=>`, y a su derecha está el cuerpo de la función.

También podemos asignarle un nombre a la función.

{% scalafiddle %}
```scala mdoc
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

Las funciones pueden tomar varios parámetros.

{% scalafiddle %}
```scala mdoc
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

O ninguno.

```scala mdoc
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## Métodos

Los métodos se parecen y comportan casi como a las funciones, pero se diferencian en dos aspectos clave: 

Un método se define con la palabra reservada `def`, seguida por el nombre del método, la lista de parámetros, el tipo de valores que el método devuelve, y el cuerpo del método.

{% scalafiddle %}
```scala mdoc:nest
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Observe que el tipo de retorno se declara _después_ de la lista de parámetros, y separado con dos puntos, p.ej. `: Int`.

Un método puede tener varias listas de parámetros.

{% scalafiddle %}
```scala mdoc
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

O ninguna lista de parámetros.

```scala mdoc
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```

Hay otras diferencias, pero para simplificar, podemos pensar que son similares a las funciones.

Los métodos también pueden tener expresiones de varias lineas.

{% scalafiddle %}
```scala mdoc
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endscalafiddle %}

La ultima expresión en el cuerpo del método es el valor de retorno del mismo.
(Scala tiene una palabra reservada `return`, pero se usa raramente y no se aconseja usarla)

## Clases

Una clase se define con la palabra reservada `class`, seguida del nombre, y la lista de parámetros del constructor.

```scala mdoc
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```

El método `greet` tiene un tipo de retorno `Unit`, que indica que el método no tiene nada significativo que devolver. Esto es similar al tipo `void` en C, C++, o Java. La diferencia con estos lenguajes es que en Scala toda expresión debe devolver un valor. Por ello, se usa un tipo `Unit` que tiene con un solo valor que se escribe `()` y no lleva información.

Se puede crear una instancia de una clase con la palabra reservada *new*.

```scala mdoc
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

Las clases se tratan en profundidad [más adelante](classes.html).

## Case Classes

Hay un tipo especial de clases en Scala, las llamadas "case" classes. Por defecto, las instancias de una case class  son inmutables, y se comparan con otras solo por los valores que contienen en cada campo.
Una case class se define con las palabras reservadas  `case class`:

```scala mdoc
case class Point(x: Int, y: Int)
```

Se puede crear una instancia de una `case class`, sin usar la palabra reservada `new`.  

```scala mdoc
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

Y son comparadas por valor.

```scala mdoc
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

Hay mucho más sobre las case classes que queremos presentar, y estamos convencidos de que te vas a enamorar de ellas. Se tratan con más detalle [mas adelante](case-classes.html).

## Objetos

Los objetos son instancias de una sola clase de su propia definición. Puedes pensar en ellos como _singleton_ de sus propias clases.

Un objeto se define usando la palabra reservada `object`.

```scala mdoc
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

Para acceder al objeto, lo referencias por su nombre.

```scala mdoc
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

Cubriremos los objetos en profundidad [más adelante](singleton-objects.html).

## Traits

Los traits son tipos que contienen campos y métodos. Se pueden combinar múltiples traits.

Un trait se define usando la palabra reservada `trait`.

```scala mdoc:nest
trait Greeter {
  def greet(name: String): Unit
}
```

Un `trait` también puede definir un método, o un valor, con una implementación por defecto.

{% scalafiddle %}
```scala mdoc:reset
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

Un `trait` también puede extender otros traits, usando la palabra clave `extends`. Asimismo, en un `trait` se puede redefinir la implementación de un método heredado, usando la palabra reservada `override`.

```scala mdoc
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

Los `traits` se tratan con detalle [en otra página](traits.html).

## Método principal (Main Method)

El método principal (main) es el punto donde comienza la ejecución de un programa en Scala. La máquina virtual de java (_Java Virtual Machine_ or JVM) requiere, para ejecutar un código Scala, que éste tenga un método principal llamado `main` cuyo único parámetro sea un arrray de Strings.

Usando un objeto, puedes definir el método principal de la siguiente forma:

```scala mdoc
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
