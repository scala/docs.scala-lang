---
layout: tour
title: Anotaciones
partof: scala-tour

num: 3
language: es

next-page: packages-and-imports
previous-page: abstract-type-members
---

Las anotaciones sirven para asociar meta-información con definiciones.

Una anotación simple tiene la forma `@C` o `@C(a1, .., an)`. Aquí, `C` es un constructor de la clase `C`, que debe extender de la clase `scala.Annotation`. Todos los argumentos de construcción dados `a1, .., an` deben ser expresiones constantes (es decir, expresiones de números literales, strings, clases, enumeraciones de Java y arrays de una dimensión de estos valores).

Una anotación se aplica a la primer definición o declaración que la sigue. Más de una anotación puede preceder una definición o declaración. El orden en que es dado estas anotaciones no importa.

El significado de las anotaciones _depende de la implementación_. En la plataforma de Java, las siguientes anotaciones de Scala tienen un significado estandar.

|           Scala           |           Java           |
|           ------          |          ------          |
|  [`scala.SerialVersionUID`](https://www.scala-lang.org/api/current/scala/SerialVersionUID.html)   |  [`serialVersionUID`](https://java.sun.com/j2se/1.5.0/docs/api/java/io/Serializable.html#navbar_bottom) (campo, variable)  |
|  [`scala.deprecated`](https://www.scala-lang.org/api/current/scala/deprecated.html)   |  [`java.lang.Deprecated`](https://java.sun.com/j2se/1.5.0/docs/api/java/lang/Deprecated.html) |
|  [`scala.inline`](https://www.scala-lang.org/api/current/scala/inline.html) (desde 2.6.0)  |  sin equivalente |
|  [`scala.native`](https://www.scala-lang.org/api/current/scala/native.html) (desde 2.6.0)  |  [`native`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (palabra clave) |
|  [`scala.throws`](https://www.scala-lang.org/api/current/scala/throws.html) |  [`throws`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (palabra clave) |
|  [`scala.transient`](https://www.scala-lang.org/api/current/scala/transient.html) |  [`transient`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (palabra clave) |
|  [`scala.unchecked`](https://www.scala-lang.org/api/current/scala/unchecked.html) (desde 2.4.0) |  sin equivalente |
|  [`scala.volatile`](https://www.scala-lang.org/api/current/scala/volatile.html) |  [`volatile`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (palabra clave) |
|  [`scala.beans.BeanProperty`](https://www.scala-lang.org/api/current/scala/beans/BeanProperty.html) |  [`Design pattern`](https://docs.oracle.com/javase/tutorial/javabeans/writing/properties.html) |

En el siguiente ejemplo agregamos la anotación `throws` a la definición del método `read` de manera de capturar la excepción lanzada en el programa principal de Java.

> El compilador de Java comprueba que un programa contenga manejadores para excepciones comprobadas al analizar cuales de esas excepciones comprobadas pueden llegar a lanzarse en la ejecución de un método o un constructor. Por cada excepción comprobada que sea un posible resultado, la cláusula **throws** debe para ese método o constructor debe ser mencionada en la clase de esa excepción o una de las superclases.
> Ya que Scala no tiene excepciones comprobadas, los métodos en Scala deben ser anotados con una o más anotaciones `throws` para que el código Java pueda capturar las excepciones lanzadas por un método de Scala.

    package examples
    import java.io._
    class Reader(fname: String) {
      private val in = new BufferedReader(new FileReader(fname))
      @throws(classOf[IOException])
      def read() = in.read()
    }

El siguiente programa de Java imprime en consola los contenidos del archivo cuyo nombre es pasado como primer argumento al método `main`.

    package test;
    import examples.Reader;  // Scala class !!
    public class AnnotaTest {
        public static void main(String[] args) {
            try {
                Reader in = new Reader(args[0]);
                int c;
                while ((c = in.read()) != -1) {
                    System.out.print((char) c);
                }
            } catch (java.io.IOException e) {
                System.out.println(e.getMessage());
            }
        }
    }

Si comentamos la anotación `throws` en la clase `Reader` se produce el siguiente error cuando se intenta compilar el programa principal de Java:

    Main.java:11: exception java.io.IOException is never thrown in body of
    corresponding try statement
            } catch (java.io.IOException e) {
              ^
    1 error

### Anotaciones en Java ###

**Nota:** Asegurate de usar la opción `-target:jvm-1.5` con anotaciones de Java.

Java 1.5 introdujo metadata definida por el usuario en la forma de [anotaciones](https://java.sun.com/j2se/1.5.0/docs/guide/language/annotations.html). Una característica fundamental de las anotaciones es que se basan en pares nombre-valor específicos para inicializar sus elementos. Por ejemplo, si necesitamos una anotación para rastrear el código de alguna clase debemos definirlo así:

    @interface Source {
      public String URL();
      public String mail();
    }

Y después utilizarlo de la siguiente manera

    @Source(URL = "https://coders.com/",
            mail = "support@coders.com")
    public class MyClass extends HisClass ...

Una anotación en Scala se asemeja a una invocación a un constructor. Para instanciar una anotación de Java es necesario usar los argumentos nombrados:

    @Source(URL = "https://coders.com/",
            mail = "support@coders.com")
    class MyScalaClass ...

Esta sintaxis es bastante tediosa si la anotación contiene solo un elemento (sin un valor por defecto) por lo tanto, por convención, si el nombre es especificado como `value` puede ser utilizado en Java usando una sintaxis similar a la de los constructores:

    @interface SourceURL {
        public String value();
        public String mail() default "";
    }

Y podemos aplicarlo así:

    @SourceURL("https://coders.com/")
    public class MyClass extends HisClass ...

En este caso, Scala provee la misma posibilidad:

    @SourceURL("https://coders.com/")
    class MyScalaClass ...

El elemento `mail` fue especificado con un valor por defecto (mediante la cláusula `default`) por lo tanto no necesitamos proveer explicitamente un valor para este. De todas maneras, si necesitamos pasarle un valor no podemos mezclar los dos estilos en Java:

    @SourceURL(value = "https://coders.com/",
               mail = "support@coders.com")
    public class MyClass extends HisClass ...

Scala provee más flexibilidad en este caso:

    @SourceURL("https://coders.com/",
               mail = "support@coders.com")
        class MyScalaClass ...
