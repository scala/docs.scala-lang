---
layout: tour
title: Inferência de Tipo Local
partof: scala-tour

num: 28
next-page: operators
previous-page: polymorphic-methods
language: pt-br
---

Scala tem um mecanismo nativo de inferência de tipos que permite ao programador omitir certas anotações. Por exemplo, muitas vezes não é necessário especificar o tipo de uma variável, uma vez que o compilador pode deduzir o tipo a partir da expressão de inicialização da variável. Os tipos de retorno de métodos também podem muitas vezes ser omitidos, uma vez que correspondem ao tipo do corpo do método, que é inferido pelo compilador.

Por exemplo:

```scala mdoc
object InferenceTest1 extends App {
  val x = 1 + 2 * 3         // o tipo de x é Int
  val y = x.toString()      // o tipo de y é String
  def succ(x: Int) = x + 1  // o método succ retorna um valor Int
}
```

Para métodos recursivos, o compilador não é capaz de inferir o tipo de retorno.

Exemplo de um método que não irá compilar por este motivo:

```scala mdoc:fail
object InferenceTest2 {
  def fac(n: Int) = if (n == 0) 1 else n * fac(n - 1)
}
```

Também não é obrigatório especificar os tipos dos parâmetros quando [métodos polimórficos](polymorphic-methods.html) são invocados ou são criadas instâncias de [classes genéricas](generic-classes.html). O compilador Scala irá inferir tais parâmetros que não estão presentes a partir do contexto das chamadas e dos tipos dos parâmetros reais do método/construtor.

Por exemplo:

```
case class MyPair[A, B](x: A, y: B)
object InferenceTest3 extends App {
  def id[T](x: T) = x
  val p = MyPair(1, "scala") // type: MyPair[Int, String]
  val q = id(1)              // type: Int
}
```

As duas últimas linhas deste programa são equivalentes ao seguinte código onde todos os tipos inferidos são declarados explicitamente:

```
val x: MyPair[Int, String] = MyPair[Int, String](1, "scala")
val y: Int = id[Int](1)
```

Em algumas situações, pode ser muito perigoso confiar no mecanismo de inferência de tipos de Scala como mostra o seguinte programa:


```scala mdoc:fail
object InferenceTest4 {
  var obj = null
  obj = new Object()
}
```

Este programa não compila porque o tipo inferido para a variável `obj` é `Null`. Como o único valor desse tipo é `null`, é impossível fazer essa variável se referir a outro valor.
