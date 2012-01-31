---
layout: overview
title: Tutorial de Scala para programadores Java

disqus: true
---

Por Michel Schinz y Philipp Haller
Traducción y arreglos Santiago Basulto

Comentarios:
   * No es necesario un archivo por clase
   * Forma de utilizar funcional con interfaces en Java
   * Comparación de funciones anónimas con clases anónimas

## Introducción

Este documento provee una rápida introducción al lenguae Scala como también a su compilador. Está pensado para personas que ya poseen cierta experiencia en programación y quieren una vista rápida de lo que pueden hacer con Scala. Se asume como un conocimiento básico de programación orientada a objetos, especialmente en Java.

## Un primer ejemplo

Como primer ejemplo, usaremos el programa *Hola mundo* estandar. No es muy fascinante, pero de esta manera resulta fácil demostrar el uso de herramientas de Scala sin saber demasiado acerca del lenguaje. Veamos como luce:

    object HolaMundo {
      def main(args: Array[String]) {
        println("Hola, mundo!")
      }
    }

La estructura de este programa debería ser familiar para programadores Java: consiste de un método llamado `main` que toma los argumentos de la linea de comando (un array de objetos String) como parámetro; el cuerpo de este método consiste en una sola llamada al método predefinido `println` con el saludo amistoso como argumento. El método `main` no retorna un valor (se puede entender como un procedimiento). Por lo tanto, no es necesario que se declare un tipo retorno.

Lo que es menos familiar a los programadores Java es la declaración de `object` que contiene al método `main`. Esa declaración introduce lo que es comunmente conocido como *objeto singleton*, que es una clase con una sola instancia. Por lo tanto, dicha construcción declara tanto una clase llamada `HolaMundo` como una instancia de esa clase también llamada `HolaMundo`. Esta instancia es creada bajo demanda, es decir, la primera vez que es utilizada.

El lector astuto notará que el método `main` no es declarado como `static`. Esto es así porque los miembros estáticos (métodos o campos) no existen en Scala. En vez de definir miembros estáticos, el programador de Scala declara estos miembros en un objeto singleton.

### Compilando el ejemplo

Para compilar el ejemplo utilizaremos `scalac`, el compilador de Scala. `scalac` funciona como la mayoría de los compiladores. Toma un archivo fuente como argumento, algunas opciones y produce uno o varios archivos objeto. Los archivos objeto que produce son archivos class de Java estandar.

Si guardamos el programa anterior en un archivo llamado `HolaMundo.scala`, podemos compilarlo ejecutando el siguiente comando (el símbolo mayor `>` representa el prompt del shell y no debe ser tipeado):

    > scalac HolaMundo.scala

Esto generará algunos archivos class en el directorio actual. Uno de ellos se llamará `HolaMundo.class` y contiene una clase que puede ser directamente ejecutada utilizando el comando `scala`, como mostramos en la siguiente sección.

### Ejecutando el ejemplo

Una vez compilado, un programa Scala puede ser ejecutado utilizando el comando `scala`. Su uso es muy similar al comando `java` utilizado para ejecutar programas Java, y acepta las mismas opciones. El ejemplo de arriba puede ser ejecutado utilizando el siguiente comando, que produce la salida esperada:

    > scala -classpath . HolaMundo

    Hola, mundo!

## Interacción con Java

Una de las fortalezas de Scala es que hace muy fácil interactuar con código Java. Todas las clases del paquete `java.lang` son importadas por defecto, mientras otras necesitan ser importadas explicitamente.

Veamos un ejemplo que demuestra esto. Queremos obtener y formatear la fecha actual de acuerdo a convenciones utilizadas en un país específico, por ejemplo Francia.

Las librerías de clases de Java definen clases de utilería poderosas, como `Date` y `DateFormat`. Ya que Scala interacciona fácilmente con Java, no es necesario implementar estas clases equivalentes en las librerías de Scala --podemos simplemente importar las clases de los correspondientes paquetes de Java:

    import java.util.{Date, Locale}
    import java.text.DateFormat
    import java.text.DateFormat._

    object FrenchDate {
      def main(args: Array[String]) {
        val ahora = new Date
        val df = getDateInstance(LONG, Locale.FRANCE)
        println(df format ahora)
      }
    }

