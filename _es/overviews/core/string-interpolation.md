---
layout: singlepage-overview
title: Interpolación de cadenas

partof: string-interpolation

language: es
---

**Josh Suereth**

**Traducción e interpretación: Miguel Ángel Pastor Olivar**

## Introducción

Desde la versión 2.10.0, Scala ofrece un nuevo mecanismo para la creación de cadenas a partir de nuestros datos mediante la técnica de interpolación de cadenas.
Este nuevo mecanismo permite a los usuarios incluir referencias a variables de manera directa en cadenas de texto "procesadas". Por ejemplo:

    val name = "James"
    println(s"Hello, $name")  // Hello, James

En el ejemplo anterior, el literal `s"Hello, $name"` es una cadena "procesada". Esto significa que el compilador debe realizar un trabajo adicional durante el tratamiento de dicha cadena. Una cadena "procesada" se denota mediante un conjunto de caracteres que preceden al símbolo `"`. La interpolación de cadenas ha sido introducida por [SIP-11](https://docs.scala-lang.org/sips/pending/string-interpolation.html), el cual contiene todos los detalles de implementación.

## Uso

Scala ofrece tres métodos de interpolación de manera nativa:  `s`, `f` and `raw`.

### Interpolador `s`

El uso del prefijo `s` en cualquier cadena permite el uso de variables de manera directa dentro de la propia cadena. Ya hemos visto el ejemplo anterior:

    val name = "James"
    println(s"Hello, $name")  // Hello, James

`$name` se anida dentro de la cadena "procesada" de tipo `s`. El interpolador `s` sabe como insertar el valor de la variable `name` en lugar indicado, dando como resultado la cadena `Hello, James`. Mediante el uso del interpolador `s`, cualquier nombre disponible en el ámbito puede ser utilizado dentro de la cadena.

Las interpolaciones pueden recibir expresiones arbitrarias. Por ejemplo:

    println(s"1 + 1 = ${1 + 1}")

imprimirá la cadena `1 + 1 = 2`. Cualquier expresión puede ser embebida en `${}`

### Interpolador `f`

Prefijando `f` a cualquier cadena permite llevar a cabo la creación de cadenas formateadas, del mismo modo que `printf` es utilizado en otros lenguajes. Cuando utilizamos este interpolador, todas las referencias a variables deben estar seguidas por una cadena de formateo que siga el formato `printf-`, como `%d`. Veamos un ejemplo:

    val height = 1.9d
    val name = "James"
    println(f"$name%s is $height%2.2f meters tall")  // James is 1.90 meters tall

El interpolador `f` es seguro respecto a tipos. Si pasamos un número real a una cadena de formateo que sólo funciona con números enteros, el compilador emitirá un error. Por ejemplo:

    val height: Double = 1.9d

    scala> f"$height%4d"
    <console>:9: error: type mismatch;
     found   : Double
     required: Int
               f"$height%4d"
                  ^

El interpolador `f` hace uso de las utilidades de formateo de cadenas disponibles en java. Los formatos permitidos tras el carácter `%` son descritos en [Formatter javadoc](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Formatter.html#detail). Si el carácter `%` no aparece tras la definición de una variable, `%s` es utilizado por defecto.

### Interpolador `raw`

El interpolador `raw` difiere del interpolador `s` en que el primero no realiza el escapado de literales contenidos en la cadena. A continuación se muestra un ejemplo de una cadena procesada:

    scala> s"a\nb"
    res0: String =
    a
    b

En el ejemplo anterior, el interpolador `s` ha reemplazado los caracteres `\n` con un salto de linea. El interpolador `raw` no llevará a cabo esta acción:

    scala> raw"a\nb"
    res1: String = a\nb

Esta cadena de interpolación es muy útil cuando se desea evitar que expresiones como `\n` se conviertan en un salto de línea.

Adicionalmente a los interpoladores ofrecidos de serie por Scala, nosotros podremos definir nuestras propias cadenas de interpolación.

## Uso avanzado

En Scala, todas las cadenas "procesadas" son simples transformaciones de código. En cualquier punto en el que el compilador encuentra una cadena de texto con la forma:

    id"string content"

la transforma en la llamada a un método (`id`) sobre una instancia de [StringContext](https://www.scala-lang.org/api/current/index.html#scala.StringContext). Este método también puede estar disponible en un ámbito implícito. Para definiir nuestra propia cadena de interpolación simplemente necesitamos crear una clase implícita que añada un nuevo método a la clase `StringContext`. A continuación se muestra un ejemplo:

    // Note: We extends AnyVal to prevent runtime instantiation.  See
    // value class guide for more info.
    implicit class JsonHelper(val sc: StringContext) extends AnyVal {
      def json(args: Any*): JSONObject = sys.error("TODO - IMPLEMENT")
    }

    def giveMeSomeJson(x: JSONObject): Unit = ...

    giveMeSomeJson(json"{ name: $name, id: $id }")

En este ejemplo, estamos intentando crear una cadena JSON mediante el uso de la interpolación de cadenas. La clase implícita `JsonHelper` debe estar disponible en el ámbito donde deseemos utilizar esta sintaxis, y el método `json` necesitaría ser implementado completamente. Sin embargo, el resutlado de dicha cadena de formateo no sería una cadena sino un objeto de tipo `JSONObject`

Cuando el compilador encuentra la cadena `json"{ name: $name, id: $id }"` reescribe la siguiente expresión:

    new StringContext("{ name: ", ", id: ", " }").json(name, id)

La clase implícita es utilizada para reescribir el fragmento anterior de la siguiente forma:

    new JsonHelper(new StringContext("{ name: ", ", id: ", " }")).json(name, id)

De este modo, el método `json` tiene acceso a las diferentes partes de las cadenas así como cada una de las expresiones. Una implementación simple, y con errores, de este método podría ser:

    implicit class JsonHelper(val sc: StringContext) extends AnyVal {
      def json(args: Any*): JSONObject = {
        val strings = sc.parts.iterator
        val expressions = args.iterator
        var buf = new StringBuilder(strings.next)
        while(strings.hasNext) {
          buf.append(expressions.next())
          buf.append(strings.next())
        }
        parseJson(buf)
      }
    }

Cada una de las diferentes partes de la cadena "procesada" son expuestas en el atributo `parts` de la clase `StringContext`. Cada uno de los valores de la expresión se pasa en el argumento `args` del método `json`. Este método acepta dichos argumentos y genera una gran cadena que posteriormente convierte en un objecto de tipo JSON. Una implementación más sofisticada podría evitar la generación de la cadena anterior y llevar a cabo de manera directa la construcción del objeto JSON a partir de las cadenas y los valores de la expresión.


## Limitaciones

La interpolación de cadenas no funciona con sentencias "pattern matching". Esta funcionalidad está planificada para su inclusión en la versión 2.11 de Scala.
