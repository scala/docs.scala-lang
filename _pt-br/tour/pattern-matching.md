---
layout: tour
title: Correspondência de Padrões
partof: scala-tour

num: 11

next-page: singleton-objects
previous-page: case-classes
language: pt-br
---

_Nota de tradução: A palavra cujo o significado melhor corresponde a palavra `match` em inglês seria `correspondência`. Também podemos entender que `match` é como "coincidir" ou "concordar" com algo._

Scala possui mecanismo de correspondência de padrão embutido. Isso permite realizar o match de qualquer tipo de dados com a política de primeiro match. 
Aqui um pequeno exemplo que mostrar como realizar o match de um número inteiro:

```scala mdoc
object MatchTest1 extends App {
  def matchTest(x: Int): String = x match {
    case 1 => "um"
    case 2 => "dois"
    case _ => "muitos"
  }
  println(matchTest(3))
}
```

O bloco com a declaração `case` define a função que mapeia inteiros para strings. A palavra-chave `match` fornece uma maneira conveniente de aplicar uma função (como a função de correspondência de padrões acima) em um objeto.

Aqui um segundo exemplo no qual o match é realizado em valores de diferentes tipos:

```scala mdoc
object MatchTest2 extends App {
  def matchTest(x: Any): Any = x match {
    case 1 => "um"
    case "dois" => 2
    case y: Int => "scala.Int"
  }
  println(matchTest("dois"))
}
```

O primeiro `case` realiza o match se `x` refere-se a um valor inteiro `1`. O segundo `case` realiza o match se `x` é igual a string `"dois"`. O terceiro `case` é padrão tipado; realiza o match de qualquer valor que seja um inteiro e associa o valor do match de `x` a uma variável `y` do tipo `Int`.

A correspondência de padrões de Scala é mais útil para realizar os matches de tipos algébricos expressados com [classes case](case-classes.html).
Scala também permite a definição de padrões independentemente de classes case, basta utilizar o método `unapply` em um [objeto extrator](extractor-objects.html).
