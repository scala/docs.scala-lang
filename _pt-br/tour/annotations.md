---
layout: tour
title: Anotações
partof: scala-tour

num: 31
next-page: packages-and-imports
previous-page: automatic-closures
language: pt-br
---

Anotações associam meta-informação com definições.

Uma cláusula de anotação simples tem a forma `@C` ou `@C(a1,..., an)`. Aqui, `C` é um construtor de uma classe `C`, que deve estar em conformidade com a classe `scala.Annotation`. Todos os argumentos de construtor fornecidos `a1, .., an` devem ser expressões constantes (isto é, expressões em literais numéricos, strings, literais de classes, enumerações Java e matrizes uni-dimensionais).

Uma cláusula de anotação se aplica à primeira definição ou declaração que a segue. Mais de uma cláusula de anotação pode preceder uma definição e uma declaração. Não importa a ordem em que essas cláusulas são declaradas.

O significado das cláusulas de anotação é _dependente da implementação_. Na plataforma Java, as seguintes anotações Scala têm um significado padrão.

|           Scala           |           Java           |
|           ------          |          ------          |
|  [`scala.SerialVersionUID`](https://www.scala-lang.org/api/current/scala/SerialVersionUID.html)   |  [`serialVersionUID`](https://java.sun.com/j2se/1.5.0/docs/api/java/io/Serializable.html#navbar_bottom) (field)  |
|  [`scala.deprecated`](https://www.scala-lang.org/api/current/scala/deprecated.html)   |  [`java.lang.Deprecated`](https://java.sun.com/j2se/1.5.0/docs/api/java/lang/Deprecated.html) |
|  [`scala.inline`](https://www.scala-lang.org/api/current/scala/inline.html) (desde 2.6.0)  | não há equivalente |
|  [`scala.native`](https://www.scala-lang.org/api/current/scala/native.html) (desde 2.6.0)  |  [`native`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.throws`](https://www.scala-lang.org/api/current/scala/throws.html) |  [`throws`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.transient`](https://www.scala-lang.org/api/current/scala/transient.html) |  [`transient`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.unchecked`](https://www.scala-lang.org/api/current/scala/unchecked.html) (since 2.4.0) |  não há equivalente |
|  [`scala.volatile`](https://www.scala-lang.org/api/current/scala/volatile.html) |  [`volatile`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.beans.BeanProperty`](https://www.scala-lang.org/api/current/scala/beans/BeanProperty.html) |  [`Design pattern`](https://docs.oracle.com/javase/tutorial/javabeans/writing/properties.html) |

No exemplo a seguir, adicionamos a anotação `throws` à definição do método `read` para capturar a exceção lançada no código Java.

> Um compilador Java verifica se um programa contém manipuladores para exceções verificadas analisando quais exceções verificadas podem resultar da execução de um método ou construtor. Para cada exceção verificada que é um resultado possível, a cláusula **throws** para o método ou construtor _deve_ mencionar a classe dessa exceção ou uma das superclasses da classe dessa exceção.
> Como Scala não tem exceções verificadas, os métodos Scala _devem_ ser anotados com uma ou mais anotações `throws`, de forma que o código Java possa capturar exceções lançadas por um método Scala.


Exemplo de classe Scala que lança uma exceção do tipo `IOException`:

```
package examples
import java.io._
class Reader(fname: String) {
  private val in = new BufferedReader(new FileReader(fname))
  @throws(classOf[IOException])
  def read() = in.read()
}
```

O programa Java a seguir imprime o conteúdo do arquivo cujo nome é passado como o primeiro argumento para o método `main`.

```
package test;
import examples.Reader;  // Classe Scala acima declarada!!
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
```

Comentando-se a anotação `throws` na classe `Reader` o compilador produz a seguinte mensagem de erro ao compilar o programa principal Java:

```
Main.java:11: exception java.io.IOException is never thrown in body of
corresponding try statement
        } catch (java.io.IOException e) {
          ^
1 error
```

### Anotações Java ###

**Nota:** Certifique-se de usar a opção `-target: jvm-1.5` com anotações Java.

Java 1.5 introduziu metadados definidos pelo usuário na forma de [anotações](https://java.sun.com/j2se/1.5.0/docs/guide/language/annotations.html). Uma característica chave das anotações é que elas dependem da especificação de pares no formato nome-valor para inicializar seus elementos. Por exemplo, se precisamos de uma anotação para rastrear a origem de alguma classe, podemos defini-la como:

```
@interface Source {
  public String URL();
  public String mail();
}
```

O uso da anotação Source fica da seguinte forma

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
public class MyClass extends HisClass ...
```

A uso de anotações em Scala parece uma invocação de construtor, para instanciar uma anotação Java é preciso usar argumentos nomeados:

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
class MyScalaClass ...
```

Esta sintaxe é bastante tediosa, se a anotação contiver apenas um parâmetro (sem valor padrão), por convenção, se o nome for especificado como `value`, ele pode ser aplicado em Java usando uma sintaxe semelhante a Scala, ou seja parecido com a invocação de um construtor:

```
@interface SourceURL {
    public String value();
    public String mail() default "";
}
```

O uso da anotação SourceURL fica da seguinte forma

```
@SourceURL("https://coders.com/")
public class MyClass extends HisClass ...
```

Neste caso, a Scala oferece a mesma possibilidade

```
@SourceURL("https://coders.com/")
class MyScalaClass ...
```

O elemento `mail` foi especificado com um valor padrão, portanto não precisamos fornecer explicitamente um valor para ele. No entanto, se precisarmos fazer isso, não podemos misturar e combinar os dois estilos em Java:

```
@SourceURL(value = "https://coders.com/",
           mail = "support@coders.com")
public class MyClass extends HisClass ...
```

Scala proporciona mais flexibilidade a respeito disso:

```
@SourceURL("https://coders.com/",
           mail = "support@coders.com")
    class MyScalaClass ...
```
