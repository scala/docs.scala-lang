---
layout: tutorial
title: Anotaciones

disqus: true

tutorial: scala-tour
num: 3
language: es
---

Las anotaciones sirven para asociar meta-información con definiciones.

Una anotación simple tiene la forma `@C` o `@C(a1, .., an)`. Aquí, `C` es un constructor de la clase `C`, que debe extender de la clase `scala.Annotation`. Todos los argumentos de construcción dados `a1, .., an` deben ser expresiones constantes (es decir, expresiones de números literales, strings, clases, enumeraciones de Java y arrays de una dimensión de estos valores).

Una anotación se aplica a la primer definición o declaración que la sigue. Más de una anotación puede preceder una definición o declaración. El orden en que es dado estas anotaciones no importa.

El significado de las anotaciones _depende de la implementación_. En la plataforma de Java, las siguientes anotaciones de Scala tienen un significado estandar.

|           Scala           |           Java           |
|           ------          |          ------          |
|  [`scala.SerialVersionUID`](http://www.scala-lang.org/api/2.9.1/scala/SerialVersionUID.html)   |  [`serialVersionUID`](http://java.sun.com/j2se/1.5.0/docs/api/java/io/Serializable.html#navbar_bottom) (campo, variable)  |
|  [`scala.cloneable`](http://www.scala-lang.org/api/2.9.1/scala/cloneable.html)   |  [`java.lang.Cloneable`](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/Cloneable.html) |
|  [`scala.deprecated`](http://www.scala-lang.org/api/2.9.1/scala/deprecated.html)   |  [`java.lang.Deprecated`](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/Deprecated.html) |
|  [`scala.inline`](http://www.scala-lang.org/api/2.9.1/scala/inline.html) (desde 2.6.0)  |  sin equivalente |
|  [`scala.native`](http://www.scala-lang.org/api/2.9.1/scala/native.html) (desde 2.6.0)  |  [`native`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (palabra clave) |
|  [`scala.remote`](http://www.scala-lang.org/api/2.9.1/scala/remote.html) |  [`java.rmi.Remote`](http://java.sun.com/j2se/1.5.0/docs/api/java/rmi/Remote.html) |
|  [`scala.serializable`](http://www.scala-lang.org/api/2.9.1/index.html#scala.annotation.serializable) |  [`java.io.Serializable`](http://java.sun.com/j2se/1.5.0/docs/api/java/io/Serializable.html) |
|  [`scala.throws`](http://www.scala-lang.org/api/2.9.1/scala/throws.html) |  [`throws`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (palabra clave) |
|  [`scala.transient`](http://www.scala-lang.org/api/2.9.1/scala/transient.html) |  [`transient`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (palabra clave) |
|  [`scala.unchecked`](http://www.scala-lang.org/api/2.9.1/scala/unchecked.html) (desde 2.4.0) |  sin equivalente |
|  [`scala.volatile`](http://www.scala-lang.org/api/2.9.1/scala/volatile.html) |  [`volatile`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (palabra clave) |
|  [`scala.reflect.BeanProperty`](http://www.scala-lang.org/api/2.9.1/scala/reflect/BeanProperty.html) |  [`Design pattern`](http://docs.oracle.com/javase/tutorial/javabeans/writing/properties.html) |

En el siguiente ejemplo agregamos la anotación `throws` a la definición del método `read` de manera de capturar la excepción lanzada en el programa principal de Java.

> El compilador de Java comprueba que un programa contenga manejadores para [excepciones comprobadas](http://docs.oracle.com/javase/specs/jls/se5.0/html/exceptions.html) al analizar cuales de esas excepciones comprobadas pueden llegar a lanzarse en la ejecución de un método o un constructor. Por cada excepción comprobada que sea un posible resultado, la cláusula **throws** debe para ese método o constructor debe ser mencionada en la clase de esa excepción o una de las superclases.
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

Java 1.5 introdujo metadata definida por el usuario en la forma de [anotaciones](http://java.sun.com/j2se/1.5.0/docs/guide/language/annotations.html). Una característica fundamental de las anotaciones es que se basan en pares nombre-valor específicos para inicializar sus elementos. Por ejemplo, si necesitamos una anotación para rastrear el código de alguna clase debemos definirlo así:

    @interface Source {
      public String URL();
      public String mail();
    }

Y después utilizarlo de la siguiente manera

    @Source(URL = "http://coders.com/",
            mail = "support@coders.com")
    public class MyClass extends HisClass ...

Una anotación en Scala aparenta como una invocación a un constructor. Para instanciar una anotación de Java es necesario usar los argumentos nombrados:

    @Source(URL = "http://coders.com/",
            mail = "support@coders.com")
    class MyScalaClass ...

Esta sintaxis es bastante tediosa si la anotación contiene solo un elemento (sin un valor por defecto) por lo tanto, por convención, si el nombre es especificado como `value` puede ser utilizado en Java usando una sintaxis similar a la de los constructores:

    @interface SourceURL {
        public String value();
        public String mail() default "";
    }

Y podemos aplicarlo así:

    @SourceURL("http://coders.com/")
    public class MyClass extends HisClass ...

En este caso, Scala provee la misma posibilidad:

    @SourceURL("http://coders.com/")
    class MyScalaClass ...

El elemento `mail` fue especificado con un valor por defecto (mediante la cláusula `default`) por lo tanto no necesitamos proveer explicitamente un valor para este. De todas maneras, si necesitamos pasarle un valor no podemos mezclar los dos estilos en Java:

    @SourceURL(value = "http://coders.com/",
               mail = "support@coders.com")
    public class MyClass extends HisClass ...

Scala provee más flexibilidad en este caso:

    @SourceURL("http://coders.com/",
               mail = "support@coders.com")
        class MyScalaClass ...

Esta sintaxis extendida es consistente con las anotaciones de .NET y pueden obtenerse las capacidades máximas de estas.