Las declaraciones de importación de Scala lucen muy similares a las de Java, sin embargo, las primeras son bastante más poderosas. Múltiples clases pueden ser importadas desde el mismo paquete al encerrarlas en llaves como se muestra en la primer linea. Otra diferencia es que podemos importar todos los nombres de un paquete o clase, utilizando el caracter guión bajo (`_`) en vez del asterisco (`*`). Eso es porque el asterisco es un identificador válido en Scala (quiere decir que por ejemplo podemos nombrar a un método `*`), como veremos más adelante.

La declaración `import` en la tercer linea por lo tanto importa todos los miembros de la clase `DateFormat`. Esto hace que el método estático `getDateInstance` y el campo estático `LONG` sean directamente visibles.

Dentro del método `main` primero creamos una instancia de la clase `Date` la cual por defecto contiene la fecha actual. A continuación definimos un formateador de fechas utilizando el método estático `getDateInstance` que importamos previamente. Finalmente, imprimimos la fecha actual formateada de acuerdo a la instancia de `DateFormat` que fue "localizada". Esta última linea muestra una propiedad interesante de la sintaxis de Scala. Los métodos que toman un solo argumento pueden ser usados con una sintaxis de infijo Es decir, la expresión

    df format ahora
    
es solamente otra manera más corta de escribir la expresión:

    df.format(ahora)

Esto parece tener como un detalle sintáctico menor, pero tiene importantes consecuencias, una de ellas la exploraremos en la próxima sección.

Para concluir esta sección sobre la interacción con Java, es importante notar que es también posible heredar de clases Java e implementar interfaces Java directamente en Scala.

## Todo es un objeto

Scala es un lenguaje puramente orientado a objetos en el sentido de que *todo* es un objeto, incluyendo números o funciones. Difiere de Java en este aspecto, ya que Java distingue tipos primitivos (como `boolean` e `int`) de tipos referencialbes, y no nos permite manipular las funciones como valores.

### Numbers are objects

Ya que los números son objetos, estos también tienen métodos. De hecho, una expresión aritmética como la siguiente:

    1 + 2 * 3 / x

Consiste exclusivamente de llamadas a métodos, porque es equivalente a la siguiente expresión, como vimos en la sección anterior:

    (1).+(((2).*(3))./(x))

Esto también indica que `+`, `*`, etc son identificadores válidos en Scala.

Los paréntesis alrededor de los números en la segunda versión son necesarios porque el analizador léxico de Scala usa la regla de "mayor coincidencia". Por lo tanto partiría la siguiente expresión:

    1.+(2)

En estas partes: `1.`, `+`, y `2`. La razón que esta regla es elegida es porque `1.` es una coincidencia válida y es mayor que `1`, haciendo a este un `Double` en vez de un `Int`. Al escribir la expresión así:

    (1).+(2)

previene que el `1` sea tomado como un `Double`.

### Las funciones son objetos

Tal vez suene más sorprendente para los programadores Java, las funciones en Scala también son objetos. Por lo tanto es posible pasar funciones como argumentos, almacenarlas en variables, y retornarlas desde otras funciones. Esta habilidad de manipular funciones como valores es una de las valores fundamentales de un paradigma de programación muy interesante llamado *programación funcional*.

Como un ejemplo muy simple de por qué puede ser útil usar funciones como valores consideremos una función *temporizador* (o timer, en inglés) cuyo propósito es realizar alguna acción cada un segundo. ¿Cómo pasamos al temporizador la acción a realizar? Bastante lógico, como una función. Este simple concepto de pasar funciones debería ser familiar para muchos programadores: es generalmente utilizado en código relacionado con Interfaces gráficas de usuario (GUIs) para registrar "retrollamadas" (call-back en inglés) que son invocadas cuando un evento ocurre.

En el siguiente programa, la función del temporizador se llama `unaVezPorSegundo` y recibe una función call-back como argumento. El tipo de esta función es escrito de la siguiente manera: `() => Unit` y es el tipo de todas las funciones que no toman argumentos ni retornan valores (el tipo `Unit` es similar a `void` en Java/C/C++). La función principal de este programa simplemente invoca esta función temporizador con una call-back que imprime una sentencia en la terminal. En otras palabras, este programa imprime interminablemente la sentencia "El tiemplo vuela como una flecha" cada segundo.

    object Temporizador {
      def unaVezPorSegundo(callback: () => Unit) {
        while (true) { callback(); Thread sleep 1000 }
      }
      def tiempoVuela() {
        println("El tiemplo vuela como una flecha...")
      }
      def main(args: Array[String]) {
        unaVezPorSegundo(tiempoVuela)
      }
    }
    
