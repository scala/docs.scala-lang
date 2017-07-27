---
layout: singlepage-overview
title: Tutorial de Scala para programadores Java

partof: scala-for-java-programmers

discourse: true
language: es
---

Por Michel Schinz y Philipp Haller.
Traducción y arreglos Santiago Basulto.

## Introducción

Este documento provee una rápida introducción al lenguaje Scala como también a su compilador. Está pensado para personas que ya poseen cierta experiencia en programación y quieren una vista rápida de lo que pueden hacer con Scala. Se asume como un conocimiento básico de programación orientada a objetos, especialmente en Java.

## Un primer ejemplo

Como primer ejemplo, usaremos el programa *Hola mundo* estándar. No es muy fascinante, pero de esta manera resulta fácil demostrar el uso de herramientas de Scala sin saber demasiado acerca del lenguaje. Veamos como luce:

    object HolaMundo {
      def main(args: Array[String]) {
        println("¡Hola, mundo!")
      }
    }

La estructura de este programa debería ser familiar para programadores Java: consiste de un método llamado `main` que toma los argumentos de la línea de comando (un array de objetos String) como parámetro; el cuerpo de este método consiste en una sola llamada al método predefinido `println` con el saludo amistoso como argumento. El método `main` no retorna un valor (se puede entender como un procedimiento). Por lo tanto, no es necesario que se declare un tipo retorno.

Lo que es menos familiar a los programadores Java es la declaración de `object` que contiene al método `main`. Esa declaración introduce lo que es comúnmente conocido como *objeto singleton*, que es una clase con una sola instancia. Por lo tanto, dicha construcción declara tanto una clase llamada `HolaMundo` como una instancia de esa clase también llamada `HolaMundo`. Esta instancia es creada bajo demanda, es decir, la primera vez que es utilizada.

El lector astuto notará que el método `main` no es declarado como `static`. Esto es así porque los miembros estáticos (métodos o campos) no existen en Scala. En vez de definir miembros estáticos, el programador de Scala declara estos miembros en un objeto singleton.

### Compilando el ejemplo

Para compilar el ejemplo utilizaremos `scalac`, el compilador de Scala. `scalac` funciona como la mayoría de los compiladores. Toma un archivo fuente como argumento, algunas opciones y produce uno o varios archivos objeto. Los archivos objeto que produce son archivos class de Java estándar.

Si guardamos el programa anterior en un archivo llamado `HolaMundo.scala`, podemos compilarlo ejecutando el siguiente comando (el símbolo mayor `>` representa el prompt del shell y no debe ser escrita):

    > scalac HolaMundo.scala

Esto generará algunos archivos class en el directorio actual. Uno de ellos se llamará `HolaMundo.class` y contiene una clase que puede ser directamente ejecutada utilizando el comando `scala`, como mostramos en la siguiente sección.

### Ejecutando el ejemplo

Una vez compilado, un programa Scala puede ser ejecutado utilizando el comando `scala`. Su uso es muy similar al comando `java` utilizado para ejecutar programas Java, y acepta las mismas opciones. El ejemplo de arriba puede ser ejecutado utilizando el siguiente comando, que produce la salida esperada:

    > scala -classpath . HolaMundo

    ¡Hola, mundo!

## Interacción con Java

Una de las fortalezas de Scala es que hace muy fácil interactuar con código Java. Todas las clases del paquete `java.lang` son importadas por defecto, mientras otras necesitan ser importadas explícitamente.

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

Las declaraciones de importación de Scala lucen muy similares a las de Java, sin embargo, las primeras son bastante más poderosas. Múltiples clases pueden ser importadas desde el mismo paquete al encerrarlas en llaves como se muestra en la primer línea. Otra diferencia es que podemos importar todos los nombres de un paquete o clase, utilizando el carácter guión bajo (`_`) en vez del asterisco (`*`). Eso es porque el asterisco es un identificador válido en Scala (quiere decir que por ejemplo podemos nombrar a un método `*`), como veremos más adelante.

La declaración `import` en la tercer línea por lo tanto importa todos los miembros de la clase `DateFormat`. Esto hace que el método estático `getDateInstance` y el campo estático `LONG` sean directamente visibles.

