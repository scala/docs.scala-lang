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
2. Escribe `println("Hello, world!")` en el panel a la izquierda.
3. Presiona el botón "Run". En el panel de la derecha aparecerá el resultado.

Así, de manera fácil y sin preparación, puedes probar fragmentos de código Scala.

Many of the code examples in this documentation are also integrated with ScalaFiddle, so you
can directly experiment with them simply by clicking the Run-button.
Muchos ejemplos de código en esta documentación están integrados con ScalaFiddle, y así puedes probarlos directamente solo con pulsar el botón "Run".

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

Se puede dar un nombre al resultado de una expresión usando la palabra reservada `val`.

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

Una variable es como un valor, excepto que a una variable se le puede re-asignar un valor después de declararla. Una variable se declara con la palabra reservada `var`.

```tut
var x = 1 + 1
x = 3 // This compiles because "x" is declared with the "var" keyword.
println(x * x) // 9
```

Como con los valores, si se quiere se puede especificar el tipo de una variable mutable:

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

Una función es una expresión que acepta parámetros.

Se pueden definir funciones anónimas, por ejemplo, una que retorne x + 1 para x entero:

```tut
(x: Int) => x + 1
```

La lista de parámetros de la función está a la izquierda de la flecha `=>`, y a su derecha está el cuerpo de la función.

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

Los métodos se parecen y comportan casi como a las funciones, pero se diferencian en dos aspectos clave: 

Un método se define con la palabra reservada `def`, seguida por el nombre del método, la lista de parámetros, el tipo de valores que el método devuelve, y el cuerpo del método.

{% scalafiddle %}
```tut
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Observe que el tipo de retorno se declara _después_ de la lista de parámetros, y separado con dos puntos, e.g. `: Int`.

Un método puede tener varias listas de parámetros

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
(Scala tiene una palabra reservada `return`, pero se usa raramente, y no se aconseja usarla)

## Clases

Una clase se define con la palabra reservada `class`, seguida del nombre, y la lista de parámetros del constructor.

```tut
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```

El método `greet` tiene un tipo de retorno `Unit`, que indica que el método no tiene nada significativo que devolver. Esto es similar al tipo `void` en C, C++, o Java. La diferencia con estos lenguajes es que, dado que en Scala toda  expresión debe devuelvor un valor, se usa un tipo `Unit`, con un solo valor, que se escribe `()` y no lleva información.

Se puede crear una instancia de una clase con la palabra reservada *new*.

```tut
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

Las clases se tratan en profundidad [mas adelante](classes.html).

## Case Classes

Hay un tipo especial de clases en Scala, las llamadas "case" classes. Por defecto, las instancias de una case class  son inmutables, y se comparan con otras solo por los valores que contienen en cada campo.
Una case class se define con las palabras reservadas  `case class`:

```tut
case class Point(x: Int, y: Int)
```

Se puede crear una instancia de una `case class`, sin usar la palabra reservada `new`.  

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

Hay mucho mas sobre las case classes que queremos presentar, y estamos convencidos de que te vas a enamorar de ellas. Se tratan con más detalle [mas adelante](case-classes.html).

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

Un trait se define usando la palabra reservada `trait`.

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

Los `traits` se tratan con detalle [en otra página](traits.html).

## Método principal (Main Method)

El método principal (main) es el punto donde comienza la ejecución de un programa en Scala. La máquina virtual de java (_Java Virtual Machine_ or JVM) requiere, para ejecutar un código Scala, que éste tenga un método principal llamado `main` cuyo único parámetro sea un arrray de Strings.

Usando un objeto, puedes definir el método principal de la siguiente forma:

```tut
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
