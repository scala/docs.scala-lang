---
layout: tour
title: Composição de Classes Mixin
partof: scala-tour

num: 5
next-page: higher-order-functions
previous-page: tuples
language: pt-br
---
_Nota de tradução: A palavra `mixin` pode ser traduzida como mescla, porém é preferível utilizar a notação original_

Ao contrário de linguagens que suportam somente _herança simples_, Scala tem uma noção mais abrangente sobre a reutilização de classes. Scala torna possível reutilizar a _nova definição de membros de uma classe_ (por exemplo: o relacionamento delta para com a superclasse) na definição de uma nova classe. Isso é expressado como uma _composição de classe mixin ou mixin-class composition_. Considere a seguinte abstração para iterators.

```scala mdoc
abstract class AbsIterator {
  type T
  def hasNext: Boolean
  def next(): T
}
```

A seguir, considere a classe mixin que estende `AbsIterator` com um método `foreach` que aplica uma dada função para cada elemento retornado pelo iterator. Para definir tal classe que será utilizada como um mixin a palavra-chave `trait` deve ser declarada.

```scala mdoc
trait RichIterator extends AbsIterator {
  def foreach(f: T => Unit) { while (hasNext) f(next()) }
}
```

Aqui uma classes iterator concreta a qual retorna sucessivos caracteres de uma dada string:

```scala mdoc
class StringIterator(s: String) extends AbsIterator {
  type T = Char
  private var i = 0
  def hasNext = i < s.length()
  def next() = { val ch = s charAt i; i += 1; ch }
}
```

Poderíamos combinar a funcionalidade de `StringIterator` e `RichIterator` em uma só classe. Com herança simples e interfaces isso é impossível, pois ambas as classes contém implementações para seus membros. Scala nos ajuda com a sua _composição de classes mixin_. Isso permite que programadores reutilizem o delta de uma definição de uma classe, por exemplo: todas as novas definições não são herdadas. Esse mecanismo torna possível combinar `StringIterator` com `RichIterator`, como pode ser visto no programa teste a seguir, que imprime uma coluna de todos os caracteres de uma dada string.

```scala mdoc
object StringIteratorTest {
  def main(args: Array[String]) {
    class Iter extends StringIterator("Scala") with RichIterator
    val iter = new Iter
    iter foreach println
  }
}
```

A classe `Iter` na função `main` é construída a partir de uma composição dos pais `StringIterator` e `RichIterator` com a palavra-chave `with`. O primeiro pai é chamado de _superclass_ de `Iter`, já o segundo pai (e qualquer outro que venha após) é chamado de _mixin_ ou mescla.