_Nota: si nunca tuviste experiencias previas con programación funcional te recomiendo que te tomes unos segundos para analizar cuando se utilizan paréntesis y cuando no en los lugares donde aparece *callback*. Por ejemplo, dentro de la declaración de `unaVezPorSegundo` no aparece, ya que se trata de la función como un "valor", a diferencia de cómo aparece dentro del método, ya que en ese caso se la está invocando (por eso los paréntesis)._
Note that in order to print the string, we used the predefined method
`println` instead of using the one from `System.out`.

#### Funciones anónimas

El programa anterior es fácil de entender, pero puede ser refinado aún más. Primero que nada es interesante notar que la función `tiempoVuela` está definida solamente para ser pasada posteriormente a la función `unaVezPorSegundo`. Tener que nombrar esa función, que es utilizada solamente una vez parece un poco innecesario y sería bueno poder construirla justo cuando sea pasada a `unaVezPorSegundo`. Esto es posible en Scala utilizando *funciones anónimas*, que son exactamente eso: funciones sin nombre. La versión revisada de nuestro temporizador utilizando una función anónima luce así:

    object TemporizadorAnonimo {
      def unaVezPorSegundo(callback: () => Unit) {
        while (true) { callback(); Thread sleep 1000 }
      }
      def main(args: Array[String]) {
        unaVezPorSegundo(
            () => println("El tiemplo vuela como una flecha...")
        )
      }
    }

La presencia de una función anónima en este ejemplo es revelada por la flecha a la derecha `=>` que separa los argumentos de la función del cuerpo de esta. En este ejemplo, la lista de argumentos está vacía, como se ve por el par de paréntesis vacíos a la izquierda de la flecha. El cuerpo de la función es el mismo que en `tiempoVuela` del programa anterior.

## Clases

Como hemos visto anteriormente, Scala es un lenguaje orientado a objetos, y como tal tiene el concepto de Clase (en realidad existen lenguajes orientados a objetos que no cuentan con el concepto de clases, pero Scala no es uno de ellos). Las clases en Scala son declaradas utilizando una sintaxis que es cercana a la de Java. Una diferencia importante es que las clases en Scala pueden tener parámetros. Ilustramos esto en el siguiente ejemplo, la definición de un número complejo:

    class Complejo(real: Double, imaginaria: Double) {
      def re() = real
      def im() = imaginaria
    }

Esta clase compleja toma dos argumentos, que son las partes real e imaginarias de un número complejo. Estos argumentos deben ser pasados cuando se crea una instancia de la clase `Complejo`, de la siguiente manera:

    new Complejo(1.5, 2.3)
    
La clase contiene dos métodos llamados `re` e `im`, que proveen acceso a las dos partes del número.

Debe notarse que el tipo de retorno de estos dos métodos no está expresado explicitamente. Será inferido automáticamente por el compilador, que primero mira la parte derecha de estos métodos y puede deducir que ambos retornan un valor de tipo `Double`.

El compilador no es siempre capaz de inferir los tipos como lo hace aquí, y desafortunadamente no existe una regla simple para saber cuándo será y cuándo no. En la práctica, esto generalmente no es un problema ya que el compilador se queja cuando no es capaz de inferir un tipo que no fue explicitamente fijado. Como regla simple, los programadores de Scala novatos deberían tratar de omitir las declaraciones de tipos que parecen ser simples de deducir del contexto y ver si el compilador no lanza errores. Después de algún tiempo, el programador debería tener una buena idea de cuando omitir tipos y cuando explicitarlos.

### Métodos sin argumentos

Un pequeño problema de los métodos `re` e `im` es que para poder llamarlos es necesario agregar un par de paréntesis vacíos después de sus nombres, como muestra el siguiente ejemplo:

    object NumerosComplejos {
      def main(args: Array[String]) {
        val c = new Complejo(1.2, 3.4)
        println("Parte imaginaria: " + c.im())
      }
    }

Sería mejor poder acceder las partes imaginarias y reales como si fueran campos, sin poner los paréntesis vacíos. Esto es perfectamente realizable en Scala, simplemente al definirlos como *métodos sin argumentos*. Tales métodos difieren de los métodos con cero o más argumentos en que no tienen paréntesis después de su nombre, tanto en la definición como en el uso. Nuestra clase `Complejo` puede ser reescrita así:

    class Complejo(real: Double, imaginaria: Double) {
      def re = real
      def im = imaginaria
    }