Dentro del método `main` primero creamos una instancia de la clase `Date` la cual por defecto contiene la fecha actual. A continuación definimos un formateador de fechas utilizando el método estático `getDateInstance` que importamos previamente. Finalmente, imprimimos la fecha actual formateada de acuerdo a la instancia de `DateFormat` que fue "localizada". Esta última línea muestra una propiedad interesante de la sintaxis de Scala. Los métodos que toman un solo argumento pueden ser usados con una sintaxis de infijo Es decir, la expresión

    df format ahora

es solamente otra manera más corta de escribir la expresión:

    df.format(ahora)

Esto parece tener como un detalle sintáctico menor, pero tiene importantes consecuencias, una de ellas la exploraremos en la próxima sección.

Para concluir esta sección sobre la interacción con Java, es importante notar que es también posible heredar de clases Java e implementar interfaces Java directamente en Scala.

## Todo es un objeto

Scala es un lenguaje puramente orientado a objetos en el sentido de que *todo* es un objeto, incluyendo números o funciones. Difiere de Java en este aspecto, ya que Java distingue tipos primitivos (como `boolean` e `int`) de tipos referenciales, y no nos permite manipular las funciones como valores.

### Los números son objetos

Ya que los números son objetos, estos también tienen métodos. De hecho, una expresión aritmética como la siguiente:

    1 + 2 * 3 / x

Consiste exclusivamente de llamadas a métodos, porque es equivalente a la siguiente expresión, como vimos en la sección anterior:

    (1).+(((2).*(3))./(x))

Esto también indica que `+`, `*`, etc. son identificadores válidos en Scala.

Los paréntesis alrededor de los números en la segunda versión son necesarios porque el analizador léxico de Scala usa la regla de "mayor coincidencia". Por lo tanto partiría la siguiente expresión:

    1.+(2)

En estas partes: `1.`, `+`, y `2`. La razón que esta regla es elegida es porque `1.` es una coincidencia válida y es mayor que `1`, haciendo a este un `Double` en vez de un `Int`. Al escribir la expresión así:

    (1).+(2)

previene que el `1` sea tomado como un `Double`.

### Las funciones son objetos

Tal vez suene más sorprendente para los programadores Java, las funciones en Scala también son objetos. Por lo tanto es posible pasar funciones como argumentos, almacenarlas en variables, y retornarlas desde otras funciones. Esta habilidad de manipular funciones como valores es una de las valores fundamentales de un paradigma de programación muy interesante llamado *programación funcional*.

Como un ejemplo muy simple de por qué puede ser útil usar funciones como valores consideremos una función *temporizador* (o timer, en inglés) cuyo propósito es realizar alguna acción cada un segundo. ¿Cómo pasamos al temporizador la acción a realizar? Bastante lógico, como una función. Este simple concepto de pasar funciones debería ser familiar para muchos programadores: es generalmente utilizado en código relacionado con Interfaces gráficas de usuario (GUIs) para registrar "retrollamadas" (call-back en inglés) que son invocadas cuando un evento ocurre.