### Herencia y sobreescritura

Todas las clases en Scala heredan de una superclase. Cuando ninguna superclase es especificada, como es el caso de `Complejo` se utiliza implicitamente `scala.AnyRef`.

Es posible sobreescribir métodos heredados de una superclase en Scala. Aunque es necesario explicitar específicamente que un método sobreescribe otro utilizando el modificador `override`, de manera de evitar sobreescrituras accidentales. Como ejemplo, nuestra clasee `Complejo` puede ser aumentada con la redefinición del método `toString` heredado de `Object`.

    class Complejo(real: Double, imaginaria: Double) {
      def re = real
      def im = imaginaria
      override def toString() = 
        "" + re + (if (im < 0) "" else "+") + im + "i"
    }

## Clases Case y Reconocimiento de patrones

Un tipo de estructura de datos uqe aparece seguido en programas es el Árbol. Por ejemplo, los intérpretes y compiladores usualmente representan los programas internamente como árboles; los documentos XML son árboles; y muchos otros tipos de contenedores están basados en árboles, como el árbol roji-negro (red-black tree).

Ahora examinaremos cómo estos árboles son representados y manipulados en Scala mediante un pequeño programa que oficie de calculadora. El objetivo de este programa es manipular expresiones aritméticas simples compuestas de sumas de enteros y variables. Dos ejemplos de estas expresiones pueden ser: `1+2` y `(x+x)+(7+y)`.

Primero tenemos que decidir una representación para tales expresiones. La más natural es un árbol, donde los nodos son las operaciones (la adición en este caso) y las hojas son valores (constantes o variables).

In Java, such a tree would be represented using an abstract
super-class for the trees, and one concrete sub-class per node or
leaf. In a functional programming language, one would use an algebraic
data-type for the same purpose. Scala provides the concept of
*case classes* which is somewhat in between the two. Here is how
they can be used to define the type of the trees for our example:

En Java, un árbol así sería representado utilizando una superclase abstracta para los árboles, y una subclase concreta por nodo u hoja. En un lenguaje de programación funcional uno utilizaría un tipo de dato algebráico para el mismo propósito. Scala provee el concepto de *clases case* que está en el medio de los dos conceptos anteriores. Aquí mostramos como pueden ser usadas para definir el tipo de los árboles en nuestro ejemplo:

    abstract class Arbol
    case class Sum(l: Arbol, r: Arbol) extends Arbol
    case class Var(n: String) extends Arbol
    case class Const(v: Int) extends Arbol

El hecho de que las clases `Sum`, `Var` y `Const` sean declaradas como clases case significa que dififieren de las clases normales en varios aspectos:

- no es obligatorio utilizar la palabra clave `new` para crear
  instancias de estas clases (es decir, se puede escribir `Const(5)`
  en lugar de `new Const(5)`),
- se crea automáticamente un "getter" (un método para obtener el valor)
  para los parámetros utilizados en el constructor (por ejemplo es posible
  obtener el valor de `v` de una instancia `c` de la clase `Const` de la 
  siguiente manera: `c.v`),
- se proveen definiciones por defecto de los métodos `equals` y `hashCode`,
  que trabajan sobre la estructura de las instancias y no sobre su identidad,
- se crea una definición por defecto del método `toString` que 
  imprime el valor de una forma "tipo código) (ej: la expresión
  del árbol `x+1` se imprimiría `Sum(Var(x),Const(1))`),
- las instancias de estas clases pueden ser descompuestas
  mediante *reconocimiento de patrones* (pattern matching)
  como veremos más abajo.

Ahora que hemos definido el tipo de datos para representar nuestra expresión aritmética podemos empezar definiendo operaciones para manipularlas. Empezaremos con una función para evaluar una expresión en un *entorno*. El objetivo del entorno es darle valores a las variables. Por ejemplo, la expresión `x+1` evaluada en un entorno que asocia el valor `5` a la variable `x`, escrito `{ x -> 5 }`, da como resultado `6`.

Por lo tanto tenemos que encontrar una manera de representar entornos. Podríamos por supuesto utilizar alguna estructura de datos asociativa como una tabla hash, pero podemos directamente utilizar funciones! Un entorno realmente no es nada más que una función la cual asocia valores a variables. El entorno `{ x -> 5 }` mostrado anteriormente puede ser fácilmente escrito de la siguiente manera en Scala:

    { case "x" => 5 }

Esta notación define una función la cual, dado un string `"x"` como argumento retorna el entero `5`, y falla con una excepción si no fuera así.

Antes de escribir la función evaluadora, démosle un nombre al tipo de los entornos. Podríamos por supuesto simplemente utilizar `String => Int` para los entornos, pero simplifica el programa introducir un nombre para este tipo, y hace que los futuros cambios sean más fáciles. Esto lo realizamos de la siguiente manera:

    type Entorno = String => Int

De ahora en más, el tipo `Entorno` puede ser usado como un alias del tipo de funciones definidas de `String` a `Int`.

Ahora podemos dar la definición de la función evaluadora. Conceptualmente, es muy sencillo: el valor de una suma de dos expresiones es simplemente la suma de los valores de estas expresiones; el valor de una variable es obtenido directamente del entorno; y eel valor de una constante es la constante en sí misma. Expresar esto en Scala no resulta para nada difícil:

    def eval(a: Arbol, ent: Entorno): Int = a match {
      case Sum(i, d) => eval(i, ent) + eval(d, env)
      case Var(n)    => ent(n)
      case Const(v)  => v
    }

Esta función evaluadora función realizando un *reconocimiento de patrones* (pattern matching) en el árbol `a`. Intuitivamente, el significado de la definición de arriba debería estar claro:

1. Primero comprueba si el árbol `t`es una `Sum`, y si lo es, asocia el sub-arbol izquierdo a una nueva variable llamada `i` y el sub-arbol derecho a la variable `r`, y después procede con la evaluación de la expresión que sigue a la flecha (`=>`); esta expresión puede (y hace) uso de las variables asociadas por el patrón que aparece del lado izquierdo de la flecha.
2. si la primer comprobación (la de `Sum`) no prospera, es decir que el árbol no es una `Sum`, sigue de largo y comprueba si `a` es un `Var`; si lo es, asocia el nombre contenido en el nodo `Var` a la variable `n` y procede con la parte derecha de la expresión.
3. si la segunda comprobación también falla, resulta que `a` no es un `Sum` ni un `Var`, por lo tanto comprueba que sea un `Const`, y si lo es, asocia el valor contenido en el nodo `Const` a la variable `v`y procede con el lado derecho.
4. finalmente, si todos las comprobaciones fallan, una excepción es lanzada para dar cuenta el fallo de la expresión; esto puede pasar solo si existen más subclases de `Arbol`.

Hemos visto que la idea básica del reconocimiento de patrones es intentar coincidir un valor con una serie de patrones, y tan pronto como un patrón coincida, extraer y nombrar las varias partes del valor para finalmente evaluar algo de código que tipicamente hace uso de esas partes nombradas.

Un programador con experiencia en orientación a objetos puede preguntarse por qué no definimos `eval` como un método de la clase `Arbol` y sus subclases. En realidad podríamos haberlo hecho, ya que Scala permite la definición de métodos en clases case tal como en clases normales. Por lo tanto decidir en usar reconocimiento de patrones o métodos es una cuestión de gustos, pero también tiene grandes implicancias en cuanto a la extensibilidad:

- cuando usamos métodos, es fácil añadir un nuevo tipo de nodo ya que esto puede ser realizado simplemente al definir una nueva subclase de `Arbol`; por otro lado, añadir una nueva operación para manipular el árbol es tedioso, ya que requiere la modificación en todas las subclases.

- cuando utilizamos reconocimiento de patrones esta situación es inversa: agregar un nuevo tipo de nodo requiere la modificación de todas las funciones que hacen reconocimiento de patrones sobre el árbol, para tomar en cuenta un nuevo nodo; pero por otro lado agregar una nueva operación fácil, solamente definiendolo como una función independiente.

To explore pattern matching further, let us define another operation
on arithmetic expressions: symbolic derivation. The reader might
remember the following rules regarding this operation:

Para explorar un poco más esto de pattern matching definamos otra operación aritmética: derivación simbólica. El lector recordará las siguientes reglas sobre esta operación:

1. la derivada de una suma es la suma de las derivadas,
2. la derivada de una variable `v` es uno (1) si `v` es la variable relativa a la cual la derivada toma lugar, y cero (0)de otra manera,
3. la derivada de una constante es cero (0).

These rules can be translated almost literally into Scala code, to
obtain the following definition:

Estas reglas pueden ser traducidas casi literalmente en código Sclaa, para obtener la siguiente definición.

    def derivada(a: Arbol, v: String): Arbol = a match {
      case Sum(l, r) => Sum(derivada(l, v), derivada(r, v))
      case Var(n) if (v == n) => Const(1)
      case _ => Const(0)
    }

Esta función introduce dos nuevos conceptos relacionados al pattern matching. Primero que nada la expresión `case` para variables tienen una *guarda*, una expresión siguiendo la palabra clave `if`. Esta guarda previene que el patrón concuerde al menos que la expresión sea verdadera. Aquí es usada para asegurarse que retornamos la constante 1 solo si el nombre de la variable siendo derivada es el mismo que la variable derivada `v`. El segundo concepto nuevo usado aquí es el *comodín*, escrito con el guión bajo `_`, que coincide con cualquier valor que aparezca, sin darle un nombre.

No hemos explorado el completo poder del pattern matching aún, pero nos detendremos aquí para mantener este documento corto. Todavía nos queda pendiente ver cómo funcionan las dos funciones de arriba en un ejemplo real. Para ese propósito, escribamos una función main simple que realice algunas operaciones sobre la expresión `(x+x)+(7+y)`: primero computa su valor en el entorno `{ x -> 5, y -> 7 }` y después computa su derivada con respecto a `x` y después a `y`.

    def main(args: Array[String]) {
      val exp: Arbol = Sum(Sum(Var("x"),Var("x")),Sum(Const(7),Var("y")))
      val ent: Entonrno = { case "x" => 5 case "y" => 7 }
      println("Expresión: " + exp)
      println("Evaluación con x=5, y=7: " + eval(exp, ent))
      println("Derivada con respecto a x:\n " + derivada(exp, "x"))
      println("Derivada con respecto a y:\n " + derivada(exp, "y"))
    }

Al ejecutar este programa obtenemos el siguiente resultado:

    Expresión: Sum(Sum(Var(x),Var(x)),Sum(Const(7),Var(y)))
    Evaluación con x=5, y=7: 24
    Derivada con respecto a x:
     Sum(Sum(Const(1),Const(1)),Sum(Const(0),Const(0)))
    Derivada con respecto a y:
     Sum(Sum(Const(0),Const(0)),Sum(Const(0),Const(1)))

Al examinar la salida vemos que el resultado de la derivada debería ser simplificado antes de ser presentado al usuario. Definir una función de simplificación básica utilizando reconocimiento de patrones es un problema interesante (y, por no decir complejo, que necesita una solución astuta), lo dejamos para un ejercicio para el lector.

## Traits

Apart from inheriting code from a super-class, a Scala class can also
import code from one or several *traits*.

Maybe the easiest way for a Java programmer to understand what traits
are is to view them as interfaces which can also contain code. In
Scala, when a class inherits from a trait, it implements that trait's
interface, and inherits all the code contained in the trait.

To see the usefulness of traits, let's look at a classical example:
ordered objects. It is often useful to be able to compare objects of a
given class among themselves, for example to sort them. In Java,
objects which are comparable implement the `Comparable`
interface. In Scala, we can do a bit better than in Java by defining
our equivalent of `Comparable` as a trait, which we will call
`Ord`.

When comparing objects, six different predicates can be useful:
smaller, smaller or equal, equal, not equal, greater or equal, and
greater. However, defining all of them is fastidious, especially since
four out of these six can be expressed using the remaining two. That
is, given the equal and smaller predicates (for example), one can
express the other ones. In Scala, all these observations can be
nicely captured by the following trait declaration:

    trait Ord {
      def < (that: Any): Boolean
      def <=(that: Any): Boolean =  (this < that) || (this == that)
      def > (that: Any): Boolean = !(this <= that)
      def >=(that: Any): Boolean = !(this < that)
    }

This definition both creates a new type called `Ord`, which
plays the same role as Java's `Comparable` interface, and
default implementations of three predicates in terms of a fourth,
abstract one. The predicates for equality and inequality do not appear
here since they are by default present in all objects.

The type `Any` which is used above is the type which is a
super-type of all other types in Scala. It can be seen as a more
general version of Java's `Object` type, since it is also a
super-type of basic types like `Int`, `Float`, etc.