En el siguiente programa, la función del temporizador se llama `unaVezPorSegundo` y recibe una función call-back como argumento. El tipo de esta función es escrito de la siguiente manera: `() => Unit` y es el tipo de todas las funciones que no toman argumentos ni retornan valores (el tipo `Unit` es similar a `void` en Java/C/C++). La función principal de este programa simplemente invoca esta función temporizador con una call-back que imprime una sentencia en la terminal. En otras palabras, este programa imprime interminablemente la sentencia "El tiempo vuela como una flecha" cada segundo.

    object Temporizador {
      def unaVezPorSegundo(callback: () => Unit) {
        while (true) { callback(); Thread sleep 1000 }
      }
      def tiempoVuela() {
        println("El tiempo vuela como una flecha...")
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
            () => println("El tiempo vuela como una flecha...")
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

Debe notarse que el tipo de retorno de estos dos métodos no está expresado explícitamente. Será inferido automáticamente por el compilador, que primero mira la parte derecha de estos métodos y puede deducir que ambos retornan un valor de tipo `Double`.

El compilador no es siempre capaz de inferir los tipos como lo hace aquí, y desafortunadamente no existe una regla simple para saber cuándo será y cuándo no. En la práctica, esto generalmente no es un problema ya que el compilador se queja cuando no es capaz de inferir un tipo que no fue explícitamente fijado. Como regla simple, los programadores de Scala novatos deberían tratar de omitir las declaraciones de tipos que parecen ser simples de deducir del contexto y ver si el compilador no lanza errores. Después de algún tiempo, el programador debería tener una buena idea de cuando omitir tipos y cuando explicitarlos.

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

Todas las clases en Scala heredan de una superclase. Cuando ninguna superclase es especificada, como es el caso de `Complejo` se utiliza implícitamente `scala.AnyRef`.

Es posible sobreescribir métodos heredados de una superclase en Scala. Aunque es necesario explicitar específicamente que un método sobreescribe otro utilizando el modificador `override`, de manera de evitar sobreescrituras accidentales. Como ejemplo, nuestra clase `Complejo` puede ser aumentada con la redefinición del método `toString` heredado de `Object`.

    class Complejo(real: Double, imaginaria: Double) {
      def re = real
      def im = imaginaria
      override def toString() =
        "" + re + (if (im < 0) "" else "+") + im + "i"
    }

## Clases Case y Reconocimiento de patrones

Un tipo de estructura de datos que aparece seguido en programas es el Árbol. Por ejemplo, los intérpretes y compiladores usualmente representan los programas internamente como árboles; los documentos XML son árboles; y muchos otros tipos de contenedores están basados en árboles, como los árboles rojo y negro.

Ahora examinaremos cómo estos árboles son representados y manipulados en Scala mediante un pequeño programa que oficie de calculadora. El objetivo de este programa es manipular expresiones aritméticas simples compuestas de sumas de enteros y variables. Dos ejemplos de estas expresiones pueden ser: `1+2` y `(x+x)+(7+y)`.

Primero tenemos que decidir una representación para tales expresiones. La más natural es un árbol, donde los nodos son las operaciones (la adición en este caso) y las hojas son valores (constantes o variables).

En Java, un árbol así sería representado utilizando una superclase abstracta para los árboles, y una subclase concreta por nodo u hoja. En un lenguaje de programación funcional uno utilizaría un tipo de dato algebraico para el mismo propósito. Scala provee el concepto de *clases case* que está en el medio de los dos conceptos anteriores. Aquí mostramos como pueden ser usadas para definir el tipo de los árboles en nuestro ejemplo:

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

Ahora podemos dar la definición de la función evaluadora. Conceptualmente, es muy sencillo: el valor de una suma de dos expresiones es simplemente la suma de los valores de estas expresiones; el valor de una variable es obtenido directamente del entorno; y el valor de una constante es la constante en sí misma. Expresar esto en Scala no resulta para nada difícil:

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

Hemos visto que la idea básica del reconocimiento de patrones es intentar coincidir un valor con una serie de patrones, y tan pronto como un patrón coincida, extraer y nombrar las varias partes del valor para finalmente evaluar algo de código que típicamente hace uso de esas partes nombradas.

Un programador con experiencia en orientación a objetos puede preguntarse por qué no definimos `eval` como un método de la clase `Arbol` y sus subclases. En realidad podríamos haberlo hecho, ya que Scala permite la definición de métodos en clases case tal como en clases normales. Por lo tanto decidir en usar reconocimiento de patrones o métodos es una cuestión de gustos, pero también tiene grandes implicancias en cuanto a la extensibilidad:

- cuando usamos métodos, es fácil añadir un nuevo tipo de nodo ya que esto puede ser realizado simplemente al definir una nueva subclase de `Arbol`; por otro lado, añadir una nueva operación para manipular el árbol es tedioso, ya que requiere la modificación en todas las subclases.

- cuando utilizamos reconocimiento de patrones esta situación es inversa: agregar un nuevo tipo de nodo requiere la modificación de todas las funciones que hacen reconocimiento de patrones sobre el árbol, para tomar en cuenta un nuevo nodo; pero por otro lado agregar una nueva operación fácil, solamente definiendolo como una función independiente.

Para explorar un poco más esto de pattern matching definamos otra operación aritmética: derivación simbólica. El lector recordará las siguientes reglas sobre esta operación:

1. la derivada de una suma es la suma de las derivadas,
2. la derivada de una variable `v` es uno (1) si `v` es la variable relativa a la cual la derivada toma lugar, y cero (0)de otra manera,
3. la derivada de una constante es cero (0).

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

_Nota: La palabra Trait(/treɪt/, pronunciado Treit) puede ser traducida literalmente como "Rasgo". De todas maneras decido utilizar la notación original por ser un concepto muy arraigado a Scala_

Aparte de poder heredar código de una super clase, una clase en Scala puede también importar código de uno o varios *traits*.

Tal vez la forma más fácil para un programador Java de entender qué son los traits es verlos como interfaces que también pueden contener código. En Scala, cuando una clase hereda de un trait, implementa la interface de ese trait, y hereda todo el código contenido en el trait.

Para ver la utilidad de los traits, veamos un ejemplo clásico: objetos ordenados. Generalmente es útil tener la posibilidad de comparar objetos de una clase dada entre ellos, por ejemplo, para ordenarlos. En Java, los objetos que son comparables implementan la interfaz `Comparable`. En Scala, podemos hacer algo un poco mejor que en Java al definir un trait equivalente `Comparable` que invocará a `Ord`.

Cuando comparamos objetos podemos utilizar seis predicados distintos: menor, menor o igual, igual, distinto, mayor o igual y mayor. De todas maneras, definir todos estos es fastidioso, especialmente que cuatro de estos pueden ser expresados en base a los otros dos. Esto es, dados los predicados "igual" y "menor" (por ejemplo), uno puede expresar los otros. En Scala, todas estas observaciones pueden ser fácilmente capturadas mediante la siguiente declaración de un Trait:

    trait Ord {
      def < (that: Any): Boolean
      def <=(that: Any): Boolean =  (this < that) || (this == that)
      def > (that: Any): Boolean = !(this <= that)
      def >=(that: Any): Boolean = !(this < that)
    }

Esta definición crea un nuevo tipo llamado `Ord` el cual juega el mismo rol que la interfaz `Comparable`, como también provee implementaciones de tres predicados en términos de un cuarto, abstracto. Los predicados para igualidad y su inverso (distinto, no igual) no aparecen aquí ya que por defecto están presenten en todos los objetos.

El tipo `Any` el cual es usado arriba es el supertipo de todos los otros tipos en Scala. Puede ser visto como una versión más general del tipo `Object` en Java, ya que `Any` también es supertipo de `Int`, `Float`, etc. cosa que no se cumple en Java (`int` por ejemplo es un tipo primitivo).

Para hacer a un objeto de la clase comparable es suficiente definir los predicados que comprueban la igualdad y la inferioridad y mezclar la clase `Ord` de arriba. Como un ejemplo, definamos una clase `Fecha` que representa fechas en el calendario gregoriano.

    class Fecha(d: Int, m: Int, a: Int) extends Ord {
      def anno = a
      def mes = m
      def dia = d
      override def toString(): String = anno + "-" + mes + "-" + dia

La parte importante aquí es la declaración `extends Ord` la cual sigue al nombre de la clase y los parámetros. Declara que la clase `Fecha` hereda del trait `Ord`.

Después redefinimos el método `equals`, heredado de `Object`, para comparar correctamente fechas mediante sus campos individuales. La implementación por defecto de `equals` no es utilizable, porque como en Java, compara los objetos físicamente. Por lo tanto llegamos a esto:

    override def equals(that: Any): Boolean =
      that.isInstanceOf[Fecha] && {
        val o = that.asInstanceOf[Fecha]
        o.dia== dia && o.mes == mes && o.anno== anno
      }

Este método utiliza el método predefinido `isInstanceOf` ("es instancia de") y `asInstanceOf` ("como instancia de"). El primero `isInstanceOf` se corresponde con el operador java `instanceOf` y retorna `true` si y solo si el objeto en el cual es aplicado es una instancia del tipo dado. El segundo, `asInstanceOf`, corresponde al operador de casteo en Java: si el objeto es una instancia de un tipo dado, esta es vista como tal, de otra manera se lanza una excepción `ClassCastException`.

Finalmente el último método para definir es el predicado que comprueba la inferioridad. Este hace uso de otro método predefinido, `error` que lanza una excepción con el mensaje de error provisto.

    def <(that: Any): Boolean = {
        if (!that.isInstanceOf[Fecha])
          error("no se puede comparar" + that + " y una fecha")

      val o = that.asInstanceOf[Fecha]
      (anno < o.anno) ||
      (anno== o.anno && (mes < o.mes ||
                         (mes == o.mes && dia < o.dia)))
    }

Esto completa la definición de la clase `Fecha`. Las instancias de esta clase pueden ser vistas tanto como fechas o como objetos comparables. Además, todas ellas definen los seis predicados de comparación mencionados arriba: `equals` y `<` porque aparecen directamente en la definición de la clase `Fecha` y los otros porque son heredados del trait `Ord`.

Los traits son útiles en muchas otras más situaciones que las aquí mostrada, pero discutir sus aplicaciones está fuera del alcance de este documento.

## Tipos Genéricos

_Nota: El diseñador de los tipos genéricos en Java fue nada más ni nada menos que Martin Odersky, el diseñador de Scala._

La última característica de Scala que exploraremos en este tutorial es la de los tipos genéricos. Los programadores de Java deben estar bien al tanto de los problemas que genera la falta de genéricos en su lenguaje, lo cual es solucionado en Java 1.5.

Los tipos genéricos proveen al programador la habilidad de escribir código parametrizado por tipos. Por ejemplo, escribir una librería para listas enlazadas se enfrenta al problema de decidir qué tipo darle a los elementos de la lista. Ya que esta lista está pensada para ser usada en diferentes contextos, no es posible decidir que el tipo de elementos sea, digamos, `Int`. Esto sería completamente arbitrario y muy restrictivo.

Los programadores Java cuentan como último recurso con `Object`, que es el supertipo de todos los objetos. Esta solución de todas maneras está lejos de ser ideal, ya que no funciona con tipos primitivos (`int`, `long`, `float`, etc.) e implica que el programador tenga que realizar muchos casteos de tipos en su programa.

Scala hace posible definir clases genéricas (y métodos) para resolver este problema. Examinemos esto con un ejemplo del contenedor más simple posible: una referencia, que puede estar tanto vacía como apuntar a un objeto de algún tipo.

    class Referencia[T] {
      private var contenido: T = _
      def set(valor: T) { contenido = valor }
      def get: T = contenido
    }

La clase `Referencia` es parametrizada por un tipo llamado `T`, que es el tipo de sus elementos. Este tipo es usado en el cuerpo de la clase como el tipo de la variable `contenido`, el argumento del método `set` y el tipo de retorno del método `get`.

El ejemplo anterior introduce a las variables en Scala, que no deberían requerir mayor explicación. Es interesante notar que el valor inicial dado a la variable `contenido` es `_`, que representa un valor por defecto. Este valor por defecto es 0 para tipos numéricos, `false` para tipos `Boolean`, `()` para el tipo `Unit` y `null` para el resto de los objetos.

Para utilizar esta clase `Referencia`, uno necesita especificar qué tipo utilizar por el parámetro `T`, es decir, el tipo del elemento contenido por la referencia. Por ejemplo, para crear y utilizar una referencia que contenga un entero, podríamos escribir lo siguiente:

    object ReferenciaEntero {
      def main(args: Array[String]) {
        val ref = new Referencia[Int]
        ref.set(13)
        println("La referncia tiene la mitad de " + (ref.get * 2))
      }
    }

Como puede verse en el ejemplo, no es necesario castear el valor retornado por el método `get` antes de usarlo como un entero. Tampoco es posible almacenar otra cosa que no sea un entero en esa referencia en particular, ya que fue declarada como contenedora de un entero.

## Conclusión

Scala es un lenguaje tremendamente poderoso que ha sabido heredar las mejores cosas de cada uno de los lenguajes más exitosos que se han conocido. Java no es la excepción, y comparte muchas cosas con este. La diferencia que vemos es que para cada uno de los conceptos de Java, Scala los aumenta, refina y mejora. Poder aprender todas las características de Scala nos equipa con más y mejores herramientas a la hora de escribir nuestros programas.
Si bien la programación funcional no ha sido una característica de Java, el programador experimentado puede notar la falta de soporte de este paradigma en múltiples ocasiones. El solo pensar en el código necesario para proveer a un `JButton` con el código que debe ejecutar al ser presionado nos muestra lo necesario que sería contar con herramientas funcionales. Recomendamos entonces tratar de ir incorporando estas características, por más que sea difícil para el programador Java al estar tan acostumbrado al paradigma imperativo de este lenguaje.

Este documento dio una rápida introducción al lenguaje Scala y presento algunos ejemplos básicos. El lector interesado puede seguir, por ejemplo, leyendo el *Tutorial de Scala* que figura en el sitio de documentación, o *Scala by Example* (en inglés). También puede consultar la especificación del lenguaje cuando lo desee.