To make objects of a class comparable, it is therefore sufficient to
define the predicates which test equality and inferiority, and mix in
the `Ord` class above. As an example, let's define a
`Date` class representing dates in the Gregorian calendar. Such
dates are composed of a day, a month and a year, which we will all
represent as integers. We therefore start the definition of the
`Date` class as follows:

    class Date(y: Int, m: Int, d: Int) extends Ord {
      def year = y
      def month = m
      def day = d
      override def toString(): String = year + "-" + month + "-" + day

The important part here is the `extends Ord` declaration which
follows the class name and parameters. It declares that the
`Date` class inherits from the `Ord` trait.

Then, we redefine the `equals` method, inherited from
`Object`, so that it correctly compares dates by comparing their
individual fields. The default implementation of `equals` is not
usable, because as in Java it compares objects physically. We arrive
at the following definition:

    override def equals(that: Any): Boolean =
      that.isInstanceOf[Date] && {
        val o = that.asInstanceOf[Date]
        o.day == day && o.month == month && o.year == year
      }

This method makes use of the predefined methods `isInstanceOf`
and `asInstanceOf`. The first one, `isInstanceOf`,
corresponds to Java's `instanceof` operator, and returns true
if and only if the object on which it is applied is an instance of the
given type. The second one, `asInstanceOf`, corresponds to
Java's cast operator: if the object is an instance of the given type,
it is viewed as such, otherwise a `ClassCastException` is
thrown.

Finally, the last method to define is the predicate which tests for
inferiority, as follows. It makes use of another predefined method,
`error`, which throws an exception with the given error message.

    def <(that: Any): Boolean = {
      if (!that.isInstanceOf[Date])
        error("cannot compare " + that + " and a Date")

      val o = that.asInstanceOf[Date]
      (year < o.year) ||
      (year == o.year && (month < o.month ||
                         (month == o.month && day < o.day)))
    }

This completes the definition of the `Date` class. Instances of
this class can be seen either as dates or as comparable objects.
Moreover, they all define the six comparison predicates mentioned
above: `equals` and `<` because they appear directly in
the definition of the `Date` class, and the others because they
are inherited from the `Ord` trait.

Traits are useful in other situations than the one shown here, of
course, but discussing their applications in length is outside the
scope of this document.

## Genericity

The last characteristic of Scala we will explore in this tutorial is
genericity. Java programmers should be well aware of the problems
posed by the lack of genericity in their language, a shortcoming which
is addressed in Java 1.5.

Genericity is the ability to write code parametrized by types. For
example, a programmer writing a library for linked lists faces the
problem of deciding which type to give to the elements of the list.
Since this list is meant to be used in many different contexts, it is
not possible to decide that the type of the elements has to be, say,
`Int`. This would be completely arbitrary and overly
restrictive.

Java programmers resort to using `Object`, which is the
super-type of all objects. This solution is however far from being
ideal, since it doesn't work for basic types (`int`,
`long`, `float`, etc.) and it implies that a lot of
dynamic type casts have to be inserted by the programmer.

Scala makes it possible to define generic classes (and methods) to
solve this problem. Let us examine this with an example of the
simplest container class possible: a reference, which can either be
empty or point to an object of some type.

    class Reference[T] {
      private var contents: T = _
      def set(value: T) { contents = value }
      def get: T = contents
    }

The class `Reference` is parametrized by a type, called `T`,
which is the type of its element. This type is used in the body of the
class as the type of the `contents` variable, the argument of
the `set` method, and the return type of the `get` method.

The above code sample introduces variables in Scala, which should not
require further explanations. It is however interesting to see that
the initial value given to that variable is `_`, which represents
a default value. This default value is 0 for numeric types,
`false` for the `Boolean` type, `()` for the `Unit`
type and `null` for all object types.

To use this `Reference` class, one needs to specify which type to use
for the type parameter `T`, that is the type of the element
contained by the cell. For example, to create and use a cell holding
an integer, one could write the following:

    object IntegerReference {
      def main(args: Array[String]) {
        val cell = new Reference[Int]
        cell.set(13)
        println("Reference contains the half of " + (cell.get * 2))
      }
    }

As can be seen in that example, it is not necessary to cast the value
returned by the `get` method before using it as an integer. It
is also not possible to store anything but an integer in that
particular cell, since it was declared as holding an integer.

## Conclusion

This document gave a quick overview of the Scala language and
presented some basic examples. The interested reader can go on, for example, by
reading the document *Scala By Example*, which
contains much more advanced examples, and consult the *Scala
  Language Specification* when needed.
